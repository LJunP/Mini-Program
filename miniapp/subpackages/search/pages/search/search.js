// subpackages/search/pages/search/search.js
// 搜索页：支持搜索茶品、行旅、养生、香道、音乐、电影内容
const router = require('../../../../utils/router.js');
const tracker = require('../../../../utils/tracker.js');
const searchEngine = require('../../../../utils/search-engine.js');
const searchService = require('../../../../services/search.js');

// 排序选项配置
const SORT_OPTIONS = [
  { key: 'relevance', name: '相关度' },
  { key: 'time', name: '最新' },
  { key: 'popularity', name: '最热' },
  { key: 'difficulty', name: '难度' }
];

// 茶类选项
const TEA_CATEGORIES = [
  { key: 'all', name: '全部' },
  { key: 'green', name: '绿茶' },
  { key: 'white', name: '白茶' },
  { key: 'yellow', name: '黄茶' },
  { key: 'oolong', name: '青茶' },
  { key: 'black', name: '红茶' },
  { key: 'dark', name: '黑茶' }
];

// 价格选项（适用于香道）
const PRICE_OPTIONS = [
  { key: 'all', name: '全部' },
  { key: '平价', name: '平价' },
  { key: '中端', name: '中端' },
  { key: '高端', name: '高端' },
  { key: '顶级', name: '顶级' }
];

// 难度选项
const DIFFICULTY_OPTIONS = [
  { key: 0, name: '全部' },
  { key: 1, name: '入门' },
  { key: 2, name: '初级' },
  { key: 3, name: '中级' },
  { key: 4, name: '高级' },
  { key: 5, name: '专家' }
];

