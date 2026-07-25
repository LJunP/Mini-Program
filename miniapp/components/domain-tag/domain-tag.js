// components/domain-tag/domain-tag.js
const DOMAIN_META = {
  incense: { name: '香', color: '#8B6F47' },
  music:   { name: '音', color: '#4A6B7C' },
  tea:     { name: '茶', color: '#3B6D11' },
  film:    { name: '影', color: '#2C2C2A' },
  wellness:{ name: '养', color: '#A0522D' },
  travel:  { name: '游', color: '#5B8C85' }
};

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    domain: { type: String, value: 'tea' },
    size: { type: String, value: 'normal' }
  },
  data: {
    text: '茶',
    color: '#3B6D11',
    bgColor: 'rgba(59, 109, 17, 0.1)'
  },
  observers: {
    'domain': function(domain) {
      const meta = DOMAIN_META[domain] || DOMAIN_META.tea;
      // 计算 rgba 背景色（颜色 + 0.1 透明度）
      const hex = meta.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      this.setData({
        text: meta.name,
        color: meta.color,
        bgColor: `rgba(${r}, ${g}, ${b}, 0.1)`
      });
    }
  }
});
