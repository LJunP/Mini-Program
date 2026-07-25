// services/collection.js — 收藏服务
// 改造：优先走云函数，未登录时降级到本地存储

const STORAGE_KEY = 'fengya_collections'
const tracker = require('../utils/tracker.js')
const mock = require('../utils/mock.js')
const persona = require('../utils/persona.js')

const DOMAIN_REGISTRY = {
  tea: { name: '茶', shortName: '茶', color: '#3B6D11', resolve: mock.getTeaById },
  travel: { name: '游', shortName: '游', color: '#5B8C85', resolve: mock.getTravelById },
  wellness: { name: '养', shortName: '养', color: '#A0522D', resolve: mock.getWellnessById },
  incense: { name: '香', shortName: '香', color: '#8B6F47', resolve: mock.getIncenseById },
  music: { name: '音', shortName: '音', color: '#4A6B7C', resolve: mock.getMusicById },
  film: { name: '影', shortName: '影', color: '#2C2C2A', resolve: mock.getFilmById },
  tutorial: { name: '教程', shortName: '教', color: '#3B6D11', resolve: mock.getTutorialById },
  knowledge: { name: '科普', shortName: '知', color: '#4A6B7C', resolve: mock.getKnowledgeById },
  interview: { name: '面试', shortName: '题', color: '#854F0B', resolve: mock.getInterviewQuestionById }
}

function getDomainMeta(domain) {
  const config = DOMAIN_REGISTRY[domain]
  return {
    domain,
    domain_name: config ? config.name : domain,
    short_name: config ? config.shortName : (domain || '').slice(0, 1),
    color: config ? config.color : '#3B6D11'
  }
}

function _isLoggedIn() {
  try {
    // 优先使用 store 中的状态，避免与页面状态不同步
    const store = require('../store/index.js')
    const state = store.getState()
    if (state && typeof state.isLoggedIn !== 'undefined') {
      return state.isLoggedIn
    }
    // 降级到 auth 检查
    const auth = require('../utils/auth.js')
    const authResult = auth.isLoggedIn()
    return authResult
  } catch (e) {
    return false
  }
}

// ========== 本地存储（降级用） ==========

function _loadLocal() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || []
  } catch (e) {
    return []
  }
}

function _saveLocal(list) {
  try {
    wx.setStorageSync(STORAGE_KEY, list)
  } catch (e) {}
}

// ========== 云函数调用 ==========

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'collection',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

/**
 * 添加收藏
 */
function add(targetDomain, targetRefId, note = '') {
  // 调试日志已清理
  
  // 本地先更新（确保即时响应）
  const localList = _loadLocal()
  const localExist = localList.find(c => c.target_domain === targetDomain && c.target_ref_id === targetRefId)
  if (!localExist) {
    localList.push({
      id: 'local_' + Date.now(),
      target_domain: targetDomain,
      target_ref_id: targetRefId,
      note,
      created_at: new Date().toISOString()
    })
    _saveLocal(localList)
    // 积分：收藏加积分
    try {
      const points = require('../utils/points.js');
      points.onCollect(localList.length);
    } catch (e) {}
  }

  tracker.track('collect', {
    target_domain: targetDomain,
    target_ref_id: targetRefId,
    event_params: { note }
  })
  persona.invalidateCache()

  // 已登录则同步到云端
  const isLoggedIn = _isLoggedIn()
  // 登录状态检查已清理
  if (isLoggedIn) {
    return _callCloud({
      action: 'add',
      target_domain: targetDomain,
      target_ref_id: targetRefId,
      note
    }).then(res => {
      if (res.code === 0) {
        return { id: res.id, created_at: res.created_at, message: res.message }
      }
      return { id: localExist ? localExist.id : 'local', message: '已加入风雅书签' }
    }).catch(() => {
      return { message: '已加入风雅书签（本地）' }
    })
  }

  return Promise.resolve({ id: localExist ? localExist.id : 'local', message: '已加入风雅书签' })
}

/**
 * 取消收藏
 */
function remove(targetDomain, targetRefId) {
  // 本地先移除
  let localList = _loadLocal()
  localList = localList.filter(c => !(c.target_domain === targetDomain && c.target_ref_id === targetRefId))
  _saveLocal(localList)

  tracker.track('uncollect', {
    target_domain: targetDomain,
    target_ref_id: targetRefId
  })
  persona.invalidateCache()

  // 已登录则同步到云端
  if (_isLoggedIn()) {
    return _callCloud({
      action: 'remove',
      target_domain: targetDomain,
      target_ref_id: targetRefId
    }).then(() => {
      return { message: '已移出书签' }
    }).catch(() => {
      return { message: '已移出书签（本地）' }
    })
  }

  return Promise.resolve({ message: '已移出书签' })
}

/**
 * 查询是否已收藏（本地即时判断）
 */
function isCollected(targetDomain, targetRefId) {
  const list = _loadLocal()
  return !!list.find(c => c.target_domain === targetDomain && c.target_ref_id === targetRefId)
}

/**
 * 我的书签（按板块分组）
 * 已登录时从云端拉取，未登录时用本地
 */
function getGroups(domain) {
  const loggedIn = _isLoggedIn()
  // 登录状态检查已清理
  
  const fetchPromise = loggedIn
    ? _callCloud({ action: 'getList', domain: domain || 'all' }).then(res => {
        // 云函数结果日志已清理
        if (res.code === 0 && res.list) {
          // 同步本地缓存
          _saveLocal(res.list.map(item => ({
            id: item.id,
            target_domain: item.target_domain,
            target_ref_id: item.target_ref_id,
            note: item.note,
            created_at: item.created_at
          })))
          return res.list
        }
        return _loadLocal()
      }).catch((err) => {
        // 云函数错误日志已清理
        return _loadLocal()
      })
    : Promise.resolve(_loadLocal())

  return fetchPromise.then(list => {
    // 列表长度日志已清理
    if (domain && domain !== 'all') {
      list = list.filter(c => c.target_domain === domain)
    }

    // 按板块分组
    const groupMap = {}
    list.forEach(c => {
      if (!groupMap[c.target_domain]) groupMap[c.target_domain] = []
      groupMap[c.target_domain].push(c)
    })

    const groups = Object.keys(groupMap).map(d => {
      const meta = getDomainMeta(d)
      return Object.assign({}, meta, {
        total: groupMap[d].length,
        items: groupMap[d].map(c => _resolveItem(c)).filter(Boolean)
      })
    })

    const result = {
      groups,
      total_count: list.length
    }
    // 结果日志已清理
    return result
  })
}

/**
 * 获取收藏数量（优先云端）
 */
function getCount() {
  if (!_isLoggedIn()) {
    return Promise.resolve(_loadLocal().length)
  }
  return _callCloud({ action: 'getCount' }).then(res => {
    if (res.code === 0) return res.count
    return _loadLocal().length
  }).catch(() => _loadLocal().length)
}

/**
 * 解析收藏项的展示信息
 */
function _resolveItem(c) {
  const config = DOMAIN_REGISTRY[c.target_domain]
  const entity = config && config.resolve ? config.resolve(c.target_ref_id) : null
  if (!entity) return null
  return {
    target_ref_id: c.target_ref_id,
    name: entity.title || entity.name,
    cover_image: entity.coverImage || '',
    note: c.note,
    created_at: c.created_at
  }
}

module.exports = {
  add,
  remove,
  isCollected,
  getGroups,
  getDomainMeta,
  getCount
}
