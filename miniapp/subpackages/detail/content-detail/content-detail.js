// subpackages/detail/content-detail/content-detail.js
// 通用内容详情页（养生、香道、音乐、电影等内容）
const contentService = require('../../../services/content.js');
const collection = require('../../../services/collection.js');
const persona = require('../../../utils/persona.js');
const router = require('../../../utils/router.js');
const subscribe = require('../../../utils/subscribe.js');
const tracker = require('../../../utils/tracker.js');
const notes = require('../../../utils/notes.js');
const poster = require('../../../utils/poster.js');
const historyService = require('../../../services/history.js');

Page({
  data: {
    id: '',
    domain: 'wellness',
    detail: null,
    linkedTeas: [],
    relatedTravel: [],
    isCollected: false,
    // 笔记功能
    note: null,
    noteText: '',
    showNoteInput: false,
    noteEditTime: '',
    generatingPoster: false,
    // 香道计时器
    showIncenseTimer: false,
    incenseTimeOptions: [], // 可选时长（分钟）
    incenseSelectedMin: 30, // 选中的分钟数
    incenseTimeLeft: 0, // 剩余秒数
    incenseTotalTime: 0, // 总秒数
    incenseRunning: false,
    incenseFinished: false,
    incenseProgress: 0,
    incenseDisplayTime: '30:00',
    incenseTimerMinimized: false,
    // 音乐播放列表
    musicPlaylist: [],
    musicPlaylistIndex: -1
  },

  onLoad(query) {
    const id = query.id;
    const domain = query.domain || 'wellness';
    this.setData({ id, domain });
    // 音乐板块：从全局获取播放列表
    if (domain === 'music') {
      const app = getApp();
      const playlist = app.globalData.musicPlaylist || [];
      const index = app.globalData.musicPlaylistIndex >= 0 ? app.globalData.musicPlaylistIndex : 0;
      if (playlist.length > 1) {
        this.setData({ musicPlaylist: playlist, musicPlaylistIndex: index });
      }
    }
    this._loadDetail(id, domain);
    // 记录浏览行为，用于风雅画像
    contentService.getContentBrief(domain, id).then(res => {
      const content = res.data;
      const contentTitle = content ? content.title : '';
      persona.trackBrowse(domain, id, contentTitle);
      // 记录浏览历史
      historyService.addHistoryRecord({ domain, refId: id, name: contentTitle });
    });
    tracker.track('page_view', {
      page_path: 'subpackages/detail/content-detail/content-detail',
      target_domain: domain,
      target_ref_id: id
    });
  },

  onShow() {
    if (this.data.id) {
      this.setData({ isCollected: collection.isCollected(this.data.domain, this.data.id) });
    }
    // 恢复焚香计时器
    if (this.data.domain === 'incense') {
      this._restoreIncenseState();
    }
  },

  _loadDetail(id, domain) {
    contentService.getContentDetail(domain, id).then(res => {
      const detail = res.data;
      if (!detail) {
        wx.showToast({ title: '内容不存在', icon: 'none' });
        return;
      }
      this.setData({
        detail,
        linkedTeas: detail.linkedTeas || [],
        relatedTravel: detail.relatedTravel || [],
        isCollected: collection.isCollected(domain, id)
      });
      // 加载笔记
      const note = notes.getNote(id);
      this.setData({
        note: note,
        noteText: note ? note.content : '',
        noteEditTime: note ? notes.formatTime(note.updatedAt) : ''
      });
    });
  },

  // 跳转关联茶品
  onTeaTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTeaDetail(id, this.data.domain, this.data.id);
  },

  // 音乐切歌
  onTrackChange(e) {
    const { index, track } = e.detail;
    if (!track || !track.id) return;
    this.setData({ musicPlaylistIndex: index, id: track.id });
    this._loadDetail(track.id, 'music');
    tracker.track('click', {
      event_params: { element_id: 'music_track_change', action: 'switch_track' },
      page_path: 'subpackages/detail/content-detail/content-detail'
    });
  },

  // 跳转关联行旅
  onTravelTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTravelDetail(id, this.data.domain, this.data.id);
  },

  onToggleCollect() {
    const { id, isCollected, detail, domain } = this.data;
    if (isCollected) {
      collection.remove(domain, id).then(() => {
        this.setData({ isCollected: false });
        wx.showToast({ title: '已移出书签', icon: 'none' });
      });
    } else {
      // 关键：wx.requestSubscribeMessage 必须在 TAP 同步调用栈中执行，
      // 不能放在 collection.add().then() 里（会脱离 TAP 上下文）。
      // 先同步发起订阅请求，等用户响应后再执行收藏。
      subscribe.subscribeByScene('collect').then(() => {
        return collection.add(domain, id, detail.title);
      }).then(() => {
        this.setData({ isCollected: true });
        wx.showToast({ title: '已加入书签', icon: 'success' });
      });
    }
  },

  // 生成分享海报
  onGeneratePoster() {
    if (this.data.generatingPoster) return;
    this.setData({ generatingPoster: true });
    wx.showLoading({ title: '生成海报中...' });

    poster.generateContentPoster(this.data.detail, this.data.domain, {
      note: this.data.noteText
    }).then(tempFilePath => {
      wx.hideLoading();
      this.setData({ generatingPoster: false });

      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          wx.showToast({ title: '海报已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          if (err.errMsg.includes('deny') || err.errMsg.includes('auth')) {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存图片到相册',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting();
                }
              }
            });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      });
    }).catch(err => {
      wx.hideLoading();
      this.setData({ generatingPoster: false });
      wx.showToast({ title: '生成海报失败', icon: 'none' });
      console.error('Poster generation failed:', err);
    });
  },

  onShareAppMessage() {
    const d = this.data.detail || {};
    return {
      title: d.title || '妙不可园',
      path: `/subpackages/detail/content-detail/content-detail?id=${this.data.id}&domain=${this.data.domain}`
    };
  },

  onShareTimeline() {
    const d = this.data.detail || {};
    return { title: d.title || '妙不可园' };
  },

  // ========= 香道计时器 =========

  // 解析时长字符串，生成可选分钟数组
  _parseDuration(durationStr) {
    if (!durationStr) return [15, 30, 45];
    // 匹配数字
    const nums = durationStr.match(/\d+/g);
    if (!nums || nums.length === 0) return [15, 30, 45];
    if (nums.length === 1) return [parseInt(nums[0])];
    const min = parseInt(nums[0]);
    const max = parseInt(nums[1]);
    // 生成 3 个选项：最小值、中间值、最大值
    const mid = Math.round((min + max) / 2 / 5) * 5;
    const options = [min, mid, max];
    // 去重
    return [...new Set(options)];
  },

  // 打开香道计时器
  onOpenIncenseTimer() {
    const duration = this.data.detail ? this.data.detail.duration : '';
    const options = this._parseDuration(duration);
    const defaultMin = options[Math.floor(options.length / 2)] || 30;
    const totalSec = defaultMin * 60;
    this.setData({
      showIncenseTimer: true,
      incenseTimeOptions: options,
      incenseSelectedMin: defaultMin,
      incenseTimeLeft: totalSec,
      incenseTotalTime: totalSec,
      incenseRunning: false,
      incenseFinished: false,
      incenseProgress: 0
    });
    this._updateIncenseUI();
  },

  // 最小化计时器
  onMinimizeIncenseTimer() {
    this.setData({ incenseTimerMinimized: true });
  },

  // 恢复计时器
  onRestoreIncenseTimer() {
    this.setData({ incenseTimerMinimized: false });
  },

  // 关闭计时器
  onCloseIncenseTimer() {
    if (this._incenseTimer) {
      clearInterval(this._incenseTimer);
      this._incenseTimer = null;
    }
    this.setData({ showIncenseTimer: false, incenseRunning: false, incenseTimerMinimized: false });
  },

  // 选择时长
  onSelectIncenseMin(e) {
    const min = e.currentTarget.dataset.min;
    if (this.data.incenseRunning) return; // 运行中不可切换
    const totalSec = min * 60;
    this.setData({
      incenseSelectedMin: min,
      incenseTimeLeft: totalSec,
      incenseTotalTime: totalSec,
      incenseFinished: false,
      incenseProgress: 0
    });
    this._updateIncenseUI();
  },

  // 更新UI
  _updateIncenseUI() {
    const progress = this.data.incenseTotalTime > 0
      ? Math.round((1 - this.data.incenseTimeLeft / this.data.incenseTotalTime) * 100)
      : 0;
    const left = this.data.incenseTimeLeft;
    const m = Math.floor(left / 60);
    const s = left % 60;
    const displayTime = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    this.setData({ incenseProgress: progress, incenseDisplayTime: displayTime });
  },

  // 开始/暂停
  onToggleIncenseTimer() {
    if (this.data.incenseFinished) return;
    if (this.data.incenseRunning) {
      clearInterval(this._incenseTimer);
      this._incenseTimer = null;
      this.setData({ incenseRunning: false });
    } else {
      this.setData({ incenseRunning: true });
      this._incenseTimer = setInterval(() => {
        const left = this.data.incenseTimeLeft - 1;
        if (left <= 0) {
          clearInterval(this._incenseTimer);
          this._incenseTimer = null;
          wx.vibrateShort({ type: 'medium' });
          // 重复振动
          setTimeout(() => wx.vibrateShort({ type: 'medium' }), 500);
          setTimeout(() => wx.vibrateShort({ type: 'medium' }), 1000);
          // 记录焚香历史
          try {
            const interaction = require('../../../utils/content-interaction.js');
            const duration = this.data.incenseTotalTime / 60;
            interaction.addIncenseRecord({
              incenseId: this.data.id || '',
              incenseName: (this.data.detail && this.data.detail.title) || '焚香',
              duration: duration
            });
          } catch (e) {}
          // 清除计时器存储
          try {
            wx.removeStorageSync('content_incense_timer');
          } catch (e) {}
          this.setData({
            incenseTimeLeft: 0,
            incenseRunning: false,
            incenseFinished: true
          });
        } else {
          this.setData({ incenseTimeLeft: left });
        }
        this._updateIncenseUI();
      }, 1000);
    }
  },

  // 重置
  onResetIncenseTimer() {
    if (this._incenseTimer) {
      clearInterval(this._incenseTimer);
      this._incenseTimer = null;
    }
    const totalSec = this.data.incenseSelectedMin * 60;
    this.setData({
      incenseTimeLeft: totalSec,
      incenseTotalTime: totalSec,
      incenseRunning: false,
      incenseFinished: false,
      incenseProgress: 0
    });
    this._updateIncenseUI();
  },

  // 页面卸载
  onUnload() {
    if (this._incenseTimer) {
      clearInterval(this._incenseTimer);
      this._incenseTimer = null;
    }
    // 保存计时器状态
    this._saveIncenseState();
  },

  // 页面隐藏时保存状态
  onHide() {
    this._saveIncenseState();
  },

  // 保存焚香计时器状态
  _saveIncenseState() {
    if (!this.data.incenseRunning) {
      try {
        wx.removeStorageSync('content_incense_timer');
      } catch (e) {}
      return;
    }
    try {
      wx.setStorageSync('content_incense_timer', {
        remainingSeconds: this.data.incenseTimeLeft,
        totalSeconds: this.data.incenseTotalTime,
        contentId: this.data.id,
        startTime: Date.now()
      });
    } catch (e) {}
  },

  // 恢复焚香计时器状态
  _restoreIncenseState() {
    try {
      const state = wx.getStorageSync('content_incense_timer');
      if (!state || !state.contentId || state.contentId !== this.data.id) return;
      if (!state.remainingSeconds || state.remainingSeconds <= 0) {
        wx.removeStorageSync('content_incense_timer');
        return;
      }
      const now = Date.now();
      const elapsed = state.startTime ? Math.floor((now - state.startTime) / 1000) : 0;
      const adjustedRemaining = Math.max(0, state.remainingSeconds - elapsed);
      if (adjustedRemaining <= 0) {
        wx.removeStorageSync('content_incense_timer');
        // 记录焚香历史
        try {
          const interaction = require('../../../utils/content-interaction.js');
          const duration = state.totalSeconds / 60;
          interaction.addIncenseRecord({
            incenseId: state.contentId || '',
            incenseName: (this.data.detail && this.data.detail.title) || '焚香',
            duration: duration
          });
        } catch (e) {}
        wx.vibrateShort({ type: 'medium' });
        this.setData({
          showIncenseTimer: true,
          incenseTimeLeft: 0,
          incenseRunning: false,
          incenseFinished: true,
          incenseProgress: 100
        });
      } else {
        this.setData({
          showIncenseTimer: true,
          incenseTimeLeft: adjustedRemaining,
          incenseTotalTime: state.totalSeconds,
          incenseRunning: false,
          incenseFinished: false
        });
        this._updateIncenseUI();
      }
    } catch (e) {}
  },

  // ========= 笔记功能 =========

  // 打开笔记编辑
  onOpenNoteInput() {
    this.setData({ showNoteInput: true });
  },

  // 关闭笔记编辑
  onCloseNoteInput() {
    this.setData({ showNoteInput: false });
  },

  // 笔记内容输入
  onNoteInput(e) {
    this.setData({ noteText: e.detail.value });
  },

  // 保存笔记
  onSaveNote() {
    const { id, noteText, detail } = this.data;
    if (!noteText.trim()) {
      wx.showToast({ title: '笔记内容不能为空', icon: 'none' });
      return;
    }
    const title = detail ? detail.title : '';
    const note = notes.saveNote(id, noteText.trim(), title);
    this.setData({
      note: note,
      noteEditTime: notes.formatTime(note.updatedAt),
      showNoteInput: false
    });
    wx.showToast({ title: '笔记已保存', icon: 'success' });
    tracker.track('click', {
      event_params: { element_id: 'save_note' },
      page_path: 'subpackages/detail/content-detail/content-detail'
    });
  },

  // 删除笔记
  onDeleteNote() {
    const { id } = this.data;
    wx.showModal({
      title: '提示',
      content: '确定删除这条笔记吗？',
      success: (res) => {
        if (res.confirm) {
          notes.deleteNote(id);
          this.setData({
            note: null,
            noteText: '',
            noteEditTime: '',
            showNoteInput: false
          });
          wx.showToast({ title: '笔记已删除', icon: 'none' });
        }
      }
    });
  }
});
