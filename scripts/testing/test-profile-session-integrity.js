#!/usr/bin/env node

const assert = require('assert')
const Module = require('module')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')

function fromRoot(relativePath) {
  return path.join(ROOT, relativePath)
}

function clearModule(relativePath) {
  const target = fromRoot(relativePath)
  delete require.cache[require.resolve(target)]
  return target
}

async function testProfileServiceIdentityLockAndSyncStatus() {
  const storage = {
    user_info: {
      id: 'users-locked',
      nickname: '旧昵称',
      avatarUrl: 'old-avatar',
      bio: '必须保留',
      gender: 1,
      birthday: '2000-01-01',
      tags: ['原标签'],
      is_new: false
    }
  }
  let cloudCall = null
  global.wx = {
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    cloud: {
      callFunction(options) {
        cloudCall = options
      }
    }
  }

  const service = require(clearModule('miniapp/services/user.js'))
  const successPromise = service.saveUserInfo({
    id: 'users-attacker',
    nickname: '本地新昵称'
  })
  assert.strictEqual(storage.user_info.id, 'users-locked')
  assert.strictEqual(storage.user_info.bio, '必须保留')
  assert.strictEqual(storage.user_info._profileSyncPending, true)

  cloudCall.success({
    result: {
      code: 0,
      user: {
        id: 'users-locked',
        nickname: '云端确认昵称',
        avatarUrl: 'cloud-avatar'
      }
    }
  })
  const success = await successPromise
  assert.strictEqual(success.cloudSynced, true)
  assert.strictEqual(success.user.id, 'users-locked')
  assert.strictEqual(success.user.nickname, '云端确认昵称')
  assert.strictEqual(success.user.bio, '必须保留')
  assert.strictEqual(storage.user_info._profileSyncPending, false)

  const failedPromise = service.saveUserInfo({
    id: 'users-other',
    bio: '离线修改'
  })
  cloudCall.fail({ errCode: 'NETWORK_ERROR' })
  const failed = await failedPromise
  assert.strictEqual(failed.cloudSynced, false)
  assert.strictEqual(failed.localSaved, true)
  assert.strictEqual(failed.user.id, 'users-locked')
  assert.strictEqual(failed.user.bio, '离线修改')
  assert.strictEqual(storage.user_info.id, 'users-locked')
  assert.strictEqual(storage.user_info._profileSyncPending, true)

  storage.user_info = { nickname: '身份缺失' }
  await assert.rejects(
    () => service.saveUserInfo({ nickname: '不得上传' }),
    err => err && err.code === 'identity_missing'
  )
}

async function testEditProfileUsesActualMergedUser() {
  let pageDefinition = null
  let storedUser = null
  let modal = null
  const toasts = []
  const actualUser = {
    id: 'users-locked',
    nickname: '合并昵称',
    avatarUrl: 'avatar',
    bio: '保留简介',
    gender: 0,
    birthday: '',
    tags: [],
    _profileSyncPending: true
  }
  const userStub = {
    getUserInfo() {
      return actualUser
    },
    getAvatarBgColor() {
      return '#000'
    },
    saveUserInfo() {
      return Promise.resolve({
        localSaved: true,
        cloudSynced: false,
        user: actualUser
      })
    }
  }
  const storeStub = {
    login(userInfo) {
      storedUser = userInfo
    }
  }
  const trackerStub = { track() {} }

  global.Page = definition => {
    pageDefinition = definition
  }
  global.wx = {
    showLoading() {},
    hideLoading() {},
    showToast(options) {
      toasts.push(options)
    },
    showModal(options) {
      modal = options
    },
    navigateBack() {}
  }

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (parent && parent.filename.endsWith('edit-profile.js')) {
      if (request === '../../services/user.js') return userStub
      if (request === '../../store/index.js') return storeStub
      if (request === '../../utils/tracker.js') return trackerStub
    }
    return originalLoad.call(this, request, parent, isMain)
  }
  try {
    require(clearModule('miniapp/pages/edit-profile/edit-profile.js'))
  } finally {
    Module._load = originalLoad
  }

  const context = {
    data: {
      nickname: '合并昵称',
      avatarUrl: 'avatar',
      bio: '保留简介',
      gender: 0,
      birthday: '',
      tags: [],
      originalData: {
        id: 'users-locked',
        nickname: '旧昵称',
        avatarUrl: 'avatar',
        bio: '保留简介',
        gender: 0,
        birthday: '',
        tags: []
      },
      isChanged: true
    },
    setData(patch) {
      Object.assign(this.data, patch)
    },
    _getChangedFields: pageDefinition._getChangedFields
  }
  const result = await pageDefinition.onSave.call(context)
  assert.strictEqual(result.cloudSynced, false)
  assert.strictEqual(storedUser, actualUser)
  assert.strictEqual(context.data.originalData.id, 'users-locked')
  assert(modal)
  assert.strictEqual(modal.title, '云端待同步')
  assert.strictEqual(
    toasts.some(item => item.icon === 'success'),
    false,
    '云端失败不得显示成功 toast'
  )
}

