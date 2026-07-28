// utils/account-scope.js
// 为仍使用历史全局 storage key 的本地用户资产提供账号级快照隔离。
// 云端身份确认前不恢复任何已登录账号的数据，避免同设备 A → B 串号。

const SNAPSHOT_PREFIX = 'account_snapshot:';
const LEGACY_QUARANTINE_KEY = 'account_snapshot:legacy-unassigned';

const PERSONAL_EXACT_KEYS = new Set([
  'fengya_collections',
  'daily_elegance_checkin',
  'browse_history',
  'search_history',
  'user_points',
  'user_badges',
  'points_log',
  'user_preferences',
  'notification_settings',
  'study_progress',
  'study_wrong_book',
  'study_progress_cloud_synced',
  'daily_question_viewed',
  'film_status',
  'incense_history',
  'incense_timer_state',
  'content_incense_timer',
  'brew_timer_state',
  'fengya_events_buffer',
  'notes_index',
  'user_id',
  'subscribe_first_visit_requested',
  'access_token',
  'refresh_token'
]);

const PERSONAL_PREFIXES = [
  'reviews_',
  'comments_',
  'reply_',
  'review_likes_',
  'likes_',
  'views_',
  'notes_',
  'music_progress_',
  'daily_elegance_viewed_',
  'subscribed_',
  'subscribe_'
];

let _activeUserId = null;
let _scopeEpoch = 0;

function normalizedUserId(userId) {
  if (typeof userId !== 'string' || !userId.trim()) return null;
  const trimmed = userId.trim();
  return trimmed.length <= 200 ? trimmed : null;
}

function safeUserId(userId) {
  const normalized = normalizedUserId(userId);
  return normalized ? encodeURIComponent(normalized) : null;
}

function snapshotKey(userId) {
  const safeId = safeUserId(userId);
  return safeId ? `${SNAPSHOT_PREFIX}${safeId}` : null;
}

function isPersonalKey(key) {
  if (typeof key !== 'string' || key.startsWith(SNAPSHOT_PREFIX)) return false;
  return PERSONAL_EXACT_KEYS.has(key) ||
    PERSONAL_PREFIXES.some(prefix => key.startsWith(prefix));
}

function storageKeys() {
  try {
    const info = wx.getStorageInfoSync();
    if (!Array.isArray(info && info.keys)) {
      throw new Error('本地存储索引无效');
    }
    return info.keys;
  } catch (err) {
    throw new Error('账号本地数据索引读取失败');
  }
}

function capturePersonalData() {
  const snapshot = {};
  storageKeys().filter(isPersonalKey).forEach(key => {
    snapshot[key] = wx.getStorageSync(key);
  });
  return snapshot;
}

function clearPersonalData() {
  const keys = storageKeys().filter(isPersonalKey);
  keys.forEach(key => wx.removeStorageSync(key));
  const remaining = storageKeys().filter(isPersonalKey);
  if (remaining.length > 0) {
    throw new Error('账号本地数据清除失败');
  }
  return keys.length;
}

function clearPersonalDataFailClosed() {
  try {
    clearPersonalData();
  } finally {
    _activeUserId = null;
    _scopeEpoch += 1;
  }
}

function writeSnapshot(key, snapshot) {
  if (!key) return;
  try {
    wx.setStorageSync(key, snapshot);
  } catch (err) {
    throw new Error('账号本地数据快照保存失败');
  }
}

function restoreSnapshot(key) {
  const snapshot = key && wx.getStorageSync(key);
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    return 0;
  }
  const snapshotKeys = Object.keys(snapshot).filter(isPersonalKey);
  snapshotKeys.forEach(storageKey => {
    wx.setStorageSync(storageKey, snapshot[storageKey]);
  });
  return snapshotKeys.length;
}

/**
 * 登录验证开始或退出登录时调用：先保存当前账号快照，再清除活动全局键。
 * unknown/legacy 数据进入隔离快照，绝不自动挂到下一个登录账号。
 */
function suspendUserScope(userId) {
  const scopeUserId = normalizedUserId(userId) || _activeUserId;
  const key = scopeUserId ? snapshotKey(scopeUserId) : LEGACY_QUARANTINE_KEY;
  const snapshot = capturePersonalData();
  if (Object.keys(snapshot).length > 0) {
    writeSnapshot(key, snapshot);
  }
  try {
    clearPersonalData();
  } catch (err) {
    // 清除中途失败时，从刚写入的完整快照恢复后中止身份切换。
    if (Object.keys(snapshot).length > 0) {
      try {
        restoreSnapshot(key);
      } catch (restoreErr) {
        const failure = new Error('账号本地数据清除失败且恢复不完整');
        failure.cause = restoreErr;
        throw failure;
      }
    }
    const failure = new Error('账号本地数据清除失败');
    failure.cause = err;
    throw failure;
  }
  _activeUserId = null;
  _scopeEpoch += 1;
  return {
    saved: Object.keys(snapshot).length,
    quarantined: scopeUserId ? 0 : Object.keys(snapshot).length
  };
}

/**
 * 云端登录确认成功后调用：只恢复该 users._id 对应的本地资产。
 */
function activateUserScope(userId) {
  const normalized = normalizedUserId(userId);
  if (!normalized) throw new Error('账号本地数据作用域无效');
  const key = snapshotKey(normalized);
  clearPersonalData();
  let restored;
  try {
    restored = restoreSnapshot(key);
  } catch (err) {
    clearPersonalDataFailClosed();
    throw new Error('账号本地数据快照恢复失败');
  }
  _activeUserId = normalized;
  _scopeEpoch += 1;
  return { restored, scopeKey: key };
}

function deactivateUserScope() {
  return suspendUserScope(_activeUserId);
}

function getActiveUserId() {
  return _activeUserId;
}

function captureActiveScope() {
  if (!_activeUserId) return null;
  return {
    userId: _activeUserId,
    epoch: _scopeEpoch
  };
}

function isActiveScope(scope) {
  return !!(
    scope &&
    typeof scope.userId === 'string' &&
    scope.userId === _activeUserId &&
    scope.epoch === _scopeEpoch
  );
}

module.exports = {
  activateUserScope,
  suspendUserScope,
  deactivateUserScope,
  getActiveUserId,
  captureActiveScope,
  isActiveScope,
  isPersonalKey,
  clearPersonalDataFailClosed
};
