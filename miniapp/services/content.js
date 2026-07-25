const wellnessService = require('./wellness.js')
const incenseService = require('./incense.js')
const musicService = require('./music.js')
const filmService = require('./film.js')

const DETAIL_GETTERS = {
  wellness: wellnessService.getWellnessDetail,
  incense: incenseService.getIncenseDetail,
  music: musicService.getMusicDetail,
  film: filmService.getFilmDetail
}

function getContentDetail(domain, id) {
  const getter = DETAIL_GETTERS[domain]
  if (!getter) {
    return Promise.resolve({ data: null })
  }

  return getter(id).then(res => {
    const detail = res.data
    if (!detail) return { data: null }

    return {
      data: Object.assign({}, detail, {
        domain,
        linkedTeas: (detail.linkedResolved || []).filter(item => item.domain === 'tea'),
        relatedTravel: detail.relatedTravel || []
      })
    }
  })
}

function getContentBrief(domain, id) {
  return getContentDetail(domain, id).then(res => {
    const detail = res.data
    if (!detail) return { data: null }

    return {
      data: {
        id: detail.id,
        domain,
        title: detail.title || detail.name || '',
        name: detail.title || detail.name || '',
        coverImage: detail.coverImage || ''
      }
    }
  })
}

module.exports = {
  getContentDetail,
  getContentBrief
}