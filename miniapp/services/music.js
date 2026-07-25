const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

function getMusicList(params = {}) {
  return request({
    url: '/music',
    method: 'GET',
    data: params,
    mockHandler: () => {
      const category = params.category || 'all'
      const page = params.page || 1
      const pageSize = params.pageSize || 20

      let list = mock.loadMusic()
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

function getMusicDetail(id) {
  return request({
    url: '/music/' + id,
    method: 'GET',
    mockHandler: () => {
      const item = mock.getMusicById(id)
      if (!item) return null
      const linked = mock.resolveLinkedDomains(item.linkedDomains)
      return Object.assign({}, item, { linkedResolved: linked })
    }
  })
}

function getMusicCategories() {
  return request({
    url: '/music/categories',
    method: 'GET',
    mockHandler: () => {
      const list = mock.loadMusic()
      const categories = [
        { key: 'guqin', name: '古琴' },
        { key: 'guzheng', name: '古筝' },
        { key: 'pipa', name: '琵琶' },
        { key: 'erhu', name: '二胡' },
        { key: 'suona', name: '唢呐' },
        { key: 'ensemble', name: '合奏' }
      ]
      return categories.map(cat => {
        const count = list.filter(item => item.category === cat.key).length
        return Object.assign({}, cat, { count })
      })
    }
  })
}

module.exports = {
  getMusicList,
  getMusicDetail,
  getMusicCategories
}
