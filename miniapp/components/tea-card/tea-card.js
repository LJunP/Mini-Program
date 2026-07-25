// components/tea-card/tea-card.js
const DOMAIN_COVERS = {
  green: '#7B9E5C',
  white: '#C9B89A',
  yellow: '#C9A24D',
  oolong: '#8B5A2B',
  black: '#9B3A2A',
  dark: '#4A3528'
};

// 六大茶类渐变配色
const TEA_GRADIENTS = {
  green: 'linear-gradient(135deg, #5C8043 0%, #7B9E5C 40%, #9BBF7C 100%)',
  white: 'linear-gradient(135deg, #B0A082 0%, #C9B89A 40%, #DDD0B8 100%)',
  yellow: 'linear-gradient(135deg, #B08833 0%, #C9A24D 40%, #DDB866 100%)',
  oolong: 'linear-gradient(135deg, #6B4019 0%, #8B5A2B 40%, #A67340 100%)',
  black: 'linear-gradient(135deg, #7A2A1F 0%, #9B3A2A 40%, #B8503A 100%)',
  dark: 'linear-gradient(135deg, #3A2820 0%, #4A3528 40%, #5E4836 100%)'
};

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    tea: { type: Object, value: null }
  },
  data: {
    coverColor: '#7B9E5C',
    coverGradient: '',
    isCollected: false
  },
  observers: {
    'tea': function(tea) {
      if (!tea) return;
      const category = tea.category || 'green';
      // 检查是否已收藏
      let isCollected = false;
      try {
        const collection = require('../../services/collection.js');
        isCollected = collection.isCollected('tea', tea.id);
      } catch (e) {}
      this.setData({
        coverColor: DOMAIN_COVERS[category] || '#7B9E5C',
        coverGradient: TEA_GRADIENTS[category] || TEA_GRADIENTS.green,
        isCollected
      });
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { tea: this.data.tea });
    }
  }
});
