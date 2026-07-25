// utils/poster.js — 分享海报生成工具
// 使用 canvas 2d 绘制精美的分享海报
// v2: 增加冲泡指南、渐变背景、装饰元素、品茶笔记引用

const CATEGORY_LABELS = {
  green: '绿茶',
  white: '白茶',
  yellow: '黄茶',
  oolong: '青茶',
  black: '红茶',
  dark: '黑茶'
};

const CATEGORY_COLORS = {
  green: ['#8DB86A', '#5E8A3E'],
  white: ['#D4C5A8', '#B8A682'],
  yellow: ['#D8B450', '#C9A24D'],
  oolong: ['#A67538', '#8B5A2B'],
  black: ['#B8443A', '#9B3A2A'],
  dark: ['#5C4630', '#4A3528']
};

const CATEGORY_RADAR_COLORS = {
  green: 'rgba(94, 138, 62, 0.2)',
  white: 'rgba(184, 166, 130, 0.2)',
  yellow: 'rgba(201, 162, 77, 0.2)',
  oolong: 'rgba(139, 90, 43, 0.2)',
  black: 'rgba(155, 58, 42, 0.2)',
  dark: 'rgba(74, 53, 40, 0.2)'
};

const CATEGORY_RADAR_STROKE = {
  green: '#5E8A3E',
  white: '#B8A682',
  yellow: '#C9A24D',
  oolong: '#8B5A2B',
  black: '#9B3A2A',
  dark: '#4A3528'
};

/**
 * 生成茶品分享海报
 * @param {Object} tea - 茶品数据
 * @param {Object} [options] - 可选参数
 * @param {string} [options.note] - 品茶笔记内容
 * @returns {Promise<string>} - 临时文件路径
 */
function generateTeaPoster(tea, options) {
  const note = (options && options.note) || '';
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          reject(new Error('Canvas not found'));
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        const width = 600;
        const height = 960;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const colors = CATEGORY_COLORS[tea.category] || CATEGORY_COLORS.green;
        const radarFill = CATEGORY_RADAR_COLORS[tea.category] || CATEGORY_RADAR_COLORS.green;
        const radarStroke = CATEGORY_RADAR_STROKE[tea.category] || CATEGORY_RADAR_STROKE.green;

        // 1. 绘制渐变背景头部
        _drawHeader(ctx, width, height, colors, tea);

        // 2. 绘制茶品信息（覆盖在头部上）
        _drawTeaTitle(ctx, tea, width);

        // 3. 绘制冲泡指南
        const brewY = _drawBrewGuide(ctx, tea, width, 340);

        // 4. 绘制简介
        const descY = _drawDescription(ctx, tea, width, brewY + 20);

        // 5. 绘制风格标签
        const tagsY = _drawTags(ctx, tea, width, descY + 20);

        // 6. 绘制口感雷达图
        _drawRadarChart(ctx, tea.tasteProfile, width / 2, tagsY + 130, 95, radarFill, radarStroke);

        // 7. 绘制品茶笔记（如有）
        let footerY = tagsY + 290;
        if (note) {
          footerY = _drawNote(ctx, note, width, footerY) + 20;
        }

        // 8. 绘制底部信息
        _drawFooter(ctx, width, height, footerY);

        // 导出图片
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        }, 100);
      });
  });
}

/**
 * 绘制渐变头部背景
 */
function _drawHeader(ctx, width, height, colors, tea) {
  // 主背景 - 米白色
  ctx.fillStyle = '#FAF8F3';
  ctx.fillRect(0, 0, width, height);

  // 顶部渐变色块
  const gradient = ctx.createLinearGradient(0, 0, width, 300);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 300);

  // 装饰圆环
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  for (let r = 40; r < 200; r += 30) {
    ctx.beginPath();
    ctx.arc(width - 30, 40, r, Math.PI * 0.5, Math.PI * 1.0);
    ctx.stroke();
  }

  // 底部装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 298);
  ctx.lineTo(width, 298);
  ctx.stroke();

  // 顶部品牌水印
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('妙不可园 · 茶品档案', 30, 25);

  // 顶部日期
  const now = new Date();
  const dateStr = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 30, 25);
}

/**
 * 绘制茶品标题信息
 */
function _drawTeaTitle(ctx, tea, width) {
  // 茶品名称
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(tea.name, width / 2, 110);

  // 茶类标签
  const categoryLabel = CATEGORY_LABELS[tea.category] || tea.category;
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(categoryLabel + ' · ' + (tea.origin || ''), width / 2, 145);

  // 产地、等级、季节
  ctx.font = '14px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText((tea.grade || '') + ' · ' + (tea.season || ''), width / 2, 170);

  // 评分区域
  const rating = tea.ratingAvg || 0;
  const ratingStr = rating.toFixed(1);

  // 评分数字
  ctx.font = 'bold 42px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(ratingStr, width / 2, 225);

  // 星星
  const stars = _getStars(rating);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(stars, width / 2, 248);

  // 评分人数
  ctx.font = '12px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText((tea.ratingCount || 0) + ' 人评分', width / 2, 268);
}

