// subpackages/detail/compare/compare.js
// 茶品对比页：左右并排展示两款茶品的雷达图 + 核心参数
const teaService = require('../../../services/tea.js');
const router = require('../../../utils/router.js');

const CATEGORY_NAMES = {
  green: '绿茶', white: '白茶', yellow: '黄茶',
  oolong: '青茶', black: '红茶', dark: '黑茶'
};

Page({
  data: {
    teaA: null,
    teaB: null,
    // 对比维度
    dimensions: [
      { key: 'aroma',     label: '香气' },
      { key: 'body',      label: '滋味' },
      { key: 'sweetness', label: '回甘' },
      { key: 'liquor',    label: '汤色' },
      { key: 'endurance', label: '耐泡' }
    ]
  },

  onLoad(query) {
    const { a, b } = query;
    if (a) this._loadTea('teaA', a);
    if (b) this._loadTea('teaB', b);
  },

  _loadTea(field, id) {
    teaService.getTeaDetail(id).then(res => {
      const tea = res.data;
      if (!tea) return;
      const tasteProfile = tea.tasteProfile || {};
      const totalScore = Object.values(tasteProfile).reduce((s, v) => s + v, 0);
      this.setData({
        [field]: Object.assign({}, tea, {
          categoryName: CATEGORY_NAMES[tea.category] || tea.category,
          tasteProfile,
          totalScore: Math.round(totalScore * 10) / 10
        })
      });
    });
  },

  onTeaATap() {
    if (this.data.teaA) router.goTeaDetail(this.data.teaA.id);
  },

  onTeaBTap() {
    if (this.data.teaB) router.goTeaDetail(this.data.teaB.id);
  },

  onShareAppMessage() {
    const { teaA, teaB } = this.data;
    const title = (teaA ? teaA.name : '茶') + ' vs ' + (teaB ? teaB.name : '茶');
    return {
      title,
      path: `/subpackages/detail/compare/compare?a=${teaA ? teaA.id : ''}&b=${teaB ? teaB.id : ''}`
    };
  },

  onShareTimeline() {
    const { teaA, teaB } = this.data;
    return { title: (teaA ? teaA.name : '茶') + ' vs ' + (teaB ? teaB.name : '茶') };
  }
});
