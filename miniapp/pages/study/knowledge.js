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
    this.setData({ categories: taxonomy.knowledgeCategories || [] });
    this._loadList();
    tracker.track('page_view', { page_path: 'pages/study/knowledge', target_domain: 'knowledge' });
  },

  _loadList() {
    const list = mock.getKnowledgeList({ category: this.data.currentCategory });
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
    tracker.track('click', { event_params: { element_id: 'knowledge_' + id }, page_path: 'pages/study/knowledge' });
    router.navigate('/subpackages/detail/study-detail/study-detail', { id, domain: 'knowledge' });
  },

  onShareAppMessage() {
    return { title: '知识科普 · 人物、公司与领域地图', path: '/pages/study/knowledge' };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 知识科普' };
  }
});