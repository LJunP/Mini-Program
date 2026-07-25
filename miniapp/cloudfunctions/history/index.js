// 云函数 history：浏览历史增删查
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const { action } = event

  // 输入校验
  if (!action || typeof action !== 'string' || action.length > 20) {
    return { code: -1, message: '参数非法' }
  }

  try {
    // 添加浏览记录
    if (action === 'add') {
      const { domain, ref_id, name } = event

      if (!domain || typeof domain !== 'string' || domain.length > 30) {
        return { code: -1, message: '板块参数非法' }
      }
      if (!ref_id || typeof ref_id !== 'string' || ref_id.length > 100) {
        return { code: -1, message: 'ID参数非法' }
      }
      if (name && (typeof name !== 'string' || name.length > 200)) {
        return { code: -1, message: '名称参数非法' }
      }

      // 检查是否已存在相同记录（去重）
      const { data } = await db.collection('history')
        .where({ _openid: OPENID, domain, ref_id })
        .get()

      const now = new Date().toISOString()

      if (data.length > 0) {
        // 已存在，更新时间戳和名称
        await db.collection('history').doc(data[0]._id).update({
          data: {
            name: name || data[0].name,
            visited_at: now
          }
        })
        return { code: 0, id: data[0]._id, message: '已更新浏览记录' }
      }

      // 新增
      const addRes = await db.collection('history').add({
        data: {
          domain,
          ref_id,
          name: name || '',
          visited_at: now
        }
      })
      return { code: 0, id: addRes._id, visited_at: now, message: '已记录浏览' }
    }

    // 获取浏览历史列表
    if (action === 'getList') {
      const { domain, page = 1, pageSize = 50 } = event

      let query = db.collection('history').where({ _openid: OPENID })

      if (domain && domain !== 'all') {
        query = db.collection('history').where({
          _openid: OPENID,
          domain
        })
      }

      const { data: list } = await query
        .orderBy('visited_at', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()

      return {
        code: 0,
        list: list.map(item => ({
          id: item._id,
          domain: item.domain,
          ref_id: item.ref_id,
          name: item.name || '',
          visited_at: item.visited_at
        })),
        total_count: list.length
      }
    }

    // 删除单条记录
    if (action === 'deleteOne') {
      const { domain, ref_id } = event

      if (!domain || !ref_id) {
        return { code: -1, message: '缺少必要参数' }
      }

      await db.collection('history')
        .where({ _openid: OPENID, domain, ref_id })
        .remove()

      return { code: 0, message: '已删除记录' }
    }

    // 清空所有历史
    if (action === 'clearAll') {
      await db.collection('history')
        .where({ _openid: OPENID })
        .remove()

      return { code: 0, message: '已清空历史' }
    }

    // 获取历史数量
    if (action === 'getCount') {
      const { total } = await db.collection('history')
        .where({ _openid: OPENID })
        .count()

      return { code: 0, count: total }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[history] error:', err)
    return { code: -1, message: '操作失败' }
  }
}