/**
 * 绘制冲泡指南区块
 */
function _drawBrewGuide(ctx, tea, width, startY) {
  const brewing = tea.brewing;
  if (!brewing) return startY;

  // 区块标题
  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('冲 泽 指 南', 40, startY);

  // 装饰线
  ctx.strokeStyle = '#E8E3D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, startY - 4);
  ctx.lineTo(width - 40, startY - 4);
  ctx.stroke();

  // 四格参数
  const items = [
    { label: '水温', value: brewing.temperature + '°C' },
    { label: '投茶', value: brewing.dosage + 'g' },
    { label: '首泡', value: brewing.firstSteep + 's' },
    { label: '可泡', value: brewing.maxSteeps + '次' }
  ];

  const colWidth = (width - 80) / 4;
  const boxY = startY + 12;

  items.forEach((item, i) => {
    const x = 40 + i * colWidth + colWidth / 2;

    // 参数值
    ctx.fillStyle = '#2C2C2A';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.value, x, boxY + 24);

    // 参数标签
    ctx.fillStyle = '#8B8578';
    ctx.font = '12px sans-serif';
    ctx.fillText(item.label, x, boxY + 44);
  });

  // 器具信息
  ctx.fillStyle = '#5A554C';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('推荐器具：' + (brewing.vessel || '盖碗'), width / 2, boxY + 70);

  return boxY + 70;
}

/**
 * 绘制简介描述
 */
function _drawDescription(ctx, tea, width, startY) {
  // 引号装饰
  ctx.fillStyle = '#D5D0C8';
  ctx.font = 'bold 40px serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('"', 30, startY - 5);

  // 描述文本（截取前100字）
  let desc = tea.description || '';
  // 去掉技术性段落
  const descParts = desc.split('【');
  if (descParts.length > 0) {
    desc = descParts[0].trim();
  }
  if (desc.length > 100) {
    desc = desc.slice(0, 97) + '...';
  }

  ctx.fillStyle = '#3C3C3A';
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'justify';
  const maxWidth = width - 80;
  const endY = _wrapText(ctx, desc, 40, startY + 8, maxWidth, 22);

  return endY;
}

/**
 * 绘制风格标签
 */
function _drawTags(ctx, tea, width, startY) {
  const tags = tea.styleTags || [];
  if (tags.length === 0) return startY;

  // 区块标题
  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('风 格 标 签', 40, startY);

  // 装饰线
  ctx.strokeStyle = '#E8E3D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, startY - 4);
  ctx.lineTo(width - 40, startY - 4);
  ctx.stroke();

  // 标签
  ctx.textBaseline = 'middle';
  const tagY = startY + 24;
  const tagSpacing = 12;
  let totalWidth = 0;
  const tagWidths = [];

  ctx.font = '13px sans-serif';
  tags.forEach(tag => {
    const w = ctx.measureText(tag).width + 24;
    tagWidths.push(w);
    totalWidth += w + tagSpacing;
  });
  totalWidth -= tagSpacing;

  let x = (width - totalWidth) / 2;
  tags.forEach((tag, i) => {
    const w = tagWidths[i];
    _drawTag(ctx, x + w / 2, tagY, tag, w);
    x += w + tagSpacing;
  });

  ctx.textBaseline = 'alphabetic';
  return tagY + 16;
}

/**
 * 绘制品茶笔记
 */
function _drawNote(ctx, note, width, startY) {
  if (!note || !note.trim()) return startY;

  // 区块标题
  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('品 茶 笔 记', 40, startY);

  // 装饰线
  ctx.strokeStyle = '#E8E3D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, startY - 4);
  ctx.lineTo(width - 40, startY - 4);
  ctx.stroke();

  // 笔记内容（截取）
  let noteText = note.trim();
  if (noteText.length > 80) {
    noteText = noteText.slice(0, 77) + '...';
  }

  // 引用样式背景
  ctx.fillStyle = '#F5F2EB';
  _roundRect(ctx, 40, startY + 8, width - 80, 56, 8);
  ctx.fill();

  // 左侧装饰条
  ctx.fillStyle = '#C9B89A';
  ctx.fillRect(40, startY + 8, 3, 56);

  // 笔记文本
  ctx.fillStyle = '#5A554C';
  ctx.font = 'italic 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  _wrapText(ctx, noteText, 56, startY + 16, width - 120, 20);

  return startY + 64;
}

/**
 * 绘制标签
 */
