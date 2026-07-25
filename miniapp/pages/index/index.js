// pages/index/index.js
// 首页：六雅宫格 + 每日风雅 + 内容流
const homeService = require('../../services/home.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const seasonal = require('../../utils/seasonal.js');

const CHECKIN_KEY = 'daily_elegance_checkin';
const COLLECTION_KEY = 'fengya_collections';
const auth = require('../../utils/auth.js');

Page({
  data: {
    // 六雅宫格配置
    realms: [
      { key: 'incense',  char: '香', name: '焚香', sub: '静心', color: '#8B6F47' },
      { key: 'music',    char: '音', name: '听曲', sub: '怡情', color: '#4A6B7C' },
      { key: 'tea',      char: '茶', name: '品茗', sub: '养性', color: '#3B6D11' },
      { key: 'film',     char: '影', name: '看戏', sub: '观心', color: '#2C2C2A' },
      { key: 'wellness', char: '养', name: '养生', sub: '调身', color: '#A0522D' },
      { key: 'travel',   char: '游', name: '行旅', sub: '融汇', color: '#5B8C85' }
    ],
    // 每日风雅
    dailyElegance: null,
    // 当季推荐
    seasonInfo: null,
    seasonalList: [],
    // 打卡数据
    checkedToday: false,
    checkinCalendar: [],
    checkinStreak: 0,
    // 内容流
    feed: [],
    // 加载态
    loading: true,
    dailyEleganceViewed: false,
    // 快捷导航面板
    showNavPanel: false,
    // 网络重试
    showRetry: false,
    retryMessage: '',
    retryLoading: false,
    navItems: [
      { key: 'incense',  char: '香', name: '焚香', color: '#8B6F47' },
      { key: 'music',    char: '音', name: '听曲', color: '#4A6B7C' },
      { key: 'tea',      char: '茶', name: '品茗', color: '#3B6D11' },
      { key: 'film',     char: '影', name: '看戏', color: '#2C2C2A' },
      { key: 'wellness', char: '养', name: '养生', color: '#A0522D' },
      { key: 'travel',   char: '游', name: '行旅', color: '#5B8C85' }
    ]
  },

  onLoad() {
    homeService.clearHomeCache();
    this._loadData();
    tracker.track('page_view', { page_path: 'pages/index/index' });
  },

  onShow() {
    // 刷新收藏角标
    const realmsWithBadges = this._loadRealmBadges();
    this.setData({ realms: realmsWithBadges });
  },

  onPullDownRefresh() {
    this._loadData().then(() => {
      wx.stopPullDownRefresh();
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  _loadData() {
    this.setData({ loading: true });

    return homeService.getHomeData({ mode: 'leisure' }).then(res => {
      const payload = res.data || {};

      return new Promise(resolve => {
        const checkinData = this._loadCheckin();
        const seasonInfo = seasonal.getSeasonInfo();
        const seasonalList = seasonal.getRecommendedContent();
        const realmsWithBadges = this._loadRealmBadges();
        const today = this._getTodayStr();
        const viewed = wx.getStorageSync('daily_elegance_viewed_' + today) || false;
        this.setData({
          dailyElegance: payload.dailyElegance || null,
          feed: payload.feed || [],
          seasonInfo,
          seasonalList,
          realms: realmsWithBadges,
          loading: false,
          dailyEleganceViewed: viewed,
          ...checkinData
        });
        resolve();
      });
    }).catch(() => {
      this.setData({ loading: false, showRetry: true, retryMessage: '内容加载失败，请重试' });
    });
  },

  // ====== 六雅宫格角标 ======

  _loadRealmBadges() {
    const collections = wx.getStorageSync(COLLECTION_KEY) || [];
    const countMap = {};
    collections.forEach(c => {
      if (c.target_domain) {
        countMap[c.target_domain] = (countMap[c.target_domain] || 0) + 1;
      }
    });
    return this.data.realms.map(r => ({
      ...r,
      bookmarkCount: countMap[r.key] || 0
    }));
  },

  // ====== 每日风雅打卡 ======

  _loadCheckin() {
    const records = wx.getStorageSync(CHECKIN_KEY) || [];
    const today = this._getTodayStr();
    let checkedToday = records.indexOf(today) >= 0;

    // 如果用户已登录，从云端同步签到状态
    if (auth.isLoggedIn() && !checkedToday) {
      wx.cloud.callFunction({
        name: 'sign',
        data: { action: 'status' }
      }).then(res => {
        if (res.result && res.result.code === 0 && res.result.signedToday) {
          // 云端已签到，同步到本地
          if (records.indexOf(today) < 0) {
            records.push(today);
            wx.setStorageSync(CHECKIN_KEY, records);
          }
          this.setData(this._loadCheckin());
        }
      }).catch(() => {});
    }

    // 构建最近 7 天日历
    const now = new Date();
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const calendar = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = y + '-' + m + '-' + day;
      calendar.push({
        date: dateStr,
        day: dayNames[d.getDay()],
        isToday: i === 0,
        checked: records.indexOf(dateStr) >= 0
      });
    }

    // 计算连续打卡天数
    let streak = 0;
    const sortedRecords = records.slice().sort().reverse();
    const todayDate = new Date();
    for (let i = 0; i < sortedRecords.length; i++) {
      const checkDate = new Date(sortedRecords[i]);
      const expected = new Date(todayDate);
      expected.setDate(expected.getDate() - i);
      if (checkDate.toDateString() === expected.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return { checkedToday, checkinCalendar: calendar, checkinStreak: streak };
  },

  _getTodayStr() {
    const now = new Date();
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  },

  onCheckinTap() {
    if (this.data.checkedToday) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }

    const records = wx.getStorageSync(CHECKIN_KEY) || [];
    const today = this._getTodayStr();
    if (records.indexOf(today) < 0) {
      records.push(today);
      wx.setStorageSync(CHECKIN_KEY, records);
    }

    // 异步竞态保护：用请求版本号确保只接受最新响应
    const reqId = (this._checkinReqId || 0) + 1;
    this._checkinReqId = reqId;

    const checkinData = this._loadCheckin();
    this.setData(checkinData);

    // 更新积分
    try {
      const points = require('../../utils/points.js');
      points.onSignIn(this.data.checkinStreak);
    } catch (e) {}

    wx.showToast({ title: '风雅打卡 +' + this.data.checkinStreak + '天', icon: 'success' });
    tracker.track('daily_elegance_checkin', { event_params: { streak: this.data.checkinStreak } });

    // 如果用户已登录，同步到云端签到
    if (auth.isLoggedIn()) {
      wx.cloud.callFunction({
        name: 'sign',
        data: { action: 'sign' }
      }).then(res => {
        // 只接受最新请求的响应
        if (reqId !== this._checkinReqId) return;
        if (res.result && res.result.code === 0 && res.result.signedToday) {
          // 云端签到成功，更新本地连续天数
          if (res.result.signDays && res.result.signDays !== this.data.checkinStreak) {
            this.setData({ checkinStreak: res.result.signDays });
          }
        }
      }).catch(() => {});
    }
  },

  // 点击每日风雅卡片
  onDailyEleganceTap() {
    const elegance = this.data.dailyElegance;
    if (!elegance || !elegance.data) return;

    // 标记为已阅
    const today = this._getTodayStr();
    wx.setStorageSync('daily_elegance_viewed_' + today, true);
    this.setData({ dailyEleganceViewed: true });

    const routeMap = {
      tea: () => router.goTeaDetail(elegance.data.id),
      travel: () => router.goTravelDetail(elegance.data.id),
      wellness: () => router.goContentDetail(elegance.data.id, 'wellness'),
      incense: () => router.goContentDetail(elegance.data.id, 'incense'),
      music: () => router.goContentDetail(elegance.data.id, 'music'),
      film: () => router.goContentDetail(elegance.data.id, 'film')
    };

    tracker.track('click', { event_params: { element_id: 'daily_elegance' }, page_path: 'pages/index/index' });
    if (routeMap[elegance.domain]) {
      routeMap[elegance.domain]();
    }
  },

  // 六雅宫格点击
  onRealmTap(e) {
    const { key } = e.currentTarget.dataset;
    const routeMap = {
      tea: '/pages/tea/tea',
      travel: '/pages/travel/travel',
      wellness: '/pages/wellness/wellness',
      incense: '/pages/incense/incense',
      music: '/pages/music/music',
      film: '/pages/film/film'
    };
    tracker.track('click', { event_params: { element_id: 'realm_' + key }, page_path: 'pages/index/index' });
    if (routeMap[key]) {
      router.navigate(routeMap[key]);
    } else {
      wx.showToast({ title: '该板块即将上线', icon: 'none' });
    }
  },

  // 内容流卡片点击
  onTeaTap(e) {
    const tea = e.currentTarget.dataset.tea || e.detail.tea;
    if (!tea) return;
    router.goTeaDetail(tea.id);
  },

  onTravelTap(e) {
    const travel = e.detail.data;
    if (!travel) return;
    router.goTravelDetail(travel.id);
  },

  onWellnessTap(e) {
    const wellness = e.detail.data;
    if (!wellness) return;
    router.goContentDetail(wellness.id, 'wellness');
  },

  onIncenseTap(e) {
    const incense = e.detail.data;
    if (!incense) return;
    router.goContentDetail(incense.id, 'incense');
  },

  onMusicTap(e) {
    const music = e.detail.data;
    if (!music) return;
    router.goContentDetail(music.id, 'music');
  },

  onFilmTap(e) {
    const film = e.detail.data;
    if (!film) return;
    router.goContentDetail(film.id, 'film');
  },

  // 当季推荐点击
  onSeasonalTap(e) {
    const { domain, refId } = e.currentTarget.dataset;
    tracker.track('click', { event_params: { element_id: 'seasonal_' + domain }, page_path: 'pages/index/index' });
    
    // 如果有关联内容 ID，跳转到详情
    if (refId) {
      const routeMap = {
        tea: () => router.goTeaDetail(refId),
        travel: () => router.goTravelDetail(refId),
        wellness: () => router.goContentDetail(refId, 'wellness'),
        incense: () => router.goContentDetail(refId, 'incense'),
        music: () => router.goContentDetail(refId, 'music'),
        film: () => router.goContentDetail(refId, 'film')
      };
      if (routeMap[domain]) routeMap[domain]();
    } else {
      // 没有关联内容，跳转到对应领域页面
      const routeMap = {
        tea: '/pages/tea/tea',
        travel: '/pages/travel/travel',
        wellness: '/pages/wellness/wellness',
        incense: '/pages/incense/incense',
        music: '/pages/music/music',
        film: '/pages/film/film'
      };
      if (routeMap[domain]) router.navigate(routeMap[domain]);
    }
  },

  // 换一批内容
  onRefreshFeed() {
    homeService.clearHomeCache();
    this.setData({ loading: true });
    this._loadData().then(() => {
      wx.showToast({ title: '已刷新', icon: 'none' });
    });
    tracker.track('click', { event_params: { element_id: 'refresh_feed' }, page_path: 'pages/index/index' });
  },

  // 当季推荐查看更多
  onSeasonalMore() {
    // 跳转到搜索页，以当前节气为关键词搜索
    const term = this.data.seasonInfo && this.data.seasonInfo.currentTerm;
    if (term) {
      router.navigate('/subpackages/search/pages/search/search', { keyword: term });
    } else {
      // 没有节气信息时，跳转到第一个当季内容的详情
      const firstSeasonal = this.data.seasonalList[0];
      if (firstSeasonal && firstSeasonal.domain && firstSeasonal.refId) {
        const routeMap = {
          tea: () => router.goTeaDetail(firstSeasonal.refId),
          travel: () => router.goTravelDetail(firstSeasonal.refId),
          wellness: () => router.goContentDetail(firstSeasonal.refId, 'wellness'),
          incense: () => router.goContentDetail(firstSeasonal.refId, 'incense'),
          music: () => router.goContentDetail(firstSeasonal.refId, 'music'),
          film: () => router.goContentDetail(firstSeasonal.refId, 'film')
        };
        if (routeMap[firstSeasonal.domain]) routeMap[firstSeasonal.domain]();
      }
    }
  },

  // ====== 浮动快捷导航 ======
  onFabNav() {
    this.setData({ showNavPanel: true });
  },

  onCloseNav() {
    this.setData({ showNavPanel: false });
  },

  onNavTap(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ showNavPanel: false });
    const routeMap = {
      tea: '/pages/tea/tea',
      travel: '/pages/travel/travel',
      wellness: '/pages/wellness/wellness',
      incense: '/pages/incense/incense',
      music: '/pages/music/music',
      film: '/pages/film/film'
    };
    if (routeMap[key]) router.navigate(routeMap[key]);
  },

  onNavSearch() {
    this.setData({ showNavPanel: false });
    this.goSearch();
  },

  onNavBookmark() {
    this.setData({ showNavPanel: false });
    wx.switchTab({ url: '/pages/bookmark/bookmark' });
  },

  onNavProfile() {
    this.setData({ showNavPanel: false });
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  onNavStudy() {
    this.setData({ showNavPanel: false });
    this.goStudyHome();
  },

  onNavDNF() {
    this.setData({ showNavPanel: false });
    this.goDnfCalculator();
  },

  // 网络重试
  onRetry() {
    this.setData({ showRetry: false, retryLoading: true });
    this._loadData().then(() => {
      this.setData({ retryLoading: false });
    }).catch(() => {
      this.setData({ retryLoading: false, showRetry: true, retryMessage: '仍然失败，请检查网络后重试' });
    });
  },

  // 搜索
  goSearch() {
    router.navigate('/subpackages/search/pages/search/search');
  },

  // 发现好工具
  goStudyHome() {
    router.navigate('/pages/study/index');
    tracker.track('click', { event_params: { element_id: 'home_tool_study' }, page_path: 'pages/index/index' });
  },

  goDnfCalculator() {
    router.navigate('/subpackages/tools/pages/dnf-summer-2026/calculator');
    tracker.track('click', { event_params: { element_id: 'home_tool_dnf' }, page_path: 'pages/index/index' });
  },

  goGoldPurchase() {
    router.navigate('/subpackages/tools/pages/gold-purchase/calculator');
    tracker.track('click', { event_params: { element_id: 'home_tool_gold' }, page_path: 'pages/index/index' });
  },

  goToolbox() {
    router.navigate('/subpackages/tools/pages/dnf-summer-2026/calculator');
    tracker.track('click', { event_params: { element_id: 'home_tool_toolbox' }, page_path: 'pages/index/index' });
  },

  onShareAppMessage() {
    return {
      title: '妙不可园 · 偷得浮生妙不可园',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '妙不可园 · 偷得浮生妙不可园'
    };
  }
});
