// 云函数 tts：语音合成
// 调用腾讯云 TTS API，将文本转为语音，返回音频 URL
// 不依赖任何微信插件，个人主体可用
//
// 环境变量（在云开发控制台设置）：
//   TENCENT_SECRET_ID  - 腾讯云 API SecretId
//   TENCENT_SECRET_KEY - 腾讯云 API SecretKey

const cloud = require('wx-server-sdk')
const crypto = require('crypto')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SECRET_ID = process.env.TENCENT_SECRET_ID || ''
const SECRET_KEY = process.env.TENCENT_SECRET_KEY || ''

// 简单内存缓存：避免相同文本重复合成
const _ttsCache = new Map()
const TTS_CACHE_MAX = 100 // 最多缓存 100 条
const TTS_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 小时

// ==================== 腾讯云 API v3 签名工具 ====================

/**
 * 调用腾讯云 API（TC3-HMAC-SHA256 签名）
 * 不依赖外部 SDK，仅用 Node.js 内置 crypto + https
 */
function callTencentAPI(service, action, params, region) {
  const host = service + '.tencentcloudapi.com'
  const version = getServiceVersion(service)
  const timestamp = Math.floor(Date.now() / 1000)
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10)

  const payload = JSON.stringify(params)

  // 1. 拼接规范请求串
  const canonicalRequest = [
    'POST',
    '/',
    '',
    'content-type:application/json; charset=utf-8\n' +
      'host:' + host + '\n' +
      'x-tc-action:' + action.toLowerCase() + '\n',
    'content-type;host;x-tc-action',
    crypto.createHash('sha256').update(payload).digest('hex')
  ].join('\n')

  // 2. 拼接待签名串
  const credentialScope = date + '/' + service + '/tc3_request'
  const stringToSign = [
    'TC3-HMAC-SHA256',
    timestamp,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n')

  // 3. 计算签名
  const secretDate = crypto.createHmac('sha256', 'TC3' + SECRET_KEY).update(date).digest()
  const secretService = crypto.createHmac('sha256', secretDate).update(service).digest()
  const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest()
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex')

  // 4. 构建 Authorization
  const authorization =
    'TC3-HMAC-SHA256 ' +
    'Credential=' + SECRET_ID + '/' + credentialScope +
    ', SignedHeaders=content-type;host;x-tc-action' +
    ', Signature=' + signature

  // 5. 发送请求
  const headers = {
    'Authorization': authorization,
    'Content-Type': 'application/json; charset=utf-8',
    'Host': host,
    'X-TC-Action': action,
    'X-TC-Version': version,
    'X-TC-Timestamp': timestamp.toString()
  }
  if (region) headers['X-TC-Region'] = region

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: host,
        method: 'POST',
        headers: headers
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(new Error('JSON parse failed: ' + data.slice(0, 200)))
          }
        })
      }
    )
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

function getServiceVersion(service) {
  const versions = {
    tts: '2019-08-23'
  }
  return versions[service] || '2019-08-23'
}

// ==================== 主函数 ====================

exports.main = async (event) => {
  const { text, voiceType } = event

  // 参数校验
  if (!text || typeof text !== 'string') {
    return { code: -1, message: '缺少文本参数' }
  }

  if (!SECRET_ID || !SECRET_KEY) {
    return {
      code: -1,
      message: 'TTS 密钥未配置，请在云开发控制台设置 TENCENT_SECRET_ID 和 TENCENT_SECRET_KEY 环境变量'
    }
  }

  // 腾讯云 TTS 单次最多 150 字
  const truncatedText = text.slice(0, 150)

  // 检查缓存
  const cacheKey = truncatedText + '_' + (voiceType || 0)
  const cached = _ttsCache.get(cacheKey)
  if (cached && (Date.now() - cached.time) < TTS_CACHE_TTL) {
    return { code: 0, fileID: cached.fileID, tempUrl: cached.tempUrl, cached: true }
  }

  try {
    // 调用腾讯云 TTS API
    const result = await callTencentAPI('tts', 'TextToVoice', {
      Text: truncatedText,
      SessionId: 'workbuddy_tts',
      ModelType: 1,         // 1 = 基础模型
      Volume: 0,             // 音量 0（正常）
      Speed: 0,              // 语速 0（正常）
      VoiceType: voiceType || 0,  // 0=智晓(女声), 1=智瑜(男声)
      PrimaryLanguage: 1,    // 1=中文
      SampleRate: 16000,     // 16kHz
      Codec: 'mp3'           // MP3 格式
    }, 'ap-beijing')

    // 检查 API 返回
    if (result.Response && result.Response.Error) {
      console.error('[tts] API error:', result.Response.Error)
      return {
        code: -1,
        message: result.Response.Error.Message || '语音合成失败'
      }
    }

    if (!result.Response || !result.Response.Audio) {
      return { code: -1, message: '语音合成返回数据异常' }
    }

    // 解码 base64 音频
    const audioBuffer = Buffer.from(result.Response.Audio, 'base64')

    // 上传到云存储
    const fileName = 'tts/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.mp3'
    const uploadResult = await cloud.uploadFile({
      cloudPath: fileName,
      fileContent: audioBuffer
    })

    // 获取临时访问 URL（2 小时有效）
    const { fileList } = await cloud.getTempFileURL({
      fileList: [uploadResult.fileID]
    })

    // 更新缓存
    _ttsCache.set(cacheKey, {
      fileID: uploadResult.fileID,
      tempUrl: fileList[0].tempFileURL,
      time: Date.now()
    })
    // 清理过期缓存
    if (_ttsCache.size > TTS_CACHE_MAX) {
      const oldestKey = _ttsCache.keys().next().value
      _ttsCache.delete(oldestKey)
    }

    return {
      code: 0,
      fileID: uploadResult.fileID,
      tempUrl: fileList[0].tempFileURL
    }
  } catch (err) {
    console.error('[tts] error:', err)
    return { code: -1, message: '语音合成失败' }
  }
}
