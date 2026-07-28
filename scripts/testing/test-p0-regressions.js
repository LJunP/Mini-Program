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
  const {
    sanitizePost,
    sanitizePagination,
    sanitizeDomain,
    safeRating
  } = require(fromRoot('miniapp/cloudfunctions/ugc/validation.js'))
  const { validateNote } = require(fromRoot('miniapp/cloudfunctions/collection/validation.js'))
  const { sanitizeEvent } = require(fromRoot('miniapp/cloudfunctions/track/validation.js'))

  assert.strictEqual(canReadPost({ _openid: 'owner', isPublic: false }, 'owner'), true)
  assert.strictEqual(
    canReadPost({ _openid: 'owner', isPublic: true, status: 'approved' }, 'visitor'),
    true
  )
  assert.strictEqual(
    canReadPost({ _openid: 'owner', isPublic: true, status: 'pending' }, 'visitor'),
    false
  )
  assert.strictEqual(canReadPost({ _openid: 'owner', isPublic: false }, 'visitor'), false)
  assert.strictEqual(canReadPost({ _openid: 'owner' }, 'visitor'), false)

  const validPost = sanitizePost({
    id: 'ugc-1',
    title: '  标题  ',
    content: '正文',
    domain: 'tea',
    tags: [' 茶 ', '茶', '春日'],
    images: ['cloud://env/ugc/example.jpg'],
    rating: 5,
    location: ' 杭州 ',
    linkedContent: { refId: 'tea_001', refDomain: 'tea', refTitle: '龙井' },
    isPublic: false,
    authorName: '客户端伪造昵称'
  })
  assert.strictEqual(validPost.error, undefined)
  assert.strictEqual(validPost.post.title, '标题')
  assert.deepStrictEqual(validPost.post.tags, ['茶', '春日'])
  assert.strictEqual('authorName' in validPost.post, false, '服务端不得接收客户端作者名')
  assert.strictEqual(sanitizePost({ domain: 'unknown' }).error, '板块参数非法')
  assert.strictEqual(sanitizePost({ rating: 6 }).error, '评分参数非法')
  assert.strictEqual(sanitizePost({ images: ['wxfile://temp.jpg'] }).error, '图片参数非法')
  assert.strictEqual(sanitizePost({ images: ['https://example.com/image.jpg'] }).error, '图片参数非法')
  assert.strictEqual(sanitizePost({ tags: ['x'.repeat(31)] }).error, '标签参数非法')
  assert.strictEqual(sanitizePagination(0, 50).error, '分页参数非法')
  assert.strictEqual(sanitizePagination(1, 51).error, '分页参数非法')
  assert.strictEqual(sanitizeDomain('all').domain, 'all')
  assert.strictEqual(safeRating(-8), 0)
  assert.strictEqual(safeRating(88), 5)

  assert.strictEqual(validateNote(undefined), null)
  assert.strictEqual(validateNote('可用备注'), null)
  assert.strictEqual(validateNote('x'.repeat(500)), null)
  assert.strictEqual(validateNote('x'.repeat(501)), '备注过长')
  assert.strictEqual(validateNote({ text: '非法类型' }), '备注过长')

  const sanitizedEvent = sanitizeEvent({
    event_name: 'page_view',
    event_params: { source: 'test' },
    page_path: 'pages/index/index',
    openid: 'spoofed',
    _openid: 'spoofed'
  })
  assert.strictEqual(sanitizedEvent.event_name, 'page_view')
  assert.strictEqual(sanitizedEvent.event_params.source, 'test')
  assert.strictEqual('openid' in sanitizedEvent, false)
  assert.strictEqual('_openid' in sanitizedEvent, false)
  assert.strictEqual(sanitizeEvent({ event_name: '' }), null)
  assert.strictEqual(sanitizeEvent([]), null)

  const ugcClientSource = fs.readFileSync(fromRoot('miniapp/utils/ugc.js'), 'utf8')
  const contributeSource = fs.readFileSync(fromRoot('miniapp/pages/contribute/contribute.js'), 'utf8')
  const ugcCloudSource = fs.readFileSync(fromRoot('miniapp/cloudfunctions/ugc/index.js'), 'utf8')
  assert(ugcClientSource.includes('isPublic: post.isPublic === true'))
  assert(ugcClientSource.includes("p.status === 'approved'"))
  assert(contributeSource.includes('isPublic: false'))
  assert(contributeSource.includes('Promise.allSettled(uploadPromises)'), '_uploadImages 必须使用 Promise.allSettled')
  assert(!contributeSource.includes('Promise.all(uploadPromises)'), '_uploadImages 不得使用 Promise.all')
  assert(contributeSource.includes('saveCleanupManifest'), '_uploadImages 必须在清理不完整时保存 cleanup manifest')
  assert(ugcClientSource.includes('function saveCleanupManifest'), 'ugc.js 必须导出 saveCleanupManifest')
  assert(ugcClientSource.includes('function retryCleanupManifests'), 'ugc.js 必须导出 retryCleanupManifests')
  assert(ugcCloudSource.includes('isPublic: post.isPublic === true'))
  assert(ugcCloudSource.includes("require('./validation')"))
  assert(ugcCloudSource.includes("db.collection('users')"))
  assert(!ugcCloudSource.includes('authorName: post.authorName'))
  assert(!ugcCloudSource.includes('updateData.authorName = post.authorName'))

  const authSource = fs.readFileSync(fromRoot('miniapp/utils/auth.js'), 'utf8')
  const silentLoginBody = authSource.match(/function silentLogin\(\)\s*\{([\s\S]*?)\n\}/)
  assert(silentLoginBody)
  assert(silentLoginBody[1].includes('return login()'))
  assert(!silentLoginBody[1].includes('isLoggedIn()'))

  const signSource = fs.readFileSync(fromRoot('miniapp/cloudfunctions/sign/index.js'), 'utf8')
  assert(!signSource.includes("'OPENID:'"))
  assert(!signSource.includes('JSON.stringify(allRecords)'))

  const listSource = fs.readFileSync(fromRoot('miniapp/pages/contribute/list.js'), 'utf8')
  assert(listSource.includes('Math.max(0, Math.min(5'))
  assert(listSource.includes('requestId !== this._communityRequestId'))

  const privacySource = fs.readFileSync(
    fromRoot('miniapp/pages/privacy/privacy.wxml'),
    'utf8'
  )
  assert(privacySource.includes('卸载或删除小程序不会自动删除云端数据'))
  assert(privacySource.includes('您明确选择“公开”'))
  assert(!privacySource.includes('privacy@miaobukeyuan.com'))

  const trackSource = fs.readFileSync(fromRoot('miniapp/cloudfunctions/track/index.js'), 'utf8')
  assert(trackSource.includes("require('./validation')"))
  assert(trackSource.includes('openid: OPENID || null'))
  assert(!trackSource.includes('OPENID || evt.openid'))

  const ttsClientSource = fs.readFileSync(
    fromRoot('miniapp/subpackages/detail/question-detail/question-detail.js'),
    'utf8'
  )
  const ttsCloudSource = fs.readFileSync(fromRoot('miniapp/cloudfunctions/tts/index.js'), 'utf8')
  assert(ttsClientSource.includes("result.reason === 'quota_exhausted'"))
  assert(ttsClientSource.includes("title: quotaExhausted ? '语音服务额度已用完'"))
  assert(!ttsClientSource.includes('合成失败，跳过'))
  assert(ttsCloudSource.includes("reason: quotaExhausted ? 'quota_exhausted'"))

  const retryBarSource = fs.readFileSync(
    fromRoot('miniapp/components/retry-bar/retry-bar.wxml'),
    'utf8'
  )
  assert(retryBarSource.includes('wx:if="{{show}}"'))

  const interviewSource = fs.readFileSync(
    fromRoot('miniapp/pages/study/interview.js'),
    'utf8'
  )
  const interviewDataBlock = interviewSource.match(
    /data:\s*\{([\s\S]*?)\n\s*\},\n\n\s*onLoad/
  )
  assert(interviewDataBlock, '应能识别面试列表 data 定义')
  assert(!interviewDataBlock[1].includes('allList'), '完整 901 题不得进入渲染层 data')
  assert(interviewSource.includes('this._allList = allList'))
  assert(interviewSource.includes('toQuestionCard(question, progressMap)'))
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

