// 云函数 ugc：用户投稿内容增删改查
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

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
    // 新建/更新投稿
    if (action === 'save') {
      const { post } = event

      if (typeof post !== 'object' || post === null) {
        return { code: -1, message: '投稿数据格式非法' }
      }

      // 基础字段校验
      if (post.title && (typeof post.title !== 'string' || post.title.length > 200)) {
        return { code: -1, message: '标题过长' }
      }
      if (post.content && (typeof post.content !== 'string' || post.content.length > 10000)) {
        return { code: -1, message: '内容过长' }
      }
      if (post.domain && (typeof post.domain !== 'string' || post.domain.length > 30)) {
        return { code: -1, message: '板块参数非法' }
      }

      const now = new Date().toISOString()

      // 更新已有投稿
      if (post.id) {
        const { data } = await db.collection('ugc_posts')
          .where({ _openid: OPENID, _id: post.id })
          .get()

        if (data.length > 0) {
          const updateData = {}
          if (post.title !== undefined) updateData.title = post.title
          if (post.domain !== undefined) updateData.domain = post.domain
          if (post.content !== undefined) updateData.content = post.content
          if (post.tags !== undefined) updateData.tags = post.tags
          if (post.images !== undefined) updateData.images = post.images
          if (post.rating !== undefined) updateData.rating = post.rating
          if (post.location !== undefined) updateData.location = post.location
          if (post.linkedContent !== undefined) updateData.linkedContent = post.linkedContent
          if (post.isPublic !== undefined) updateData.isPublic = post.isPublic
          updateData.updated_at = now

          await db.collection('ugc_posts').doc(data[0]._id).update({
            data: updateData
          })

          return { code: 0, id: data[0]._id, message: '投稿已更新' }
        }
      }

      // 新建投稿
      const newPost = {
        title: post.title || '',
        domain: post.domain || 'tea',
        content: post.content || '',
        tags: post.tags || [],
        images: post.images || [],
        rating: post.rating || 0,
        location: post.location || '',
        linkedContent: post.linkedContent || null,
        status: 'published',
        isPublic: post.isPublic !== false,
        likeCount: 0,
        created_at: now,
        updated_at: now
      }

      const addRes = await db.collection('ugc_posts').add({ data: newPost })

      return { code: 0, id: addRes._id, post: { ...newPost, id: addRes._id }, message: '投稿已发布' }
    }

    // 删除投稿
    if (action === 'delete') {
      const { id } = event

      if (!id || typeof id !== 'string' || id.length > 100) {
        return { code: -1, message: 'ID参数非法' }
      }

      await db.collection('ugc_posts')
        .where({ _openid: OPENID, _id: id })
        .remove()

      return { code: 0, message: '已删除' }
    }

    // 获取我的投稿列表
    if (action === 'getMyPosts') {
      const { domain, page = 1, pageSize = 50 } = event

      let query = db.collection('ugc_posts').where({ _openid: OPENID })

      if (domain && domain !== 'all') {
        query = db.collection('ugc_posts').where({
          _openid: OPENID,
          domain
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
          title: item.title,
          domain: item.domain,
          content: item.content,
          tags: item.tags || [],
          images: item.images || [],
          rating: item.rating || 0,
          location: item.location || '',
          linkedContent: item.linkedContent || null,
          isPublic: item.isPublic !== false,
          likeCount: item.likeCount || 0,
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        total_count: list.length
      }
    }

    // 获取社区 Feed（公开投稿）
    if (action === 'getCommunityFeed') {
      const { domain, page = 1, pageSize = 50 } = event

      let query = db.collection('ugc_posts').where({ isPublic: true })

      if (domain && domain !== 'all') {
        query = db.collection('ugc_posts').where({
          isPublic: true,
          domain
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
          title: item.title,
          domain: item.domain,
          content: item.content,
          tags: item.tags || [],
          images: item.images || [],
          rating: item.rating || 0,
          location: item.location || '',
          linkedContent: item.linkedContent || null,
          authorName: item.authorName || '匿名用户',
          likeCount: item.likeCount || 0,
          created_at: item.created_at,
          is_mine: item._openid === OPENID
        })),
        total_count: list.length
      }
    }

    // 获取单条投稿详情
    if (action === 'getById') {
      const { id } = event

      if (!id || typeof id !== 'string' || id.length > 100) {
        return { code: -1, message: 'ID参数非法' }
      }

      const { data } = await db.collection('ugc_posts').doc(id).get()

      if (!data) {
        return { code: -1, message: '投稿不存在' }
      }

      return {
        code: 0,
        post: {
          id: data._id,
          title: data.title,
          domain: data.domain,
          content: data.content,
          tags: data.tags || [],
          images: data.images || [],
          rating: data.rating || 0,
          location: data.location || '',
          linkedContent: data.linkedContent || null,
          isPublic: data.isPublic !== false,
          likeCount: data.likeCount || 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_mine: data._openid === OPENID
        }
      }
    }

    // 获取投稿统计
    if (action === 'getStats') {
      const { data: allPosts } = await db.collection('ugc_posts')
        .where({ _openid: OPENID })
        .get()

      const stats = { total: allPosts.length, byDomain: {} }
      const domains = ['tea', 'travel', 'incense', 'music', 'film', 'wellness']
      domains.forEach(d => {
        stats.byDomain[d] = allPosts.filter(p => p.domain === d).length
      })

      return { code: 0, stats }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    console.error('[ugc] error:', err)
    return { code: -1, message: '操作失败', detail: err.message }
  }
}
