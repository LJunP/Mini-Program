const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

function getHomeData(params = {}) {
  return request({
    url: '/home',
    method: 'GET',
    data: params,
    mockHandler: () => {
      const mode = params.mode || 'leisure'
      if (mode === 'study') {
        return {
          daily: { tea: null, travel: null },
          feed: [],
          studyHome: mock.getStudyHome()
        }
      }

      return {
        daily: mock.getDailyRecommend(),
        dailyElegance: mock.getDailyElegance(),
        feed: mock.getHomeFeed(),
        studyHome: null
      }
    }
  })
}

function clearHomeCache() {
  mock.clearCache()
}

module.exports = {
  getHomeData,
  clearHomeCache
}
