// utils/ugc.js
// UGC 投稿内容管理（自用版）
// 支持六雅领域投稿：茶评、游记、香评、乐评、影评、养生笔记
// 改造：账号隔离的本地缓存 + 可确认的云端同步

const LEGACY_POSTS_KEY = 'ugc_posts';
const LEGACY_DRAFT_KEY = 'ugc_draft';
const ANONYMOUS_POSTS_KEY = 'ugc_posts:anonymous';
const ANONYMOUS_DRAFT_KEY = 'ugc_draft:anonymous';
const QUARANTINED_POSTS_KEY = 'ugc_posts:legacy-unassigned';
const QUARANTINED_DRAFT_KEY = 'ugc_draft:legacy-unassigned';
const SYNC_CONFLICTS_PREFIX = 'ugc_conflicts:';
const DRAFT_CONFLICTS_PREFIX = 'ugc_draft_conflicts:';

let _activeUserId = null;
let _scopeEpoch = 0;
const SYNC_FIELDS = [
  'title',
  'domain',
  'content',
  'tags',
  'images',
  'rating',
  'location',
  'linkedContent',
  'isPublic'
];

function _safeScopeId(userId) {
  if (typeof userId !== 'string' || !userId.trim()) return null;
  return userId.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
}

function _userPostsKey(userId) {
  return `ugc_posts:${_safeScopeId(userId)}`;
}

function _userDraftKey(userId) {
  return `ugc_draft:${_safeScopeId(userId)}`;
}

function _currentUserId() {
  // 缓存 user_info 不是当前微信身份的证明；只接受本次云登录激活的作用域。
  return _activeUserId;
}

function _postsKey() {
  const userId = _currentUserId();
  return userId ? _userPostsKey(userId) : ANONYMOUS_POSTS_KEY;
}

function _draftKey() {
  const userId = _currentUserId();
  return userId ? _userDraftKey(userId) : ANONYMOUS_DRAFT_KEY;
}

function _conflictsKey() {
  const userId = _currentUserId();
  return userId ? `${SYNC_CONFLICTS_PREFIX}${userId}` : null;
}

function _userDraftConflictsKey(userId) {
  const safeUserId = _safeScopeId(userId);
  return safeUserId ? `${DRAFT_CONFLICTS_PREFIX}${safeUserId}` : null;
}

function _captureScope() {
  const userId = _currentUserId();
  return {
    epoch: _scopeEpoch,
    userId,
    postsKey: userId ? _userPostsKey(userId) : ANONYMOUS_POSTS_KEY,
    draftKey: userId ? _userDraftKey(userId) : ANONYMOUS_DRAFT_KEY,
    conflictsKey: userId ? `${SYNC_CONFLICTS_PREFIX}${userId}` : null,
    draftConflictsKey: userId ? _userDraftConflictsKey(userId) : null
  };
}

function _isScopeCurrent(scope) {
  return !!scope &&
    scope.epoch === _scopeEpoch &&
    scope.userId === _activeUserId;
}

function _scopeChangedError() {
  const error = new Error('账号作用域已切换，已丢弃过期云端回包');
  error.code = 'scope_changed';
  error.staleScope = true;
  return error;
}

function _assertScopeCurrent(scope) {
  if (!_isScopeCurrent(scope)) throw _scopeChangedError();
}

function _readPosts(key) {
  const value = wx.getStorageSync(key);
  return Array.isArray(value) ? value : [];
}

function _writePosts(posts, scope) {
  if (scope) _assertScopeCurrent(scope);
  wx.setStorageSync(scope ? scope.postsKey : _postsKey(), posts);
}

function _mergePosts(primary, secondary) {
  const merged = [];
  const seen = new Set();
  [...primary, ...secondary].forEach(post => {
    if (!post || typeof post !== 'object') return;
    const key = post.id || post.cloudId;
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(post);
  });
  return merged;
}

function _sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function _draftConflictEntries(key) {
  if (!key) return [];
  const value = wx.getStorageSync(key);
  if (!value) return [];
  if (Array.isArray(value)) return value;
  // 兼容旧版隔离键曾直接保存单个草稿对象的格式。
  return [{
    id: `draft_conflict_legacy_${Date.now()}`,
    kind: 'conflict',
    reason: 'legacy_quarantine_existing',
    quarantinedAt: new Date().toISOString(),
    draft: value
  }];
}

function _appendDraftConflict(key, draft, reason) {
  if (!key || !draft || typeof draft !== 'object') return false;
  const entries = _draftConflictEntries(key);
  entries.unshift({
    id: `draft_conflict_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kind: 'conflict',
    reason,
    quarantinedAt: new Date().toISOString(),
    draft: { ...draft }
  });
  wx.setStorageSync(key, entries);
  return true;
}

function _storeDraftOrConflict(targetKey, conflictKey, draft, reason) {
  if (!draft || typeof draft !== 'object') return 'none';
  if (!wx.getStorageSync(targetKey)) {
    wx.setStorageSync(targetKey, draft);
    return 'migrated';
  }
  _appendDraftConflict(conflictKey, draft, reason);
  return 'quarantined';
}

function _retryDraftEditId(draft) {
  if (!draft || typeof draft !== 'object') return '';
  return String(draft.editId || draft.id || '').trim();
}

function _saveRetryDraftForScope(scope, draft, reason) {
  _assertScopeCurrent(scope);
  if (!scope.userId || !scope.draftConflictsKey) return false;
  const editId = _retryDraftEditId(draft);
  if (!editId) return false;
  const entries = _draftConflictEntries(scope.draftConflictsKey)
    .filter(item => !(
      item &&
      item.kind === 'retry' &&
      _retryDraftEditId(item.draft) === editId
    ));
  entries.unshift({
    id: `draft_retry_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kind: 'retry',
    reason: reason || 'cloud_save_pending',
    quarantinedAt: new Date().toISOString(),
    draft: {
      ...draft,
      editId,
      savedAt: new Date().toISOString()
    }
  });
  wx.setStorageSync(scope.draftConflictsKey, entries);
  return true;
}

function saveRetryDraft(draft, reason) {
  const scope = _captureScope();
  if (!scope.userId) return false;
  return _saveRetryDraftForScope(scope, draft, reason);
}

