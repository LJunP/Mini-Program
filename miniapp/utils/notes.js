// utils/notes.js
// 内容笔记系统 - 本地存储，按内容ID管理笔记

const STORAGE_PREFIX = 'notes_';

/**
 * 获取某个内容的笔记
 * @param {string} contentId - 内容ID
 * @returns {Object|null} 笔记对象 { content, updatedAt } 或 null
 */
function getNote(contentId) {
  if (!contentId) return null;
  try {
    return wx.getStorageSync(STORAGE_PREFIX + contentId) || null;
  } catch (e) {
    console.warn('[notes] getNote failed', e);
    return null;
  }
}

/**
 * 保存笔记
 * @param {string} contentId - 内容ID
 * @param {string} content - 笔记内容
 * @param {string} title - 内容标题（用于列表展示）
 */
function saveNote(contentId, content, title) {
  if (!contentId) return;
  const note = {
    contentId,
    content,
    title: title || '',
    updatedAt: Date.now()
  };
  try {
    wx.setStorageSync(STORAGE_PREFIX + contentId, note);
    // 同时维护一个笔记ID列表
    const ids = getNoteIds();
    if (ids.indexOf(contentId) === -1) {
      ids.push(contentId);
      wx.setStorageSync('notes_index', ids);
    }
  } catch (e) {
    console.warn('[notes] saveNote failed', e);
  }
  return note;
}

/**
 * 删除笔记
 * @param {string} contentId - 内容ID
 */
function deleteNote(contentId) {
  if (!contentId) return;
  try {
    wx.removeStorageSync(STORAGE_PREFIX + contentId);
    const ids = getNoteIds();
    const idx = ids.indexOf(contentId);
    if (idx >= 0) {
      ids.splice(idx, 1);
      wx.setStorageSync('notes_index', ids);
    }
  } catch (e) {
    console.warn('[notes] deleteNote failed', e);
  }
}

/**
 * 获取所有笔记ID
 */
function getNoteIds() {
  try {
    return wx.getStorageSync('notes_index') || [];
  } catch (e) {
    return [];
  }
}

/**
 * 获取所有笔记列表
 */
function getAllNotes() {
  const ids = getNoteIds();
  return ids.map(id => getNote(id)).filter(Boolean);
}

/**
 * 格式化时间戳为显示文本
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return Math.floor(diff / (60 * 1000)) + '分钟前';
  if (diff < day) return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
  if (diff < 7 * day) return Math.floor(diff / day) + '天前';
  
  const date = new Date(timestamp);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

module.exports = {
  getNote,
  saveNote,
  deleteNote,
  getNoteIds,
  getAllNotes,
  formatTime
};