function _drawTag(ctx, x, y, text, customWidth) {
  ctx.fillStyle = '#F0EBE0';
  const metrics = ctx.measureText(text);
  const padding = 12;
  const w = customWidth || (metrics.width + padding * 2);
  const h = 26;

  _roundRect(ctx, x - w / 2, y - h / 2, w, h, 13);
  ctx.fill();

  ctx.fillStyle = '#5A554C';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

/**
 * 绘制雷达图
 */
function _drawRadarChart(ctx, tasteProfile, cx, cy, radius, fillColor, strokeColor) {
  if (!tasteProfile) return;

  const dimensions = [
    { key: 'aroma', label: '香气' },
    { key: 'body', label: '滋味' },
    { key: 'sweetness', label: '回甘' },
    { key: 'liquor', label: '汤色' },
    { key: 'endurance', label: '耐泡' }
  ];

  const angleStep = (Math.PI * 2) / dimensions.length;
  const startAngle = -Math.PI / 2;

  // 背景网格
  ctx.strokeStyle = '#EAE5DC';
  ctx.lineWidth = 1;
  for (let level = 1; level <= 5; level++) {
    const r = radius * level / 5;
    ctx.beginPath();
    for (let i = 0; i <= dimensions.length; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 轴线
  ctx.strokeStyle = '#D5D0C8';
  for (let i = 0; i < dimensions.length; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.stroke();
  }

  // 数据区域
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  dimensions.forEach((dim, i) => {
    const value = (tasteProfile[dim.key] || 0) / 10;
    const angle = startAngle + i * angleStep;
    const x = cx + radius * value * Math.cos(angle);
    const y = cy + radius * value * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 数据点
  ctx.fillStyle = strokeColor;
  dimensions.forEach((dim, i) => {
    const value = (tasteProfile[dim.key] || 0) / 10;
    const angle = startAngle + i * angleStep;
    const x = cx + radius * value * Math.cos(angle);
    const y = cy + radius * value * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 标签
  ctx.fillStyle = '#5A554C';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  dimensions.forEach((dim, i) => {
    const angle = startAngle + i * angleStep;
    const labelRadius = radius + 22;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);
    ctx.fillText(dim.label, x, y);
  });
}

/**
 * 绘制底部信息
 */
function _drawFooter(ctx, width, height, footerY) {
  // 分割线
  ctx.strokeStyle = '#EAE5DC';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, footerY);
  ctx.lineTo(width - 40, footerY);
  ctx.stroke();

  // 装饰小圆点
  ctx.fillStyle = '#C9B89A';
  ctx.beginPath();
  ctx.arc(width / 2, footerY, 3, 0, Math.PI * 2);
  ctx.fill();

  // 品牌名称
  ctx.fillStyle = '#2C2C2A';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('妙  不  可  园', width / 2, footerY + 38);

  // Slogan
  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.fillText('偷得浮生半日闲 · 认真生活', width / 2, footerY + 60);

  // 底部提示
  ctx.fillStyle = '#B0A99A';
  ctx.font = '11px sans-serif';
  ctx.fillText('长按识别小程序码 · 探索更多风雅', width / 2, footerY + 82);

  // 小程序码占位框
  const qrSize = 50;
  const qrX = width / 2 - qrSize / 2;
  const qrY = footerY + 92;
  ctx.fillStyle = '#F0EBE0';
  _roundRect(ctx, qrX, qrY, qrSize, qrSize, 6);
  ctx.fill();

  // 占位文字
  ctx.fillStyle = '#C9B89A';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('QR', width / 2, qrY + qrSize / 2);
}

/**
 * 获取星级字符串
 */
function _getStars(rating) {
  const full = Math.floor(rating / 2);
  const half = (rating / 2 - full) >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) stars += '★';
    else if (i === full && half) stars += '☆';
    else stars += '☆';
  }
  return stars;
}

/**
 * 文字换行
 */
function _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

/**
 * 绘制圆角矩形
 */
function _roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 领域颜色配置
 */
const DOMAIN_COLORS = {
  incense: ['#A07850', '#8B6535'],
  music: ['#6B8AAD', '#4A6585'],
  film: ['#7A6BA5', '#5A4A85'],
  wellness: ['#7B9E5C', '#5E8A3E'],
  travel: ['#5B8C85', '#3E6B65']
};

const DOMAIN_LABELS = {
  incense: '香道',
  music: '音律',
  film: '光影',
  wellness: '养生',
  travel: '行旅'
};

/**
 * 生成通用内容分享海报（香道/音乐/电影/养生/行旅）
 * @param {Object} detail - 内容数据
 * @param {string} domain - 领域（incense/music/film/wellness/travel）
 * @param {Object} [options] - 可选参数
 * @param {string} [options.note] - 笔记内容
 * @returns {Promise<string>} - 临时文件路径
 */
function generateContentPoster(detail, domain, options) {
  const note = (options && options.note) || '';
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          reject(new Error('Canvas not found'));
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        const width = 600;
        const height = 900;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const colors = DOMAIN_COLORS[domain] || DOMAIN_COLORS.wellness;
        const domainLabel = DOMAIN_LABELS[domain] || '风雅';

        // 1. 背景
        _drawContentHeader(ctx, width, height, colors, domainLabel);

        // 2. 标题信息
        _drawContentTitle(ctx, detail, domain, width);

        // 3. 正文摘要
        const bodyY = _drawContentBody(ctx, detail, width, 340);

        // 4. 小贴士
        const tipsY = _drawContentTips(ctx, detail, width, bodyY + 20);

        // 5. 笔记
        let footerY = tipsY + 30;
        if (note) {
          footerY = _drawNote(ctx, note, width, footerY) + 20;
        }

        // 6. 底部
        _drawFooter(ctx, width, height, footerY);

        // 导出
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        }, 100);
      });
  });
}

