// utils/mock.js — Mock 数据加载器
// MVP 阶段从内联数据读取，不依赖后端。
// 后端接入后：保留接口签名，内部替换为 request.js 调用即可。

// 导入内联数据
const dataStore = require('./data-store.js');
const studyProgress = require('./study-progress.js');
const config = require('./config.js');

// 内存缓存（避免重复的 filter/map 操作）
let _teasCache = null;
let _travelsCache = null;
let _wellnessCache = null;
let _incenseCache = null;
let _musicCache = null;
let _filmCache = null;
let _tutorialsCache = null;
let _knowledgeCache = null;
let _interviewQuestionsCache = null;
let _loadedTopics = {};

function getStudyTaxonomy() {
  return dataStore.studyTaxonomy || {
    tutorialCategories: [],
    knowledgeCategories: [],
    interviewTypes: [],
    interviewTracks: [],
    interviewTopics: []
  };
}

/**
 * 加载茶品列表
 * @returns {Array} 茶品数组
 */
function loadTeas() {
  if (_teasCache) return _teasCache;
  _teasCache = dataStore.teas.map(t => ({
    ...t,
    coverImage: config.getImageUrl(t.coverImage)
  }));
  return _teasCache;
}

/**
 * 加载行旅列表
 */
function loadTravels() {
  if (_travelsCache) return _travelsCache;
  _travelsCache = dataStore.travels.map(t => ({
    ...t,
    coverImage: config.getImageUrl(t.coverImage)
  }));
  return _travelsCache;
}

/**
 * 加载养生列表
 */
function loadWellness() {
  if (_wellnessCache) return _wellnessCache;
  _wellnessCache = dataStore.wellness.map(w => ({
    ...w,
    coverImage: config.getImageUrl(w.coverImage)
  }));
  return _wellnessCache;
}

/**
 * 加载香道列表
 */
function loadIncense() {
  if (_incenseCache) return _incenseCache;
  _incenseCache = dataStore.incense.map(i => ({
    ...i,
    coverImage: config.getImageUrl(i.coverImage)
  }));
  return _incenseCache;
}

/**
 * 加载音乐列表
 */
function loadMusic() {
  if (_musicCache) return _musicCache;
  _musicCache = dataStore.music.map((m, index) => {
    // 无音频源时留空，详情页会显示"音频筹备中"占位
    return {
      ...m,
      audioSrc: m.audioSrc ? config.getAudioUrl(m.audioSrc) : '',
      coverImage: config.getImageUrl(m.coverImage)
    };
  });
  return _musicCache;
}

/**
 * 加载电影列表
 */
function loadFilm() {
  if (_filmCache) return _filmCache;
  _filmCache = dataStore.film.map(f => ({
    ...f,
    coverImage: config.getImageUrl(f.coverImage)
  }));
  return _filmCache;
}

/**
 * 加载教程列表
 */
function loadTutorials() {
  if (_tutorialsCache) return _tutorialsCache;

  let cached = null;
  try {
    cached = wx.getStorageSync('local_study_tutorials');
  } catch (e) {}

  const rawTutorials = cached ? cached : (dataStore.tutorials || []);
  _tutorialsCache = rawTutorials.map(t => ({
    ...t,
    coverImage: config.getImageUrl(t.coverImage)
  }));
  return _tutorialsCache;
}

/**
 * 加载知识科普列表
 */
function loadKnowledge() {
  if (_knowledgeCache) return _knowledgeCache;

  let cached = null;
  try {
    cached = wx.getStorageSync('local_study_knowledge');
  } catch (e) {}

  const rawKnowledge = cached ? cached : (dataStore.knowledge || []);
  _knowledgeCache = rawKnowledge.map(k => ({
    ...k,
    coverImage: config.getImageUrl(k.coverImage)
  }));
  return _knowledgeCache;
}

/**
 * 加载面试题列表
 */
