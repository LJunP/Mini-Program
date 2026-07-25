// pages/contribute/contribute.js
// UGC 投稿表单页 · 自用版
const ugc = require('../../utils/ugc.js');
const tracker = require('../../utils/tracker.js');
const dataStore = require('../../utils/data-store.js');

Page({
  data: {
    // 编辑模式
    editId: null,
    isEdit: false,

    // 表单数据
    title: '',
    domain: 'tea',
    content: '',
    tags: [],
    images: [],
    rating: 0,
    isPublic: false,
    location: '',
        linkedContent: null, // { refId, refDomain, refTitle }

    // 领域选项
    domainOptions: ugc.DOMAIN_OPTIONS,

    // 当前选中领域信息
    currentDomain: null,

    // UI 状态
    submitting: false,
    contentCount: 0,
    showTagInput: false,
    tagInputValue: '',

    // 临时图片预览
    tempImages: [],

    // 关联内容选择器
    showContentPicker: false,
    contentPickerList: [],
    contentPickerKeyword: ''
  },

  onLoad(options) {
    tracker.track('page_view', { page_path: 'pages/contribute/contribute' });

    // 如果有领域参数，预选
    if (options.domain) {
      this.setData({ domain: options.domain });
    }

    // 如果有编辑ID，加载已有内容
    if (options.id) {
      const post = ugc.getPostById(options.id);
      if (post) {
        this.setData({
          editId: post.id,
          isEdit: true,
          title: post.title,
          domain: post.domain,
          content: post.content,
          tags: post.tags || [],
          images: post.images || [],
          rating: post.rating || 0,
          isPublic: post.isPublic === true,
          location: post.location || '',
          linkedContent: post.linkedContent || null,
          contentCount: (post.content || '').length,
          tempImages: (post.images || []).map(url => ({ url, path: url }))
        });
      }
    } else {
      // 尝试加载草稿
      const draft = ugc.getDraft();
      if (draft) {
        wx.showModal({
          title: '发现未完成的草稿',
          content: '是否恢复上次未完成的投稿？',
          confirmText: '恢复',
          cancelText: '丢弃',
          success: (res) => {
            if (res.confirm) {
              this.setData({
                title: draft.title || '',
                domain: draft.domain || 'tea',
                content: draft.content || '',
                tags: draft.tags || [],
                rating: draft.rating || 0,
                isPublic: draft.isPublic === true,
                location: draft.location || '',
                contentCount: (draft.content || '').length
              });
            } else {
              ugc.clearDraft();
            }
          }
        });
      }
    }

    this._updateCurrentDomain();
  },

  onUnload() {
    // 自动保存草稿
    if (!this.data.isEdit && (this.data.title || this.data.content)) {
      ugc.saveDraft({
        title: this.data.title,
        domain: this.data.domain,
        content: this.data.content,
        tags: this.data.tags,
        rating: this.data.rating,
        isPublic: this.data.isPublic,
        location: this.data.location,
        linkedContent: this.data.linkedContent
      });
    }
  },

  // 更新当前领域信息
  _updateCurrentDomain() {
    const currentDomain = this.data.domainOptions.find(d => d.key === this.data.domain);
    this.setData({ currentDomain });
  },

  // ====== 表单操作 ======

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value,
      contentCount: e.detail.value.length
    });
  },

  onLocationInput(e) {
    this.setData({ location: e.detail.value });
  },

  // 选择领域
  onDomainSelect(e) {
    const { domain } = e.currentTarget.dataset;
    this.setData({ domain });
    this._updateCurrentDomain();
  },

  // 评分
  onRatingTap(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({ rating });
  },

  // 标签操作
  onShowTagInput() {
    this.setData({ showTagInput: true, tagInputValue: '' });
  },

  onTagInput(e) {
    this.setData({ tagInputValue: e.detail.value });
  },

  onTagConfirm() {
    const tag = (this.data.tagInputValue || '').trim();
    if (!tag) {
      this.setData({ showTagInput: false });
      return;
    }
    if (this.data.tags.includes(tag)) {
      wx.showToast({ title: '标签已存在', icon: 'none' });
      return;
    }
    if (this.data.tags.length >= 8) {
      wx.showToast({ title: '最多8个标签', icon: 'none' });
      return;
    }
    this.setData({
      tags: [...this.data.tags, tag],
      showTagInput: false,
      tagInputValue: ''
    });
  },

  onTagCancel() {
    this.setData({ showTagInput: false, tagInputValue: '' });
  },

  onRemoveTag(e) {
    const { index } = e.currentTarget.dataset;
    const tags = [...this.data.tags];
    tags.splice(index, 1);
    this.setData({ tags });
  },

  // 图片操作
  onChooseImage() {
    const remaining = 9 - this.data.images.length;
    if (remaining <= 0) {
      wx.showToast({ title: '最多9张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath);
        const newTempImages = res.tempFiles.map(f => ({ url: f.tempFilePath, path: f.tempFilePath }));
        this.setData({
          images: [...this.data.images, ...newImages],
          tempImages: [...this.data.tempImages, ...newTempImages]
        });
      }
    });
  },

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: this.data.images
    });
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    const tempImages = [...this.data.tempImages];
    images.splice(index, 1);
    tempImages.splice(index, 1);
    this.setData({ images, tempImages });
  },