function testPersonaSessionReset() {
  const storage = {
    browse_history: [{ domain: 'tea', refId: 'a' }],
    fengya_collections: []
  }
  global.wx = {
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    getStorageInfoSync() {
      return { keys: Object.keys(storage) }
    }
  }

  const persona = require(clearModule('miniapp/utils/persona.js'))
  const accountA = persona.calculatePersona()
  storage.browse_history = [{ domain: 'travel', refId: 'b' }]
  const stale = persona.calculatePersona()
  assert.strictEqual(stale.affinity.tea, accountA.affinity.tea)
  persona.resetSessionCache()
  const accountB = persona.calculatePersona()
  assert.strictEqual(accountB.affinity.travel, 10)
  assert.strictEqual(accountB.affinity.tea, 0)
}

function testTrackerDropsStaleInflightBatch() {
  const storage = { user_info: { id: 'user-a' } }
  let currentUser = { id: 'user-a' }
  const cloudCalls = []
  const authStub = {
    getUserInfo() {
      return currentUser
    }
  }
  global.getCurrentPages = () => []
  global.wx = {
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    getEnterOptionsSync() {
      return { scene: 1001 }
    },
    cloud: {
      callFunction(options) {
        cloudCalls.push(options)
      }
    }
  }

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (
      request === './auth.js' &&
      parent &&
      parent.filename.endsWith('tracker.js')
    ) {
      return authStub
    }
    return originalLoad.call(this, request, parent, isMain)
  }
  let tracker
  try {
    tracker = require(clearModule('miniapp/utils/tracker.js'))
    tracker.track('account_a_event')
    tracker.flush()
    assert.strictEqual(cloudCalls.length, 1)

    tracker.resetSessionCache()
    currentUser = { id: 'user-b' }
    tracker.track('account_b_event')
    cloudCalls[0].fail()
    tracker.persist()
  } finally {
    Module._load = originalLoad
  }

  assert.deepStrictEqual(
    storage.fengya_events_buffer.map(event => event.event_name),
    ['account_b_event'],
    '旧账号在途批次失败后不得回填到新账号队列'
  )
}

async function testAuthResetsVolatileCachesOnScopeTransitions() {
  const storage = {
    user_info: { id: 'user-a', nickname: 'A' },
    cloud_login_token: 'old'
  }
  const calls = []
  let cloudCall = null
  const trackerStub = {
    persist() {
      calls.push('tracker.persist')
    },
    resetSessionCache(options) {
      calls.push(`tracker.reset:${options.reloadPersisted === true}`)
    }
  }
  const personaStub = {
    resetSessionCache() {
      calls.push('persona.reset')
    }
  }
  const scopeStub = {
    suspendUserScope(userId) {
      calls.push(`scope.suspend:${userId}`)
    },
    deactivateUserScope() {
      calls.push('scope.deactivate')
    },
    activateUserScope(userId) {
      calls.push(`scope.activate:${userId}`)
      return { restored: 0 }
    },
    clearPersonalDataFailClosed() {}
  }
  const ugcStub = {
    deactivateUserScope() {
      calls.push('ugc.deactivate')
    },
    activateUserScope(userId) {
      calls.push(`ugc.activate:${userId}`)
      return {}
    }
  }

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
      callFunction(options) {
        cloudCall = options
      }
    }
  }

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (parent && parent.filename.endsWith('auth.js')) {
      if (request === './tracker.js') return trackerStub
      if (request === './persona.js') return personaStub
      if (request === './account-scope.js') return scopeStub
      if (request === './ugc.js') return ugcStub
    }
    return originalLoad.call(this, request, parent, isMain)
  }
  try {
    const auth = require(clearModule('miniapp/utils/auth.js'))
    const loginPromise = auth.login()
    assert(calls.includes('tracker.persist'))
    assert(calls.includes('tracker.reset:false'))
    cloudCall.success({
      result: {
        code: 0,
        user: { id: 'user-b', nickname: 'B' }
      }
    })
    await loginPromise
    assert(calls.includes('scope.activate:user-b'))
    assert(calls.includes('tracker.reset:true'))
    assert(calls.filter(item => item === 'persona.reset').length >= 2)

    auth.logout()
    assert.strictEqual(calls.filter(item => item === 'tracker.persist').length, 2)
    assert(calls.filter(item => item === 'tracker.reset:false').length >= 2)
  } finally {
    Module._load = originalLoad
  }
}