function loadInterviewQuestions(topic = 'all') {
  if (topic && topic !== 'all') {
    if (_loadedTopics[topic]) return _loadedTopics[topic];

    let cachedTopicQuestions = null;
    try {
      cachedTopicQuestions = wx.getStorageSync(`local_study_topic_${topic}`);
    } catch (e) {}

    if (cachedTopicQuestions) {
      _loadedTopics[topic] = cachedTopicQuestions;
      return _loadedTopics[topic];
    }

    try {
      _loadedTopics[topic] = require('../data/study/topics/interview-' + topic + '.js') || [];
    } catch (e) {
      console.warn('[mock] failed to load topic:', topic, e);
      _loadedTopics[topic] = [];
    }
    return _loadedTopics[topic];
  }

  const { interviewTopics } = require('../data/study/taxonomy.js');
  let allQuestions = [];
  interviewTopics.forEach(t => {
    const topicKey = t.key;
    if (!_loadedTopics[topicKey]) {
      let cachedTopicQuestions = null;
      try {
        cachedTopicQuestions = wx.getStorageSync(`local_study_topic_${topicKey}`);
      } catch (e) {}

      if (cachedTopicQuestions) {
        _loadedTopics[topicKey] = cachedTopicQuestions;
      } else {
        try {
          _loadedTopics[topicKey] = require('../data/study/topics/interview-' + topicKey + '.js') || [];
        } catch (e) {
          _loadedTopics[topicKey] = [];
        }
      }
    }
    allQuestions = allQuestions.concat(_loadedTopics[topicKey]);
  });
  _interviewQuestionsCache = allQuestions;
  return allQuestions;
}

/**
 * 按 ID 获取茶品
 */
