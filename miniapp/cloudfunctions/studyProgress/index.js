// 云函数 studyProgress：学习进度 + SM-2 复习队列云端同步
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const { action } = event

  if (!action || typeof action !== 'string' || action.length > 20) {
    return { code: -1, message: '参数非法' }
  }

  try {
    // 同步本地进度到云端（全量覆盖）
    if (action === 'sync') {
      const { progress = {}, wrongBook = [] } = event

      if (typeof progress !== 'object' || progress === null) {
        return { code: -1, message: '进度数据格式非法' }
      }
      if (!Array.isArray(wrongBook)) {
        return { code: -1, message: '错题本数据格式非法' }
      }

      const now = new Date().toISOString()

      // 查找是否已有记录
      const { data } = await db.collection('study_progress')
        .where({ _openid: OPENID })
        .get()

      if (data.length > 0) {
        // 更新已有记录
        await db.collection('study_progress').doc(data[0]._id).update({
          data: {
            progress,
            wrong_book: wrongBook,
            updated_at: now
          }
        })
        return { code: 0, message: '学习进度已同步', updated_at: now }
      }

      // 新建记录
      await db.collection('study_progress').add({
        data: {
          progress,
          wrong_book: wrongBook,
          created_at: now,
          updated_at: now
        }
      })
      return { code: 0, message: '学习进度已同步', updated_at: now }
    }

    // 拉取云端进度
    if (action === 'get') {
      const { data } = await db.collection('study_progress')
        .where({ _openid: OPENID })
        .get()

      if (data.length === 0) {
        return { code: 0, progress: {}, wrong_book: [], has_data: false }
      }

      const record = data[0]
      return {
        code: 0,
        progress: record.progress || {},
        wrong_book: record.wrong_book || [],
        updated_at: record.updated_at,
        has_data: true
      }
    }

    // 仅同步单条进度记录（增量更新）
    if (action === 'updateItem') {
      const { item_id, record } = event

      if (!item_id || typeof item_id !== 'string' || item_id.length > 100) {
        return { code: -1, message: '题目ID参数非法' }
      }
      if (typeof record !== 'object' || record === null) {
        return { code: -1, message: '记录数据格式非法' }
      }

      const { data } = await db.collection('study_progress')
        .where({ _openid: OPENID })
        .get()

      const now = new Date().toISOString()

      if (data.length > 0) {
        const existing = data[0]
        const progress = existing.progress || {}
        progress[item_id] = { ...record, updatedAt: now }

        await db.collection('study_progress').doc(existing._id).update({
          data: { progress, updated_at: now }
        })
        return { code: 0, message: '进度已更新' }
      }

      // 新建
      const progress = {}
      progress[item_id] = { ...record, updatedAt: now }
      await db.collection('study_progress').add({
        data: {
          progress,
          wrong_book: [],
          created_at: now,
          updated_at: now
        }
      })
      return { code: 0, message: '进度已创建' }
    }

    // 同步错题本
    if (action === 'syncWrongBook') {
      const { wrong_book = [] } = event

      if (!Array.isArray(wrong_book)) {
        return { code: -1, message: '错题本数据格式非法' }
      }

      const { data } = await db.collection('study_progress')
        .where({ _openid: OPENID })
        .get()

      const now = new Date().toISOString()

      if (data.length > 0) {
        await db.collection('study_progress').doc(data[0]._id).update({
          data: { wrong_book: wrong_book, updated_at: now }
        })
        return { code: 0, message: '错题本已同步' }
      }

      await db.collection('study_progress').add({
        data: {
          progress: {},
          wrong_book: wrong_book,
          created_at: now,
          updated_at: now
        }
      })
      return { code: 0, message: '错题本已同步' }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[studyProgress] error:', err)
    return { code: -1, message: '操作失败' }
  }
}
