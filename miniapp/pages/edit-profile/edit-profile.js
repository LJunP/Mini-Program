// pages/edit-profile/edit-profile.js
const user = require('../../services/user.js');
const store = require('../../store/index.js');
const tracker = require('../../utils/tracker.js');

Page({
  data: {
    // 用户信息
    nickname: '',
    avatarUrl: '',
    bio: '',
    gender: 0,
    birthday: '',
    tags: [],
    
    // 头像背景色
    avatarBgColor: '#3B6D11',
    
    // 性别选项
    genderOptions: ['未设置', '男', '女'],
    genderIndex: 0,
    
    // 表单状态
    isChanged: false,
    originalData: {},
    // 生日选择上限（动态当前日期）
    todayDate: ''
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/edit-profile/edit-profile' });
    // 生日选择上限为当前日期
    const now = new Date();
    const todayDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    this.setData({ todayDate });
    this._loadUserInfo();
  },

  onUnload() {
    // 离开页面时自动保存未提交的修改（onUnload 中无法弹模态框，改用静默保存）
    if (this.data.isChanged) {
      const userInfo = {
        nickname: this.data.nickname.trim(),
        avatarUrl: this.data.avatarUrl,
        bio: this.data.bio.trim(),
        gender: this.data.gender,
        birthday: this.data.birthday,
        tags: this.data.tags
      };
      user.saveUserInfo(userInfo).catch(() => {});
    }
  },

  // 加载用户信息
  _loadUserInfo() {
    const userInfo = user.getUserInfo();
    const avatarBgColor = user.getAvatarBgColor(userInfo.nickname);
    
    this.setData({
      nickname: userInfo.nickname || '',
      avatarUrl: userInfo.avatarUrl || '',
      bio: userInfo.bio || '',
      gender: userInfo.gender || 0,
      birthday: userInfo.birthday || '',
      tags: userInfo.tags || [],
      genderIndex: userInfo.gender || 0,
      avatarBgColor,
      originalData: { ...userInfo },
      isChanged: false
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    if (avatarUrl) {
      const config = require('../../utils/config.js');
      const requestUtil = require('../../utils/request.js');

      if (config.isMockEnabled()) {
        // Mock 开发模式下，直接保留本地临时路径，不做真实上传
        this.setData({
          avatarUrl,
          isChanged: true
        });
        wx.showToast({ title: '本地暂存临时头像', icon: 'success' });
        
        tracker.track('profile_edit', { 
          event_params: { field: 'avatar', action: 'change_mock' } 
        });
      } else {
        // 生产或联调环境下，将临时路径上传到 CDN
        wx.showLoading({ title: '上传头像中...' });
        requestUtil.upload(avatarUrl)
          .then((res) => {
            wx.hideLoading();
            const remoteUrl = res.url || res.data?.url || res.data;
            if (remoteUrl) {
              this.setData({
                avatarUrl: remoteUrl,
                isChanged: true
              });
              wx.showToast({ title: '头像上传成功', icon: 'success' });
            } else {
              wx.showToast({ title: '返回格式不符合预期', icon: 'none' });
            }
          })
          .catch((err) => {
            wx.hideLoading();
            wx.showToast({ title: '上传失败，暂用临时头像', icon: 'none' });
            this.setData({
              avatarUrl,
              isChanged: true
            });
            console.error('[upload failed]', err);
          });
      }
    }
  },

  // 输入昵称
  onNicknameInput(e) {
    const nickname = e.detail.value;
    const avatarBgColor = user.getAvatarBgColor(nickname);
    
    this.setData({
      nickname,
      avatarBgColor,
      isChanged: true
    });
  },

  // 输入简介
  onBioInput(e) {
    this.setData({
      bio: e.detail.value,
      isChanged: true
    });
  },

  // 性别选择
  onGenderChange(e) {
    const genderIndex = e.detail.value;
    this.setData({
      genderIndex,
      gender: genderIndex,
      isChanged: true
    });
    
    tracker.track('profile_edit', { 
      event_params: { field: 'gender', value: this.data.genderOptions[genderIndex] } 
    });
  },

  // 生日选择
  onBirthdayChange(e) {
    this.setData({
      birthday: e.detail.value,
      isChanged: true
    });
    
    tracker.track('profile_edit', { 
      event_params: { field: 'birthday', value: e.detail.value } 
    });
  },

  // 移除标签
  onRemoveTag(e) {
    const { index } = e.currentTarget.dataset;
    const tags = [...this.data.tags];
    tags.splice(index, 1);
    
    this.setData({
      tags,
      isChanged: true
    });
    
    tracker.track('profile_edit', { 
      event_params: { field: 'tags', action: 'remove', count: tags.length } 
    });
  },

  // 添加标签
  onAddTag() {
    if (this.data.tags.length >= 5) {
      wx.showToast({ title: '最多添加5个标签', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '添加标签',
      placeholderText: '输入标签名称',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          const tag = res.content.trim();
          if (tag && !this.data.tags.includes(tag)) {
            const tags = [...this.data.tags, tag];
            this.setData({
              tags,
              isChanged: true
            });
            
            tracker.track('profile_edit', { 
              event_params: { field: 'tags', action: 'add', count: tags.length } 
            });
          }
        }
      }
    });
  },

  // 保存修改
  onSave() {
    if (!this.data.nickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    
    const userInfo = {
      nickname: this.data.nickname.trim(),
      avatarUrl: this.data.avatarUrl,
      bio: this.data.bio.trim(),
      gender: this.data.gender,
      birthday: this.data.birthday,
      tags: this.data.tags
    };
    
    wx.showLoading({ title: '保存中...' });
    
    // 保存到本地 + 同步到云端
    user.saveUserInfo(userInfo).then(() => {
      wx.hideLoading();
      
      // 更新store
      store.setState({ userInfo });
      
      this.setData({
        isChanged: false,
        originalData: { ...userInfo }
      });
      
      wx.showToast({ title: '保存成功', icon: 'success' });
      
      tracker.track('profile_save', { 
        event_params: { 
          fields_changed: this._getChangedFields(userInfo)
        } 
      });
      
      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(() => {
      wx.hideLoading();
      // 即使云端失败，本地也已保存
      store.setState({ userInfo });
      this.setData({
        isChanged: false,
        originalData: { ...userInfo }
      });
      wx.showToast({ title: '已保存（本地）', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    });
  },

  // 重置表单
  onReset() {
    wx.showModal({
      title: '重置确认',
      content: '确定要重置所有修改吗？',
      success: (res) => {
        if (res.confirm) {
          this._loadUserInfo();
          wx.showToast({ title: '已重置', icon: 'none' });
          
          tracker.track('profile_edit', { 
            event_params: { action: 'reset' } 
          });
        }
      }
    });
  },

  // 获取修改的字段列表
  _getChangedFields(newData) {
    const original = this.data.originalData;
    const changed = [];
    
    if (original.nickname !== newData.nickname) changed.push('nickname');
    if (original.avatarUrl !== newData.avatarUrl) changed.push('avatar');
    if (original.bio !== newData.bio) changed.push('bio');
    if (original.gender !== newData.gender) changed.push('gender');
    if (original.birthday !== newData.birthday) changed.push('birthday');
    if (JSON.stringify(original.tags) !== JSON.stringify(newData.tags)) changed.push('tags');
    
    return changed;
  }
});