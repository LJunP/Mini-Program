// services/notification-settings.js — 通知设置服务
// 管理通知设置的本地存储和读取
// 改造：本地优先读写，已登录时异步同步到云端

const STORAGE_KEY = 'notification_settings';

// 默认通知设置
const DEFAULT_SETTINGS = {
  // 推送通知
  pushEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  
  // 免打扰
  dndEnabled: false,
  dndStartTime: '22:00',
  dndEndTime: '08:00',
  
  // 推送时间
  recommendTime: '08:00',
  
  // 通知类型开关
  notificationTypes: {
    DAILY_RECOMMEND: true,
    SIGN_REMIND: true,
    CONTENT_UPDATE: true,
    ACTIVITY_REMIND: false,
    SYSTEM_NOTICE: true
  }
};

/**
 * 获取通知设置
 * @returns {Object} 通知设置对象
 */
function getSettings() {
  try {
    const settings = wx.getStorageSync(STORAGE_KEY);
    return settings ? { ...DEFAULT_SETTINGS, ...settings } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    console.warn('[notification] getSettings error:', e);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * 保存通知设置
 * @param {Object} settings - 通知设置对象
 * @returns {boolean} 是否保存成功
 */
function saveSettings(settings) {
  try {
    wx.setStorageSync(STORAGE_KEY, settings);
    return true;
  } catch (e) {
    console.error('[notification] saveSettings error:', e);
    return false;
  }
}

/**
 * 更新部分设置
 * @param {Object} patch - 要更新的设置
 * @returns {Object} 更新后的完整设置
 */
function updateSettings(patch) {
  const current = getSettings();
  const updated = { ...current, ...patch };
  saveSettings(updated);
  return updated;
}

/**
 * 切换推送通知
 * @param {boolean} enabled - 是否启用
 * @returns {Object} 更新后的设置
 */
function togglePush(enabled) {
  return updateSettings({ pushEnabled: enabled });
}

/**
 * 切换通知声音
 * @param {boolean} enabled - 是否启用
 * @returns {Object} 更新后的设置
 */
function toggleSound(enabled) {
  return updateSettings({ soundEnabled: enabled });
}

/**
 * 切换震动提醒
 * @param {boolean} enabled - 是否启用
 * @returns {Object} 更新后的设置
 */
function toggleVibration(enabled) {
  return updateSettings({ vibrationEnabled: enabled });
}

/**
 * 切换免打扰模式
 * @param {boolean} enabled - 是否启用
 * @returns {Object} 更新后的设置
 */
function toggleDnd(enabled) {
  return updateSettings({ dndEnabled: enabled });
}

/**
 * 设置免打扰时间
 * @param {string} startTime - 开始时间 (HH:mm)
 * @param {string} endTime - 结束时间 (HH:mm)
 * @returns {Object} 更新后的设置
 */
function setDndTime(startTime, endTime) {
  return updateSettings({
    dndStartTime: startTime,
    dndEndTime: endTime
  });
}

/**
 * 设置每日推荐时间
 * @param {string} time - 推荐时间 (HH:mm)
 * @returns {Object} 更新后的设置
 */
function setRecommendTime(time) {
  return updateSettings({ recommendTime: time });
}

/**
 * 切换通知类型
 * @param {string} type - 通知类型
 * @param {boolean} enabled - 是否启用
 * @returns {Object} 更新后的设置
 */
function toggleNotificationType(type, enabled) {
  const settings = getSettings();
  const notificationTypes = { ...settings.notificationTypes };
  notificationTypes[type] = enabled;
  return updateSettings({ notificationTypes });
}

/**
 * 检查当前是否在免打扰时段
 * @returns {boolean} 是否在免打扰时段
 */
function isInDndPeriod() {
  const settings = getSettings();
  if (!settings.dndEnabled) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMinute] = settings.dndStartTime.split(':').map(Number);
  const [endHour, endMinute] = settings.dndEndTime.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  // 处理跨夜的情况
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  } else {
    return currentTime >= startTime && currentTime < endTime;
  }
}

/**
 * 检查是否应该发送通知
 * @param {string} notificationType - 通知类型
 * @returns {boolean} 是否应该发送
 */
function shouldSendNotification(notificationType) {
  const settings = getSettings();
  
  // 检查推送总开关
  if (!settings.pushEnabled) return false;
  
  // 检查免打扰时段
  if (isInDndPeriod()) return false;
  
  // 检查具体通知类型
  if (notificationType && settings.notificationTypes[notificationType] === false) {
    return false;
  }
  
  return true;
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
      name: 'notificationSettings',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

// ========== 云端同步 API ==========

/**
 * 从云端拉取通知设置，覆盖本地
 */
function syncFromCloud() {
  const scope = _captureScope()
  if (!scope) return Promise.resolve({ synced: false })

  return _callCloud({ action: 'get' }).then(res => {
    if (!_isScopeCurrent(scope)) {
      return { synced: false, reason: 'account_scope_changed' }
    }
    if (res.code !== 0 || !res.has_data || !res.settings) {
      return { synced: false, reason: 'no_cloud_data' }
    }

    // 合并云端设置与默认值
    const merged = { ...DEFAULT_SETTINGS, ...res.settings }
    if (res.settings.notificationTypes) {
      merged.notificationTypes = { ...DEFAULT_SETTINGS.notificationTypes, ...res.settings.notificationTypes }
    }
    wx.setStorageSync(STORAGE_KEY, merged)
    return { synced: true }
  }).catch(err => {
    console.warn('[notification] syncFromCloud failed:', err)
    return { synced: false, error: err }
  })
}

/**
 * 将本地通知设置推送到云端
 */
function syncToCloud() {
  const scope = _captureScope()
  if (!scope) return Promise.resolve({ synced: false })

  const settings = getSettings()
  return _callCloud({ action: 'save', settings }).then(res => {
    if (!_isScopeCurrent(scope)) {
      return { synced: false, reason: 'account_scope_changed' }
    }
    return { synced: res.code === 0, updated_at: res.updated_at }
  }).catch(err => {
    console.warn('[notification] syncToCloud failed:', err)
    return { synced: false, error: err }
  })
}

module.exports = {
  getSettings,
  saveSettings,
  updateSettings,
  togglePush,
  toggleSound,
  toggleVibration,
  toggleDnd,
  setDndTime,
  setRecommendTime,
  toggleNotificationType,
  isInDndPeriod,
  shouldSendNotification,
  // 云同步 API
  syncFromCloud,
  syncToCloud
};
