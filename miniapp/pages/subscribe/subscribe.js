// pages/subscribe/subscribe.js
// 订阅消息管理页面
const subscribe = require('../../utils/subscribe.js');
const subscribeConfig = require('../../utils/subscribe-config.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    templates: [],
    subscribeStatus: {},
    totalCount: 0,
    enabledCount: 0
  },

  onLoad() {
    this._loadData();
    tracker.track('page_view', { page_path: 'pages/subscribe/subscribe' });
  },

  onShow() {
    this._loadData();
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  },

  _loadData() {
    const templates = subscribeConfig.getEnabledTemplates();
    const subscribeStatus = subscribe.getSubscribeStatus();
    const totalCount = templates.length;
    const enabledCount = templates.filter(template => subscribeStatus[template.key]).length;
    
    this.setData({
      templates,
      subscribeStatus,
      totalCount,
      enabledCount
    });
  },

  // 切换订阅状态
  onToggleSubscribe(e) {
    const { key } = e.currentTarget.dataset;
    const { subscribeStatus } = this.data;
    const isCurrentlySubscribed = subscribeStatus[key];
    
    if (isCurrentlySubscribed) {
      // 如果已订阅，显示确认取消弹窗
      wx.showModal({
        title: '取消订阅',
        content: '确定要取消此消息订阅吗？取消后将不再收到相关通知。',
        success: (res) => {
          if (res.confirm) {
            subscribe.setSubscribeStatus(key, false);
            this._loadData();
            wx.showToast({ title: '已取消订阅', icon: 'success' });
            
            tracker.track('subscribe_toggle', {
              event_params: {
                template_key: key,
                action: 'unsubscribe',
                source: 'subscribe_page'
              }
            });
          }
        }
      });
    } else {
      // 如果未订阅，请求订阅
      const template = subscribeConfig.SUBSCRIBE_TEMPLATES[key];
      if (template) {
        subscribe.requestSubscribe([template.id], 'subscribe_page').then(({ accepted }) => {
          if (accepted.length > 0) {
            subscribe.setSubscribeStatus(key, true);
            this._loadData();
            wx.showToast({ title: '订阅成功', icon: 'success' });
          } else {
            wx.showToast({ title: '订阅未成功，请检查权限设置', icon: 'none' });
          }
        });
      }
    }
  },

  // 批量开启所有订阅
  onEnableAll() {
    const { templates } = this.data;
    const templateIds = templates.map(template => template.id);
    
    if (templateIds.length === 0) {
      wx.showToast({ title: '暂无可订阅的消息', icon: 'none' });
      return;
    }
    
    subscribe.requestSubscribe(templateIds, 'enable_all').then(({ accepted }) => {
      if (accepted.length > 0) {
        // 更新所有订阅状态
        accepted.forEach(templateId => {
          const templateKey = this._findTemplateKeyById(templateId);
          if (templateKey) {
            subscribe.setSubscribeStatus(templateKey, true);
          }
        });
        
        this._loadData();
        wx.showToast({ title: `已开启${accepted.length}项订阅`, icon: 'success' });
        
        tracker.track('subscribe_batch', {
          event_params: {
            action: 'enable_all',
            accepted_count: accepted.length,
            total_count: templateIds.length
          }
        });
      } else {
        wx.showToast({ title: '订阅未成功，请检查权限设置', icon: 'none' });
      }
    });
  },

  // 批量关闭所有订阅
  onDisableAll() {
    wx.showModal({
      title: '关闭所有订阅',
      content: '确定要关闭所有消息订阅吗？关闭后将不再收到任何通知。',
      success: (res) => {
        if (res.confirm) {
          const { templates } = this.data;
          templates.forEach(template => {
            subscribe.setSubscribeStatus(template.key, false);
          });
          
          this._loadData();
          wx.showToast({ title: '已关闭所有订阅', icon: 'success' });
          
          tracker.track('subscribe_batch', {
            event_params: {
              action: 'disable_all',
              count: templates.length
            }
          });
        }
      }
    });
  },

  // 打开微信订阅权限设置
  onOpenSetting() {
    subscribe.showSubscribeManage({
      title: '订阅权限设置',
      content: '您可以在微信设置中管理所有订阅消息的权限，包括已拒绝的订阅请求。',
      confirmText: '去设置'
    });
    
    tracker.track('subscribe_setting', {
      event_params: { source: 'subscribe_page' }
    });
  },

  // 根据模板ID查找模板键名
  _findTemplateKeyById(templateId) {
    for (const [key, template] of Object.entries(subscribeConfig.SUBSCRIBE_TEMPLATES)) {
      if (template.id === templateId) {
        return key;
      }
    }
    return null;
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '妙不可园 · 消息订阅',
      path: '/pages/subscribe/subscribe'
    };
  },

  onShareTimeline() {
    return { title: '妙不可园 · 消息订阅' };
  }
});