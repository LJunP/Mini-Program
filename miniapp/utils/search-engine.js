// utils/search-engine.js — 高级搜索引擎
// 提供：模糊匹配、拼音搜索、相关度评分、筛选、排序
const pinyin = require('./pinyin.js');

/**
 * 判断是否为拼音查询（纯小写英文字母）
 * @param {string} str
 * @returns {boolean}
 */
function isPinyinQuery(str) {
  return /^[a-z]+$/.test(str.trim());
}

/**
 * 计算文本与关键词的相关度得分（中文直接匹配）
 * @param {string} text 被搜索文本
 * @param {string} keyword 关键词
 * @returns {number} 0-100 得分
 */
function scoreText(text, keyword) {
  if (!text || !keyword) return 0;
  const t = text.toLowerCase();
  const k = keyword.toLowerCase().trim();

  // 1. 精确匹配
  if (t === k) return 100;
  
  // 2. 整体包含
  if (t.includes(k)) {
    if (t.startsWith(k)) return 90;
    return 75;
  }

  // 3. 多词分词匹配（空格分隔）
  const tokens = k.split(/\s+/).filter(token => token.length > 0);
  if (tokens.length > 1) {
    let matchCount = 0;
    let scoreSum = 0;
    for (const token of tokens) {
      if (t.includes(token)) {
        matchCount++;
        scoreSum += t.startsWith(token) ? 80 : 60;
      }
    }
    if (matchCount > 0) {
      const matchRatio = matchCount / tokens.length;
      const averageScore = scoreSum / matchCount;
      return Math.round(matchRatio * averageScore);
    }
  }

  return 0;
}

/**
 * 通用搜索评分：对单个条目在多个字段上计算综合得分
 * @param {Object} item 数据条目
 * @param {string} keyword 关键词
 * @param {Array} fields 需要搜索的字段列表，支持 [{path, weight}] 或 string
 * @returns {{ score: number, matchedField: string }}
 */
function scoreItem(item, keyword, fields) {
  let maxScore = 0;
  let matchedField = '';
  const isPinyin = isPinyinQuery(keyword);

  for (const field of fields) {
    const path = typeof field === 'string' ? field : field.path;
    const weight = typeof field === 'string' ? 1 : (field.weight || 1);

    const value = _getNestedValue(item, path);
    if (!value) continue;

    let score = 0;

    if (isPinyin) {
      // 拼音搜索
      score = pinyin.scorePinyin(String(value), keyword);
    } else {
      // 中文直接匹配
      score = scoreText(String(value), keyword);
    }

    // 加权
    score = Math.min(100, score * weight);
    if (score > maxScore) {
      maxScore = score;
      matchedField = path;
    }
  }

  return { score: maxScore, matchedField };
}

/**
 * 搜索并返回带评分的结果列表
 * @param {Array} items 数据数组
 * @param {string} keyword 关键词
 * @param {Array} fields 搜索字段配置
 * @param {Object} filters 筛选条件
 * @param {string} sortBy 排序方式 relevance/time/popularity/difficulty
 * @returns {Array} 排序后的结果
 */
function search(items, keyword, fields, filters, sortBy) {
  if (!items || !items.length) return [];
  if (!keyword || !keyword.trim()) return items;

  // 1. 评分
  let scored = items.map(item => {
    const { score, matchedField } = scoreItem(item, keyword, fields);
    return { ...item, _searchScore: score, _matchedField: matchedField };
  }).filter(item => item._searchScore > 0);

  // 2. 筛选
  if (filters) {
    scored = applyFilters(scored, filters);
  }

  // 3. 排序
  scored = applySort(scored, sortBy || 'relevance');

  return scored;
}

/**
 * 应用筛选条件
 * @param {Array} items 已评分的条目
 * @param {Object} filters { difficulty, priceRange, teaCategory }
 * @returns {Array}
 */
function applyFilters(items, filters) {
  let result = items;

  // 难度筛选
  if (filters.difficulty && filters.difficulty > 0) {
    result = result.filter(item => {
      const d = item.difficulty;
      if (d === undefined || d === null) return true; // 没有难度字段的不排除
      return d === filters.difficulty;
    });
  }

  // 价格范围筛选（适用于香道等有价格字段的内容）
  if (filters.priceRange && filters.priceRange !== 'all') {
    const priceMap = {
      '平价': '平价',
      '中端': '中端',
      '高端': '高端',
      '顶级': '顶级'
    };
    const targetPrice = priceMap[filters.priceRange];
    if (targetPrice) {
      result = result.filter(item => {
        if (!item.price) return true;
        return item.price === targetPrice;
      });
    }
  }

  // 茶类筛选（仅茶品）
  if (filters.teaCategory && filters.teaCategory !== 'all') {
    result = result.filter(item => {
      if (!item.category) return true;
      return item.category === filters.teaCategory;
    });
  }

  // 养生分类筛选
  if (filters.wellnessCategory && filters.wellnessCategory !== 'all') {
    result = result.filter(item => {
      if (!item.category) return true;
      return item.category === filters.wellnessCategory;
    });
  }

  return result;
}

