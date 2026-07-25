const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

/**
 * 行旅列表
 */
function getTravelList(params = {}) {
  return request({
    url: '/destinations',
    method: 'GET',
    data: params,
    mockHandler: () => {
      let list = mock.loadTravels();
      // 按涉及板块筛选
      if (params.domain) {
        list = list.filter(t => {
          const involved = (t.linkedDomains || []).map(l => l.domain);
          return involved.indexOf(params.domain) > -1;
        });
      }
      // 按季节筛选
      if (params.season) {
        list = list.filter(t => (t.bestSeason || []).indexOf(params.season) > -1);
      }
      return {
        list: list.map(t => _toListItem(t)),
        total: list.length,
        page: 1,
        pageSize: 20,
        hasMore: false
      };
    }
  });
}

function _toListItem(t) {
  // 抽取涉及的板块集合
  const involvedDomains = Array.from(new Set((t.linkedDomains || []).map(l => l.domain)));
  return {
    id: t.id,
    destName: t.destination ? t.destination.name : '',
    region: t.destination ? t.destination.region : '',
    coverImage: t.coverImage || '',
    involvedDomains: involvedDomains,
    bestSeason: t.bestSeason || [],
    duration: t.duration || '',
    pace: t.pace || 'slow',
    title: t.title
  };
}

/**
 * 行旅详情
 */
function getTravelDetail(destNo) {
  return request({
    url: '/destinations/' + destNo,
    method: 'GET',
    mockHandler: () => {
      const travel = mock.getTravelById(destNo);
      if (!travel) return null;

      // 解析 linkedDomains，附带实体
      const linkedItems = mock.resolveLinkedDomains(travel.linkedDomains || []).map(item => ({
        domain: item.domain,
        refId: item.refId,
        name: item.entity.title || item.entity.name,
        coverImage: item.entity.coverImage || '',
        context: item.context
      }));

      // 直接透传原始数据（保留 destination 对象结构），附加关联内容
      return Object.assign({}, travel, {
        linkedItems: linkedItems,
        involvedDomains: Array.from(new Set((travel.linkedDomains || []).map(l => l.domain))),
        isCollected: false
      });
    }
  });
}

function getTravelBrief(destNo) {
  return request({
    url: '/destinations/' + destNo + '/brief',
    method: 'GET',
    mockHandler: () => {
      const travel = mock.getTravelById(destNo);
      if (!travel) return null;
      return {
        id: travel.id,
        title: travel.title,
        name: travel.title,
        coverImage: travel.coverImage || ''
      };
    }
  });
}

module.exports = {
  getTravelList,
  getTravelDetail,
  getTravelBrief
};
