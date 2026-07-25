// subpackages/detail/tea-detail/tea-detail.js
// 茶品详情页：主图 + 雷达图 + 冲泡指南 + 适饮场景 + 关联行旅/养生
const teaService = require('../../../services/tea.js');
const collection = require('../../../services/collection.js');
const persona = require('../../../utils/persona.js');
const poster = require('../../../utils/poster.js');
const subscribe = require('../../../utils/subscribe.js');
const router = require('../../../utils/router.js');
const tracker = require('../../../utils/tracker.js');
const notes = require('../../../utils/notes.js');
const historyService = require('../../../services/history.js');

const CATEGORY_COLORS = {
  green: '#7B9E5C',
  white: '#C9B89A',
  yellow: '#C9A24D',
  oolong: '#8B5A2B',
  black: '#9B3A2A',
  dark: '#4A3528'
};

const SCENE_MAP = {
  morning: '晨起',
  afternoon: '午后',
  evening: '傍晚',
  night: '夜晚',
  office: '办公',
  guests: '待客',
  sleep: '睡前',
  alone: '独饮',
  gathering: '聚会'
};

Page({
  data: {
    id: '',
    tea: null,
    heroColor: '#7B9E5C',
    scenesText: [],
    relatedTravel: [],
    relatedWellness: [],
    reviews: [],
    reviewCount: 0,
    isCollected: false,
    showReviewModal: false,
    generatingPoster: false,
    // 新增功能
    likeCount: 0,
    isLiked: false,
    viewCount: 0,
    showCommentInput: false,
    commentText: '',
    replyingTo: null,
    // 相关推荐
    recommendedTeas: [],
    // 点评统计
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0], // 5星到1星的数量
    ratingPercentages: [0, 0, 0, 0, 0], // 5星到1星的百分比
    // 冲泡计时器
    showBrewTimer: false,
    brewSteep: 1,
    brewTimeLeft: 0,
    brewTotalTime: 0,
    brewRunning: false,
    brewFinished: false,
    brewHistory: [],
    brewSteepDots: [],
    brewProgress: 0,
    brewDisplayTime: '00:30',
    brewMinimized: false,
    // 笔记功能
    note: null,
    noteText: '',
    showNoteInput: false,
    noteEditTime: ''
  },

  onLoad(query) {
    const id = query.id;
    this.setData({ id });
    this._loadDetail(id);
    // 记录浏览行为，用于风雅画像（延迟获取茶名）
    teaService.getTeaBrief(id).then(res => {
      const tea = res.data;
      const teaName = tea ? tea.name : '';
      persona.trackBrowse('tea', id, teaName);
      // 记录浏览历史
      historyService.addHistoryRecord({ domain: 'tea', refId: id, name: teaName });
    });
    tracker.track('page_view', {
      page_path: 'subpackages/detail/tea-detail/tea-detail',
      target_domain: 'tea',
      target_ref_id: id
    });
  },

  onShow() {
    // 刷新收藏态
    if (this.data.id) {
      this.setData({
        isCollected: collection.isCollected('tea', this.data.id)
      });
    }
    // 恢复计时器
    if (this.data.brewMinimized) {
      this._restoreBrewState();
    }
  },

  _loadDetail(id) {
    Promise.all([
      teaService.getTeaDetail(id),
      teaService.getTeaReviews(id, 3)
    ]).then(([detailRes, reviewsRes]) => {
      const tea = detailRes.data;
      if (!tea) {
        wx.showToast({ title: '茶品不存在', icon: 'none' });
        return;
      }
      const scenesText = (tea.scenes || []).map(s => SCENE_MAP[s] || s);
      const serviceReviews = reviewsRes.data || [];
      const myReviews = wx.getStorageSync('reviews_' + id) || [];
      const allReviews = [...myReviews, ...serviceReviews].slice(0, 5);
      const reviews = allReviews.map(review => {
        const replies = wx.getStorageSync('reply_' + review.id) || [];
        const reviewLikes = wx.getStorageSync('review_likes_' + review.id) || [];
        const userId = wx.getStorageSync('user_id') || 'anonymous';
        const isLiked = reviewLikes.indexOf(userId) >= 0;
        return {
          ...review,
          replies,
          likeCount: reviewLikes.length,
          isLiked
        };
      });
      const likes = wx.getStorageSync('likes_' + id) || [];
      const isLiked = likes.indexOf(wx.getStorageSync('user_id') || 'anonymous') >= 0;
      const views = wx.getStorageSync('views_' + id) || 0;
      let averageRating = 0;
      let ratingDistribution = [0, 0, 0, 0, 0];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
        reviews.forEach(review => {
          const rating = Math.round(review.rating);
          if (rating >= 5) ratingDistribution[0]++;
          else if (rating >= 4) ratingDistribution[1]++;
          else if (rating >= 3) ratingDistribution[2]++;
          else if (rating >= 2) ratingDistribution[3]++;
          else ratingDistribution[4]++;
        });
      }
      const ratingPercentages = ratingDistribution.map(count =>
        reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
      );

      this.setData({
        tea,
        heroColor: CATEGORY_COLORS[tea.category] || '#7B9E5C',
        scenesText,
        relatedTravel: tea.relatedTravel || [],
        relatedWellness: tea.relatedWellness || [],
        reviews,
        reviewCount: reviews.length,
        isCollected: collection.isCollected('tea', id),
        likeCount: likes.length,
        isLiked,
        viewCount: views,
        averageRating,
        ratingDistribution,
        ratingPercentages
      });

      teaService.getRecommendedTeas(id, tea.category, 3).then(res => {
        this.setData({
          recommendedTeas: res.data || []
        });
      }).catch(() => {});
      // 浏览量 +1，但同一会话内不重复自增
      const viewedKey = 'viewed_' + id;
      if (!wx.getStorageSync(viewedKey)) {
        wx.setStorageSync('views_' + id, views + 1);
        wx.setStorageSync(viewedKey, true);
      }
      // 加载笔记
      const note = notes.getNote(id);
      this.setData({
        note: note,
        noteText: note ? note.content : '',
        noteEditTime: note ? notes.formatTime(note.updatedAt) : ''
      });
    });
  },

  // 跳转关联行旅
  onTravelTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTravelDetail(id, 'tea', this.data.id);
  },

  // 跳转关联养生
  onWellnessTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goContentDetail(id, 'wellness', 'tea', this.data.id);
  },

  // 打开点评弹窗
  onOpenReview() {
    this.setData({ showReviewModal: true });
  },

  // 关闭点评弹窗
  onCloseReview() {
    this.setData({ showReviewModal: false });
  },

  // 提交点评
  onReviewSubmit(e) {
    const { review } = e.detail;
    // 存入本地 storage（按茶品 id 分组）
    const key = 'reviews_' + this.data.id;
    const existing = wx.getStorageSync(key) || [];
    existing.unshift(review);
    wx.setStorageSync(key, existing);
    // 更新页面数据
    const reviews = [review, ...this.data.reviews].slice(0, 5);
    this.setData({ reviews, reviewCount: reviews.length });
    wx.showToast({ title: '点评发布成功', icon: 'success' });

    // 点评成功后请求订阅消息（转化率最高的时机）
    subscribe.subscribeAfterReview();
  },

  // 收藏 / 取消
  onToggleCollect() {
    const { id, isCollected } = this.data;
    if (isCollected) {
      collection.remove('tea', id).then(() => {
        this.setData({ isCollected: false });
        wx.showToast({ title: '已移出书签', icon: 'none' });
      });
    } else {
      // 关键：wx.requestSubscribeMessage 必须在 TAP 同步调用栈中执行
      subscribe.subscribeByScene('collect').then(() => {
        return collection.add('tea', id, this.data.tea.name);
      }).then(() => {
        this.setData({ isCollected: true });
        wx.showToast({ title: '已加入书签', icon: 'success' });
      });
    }
  },

  // 点赞 / 取消
  onToggleLike() {
    const { id, isLiked, likeCount } = this.data;
    const userId = wx.getStorageSync('user_id') || 'anonymous';
    let likes = wx.getStorageSync('likes_' + id) || [];
    
    if (isLiked) {
      likes = likes.filter(l => l !== userId);
      wx.setStorageSync('likes_' + id, likes);
      this.setData({ isLiked: false, likeCount: likes.length });
      wx.showToast({ title: '已取消点赞', icon: 'none' });
    } else {
      likes.push(userId);
      wx.setStorageSync('likes_' + id, likes);
      this.setData({ isLiked: true, likeCount: likes.length });
      wx.showToast({ title: '点赞成功', icon: 'success' });
    }
    
    tracker.track('like', {
      target_domain: 'tea',
      target_ref_id: id,
      event_params: { is_liked: !isLiked }
    });
  },

  // 点评点赞 / 取消
  onToggleReviewLike(e) {
    const { reviewId } = e.currentTarget.dataset;
    const { reviews } = this.data;
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;
    
    const review = reviews[reviewIndex];
    const userId = wx.getStorageSync('user_id') || 'anonymous';
    let reviewLikes = wx.getStorageSync('review_likes_' + reviewId) || [];
    
    if (review.isLiked) {
      reviewLikes = reviewLikes.filter(l => l !== userId);
      wx.setStorageSync('review_likes_' + reviewId, reviewLikes);
      review.isLiked = false;
      review.likeCount = reviewLikes.length;
    } else {
      reviewLikes.push(userId);
      wx.setStorageSync('review_likes_' + reviewId, reviewLikes);
      review.isLiked = true;
      review.likeCount = reviewLikes.length;
    }
    
    this.setData({ reviews });
    tracker.track('review_like', {
      target_domain: 'tea',
      target_ref_id: this.data.id,
      event_params: { review_id: reviewId, is_liked: review.isLiked }
    });
  },

  // 打开评论输入
  onOpenComment(e) {
    const { reviewId } = e.currentTarget.dataset;
    this.setData({
      showCommentInput: true,
      replyingTo: reviewId || null
    });
  },

  // 关闭评论输入
  onCloseComment() {
    this.setData({
      showCommentInput: false,
      commentText: '',
      replyingTo: null
    });
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  // 提交评论
  onCommentSubmit() {
    const { commentText, replyingTo, id, reviews } = this.data;
    if (!commentText.trim()) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    
    // 保存评论到本地
    const commentKey = replyingTo ? `reply_${replyingTo}` : `comments_${id}`;
    const comments = wx.getStorageSync(commentKey) || [];
    const newComment = {
      id: 'comment_' + Date.now(),
      user: '匿名用户',
      content: commentText,
      date: new Date().toISOString().slice(0, 10),
      replyTo: replyingTo
    };
    comments.unshift(newComment);
    wx.setStorageSync(commentKey, comments);
    
    // 更新页面数据
    if (replyingTo) {
      // 更新对应点评的回复列表
      const reviewIndex = reviews.findIndex(r => r.id === replyingTo);
      if (reviewIndex !== -1) {
        const updatedReviews = [...reviews];
        updatedReviews[reviewIndex] = {
          ...updatedReviews[reviewIndex],
          replies: [newComment, ...(updatedReviews[reviewIndex].replies || [])]
        };
        this.setData({ reviews: updatedReviews });
      }
    }
    
    this.setData({
      showCommentInput: false,
      commentText: '',
      replyingTo: null
    });
    
    wx.showToast({ title: '评论成功', icon: 'success' });
    tracker.track('comment', {
      target_domain: 'tea',
      target_ref_id: id,
      event_params: { reply_to: replyingTo }
    });
  },

  // ========= 冲泡计时器 =========

  // 更新泡数指示器和进度
  _updateBrewUI() {
    const maxSteeps = (this.data.tea && this.data.tea.brewing) ? this.data.tea.brewing.maxSteeps : 5;
    const dots = [];
    for (let i = 1; i <= maxSteeps; i++) {
      dots.push({
        num: i,
        done: i < this.data.brewSteep || (i === this.data.brewSteep && this.data.brewFinished),
        active: i === this.data.brewSteep && !this.data.brewFinished
      });
    }
    const progress = this.data.brewTotalTime > 0
      ? Math.round((1 - this.data.brewTimeLeft / this.data.brewTotalTime) * 100)
      : 0;
    const left = this.data.brewTimeLeft;
    const m = Math.floor(left / 60);
    const s = left % 60;
    const displayTime = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    this.setData({
      brewSteepDots: dots,
      brewProgress: progress,
      brewDisplayTime: displayTime
    });
  },

  // 打开冲泡计时器
  onOpenBrewTimer() {
    if (!this.data.tea || !this.data.tea.brewing) {
      wx.showToast({ title: '冲泡信息暂不可用', icon: 'none' });
      return;
    }
    const brewing = this.data.tea.brewing;
    if (!brewing) return;
    const firstSteep = brewing.firstSteep || 30;
    this.setData({
      showBrewTimer: true,
      brewSteep: 1,
      brewTimeLeft: firstSteep,
      brewTotalTime: firstSteep,
      brewRunning: false,
      brewFinished: false,
      brewHistory: []
    });
    this._updateBrewUI();
  },

  // 关闭冲泡计时器（最小化模式）
  onCloseBrewTimer() {
    if (this.data.brewRunning) {
      // 正在计时中，最小化而非关闭
      this.setData({ showBrewTimer: false, brewMinimized: true });
      // 保存计时器状态
      this._saveBrewState();
    } else {
      if (this._brewTimer) {
        clearInterval(this._brewTimer);
        this._brewTimer = null;
      }
      this.setData({ showBrewTimer: false, brewRunning: false, brewMinimized: false });
    }
  },

  // 恢复最小化的计时器
  onRestoreBrewTimer() {
    this.setData({ showBrewTimer: true, brewMinimized: false });
  },

  // 保存冲泡计时器状态
  _saveBrewState() {
    if (!this.data.brewRunning) return;
    try {
      wx.setStorageSync('brew_timer_state', {
        steep: this.data.brewSteep,
        timeLeft: this.data.brewTimeLeft,
        totalTime: this.data.brewTotalTime,
        teaId: this.data.id,
        startTime: Date.now()
      });
    } catch (e) {}
  },

  // 恢复冲泡计时器状态
  _restoreBrewState() {
    try {
      const state = wx.getStorageSync('brew_timer_state');
      if (!state || !state.teaId || state.teaId !== this.data.id) return;

      const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
      const adjustedLeft = Math.max(0, state.timeLeft - elapsed);

      if (adjustedLeft <= 0) {
        // 计时器已在后台完成
        wx.removeStorageSync('brew_timer_state');
        wx.vibrateShort({ type: 'medium' });
        const history = [...this.data.brewHistory, {
          steep: state.steep,
          duration: state.totalTime
        }];
        this.setData({
          showBrewTimer: true,
          brewMinimized: false,
          brewSteep: state.steep,
          brewTimeLeft: 0,
          brewTotalTime: state.totalTime,
          brewRunning: false,
          brewFinished: true,
          brewHistory: history
        });
        this._updateBrewUI();
        wx.showToast({ title: `第${state.steep}泡已完成`, icon: 'success' });
      } else {
        this.setData({
          showBrewTimer: true,
          brewMinimized: false,
          brewSteep: state.steep,
          brewTimeLeft: adjustedLeft,
          brewTotalTime: state.totalTime,
          brewRunning: false,
          brewFinished: false
        });
        this._updateBrewUI();
      }
    } catch (e) {}
  },

  // 开始 / 暂停倒计时
  onToggleBrewTimer() {
    if (this.data.brewFinished) return;
    if (this.data.brewRunning) {
      // 暂停
      clearInterval(this._brewTimer);
      this._brewTimer = null;
      this.setData({ brewRunning: false });
    } else {
      // 开始
      this.setData({ brewRunning: true });
      this._brewTimer = setInterval(() => {
        const left = this.data.brewTimeLeft - 1;
        if (left <= 0) {
          clearInterval(this._brewTimer);
          this._brewTimer = null;
          // 振动提醒
          wx.vibrateShort({ type: 'medium' });
          setTimeout(() => wx.vibrateShort({ type: 'medium' }), 500);
          setTimeout(() => wx.vibrateShort({ type: 'medium' }), 1000);
          // 播放提示音
          try {
            const audio = wx.createInnerAudioContext();
            audio.src = 'https://cdn.fengya.life/assets/sounds/timer-done.mp3';
            audio.volume = 1;
            audio.play();
            audio.onEnded(() => audio.destroy());
            audio.onError(() => audio.destroy());
          } catch (e) {}
          // 弹窗提示
          wx.showModal({
            title: '冲泡完成',
            content: '第' + this.data.brewSteep + '泡已完成，可以品饮了',
            showCancel: false,
            confirmText: '好的'
          });
          const history = [...this.data.brewHistory, {
            steep: this.data.brewSteep,
            duration: this.data.brewTotalTime
          }];
          this.setData({
            brewTimeLeft: 0,
            brewRunning: false,
            brewFinished: true,
            brewHistory: history
          });
          this._updateBrewUI();
        } else {
          this.setData({ brewTimeLeft: left });
          this._updateBrewUI();
        }
      }, 1000);
    }
  },

  // 下一泡
  onNextSteep() {
    if (!this.data.tea || !this.data.tea.brewing) return;
    const brewing = this.data.tea.brewing;
    if (!brewing) return;
    const maxSteeps = brewing.maxSteeps || 5;
    if (this.data.brewSteep >= maxSteeps) {
      wx.showToast({ title: '已达最大冲泡次数', icon: 'none' });
      return;
    }
    // 后续泡次时间递增：第2泡起每泡递增 50%
    const baseTime = brewing.firstSteep || 30;
    const nextSteep = this.data.brewSteep + 1;
    const increment = Math.ceil(baseTime * 0.5 * nextSteep / 5) * 5;
    const steepTime = baseTime + increment;
    this.setData({
      brewSteep: nextSteep,
      brewTimeLeft: steepTime,
      brewTotalTime: steepTime,
      brewRunning: false,
      brewFinished: false
    });
    this._updateBrewUI();
  },

  // 重置计时器
  onResetBrewTimer() {
    if (this._brewTimer) {
      clearInterval(this._brewTimer);
      this._brewTimer = null;
    }
    if (!this.data.tea || !this.data.tea.brewing) return;
    const brewing = this.data.tea.brewing;
    const firstSteep = brewing.firstSteep || 30;
    this.setData({
      brewSteep: 1,
      brewTimeLeft: firstSteep,
      brewTotalTime: firstSteep,
      brewRunning: false,
      brewFinished: false,
      brewHistory: []
    });
    this._updateBrewUI();
  },

  // 页面卸载时清理计时器
  onUnload() {
    if (this._brewTimer) {
      clearInterval(this._brewTimer);
      this._brewTimer = null;
    }
  },

  // ========= 笔记功能 =========

  onOpenNoteInput() {
    this.setData({ showNoteInput: true });
  },
  onCloseNoteInput() {
    this.setData({ showNoteInput: false });
  },
  onNoteInput(e) {
    this.setData({ noteText: e.detail.value });
  },
  onSaveNote() {
    const { id, noteText, tea } = this.data;
    if (!noteText.trim()) {
      wx.showToast({ title: '笔记内容不能为空', icon: 'none' });
      return;
    }
    const title = tea ? tea.name : '';
    const note = notes.saveNote(id, noteText.trim(), title);
    this.setData({
      note: note,
      noteEditTime: notes.formatTime(note.updatedAt),
      showNoteInput: false
    });
    wx.showToast({ title: '笔记已保存', icon: 'success' });
  },
  onDeleteNote() {
    const { id } = this.data;
    wx.showModal({
      title: '提示',
      content: '确定删除这条笔记吗？',
      success: (res) => {
        if (res.confirm) {
          notes.deleteNote(id);
          this.setData({ note: null, noteText: '', noteEditTime: '', showNoteInput: false });
          wx.showToast({ title: '笔记已删除', icon: 'none' });
        }
      }
    });
  },

  // 跳转到推荐茶品
  onRecommendTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTeaDetail(id);
  },

  onShareAppMessage() {
    const tea = this.data.tea || {};
    return {
      title: `${tea.name || '妙不可园茶品'} · ${tea.origin || ''}`,
      path: `/subpackages/detail/tea-detail/tea-detail?id=${this.data.id}`
    };
  },

  onShareTimeline() {
    const tea = this.data.tea || {};
    return { title: `${tea.name || '妙不可园茶品'}` };
  },

  // 生成分享海报
  onGeneratePoster() {
    if (this.data.generatingPoster) return;
    this.setData({ generatingPoster: true });
    wx.showLoading({ title: '生成海报中...' });

    poster.generateTeaPoster(this.data.tea, { note: this.data.noteText }).then(tempFilePath => {
      wx.hideLoading();
      this.setData({ generatingPoster: false });

      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          wx.showToast({ title: '海报已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          if (err.errMsg.includes('deny') || err.errMsg.includes('auth')) {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存图片到相册',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting();
                }
              }
            });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      });
    }).catch(err => {
      wx.hideLoading();
      this.setData({ generatingPoster: false });
      wx.showToast({ title: '生成海报失败', icon: 'none' });
      console.error('Poster generation failed:', err);
    });
  },

});
