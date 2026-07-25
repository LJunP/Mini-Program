// utils/seasonal.js
// 季节性六雅内容管理模块
// 根据当前节气/季节自动推荐对应的六雅内容
// 后续添加真实内容时只需在 SEASONAL_CONTENT 中追加条目即可

// 四季定义
const SEASONS = {
  spring: { name: '春', range: [3, 5], color: '#8DB86A', desc: '万物生发，品春茶新芽' },
  summer: { name: '夏', range: [6, 8], color: '#5B8C85', desc: '清凉消暑，冷泡静心' },
  autumn: { name: '秋', range: [9, 11], color: '#A0522D', desc: '秋燥润肺，养收藏神' },
  winter: { name: '冬', range: [12, 2], color: '#4A6B7C', desc: '冬藏温补，围炉煮茶' }
};

// 二十四节气（简化版，按公历日期近似）
const SOLAR_TERMS = [
  { name: '立春', month: 2, day: 4, season: 'spring' },
  { name: '雨水', month: 2, day: 19, season: 'spring' },
  { name: '惊蛰', month: 3, day: 6, season: 'spring' },
  { name: '春分', month: 3, day: 21, season: 'spring' },
  { name: '清明', month: 4, day: 5, season: 'spring' },
  { name: '谷雨', month: 4, day: 20, season: 'spring' },
  { name: '立夏', month: 5, day: 6, season: 'summer' },
  { name: '小满', month: 5, day: 21, season: 'summer' },
  { name: '芒种', month: 6, day: 6, season: 'summer' },
  { name: '夏至', month: 6, day: 21, season: 'summer' },
  { name: '小暑', month: 7, day: 7, season: 'summer' },
  { name: '大暑', month: 7, day: 23, season: 'summer' },
  { name: '立秋', month: 8, day: 8, season: 'autumn' },
  { name: '处暑', month: 8, day: 23, season: 'autumn' },
  { name: '白露', month: 9, day: 8, season: 'autumn' },
  { name: '秋分', month: 9, day: 23, season: 'autumn' },
  { name: '寒露', month: 10, day: 8, season: 'autumn' },
  { name: '霜降', month: 10, day: 24, season: 'autumn' },
  { name: '立冬', month: 11, day: 7, season: 'winter' },
  { name: '小雪', month: 11, day: 22, season: 'winter' },
  { name: '大雪', month: 12, day: 7, season: 'winter' },
  { name: '冬至', month: 12, day: 22, season: 'winter' },
  { name: '小寒', month: 1, day: 6, season: 'winter' },
  { name: '大寒', month: 1, day: 20, season: 'winter' }
];

/**
 * 季节性内容库
 * 
 * 【使用说明】
 * 后续添加真实内容时，只需在此数组中追加条目，格式：
 * {
 *   id: 'unique_id',
 *   season: 'summer',           // spring/summer/autumn/winter
 *   solarTerm: '小暑',          // 可选，关联到特定节气
 *   domain: 'tea',              // tea/travel/incense/music/film/wellness
 *   title: '内容标题',
 *   summary: '内容摘要',
 *   tags: ['冷泡茶', '消暑'],   // 可选标签
 *   refId: 'tea_001',           // 可选，关联到已有内容的 ID
 *   priority: 1                  // 可选，优先级（数字越小越优先）
 * }
 */
