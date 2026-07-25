// services/user.js — 用户信息服务
// 改造：默认值去掉"林深"，保存时同步到云函数 updateProfile

const STORAGE_KEY = 'user_info'

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

/**
 * 保存用户信息：先更新本地缓存，再异步同步到云端
 * @param {Object} userInfo - 用户信息
 * @returns {Promise<boolean>} 是否保存成功
 */
function saveUserInfo(userInfo) {
  // 本地立即保存
  _saveLocal(userInfo)

  // 异步同步到云端
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'updateProfile',
      data: {
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl,
        bio: userInfo.bio,
        gender: userInfo.gender,
        birthday: userInfo.birthday,
        tags: userInfo.tags
      },
      success: (res) => {
        const result = res.result || {}
        if (result.code === 0 && result.user) {
          // 用云端返回的最新数据更新本地
          _saveLocal(result.user)
        }
        resolve(true)
      },
      fail: (err) => {
        console.warn('[user] cloud sync failed, local saved:', err)
        resolve(true) // 本地已保存，云端失败不影响
      }
    })
  })
}

/**
 * 更新用户信息（部分更新）— 仅本地
 */
function updateUserInfo(patch) {
  const current = getUserInfo()
  const updated = { ...current, ...patch }
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
