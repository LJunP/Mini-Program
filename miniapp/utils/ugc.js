// utils/ugc.js
// UGC 投稿内容管理（自用版）
// 支持六雅领域投稿：茶评、游记、香评、乐评、影评、养生笔记
// 改造：本地优先写入，已登录时异步同步到云端

const STORAGE_KEY = 'ugc_posts';
const DRAFT_KEY = 'ugc_draft';

// ========== 登录状态 & 云函数调用 ==========

function _isLoggedIn() {
  try {
    const store = require('../store/index.js')
    const state = store.getState()
    if (state && typeof state.isLoggedIn !== 'undefined') {
      return state.isLoggedIn
    }
    const auth = require('../utils/auth.js')
    return auth.isLoggedIn()
  } catch (e) {
    return false
  }
}

function _callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'ugc',
      data,
      success: (res) => resolve(res.result || {}),
      fail: (err) => reject(err)
    })
  })
}

// 六雅领域配置
const DOMAIN_OPTIONS = [
  { key: 'tea',      name: '茶', label: '茶评', color: '#3B6D11', bgColor: 'rgba(59, 109, 17, 0.06)',  placeholder: '记录这杯茶的色香味韵…' },
  { key: 'travel',   name: '游', label: '游记', color: '#5B8C85', bgColor: 'rgba(91, 140, 133, 0.06)', placeholder: '记录这段旅途的见闻感悟…' },
  { key: 'incense',  name: '香', label: '香评', color: '#8B6F47', bgColor: 'rgba(139, 111, 71, 0.06)', placeholder: '记录这炉香的香韵层次…' },
  { key: 'music',    name: '音', label: '乐评', color: '#4A6B7C', bgColor: 'rgba(74, 107, 124, 0.06)', placeholder: '记录这首曲的意境感悟…' },
  { key: 'film',     name: '影', label: '影评', color: '#2C2C2A', bgColor: 'rgba(44, 44, 42, 0.06)',   placeholder: '记录这部作品的观影思考…' },
  { key: 'wellness', name: '养', label: '养生', color: '#A0522D', bgColor: 'rgba(160, 82, 45, 0.06)', placeholder: '记录今日的养生实践…' }
];

// 获取所有投稿
function getAllPosts() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

// 按领域获取投稿
function getPostsByDomain(domain) {
  const posts = getAllPosts();
  if (!domain || domain === 'all') return posts;
  return posts.filter(p => p.domain === domain);
}

// 获取投稿统计
function getStats() {
  const posts = getAllPosts();
  const stats = {
    total: posts.length,
    byDomain: {}
  };
  DOMAIN_OPTIONS.forEach(d => {
    stats.byDomain[d.key] = posts.filter(p => p.domain === d.key).length;
  });
  return stats;
}

// 生成唯一ID
function generateId() {
  return 'ugc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

// 保存投稿（新建或更新）
function savePost(post) {
  const posts = getAllPosts();
  const now = new Date().toISOString();

  if (post.id) {
    // 更新
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...post, updatedAt: now };
      wx.setStorageSync(STORAGE_KEY, posts);

      // 已登录则同步云端
      if (_isLoggedIn()) {
        _callCloud({ action: 'save', post: { ...posts[idx], _id: posts[idx].id } }).catch(() => {});
      }

      return posts[idx];
    }
  }

  // 新建
  const newPost = {
    id: generateId(),
    title: post.title || '',
    domain: post.domain || 'tea',
    content: post.content || '',
    tags: post.tags || [],
    images: post.images || [],
    rating: post.rating || 0,
    location: post.location || '',
    linkedContent: post.linkedContent || null,
    status: post.status || 'published',
    // 社区字段（预留云切换）
    isPublic: post.isPublic !== false, // 默认公开
    authorId: 'local_user', // 预留云切换
    authorName: '我',
    likeCount: 0,
    createdAt: now,
    updatedAt: now
  };
  posts.unshift(newPost);
  wx.setStorageSync(STORAGE_KEY, posts);

  // 已登录则同步到云端
  if (_isLoggedIn()) {
    _callCloud({ action: 'save', post: newPost }).catch(() => {});
  }

  return newPost;
}

