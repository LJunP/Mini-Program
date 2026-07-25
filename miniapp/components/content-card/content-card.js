// components/content-card/content-card.js
const DOMAIN_COLORS = {
  incense: '#8B6F47',
  music: '#4A6B7C',
  tea: '#3B6D11',
  film: '#2C2C2A',
  wellness: '#A0522D',
  travel: '#5B8C85'
};

// 各板块渐变配色（用于无图占位封面）
const DOMAIN_GRADIENTS = {
  incense: 'linear-gradient(135deg, #6B5337 0%, #8B6F47 40%, #A6825A 100%)',
  music: 'linear-gradient(135deg, #34566B 0%, #4A6B7C 40%, #6B8B9C 100%)',
  tea: 'linear-gradient(135deg, #2A560D 0%, #3B6D11 40%, #5C8B35 100%)',
  film: 'linear-gradient(135deg, #1A1A18 0%, #2C2C2A 40%, #4A4A45 100%)',
  wellness: 'linear-gradient(135deg, #8A4525 0%, #A0522D 40%, #BC6A42 100%)',
  travel: 'linear-gradient(135deg, #457A73 0%, #5B8C85 40%, #7BA89F 100%)'
};

// 各板块装饰纹样文字
const DOMAIN_PATTERNS = {
  incense: '袅',
  music: '♪',
  tea: '茗',
  film: '影',
  wellness: '养',
  travel: '行'
};

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    // 板块域
    domain: { type: String, value: 'tea' },
    // 标题
    title: { type: String, value: '' },
    // 摘要
    summary: { type: String, value: '' },
    // 封面图
    coverImage: { type: String, value: '' },
    // 作者
    author: { type: String, value: '' },
    // 附加信息（如时长/分类）
    extra: { type: String, value: '' },
    // 时长（行旅）
    duration: { type: String, value: '' },
    // 原始数据
    data: { type: Object, value: null },
    // 内容ID（用于已浏览判断）
    contentId: { type: String, value: '' }
  },
  data: {
    coverColor: '#3B6D11',
    coverGradient: '',
    coverText: '风',
    patternText: '',
    isViewed: false
  },
  observers: {
    'domain, contentId': function(domain, contentId) {
      const color = DOMAIN_COLORS[domain] || '#3B6D11';
      const gradient = DOMAIN_GRADIENTS[domain] || DOMAIN_GRADIENTS.tea;
      const textMap = {
        tea: '茶', travel: '游', wellness: '养',
        incense: '香', music: '音', film: '影'
      };
      const pattern = DOMAIN_PATTERNS[domain] || '风';
      // 检查是否已浏览
      let isViewed = false;
      if (contentId) {
        try {
          const history = wx.getStorageSync('browse_history') || [];
          isViewed = history.some(h => h.domain === domain && h.refId === contentId);
        } catch (e) {}
      }
      this.setData({
        coverColor: color,
        coverGradient: gradient,
        coverText: textMap[domain] || '风',
        patternText: pattern,
        isViewed
      });
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { data: this.data.data, domain: this.data.domain });
    }
  }
});
