// 云函数 preferences：用户偏好设置读写
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
    // 获取偏好设置
    if (action === 'get') {
      const { data } = await db.collection('user_preferences')
        .where({ _openid: OPENID })
        .get()

      if (data.length === 0) {
        return { code: 0, preferences: null, has_data: false }
      }

      return {
        code: 0,
        preferences: data[0].preferences || {},
        updated_at: data[0].updated_at,
        has_data: true
      }
    }

    // 保存偏好设置（全量覆盖）
    if (action === 'save') {
      const { preferences } = event

      if (typeof preferences !== 'object' || preferences === null) {
        return { code: -1, message: '偏好数据格式非法' }
      }

      const now = new Date().toISOString()
      const { data } = await db.collection('user_preferences')
        .where({ _openid: OPENID })
        .get()

      if (data.length > 0) {
        await db.collection('user_preferences').doc(data[0]._id).update({
          data: {
            preferences,
            updated_at: now
          }
        })
        return { code: 0, message: '偏好已保存', updated_at: now }
      }

      await db.collection('user_preferences').add({
        data: {
          preferences,
          created_at: now,
          updated_at: now
        }
      })
      return { code: 0, message: '偏好已保存', updated_at: now }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[preferences] error:', err)
    return { code: -1, message: '操作失败', detail: err.message }
  }
}
