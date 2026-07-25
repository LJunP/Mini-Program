// store/index.js — 全局状态管理（轻量实现，不依赖 mobx）
// 维护：userInfo、collections（数量）、preferences（风雅偏好）
// 通过 subscribe/notify 模式通知页面更新。

const collection = require('../services/collection.js');
const user = require('../services/user.js');

const STORAGE_KEYS = {
  appMode: 'app_mode'
};

const APP_MODES = {
  leisure: 'leisure',
  study: 'study',
  tools: 'tools'
};

function getStoredMode() {
  try {
    const mode = wx.getStorageSync(STORAGE_KEYS.appMode);
    if (mode === APP_MODES.study) return APP_MODES.study;
    if (mode === APP_MODES.tools) return APP_MODES.tools;
    return APP_MODES.leisure;
  } catch (e) {
    console.warn('[store] get app mode failed', e);
    return APP_MODES.leisure;
  }
}

function persistMode(mode) {
  try {
    wx.setStorageSync(STORAGE_KEYS.appMode, mode);
  } catch (e) {
    console.warn('[store] persist app mode failed', e);
  }
}

const state = {
  appMode: getStoredMode(),
  isLoggedIn: false,
  userInfo: null,
  collectionCount: 0,
  // 六维风雅偏好（0-100）
  domainAffinity: {
    tea: 0,
    travel: 0,
    wellness: 0,
    incense: 0,
    music: 0,
    film: 0
  },
  // 风雅人格
  persona: '未解锁',
  personaDesc: '登录后解锁风雅人格画像',
  // 风雅足迹
  footprint: {
    teasTasted: 0,
    placesVisited: 0,
    filmsWatched: 0,
    habitsKept: 0,
    musicListened: 0,
    incenseBurned: 0
  },
  // 签到积分
  points: 0
};

const listeners = [];

function getState() {
  return state;
}

function setState(patch) {
  Object.assign(state, patch);
  if (patch.appMode) {
    persistMode(patch.appMode);
  }
  notify();
}

function setAppMode(mode) {
  let nextMode = APP_MODES.leisure;
  if (mode === APP_MODES.study) nextMode = APP_MODES.study;
  else if (mode === APP_MODES.tools) nextMode = APP_MODES.tools;
  if (state.appMode === nextMode) return;
  state.appMode = nextMode;
  persistMode(nextMode);
  notify();
}

function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notify() {
  listeners.forEach(fn => {
    try { fn(state); } catch (e) { console.warn('[store] listener error', e); }
  });
}

/**
 * 刷新收藏数量
 */
function refreshCollectionCount() {
  if (!state.isLoggedIn) {
    state.collectionCount = 0;
    notify();
    return Promise.resolve(0);
  }
  return collection.getCount().then(count => {
    state.collectionCount = count;
    notify();
    return count;
  }).catch(() => {
    state.collectionCount = 0;
    notify();
    return 0;
  });
}

/**
 * 加载用户数据（偏好、人格、足迹、积分）
 * 抽取自 init() 和 login() 的公共逻辑
 */
function _refreshUserData() {
  // 从用户服务中加载用户信息
  const userInfo = user.getUserInfo();
  state.userInfo = {
    nickname: userInfo.nickname || '微信用户',
    avatar_url: userInfo.avatarUrl || '',
    bio: userInfo.bio || '',
    gender: userInfo.gender || 0,
    birthday: userInfo.birthday || '',
    tags: userInfo.tags || []
  };
  
  // 从偏好服务中加载偏好值
  const preferencesService = require('../services/preferences.js');
  const preferenceValues = preferencesService.getPreferenceValues();
  
  state.domainAffinity = {
    tea: preferenceValues.tea || 85,
    travel: preferenceValues.travel || 70,
    wellness: preferenceValues.wellness || 55,
    incense: preferenceValues.incense || 30,
    music: preferenceValues.music || 25,
    film: preferenceValues.film || 20
  };
  
  // 使用 persona.js 计算真实偏好
  const persona = require('../utils/persona.js');
  const personaResult = persona.calculatePersona();
  state.persona = personaResult.persona.name;
  state.personaDesc = personaResult.persona.desc;
  
  // 统计足迹
  const browseHistory = wx.getStorageSync('browse_history') || [];
  const points = wx.getStorageSync('user_points') || 0;
  state.footprint = {
    teasTasted: browseHistory.filter(h => h.domain === 'tea').length,
    placesVisited: browseHistory.filter(h => h.domain === 'travel').length,
    filmsWatched: browseHistory.filter(h => h.domain === 'film').length,
    habitsKept: browseHistory.filter(h => h.domain === 'wellness').length,
    musicListened: browseHistory.filter(h => h.domain === 'music').length,
    incenseBurned: browseHistory.filter(h => h.domain === 'incense').length
  };
  state.points = points;
  
  refreshCollectionCount();
}

/**
 * 重置用户数据（退出登录时调用）
 */
function _resetUserData() {
  state.userInfo = null;
  state.collectionCount = 0;
  state.domainAffinity = {
    tea: 0,
    travel: 0,
    wellness: 0,
    incense: 0,
    music: 0,
    film: 0
  };
  state.persona = '未解锁';
  state.personaDesc = '登录后解锁风雅人格画像';
  state.footprint = {
    teasTasted: 0,
    placesVisited: 0,
    filmsWatched: 0,
    habitsKept: 0,
    musicListened: 0,
    incenseBurned: 0
  };
  state.points = 0;
}

/**
 * 初始化（用户登录后调用）
 */
function init() {
  state.appMode = getStoredMode();
  
  // 动态引入 auth 避免循环依赖
  const auth = require('../utils/auth.js');
  const isLoggedIn = auth.isLoggedIn();
  state.isLoggedIn = isLoggedIn;
  
  if (state.isLoggedIn) {
    _refreshUserData();
  } else {
    _resetUserData();
  }
  notify();
}

/**
 * 退出登录更新状态
 */
function logout() {
  state.isLoggedIn = false;
  _resetUserData();
  notify();
}

/**
 * 登录成功更新状态
 */
function login(userInfo) {
  state.isLoggedIn = true;
  state.userInfo = {
    nickname: userInfo.nickname || '微信用户',
    avatar_url: userInfo.avatarUrl || '',
    bio: userInfo.bio || '',
    gender: userInfo.gender || 0,
    birthday: userInfo.birthday || '',
    tags: userInfo.tags || []
  };
  _refreshUserData();
  notify();
}

module.exports = {
  APP_MODES,
  getState,
  setState,
  setAppMode,
  subscribe,
  init,
  refreshCollectionCount,
  login,
  logout
};
