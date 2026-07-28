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
    communityLoading: false,
    deletingId: '',
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
      this._applyFilter();
    } else {
      // 社区 Feed：从云端拉取所有用户的公开投稿
      this._loadCloudCommunityFeed();
    }
  },

  _loadCloudCommunityFeed() {
    const requestId = (this._communityRequestId || 0) + 1;
    this._communityRequestId = requestId;
    this.setData({ communityLoading: true });

    // 先用本地公开投稿做即时回显
    const localPosts = ugc.getCommunityFeedLocal();
    const localFormatted = localPosts.map(p => this._formatPost(p));
    this.setData({
      posts: localFormatted,
      stats: this._statsForPosts(localFormatted),
      isEmpty: localFormatted.length === 0
    });
    this._applyFilter();

    // 再从云端拉取所有用户的公开投稿
    ugc.getCloudCommunityFeed('all').then(cloudPosts => {
      if (
        requestId !== this._communityRequestId ||
        this.data.activeTab !== 'community'
      ) return;
      const formattedPosts = cloudPosts.map(p => this._formatPost(p));
      this.setData({
        posts: formattedPosts,
        stats: this._statsForPosts(formattedPosts),
        isEmpty: formattedPosts.length === 0,
        communityLoading: false
      });
      this._applyFilter();
    }).catch(err => {
      console.warn('[ugc] community feed failed:', {
        code: err && (err.code || err.errCode || ''),
        serverBuild: err && err.serverBuild || ''
      });
      if (
        requestId === this._communityRequestId &&
        this.data.activeTab === 'community'
      ) {
        // 保留已展示的本地公开稿，不用失败的空数组覆盖。
        this.setData({ communityLoading: false });
      }
    });
  },

  _formatPost(p) {
    const numericRating = Number(p && p.rating);
    const rating = Number.isFinite(numericRating)
      ? Math.max(0, Math.min(5, Math.round(numericRating)))
      : 0;
    const statusTextMap = {
      pending: '审核中',
      approved: '已公开',
      rejected: '未通过',
      deleting: '删除处理中',
      private: '私密'
    };
    return {
      ...p,
      rating,
      tags: Array.isArray(p.tags) ? p.tags.filter(tag => typeof tag === 'string') : [],
      images: Array.isArray(p.images) ? p.images : [],
      statusText: statusTextMap[p.status] || '',
      dateText: ugc.formatDate(p.createdAt),
      contentPreview: (p.content || '').substring(0, 80) + ((p.content || '').length > 80 ? '…' : ''),
      starsText: '★'.repeat(rating) + '☆'.repeat(5 - rating),
      isMock: p.authorId && p.authorId.indexOf('mock') >= 0,
      isCloud: !!p.cloudId
    };
  },

  _statsForPosts(posts) {
    const byDomain = {};
    ugc.DOMAIN_OPTIONS.forEach(option => {
      byDomain[option.key] = posts.filter(post => post.domain === option.key).length;
    });
    return { total: posts.length, byDomain };
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
    this.setData({
      filteredPosts: filtered,
      isEmpty: filtered.length === 0
    });
  },

  onTabTap(e) {
    const { tab } = e.currentTarget.dataset;
    if (tab === this.data.activeTab) return;
    this._communityRequestId = (this._communityRequestId || 0) + 1;
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
    // 社区是只读浏览面；自己的编辑/删除也统一从“我的投稿”进入，
    // 避免云端拉取失败时用不存在的本地副本打开空白编辑页。
    if (post && this.data.activeTab === 'community') {
      wx.showModal({
        title: post.title || '投稿详情',
        content: post.content || '',
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
    if (this.data.activeTab !== 'my') return;
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/contribute/contribute?id=${id}`
    });
  },

  onDeletePost(e) {
    if (this.data.activeTab !== 'my') return;
    const { id, index } = e.currentTarget.dataset;
    const post = this.data.filteredPosts[index];
    if (!post || this.data.deletingId) return;
    wx.showModal({
      title: '删除投稿',
      content: `确定要删除「${post.title}」吗？此操作不可撤销。`,
      confirmText: '删除',
      confirmColor: '#A0522D',
      success: (res) => {
        if (res.confirm) {
          this.setData({ deletingId: id });
          ugc.deletePostConfirmed(id).then(result => {
            if (!result.removed) throw new Error('未找到要删除的投稿');
            wx.showToast({
              title: result.fileCleanupPending ? '投稿已删，图片待清理' : '已删除',
              icon: result.fileCleanupPending ? 'none' : 'success'
            });
            this._loadPosts();
          }).catch(err => {
            console.error('[ugc] delete confirmation failed:', {
              code: err && (err.code || err.errCode || ''),
              serverBuild: err && err.serverBuild || ''
            });
            if (err && err.deletePending) this._loadPosts();
            wx.showModal({
              title: err && err.deletePending ? '内容已停止公开' : '删除未完成',
              content: err && err.deletePending
                ? (err.manualCleanupRequired
                  ? '投稿已从社区隐藏，但旧版图片需要运营方人工清理；请勿重复发布该内容。'
                  : '投稿已从社区隐藏，图片或数据库清理尚未完成，请稍后重试删除。')
                : '云端没有确认删除，本地内容仍保留。请检查网络后重试。',
              showCancel: false,
              confirmText: '知道了'
            });
          }).then(() => {
            this.setData({ deletingId: '' });
          });
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
