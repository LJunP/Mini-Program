const config = require('./config.js')
const { resolveAssetTree } = require('./asset-url.js')

const REQUEST_TIMEOUT = 15000
const MAX_RETRY = 2

const requestQueue = []
let isRefreshing = false

function _getToken() {
  return wx.getStorageSync('access_token') || ''
}

function _setToken(token) {
  wx.setStorageSync('access_token', token)
}

function _clearToken() {
  wx.removeStorageSync('access_token')
  wx.removeStorageSync('refresh_token')
}

function _log(method, url, status, duration) {
  if (config.isLogEnabled()) {
    console.log(`[Request] ${method} ${url} → ${status} (${duration}ms)`)
  }
}

function request(options) {
  if (options.mockHandler && config.isMockEnabled()) {
    return Promise.resolve(options.mockHandler())
      .then(resolveAssetTree)
      .then(result => ({ data: result }))
  }

  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const url = options.url.startsWith('http')
      ? options.url
      : config.getApiBaseUrl() + options.url

    const method = (options.method || 'GET').toUpperCase()
    const token = _getToken()

    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (token && !options.noAuth) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.request({
      url,
      method,
      data: options.data || {},
      header,
      timeout: options.timeout || REQUEST_TIMEOUT,
      success: (res) => {
        const duration = Date.now() - startTime
        const statusCode = res.statusCode

        if (statusCode === 401) {
          _log(method, url, '401 Unauthorized', duration)
          _clearToken()
          wx.showToast({ title: '请重新登录', icon: 'none' })
          reject({ code: 401, message: 'Unauthorized' })
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          _log(method, url, statusCode, duration)
          resolve(res.data)
          return
        }

        _log(method, url, statusCode, duration)
        reject({
          code: statusCode,
          message: res.data?.message || '请求失败',
          data: res.data
        })
      },
      fail: (err) => {
        const duration = Date.now() - startTime
        _log(method, url, 'Network Error', duration)

        const retryCount = options._retryCount || 0
        if (retryCount < MAX_RETRY && !options.noRetry) {
          options._retryCount = retryCount + 1
          setTimeout(() => {
            request(options).then(resolve).catch(reject)
          }, 500 * (retryCount + 1))
          return
        }

        reject({
          code: -1,
          message: '网络错误，请检查网络连接',
          detail: err
        })
      }
    })
  })
}

function get(url, data, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

function post(url, data, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

function put(url, data, options = {}) {
  return request({ url, method: 'PUT', data, ...options })
}

function del(url, data, options = {}) {
  return request({ url, method: 'DELETE', data, ...options })
}

function upload(filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    const token = _getToken()
    wx.uploadFile({
      url: config.getConfig().uploadUrl,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(res.data))
          } catch (e) {
            resolve(res.data)
          }
        } else {
          reject({ code: res.statusCode, message: '上传失败' })
        }
      },
      fail: (err) => {
        reject({ code: -1, message: '上传失败', detail: err })
      }
    })
  })
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload,
  _getToken,
  _setToken,
  _clearToken
}