const SEASONAL_CONTENT = [
  // ====== 春季 ======
  {
    id: 'spring_tea_01',
    season: 'spring',
    solarTerm: '清明',
    domain: 'tea',
    title: '明前龙井·一口春鲜',
    summary: '清明前后采制的龙井茶，氨基酸含量最高，鲜爽度最佳。一杯入口，满嘴春意。',
    tags: ['明前茶', '龙井', '春鲜'],
    refId: 'tea_001',
    priority: 1
  },
  {
    id: 'spring_wellness_01',
    season: 'spring',
    solarTerm: '惊蛰',
    domain: 'wellness',
    title: '春季养肝·疏肝理气',
    summary: '春属木，对应肝脏。宜食春芽（香椿、豆芽），晨起伸展，疏畅气机。',
    tags: ['养肝', '春季养生'],
    refId: 'wellness_001',
    priority: 1
  },
  {
    id: 'spring_travel_01',
    season: 'spring',
    solarTerm: '春分',
    domain: 'travel',
    title: '江南春行·采茶时节',
    summary: '春分时节，江南茶山正忙。探访龙井村、碧螺春原产地，体验采茶制茶全流程。',
    tags: ['茶山', '江南', '春季'],
    refId: 'travel_004',
    priority: 2
  },
  {
    id: 'spring_incense_01',
    season: 'spring',
    solarTerm: '谷雨',
    domain: 'incense',
    title: '春末焚香·祛湿辟秽',
    summary: '谷雨前后湿气渐重，焚沉香或檀香可祛湿辟秽，清神醒脑。',
    tags: ['沉香', '祛湿'],
    refId: 'incense_001',
    priority: 2
  },

  // ====== 夏季 ======
  {
    id: 'summer_tea_01',
    season: 'summer',
    solarTerm: '夏至',
    domain: 'tea',
    title: '夏日冷泡白茶',
    summary: '白牡丹或寿眉冷泡4-6小时，清甜爽口，消暑不伤胃。夏日饮茶首选。',
    tags: ['冷泡茶', '白茶', '消暑'],
    refId: 'tea_012',
    priority: 1
  },
  {
    id: 'summer_wellness_01',
    season: 'summer',
    solarTerm: '小暑',
    domain: 'wellness',
    title: '三伏天·冬病夏治',
    summary: '三伏贴、艾灸关元足三里，冬病夏治最佳时机。忌贪凉饮冷。',
    tags: ['三伏', '艾灸', '冬病夏治'],
    refId: 'wellness_002',
    priority: 1
  },
  {
    id: 'summer_music_01',
    season: 'summer',
    solarTerm: '大暑',
    domain: 'music',
    title: '夏日听荷·古琴消暑',
    summary: '酷暑难耐时听一曲《流水》或《平沙落雁》，心静自然凉。',
    tags: ['古琴', '消暑', '静心'],
    refId: 'music_001',
    priority: 2
  },
  {
    id: 'summer_travel_01',
    season: 'summer',
    solarTerm: '芒种',
    domain: 'travel',
    title: '避暑山中·禅茶一味',
    summary: '夏日避暑莫干山或峨眉山，山中品茶听泉，体验禅茶一味的清凉境界。',
    tags: ['避暑', '禅茶', '山中'],
    refId: 'travel_001',
    priority: 2
  },
  {
    id: 'summer_incense_01',
    season: 'summer',
    solarTerm: '夏至',
    domain: 'incense',
    title: '夏夜焚香·驱蚊安神',
    summary: '艾草、薄荷制香，既驱蚊虫，又安神助眠。夏夜读书焚一炉最佳。',
    tags: ['艾草', '驱蚊', '安神'],
    refId: 'incense_004',
    priority: 3
  },

  // ====== 秋季 ======
  {
    id: 'autumn_tea_01',
    season: 'autumn',
    solarTerm: '秋分',
    domain: 'tea',
    title: '秋日老白茶·润燥养胃',
    summary: '秋燥时节，煮一壶三年以上老白茶，枣香药韵，润肺养胃。',
    tags: ['老白茶', '秋燥', '润肺'],
    refId: 'tea_017',
    priority: 1
  },
  {
    id: 'autumn_wellness_01',
    season: 'autumn',
    solarTerm: '白露',
    domain: 'wellness',
    title: '秋燥润肺·白色食物',
    summary: '秋属金，对应肺。宜食百合、银耳、雪梨、莲藕等白色食物，滋阴润燥。',
    tags: ['润肺', '秋燥', '白色食物'],
    refId: 'wellness_004',
    priority: 1
  },
  {
    id: 'autumn_incense_01',
    season: 'autumn',
    solarTerm: '寒露',
    domain: 'incense',
    title: '秋夜焚香·桂花沉水',
    summary: '寒露时节，合桂花制香，甜润清幽，与秋月最配。',
    tags: ['桂花', '合香'],
    refId: 'incense_005',
    priority: 2
  },
  {
    id: 'autumn_travel_01',
    season: 'autumn',
    solarTerm: '霜降',
    domain: 'travel',
    title: '秋日行旅·红叶茶会',
    summary: '霜降后红叶漫山，携茶具入山，枫下设席，煮茶赏秋色。',
    tags: ['红叶', '茶会', '秋游'],
    refId: 'travel_003',
    priority: 2
  },
  {
    id: 'autumn_film_01',
    season: 'autumn',
    solarTerm: '秋分',
    domain: 'film',
    title: '秋日观影·小津安二郎',
    summary: '秋分时节最适合看小津安二郎的电影，《秋刀鱼之味》与秋意最配。',
    tags: ['小津安二郎', '秋刀鱼之味'],
    refId: 'film_001',
    priority: 3
  },

  // ====== 冬季 ======
  {
    id: 'winter_tea_01',
    season: 'winter',
    solarTerm: '冬至',
    domain: 'tea',
    title: '围炉煮茶·冬日暖饮',
    summary: '冬至日围炉煮老普洱或老白茶，加陈皮红枣，暖胃驱寒。',
    tags: ['煮茶', '冬至', '暖胃'],
    refId: 'tea_052',
    priority: 1
  },
  {
    id: 'winter_wellness_01',
    season: 'winter',
    solarTerm: '立冬',
    domain: 'wellness',
    title: '冬季养藏·温补肾阳',
    summary: '冬属水，对应肾。宜早睡晚起，食温补之物（核桃、栗子、羊肉），温补肾阳。',
    tags: ['养肾', '冬藏', '温补'],
    refId: 'wellness_009',
    priority: 1
  },
  {
    id: 'winter_incense_01',
    season: 'winter',
    solarTerm: '大雪',
    domain: 'incense',
    title: '雪夜焚香·暖香助阳',
    summary: '大雪时节焚檀香或丁香，性温暖中，驱寒助阳，适合冬日读书时使用。',
    tags: ['檀香', '驱寒'],
    refId: 'incense_002',
    priority: 2
  },
  {
    id: 'winter_music_01',
    season: 'winter',
    solarTerm: '小寒',
    domain: 'music',
    title: '冬夜听梅·琴曲傲雪',
    summary: '小寒时节听《梅花三弄》，琴声清冽如雪中梅香，最合冬夜意境。',
    tags: ['梅花三弄', '古琴', '冬夜'],
    refId: 'music_007',
    priority: 2
  },
  {
    id: 'winter_travel_01',
    season: 'winter',
    solarTerm: '冬至',
    domain: 'travel',
    title: '冬日温泉·汤池品茗',
    summary: '冬至后泡温泉最佳，汤池边放一壶热茶，寒热交替间体验极致放松。',
    tags: ['温泉', '品茗', '冬至'],
    refId: 'travel_005',
    priority: 3
  }
];

