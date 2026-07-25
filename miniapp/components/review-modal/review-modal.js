// components/review-modal/review-modal.js
// 点评弹窗：评分（1-10）+ 标签快选 + 文字输入

const PRESET_TAGS = [
  '鲜爽回甘', '香气持久', '醇厚顺滑', '汤色明亮',
  '耐泡好喝', '性价比高', '适合新手', '值得回购',
  '豆香馥郁', '花果香', '岩骨花香', '蜜香',
  '回甘持久', '清香', '醇厚', '顺滑'
];

// 评分描述映射
const RATING_DESC = {
  1: '很差', 2: '差', 3: '较差', 4: '一般',
  5: '中等', 6: '中上', 7: '良好', 8: '优秀',
  9: '极佳', 10: '完美'
};

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  properties: {
    visible: { type: Boolean, value: false },
    teaName: { type: String, value: '' }
  },

  data: {
    rating: 7,
    ratingDesc: '良好',
    selectedTags: [],
    body: '',
    presetTags: PRESET_TAGS,
    submitting: false,
    bodyLength: 0
  },

  methods: {
    // 关闭弹窗
    onClose() {
      this.triggerEvent('close');
    },

    // 阻止冒泡
    onStopPropagation() {},

    // 评分滑块
    onRatingChange(e) {
      const rating = parseFloat(e.detail.value);
      const ratingDesc = RATING_DESC[Math.round(rating)] || '';
      this.setData({ rating, ratingDesc });
    },

    // 标签切换
    onTagTap(e) {
      const tag = e.currentTarget.dataset.tag;
      const { selectedTags } = this.data;
      const idx = selectedTags.indexOf(tag);
      if (idx >= 0) {
        selectedTags.splice(idx, 1);
      } else if (selectedTags.length < 3) {
        selectedTags.push(tag);
      } else {
        wx.showToast({ title: '最多选 3 个标签', icon: 'none' });
        return;
      }
      this.setData({ selectedTags: [...selectedTags] });
    },

    // 文字输入
    onBodyInput(e) {
      const body = e.detail.value;
      this.setData({ body, bodyLength: body.length });
    },

    // 提交
    onSubmit() {
      if (this.data.submitting) return;
      
      const { rating, selectedTags, body } = this.data;
      const trimmedBody = body.trim();
      
      // 验证：至少选择一个标签或输入至少10个字
      if (selectedTags.length === 0 && trimmedBody.length < 10) {
        wx.showToast({ title: '请至少选择一个标签或输入至少10个字', icon: 'none' });
        return;
      }
      
      // 验证：文字内容最大200字
      if (trimmedBody.length > 200) {
        wx.showToast({ title: '点评内容最多200字', icon: 'none' });
        return;
      }
      
      this.setData({ submitting: true });
      
      const review = {
        id: 'r_' + Date.now(),
        user: '我',
        avatar: '',
        rating: Math.round(rating * 10) / 10,
        tags: [...selectedTags],
        body: trimmedBody,
        date: new Date().toISOString().slice(0, 10),
        isMine: true
      };

      this.triggerEvent('submit', { review });

      // 延迟关闭，给用户反馈
      setTimeout(() => {
        this.setData({ submitting: false, rating: 7, ratingDesc: '良好', selectedTags: [], body: '', bodyLength: 0 });
        this.triggerEvent('close');
      }, 300);
    }
  }
});
