// 云函数 updateProfile：更新用户资料
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const { nickname, avatarUrl, bio, gender, birthday, tags } = event

  // 输入校验
  if (nickname !== undefined) {
    if (typeof nickname !== 'string' || nickname.length > 30) {
      return { code: -1, message: '昵称参数非法' }
    }
  }
  if (avatarUrl !== undefined && typeof avatarUrl !== 'string') {
    return { code: -1, message: '头像参数非法' }
  }
  if (bio !== undefined && (typeof bio !== 'string' || bio.length > 200)) {
    return { code: -1, message: '简介过长' }
  }
  if (gender !== undefined && ![0, 1, 2].includes(gender)) {
    return { code: -1, message: '性别参数非法' }
  }
  if (birthday !== undefined && typeof birthday !== 'string') {
    return { code: -1, message: '生日参数非法' }
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || tags.length > 10) {
      return { code: -1, message: '标签参数非法' }
    }
  }

  const updateData = { updated_at: Date.now() }
  if (nickname !== undefined) updateData.nickname = nickname
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
  if (bio !== undefined) updateData.bio = bio
  if (gender !== undefined) updateData.gender = gender
  if (birthday !== undefined) updateData.birthday = birthday
  if (tags !== undefined) updateData.tags = tags

  try {
    const { data } = await db.collection('users')
      .where({ _openid: OPENID })
      .get()

    if (data.length === 0) {
      return { code: -1, message: '用户不存在' }
    }

    await db.collection('users').doc(data[0]._id).update({
      data: updateData
    })

    const updated = { ...data[0], ...updateData }
    delete updated._id
    delete updated._openid

    return {
      code: 0,
      user: {
        id: data[0]._id,
        nickname: updated.nickname || '微信用户',
        avatarUrl: updated.avatarUrl || '',
        bio: updated.bio || '',
        gender: updated.gender || 0,
        birthday: updated.birthday || '',
        tags: updated.tags || [],
        is_new: false
      }
    }
  } catch (err) {
    console.error('[updateProfile] error:', err)
    return { code: -1, message: '更新失败', detail: err.message }
  }
}
