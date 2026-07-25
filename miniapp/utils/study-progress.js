// utils/study-progress.js
// 学习进度 + SM-2 间隔重复算法
// 参考 SuperMemo-2 算法简化版，根据答题反馈动态调整复习间隔
// 改造：本地优先写入，已登录时异步同步到云端

const STORAGE_KEY = 'study_progress';
const STORAGE_WRONG_KEY = 'study_wrong_book'; // 错题本独立存储
const CLOUD_SYNC_FLAG = 'study_progress_cloud_synced'; // 云同步标记

// ========== 登录状态 & 云函数调用 ==========

function _isLoggedIn() {
  try {
    const store = require('../store/index.js')
    const state = store.getState()
    if (state && typeof state.isLoggedIn !== 'undefined') {
      return state.isLoggedIn
    }
    const auth = require('../utils/auth.js')
    return auth.isLoggedIn()
  } catch (e) {
    return false
  }
}

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'studyProgress',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

// 异步同步单条记录到云端（fire and forget）
function _syncItemToCloud(itemId, record) {
  if (!_isLoggedIn()) return
  _callCloud({
    action: 'updateItem',
    item_id: itemId,
    record
  }).catch(() => {})
}

// 异步同步错题本到云端（fire and forget）
function _syncWrongBookToCloud() {
  if (!_isLoggedIn()) return
  _callCloud({
    action: 'syncWrongBook',
    wrong_book: readWrongBook()
  }).catch(() => {})
}

// SM-2 算法参数
const MIN_EASE = 1.3;        // 最低 Ease Factor
const INITIAL_EASE = 2.5;     // 初始 Ease Factor
const MIN_INTERVAL = 1;      // 最小间隔（天）
const MAX_INTERVAL = 180;    // 最大间隔（天）—— 约6个月

// 状态元信息（用于 UI 显示和初始间隔）
const STATUS_META = {
  new:      { label: '未开始', nextReviewGap: 0 },
  learning: { label: '学习中', nextReviewGap: 1 * 24 * 60 * 60 * 1000 },     // 1天
  mastered: { label: '已掌握', nextReviewGap: 7 * 24 * 60 * 60 * 1000 },    // 7天
  weak:     { label: '薄弱点', nextReviewGap: 1 * 24 * 60 * 60 * 1000 }      // 1天
};

function now() {
  return Date.now();
}

function readMap() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || {};
  } catch (e) {
    console.warn('[study-progress] read failed', e);
    return {};
  }
}

function writeMap(map) {
  try {
    wx.setStorageSync(STORAGE_KEY, map);
  } catch (e) {
    console.warn('[study-progress] write failed', e);
  }
}

function readWrongBook() {
  try {
    return wx.getStorageSync(STORAGE_WRONG_KEY) || [];
  } catch (e) {
    return [];
  }
}

function writeWrongBook(ids) {
  try {
    wx.setStorageSync(STORAGE_WRONG_KEY, ids);
  } catch (e) {
    console.warn('[study-progress] write wrong book failed', e);
  }
}

function createRecord(itemId, patch) {
  const timestamp = now();
  const status = patch.status || 'new';
  const meta = STATUS_META[status] || STATUS_META.new;
  return Object.assign({
    itemId,
    status,
    reviewCount: 0,
    wrongCount: 0,
    lastReviewedAt: 0,
    nextReviewAt: meta.nextReviewGap ? timestamp + meta.nextReviewGap : 0,
    // SM-2 算法字段
    easeFactor: INITIAL_EASE,
    intervalDays: 0,
    note: '',
    createdAt: timestamp,
    updatedAt: timestamp
  }, patch);
}

function getRecord(itemId) {
  const map = readMap();
  return map[itemId] || createRecord(itemId, { status: 'new' });
}

/**
 * SM-2 算法核心：根据答题质量计算下一个复习间隔
 * quality: 0-5
 *   0-2: 答错（重置间隔为1天）
 *   3: 勉强通过（缩短间隔）
 *   4: 通过（保持间隔）
 *   5: 轻松通过（加长间隔）
 */