// 删除投稿
function deletePost(id) {
  const posts = getAllPosts();
  const filtered = posts.filter(p => p.id !== id);
  wx.setStorageSync(STORAGE_KEY, filtered);

  // 已登录则同步云端
  if (_isLoggedIn()) {
    _callCloud({ action: 'delete', id }).catch(() => {});
  }

  return filtered.length < posts.length;
}

// 获取单条投稿
function getPostById(id) {
  const posts = getAllPosts();
  return posts.find(p => p.id === id);
}

// 保存草稿（自动暂存）
function saveDraft(draft) {
  wx.setStorageSync(DRAFT_KEY, { ...draft, savedAt: new Date().toISOString() });
}

// 获取草稿
function getDraft() {
  return wx.getStorageSync(DRAFT_KEY) || null;
}

// 清除草稿
function clearDraft() {
  wx.removeStorageSync(DRAFT_KEY);
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${y}.${m}.${day} ${h}:${min}`;
}

// 格式化简短日期
function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${m}/${day}`;
}

// ====== 社区模拟数据 ======
// 模拟公开社区 Feed（未来替换为云端数据）
const MOCK_PUBLIC_POSTS = [
  {
    id: 'mock_001',
    title: '武夷山三日茶旅记',
    domain: 'travel',
    content: '从天心岩走到水帘洞，沿途品了五泡岩茶。最深刻的是在慧苑寺旁品到的一泡老枞水仙，岩韵深沉，有种说不出的幽远。三天的行程，不仅品茶，更是在山水间找到了一种久违的宁静。',
    tags: ['武夷岩茶', '行旅', '岩韵'],
    images: [],
    rating: 5,
    location: '福建武夷山',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_1',
    authorName: '茶行客',
    likeCount: 42,
    createdAt: '2026-07-20T10:30:00.000Z',
    updatedAt: '2026-07-20T10:30:00.000Z'
  },
  {
    id: 'mock_002',
    title: '沉香线香初体验',
    domain: 'incense',
    content: '第一次尝试海南沉香线香，点燃后有一种清甜的奶香，不像想象中的浓烈。静坐30分钟后，感觉心绪渐渐安定，配合古琴曲《平沙落雁》，竟有一种脱然物外之感。推荐初学者从沉香入门。',
    tags: ['沉香', '线香', '入门'],
    images: [],
    rating: 4,
    location: '',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_2',
    authorName: '香舍主人',
    likeCount: 28,
    createdAt: '2026-07-19T14:00:00.000Z',
    updatedAt: '2026-07-19T14:00:00.000Z'
  },
  {
    id: 'mock_003',
    title: '普洱生茶冲泡笔记（五泡记录）',
    domain: 'tea',
    content: '今天泡了一饼2019年的易武古树生普。第一泡10秒出汤，稍有青涩但回甘明显；第二泡15秒，蜜香开始显现；第三泡是最惊艳的，茶汤顺滑，生津强烈；第四泡开始略淡但仍有甜韵；第五泡20秒，余韵尚存。总体感觉：易武的柔，不是没有力度，而是力度藏在温柔里。',
    tags: ['普洱', '生茶', '易武', '冲泡'],
    images: [],
    rating: 5,
    location: '云南西双版纳',
    linkedContent: { id: 'tea_051', title: '普洱生茶', domain: 'tea' },
    isPublic: true,
    authorId: 'mock_user_3',
    authorName: '茶笔记',
    likeCount: 65,
    createdAt: '2026-07-18T09:00:00.000Z',
    updatedAt: '2026-07-18T09:00:00.000Z'
  },
  {
    id: 'mock_004',
    title: '夏夜养生：酸梅汤的古法做法',
    domain: 'wellness',
    content: '夏天到了，分享一个古法酸梅汤方子。乌梅30g、山楂20g、陈皮5g、甘草3g、桂花适量。材料浸泡30分钟后大火煮开，小火慢煮40分钟，最后加冰糖和桂花。这个方子消暑不伤胃，比外面的好太多。',
    tags: ['酸梅汤', '夏季养生', '古法'],
    images: [],
    rating: 4,
    location: '',
    linkedContent: null,
    isPublic: true,
    authorId: 'mock_user_4',
    authorName: '养生记',
    likeCount: 33,
    createdAt: '2026-07-17T16:00:00.000Z',
    updatedAt: '2026-07-17T16:00:00.000Z'
  },
  {
    id: 'mock_005',
    title: '《一代宗师》和一杯大红袍',
    domain: 'film',
    content: '重看《一代宗师》，这次配了一泡武夷大红袍。王家卫的镜头和大红袍的岩韵简直是绝配——都是那种初入口不觉如何，回味时却百转千回。宫二说“世间所有的相遇，都是久别重逢”，大红袍也是，第一泡平平无奇，第三泡才见岩骨。',
    tags: ['一代宗师', '大红袍', '王家卫'],
    images: [],
    rating: 5,
    location: '',
    linkedContent: { id: 'film_011', title: '《一代宗师》', domain: 'film' },
    isPublic: true,
    authorId: 'mock_user_5',
    authorName: '光影茶客',
    likeCount: 51,
    createdAt: '2026-07-16T20:00:00.000Z',
    updatedAt: '2026-07-16T20:00:00.000Z'
  }
];