async function testSignResponsesAreAccountScoped() {
  let pageDefinition = null
  let activeUserId = 'user-a'
  let cloudResolve = null
  let pointsAwarded = 0
  const accountScopeStub = {
    getActiveUserId() {
      return activeUserId
    }
  }
  const storeStub = {
    getState() {
      return { isLoggedIn: true }
    },
    init() {},
    subscribe() {
      return () => {}
    }
  }
  const subscribeStub = {
    subscribeByScene() {
      return Promise.resolve({})
    },
    getSubscribeStatus() {
      return {}
    }
  }

  global.Page = definition => {
    pageDefinition = definition
  }
  global.wx = {
    cloud: {
      callFunction() {
        return new Promise(resolve => {
          cloudResolve = resolve
        })
      }
    },
    showLoading() {},
    hideLoading() {},
    showToast() {}
  }

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (parent && parent.filename.endsWith('profile.js')) {
      if (request === '../../store/index.js') return storeStub
      if (request === '../../utils/mock.js') {
        return { getStudyStats: () => ({}) }
      }
      if (request === '../../utils/persona.js') {
        return { calculatePersona: () => ({ persona: {}, affinity: {} }) }
      }
      if (request === '../../utils/subscribe.js') return subscribeStub
      if (request === '../../utils/subscribe-config.js') {
        return { getEnabledTemplates: () => [] }
      }
      if (request === '../../utils/tracker.js') return { track() {} }
      if (request === '../../utils/points.js') {
        return {
          onSignIn() {
            pointsAwarded++
            return 1
          },
          getPoints: () => 0,
          getLevelInfo: () => ({}),
          getEarnedBadges: () => [],
          BADGES: []
        }
      }
      if (request === '../../utils/account-scope.js') return accountScopeStub
    }
    return originalLoad.call(this, request, parent, isMain)
  }
  try {
    require(clearModule('miniapp/pages/profile/profile.js'))
  } finally {
    Module._load = originalLoad
  }

  const patches = []
  const context = {
    data: {
      isLoggedIn: true,
      signedToday: false,
      signSubmitting: false
    },
    setData(patch) {
      patches.push(patch)
      Object.assign(this.data, patch)
    },
    _buildSignDates: pageDefinition._buildSignDates,
    _loadSignDataWithState: pageDefinition._loadSignDataWithState,
    _renderStore() {},
    onLoginTap() {}
  }

  const loadPromise = pageDefinition._loadSignDataWithState.call(context, true)
  activeUserId = 'user-b'
  cloudResolve({
    result: {
      code: 0,
      signedToday: true,
      signDays: 9,
      records: ['2026-07-28']
    }
  })
  await loadPromise
  assert.strictEqual(
    patches.some(patch => patch.signDays === 9),
    false,
    'A 的签到查询回包不得写入 B'
  )

  activeUserId = 'user-a'
  context.data.signedToday = false
  context.data.signSubmitting = false
  const signPromise = pageDefinition.onSignTap.call(context)
  await Promise.resolve()
  activeUserId = 'user-b'
  cloudResolve({
    result: {
      code: 0,
      signedToday: true,
      alreadySigned: false,
      signDays: 3,
      records: ['2026-07-28']
    }
  })
  await signPromise
  assert.strictEqual(pointsAwarded, 0, 'A 的签到回包不得给 B 增加本地积分')
  assert.strictEqual(
    patches.some(patch => patch.signDays === 3),
    false,
    'A 的签到回包不得覆盖 B 的签到记录'
  )
}

async function main() {
  await testProfileServiceIdentityLockAndSyncStatus()
  await testEditProfileUsesActualMergedUser()
  testPersonaSessionReset()
  testTrackerDropsStaleInflightBatch()
  await testAuthResetsVolatileCachesOnScopeTransitions()
  await testSignResponsesAreAccountScoped()
  console.log('Profile/session integrity tests: 6 groups passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
