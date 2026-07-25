// components/incense-timer/incense-timer.js
// 香道焚香计时器组件：浮窗模式 + 倒计时 + 焚香记录
const interaction = require('../../utils/content-interaction.js');

const TIMER_KEY = 'incense_timer_state';

const DURATION_OPTIONS = [
  { label: '15分钟', value: 15 },
  { label: '30分钟', value: 30 },
  { label: '45分钟', value: 45 },
  { label: '60分钟', value: 60 }
];

Component({
  properties: {
    // 当前焚香的香品信息
    incenseId: { type: String, value: '' },
    incenseName: { type: String, value: '' }
  },

  data: {
    showPanel: false,
    isRunning: false,
    isMinimized: false,
    selectedDuration: 30,
    durationOptions: DURATION_OPTIONS,
    remainingSeconds: 0,
    totalSeconds: 0,
    incenseName: '',
    incenseId: '',
    // 焚香历史
    history: [],
    showHistory: false,
    stats: { total: 0, totalDuration: 0, thisMonth: 0 }
  },

  lifetimes: {
    attached() {
      this._loadHistory();
      this._restoreTimer();
    },
    detached() {
      this._saveTimerState();
      if (this._timer) {
        clearInterval(this._timer);
      }
    }
  },

  pageLifetimes: {
    show() {
      // 页面显示时恢复计时器
      this._restoreTimer();
    },
    hide() {
      // 页面隐藏时保存状态
      this._saveTimerState();
    }
  },

  methods: {
    // 打开计时器面板
    onOpen() {
      this.setData({ showPanel: true, isMinimized: false });
    },

    // 关闭面板
    onClose() {
      if (this.data.isRunning) {
        this.setData({ isMinimized: true, showPanel: false });
      } else {
        this.setData({ showPanel: false });
      }
    },

    // 最小化/展开
    onToggleMinimize() {
      this.setData({ isMinimized: !this.data.isMinimized, showPanel: !this.data.isMinimized });
    },

    // 选择时长
    onSelectDuration(e) {
      const { value } = e.currentTarget.dataset;
      this.setData({ selectedDuration: parseInt(value, 10) });
    },

    // 开始计时
    onStart() {
      const duration = this.data.selectedDuration;
      const totalSeconds = duration * 60;
      this.setData({
        isRunning: true,
        remainingSeconds: totalSeconds,
        totalSeconds,
        showPanel: false,
        isMinimized: true
      });
      this._startTimer();
      this.triggerEvent('start', { duration, incenseId: this.data.incenseId });
    },

    // 停止计时
    onStop() {
      this._clearTimer();
      this.setData({
        isRunning: false,
        remainingSeconds: 0,
        isMinimized: false
      });
      wx.showToast({ title: '已停止焚香', icon: 'none' });
    },

    // 完成计时
    _onComplete() {
      this._clearTimer();
      const duration = this.data.totalSeconds / 60;
      
      // 保存焚香记录
      interaction.addIncenseRecord({
        incenseId: this.data.incenseId || '',
        incenseName: this.data.incenseName || '焚香',
        duration: duration
      });

      this.setData({
        isRunning: false,
        remainingSeconds: 0,
        isMinimized: false,
        showPanel: false
      });

      this._loadHistory();

      // 提醒
      wx.vibrateLong();
      wx.showToast({ title: `焚香完成 · ${duration}分钟`, icon: 'success', duration: 3000 });
      this.triggerEvent('complete', { duration, incenseId: this.data.incenseId });
    },

    // 启动定时器
    _startTimer() {
      this._timer = setInterval(() => {
        const remaining = this.data.remainingSeconds - 1;
        if (remaining <= 0) {
          this._onComplete();
        } else {
          this.setData({ remainingSeconds: remaining });
          // 每分钟保存一次状态
          if (remaining % 60 === 0) {
            this._saveTimerState();
          }
        }
      }, 1000);
    },

    // 清除定时器
    _clearTimer() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    },

    // 保存计时器状态（用于页面切换后恢复）
    _saveTimerState() {
      if (!this.data.isRunning) {
        try {
          wx.removeStorageSync(TIMER_KEY);
        } catch (e) {}
        return;
      }
      try {
        wx.setStorageSync(TIMER_KEY, {
          remainingSeconds: this.data.remainingSeconds,
          totalSeconds: this.data.totalSeconds,
          incenseId: this.data.incenseId,
          incenseName: this.data.incenseName,
          startTime: Date.now()
        });
      } catch (e) {}
    },

    // 恢复计时器
    _restoreTimer() {
      try {
        const state = wx.getStorageSync(TIMER_KEY);
        if (!state || state.remainingSeconds <= 0) return;

        const now = Date.now();
        // 根据上次保存的起始时间计算已经过去的时间
        const elapsed = state.startTime ? Math.floor((now - state.startTime) / 1000) : 0;
        const adjustedRemaining = Math.max(0, state.remainingSeconds - elapsed);

        if (adjustedRemaining <= 0) {
          // 计时器已在后台完成
          wx.removeStorageSync(TIMER_KEY);
          const duration = state.totalSeconds / 60;
          interaction.addIncenseRecord({
            incenseId: state.incenseId || '',
            incenseName: state.incenseName || '焚香',
            duration: duration
          });
          wx.vibrateLong();
          wx.showToast({ title: `焚香完成 · ${duration}分钟`, icon: 'success', duration: 3000 });
          this.triggerEvent('complete', { duration, incenseId: state.incenseId });
          return;
        }

        this.setData({
          isRunning: true,
          isMinimized: true,
          remainingSeconds: adjustedRemaining,
          totalSeconds: state.totalSeconds,
          incenseId: state.incenseId || '',
          incenseName: state.incenseName || ''
        });
        this._startTimer();
      } catch (e) {}
    },

    // 加载历史记录
    _loadHistory() {
      const history = interaction.getIncenseHistory();
      const stats = interaction.getIncenseStats();
      this.setData({ history: history.slice(0, 10), stats });
    },

    // 显示/隐藏历史
    onToggleHistory() {
      this.setData({ showHistory: !this.data.showHistory });
    },

    // 格式化时间
    _formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  },

  observers: {
    'remainingSeconds': function(val) {
      this.setData({ displayTime: this._formatTime(val) });
    }
  }
});
