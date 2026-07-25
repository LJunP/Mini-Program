const mock = require('../utils/mock.js')
const { request } = require('../utils/request.js')

function getIncenseList(params = {}) {
  return request({
    url: '/incense',
    method: 'GET',
    data: params,
    mockHandler: () => {
      const category = params.category || 'all'
      const page = params.page || 1
      const pageSize = params.pageSize || 20

      let list = mock.loadIncense()
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

function getIncenseDetail(id) {
  return request({
    url: '/incense/' + id,
    method: 'GET',
    mockHandler: () => {
      const item = mock.getIncenseById(id)
      if (!item) return null
      const linked = mock.resolveLinkedDomains(item.linkedDomains)
      return Object.assign({}, item, { linkedResolved: linked })
    }
  })
}

function getIncenseCategories() {
  return request({
    url: '/incense/categories',
    method: 'GET',
    mockHandler: () => {
      const list = mock.loadIncense()
      const categories = [
        { key: 'woody', name: '木质香' },
        { key: 'floral', name: '花草香' },
        { key: 'herbal', name: '草本香' },
        { key: 'animal', name: '动物香' },
        { key: 'resin', name: '树脂香' }
      ]
      return categories.map(cat => {
        const count = list.filter(item => item.category === cat.key).length
        return Object.assign({}, cat, { count })
      })
    }
  })
}

module.exports = {
  getIncenseList,
  getIncenseDetail,
  getIncenseCategories
}
