// utils/seasonal.js
// 季节性六雅内容管理模块
// 根据当前节气/季节自动推荐对应的六雅内容
// 后续添加真实内容时只需在 SEASONAL_CONTENT 中追加条目即可

// 四季定义
const SEASONS = {
  spring: { name: '春', range: [3, 5], color: '#8DB86A', desc: '万物生发，品春茶新芽' },
  summer: { name: '夏', range: [6, 8], color: '#5B8C85', desc: '暑热时节，补水避晒' },
  autumn: { name: '秋', range: [9, 11], color: '#A0522D', desc: '气候转凉，按需补水' },
  winter: { name: '冬', range: [12, 2], color: '#4A6B7C', desc: '寒冷时节，注意保暖' }
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
    summary: '“明前”指清明前采制的时间概念，成茶常见清鲜风格；采摘期不能单独证明产地和品质。',
    tags: ['明前茶', '龙井', '春鲜'],
    refId: 'tea_001',
    priority: 1
  },
  {
    id: 'spring_wellness_01',
    season: 'spring',
    solarTerm: '惊蛰',
    domain: 'wellness',
    title: '春日作息·晨光与伸展',
    summary: '春季昼长增加，可保持规律起床、适量户外活动和多样饮食；持续不适应咨询专业医务人员。',
    tags: ['规律作息', '户外活动'],
    refId: 'wellness_001',
    priority: 1
  },
  {
    id: 'spring_travel_01',
    season: 'spring',
    solarTerm: '春分',
    domain: 'travel',
    title: '江南春行·采茶时节',
    summary: '春季可探访江南茶区；采茶、制茶体验受产期、天气和预约影响，应以正规场所当日安排为准。',
    tags: ['茶山', '江南', '春季'],
    refId: 'travel_004',
    priority: 2
  },
  {
    id: 'spring_incense_01',
    season: 'spring',
    solarTerm: '谷雨',
    domain: 'incense',
    title: '春末用香·气味与通风',
    summary: '沉香或檀香可作为传统用香文化体验，但不宣称祛湿或提神功效；燃烧时保持通风并看护火源。',
    tags: ['沉香', '用香安全'],
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
    summary: '白牡丹或寿眉可按产品状态尝试冷泡；全程冷藏、器具清洁并及时饮用，且仍需留意咖啡因。',
    tags: ['冷泡茶', '白茶', '食品安全'],
    refId: 'tea_012',
    priority: 1
  },
  {
    id: 'summer_wellness_01',
    season: 'summer',
    solarTerm: '小暑',
    domain: 'wellness',
    title: '暑热天气·补水与防晒',
    summary: '高温时优先补水、遮阳、通风并减少正午暴晒；头晕、恶心或意识异常时应及时降温并寻求医疗帮助。',
    tags: ['补水', '防晒', '中暑警示'],
    refId: 'wellness_002',
    priority: 1
  },
  {
    id: 'summer_music_01',
    season: 'summer',
    solarTerm: '大暑',
    domain: 'music',
    title: '夏日听曲·留一段安静时间',
    summary: '可用安全音量聆听《流水》或《平沙落雁》；音乐感受因人而异，不能替代降温、补水或医疗处理。',
    tags: ['古琴', '安全音量'],
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
    title: '夏夜用香·烟雾与火源安全',
    summary: '艾草、薄荷相关香品只作为气味与民俗体验，不替代正规驱蚊或睡眠诊疗；室内燃烧需通风并全程看护。',
    tags: ['艾草', '用香安全'],
    refId: 'incense_004',
    priority: 3
  },

  // ====== 秋季 ======
  {
    id: 'autumn_tea_01',
    season: 'autumn',
    solarTerm: '秋分',
    domain: 'tea',
    title: '秋日老白茶·辨香与仓储',
    summary: '部分老白茶会呈枣香、木质香等陈香；年份不能替代原料与仓储判断，也不代表润肺或养胃功效。',
    tags: ['老白茶', '仓储'],
    refId: 'tea_017',
    priority: 1
  },
  {
    id: 'autumn_wellness_01',
    season: 'autumn',
    solarTerm: '白露',
    domain: 'wellness',
    title: '秋日舒适·补水与室内湿度',
    summary: '空气干燥时可适量饮水、通风并按需使用洁净加湿设备；普通食物不能替代咳嗽、过敏等问题的诊疗。',
    tags: ['补水', '室内湿度'],
    refId: 'wellness_004',
    priority: 1
  },
  {
    id: 'autumn_incense_01',
    season: 'autumn',
    solarTerm: '寒露',
    domain: 'incense',
    title: '秋夜焚香·桂花沉水',
    summary: '桂花调合香可作为秋季气味体验；香材成分以产品标识为准，燃烧时注意通风和火源。',
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
    summary: '秋季可选择开放步道观赏红叶；户外茶席须遵守景区防火、垃圾管理和明火规定。',
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
    summary: '秋日可观看小津安二郎的《秋刀鱼之味》，从家庭变化、代际关系和日常空间理解影片。',
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
    summary: '冬日煮茶应使用适合煮饮的茶品和耐热器具，控制温度并防烫伤；茶饮不承担暖胃或驱寒治疗作用。',
    tags: ['煮茶', '冬至', '防烫伤'],
    refId: 'tea_052',
    priority: 1
  },
  {
    id: 'winter_wellness_01',
    season: 'winter',
    solarTerm: '立冬',
    domain: 'wellness',
    title: '冬季作息·保暖与规律活动',
    summary: '寒冷天气可关注保暖、规律睡眠、适量活动和多样饮食；不把单一食物描述为补肾或治疗方法。',
    tags: ['保暖', '规律作息'],
    refId: 'wellness_009',
    priority: 1
  },
  {
    id: 'winter_incense_01',
    season: 'winter',
    solarTerm: '大雪',
    domain: 'incense',
    title: '雪夜用香·木香与辛香',
    summary: '檀香或丁香调可提供木质、辛香等嗅觉体验，但不宣称驱寒或“助阳”；使用时保持通风并看护火源。',
    tags: ['檀香', '用香安全'],
    refId: 'incense_002',
    priority: 2
  },
  {
    id: 'winter_music_01',
    season: 'winter',
    solarTerm: '小寒',
    domain: 'music',
    title: '冬夜听梅·琴曲傲雪',
    summary: '小寒时节可听《梅花三弄》，并把“雪中梅香”等画面理解为个人音乐联想。',
    tags: ['梅花三弄', '古琴', '冬夜'],
    refId: 'music_007',
    priority: 2
  },
  {
    id: 'winter_travel_01',
    season: 'winter',
    solarTerm: '冬至',
    domain: 'travel',
    title: '冬日温泉·安全与补水',
    summary: '泡温泉应遵守场馆水温、时长和健康提示，及时补水；避免在池边使用玻璃茶具，身体不适应立即离池。',
    tags: ['温泉', '补水', '安全提示'],
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

// 获取当前节气
function getCurrentSolarTerm(date) {
  const now = date || new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // 列表按“立春 → 大寒”的节气周期排列，并非公历月份顺序。
  // 以月日数值选择距离当前最近且已经发生的节气；元旦到小寒前沿用冬至。
  const winterSolstice = SOLAR_TERMS.find(t => t.name === '冬至');
  let current = winterSolstice || SOLAR_TERMS[0];
  let currentValue = 0;
  const todayValue = month * 100 + day;

  for (const term of SOLAR_TERMS) {
    const termValue = term.month * 100 + term.day;
    if (termValue <= todayValue && termValue >= currentValue) {
      current = term;
      currentValue = termValue;
    }
  }

  return current;
}

// 获取当前季节，以节气所属季节为准，避免 2 月立春、5 月立夏等边界错位。
function getCurrentSeason(date) {
  return getCurrentSolarTerm(date).season;
}

// 获取下一个节气
function getNextSolarTerm(date) {
  const current = getCurrentSolarTerm(date);
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
function getRecommendedContent(date) {
  const season = getCurrentSeason(date);
  const solarTerm = getCurrentSolarTerm(date);
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
function getSeasonInfo(date) {
  const season = getCurrentSeason(date);
  const solarTerm = getCurrentSolarTerm(date);
  const nextTerm = getNextSolarTerm(date);
  
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
