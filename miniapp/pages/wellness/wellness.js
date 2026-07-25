// pages/wellness/wellness.js
// 养生：细分类 tab（含数量）+ 排序 + 内容列表 + 难度/耗时标记 + 差异化禁忌
const wellnessService = require('../../services/wellness.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const interaction = require('../../utils/content-interaction.js');

Page({
  data: {
    categories: interaction.WELLNESS_CATEGORIES,
    currentCategory: 'all',
    list: [],
    loading: false,
    // 排序
    sort: 'default',
    sortOptions: [
      { key: 'default', name: '默认' },
      { key: 'difficulty', name: '难度最低' },
      { key: 'duration', name: '耗时最短' }
    ],
    showSortPanel: false
  },

  onLoad() {
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/wellness/wellness', target_domain: 'wellness' });
  },

  onShow() {
    // 从详情页返回时刷新列表以更新可能变化的字段
    if (this.data.list.length && !this.data.loading) {
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
    return wellnessService.getWellnessList({ category: this.data.currentCategory }).then(res => {
      let list = interaction.enrichWellnessList(res.data.list || []);
      // 按分类过滤
      const filtered = this.data.currentCategory === 'all'
        ? list
        : list.filter(item => item.wellnessCategory === this.data.currentCategory);

      // 更新分类计数
      const categories = this.data.categories.map(cat => {
        if (cat.key === 'all') {
          return { ...cat, count: list.length };
        }
        return { ...cat, count: list.filter(item => item.wellnessCategory === cat.key).length };
      });

      // 排序
      let sorted = filtered;
      if (this.data.sort === 'difficulty') {
        sorted = filtered.slice().sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
      } else if (this.data.sort === 'duration') {
        const durOrder = { '5min': 1, '15min': 2, '30min': 3, 'ongoing': 4 };
        sorted = filtered.slice().sort((a, b) => (durOrder[a.durationTag] || 0) - (durOrder[b.durationTag] || 0));
      }

      this.setData({ list: sorted, categories, loading: false });
    }).catch(() => {
      this.setData({ list: [], loading: false });
    });
  },

  onCategoryTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentCategory) return;
    this.setData({ currentCategory: key });
    this._loadList();
    tracker.track('click', {
      event_params: { element_id: 'wellness_category_' + key },
      page_path: 'pages/wellness/wellness'
    });
  },

  // 排序
  toggleSortPanel() {
    this.setData({ showSortPanel: !this.data.showSortPanel });
  },

  onSortTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.sort) return;
    this.setData({ sort: key, showSortPanel: false });
    this._loadList();
    tracker.track('click', {
      event_params: { element_id: 'wellness_sort_' + key },
      page_path: 'pages/wellness/wellness'
    });
  },

  onWellnessTap(e) {
    const wellness = e.detail.data;
    if (!wellness) return;
    router.goContentDetail(wellness.id, 'wellness');
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search', { domain: 'wellness' });
  },

  onShareAppMessage() {
    return { title: '养生 · 今天就能做的小事', path: '/pages/wellness/wellness' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 养生小习惯' };
  }
});
