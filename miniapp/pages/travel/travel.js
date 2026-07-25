// pages/travel/travel.js
// 行旅专题列表 — 支持按主题 + 地区 + 季节 + 天数筛选
const travelService = require('../../services/travel.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const interaction = require('../../utils/content-interaction.js');

// 主题定义：根据 linkedDomains 和内容关键词自动归类
const THEMES = [
  { id: 'all', name: '全部', icon: '🌐' },
  { id: 'tea', name: '茶山寻源', icon: '🍵' },
  { id: 'incense', name: '香事寻访', icon: '🪔' },
  { id: 'music', name: '古乐雅集', icon: '🎵' },
  { id: 'wellness', name: '禅茶静心', icon: '🌿' },
  { id: 'culture', name: '古城文化', icon: '🏯' }
];

Page({
  data: {
    list: [],
    filteredList: [],
    themes: THEMES,
    activeTheme: 'all',
    regions: interaction.TRAVEL_REGIONS,
    activeRegion: 'all',
    activeRegionIndex: 0,
    seasons: interaction.TRAVEL_SEASONS,
    activeSeason: 'all',
    durations: interaction.TRAVEL_DURATIONS,
    activeDuration: 'all',
    showFilters: false,
    coverColor: '#5B8C85',
    loading: false
  },

  onLoad() {
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/travel/travel', target_domain: 'travel' });
  },

  onShow() {
    // 从详情页返回时刷新列表以更新收藏数等可能变化的字段
    if (this.data.filteredList.length && !this.data.loading) {
      this._loadList();
    }
  },

  onPullDownRefresh() {
    this._loadList().then(() => {
      wx.stopPullDownRefresh();
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  _loadList() {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    return travelService.getTravelList({}).then(res => {
      const list = (res.data.list || []).map(item => {
        const enriched = Object.assign({}, item, {
          destination: { name: item.destName, region: item.region },
          involvedDomains: item.involvedDomains || [],
          themes: this._extractThemes(item),
          travelRegion: interaction.inferTravelRegion(item),
          travelSeason: interaction.inferTravelSeason(item),
          travelDuration: interaction.inferTravelDuration(item)
        });
        return enriched;
      });
      this.setData({
        list,
        filteredList: list,
        loading: false
      });
      this._applyFilters();
    }).catch(() => {
      this.setData({ list: [], filteredList: [], loading: false });
    });
  },

  // 根据 linkedDomains 和标题关键词自动提取主题
  _extractThemes(item) {
    const themes = [];
    const linkedDomains = item.linkedDomains || [];
    const title = item.title || '';
    const essay = item.essay || '';

    if (linkedDomains.some(d => d.domain === 'tea') ||
        title.includes('茶') || essay.includes('茶')) {
      themes.push('tea');
    }
    if (linkedDomains.some(d => d.domain === 'incense') ||
        essay.includes('香') || essay.includes('香铺')) {
      themes.push('incense');
    }
    if (linkedDomains.some(d => d.domain === 'music') ||
        essay.includes('琴') || essay.includes('评弹') || essay.includes('南音')) {
      themes.push('music');
    }
    if (linkedDomains.some(d => d.domain === 'wellness') ||
        essay.includes('寺') || essay.includes('禅') || essay.includes('静心')) {
      themes.push('wellness');
    }
    themes.push('culture');
    return themes;
  },

  // 切换主题
  onThemeTap(e) {
    const { theme } = e.currentTarget.dataset;
    this.setData({ activeTheme: theme });
    this._applyFilters();
  },

  // 切换筛选面板
  onToggleFilters() {
    this.setData({ showFilters: !this.data.showFilters });
  },

  // 切换地区
  onRegionTap(e) {
    const { key } = e.currentTarget.dataset;
    const activeRegionIndex = this.data.regions.findIndex(r => r.key === key);
    this.setData({ activeRegion: key, activeRegionIndex });
    this._applyFilters();
  },

  // 切换季节
  onSeasonTap(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ activeSeason: key });
    this._applyFilters();
  },

  // 切换天数
  onDurationTap(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ activeDuration: key });
    this._applyFilters();
  },

  // 重置筛选
  onResetFilters() {
    this.setData({
      activeRegion: 'all',
      activeRegionIndex: 0,
      activeSeason: 'all',
      activeDuration: 'all'
    });
    this._applyFilters();
  },

  // 应用所有筛选条件
  _applyFilters() {
    const { list, activeTheme, activeRegion, activeSeason, activeDuration } = this.data;
    let filtered = list;

    if (activeTheme !== 'all') {
      filtered = filtered.filter(item => item.themes && item.themes.indexOf(activeTheme) >= 0);
    }
    if (activeRegion !== 'all') {
      filtered = filtered.filter(item => item.travelRegion === activeRegion);
    }
    if (activeSeason !== 'all') {
      filtered = filtered.filter(item => item.travelSeason === activeSeason || item.travelSeason === 'all');
    }
    if (activeDuration !== 'all') {
      filtered = filtered.filter(item => item.travelDuration === activeDuration);
    }

    this.setData({ filteredList: filtered });
  },

  onTravelTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTravelDetail(id);
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search', { domain: 'travel' });
  },

  onShareAppMessage() {
    return { title: '行旅 · 把五雅装进旅程', path: '/pages/travel/travel' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 行旅指南' };
  }
});
