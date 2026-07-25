// utils/content-interaction.js
// 内容交互管理：电影看过/想看状态、用户评分、香道焚香记录
// 本地存储版，未来可迁移云端

const STORAGE_KEYS = {
  filmStatus: 'film_status',       // 电影观看状态 { filmId: { status: 'watched'|'want', rating: 0, ratedAt: '' } }
  incenseHistory: 'incense_history', // 焚香记录 [{ id, incenseId, incenseName, duration, date, note }]
  wellnessMeta: 'wellness_meta'     // 养生内容扩展元数据 { contentId: { difficulty, duration, category } }
};

// ============ 电影状态管理 ============

/**
 * 获取电影观看状态
 */
function getFilmStatus(filmId) {
  try {
    const all = wx.getStorageSync(STORAGE_KEYS.filmStatus) || {};
    return all[filmId] || null;
  } catch (e) {
    return null;
  }
}

/**
 * 设置电影观看状态
 * @param {string} filmId 电影ID
 * @param {string} status 'watched' | 'want' | null(取消)
 */
function setFilmStatus(filmId, status) {
  try {
    const all = wx.getStorageSync(STORAGE_KEYS.filmStatus) || {};
    if (status === null) {
      delete all[filmId];
    } else {
      const existing = all[filmId] || {};
      all[filmId] = { ...existing, status, updatedAt: Date.now() };
    }
    wx.setStorageSync(STORAGE_KEYS.filmStatus, all);
    return all[filmId];
  } catch (e) {
    console.warn('[content-interaction] setFilmStatus failed', e);
    return null;
  }
}

/**
 * 设置电影评分
 * @param {string} filmId
 * @param {number} rating 1-5
 */
function setFilmRating(filmId, rating) {
  try {
    const all = wx.getStorageSync(STORAGE_KEYS.filmStatus) || {};
    const existing = all[filmId] || {};
    all[filmId] = { ...existing, rating, status: existing.status || 'watched', ratedAt: Date.now() };
    wx.setStorageSync(STORAGE_KEYS.filmStatus, all);
    return all[filmId];
  } catch (e) {
    return null;
  }
}

/**
 * 获取所有电影状态（用于列表批量展示）
 */
function getAllFilmStatus() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.filmStatus) || {};
  } catch (e) {
    return {};
  }
}

/**
 * 为电影列表添加状态信息
 */
function enrichFilmList(list) {
  const allStatus = getAllFilmStatus();
  return list.map(item => {
    const statusInfo = allStatus[item.id];
    return {
      ...item,
      watchStatus: statusInfo ? statusInfo.status : '',
      userRating: statusInfo ? (statusInfo.rating || 0) : 0
    };
  });
}

// ============ 香道焚香记录 ============

/**
 * 添加焚香记录
 * @param {Object} record { incenseId, incenseName, duration(分钟) }
 */
function addIncenseRecord(record) {
  try {
    const history = wx.getStorageSync(STORAGE_KEYS.incenseHistory) || [];
    const newRecord = {
      id: 'incense_' + Date.now(),
      incenseId: record.incenseId || '',
      incenseName: record.incenseName || '焚香',
      duration: record.duration || 30,
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
      note: record.note || ''
    };
    history.unshift(newRecord);
    if (history.length > 100) history.length = 100;
    wx.setStorageSync(STORAGE_KEYS.incenseHistory, history);
    return newRecord;
  } catch (e) {
    console.warn('[content-interaction] addIncenseRecord failed', e);
    return null;
  }
}

/**
 * 获取焚香记录
 */
function getIncenseHistory() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.incenseHistory) || [];
  } catch (e) {
    return [];
  }
}

/**
 * 获取焚香统计
 */
