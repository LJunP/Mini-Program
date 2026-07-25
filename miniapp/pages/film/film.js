// pages/film/film.js
// 电影：分类 tab（含数量）+ 排序 + 内容列表 + 看过/想看状态 + 用户评分
const filmService = require('../../services/film.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const interaction = require('../../utils/content-interaction.js');

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
      { key: 'rating', name: '评分最高' },
      { key: 'year', name: '年份最新' }
    ],
    showSortPanel: false,
    // 评分弹窗
    showRatingPanel: false,
    ratingFilmId: '',
    ratingFilmTitle: '',
    ratingFilmCover: '',
    tempRating: 0
  },

  onLoad() {
    this._loadCategories();
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/film/film', target_domain: 'film' });
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
    return filmService.getFilmCategories().then(res => {
      const cats = [{ key: 'all', name: '全部', count: 0 }].concat(res.data || []);
      cats[0].count = cats.slice(1).reduce((sum, c) => sum + c.count, 0);
      this.setData({ categories: cats });
    });
  },

  _loadList() {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    return filmService.getFilmList({ category: this.data.currentCategory }).then(res => {
      let list = interaction.enrichFilmList(res.data.list || []);
      // 客户端排序
      if (this.data.sort === 'rating') {
        list = list.slice().sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      } else if (this.data.sort === 'year') {
        list = list.slice().sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
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
      event_params: { element_id: 'film_category_' + key },
      page_path: 'pages/film/film'
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
      event_params: { element_id: 'film_sort_' + key },
      page_path: 'pages/film/film'
    });
  },

  onFilmTap(e) {
    const film = e.detail.data;
    if (!film) return;
    router.goContentDetail(film.id, 'film');
  },

  // 设置看过/想看
  onSetStatus(e) {
    const { id, status } = e.currentTarget.dataset;
    const list = this.data.list.map(item => {
      if (item.id === id) {
        const currentStatus = item.watchStatus === status ? '' : status;
        interaction.setFilmStatus(id, currentStatus || null);
        return { ...item, watchStatus: currentStatus };
      }
      return item;
    });
    this.setData({ list });
    const statusText = status === 'watched' ? '已看过' : '想看';
    const action = list.find(i => i.id === id)?.watchStatus ? statusText : '已取消';
    wx.showToast({ title: action, icon: 'none' });
    tracker.track('film_status', { event_params: { film_id: id, status } });
  },

  // 打开评分面板
  onOpenRating(e) {
    const { id, title } = e.currentTarget.dataset;
    const film = this.data.list.find(item => item.id === id);
    const filmStatus = interaction.getFilmStatus(id);
    this.setData({
      showRatingPanel: true,
      ratingFilmId: id,
      ratingFilmTitle: title,
      ratingFilmCover: film ? (film.coverImage || '') : '',
      tempRating: filmStatus ? (filmStatus.rating || 0) : 0
    });
  },

  // 选择评分
  onStarTap(e) {
    const { star } = e.currentTarget.dataset;
    this.setData({ tempRating: parseInt(star, 10) });
  },

  // 确认评分
  onConfirmRating() {
    const { ratingFilmId, tempRating } = this.data;
    if (tempRating === 0) {
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }
    interaction.setFilmRating(ratingFilmId, tempRating);
    const list = this.data.list.map(item => {
      if (item.id === ratingFilmId) {
        return { ...item, userRating: tempRating, watchStatus: item.watchStatus || 'watched' };
      }
      return item;
    });
    this.setData({ list, showRatingPanel: false, tempRating: 0 });
    wx.showToast({ title: '评分已保存', icon: 'success' });
    tracker.track('film_rating', { event_params: { film_id: ratingFilmId, rating: tempRating } });
  },

  // 关闭评分面板
  onCloseRating() {
    this.setData({ showRatingPanel: false, tempRating: 0 });
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search', { domain: 'film' });
  },

  onShareAppMessage() {
    return { title: '看戏 · 光影之间观照内心', path: '/pages/film/film' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 看戏观心' };
  }
});
