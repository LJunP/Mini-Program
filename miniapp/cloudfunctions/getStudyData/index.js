// 云函数 getStudyData：返回已解密的学习数据
// 密钥存储在云函数环境变量中，不暴露给客户端
//
// 环境变量：
//   STUDY_DATA_KEY - 加密密钥（与客户端 crypto.js 的 RC4+Base64 方案一致）
//   STUDY_DATA_URL - 加密数据文件的 CDN 地址

const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SECRET_KEY = process.env.STUDY_DATA_KEY || ''
const DATA_URL = process.env.STUDY_DATA_URL || 'https://cdn.jsdelivr.net/gh/lijunpeng/workbuddy_project/data/study_data.enc'

// 简单内存缓存（云函数实例复用时避免重复拉取+解密）
let _cachedData = null
let _cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟

/**
 * RC4 解密算法（与客户端 crypto.js 的 rc4Bytes 完全一致）
 */
function rc4Bytes(key, bytes) {
  const s = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    s[i] = i
  }
  let j = 0
  const keyLen = key.length
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % keyLen)) % 256
    const temp = s[i]
    s[i] = s[j]
    s[j] = temp
  }
  let i = 0
  j = 0
  const resBytes = new Uint8Array(bytes.length)
  for (let y = 0; y < bytes.length; y++) {
    i = (i + 1) % 256
    j = (j + s[i]) % 256
    const temp = s[i]
    s[i] = s[j]
    s[j] = temp
    resBytes[y] = bytes[y] ^ s[(s[i] + s[j]) % 256]
  }
  return resBytes
}

/**
 * 解密数据（RC4 + Base64，与客户端 crypto.js 的 decryptData 完全一致）
 */
function decryptData(base64Data, key) {
  if (!base64Data) return ''
  const trimmed = base64Data.trim()
  // Base64 -> ArrayBuffer
  const arrayBuffer = Buffer.from(trimmed, 'base64')
  const encryptedBytes = new Uint8Array(arrayBuffer)
  // RC4 解密
  const decryptedBytes = rc4Bytes(key, encryptedBytes)
  // bytes -> UTF-8 string
  return Buffer.from(decryptedBytes).toString('utf8')
}

/**
 * 从 URL 拉取数据（支持大文件流式读取）
 */
function fetchFromUrl(url) {
  return new Promise((resolve, reject) => {
    const chunks = []
    https.get(url, (res) => {
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    }).on('error', reject)
  })
}

exports.main = async (event) => {
  if (!SECRET_KEY) {
    return { code: -1, message: 'STUDY_DATA_KEY 环境变量未配置' }
  }

  // 检查内存缓存
  const now = Date.now()
  if (_cachedData && (now - _cacheTime) < CACHE_TTL) {
    return { code: 0, data: _cachedData }
  }

  try {
    // 从 CDN 拉取加密数据
    const encryptedData = await fetchFromUrl(DATA_URL)

    // 在服务端解密（RC4 + Base64，与客户端 crypto.js 一致）
    const decryptedStr = decryptData(encryptedData, SECRET_KEY)
    const data = JSON.parse(decryptedStr)

    // 更新缓存
    _cachedData = data
    _cacheTime = now

    return { code: 0, data }
  } catch (err) {
    console.error('[getStudyData] error:', err)
    return { code: -1, message: '数据获取失败' }
  }
}
