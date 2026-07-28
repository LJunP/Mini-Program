// 云函数 ugc：用户投稿内容增删改查
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const { canReadPost } = require('./policy')
const {
  DOMAIN_KEYS,
  sanitizePost,
  sanitizePagination,
  sanitizeDomain,
  sanitizeAuthorName,
  safeRating
} = require('./validation')

const SERVER_BUILD = 'ugc-20260728-p0-4'
const REFERENCE_SCAN_PAGE_SIZE = 100
const REFERENCE_SCAN_MAX_POSTS = 5000
const ASSET_LOCK_TTL_MS = 30 * 1000
const ASSET_LOCK_WAIT_ATTEMPTS = 80
const ASSET_LOCK_WAIT_MS = 40

function safeArray(value, maxLength) {
  return Array.isArray(value) ? value.slice(0, maxLength) : []
}

function safeErrorReason(err) {
  const code = String((err && (err.errCode || err.code)) || '').slice(0, 100)
  if (code && /^[a-zA-Z0-9_.:-]+$/.test(code)) return code

  const message = String((err && err.message) || '').toLowerCase()
  if (message.includes('collection') && message.includes('not exist')) {
    return 'collection_not_found'
  }
  if (message.includes('index') && message.includes('required')) {
    return 'index_required'
  }
  if (message.includes('permission') || message.includes('authorized')) {
    return 'permission_denied'
  }
  return 'unknown'
}

function operationToken(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

function deterministicPostId(openid, clientId) {
  const digest = crypto.createHash('sha256')
    .update(`${openid}\u0000${clientId}`, 'utf8')
    .digest('hex')
  // 云数据库文档 ID 最长 32 字符；保留 120 bit 摘要且不暴露原始身份。
  return `u_${digest.slice(0, 30)}`
}

async function updatePostIf(postId, openid, predicate, updateData) {
  try {
    return await db.runTransaction(async transaction => {
      const docRef = transaction.collection('ugc_posts').doc(postId)
      const result = await docRef.get()
      const current = result && result.data
      if (
        !current ||
        current._openid !== openid ||
        !predicate(current)
      ) {
        return false
      }
      await docRef.update({ data: updateData })
      return true
    })
  } catch (err) {
    console.warn('[ugc] conditional update unavailable:', safeErrorReason(err))
    return false
  }
}

function allUgcFileIds(images) {
  return safeArray(images, 50).filter(fileId => (
    typeof fileId === 'string' &&
    fileId.startsWith('cloud://') &&
    fileId.includes('/ugc/')
  ))
}

function safeUserPathComponent(userId) {
  if (typeof userId !== 'string') return ''
  return userId.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100)
}

function ownedUgcFileIds(images, userId) {
  const safeUserId = safeUserPathComponent(userId)
  if (!safeUserId) return []
  const marker = `/ugc/${safeUserId}/`
  return allUgcFileIds(images).filter(fileId => fileId.includes(marker))
}

function validateImageOwnership(images, existing, userId) {
  if (images === undefined) return null
  const existingImages = safeArray(existing && existing.images, 9)
  const owned = new Set(ownedUgcFileIds(images, userId))
  for (const fileId of images) {
    if (owned.has(fileId) || existingImages.includes(fileId)) continue
    return '图片归属校验失败'
  }
  return null
}

async function validateNewImagesAccessible(images, existing) {
  if (images === undefined) return null
  const existingImages = new Set(safeArray(existing && existing.images, 9))
  const newImages = safeArray(images, 9).filter(fileId => !existingImages.has(fileId))
  if (newImages.length === 0) return null

  try {
    const result = await cloud.getTempFileURL({ fileList: newImages })
    const accessible = new Set()
    safeArray(result && result.fileList, newImages.length).forEach(item => {
      if (
        item &&
        item.status === 0 &&
        typeof item.fileID === 'string' &&
        typeof item.tempFileURL === 'string'
      ) {
        accessible.add(item.fileID)
      }
    })
    return newImages.every(fileId => accessible.has(fileId))
      ? null
      : '图片不可用或不属于当前环境'
  } catch (err) {
    return '图片不可用或不属于当前环境'
  }
}