function getRetryDraft(editId) {
  const scope = _captureScope();
  if (!scope.userId || !scope.draftConflictsKey) return null;
  const targetId = String(editId || '').trim();
  const entry = _draftConflictEntries(scope.draftConflictsKey).find(item => (
    item &&
    item.kind === 'retry' &&
    _retryDraftEditId(item.draft) === targetId
  ));
  return entry ? { ...entry.draft } : null;
}

function clearRetryDraft(editId, scope) {
  const operationScope = scope || _captureScope();
  if (!operationScope.userId || !operationScope.draftConflictsKey) return false;
  _assertScopeCurrent(operationScope);
  const targetId = String(editId || '').trim();
  const entries = _draftConflictEntries(operationScope.draftConflictsKey);
  const filtered = entries.filter(item => !(
    item &&
    item.kind === 'retry' &&
    _retryDraftEditId(item.draft) === targetId
  ));
  if (filtered.length === entries.length) return false;
  if (filtered.length) {
    wx.setStorageSync(operationScope.draftConflictsKey, filtered);
  } else {
    wx.removeStorageSync(operationScope.draftConflictsKey);
  }
  return true;
}

function getQuarantinedDrafts() {
  const key = _userDraftConflictsKey(_currentUserId());
  return key ? _draftConflictEntries(key) : [];
}

/**
 * 登录成功后切换到经过云端验证的用户作用域。
 * 无法确认归属的旧版全局缓存进入隔离区，绝不自动挂到新账号。
 */
function activateUserScope(userId, previousUserId) {
  const nextUserId = _safeScopeId(userId);
  if (!nextUserId) {
    throw new Error('UGC 用户作用域无效');
  }

  // 先失效所有旧异步任务；即使迁移中抛错，也不能继续使用旧账号作用域。
  _scopeEpoch++;
  _activeUserId = null;

  const previous = _safeScopeId(previousUserId);
  const legacyPosts = _readPosts(LEGACY_POSTS_KEY);
  const legacyDraft = wx.getStorageSync(LEGACY_DRAFT_KEY);
  let quarantinedLegacy = 0;
  let quarantinedDrafts = 0;

  if (legacyPosts.length) {
    if (previous) {
      const previousKey = _userPostsKey(previous);
      wx.setStorageSync(
        previousKey,
        _mergePosts(_readPosts(previousKey), legacyPosts)
      );
    } else {
      wx.setStorageSync(
        QUARANTINED_POSTS_KEY,
        _mergePosts(_readPosts(QUARANTINED_POSTS_KEY), legacyPosts)
      );
      quarantinedLegacy = legacyPosts.length;
    }
    wx.removeStorageSync(LEGACY_POSTS_KEY);
  }

  if (legacyDraft) {
    if (previous) {
      const previousDraftKey = _userDraftKey(previous);
      const result = _storeDraftOrConflict(
        previousDraftKey,
        _userDraftConflictsKey(previous),
        legacyDraft,
        'legacy_draft_conflict'
      );
      if (result === 'quarantined') quarantinedDrafts++;
    } else {
      _appendDraftConflict(
        QUARANTINED_DRAFT_KEY,
        legacyDraft,
        'legacy_unassigned'
      );
      quarantinedDrafts++;
    }
    wx.removeStorageSync(LEGACY_DRAFT_KEY);
  }

  const anonymousPosts = _readPosts(ANONYMOUS_POSTS_KEY);
  const nextKey = _userPostsKey(nextUserId);
  if (anonymousPosts.length) {
    wx.setStorageSync(
      nextKey,
      _mergePosts(_readPosts(nextKey), anonymousPosts)
    );
    wx.removeStorageSync(ANONYMOUS_POSTS_KEY);
  }

  const anonymousDraft = wx.getStorageSync(ANONYMOUS_DRAFT_KEY);
  if (anonymousDraft) {
    const result = _storeDraftOrConflict(
      _userDraftKey(nextUserId),
      _userDraftConflictsKey(nextUserId),
      anonymousDraft,
      'anonymous_draft_conflict'
    );
    if (result === 'quarantined') quarantinedDrafts++;
  }
  // 无论目标账号是否已有草稿，都不得把匿名草稿遗留给下一个登录账号。
  wx.removeStorageSync(ANONYMOUS_DRAFT_KEY);

  _activeUserId = nextUserId;
  return {
    scopeKey: nextKey,
    migratedAnonymous: anonymousPosts.length,
    quarantinedLegacy,
    quarantinedDrafts
  };
}

function deactivateUserScope() {
  _scopeEpoch++;
  _activeUserId = null;
}

// ========== 登录状态 & 云函数调用 ==========

function _isLoggedIn() {
  return !!_activeUserId
}

function isCloudIdentityReady() {
  return _isLoggedIn()
}

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'ugc',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

function _cloudResultError(res, fallbackMessage) {
  const error = new Error((res && res.message) || fallbackMessage || '云端操作失败');
  error.code = (res && res.code) || -1;
  error.reason = (res && res.reason) || '';
  error.serverBuild = (res && res.server_build) || '';
  error.cloudResult = res || null;
  return error;
}

// 记录云端文档 ID，同时保留本地稳定 ID，避免后续编辑重复创建投稿。
function _rememberCloudId(
  localId,
  cloudId,
  cloudUpdatedAt,
  mediaCleanupPending,
  moderationStatus,
  scope
) {
  if (!localId || !cloudId) return
  if (scope) _assertScopeCurrent(scope)

  const posts = scope ? _readPosts(scope.postsKey) : getAllPosts()
  const idx = posts.findIndex(p => p.id === localId)
  if (idx < 0) return

  posts[idx] = {
    ...posts[idx],
    cloudId,
    cloudUpdatedAt: cloudUpdatedAt || posts[idx].cloudUpdatedAt || '',
    mediaCleanupPending: mediaCleanupPending === true,
    status: moderationStatus || posts[idx].status || 'private',
    dirty: false,
    dirtyFields: [],
    syncError: ''
  }
  _writePosts(posts, scope)
}