/**
 * 应用排序
 * @param {Array} items 已筛选的条目
 * @param {string} sortBy relevance/time/popularity/difficulty
 * @returns {Array}
 */
function applySort(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'relevance':
      // 按搜索得分降序
      sorted.sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
      break;

    case 'time':
      // 按时间/年份降序（电影有 year，其他用 id 中的数字近似）
      sorted.sort((a, b) => {
        const aTime = a.year || _extractIdNumber(a.id) || 0;
        const bTime = b.year || _extractIdNumber(b.id) || 0;
        return bTime - aTime;
      });
      break;

    case 'popularity':
      // 按热度：收藏数 > 评分人数 > 评分
      sorted.sort((a, b) => {
        const aPop = a.collectCount || a.ratingCount || 0;
        const bPop = b.collectCount || b.ratingCount || 0;
        if (bPop !== aPop) return bPop - aPop;
        return (b.ratingAvg || 0) - (a.ratingAvg || 0);
      });
      break;

    case 'difficulty':
      sorted.sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
      break;

    default:
      break;
  }

  return sorted;
}

/**
 * 从 id 中提取数字（用于排序近似）
 * @param {string} id 如 "tea_001"
 * @returns {number}
 */
function _extractIdNumber(id) {
  if (!id) return 0;
  const match = id.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * 获取嵌套对象的值
 * @param {Object} obj
 * @param {string} path 如 "destination.name"
 * @returns {*}
 */
function _getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * 高亮关键词（返回用于 WXML 的富文本片段）
 * @param {string} text 原始文本
 * @param {string} keyword 关键词
 * @param {number} maxLength 最大返回长度
 * @returns {Array<{text: string, highlight: boolean}>}
 */
function highlightText(text, keyword, maxLength) {
  maxLength = maxLength || 50;
  if (!text) return [{ text: '', highlight: false }];
  if (!keyword || !keyword.trim()) {
    const snippet = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    return [{ text: snippet, highlight: false }];
  }

  const k = keyword.toLowerCase().trim();
  const tokens = k.split(/\s+/).filter(token => token.length > 0);
  
  if (tokens.length === 0) {
    const snippet = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    return [{ text: snippet, highlight: false }];
  }

  // 对 Token 进行正则转义，构建匹配模式
  const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');

  const maxSearchLength = 300;
  const searchText = text.length > maxSearchLength ? text.slice(0, maxSearchLength) : text;

  // 定位第一个匹配锚点作为展示中心
  const firstMatchIdx = searchText.search(regex);
  let startOffset = 0;
  let endOffset = text.length;

  if (firstMatchIdx !== -1) {
    startOffset = Math.max(0, firstMatchIdx - 12);
    endOffset = Math.min(text.length, firstMatchIdx + 38);
  } else {
    endOffset = Math.min(text.length, maxLength);
  }

  const snippet = text.slice(startOffset, endOffset);
  const snippetPrefix = startOffset > 0 ? '...' : '';
  const snippetSuffix = endOffset < text.length ? '...' : '';

  const segments = [];
  if (snippetPrefix) {
    segments.push({ text: snippetPrefix, highlight: false });
  }

  // 执行高亮渲染段分割
  let snippetLastIndex = 0;
  const snippetRegex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  let snippetMatch;

  while ((snippetMatch = snippetRegex.exec(snippet)) !== null) {
    const matchStr = snippetMatch[1];
    const matchIndex = snippetMatch.index;

    if (matchIndex > snippetLastIndex) {
      segments.push({
        text: snippet.slice(snippetLastIndex, matchIndex),
        highlight: false
      });
    }

    segments.push({
      text: matchStr,
      highlight: true
    });

    snippetLastIndex = snippetRegex.lastIndex;
  }

  if (snippetLastIndex < snippet.length) {
    segments.push({
      text: snippet.slice(snippetLastIndex),
      highlight: false
    });
  }

  if (snippetSuffix) {
    segments.push({ text: snippetSuffix, highlight: false });
  }

  return segments;
}

/**
 * 生成搜索建议（基于输入的前缀匹配热门词）
 * @param {string} input 用户输入
 * @param {Array} hotKeywords 热门词列表
 * @param {Array} historyKeywords 历史词列表
 * @returns {Array<string>} 最多 6 个建议
 */
function getSuggestions(input, hotKeywords, historyKeywords) {
  if (!input || !input.trim()) return [];
  const q = input.trim().toLowerCase();
  const isPinyin = isPinyinQuery(q);

  const candidates = [...(historyKeywords || []), ...(hotKeywords || [])];
  const matched = [];

  for (const word of candidates) {
    if (matched.length >= 6) break;
    const lower = word.toLowerCase();

    // 中文前缀匹配
    if (lower.includes(q)) {
      if (!matched.includes(word)) matched.push(word);
      continue;
    }

    // 拼音匹配
    if (isPinyin && pinyin.matchPinyin(word, q)) {
      if (!matched.includes(word)) matched.push(word);
    }
  }

  return matched;
}

module.exports = {
  isPinyinQuery,
  scoreText,
  scoreItem,
  search,
  applyFilters,
  applySort,
  highlightText,
  getSuggestions
};
