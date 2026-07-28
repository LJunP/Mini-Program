// services/preferences.js — 偏好设置服务
// 管理六维风雅偏好的本地存储和读取
// 改造：本地优先读写，已登录时异步同步到云端

const STORAGE_KEY = 'user_preferences';

// 默认偏好配置
const DEFAULT_PREFERENCES = {
  tea: {
    name: '茶道',
    description: '品茗、茶艺、茶文化',
    value: 50,
    color: '#3B6D11',
    tags: ['绿茶', '红茶', '乌龙茶', '普洱', '白茶']
  },
  travel: {
    name: '行旅',
    description: '旅行、游记、风土人情',
    value: 50,
    color: '#5B8C85',
    tags: ['古镇', '山水', '田园', '城市漫步', '文化遗产']
  },
  wellness: {
    name: '养生',
    description: '健康、冥想、身心调养',
    value: 50,
    color: '#A0522D',
    tags: ['太极', '瑜伽', '食疗', '节气养生', '冥想']
  },
  incense: {
    name: '香道',
    description: '焚香、香文化、香料鉴赏',
    value: 50,
    color: '#8B6F47',
    tags: ['沉香', '檀香', '线香', '盘香', '香炉']
  },
  music: {
    name: '音乐',
    description: '古典音乐、民乐、自然之声',
    value: 50,
    color: '#4A6B7C',
    tags: ['古琴', '箫', '琵琶', '古筝', '自然音']
  },
  film: {
    name: '电影',
    description: '文艺电影、纪录片、传统文化',
    value: 50,
    color: '#2C2C2A',
    tags: ['纪录片', '文艺片', '传统文化', '自然风光', '慢生活']
  }
};

/**
 * 获取偏好设置
 * @returns {Object} 偏好设置对象
 */
function getPreferences() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (stored) {
      // 合并默认值，确保所有字段都存在
      const result = {};
      for (const key in DEFAULT_PREFERENCES) {
        if (stored[key]) {
          result[key] = {
            ...DEFAULT_PREFERENCES[key],
            ...stored[key]
          };
        } else {
          result[key] = { ...DEFAULT_PREFERENCES[key] };
        }
      }
      return result;
    }
  } catch (e) {
    console.warn('[preferences] getPreferences error:', e);
  }
  
  return { ...DEFAULT_PREFERENCES };
}

/**
 * 保存偏好设置
 * @param {Object} preferences - 偏好设置对象
 * @returns {boolean} 是否保存成功
 */
function savePreferences(preferences) {
  try {
    wx.setStorageSync(STORAGE_KEY, preferences);
    return true;
  } catch (e) {
    console.error('[preferences] savePreferences error:', e);
    return false;
  }
}

/**
 * 更新单个偏好设置
 * @param {string} key - 偏好键名
 * @param {number} value - 偏好值 (0-100)
 * @returns {Object} 更新后的偏好设置
 */
function updatePreference(key, value) {
  const preferences = getPreferences();
  if (preferences[key]) {
    preferences[key].value = Math.max(0, Math.min(100, value));
    savePreferences(preferences);
  }
  return preferences;
}

/**
 * 重置所有偏好为默认值
 * @returns {Object} 默认偏好设置
 */
function resetPreferences() {
  const defaultPrefs = { ...DEFAULT_PREFERENCES };
  savePreferences(defaultPrefs);
  return defaultPrefs;
}

/**
 * 获取偏好值列表（用于store）
 * @returns {Object} 偏好值对象 { tea: 50, travel: 50, ... }
 */
function getPreferenceValues() {
  const preferences = getPreferences();
  const values = {};
  for (const key in preferences) {
    values[key] = preferences[key].value;
  }
  return values;
}

// ========== 登录状态 & 云函数调用 ==========

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

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'preferences',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

// ========== 云端同步 API ==========

/**
 * 从云端拉取偏好设置，覆盖本地
 */
function syncFromCloud() {
  const scope = _captureScope()
  if (!scope) return Promise.resolve({ synced: false })

  return _callCloud({ action: 'get' }).then(res => {
    if (!_isScopeCurrent(scope)) {
      return { synced: false, reason: 'account_scope_changed' }
    }
    if (res.code !== 0 || !res.has_data || !res.preferences) {
      return { synced: false, reason: 'no_cloud_data' }
    }

    // 合并云端偏好与默认值
    const cloudPrefs = res.preferences
    const result = {}
    for (const key in DEFAULT_PREFERENCES) {
      if (cloudPrefs[key]) {
        result[key] = { ...DEFAULT_PREFERENCES[key], ...cloudPrefs[key] }
      } else {
        result[key] = { ...DEFAULT_PREFERENCES[key] }
      }
    }
    wx.setStorageSync(STORAGE_KEY, result)
    return { synced: true }
  }).catch(err => {
    console.warn('[preferences] syncFromCloud failed:', err)
    return { synced: false, error: err }
  })
}

/**
 * 将本地偏好推送到云端
 */
function syncToCloud() {
  const scope = _captureScope()
  if (!scope) return Promise.resolve({ synced: false })

  const preferences = getPreferences()
  return _callCloud({ action: 'save', preferences }).then(res => {
    if (!_isScopeCurrent(scope)) {
      return { synced: false, reason: 'account_scope_changed' }
    }
    return { synced: res.code === 0, updated_at: res.updated_at }
  }).catch(err => {
    console.warn('[preferences] syncToCloud failed:', err)
    return { synced: false, error: err }
  })
}

module.exports = {
  getPreferences,
  savePreferences,
  updatePreference,
  resetPreferences,
  getPreferenceValues,
  DEFAULT_PREFERENCES,
  // 云同步 API
  syncFromCloud,
  syncToCloud
};
