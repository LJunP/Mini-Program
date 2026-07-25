const mock = require('../../utils/mock.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const studyProgress = require('../../utils/study-progress.js');

function toQuestionCard(question, progressMap) {
  const progress = progressMap[question.id] || {};
  const status = progress.status || '';
  return {
    id: question.id,
    type: question.type,
    track: question.track,
    difficulty: question.difficulty,
    frequency: question.frequency,
    title: question.title,
    question: question.question,
    keyPoints: question.keyPoints || [],
    studyStatus: status,
    studyStatusText: status === 'mastered'
      ? '已掌握'
      : status === 'weak'
        ? '薄弱'
        : status === 'learning'
          ? '学习中'
          : ''
  };
}

Page({
  data: {
    types: [],
    tracks: [],
    topics: [],
    currentType: 'all',
    currentTrack: 'all',
    currentTopic: 'all',
    keyword: '',
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
    this._hasLoaded = true;
    tracker.track('page_view', { page_path: 'pages/study/interview', target_domain: 'interview' });
  },

  _loadList() {
    const allList = mock.getInterviewQuestions({
      type: this.data.currentType,
      track: this.data.currentTrack,
      topic: this.data.currentTopic,
      keyword: this.data.keyword
    });
    const progressMap = studyProgress.readMap();
    this._allList = allList;
    this.setData({
      // 只向渲染层传卡片需要的字段；完整答案留在逻辑层，避免 901 题
      // 形成约 1.8 MB 的 setData。
      list: allList
        .slice(0, this.data.pageSize)
        .map(question => toQuestionCard(question, progressMap)),
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
    const allList = this._allList || [];
    const progressMap = studyProgress.readMap();
    const newItems = allList
      .slice(start, end)
      .map(question => toQuestionCard(question, progressMap));
    this.setData({
      list: this.data.list.concat(newItems),
      currentPage: nextPage,
      hasMore: end < allList.length,
      loadingMore: false
    });
  },

  onShow() {
    if (this._hasLoaded && this._needsProgressRefresh) {
      this._needsProgressRefresh = false;
      this._loadList();
    }
  },

  onHide() {
    // 从题目详情返回时刷新当前可见卡片的学习状态。
    this._needsProgressRefresh = true;
  },

  onUnload() {
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    }
    this._allList = [];
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