async function deleteFilesConfirmed(fileList) {
  if (fileList.length === 0) return { deleted: [], failed: [] }
  const result = await cloud.deleteFile({ fileList })
  const statusByFileId = new Map()
  safeArray(result && result.fileList, fileList.length).forEach(item => {
    if (item && typeof item.fileID === 'string') {
      statusByFileId.set(item.fileID, Number(item.status))
    }
  })

  return fileList.reduce((summary, fileId) => {
    if (statusByFileId.get(fileId) === 0) summary.deleted.push(fileId)
    else summary.failed.push(fileId)
    return summary
  }, { deleted: [], failed: [] })
}

async function loadStableUserPosts(openid) {
  const query = db.collection('ugc_posts').where({ _openid: openid })
  const countResult = await query.count()
  const expectedTotal = Number(countResult && countResult.total)
  if (
    !Number.isInteger(expectedTotal) ||
    expectedTotal < 0 ||
    expectedTotal > REFERENCE_SCAN_MAX_POSTS
  ) {
    return { complete: false, posts: [], expectedTotal }
  }

  const posts = []
  const seenPostIds = new Set()
  for (
    let offset = 0;
    offset < expectedTotal;
    offset += REFERENCE_SCAN_PAGE_SIZE
  ) {
    const result = await db.collection('ugc_posts')
      .where({ _openid: openid })
      .skip(offset)
      .limit(REFERENCE_SCAN_PAGE_SIZE)
      .get()
    const page = safeArray(result && result.data, REFERENCE_SCAN_PAGE_SIZE)
    if (page.length === 0) {
      return { complete: false, posts: [], expectedTotal }
    }

    for (const post of page) {
      if (
        !post ||
        typeof post._id !== 'string' ||
        seenPostIds.has(post._id)
      ) {
        return { complete: false, posts: [], expectedTotal }
      }
      seenPostIds.add(post._id)
      posts.push(post)
    }

    if (
      page.length < REFERENCE_SCAN_PAGE_SIZE &&
      offset + page.length < expectedTotal
    ) {
      return { complete: false, posts: [], expectedTotal }
    }
  }

  const finalCountResult = await db.collection('ugc_posts')
    .where({ _openid: openid })
    .count()
  const finalTotal = Number(finalCountResult && finalCountResult.total)
  if (
    finalTotal !== expectedTotal ||
    seenPostIds.size !== expectedTotal
  ) {
    return { complete: false, posts: [], expectedTotal }
  }

  return { complete: true, posts, expectedTotal }
}

async function excludeFilesReferencedByOtherPosts(
  fileList,
  openid,
  excludedPostId
) {
  const candidates = Array.from(new Set(fileList))
  if (candidates.length === 0) {
    return { complete: true, deletable: [], referenced: [] }
  }

  const scan = await loadStableUserPosts(openid)
  if (!scan.complete) {
    return { complete: false, deletable: [], referenced: candidates }
  }

  const candidateSet = new Set(candidates)
  const referenced = new Set()
  scan.posts.forEach(post => {
    if (post._id === excludedPostId || post.status === 'deleted') return
    const references = allUgcFileIds(post.images)
    references.forEach(fileId => {
      if (candidateSet.has(fileId)) referenced.add(fileId)
    })
  })

  return {
    complete: true,
    deletable: candidates.filter(fileId => !referenced.has(fileId)),
    referenced: candidates.filter(fileId => referenced.has(fileId))
  }
}

async function validateImageClaims(images, openid, currentPostId) {
  if (images === undefined) return null
  const candidates = Array.from(new Set(allUgcFileIds(images)))
  if (candidates.length === 0) return null

  const scan = await loadStableUserPosts(openid)
  if (!scan.complete) {
    return '图片占用状态无法确认，请稍后重试'
  }

  for (const post of scan.posts) {
    const cleanupClaims = new Set([
      ...allUgcFileIds(post.media_cleanup_pending),
      ...allUgcFileIds(post.media_cleanup_manual),
      ...(post.status === 'deleting' ? allUgcFileIds(post.images) : [])
    ])
    if (candidates.some(fileId => cleanupClaims.has(fileId))) {
      return '图片正在清理，不能再次使用'
    }

    if (post._id === currentPostId || post.status === 'deleted') continue
    const postImages = new Set(allUgcFileIds(post.images))
    if (candidates.some(fileId => postImages.has(fileId))) {
      return '同一图片不能用于多篇投稿'
    }
  }

  return null
}

