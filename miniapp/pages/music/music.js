// pages/music/music.js
// 音乐：分类 tab（含数量）+ 排序 + 内容列表
const musicService = require('../../services/music.js');
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
      { key: 'rating', name: '评分最高' },
      { key: 'newest', name: '最新' }
    ],
    showSortPanel: false
  },

  onLoad() {
    this._loadCategories();
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/music/music', target_domain: 'music' });
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
    return musicService.getMusicCategories().then(res => {
      const cats = [{ key: 'all', name: '全部', count: 0 }].concat(res.data || []);
      cats[0].count = cats.slice(1).reduce((sum, c) => sum + c.count, 0);
      this.setData({ categories: cats });
    });
  },

  _loadList() {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    return musicService.getMusicList({ category: this.data.currentCategory, sort: this.data.sort }).then(res => {
      let list = res.data.list || [];
      // 客户端排序
      if (this.data.sort === 'rating') {
        list = list.slice().sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
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
      event_params: { element_id: 'music_category_' + key },
      page_path: 'pages/music/music'
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
      event_params: { element_id: 'music_sort_' + key },
      page_path: 'pages/music/music'
    });
  },

  onMusicTap(e) {
    const music = e.detail.data;
    if (!music) return;
    // 存储当前列表作为播放列表，供详情页 audio-player 使用
    const app = getApp();
    const playlist = this.data.list
      .filter(item => item.audioSrc)
      .map(item => ({
        id: item.id,
        title: item.title,
        audioSrc: item.audioSrc
      }));
    const currentIndex = playlist.findIndex(item => item.id === music.id);
    app.globalData.musicPlaylist = playlist;
    app.globalData.musicPlaylistIndex = currentIndex >= 0 ? currentIndex : 0;
    router.goContentDetail(music.id, 'music');
  },

  goSearch() {
    router.navigate('/subpackages/search/pages/search/search', { domain: 'music' });
  },

  onShareAppMessage() {
    return { title: '听曲 · 丝竹之音可以怡情', path: '/pages/music/music' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 听曲怡情' };
  }
});
