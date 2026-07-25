// pages/preferences/preferences.js
const preferencesService = require('../../services/preferences.js');
const store = require('../../store/index.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    preferences: [],
    isChanged: false,
    originalValues: {}
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/preferences/preferences' });
    this._loadPreferences();
  },

  onUnload() {
    // 离开页面时自动保存未提交的偏好修改（onUnload 中无法弹模态框）
    if (this.data.isChanged) {
      const preferences = {};
      this.data.preferences.forEach(item => {
        preferences[item.key] = {
          name: item.name,
          description: item.description,
          value: item.value,
          color: item.color,
          tags: item.tags
        };
      });
      preferencesService.savePreferences(preferences);
    }
  },

  // 加载偏好设置
  _loadPreferences() {
    const preferences = preferencesService.getPreferences();
    const preferencesList = Object.keys(preferences).map(key => ({
      key,
      ...preferences[key]
    }));
    
    const originalValues = {};
    preferencesList.forEach(item => {
      originalValues[item.key] = item.value;
    });
    
    this.setData({
      preferences: preferencesList,
      originalValues,
      isChanged: false
    });
  },

  // 滑动条变化中（实时更新显示值）
  // 使用路径更新代替整个数组替换，减少 setData 序列化开销
  onSliderChanging(e) {
    const { key } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    // 找到目标索引，使用路径更新单个元素
    const idx = this.data.preferences.findIndex(item => item.key === key);
    if (idx >= 0) {
      this.setData({ [`preferences[${idx}].value`]: value });
    }
  },

  // 滑动条变化完成
  onSliderChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    const preferences = this.data.preferences.map(item => {
      if (item.key === key) {
        return { ...item, value };
      }
      return item;
    });
    
    // 检查是否有变化
    const isChanged = preferences.some(item => {
      return this.data.originalValues[item.key] !== item.value;
    });
    
    this.setData({
      preferences,
      isChanged
    });
    
    tracker.track('preference_change', {
      event_params: {
        preference: key,
        value: value,
        change: value - this.data.originalValues[key]
      }
    });
  },

  // 保存偏好设置
  onSavePreferences() {
    const preferences = {};
    this.data.preferences.forEach(item => {
      preferences[item.key] = {
        name: item.name,
        description: item.description,
        value: item.value,
        color: item.color,
        tags: item.tags
      };
    });
    
    const success = preferencesService.savePreferences(preferences);
    
    if (success) {
      // 更新store中的偏好值
      const preferenceValues = {};
      this.data.preferences.forEach(item => {
        preferenceValues[item.key] = item.value;
      });
      store.setState({ domainAffinity: preferenceValues });
      
      const originalValues = {};
      this.data.preferences.forEach(item => {
        originalValues[item.key] = item.value;
      });
      
      this.setData({
        isChanged: false,
        originalValues
      });
      
      wx.showToast({ title: '偏好已保存', icon: 'success' });
      
      tracker.track('preference_save', {
        event_params: {
          preferences: preferenceValues,
          changed: this._getChangedPreferences()
        }
      });
      
      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  // 重置偏好为默认值
  onResetPreferences() {
    wx.showModal({
      title: '重置确认',
      content: '确定要将所有偏好重置为默认值吗？',
      success: (res) => {
        if (res.confirm) {
          const defaultPrefs = preferencesService.resetPreferences();
          this._loadPreferences();
          wx.showToast({ title: '已重置', icon: 'none' });
          
          tracker.track('preference_reset', {
            event_params: {
              default_values: defaultPrefs
            }
          });
        }
      }
    });
  },

  // 获取修改的偏好列表
  _getChangedPreferences() {
    const changed = [];
    this.data.preferences.forEach(item => {
      if (this.data.originalValues[item.key] !== item.value) {
        changed.push({
          preference: item.key,
          from: this.data.originalValues[item.key],
          to: item.value
        });
      }
    });
    return changed;
  }
});