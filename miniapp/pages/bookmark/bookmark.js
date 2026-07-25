// pages/bookmark/bookmark.js
// 风雅书签：按板块分组的收藏列表 + 搜索 + 排序 + 内容预览
const collection = require('../../services/collection.js');
const router = require('../../utils/router.js');
const tracker = require('../../utils/tracker.js');
const mock = require('../../utils/mock.js');

function getCoverColor(domain) {
  return collection.getDomainMeta(domain).color;
}

Page({
  data: {
    tabs: [
      { key: 'all',      name: '全部' },
      { key: 'tea',      name: '茶' },
      { key: 'travel',   name: '游' },
      { key: 'wellness', name: '养' },
      { key: 'incense',  name: '香' },
      { key: 'music',    name: '音' },
      { key: 'film',     name: '影' },
      { key: 'tutorial', name: '教程' },
      { key: 'knowledge', name: '科普' },
      { key: 'interview', name: '面试' }
    ],
    currentTab: 'all',
    groups: [],
    totalCount: 0,
    coverColor: '#3B6D11',
    // 搜索
    searchKeyword: '',
    searchResults: [],
    isSearching: false,
    // 排序选项
    sortBy: 'time',
    sortOptions: [
      { key: 'time', name: '按时间' },
      { key: 'name', name: '按名称' },
      { key: 'domain', name: '按板块' }
    ],
    showSortOptions: false
  },

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/bookmark/bookmark' });
  },

  onShow() {
    this._loadGroups();
  },

  onPullDownRefresh() {
    this._loadGroups();
    setTimeout(() => wx.stopPullDownRefresh(), 1000);
  },

  _loadGroups() {
    collection.getGroups(this.data.currentTab).then(res => {
      // 格式化时间并添加内容预览，同时保留原始时间戳用于排序
      const groups = (res.groups || []).map(g => Object.assign({}, g, {
        items: g.items.map(it => Object.assign({}, it, {
          created_at: _formatDate(it.created_at),
          _raw_time: it.created_at || '',
          preview: this._getContentPreview(g.domain, it.target_ref_id)
        }))
      }));

      // 应用排序
      const sortedGroups = this._sortGroups(groups);

      this.setData({
        groups: sortedGroups,
        totalCount: res.total_count,
        coverColor: getCoverColor(this.data.currentTab)
      });
    });
  },

  // 获取内容预览
  _getContentPreview(domain, refId) {
    try {
      let item = null;
      let summaryField = '';
      
      if (domain === 'tea') {
        item = mock.getTeaById(refId);
        summaryField = 'description';
      } else if (domain === 'travel') {
        item = mock.getTravelById(refId);
        summaryField = 'essay';
      } else if (domain === 'wellness') {
        item = mock.getWellnessById(refId);
        summaryField = 'body';
      } else if (domain === 'incense') {
        item = mock.getIncenseById(refId);
        summaryField = 'body';
      } else if (domain === 'music') {
        item = mock.getMusicById(refId);
        summaryField = 'body';
      } else if (domain === 'film') {
        item = mock.getFilmById(refId);
        summaryField = 'body';
      } else if (domain === 'tutorial') {
        item = mock.getTutorialById(refId);
        summaryField = 'summary';
      } else if (domain === 'knowledge') {
        item = mock.getKnowledgeById(refId);
        summaryField = 'summary';
      } else if (domain === 'interview') {
        item = mock.getInterviewQuestionById(refId);
        summaryField = 'answer';
      }

      if (item && item[summaryField]) {
        const text = String(item[summaryField]).replace(/<[^>]+>/g, '').trim();
        return text.length > 60 ? text.slice(0, 60) + '...' : text;
      }
    } catch (e) {
      // ignore
    }
    return '';
  },

  // 排序分组
  _sortGroups(groups) {
    const sortBy = this.data.sortBy;

    if (sortBy === 'time') {
      return groups.map(g => Object.assign({}, g, {
        items: g.items.sort((a, b) => new Date(b._raw_time || b.created_at) - new Date(a._raw_time || a.created_at))
      }));
    } else if (sortBy === 'name') {
      return groups.map(g => Object.assign({}, g, {
        items: g.items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }));
    } else if (sortBy === 'domain') {
      return groups.sort((a, b) => (a.domain_name || '').localeCompare(b.domain_name || ''));
    }

    return groups;
  },

  // 搜索
  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchKeyword: value });

    if (!value.trim()) {
      this.setData({ isSearching: false, searchResults: [] });
      return;
    }

    // 防抖 300ms
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this._doSearch(value.trim());
    }, 300);
  },

  onSearchClear() {
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    }
    this.setData({ searchKeyword: '', isSearching: false, searchResults: [] });
  },

  _doSearch(keyword) {
    const allItems = [];
    this.data.groups.forEach(g => {
      g.items.forEach(item => {
        allItems.push({
          ...item,
          domain: g.domain,
          domain_name: g.domain_name,
          color: g.color,
          short_name: g.short_name
        });
      });
    });

    const lowerKey = keyword.toLowerCase();
    const results = allItems.filter(item => {
      const name = (item.name || '').toLowerCase();
      const note = (item.note || '').toLowerCase();
      const preview = (item.preview || '').toLowerCase();
      return name.includes(lowerKey) || note.includes(lowerKey) || preview.includes(lowerKey);
    });

    this.setData({ isSearching: true, searchResults: results });
  },

  // 切换排序方式
  onSortChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ sortBy: key, showSortOptions: false });
    this._loadGroups();
  },

  // 显示/隐藏排序选项
  onToggleSort() {
    this.setData({ showSortOptions: !this.data.showSortOptions });
  },

  onTabTap(e) {
    const { key } = e.currentTarget.dataset;
    if (key === this.data.currentTab) return;
    this.setData({
      currentTab: key,
      coverColor: getCoverColor(key),
      searchKeyword: '',
      isSearching: false
    });
    this._loadGroups();
  },

  // 点击收藏项跳转
  onItemTap(e) {
    const { domain, refId } = e.currentTarget.dataset;
    if (domain === 'tea') router.goTeaDetail(refId);
    else if (domain === 'travel') router.goTravelDetail(refId);
    else if (domain === 'wellness') router.goContentDetail(refId, 'wellness');
    else if (domain === 'incense') router.goContentDetail(refId, 'incense');
    else if (domain === 'music') router.goContentDetail(refId, 'music');
    else if (domain === 'film') router.goContentDetail(refId, 'film');
    else if (domain === 'tutorial') router.navigate('/subpackages/detail/study-detail/study-detail', { id: refId, domain: 'tutorial' });
    else if (domain === 'knowledge') router.navigate('/subpackages/detail/study-detail/study-detail', { id: refId, domain: 'knowledge' });
    else if (domain === 'interview') router.navigate('/subpackages/detail/question-detail/question-detail', { id: refId });
  },

  // 移除收藏
  onRemove(e) {
    const { domain, refId } = e.currentTarget.dataset;
    wx.showModal({
      title: '移出书签',
      content: '确定将该项移出书签？',
      success: (res) => {
        if (res.confirm) {
          collection.remove(domain, refId).then(() => {
            wx.showToast({ title: '已移出', icon: 'success' });
            this._loadGroups();
          });
        }
      }
    });
  },

  onShareAppMessage() {
    return { title: '我的风雅书签', path: '/pages/bookmark/bookmark' };
  },

  onShareTimeline() {
    return { title: '我的书签 · 妙不可园' };
  }
});

function _formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  } catch (e) {
    return '';
  }
}
