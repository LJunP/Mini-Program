const mock = require('../../utils/mock.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const studyProgress = require('../../utils/study-progress.js');

Page({
  data: {
    types: [],
    tracks: [],
    topics: [],
    currentType: 'all',
    currentTrack: 'all',
    currentTopic: 'all',
    keyword: '',
    allList: [],
    list: [],
    pageSize: 20,
    currentPage: 1,
    hasMore: true,
    loadingMore: false,
    showBackTop: false
  },

  onLoad(options) {
    const taxonomy = mock.getStudyTaxonomy();
    const topics = [{ key: 'all', name: '全部' }, ...(taxonomy.interviewTopics || [])];
    
    this.setData({
      types: taxonomy.interviewTypes || [],
      tracks: taxonomy.interviewTracks || [],
      topics
    });

    if (options && options.topic) {
      this.setData({ currentTopic: options.topic });
    }
    if (options && options.keyword) {
      this.setData({ keyword: decodeURIComponent(options.keyword) });
    }

    this._loadList();
    tracker.track('page_view', { page_path: 'pages/study/interview', target_domain: 'interview' });
  },

  _loadList() {
    const allList = mock.getInterviewQuestions({
      type: this.data.currentType,
      track: this.data.currentTrack,
      topic: this.data.currentTopic,
      keyword: this.data.keyword
    }).map(q => {
      const progress = studyProgress.getRecord(q.id);
      return Object.assign({}, q, {
        studyStatus: progress.status || '',
        studyStatusText: progress.status === 'mastered' ? '已掌握' : progress.status === 'weak' ? '薄弱' : progress.status === 'learning' ? '学习中' : ''
      });
    });
    this.setData({
      allList,
      list: allList.slice(0, this.data.pageSize),
      currentPage: 1,
      hasMore: allList.length > this.data.pageSize
    });
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    const nextPage = this.data.currentPage + 1;
    const start = this.data.currentPage * this.data.pageSize;
    const end = start + this.data.pageSize;
    const newItems = this.data.allList.slice(start, end);
    this.setData({
      list: this.data.list.concat(newItems),
      currentPage: nextPage,
      hasMore: end < this.data.allList.length,
      loadingMore: false
    });
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

  onTypeTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentType) return;
    this.setData({ currentType: key });
    this._loadList();
  },

  onTrackTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentTrack) return;
    this.setData({ currentTrack: key });
    this._loadList();
  },

  onTopicTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentTopic) return;
    this.setData({ currentTopic: key });
    this._loadList();
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this._loadList();
    }, 300);
  },

  onClearSearch() {
    this.setData({ keyword: '' });
    this._loadList();
  },

  onSearchConfirm() {
    this._loadList();
  },

  onQuestionTap(e) {
    const { id } = e.currentTarget.dataset;
    tracker.track('click', { event_params: { element_id: 'interview_' + id }, page_path: 'pages/study/interview' });
    router.navigate('/subpackages/detail/question-detail/question-detail', { id });
  },

  onResetFilters() {
    this.setData({
      currentType: 'all',
      currentTrack: 'all',
      currentTopic: 'all',
      keyword: ''
    });
    this._loadList();
    wx.showToast({ title: '已重置所有筛选条件', icon: 'none' });
  },

  onShareAppMessage() {
    return { title: '面试学习 · 八股文与场景题', path: '/pages/study/interview' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 面试题库' };
  },

  // 探索妙不可园
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});