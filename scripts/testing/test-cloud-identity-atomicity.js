#!/usr/bin/env node

const assert = require('assert')
const Module = require('module')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')

function matches(doc, where) {
  return Object.keys(where).every(key => doc[key] === where[key])
}

function createCollection(docs) {
  return {
    where(where) {
      let skipCount = 0
      let limitCount = null
      const query = {
        orderBy() {
          return query
        },
        skip(value) {
          skipCount = value
          return query
        },
        limit(value) {
          limitCount = value
          return query
        },
        async get() {
          const matched = docs.filter(doc => matches(doc, where))
          const end = limitCount === null ? undefined : skipCount + limitCount
          return { data: matched.slice(skipCount, end) }
        }
      }
      return query
    },
    doc(id) {
      return {
        async get() {
          return { data: docs.find(doc => doc._id === id) }
        }
      }
    },
    async add({ data }) {
      if (docs.some(doc => doc._id === data._id)) {
        const err = new Error('duplicate document id')
        err.code = 'DATABASE_DUPLICATE_KEY'
        throw err
      }
      docs.push({ ...data })
      return { _id: data._id }
    }
  }
}

async function loadCloudFunction(relativePath, fakeCloud) {
  const target = path.join(ROOT, relativePath)
  delete require.cache[require.resolve(target)]
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'wx-server-sdk') return fakeCloud
    return originalLoad.call(this, request, parent, isMain)
  }
  try {
    return require(target).main
  } finally {
    Module._load = originalLoad
  }
}

async function testLoginAtomicity() {
  const users = []
  const fakeCloud = {
    DYNAMIC_CURRENT_ENV: 'test',
    init() {},
    database() {
      return { collection: () => createCollection(users) }
    },
    getWXContext() {
      return { OPENID: 'openid-login-race' }
    }
  }
  const main = await loadCloudFunction(
    'miniapp/cloudfunctions/login/index.js',
    fakeCloud
  )
  const [left, right] = await Promise.all([main({}), main({})])
  assert.strictEqual(left.code, 0)
  assert.strictEqual(right.code, 0)
  assert.strictEqual(users.length, 1, '并发冷登录只能创建一个 users 文档')
  assert.strictEqual(left.user.id, right.user.id)
  assert.deepStrictEqual(
    [left.user.is_new, right.user.is_new].sort(),
    [false, true]
  )
}

async function testSignAtomicity() {
  const records = []
  const fakeCloud = {
    DYNAMIC_CURRENT_ENV: 'test',
    init() {},
    database() {
      return { collection: () => createCollection(records) }
    },
    getWXContext() {
      return { OPENID: 'openid-sign-race' }
    }
  }
  const main = await loadCloudFunction(
    'miniapp/cloudfunctions/sign/index.js',
    fakeCloud
  )
  const [left, right] = await Promise.all([
    main({ action: 'sign' }),
    main({ action: 'sign' })
  ])
  assert.strictEqual(left.code, 0)
  assert.strictEqual(right.code, 0)
  assert.strictEqual(records.length, 1, '并发签到只能创建一个当日文档')
  assert.deepStrictEqual(
    [left.alreadySigned, right.alreadySigned].sort(),
    [false, true]
  )
}

async function main() {
  await testLoginAtomicity()
  await testSignAtomicity()
  console.log('Cloud identity atomicity tests: 2 groups passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
