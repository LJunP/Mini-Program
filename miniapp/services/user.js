// services/user.js — 用户信息服务
// 改造：默认值去掉"林深"，保存时同步到云函数 updateProfile

const STORAGE_KEY = 'user_info'
const PROFILE_FIELDS = [
  'nickname',
  'avatarUrl',
  'bio',
  'gender',
  'birthday',
  'tags'
]

const DEFAULT_INFO = {
  nickname: '微信用户',
  avatarUrl: '',
  bio: '',
  gender: 0,
  birthday: '',
  tags: []
}

/**
 * 获取用户信息（本地缓存）
 */
function getUserInfo() {
  try {
    const info = wx.getStorageSync(STORAGE_KEY)
    return info ? { ...DEFAULT_INFO, ...info } : { ...DEFAULT_INFO }
  } catch (e) {
    console.warn('[user] getUserInfo error:', e)
    return { ...DEFAULT_INFO }
  }
}

/**
 * 保存用户信息到本地缓存
 */
function _saveLocal(userInfo) {
  try {
    wx.setStorageSync(STORAGE_KEY, userInfo)
    return true
  } catch (e) {
    console.error('[user] saveLocal error:', e)
    return false
  }
}

function _mergeProfile(base, patch) {
  const merged = { ...DEFAULT_INFO, ...(base || {}) }
  const source = patch && typeof patch === 'object' ? patch : {}
  PROFILE_FIELDS.forEach(field => {
    if (source[field] !== undefined) merged[field] = source[field]
  })
  if (typeof source.is_new === 'boolean') merged.is_new = source.is_new
  return merged
}

function _cloudFailure(userInfo, message, code) {
  const pendingUser = {
    ...userInfo,
    _profileSyncPending: true
  }
  _saveLocal(pendingUser)
  return {
    localSaved: true,
    cloudSynced: false,
    user: pendingUser,
    code: code || 'cloud_sync_failed',
    message: message || '资料已保存在本机，云端待同步'
  }
}

/**
 * 保存用户信息：以本地已验证 users._id 为身份锁，合并资料后再同步云端。
 * 云端失败时保留带 id 的本地合并对象，并用 cloudSynced=false 明确返回。
 * @param {Object} patch - 用户资料增量
 * @returns {Promise<{localSaved:boolean, cloudSynced:boolean, user:Object}>}
 */
function saveUserInfo(patch) {
  const current = getUserInfo()
  const lockedUserId = typeof current.id === 'string' && current.id.trim()
    ? current.id.trim()
    : ''
  if (!lockedUserId) {
    const error = new Error('用户身份尚未完成云端确认')
    error.code = 'identity_missing'
    return Promise.reject(error)
  }

  const merged = {
    ..._mergeProfile(current, patch),
    // 调用方传入的 id 永远不能替换本地已验证 users._id。
    id: lockedUserId,
    _profileSyncPending: true
  }
  if (!_saveLocal(merged)) {
    const error = new Error('资料无法保存到本机')
    error.code = 'local_save_failed'
    return Promise.reject(error)
  }

  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'updateProfile',
      data: {
        nickname: merged.nickname,
        avatarUrl: merged.avatarUrl,
        bio: merged.bio,
        gender: merged.gender,
        birthday: merged.birthday,
        tags: merged.tags
      },
      success: (res) => {
        const result = res.result || {}
        if (result.code === 0 && result.user) {
          if (
            result.user.id !== undefined &&
            result.user.id !== lockedUserId
          ) {
            resolve(_cloudFailure(
              merged,
              '云端返回的用户身份不一致，资料仅保存在本机',
              'identity_mismatch'
            ))
            return
          }
          const confirmedUser = {
            ..._mergeProfile(merged, result.user),
            id: lockedUserId,
            _profileSyncPending: false
          }
          _saveLocal(confirmedUser)
          resolve({
            localSaved: true,
            cloudSynced: true,
            user: confirmedUser,
            code: 0,
            message: '资料已同步'
          })
          return
        }
        resolve(_cloudFailure(
          merged,
          result.message || '云端更新失败',
          result.code || 'cloud_rejected'
        ))
      },
      fail: (err) => {
        console.warn('[user] cloud sync pending:', {
          code: err && (err.errCode || err.code || '')
        })
        resolve(_cloudFailure(
          merged,
          '网络或云函数不可用，资料仅保存在本机',
          (err && (err.errCode || err.code)) || 'cloud_unavailable'
        ))
      }
    })
  })
}

/**
 * 更新用户信息（部分更新）— 仅本地
 */
function updateUserInfo(patch) {
  const current = getUserInfo()
  const updated = _mergeProfile(current, patch)
  if (current.id) updated.id = current.id
  _saveLocal(updated)
  return updated
}

/**
 * 重置用户信息为默认值
 */
function resetUserInfo() {
  _saveLocal({ ...DEFAULT_INFO })
  return { ...DEFAULT_INFO }
}

/**
 * 获取用户头像背景颜色（基于昵称生成）
 */
function getAvatarBgColor(nickname) {
  const colors = [
    '#3B6D11', '#8B6F47', '#4A6B7C', '#A0522D',
    '#5B8C85', '#2C2C2A', '#6B5B95', '#D4A574'
  ]

  if (!nickname) return colors[0]

  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

module.exports = {
  getUserInfo,
  saveUserInfo,
  updateUserInfo,
  resetUserInfo,
  getAvatarBgColor
}