function getIncenseStats() {
  const history = getIncenseHistory();
  return {
    total: history.length,
    totalDuration: history.reduce((sum, r) => sum + (r.duration || 0), 0),
    thisMonth: history.filter(r => {
      const now = new Date();
      const d = new Date(r.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length
  };
}

// ============ 养生内容扩展元数据 ============

// 养生细分类定义
const WELLNESS_CATEGORIES = [
  { key: 'all', name: '全部', icon: '🌿' },
  { key: 'seasonal', name: '顺时养生', icon: '🌸' },
  { key: 'dietary', name: '饮食调理', icon: '🍚' },
  { key: 'exercise', name: '运动导引', icon: '🏃' },
  { key: 'sleep', name: '睡眠安神', icon: '😴' },
  { key: 'mental', name: '情志调养', icon: '🧘' },
  { key: 'habit', name: '日常习惯', icon: '⏰' }
];

// 养生难度等级
const WELLNESS_DIFFICULTY = [
  { key: 0, name: '全部' },
  { key: 1, name: '极易' },
  { key: 2, name: '容易' },
  { key: 3, name: '中等' },
  { key: 4, name: '需要坚持' }
];

// 养生耗时标记
const WELLNESS_DURATION = [
  { key: 'all', name: '全部' },
  { key: '5min', name: '5分钟内' },
  { key: '15min', name: '15分钟内' },
  { key: '30min', name: '30分钟内' },
  { key: 'ongoing', name: '持续养成' }
];

// 差异化禁忌文案
const WELLNESS_CAUTIONS = {
  seasonal: '顺应四时变化，体质偏寒者请酌情调整。',
  dietary: '饮食调理因人而异，过敏体质者请注意食材禁忌。',
  exercise: '运动前请充分热身，有慢性病史者请遵医嘱。',
  sleep: '如有严重失眠，建议就医排查原因，勿长期依赖助眠方法。',
  mental: '情志调养为辅助手段，情绪持续低落请寻求专业帮助。',
  habit: '习惯养成需循序渐进，不必追求一步到位。',
  default: '日常调理参考，严重不适请及时就医。'
};

function getWellnessCaution(category) {
  return WELLNESS_CAUTIONS[category] || WELLNESS_CAUTIONS.default;
}

/**
 * 自动推断养生内容的分类
 */
function inferWellnessCategory(item) {
  const title = (item.title || '').toLowerCase();
  const body = (item.body || '').toLowerCase();
  const text = title + body;

  if (text.includes('春') || text.includes('夏') || text.includes('秋') || text.includes('冬') || 
      text.includes('节气') || text.includes('顺时') || text.includes('季节')) {
    return 'seasonal';
  }
  if (text.includes('食') || text.includes('饮') || text.includes('茶') || text.includes('粥') || 
      text.includes('汤') || text.includes('吃')) {
    return 'dietary';
  }
  if (text.includes('运动') || text.includes('导引') || text.includes('太极') || 
      text.includes('八段锦') || text.includes('散步') || text.includes('拉伸')) {
    return 'exercise';
  }
  if (text.includes('睡') || text.includes('眠') || text.includes('安神') || 
      text.includes('助眠') || text.includes('泡脚')) {
    return 'sleep';
  }
  if (text.includes('情绪') || text.includes('情志') || text.includes('冥想') || 
      text.includes('静心') || text.includes('减压') || text.includes('呼吸')) {
    return 'mental';
  }
  return 'habit';
}

/**
 * 推断养生内容难度
 */
function inferWellnessDifficulty(item) {
  const body = (item.body || '').toLowerCase();
  if (body.includes('简单') || body.includes('容易') || body.includes('日常')) return 1;
  if (body.includes('坚持') || body.includes('长期') || body.includes('持续')) return 4;
  if (body.includes('中等') || body.includes('适度')) return 3;
  return 2;
}

/**
 * 推断养生内容耗时
 */
function inferWellnessDuration(item) {
  const body = (item.body || '').toLowerCase();
  if (body.includes('5分钟') || body.includes('三分钟') || body.includes('快速')) return '5min';
  if (body.includes('15分钟') || body.includes('十分钟') || body.includes('片刻')) return '15min';
  if (body.includes('30分钟') || body.includes('半小时') || body.includes('20分钟')) return '30min';
  if (body.includes('坚持') || body.includes('长期') || body.includes('养成') || body.includes('日常')) return 'ongoing';
  return '15min';
}

/**
 * 为养生列表添加分类和元数据
 */
function enrichWellnessList(list) {
  return list.map(item => {
    const category = item.wellnessCategory || inferWellnessCategory(item);
    const difficulty = item.difficulty || inferWellnessDifficulty(item);
    const durationTag = item.durationTag || inferWellnessDuration(item);
    return {
      ...item,
      wellnessCategory: category,
      difficulty,
      durationTag,
      caution: getWellnessCaution(category)
    };
  });
}

// ============ 行旅筛选 ============

const TRAVEL_REGIONS = [
  { key: 'all', name: '全部地区' },
  { key: 'east', name: '华东' },
  { key: 'south', name: '华南' },
  { key: 'north', name: '华北' },
  { key: 'west', name: '西部' },
  { key: 'central', name: '华中' },
  { key: 'northeast', name: '东北' },
  { key: 'other', name: '其他' }
];

const TRAVEL_SEASONS = [
  { key: 'all', name: '全季' },
  { key: 'spring', name: '春季' },
  { key: 'summer', name: '夏季' },
  { key: 'autumn', name: '秋季' },
  { key: 'winter', name: '冬季' }
];

const TRAVEL_DURATIONS = [
  { key: 'all', name: '不限' },
  { key: 'short', name: '1-2天' },
  { key: 'medium', name: '3-5天' },
  { key: 'long', name: '7天+' }
];

/**
 * 推断行旅地区
 */
function inferTravelRegion(item) {
  const text = (item.destName || '') + (item.region || '') + (item.essay || '');
  if (text.includes('杭州') || text.includes('苏州') || text.includes('上海') || text.includes('南京') || 
      text.includes('扬州') || text.includes('无锡') || text.includes('浙江') || text.includes('江苏')) {
    return 'east';
  }
  if (text.includes('广州') || text.includes('深圳') || text.includes('福建') || text.includes('厦门') || 
      text.includes('广西') || text.includes('海南') || text.includes('云南')) {
    return 'south';
  }
  if (text.includes('北京') || text.includes('天津') || text.includes('河北') || text.includes('山东') || 
      text.includes('山西') || text.includes('内蒙古')) {
    return 'north';
  }
  if (text.includes('四川') || text.includes('重庆') || text.includes('西藏') || text.includes('新疆') || 
      text.includes('甘肃') || text.includes('陕西') || text.includes('青海') || text.includes('宁夏')) {
    return 'west';
  }
  if (text.includes('湖北') || text.includes('湖南') || text.includes('河南') || text.includes('江西')) {
    return 'central';
  }
  if (text.includes('东北') || text.includes('辽宁') || text.includes('吉林') || text.includes('黑龙江')) {
    return 'northeast';
  }
  return 'other';
}

/**
 * 推断行旅适合季节
 */
function inferTravelSeason(item) {
  const text = (item.title || '') + (item.essay || '');
  if (text.includes('春')) return 'spring';
  if (text.includes('夏') || text.includes('避暑')) return 'summer';
  if (text.includes('秋') || text.includes('赏叶') || text.includes('金秋')) return 'autumn';
  if (text.includes('冬') || text.includes('雪') || text.includes('温泉')) return 'winter';
  return 'all';
}

/**
 * 推断行旅天数
 */
function inferTravelDuration(item) {
  const text = item.duration || '';
  const match = text.match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1], 10);
    if (days <= 2) return 'short';
    if (days <= 5) return 'medium';
    return 'long';
  }
  return 'medium';
}

module.exports = {
  // Film
  getFilmStatus,
  setFilmStatus,
  setFilmRating,
  getAllFilmStatus,
  enrichFilmList,
  // Incense
  addIncenseRecord,
  getIncenseHistory,
  getIncenseStats,
  // Wellness
  WELLNESS_CATEGORIES,
  WELLNESS_DIFFICULTY,
  WELLNESS_DURATION,
  WELLNESS_CAUTIONS,
  getWellnessCaution,
  inferWellnessCategory,
  inferWellnessDifficulty,
  inferWellnessDuration,
  enrichWellnessList,
  // Travel
  TRAVEL_REGIONS,
  TRAVEL_SEASONS,
  TRAVEL_DURATIONS,
  inferTravelRegion,
  inferTravelSeason,
  inferTravelDuration
};
