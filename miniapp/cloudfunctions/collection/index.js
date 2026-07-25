// 云函数 collection：收藏增删查
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const { validateNote } = require('./validation')

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const { action, target_domain, target_ref_id, note } = event

  // 输入校验
  if (!action || typeof action !== 'string' || action.length > 20) {
    return { code: -1, message: '参数非法' }
  }
  if (target_domain && (typeof target_domain !== 'string' || target_domain.length > 30)) {
    return { code: -1, message: '板块参数非法' }
  }
  if (target_ref_id && (typeof target_ref_id !== 'string' || target_ref_id.length > 100)) {
    return { code: -1, message: 'ID参数非法' }
  }
  const noteError = validateNote(note)
  if (noteError) {
    return { code: -1, message: noteError }
  }

  try {
    if (action === 'add') {
      // 检查是否已收藏
      const { data } = await db.collection('collections')
        .where({ _openid: OPENID, target_domain, target_ref_id })
        .get()

      if (data.length > 0) {
        return { code: 0, id: data[0]._id, message: '已在书签中' }
      }

      const now = new Date().toISOString()
      const addRes = await db.collection('collections').add({
        data: {
          target_domain,
          target_ref_id,
          note: note || '',
          created_at: now
        }
      })
      return { code: 0, id: addRes._id, created_at: now, message: '已加入风雅书签' }
    }

    if (action === 'remove') {
      await db.collection('collections')
        .where({ _openid: OPENID, target_domain, target_ref_id })
        .remove()

      return { code: 0, message: '已移出书签' }
    }

    if (action === 'isCollected') {
      const { data } = await db.collection('collections')
        .where({ _openid: OPENID, target_domain, target_ref_id })
        .get()

      return { code: 0, collected: data.length > 0 }
    }

    if (action === 'getList') {
      const { domain, page = 1, pageSize = 50 } = event
      
      let query = db.collection('collections').where({ _openid: OPENID })

      if (domain && domain !== 'all') {
        query = db.collection('collections').where({
          _openid: OPENID,
          target_domain: domain
        })
      }

      const { data: list } = await query
        .orderBy('created_at', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
      return {
        code: 0,
        list: list.map(item => ({
          id: item._id,
          target_domain: item.target_domain,
          target_ref_id: item.target_ref_id,
          note: item.note || '',
          created_at: item.created_at
        })),
        total_count: list.length
      }
    }

    if (action === 'getCount') {
      const { total } = await db.collection('collections')
        .where({ _openid: OPENID })
        .count()

      return { code: 0, count: total }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[collection] error:', err)
    return { code: -1, message: '操作失败' }
  }
}
