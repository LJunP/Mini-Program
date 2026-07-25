// components/radar-chart/radar-chart.js
// 五维口感雷达图：香气 / 滋味 / 回甘 / 汤色 / 耐泡度
// 使用 Canvas 2D API 绘制（type="2d"）

const DIMENSIONS = [
  { key: 'aroma',     label: '香气' },
  { key: 'body',      label: '滋味' },
  { key: 'sweetness', label: '回甘' },
  { key: 'liquor',    label: '汤色' },
  { key: 'endurance', label: '耐泡' }
];

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    data: { type: Object, value: null }, // { aroma, taste, sweetness, liquor, endurance } 1-10
    size: { type: Number, value: 280 }
  },
  data: {},
  lifetimes: {
    attached() {
      // 等 wxml 渲染完成后再初始化 canvas
      setTimeout(() => this._initCanvas(), 50);
    }
  },
  observers: {
    'data': function() {
      // 数据变化时重绘
      if (this._ctx) this._draw();
    }
  },
  methods: {
    _initCanvas() {
      const query = this.createSelectorQuery();
      query.select('#radarCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            console.warn('[radar] canvas node not found');
            return;
          }
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getWindowInfo().pixelRatio || 1;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this._canvas = canvas;
          this._ctx = ctx;
          this._width = res[0].width;
          this._height = res[0].height;

          this._draw();
        });
    },

    _draw() {
      const ctx = this._ctx;
      if (!ctx) return;
      const width = this._width;
      const height = this._height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 2 - 36; // 留出标签空间
      const data = this.data.data || {};
      const n = DIMENSIONS.length;

      ctx.clearRect(0, 0, width, height);

      // 1. 绘制网格（5 边形，4 层）
      ctx.strokeStyle = '#EAE5DC';
      ctx.lineWidth = 0.5;
      for (let layer = 1; layer <= 4; layer++) {
        const r = (radius * layer) / 4;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 2. 绘制轴线
      ctx.strokeStyle = '#EAE5DC';
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.stroke();
      }

      // 3. 绘制数据多边形
      const points = [];
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const dim = DIMENSIONS[i];
        const val = Math.min(10, Math.max(0, Number(data[dim.key]) || 0));
        const r = (radius * val) / 10;
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push({ x, y });
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      // 填充
      ctx.fillStyle = 'rgba(59, 109, 17, 0.15)';
      ctx.fill();
      // 描边
      ctx.strokeStyle = '#3B6D11';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 4. 数据点
      ctx.fillStyle = '#3B6D11';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. 标签
      ctx.fillStyle = '#2C2C2A';
      ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < n; i++) {
        const dim = DIMENSIONS[i];
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const labelR = radius + 18;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        ctx.fillText(dim.label, x, y);

        // 分数
        const val = Number(data[dim.key]) || 0;
        ctx.fillStyle = '#8B8578';
        ctx.font = '10px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText(String(val), x, y + 14);
        ctx.fillStyle = '#2C2C2A';
        ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
      }
    }
  }
});