function calcSM2(record, quality) {
  let ease = record.easeFactor || INITIAL_EASE;
  let interval = record.intervalDays || 0;
  let status = record.status || 'learning';

  // 更新 Ease Factor
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < MIN_EASE) ease = MIN_EASE;

  // 计算下一个间隔
  if (quality < 3) {
    // 答错：重置间隔为1天
    interval = MIN_INTERVAL;
    status = 'weak';
  } else {
    // 答对：递增间隔
    if (interval === 0) {
      interval = 1;
    } else if (interval === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * ease);
    }
    // 限制最大间隔
    if (interval > MAX_INTERVAL) interval = MAX_INTERVAL;
    
    // 连续答对3次以上标记为已掌握
    if (interval >= 7) {
      status = 'mastered';
    } else {
      status = 'learning';
    }
  }

  const nextReviewGap = interval * 24 * 60 * 60 * 1000;
  return {
    easeFactor: ease,
    intervalDays: interval,
    status,
    nextReviewGap
  };
}

function saveRecord(itemId, patch) {
  const map = readMap();
  const current = map[itemId] || createRecord(itemId, { status: 'new' });
  const timestamp = now();
  const nextStatus = patch.status || current.status;
  const meta = STATUS_META[nextStatus] || STATUS_META.new;
  const nextRecord = Object.assign({}, current, patch, {
    itemId,
    status: nextStatus,
    updatedAt: timestamp
  });

  if (patch.status) {
    nextRecord.lastReviewedAt = timestamp;
    nextRecord.reviewCount = (current.reviewCount || 0) + 1;
    
    if (patch.status === 'mastered') {
      // 标记为已掌握：设置较长间隔
      const sm2 = calcSM2(current, 5);
      nextRecord.easeFactor = sm2.easeFactor;
      nextRecord.intervalDays = Math.max(sm2.intervalDays, 7);
      nextRecord.nextReviewAt = timestamp + nextRecord.intervalDays * 24 * 60 * 60 * 1000;
    } else if (patch.status === 'learning') {
      // 标记为学习中：中等间隔
      const sm2 = calcSM2(current, 3);
      nextRecord.easeFactor = sm2.easeFactor;
      nextRecord.intervalDays = sm2.intervalDays;
      nextRecord.nextReviewAt = timestamp + sm2.nextReviewGap;
    } else if (patch.status === 'weak') {
      // 标记为薄弱：重置间隔为1天
      const sm2 = calcSM2(current, 1);
      nextRecord.easeFactor = sm2.easeFactor;
      nextRecord.intervalDays = MIN_INTERVAL;
      nextRecord.nextReviewAt = timestamp + 24 * 60 * 60 * 1000;
    } else {
      nextRecord.nextReviewAt = meta.nextReviewGap ? timestamp + meta.nextReviewGap : 0;
    }
  }

  map[itemId] = nextRecord;
  writeMap(map);

  // 异步同步到云端
  _syncItemToCloud(itemId, nextRecord);

  return nextRecord;
}

function setStatus(itemId, status) {
  return saveRecord(itemId, { status });
}

function markWrong(itemId) {
  const current = getRecord(itemId);
  const record = saveRecord(itemId, {
    status: 'weak',
    wrongCount: (current.wrongCount || 0) + 1
  });
  
  // 加入错题本
  const wrongIds = readWrongBook();
  if (wrongIds.indexOf(itemId) === -1) {
    wrongIds.push(itemId);
    writeWrongBook(wrongIds);
    _syncWrongBookToCloud();
  }
  
  return record;
}

/**
 * 记录答题质量（用于 SM-2 算法）
 * quality: 0-5
 */
function recordReview(itemId, quality) {
  const current = getRecord(itemId);
  const sm2 = calcSM2(current, quality);
  const record = saveRecord(itemId, {
    status: sm2.status
  });
  
  // 用 SM-2 计算结果覆盖
  const map = readMap();
  map[itemId].easeFactor = sm2.easeFactor;
  map[itemId].intervalDays = sm2.intervalDays;
  map[itemId].nextReviewAt = now() + sm2.nextReviewGap;
  map[itemId].lastReviewedAt = now();
  map[itemId].reviewCount = (current.reviewCount || 0) + 1;
  writeMap(map);
  
  // 异步同步到云端
  _syncItemToCloud(itemId, map[itemId]);
  
  // 如果答错，加入错题本
  if (quality < 3) {
    const wrongIds = readWrongBook();
    if (wrongIds.indexOf(itemId) === -1) {
      wrongIds.push(itemId);
      writeWrongBook(wrongIds);
      _syncWrongBookToCloud();
    }
  }
  
  return map[itemId];
}

