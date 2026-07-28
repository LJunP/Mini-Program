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
    this._submissionSucceeded = false;
    this._hasUnconfirmedChanges = false;
    this._initialEditSnapshot = null;
    tracker.track('page_view', { page_path: 'pages/contribute/contribute' });

    // 如果有领域参数，预选
    if (options.domain) {
      this.setData({ domain: options.domain });
    }

    // 如果有编辑ID，加载已有内容
    if (options.id) {
      const post = ugc.getPostById(options.id);
      if (post) {
        const retryDraft = ugc.getRetryDraft(post.id);
        const editable = retryDraft
          ? { ...post, ...retryDraft, id: post.id }
          : post;
        this.setData({
          editId: editable.id,
          isEdit: true,
          title: editable.title,
          domain: editable.domain,
          content: editable.content,
          tags: editable.tags || [],
          images: editable.images || [],
          rating: editable.rating || 0,
          isPublic: editable.isPublic === true,
          location: editable.location || '',
          linkedContent: editable.linkedContent || null,
          contentCount: (editable.content || '').length,
          tempImages: (editable.images || []).map(url => ({ url, path: url }))
        });
        this._initialEditSnapshot = JSON.stringify(this._draftPayload());
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
    if (
      this._submissionSucceeded ||
      (!this.data.title && !this.data.content)
    ) return;

    const draft = this._draftPayload();
    if (this.data.isEdit) {
      const changedSinceLoad = this._initialEditSnapshot !== JSON.stringify(draft);
      if (this._hasUnconfirmedChanges || changedSinceLoad) {
        ugc.saveRetryDraft(draft, 'edit_unconfirmed_on_unload');
      }
      return;
    }
    ugc.saveDraft(draft);
  },

  _draftPayload() {
    return {
      editId: this.data.editId || '',
      title: this.data.title,
      domain: this.data.domain,
      content: this.data.content,
      tags: this.data.tags,
      images: this.data.images,
      rating: this.data.rating,
      isPublic: this.data.isPublic,
      location: this.data.location,
      linkedContent: this.data.linkedContent
    };
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
    if (this.data.submitting) return;

    // 验证
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入正文内容', icon: 'none' });
      return;
    }
    if (!ugc.isCloudIdentityReady()) {
      wx.showModal({
        title: '正在确认账号',
        content: '账号尚未完成云端确认，当前不会上传投稿或图片。请稍后重试。',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }

    this.setData({ submitting: true });

    // 先上传图片，再等待投稿云函数明确确认；未确认不得提示“成功”。
    this._uploadImages().catch(err => {
      throw { stage: 'upload', cause: err };
    }).then(uploadedImages => {
      this.setData({
        images: uploadedImages,
        tempImages: uploadedImages.map(url => ({ url, path: url }))
      });
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
        isPublic: this.data.isPublic
      };

      return ugc.savePostConfirmed(postData).then(savedPost => ({
        uploadedImages,
        savedPost
      }));
    }).then(({ uploadedImages, savedPost }) => {

      // 清除草稿
      this._submissionSucceeded = true;
      this._hasUnconfirmedChanges = false;
      ugc.clearRetryDraft(savedPost && savedPost.id || this.data.editId);
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
        title: savedPost && savedPost.mediaCleanupPending
          ? '内容已更新，旧图待清理'
          : (savedPost && savedPost.status === 'pending'
            ? '已提交审核'
            : (this.data.isEdit ? '更新成功' : '投稿成功')),
        icon: savedPost && (
          savedPost.mediaCleanupPending ||
          savedPost.status === 'pending'
        ) ? 'none' : 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      this.setData({ submitting: false });
      if (err && err.stage === 'upload') {
        const cause = err.cause;
        console.error('[ugc] upload images failed:', {
          code: cause && (cause.errCode || cause.code || ''),
          cleanupPending: cause && cause.cleanupPending,
          cleanupFailedFileIds: cause && cause.cleanupFailedFileIds
        });
        const toastTitle = cause && cause.cleanupPending
          ? '图片上传失败，部分文件待清理'
          : '图片上传失败，请重试';
        wx.showToast({ title: toastTitle, icon: 'none' });
        return;
      }

      console.error('[ugc] cloud confirmation failed:', {
        code: err && (err.code || err.errCode || ''),
        serverBuild: err && err.serverBuild || ''
      });
      if (err && err.localPost && err.localPost.id) {
        this.setData({
          editId: err.localPost.id,
          isEdit: true
        });
      }
      this._hasUnconfirmedChanges = true;
      ugc.saveRetryDraft(
        this._draftPayload(),
        err && err.staleScope ? 'scope_changed' : 'cloud_save_failed'
      );
      wx.showModal({
        title: '云端尚未确认',
        content: err && err.privacyStateUnchanged
          ? '公开/私密状态没有完成变更，已保持原状态。请检查网络后重试。'
          : '内容已保存在本机，但云端同步失败；当前不能视为投稿或更新成功，请稍后重试。',
        showCancel: false,
        confirmText: '知道了'
      });
    });
  },

  // 上传图片到云存储
  // 使用 Promise.allSettled 确保部分上传失败时不会产生孤儿云文件：
  // - 仅回滚本次新上传成功的 File ID
  // - 不删除原投稿已有图片
  // - 逐 File ID 确认 deleteFile 状态
  // - 清理不完整时保存可重试的 cleanup manifest
  _uploadImages() {
    const images = this.data.images || [];
    if (!images.length) return Promise.resolve([]);

    // 检查图片是否已经是云路径（已上传过）
    const needUpload = images.filter(url => url.startsWith('wxfile://') || url.startsWith('http://tmp') || url.startsWith('wslocal://'));
    const alreadyUploaded = images.filter(url => !needUpload.includes(url));

    if (!needUpload.length) return Promise.resolve(alreadyUploaded);

    const auth = require('../../utils/auth.js');
    const userInfo = auth.getUserInfo();
    const userScope = userInfo && typeof userInfo.id === 'string'
      ? userInfo.id.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100)
      : '';
    if (!userScope) {
      return Promise.reject(new Error('账号尚未完成云端确认'));
    }

    const uploadPromises = needUpload.map((filePath, index) => {
      const cloudPath = `ugc/${userScope}/${Date.now()}_${index}_${Math.floor(Math.random() * 1000000)}.jpg`;
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => resolve(res.fileID),
          fail: reject
        });
      });
    });

    return Promise.allSettled(uploadPromises).then(results => {
      const uploadedFileIds = [];
      const failedIndexes = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          uploadedFileIds.push(result.value);
        } else {
          failedIndexes.push(index);
        }
      });

      // 全部成功：返回合并结果
      if (failedIndexes.length === 0) {
        return [...alreadyUploaded, ...uploadedFileIds];
      }

      // 部分失败：必须回滚本次新上传的成功项，防止孤儿云文件
      // alreadyUploaded（原投稿已有图片）绝不会被删除
      if (uploadedFileIds.length === 0) {
        const error = new Error('图片上传全部失败');
        error.code = 'upload_all_failed';
        error.failedCount = failedIndexes.length;
        throw error;
      }

      // 逐 File ID 确认 deleteFile 状态
      return ugc.deleteCloudFilesConfirmed(uploadedFileIds).then(cleanup => {
        const cleanupFailed = cleanup.failed;

        if (cleanupFailed.length > 0) {
          // 清理不完整：保存可重试的 cleanup manifest
          ugc.saveCleanupManifest({
            fileIds: cleanupFailed,
            reason: 'upload_partial_rollback_incomplete',
            editId: this.data.editId || ''
          });
          console.warn('[ugc] 部分孤儿文件清理未完成，已保存 cleanup manifest', {
            failedCount: cleanupFailed.length,
            deletedCount: cleanup.deleted.length
          });
        }

        const error = new Error('图片上传部分失败，已回滚已上传项');
        error.code = 'upload_partial_failed';
        error.uploadedThenDeleted = cleanup.deleted;
        error.cleanupPending = cleanupFailed.length > 0;
        error.cleanupFailedFileIds = cleanupFailed;
        error.failedCount = failedIndexes.length;
        throw error;
      });
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
