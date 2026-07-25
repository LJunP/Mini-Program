// 云函数 notificationSettings：通知设置读写
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
    // 获取通知设置
    if (action === 'get') {
      const { data } = await db.collection('notification_settings')
        .where({ _openid: OPENID })
        .get()

      if (data.length === 0) {
        return { code: 0, settings: null, has_data: false }
      }

      return {
        code: 0,
        settings: data[0].settings || {},
        updated_at: data[0].updated_at,
        has_data: true
      }
    }

    // 保存通知设置（全量覆盖）
    if (action === 'save') {
      const { settings } = event

      if (typeof settings !== 'object' || settings === null) {
        return { code: -1, message: '设置数据格式非法' }
      }

      const now = new Date().toISOString()
      const { data } = await db.collection('notification_settings')
        .where({ _openid: OPENID })
        .get()

      if (data.length > 0) {
        await db.collection('notification_settings').doc(data[0]._id).update({
          data: {
            settings,
            updated_at: now
          }
        })
        return { code: 0, message: '设置已保存', updated_at: now }
      }

      await db.collection('notification_settings').add({
        data: {
          settings,
          created_at: now,
          updated_at: now
        }
      })
      return { code: 0, message: '设置已保存', updated_at: now }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[notificationSettings] error:', err)
    return { code: -1, message: '操作失败' }
  }
}