// 获取社区 Feed（本地公开投稿 + 模拟公开投稿）
function getCommunityFeed(domain) {
  const localPublic = getAllPosts().filter(p => p.isPublic !== false);
  const allPosts = localPublic.concat(MOCK_PUBLIC_POSTS);
  if (domain && domain !== 'all') {
    return allPosts.filter(p => p.domain === domain);
  }
  return allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// 搜索投稿
function searchPosts(keyword, scope) {
  // scope: 'my' or 'community'
  const source = scope === 'community' ? getCommunityFeed() : getAllPosts();
  if (!keyword) return source;
  const kw = keyword.toLowerCase();
  return source.filter(p =>
    (p.title || '').toLowerCase().indexOf(kw) >= 0 ||
    (p.content || '').toLowerCase().indexOf(kw) >= 0 ||
    (p.tags || []).some(t => t.toLowerCase().indexOf(kw) >= 0)
  );
}

// ========== 云端同步 API ==========

/**
 * 从云端拉取我的投稿，合并到本地
 */
function syncFromCloud() {
  if (!_isLoggedIn()) return Promise.resolve({ synced: false })

  return _callCloud({ action: 'getMyPosts', domain: 'all' }).then(res => {
    if (res.code !== 0 || !res.list) {
      return { synced: false, reason: 'no_cloud_data' }
    }

    const localPosts = getAllPosts()
    const cloudPosts = res.list.map(item => ({
      id: item.id,
      title: item.title,
      domain: item.domain,
      content: item.content,
      tags: item.tags || [],
      images: item.images || [],
      rating: item.rating || 0,
      location: item.location || '',
      linkedContent: item.linkedContent || null,
      isPublic: item.isPublic !== false,
      authorId: 'cloud_user',
      authorName: '我',
      likeCount: item.likeCount || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))

    // 合并：云端为准，保留本地未同步的草稿
    const localIds = new Set(localPosts.map(p => p.id))
    const merged = [...cloudPosts]
    localPosts.forEach(p => {
      if (!localIds.has(p.id) && p.id && !p.id.startsWith('cloud_')) {
        merged.push(p)
      }
    })

    wx.setStorageSync(STORAGE_KEY, merged)
    return { synced: true, count: cloudPosts.length }
  }).catch(err => {
    console.warn('[ugc] syncFromCloud failed:', err)
    return { synced: false, error: err }
  })
}

/**
 * 将本地投稿全量推送到云端
 */
function syncToCloud() {
  if (!_isLoggedIn()) return Promise.resolve({ synced: false })

  const posts = getAllPosts()
  let successCount = 0
  const promises = posts.map(post =>
    _callCloud({ action: 'save', post }).then(res => {
      if (res.code === 0) successCount++
    }).catch(() => {})
  )

  return Promise.all(promises).then(() => ({
    synced: successCount > 0,
    total: posts.length,
    successCount
  }))
}

module.exports = {
  DOMAIN_OPTIONS,
  getAllPosts,
  getPostsByDomain,
  getStats,
  savePost,
  deletePost,
  getPostById,
  saveDraft,
  getDraft,
  clearDraft,
  formatDate,
  formatDateShort,
  getCommunityFeed,
  searchPosts,
  // 云同步 API
  syncFromCloud,
  syncToCloud
};
