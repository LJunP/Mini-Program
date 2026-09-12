// pages/history/history.js
const historyService = require('../../services/history.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    historyList: [],
    totalCount: 0
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/history/history' });
    this._loadHistory();
  },

  onShow() {
    this._loadHistory();
  },

  onUnload() {
    this._historyLoadId = (this._historyLoadId || 0) + 1;
  },

  // 加载历史记录
  async _loadHistory() {
    const loadId = this._historyLoadId = (this._historyLoadId || 0) + 1;
    const historyList = await historyService.getHistoryList();
    if (loadId !== this._historyLoadId) return;
    const totalCount = historyList.length;
    
    // 为每条记录生成唯一键
    const historyWithKey = historyList.map(item => ({
      ...item,
      key: historyService.getRecordKey(item)
    }));
    
    this.setData({
      historyList: historyWithKey,
      totalCount
    });
  },

  // 点击历史记录项
  onItemTap(e) {
    const { domain, id } = e.currentTarget.dataset;
    
    // 跳转到对应详情页
    if (domain === 'tea') router.goTeaDetail(id);
    else if (domain === 'travel') router.goTravelDetail(id);
    else if (domain === 'wellness') router.goContentDetail(id, 'wellness');
    else if (domain === 'incense') router.goContentDetail(id, 'incense');
    else if (domain === 'music') router.goContentDetail(id, 'music');
    else if (domain === 'film') router.goContentDetail(id, 'film');
    
    tracker.track('history_item_tap', {
      event_params: { domain, id }
    });
  },

  // 删除单条记录
  onDeleteItem(e) {
    const { key, index } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除确认',
      content: '确定要删除这条浏览记录吗？',
      success: (res) => {
        if (res.confirm) {
          const success = historyService.deleteHistoryRecord(key);
          
          if (success) {
            // 从列表中移除
            const historyList = [...this.data.historyList];
            historyList.splice(index, 1);
            
            this.setData({
              historyList,
              totalCount: historyList.length
            });
            
            wx.showToast({ title: '已删除', icon: 'success' });
            
            tracker.track('history_item_delete', {
              event_params: { key, remaining_count: historyList.length }
            });
          } else {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 清空所有记录
  onClearAll() {
    if (this.data.totalCount === 0) {
      wx.showToast({ title: '没有可清空的记录', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '清空确认',
      content: `确定要清空所有${this.data.totalCount}条浏览记录吗？此操作不可撤销。`,
      confirmColor: '#E64340',
      success: (res) => {
        if (res.confirm) {
          const clearedCount = this.data.totalCount;
          const success = historyService.clearAllHistory();
          
          if (success) {
            this.setData({
              historyList: [],
              totalCount: 0
            });
            
            wx.showToast({ title: '已清空', icon: 'success' });
            
            tracker.track('history_clear_all', {
              event_params: { cleared_count: clearedCount }
            });
          } else {
            wx.showToast({ title: '清空失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 去首页
  onGoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