function _syncPostToCloud(post, scope) {
  const operationScope = scope || _captureScope()
  if (!operationScope.userId) {
    const error = new Error('当前未登录，无法同步投稿')
    error.code = 'not_logged_in'
    return Promise.reject(error)
  }
  _assertScopeCurrent(operationScope)

  // 昵称由云函数按 OPENID 查询，客户端不能声明作者身份。
  const payload = {
    id: post.id,
    cloudId: post.cloudId
  }
  if (post.cloudId) {
    const dirtyFields = Array.isArray(post.dirtyFields)
      ? post.dirtyFields.filter(field => SYNC_FIELDS.includes(field))
      : []
    if (dirtyFields.length === 0 && post.mediaCleanupPending !== true) {
      _rememberCloudId(
        post.id,
        post.cloudId,
        post.cloudUpdatedAt,
        false,
        post.status,
        operationScope
      )
      return Promise.resolve({
        code: 0,
        id: post.cloudId,
        updated_at: post.cloudUpdatedAt || '',
        no_change: true
      })
    }
    if (!post.cloudUpdatedAt) {
      const error = new Error('投稿版本缺失，请先从云端刷新');
      error.code = 'version_required';
      return Promise.reject(error);
    }
    dirtyFields.forEach(field => {
      payload[field] = post[field]
    })
    if (post.cloudUpdatedAt) payload.baseUpdatedAt = post.cloudUpdatedAt
  } else {
    SYNC_FIELDS.forEach(field => {
      if (post[field] !== undefined) payload[field] = post[field]
    })
  }

  return _callCloud({ action: 'save', post: payload }).then(res => {
    _assertScopeCurrent(operationScope)
    if (res.code !== 0 || !res.id) {
      throw _cloudResultError(res, '投稿同步失败')
    }
    _rememberCloudId(
      post.id,
      res.id,
      res.updated_at,
      res.media_cleanup_pending === true,
      res.status,
      operationScope
    )
    return res
  })
}

// 六雅领域配置
const DOMAIN_OPTIONS = [
  { key: 'tea',      name: '茶', label: '茶评', color: '#3B6D11', bgColor: 'rgba(59, 109, 17, 0.06)',  placeholder: '记录这杯茶的色香味韵…' },
  { key: 'travel',   name: '游', label: '游记', color: '#5B8C85', bgColor: 'rgba(91, 140, 133, 0.06)', placeholder: '记录这段旅途的见闻感悟…' },
  { key: 'incense',  name: '香', label: '香评', color: '#8B6F47', bgColor: 'rgba(139, 111, 71, 0.06)', placeholder: '记录这炉香的香韵层次…' },
  { key: 'music',    name: '音', label: '乐评', color: '#4A6B7C', bgColor: 'rgba(74, 107, 124, 0.06)', placeholder: '记录这首曲的意境感悟…' },
  { key: 'film',     name: '影', label: '影评', color: '#2C2C2A', bgColor: 'rgba(44, 44, 42, 0.06)',   placeholder: '记录这部作品的观影思考…' },
  { key: 'wellness', name: '养', label: '养生', color: '#A0522D', bgColor: 'rgba(160, 82, 45, 0.06)', placeholder: '记录今日的养生实践…' }
];

// 获取所有投稿
function getAllPosts() {
  return _readPosts(_postsKey());
}

// 冲突副本与正常投稿分库存放，避免旧 dirty 被展示或自动回推。
function getQuarantinedConflicts() {
  const key = _conflictsKey();
  return key ? _readPosts(key) : [];
}

