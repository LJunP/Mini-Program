const mock = require('../../../utils/mock.js');
const collection = require('../../../services/collection.js');
const tracker = require('../../../utils/tracker.js');
const notes = require('../../../utils/notes.js');
const persona = require('../../../utils/persona.js');
const historyService = require('../../../services/history.js');

// service 层调用（mock 模式下内部自动走 mockHandler）
function getStudyDetail(domain, id) {
  // 由于 study 内容目前无独立 service，统一走 mock
  // 后端就绪后替换为真实 API 调用
  if (domain === 'knowledge') {
    return Promise.resolve({ data: mock.getKnowledgeById(id) });
  }
  return Promise.resolve({ data: mock.getTutorialById(id) });
}

const DOMAIN_META = {
  tutorial: {
    label: '教程',
    color: '#3B6D11'
  },
  knowledge: {
    label: '科普',
    color: '#4A6B7C'
  }
};

Page({
  data: {
    id: '',
    domain: 'tutorial',
    meta: DOMAIN_META.tutorial,
    detail: null,
    isCollected: false,
    note: null,
    noteText: '',
    showNoteInput: false,
    noteEditTime: ''
  },

  onLoad(query) {
    const id = query.id || '';
    const domain = query.domain === 'knowledge' ? 'knowledge' : 'tutorial';
    this.setData({ id, domain, meta: DOMAIN_META[domain] });
    this._loadDetail(id, domain);
    tracker.track('page_view', {
      page_path: 'subpackages/detail/study-detail/study-detail',
      target_domain: domain,
      target_ref_id: id
    });
  },

  _loadDetail(id, domain) {
    const meta = DOMAIN_META[domain];
    getStudyDetail(domain, id).then(res => {
      const detail = res.data;
      if (!detail) {
        wx.showToast({ title: '内容不存在', icon: 'none' });
        return;
      }
      this.setData({ detail, isCollected: collection.isCollected(domain, id) });
      // 记录浏览行为和历史
      persona.trackBrowse(domain, id, detail.title || '');
      historyService.addHistoryRecord({ domain, refId: id, name: detail.title || '' });
      // 加载笔记
      const note = notes.getNote(id);
      this.setData({
        note: note,
        noteText: note ? note.content : '',
        noteEditTime: note ? notes.formatTime(note.updatedAt) : ''
      });
    });
  },

  onShow() {
    if (this.data.id) {
      this.setData({ isCollected: collection.isCollected(this.data.domain, this.data.id) });
    }
  },

  onToggleCollect() {
    const { id, domain, detail, isCollected } = this.data;
    if (isCollected) {
      collection.remove(domain, id).then(() => {
        this.setData({ isCollected: false });
        wx.showToast({ title: '已移出书签', icon: 'none' });
      });
    } else {
      collection.add(domain, id, detail.title).then(() => {
        this.setData({ isCollected: true });
        wx.showToast({ title: '已加入书签', icon: 'success' });
      });
    }
  },

  onShareAppMessage() {
    const d = this.data.detail || {};
    return {
      title: d.title || '学习详情',
      path: `/subpackages/detail/study-detail/study-detail?id=${this.data.id}&domain=${this.data.domain}`
    };
  },

  onShareTimeline() {
    const d = this.data.detail || {};
    return { title: d.title || '学习详情' };
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
    const { id, noteText, detail } = this.data;
    if (!noteText.trim()) {
      wx.showToast({ title: '笔记内容不能为空', icon: 'none' });
      return;
    }
    const title = detail ? detail.title : '';
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
          this.setData({
            note: null,
            noteText: '',
            noteEditTime: '',
            showNoteInput: false
          });
          wx.showToast({ title: '笔记已删除', icon: 'none' });
        }
      }
    });
  }
});