function samePostMutation(existing, post) {
  if (
    post.cloudId !== undefined &&
    post.cloudId !== existing._id
  ) {
    return false
  }
  if (
    post.id !== undefined &&
    post.id !== (existing.client_id || existing._id)
  ) {
    return false
  }
  const fields = [
    'title',
    'domain',
    'content',
    'tags',
    'images',
    'rating',
    'location',
    'linkedContent',
    'isPublic'
  ]
  return fields.every(field => (
    post[field] === undefined ||
    JSON.stringify(post[field]) === JSON.stringify(existing[field])
  ))
}

function sameNewPostPayload(existing, newPost) {
  if (
    !existing ||
    existing._openid !== newPost._openid ||
    existing.client_id !== newPost.client_id
  ) {
    return false
  }
  const fields = [
    'title',
    'domain',
    'content',
    'tags',
    'images',
    'rating',
    'location',
    'linkedContent',
    'isPublic',
    'status'
  ]
  return fields.every(field => (
    JSON.stringify(existing[field]) === JSON.stringify(newPost[field])
  ))
}

async function attachAuthorizedImageUrls(posts) {
  const fileIds = []
  posts.forEach(post => {
    allUgcFileIds(post.images).forEach(fileId => {
      if (!fileIds.includes(fileId)) fileIds.push(fileId)
    })
  })
  if (fileIds.length === 0) return posts

  const urlMap = new Map()
  for (let index = 0; index < fileIds.length; index += 50) {
    const fileList = fileIds.slice(index, index + 50)
    try {
      const result = await cloud.getTempFileURL({ fileList })
      safeArray(result && result.fileList, 50).forEach(item => {
        if (
          item &&
          item.status === 0 &&
          typeof item.fileID === 'string' &&
          typeof item.tempFileURL === 'string'
        ) {
          urlMap.set(item.fileID, item.tempFileURL)
        }
      })
    } catch (err) {
      console.warn('[ugc] authorized image URL unavailable:', fileList.length)
    }
  }

  return posts.map(post => ({
    ...post,
    // 对非作者只返回成功签发的临时 URL；签发失败时不泄露稳定 File ID。
    images: safeArray(post.images, 9)
      .map(fileId => urlMap.get(fileId))
      .filter(Boolean)
  }))
}

function serializePost(item, openid, includeAuthor) {
  const post = {
    id: item._id,
    client_id: item.client_id || '',
    title: typeof item.title === 'string' ? item.title : '',
    domain: DOMAIN_KEYS.includes(item.domain) ? item.domain : 'tea',
    content: typeof item.content === 'string' ? item.content : '',
    tags: safeArray(item.tags, 8),
    images: safeArray(item.images, 9),
    rating: safeRating(item.rating),
    location: typeof item.location === 'string' ? item.location : '',
    linkedContent: item.linkedContent || null,
    status: typeof item.status === 'string'
      ? item.status
      : (item.isPublic === true ? 'pending' : 'private'),
    media_cleanup_pending: safeArray(item.media_cleanup_pending, 18).length > 0,
    isPublic: item.isPublic === true,
    likeCount: Number.isFinite(item.likeCount) ? item.likeCount : 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
    is_mine: item._openid === openid
  }
  if (includeAuthor) {
    post.authorName = sanitizeAuthorName(item.authorName)
  }
  return post
}

