// 云函数 login：登录/注册
// 通过 openid 查找或创建用户记录
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

function userDocumentId(openid) {
  const digest = crypto.createHash('sha256').update(openid).digest('hex')
  // 云数据库自定义文档 ID 保持在 32 个字符内。
  return digest.slice(0, 32)
}

function publicUser(user, isNew) {
  return {
    id: user._id,
    nickname: user.nickname || '微信用户',
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '',
    gender: user.gender || 0,
    birthday: user.birthday || '',
    tags: Array.isArray(user.tags) ? user.tags : [],
    is_new: isNew
  }
}

function safeErrorCode(err) {
  return String((err && (err.errCode || err.code)) || '').slice(0, 100)
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  try {
    // 查找用户
    const { data } = await db.collection('users')
      .where({ _openid: OPENID })
      .limit(1)
      .get()

    if (data.length > 0) {
      return { code: 0, user: publicUser(data[0], false) }
    }

    // 兼容旧随机 ID 记录；没有旧记录时，用确定性 ID 的原子新增避免冷启动并发重复创建。
    const deterministicId = userDocumentId(OPENID)
    const now = Date.now()
    const newUser = {
      _id: deterministicId,
      _openid: OPENID,
      nickname: '微信用户',
      avatarUrl: '',
      bio: '',
      gender: 0,
      birthday: '',
      tags: [],
      created_at: now,
      updated_at: now
    }
    let created
    try {
      await db.collection('users').add({ data: newUser })
      created = { user: newUser, isNew: true }
    } catch (createErr) {
      // 并发请求中只有一个能创建成功；其他请求读取同一个确定性文档。
      const existingResult = await db.collection('users').doc(deterministicId).get()
      const existing = existingResult && existingResult.data
      if (!existing || existing._openid !== OPENID) {
        throw createErr
      }
      created = { user: existing, isNew: false }
    }

    return {
      code: 0,
      user: publicUser(created.user, created.isNew)
    }
  } catch (err) {
    console.error('[login] operation failed:', JSON.stringify({
      code: safeErrorCode(err),
      name: String((err && err.name) || '').slice(0, 80)
    }))
    return { code: -1, message: '登录失败' }
  }
}
