const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

/**
 * 茶品列表（支持按茶类筛选）
 * @param {Object} params { category, sort, page, pageSize }
 */
function getTeaList(params = {}) {
  return request({
    url: '/teas',
    method: 'GET',
    data: params,
    mockHandler: () => {
      let list = mock.getTeasByCategory(params.category);
      // 简单排序
      if (params.sort === 'hot') {
        list = list.slice().sort((a, b) => (b.collectCount || 0) - (a.collectCount || 0));
      } else if (params.sort === 'rating') {
        list = list.slice().sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      }
      // 简单分页
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const start = (page - 1) * pageSize;
      const sliced = list.slice(start, start + pageSize);
      return {
        list: sliced,
        total: list.length,
        page,
        pageSize,
        hasMore: start + pageSize < list.length
      };
    }
  });
}

/**
 * 茶品详情
 */
function getTeaDetail(itemNo) {
  return request({
    url: '/teas/' + itemNo,
    method: 'GET',
    mockHandler: () => {
      const tea = mock.getTeaById(itemNo);
      if (!tea) return null;

      // 反向关联：查哪些行旅内容关联了这款茶
      const relatedTravel = mock.findReverseLinks('tea', itemNo, 'travel').map(item => ({
        contentNo: item.refId,
        title: item.name,
        coverImage: item.coverImage,
        summary: item.summary,
        linkContext: item.context
      }));

      // 反向关联：查哪些养生内容关联了这款茶
      const relatedWellness = mock.findReverseLinks('tea', itemNo, 'wellness').map(item => ({
        contentNo: item.refId,
        title: item.name,
        linkContext: item.context
      }));

      // 直接透传原始数据（camelCase），附加关联内容
      return Object.assign({}, tea, {
        relatedTravel: relatedTravel,
        relatedWellness: relatedWellness,
        isCollected: false
      });
    }
  });
}

/**
 * 六大茶类聚合
 */
function getCategories() {
  return request({
    url: '/teas/categories',
    method: 'GET',
    mockHandler: () => ({ categories: mock.getTeaCategories() })
  });
}

function searchTeas(keyword, limit = 10) {
  return request({
    url: '/teas/search',
    method: 'GET',
    data: { keyword, limit },
    mockHandler: () => {
      const kw = (keyword || '').trim().toLowerCase();
      if (!kw) return [];
      return mock.loadTeas().filter(t =>
        (t.name && t.name.toLowerCase().indexOf(kw) >= 0) ||
        (t.origin && t.origin.toLowerCase().indexOf(kw) >= 0) ||
        (t.styleTags || []).some(tag => tag.toLowerCase().indexOf(kw) >= 0)
      ).slice(0, limit);
    }
  });
}

function getTeaReviews(itemNo, limit = 3) {
  return request({
    url: '/teas/' + itemNo + '/reviews',
    method: 'GET',
    data: { limit },
    mockHandler: () => mock.getReviewsByTeaId(itemNo, limit)
  });
}

function getRecommendedTeas(itemNo, category, limit = 3) {
  return request({
    url: '/teas/' + itemNo + '/recommendations',
    method: 'GET',
    data: { category, limit },
    mockHandler: () => mock.loadTeas()
      .filter(t => t.id !== itemNo && (!category || t.category === category))
      .slice(0, limit)
  });
}

function getTeaBrief(itemNo) {
  return request({
    url: '/teas/' + itemNo + '/brief',
    method: 'GET',
    mockHandler: () => {
      const tea = mock.getTeaById(itemNo);
      if (!tea) return null;
      return {
        id: tea.id,
        name: tea.name,
        title: tea.name,
        category: tea.category,
        coverImage: tea.coverImage || ''
      };
    }
  });
}

module.exports = {
  getTeaList,
  getTeaDetail,
  getCategories,
  searchTeas,
  getTeaReviews,
  getRecommendedTeas,
  getTeaBrief
};
