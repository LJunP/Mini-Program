// pages/notification-settings/notification-settings.js
const notificationService = require('../../services/notification-settings.js');
const subscribe = require('../../utils/subscribe.js');
const subscribeConfig = require('../../utils/subscribe-config.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    // 推送设置
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // 免打扰
    dndEnabled: false,
    dndStartTime: '22:00',
    dndEndTime: '08:00',
    
    // 推送时间
    recommendTime: '08:00',
    
    // 订阅消息
    subscribeEnabledCount: 0,
    
    // 通知类型
    notificationTypes: []
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/notification-settings/notification-settings' });
    this._loadSettings();
  },

  onShow() {
    this._loadSubscribeStatus();
  },

  // 加载设置
  _loadSettings() {
    const settings = notificationService.getSettings();
    
    // 构建通知类型列表
    const notificationTypes = [
      {
        key: 'DAILY_RECOMMEND',
        name: '每日推荐',
        description: '每日精选内容推荐',
        enabled: settings.notificationTypes.DAILY_RECOMMEND
      },
      {
        key: 'SIGN_REMIND',
        name: '签到提醒',
        description: '每日签到提醒',
        enabled: settings.notificationTypes.SIGN_REMIND
      },
      {
        key: 'CONTENT_UPDATE',
        name: '内容更新',
        description: '收藏的内容有更新时提醒',
        enabled: settings.notificationTypes.CONTENT_UPDATE
      },
      {
        key: 'ACTIVITY_REMIND',
        name: '活动提醒',
        description: '特殊活动和优惠提醒',
        enabled: settings.notificationTypes.ACTIVITY_REMIND
      },
      {
        key: 'SYSTEM_NOTICE',
        name: '系统通知',
        description: '系统公告和重要通知',
        enabled: settings.notificationTypes.SYSTEM_NOTICE
      }
    ];
    
    this.setData({
      pushEnabled: settings.pushEnabled,
      soundEnabled: settings.soundEnabled,
      vibrationEnabled: settings.vibrationEnabled,
      dndEnabled: settings.dndEnabled,
      dndStartTime: settings.dndStartTime,
      dndEndTime: settings.dndEndTime,
      recommendTime: settings.recommendTime,
      notificationTypes
    });
    
    this._loadSubscribeStatus();
  },

  // 加载订阅状态
  _loadSubscribeStatus() {
    const subscribeStatus = subscribe.getSubscribeStatus();
    const enabledTemplates = subscribeConfig.getEnabledTemplates();
    const subscribeEnabledCount = enabledTemplates.filter(template => subscribeStatus[template.key]).length;
    
    this.setData({ subscribeEnabledCount });
  },

  // 切换推送通知
  onPushToggle(e) {
    const enabled = e.detail.value;
    notificationService.togglePush(enabled);
    // 单字段更新，使用路径更新减少序列化开销
    this.setData({ pushEnabled: enabled });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'push', value: enabled }
    });
    
    if (!enabled) {
      wx.showToast({ title: '已关闭推送通知', icon: 'none' });
    }
  },

  // 切换通知声音
  onSoundToggle(e) {
    const enabled = e.detail.value;
    notificationService.toggleSound(enabled);
    this.setData({ soundEnabled: enabled });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'sound', value: enabled }
    });
  },

  // 切换震动提醒
  onVibrationToggle(e) {
    const enabled = e.detail.value;
    notificationService.toggleVibration(enabled);
    this.setData({ vibrationEnabled: enabled });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'vibration', value: enabled }
    });
  },

  // 切换免打扰
  onDndToggle(e) {
    const enabled = e.detail.value;
    notificationService.toggleDnd(enabled);
    this.setData({ dndEnabled: enabled });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'dnd', value: enabled }
    });
    
    if (enabled) {
      wx.showToast({ title: '已开启免打扰', icon: 'none' });
    }
  },

  // 免打扰开始时间变化
  onDndStartTimeChange(e) {
    const startTime = e.detail.value;
    notificationService.setDndTime(startTime, this.data.dndEndTime);
    this.setData({ dndStartTime: startTime });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'dnd_start_time', value: startTime }
    });
  },

  // 免打扰结束时间变化
  onDndEndTimeChange(e) {
    const endTime = e.detail.value;
    notificationService.setDndTime(this.data.dndStartTime, endTime);
    this.setData({ dndEndTime: endTime });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'dnd_end_time', value: endTime }
    });
  },

  // 每日推荐时间变化
  onRecommendTimeChange(e) {
    const time = e.detail.value;
    notificationService.setRecommendTime(time);
    this.setData({ recommendTime: time });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'recommend_time', value: time }
    });
    
    wx.showToast({ title: `已设置每日${time}推送`, icon: 'none' });
  },

  // 切换通知类型
  onNotificationTypeToggle(e) {
    const { key } = e.currentTarget.dataset;
    const enabled = e.detail.value;
    
    notificationService.toggleNotificationType(key, enabled);
    
    // 更新本地数据
    const notificationTypes = this.data.notificationTypes.map(item => {
      if (item.key === key) {
        return { ...item, enabled };
      }
      return item;
    });
    
    this.setData({ notificationTypes });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'notification_type', type: key, value: enabled }
    });
  },

  // 管理订阅消息
  onManageSubscribe() {
    wx.navigateTo({
      url: '/pages/subscribe/subscribe'
    });
    
    tracker.track('notification_setting', {
      event_params: { setting: 'subscribe_manage', action: 'navigate' }
    });
  },

  // 请求通知权限
  onRequestPermission() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.subscribeMessage'] !== undefined) {
          tracker.track('notification_setting', {
            event_params: { 
              setting: 'permission', 
              granted: res.authSetting['scope.subscribeMessage'] 
            }
          });
          
          if (res.authSetting['scope.subscribeMessage']) {
            wx.showToast({ title: '已开启通知权限', icon: 'success' });
          } else {
            wx.showToast({ title: '通知权限未开启', icon: 'none' });
          }
        }
      }
    });
  }
});