function _quarantineSyncConflict(localPost, cloudPost, reason, scope) {
  if (scope) _assertScopeCurrent(scope);
  const key = scope ? scope.conflictsKey : _conflictsKey();
  if (!key) return false;

  const conflicts = _readPosts(key);
  const fingerprint = JSON.stringify({
    id: localPost.id || '',
    cloudId: localPost.cloudId || cloudPost.cloudId || '',
    localBase: localPost.cloudUpdatedAt || '',
    cloudVersion: cloudPost.cloudUpdatedAt || '',
    updatedAt: localPost.updatedAt || '',
    dirtyFields: localPost.dirtyFields || []
  });
  if (conflicts.some(item => item.fingerprint === fingerprint)) return false;

  conflicts.unshift({
    id: `ugc_conflict_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reason,
    fingerprint,
    resolved: false,
    quarantinedAt: new Date().toISOString(),
    cloudId: cloudPost.cloudId || localPost.cloudId || '',
    cloudUpdatedAt: cloudPost.cloudUpdatedAt || '',
    localPost: {
      ...localPost,
      dirty: true,
      syncError: '本地修改与云端版本冲突，已隔离且不会自动上传'
    }
  });
  wx.setStorageSync(key, conflicts);
  return true;
}

// 按领域获取投稿
function getPostsByDomain(domain) {
  const posts = getAllPosts();
  if (!domain || domain === 'all') return posts;
  return posts.filter(p => p.domain === domain);
}

// 获取投稿统计
function getStats() {
  const posts = getAllPosts();
  const stats = {
    total: posts.length,
    byDomain: {}
  };
  DOMAIN_OPTIONS.forEach(d => {
    stats.byDomain[d.key] = posts.filter(p => p.domain === d.key).length;
  });
  return stats;
}

// 生成唯一ID
function generateId() {
  return 'ugc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

function _replaceLocalPost(localId, nextPost, scope) {
  if (scope) _assertScopeCurrent(scope);
  const posts = scope ? _readPosts(scope.postsKey) : getAllPosts();
  const idx = posts.findIndex(p => p.id === localId);
  if (idx < 0) return null;
  posts[idx] = nextPost;
  _writePosts(posts, scope);
  return posts[idx];
}

function _markSyncError(localId, message, scope) {
  if (scope) _assertScopeCurrent(scope);
  const post = getPostById(localId, scope);
  if (!post) return null;
  return _replaceLocalPost(localId, {
    ...post,
    dirty: true,
    syncError: message || 'cloud_sync_failed'
  }, scope);
}

// 只执行本地保存；云端确认由 savePost/savePostConfirmed 决定。
function _savePostLocal(post, scope) {
  if (scope) _assertScopeCurrent(scope);
  const posts = scope ? _readPosts(scope.postsKey) : getAllPosts();
  const now = new Date().toISOString();

  if (post.id) {
    // 更新
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      const previousPost = posts[idx];
      const changedFields = SYNC_FIELDS.filter(field => (
        post[field] !== undefined &&
        !_sameValue(previousPost[field], field === 'isPublic'
          ? post[field] === true
          : post[field])
      ));
      const dirtyFields = Array.from(new Set([
        ...(Array.isArray(previousPost.dirtyFields) ? previousPost.dirtyFields : []),
        ...changedFields
      ]));
      const updated = {
        ...previousPost,
        ...post,
        dirty: previousPost.dirty === true || dirtyFields.length > 0,
        dirtyFields,
        syncError: '',
        updatedAt: now
      };
      if (post.isPublic !== undefined) {
        updated.isPublic = post.isPublic === true;
      }
      const contentChanged = changedFields.some(field => field !== 'isPublic');
      if (post.isPublic === false) {
        updated.status = 'private';
      } else if (
        post.isPublic === true &&
        (previousPost.isPublic !== true || contentChanged)
      ) {
        updated.status = 'pending';
      } else if (previousPost.isPublic === true && contentChanged) {
        updated.status = 'pending';
      }
      posts[idx] = updated;
      _writePosts(posts, scope);
      return posts[idx];
    }
  }

  // 新建
  const newPost = {
    id: generateId(),
    title: post.title || '',
    domain: post.domain || 'tea',
    content: post.content || '',
    tags: post.tags || [],
    images: post.images || [],
    rating: post.rating || 0,
    location: post.location || '',
    linkedContent: post.linkedContent || null,
    status: post.isPublic === true ? 'pending' : 'private',
    // 社区字段（预留云切换）
    // 隐私优先：只有用户明确选择公开时才进入社区流。
    isPublic: post.isPublic === true,
    authorId: 'local_user', // 预留云切换
    authorName: '我',
    likeCount: 0,
    dirty: true,
    dirtyFields: SYNC_FIELDS.slice(),
    syncError: '',
    createdAt: now,
    updatedAt: now
  };
  posts.unshift(newPost);
  _writePosts(posts, scope);
  return newPost;
}

// 兼容旧调用：即时返回本地结果，并在后台同步；失败会留下 dirty/syncError。
function savePost(post) {
  const scope = _captureScope();
  const saved = _savePostLocal(post, scope);
  if (scope.userId) {
    _syncPostToCloud(saved, scope).catch(err => {
      if (!_isScopeCurrent(scope)) return;
      _markSyncError(saved.id, err && err.message, scope);
    });
  }
  return saved;
}

function _handleSaveConfirmationFailure(previousSnapshot, saved, err, scope) {
  let localPost = saved;
  if (!_isScopeCurrent(scope)) {
    err.staleScope = true;
    err.localPost = saved;
    return err;
  }
  const visibilityChanged = previousSnapshot &&
    previousSnapshot.isPublic !== saved.isPublic;
  const approvedPublicMutation = previousSnapshot &&
    previousSnapshot.isPublic === true &&
    previousSnapshot.status === 'approved' &&
    saved.status === 'pending';

  if (visibilityChanged || approvedPublicMutation) {
    const remainingDirtyFields = (saved.dirtyFields || [])
      .filter(field => field !== 'isPublic');
    localPost = _replaceLocalPost(saved.id, {
      ...saved,
      isPublic: previousSnapshot.isPublic === true,
      status: previousSnapshot.status || (
        previousSnapshot.isPublic === true ? 'approved' : 'private'
      ),
      dirty: remainingDirtyFields.length > 0,
      dirtyFields: remainingDirtyFields,
      syncError: '公开状态未获云端确认'
    }, scope);
    err.privacyStateUnchanged = true;
  } else if (!previousSnapshot && saved.isPublic) {
    const remainingDirtyFields = (saved.dirtyFields || [])
      .filter(field => field !== 'isPublic');
    localPost = _replaceLocalPost(saved.id, {
      ...saved,
      isPublic: false,
      status: 'private',
      dirty: remainingDirtyFields.length > 0,
      dirtyFields: remainingDirtyFields,
      syncError: '公开状态未获云端确认'
    }, scope);
    err.privacyStateUnchanged = true;
  } else {
    localPost = _markSyncError(saved.id, err && err.message, scope);
  }

  err.localPost = localPost || saved;
  return err;
}

/**
 * 保存投稿并等待云端明确确认。
 * 公开状态切换失败时回滚本地状态，避免页面把未生效的隐私变更显示为成功。
 */
function savePostConfirmed(post) {
  const scope = _captureScope();
  const previous = post.id ? getPostById(post.id, scope) : null;
  const previousSnapshot = previous ? { ...previous } : null;
  const saved = _savePostLocal(post, scope);

  if (!scope.userId) {
    const error = new Error('当前未登录，投稿仅保存在本机');
    error.code = 'not_logged_in';
    return Promise.reject(
      _handleSaveConfirmationFailure(previousSnapshot, saved, error, scope)
    );
  }

  // 在发起云请求前同步保留完整重试副本；账号切换会使回包失效，但不会丢失编辑内容。
  _saveRetryDraftForScope(scope, {
    ...saved,
    editId: saved.id
  }, 'cloud_save_pending');

  return _syncPostToCloud(saved, scope).then(() => {
    _assertScopeCurrent(scope);
    clearRetryDraft(saved.id, scope);
    return getPostById(saved.id, scope) || saved;
  }).catch(err => {
    throw _handleSaveConfirmationFailure(
      previousSnapshot,
      saved,
      err,
      scope
    );
  });
}

function _removeLocalPost(id, scope) {
  if (scope) _assertScopeCurrent(scope);
  const posts = scope ? _readPosts(scope.postsKey) : getAllPosts();
  const filtered = posts.filter(p => p.id !== id && p.cloudId !== id);
  _writePosts(filtered, scope);
  return filtered.length < posts.length;
}

function _cloudFileIds(images) {
  return Array.from(new Set(
    (Array.isArray(images) ? images : [])
      .filter(fileId => typeof fileId === 'string' && fileId.startsWith('cloud://'))
  ));
}

function _deleteCloudFilesConfirmed(fileList) {
  const targets = Array.from(new Set(fileList || []));
  if (targets.length === 0) {
    return Promise.resolve({ deleted: [], failed: [] });
  }
  return new Promise((resolve, reject) => {
    if (!wx.cloud || typeof wx.cloud.deleteFile !== 'function') {
      reject(new Error('当前环境不支持云文件删除'));
      return;
    }
    wx.cloud.deleteFile({
      fileList: targets,
      success: result => {
        const statusById = new Map();
        const list = result && Array.isArray(result.fileList)
          ? result.fileList
          : [];
        list.forEach(item => {
          if (item && typeof item.fileID === 'string') {
            statusById.set(item.fileID, Number(item.status));
          }
        });
        resolve(targets.reduce((summary, fileId) => {
          if (statusById.get(fileId) === 0) summary.deleted.push(fileId);
          else summary.failed.push(fileId);
          return summary;
        }, { deleted: [], failed: [] }));
      },
      fail: reject
    });
  });
}

// 兼容旧调用：仅允许删除尚未上云的本地稿；云端稿必须走确认式删除。
function deletePost(id) {
  const post = getPostById(id);
  if (!post) return false;
  if (post.cloudId) return false;
  // 含云文件的本地稿必须走异步确认式删除，不能先删记录再遗留孤儿文件。
  if (_cloudFileIds(post.images).length > 0) return false;
  return _removeLocalPost(id);
}

function deletePostConfirmed(id, suppliedScope) {
  const scope = suppliedScope || _captureScope();
  const post = getPostById(id, scope);
  if (!post) return Promise.resolve({ removed: false, fileCleanupPending: false });
  if (!post.cloudId) {
    const allCloudFiles = _cloudFileIds(post.images);
    if (allCloudFiles.length === 0) {
      return Promise.resolve({
        removed: _removeLocalPost(id, scope),
        fileCleanupPending: false
      });
    }
    if (!scope.userId) {
      const error = new Error('当前未登录，无法确认云图片删除');
      error.code = 'not_logged_in';
      return Promise.reject(error);
    }

    const otherReferences = new Set();
    _readPosts(scope.postsKey).forEach(otherPost => {
      if (
        !otherPost ||
        otherPost.id === post.id ||
        (post.cloudId && otherPost.cloudId === post.cloudId)
      ) {
        return;
      }
      _cloudFileIds(otherPost.images).forEach(fileId => {
        otherReferences.add(fileId);
      });
    });
    const deletable = allCloudFiles.filter(fileId => !otherReferences.has(fileId));

    return _deleteCloudFilesConfirmed(deletable).then(cleanup => {
      _assertScopeCurrent(scope);
      if (cleanup.failed.length > 0) {
        const remainingImages = (post.images || []).filter(image => (
          !cleanup.deleted.includes(image)
        ));
        _replaceLocalPost(post.id, {
          ...post,
          images: remainingImages,
          mediaCleanupPending: true,
          syncError: '本地投稿图片删除未完成'
        }, scope);
        const error = new Error('云图片删除未完成，本地投稿仍保留');
        error.code = 'file_cleanup_pending';
        error.fileCleanupPending = true;
        error.failedFileIds = cleanup.failed;
        throw error;
      }
      return {
        removed: _removeLocalPost(id, scope),
        fileCleanupPending: false,
        retainedSharedFiles: allCloudFiles.length - deletable.length
      };
    }).catch(err => {
      if (err && err.code === 'file_cleanup_pending') throw err;
      if (!_isScopeCurrent(scope)) throw _scopeChangedError();
      const error = new Error('云图片删除未确认，本地投稿仍保留');
      error.code = (err && (err.code || err.errCode)) || 'file_cleanup_failed';
      error.fileCleanupPending = true;
      throw error;
    });
  }
  if (!scope.userId) {
    const error = new Error('当前未登录，无法确认云端删除');
    error.code = 'not_logged_in';
    return Promise.reject(error);
  }

  return _callCloud({
      action: 'delete',
      id: post.cloudId,
      clientId: post.id,
      baseUpdatedAt: post.cloudUpdatedAt
    }).then(res => {
      _assertScopeCurrent(scope);
      if (res.code !== 0) {
        if (res.hidden === true || res.cleanup_pending === true) {
          _replaceLocalPost(post.id, {
            ...post,
            status: 'deleting',
            isPublic: false,
            mediaCleanupPending: true,
            cloudUpdatedAt: res.updated_at || post.cloudUpdatedAt || '',
            syncError: res.message || '删除清理待重试'
          }, scope);
        }
        const error = _cloudResultError(res, '云端删除失败');
        error.deletePending = res.hidden === true || res.cleanup_pending === true;
        error.manualCleanupRequired = res.manual_cleanup_required === true;
        throw error;
      }
      return {
        removed: _removeLocalPost(id, scope),
        fileCleanupPending: res.file_cleanup_pending === true
      };
    });
}

// 获取单条投稿（兼容本地 ID 和云端文档 ID）
function getPostById(id, scope) {
  if (scope) _assertScopeCurrent(scope);
  const posts = scope ? _readPosts(scope.postsKey) : getAllPosts();
  return posts.find(p => p.id === id || p.cloudId === id);
}

// 保存草稿（自动暂存）
function saveDraft(draft) {
  wx.setStorageSync(_draftKey(), { ...draft, savedAt: new Date().toISOString() });
}

// 获取草稿
function getDraft() {
  return wx.getStorageSync(_draftKey()) || null;
}

// 清除草稿
function clearDraft() {
  wx.removeStorageSync(_draftKey());
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${y}.${m}.${day} ${h}:${min}`;
}

// 格式化简短日期
function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${m}/${day}`;
}

// ====== 社区模拟数据 ======
// 仅用于开发稿参考的模拟内容；不得进入用户可见社区 Feed。
const MOCK_PUBLIC_POSTS = [
  {
    id: 'mock_001',
    title: '武夷山三日茶旅记',
    domain: 'travel',
    content: '从天心岩走到水帘洞，沿途品了五泡岩茶。最深刻的是在慧苑寺旁品到的一泡老枞水仙，岩韵深沉，有种说不出的幽远。三天的行程，不仅品茶，更是在山水间找到了一种久违的宁静。',
    tags: ['武夷岩茶', '行旅', '岩韵'],
    images: [],
    rating: 5,
    location: '福建武夷山',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_1',
    authorName: '茶行客',
    likeCount: 42,
    createdAt: '2026-07-20T10:30:00.000Z',
    updatedAt: '2026-07-20T10:30:00.000Z'
  },
  {
    id: 'mock_002',
    title: '沉香线香初体验',
    domain: 'incense',
    content: '第一次尝试海南沉香线香，点燃后有一种清甜的奶香，不像想象中的浓烈。静坐30分钟后，感觉心绪渐渐安定，配合古琴曲《平沙落雁》，竟有一种脱然物外之感。推荐初学者从沉香入门。',
    tags: ['沉香', '线香', '入门'],
    images: [],
    rating: 4,
    location: '',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_2',
    authorName: '香舍主人',
    likeCount: 28,
    createdAt: '2026-07-19T14:00:00.000Z',
    updatedAt: '2026-07-19T14:00:00.000Z'
  },
  {
    id: 'mock_003',
    title: '普洱生茶冲泡笔记（五泡记录）',
    domain: 'tea',
    content: '今天泡了一饼2019年的易武古树生普。第一泡10秒出汤，稍有青涩但回甘明显；第二泡15秒，蜜香开始显现；第三泡是最惊艳的，茶汤顺滑，生津强烈；第四泡开始略淡但仍有甜韵；第五泡20秒，余韵尚存。总体感觉：易武的柔，不是没有力度，而是力度藏在温柔里。',
    tags: ['普洱', '生茶', '易武', '冲泡'],
    images: [],
    rating: 5,
    location: '云南西双版纳',
    linkedContent: { id: 'tea_051', title: '普洱生茶', domain: 'tea' },
    isPublic: true,
    authorId: 'mock_user_3',
    authorName: '茶笔记',
    likeCount: 65,
    createdAt: '2026-07-18T09:00:00.000Z',
    updatedAt: '2026-07-18T09:00:00.000Z'
  },
  {
    id: 'mock_004',
    title: '夏夜养生：酸梅汤的古法做法',
    domain: 'wellness',
    content: '夏天到了，分享一个古法酸梅汤方子。乌梅30g、山楂20g、陈皮5g、甘草3g、桂花适量。材料浸泡30分钟后大火煮开，小火慢煮40分钟，最后加冰糖和桂花。这个方子消暑不伤胃，比外面的好太多。',
    tags: ['酸梅汤', '夏季养生', '古法'],
    images: [],
    rating: 4,
    location: '',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_4',
    authorName: '养生记',
    likeCount: 33,
    createdAt: '2026-07-17T16:00:00.000Z',
    updatedAt: '2026-07-17T16:00:00.000Z'
  },
  {
    id: 'mock_005',
    title: '《一代宗师》和一杯大红袍',
    domain: 'film',
    content: '重看《一代宗师》，这次配了一泡武夷大红袍。王家卫的镜头和大红袍的岩韵简直是绝配——都是那种初入口不觉如何，回味时却百转千回。宫二说“世间所有的相遇，都是久别重逢”，大红袍也是，第一泡平平无奇，第三泡才见岩骨。',
    tags: ['一代宗师', '大红袍', '王家卫'],
    images: [],
    rating: 5,
    location: '',
    linkedContent: { id: 'film_011', title: '《一代宗师》', domain: 'film' },
    isPublic: true,
    authorId: 'mock_user_5',
    authorName: '光影茶客',
    likeCount: 51,
    createdAt: '2026-07-16T20:00:00.000Z',
    updatedAt: '2026-07-16T20:00:00.000Z'
  }
];

// 获取社区 Feed（本地）：仅返回当前用户本地存储中已公开的投稿。
// 仅作为离线回显，不包含其他用户的投稿。
function getCommunityFeedLocal(domain) {
  const localPublic = getAllPosts().filter(
    p => (
      p.isPublic === true &&
      p.status === 'approved' &&
      p.dirty !== true
    )
  );
  const allPosts = localPublic;
  if (domain && domain !== 'all') {
    return allPosts.filter(p => p.domain === domain);
  }
  return allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// 兼容旧调用名
function getCommunityFeed(domain) {
  return getCommunityFeedLocal(domain);
}

/**
 * 从云端拉取社区 Feed（所有用户的公开投稿）
 * @param {string} domain - 板块筛选，'all' 或具体板块 key
 * @returns {Promise<Array>} 云端公开投稿列表
 */
function getCloudCommunityFeed(domain) {
  // 云函数通过 cloud.getWXContext() 获取 OPENID，不依赖客户端登录 token。
  // 因此不需要 _isLoggedIn() 守卫，避免 silentLogin 未完成时社区 Feed 为空。

  return _callCloud({
    action: 'getCommunityFeed',
    domain: domain || 'all',
    page: 1,
    pageSize: 50
  }).then(res => {
    if (res.code !== 0 || !Array.isArray(res.list)) {
      throw _cloudResultError(res, '社区内容加载失败')
    }

    return res.list.map(item => ({
      id: item.id,
      cloudId: item.id,
      title: item.title || '',
      domain: item.domain || 'tea',
      content: item.content || '',
      tags: item.tags || [],
      images: item.images || [],
      rating: Math.max(0, Math.min(5, Math.round(Number(item.rating) || 0))),
      location: item.location || '',
      linkedContent: item.linkedContent || null,
      isPublic: true,
      status: 'approved',
      authorName: item.authorName || '匿名用户',
      likeCount: item.likeCount || 0,
      isMine: item.is_mine === true,
      createdAt: item.created_at,
      updatedAt: item.created_at
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })
}

// 搜索投稿
function searchPosts(keyword, scope) {
  // scope: 'my' or 'community'
  const source = scope === 'community' ? getCommunityFeed() : getAllPosts();
  if (!keyword) return source;
  const kw = keyword.toLowerCase();
  return source.filter(p =>
    (p.title || '').toLowerCase().indexOf(kw) >= 0 ||
    (p.content || '').toLowerCase().indexOf(kw) >= 0 ||
    (p.tags || []).some(t => t.toLowerCase().indexOf(kw) >= 0)
  );
}

// ========== 云端同步 API ==========

/**
 * 从云端拉取我的投稿，合并到本地
 */
async function syncFromCloud() {
  const scope = _captureScope()
  if (!scope.userId) return Promise.resolve({ synced: false })

  try {
    _assertScopeCurrent(scope)
    const pageSize = 50
    const allCloudItems = []
    let serverBuild = ''
    let paginationComplete = false
    for (let page = 1; page <= 100; page++) {
      const res = await _callCloud({
        action: 'getMyPosts',
        domain: 'all',
        page,
        pageSize
      })
      _assertScopeCurrent(scope)
      if (res.code !== 0 || !Array.isArray(res.list)) {
        throw _cloudResultError(res, '投稿拉取失败')
      }
      if (res.server_build) serverBuild = res.server_build
      allCloudItems.push(...res.list)
      if (res.has_more !== true && res.list.length < pageSize) {
        paginationComplete = true
        break
      }
      if (res.list.length === 0) {
        paginationComplete = true
        break
      }
    }
    if (!paginationComplete) {
      throw new Error('投稿分页未完整拉取，已停止回推')
    }

    _assertScopeCurrent(scope)
    const localPosts = _readPosts(scope.postsKey)
    const deletedCloudIds = new Set()
    allCloudItems.forEach(item => {
      if (item && item.status === 'deleted') {
        if (item.id) deletedCloudIds.add(item.id)
        if (item.client_id) deletedCloudIds.add(item.client_id)
      }
    })
    const cloudPosts = allCloudItems
      .filter(item => item && item.status !== 'deleted')
      .map(item => ({
      id: item.client_id || item.id,
      cloudId: item.id,
      title: item.title,
      domain: item.domain,
      content: item.content,
      tags: item.tags || [],
      images: item.images || [],
      rating: item.rating || 0,
      location: item.location || '',
      linkedContent: item.linkedContent || null,
      status: item.status || 'published',
      isPublic: item.isPublic === true,
      authorId: 'cloud_user',
      authorName: '我',
      likeCount: item.likeCount || 0,
      dirty: false,
      dirtyFields: [],
      syncError: '',
      mediaCleanupPending: item.media_cleanup_pending === true,
      cloudUpdatedAt: item.updated_at || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
      }))

    // 云端完整分页是基线；仅保留 dirty 或从未上云的本地稿。
    // 这样云端已删除的旧缓存不会在下次启动时被“复活”。
    const cloudIds = new Set()
    const localById = new Map()
    localPosts.forEach(post => {
      if (post.id) localById.set(post.id, post)
      if (post.cloudId) localById.set(post.cloudId, post)
    })
    cloudPosts.forEach(p => {
      if (p.id) cloudIds.add(p.id)
      if (p.cloudId) cloudIds.add(p.cloudId)
    })
    let conflictsQuarantined = 0
    const merged = cloudPosts.map(cloudPost => {
      const local = localById.get(cloudPost.id) || localById.get(cloudPost.cloudId)
      if (local && local.dirty === true) {
        const localBase = local.cloudUpdatedAt || ''
        const cloudVersion = cloudPost.cloudUpdatedAt || ''
        if (!localBase || !cloudVersion || localBase !== cloudVersion) {
          const reason = !localBase
            ? 'missing_local_base'
            : (!cloudVersion ? 'missing_cloud_version' : 'stale_local_base')
          if (_quarantineSyncConflict(local, cloudPost, reason, scope)) {
            conflictsQuarantined++
          }
          // 云端优先作为当前可见副本；隔离的本地 dirty 不再进入自动回推队列。
          return cloudPost
        }
        return {
          ...local,
          cloudId: cloudPost.cloudId,
          cloudUpdatedAt: localBase,
          createdAt: local.createdAt || cloudPost.createdAt
        }
      }
      return cloudPost
    })
    localPosts.forEach(p => {
      if (
        deletedCloudIds.has(p.id) ||
        (p.cloudId && deletedCloudIds.has(p.cloudId))
      ) {
        return
      }
      const missingFromCloud = p.id &&
        !cloudIds.has(p.id) &&
        (!p.cloudId || !cloudIds.has(p.cloudId))
      if (missingFromCloud && p.cloudId) {
        if (
          p.dirty === true &&
          _quarantineSyncConflict(
            p,
            { cloudId: p.cloudId, cloudUpdatedAt: '' },
            'missing_cloud_record',
            scope
          )
        ) {
          conflictsQuarantined++
        }
        return
      }
      if (missingFromCloud && (p.dirty === true || !p.cloudId)) {
        merged.push(p)
      }
    })

    _writePosts(merged, scope)
    return {
      synced: true,
      count: cloudPosts.length,
      conflictsQuarantined,
      serverBuild
    }
  } catch (err) {
    if (err && err.staleScope) {
      return { synced: false, staleScope: true, error: err }
    }
    console.warn('[ugc] syncFromCloud failed:', {
      code: err && err.code,
      reason: err && err.reason,
      serverBuild: err && err.serverBuild
    })
    return { synced: false, error: err }
  }
}

/**
 * 仅将 dirty 或从未上云的本地投稿推送到云端。
 */
function syncToCloud() {
  const scope = _captureScope()
  if (!scope.userId) return Promise.resolve({ synced: false })
  _assertScopeCurrent(scope)

  const posts = _readPosts(scope.postsKey).filter(post => (
    post.dirty === true ||
    !post.cloudId ||
    post.mediaCleanupPending === true
  ))
  let successCount = 0
  let failedCount = 0
  let staleScope = false
  const promises = posts.map(post => {
    const operation = post.status === 'deleting' && post.cloudId
      ? deletePostConfirmed(post.id, scope).then(() => ({ code: 0 }))
      : _syncPostToCloud(post, scope)
    return operation.then(res => {
      if (res.code === 0) successCount++
    }).catch(err => {
      if (err && err.staleScope) {
        staleScope = true
        return
      }
      failedCount++
      if (_isScopeCurrent(scope)) {
        _markSyncError(post.id, err && err.message, scope)
      }
    })
  })

  return Promise.all(promises).then(() => ({
    synced: !staleScope && failedCount === 0,
    staleScope,
    total: posts.length,
    successCount,
    failedCount
  }))
}

// ========== 孤儿上传清理 manifest ==========
// 当 _uploadImages 部分上传成功、部分失败时，成功项需要回滚删除。
// 如果 deleteFile 也有部分失败，残留 File ID 进入账号级 manifest，供后续重试。

const CLEANUP_MANIFESTS_PREFIX = 'ugc_cleanup_manifests:';

function _userCleanupManifestsKey(userId) {
  const safeUserId = _safeScopeId(userId);
  return safeUserId ? `${CLEANUP_MANIFESTS_PREFIX}${safeUserId}` : null;
}

function _readCleanupManifests(scope) {
  const key = scope
    ? _userCleanupManifestsKey(scope.userId)
    : _userCleanupManifestsKey(_currentUserId());
  if (!key) return [];
  const raw = wx.getStorageSync(key);
  return Array.isArray(raw) ? raw : [];
}

function _writeCleanupManifests(manifests, scope) {
  const key = scope
    ? _userCleanupManifestsKey(scope.userId)
    : _userCleanupManifestsKey(_currentUserId());
  if (!key) return false;
  if (manifests.length) {
    wx.setStorageSync(key, manifests);
  } else {
    wx.removeStorageSync(key);
  }
  return true;
}

/**
 * 保存一个待清理 manifest。仅在新上传成功项回滚不完整时调用。
 * @param {Object} manifest - { fileIds: string[], reason: string, createdAt: string, editId?: string }
 */
function saveCleanupManifest(manifest) {
  const scope = _captureScope();
  if (!scope.userId) return false;
  if (!manifest || !Array.isArray(manifest.fileIds) || manifest.fileIds.length === 0) {
    return false;
  }
  const entries = _readCleanupManifests(scope);
  entries.unshift({
    id: `cleanup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fileIds: Array.from(new Set(manifest.fileIds.filter(id => typeof id === 'string' && id.length > 0))),
    reason: manifest.reason || 'upload_partial_rollback',
    editId: manifest.editId || '',
    createdAt: manifest.createdAt || new Date().toISOString()
  });
  _writeCleanupManifests(entries, scope);
  return true;
}

