const DOMAIN_KEYS = ['tea', 'travel', 'incense', 'music', 'film', 'wellness']
const DOMAIN_SET = new Set(DOMAIN_KEYS)

function optionalId(value, label) {
  if (value === undefined) return { value: undefined }
  if (typeof value !== 'string' || value.length === 0 || value.length > 100) {
    return { error: `${label}参数非法` }
  }
  return { value }
}

function optionalText(value, maxLength, label, trim) {
  if (value === undefined) return { value: undefined }
  if (typeof value !== 'string' || value.length > maxLength) {
    return { error: `${label}参数非法` }
  }
  return { value: trim ? value.trim() : value }
}

function sanitizeTags(tags) {
  if (tags === undefined) return { value: undefined }
  if (!Array.isArray(tags) || tags.length > 8) {
    return { error: '标签参数非法' }
  }

  const normalized = []
  for (const tag of tags) {
    if (typeof tag !== 'string') return { error: '标签参数非法' }
    const value = tag.trim()
    if (!value || value.length > 30) return { error: '标签参数非法' }
    if (!normalized.includes(value)) normalized.push(value)
  }
  return { value: normalized }
}

function sanitizeImages(images) {
  if (images === undefined) return { value: undefined }
  if (!Array.isArray(images) || images.length > 9) {
    return { error: '图片参数非法' }
  }

  for (const image of images) {
    if (
      typeof image !== 'string' ||
      image.length === 0 ||
      image.length > 500 ||
      !image.startsWith('cloud://')
    ) {
      return { error: '图片参数非法' }
    }
  }
  return { value: images.slice() }
}

function sanitizeLinkedContent(linkedContent) {
  if (linkedContent === undefined) return { value: undefined }
  if (linkedContent === null) return { value: null }
  if (
    typeof linkedContent !== 'object' ||
    Array.isArray(linkedContent)
  ) {
    return { error: '关联内容参数非法' }
  }

  const clean = {}
  const textFields = {
    id: 100,
    refId: 100,
    title: 200,
    refTitle: 200
  }
  for (const [key, maxLength] of Object.entries(textFields)) {
    if (linkedContent[key] === undefined) continue
    const result = optionalText(linkedContent[key], maxLength, '关联内容', true)
    if (result.error || !result.value) return { error: '关联内容参数非法' }
    clean[key] = result.value
  }

  for (const key of ['domain', 'refDomain']) {
    if (linkedContent[key] === undefined) continue
    if (typeof linkedContent[key] !== 'string' || !DOMAIN_SET.has(linkedContent[key])) {
      return { error: '关联内容参数非法' }
    }
    clean[key] = linkedContent[key]
  }

  if (Object.keys(clean).length === 0) {
    return { error: '关联内容参数非法' }
  }
  return { value: clean }
}

function sanitizePost(post) {
  if (!post || typeof post !== 'object' || Array.isArray(post)) {
    return { error: '投稿数据格式非法' }
  }

  const clean = {}
  const id = optionalId(post.id, '本地ID')
  if (id.error) return id
  if (id.value !== undefined) clean.id = id.value

  const cloudId = optionalId(post.cloudId, '云端ID')
  if (cloudId.error) return cloudId
  if (cloudId.value !== undefined) clean.cloudId = cloudId.value

  const baseUpdatedAt = optionalText(post.baseUpdatedAt, 50, '版本', false)
  if (baseUpdatedAt.error) return baseUpdatedAt
  if (baseUpdatedAt.value !== undefined) {
    if (Number.isNaN(Date.parse(baseUpdatedAt.value))) {
      return { error: '版本参数非法' }
    }
    clean.baseUpdatedAt = baseUpdatedAt.value
  }

  const title = optionalText(post.title, 200, '标题', true)
  if (title.error) return title
  if (title.value !== undefined) clean.title = title.value

  const content = optionalText(post.content, 10000, '正文', true)
  if (content.error) return content
  if (content.value !== undefined) clean.content = content.value

  if (post.domain !== undefined) {
    if (typeof post.domain !== 'string' || !DOMAIN_SET.has(post.domain)) {
      return { error: '板块参数非法' }
    }
    clean.domain = post.domain
  }

  const tags = sanitizeTags(post.tags)
  if (tags.error) return tags
  if (tags.value !== undefined) clean.tags = tags.value

  const images = sanitizeImages(post.images)
  if (images.error) return images
  if (images.value !== undefined) clean.images = images.value

  if (post.rating !== undefined) {
    if (!Number.isInteger(post.rating) || post.rating < 0 || post.rating > 5) {
      return { error: '评分参数非法' }
    }
    clean.rating = post.rating
  }

  const location = optionalText(post.location, 100, '地点', true)
  if (location.error) return location
  if (location.value !== undefined) clean.location = location.value

  const linkedContent = sanitizeLinkedContent(post.linkedContent)
  if (linkedContent.error) return linkedContent
  if (linkedContent.value !== undefined) clean.linkedContent = linkedContent.value

  if (post.isPublic !== undefined) {
    if (typeof post.isPublic !== 'boolean') {
      return { error: '公开状态参数非法' }
    }
    clean.isPublic = post.isPublic === true
  }

  return { post: clean }
}

function sanitizePagination(page, pageSize) {
  const normalizedPage = page === undefined ? 1 : page
  const normalizedPageSize = pageSize === undefined ? 50 : pageSize
  if (
    !Number.isInteger(normalizedPage) ||
    normalizedPage < 1 ||
    normalizedPage > 10000 ||
    !Number.isInteger(normalizedPageSize) ||
    normalizedPageSize < 1 ||
    normalizedPageSize > 50
  ) {
    return { error: '分页参数非法' }
  }
  return { page: normalizedPage, pageSize: normalizedPageSize }
}

function sanitizeDomain(domain) {
  if (domain === undefined || domain === 'all') return { domain: 'all' }
  if (typeof domain !== 'string' || !DOMAIN_SET.has(domain)) {
    return { error: '板块参数非法' }
  }
  return { domain }
}

function sanitizeAuthorName(value) {
  if (typeof value !== 'string') return '微信用户'
  const normalized = value.trim().slice(0, 30)
  return normalized || '微信用户'
}

function safeRating(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(5, Math.round(number)))
}

module.exports = {
  DOMAIN_KEYS,
  sanitizePost,
  sanitizePagination,
  sanitizeDomain,
  sanitizeAuthorName,
  safeRating
}
