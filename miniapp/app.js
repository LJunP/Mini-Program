const auth = require('./utils/auth.js')
const tracker = require('./utils/tracker.js')
const store = require('./store/index.js')

App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    systemInfo: null,
    // 音乐播放列表（由音乐列表页设置，详情页 audio-player 消费）
    musicPlaylist: [],
    musicPlaylistIndex: -1,
    // 网络状态
    isConnected: true,
    networkType: 'wifi',
    domainColors: {
      incense: '#8B6F47',
      music: '#4A6B7C',
      tea: '#3B6D11',
      film: '#2C2C2A',
      wellness: '#A0522D',
      travel: '#5B8C85'
    },
    domainNames: {
      incense: '香',
      music: '音',
      tea: '茶',
      film: '影',
      wellness: '养',
      travel: '游'
    }
  },

  syncLocalStudyData() {
    let localEnv = null
    try {
      localEnv = require('./utils/local-env.js')
    } catch (e) {}

    if (localEnv && localEnv.useLocalCdn && localEnv.cdnBaseUrl) {
      // 正在通过局域网异步拉取全量数据
      wx.request({
        url: localEnv.cdnBaseUrl + '/api/study/all_data',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            wx.setStorageSync('local_study_data', res.data)
          }
        },
        fail: (err) => {
          console.warn('[local sync] 局域网同步失败，将降级使用包内精简版数据')
        }
      })
    } else {
      // 通过云函数获取已解密的学习数据（密钥不暴露在客户端）
      wx.cloud.callFunction({
        name: 'getStudyData',
        success: (res) => {
          const result = (res && res.result) || {}
          if (result.code === 0 && result.data) {
            const data = result.data
            if (data.tutorials) wx.setStorageSync('local_study_tutorials', data.tutorials)
            if (data.knowledge) wx.setStorageSync('local_study_knowledge', data.knowledge)
            if (data.topics) {
              Object.keys(data.topics).forEach(topicKey => {
                wx.setStorageSync('local_study_topic_' + topicKey, data.topics[topicKey])
              })
            }
            wx.setStorageSync('local_study_sync_done', true)
          } else {
            console.warn('[cloud sync] 云函数返回异常，将降级使用包内精简版数据')
          }
        },
        fail: () => {
          console.warn('[cloud sync] 云函数调用失败，将降级使用包内精简版数据')
        }
      })
    }
  },

  // 登录成功后，从云端拉取用户资产到本地（fire and forget）
  syncCloudAssets() {
    try {
      const studyProgress = require('./utils/study-progress.js')
      studyProgress.syncFromCloud().then(res => {
        if (res.synced) {
          console.log('[cloud sync] 学习进度同步完成，合并', res.mergedCount, '条')
        }
      })
    } catch (e) {
      console.warn('[cloud sync] studyProgress failed:', e)
    }

    try {
      const preferences = require('./services/preferences.js')
      preferences.syncFromCloud().then(res => {
        if (res.synced) console.log('[cloud sync] 偏好设置同步完成')
      })
    } catch (e) {
      console.warn('[cloud sync] preferences failed:', e)
    }

    try {
      const notificationSettings = require('./services/notification-settings.js')
      notificationSettings.syncFromCloud().then(res => {
        if (res.synced) console.log('[cloud sync] 通知设置同步完成')
      })
    } catch (e) {
      console.warn('[cloud sync] notificationSettings failed:', e)
    }

    try {
      const ugc = require('./utils/ugc.js')
      ugc.syncFromCloud().then(res => {
        if (res.synced) console.log('[cloud sync] UGC投稿同步完成，拉取', res.count, '条')
      })
    } catch (e) {
      console.warn('[cloud sync] ugc failed:', e)
    }
  },

  onLaunch() {
    // 1. 初始化微信云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d6gh3spr3b2bd51d8',
        traceUser: true
      })
    }

    // 2. 全局错误捕获（线上 crash 感知）
    wx.onError((err) => {
      console.error('[app] onError:', err)
      try {
        tracker.track('js_error', {
          event_params: { type: 'onError', error: String(err).slice(0, 500) }
        })
        tracker.flush()
      } catch (e) {}
    })

    wx.onUnhandledRejection((res) => {
      console.error('[app] unhandled rejection:', res.reason)
      try {
        tracker.track('unhandled_rejection', {
          event_params: { type: 'unhandledRejection', reason: String(res.reason).slice(0, 500) }
        })
        tracker.flush()
      } catch (e) {}
    })

    // 3. 内存不足告警
    wx.onMemoryWarning((res) => {
      console.warn('[app] memory warning:', res)
      try {
        tracker.track('memory_warning', {
          event_params: { level: res.level }
        })
      } catch (e) {}
    })

    // 3.5 全局网络状态监听
    wx.onNetworkStatusChange((res) => {
      this.globalData.networkType = res.networkType
      this.globalData.isConnected = res.isConnected
      if (!res.isConnected) {
        wx.showToast({ title: '网络已断开，部分功能不可用', icon: 'none', duration: 3000 })
      } else if (res.networkType !== 'wifi' && res.networkType !== 'unknown') {
        // 从断网恢复时不提示，仅在首次切到移动网络时轻提示
      }
      try {
        tracker.track('network_change', {
          event_params: { connected: res.isConnected, type: res.networkType }
        })
      } catch (e) {}
    })

    // 4. 异步同步学习数据
    this.syncLocalStudyData()

    try {
      const sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      this.globalData.systemInfo = sysInfo
    } catch (e) {
      console.warn('[app] getSystemInfo failed', e)
    }

    // 5. 静默登录（走云函数）
    auth.silentLogin().then((user) => {
      this.globalData.isLoggedIn = true
      this.globalData.userInfo = user || auth.getUserInfo()
      store.init()

      // 6. 登录成功后，异步拉取云端用户资产（不阻塞 UI）
      this.syncCloudAssets()
    }).catch(err => {
      console.warn('[app] silentLogin failed:', err)
      this.globalData.isLoggedIn = false
      store.init()
    })

    tracker.init()

    // 注意：wx.requestSubscribeMessage 必须在用户 TAP 事件中调用，
    // 不能在 onLaunch 或 setTimeout 中调用（会报 "can only be invoked by user TAP gesture"）。
    // 首次访问订阅已改为在用户首次签到/收藏时触发（见 profile.js / *-detail.js）。
  },

  onShow() {
    tracker.flush()
  },

  onHide() {
    // 切到后台时立即持久化未上报的事件
    tracker.persist()
    tracker.flush()
  }
})
