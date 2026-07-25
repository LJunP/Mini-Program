const mock = require('../../../utils/mock.js');
const studyProgress = require('../../../utils/study-progress.js');
const collection = require('../../../services/collection.js');
const tracker = require('../../../utils/tracker.js');
const persona = require('../../../utils/persona.js');
const historyService = require('../../../services/history.js');

// TTS 通过云函数 + 腾讯云 TTS API 实现，不依赖微信插件，个人主体可用
const TTS_CHUNK_SIZE = 150; // 腾讯云 TTS 单次最多 150 字

Page({
  data: {
    id: '',
    detail: null,
    progress: null,
    isCollected: false,
    statusOptions: [
      { key: 'learning', label: '学习中' },
      { key: 'mastered', label: '已掌握' },
      { key: 'weak', label: '薄弱点' }
    ],
    showAnswer: false,
    // TTS 朗读状态
    isReading: false,
    isTTSLoading: false,      // 正在合成语音
    currentSection: '',
    readSections: [],
    ttsAvailable: true        // 云函数方案，始终可用
  },

  onLoad(query) {
    const id = query.id || '';
    this.setData({ id });
    this._loadDetail(id);
    tracker.track('page_view', {
      page_path: 'subpackages/detail/question-detail/question-detail',
      target_domain: 'interview',
      target_ref_id: id
    });
  },

  _loadDetail(id) {
    const detail = mock.getInterviewQuestionById(id);
    if (!detail) {
      wx.showToast({ title: '题目不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ detail, progress: studyProgress.getRecord(id), isCollected: collection.isCollected('interview', id) });
    // 记录浏览行为和历史
    persona.trackBrowse('interview', id, detail.title || '');
    historyService.addHistoryRecord({ domain: 'interview', refId: id, name: detail.title || '' });
  },

  onShow() {
    if (this.data.id) {
      this.setData({
        progress: studyProgress.getRecord(this.data.id),
        isCollected: collection.isCollected('interview', this.data.id)
      });
    }
  },

  onUnload() {
    if (this.data.isReading) {
      this._stopReading();
    }
  },

  onToggleAnswer() {
    this.setData({ showAnswer: !this.data.showAnswer });
  },

  onStatusTap(e) {
    const { status } = e.currentTarget.dataset;
    const progress = studyProgress.setStatus(this.data.id, status);
    if (status === 'mastered') {
      studyProgress.removeFromWrongBook(this.data.id);
    }
    this.setData({ progress });
    const labelMap = {
      learning: '已标记为学习中',
      mastered: '已标记为掌握',
      weak: '已标记为薄弱点'
    };
    wx.showToast({ title: labelMap[status] || '已更新', icon: 'none' });
    tracker.track('click', {
      event_params: { element_id: 'question_status_' + status },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  },

  onWrongTap() {
    const progress = studyProgress.markWrong(this.data.id);
    this.setData({ progress });
    wx.showToast({ title: '已加入错题本', icon: 'none' });
    tracker.track('click', {
      event_params: { element_id: 'question_wrong' },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  },

  onToggleCollect() {
    const { id, detail, isCollected } = this.data;
    if (isCollected) {
      collection.remove('interview', id).then(() => {
        this.setData({ isCollected: false });
        wx.showToast({ title: '已移出书签', icon: 'none' });
      });
    } else {
      collection.add('interview', id, detail.title).then(() => {
        this.setData({ isCollected: true });
        wx.showToast({ title: '已加入书签', icon: 'success' });
      });
    }
  },

  onShareAppMessage() {
    const d = this.data.detail || {};
    const shortAnswer = d.answer && d.answer.short ? '\n\n💡 ' + d.answer.short : '';
    return {
      title: '面试题：' + (d.title || '面试题') + shortAnswer,
      path: '/subpackages/detail/question-detail/question-detail?id=' + this.data.id
    };
  },

  onShareTimeline() {
    const d = this.data.detail || {};
    return { title: '面试题：' + (d.title || '面试题') };
  },

  onCopyQuestion() {
    const d = this.data.detail;
    if (!d) return;
    const text = d.title + '\n\n' + d.question + '\n\n—— 妙不可园 · 面试题库';
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '题目已复制', icon: 'success' });
      }
    });
    tracker.track('click', {
      event_params: { element_id: 'question_copy' },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  },

  // 生成分享海报
  onGeneratePoster() {
    const d = this.data.detail;
    if (!d) return;
    wx.showLoading({ title: '生成海报中…' });

    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          wx.hideLoading();
          wx.showToast({ title: '海报生成失败', icon: 'none' });
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio || 1;
        const W = 600;
        const H = 1000;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#FAF8F3');
        bgGrad.addColorStop(1, '#F0EDE6');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        const topGrad = ctx.createLinearGradient(0, 0, W, 0);
        topGrad.addColorStop(0, '#3B6D11');
        topGrad.addColorStop(1, '#5B8C85');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, W, 8);

        let y = 60;
        ctx.fillStyle = '#3B6D11';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'left';
        const tagText = d.type + ' · ' + d.track + ' · ' + d.topic;
        ctx.fillText(tagText, 50, y);

        ctx.fillStyle = '#A0522D';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('难度 ' + d.difficulty + ' · 高频 ' + d.frequency, W - 50, y);

        y += 50;
        ctx.fillStyle = '#2C2C2A';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'left';
        this._wrapText(ctx, d.title, 50, y, W - 100, 44);
        y += 44 * Math.ceil(ctx.measureText(d.title).width / (W - 100)) + 20;

        ctx.strokeStyle = '#EAE5DC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(W - 50, y);
        ctx.stroke();

        y += 40;
        ctx.fillStyle = '#8B8578';
        ctx.font = '22px sans-serif';
        ctx.fillText('题目', 50, y);

        y += 40;
        ctx.fillStyle = '#2C2C2A';
        ctx.font = '26px sans-serif';
        y = this._wrapText(ctx, d.question, 50, y, W - 100, 38);

        y += 30;
        ctx.strokeStyle = '#EAE5DC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(W - 50, y);
        ctx.stroke();

        y += 40;
        ctx.fillStyle = '#3B6D11';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('一句话答案', 50, y);

        y += 40;
        ctx.fillStyle = '#2C2C2A';
        ctx.font = '26px sans-serif';
        y = this._wrapText(ctx, d.answer.short, 50, y, W - 100, 38);

        if (d.answer.structured && d.answer.structured.length) {
          y += 30;
          ctx.strokeStyle = '#EAE5DC';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(50, y);
          ctx.lineTo(W - 50, y);
          ctx.stroke();

          y += 40;
          ctx.fillStyle = '#3B6D11';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText('结构化要点', 50, y);

          d.answer.structured.forEach((point, i) => {
            y += 36;
            ctx.fillStyle = '#5B8C85';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText((i + 1) + '.', 50, y);
            ctx.fillStyle = '#2C2C2A';
            ctx.font = '24px sans-serif';
            y = this._wrapTextWithOffset(ctx, point, 90, y, W - 140, 36);
          });
        }

        y = H - 80;
        ctx.fillStyle = '#8B8578';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('妙不可园 · 面试题库', W / 2, y);
        y += 28;
        ctx.fillStyle = '#C5C0B7';
        ctx.font = '16px sans-serif';
        ctx.fillText('901+ 精选面试题 · 持续更新中', W / 2, y);

        wx.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            wx.hideLoading();
            wx.previewImage({
              urls: [res.tempFilePath],
              current: res.tempFilePath
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '海报生成失败', icon: 'none' });
          }
        });
      });

    tracker.track('click', {
      event_params: { element_id: 'question_poster' },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  },

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = (text || '').split('');
    let line = '';
    let currentY = y;
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, currentY);
    }
    return currentY + lineHeight;
  },

  _wrapTextWithOffset(ctx, text, x, y, maxWidth, lineHeight) {
    return this._wrapText(ctx, text, x, y, maxWidth, lineHeight);
  },

  // ====== TTS 语音朗读（云函数 + 腾讯云 TTS） ======

  _buildReadSections() {
    const d = this.data.detail;
    if (!d) return [];
    const sections = [];
    sections.push({ key: 'title', label: '标题', text: d.title });
    sections.push({ key: 'question', label: '题目', text: d.question });
    if (this.data.showAnswer || this.data.isReading) {
      if (d.answer && d.answer.short) {
        sections.push({ key: 'answer_short', label: '一句话答案', text: d.answer.short });
      }
      if (d.answer && d.answer.structured && d.answer.structured.length) {
        const structuredText = d.answer.structured.map((p, i) => '第' + (i + 1) + '点：' + p).join('。');
        sections.push({ key: 'answer_structured', label: '结构化要点', text: structuredText });
      }
      if (d.answer && d.answer.deepDive) {
        sections.push({ key: 'deep_dive', label: '深入解释', text: d.answer.deepDive });
      }
    }
    return sections.filter(s => s.text);
  },

  onToggleRead() {
    if (this.data.isReading) {
      this._stopReading();
    } else {
      this._startReading();
    }
  },

  _startReading() {
    if (!this.data.showAnswer) {
      this.setData({ showAnswer: true });
    }
    const sections = this._buildReadSections();
    if (!sections.length) {
      wx.showToast({ title: '暂无可朗读内容', icon: 'none' });
      return;
    }

    // 将所有 section 的文本拆成 150 字的 chunk，合并成一个待播放列表
    const allChunks = [];
    sections.forEach(section => {
      const chunks = this._splitText(section.text, TTS_CHUNK_SIZE);
      chunks.forEach((chunk, idx) => {
        allChunks.push({
          sectionLabel: section.label,
          text: chunk,
          isLastOfSection: idx === chunks.length - 1
        });
      });
    });

    this.setData({
      isReading: true,
      isTTSLoading: true,
      currentSection: '正在合成语音…',
      readSections: sections
    });

    this._playQueue = allChunks;
    this._queueIndex = 0;
    this._currentAudio = null;

    // 先合成第一段，然后边播放边预合成下一段
    this._synthAndPlay();

    tracker.track('click', {
      event_params: { element_id: 'question_tts_start' },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  },

  /**
   * 合成当前 chunk 的语音并播放，同时预合成下一个 chunk
   */
  _synthAndPlay() {
    const queue = this._playQueue;
    const idx = this._queueIndex;

    if (idx >= queue.length || !this.data.isReading) {
      this._stopReading();
      return;
    }

    const currentChunk = queue[idx];
    this.setData({ currentSection: currentChunk.sectionLabel });

    // 调用云函数合成语音
    wx.cloud.callFunction({
      name: 'tts',
      data: { text: currentChunk.text },
      success: (res) => {
        if (!this.data.isReading) return;

        const result = (res && res.result) || {};
        if (result.code !== 0 || !result.tempUrl) {
          console.warn('[TTS] 合成失败，跳过:', result.message);
          this._queueIndex++;
          this._synthAndPlay();
          return;
        }

        // 合成成功，开始播放
        this.setData({ isTTSLoading: false });

        const audio = wx.createInnerAudioContext();
        audio.src = result.tempUrl;
        this._currentAudio = audio;

        audio.onEnded(() => {
          audio.destroy();
          this._currentAudio = null;
          this._queueIndex++;
          this._synthAndPlay();
        });

        audio.onError((err) => {
          console.warn('[TTS] 播放错误，跳过:', err);
          audio.destroy();
          this._currentAudio = null;
          this._queueIndex++;
          this._synthAndPlay();
        });

        audio.play();
      },
      fail: (err) => {
        console.error('[TTS] 云函数调用失败:', err);
        if (!this.data.isReading) return;
        // 尝试跳过这一段
        this._queueIndex++;
        if (this._queueIndex >= this._playQueue.length) {
          this._stopReading();
          wx.showToast({ title: '语音合成失败', icon: 'none' });
        } else {
          this._synthAndPlay();
        }
      }
    });
  },

  _splitText(text, maxLen) {
    if (!text) return [];
    const chunks = [];
    let remaining = text;
    while (remaining.length > maxLen) {
      let cut = maxLen;
      const punctRegex = /[。！？；\n]/g;
      let lastPunct = -1;
      let match;
      while ((match = punctRegex.exec(remaining)) !== null && match.index < maxLen) {
        lastPunct = match.index;
      }
      if (lastPunct > 0) cut = lastPunct + 1;
      chunks.push(remaining.slice(0, cut));
      remaining = remaining.slice(cut);
    }
    if (remaining.length > 0) chunks.push(remaining);
    return chunks;
  },

  _stopReading() {
    this.setData({ isReading: false, isTTSLoading: false, currentSection: '' });
    if (this._currentAudio) {
      try {
        this._currentAudio.stop();
        this._currentAudio.destroy();
      } catch (e) {}
      this._currentAudio = null;
    }
  },

  onCopyAnswer() {
    const d = this.data.detail;
    if (!d || !d.answer) return;
    let text = d.title + '\n\n';
    text += 'Q: ' + d.question + '\n\n';
    text += 'A: ' + d.answer.short + '\n';
    if (d.answer.structured && d.answer.structured.length) {
      d.answer.structured.forEach((item, i) => {
        text += '\n' + (i + 1) + '. ' + item;
      });
    }
    text += '\n\n—— 妙不可园 · 面试题库';
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '答案已复制', icon: 'success' });
      }
    });
    tracker.track('click', {
      event_params: { element_id: 'answer_copy' },
      page_path: 'subpackages/detail/question-detail/question-detail'
    });
  }
});
