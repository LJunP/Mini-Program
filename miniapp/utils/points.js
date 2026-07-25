// utils/points.js
// 风雅积分与徽章体系（本地版，未来可迁移云端）
// 积分来源：每日签到、收藏内容、浏览内容、投稿分享

const STORAGE_KEY = 'user_points';
const BADGES_KEY = 'user_badges';
const POINTS_LOG_KEY = 'points_log';

// 徽章定义
const BADGE_DEFS = [
  { id: 'first_sign', name: '初入园林', desc: '完成首次签到', icon: '🌱', condition: { type: 'sign', value: 1 } },
  { id: 'sign_7', name: '七日雅集', desc: '连续签到7天', icon: '🌿', condition: { type: 'sign_streak', value: 7 } },
  { id: 'sign_30', name: '月度风雅', desc: '累计签到30天', icon: '🌳', condition: { type: 'sign_total', value: 30 } },
  { id: 'sign_100', name: '百日筑基', desc: '累计签到100天', icon: '🏯', condition: { type: 'sign_total', value: 100 } },
  { id: 'collect_10', name: '初识风雅', desc: '收藏10项内容', icon: '🔖', condition: { type: 'collect', value: 10 } },
  { id: 'collect_50', name: '雅趣藏家', desc: '收藏50项内容', icon: '📚', condition: { type: 'collect', value: 50 } },
  { id: 'browse_100', name: '博览群雅', desc: '浏览100项内容', icon: '👁', condition: { type: 'browse', value: 100 } },
  { id: 'ugc_first', name: '执笔风雅', desc: '完成首次投稿', icon: '✍️', condition: { type: 'ugc', value: 1 } },
  { id: 'ugc_10', name: '风雅笔记', desc: '投稿10篇内容', icon: '📝', condition: { type: 'ugc', value: 10 } },
  { id: 'tea_5', name: '品茶入门', desc: '品鉴5款茶', icon: '🍵', condition: { type: 'browse_domain', domain: 'tea', value: 5 } },
  { id: 'travel_5', name: '行万里路', desc: '阅读5篇行旅', icon: '🗺', condition: { type: 'browse_domain', domain: 'travel', value: 5 } },
  { id: 'music_5', name: '知音初识', desc: '聆听5首古曲', icon: '🎵', condition: { type: 'browse_domain', domain: 'music', value: 5 } },
  { id: 'incense_5', name: '香道初探', desc: '了解5种香料', icon: '🪔', condition: { type: 'browse_domain', domain: 'incense', value: 5 } },
  { id: 'film_5', name: '光影知心', desc: '观看5部影片', icon: '🎬', condition: { type: 'browse_domain', domain: 'film', value: 5 } },
  { id: 'wellness_5', name: '养生有道', desc: '阅读5篇养生', icon: '🌿', condition: { type: 'browse_domain', domain: 'wellness', value: 5 } }
];

// 积分等级定义
const LEVEL_DEFS = [
  { min: 0, name: '初入园林', color: '#8B8578' },
  { min: 50, name: '风雅新客', color: '#5B8C85' },
  { min: 150, name: '雅趣常客', color: '#4A6B7C' },
  { min: 300, name: '园林雅士', color: '#8B6F47' },
  { min: 600, name: '风雅大家', color: '#3B6D11' },
  { min: 1000, name: '妙不可言', color: '#A0522D' }
];

/**
 * 获取当前积分
 */
function getPoints() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || 0;
  } catch (e) {
    return 0;
  }
}

/**
 * 获取积分等级
 */
function getLevel() {
  const points = getPoints();
  let currentLevel = LEVEL_DEFS[0];
  let nextLevel = null;
  for (let i = 0; i < LEVEL_DEFS.length; i++) {
    if (points >= LEVEL_DEFS[i].min) {
      currentLevel = LEVEL_DEFS[i];
      nextLevel = LEVEL_DEFS[i + 1] || null;
    }
  }
  return {
    level: currentLevel,
    nextLevel: nextLevel,
    points,
    progress: nextLevel ? Math.min(100, Math.round((points - currentLevel.min) / (nextLevel.min - currentLevel.min) * 100)) : 100
  };
}

/**
 * 添加积分
 * @param {number} amount 积分数量
 * @param {string} reason 积分来源描述
 */
function addPoints(amount, reason) {
  const current = getPoints();
  const newPoints = current + amount;
  try {
    wx.setStorageSync(STORAGE_KEY, newPoints);
    // 记录日志
    const log = wx.getStorageSync(POINTS_LOG_KEY) || [];
    log.unshift({ points: amount, reason: reason || '', time: Date.now() });
    if (log.length > 50) log.length = 50;
    wx.setStorageSync(POINTS_LOG_KEY, log);
  } catch (e) {
    console.warn('[points] addPoints failed', e);
  }
  return newPoints;
}

/**
 * 签到加积分
 * @param {number} signDays 连续签到天数
 */
function onSignIn(signDays) {
  // 基础签到积分 + 连续签到加成
  const basePoints = 5;
  const streakBonus = Math.min(signDays * 2, 30); // 最多加30
  const total = basePoints + streakBonus;
  addPoints(total, `每日签到（连续${signDays}天）`);
  checkBadges({ sign_streak: signDays });
  return total;
}

