const mock = require('../../utils/mock.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const dailyQuestion = require('../../utils/daily-question.js');

Page({
  data: {
    modules: [],
    stats: [
      { label: '待学习', value: 0 },
      { label: '已掌握', value: 0 },
      { label: '薄弱点', value: 0 },
      { label: '错题本', value: 0 }
    ],
    featured: {},
    review: null,
    // 每日一题
    dailyQuestion: null,
    dailyStreak: 0,
    tomorrowQuestion: null,
    // 推荐学习路径
    techStacks: [
      { name: 'MySQL 数据库', desc: '事务、MVCC、锁与慢查询调优', char: '库', bgColor: '#3B6D11', topic: 'database', keyword: 'mysql' },
      { name: 'Redis 缓存', desc: '穿透雪崩、双写一致性与分布式锁', char: '缓', bgColor: '#A0522D', topic: 'cache', keyword: 'redis' },
      { name: 'JavaScript 核心', desc: '事件循环、作用域提升与箭头函数', char: '语', bgColor: '#854F0B', topic: 'javascript', keyword: '' },
      { name: '网络协议与安全', desc: 'TCP/TLS握手、HTTP/HTTPS加密', char: '网', bgColor: '#4A6B7C', topic: 'network', keyword: '' },
      { name: '系统并发与设计', desc: '进程线程、协程与分布式限流器', char: '系', bgColor: '#2C2C2A', topic: 'system_design', keyword: '' }
    ]
  },

  onLoad() {
    this._loadHome();
    tracker.track('page_view', { page_path: 'pages/study/index', target_domain: 'study' });
  },

  onShow() {
    this._loadHome();
  },

  _loadHome() {
    const home = mock.getStudyHome();
    const dq = dailyQuestion.getDailyQuestion();
    const tomorrow = dailyQuestion.getTomorrowQuestion();
    const dqStats = dailyQuestion.getStats();
    this.setData({
      modules: home.modules,
      stats: [
        { label: '待学习', value: home.stats.pendingCount },
        { label: '已掌握', value: home.stats.masteredCount },
        { label: '薄弱点', value: home.stats.weakCount },
        { label: '错题本', value: home.stats.wrongBookCount }
      ],
      featured: home.featured,
      review: home.review,
      dailyQuestion: dq,
      dailyStreak: dqStats.streak,
      tomorrowQuestion: tomorrow
    });
  },

  onDailyQuestionTap(e) {
    const { id } = e.currentTarget.dataset;
    // 标记已查看
    dailyQuestion.markViewed();
    tracker.track('click', { event_params: { element_id: 'daily_question' }, page_path: 'pages/study/index' });
    router.navigate('/subpackages/detail/question-detail/question-detail', { id });
  },

  onModuleTap(e) {
    const { key } = e.currentTarget.dataset;
    const routeMap = {
      tutorial: '/pages/study/tutorials',
      knowledge: '/pages/study/knowledge',
      interview: '/pages/study/interview'
    };
    tracker.track('click', { event_params: { element_id: 'study_home_' + key }, page_path: 'pages/study/index' });
    if (routeMap[key]) router.navigate(routeMap[key]);
  },

  onReviewTap() {
    tracker.track('click', { event_params: { element_id: 'study_home_review' }, page_path: 'pages/study/index' });
    router.navigate('/pages/study/review');
  },

  onTechStackTap(e) {
    const { keyword, topic } = e.currentTarget.dataset;
    tracker.track('click', { event_params: { element_id: 'tech_stack_' + topic }, page_path: 'pages/study/index' });
    router.navigate(`/pages/study/interview?topic=${topic}&keyword=${encodeURIComponent(keyword || '')}`);
  },

  onShareAppMessage() {
    return { title: '学习模式 · 把长期积累变成系统', path: '/pages/study/index' };
  },

  onShareTimeline() {
    return { title: '学习模式 · 把长期积累变成系统' };
  }
});