// ====== 提交 ======

onVisibilityChange(e) {
const isPublic = e.currentTarget.dataset.public === 'true';
this.setData({ isPublic });
},

onSubmit() {
    // 验证
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入正文内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    // 异步上传图片到云存储
    this._uploadImages().then(uploadedImages => {
      const postData = {
        id: this.data.editId,
        title: this.data.title.trim(),
        domain: this.data.domain,
        content: this.data.content.trim(),
        tags: this.data.tags,
        images: uploadedImages,
        rating: this.data.rating,
        location: this.data.location.trim(),
        linkedContent: this.data.linkedContent,
        isPublic: this.data.isPublic,
        status: 'published'
      };

      // 保存
      ugc.savePost(postData);

      // 清除草稿
      if (!this.data.isEdit) {
        ugc.clearDraft();
      }

      // 埋点
      tracker.track('ugc_submit', {
        event_params: {
          domain: this.data.domain,
          title_length: this.data.title.length,
          content_length: this.data.content.length,
          image_count: uploadedImages.length,
          rating: this.data.rating,
          is_edit: this.data.isEdit
        }
      });

      this.setData({ submitting: false });

      wx.showToast({
        title: this.data.isEdit ? '更新成功' : '投稿成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      this.setData({ submitting: false });
      console.error('[ugc] upload images failed', err);
      wx.showToast({ title: '图片上传失败，请重试', icon: 'none' });
    });
  },

  // 上传图片到云存储
  _uploadImages() {
    const images = this.data.images || [];
    if (!images.length) return Promise.resolve([]);

    // 检查图片是否已经是云路径（已上传过）
    const needUpload = images.filter(url => url.startsWith('wxfile://') || url.startsWith('http://tmp') || url.startsWith('wslocal://'));
    const alreadyUploaded = images.filter(url => !needUpload.includes(url));

    if (!needUpload.length) return Promise.resolve(alreadyUploaded);

    const uploadPromises = needUpload.map((filePath, index) => {
      const cloudPath = `ugc/${Date.now()}_${index}_${Math.floor(Math.random() * 10000)}.jpg`;
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => resolve(res.fileID),
          fail: reject
        });
      });
    });

    return Promise.all(uploadPromises).then(cloudUrls => {
      return [...alreadyUploaded, ...cloudUrls];
    });
  },

  // 保存草稿
  onSaveDraft() {
    if (!this.data.title.trim() && !this.data.content.trim()) {
      wx.showToast({ title: '请输入内容后保存', icon: 'none' });
      return;
    }
    ugc.saveDraft({
      title: this.data.title,
      domain: this.data.domain,
      content: this.data.content,
      tags: this.data.tags,
      rating: this.data.rating,
      location: this.data.location,
      linkedContent: this.data.linkedContent
    });
    wx.showToast({ title: '草稿已保存', icon: 'success' });
  },

  // ====== 关联内容 ======

  onShowContentPicker() {
    this._loadContentPickerList('');
    this.setData({ showContentPicker: true });
  },

  onHideContentPicker() {
    this.setData({ showContentPicker: false, contentPickerKeyword: '' });
  },

  onContentPickerSearch(e) {
    const keyword = e.detail.value;
    this.setData({ contentPickerKeyword: keyword });
    this._loadContentPickerList(keyword);
  },

  _loadContentPickerList(keyword) {
    const domain = this.data.domain;
    const lowerKeyword = (keyword || '').toLowerCase().trim();
    let list = [];

    // 从 data-store 获取对应领域的数据
    const domainDataMap = {
      tea: dataStore.teas,
      travel: dataStore.travels,
      wellness: dataStore.wellness,
      incense: dataStore.incense,
      music: dataStore.music,
      film: dataStore.film
    };

    const rawData = domainDataMap[domain] || [];
    list = rawData.map(item => ({
      refId: item.id,
      refDomain: domain,
      refTitle: item.name || item.title,
      refSubtitle: item.origin || item.destination && item.destination.name || item.category || '',
      refCover: item.coverImage || ''
    }));

    if (lowerKeyword) {
      list = list.filter(item =>
        item.refTitle.toLowerCase().includes(lowerKeyword) ||
        (item.refSubtitle && item.refSubtitle.toLowerCase().includes(lowerKeyword))
      );
    }

    this.setData({ contentPickerList: list });
  },

  onSelectContent(e) {
    const { refId, refDomain, refTitle } = e.currentTarget.dataset;
    this.setData({
      linkedContent: { refId, refDomain, refTitle },
      showContentPicker: false,
      contentPickerKeyword: ''
    });
  },

  onRemoveLinkedContent() {
    this.setData({ linkedContent: null });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.title || '妙不可园 · 投稿',
      path: '/pages/profile/profile'
    };
  }
});
