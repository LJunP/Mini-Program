// 云函数 sign：签到与签到记录查询
const cloud = require('wx-server-sdk')
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

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  console.log('[sign] event:', JSON.stringify(event), 'OPENID:', OPENID)

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const { action } = event

  if (!action || typeof action !== 'string' || !['sign', 'getRecords', 'status'].includes(action)) {
    return { code: -1, message: '参数非法' }
  }

  try {
    if (action === 'sign') {
      const today = getTodayStr()
      console.log('[sign] today:', today)

      // 查今天是否已签到
      const { data: todayRecords } = await db.collection('sign_records')
        .where({ _openid: OPENID, date: today })
        .get()
      console.log('[sign] todayRecords count:', todayRecords.length)

      if (todayRecords.length > 0) {
        // 已签到：也要返回 signDays 和 records，否则客户端拿不到连续天数
        const { data: allRecords } = await db.collection('sign_records')
          .where({ _openid: OPENID })
          .orderBy('date', 'desc')
          .get()
        const dates = allRecords.map(r => r.date)
        const signDays = calcContinuousDays(dates, today)
        console.log('[sign] already signed, signDays:', signDays, 'records:', dates)
        return {
          code: 0,
          message: '今日已签到',
          signedToday: true,
          signDays,
          records: dates
        }
      }

      // 签到
      const addResult = await db.collection('sign_records').add({
        data: {
          date: today,
          created_at: Date.now()
        }
      })
      console.log('[sign] add result:', JSON.stringify(addResult))

      // 查全部签到记录，计算连续天数
      const { data: allRecords } = await db.collection('sign_records')
        .where({ _openid: OPENID })
        .orderBy('date', 'desc')
        .get()

      const dates = allRecords.map(r => r.date)
      const signDays = calcContinuousDays(dates, today)
      console.log('[sign] new sign, signDays:', signDays, 'records:', dates)

      return {
        code: 0,
        message: '签到成功',
        signedToday: true,
        signDays,
        records: dates
      }
    }

    // status 和 getRecords 共享查询逻辑
    if (action === 'status' || action === 'getRecords') {
      const { data: allRecords } = await db.collection('sign_records')
        .where({ _openid: OPENID })
        .orderBy('date', 'desc')
        .get()

      console.log('[sign] getRecords, OPENID:', OPENID, 'records count:', allRecords.length, 'data:', JSON.stringify(allRecords))

      const dates = allRecords.map(r => r.date)
      const today = getTodayStr()
      const signedToday = dates.indexOf(today) >= 0
      const signDays = calcContinuousDays(dates, today)

      // status 只返回轻量结果（不含完整 records 数组）
      if (action === 'status') {
        return { code: 0, signedToday, signDays }
      }

      return {
        code: 0,
        signedToday,
        signDays,
        records: dates
      }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[sign] error:', err)
    return { code: -1, message: '操作失败', detail: err.message }
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