/**
 * 获取当前账号所有待清理 manifest。
 */
function getCleanupManifests() {
  return _readCleanupManifests(null);
}

/**
 * 删除一个已清理完成的 manifest。
 */
function clearCleanupManifest(manifestId) {
  const scope = _captureScope();
  if (!scope.userId) return false;
  const entries = _readCleanupManifests(scope);
  const filtered = entries.filter(item => !(item && item.id === manifestId));
  if (filtered.length === entries.length) return false;
  _writeCleanupManifests(filtered, scope);
  return true;
}

/**
 * 重试所有待清理 manifest 中的孤儿文件删除。
 * 逐 manifest 调用 deleteFile，逐 File ID 检查状态；
 * 完全清理的 manifest 被移除，部分失败的保留剩余 File ID。
 * @returns {Promise<{ retried: number, cleared: number, remaining: number }>}
 */
function retryCleanupManifests() {
  const scope = _captureScope();
  if (!scope.userId) return Promise.resolve({ retried: 0, cleared: 0, remaining: 0 });

  const manifests = _readCleanupManifests(scope);
  if (manifests.length === 0) {
    return Promise.resolve({ retried: 0, cleared: 0, remaining: 0 });
  }

  const allFileIds = Array.from(new Set(
    manifests.flatMap(m => (m && Array.isArray(m.fileIds)) ? m.fileIds : [])
  ));

  if (allFileIds.length === 0) {
    _writeCleanupManifests([], scope);
    return Promise.resolve({ retried: 0, cleared: manifests.length, remaining: 0 });
  }

  return _deleteCloudFilesConfirmed(allFileIds).then(cleanup => {
    _assertScopeCurrent(scope);
    const deletedSet = new Set(cleanup.deleted);
    const failedSet = new Set(cleanup.failed);

    const updatedManifests = [];
    let remainingCount = 0;

    manifests.forEach(m => {
      if (!m || !Array.isArray(m.fileIds)) return;
      const stillFailed = m.fileIds.filter(id => !deletedSet.has(id) || failedSet.has(id));
      if (stillFailed.length === 0) return; // 完全清理，移除
      updatedManifests.push({ ...m, fileIds: stillFailed, lastRetryAt: new Date().toISOString() });
      remainingCount += stillFailed.length;
    });

    _writeCleanupManifests(updatedManifests, scope);
    return {
      retried: allFileIds.length,
      cleared: manifests.length - updatedManifests.length,
      remaining: remainingCount
    };
  }).catch(err => {
    if (!_isScopeCurrent(scope)) throw _scopeChangedError();
    // deleteFile 整体失败时保留全部 manifest
    return {
      retried: allFileIds.length,
      cleared: 0,
      remaining: allFileIds.length,
      error: (err && err.errMsg) || (err && err.message) || 'deleteFile failed'
    };
  });
}

module.exports = {
  DOMAIN_OPTIONS,
  getAllPosts,
  getQuarantinedConflicts,
  getQuarantinedDrafts,
  getPostsByDomain,
  getStats,
  savePost,
  savePostConfirmed,
  deletePost,
  deletePostConfirmed,
  getPostById,
  saveDraft,
  getDraft,
  clearDraft,
  saveRetryDraft,
  getRetryDraft,
  clearRetryDraft,
  formatDate,
  formatDateShort,
  getCommunityFeed,
  getCommunityFeedLocal,
  getCloudCommunityFeed,
  searchPosts,
  isCloudIdentityReady,
  activateUserScope,
  deactivateUserScope,
  // 云同步 API
  syncFromCloud,
  syncToCloud,
  // 孤儿上传清理 manifest API
  saveCleanupManifest,
  getCleanupManifests,
  clearCleanupManifest,
  retryCleanupManifests,
  deleteCloudFilesConfirmed: _deleteCloudFilesConfirmed
};