function getStats(totalCount) {
  const map = readMap();
  const records = Object.keys(map).map(key => map[key]);
  const masteredCount = records.filter(r => r.status === 'mastered').length;
  const weakCount = records.filter(r => r.status === 'weak').length;
  const learningCount = records.filter(r => r.status === 'learning').length;
  const reviewCount = records.filter(r => r.nextReviewAt && r.nextReviewAt <= now()).length;
  const wrongBookCount = readWrongBook().length;
  
  return {
    pendingCount: Math.max(0, totalCount - masteredCount),
    masteredCount,
    weakCount,
    learningCount,
    reviewCount,
    wrongBookCount
  };
}

function getDueIds() {
  const map = readMap();
  return Object.keys(map).filter(key => {
    const record = map[key];
    return record.nextReviewAt && record.nextReviewAt <= now();
  });
}

// 获取错题本中所有题目ID
function getWrongIds() {
  return readWrongBook();
}

// 从错题本中移除（当题目被标记为已掌握时）
function removeFromWrongBook(itemId) {
  const wrongIds = readWrongBook();
  const idx = wrongIds.indexOf(itemId);
  if (idx >= 0) {
    wrongIds.splice(idx, 1);
    writeWrongBook(wrongIds);
    _syncWrongBookToCloud();
  }
}

// 获取错题本统计
function getWrongStats() {
  const wrongIds = readWrongBook();
  const map = readMap();
  let stillWeak = 0;
  let mastered = 0;
  let totalWrongCount = 0;
  
  wrongIds.forEach(id => {
    const record = map[id];
    if (!record) return;
    if (record.status === 'mastered') {
      mastered++;
    } else {
      stillWeak++;
    }
    totalWrongCount += (record.wrongCount || 0);
  });
  
  return {
    total: wrongIds.length,
    stillWeak,
    mastered,
    totalWrongCount
  };
}

// ========== 云端同步 API ==========

/**
 * 从云端拉取学习进度，合并到本地（登录后调用）
 * 合并策略：云端记录与本地记录取较新的一方
 */
function syncFromCloud() {
  if (!_isLoggedIn()) return Promise.resolve({ synced: false })

  return _callCloud({ action: 'get' }).then(res => {
    if (res.code !== 0 || !res.has_data) {
      return { synced: false, reason: 'no_cloud_data' }
    }

    const cloudProgress = res.progress || {}
    const cloudWrongBook = res.wrong_book || []
    const localMap = readMap()
    const localWrongBook = readWrongBook()

    // 合并进度：取 updatedAt 较新的记录
    let mergedCount = 0
    Object.keys(cloudProgress).forEach(itemId => {
      const cloudRecord = cloudProgress[itemId]
      const localRecord = localMap[itemId]

      if (!localRecord) {
        // 本地没有，直接用云端
        localMap[itemId] = cloudRecord
        mergedCount++
      } else {
        // 两端都有，取较新的
        const cloudUpdated = cloudRecord.updatedAt || 0
        const localUpdated = localRecord.updatedAt || 0
        if (cloudUpdated > localUpdated) {
          localMap[itemId] = cloudRecord
          mergedCount++
        }
      }
    })
    writeMap(localMap)

    // 合并错题本：取并集
    const wrongSet = new Set([...localWrongBook, ...cloudWrongBook])
    writeWrongBook(Array.from(wrongSet))

    // 标记已同步
    try { wx.setStorageSync(CLOUD_SYNC_FLAG, true) } catch (e) {}

    return { synced: true, mergedCount, wrongBookCount: wrongSet.size }
  }).catch(err => {
    console.warn('[study-progress] syncFromCloud failed:', err)
    return { synced: false, error: err }
  })
}

/**
 * 将本地全部进度推送到云端（全量覆盖）
 */
function syncToCloud() {
  if (!_isLoggedIn()) return Promise.resolve({ synced: false })

  return _callCloud({
    action: 'sync',
    progress: readMap(),
    wrongBook: readWrongBook()
  }).then(res => {
    if (res.code === 0) {
      try { wx.setStorageSync(CLOUD_SYNC_FLAG, true) } catch (e) {}
    }
    return { synced: res.code === 0, updated_at: res.updated_at }
  }).catch(err => {
    console.warn('[study-progress] syncToCloud failed:', err)
    return { synced: false, error: err }
  })
}

module.exports = {
  STATUS_META,
  readMap,
  getRecord,
  saveRecord,
  setStatus,
  markWrong,
  recordReview,
  getStats,
  getDueIds,
  getWrongIds,
  removeFromWrongBook,
  getWrongStats,
  calcSM2,
  syncFromCloud,
  syncToCloud
};
