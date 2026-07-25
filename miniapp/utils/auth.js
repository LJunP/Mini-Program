// utils/auth.js — 登录认证模块
// 改造：去掉 Mock 分支，走微信云开发（wx.cloud.callFunction）

const USER_INFO_KEY = 'user_info'
const TOKEN_KEY = 'cloud_login_token'

let _loginPromise = null

function isLoggedIn() {
  const token = wx.getStorageSync(TOKEN_KEY)
  return !!token
}

function getUserInfo() {
  return wx.getStorageSync(USER_INFO_KEY) || null
}

function setUserInfo(info) {
  wx.setStorageSync(USER_INFO_KEY, info)
}

function clearUserInfo() {
  wx.removeStorageSync(USER_INFO_KEY)
}

/**
 * 登录：通过微信云函数获取 openid，查/建用户记录
 */
function login() {
  if (_loginPromise) return _loginPromise

  _loginPromise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      success: (res) => {
        const result = res.result || {}
        if (result.code === 0 && result.user) {
          // 用 openid 作为 token 标识
          const token = 'cloud_' + Date.now()
          wx.setStorageSync(TOKEN_KEY, token)
          setUserInfo(result.user)
          _loginPromise = null
          resolve(result.user)
        } else {
          _loginPromise = null
          reject({ code: -1, message: result.message || '登录失败' })
        }
      },
      fail: (err) => {
        _loginPromise = null
        console.error('[auth] login failed:', err)
        reject({ code: -1, message: '云函数调用失败', detail: err })
      }
    })
  })

  return _loginPromise
}

/**
 * 静默登录：已登录则直接返回用户信息，否则发起登录
 */
function silentLogin() {
  if (isLoggedIn()) {
    return Promise.resolve(getUserInfo())
  }
  return login()
}

/**
 * 退出登录
 */
function logout() {
  wx.removeStorageSync(TOKEN_KEY)
  clearUserInfo()
}

/**
 * 检查微信 session 是否有效
 */
function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => resolve(true),
      fail: () => resolve(false)
    })
  })
}

/**
 * 确保登录状态有效
 */
async function ensureLogin() {
  const sessionValid = await checkSession()
  if (sessionValid && isLoggedIn()) {
    return getUserInfo()
  }
  logout()
  return login()
}

/**
 * 需要登录才能操作的功能
 */
function requireLogin(callback) {
  if (isLoggedIn()) {
    callback && callback()
    return true
  }

  wx.showModal({
    title: '提示',
    content: '此功能需要登录，是否立即登录？',
    success: (res) => {
      if (res.confirm) {
        login().then(() => {
          callback && callback()
        }).catch(() => {
          wx.showToast({ title: '登录失败', icon: 'none' })
        })
      }
    }
  })
  return false
}

module.exports = {
  isLoggedIn,
  getUserInfo,
  setUserInfo,
  clearUserInfo,
  login,
  silentLogin,
  logout,
  checkSession,
  ensureLogin,
  requireLogin
}
