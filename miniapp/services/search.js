const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')
const searchEngine = require('../utils/search-engine.js')

// 各板块搜索字段配置
const SEARCH_FIELDS = {
  tea: [
    { path: 'name', weight: 2 },
    { path: 'origin', weight: 1.5 },
    { path: 'styleTags', weight: 1.2 },
    { path: 'description', weight: 1 },
    { path: 'variety', weight: 1 },
    { path: 'grade', weight: 0.8 },
    { path: 'category', weight: 0.8 },
    { path: 'process', weight: 0.6 }
  ],
  travel: [
    { path: 'title', weight: 2 },
    { path: 'destination.name', weight: 1.8 },
    { path: 'destination.region', weight: 1.5 },
    { path: 'destination.culture', weight: 1 },
    { path: 'essay', weight: 0.8 },
    { path: 'duration', weight: 0.5 }
  ],
  wellness: [
    { path: 'title', weight: 2 },
    { path: 'body', weight: 1 },
    { path: 'tips', weight: 0.8 },
    { path: 'category', weight: 0.6 },
    { path: 'season', weight: 0.6 },
    { path: 'organ', weight: 0.6 }
  ],
  incense: [
    { path: 'title', weight: 2 },
    { path: 'body', weight: 1 },
    { path: 'origin', weight: 1.5 },
    { path: 'category', weight: 1 },
    { path: 'price', weight: 0.6 }
  ],
  music: [
    { path: 'title', weight: 2 },
    { path: 'body', weight: 1 },
    { path: 'instrument', weight: 1.5 },
    { path: 'dynasty', weight: 1 },
    { path: 'category', weight: 0.8 }
  ],
  film: [
    { path: 'title', weight: 2 },
    { path: 'body', weight: 1 },
    { path: 'director', weight: 1.5 },
    { path: 'year', weight: 0.8 },
    { path: 'category', weight: 0.8 }
  ]
}

/**
 * 全局跨板块搜索
 * @param {string} keyword 搜索关键词
 * @param {Object} filters 筛选参数 { difficulty, teaCategory, priceRange }
 * @param {string} sortBy 排序字段 relevance/time/popularity/difficulty
 */
function searchAll(keyword, filters = {}, sortBy = 'relevance') {
  return request({
    url: '/search',
    method: 'GET',
    data: { keyword, ...filters, sortBy },
    mockHandler: () => {
      const difficulty = filters.difficulty || 0
      const teaCategory = filters.teaCategory || 'all'
      const priceRange = filters.priceRange || 'all'

      const teaResults = searchEngine.search(
        mock.loadTeas(), keyword, SEARCH_FIELDS.tea,
        { difficulty, teaCategory },
        sortBy
      )

      const travelResults = searchEngine.search(
        mock.loadTravels(), keyword, SEARCH_FIELDS.travel,
        null,
        sortBy
      )

      const wellnessResults = searchEngine.search(
        mock.loadWellness(), keyword, SEARCH_FIELDS.wellness,
        { difficulty },
        sortBy
      )

      const incenseResults = searchEngine.search(
        mock.loadIncense(), keyword, SEARCH_FIELDS.incense,
        { difficulty, priceRange },
        sortBy
      )

      const musicResults = searchEngine.search(
        mock.loadMusic(), keyword, SEARCH_FIELDS.music,
        { difficulty },
        sortBy
      )

      const filmResults = searchEngine.search(
        mock.loadFilm(), keyword, SEARCH_FIELDS.film,
        { difficulty },
        sortBy
      )

      return {
        tea: teaResults,
        travel: travelResults,
        wellness: wellnessResults,
        incense: incenseResults,
        music: musicResults,
        film: filmResults
      }
    }
  })
}

/**
 * 获取搜索联想词建议
 * @param {string} keyword 当前输入
 * @param {Array<string>} hotKeywords 热门关键词
 * @param {Array<string>} historyKeywords 搜索历史关键词
 */
function getSuggestions(keyword, hotKeywords = [], historyKeywords = []) {
  return request({
    url: '/search/suggestions',
    method: 'GET',
    data: { keyword },
    mockHandler: () => {
      return searchEngine.getSuggestions(keyword, hotKeywords, historyKeywords)
    }
  })
}

module.exports = {
  searchAll,
  getSuggestions
}
