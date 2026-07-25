// 云函数 track：接收前端埋点事件，写入云数据库
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { events } = event

  if (!events || !Array.isArray(events) || events.length === 0) {
    return { code: 0, message: 'no events' }
  }

  // 限制单次最多 50 条
  const batch = events.slice(0, 50)

  try {
    // 批量写入（逐条 add，云数据库不支持真正的 batch insert）
    const tasks = batch.map(evt => {
      return db.collection('events').add({
        data: {
          ...evt,
          openid: OPENID || evt.openid || null,
          created_at: Date.now()
        }
      }).catch(err => {
        // 单条失败不影响其他
        console.error('[track] single add failed:', err)
        return null
      })
    })

    await Promise.all(tasks)

    return { code: 0, count: batch.length }
  } catch (err) {
    console.error('[track] error:', err)
    return { code: -1, message: '上报失败' }
  }
}
