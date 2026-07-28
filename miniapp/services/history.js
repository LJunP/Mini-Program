// services/history.js — 浏览历史服务
// 改造：优先走云函数，未登录时降级到本地存储

const STORAGE_KEY = 'browse_history';
const MAX_HISTORY_COUNT = 100; // 最大历史记录数量

function _isLoggedIn() {
  try {
    return !!require('../utils/account-scope.js').captureActiveScope()
  } catch (e) {
    return false
  }
}

function _captureScope() {
  try {
    return require('../utils/account-scope.js').captureActiveScope()
  } catch (e) {
    return null
  }
}

function _isScopeCurrent(scope) {
  try {
    return require('../utils/account-scope.js').isActiveScope(scope)
  } catch (e) {
    return false
  }
}

// ========== 本地存储（降级用） ==========

function _loadLocal() {
  try {
    const history = wx.getStorageSync(STORAGE_KEY) || [];
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.warn('[history] _loadLocal error:', e);
    return [];
  }
}

function _saveLocal(history) {
  try {
    wx.setStorageSync(STORAGE_KEY, history);
  } catch (e) {
    console.warn('[history] _saveLocal error:', e);
  }
}

// ========== 云函数调用 ==========

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'history',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

/**
 * 获取浏览历史列表
 * 已登录时从云端拉取，未登录时用本地
 * @returns {Promise<Array>} 浏览历史列表（按时间倒序）
 */
function getHistoryList() {
  const scope = _captureScope()
  if (scope) {
    return _callCloud({ action: 'getList' }).then(res => {
      if (!_isScopeCurrent(scope)) {
        return _loadLocal()
      }
      if (res.code === 0 && res.list) {
        // 同步本地缓存
        _saveLocal(res.list.map(item => ({
          domain: item.domain,
          refId: item.ref_id,
          name: item.name,
          date: (item.visited_at || '').slice(0, 10),
          timestamp: new Date(item.visited_at).getTime() || Date.now()
        })));
        return res.list.map(item => ({
          domain: item.domain,
          refId: item.ref_id,
          name: item.name,
          date: (item.visited_at || '').slice(0, 10),
          timestamp: new Date(item.visited_at).getTime() || Date.now()
        }));
      }
      return _loadLocal();
    }).catch(() => _loadLocal());
  }
  return Promise.resolve(_loadLocal());
}

/**
 * 添加浏览历史
 * 本地先写入（确保即时响应），已登录则同步云端
 * @param {Object} record - 浏览记录
 */
function addHistoryRecord(record) {
  // 本地先更新
  try {
    const history = _loadLocal();
    const newRecord = {
      domain: record.domain,
      refId: record.refId,
      name: record.name,
      date: record.date || new Date().toISOString().slice(0, 10),
      timestamp: Date.now()
    };

    // 去重：移除相同记录
    const existingIndex = history.findIndex(
      item => item.domain === record.domain && item.refId === record.refId
    );
    if (existingIndex > -1) {
      history.splice(existingIndex, 1);
    }
    history.unshift(newRecord);
    _saveLocal(history.slice(0, MAX_HISTORY_COUNT));
  } catch (e) {
    console.error('[history] addHistoryRecord local error:', e);
  }

  // 已登录则同步到云端
  if (_isLoggedIn()) {
    _callCloud({
      action: 'add',
      domain: record.domain,
      ref_id: record.refId,
      name: record.name
    }).catch(() => {});
  }

  return true;
}

/**
 * 删除单条历史记录
 * @param {string} key - 记录的唯一标识（domain_refId）
 */
function deleteHistoryRecord(key) {
  const splitIndex = key.indexOf('_');
  const domain = key.substring(0, splitIndex);
  const refId = key.substring(splitIndex + 1);

  // 本地先删除
  try {
    const history = _loadLocal();
    const filteredHistory = history.filter(
      item => !(item.domain === domain && item.refId === refId)
    );
    _saveLocal(filteredHistory);
  } catch (e) {
    console.error('[history] deleteHistoryRecord local error:', e);
  }

  // 已登录则同步云端
  if (_isLoggedIn()) {
    _callCloud({
      action: 'deleteOne',
      domain,
      ref_id: refId
    }).catch(() => {});
  }

  return true;
}

/**
 * 清空所有浏览历史
 */
function clearAllHistory() {
  // 本地先清空
  try {
    _saveLocal([]);
  } catch (e) {
    console.error('[history] clearAllHistory local error:', e);
  }

  // 已登录则同步云端
  if (_isLoggedIn()) {
    _callCloud({ action: 'clearAll' }).catch(() => {});
  }

  return true;
}

/**
 * 获取浏览历史统计
 */
function getHistoryStats() {
  const history = _loadLocal();
  const stats = {
    total: history.length,
    byDomain: {}
  };
  history.forEach(item => {
    if (!stats.byDomain[item.domain]) {
      stats.byDomain[item.domain] = 0;
    }
    stats.byDomain[item.domain]++;
  });
  return stats;
}

/**
 * 为历史记录生成唯一键
 */
function getRecordKey(record) {
  return `${record.domain}_${record.refId}`;
}

module.exports = {
  getHistoryList,
  addHistoryRecord,
  deleteHistoryRecord,
  clearAllHistory,
  getHistoryStats,
  getRecordKey
};
