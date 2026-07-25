// components/retry-bar/retry-bar.js
// 网络请求失败重试组件
Component({
  properties: {
    // 是否显示
    show: { type: Boolean, value: false },
    // 错误信息
    message: { type: String, value: '网络加载失败' },
    // 是否正在重试中
    loading: { type: Boolean, value: false }
  },

  methods: {
    onRetry() {
      if (this.data.loading) return;
      this.triggerEvent('retry');
    }
  }
});
