// 云函数 login：登录/注册
// 通过 openid 查找或创建用户记录
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  try {
    // 查找用户
    const { data } = await db.collection('users')
      .where({ _openid: OPENID })
      .get()

    if (data.length > 0) {
      // 老用户
      const u = data[0]
      return {
        code: 0,
        user: {
          id: u._id,
          nickname: u.nickname || '微信用户',
          avatarUrl: u.avatarUrl || '',
          bio: u.bio || '',
          gender: u.gender || 0,
          birthday: u.birthday || '',
          tags: u.tags || [],
          is_new: false
        }
      }
    }

    // 新用户，创建记录
    const now = Date.now()
    const newUser = {
      nickname: '微信用户',
      avatarUrl: '',
      bio: '',
      gender: 0,
      birthday: '',
      tags: [],
      created_at: now,
      updated_at: now
    }

    const addRes = await db.collection('users').add({ data: newUser })

    return {
      code: 0,
      user: {
        id: addRes._id,
        ...newUser,
        is_new: true
      }
    }
  } catch (err) {
    console.error('[login] error:', err)
    return { code: -1, message: '登录失败', detail: err.message }
  }
}
