// utils/tracker.js — 埋点 SDK
// 批量上报：攒够 10 条或 3 秒定时 flush
// 通过云函数 track 上报到云数据库，降级时写入本地缓存

let auth = null;

function _getAuth() {
  if (!auth) {
    try {
      auth = require('./auth.js');
    } catch (e) {
      return null;
    }
  }
  return auth;
}

const MAX_BATCH = 10;
const FLUSH_INTERVAL = 3000;
const PERSIST_INTERVAL = 10000;
const STORAGE_KEY = 'fengya_events_buffer';
const MAX_RETRY = 2;
const MAX_QUEUE_SIZE = 200; // 队列上限，超过则丢弃旧事件

let queue = [];
let flushTimer = null;
let persistTimer = null;
let inited = false;
let _dirty = false;
let _isFlushing = false;
let _sessionGeneration = 0;

function _readPersistedQueue() {
  try {
    const cached = wx.getStorageSync(STORAGE_KEY);
    return Array.isArray(cached) ? cached.slice(0, MAX_QUEUE_SIZE) : [];
  } catch (e) {
    return [];
  }
}

function init() {
  if (inited) return;
  inited = true;

  // 恢复未上报的事件
  queue = _readPersistedQueue();

  flushTimer = setInterval(() => {
    flush();
  }, FLUSH_INTERVAL);

  persistTimer = setInterval(() => {
    if (_dirty) {
      _persist();
      _dirty = false;
    }
  }, PERSIST_INTERVAL);
}

function track(eventName, params = {}) {
  const authModule = _getAuth();
  const user = (authModule && typeof authModule.getUserInfo === 'function' ? authModule.getUserInfo() : null) || {};
  const event = {
    event_name: eventName,
    event_params: params.event_params || params,
    target_domain: params.target_domain || null,
    target_ref_id: params.target_ref_id || null,
    page_path: params.page_path || getCurrentPagePath(),
    scene: params.scene || (typeof wx.getEnterOptionsSync === 'function' ? wx.getEnterOptionsSync().scene : null),
    user_id: user.id || null,
    openid: user.openid || null,
    timestamp: Date.now()
  };
  queue.push(event);
  _dirty = true;

  // 队列超限时丢弃旧事件
  if (queue.length > MAX_QUEUE_SIZE) {
    queue.splice(0, queue.length - MAX_QUEUE_SIZE);
  }

  if (queue.length >= MAX_BATCH) {
    flush();
  }
}

/**
 * 立即上报：通过云函数批量上报
 */
function flush() {
  if (!queue.length || _isFlushing) return;
  _isFlushing = true;

  const batch = queue.splice(0, queue.length);
  const flushGeneration = _sessionGeneration;
  _dirty = false;
  _persist();

  // 通过云函数上报
  wx.cloud.callFunction({
    name: 'track',
    data: { events: batch },
    success: (res) => {
      if (flushGeneration !== _sessionGeneration) return;
      _isFlushing = false;
      const result = (res && res.result) || {};
      if (result.code !== 0) {
        // 上报失败，回填队列（限制总长度）
        queue.unshift(...batch);
        if (queue.length > MAX_QUEUE_SIZE) {
          queue.splice(MAX_QUEUE_SIZE);
        }
        _persist();
      }
    },
    fail: () => {
      if (flushGeneration !== _sessionGeneration) return;
      _isFlushing = false;
      // 云函数不可用时回填队列，但限制总长度
      queue.unshift(...batch);
      if (queue.length > MAX_QUEUE_SIZE) {
        queue.splice(MAX_QUEUE_SIZE);
      }
      _persist();
    }
  });
}

function getCurrentPagePath() {
  try {
    const pages = getCurrentPages();
    const cur = pages[pages.length - 1];
    return cur ? cur.route : '';
  } catch (e) {
    return '';
  }
}

function _persist() {
  try {
    wx.setStorageSync(STORAGE_KEY, queue);
  } catch (e) {}
}

function persist() {
  if (_dirty) {
    _persist();
    _dirty = false;
  }
}

/**
 * 清除只属于当前登录会话的内存状态。
 * reloadPersisted=true 只应在新账号作用域恢复完成后使用。
 */
function resetSessionCache(options = {}) {
  _sessionGeneration++;
  queue = options.reloadPersisted === true ? _readPersistedQueue() : [];
  _dirty = false;
  _isFlushing = false;
  auth = null;
}

module.exports = {
  init,
  track,
  flush,
  persist,
  resetSessionCache
};