Page({
  data: {
    keyword: '',
    activeTab: 'all',
    tabs: [
      { key: 'all', name: '全部' },
      { key: 'tea', name: '茶' },
      { key: 'travel', name: '游' },
      { key: 'wellness', name: '养' },
      { key: 'incense', name: '香' },
      { key: 'music', name: '音' },
      { key: 'film', name: '影' }
    ],
    results: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
    // 显示的结果（分页加载，初始每类最多显示 10 条）
    displayResults: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
    // 混合排序结果（全部Tab使用）
    mixedResults: [],
    displayMixedResults: [],
    hasSearched: false,
    totalCount: 0,
    // 每类初始显示数量
    pageSize: 10,
    // 热门搜索词
    hotKeywords: ['龙井', '岩茶', '武夷山', '春季养生', '助眠', '碧螺春', '古琴', '沉香'],
    // 搜索历史
    searchHistory: [],
    // 搜索建议
    suggestions: [],
    showSuggestions: false,
    // 筛选条件
    filters: {
      sortBy: 'relevance',
      difficulty: 0,
      priceRange: 'all',
      teaCategory: 'all'
    },
    showFilters: false,
    loadingMoreDomain: '',
    loadingMoreMixed: false,
    // 筛选选项配置（传入 WXML）
    sortOptions: SORT_OPTIONS,
    teaCategories: TEA_CATEGORIES,
    priceOptions: PRICE_OPTIONS,
    difficultyOptions: DIFFICULTY_OPTIONS,
    // 当前搜索的 debounce timer（使用实例属性，避免触发 setData）
    // _inputTimer: null  — moved to this._inputTimer
  },

  onLoad(options) {
    tracker.track('page_view', { page_path: 'subpackages/search/pages/search/search' });
    // 加载搜索历史
    const history = wx.getStorageSync('search_history') || [];
    this.setData({ searchHistory: history });

    // 如果从外部带入关键词
    if (options && options.keyword) {
      this.setData({ keyword: options.keyword });
      this._doSearch(options.keyword);
    }
  },

  onUnload() {
    // 清理 timer
    if (this._inputTimer) {
      clearTimeout(this._inputTimer);
      this._inputTimer = null;
    }
  },

  // 输入关键词（带防抖的搜索建议）
  onInput(e) {
    const value = e.detail.value;
    this.setData({ keyword: value });

    // 清除上一次 timer
    if (this._inputTimer) {
      clearTimeout(this._inputTimer);
      this._inputTimer = null;
    }

    if (!value.trim()) {
      this.setData({
        suggestions: [],
        showSuggestions: false,
        hasSearched: false,
        results: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
        displayResults: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
        totalCount: 0
      });
      return;
    }

    // 300ms 防抖后显示搜索建议
    const timer = setTimeout(() => {
      searchService.getSuggestions(
        value.trim(),
        this.data.hotKeywords,
        this.data.searchHistory
      ).then(res => {
        const suggestions = res.data || [];
        this.setData({ suggestions, showSuggestions: suggestions.length > 0 });
      }).catch(err => {
        console.warn('[search] get suggestions failed', err);
      });
    }, 300);

    this._inputTimer = timer;
  },

  // 确认搜索
  onSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      this.setData({
        hasSearched: false,
        results: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
        totalCount: 0,
        showSuggestions: false
      });
      return;
    }
    this.setData({ showSuggestions: false });
    this._doSearch(keyword);
    this._saveSearchHistory(keyword);
    tracker.track('search', {
      event_params: { keyword, filters: this.data.filters },
      page_path: 'subpackages/search/pages/search/search'
    });
  },

  // 点击搜索建议
  onSuggestionTap(e) {
    const { word } = e.currentTarget.dataset;
    this.setData({ keyword: word, showSuggestions: false });
    this._doSearch(word);
    this._saveSearchHistory(word);
  },

  // 点击热门词
  onHotTap(e) {
    const { word } = e.currentTarget.dataset;
    this.setData({ keyword: word });
    this._doSearch(word);
    this._saveSearchHistory(word);
  },

  // 清空
  onClear() {
    this.setData({
      keyword: '',
      hasSearched: false,
      results: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
      displayResults: { tea: [], travel: [], wellness: [], incense: [], music: [], film: [] },
      totalCount: 0,
      suggestions: [],
      showSuggestions: false
    });
  },

  // 保存搜索历史
  _saveSearchHistory(keyword) {
    let history = this.data.searchHistory || [];
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    this.setData({ searchHistory: history });
    try {
      wx.setStorageSync('search_history', history);
    } catch (e) {
      console.warn('[search] save history failed', e);
    }
  },

  // 清空搜索历史
  onClearHistory() {
    this.setData({ searchHistory: [] });
    try {
      wx.removeStorageSync('search_history');
    } catch (e) {}
    wx.showToast({ title: '已清空历史', icon: 'none' });
  },

  // 删除单条历史记录
  onDeleteHistory(e) {
    const { word } = e.currentTarget.dataset;
    let history = this.data.searchHistory || [];
    history = history.filter(item => item !== word);
    this.setData({ searchHistory: history });
    try {
      wx.setStorageSync('search_history', history);
    } catch (e) {}
  },

  // 点击历史记录
  onHistoryTap(e) {
    const { word } = e.currentTarget.dataset;
    this.setData({ keyword: word });
    this._doSearch(word);
    this._saveSearchHistory(word);
  },

  // 显示/隐藏筛选面板
  onToggleFilters() {
    this.setData({ showFilters: !this.data.showFilters });
  },

  // 修改筛选条件（通用）
  onFilterChange(e) {
    const { type, value } = e.currentTarget.dataset;
    const filters = { ...this.data.filters };

    // 根据类型转换值
    if (type === 'difficulty') {
      filters[type] = parseInt(value, 10);
    } else {
      filters[type] = value;
    }

    this.setData({ filters });

    // 如果已搜索，则重新搜索
    if (this.data.hasSearched && this.data.keyword) {
      this._doSearch(this.data.keyword);
    }
  },

  // 核心搜索逻辑
  _doSearch(keyword) {
    const filters = this.data.filters;

    wx.showLoading({ title: '搜索中...' });

    searchService.searchAll(keyword, filters, filters.sortBy).then(res => {
      wx.hideLoading();
      const payload = res.data || {};
      const teaResults = payload.tea || [];
      const travelResults = payload.travel || [];
      const wellnessResults = payload.wellness || [];
      const incenseResults = payload.incense || [];
      const musicResults = payload.music || [];
      const filmResults = payload.film || [];

      // 为搜索结果添加高亮摘要
      const processResults = (items, domain) => {
        return items.map(item => {
          const summary = _getSummary(item, domain);
          const highlighted = searchEngine.highlightText(summary, keyword, 40);
          return { ...item, _summary: summary, _highlighted: highlighted };
        });
      };

      const results = {
        tea: processResults(teaResults, 'tea'),
        travel: processResults(travelResults, 'travel'),
        wellness: processResults(wellnessResults, 'wellness'),
        incense: processResults(incenseResults, 'incense'),
        music: processResults(musicResults, 'music'),
        film: processResults(filmResults, 'film')
      };

      // 混合排序：将所有结果合并并按相关度排序
      const mixedResults = this._buildMixedResults(results, keyword);

      // 分页显示：初始每类最多显示 pageSize 条
      const pageSize = this.data.pageSize;
      const displayResults = {
        tea: results.tea.slice(0, pageSize),
        travel: results.travel.slice(0, pageSize),
        wellness: results.wellness.slice(0, pageSize),
        incense: results.incense.slice(0, pageSize),
        music: results.music.slice(0, pageSize),
        film: results.film.slice(0, pageSize)
      };

      const displayMixedResults = mixedResults.slice(0, pageSize * 2);

      const totalCount = results.tea.length + results.travel.length +
        results.wellness.length + results.incense.length +
        results.music.length + results.film.length;

      this.setData({
        results,
        mixedResults,
        displayResults,
        displayMixedResults,
        hasSearched: true,
        totalCount,
        showSuggestions: false
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '搜索失败', icon: 'none' });
      console.warn('[search] search failed', err);
    });
  },

  // 加载更多某个板块的结果
  onLoadMoreDomain(e) {
    const { domain } = e.currentTarget.dataset;
    const { results, displayResults, pageSize } = this.data;
    const currentLen = displayResults[domain].length;
    const totalLen = results[domain].length;
    
    if (currentLen >= totalLen) return;
    
    this.setData({ loadingMoreDomain: domain });
    
    setTimeout(() => {
      const newLen = Math.min(currentLen + pageSize, totalLen);
      const newItems = results[domain].slice(currentLen, newLen);
      
      // 使用路径更新追加
      const pathUpdate = { loadingMoreDomain: '' };
      newItems.forEach((item, i) => {
        pathUpdate[`displayResults.${domain}[${currentLen + i}]`] = item;
      });
      this.setData(pathUpdate);
    }, 200);
  },

  // 加载更多混合结果
  onLoadMoreMixed() {
    const { mixedResults, displayMixedResults, pageSize } = this.data;
    const currentLen = displayMixedResults.length;
    const totalLen = mixedResults.length;
    
    if (currentLen >= totalLen) return;
    
    this.setData({ loadingMoreMixed: true });
    
    setTimeout(() => {
      const newLen = Math.min(currentLen + pageSize * 2, totalLen);
      const newItems = mixedResults.slice(currentLen, newLen);
      
      this.setData({
        displayMixedResults: this.data.displayMixedResults.concat(newItems),
        loadingMoreMixed: false
      });
    }, 200);
  },

  // 构建混合排序结果
  _buildMixedResults(results, keyword) {
    const allItems = [];
    const lowerKey = keyword.toLowerCase();

    // 将所有领域结果合并，添加领域标识和相关度分数
    const domainConfigs = [
      { domain: 'tea', list: results.tea, color: '#3B6D11', char: '茶', nameField: 'name' },
      { domain: 'travel', list: results.travel, color: '#5B8C85', char: '游', nameField: 'title' },
      { domain: 'wellness', list: results.wellness, color: '#A0522D', char: '养', nameField: 'title' },
      { domain: 'incense', list: results.incense, color: '#8B6F47', char: '香', nameField: 'title' },
      { domain: 'music', list: results.music, color: '#4A6B7C', char: '音', nameField: 'title' },
      { domain: 'film', list: results.film, color: '#2C2C2A', char: '影', nameField: 'title' }
    ];

    domainConfigs.forEach(config => {
      config.list.forEach(item => {
        const name = (item[config.nameField] || '').toLowerCase();
        const summary = (item._summary || '').toLowerCase();
        
        // 计算相关度：标题匹配 > 摘要匹配
        let score = 0;
        if (name.includes(lowerKey)) score += 10;
        if (name.startsWith(lowerKey)) score += 5;
        if (summary.includes(lowerKey)) score += 3;

        allItems.push({
          ...item,
          _domain: config.domain,
          _color: config.color,
          _char: config.char,
          _score: score,
          _displayName: item[config.nameField] || ''
        });
      });
    });

    // 按相关度排序
    allItems.sort((a, b) => b._score - a._score);

    return allItems;
  },

  // tab 切换
  onTabTap(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ activeTab: key });
  },

  // 跳转
  onTeaTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTeaDetail(id);
  },
  onTravelTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goTravelDetail(id);
  },
  onWellnessTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goContentDetail(id, 'wellness');
  },
  onIncenseTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goContentDetail(id, 'incense');
  },
  onMusicTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goContentDetail(id, 'music');
  },
  onFilmTap(e) {
    const { id } = e.currentTarget.dataset;
    router.goContentDetail(id, 'film');
  },

  onShareAppMessage() {
    return {
      title: '妙不可园 · 搜索',
      path: '/subpackages/search/pages/search/search'
    };
  }
});

// ============================================================
// 辅助函数（页面外定义，不参与 setData）
// ============================================================

/**
 * 获取条目的摘要文本（用于搜索结果展示）
 */
function _getSummary(item, domain) {
  switch (domain) {
    case 'tea':
      return item.description || '';
    case 'travel':
      return item.essay || '';
    case 'wellness':
      return item.body || '';
    case 'incense':
      return item.body || '';
    case 'music':
      return item.body || '';
    case 'film':
      return item.body || '';
    default:
      return '';
  }
}
