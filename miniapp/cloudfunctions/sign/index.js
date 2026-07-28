// 云函数 sign：签到与签到记录查询
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 云函数运行在 UTC 时区，需强制 UTC+8
function getTodayStr() {
  const now = new Date()
  // 强制偏移 +8 小时（北京时间）
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const y = beijing.getUTCFullYear()
  const m = (beijing.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = beijing.getUTCDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

function signDocumentId(openid, date) {
  const digest = crypto.createHash('sha256').update(`${openid}:${date}`).digest('hex')
  return digest.slice(0, 32)
}

function uniqueDates(records) {
  return Array.from(new Set(
    (records || [])
      .map(record => record && record.date)
      .filter(date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date))
  ))
}

function safeErrorCode(err) {
  return String((err && (err.errCode || err.code)) || '').slice(0, 100)
}

async function getAllDates(openid) {
  const pageSize = 100
  const records = []
  for (let page = 0; page < 50; page++) {
    const { data } = await db.collection('sign_records')
      .where({ _openid: openid })
      .orderBy('date', 'desc')
      .skip(page * pageSize)
      .limit(pageSize)
      .get()
    records.push(...(Array.isArray(data) ? data : []))
    if (!Array.isArray(data) || data.length < pageSize) {
      return uniqueDates(records)
    }
  }
  throw Object.assign(new Error('签到记录超过安全分页上限'), {
    code: 'sign_records_page_limit'
  })
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const action = event && event.action

  if (!action || typeof action !== 'string' || !['sign', 'getRecords', 'status'].includes(action)) {
    return { code: -1, message: '参数非法' }
  }

  try {
    if (action === 'sign') {
      const today = getTodayStr()

      // 查今天是否已签到
      const { data: todayRecords } = await db.collection('sign_records')
        .where({ _openid: OPENID, date: today })
        .limit(1)
        .get()
      if (todayRecords.length > 0) {
        const dates = await getAllDates(OPENID)
        const signDays = calcContinuousDays(dates, today)
        return {
          code: 0,
          message: '今日已签到',
          signedToday: true,
          alreadySigned: true,
          signDays,
          records: dates
        }
      }

      // 确定性 ID + 原子新增保证同一账号同一天最多一个文档。
      const deterministicId = signDocumentId(OPENID, today)
      const newRecord = {
        _id: deterministicId,
        _openid: OPENID,
        date: today,
        created_at: Date.now()
      }
      let alreadySigned = false
      try {
        await db.collection('sign_records').add({ data: newRecord })
      } catch (createErr) {
        // 并发请求中只有一个能创建成功；重复请求读取并确认同一个确定性文档。
        const existingResult = await db.collection('sign_records').doc(deterministicId).get()
        const existing = existingResult && existingResult.data
        if (!existing || existing._openid !== OPENID || existing.date !== today) {
          throw createErr
        }
        alreadySigned = true
      }

      const dates = await getAllDates(OPENID)
      const signDays = calcContinuousDays(dates, today)

      return {
        code: 0,
        message: alreadySigned ? '今日已签到' : '签到成功',
        signedToday: true,
        alreadySigned,
        signDays,
        records: dates
      }
    }

    // status 和 getRecords 共享查询逻辑
    if (action === 'status' || action === 'getRecords') {
      const dates = await getAllDates(OPENID)
      const today = getTodayStr()
      const signedToday = dates.indexOf(today) >= 0
      const signDays = calcContinuousDays(dates, today)

      // status 只返回轻量结果（不含完整 records 数组）
      if (action === 'status') {
        return {
          code: 0,
          signedToday,
          alreadySigned: signedToday,
          signDays
        }
      }

      return {
        code: 0,
        signedToday,
        alreadySigned: signedToday,
        signDays,
        records: dates
      }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[sign] operation failed:', JSON.stringify({
      action,
      code: safeErrorCode(err),
      name: String((err && err.name) || '').slice(0, 80)
    }))
    return { code: -1, message: '操作失败' }
  }
}

function calcContinuousDays(dates, today) {
  if (!dates || dates.length === 0) return 0

  const sorted = dates.slice().sort().reverse()
  const now = new Date()
  // 使用 UTC+8 计算"昨天"
  const beijingNow = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const yesterday = new Date(beijingNow)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayStr = `${yesterday.getUTCFullYear()}-${(yesterday.getUTCMonth() + 1).toString().padStart(2, '0')}-${yesterday.getUTCDate().toString().padStart(2, '0')}`

  let baseDate = beijingNow
  const signedToday = sorted.indexOf(today) >= 0
  if (!signedToday && sorted.indexOf(yesterdayStr) >= 0) {
    baseDate = yesterday
  }

  let count = 0
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(baseDate)
    expected.setUTCDate(expected.getUTCDate() - i)
    const expectedStr = `${expected.getUTCFullYear()}-${(expected.getUTCMonth() + 1).toString().padStart(2, '0')}-${expected.getUTCDate().toString().padStart(2, '0')}`
    if (sorted[i] === expectedStr) {
      count++
    } else {
      break
    }
  }
  return count
}
