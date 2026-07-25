// utils/subscribe-config.js — 订阅消息配置
// 集中管理所有订阅消息模板 ID 和配置

/**
 * 订阅消息模板配置
 * 模板 ID 已在微信公众平台 -> 功能 -> 订阅消息 中申请并启用
 */
const SUBSCRIBE_TEMPLATES = {
  // 每周好物推荐提醒 - 精选内容推荐
  DAILY_RECOMMEND: {
    id: 'iSMQgSD8hnb864IPKU7FGQcTiA5m4VVIxpdzp6r2UXA',
    name: '每周好物推荐',
    description: '每周为您精选风雅内容推荐',
    scene: 'review', // 触发场景：点评后
    enabled: true
  },

  // 签到提醒 - 每日签到提醒
  SIGN_REMIND: {
    id: '5pkhfpBi_ljRF_oAj8m1n8stjF-N49jXkynEnqoTpdQ',
    name: '签到提醒',
    description: '每日提醒您签到，积累风雅积分',
    scene: 'sign', // 触发场景：签到后
    enabled: true
  },

  // 账号更新提醒 - 收藏内容更新提醒
  CONTENT_UPDATE: {
    id: 'byHxjsi3bc-aqjm4j5Ymjet3aKOP7eCSaQTmEF4zhVU',
    name: '账号更新提醒',
    description: '收藏的内容有更新时通知您',
    scene: 'collect', // 触发场景：收藏后
    enabled: true
  },

  // 新活动提醒 - 特殊活动提醒
  ACTIVITY_REMIND: {
    id: 'CdG8YVW6xGKX1ZNLQlaw43beHlu7KjdVoZB_S8JBx3c',
    name: '新活动提醒',
    description: '不错过任何精彩风雅活动',
    scene: 'activity', // 触发场景：活动页面
    enabled: true
  }
};

/**
 * 订阅消息场景配置
 * 定义每个场景触发的模板列表
 */
const SUBSCRIBE_SCENES = {
  // 点评成功后触发
  review: {
    templates: ['DAILY_RECOMMEND'],
    title: '开启每周好物推荐',
    desc: '开启后，每周为您精选风雅内容推荐'
  },

  // 签到成功后触发
  sign: {
    templates: ['SIGN_REMIND'],
    title: '开启签到提醒',
    desc: '每日提醒您签到，积累风雅积分'
  },

  // 收藏成功后触发
  collect: {
    templates: ['CONTENT_UPDATE'],
    title: '开启更新提醒',
    desc: '收藏的内容有更新时，第一时间通知您'
  },

  // 活动页面触发
  activity: {
    templates: ['ACTIVITY_REMIND'],
    title: '开启活动提醒',
    desc: '不错过任何精彩风雅活动'
  },

  // 首次进入小程序触发
  first_visit: {
    templates: ['DAILY_RECOMMEND', 'SIGN_REMIND'],
    title: '开启消息通知',
    desc: '获取每周好物推荐和签到提醒'
  }
};

/**
 * 获取模板 ID 列表
 * @param {string} scene 场景名称
 * @returns {Array} 模板 ID 列表
 */
function getTemplateIds(scene) {
  const sceneConfig = SUBSCRIBE_SCENES[scene];
  if (!sceneConfig) return [];
  
  return sceneConfig.templates
    .filter(templateKey => SUBSCRIBE_TEMPLATES[templateKey] && SUBSCRIBE_TEMPLATES[templateKey].enabled)
    .map(templateKey => SUBSCRIBE_TEMPLATES[templateKey].id);
}

/**
 * 获取场景配置
 * @param {string} scene 场景名称
 * @returns {Object} 场景配置
 */
function getSceneConfig(scene) {
  return SUBSCRIBE_SCENES[scene] || null;
}

/**
 * 获取所有启用的模板列表
 * @returns {Array} 模板配置列表
 */
function getEnabledTemplates() {
  return Object.entries(SUBSCRIBE_TEMPLATES)
    .filter(([key, template]) => template.enabled)
    .map(([key, template]) => ({
      key,
      ...template
    }));
}

/**
 * 检查模板是否启用
 * @param {string} templateKey 模板键名
 * @returns {boolean} 是否启用
 */
function isTemplateEnabled(templateKey) {
  const template = SUBSCRIBE_TEMPLATES[templateKey];
  return template ? template.enabled : false;
}

/**
 * 获取订阅状态存储键名
 * @param {string} templateKey 模板键名
 * @returns {string} 存储键名
 */
function getSubscribeStorageKey(templateKey) {
  return `subscribed_${templateKey.toLowerCase()}`;
}

module.exports = {
  SUBSCRIBE_TEMPLATES,
  SUBSCRIBE_SCENES,
  getTemplateIds,
  getSceneConfig,
  getEnabledTemplates,
  isTemplateEnabled,
  getSubscribeStorageKey
};