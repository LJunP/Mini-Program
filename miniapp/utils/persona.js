// utils/persona.js — 风雅画像计算
// 根据用户在六雅各板块的行为（浏览/收藏/点评）生成偏好雷达图和人格类型

// 计算结果缓存（避免重复读取 storage 和计算）
let _cachedResult = null;
let _cacheTime = 0;
const CACHE_TTL = 30 * 1000; // 30 秒缓存

/**
 * 板块元信息
 */
const DOMAINS = {
  incense:  { name: '香', label: '焚香', color: '#8B6F47' },
  music:    { name: '音', label: '听曲', color: '#4A6B7C' },
  tea:      { name: '茶', label: '品茗', color: '#3B6D11' },
  film:     { name: '影', label: '看戏', color: '#2C2C2A' },
  wellness: { name: '养', label: '养生', color: '#A0522D' },
  travel:   { name: '游', label: '行旅', color: '#5B8C85' }
};

/**
 * 人格类型定义
 * 基于偏好的 top-2 板块组合来判定
 */
const PERSONA_TYPES = {
  'tea-travel':     { name: '茶旅行者', desc: '以茶为引，行遍山川，在路上品味风雅' },
  'tea-wellness':   { name: '养生茶人', desc: '以茶养身，以养修心，内外兼修的风雅之道' },
  'tea-incense':    { name: '禅茶一味', desc: '焚香品茗，于静处见真味' },
  'tea-film':       { name: '影茶人生', desc: '在光影与茶汤中，品味人间故事' },
  'travel-wellness':{ name: '行者养生', desc: '行万里路，养一身安，风雅在路上' },
  'travel-incense': { name: '山间香客', desc: '行至山水间，焚一炷香，听风过耳' },
  'incense-music':  { name: '隐逸雅士', desc: '焚香听曲，不问世事，自得其乐' },
  'incense-film':   { name: '文人雅趣', desc: '焚香观影，在古今之间品味人世' },
  'music-film':     { name: '文艺雅客', desc: '音影相伴，在视听中感受生活的美' },
  'wellness-tea':   { name: '养生茶人', desc: '以茶养身，以养修心，内外兼修' },
  default:          { name: '风雅初成', desc: '正在探索属于自己的风雅之道' }
};

/**
 * 从本地 storage 读取用户行为数据，计算六维偏好
 * 带有 30 秒缓存，避免重复读取 storage 和计算
 * @returns {{ affinity: {key: value}, topDomains: string[], persona: object }}
 */
function calculatePersona() {
  // 检查缓存是否有效
  const now = Date.now();
  if (_cachedResult && (now - _cacheTime) < CACHE_TTL) {
    return _cachedResult;
  }

  const affinity = {
    incense: 0,
    music: 0,
    tea: 0,
    film: 0,
    wellness: 0,
    travel: 0
  };

  // 1. 浏览历史（每浏览一次 +1）
  const history = wx.getStorageSync('browse_history') || [];
  history.forEach(item => {
    if (item.domain && affinity[item.domain] !== undefined) {
      affinity[item.domain] += 1;
    }
  });

  // 2. 收藏（每收藏一个 +3）
  const collectionList = wx.getStorageSync('fengya_collections') || [];
  if (Array.isArray(collectionList)) {
    collectionList.forEach(item => {
      if (item.target_domain && affinity[item.target_domain] !== undefined) {
        affinity[item.target_domain] += 3;
      }
    });
  }

  // 3. 点评（每点评一次 +5）
  const allKeys = wx.getStorageInfoSync().keys || [];
  allKeys.forEach(key => {
    if (key.startsWith('reviews_')) {
      const reviews = wx.getStorageSync(key) || [];
      // 从 key 中提取 tea id，归属到 tea 板块
      affinity.tea += reviews.length * 5;
    }
  });

  // 归一化到 0-10
  const maxVal = Math.max(...Object.values(affinity), 1);
  Object.keys(affinity).forEach(k => {
    affinity[k] = Math.round((affinity[k] / maxVal) * 10 * 10) / 10;
  });

  // 取 top-2 板块
  const sorted = Object.entries(affinity).sort((a, b) => b[1] - a[1]);
  const topDomains = sorted.slice(0, 2).map(([k]) => k).sort();
  const personaKey = topDomains.join('-');
  const persona = PERSONA_TYPES[personaKey] || PERSONA_TYPES.default;

  const result = { affinity, topDomains, persona };
  
  // 更新缓存
  _cachedResult = result;
  _cacheTime = now;

  return result;
}

/**
 * 清除画像缓存（在用户行为变化后调用）
 */
function invalidateCache() {
  _cachedResult = null;
  _cacheTime = 0;
}

// 账号切换或退出时必须显式清空，防止 30 秒缓存跨账号复用。
function resetSessionCache() {
  invalidateCache();
}

/**
 * 记录浏览行为
 * @param {string} domain 板块名
 * @param {string} refId 内容 id
 * @param {string} name 内容标题（可选）
 */
function trackBrowse(domain, refId, name) {
  if (!domain) return;
  const history = wx.getStorageSync('browse_history') || [];
  // 去重：同一天同一个内容只记录一次
  const today = new Date().toISOString().slice(0, 10);
  const exists = history.find(h => h.domain === domain && h.refId === refId && h.date === today);
  if (!exists) {
    history.push({ domain, refId, name: name || '', date: today });
    // 只保留最近 200 条
    if (history.length > 200) history.splice(0, history.length - 200);
    wx.setStorageSync('browse_history', history);
    // 积分：新浏览加积分
    try {
      const points = require('./points.js');
      points.onBrowse(domain);
    } catch (e) {}
    // 数据变化，清除缓存
    invalidateCache();
  }
}

module.exports = {
  DOMAINS,
  PERSONA_TYPES,
  calculatePersona,
  invalidateCache,
  resetSessionCache,
  trackBrowse
};
