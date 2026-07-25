const mock = require('../../utils/mock.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    categories: [],
    currentCategory: 'all',
    list: []
  },

  onLoad() {
    const taxonomy = mock.getStudyTaxonomy();
    this.setData({ categories: taxonomy.tutorialCategories || [] });
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/study/tutorials', target_domain: 'tutorial' });
  },

  _loadList() {
    const list = mock.getTutorials({ category: this.data.currentCategory });
    this.setData({ list });
  },

  onCategoryTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentCategory) return;
    this.setData({ currentCategory: key });
    this._loadList();
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    tracker.track('click', { event_params: { element_id: 'tutorial_' + id }, page_path: 'pages/study/tutorials' });
    router.navigate('/subpackages/detail/study-detail/study-detail', { id, domain: 'tutorial' });
  },

  onShareAppMessage() {
    return { title: '教程 · 工具与工程实践', path: '/pages/study/tutorials' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 教程库' };
  }
});