function getTeaById(id) {
  const list = loadTeas();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取行旅
 */
function getTravelById(id) {
  const list = loadTravels();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取养生内容
 */
function getWellnessById(id) {
  const list = loadWellness();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取香道内容
 */
function getIncenseById(id) {
  const list = loadIncense();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取音乐内容
 */
function getMusicById(id) {
  const list = loadMusic();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取电影内容
 */
function getFilmById(id) {
  const list = loadFilm();
  return list.find(t => t.id === id) || null;
}

/**
 * 按 ID 获取教程
 */
function getTutorialById(id) {
  return loadTutorials().find(t => t.id === id) || null;
}

/**
 * 按 ID 获取知识科普
 */
function getKnowledgeById(id) {
  return loadKnowledge().find(t => t.id === id) || null;
}

/**
 * 按 ID 获取面试题
 */
function getInterviewQuestionById(id) {
  for (const t in _loadedTopics) {
    const q = _loadedTopics[t].find(x => x.id === id);
    if (q) return q;
  }
  return loadInterviewQuestions('all').find(t => t.id === id) || null;
}

/**
 * 按茶类筛选茶品
 * @param {string} category green/white/yellow/oolong/black/dark
 */
function getTeasByCategory(category) {
  if (!category || category === 'all') return loadTeas();
  return loadTeas().filter(t => t.category === category);
}

/**
 * 按分类筛选养生内容
 * @param {string} category seasonal/organ/habit/elegant
 */
function getWellnessByCategory(category) {
  if (!category || category === 'all') return loadWellness();
  return loadWellness().filter(t => t.category === category);
}

function filterStudyItems(list, filters) {
  filters = filters || {};
  let result = list.filter(item => {
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.track && filters.track !== 'all' && item.track !== filters.track) return false;
    if (filters.topic && filters.topic !== 'all' && item.topic !== filters.topic) return false;
    if (filters.difficulty && Number(item.difficulty) !== Number(filters.difficulty)) return false;
    if (filters.tag && !(item.tags || item.keyPoints || []).includes(filters.tag)) return false;
    return true;
  });

  if (filters.keyword && filters.keyword.trim()) {
    const k = filters.keyword.toLowerCase().trim();
    const searchEngine = require('./search-engine.js');
    result = result.filter(item => {
      if (searchEngine.scoreText(item.title, k) > 0) return true;
      if (item.question && searchEngine.scoreText(item.question, k) > 0) return true;
      if (item.keyPoints && item.keyPoints.some(kp => searchEngine.scoreText(kp, k) > 0)) return true;
      return false;
    });
  }

  return result;
}

function getTutorials(filters) {
  return filterStudyItems(loadTutorials(), filters);
}

function getKnowledgeList(filters) {
  return filterStudyItems(loadKnowledge(), filters);
}

function getInterviewQuestions(filters) {
  filters = filters || {};
  return filterStudyItems(loadInterviewQuestions(filters.topic), filters);
}

function getStudyProgressMap() {
  return studyProgress.readMap();
}

function getStudyStats() {
  const totalCount = loadTutorials().length + loadKnowledge().length + loadInterviewQuestions().length;
  return studyProgress.getStats(totalCount);
}

function getStudyHome() {
  const tutorials = loadTutorials();
  const knowledge = loadKnowledge();
  const questions = loadInterviewQuestions();
  return {
    modules: [
      { key: 'tutorial', title: '教程', subtitle: '工具使用 · 工程实践 · 编程语言', badge: '文章', color: '#3B6D11', count: tutorials.length },
      { key: 'knowledge', title: '知识科普', subtitle: '人物 · 公司 · 技术史 · 领域地图', badge: '认知', color: '#4A6B7C', count: knowledge.length },
      { key: 'interview', title: '面试学习', subtitle: '八股文 · 场景题 · 系统设计', badge: '题库', color: '#854F0B', count: questions.length }
    ],
    stats: getStudyStats(),
    featured: {
      tutorial: tutorials[0] || null,
      knowledge: knowledge[0] || null,
      interview: questions[0] || null
    },
    review: {
      title: '今日复习',
      summary: '根据掌握、薄弱和错题状态生成复习队列。当前已接入本地学习状态协议。',
      action: '查看复习队列',
      count: getStudyStats().reviewCount
    }
  };
}

/**
 * 六大茶类聚合（带 count）
 */
function getTeaCategories() {
  const list = loadTeas();
  const meta = [
    { key: 'green', name: '绿茶' },
    { key: 'white', name: '白茶' },
    { key: 'yellow', name: '黄茶' },
    { key: 'oolong', name: '青茶' },
    { key: 'black', name: '红茶' },
    { key: 'dark', name: '黑茶' }
  ];
  return meta.map(m => Object.assign({}, m, { count: list.filter(t => t.category === m.key).length }));
}

/**
 * 关联查询：根据 linkedDomains 反查关联对象
 * @param {Array} linkedDomains [{domain, refId, context}]
 * @returns {Array} [{domain, refId, context, entity}]
 */
function resolveLinkedDomains(linkedDomains) {
  if (!Array.isArray(linkedDomains)) return [];
  return linkedDomains.map(link => {
    let entity = null;
    switch (link.domain) {
      case 'tea':
        entity = getTeaById(link.refId);
        break;
      case 'travel':
        entity = getTravelById(link.refId);
        break;
      case 'wellness':
        entity = getWellnessById(link.refId);
        break;
      case 'incense':
        entity = getIncenseById(link.refId);
        break;
      case 'music':
        entity = getMusicById(link.refId);
        break;
      case 'film':
        entity = getFilmById(link.refId);
        break;
      case 'tutorial':
        entity = getTutorialById(link.refId);
        break;
      case 'knowledge':
        entity = getKnowledgeById(link.refId);
        break;
      case 'interview':
        entity = getInterviewQuestionById(link.refId);
        break;
      default:
        entity = null;
    }
    return Object.assign({}, link, { entity });
  }).filter(item => item.entity); // 过滤掉未解析到的
}

/**
 * 反向关联：查询哪些内容关联了指定对象
 * @param {string} targetDomain tea/wellness/incense/music/film/...
 * @param {string} targetRefId tea_001/wellness_001/...
 * @param {string} sourceDomain 可选，限定来源板块
 */
function findReverseLinks(targetDomain, targetRefId, sourceDomain) {
  const results = [];

  // 在行旅内容里反查
  if (!sourceDomain || sourceDomain === 'travel') {
    loadTravels().forEach(t => {
      if (t.linkedDomains && Array.isArray(t.linkedDomains)) {
        const hit = t.linkedDomains.find(l => l.domain === targetDomain && l.refId === targetRefId);
        if (hit) {
          results.push({
            domain: 'travel',
            refId: t.id,
            name: t.title,
            coverImage: t.coverImage || '',
            summary: t.essay ? t.essay.slice(0, 60) : '',
            context: hit.context,
            entity: t
          });
        }
      }
    });
  }

  // 在养生内容里反查
  if (!sourceDomain || sourceDomain === 'wellness') {
    loadWellness().forEach(w => {
      if (w.linkedDomains && Array.isArray(w.linkedDomains)) {
        const hit = w.linkedDomains.find(l => l.domain === targetDomain && l.refId === targetRefId);
        if (hit) {
          results.push({
            domain: 'wellness',
            refId: w.id,
            name: w.title,
            coverImage: '',
            summary: w.body ? w.body.slice(0, 60) : '',
            context: hit.context,
            entity: w
          });
        }
      }
    });
  }

  // 在香道内容里反查
  if (!sourceDomain || sourceDomain === 'incense') {
    loadIncense().forEach(i => {
      if (i.linkedDomains && Array.isArray(i.linkedDomains)) {
        const hit = i.linkedDomains.find(l => l.domain === targetDomain && l.refId === targetRefId);
        if (hit) {
          results.push({
            domain: 'incense',
            refId: i.id,
            name: i.title,
            coverImage: '',
            summary: i.body ? i.body.slice(0, 60) : '',
            context: hit.context,
            entity: i
          });
        }
      }
    });
  }

  // 在音乐内容里反查
  if (!sourceDomain || sourceDomain === 'music') {
    loadMusic().forEach(m => {
      if (m.linkedDomains && Array.isArray(m.linkedDomains)) {
        const hit = m.linkedDomains.find(l => l.domain === targetDomain && l.refId === targetRefId);
        if (hit) {
          results.push({
            domain: 'music',
            refId: m.id,
            name: m.title,
            coverImage: '',
            summary: m.body ? m.body.slice(0, 60) : '',
            context: hit.context,
            entity: m
          });
        }
      }
    });
  }

  // 在电影内容里反查
  if (!sourceDomain || sourceDomain === 'film') {
    loadFilm().forEach(f => {
      if (f.linkedDomains && Array.isArray(f.linkedDomains)) {
        const hit = f.linkedDomains.find(l => l.domain === targetDomain && l.refId === targetRefId);
        if (hit) {
          results.push({
            domain: 'film',
            refId: f.id,
            name: f.title,
            coverImage: '',
            summary: f.body ? f.body.slice(0, 60) : '',
            context: hit.context,
            entity: f
          });
        }
      }
    });
  }

  return results;
}

/**
 * 首页内容流：混合茶品 / 行旅 / 养生 / 香道 / 音乐 / 电影
 * 简单交错排列，保证多样性
 */
function getHomeFeed() {
  const teas = loadTeas();
  const travels = loadTravels();
  const wellness = loadWellness();
  const incense = loadIncense();
  const music = loadMusic();
  const film = loadFilm();

  // 基于日期的确定性随机种子
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  let seed = dayOfYear * 2654435761 % 2147483647;

  const nextRand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // 当前季节
  const month = now.getMonth() + 1;
  let currentSeason = 'spring';
  if (month >= 3 && month <= 5) currentSeason = 'spring';
  else if (month >= 6 && month <= 8) currentSeason = 'summer';
  else if (month >= 9 && month <= 11) currentSeason = 'autumn';
  else currentSeason = 'winter';

  // 季节权重映射
  const seasonBoost = {
    spring: { tea: ['green', 'white'], wellness: ['spring'], incense: ['woody'] },
    summer: { tea: ['white', 'green'], wellness: ['summer'], incense: ['herbal'] },
    autumn: { tea: ['white', 'oolong', 'dark'], wellness: ['autumn'], incense: ['floral'] },
    winter: { tea: ['dark', 'black'], wellness: ['winter'], incense: ['woody'] }
  };

  // 为每条内容计算权重
  const weightItem = (item, domain) => {
    let weight = (item.ratingAvg || 4.0) * 10;
    // 季节加权
    const boost = seasonBoost[currentSeason];
    if (boost[domain] && boost[domain].includes(item.category)) {
      weight += 30;
    }
    // 收藏数加权
    weight += Math.min(20, (item.collectCount || 0) / 50);
    // 加入随机性
    weight += nextRand() * 15;
    return weight;
  };

  // 构建候选池
  const domains = [
    { key: 'tea', items: teas },
    { key: 'travel', items: travels },
    { key: 'wellness', items: wellness },
    { key: 'incense', items: incense },
    { key: 'music', items: music },
    { key: 'film', items: film }
  ];

  // 每个领域选出前 N 个（按权重排序）
  const selectedPerDomain = domains.map(d => {
    return d.items
      .map(item => ({ item, weight: weightItem(item, d.key) }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map(entry => ({ type: d.key, domain: d.key, data: entry.item }));
  });

  // 交错排列，确保不连续重复同一领域
  const feed = [];
  const maxLen = 5; // 每个领域最多取5条
  let lastDomain = '';

  for (let i = 0; i < maxLen; i++) {
    // 每轮随机打乱领域顺序，但避免与上一轮最后一个相同
    const order = [0, 1, 2, 3, 4, 5].sort(() => nextRand() - 0.5);
    for (const idx of order) {
      if (selectedPerDomain[idx] && selectedPerDomain[idx][i]) {
        const item = selectedPerDomain[idx][i];
        // 避免连续同一领域
        if (item.domain !== lastDomain || feed.length === 0) {
          feed.push(item);
          lastDomain = item.domain;
        } else {
          // 尝试插入其他领域
          for (let j = 0; j < 6; j++) {
            const altIdx = (idx + j + 1) % 6;
            if (selectedPerDomain[altIdx] && selectedPerDomain[altIdx][i] && selectedPerDomain[altIdx][i].domain !== lastDomain) {
              feed.push(selectedPerDomain[altIdx][i]);
              lastDomain = selectedPerDomain[altIdx][i].domain;
              break;
            }
          }
        }
      }
    }
  }

  // 限制总数
  return feed.slice(0, 18);
}

/**
 * 未接入真实点评服务时返回空列表。
 * @param {string} teaId 茶品 id
 * @param {number} limit 返回条数，默认 3
 * @returns {Array}
 */
function getReviewsByTeaId(teaId, limit) {
  void teaId;
  void limit;
  return [];
}

/**
 * 每日风雅：每天轮换推荐一个六雅板块的内容
 * 基于年中第几天，6 个板块轮换 + 板块内内容轮换
 */
function getDailyElegance() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - yearStart) / (1000 * 60 * 60 * 24));
  const dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');

  const domains = [
    { key: 'tea',      char: '茶', name: '品茗', sub: '养性', color: '#3B6D11', loader: loadTeas },
    { key: 'incense',  char: '香', name: '焚香', sub: '静心', color: '#8B6F47', loader: loadIncense },
    { key: 'music',    char: '音', name: '听曲', sub: '怡情', color: '#4A6B7C', loader: loadMusic },
    { key: 'film',     char: '影', name: '看戏', sub: '观心', color: '#2C2C2A', loader: loadFilm },
    { key: 'wellness', char: '养', name: '养生', sub: '调身', color: '#A0522D', loader: loadWellness },
    { key: 'travel',   char: '游', name: '行旅', sub: '融汇', color: '#5B8C85', loader: loadTravels }
  ];

  const domainIndex = dayOfYear % domains.length;
  const domain = domains[domainIndex];
  const items = domain.loader();

  if (!items || items.length === 0) {
    // 降级：返回茶品
    const teas = loadTeas();
    return {
      domain: 'tea', domainName: '品茗', domainChar: '茶', domainSub: '养性',
      domainColor: '#3B6D11', date: dateStr,
      data: teas[dayOfYear % teas.length]
    };
  }

  const itemIndex = dayOfYear % items.length;
  return {
    domain: domain.key,
    domainName: domain.name,
    domainChar: domain.char,
    domainSub: domain.sub,
    domainColor: domain.color,
    date: dateStr,
    data: items[itemIndex]
  };
}

/**
 * 每日推荐（取一款茶品 + 一篇内容 + 香/音/影各一）
 */
function getDailyRecommend() {
  const teas = loadTeas();
  const travels = loadTravels();
  const incense = loadIncense();
  const music = loadMusic();
  const film = loadFilm();
  // 基于日期 hash 取模，保证当天稳定
  const day = new Date().getDate();
  const tea = teas[day % teas.length];
  const travel = travels[day % travels.length];
  const dailyIncense = incense[day % incense.length];
  const dailyMusic = music[day % music.length];
  const dailyFilm = film[day % film.length];
  return { tea, travel, incense: dailyIncense, music: dailyMusic, film: dailyFilm };
}

/**
 * 清除所有缓存（用于强制刷新数据）
 */
function clearCache() {
  _teasCache = null;
  _travelsCache = null;
  _wellnessCache = null;
  _incenseCache = null;
  _musicCache = null;
  _filmCache = null;
  _tutorialsCache = null;
  _knowledgeCache = null;
  _interviewQuestionsCache = null;
  _loadedTopics = {};
  // cache cleared
}

module.exports = {
  loadTeas,
  loadTravels,
  loadWellness,
  loadIncense,
  loadMusic,
  loadFilm,
  loadTutorials,
  loadKnowledge,
  loadInterviewQuestions,
  getStudyTaxonomy,
  getTeaById,
  getTravelById,
  getWellnessById,
  getIncenseById,
  getMusicById,
  getFilmById,
  getTutorialById,
  getKnowledgeById,
  getInterviewQuestionById,
  getTeasByCategory,
  getWellnessByCategory,
  getTutorials,
  getKnowledgeList,
  getInterviewQuestions,
  getStudyProgressMap,
  getStudyStats,
  getStudyHome,
  getTeaCategories,
  resolveLinkedDomains,
  findReverseLinks,
  getHomeFeed,
  getDailyRecommend,
  getDailyElegance,
  getReviewsByTeaId,
  clearCache
};