/**
 * 绘制内容海报头部
 */
function _drawContentHeader(ctx, width, height, colors, domainLabel) {
  ctx.fillStyle = '#FAF8F3';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 280);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 280);

  // 装饰圆环
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  for (let r = 40; r < 180; r += 30) {
    ctx.beginPath();
    ctx.arc(width - 30, 40, r, Math.PI * 0.5, Math.PI * 1.0);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 278);
  ctx.lineTo(width, 278);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('妙不可园 · ' + domainLabel + '档案', 30, 25);

  const now = new Date();
  const dateStr = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 30, 25);
}

/**
 * 绘制内容标题
 */
function _drawContentTitle(ctx, detail, domain, width) {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  _wrapTextCenter(ctx, detail.title || '', width / 2, 100, width - 60, 38);

  // 领域标签
  const label = DOMAIN_LABELS[domain] || '风雅';
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(label, width / 2, 160);

  // 领域特定信息
  let metaText = '';
  if (domain === 'incense') {
    metaText = [detail.origin, detail.price, detail.duration].filter(Boolean).join(' · ');
  } else if (domain === 'music') {
    metaText = [detail.instrument, detail.dynasty, detail.duration].filter(Boolean).join(' · ');
  } else if (domain === 'film') {
    metaText = [detail.director, detail.year ? detail.year + '年' : '', detail.duration].filter(Boolean).join(' · ');
  } else if (domain === 'wellness') {
    metaText = [detail.duration, detail.difficulty ? '难度 ' + detail.difficulty + '/5' : ''].filter(Boolean).join(' · ');
  } else if (domain === 'travel') {
    metaText = [detail.duration, detail.pace].filter(Boolean).join(' · ');
  }

  if (metaText) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fillText(metaText, width / 2, 190);
  }

  // 难度标识
  if (detail.difficulty) {
    const dots = '●'.repeat(detail.difficulty) + '○'.repeat(5 - detail.difficulty);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(dots, width / 2, 225);
  }
}

/**
 * 绘制内容正文摘要
 */
function _drawContentBody(ctx, detail, width, startY) {
  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('内 容 摘 要', 40, startY);

  ctx.strokeStyle = '#E8E3D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, startY - 4);
  ctx.lineTo(width - 40, startY - 4);
  ctx.stroke();

  // 截取正文前120字
  let body = detail.body || '';
  const bodyParts = body.split('【');
  if (bodyParts.length > 0) body = bodyParts[0].trim();
  if (body.length > 120) body = body.slice(0, 117) + '...';

  ctx.fillStyle = '#3C3C3A';
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'justify';
  return _wrapText(ctx, body, 40, startY + 16, width - 80, 22);
}

/**
 * 绘制内容小贴士
 */
function _drawContentTips(ctx, detail, width, startY) {
  const tips = detail.tips || [];
  if (tips.length === 0) return startY - 20;

  ctx.fillStyle = '#8B8578';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('风 雅 小 贴 士', 40, startY);

  ctx.strokeStyle = '#E8E3D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, startY - 4);
  ctx.lineTo(width - 40, startY - 4);
  ctx.stroke();

  // 最多显示3条
  const showTips = tips.slice(0, 3);
  showTips.forEach((tip, i) => {
    const y = startY + 24 + i * 28;

    // 圆点
    ctx.fillStyle = '#C9B89A';
       ctx.beginPath();
    ctx.arc(48, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // 文字
    let tipText = tip;
    if (tipText.length > 30) tipText = tipText.slice(0, 27) + '...';
    ctx.fillStyle = '#5A554C';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(tipText, 62, y);
  });

  return startY + 24 + showTips.length * 28;
}

/**
 * 居中换行文字
 */
function _wrapTextCenter(ctx, text, cx, startY, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  let currentY = startY;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, cx, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, cx, currentY);
  return currentY;
}

module.exports = {
  generateTeaPoster,
  generateContentPoster
};
