function canReadPost(post, openid) {
  if (!post) return false
  return post._openid === openid ||
    (post.isPublic === true && post.status === 'approved')
}

module.exports = {
  canReadPost
}
