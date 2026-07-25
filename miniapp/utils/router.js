// utils/router.js — 路由封装（带登录拦截 + 跨板块跳转埋点）
const auth = require('./auth.js');
const tracker = require('./tracker.js');

/**
 * 跳转到指定页面（封装 navigateTo）
 * @param {string} url 页面路径，如 /subpackages/detail/tea-detail/tea-detail
 * @param {Object} params query 参数
 * @param {Object} options { needAuth, trackerMeta }
 */
function navigate(url, params = {}, options = {}) {
  const { needAuth = false, trackerMeta = null } = options;

  if (needAuth && !auth.isLoggedIn()) {
    return auth.silentLogin()
      .then(() => _doNavigate(url, params, trackerMeta))
      .catch(() => {
        wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' });
      });
  }
  return _doNavigate(url, params, trackerMeta);
}

function _doNavigate(url, params, trackerMeta) {
  const queryStr = Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  const fullUrl = queryStr ? `${url}?${queryStr}` : url;

  // 跨板块跳转埋点
  if (trackerMeta && trackerMeta.from_domain && trackerMeta.to_domain) {
    tracker.track('cross_domain_jump', {
      event_params: {
        from_domain: trackerMeta.from_domain,
        from_ref_id: trackerMeta.from_ref_id,
        to_domain: trackerMeta.to_domain,
        to_ref_id: trackerMeta.to_ref_id
      }
    });
  }

  return new Promise((resolve, reject) => {
    wx.navigateTo({
      url: fullUrl,
      success: resolve,
      fail: (err) => {
        console.warn('[router] navigateTo failed', err);
        // 如果是 tab 页或路径层数超限，自动切 switchTab / redirectTo
        if (err.errMsg && err.errMsg.indexOf('tabbar') > -1) {
          wx.switchTab({ url, success: resolve, fail: reject });
        } else {
          wx.redirectTo({ url: fullUrl, success: resolve, fail: reject });
        }
      }
    });
  });
}

function redirect(url, params = {}) {
  const queryStr = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  wx.redirectTo({ url: queryStr ? `${url}?${queryStr}` : url });
}

function switchTab(url) {
  wx.switchTab({ url });
}

function navigateBack(delta = 1) {
  wx.navigateBack({ delta });
}

/**
 * 通用：跳转茶品详情
 */
function goTeaDetail(teaId, fromDomain, fromRefId) {
  return navigate('/subpackages/detail/tea-detail/tea-detail', { id: teaId }, {
    trackerMeta: fromDomain ? {
      from_domain: fromDomain,
      from_ref_id: fromRefId,
      to_domain: 'tea',
      to_ref_id: teaId
    } : null
  });
}

/**
 * 通用：跳转行旅详情
 */
function goTravelDetail(travelId, fromDomain, fromRefId) {
  return navigate('/subpackages/detail/travel-detail/travel-detail', { id: travelId }, {
    trackerMeta: fromDomain ? {
      from_domain: fromDomain,
      from_ref_id: fromRefId,
      to_domain: 'travel',
      to_ref_id: travelId
    } : null
  });
}

/**
 * 通用：跳转内容详情（养生、香道、音乐、电影等内容）
 */
function goContentDetail(contentId, domain, fromDomain, fromRefId) {
  domain = domain || 'wellness';
  return navigate('/subpackages/detail/content-detail/content-detail', { id: contentId, domain: domain }, {
    trackerMeta: fromDomain ? {
      from_domain: fromDomain,
      from_ref_id: fromRefId,
      to_domain: domain,
      to_ref_id: contentId
    } : null
  });
}

/**
 * 通用：跳转茶品对比页
 */
function goCompare(teaIdA, teaIdB) {
  return navigate('/subpackages/detail/compare/compare', { a: teaIdA, b: teaIdB });
}

module.exports = {
  navigate,
  redirect,
  switchTab,
  navigateBack,
  goTeaDetail,
  goTravelDetail,
  goContentDetail,
  goCompare
};
