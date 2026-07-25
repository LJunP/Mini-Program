// Mock global wx variable to prevent crash under Node.js environment
const assert = require('assert')
let currentEnv = 'development'

global.wx = {
  getStorageSync: (key) => {
    if (key === 'app_env') return currentEnv
    return null
  },
  setStorageSync: (key, val) => {
    if (key === 'app_env') {
      currentEnv = val
    }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: () => {},
  getStorageInfoSync: () => ({ keys: [] })
}

const mock = require('/Users/lijunpeng/Desktop/workbuddy_project/miniapp/utils/mock.js')

console.log('=== 休闲模式数据集成验证 ===\n');

try {
  const teas = mock.loadTeas ? mock.loadTeas() : [];
  console.log(`- 茶品加载成功, 数量: ${teas.length} 款`);
  if (teas.length > 0) {
    console.log(`  示例 [${teas[0].name}]: ${teas[0].description.slice(0, 100)}...`);
  }

  const travels = mock.loadTravels ? mock.loadTravels() : [];
  console.log(`- 行旅加载成功, 数量: ${travels.length} 条`);
  if (travels.length > 0 && travels[0].destination) {
    console.log(`  示例 [${travels[0].title}]: ${travels[0].destination.culture.slice(0, 100)}...`);
  }

  const wellness = mock.loadWellness ? mock.loadWellness() : [];
  console.log(`- 养生加载成功, 数量: ${wellness.length} 篇`);

  const incense = mock.loadIncense ? mock.loadIncense() : [];
  console.log(`- 香道加载成功, 数量: ${incense.length} 篇`);

  const music = mock.loadMusic ? mock.loadMusic() : [];
  console.log(`- 音乐加载成功, 数量: ${music.length} 首`);

  const film = mock.loadFilm ? mock.loadFilm() : [];
  console.log(`- 电影加载成功, 数量: ${film.length} 部`);

  assert.strictEqual(teas.length, 60)
  assert.strictEqual(travels.length, 6)
  assert.strictEqual(wellness.length, 14)
  assert.strictEqual(incense.length, 12)
  assert.strictEqual(music.length, 12)
  assert.strictEqual(film.length, 12)
  assert.deepStrictEqual(mock.getReviewsByTeaId('tea_001', 3), [])

  const auditedContent = [...teas, ...travels, ...wellness, ...incense, ...music, ...film]
  const collectStrings = (value, output = []) => {
    if (typeof value === 'string') output.push(value)
    else if (Array.isArray(value)) value.forEach(item => collectStrings(item, output))
    else if (value && typeof value === 'object') {
      Object.values(value).forEach(item => collectStrings(item, output))
    }
    return output
  }
  const forbiddenFragments = [
    '人体心、肝、脾、肺、肾的生物频率',
    '物理级别的身心疗愈',
    '黄金分割构图与低饱和度',
    '肝经在子时好好排毒',
    '三天的山居作息足以重置',
    '研究说慢节奏音乐能降心率',
    '脚底有六十多个穴位和反射区',
    '稀释血液、唤醒肠胃',
    '紫色的安眠药',
    '比吃安眠药健康',
    '比安眠药健康',
    '祛湿效果明显',
    '通灵的媒介',
    '气场不好',
    '世界唯一无芽无梗',
    '世界茶王',
    '理学在此发源',
    '称雄商界三百年',
    '世界茶文化发源地',
    '茶馆文化冠绝全国',
    '宋元东方第一大港',
    '音乐活化石',
    '老白茶枣香药韵',
    '温和养胃',
    '温润养胃',
    '温补消食',
    '清肝明目首选',
    '檀香助眠',
    '夏季祛湿',
    '崖柏助眠',
    '薰衣草助眠',
    '听曲减压的最好方式',
    '最好的慢生活练习',
    '好好吃饭，就是最好的养生',
    '冬病夏治最佳时机',
    '既驱蚊虫，又安神助眠',
    '消暑不伤胃',
    '润肺养胃',
    '暖胃驱寒',
    '驱寒助阳'
  ]
  const forbiddenHeadings = /【(?:冲泡物理|茶道美学|人文地缘|心境转折|时令草本|心境调谐|草本物理配比|物理油脂|香道美学|香材物理|指法曲律|乐教哲学|乐曲声学|镜头与声影美学|镜头语言与物理钢丝|镜头语言与物理抽帧|声影隐喻与哲学折中)】/

  auditedContent.forEach(item => {
    const text = collectStrings(item).join('\n')
    forbiddenFragments.forEach(fragment => {
      assert(!text.includes(fragment), `${item.id} 仍包含高风险表述：${fragment}`)
    })
    assert(!forbiddenHeadings.test(text), `${item.id} 仍包含未经核验的模板扩写`)
  })

  const seasonal = require('/Users/lijunpeng/Desktop/workbuddy_project/miniapp/utils/seasonal.js')
  const seasonalText = collectStrings([
    seasonal.SEASONS,
    seasonal.SEASONAL_CONTENT
  ]).join('\n')
  forbiddenFragments.forEach(fragment => {
    assert(!seasonalText.includes(fragment), `节气推荐仍包含高风险表述：${fragment}`)
  })

  const musicById = Object.fromEntries(music.map(item => [item.id, item]))
  const filmById = Object.fromEntries(film.map(item => [item.id, item]))
  assert(!musicById.music_002.body.includes('《广陵散》'), '《渔舟唱晚》正文不得混入《广陵散》')
  assert(musicById.music_001.body.includes('另一份有明确许可的现代录音'), '应区分金唱片与应用录音')
  assert(!filmById.film_003.body.includes('箭竹海'), '《英雄》正文不得混入其他影片场景')
  assert(!filmById.film_011.tips.join('\n').includes('3D版'), '《一代宗师》不得虚构 3D 观看建议')

  const travelById = Object.fromEntries(travels.map(item => [item.id, item]))
  assert.strictEqual(
    travelById.travel_006.coverImage,
    '',
    '泉州条目不得继续复用大理封面'
  )

  const detailTemplate = require('fs').readFileSync(
    '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/subpackages/detail/content-detail/content-detail.wxml',
    'utf8'
  )
  assert(detailTemplate.includes('本页为一般生活方式信息'))
  assert(detailTemplate.includes('本页介绍香材文化与嗅觉体验'))

  const teaCardTemplate = require('fs').readFileSync(
    '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/components/tea-card/tea-card.wxml',
    'utf8'
  )
  assert(teaCardTemplate.includes("tea.ratingSource === 'verified'"))

  const teaServiceSource = require('fs').readFileSync(
    '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/services/tea.js',
    'utf8'
  )
  assert(teaServiceSource.includes('mockHandler: () => []'))

  const ugc = require('/Users/lijunpeng/Desktop/workbuddy_project/miniapp/utils/ugc.js')
  assert(
    ugc.getCommunityFeed().every(post => !String(post.id).startsWith('mock_')),
    '模拟投稿不得进入用户可见社区 Feed'
  )

  console.log('\n🎉 SUCCESS: 休闲模式 116 条主数据、19 条节气推荐与演示内容隔离回归通过！');
} catch (e) {
  console.error('\n❌ FAILED: 休闲内容验证失败:', e);
  process.exitCode = 1
}
