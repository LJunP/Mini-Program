const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

/**
 * 养生内容列表
 */
function getWellnessList(params = {}) {
  return request({
    url: '/wellness',
    method: 'GET',
    data: params,
    mockHandler: () => {
      let list = mock.getWellnessByCategory(params.category);
      // 按季节筛选
      if (params.season) {
        list = list.filter(w => w.season === params.season);
      }
      return {
        list: list,
        total: list.length,
        page: 1,
        pageSize: 20,
        hasMore: false
      };
    }
  });
}

/**
 * 养生内容详情
 * 直接透传原始数据（camelCase），附加解析后的关联内容
 */
function getWellnessDetail(contentNo) {
  return request({
    url: '/wellness/' + contentNo,
    method: 'GET',
    mockHandler: () => {
      const w = mock.getWellnessById(contentNo);
      if (!w) return null;

      // 解析 linkedDomains
      const linkedItems = mock.resolveLinkedDomains(w.linkedDomains || []).map(item => ({
        domain: item.domain,
        refId: item.refId,
        name: item.entity.title || item.entity.name,
        coverImage: item.entity.coverImage || '',
        context: item.context
      }));

      // 反向关联：查哪些行旅内容引用了这篇养生
      const relatedTravel = mock.findReverseLinks('wellness', contentNo, 'travel').map(item => ({
        contentNo: item.refId,
        title: item.name,
        coverImage: item.coverImage,
        linkContext: item.context
      }));

      // 直接透传原始数据，附加关联内容
      return Object.assign({}, w, {
        bodyHtml: [{ type: 'paragraph', text: w.body || '' }],
        linkedItems: linkedItems,
        relatedTravel: relatedTravel,
        contraindication: w.contraindication || '日常调理参考，严重不适请及时就医',
        isCollected: false
      });
    }
  });
}

module.exports = {
  getWellnessList,
  getWellnessDetail
};
