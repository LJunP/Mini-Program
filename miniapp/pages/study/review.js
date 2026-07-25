const mock = require('../../utils/mock.js');
const studyProgress = require('../../utils/study-progress.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    activeTab: 'review', // review | wrong
    list: [],
    wrongList: [],
    wrongStats: {
      total: 0,
      stillWeak: 0,
      mastered: 0,
      totalWrongCount: 0
    },
    // 翻转卡片状态
    flippedCards: {} // { questionId: true/false }
  },

  onLoad() {
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/study/review', target_domain: 'study_review' });
  },

  onShow() {
    this._loadList();
  },

  _loadList() {
    // 今日复习
    const ids = studyProgress.getDueIds();
    const list = ids.map(id => {
      const question = mock.getInterviewQuestionById(id);
      const progress = studyProgress.getRecord(id);
      if (!question) return null;
      return Object.assign({}, question, {
        progress,
        // 记忆曲线数据
        nextReviewText: this._formatNextReview(progress.nextReviewAt),
        intervalText: this._formatInterval(progress.intervalDays),
        easePercent: Math.round(((progress.easeFactor || 2.5) - 1.3) / (2.5 - 1.3) * 100),
        memoryLevel: this._getMemoryLevel(progress)
      });
    }).filter(Boolean);

    // 错题本
    const wrongIds = studyProgress.getWrongIds();
    const wrongList = wrongIds.map(id => {
      const question = mock.getInterviewQuestionById(id);
      const progress = studyProgress.getRecord(id);
      if (!question) return null;
      return Object.assign({}, question, {
        progress,
        nextReviewText: this._formatNextReview(progress.nextReviewAt),
        intervalText: this._formatInterval(progress.intervalDays),
        easePercent: Math.round(((progress.easeFactor || 2.5) - 1.3) / (2.5 - 1.3) * 100),
        memoryLevel: this._getMemoryLevel(progress)
      });
    }).filter(Boolean);

    const wrongStats = studyProgress.getWrongStats();

    this.setData({ list, wrongList, wrongStats });
  },

  // 格式化下次复习时间
  _formatNextReview(nextReviewAt) {
    if (!nextReviewAt) return '待定';
    const now = Date.now();
    const diff = nextReviewAt - now;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (days > 0) return `${days}天后`;
    if (hours > 0) return `${hours}小时后`;
    if (diff > 0) return '即将复习';
    return '已到期';
  },

  // 格式化间隔天数
  _formatInterval(intervalDays) {
    if (!intervalDays || intervalDays === 0) return '首次';
    if (intervalDays === 1) return '1天';
    if (intervalDays < 7) return `${intervalDays}天`;
    if (intervalDays < 30) return `${Math.round(intervalDays / 7)}周`;
    return `${Math.round(intervalDays / 30)}个月`;
  },

  // 获取记忆等级（0-4）
  _getMemoryLevel(progress) {
    const interval = progress.intervalDays || 0;
    if (interval === 0) return 0; // 未开始
    if (interval < 3) return 1;   // 初步记忆
    if (interval < 7) return 2;   // 短期巩固
    if (interval < 30) return 3;  // 中期巩固
    return 4;                      // 长期记忆
  },

  onTabTap(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
    // 不清空翻转状态，保留各 tab 的翻牌记录
    tracker.track('click', {
      event_params: { element_id: 'review_tab_' + tab },
      page_path: 'pages/study/review'
    });
  },

  // 翻转卡片（查看答案）
  onFlipCard(e) {
    const { id } = e.currentTarget.dataset;
    const flippedCards = { ...this.data.flippedCards };
    flippedCards[id] = !flippedCards[id];
    this.setData({ flippedCards });
    tracker.track('click', {
      event_params: { element_id: 'flip_card_' + id, action: flippedCards[id] ? 'show_answer' : 'hide_answer' },
      page_path: 'pages/study/review'
    });
  },

  onQuestionTap(e) {
    const { id } = e.currentTarget.dataset;
    router.navigate('/subpackages/detail/question-detail/question-detail', { id });
  },

  onQuickMaster(e) {
    const { id } = e.currentTarget.dataset;
    studyProgress.setStatus(id, 'mastered');
    studyProgress.removeFromWrongBook(id);
    wx.showToast({ title: '标记掌握，已移出错题本', icon: 'success' });
    this._loadList();
    tracker.track('click', { event_params: { element_id: 'quick_master_' + id }, page_path: 'pages/study/review' });
  },

  onQuickWrong(e) {
    const { id } = e.currentTarget.dataset;
    studyProgress.markWrong(id);
    wx.showToast({ title: '已加入错题集，重新计时', icon: 'none' });
    this._loadList();
    tracker.track('click', { event_params: { element_id: 'quick_wrong_' + id }, page_path: 'pages/study/review' });
  },

  // 从错题本移除
  onRemoveFromWrong(e) {
    const { id } = e.currentTarget.dataset;
    studyProgress.removeFromWrongBook(id);
    wx.showToast({ title: '已移出错题本', icon: 'none' });
    this._loadList();
    tracker.track('click', { event_params: { element_id: 'remove_wrong_' + id }, page_path: 'pages/study/review' });
  }
});
