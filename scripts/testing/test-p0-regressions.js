#!/usr/bin/env node

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Module = require('module')

const ROOT = path.resolve(__dirname, '../..')

function fromRoot(...parts) {
  return path.join(ROOT, ...parts)
}

function clearModule(modulePath) {
  delete require.cache[require.resolve(modulePath)]
}

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

function testPurePolicies() {
  const { canReadPost } = require(fromRoot('miniapp/cloudfunctions/ugc/policy.js'))
  const { validateNote } = require(fromRoot('miniapp/cloudfunctions/collection/validation.js'))

  assert.strictEqual(canReadPost({ _openid: 'owner', isPublic: false }, 'owner'), true)
  assert.strictEqual(canReadPost({ _openid: 'owner', isPublic: true }, 'visitor'), true)
  assert.strictEqual(canReadPost({ _openid: 'owner', isPublic: false }, 'visitor'), false)
  assert.strictEqual(canReadPost({ _openid: 'owner' }, 'visitor'), false)

  assert.strictEqual(validateNote(undefined), null)
  assert.strictEqual(validateNote('可用备注'), null)
  assert.strictEqual(validateNote('x'.repeat(500)), null)
  assert.strictEqual(validateNote('x'.repeat(501)), '备注过长')
  assert.strictEqual(validateNote({ text: '非法类型' }), '备注过长')
}

