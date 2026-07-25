// subpackages/detail/travel-detail/travel-detail.js
// 行旅详情页：封面 + 目的地档案 + 随笔 + 路线 + 涉及风雅
const travelService = require('../../../services/travel.js');
const collection = require('../../../services/collection.js');
const persona = require('../../../utils/persona.js');
const router = require('../../../utils/router.js');
const subscribe = require('../../../utils/subscribe.js');
const tracker = require('../../../utils/tracker.js');
const historyService = require('../../../services/history.js');

Page({
  data: {
    id: '',
    travel: null,
    linkedItems: [],
    isCollected: false
  },

  onLoad(query) {
    const id = query.id;
    this.setData({ id });
    this._loadDetail(id);
    // 记录浏览行为，用于风雅画像
    travelService.getTravelBrief(id).then(res => {
      const travel = res.data;
      const travelTitle = travel ? travel.title : '';
      persona.trackBrowse('travel', id, travelTitle);
      // 记录浏览历史
      historyService.addHistoryRecord({ domain: 'travel', refId: id, name: travelTitle });
    });
    tracker.track('page_view', {
      page_path: 'subpackages/detail/travel-detail/travel-detail',
      target_domain: 'travel',
      target_ref_id: id
    });
  },

  onShow() {
    if (this.data.id) {
      this.setData({ isCollected: collection.isCollected('travel', this.data.id) });
    }
  },

  _loadDetail(id) {
    travelService.getTravelDetail(id).then(res => {
      const travel = res.data;
      if (!travel) {
        wx.showToast({ title: '行旅不存在', icon: 'none' });
        return;
      }
      // 为 linkedItems 加上封面色与文字
      const linkedItems = (travel.linkedItems || []).map(item => {
        const meta = collection.getDomainMeta(item.domain);
        return Object.assign({}, item, {
          coverColor: meta.color,
          coverText: meta.short_name
        });
      });
      this.setData({
        travel,
        linkedItems,
        isCollected: collection.isCollected('travel', id)
      });
    });
  },

  // 关联项点击
  onLinkedTap(e) {
    const { domain, refId } = e.currentTarget.dataset;
    if (domain === 'tea') router.goTeaDetail(refId, 'travel', this.data.id);
    else if (domain === 'wellness') router.goContentDetail(refId, 'wellness', 'travel', this.data.id);
    else if (domain === 'incense') router.goContentDetail(refId, 'incense', 'travel', this.data.id);
    else if (domain === 'music') router.goContentDetail(refId, 'music', 'travel', this.data.id);
    else if (domain === 'film') router.goContentDetail(refId, 'film', 'travel', this.data.id);
    else if (domain === 'travel') router.goTravelDetail(refId, 'travel', this.data.id);
  },

  onToggleCollect() {
    const { id, isCollected, travel } = this.data;
    if (isCollected) {
      collection.remove('travel', id).then(() => {
        this.setData({ isCollected: false });
        wx.showToast({ title: '已移出书签', icon: 'none' });
      });
    } else {
      // 关键：wx.requestSubscribeMessage 必须在 TAP 同步调用栈中执行
      subscribe.subscribeByScene('collect').then(() => {
        return collection.add('travel', id, travel.title);
      }).then(() => {
        this.setData({ isCollected: true });
        wx.showToast({ title: '已加入书签', icon: 'success' });
      });
    }
  },

  onShareAppMessage() {
    const t = this.data.travel || {};
    return {
      title: t.title || '风雅行旅',
      path: `/subpackages/detail/travel-detail/travel-detail?id=${this.data.id}`
    };
  },

  onShareTimeline() {
    const t = this.data.travel || {};
    return { title: t.title || '风雅行旅' };
  }
});
