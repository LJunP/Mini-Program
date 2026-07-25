// utils/daily-question.js
// 每日一题模块
// 基于日期确定性选题，支持查看记录和完成标记

const STORAGE_KEY = 'daily_question_viewed';

// 获取今日日期字符串
function getTodayStr() {
  const now = new Date();
  return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
}

// 基于日期生成确定性索引（MurmurHash3 散列，避免连续日期产生连续索引）
function getDailyIndex(total) {
  if (total <= 0) return 0;
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  // MurmurHash3 finalizer：异或+乘法散列，保证同一天结果一致但分布均匀
  let h = seed;
  h = (h ^ (h >>> 15)) * 0x85ebca6b;
  h = (h ^ (h >>> 13)) * 0xc2b2ae35;
  h = h ^ (h >>> 16);
  return (h >>> 0) % total;
}

// 获取每日一题
function getDailyQuestion() {
  const mock = require('./mock.js');
  const allQuestions = mock.loadInterviewQuestions();
  if (!allQuestions || allQuestions.length === 0) return null;

  const index = getDailyIndex(allQuestions.length);
  const question = allQuestions[index];

  // 获取进度信息
  const studyProgress = require('./study-progress.js');
  const progress = studyProgress.getRecord(question.id);

  // 检查是否已查看
  const viewed = getTodayViewed();

  return {
    ...question,
    progress,
    isViewed: viewed,
    dateStr: getTodayStr()
  };
}

// 获取明日题目预览
function getTomorrowQuestion() {
  const mock = require('./mock.js');
  const allQuestions = mock.loadInterviewQuestions();
  if (!allQuestions || allQuestions.length === 0) return null;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const seed = tomorrow.getFullYear() * 10000 + (tomorrow.getMonth() + 1) * 100 + tomorrow.getDate();
  // 使用与 getDailyIndex 相同的 MurmurHash3 散列
  let h = seed;
  h = (h ^ (h >>> 15)) * 0x85ebca6b;
  h = (h ^ (h >>> 13)) * 0xc2b2ae35;
  h = h ^ (h >>> 16);
  const index = (h >>> 0) % allQuestions.length;

  return allQuestions[index];
}

// 检查今日是否已查看
function getTodayViewed() {
  const viewed = wx.getStorageSync(STORAGE_KEY) || {};
  return viewed[getTodayStr()] === true;
}

// 标记今日已查看
function markViewed() {
  const viewed = wx.getStorageSync(STORAGE_KEY) || {};
  viewed[getTodayStr()] = true;
  wx.setStorageSync(STORAGE_KEY, viewed);
}

// 获取连续查看天数
function getStreak() {
  const viewed = wx.getStorageSync(STORAGE_KEY) || {};
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    if (viewed[dateStr]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// 获取查看统计
function getStats() {
  const viewed = wx.getStorageSync(STORAGE_KEY) || {};
  const totalViewed = Object.keys(viewed).length;
  return {
    totalViewed,
    streak: getStreak(),
    todayViewed: getTodayViewed()
  };
}

module.exports = {
  getDailyQuestion,
  getTomorrowQuestion,
  getTodayViewed,
  markViewed,
  getStreak,
  getStats,
  getTodayStr
};
