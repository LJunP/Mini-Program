// pages/contribute/list.js
// 投稿列表/管理页（升级版：社区 Feed + 搜索）
const ugc = require('../../utils/ugc.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    // 顶部 Tab：我的 / 社区
    activeTab: 'my', // my / community
    posts: [],
    filteredPosts: [],
    activeDomain: 'all',
    domainOptions: [{ key: 'all', name: '全部', label: '全部' }, ...ugc.DOMAIN_OPTIONS],
    stats: { total: 0, byDomain: {} },
    isEmpty: true,
    // 搜索
    searchKeyword: '',
    showSearch: false
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/contribute/list' });
  },

  onShow() {
    this._loadPosts();
  },

  _loadPosts() {
    if (this.data.activeTab === 'my') {
      const posts = ugc.getAllPosts();
      const stats = ugc.getStats();
      const formattedPosts = posts.map(p => this._formatPost(p));
      this.setData({
        posts: formattedPosts,
        stats,
        isEmpty: formattedPosts.length === 0
      });
    } else {
      // 社区 Feed
      const posts = ugc.getCommunityFeed();
      const formattedPosts = posts.map(p => this._formatPost(p));
      this.setData({
        posts: formattedPosts,
        isEmpty: formattedPosts.length === 0
      });
    }
    this._applyFilter();
  },

  _formatPost(p) {
    return {
      ...p,
      dateText: ugc.formatDate(p.createdAt),
      contentPreview: (p.content || '').substring(0, 80) + ((p.content || '').length > 80 ? '…' : ''),
      starsText: '★'.repeat(p.rating || 0) + '☆'.repeat(5 - (p.rating || 0)),
      isMock: p.authorId && p.authorId.indexOf('mock') >= 0
    };
  },

  _applyFilter() {
    const { activeDomain, posts, searchKeyword } = this.data;
    let filtered = activeDomain === 'all' ? posts : posts.filter(p => p.domain === activeDomain);
    // 搜索过滤
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(p =>
        (p.title || '').toLowerCase().indexOf(kw) >= 0 ||
        (p.content || '').toLowerCase().indexOf(kw) >= 0 ||
        (p.tags || []).some(t => t.toLowerCase().indexOf(kw) >= 0)
      );
    }
    this.setData({ filteredPosts: filtered });
  },

  onTabTap(e) {
    const { tab } = e.currentTarget.dataset;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab, activeDomain: 'all', searchKeyword: '', showSearch: false });
    this._loadPosts();
  },

  onFilterTap(e) {
    const { domain } = e.currentTarget.dataset;
    this.setData({ activeDomain: domain });
    this._applyFilter();
  },

  // 搜索
  onSearchTap() {
    this.setData({ showSearch: !this.data.showSearch });
    if (!this.data.showSearch) {
      this.setData({ searchKeyword: '' });
      this._applyFilter();
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this._applyFilter();
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' });
    this._applyFilter();
  },

  onPostTap(e) {
    const { id } = e.currentTarget.dataset;
    const post = this.data.filteredPosts.find(p => p.id === id);
    if (post && post.isMock) {
      // 模拟投稿只读不可编辑
      wx.showModal({
        title: post.title,
        content: post.content,
        showCancel: false,
        confirmText: '关闭'
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/contribute/contribute?id=${id}`
    });
  },

  onEditPost(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/contribute/contribute?id=${id}`
    });
  },

  onDeletePost(e) {
    const { id, index } = e.currentTarget.dataset;
    const post = this.data.filteredPosts[index];
    wx.showModal({
      title: '删除投稿',
      content: `确定要删除「${post.title}」吗？此操作不可撤销。`,
      confirmText: '删除',
      confirmColor: '#A0522D',
      success: (res) => {
        if (res.confirm) {
          ugc.deletePost(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this._loadPosts();
        }
      }
    });
  },

  onCreatePost() {
    wx.navigateTo({
      url: '/pages/contribute/contribute' + (this.data.activeDomain !== 'all' ? '?domain=' + this.data.activeDomain : '')
    });
  },

  onShareAppMessage() {
    return { title: '妙不可园 · 风雅社区', path: '/pages/profile/profile' };
  }
});
