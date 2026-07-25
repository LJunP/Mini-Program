// 云函数 getStudyData：从私有云存储返回学习数据
// 若使用加密备份，密钥只存储在云函数环境变量中，不暴露给客户端
//
// 可选环境变量：
//   STUDY_DATA_FILE_ID - 私有云存储中的 JSON 或 RC4+Base64 文件
//   STUDY_DATA_KEY     - 加密备份的密钥（与客户端 crypto.js 的方案一致）
//   STUDY_DATA_URL     - 未配置私有文件时使用的 HTTPS 备选地址

const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SECRET_KEY = process.env.STUDY_DATA_KEY || ''
const STUDY_DATA_FILE_ID = process.env.STUDY_DATA_FILE_ID ||
  'cloud://cloud1-d6gh3spr3b2bd51d8.636c-cloud1-d6gh3spr3b2bd51d8-1449934595/study/study_data.json'
const DATA_URL = process.env.STUDY_DATA_URL || ''
const ASSET_FILE_ROOT = 'cloud://cloud1-d6gh3spr3b2bd51d8.636c-cloud1-d6gh3spr3b2bd51d8-1449934595/app-assets/images/'
const ASSET_BATCH_LIMIT = 50
const ASSET_FILE_PATTERN = /\.(?:jpe?g|png|webp)$/i
const STUDY_TOPIC_BATCH_LIMIT = 3
const STUDY_TOPIC_KEY_PATTERN = /^[a-z0-9_]+$/

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
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume()
        reject(new Error(`数据地址返回 HTTP ${res.statusCode}`))
        return
      }
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    }).on('error', reject)
  })
}

async function loadStudyDataText() {
  if (STUDY_DATA_FILE_ID) {
    const result = await cloud.downloadFile({ fileID: STUDY_DATA_FILE_ID })
    return result.fileContent.toString('utf8')
  }

  if (DATA_URL) {
    return fetchFromUrl(DATA_URL)
  }

  throw new Error('未配置学习数据源')
}

function parseStudyData(rawText) {
  const text = String(rawText || '').replace(/^\uFEFF/, '').trim()
  if (!text) {
    throw new Error('学习数据为空')
  }

  if (text.startsWith('{') || text.startsWith('[')) {
    return JSON.parse(text)
  }

  if (!SECRET_KEY) {
    throw new Error('加密数据需要 STUDY_DATA_KEY')
  }

  return JSON.parse(decryptData(text, SECRET_KEY))
}

function isAllowedAssetFile(fileID) {
  return typeof fileID === 'string' &&
    fileID.startsWith(ASSET_FILE_ROOT) &&
    !fileID.includes('..') &&
    ASSET_FILE_PATTERN.test(fileID)
}

async function getAssetUrls(fileList) {
  if (!Array.isArray(fileList) ||
      fileList.length < 1 ||
      fileList.length > ASSET_BATCH_LIMIT ||
      fileList.some(fileID => !isAllowedAssetFile(fileID))) {
    return { code: -1, message: '图片文件列表不合法' }
  }

  try {
    const uniqueFileIds = Array.from(new Set(fileList))
    const result = await cloud.getTempFileURL({ fileList: uniqueFileIds })
    return {
      code: 0,
      fileList: (result.fileList || []).map(file => ({
        fileID: file.fileID,
        status: file.status,
        tempFileURL: file.tempFileURL || '',
        errMsg: file.status === 0 ? '' : '图片地址获取失败'
      }))
    }
  } catch (err) {
    console.error('[getStudyData:getAssetUrls] error:', err)
    return { code: -1, message: '图片地址获取失败' }
  }
}

async function getStudyData() {
  const now = Date.now()
  if (_cachedData && (now - _cacheTime) < CACHE_TTL) {
    return _cachedData
  }

  const rawData = await loadStudyDataText()
  const data = parseStudyData(rawData)
  _cachedData = data
  _cacheTime = now
  return data
}

function getStudyIndex(data) {
  const topicKeys = Object.keys(data.topics || {})
  return {
    tutorials: data.tutorials || [],
    knowledge: data.knowledge || [],
    topicKeys,
    totalQuestions: topicKeys.reduce((total, key) => {
      const questions = data.topics[key]
      return total + (Array.isArray(questions) ? questions.length : 0)
    }, 0)
  }
}

function getStudyTopics(data, topicKeys) {
  if (!Array.isArray(topicKeys) ||
      topicKeys.length < 1 ||
      topicKeys.length > STUDY_TOPIC_BATCH_LIMIT ||
      topicKeys.some(key => typeof key !== 'string' ||
        !STUDY_TOPIC_KEY_PATTERN.test(key) ||
        !Array.isArray(data.topics && data.topics[key]))) {
    return null
  }

  return topicKeys.reduce((topics, key) => {
    topics[key] = data.topics[key]
    return topics
  }, {})
}

exports.main = async (event = {}) => {
  if (event.action === 'getAssetUrls') {
    return getAssetUrls(event.fileList)
  }

  try {
    const data = await getStudyData()

    if (event.action === 'getStudyIndex') {
      return { code: 0, data: getStudyIndex(data) }
    }

    if (event.action === 'getStudyTopics') {
      const topics = getStudyTopics(data, event.topicKeys)
      return topics
        ? { code: 0, data: { topics } }
        : { code: -1, message: '题库专题列表不合法' }
    }

    // 保留旧客户端调用方式；新客户端使用分批接口避免大响应体失败。
    return { code: 0, data }
  } catch (err) {
    console.error('[getStudyData] error:', err)
    return { code: -1, message: '数据获取失败' }
  }
}
