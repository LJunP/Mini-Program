// pages/incense/incense.js
// 香道：分类 tab（含数量）+ 排序 + 内容列表
const incenseService = require('../../services/incense.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    categories: [{ key: 'all', name: '全部', count: 0 }],
    currentCategory: 'all',
    list: [],
    loading: false,
    // 排序
    sort: 'default',
    sortOptions: [
      { key: 'default', name: '默认' },
      { key: 'price', name: '价格高低' },
      { key: 'newest', name: '最新' }
    ],
    showSortPanel: false
  },

  onLoad() {
    this._loadCategories();
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/incense/incense', target_domain: 'incense' });
  },

  onShow() {
    // 从详情页返回时刷新列表以更新可能变化的字段
    if (this.data.list.length && !this.data.loading) {
      this._loadList();
    }
  },

  onPullDownRefresh() {
    Promise.all([this._loadCategories(), this._loadList()]).then(() => {
      wx.stopPullDownRefresh();
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  _loadCategories() {
    return incenseService.getIncenseCategories().then(res => {
      const cats = [{ key: 'all', name: '全部', count: 0 }].concat(res.data || []);
      cats[0].count = cats.slice(1).reduce((sum, c) => sum + c.count, 0);
      this.setData({ categories: cats });
    });
  },

  _loadList() {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    return incenseService.getIncenseList({ category: this.data.currentCategory }).then(res => {
      let list = res.data.list || [];
      // 客户端排序
      if (this.data.sort === 'price') {
        const priceOrder = { '平价': 1, '中端': 2, '高端': 3, '顶级': 4 };
        list = list.slice().sort((a, b) => (priceOrder[a.price] || 0) - (priceOrder[b.price] || 0));
      } else if (this.data.sort === 'newest') {
        list = list.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      }
      this.setData({ list, loading: false });
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
      event_params: { element_id: 'incense_category_' + key },
      page_path: 'pages/incense/incense'
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
      event_params: { element_id: 'incense_sort_' + key },
      page_path: 'pages/incense/incense'
    });
  },

  onIncenseTap(e) {
    const incense = e.detail.data;
    if (!incense) return;
    router.goContentDetail(incense.id, 'incense');
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search', { domain: 'incense' });
  },

  onShareAppMessage() {
    return { title: '焚香 · 一缕青烟万般心事', path: '/pages/incense/incense' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 焚香静心' };
  }
});
