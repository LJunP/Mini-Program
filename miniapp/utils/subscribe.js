// utils/subscribe.js — 微信订阅消息封装
// 在用户获得价值时请求授权，转化率最高
const config = require('./subscribe-config.js');
const tracker = require('./tracker.js');

/**
 * 请求订阅消息授权
 * @param {Array} tmplIds - 模板消息 ID 列表
 * @param {string} scene - 场景名称，用于埋点
 * @returns {Promise<Object>} - { accepted: [], result: {} }
 */
function requestSubscribe(tmplIds, scene = '') {
  return new Promise((resolve) => {
    if (!tmplIds || tmplIds.length === 0) {
      resolve({ accepted: [], result: {} });
      return;
    }

    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      success: (res) => {
        const accepted = tmplIds.filter((id) => res[id] === 'accept');
        const rejected = tmplIds.filter((id) => res[id] === 'reject');
        
        // 记录订阅行为
        tracker.track('subscribe_request', {
          event_params: {
            scene,
            accepted_count: accepted.length,
            rejected_count: rejected.length,
            total_count: tmplIds.length
          }
        });
        
        resolve({ accepted, rejected, result: res });
      },
      fail: (err) => {
        console.warn('[subscribe] request failed:', err);
        
        // 记录订阅失败
        tracker.track('subscribe_request_failed', {
          event_params: {
            scene,
            error: err.errMsg || 'unknown'
          }
        });
        
        resolve({ accepted: [], rejected: tmplIds, result: {} });
      }
    });
  });
}

/**
 * 根据场景请求订阅
 * @param {string} scene - 场景名称
 * @returns {Promise<Object>} - { accepted: [], rejected: [], result: {} }
 */
function subscribeByScene(scene) {
  const templateIds = config.getTemplateIds(scene);
  if (templateIds.length === 0) {
    return Promise.resolve({ accepted: [], rejected: [], result: {} });
  }
  
  return requestSubscribe(templateIds, scene).then(({ accepted, rejected, result }) => {
    // 保存订阅状态
    accepted.forEach(templateId => {
      const templateKey = findTemplateKeyById(templateId);
      if (templateKey) {
        const storageKey = config.getSubscribeStorageKey(templateKey);
        wx.setStorageSync(storageKey, true);
      }
    });
    
    return { accepted, rejected, result };
  });
}

/**
 * 根据模板 ID 查找模板键名
 * @param {string} templateId - 模板 ID
 * @returns {string|null} - 模板键名
 */
function findTemplateKeyById(templateId) {
  for (const [key, template] of Object.entries(config.SUBSCRIBE_TEMPLATES)) {
    if (template.id === templateId) {
      return key;
    }
  }
  return null;
}

/**
 * 点评成功后请求订阅
 * 转化时机：用户刚完成有价值的操作（点评），心情好，更容易接受订阅
 */
function subscribeAfterReview() {
  return subscribeByScene('review').then(({ accepted }) => {
    if (accepted.length > 0) {
      wx.showToast({
        title: '已开启每日推荐',
        icon: 'success',
        duration: 1500
      });
    }
    return { accepted };
  });
}

/**
 * 签到成功后请求订阅
 * 转化时机：用户刚完成签到，形成习惯，更容易接受提醒
 */
function subscribeAfterSign() {
  return subscribeByScene('sign').then(({ accepted }) => {
    if (accepted.length > 0) {
      wx.showToast({
        title: '已开启签到提醒',
        icon: 'success',
        duration: 1500
      });
    }
    return { accepted };
  });
}

/**
 * 收藏成功后请求订阅
 * 转化时机：用户刚收藏内容，对内容感兴趣，更容易接受更新提醒
 */
function subscribeAfterCollect() {
  return subscribeByScene('collect').then(({ accepted }) => {
    if (accepted.length > 0) {
      wx.showToast({
        title: '已开启内容更新提醒',
        icon: 'success',
        duration: 1500
      });
    }
    return { accepted };
  });
}

/**
 * 首次访问时请求订阅
 * 转化时机：用户首次进入小程序，引导开启消息通知
 */
function subscribeOnFirstVisit() {
  // 检查是否已经请求过
  const hasRequested = wx.getStorageSync('subscribe_first_visit_requested');
  if (hasRequested) {
    return Promise.resolve({ accepted: [], result: {} });
  }
  
  return subscribeByScene('first_visit').then(({ accepted }) => {
    wx.setStorageSync('subscribe_first_visit_requested', true);
    return { accepted };
  });
}

/**
 * 检查是否已订阅某类消息
 * @param {string} templateKey - 模板键名
 * @returns {boolean}
 */
function isSubscribed(templateKey) {
  const storageKey = config.getSubscribeStorageKey(templateKey);
  return !!wx.getStorageSync(storageKey);
}

/**
 * 获取所有订阅状态
 * @returns {Object} - 订阅状态对象
 */
function getSubscribeStatus() {
  const status = {};
  const enabledTemplates = config.getEnabledTemplates();
  
  enabledTemplates.forEach(template => {
    status[template.key] = isSubscribed(template.key);
  });
  
  return status;
}

/**
 * 设置订阅状态
 * @param {string} templateKey - 模板键名
 * @param {boolean} subscribed - 是否订阅
 */
function setSubscribeStatus(templateKey, subscribed) {
  const storageKey = config.getSubscribeStorageKey(templateKey);
  wx.setStorageSync(storageKey, subscribed);
}

/**
 * 打开订阅管理页面
 * 引导用户到微信设置页面管理订阅消息
 */
function openSubscribeSetting() {
  wx.openSetting({
    success: (res) => {
      if (res.authSetting['scope.subscribeMessage']) {
        // 用户开启了订阅消息权限
        tracker.track('subscribe_setting_opened', {
          event_params: { granted: true }
        });
      }
    },
    fail: (err) => {
      console.warn('[subscribe] openSetting failed:', err);
    }
  });
}

/**
 * 显示订阅管理弹窗
 * @param {Object} options - 配置项
 */
function showSubscribeManage(options = {}) {
  const {
    title = '消息订阅管理',
    content = '您可以在这里管理消息订阅设置',
    showCancel = true,
    cancelText = '取消',
    confirmText = '去设置'
  } = options;
  
  wx.showModal({
    title,
    content,
    showCancel,
    cancelText,
    confirmText,
    success: (res) => {
      if (res.confirm) {
        openSubscribeSetting();
      }
    }
  });
}

/**
 * 检查订阅权限
 * @returns {Promise<boolean>} - 是否有订阅权限
 */
function checkSubscribePermission() {
  return new Promise((resolve) => {
    wx.getSetting({
      success: (res) => {
        const hasPermission = res.authSetting['scope.subscribeMessage'] !== false;
        resolve(hasPermission);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

module.exports = {
  // 核心方法
  requestSubscribe,
  subscribeByScene,
  
  // 场景订阅方法
  subscribeAfterReview,
  subscribeAfterSign,
  subscribeAfterCollect,
  subscribeOnFirstVisit,
  
  // 状态管理
  isSubscribed,
  getSubscribeStatus,
  setSubscribeStatus,
  
  // 权限管理
  checkSubscribePermission,
  openSubscribeSetting,
  showSubscribeManage
};