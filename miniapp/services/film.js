const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

function getFilmList(params = {}) {
  return request({
    url: '/film',
    method: 'GET',
    data: params,
    mockHandler: () => {
      const category = params.category || 'all'
      const page = params.page || 1
      const pageSize = params.pageSize || 20

      let list = mock.loadFilm()
      if (category && category !== 'all') {
        list = list.filter(item => item.category === category)
      }
      const total = list.length
      const start = (page - 1) * pageSize
      const pageList = list.slice(start, start + pageSize)

      return {
        list: pageList,
        total,
        page,
        hasMore: start + pageSize < total
      }
    }
  })
}

function getFilmDetail(id) {
  return request({
    url: '/film/' + id,
    method: 'GET',
    mockHandler: () => {
      const item = mock.getFilmById(id)
      if (!item) return null
      const linked = mock.resolveLinkedDomains(item.linkedDomains)
      return Object.assign({}, item, { linkedResolved: linked })
    }
  })
}

function getFilmCategories() {
  return request({
    url: '/film/categories',
    method: 'GET',
    mockHandler: () => {
      const list = mock.loadFilm()
      const categories = [
        { key: 'chinese', name: '华语电影' },
        { key: 'japanese', name: '日本电影' },
        { key: 'anime', name: '动画电影' }
      ]
      return categories.map(cat => {
        const count = list.filter(item => item.category === cat.key).length
        return Object.assign({}, cat, { count })
      })
    }
  })
}

module.exports = {
  getFilmList,
  getFilmDetail,
  getFilmCategories
}
