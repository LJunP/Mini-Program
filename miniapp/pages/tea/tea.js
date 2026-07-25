// pages/tea/tea.js
// 茶库：六大茶类横向 tab + 茶品列表
const teaService = require('../../services/tea.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    categories: [],
    currentCategory: 'all',
    list: [],
    // 加载更多
    loading: false,
    hasMore: false,
    page: 1,
    // 对比模式
    compareMode: false,
    compareList: [], // 最多2个
    // 排序与筛选
    sort: 'default',
    sortOptions: [
      { key: 'default', name: '默认' },
      { key: 'rating',  name: '评分最高' },
      { key: 'hot',     name: '收藏最多' }
    ],
    showSortPanel: false,
    // 搜索
    searchKeyword: '',
    searchResults: [],
    showSearch: false,
    showBackTop: false
  },

  onLoad() {
    this._loadCategories();
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/tea/tea', target_domain: 'tea' });
  },

  onShow() {
    // 从详情页返回时刷新收藏状态（仅在数据已加载时轻量刷新）
    if (this.data.list.length && !this.data.loading) {
      // 刷新列表以更新收藏数等可能变化的字段
      this._loadList();
    }
  },

  onPullDownRefresh() {
    this._loadList(true).then(() => {
      wx.stopPullDownRefresh();
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this._loadMore();
    }
  },

  onPageScroll(e) {
    const show = e.scrollTop > 600;
    if (show !== this.data.showBackTop) {
      this.setData({ showBackTop: show });
    }
  },

  onBackToTop() {
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  _loadCategories() {
    // 在六大茶类前加一个"全部"
    teaService.getCategories().then(res => {
      const cats = [{ key: 'all', name: '全部', count: 0 }].concat(res.data.categories || []);
      // 计算全部数量
      cats[0].count = cats.slice(1).reduce((sum, c) => sum + c.count, 0);
      this.setData({ categories: cats });
    });
  },

  _loadList(isRefresh) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true, page: 1 });
    return teaService.getTeaList({
      category: this.data.currentCategory,
      sort: this.data.sort,
      page: 1
    }).then(res => {
      this.setData({
        list: res.data.list,
        hasMore: res.data.hasMore || false,
        loading: false
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  _loadMore() {
    const nextPage = this.data.page + 1;
    this.setData({ loading: true });
    teaService.getTeaList({
      category: this.data.currentCategory,
      sort: this.data.sort,
      page: nextPage
    }).then(res => {
      const newItems = res.data.list || [];
      const currentLen = this.data.list.length;
      // 使用路径更新追加新项，避免 concat 创建新数组
      const pathUpdate = {};
      newItems.forEach((item, i) => {
        pathUpdate[`list[${currentLen + i}]`] = item;
      });
      pathUpdate.hasMore = res.data.hasMore || false;
      pathUpdate.page = nextPage;
      pathUpdate.loading = false;
      this.setData(pathUpdate);
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  onCategoryTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentCategory) return;
    this.setData({ currentCategory: key, list: [], hasMore: false, page: 1 });
    this._loadList();
    tracker.track('click', {
      event_params: { element_id: 'tea_category_' + key },
      page_path: 'pages/tea/tea'
    });
  },

  onTeaTap(e) {
    const tea = e.currentTarget.dataset.tea || e.detail.tea;
    if (!tea) return;
    if (this.data.compareMode) {
      this._toggleCompare(tea);
    } else {
      router.goTeaDetail(tea.id);
    }
  },

  // 长按进入对比模式
  onTeaLongPress(e) {
    const tea = e.currentTarget.dataset.tea || e.detail.tea;
    if (!tea) return;
    if (!this.data.compareMode) {
      this.setData({ compareMode: true, compareList: [tea] });
      wx.showToast({ title: '已选择第 1 款，再选 1 款开始对比', icon: 'none' });
    } else {
      this._toggleCompare(tea);
    }
  },

  // 点击对比按钮切换对比模式
  onToggleCompareMode() {
    if (this.data.compareMode) {
      this.exitCompare();
    } else {
      this.setData({ compareMode: true, compareList: [] });
      wx.showToast({ title: '对比模式已开启，点击两款茶品对比', icon: 'none' });
    }
  },

  _toggleCompare(tea) {
    const list = this.data.compareList.slice();
    const idx = list.findIndex(t => t.id === tea.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      if (list.length === 0) {
        this.setData({ compareMode: false, compareList: [] });
        return;
      }
    } else if (list.length < 2) {
      list.push(tea);
    } else {
      wx.showToast({ title: '最多选 2 款茶品对比', icon: 'none' });
      return;
    }
    this.setData({ compareList: list });
  },

  // 点击「开始对比」按钮
  onStartCompare() {
    if (this.data.compareList.length !== 2) {
      wx.showToast({ title: '请先选择 2 款茶品', icon: 'none' });
      return;
    }
    router.goCompare(this.data.compareList[0].id, this.data.compareList[1].id);
    this.setData({ compareMode: false, compareList: [] });
  },

  // 退出对比模式
  exitCompare() {
    this.setData({ compareMode: false, compareList: [] });
  },

  // ====== 排序 ======
  toggleSortPanel() {
    this.setData({ showSortPanel: !this.data.showSortPanel });
  },

  onSortTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.sort) return;
    this.setData({ sort: key, showSortPanel: false, list: [], hasMore: false, page: 1 });
    this._loadList();
    tracker.track('click', {
      event_params: { element_id: 'tea_sort_' + key },
      page_path: 'pages/tea/tea'
    });
  },

  // ====== 内嵌搜索 ======
  onSearchFocus() {
    this.setData({ showSearch: true });
  },

  onSearchInput(e) {
    const keyword = (e.detail.value || '').trim();
    this.setData({ searchKeyword: keyword });
    if (!keyword) {
      this.setData({ searchResults: [] });
      return;
    }
    // 防抖：300ms 内停止输入才执行搜索，减少 setData 跨桥调用
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      teaService.searchTeas(keyword, 10).then(res => {
        this.setData({ searchResults: res.data || [] });
      });
    }, 300);
  },

  onSearchCancel() {
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    }
    this.setData({ showSearch: false, searchKeyword: '', searchResults: [] });
  },

  onSearchResultTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ showSearch: false, searchKeyword: '', searchResults: [] });
    router.goTeaDetail(id);
  },

  onShareAppMessage() {
    return { title: '茶库 · 六大茶类品味', path: '/pages/tea/tea' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 六大茶类品味' };
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search');
  }
});