/**
 * 收藏内容加积分
 */
function onCollect(collectionCount) {
  addPoints(2, '收藏风雅内容');
  checkBadges({ collect: collectionCount });
}

/**
 * 浏览内容加积分（防刷：同内容只加一次）
 */
function onBrowse(domain) {
  addPoints(1, '浏览风雅内容');
  // 检查领域相关徽章
  const browseHistory = wx.getStorageSync('browse_history') || [];
  const domainCount = browseHistory.filter(h => h.domain === domain).length;
  const totalCount = browseHistory.length;
  checkBadges({ 
    browse: totalCount,
    browse_domain: { domain, count: domainCount }
  });
}

/**
 * 投稿加积分
 */
function onUGC(ugcCount) {
  addPoints(10, '风雅投稿');
  checkBadges({ ugc: ugcCount });
}

/**
 * 检查并解锁徽章
 * @param {Object} stats 当前统计数据
 */
function checkBadges(stats) {
  const earnedBadges = getEarnedBadges();
  const newBadges = [];

  BADGE_DEFS.forEach(badge => {
    if (earnedBadges.indexOf(badge.id) >= 0) return;

    let unlocked = false;
    const cond = badge.condition;

    if (cond.type === 'sign' && stats.sign_streak !== undefined) {
      unlocked = stats.sign_streak >= cond.value;
    } else if (cond.type === 'sign_streak' && stats.sign_streak !== undefined) {
      unlocked = stats.sign_streak >= cond.value;
    } else if (cond.type === 'sign_total' && stats.sign_total !== undefined) {
      unlocked = stats.sign_total >= cond.value;
    } else if (cond.type === 'collect' && stats.collect !== undefined) {
      unlocked = stats.collect >= cond.value;
    } else if (cond.type === 'browse' && stats.browse !== undefined) {
      unlocked = stats.browse >= cond.value;
    } else if (cond.type === 'ugc' && stats.ugc !== undefined) {
      unlocked = stats.ugc >= cond.value;
    } else if (cond.type === 'browse_domain' && stats.browse_domain !== undefined) {
      unlocked = stats.browse_domain.domain === cond.domain && stats.browse_domain.count >= cond.value;
    }

    if (unlocked) {
      newBadges.push(badge);
      addPoints(20, `解锁徽章：${badge.name}`);
    }
  });

  if (newBadges.length > 0) {
    const allBadges = earnedBadges.concat(newBadges.map(b => b.id));
    try {
      wx.setStorageSync(BADGES_KEY, allBadges);
    } catch (e) {
      console.warn('[points] save badges failed', e);
    }
    // 显示解锁提示
    newBadges.forEach((badge, i) => {
      setTimeout(() => {
        wx.showToast({
          title: `${badge.icon} 解锁「${badge.name}」`,
          icon: 'none',
          duration: 2500
        });
      }, i * 3000);
    });
  }

  return newBadges;
}

/**
 * 获取已解锁的徽章ID列表
 */
function getEarnedBadges() {
  try {
    return wx.getStorageSync(BADGES_KEY) || [];
  } catch (e) {
    return [];
  }
}

/**
 * 获取所有徽章（含解锁状态）
 */
function getAllBadges() {
  const earned = getEarnedBadges();
  return BADGE_DEFS.map(b => ({
    ...b,
    earned: earned.indexOf(b.id) >= 0
  }));
}

/**
 * 获取已解锁徽章数量
 */
function getEarnedCount() {
  return getEarnedBadges().length;
}

/**
 * 综合检查所有徽章（登录时调用）
 */
function checkAllBadges() {
  const browseHistory = wx.getStorageSync('browse_history') || [];
  const browseCount = browseHistory.length;
  const ugc = require('./ugc.js');
  const ugcStats = ugc.getStats();

  // 统计各领域浏览数
  const domainCounts = {};
  ['tea', 'travel', 'wellness', 'incense', 'music', 'film'].forEach(d => {
    domainCounts[d] = browseHistory.filter(h => h.domain === d).length;
  });

  // 收藏数量（与 collection service 使用相同的 storage key）
  const collectionList = wx.getStorageSync('fengya_collections') || [];
  const collectCount = Array.isArray(collectionList) ? collectionList.length : 0;

  // 签到天数（本地签到记录存储在 daily_elegance_checkin）
  const signRecords = wx.getStorageSync('daily_elegance_checkin') || [];

  const stats = {
    sign_streak: 0, // 由 profile 页面传入
    sign_total: signRecords.length,
    collect: collectCount,
    browse: browseCount,
    ugc: ugcStats.total
  };

  // 检查各领域徽章
  Object.keys(domainCounts).forEach(domain => {
    checkBadges({ browse_domain: { domain, count: domainCounts[domain] } });
  });

  checkBadges(stats);
}

module.exports = {
  BADGE_DEFS,
  LEVEL_DEFS,
  getPoints,
  getLevel,
  addPoints,
  onSignIn,
  onCollect,
  onBrowse,
  onUGC,
  checkBadges,
  checkAllBadges,
  getEarnedBadges,
  getAllBadges,
  getEarnedCount
};