async function resolveUserProfile(openid) {
  try {
    const { data } = await db.collection('users')
      .where({ _openid: openid })
      .limit(1)
      .get()
    const user = data[0] || null
    return {
      documentId: user && typeof user._id === 'string' ? user._id : '',
      userId: safeUserPathComponent(user && user._id),
      authorName: sanitizeAuthorName(user && user.nickname)
    }
  } catch (err) {
    console.warn('[ugc] user profile unavailable')
    return { documentId: '', userId: '', authorName: '微信用户' }
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function tryAcquireAssetLock(userDocumentId, token) {
  const now = Date.now()
  return db.runTransaction(async transaction => {
    const userRef = transaction.collection('users').doc(userDocumentId)
    const result = await userRef.get()
    const user = result && result.data
    if (!user) return false

    const currentToken = typeof user.ugc_asset_lock_token === 'string'
      ? user.ugc_asset_lock_token
      : ''
    const lockedUntil = Number(user.ugc_asset_lock_until) || 0
    if (currentToken && currentToken !== token && lockedUntil > now) {
      return false
    }

    await userRef.update({
      data: {
        ugc_asset_lock_token: token,
        ugc_asset_lock_until: now + ASSET_LOCK_TTL_MS
      }
    })
    return true
  })
}

async function releaseAssetLock(userDocumentId, token) {
  try {
    await db.runTransaction(async transaction => {
      const userRef = transaction.collection('users').doc(userDocumentId)
      const result = await userRef.get()
      const user = result && result.data
      if (!user || user.ugc_asset_lock_token !== token) return false
      await userRef.update({
        data: {
          ugc_asset_lock_token: '',
          ugc_asset_lock_until: 0
        }
      })
      return true
    })
  } catch (err) {
    console.warn('[ugc] asset lock release pending:', safeErrorReason(err))
  }
}

async function withUserAssetLock(openid, worker) {
  const profile = await resolveUserProfile(openid)
  if (!profile.documentId || !profile.userId) {
    return {
      code: -1,
      message: '账号资料尚未就绪，请重新登录',
      server_build: SERVER_BUILD
    }
  }

  const token = operationToken('asset-lock')
  let acquired = false
  for (let attempt = 0; attempt < ASSET_LOCK_WAIT_ATTEMPTS; attempt++) {
    acquired = await tryAcquireAssetLock(profile.documentId, token)
    if (acquired) break
    await wait(ASSET_LOCK_WAIT_MS)
  }
  if (!acquired) {
    return {
      code: -5,
      busy: true,
      message: '投稿正在处理中，请稍后重试',
      server_build: SERVER_BUILD
    }
  }

  try {
    return await worker(profile)
  } finally {
    await releaseAssetLock(profile.documentId, token)
  }
}

async function findExistingPost(post, openid) {
  let existing = []
  if (post.cloudId) {
    const { data } = await db.collection('ugc_posts')
      .where({ _openid: openid, _id: post.cloudId })
      .limit(1)
      .get()
    existing = data
  }

  if (existing.length === 0 && post.id) {
    const { data } = await db.collection('ugc_posts')
      .where({ _openid: openid, client_id: post.id })
      .limit(1)
      .get()
    existing = data
  }

  // 兼容 client_id 上线前，本地 ID 就是云端文档 ID 的记录。
  if (existing.length === 0 && post.id) {
    const { data } = await db.collection('ugc_posts')
      .where({ _openid: openid, _id: post.id })
      .limit(1)
      .get()
    existing = data
  }
  return existing[0] || null
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '无法获取 openid' }
  }

  const action = event && event.action
  if (!action || typeof action !== 'string' || action.length > 20) {
    return { code: -1, message: '参数非法' }
  }

  try {
    if (action === 'save') {
      const validated = sanitizePost(event.post)
      if (validated.error) {
        return { code: -1, message: validated.error }
      }
      const post = validated.post
      return withUserAssetLock(OPENID, async profile => {
      const now = new Date().toISOString()
      const authorName = profile.authorName
      const existing = await findExistingPost(post, OPENID)
      const imageOwnershipError = validateImageOwnership(
        post.images,
        existing,
        profile.userId
      )
      if (imageOwnershipError) {
        return { code: -1, message: imageOwnershipError }
      }
      const imageClaimError = await validateImageClaims(
        post.images,
        OPENID,
        existing && existing._id
      )
      if (imageClaimError) {
        return {
          code: -3,
          image_claimed: true,
          message: imageClaimError,
          server_build: SERVER_BUILD
        }
      }
      const imageAvailabilityError = await validateNewImagesAccessible(
        post.images,
        existing
      )
      if (imageAvailabilityError) {
        return { code: -1, message: imageAvailabilityError }
      }

      if (existing) {
        const hasContentMutation = [
          'title',
          'domain',
          'content',
          'tags',
          'images',
          'rating',
          'location',
          'linkedContent'
        ].some(field => post[field] !== undefined)
        const hasUserMutation = hasContentMutation || post.isPublic !== undefined
        if (
          (existing.status === 'deleting' || existing.status === 'deleted') &&
          hasUserMutation
        ) {
          return {
            code: -4,
            deleted: existing.status === 'deleted',
            message: existing.status === 'deleted'
              ? '投稿已删除，不能恢复'
              : '投稿正在删除，不能继续编辑'
          }
        }
        const hasPendingCleanup = safeArray(
          existing.media_cleanup_pending,
          18
        ).length > 0
        const isStrictNoChange = (
          !hasPendingCleanup &&
          existing.status !== 'deleting' &&
          existing.status !== 'deleted' &&
          samePostMutation(existing, post)
        )
        if (!existing.updated_at) {
          if (isStrictNoChange) {
            return {
              code: 0,
              id: existing._id,
              client_id: existing.client_id || post.id || existing._id,
              updated_at: '',
              media_cleanup_pending: false,
              status: existing.status || (
                existing.isPublic === true ? 'pending' : 'private'
              ),
              no_change: true,
              migration_required: true,
              server_build: SERVER_BUILD,
              message: '投稿已存在'
            }
          }
          return {
            code: -2,
            conflict: true,
            version_required: true,
            migration_required: true,
            current_updated_at: '',
            message: '历史投稿缺少版本，请迁移后重试'
          }
        }
        if (!post.baseUpdatedAt) {
          if (isStrictNoChange) {
            return {
              code: 0,
              id: existing._id,
              client_id: existing.client_id || post.id || existing._id,
              updated_at: existing.updated_at,
              media_cleanup_pending: false,
              status: existing.status || (
                existing.isPublic === true ? 'pending' : 'private'
              ),
              no_change: true,
              server_build: SERVER_BUILD,
              message: '投稿已存在'
            }
          }
          return {
            code: -2,
            conflict: true,
            version_required: true,
            current_updated_at: existing.updated_at,
            message: '投稿版本缺失，请刷新后重试'
          }
        }
        if (post.baseUpdatedAt !== existing.updated_at) {
          return {
            code: -2,
            conflict: true,
            current_updated_at: existing.updated_at,
            message: '投稿已在其他设备更新，请刷新后重试'
          }
        }
        const updateData = { updated_at: now, authorName }
        if (post.title !== undefined) updateData.title = post.title
        if (post.domain !== undefined) updateData.domain = post.domain
        if (post.content !== undefined) updateData.content = post.content
        if (post.tags !== undefined) updateData.tags = post.tags
        if (post.images !== undefined) updateData.images = post.images
        if (post.rating !== undefined) updateData.rating = post.rating
        if (post.location !== undefined) updateData.location = post.location
        if (post.linkedContent !== undefined) updateData.linkedContent = post.linkedContent
        if (post.isPublic !== undefined) updateData.isPublic = post.isPublic === true
        if (post.id !== undefined) updateData.client_id = post.id

        let nextStatus = existing.status || (
          existing.isPublic === true ? 'pending' : 'private'
        )
        if (post.isPublic === false) {
          nextStatus = 'private'
        } else if (
          post.isPublic === true &&
          (existing.isPublic !== true || hasContentMutation)
        ) {
          nextStatus = 'pending'
        } else if (existing.isPublic === true && hasContentMutation) {
          nextStatus = 'pending'
        }
        if (nextStatus !== existing.status) updateData.status = nextStatus

        const previousPending = ownedUgcFileIds(
          existing.media_cleanup_pending,
          profile.userId
        )
        const nextImages = post.images === undefined
          ? safeArray(existing.images, 9)
          : post.images
        const removedImages = ownedUgcFileIds(existing.images, profile.userId)
          .filter(fileId => !nextImages.includes(fileId))
        const cleanupFiles = Array.from(new Set([
          ...previousPending,
          ...removedImages
        ]))
        const cleanupToken = cleanupFiles.length > 0
          ? operationToken('edit-cleanup')
          : ''
        if (cleanupFiles.length > 0) {
          updateData.media_cleanup_pending = cleanupFiles
          updateData.media_cleanup_token = cleanupToken
        }

        const updated = await updatePostIf(
          existing._id,
          OPENID,
          current => (
            current.updated_at === post.baseUpdatedAt &&
            current.status !== 'deleting' &&
            current.status !== 'deleted'
          ),
          updateData
        )
        if (!updated) {
          return {
            code: -2,
            conflict: true,
            message: '投稿已在其他设备更新，请刷新后重试'
          }
        }

        let mediaCleanupPending = cleanupFiles.length > 0
        if (cleanupFiles.length > 0) {
          try {
            const referenceResult = await excludeFilesReferencedByOtherPosts(
              cleanupFiles,
              OPENID,
              existing._id
            )
            if (!referenceResult.complete) {
              console.warn(
                '[ugc] removed media reference scan incomplete:',
                cleanupFiles.length
              )
              return {
                code: 0,
                id: existing._id,
                client_id: post.id || existing.client_id || existing._id,
                updated_at: now,
                media_cleanup_pending: true,
                status: nextStatus,
                server_build: SERVER_BUILD,
                message: '投稿已更新，图片清理待重试'
              }
            }
            const cleanupResult = await deleteFilesConfirmed(
              referenceResult.deletable
            )
            const queueUpdated = await updatePostIf(
              existing._id,
              OPENID,
              current => (
                current.media_cleanup_token === cleanupToken &&
                current.updated_at === now
              ),
              {
                media_cleanup_pending: cleanupResult.failed,
                media_cleanup_token: ''
              }
            )
            mediaCleanupPending = !queueUpdated ||
              cleanupResult.failed.length > 0
            if (cleanupResult.failed.length > 0) {
              console.warn(
                '[ugc] removed media cleanup pending:',
                cleanupResult.failed.length
              )
            }
          } catch (err) {
            console.warn('[ugc] removed media cleanup pending:', cleanupFiles.length)
          }
        }

        return {
          code: 0,
          id: existing._id,
          client_id: post.id || existing.client_id || existing._id,
          updated_at: now,
          media_cleanup_pending: mediaCleanupPending,
          status: nextStatus,
          server_build: SERVER_BUILD,
          message: '投稿已更新'
        }
      }

      if (!post.id) {
        return { code: -1, message: '新建投稿缺少本地ID' }
      }
      const newPostId = deterministicPostId(OPENID, post.id)
      const newPost = {
        _openid: OPENID,
        client_id: post.id,
        title: post.title || '',
        domain: post.domain || 'tea',
        content: post.content || '',
        tags: post.tags || [],
        images: post.images || [],
        rating: post.rating || 0,
        location: post.location || '',
        linkedContent: post.linkedContent || null,
        // 公开投稿先进入人工审核队列；审核通过前不进入社区 Feed。
        status: post.isPublic === true ? 'pending' : 'private',
        // 隐私优先：字段缺失一律按私密处理。
        isPublic: post.isPublic === true,
        authorName,
        likeCount: 0,
        media_cleanup_pending: [],
        created_at: now,
        updated_at: now
      }

      // 显式 _id 的原子新增：同一 OPENID + client_id 只能由一个请求创建。
      // 重复请求只在完整业务载荷一致时按幂等成功处理，绝不覆盖先写内容。
      try {
        await db.collection('ugc_posts').add({
          data: { _id: newPostId, ...newPost }
        })
      } catch (createErr) {
        let concurrentExisting = null
        try {
          const result = await db.collection('ugc_posts').doc(newPostId).get()
          concurrentExisting = result && result.data
        } catch (readErr) {
          throw createErr
        }
        if (!sameNewPostPayload(concurrentExisting, newPost)) {
          return {
            code: -2,
            conflict: true,
            current_updated_at: concurrentExisting &&
              concurrentExisting._openid === OPENID
              ? concurrentExisting.updated_at || ''
              : '',
            message: '同一本地ID已用于其他投稿，请刷新后重试',
            server_build: SERVER_BUILD
          }
        }
        return {
          code: 0,
          id: concurrentExisting._id,
          client_id: concurrentExisting.client_id,
          updated_at: concurrentExisting.updated_at || '',
          media_cleanup_pending: safeArray(
            concurrentExisting.media_cleanup_pending,
            18
          ).length > 0,
          status: concurrentExisting.status || (
            concurrentExisting.isPublic === true ? 'pending' : 'private'
          ),
          no_change: true,
          server_build: SERVER_BUILD,
          message: '投稿已存在'
        }
      }
      return {
        code: 0,
        id: newPostId,
        client_id: newPost.client_id,
        updated_at: now,
        status: newPost.status,
        post: { ...newPost, id: newPostId },
        server_build: SERVER_BUILD,
        message: '投稿已发布'
      }
      })
    }

    if (action === 'delete') {
      if (
        typeof event.id !== 'string' ||
        event.id.length === 0 ||
        event.id.length > 100
      ) {
        return { code: -1, message: 'ID参数非法' }
      }
      if (event.clientId !== undefined) {
        const clientIdCheck = sanitizePost({ id: event.clientId })
        if (clientIdCheck.error) {
          return { code: -1, message: '本地ID参数非法' }
        }
      }
      const deleteVersionCheck = sanitizePost({
        baseUpdatedAt: event.baseUpdatedAt
      })
      if (deleteVersionCheck.error) {
        return { code: -1, message: deleteVersionCheck.error }
      }
      const deleteBaseUpdatedAt = deleteVersionCheck.post.baseUpdatedAt

      return withUserAssetLock(OPENID, async profile => {
      const existing = await findExistingPost({
        cloudId: event.id,
        id: event.clientId
      }, OPENID)
      if (!existing) {
        return {
          code: 0,
          removed: 0,
          tombstoned: true,
          file_cleanup_pending: false,
          server_build: SERVER_BUILD,
          message: '投稿已不存在'
        }
      }
      if (existing.status === 'deleted') {
        return {
          code: 0,
          removed: 1,
          tombstoned: true,
          file_cleanup_pending: false,
          updated_at: existing.updated_at,
          server_build: SERVER_BUILD,
          message: '已删除'
        }
      }
      if (!existing.updated_at) {
        return {
          code: -2,
          conflict: true,
          version_required: true,
          migration_required: true,
          current_updated_at: '',
          message: '历史投稿缺少版本，请迁移后重试'
        }
      }
      if (!deleteBaseUpdatedAt) {
        return {
          code: -2,
          conflict: true,
          version_required: true,
          current_updated_at: existing.updated_at,
          message: '投稿版本缺失，请刷新后重试'
        }
      }
      if (deleteBaseUpdatedAt !== existing.updated_at) {
        return {
          code: -2,
          conflict: true,
          current_updated_at: existing.updated_at,
          message: '投稿已在其他设备更新，请刷新后重试'
        }
      }

      const allFiles = Array.from(new Set([
        ...allUgcFileIds(existing.images),
        ...allUgcFileIds(existing.media_cleanup_pending)
      ]))
      const fileList = Array.from(new Set([
        ...ownedUgcFileIds(existing.images, profile.userId),
        ...ownedUgcFileIds(existing.media_cleanup_pending, profile.userId)
      ]))
      const manualFiles = allFiles.filter(fileId => !fileList.includes(fileId))
      const deletingAt = new Date().toISOString()
      const deleteToken = operationToken('delete')
      const deletingData = {
        status: 'deleting',
        isPublic: false,
        media_cleanup_pending: fileList,
        media_cleanup_manual: manualFiles,
        media_delete_token: deleteToken,
        updated_at: deletingAt
      }

      // 先进入墓碑态并停止公开，再执行文件清理；失败时记录仍可重试。
      const markedDeleting = await updatePostIf(
        existing._id,
        OPENID,
        current => (
          current.updated_at === deleteBaseUpdatedAt &&
          current.status !== 'deleted'
        ),
        deletingData
      )
      if (!markedDeleting) {
        return {
          code: -2,
          conflict: true,
          message: '投稿已在其他设备更新，请刷新后重试'
        }
      }

      if (manualFiles.length > 0) {
        return {
          code: -3,
          cleanup_pending: true,
          manual_cleanup_required: true,
          hidden: true,
          updated_at: deletingAt,
          server_build: SERVER_BUILD,
          message: '投稿已停止公开，历史图片需要人工清理'
        }
      }

      if (fileList.length > 0) {
        try {
          const referenceResult = await excludeFilesReferencedByOtherPosts(
            fileList,
            OPENID,
            existing._id
          )
          if (!referenceResult.complete) {
            console.warn(
              '[ugc] delete media reference scan incomplete:',
              fileList.length
            )
            return {
              code: -2,
              cleanup_pending: true,
              hidden: true,
              updated_at: deletingAt,
              server_build: SERVER_BUILD,
              message: '投稿已停止公开，图片引用检查待重试'
            }
          }
          const cleanupResult = await deleteFilesConfirmed(
            referenceResult.deletable
          )
          if (cleanupResult.failed.length > 0) {
            await updatePostIf(
              existing._id,
              OPENID,
              current => (
                current.status === 'deleting' &&
                current.media_delete_token === deleteToken
              ),
              {
                images: cleanupResult.failed,
                media_cleanup_pending: cleanupResult.failed
              }
            )
            console.warn('[ugc] media cleanup pending:', cleanupResult.failed.length)
            return {
              code: -2,
              cleanup_pending: true,
              hidden: true,
              updated_at: deletingAt,
              server_build: SERVER_BUILD,
              message: '投稿已停止公开，图片清理待重试'
            }
          }
        } catch (err) {
          console.warn('[ugc] media cleanup pending:', fileList.length)
          return {
            code: -2,
            cleanup_pending: true,
            hidden: true,
            updated_at: deletingAt,
            server_build: SERVER_BUILD,
            message: '投稿已停止公开，图片清理待重试'
          }
        }
      }

      const deletedAt = new Date().toISOString()
      const tombstoned = await updatePostIf(
        existing._id,
        OPENID,
        current => (
          current.status === 'deleting' &&
          current.media_delete_token === deleteToken
        ),
        {
          status: 'deleted',
          isPublic: false,
          title: '',
          content: '',
          tags: [],
          images: [],
          rating: 0,
          location: '',
          linkedContent: null,
          media_cleanup_pending: [],
          media_cleanup_manual: [],
          media_delete_token: '',
          deleted_at: deletedAt,
          updated_at: deletedAt
        }
      )
      if (!tombstoned) {
        return {
          code: -2,
          cleanup_pending: true,
          hidden: true,
          updated_at: deletingAt,
          server_build: SERVER_BUILD,
          message: '投稿已停止公开，数据库清理待重试'
        }
      }

      return {
        code: 0,
        removed: 1,
        tombstoned: true,
        file_cleanup_pending: false,
        updated_at: deletedAt,
        server_build: SERVER_BUILD,
        message: '已删除'
      }
      })
    }

    if (action === 'getMyPosts') {
      const domainResult = sanitizeDomain(event.domain)
      const pageResult = sanitizePagination(event.page, event.pageSize)
      if (domainResult.error || pageResult.error) {
        return { code: -1, message: domainResult.error || pageResult.error }
      }
      const { domain } = domainResult
      const { page, pageSize } = pageResult
      let query = db.collection('ugc_posts').where({ _openid: OPENID })
      if (domain !== 'all') {
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
        list: list.map(item => serializePost(item, OPENID, false)),
        total_count: list.length,
        has_more: list.length === pageSize,
        server_build: SERVER_BUILD
      }
    }

    if (action === 'getCommunityFeed') {
      const domainResult = sanitizeDomain(event.domain)
      const pageResult = sanitizePagination(event.page, event.pageSize)
      if (domainResult.error || pageResult.error) {
        return { code: -1, message: domainResult.error || pageResult.error }
      }
      const { domain } = domainResult
      const { page, pageSize } = pageResult
      let query = db.collection('ugc_posts').where({
        isPublic: true,
        status: 'approved'
      })
      if (domain !== 'all') {
        query = db.collection('ugc_posts').where({
          isPublic: true,
          status: 'approved',
          domain
        })
      }

      const { data: list } = await query
        .orderBy('created_at', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()

      const serialized = await attachAuthorizedImageUrls(
        list.map(item => serializePost(item, OPENID, true))
      )
      return {
        code: 0,
        list: serialized,
        total_count: list.length,
        has_more: list.length === pageSize
      }
    }

    if (action === 'getById') {
      if (
        typeof event.id !== 'string' ||
        event.id.length === 0 ||
        event.id.length > 100
      ) {
        return { code: -1, message: 'ID参数非法' }
      }
      const { data } = await db.collection('ugc_posts').doc(event.id).get()
      if (!data || data.status === 'deleted' || !canReadPost(data, OPENID)) {
        return { code: -1, message: '投稿不存在或无权访问' }
      }
      const serializedPost = serializePost(data, OPENID, data.isPublic === true)
      const serialized = data._openid === OPENID
        ? [serializedPost]
        : await attachAuthorizedImageUrls([serializedPost])
      return {
        code: 0,
        post: serialized[0]
      }
    }

    if (action === 'getStats') {
      const scan = await loadStableUserPosts(OPENID)
      if (!scan.complete) {
        return {
          code: -2,
          pagination_incomplete: true,
          message: '投稿统计暂不可用，请稍后重试',
          server_build: SERVER_BUILD
        }
      }
      const activePosts = scan.posts.filter(post => post.status !== 'deleted')
      const stats = { total: activePosts.length, byDomain: {} }
      DOMAIN_KEYS.forEach(domain => {
        stats.byDomain[domain] = activePosts
          .filter(post => post.domain === domain)
          .length
      })
      return { code: 0, stats }
    }

    return { code: -1, message: '未知操作: ' + action }
  } catch (err) {
    // 仅记录诊断元数据，不写入 OPENID、事件正文或数据库记录。
    console.error('[ugc] operation failed:', JSON.stringify({
      action,
      code: (err && (err.errCode || err.code)) || '',
      name: String((err && err.name) || '').slice(0, 80)
    }))
    return {
      code: -1,
      message: '操作失败',
      reason: safeErrorReason(err),
      server_build: SERVER_BUILD
    }
  }
}
