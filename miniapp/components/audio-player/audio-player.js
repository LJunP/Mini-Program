// components/audio-player/audio-player.js
// 音频播放器组件（升级版：后台播放 + 进度记忆 + 播放列表）
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    src: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    // 播放列表（用于上一首/下一首）
    playlist: {
      type: Array,
      value: []
    },
    // 当前曲目在列表中的索引
    currentIndex: {
      type: Number,
      value: -1
    },
    // 唯一标识（用于进度记忆）
    trackId: {
      type: String,
      value: ''
    }
  },

  data: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    currentTimeText: '00:00',
    durationText: '00:00',
    volume: 80,
    // 是否有音频源
    hasAudio: false,
    // 进度记忆
    savedPosition: 0
  },

  observers: {
    'src': function(newSrc) {
      if (newSrc) {
        this.setData({ hasAudio: true });
        if (this._inited) {
          const shouldContinue = Boolean(this._continuePlayback);
          this._continuePlayback = false;
          this._destroyAudio(true);
          this.setData({
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            progress: 0,
            currentTimeText: '00:00',
            durationText: '00:00'
          });
          this._initAudio();
          if (shouldContinue) {
            setTimeout(() => this._startAudio(), 0);
          }
        }
      } else {
        this.setData({ hasAudio: false });
      }
    },
    'currentIndex': function(idx) {
      // 索引变化时恢复进度
      if (idx >= 0 && this.data.trackId) {
        const saved = this._getSavedProgress(this.data.trackId);
        if (saved > 0) {
          this.setData({ savedPosition: saved });
        }
      }
    }
  },

  lifetimes: {
    attached() {
      if (this.data.src) {
        this.setData({ hasAudio: true });
        this._initAudio();
      }
    },
    detached() {
      this._saveProgress();
      this._destroyAudio();
    }
  },

  pageLifetimes: {
    hide() {
      // 页面隐藏时保存进度
      this._saveProgress();
    }
  },

  methods: {
    _initAudio() {
      if (!this.data.src) return;
      this._inited = true;

      // 恢复上次播放进度
      if (this.data.trackId) {
        const saved = this._getSavedProgress(this.data.trackId);
        if (saved > 0 && saved < (this.data.duration || 9999)) {
          this.data.savedPosition = saved;
        }
      }
    },

    _startAudio() {
      if (!this.data.src) return;
      this._useBackgroundAudio();
    },

    _useBackgroundAudio() {
      const bgAudio = wx.getBackgroundAudioManager();
      this.audioCtx = bgAudio;
      this._isBackground = true;

      // BackgroundAudioManager 是全局单例。组件重新挂载时先移除旧监听，
      // 避免一次播放触发多组回调。
      [
        'offPlay', 'offPause', 'offStop', 'offTimeUpdate',
        'offEnded', 'offError', 'offPrev', 'offNext'
      ].forEach(method => {
        if (typeof bgAudio[method] === 'function') bgAudio[method]();
      });

      bgAudio.title = this.data.title || '妙不可园';
      bgAudio.singer = '妙不可园';
      // BackgroundAudioManager 设置 src 会立即播放，因此只在用户点击播放
      // 或已在播放中的上一首/下一首切换时执行到这里。
      bgAudio.src = this.data.src;

      bgAudio.onPlay(() => {
        this.setData({ isPlaying: true });
        // 恢复进度
        if (this.data.savedPosition > 0) {
          setTimeout(() => {
            bgAudio.seek(this.data.savedPosition);
            this.data.savedPosition = 0;
          }, 500);
        }
      });

      bgAudio.onPause(() => {
        this.setData({ isPlaying: false });
        this._saveProgress();
      });

      bgAudio.onStop(() => {
        this.setData({ isPlaying: false });
      });

      bgAudio.onTimeUpdate(() => {
        const now = Date.now();
        if (this._lastTimeUpdate && now - this._lastTimeUpdate < 250) return;
        this._lastTimeUpdate = now;

        const currentTime = bgAudio.currentTime;
        const duration = bgAudio.duration;
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

        this.setData({
          currentTime,
          duration,
          progress,
          currentTimeText: this._formatTime(currentTime),
          durationText: this._formatTime(duration)
        });
      });

      bgAudio.onEnded(() => {
        this._clearProgress();
        this.setData({
          isPlaying: false,
          progress: 0,
          currentTime: 0,
          currentTimeText: '00:00'
        });
        // 自动播放下一首
        this._continuePlayback = true;
        this.onNext();
      });

      bgAudio.onError((err) => {
        console.error('[audio-player] error', err);
        // 降级到 InnerAudioContext
        this._useInnerAudio();
      });

      bgAudio.onPrev && bgAudio.onPrev(() => {
        this.onPrev();
      });

      bgAudio.onNext && bgAudio.onNext(() => {
        this.onNext();
      });
    },

    // 降级方案：使用 InnerAudioContext
    _useInnerAudio() {
      this._isBackground = false;
      const audio = wx.createInnerAudioContext();
      audio.src = this.data.src;
      audio.volume = this.data.volume / 100;
      this.audioCtx = audio;

      audio.onPlay(() => {
        this.setData({ isPlaying: true });
        if (this.data.savedPosition > 0) {
          setTimeout(() => {
            audio.seek(this.data.savedPosition);
            this.data.savedPosition = 0;
          }, 500);
        }
      });

      audio.onPause(() => {
        this.setData({ isPlaying: false });
        this._saveProgress();
      });

      audio.onStop(() => {
        this.setData({ isPlaying: false });
      });

      audio.onTimeUpdate(() => {
        const now = Date.now();
        if (this._lastTimeUpdate && now - this._lastTimeUpdate < 250) return;
        this._lastTimeUpdate = now;

        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

        this.setData({
          currentTime,
          duration,
          progress,
          currentTimeText: this._formatTime(currentTime),
          durationText: this._formatTime(duration)
        });
      });

      audio.onEnded(() => {
        this._clearProgress();
        this.setData({
          isPlaying: false,
          progress: 0,
          currentTime: 0,
          currentTimeText: '00:00'
        });
        this._continuePlayback = true;
        this.onNext();
      });

      audio.onError((err) => {
        console.error('[audio-player] inner audio error', err);
        wx.showToast({ title: '音频播放失败', icon: 'none' });
      });
    },

    _destroyAudio(stopBackground = false) {
      if (this.audioCtx) {
        if (this._isBackground) {
          // 页面离开时保留后台播放；只有切换 src 时主动停止旧曲目。
          if (stopBackground && typeof this.audioCtx.stop === 'function') {
            this.audioCtx.stop();
          }
        } else {
          this.audioCtx.stop();
          this.audioCtx.destroy();
        }
        this.audioCtx = null;
      }
    },

    _formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '00:00';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    },

    // ====== 进度记忆 ======
    _getProgressKey() {
      return 'music_progress_' + (this.data.trackId || this.data.src);
    },

    _getSavedProgress() {
      try {
        return wx.getStorageSync(this._getProgressKey()) || 0;
      } catch (e) {
        return 0;
      }
    },

    _saveProgress() {
      if (!this.data.trackId || !this.data.currentTime) return;
      try {
        wx.setStorageSync(this._getProgressKey(), Math.floor(this.data.currentTime));
      } catch (e) {
        // ignore
      }
    },

    _clearProgress() {
      try {
        wx.removeStorageSync(this._getProgressKey());
      } catch (e) {
        // ignore
      }
    },

    // ====== 播放控制 ======
    onTogglePlay() {
      if (!this.audioCtx) {
        this._startAudio();
        return;
      }

      if (this.data.isPlaying) {
        this.audioCtx.pause();
      } else {
        this.audioCtx.play();
      }
    },

    onSeek(e) {
      if (!this.audioCtx || !this.data.duration) return;

      const query = this.createSelectorQuery();
      query.select('.audio-player__progress-bar').boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          const barWidth = res[0].width;
          const touchX = e.detail.x - res[0].left;
          const percent = touchX / barWidth;
          const seekTime = this.data.duration * percent;

          this.audioCtx.seek(seekTime);
        }
      });
    },

    onVolumeChange(e) {
      const volume = e.detail.value;
      this.setData({ volume });

      if (this.audioCtx && !this._isBackground) {
        this.audioCtx.volume = volume / 100;
      }
    },

    // 上一首
    onPrev() {
      const list = this.data.playlist;
      if (!list.length || this.data.currentIndex < 0) return;
      this._continuePlayback = this.data.isPlaying;
      const prevIdx = this.data.currentIndex > 0
        ? this.data.currentIndex - 1
        : list.length - 1;
      this.triggerEvent('trackchange', { index: prevIdx, track: list[prevIdx] });
    },

    // 下一首
    onNext() {
      const list = this.data.playlist;
      if (!list.length || this.data.currentIndex < 0) return;
      this._continuePlayback = this._continuePlayback || this.data.isPlaying;
      const nextIdx = this.data.currentIndex < list.length - 1
        ? this.data.currentIndex + 1
        : 0;
      this.triggerEvent('trackchange', { index: nextIdx, track: list[nextIdx] });
    }
  }
});
