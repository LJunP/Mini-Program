// components/empty-state/empty-state.js
Component({
  properties: {
    icon: {
      type: String,
      value: '📋'
    },
    iconBgColor: {
      type: String,
      value: '#EAE5DC'
    },
    iconColor: {
      type: String,
      value: '#8B8578'
    },
    title: {
      type: String,
      value: '暂无数据'
    },
    description: {
      type: String,
      value: ''
    },
    actionText: {
      type: String,
      value: ''
    },
    actionColor: {
      type: String,
      value: '#3B6D11'
    }
  },

  methods: {
    onActionTap() {
      this.triggerEvent('action');
    }
  }
});