// 域名映射
const DOMAIN_NAMES = {
  tea: '茶',
  travel: '游',
  incense: '香',
  music: '音',
  film: '影',
  wellness: '养'
};

const DOMAIN_COLORS = {
  tea: '#3B6D11',
  travel: '#5B8C85',
  incense: '#8B6F47',
  music: '#4A6B7C',
  film: '#2C2C2A',
  wellness: '#A0522D'
};

// 获取当前季节
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1;
  for (const key in SEASONS) {
    const range = SEASONS[key].range;
    if (key === 'winter') {
      if (month === 12 || month === 1 || month === 2) return key;
    } else {
      if (month >= range[0] && month <= range[1]) return key;
    }
  }
  return 'spring';
}

// 获取当前节气
function getCurrentSolarTerm() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  let current = SOLAR_TERMS[0];
  for (const term of SOLAR_TERMS) {
    if (term.month < month || (term.month === month && term.day <= day)) {
      current = term;
    }
  }
  // 如果月份在 1-2 月，需要检查是否还在大寒之后、立春之前
  if (month === 1 || (month === 2 && day < 4)) {
    current = SOLAR_TERMS.find(t => t.name === '小寒') || current;
    if (month === 1 && day >= 20) {
      current = SOLAR_TERMS.find(t => t.name === '大寒') || current;
    }
  }
  return current;
}

// 获取下一个节气
function getNextSolarTerm() {
  const current = getCurrentSolarTerm();
  const idx = SOLAR_TERMS.findIndex(t => t.name === current.name);
  return SOLAR_TERMS[(idx + 1) % SOLAR_TERMS.length];
}

// 获取当前季节的内容列表
function getSeasonalContent(season) {
  const targetSeason = season || getCurrentSeason();
  return SEASONAL_CONTENT.filter(item => item.season === targetSeason)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

// 获取当前节气的内容
function getSolarTermContent(solarTermName) {
  const term = solarTermName || getCurrentSolarTerm().name;
  return SEASONAL_CONTENT.filter(item => item.solarTerm === term)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

// 获取当季推荐内容（综合季节+节气）
function getRecommendedContent() {
  const season = getCurrentSeason();
  const solarTerm = getCurrentSolarTerm();
  const seasonInfo = SEASONS[season];
  
  // 优先返回节气相关内容
  const termContent = getSolarTermContent(solarTerm.name);
  // 补充季节内容
  const seasonContent = getSeasonalContent(season).filter(item => 
    !termContent.find(tc => tc.id === item.id)
  );
  
  const allContent = [...termContent, ...seasonContent];
  
  // 为每条内容添加域名颜色信息
  return allContent.map(item => ({
    ...item,
    domainName: DOMAIN_NAMES[item.domain] || '',
    domainColor: DOMAIN_COLORS[item.domain] || '#3B6D11'
  }));
}

// 获取季节信息
function getSeasonInfo() {
  const season = getCurrentSeason();
  const solarTerm = getCurrentSolarTerm();
  const nextTerm = getNextSolarTerm();
  
  return {
    key: season,
    name: SEASONS[season].name,
    color: SEASONS[season].color,
    desc: SEASONS[season].desc,
    currentTerm: solarTerm.name,
    nextTerm: nextTerm.name,
    nextTermDate: `${nextTerm.month}.${nextTerm.day}`
  };
}

module.exports = {
  SEASONS,
  SOLAR_TERMS,
  SEASONAL_CONTENT,
  DOMAIN_NAMES,
  DOMAIN_COLORS,
  getCurrentSeason,
  getCurrentSolarTerm,
  getNextSolarTerm,
  getSeasonalContent,
  getSolarTermContent,
  getRecommendedContent,
  getSeasonInfo
};
