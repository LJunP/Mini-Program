// utils/cache.js — 本地缓存管理（带过期时间）

/**
 * 写入缓存
 * @param {string} key
 * @param {*} value
 * @param {number} ttl 过期时间（毫秒），0 表示永不过期
 */
function set(key, value, ttl = 0) {
  const data = {
    value,
    expire: ttl > 0 ? Date.now() + ttl : 0
  };
  try {
    wx.setStorageSync(key, data);
  } catch (e) {
    console.warn('[cache] set failed', key, e);
  }
}

/**
 * 读取缓存，过期返回 null
 */
function get(key) {
  try {
    const data = wx.getStorageSync(key);
    if (!data) return null;
    if (data.expire && data.expire < Date.now()) {
      wx.removeStorageSync(key);
      return null;
    }
    return data.value;
  } catch (e) {
    return null;
  }
}

/**
 * 删除缓存
 */
function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {}
}

/**
 * 清空所有 fengya_ 前缀的缓存
 */
function clear() {
  try {
    const info = wx.getStorageInfoSync();
    info.keys.forEach(k => {
      if (k.indexOf('fengya_') === 0) wx.removeStorageSync(k);
    });
  } catch (e) {}
}

module.exports = { set, get, remove, clear };