function testContentDetailRequirePaths() {
  const sourcePath = fromRoot('miniapp/subpackages/detail/content-detail/content-detail.js')
  const source = fs.readFileSync(sourcePath, 'utf8')
  const matches = [...source.matchAll(/require\((['"])(\.[^'"]+)\1\)/g)]

  assert(matches.length > 0, '详情页应至少包含一个本地 require')
  matches.forEach(([, , request]) => {
    const resolved = path.resolve(path.dirname(sourcePath), request)
    assert(
      fs.existsSync(resolved) || fs.existsSync(resolved + '.js') || fs.existsSync(path.join(resolved, 'index.js')),
      `详情页引用不存在: ${request}`
    )
  })
}

function testDeploymentGuideInventory() {
  const cloudRoot = fromRoot('miniapp/cloudfunctions')
  const functionNames = fs.readdirSync(cloudRoot)
    .filter(name => fs.statSync(path.join(cloudRoot, name)).isDirectory())
    .sort()
  const collectionNames = new Set()

  functionNames.forEach(name => {
    const source = fs.readFileSync(path.join(cloudRoot, name, 'index.js'), 'utf8')
    assert(!/detail\s*:\s*err\.message/.test(source), `云函数不应向客户端返回内部错误: ${name}`)
    for (const match of source.matchAll(/db\.collection\((['"])([^'"]+)\1\)/g)) {
      collectionNames.add(match[2])
    }
  })

  assert.strictEqual(functionNames.length, 12, '云函数目录数量应为 12')
  assert.strictEqual(collectionNames.size, 9, '云函数实际引用的数据库集合数量应为 9')

  const guide = fs.readFileSync(fromRoot('docs/product/上线前操作指南.md'), 'utf8')
  assert(guide.includes('全部 12 个云函数'))
  assert(guide.includes('创建 9 个数据库集合'))
  functionNames.forEach(name => assert(guide.includes(`\`${name}\``), `上线指南缺少云函数: ${name}`))
  collectionNames.forEach(name => assert(guide.includes(`\`${name}\``), `上线指南缺少集合: ${name}`))
}

function testSeasonalBoundaries() {
  const seasonal = require(fromRoot('miniapp/utils/seasonal.js'))
  const cases = [
    ['2026-01-01T12:00:00+08:00', '冬至', '小寒', 'winter'],
    ['2026-01-06T12:00:00+08:00', '小寒', '大寒', 'winter'],
    ['2026-01-20T12:00:00+08:00', '大寒', '立春', 'winter'],
    ['2026-02-03T12:00:00+08:00', '大寒', '立春', 'winter'],
    ['2026-02-04T12:00:00+08:00', '立春', '雨水', 'spring'],
    ['2026-07-22T12:00:00+08:00', '小暑', '大暑', 'summer'],
    ['2026-07-23T12:00:00+08:00', '大暑', '立秋', 'summer'],
    ['2026-12-21T12:00:00+08:00', '大雪', '冬至', 'winter'],
    ['2026-12-22T12:00:00+08:00', '冬至', '小寒', 'winter']
  ]

  cases.forEach(([dateText, currentTerm, nextTerm, season]) => {
    const info = seasonal.getSeasonInfo(new Date(dateText))
    assert.strictEqual(info.currentTerm, currentTerm, `${dateText} 当前节气`)
    assert.strictEqual(info.nextTerm, nextTerm, `${dateText} 下一节气`)
    assert.strictEqual(info.key, season, `${dateText} 当前季节`)
  })
}

async function testClientUgcSync() {
  const storage = {}
  const cloudCalls = []
  let cloudResponder = data => ({ code: 0, id: 'cloud-1', client_id: data.post && data.post.id })

  global.wx = {
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    removeStorageSync(key) {
      delete storage[key]
    },
    cloud: {
      callFunction({ data, success, fail }) {
        cloudCalls.push(data)
        try {
          success({ result: cloudResponder(data) })
        } catch (err) {
          fail(err)
        }
      }
    }
  }

  const storePath = fromRoot('miniapp/store/index.js')
  const ugcPath = fromRoot('miniapp/utils/ugc.js')
  clearModule(storePath)
  clearModule(ugcPath)
  const store = require(storePath)
  store.setState({ isLoggedIn: true })
  const ugc = require(ugcPath)

  const created = ugc.savePost({ title: '本地投稿', content: '第一版' })
  await flushPromises()
  assert(created.id.startsWith('ugc_'), '新投稿应使用稳定本地 ID')
  assert.strictEqual(storage.ugc_posts[0].cloudId, 'cloud-1', '云端回包后应记录云文档 ID')
  assert.strictEqual(cloudCalls[0].post.id, created.id)

  ugc.savePost({ id: created.id, title: '本地投稿（更新）' })
  await flushPromises()
  assert.strictEqual(cloudCalls[1].post.cloudId, 'cloud-1', '编辑时应携带已有云文档 ID')

  storage.ugc_posts = [
    {
      id: created.id,
      cloudId: 'cloud-1',
      title: '旧本地副本',
      content: '旧内容',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'ugc-unsynced',
      title: '未同步本地稿',
      content: '必须保留',
      createdAt: '2026-01-02T00:00:00.000Z'
    }
  ]
  cloudResponder = data => {
    assert.strictEqual(data.action, 'getMyPosts')
    return {
      code: 0,
      list: [{
        id: 'cloud-1',
        client_id: created.id,
        title: '云端最新版',
        content: '云端内容',
        domain: 'tea',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-03T00:00:00.000Z'
      }]
    }
  }

  const result = await ugc.syncFromCloud()
  assert.strictEqual(result.synced, true)
  assert.strictEqual(storage.ugc_posts.length, 2, '同步后不应重复同一投稿，也不能丢本地未同步稿')
  assert.strictEqual(storage.ugc_posts.filter(p => p.id === created.id).length, 1)
  assert.strictEqual(storage.ugc_posts.find(p => p.id === created.id).title, '云端最新版')
  assert(storage.ugc_posts.some(p => p.id === 'ugc-unsynced'), '本地未同步稿应保留')

  cloudResponder = data => ({
    code: 0,
    id: data.post.id === 'ugc-unsynced' ? 'cloud-2' : 'cloud-1',
    client_id: data.post.id
  })
  const pushed = await ugc.syncToCloud()
  assert.strictEqual(pushed.successCount, 2, '合并后应能把本地记录回推云端')
  assert.strictEqual(
    storage.ugc_posts.find(p => p.id === 'ugc-unsynced').cloudId,
    'cloud-2',
    '未同步本地稿回推后应记录云端 ID'
  )

  storage.ugc_posts = [
    { id: 'cloud-legacy', title: '旧版云记录的本地副本' },
    { id: 'ugc-local-only', title: '仅本地' }
  ]
  cloudResponder = () => ({
    code: 0,
    list: [{
      id: 'cloud-legacy',
      title: '旧版云记录',
      content: '',
      domain: 'film',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z'
    }]
  })
  await ugc.syncFromCloud()
  assert.strictEqual(storage.ugc_posts.length, 2, '应兼容没有 client_id 的旧云端记录')
  assert.strictEqual(storage.ugc_posts.filter(p => p.id === 'cloud-legacy').length, 1)
}

async function testCloudUgcIdempotencyAndPrivacy() {
  let currentOpenid = 'owner'
  let nextId = 1
  const docs = []

  function matches(doc, where) {
    return Object.keys(where).every(key => doc[key] === where[key])
  }

  function collection() {
    return {
      where(where) {
        const query = {
          limit() {
            return query
          },
          async get() {
            return { data: docs.filter(doc => matches(doc, where)) }
          },
          async remove() {
            const before = docs.length
            for (let i = docs.length - 1; i >= 0; i--) {
              if (matches(docs[i], where)) docs.splice(i, 1)
            }
            return { stats: { removed: before - docs.length } }
          }
        }
        return query
      },
      doc(id) {
        return {
          async get() {
            return { data: docs.find(doc => doc._id === id) }
          },
          async update({ data }) {
            const doc = docs.find(item => item._id === id)
            if (!doc) throw new Error('document not found')
            Object.assign(doc, data)
            return { stats: { updated: 1 } }
          }
        }
      },
      async add({ data }) {
        const id = `cloud-${nextId++}`
        docs.push({ ...data, _id: id, _openid: currentOpenid })
        return { _id: id }
      }
    }
  }

  const fakeDb = {
    command: {},
    collection
  }
  const fakeCloud = {
    DYNAMIC_CURRENT_ENV: 'test',
    init() {},
    database() {
      return fakeDb
    },
    getWXContext() {
      return { OPENID: currentOpenid }
    }
  }

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'wx-server-sdk') return fakeCloud
    return originalLoad.call(this, request, parent, isMain)
  }

  const ugcCloudPath = fromRoot('miniapp/cloudfunctions/ugc/index.js')
  try {
    clearModule(ugcCloudPath)
    const { main } = require(ugcCloudPath)

    const first = await main({
      action: 'save',
      post: { id: 'ugc-stable', title: '第一版', content: '内容', isPublic: false }
    })
    assert.strictEqual(first.code, 0)
    assert.strictEqual(docs.length, 1)
    assert.strictEqual(docs[0].client_id, 'ugc-stable')

    const second = await main({
      action: 'save',
      post: { id: 'ugc-stable', title: '第二版', content: '内容', isPublic: false }
    })
    assert.strictEqual(second.code, 0)
    assert.strictEqual(second.id, first.id)
    assert.strictEqual(docs.length, 1, '同一 client_id 再次保存必须更新而不是新增')
    assert.strictEqual(docs[0].title, '第二版')

    currentOpenid = 'visitor'
    const denied = await main({ action: 'getById', id: first.id })
    assert.strictEqual(denied.code, -1, '非作者不得读取私密投稿')

    currentOpenid = 'owner'
    const mine = await main({ action: 'getById', id: first.id })
    assert.strictEqual(mine.code, 0, '作者可以读取自己的私密投稿')

    docs[0].isPublic = true
    currentOpenid = 'visitor'
    const publicPost = await main({ action: 'getById', id: first.id })
    assert.strictEqual(publicPost.code, 0, '公开投稿允许其他用户读取')

    currentOpenid = 'owner'
    const removed = await main({
      action: 'delete',
      id: 'ugc-stable',
      clientId: 'ugc-stable'
    })
    assert.strictEqual(removed.code, 0)
    assert.strictEqual(docs.length, 0, '没有 cloudId 时也应能按 client_id 删除')
  } finally {
    Module._load = originalLoad
    clearModule(ugcCloudPath)
  }
}

async function main() {
  testPurePolicies()
  testContentDetailRequirePaths()
  testDeploymentGuideInventory()
  testSeasonalBoundaries()
  await testClientUgcSync()
  await testCloudUgcIdempotencyAndPrivacy()
  console.log('P0 regression tests: 6 groups passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
