// utils/auth.js — 登录认证模块
// 改造：去掉 Mock 分支，走微信云开发（wx.cloud.callFunction）

const USER_INFO_KEY = 'user_info'
const TOKEN_KEY = 'cloud_login_token'

let _loginPromise = null
let _previousUserId = null
let _lastScopeResult = null

function persistVolatileSessionState() {
  try {
    const tracker = require('./tracker.js')
    tracker.persist()
  } catch (e) {}
}

function resetVolatileSessionState(reloadTracker) {
  const persona = require('./persona.js')
  const tracker = require('./tracker.js')
  persona.resetSessionCache()
  tracker.resetSessionCache({ reloadPersisted: reloadTracker === true })
}

function resetUnverifiedSession() {
  _lastScopeResult = null
  try {
    const accountScope = require('./account-scope.js')
    accountScope.deactivateUserScope()
  } catch (e) {
    try {
      const accountScope = require('./account-scope.js')
      accountScope.clearPersonalDataFailClosed()
    } catch (clearErr) {}
  }
  wx.removeStorageSync(TOKEN_KEY)
  clearUserInfo()
  try {
    const ugc = require('./ugc.js')
    ugc.deactivateUserScope()
  } catch (e) {}
  resetVolatileSessionState(false)
}

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

  const cachedUser = getUserInfo()
  _previousUserId = cachedUser && typeof cachedUser.id === 'string'
    ? cachedUser.id
    : null
  // 先把 A 账号尚未落盘的埋点写入其全局键，随后由账号快照一起隔离。
  persistVolatileSessionState()
  try {
    const accountScope = require('./account-scope.js')
    accountScope.suspendUserScope(_previousUserId)
  } catch (err) {
    _loginPromise = null
    return Promise.reject({
      code: -1,
      message: '本地账号数据隔离失败',
      detail: err
    })
  }
  // 进入身份验证窗口后立即撤销旧进程的本地登录态，防止短暂串号。
  resetUnverifiedSession()

  _loginPromise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      success: (res) => {
        const result = res.result || {}
        if (result.code === 0 && result.user) {
          try {
            const ugc = require('./ugc.js')
            const accountScope = require('./account-scope.js')
            const accountScopeResult = accountScope.activateUserScope(
              result.user.id
            )
            const ugcScopeResult = ugc.activateUserScope(
              result.user.id,
              _previousUserId
            )
            _lastScopeResult = {
              ...ugcScopeResult,
              accountDataRestored: accountScopeResult.restored
            }
            // B 账号作用域恢复完成后，清空 A 的画像/埋点内存并加载 B 的事件缓冲。
            resetVolatileSessionState(true)
            const token = 'cloud_' + Date.now()
            wx.setStorageSync(TOKEN_KEY, token)
            setUserInfo(result.user)
            _loginPromise = null
            resolve(result.user)
          } catch (err) {
            resetUnverifiedSession()
            _loginPromise = null
            reject({ code: -1, message: '本地账号隔离初始化失败', detail: err })
          }
        } else {
          resetUnverifiedSession()
          _loginPromise = null
          reject({ code: -1, message: result.message || '登录失败' })
        }
      },
      fail: (err) => {
        resetUnverifiedSession()
        _loginPromise = null
        console.error('[auth] login failed:', {
          code: err && (err.errCode || err.code || '')
        })
        reject({ code: -1, message: '云函数调用失败', detail: err })
      }
    })
  })

  return _loginPromise
}

/**
 * 静默登录：每次启动都调用云函数重新确认当前微信账号。
 * 本地 token 只表示曾登录过，不能作为跨账号身份依据。
 */
function silentLogin() {
  return login()
}

function consumeScopeResult() {
  const result = _lastScopeResult
  _lastScopeResult = null
  return result
}

/**
 * 退出登录
 */
function logout() {
  _lastScopeResult = null
  const accountScope = require('./account-scope.js')
  // 快照失败时保留当前登录态，让调用方提示重试；不能带着旧全局资产进入未登录态。
  persistVolatileSessionState()
  accountScope.deactivateUserScope()
  try {
    const ugc = require('./ugc.js')
    ugc.deactivateUserScope()
  } catch (e) {}
  wx.removeStorageSync(TOKEN_KEY)
  clearUserInfo()
  resetVolatileSessionState(false)
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
  consumeScopeResult,
  logout,
  checkSession,
  ensureLogin,
  requireLogin
}