function testLicensedMusicPlaybackContract() {
  const dataStore = require(fromRoot('miniapp/utils/data-store.js'))
  const playable = dataStore.music.filter(item => Boolean(item.audioSrc))

  assert.deepStrictEqual(
    playable.map(item => item.id),
    ['music_001', 'music_003', 'music_008', 'music_009'],
    '播放列表只能包含已有真实授权录音的曲目'
  )
  playable.forEach(item => {
    assert(item.audioSrc.startsWith('/assets/audio/'), `${item.id} 应使用私有云音频逻辑路径`)
    assert(item.audioLicense && item.audioLicense.sourceUrl, `${item.id} 缺少来源链接`)
    assert(item.audioLicense.licenseName, `${item.id} 缺少许可名称`)
    assert(item.audioLicense.licenseUrl, `${item.id} 缺少许可链接`)
  })

  const playerSource = fs.readFileSync(
    fromRoot('miniapp/components/audio-player/audio-player.js'),
    'utf8'
  )
  const initAudio = playerSource.match(/_initAudio\(\)\s*\{([\s\S]*?)\n\s*\},\n\n\s*_startAudio/)
  assert(initAudio, '应能识别播放器初始化方法')
  assert(!initAudio[1].includes('_useBackgroundAudio'), '组件挂载时不得自动开始播放')
  assert(playerSource.includes('onTogglePlay()'))
  assert(playerSource.includes('this._startAudio();'), '首次播放必须由用户操作触发')
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

async function testCloudAssetResolver() {
  const calls = []
  const originalDateNow = Date.now
  let now = 1784959000000
  Date.now = () => now
  global.wx = {
    cloud: {
      callFunction({ name, data, success }) {
        assert.strictEqual(name, 'getStudyData')
        assert.strictEqual(data.action, 'getAssetUrls')
        calls.push(data.fileList)
        success({
          result: {
            code: 0,
            fileList: data.fileList.map(fileID => ({
              fileID,
              status: 0,
              tempFileURL: `https://temp.example/${encodeURIComponent(fileID)}`
            }))
          }
        })
      }
    }
  }

  const assetPath = fromRoot('miniapp/utils/asset-url.js')
  clearModule(assetPath)
  const assets = require(assetPath)

  try {
    assert(assets.CLOUD_IMAGE_FILE_ROOT.endsWith('/app-assets/images'))
    assert(assets.CLOUD_AUDIO_FILE_ROOT.endsWith('/app-assets/audio'))
    assert.strictEqual(
      assets.toCloudFileId('/assets/images/tea/longjing.jpg'),
      `${assets.CLOUD_IMAGE_FILE_ROOT}/tea/longjing.jpg`
    )
    assert.strictEqual(
      assets.toCloudFileId('https://example.com/image.jpg'),
      'https://example.com/image.jpg'
    )
    assert.strictEqual(
      assets.toCloudFileId('/assets/audio/liushui.mp3'),
      `${assets.CLOUD_AUDIO_FILE_ROOT}/liushui.mp3`
    )

    const input = Array.from({ length: 51 }, (_, index) => ({
      coverImage: `/assets/images/tea/item-${index}.jpg`,
      untouched: `/assets/images/tea/not-a-cover-${index}.jpg`
    }))
    input.push({
      nested: {
        refCover: '/assets/images/film/reference.jpg',
        audioSrc: '/assets/audio/liushui.mp3'
      }
    })

    const resolved = await assets.resolveAssetTree(input)
    assert.strictEqual(calls.length, 2, '临时地址请求应按 50 个 File ID 分批')
    assert.strictEqual(calls.flat().length, 53)
    assert(resolved[0].coverImage.startsWith('https://temp.example/'))
    assert.strictEqual(
      resolved[0].untouched,
      '/assets/images/tea/not-a-cover-0.jpg',
      '非图片地址字段不得被递归误改'
    )
    assert(resolved[51].nested.refCover.startsWith('https://temp.example/'))
    assert(resolved[51].nested.audioSrc.startsWith('https://temp.example/'))
    assert.strictEqual(input[0].coverImage, '/assets/images/tea/item-0.jpg', '解析过程不得修改原始数据')

    await assets.resolveAssetTree(input.slice(0, 1))
    assert.strictEqual(calls.length, 2, '有效期内应复用临时地址')
    now += assets.TEMP_URL_CACHE_TTL + 1
    await assets.resolveAssetTree(input.slice(0, 1))
    assert.strictEqual(calls.length, 3, '临时地址缓存到期后必须重新签发')

    const cloudSource = fs.readFileSync(
      fromRoot('miniapp/cloudfunctions/getStudyData/index.js'),
      'utf8'
    )
    assert(cloudSource.includes("event.action === 'getAssetUrls'"))
    assert(cloudSource.includes("fileID.startsWith(ASSET_IMAGE_FILE_ROOT)"))
    assert(cloudSource.includes("fileID.startsWith(ASSET_AUDIO_FILE_ROOT)"))
    assert(cloudSource.includes('fileList.length > ASSET_BATCH_LIMIT'))
    assert(cloudSource.includes('/study/study_data.json'))
    assert(cloudSource.includes('cloud.downloadFile({ fileID: STUDY_DATA_FILE_ID })'))
    assert(cloudSource.includes("text.startsWith('{')"))
    assert(cloudSource.includes("event.action === 'getStudyIndex'"))
    assert(cloudSource.includes("event.action === 'getStudyTopics'"))
    assert(cloudSource.includes('topicKeys.length > STUDY_TOPIC_BATCH_LIMIT'))

    const appSource = fs.readFileSync(fromRoot('miniapp/app.js'), 'utf8')
    assert(appSource.includes("action: 'getStudyIndex'"))
    assert(appSource.includes("action: 'getStudyTopics'"))
    assert(appSource.includes('const batchSize = 3'))
  } finally {
    Date.now = originalDateNow
  }
}

async function testClientUgcSync() {
  const storage = {
    user_info: { id: 'user-1', nickname: '真实用户' },
    cloud_login_token: 'token'
  }
  const scopedKey = 'ugc_posts:user-1'
  const cloudCalls = []
  let cloudResponder = data => ({
    code: 0,
    id: 'cloud-1',
    client_id: data.post && data.post.id,
    updated_at: '2026-01-01T00:00:00.000Z'
  })

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
  ugc.activateUserScope('user-1', 'user-1')

  const created = ugc.savePost({ title: '本地投稿', content: '第一版' })
  await flushPromises()
  assert(created.id.startsWith('ugc_'), '新投稿应使用稳定本地 ID')
  assert.strictEqual(storage[scopedKey][0].cloudId, 'cloud-1', '云端回包后应记录云文档 ID')
  assert.strictEqual(storage[scopedKey][0].dirty, false, '云端确认后应清除 dirty')
  assert.strictEqual(cloudCalls[0].post.id, created.id)
  assert.strictEqual('authorName' in cloudCalls[0].post, false, '客户端不得上传作者名')

  ugc.savePost({ id: created.id, title: '本地投稿（更新）' })
  await flushPromises()
  assert.strictEqual(cloudCalls[1].post.cloudId, 'cloud-1', '编辑时应携带已有云文档 ID')

  storage[scopedKey] = [
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
  assert.strictEqual(storage[scopedKey].length, 2, '同步后不应重复同一投稿，也不能丢本地未同步稿')
  assert.strictEqual(storage[scopedKey].filter(p => p.id === created.id).length, 1)
  assert.strictEqual(storage[scopedKey].find(p => p.id === created.id).title, '云端最新版')
  assert(storage[scopedKey].some(p => p.id === 'ugc-unsynced'), '本地未同步稿应保留')

  cloudResponder = data => ({
    code: 0,
    id: data.post.id === 'ugc-unsynced' ? 'cloud-2' : 'cloud-1',
    client_id: data.post.id,
    updated_at: '2026-01-04T00:00:00.000Z'
  })
  const pushed = await ugc.syncToCloud()
  assert.strictEqual(pushed.successCount, 1, '只允许回推 dirty 或从未上云的本地记录')
  assert.strictEqual(
    storage[scopedKey].find(p => p.id === 'ugc-unsynced').cloudId,
    'cloud-2',
    '未同步本地稿回推后应记录云端 ID'
  )

  storage[scopedKey] = [
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
  assert.strictEqual(storage[scopedKey].length, 2, '应兼容没有 client_id 的旧云端记录')
  assert.strictEqual(storage[scopedKey].filter(p => p.id === 'cloud-legacy').length, 1)

  // 缺少 base 或 base 已落后的 dirty 副本必须隔离，云端当前版本作为可见基线。
  storage[scopedKey] = [
    {
      id: 'ugc-missing-base',
      cloudId: 'cloud-missing-base',
      title: '缺 base 的本地修改',
      dirty: true,
      dirtyFields: ['title']
    },
    {
      id: 'ugc-stale-base',
      cloudId: 'cloud-stale-base',
      title: '旧 base 的本地修改',
      dirty: true,
      dirtyFields: ['title'],
      cloudUpdatedAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'ugc-missing-cloud',
      cloudId: 'cloud-missing-cloud',
      title: '云端已不存在的旧脏副本',
      dirty: true,
      dirtyFields: ['title'],
      cloudUpdatedAt: '2026-01-01T00:00:00.000Z'
    }
  ]
  cloudResponder = () => ({
    code: 0,
    list: [
      {
        id: 'cloud-missing-base',
        client_id: 'ugc-missing-base',
        title: '缺 base 的云端当前版',
        domain: 'tea',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-06T00:00:00.000Z'
      },
      {
        id: 'cloud-stale-base',
        client_id: 'ugc-stale-base',
        title: '旧 base 的云端当前版',
        domain: 'tea',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-07T00:00:00.000Z'
      }
    ]
  })
  const conflictSync = await ugc.syncFromCloud()
  assert.strictEqual(conflictSync.synced, true)
  assert.strictEqual(conflictSync.conflictsQuarantined, 3)
  assert.strictEqual(
    storage[scopedKey].find(p => p.id === 'ugc-missing-base').title,
    '缺 base 的云端当前版'
  )
  assert.strictEqual(
    storage[scopedKey].find(p => p.id === 'ugc-stale-base').title,
    '旧 base 的云端当前版'
  )
  assert.strictEqual(
    storage[scopedKey].some(p => p.id === 'ugc-missing-cloud'),
    false,
    '云端已不存在的旧 dirty 记录不得被自动复活'
  )
  assert(storage[scopedKey].every(p => p.dirty !== true))
  const quarantined = ugc.getQuarantinedConflicts()
  assert.strictEqual(quarantined.length, 3)
  assert.deepStrictEqual(
    new Set(quarantined.map(item => item.reason)),
    new Set(['missing_local_base', 'stale_local_base', 'missing_cloud_record'])
  )
  assert(quarantined.every(item => item.localPost.dirty === true))
  const callsBeforeConflictPush = cloudCalls.length
  const conflictPush = await ugc.syncToCloud()
  assert.strictEqual(conflictPush.total, 0, '隔离副本不得自动回推')
  assert.strictEqual(cloudCalls.length, callsBeforeConflictPush)

  // 云端删除墓碑必须压过另一设备遗留的 dirty 副本，禁止被回推复活。
  storage[scopedKey] = [{
    id: 'ugc-deleted-elsewhere',
    cloudId: 'cloud-deleted-elsewhere',
    title: '离线脏副本',
    dirty: true,
    dirtyFields: ['title'],
    cloudUpdatedAt: '2026-01-01T00:00:00.000Z'
  }]
  cloudResponder = () => ({
    code: 0,
    list: [{
      id: 'cloud-deleted-elsewhere',
      client_id: 'ugc-deleted-elsewhere',
      status: 'deleted',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-05T00:00:00.000Z'
    }],
    server_build: 'test-build'
  })
  const tombstoneSync = await ugc.syncFromCloud()
  assert.strictEqual(tombstoneSync.synced, true)
  assert.strictEqual(tombstoneSync.serverBuild, 'test-build')
  assert.strictEqual(storage[scopedKey].length, 0, '删除墓碑必须移除离线 dirty 副本')

  // 公开状态没有得到云端确认时，不能显示为已经公开。
  storage[scopedKey] = []
  cloudResponder = () => ({ code: -1, message: '数据库不可用' })
  let saveError = null
  try {
    await ugc.savePostConfirmed({
      title: '待公开',
      content: '内容',
      isPublic: true
    })
  } catch (err) {
    saveError = err
  }
  assert(saveError, '云端失败必须拒绝 confirmed save')
  assert.strictEqual(saveError.privacyStateUnchanged, true)
  assert.strictEqual(storage[scopedKey][0].isPublic, false)
  assert.strictEqual(storage[scopedKey][0].dirty, true)

  // 云端稿删除失败时，本地副本必须保留。
  storage[scopedKey] = [{
    id: 'ugc-delete',
    cloudId: 'cloud-delete',
    title: '不能假删除',
    isPublic: true,
    dirty: false
  }]
  let deleteFailed = false
  try {
    await ugc.deletePostConfirmed('ugc-delete')
  } catch (err) {
    deleteFailed = true
  }
  assert.strictEqual(deleteFailed, true)
  assert.strictEqual(storage[scopedKey].length, 1)

  // 身份未完成云端验证时，新公开稿必须降为私密，且不得调用云函数。
  ugc.deactivateUserScope()
  const callsBeforeUnverifiedSave = cloudCalls.length
  let unverifiedError = null
  try {
    await ugc.savePostConfirmed({
      title: '身份未确认',
      content: '不能自动公开',
      isPublic: true
    })
  } catch (err) {
    unverifiedError = err
  }
  assert(unverifiedError)
  assert.strictEqual(unverifiedError.code, 'not_logged_in')
  assert.strictEqual(unverifiedError.privacyStateUnchanged, true)
  assert.strictEqual(storage['ugc_posts:anonymous'][0].isPublic, false)
  assert.strictEqual(cloudCalls.length, callsBeforeUnverifiedSave)

  // 全局旧缓存归属不明时必须隔离；匿名新稿只迁入当前已验证账号。
  storage.ugc_posts = [{ id: 'legacy-unknown', title: '归属不明' }]
  storage['ugc_posts:anonymous'].push({ id: 'anonymous-new', title: '登录前新稿' })
  const scopeResult = ugc.activateUserScope('user-2', null)
  assert.strictEqual(scopeResult.quarantinedLegacy, 1)
  assert.strictEqual(storage['ugc_posts:legacy-unassigned'][0].id, 'legacy-unknown')
  assert(storage['ugc_posts:user-2'].some(post => post.id === 'anonymous-new'))
  assert.strictEqual(
    storage['ugc_posts:user-2'].find(post => post.title === '身份未确认').isPublic,
    false
  )
  assert.strictEqual(storage[scopedKey].length, 1, '账号 1 的缓存不得迁入账号 2')
}

async function testCloudUgcIdempotencyAndPrivacy() {
  let currentOpenid = 'owner'
  let nextId = 1
  const docs = []
  const userDocs = [{ _id: 'user-owner', _openid: 'owner', nickname: '真实作者' }]
  const deletedFiles = []
  const failedDeleteFiles = new Set()
  let transactionTail = Promise.resolve()
  let pausedDelete = null

  function pauseDeleteFor(fileId) {
    let markStarted
    let releaseDelete
    const started = new Promise(resolve => {
      markStarted = resolve
    })
    const released = new Promise(resolve => {
      releaseDelete = resolve
    })
    pausedDelete = { fileId, markStarted, released }
    return { started, release: releaseDelete }
  }

  function matches(doc, where) {
    return Object.keys(where).every(key => doc[key] === where[key])
  }

  function collection(name) {
    const targetDocs = name === 'users' ? userDocs : docs
    return {
      where(where) {
        let skipCount = 0
        let limitCount = null
        const query = {
          limit(value) {
            limitCount = value
            return query
          },
          skip(value) {
            skipCount = value
            return query
          },
          orderBy() {
            return query
          },
          async get() {
            const matched = targetDocs.filter(doc => matches(doc, where))
            const effectiveLimit = limitCount === null ? 100 : limitCount
            const end = skipCount + effectiveLimit
            return { data: matched.slice(skipCount, end) }
          },
          async count() {
            return { total: targetDocs.filter(doc => matches(doc, where)).length }
          },
          async remove() {
            const before = targetDocs.length
            for (let i = targetDocs.length - 1; i >= 0; i--) {
              if (matches(targetDocs[i], where)) targetDocs.splice(i, 1)
            }
            return { stats: { removed: before - targetDocs.length } }
          },
          async update({ data }) {
            let updated = 0
            targetDocs.forEach(doc => {
              if (matches(doc, where)) {
                Object.assign(doc, data)
                updated++
              }
            })
            return { stats: { updated } }
          }
        }
        return query
      },
      doc(id) {
        return {
          async get() {
            return { data: targetDocs.find(doc => doc._id === id) }
          },
          async update({ data }) {
            const doc = targetDocs.find(item => item._id === id)
            if (!doc) throw new Error('document not found')
            Object.assign(doc, data)
            return { stats: { updated: 1 } }
          },
          async set({ data }) {
            const existingIndex = targetDocs.findIndex(item => item._id === id)
            const next = { ...data, _id: id }
            if (existingIndex >= 0) targetDocs[existingIndex] = next
            else targetDocs.push(next)
            return { stats: { created: existingIndex >= 0 ? 0 : 1 } }
          }
        }
      },
      async add({ data }) {
        const id = data._id || `cloud-${nextId++}`
        if (targetDocs.some(doc => doc._id === id)) {
          const err = new Error('duplicate document id')
          err.code = 'DATABASE_DUPLICATE_KEY'
          throw err
        }
        targetDocs.push({
          ...data,
          _id: id,
          _openid: data._openid || currentOpenid
        })
        return { _id: id }
      }
    }
  }

  const fakeDb = {
    command: {},
    runTransaction(handler) {
      const run = transactionTail.then(() => handler({ collection }))
      transactionTail = run.catch(() => {})
      return run
    },
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
    },
    async deleteFile({ fileList }) {
      if (pausedDelete && fileList.includes(pausedDelete.fileId)) {
        const gate = pausedDelete
        gate.markStarted()
        await gate.released
        pausedDelete = null
      }
      deletedFiles.push(...fileList)
      return {
        fileList: fileList.map(fileID => ({
          fileID,
          status: failedDeleteFiles.has(fileID) ? -1 : 0,
          errMsg: failedDeleteFiles.has(fileID) ? 'delete failed' : 'ok'
        }))
      }
    },
    async getTempFileURL({ fileList }) {
      return {
        fileList: fileList.map(fileID => ({
          fileID,
          status: 0,
          tempFileURL: `https://ugc.example/${encodeURIComponent(fileID)}`
        }))
      }
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
    assert.strictEqual(docs[0].authorName, '真实作者')

    const missingVersion = await main({
      action: 'save',
      post: {
        id: 'ugc-stable',
        title: '不得覆盖',
        isPublic: false
      }
    })
    assert.strictEqual(missingVersion.code, -2)
    assert.strictEqual(missingVersion.version_required, true)
    assert.strictEqual(docs[0].title, '第一版')

    const firstUpdatedAt = docs[0].updated_at
    delete docs[0].updated_at
    const legacyNoChange = await main({
      action: 'save',
      post: {
        id: 'ugc-stable',
        title: '第一版',
        content: '内容',
        isPublic: false
      }
    })
    assert.strictEqual(legacyNoChange.code, 0)
    assert.strictEqual(legacyNoChange.no_change, true)
    assert.strictEqual(legacyNoChange.migration_required, true)
    assert.strictEqual(legacyNoChange.updated_at, '')

    const legacyMutation = await main({
      action: 'save',
      post: {
        id: 'ugc-stable',
        title: '历史记录不得直接覆盖',
        baseUpdatedAt: firstUpdatedAt
      }
    })
    assert.strictEqual(legacyMutation.code, -2)
    assert.strictEqual(legacyMutation.version_required, true)
    assert.strictEqual(legacyMutation.migration_required, true)
    assert.strictEqual(docs[0].title, '第一版')

    const legacyDelete = await main({
      action: 'delete',
      id: first.id,
      clientId: 'ugc-stable',
      baseUpdatedAt: firstUpdatedAt
    })
    assert.strictEqual(legacyDelete.code, -2)
    assert.strictEqual(legacyDelete.version_required, true)
    assert.strictEqual(legacyDelete.migration_required, true)
    assert.notStrictEqual(docs[0].status, 'deleting')
    docs[0].updated_at = firstUpdatedAt

    const second = await main({
      action: 'save',
      post: {
        id: 'ugc-stable',
        title: '第二版',
        content: '内容',
        isPublic: false,
        baseUpdatedAt: first.updated_at,
        authorName: '客户端伪造作者'
      }
    })
    assert.strictEqual(second.code, 0)
    assert.strictEqual(second.id, first.id)
    assert.strictEqual(docs.length, 1, '同一 client_id 再次保存必须更新而不是新增')
    assert.strictEqual(docs[0].title, '第二版')
    assert.strictEqual(docs[0].authorName, '真实作者', '作者名只能来自服务端用户资料')

    const submittedForReview = await main({
      action: 'save',
      post: {
        id: 'ugc-stable',
        isPublic: true,
        baseUpdatedAt: second.updated_at
      }
    })
    assert.strictEqual(submittedForReview.code, 0)
    assert.strictEqual(submittedForReview.status, 'pending')
    assert.strictEqual(docs[0].status, 'pending', '公开投稿必须先进入待审核状态')

    const invalidRating = await main({
      action: 'save',
      post: { title: '非法评分', rating: 6 }
    })
    assert.strictEqual(invalidRating.code, -1)
    assert.strictEqual(invalidRating.message, '评分参数非法')

    const foreignImage = await main({
      action: 'save',
      post: {
        title: '越权图片',
        images: ['cloud://env/ugc/user-victim/private.jpg']
      }
    })
    assert.strictEqual(foreignImage.code, -1)
    assert.strictEqual(foreignImage.message, '图片归属校验失败')

    currentOpenid = 'visitor'
    const denied = await main({ action: 'getById', id: first.id })
    assert.strictEqual(denied.code, -1, '非作者不得读取待审核投稿')
    const pendingFeed = await main({ action: 'getCommunityFeed' })
    assert.strictEqual(pendingFeed.code, 0)
    assert.strictEqual(pendingFeed.list.length, 0, '待审核投稿不得进入社区 Feed')

    currentOpenid = 'owner'
    const mine = await main({ action: 'getById', id: first.id })
    assert.strictEqual(mine.code, 0, '作者可以读取自己的待审核投稿')

    docs[0].status = 'approved'
    docs[0].images = [
      'cloud://env/ugc/user-owner/owned.jpg',
      'cloud://env/ugc/user-owner/already-deleted.jpg',
      'cloud://env/ugc/user-owner/shared.jpg'
    ]
    currentOpenid = 'visitor'
    const approvedFeed = await main({ action: 'getCommunityFeed' })
    assert.strictEqual(approvedFeed.code, 0)
    assert.strictEqual(approvedFeed.list.length, 1, '审核通过后才可进入社区 Feed')
    const publicPost = await main({ action: 'getById', id: first.id })
    assert.strictEqual(publicPost.code, 0, '公开投稿允许其他用户读取')
    assert(publicPost.post.images[0].startsWith('https://ugc.example/'))

    currentOpenid = 'owner'
    docs.push({
      _id: 'shared-holder',
      _openid: 'owner',
      client_id: 'shared-holder',
      title: '仍引用同一图片的投稿',
      domain: 'tea',
      content: '保留共享图片',
      tags: [],
      images: ['cloud://env/ugc/user-owner/shared.jpg'],
      status: 'private',
      isPublic: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z'
    })
    failedDeleteFiles.add('cloud://env/ugc/user-owner/owned.jpg')
    const cleanupPending = await main({
      action: 'delete',
      id: 'ugc-stable',
      clientId: 'ugc-stable',
      baseUpdatedAt: submittedForReview.updated_at
    })
    assert.strictEqual(cleanupPending.code, -2)
    assert.strictEqual(cleanupPending.cleanup_pending, true)
    assert.strictEqual(docs[0].status, 'deleting')
    assert.deepStrictEqual(
      docs[0].media_cleanup_pending,
      ['cloud://env/ugc/user-owner/owned.jpg'],
      '单文件删除失败必须保留在清理队列'
    )
    assert.deepStrictEqual(
      docs[0].images,
      ['cloud://env/ugc/user-owner/owned.jpg'],
      '已成功删除的文件必须从 deleting 记录移除，重试时不能再次请求删除'
    )

    const claimedImageReuse = await main({
      action: 'save',
      post: {
        id: 'must-not-reuse-cleanup-image',
        title: '不得复用清理中的图片',
        content: '清理 claim 建立后必须拒绝',
        images: ['cloud://env/ugc/user-owner/owned.jpg'],
        isPublic: false
      }
    })
    assert.strictEqual(claimedImageReuse.code, -3)
    assert.strictEqual(claimedImageReuse.image_claimed, true)
    assert.strictEqual(
      docs.some(doc => doc.client_id === 'must-not-reuse-cleanup-image'),
      false,
      '清理 claim 中的 File ID 不得被新投稿复用'
    )

    failedDeleteFiles.clear()
    const removed = await main({
      action: 'delete',
      id: 'ugc-stable',
      clientId: 'ugc-stable',
      baseUpdatedAt: cleanupPending.updated_at
    })
    assert.strictEqual(removed.code, 0)
    assert.strictEqual(docs.length, 2, '删除后必须保留最小墓碑，且不得破坏其他投稿')
    assert.strictEqual(docs[0].status, 'deleted')
    assert.strictEqual(docs[0].content, '')
    assert.deepStrictEqual(docs[0].images, [])
    assert.deepStrictEqual(deletedFiles, [
      'cloud://env/ugc/user-owner/owned.jpg',
      'cloud://env/ugc/user-owner/already-deleted.jpg',
      'cloud://env/ugc/user-owner/owned.jpg'
    ])
    assert.deepStrictEqual(
      docs[1].images,
      ['cloud://env/ugc/user-owner/shared.jpg'],
      '仍被其他投稿引用的 File ID 不得删除'
    )
    const activeImageReuse = await main({
      action: 'save',
      post: {
        id: 'must-not-reuse-active-image',
        title: '不得跨帖复用图片',
        content: '活动投稿已占用该 File ID',
        images: ['cloud://env/ugc/user-owner/shared.jpg'],
        isPublic: false
      }
    })
    assert.strictEqual(activeImageReuse.code, -3)
    assert.strictEqual(activeImageReuse.image_claimed, true)
    assert.strictEqual(
      docs.some(doc => doc.client_id === 'must-not-reuse-active-image'),
      false
    )

    const cleanupRaceFile = 'cloud://env/ugc/user-owner/cleanup-race.jpg'
    const cleanupRacePost = await main({
      action: 'save',
      post: {
        id: 'ugc-cleanup-race-source',
        title: '并发清理源',
        content: '建立清理 claim',
        images: [cleanupRaceFile],
        isPublic: false
      }
    })
    assert.strictEqual(cleanupRacePost.code, 0)
    failedDeleteFiles.add(cleanupRaceFile)
    const deleteGate = pauseDeleteFor(cleanupRaceFile)
    const cleanupRaceDelete = main({
      action: 'delete',
      id: cleanupRacePost.id,
      clientId: cleanupRacePost.client_id,
      baseUpdatedAt: cleanupRacePost.updated_at
    })
    await deleteGate.started
    const cleanupRaceReuse = main({
      action: 'save',
      post: {
        id: 'ugc-cleanup-race-reuse',
        title: '不得抢占清理图片',
        content: '并发 save 必须在 claim 后失败',
        images: [cleanupRaceFile],
        isPublic: false
      }
    })
    deleteGate.release()
    const [cleanupRaceDeleteResult, cleanupRaceReuseResult] = await Promise.all([
      cleanupRaceDelete,
      cleanupRaceReuse
    ])
    assert.strictEqual(cleanupRaceDeleteResult.code, -2)
    assert.strictEqual(cleanupRaceDeleteResult.cleanup_pending, true)
    assert.strictEqual(cleanupRaceReuseResult.code, -3)
    assert.strictEqual(cleanupRaceReuseResult.image_claimed, true)
    assert.strictEqual(
      docs.some(doc => doc.client_id === 'ugc-cleanup-race-reuse'),
      false,
      '清理 claim 建立后的并发 save 不得复用 File ID'
    )
    failedDeleteFiles.delete(cleanupRaceFile)

    const samePayload = {
      id: 'ugc-concurrent-same',
      title: '并发同载荷',
      content: '只能创建一次',
      isPublic: false
    }
    const sameResults = await Promise.all([
      main({ action: 'save', post: samePayload }),
      main({ action: 'save', post: samePayload })
    ])
    assert(sameResults.every(result => result.code === 0))
    assert.strictEqual(
      docs.filter(doc => doc.client_id === samePayload.id).length,
      1,
      '同一 client_id 并发同载荷只能创建一个文档'
    )

    const conflictResults = await Promise.all([
      main({
        action: 'save',
        post: {
          id: 'ugc-concurrent-conflict',
          title: '并发版本甲',
          content: '甲',
          isPublic: false
        }
      }),
      main({
        action: 'save',
        post: {
          id: 'ugc-concurrent-conflict',
          title: '并发版本乙',
          content: '乙',
          isPublic: false
        }
      })
    ])
    assert.deepStrictEqual(
      conflictResults.map(result => result.code).sort((a, b) => a - b),
      [-2, 0],
      '同一 client_id 并发不同载荷必须一成功一冲突'
    )
    assert.strictEqual(
      docs.filter(doc => doc.client_id === 'ugc-concurrent-conflict').length,
      1,
      '并发冲突不得产生重复文档'
    )

    for (let index = 0; index < 150; index++) {
      docs.push({
        _id: `stats-${index}`,
        _openid: 'owner',
        client_id: `stats-${index}`,
        title: `统计投稿${index}`,
        domain: index % 2 === 0 ? 'tea' : 'music',
        content: '',
        tags: [],
        images: [],
        status: 'private',
        isPublic: false,
        created_at: `2026-02-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`,
        updated_at: `2026-02-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`
      })
    }
    const statsResult = await main({ action: 'getStats' })
    const activeOwnerPosts = docs.filter(doc => (
      doc._openid === 'owner' && doc.status !== 'deleted'
    ))
    assert.strictEqual(statsResult.code, 0)
    assert.strictEqual(
      statsResult.stats.total,
      activeOwnerPosts.length,
      '统计必须安全分页读取超过 100 条投稿'
    )
    assert.strictEqual(
      statsResult.stats.byDomain.tea,
      activeOwnerPosts.filter(doc => doc.domain === 'tea').length
    )
  } finally {
    Module._load = originalLoad
    clearModule(ugcCloudPath)
  }
}

async function testAuthVerificationIsolation() {
  const storage = {
    user_info: { id: 'user-a', nickname: '账号A' },
    cloud_login_token: 'stale-token',
    user_points: 88,
    browse_history: [{ domain: 'tea', refId: 'a-history' }],
    daily_elegance_checkin: ['2026-07-28'],
    fengya_collections: [{ target_domain: 'tea', target_ref_id: 'a-favorite' }],
    'ugc_posts:user-a': [{ id: 'a-private', title: 'A的私密稿', isPublic: false }]
  }
  let pendingCall = null
  let failRemoveKey = null

  global.wx = {
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    removeStorageSync(key) {
      if (key === failRemoveKey) {
        throw new Error('simulated storage removal failure')
      }
      delete storage[key]
    },
    getStorageInfoSync() {
      return { keys: Object.keys(storage) }
    },
    cloud: {
      callFunction(options) {
        pendingCall = options
      }
    }
  }

  const authPath = fromRoot('miniapp/utils/auth.js')
  const ugcPath = fromRoot('miniapp/utils/ugc.js')
  const accountScopePath = fromRoot('miniapp/utils/account-scope.js')
  clearModule(authPath)
  clearModule(ugcPath)
  clearModule(accountScopePath)
  const auth = require(authPath)
  const ugc = require(ugcPath)
  const accountScope = require(accountScopePath)

  const failedLogin = auth.silentLogin().then(
    () => null,
    err => err
  )
  assert(pendingCall, '静默登录必须调用云函数确认身份')
  assert.strictEqual(auth.isLoggedIn(), false, '验证窗口不得沿用旧 token')
  assert.strictEqual(auth.getUserInfo(), null, '验证窗口不得暴露旧账号资料')
  assert.deepStrictEqual(ugc.getAllPosts(), [], '验证窗口不得读取旧账号 UGC')
  assert.strictEqual(storage.user_points, undefined, '验证窗口不得读取旧账号积分')
  assert.strictEqual(storage.browse_history, undefined, '验证窗口不得读取旧账号足迹')
  assert.deepStrictEqual(
    storage['account_snapshot:user-a'].daily_elegance_checkin,
    ['2026-07-28'],
    '旧账号本地资产必须先保存到账号快照'
  )
  pendingCall.fail(new Error('network unavailable'))
  const loginError = await failedLogin
  assert(loginError)
  assert.strictEqual(storage.cloud_login_token, undefined)
  assert.strictEqual(storage.user_info, undefined)
  assert.strictEqual(storage['ugc_posts:user-a'].length, 1, '登录失败不得破坏 A 的隔离数据')

  pendingCall = null
  const verifiedLogin = auth.login()
  assert(pendingCall)
  pendingCall.success({
    result: {
      code: 0,
      user: { id: 'user-b', nickname: '账号B' }
    }
  })
  await verifiedLogin
  assert.strictEqual(auth.isLoggedIn(), true)
  assert.strictEqual(auth.getUserInfo().id, 'user-b')
  assert.deepStrictEqual(ugc.getAllPosts(), [], 'B 登录后不得看到 A 的投稿')
  assert.strictEqual(storage.user_points, undefined, 'B 不得继承 A 的积分')
  assert.strictEqual(storage.browse_history, undefined, 'B 不得继承 A 的足迹')
  assert.strictEqual(storage.daily_elegance_checkin, undefined, 'B 不得继承 A 的签到')
  assert.strictEqual(storage.fengya_collections, undefined, 'B 不得继承 A 的收藏')
  assert.strictEqual(storage['ugc_posts:user-a'].length, 1)

  storage.user_points = 5
  storage.browse_history = [{ domain: 'film', refId: 'b-history' }]
  auth.logout()
  assert.strictEqual(storage.user_points, undefined)
  assert.strictEqual(storage['account_snapshot:user-b'].user_points, 5)

  pendingCall = null
  const reloginA = auth.login()
  assert(pendingCall)
  pendingCall.success({
    result: {
      code: 0,
      user: { id: 'user-a', nickname: '账号A' }
    }
  })
  await reloginA
  assert.strictEqual(storage.user_points, 88, 'A 重新登录应恢复自己的积分')
  assert.deepStrictEqual(
    storage.browse_history,
    [{ domain: 'tea', refId: 'a-history' }],
    'A 重新登录应恢复自己的足迹'
  )
  assert.deepStrictEqual(storage.daily_elegance_checkin, ['2026-07-28'])
  assert.deepStrictEqual(
    storage.fengya_collections,
    [{ target_domain: 'tea', target_ref_id: 'a-favorite' }]
  )

  storage.user_points = 91
  failRemoveKey = 'user_points'
  assert.throws(
    () => auth.logout(),
    /账号本地数据清除失败/,
    '本地数据未能完整清除时必须中止退出，不能进入可能串号的未登录态'
  )
  assert.strictEqual(auth.isLoggedIn(), true, '清除失败时必须保留当前登录态')
  assert.strictEqual(auth.getUserInfo().id, 'user-a')
  assert.strictEqual(storage.user_points, 91, '清除中途失败后必须恢复完整快照')

  failRemoveKey = null
  auth.logout()
  storage.user_points = 7
  accountScope.suspendUserScope('user/特殊账号')
  const encodedScopeKey = `account_snapshot:${encodeURIComponent('user/特殊账号')}`
  assert.strictEqual(storage[encodedScopeKey].user_points, 7)
  accountScope.activateUserScope('user/特殊账号')
  assert.strictEqual(
    accountScope.getActiveUserId(),
    'user/特殊账号',
    '活动账号必须保留原始 ID，避免退出时重复编码到不同快照'
  )
  assert.strictEqual(storage.user_points, 7)
}

async function main() {
  testPurePolicies()
  testContentDetailRequirePaths()
  testLicensedMusicPlaybackContract()
  testDeploymentGuideInventory()
  testSeasonalBoundaries()
  await testCloudAssetResolver()
  await testClientUgcSync()
  await testCloudUgcIdempotencyAndPrivacy()
  await testAuthVerificationIsolation()
  console.log('P0 regression tests: 9 groups passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
