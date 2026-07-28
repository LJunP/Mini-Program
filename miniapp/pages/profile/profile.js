// pages/profile/profile.js
// 个人中心：用户信息 + 风雅偏好 + 足迹 + 菜单 + 每日签到 + 订阅管理
const store = require('../../store/index.js');
const mock = require('../../utils/mock.js');
const persona = require('../../utils/persona.js');
const subscribe = require('../../utils/subscribe.js');
const subscribeConfig = require('../../utils/subscribe-config.js');
const tracker = require('../../utils/tracker.js');
const pointsUtil = require('../../utils/points.js');
const accountScope = require('../../utils/account-scope.js');

const DOMAIN_COLORS = {
  incense: '#8B6F47',
  music: '#4A6B7C',
  tea: '#3B6D11',
  film: '#2C2C2A',
  wellness: '#A0522D',
  travel: '#5B8C85'
};

Page({
  data: {
    isLoggedIn: false,
    user: { nickname: '微信用户', bio: '点击登录解锁更多体验' },
    persona: '未解锁',
    personaDesc: '登录后解锁风雅人格画像',
    affinityList: [],
    footprint: { teasTasted: 0, placesVisited: 0, filmsWatched: 0, habitsKept: 0 },
    studyStats: { pendingCount: 0, learningCount: 0, masteredCount: 0, weakCount: 0, reviewCount: 0 },
    collectionCount: 0,
    // 签到相关
    signedToday: false,
    signSubmitting: false,
    signDays: 0,
    signDates: [],
    // 最近浏览
    recentBrowse: [],
    // 订阅相关
    subscribeStatus: {
      DAILY_RECOMMEND: false,
      SIGN_REMIND: false,
      CONTENT_UPDATE: false,
      ACTIVITY_REMIND: false
    },
    subscribeEnabledCount: 0,
    // UGC 投稿数量
    ugcCount: 0,
    // 积分与徽章
    points: 0,
    levelInfo: null,
    earnedBadgeCount: 0,
    totalBadgeCount: 0,
    recentBadges: []
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/profile/profile' });
    // 初始化 store
    store.init();
    this._renderStore();

    // 批量更新签到、浏览、订阅数据（合并为一次 setData）
    this._loadSignData();
    const recentBrowse = this._computeRecentBrowse();
    const subscribeData = this._computeSubscribeStatus();
    const studyStats = mock.getStudyStats();
    const ugc = require('../../utils/ugc.js');
    const ugcCount = ugc.getStats().total;
    this.setData({
      recentBrowse,
      studyStats,
      ugcCount,
      ...subscribeData
    });

    // 订阅 store 变化
    this._unsub = store.subscribe((newState) => {
      this._renderStore();
      // 检测登录状态从 false → true 的变化，登录成功后立即加载签到数据
      if (!this._wasLoggedIn && newState.isLoggedIn) {
        this._loadSignDataWithState(true);
      }
      this._wasLoggedIn = newState.isLoggedIn;
    });
  },

  onShow() {
    // 重新初始化 store，确保登录状态正确
    store.init();

    // 先渲染 store 状态到页面
    this._renderStore();

    // 直接从 store 读取登录状态（避免 this.data 时序问题）
    const currentIsLoggedIn = store.getState().isLoggedIn;
    this._wasLoggedIn = currentIsLoggedIn;

    // 刷新收藏数量
    store.refreshCollectionCount();

    // 已登录时加载签到数据；未登录时由 store.subscribe 在登录成功后自动加载
    this._loadSignDataWithState(currentIsLoggedIn);
    const recentBrowse = this._computeRecentBrowse();
    const subscribeData = this._computeSubscribeStatus();
    const studyStats = mock.getStudyStats();
    const ugc = require('../../utils/ugc.js');
    const ugcCount = ugc.getStats().total;
    this.setData({
      recentBrowse,
      studyStats,
      ugcCount,
      ...subscribeData
    });
  },

  // 根据传入的登录状态加载签到数据
  _loadSignDataWithState(isLoggedIn) {
    if (!isLoggedIn) {
      // 未登录时不重置签到数据（避免覆盖已签到状态），仅跳过云端查询
      return;
    }
    const accountContext = accountScope.getActiveUserId();
    if (!accountContext) return;
    return wx.cloud.callFunction({
      name: 'sign',
      data: { action: 'getRecords' }
    }).then(res => {
      if (accountScope.getActiveUserId() !== accountContext) return;
      const result = res.result || {};
      if (result.code === 0) {
        const signDates = this._buildSignDates(result.records || []);
        this.setData({
          signedToday: result.signedToday,
          signDays: result.signDays || 0,
          signDates
        });
      }
    }).catch(err => {
      if (accountScope.getActiveUserId() !== accountContext) return;
      console.warn('[profile] load sign data failed:', {
        code: err && (err.code || err.errCode || '')
      });
    });
  },

  // 批量刷新页面数据（合并多处 setData 为一次调用）
  _refreshPageData() {
    // 使用当前页面状态判断登录
    this._loadSignDataWithState(this.data.isLoggedIn);
    const recentBrowse = this._computeRecentBrowse();
    const subscribeData = this._computeSubscribeStatus();
    const studyStats = mock.getStudyStats();

    this.setData({
      recentBrowse,
      studyStats,
      ...subscribeData
    });
  },

  onUnload() {
    if (this._unsub) this._unsub();
  },

  _renderStore() {
    const state = store.getState();
    const isLoggedIn = state.isLoggedIn;
    const user = state.userInfo || { nickname: '微信用户', bio: '点击登录解锁更多体验' };

    let avatarBgColor = '#3B6D11';
    let avatarText = '?';
    let affinityList = [];
    let footprint = { teasTasted: 0, placesVisited: 0, filmsWatched: 0, habitsKept: 0, musicListened: 0, incenseBurned: 0 };
    let collectionCount = 0;
    let points = 0;
    let levelInfo = null;
    let earnedBadgeCount = 0;
    let totalBadgeCount = 0;
    let recentBadges = [];

    if (isLoggedIn) {
      avatarText = (user.nickname || '').charAt(0);

      const userServices = require('../../services/user.js');
      avatarBgColor = userServices.getAvatarBgColor(user.nickname);

      // 使用 persona.js 计算真实偏好
      const personaResult = persona.calculatePersona();
      affinityList = Object.keys(personaResult.affinity).map(k => ({
        key: k,
        value: personaResult.affinity[k],
        color: DOMAIN_COLORS[k] || '#3B6D11'
      }));

      // 统计足迹（使用 store 中已计算的完整数据）
      footprint = state.footprint || {
        teasTasted: 0, placesVisited: 0, filmsWatched: 0,
        habitsKept: 0, musicListened: 0, incenseBurned: 0
      };

      collectionCount = state.collectionCount;

      // 积分与徽章
      points = state.points || 0;
      levelInfo = pointsUtil.getLevel();
      const allBadges = pointsUtil.getAllBadges();
      earnedBadgeCount = allBadges.filter(b => b.earned).length;
      totalBadgeCount = allBadges.length;
      recentBadges = allBadges.filter(b => b.earned).slice(-4).reverse();
    }

    this.setData({
      isLoggedIn,
      user,
      avatarText,
      avatarBgColor,
      persona: isLoggedIn ? state.persona : '未解锁',
      personaDesc: isLoggedIn ? state.personaDesc : '登录后解锁风雅人格画像',
      affinityList,
      footprint,
      collectionCount,
      points,
      levelInfo,
      earnedBadgeCount,
      totalBadgeCount,
      recentBadges
    });
  },

  goBookmark() {
    wx.switchTab({ url: '/pages/bookmark/bookmark' });
  },

  goStudyHome() {
    wx.navigateTo({ url: '/pages/study/index' });
  },

  goStudyReview() {
    wx.navigateTo({ url: '/pages/study/review' });
  },

  // 工具箱：DNF 礼包计算器
  goDnfCalculator() {
    const router = require('../../utils/router.js');
    router.navigate('/subpackages/tools/pages/dnf-summer-2026/calculator');
    tracker.track('click', { event_params: { element_id: 'tool_dnf_calculator' }, page_path: 'pages/profile/profile' });
  },

  // 工具箱：金币采购估算器
  goGoldPurchase() {
    const router = require('../../utils/router.js');
    router.navigate('/subpackages/tools/pages/gold-purchase/calculator');
    tracker.track('click', { event_params: { element_id: 'tool_gold_purchase' }, page_path: 'pages/profile/profile' });
  },

  // 编辑资料
  goEditProfile() {
    if (!this.data.isLoggedIn) {
      this.onLoginTap();
      return;
    }
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
  },

  // 微信授权登录（旧版，保留备用）
  onLoginTap() {
    this._doLogin();
  },

  // 使用微信头像一键登录
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;

    // 先执行静默登录获取 openid
    const auth = require('../../utils/auth.js');
    const userService = require('../../services/user.js');

    wx.showLoading({ title: '登录中...' });

    auth.login().then((user) => {
      if (user) {
        // 登录成功，合并头像信息
        const updatedInfo = {
          ...user,
          avatarUrl: avatarUrl || user.avatarUrl || ''
        };

        // 保存到云端（异步）
        return userService.saveUserInfo(updatedInfo).then(() => {
          // 更新 store 状态
          store.login(updatedInfo);

          // 立即渲染 store 状态到页面（关键！）
          this._renderStore();

          wx.hideLoading();
          wx.showToast({ title: '登录成功', icon: 'success' });
          this._refreshPageData();
          this._syncCloudAssetsAfterLogin();

          // 延迟后引导去设置昵称
          setTimeout(() => {
            wx.showModal({
              title: '完善资料',
              content: '头像已获取，是否前往设置昵称？',
              confirmText: '去设置',
              cancelText: '稍后',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
                }
              }
            });
          }, 800);
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
      console.warn('[profile] login failed:', {
        code: err && (err.code || err.errCode || '')
      });
    });
  },

  // 执行登录（支持传入初始用户信息）
  _doLogin(initialUserInfo = {}) {
    const auth = require('../../utils/auth.js');
    const userService = require('../../services/user.js');

    wx.showLoading({ title: '登录中...' });

    auth.login().then((user) => {
      if (user) {
        // 如果有初始用户信息，更新到云端
        if (initialUserInfo.nickname || initialUserInfo.avatarUrl) {
          const updatedInfo = {
            ...user,
            ...initialUserInfo
          };

          return userService.saveUserInfo(updatedInfo).then(() => {
            store.login(updatedInfo);
            this._onLoginSuccess(user);
          });
        } else {
          store.login(user);
          this._onLoginSuccess(user);
          return Promise.resolve();
        }
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
      console.warn('[profile] login failed:', {
        code: err && (err.code || err.errCode || '')
      });
    });
  },

  // 登录成功后的统一处理
  _onLoginSuccess(user) {
    // 立即渲染 store 状态到页面（关键！）
    this._renderStore();

    wx.hideLoading();
    wx.showToast({ title: '登录成功', icon: 'success' });
    this._refreshPageData();

    this._syncCloudAssetsAfterLogin();

    // 如果是新用户，引导前往资料编辑页
    if (user.is_new) {
      wx.showModal({
        title: '欢迎来到妙不可园',
        content: '设置一个风雅的头像和昵称吧！',
        confirmText: '去设置',
        success: (modalRes) => {
          if (modalRes.confirm) {
            wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
          }
        }
      });
    }
  },

  _syncCloudAssetsAfterLogin() {
    // 启动登录失败后在个人页补登录，也必须同步偏好、通知、学习进度和 UGC。
    try {
      const app = getApp();
      if (app && typeof app.syncCloudAssets === 'function') {
        app.syncCloudAssets();
        setTimeout(() => this._refreshPageData(), 1000);
      }
    } catch (err) {
      console.warn('[profile] cloud asset sync unavailable');
    }
  },

  // 偏好设置
  goPreferences() {
    wx.navigateTo({ url: '/pages/preferences/preferences' });
  },

  // 历史记录
  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  // 通知设置
  goNotificationSettings() {
    wx.navigateTo({ url: '/pages/notification-settings/notification-settings' });
  },

  goSetting() {
    const itemList = ['清除缓存', '关于我们'];
    if (this.data.isLoggedIn) {
      itemList.push('退出当前登录');
    }

    wx.showActionSheet({
      itemList,
      success: (res) => {
        const index = res.tapIndex;
        if (index === 0) {
          wx.showModal({
            title: '清除缓存',
            content: '将清除本地缓存数据（不含收藏和签到记录）',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this._safeClearCache();
              }
            }
          });
        } else if (index === 1) {
          this.goAbout();
        } else if (index === 2) {
          wx.showModal({
            title: '退出登录',
            content: '确定要退出当前登录吗？',
            success: (modalRes) => {
              if (modalRes.confirm) {
                const auth = require('../../utils/auth.js');
                try {
                  auth.logout();
                  store.logout();
                  this.setData({
                    signedToday: false,
                    signSubmitting: false,
                    signDays: 0,
                    signDates: this._buildSignDates([]),
                    recentBrowse: [],
                    studyStats: {
                      pendingCount: 0,
                      learningCount: 0,
                      masteredCount: 0,
                      weakCount: 0,
                      reviewCount: 0
                    },
                    ugcCount: 0,
                    subscribeStatus: {
                      DAILY_RECOMMEND: false,
                      SIGN_REMIND: false,
                      CONTENT_UPDATE: false,
                      ACTIVITY_REMIND: false
                    },
                    subscribeEnabledCount: 0
                  });
                  wx.showToast({ title: '已注销', icon: 'success' });
                } catch (err) {
                  wx.showToast({
                    title: '本地数据保存失败，请重试',
                    icon: 'none'
                  });
                }
              }
            }
          });
        }
      }
    });
  },

  // 安全清除缓存：保留收藏、签到、浏览历史等核心数据
  _safeClearCache() {
    const accountScope = require('../../utils/account-scope.js');
    // 需要保留的 key 前缀列表
    const preservePrefixes = [
      'fengya_collections',
      'daily_elegance_checkin',
      'browse_history',
      'search_history',
      'reviews_',
      'reply_',
      'review_likes_',
      'likes_',
      'views_',
      'incense_timer_state',
      'brew_timer_state',
      'notes_',
      'ugc_posts',
      'ugc_draft',
      'ugc_conflicts',
      'account_snapshot:',
      'user_info',
      'cloud_login_token',
      'user_id'
    ];

    // 获取所有需要保留的数据
    const preservedData = {};
    const info = wx.getStorageInfoSync();
    (info.keys || []).forEach(key => {
      const shouldPreserve =
        accountScope.isPersonalKey(key) ||
        preservePrefixes.some(prefix => key === prefix || key.startsWith(prefix));
      if (shouldPreserve) {
        try {
          preservedData[key] = wx.getStorageSync(key);
        } catch (e) {}
      }
    });

    // 清除所有缓存
    try {
      wx.clearStorageSync();
    } catch (e) {}

    // 恢复需要保留的数据
    Object.keys(preservedData).forEach(key => {
      try {
        wx.setStorageSync(key, preservedData[key]);
      } catch (e) {}
    });

    wx.showToast({ title: '缓存已清除', icon: 'success' });
    this._refreshPageData();
  },

  // 消息订阅设置
  showSubscribeSetting() {
    // 跳转到订阅管理页面
    wx.navigateTo({
      url: '/pages/subscribe/subscribe'
    });

    tracker.track('setting_change', {
      event_params: {
        setting: 'subscribe',
        value: 'navigate_to_subscribe_page'
      }
    });
  },

  // 切换订阅状态
  _toggleSubscribe(templateKey) {
    const { subscribeStatus } = this.data;
    const isCurrentlySubscribed = subscribeStatus[templateKey];

    if (isCurrentlySubscribed) {
      // 如果已订阅，显示管理选项
      wx.showModal({
        title: '取消订阅',
        content: '确定要取消此消息订阅吗？',
        success: (res) => {
          if (res.confirm) {
            subscribe.setSubscribeStatus(templateKey, false);
            this._loadSubscribeStatus();
            wx.showToast({ title: '已取消订阅', icon: 'success' });

            tracker.track('subscribe_toggle', {
              event_params: {
                template_key: templateKey,
                action: 'unsubscribe'
              }
            });
          }
        }
      });
    } else {
      // 如果未订阅，请求订阅
      const template = subscribeConfig.SUBSCRIBE_TEMPLATES[templateKey];
      if (template) {
        subscribe.requestSubscribe([template.id], 'manual').then(({ accepted }) => {
          if (accepted.length > 0) {
            subscribe.setSubscribeStatus(templateKey, true);
            this._loadSubscribeStatus();
            wx.showToast({ title: '订阅成功', icon: 'success' });
          }
        });
      }
    }
  },

  // 打开订阅管理
  _openSubscribeManage() {
    subscribe.showSubscribeManage({
      title: '订阅消息管理',
      content: '您可以在微信设置中管理所有订阅消息的权限',
      confirmText: '去设置'
    });
  },

  // 通知设置（跳转到通知设置页）
  showNotificationSetting() {
    wx.navigateTo({
      url: '/pages/notification-settings/notification-settings'
    });
    tracker.track('setting_change', {
      event_params: {
        setting: 'notification',
        value: 'navigate_to_notification_page'
      }
    });
  },

  goAbout() {
    wx.showModal({
      title: '关于妙不可园',
      content: '偷得浮生妙不可园。\n焚香、听曲、品茗、看戏、养生、行旅 —— 把每一天过成风雅。\n\n版本：1.0.0 MVP',
      showCancel: false,
      confirmText: '且去品味'
    });
  },

  showPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  showAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement' });
  },

  // 意见反馈
  showFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '请点击小程序右上角“…”并选择“反馈与投诉”提交问题。正式发布前，运营主体还需在隐私保护指引中补充并核验可处理数据权利请求的联系渠道。',
      showCancel: false,
      confirmText: '我知道了'
    });
    tracker.track('click', { event_params: { element_id: 'feedback' }, page_path: 'pages/profile/profile' });
  },

  // 使用帮助
  showHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '【妙不可园】使用指南：\n\n1. 首页六雅宫格可快速进入各板块\n2. 长按茶品可添加到对比\n3. 点击❤️可收藏到书签\n4. 每日签到可获得风雅积分\n5. 分享给朋友一起品味风雅生活',
      showCancel: false,
      confirmText: '我知道了'
    });
    tracker.track('click', { event_params: { element_id: 'help' }, page_path: 'pages/profile/profile' });
  },

  // 加载最近浏览（返回纯数据对象）
  _computeRecentBrowse() {
    const history = wx.getStorageSync('browse_history') || [];
    // 取最近10条，去重，过滤掉签到记录
    const seen = {};
    const recent = [];
    for (let i = history.length - 1; i >= 0 && recent.length < 10; i--) {
      const h = history[i];
      // 跳过签到记录（ID以sign_开头的）
      if (h.refId && h.refId.startsWith('sign_')) {
        continue;
      }
      const key = h.domain + '_' + h.refId;
      if (!seen[key]) {
        seen[key] = true;
        // 如果历史记录中没有name，尝试从数据中获取
        let name = h.name;
        if (!name) {
          name = this._getContentName(h.domain, h.refId);
        }
        // 只有能获取到标题的记录才显示
        if (name) {
          recent.push({
            domain: h.domain,
            refId: h.refId,
            name: name,
            date: h.date || ''
          });
        }
      }
    }
    return recent;
  },

  // 根据domain和id获取内容标题
  _getContentName(domain, refId) {
    try {
      if (domain === 'tea') {
        const teas = mock.loadTeas();
        const tea = teas.find(t => t.id === refId);
        return tea ? tea.name : '';
      } else if (domain === 'travel') {
        const travels = mock.loadTravels();
        const travel = travels.find(t => t.id === refId);
        return travel ? travel.title : '';
      } else if (domain === 'wellness') {
        const items = mock.loadWellness();
        const item = items.find(w => w.id === refId);
        return item ? item.title : '';
      } else if (domain === 'incense') {
        const items = mock.loadIncense();
        const item = items.find(i => i.id === refId);
        return item ? item.title : '';
      } else if (domain === 'music') {
        const items = mock.loadMusic();
        const item = items.find(m => m.id === refId);
        return item ? item.title : '';
      } else if (domain === 'film') {
        const items = mock.loadFilm();
        const item = items.find(f => f.id === refId);
        return item ? item.title : '';
      } else if (domain === 'tutorial') {
        const item = mock.getTutorialById(refId);
        return item ? item.title : '';
      } else if (domain === 'knowledge') {
        const item = mock.getKnowledgeById(refId);
        return item ? item.title : '';
      } else if (domain === 'interview') {
        const item = mock.getInterviewQuestionById(refId);
        return item ? item.title : '';
      }
    } catch (e) {
      console.error('获取内容标题失败:', e);
    }
    return '';
  },

  // 兼容旧调用
  _loadRecentBrowse() {
    this.setData({ recentBrowse: this._computeRecentBrowse() });
  },

  // 加载订阅状态（返回纯数据对象）
  _computeSubscribeStatus() {
    const subscribeStatus = subscribe.getSubscribeStatus();
    const enabledTemplates = subscribeConfig.getEnabledTemplates();
    const subscribeEnabledCount = enabledTemplates.filter(template => subscribeStatus[template.key]).length;

    return { subscribeStatus, subscribeEnabledCount };
  },

  // 兼容旧调用
  _loadSubscribeStatus() {
    this.setData(this._computeSubscribeStatus());
  },

  // 点击浏览记录跳转
  onBrowseTap(e) {
    const { domain, id } = e.currentTarget.dataset;
    const router = require('../../utils/router.js');
    if (domain === 'tea') router.goTeaDetail(id);
    else if (domain === 'travel') router.goTravelDetail(id);
    else if (domain === 'wellness') router.goContentDetail(id, 'wellness');
    else if (domain === 'incense') router.goContentDetail(id, 'incense');
    else if (domain === 'music') router.goContentDetail(id, 'music');
    else if (domain === 'film') router.goContentDetail(id, 'film');
    else if (domain === 'tutorial') router.navigate('/subpackages/detail/study-detail/study-detail', { id, domain: 'tutorial' });
    else if (domain === 'knowledge') router.navigate('/subpackages/detail/study-detail/study-detail', { id, domain: 'knowledge' });
    else if (domain === 'interview') router.navigate('/subpackages/detail/question-detail/question-detail', { id });
  },

  // ====== UGC 投稿 ======
  goContributeList() {
    if (!this.data.isLoggedIn) {
      this.onLoginTap();
      return;
    }
    wx.navigateTo({ url: '/pages/contribute/list' });
    tracker.track('click', { event_params: { element_id: 'ugc_list' }, page_path: 'pages/profile/profile' });
  },

  goContributeNew() {
    if (!this.data.isLoggedIn) {
      this.onLoginTap();
      return;
    }
    wx.navigateTo({ url: '/pages/contribute/contribute' });
    tracker.track('click', { event_params: { element_id: 'ugc_new' }, page_path: 'pages/profile/profile' });
  },

  // ====== 每日签到 ======
  // 计算签到数据（从云函数获取，异步）
  _loadSignData() {
    return this._loadSignDataWithState(store.getState().isLoggedIn);
  },

  // 根据签到记录构建最近7天日历
  _buildSignDates(records) {
    const now = new Date();
    const signDates = [];
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      signDates.push({
        date: dateStr,
        day: dayNames[d.getDay()],
        isToday: i === 0,
        signed: records.indexOf(dateStr) >= 0
      });
    }
    return signDates;
  },

  onSignTap() {
    if (this.data.signSubmitting) {
      return;
    }
    if (this.data.signedToday) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }
    if (!this.data.isLoggedIn) {
      this.onLoginTap();
      return;
    }
    const accountContext = accountScope.getActiveUserId();
    if (!accountContext) {
      wx.showToast({ title: '账号正在切换，请稍后重试', icon: 'none' });
      return;
    }
    let loadingShown = false;
    this.setData({ signSubmitting: true });
    // 关键：wx.requestSubscribeMessage 必须在 TAP 同步调用栈中执行
    return subscribe.subscribeByScene('sign').then(() => {
      if (accountScope.getActiveUserId() !== accountContext) {
        const staleError = new Error('账号已切换');
        staleError.code = 'stale_account_context';
        throw staleError;
      }
      wx.showLoading({ title: '签到中...' });
      loadingShown = true;
      return wx.cloud.callFunction({
        name: 'sign',
        data: { action: 'sign' }
      });
    }).then(res => {
      if (accountScope.getActiveUserId() !== accountContext) return;
      wx.hideLoading();
      loadingShown = false;
      const result = (res && res.result) || {};
      this.setData({ signSubmitting: false });
      if (result.code === 0) {
        const signDates = this._buildSignDates(result.records || []);
        this.setData({
          signedToday: true,
          signDays: result.signDays || 1,
          signDates
        });
        if (result.alreadySigned === false) {
          tracker.track('sign', { event_params: { sign_days: result.signDays || 1 } });
          const earnedPoints = pointsUtil.onSignIn(result.signDays || 1);
          wx.showToast({ title: `签到成功 +${earnedPoints}积分`, icon: 'none' });
          this._renderStore();
        } else {
          wx.showToast({
            title: result.alreadySigned === true ? '今日已签到' : '签到状态已同步',
            icon: 'none'
          });
        }
      } else {
        console.warn('[profile] sign rejected:', {
          code: result.code || ''
        });
        wx.showToast({ title: result.message || '签到失败', icon: 'none' });
      }
    }).catch(err => {
      if (
        (err && err.code === 'stale_account_context') ||
        accountScope.getActiveUserId() !== accountContext
      ) {
        return;
      }
      if (loadingShown) wx.hideLoading();
      this.setData({ signSubmitting: false });
      console.warn('[profile] sign flow failed:', {
        code: err && (err.code || err.errCode || '')
      });
      wx.showToast({ title: '签到失败，请重试', icon: 'none' });
    });
  },

  onShareAppMessage() {
    return { title: '妙不可园 · 我的画像', path: '/pages/profile/profile' };
  },

  // 跳转徽章详情页（预留）
  goBadges() {
    wx.showToast({ title: '徽章详情即将上线', icon: 'none' });
  },

  onShareTimeline() {
    return { title: '妙不可园 · 我的画像' };
  }
});
