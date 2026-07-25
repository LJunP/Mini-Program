const ENV_DEV = 'development'
const ENV_STAGING = 'staging'
const ENV_PROD = 'production'

let localEnv = null
try {
  localEnv = require('./local-env.js')
} catch (e) {
  // Ignore local-env error if not present
}

// 注意：后端 API 尚未部署，当前全部走 Mock 模式
// 后端就绪后替换为真实地址，并关闭 enableMock
const ENV_CONFIGS = {
  [ENV_DEV]: {
    apiBaseUrl: '', // 预留：后端就绪后填写
    cdnBaseUrl: (localEnv && localEnv.cdnBaseUrl) ? localEnv.cdnBaseUrl : 'https://gitee.com/LJunP/workbuddy-assets/raw/main/',
    uploadUrl: '', // 预留
    enableLog: true,
    enableMock: true
  },
  [ENV_STAGING]: {
    apiBaseUrl: '', // 预留
    cdnBaseUrl: 'https://gitee.com/LJunP/workbuddy-assets/raw/main/',
    uploadUrl: '', // 预留
    enableLog: true,
    enableMock: true
  },
  [ENV_PROD]: {
    apiBaseUrl: '', // 预留
    cdnBaseUrl: 'https://gitee.com/LJunP/workbuddy-assets/raw/main/',
    uploadUrl: '', // 预留
    enableLog: false,
    enableMock: true
  }
}

// 根据构建环境自动判断（微信开发者工具中可通过 storage 覆盖）
let currentEnv = ENV_DEV
try {
  // 开发者工具中默认 development，可通过 wx.setStorageSync('app_env', 'production') 切换
  const savedEnv = wx.getStorageSync('app_env')
  if (savedEnv && ENV_CONFIGS[savedEnv]) {
    currentEnv = savedEnv
  }
} catch (e) {
  // Storage 不可用时默认 DEV
}

function getEnv() {
  return currentEnv
}

function setEnv(env) {
  if (ENV_CONFIGS[env]) {
    currentEnv = env
    wx.setStorageSync('app_env', env)
  }
}

function getConfig() {
  return ENV_CONFIGS[currentEnv] || ENV_CONFIGS[ENV_DEV]
}

function getApiBaseUrl() {
  return getConfig().apiBaseUrl
}

function getCdnBaseUrl() {
  return getConfig().cdnBaseUrl
}

function isMockEnabled() {
  return getConfig().enableMock
}

function isLogEnabled() {
  return getConfig().enableLog
}

function init() {
  // 已在模块加载时执行，此处保留兼容
}

// 缓存 isDevTools 结果，避免每次调用 getImageUrl 都读取设备信息。
let _isDevTools = null
function _checkIsDevTools() {
  if (_isDevTools !== null) return _isDevTools
  try {
    _isDevTools = wx.getDeviceInfo().platform === 'devtools'
  } catch (e) {
    _isDevTools = false
  }
  return _isDevTools
}

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('wxfile://') || path.startsWith('data:')) return path

  // 产品内容图片由 request.js 统一批量换取 CloudBase 临时 HTTPS 地址。
  // 这里保留规范化本地路径，避免真机环境先拼接到已失效的历史 CDN。
  if (path.startsWith('/assets/images/')) return path
  
  // 引入本地局域网 CDN 调试环境
  if (localEnv && localEnv.useLocalCdn) {
    return (localEnv.cdnBaseUrl || getCdnBaseUrl()) + path
  }

  // 真机环境强制走 CDN
  if (!_checkIsDevTools()) {
    return getCdnBaseUrl() + path
  }

  // 开发环境且开启 Mock 时，使用本地资源
  if (currentEnv === ENV_DEV && isMockEnabled()) {
    return path
  }
  return getCdnBaseUrl() + path
}

function getAudioUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return getCdnBaseUrl() + path
}

init()

module.exports = {
  ENV_DEV,
  ENV_STAGING,
  ENV_PROD,
  getEnv,
  setEnv,
  getConfig,
  getApiBaseUrl,
  getCdnBaseUrl,
  isMockEnabled,
  isLogEnabled,
  getImageUrl,
  getAudioUrl
}
