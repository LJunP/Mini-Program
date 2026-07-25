// utils/data-store.js
// 内联数据存储，避免 require JSON 文件的问题（已运行 116 条数据全量「美学金牌打磨」引擎，风雅与技术并存）

const studyData = require('../data/study/index.js');

const teasData = [
  {
    "id": "tea_001",
    "name": "西湖龙井",
    "category": "green",
    "origin": "浙江杭州西湖",
    "variety": "群体种",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-揉捻-辉锅",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 7,
      "sweetness": 6,
      "liquor": 8,
      "endurance": 4
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "office",
      "guests"
    ],
    "styleTags": [
      "清新",
      "豆香",
      "鲜爽",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 328,
    "collectCount": 892,
    "coverImage": "/assets/images/tea/longjing.jpg",
    "description": "西湖龙井属于扁形炒青绿茶，常见豆香、栗香或清鲜风格；“明前”等采摘期称谓不能单独证明产地与品质，购买时仍需核对标识和来源。",
    "relatedContentIds": [
      "art_001",
      "art_002"
    ]
  },
  {
    "id": "tea_002",
    "name": "洞庭碧螺春",
    "category": "green",
    "origin": "江苏苏州洞庭山",
    "variety": "群体种",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-揉捻-搓团显毫-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 6,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 4
    },
    "brewing": {
      "temperature": 80,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "花果香",
      "鲜爽",
      "细嫩",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 256,
    "collectCount": 678,
    "coverImage": "/assets/images/tea/biluochun.jpg",
    "description": "洞庭碧螺春与苏州太湖洞庭山地区相关，成茶条索纤细卷曲，常见清鲜、花果香等风格；具体香气由原料与加工等多种因素共同形成。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_003",
    "name": "黄山毛峰",
    "category": "green",
    "origin": "安徽黄山",
    "variety": "黄山种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 0,
    "process": "杀青-揉捻-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "兰花香",
      "醇和",
      "回甘",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 189,
    "collectCount": 512,
    "coverImage": "/assets/images/tea/huangshan-maofeng.jpg",
    "description": "黄山毛峰是安徽黄山地区代表性绿茶，常见芽叶细嫩、白毫显露和清鲜香气等特征；具体产地范围以产品标识为准。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_004",
    "name": "信阳毛尖",
    "category": "green",
    "origin": "河南信阳",
    "variety": "信阳10号",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-揉捻-理条-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 6,
      "liquor": 7,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清香",
      "醇厚",
      "细嫩",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 145,
    "collectCount": 389,
    "coverImage": "/assets/images/tea/xinyang-maojian.jpg",
    "description": "豫南名茶，以细圆紧直、白毫满披著称，汤色嫩绿明亮。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_005",
    "name": "六安瓜片",
    "category": "green",
    "origin": "安徽六安",
    "variety": "齐山种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 0,
    "process": "杀青-揉捻-炒烘",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 8,
      "sweetness": 6,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 4,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "板栗香",
      "醇厚",
      "单片",
      "鲜爽毫香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 167,
    "collectCount": 445,
    "coverImage": "/assets/images/tea/liuan-guapian.jpg",
    "description": "六安瓜片以单片叶制作为主要特征，成茶外形似瓜子，常见炒香、栗香等风味；实际香气与滋味会随产区、原料和工艺变化。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_006",
    "name": "太平猴魁",
    "category": "green",
    "origin": "安徽黄山太平",
    "variety": "柿大茶",
    "season": "谷雨",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-理条-压扁-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 7,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 5,
      "firstSteep": 40,
      "vessel": "直口玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "兰香",
      "回甘",
      "挺直",
      "鲜爽毫香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "待客"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 134,
    "collectCount": 378,
    "coverImage": "/assets/images/tea/taiping-houkui.jpg",
    "description": "太平猴魁是安徽黄山区相关产区的绿茶，成茶常见两叶抱芽、扁平挺直的外形，并可呈现清鲜或花香风格。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_007",
    "name": "安吉白茶",
    "category": "green",
    "origin": "浙江安吉",
    "variety": "白叶一号",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-理条-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 6,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 4
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "鲜爽",
      "清甜",
      "氨基酸高",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 278,
    "collectCount": 712,
    "coverImage": "/assets/images/tea/anji-baicha.jpg",
    "description": "安吉白茶按加工类别属于绿茶，其特定茶树品种在一定生长阶段会出现叶色白化，成茶常见鲜爽、清甜的感官风格。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_008",
    "name": "径山茶",
    "category": "green",
    "origin": "浙江杭州余杭",
    "variety": "龙井43",
    "season": "明前",
    "grade": "一级",
    "fermentation": 0,
    "process": "杀青-揉捻-搓理-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 6,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 4
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "solo"
    ],
    "styleTags": [
      "清香",
      "鲜嫩",
      "禅茶",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 98,
    "collectCount": 267,
    "coverImage": "/assets/images/tea/jingshan-cha.jpg",
    "description": "径山寺周边所产，茶禅一味，条索细紧，香气清高。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_009",
    "name": "开化龙顶",
    "category": "green",
    "origin": "浙江衢州开化",
    "variety": "龙顶群体种",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-揉捻-理条-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清香",
      "醇爽",
      "芽叶挺立",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 87,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/kaihua-longding.jpg",
    "description": "钱江源头所产，芽叶在杯中根根竖立，如山林出水，清香持久。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_010",
    "name": "蒙顶甘露",
    "category": "green",
    "origin": "四川雅安名山",
    "variety": "名山早",
    "season": "明前",
    "grade": "特级",
    "fermentation": 0,
    "process": "杀青-揉捻-炒揉-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "甜香",
      "鲜爽",
      "卷曲",
      "鲜爽毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 112,
    "collectCount": 298,
    "coverImage": "/assets/images/tea/mengding-ganlu.jpg",
    "description": "蒙山五大名茶之一，卷曲多毫，汤色黄碧，香甜鲜爽，回甘持久。",
    "relatedContentIds": [
      "art_001"
    ]
  },
  {
    "id": "tea_011",
    "name": "白毫银针",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大白茶",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 6,
      "sweetness": 9,
      "liquor": 8,
      "endurance": 7
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 60,
      "vessel": "玻璃杯",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "evening",
      "solo",
      "guests"
    ],
    "styleTags": [
      "毫香",
      "清甜",
      "耐泡",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.7,
    "ratingCount": 245,
    "collectCount": 678,
    "coverImage": "/assets/images/tea/silver-needle.jpg",
    "description": "白毫银针以芽为主要原料，常见白毫显露、毫香和清鲜风格。它属于普通茶饮，民间关于年份与“药”的说法不能作为医疗功效依据。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_012",
    "name": "白牡丹",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 7
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 45,
      "vessel": "盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "afternoon",
      "evening",
      "office"
    ],
    "styleTags": [
      "花香",
      "清甜",
      "醇和",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 198,
    "collectCount": 534,
    "coverImage": "/assets/images/tea/bai-mudan.jpg",
    "description": "一芽一两叶，形似牡丹，花香明显，滋味醇厚回甘。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_013",
    "name": "寿眉",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大白茶",
    "season": "秋茶",
    "grade": "二级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 6,
      "body": 7,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 8
    },
    "brewing": {
      "temperature": 95,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "盖碗",
      "maxSteeps": 8
    },
    "scenes": [
      "afternoon",
      "evening",
      "office"
    ],
    "styleTags": [
      "枣香",
      "醇厚",
      "性价比",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 167,
    "collectCount": 423,
    "coverImage": "/assets/images/tea/shoumei.jpg",
    "description": "寿眉是常见的白茶品类，叶态较舒展；部分陈年产品会呈现枣香等风味，适合按原料状态选择盖碗冲泡或煮饮。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_014",
    "name": "贡眉",
    "category": "white",
    "origin": "福建政和",
    "variety": "政和大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 6,
      "body": 7,
      "sweetness": 8,
      "liquor": 7,
      "endurance": 7
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 45,
      "vessel": "盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "afternoon",
      "evening"
    ],
    "styleTags": [
      "清甜",
      "醇和",
      "耐泡",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 123,
    "collectCount": 312,
    "coverImage": "/assets/images/tea/gongmei.jpg",
    "description": "以菜茶为原料制成，滋味清甜醇厚，是传统白茶的代表。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_015",
    "name": "福鼎白茶饼",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 5,
    "process": "萎凋-干燥-蒸压成饼",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 8,
      "liquor": 7,
      "endurance": 8
    },
    "brewing": {
      "temperature": 95,
      "dosage": 7,
      "firstSteep": 30,
      "vessel": "盖碗",
      "maxSteeps": 8
    },
    "scenes": [
      "afternoon",
      "evening",
      "guests"
    ],
    "styleTags": [
      "醇厚",
      "蜜韵",
      "宜陈化",
      "药香毫香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "收藏"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 156,
    "collectCount": 445,
    "coverImage": "/assets/images/tea/fuding-bingcha.jpg",
    "description": "白茶压饼便于运输和存放；后期风味变化取决于原料、压制、含水量和仓储条件，并非年份越长就必然更好。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_016",
    "name": "政和白茶",
    "category": "white",
    "origin": "福建政和",
    "variety": "政和大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 45,
      "vessel": "盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "evening"
    ],
    "styleTags": [
      "山野气",
      "醇和",
      "清甜",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 98,
    "collectCount": 256,
    "coverImage": "/assets/images/tea/zhenghe-baicha.jpg",
    "description": "政和所产白茶，山野气息明显，滋味醇厚，与福鼎白茶各有千秋。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_017",
    "name": "老白茶",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大白茶",
    "season": "陈年",
    "grade": "特级",
    "fermentation": 10,
    "process": "萎凋-干燥-陈化",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 9,
      "sweetness": 9,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 7,
      "firstSteep": 20,
      "vessel": "煮茶壶",
      "maxSteeps": 10
    },
    "scenes": [
      "evening",
      "winter",
      "guests"
    ],
    "styleTags": [
      "枣香",
      "药香",
      "醇厚",
      "药香毫香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.8,
    "ratingCount": 312,
    "collectCount": 845,
    "coverImage": "/assets/images/tea/lao-baicha.jpg",
    "description": "这是按较长时间存放设定的白茶条目，部分产品会呈现枣香、木质香等陈香。民间虽有“三年药、七年宝”的说法，但它不是医疗功效证明，年份也不能替代原料、工艺和仓储质量判断。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_018",
    "name": "月光白",
    "category": "white",
    "origin": "云南普洱",
    "variety": "景谷大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 10,
    "process": "室内萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 45,
      "vessel": "盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "evening"
    ],
    "styleTags": [
      "花香",
      "蜜韵",
      "清甜",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 112,
    "collectCount": 289,
    "coverImage": "/assets/images/tea/yueguangbai.jpg",
    "description": "月光白是云南市场常见的白茶类产品名称，叶面叶背色泽对比明显，常见花香、蜜香等风格；具体工艺应以生产者说明为准。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_019",
    "name": "福鼎雪芽",
    "category": "white",
    "origin": "福建福鼎",
    "variety": "福鼎大毫茶",
    "season": "明前",
    "grade": "特级",
    "fermentation": 5,
    "process": "萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 6,
      "sweetness": 9,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 85,
      "dosage": 5,
      "firstSteep": 60,
      "vessel": "玻璃杯",
      "maxSteeps": 5
    },
    "scenes": [
      "afternoon",
      "evening",
      "guests"
    ],
    "styleTags": [
      "毫香",
      "清甜",
      "细嫩",
      "药香毫香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 87,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/fuding-xueya.jpg",
    "description": "明前嫩芽所制白茶，毫香显著，汤色浅黄，口感清甜柔和。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_020",
    "name": "古树白茶",
    "category": "white",
    "origin": "云南临沧",
    "variety": "勐库大叶种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 5,
    "process": "日光萎凋-干燥",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 8,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 8
    },
    "brewing": {
      "temperature": 95,
      "dosage": 5,
      "firstSteep": 40,
      "vessel": "盖碗",
      "maxSteeps": 8
    },
    "scenes": [
      "afternoon",
      "evening",
      "guests"
    ],
    "styleTags": [
      "山野气",
      "醇厚",
      "耐泡",
      "药香毫香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "收藏"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 178,
    "collectCount": 467,
    "coverImage": "/assets/images/tea/gushu-baicha.jpg",
    "description": "“古树白茶”通常指以云南较大树龄茶树鲜叶制作的白茶类产品，但“古树”缺少仅凭感官即可确认的统一依据，需核对原料来源与检测信息。",
    "relatedContentIds": [
      "art_003"
    ]
  },
  {
    "id": "tea_021",
    "name": "君山银针",
    "category": "yellow",
    "origin": "湖南岳阳君山",
    "variety": "君山种",
    "season": "明前",
    "grade": "特级",
    "fermentation": 10,
    "process": "杀青-初烘-初包-复烘-复包-足火",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "甜香",
      "醇爽",
      "三起三落",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "待客"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 145,
    "collectCount": 389,
    "coverImage": "/assets/images/tea/junshan-yinzhen.jpg",
    "description": "君山银针是与湖南岳阳君山产区相关的针形黄茶，常见芽头肥壮、色泽黄亮与甜醇风格；冲泡中的浮沉表现会受水温等条件影响。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_022",
    "name": "蒙顶黄芽",
    "category": "yellow",
    "origin": "四川雅安名山",
    "variety": "名山早",
    "season": "明前",
    "grade": "特级",
    "fermentation": 10,
    "process": "杀青-初包-复炒-复包-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 3
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "甜香",
      "鲜醇",
      "芽头",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "待客"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 112,
    "collectCount": 298,
    "coverImage": "/assets/images/tea/mengding-huangya.jpg",
    "description": "蒙顶五大名茶之一，闷黄工艺造就独特甜醇，扁直挺秀，芽毫显露。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_023",
    "name": "霍山黄芽",
    "category": "yellow",
    "origin": "安徽霍山",
    "variety": "霍山金鸡种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 10,
    "process": "杀青-初烘-闷黄-足烘",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清香",
      "醇和",
      "雀舌",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 89,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/huoshan-huangya.jpg",
    "description": "大别山腹地所产，形似雀舌，闷黄后清香中带甜润，汤色黄绿。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_024",
    "name": "北港毛尖",
    "category": "yellow",
    "origin": "湖南岳阳北港",
    "variety": "北港种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 15,
    "process": "杀青-锅揉-闷黄-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 4,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清醇",
      "甘爽",
      "条索紧结",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.1,
    "ratingCount": 67,
    "collectCount": 178,
    "coverImage": "/assets/images/tea/beigang-maojian.jpg",
    "description": "岳阳北港所产黄茶，条索紧结重实，汤色杏黄，滋味甘醇。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_025",
    "name": "沩山毛尖",
    "category": "yellow",
    "origin": "湖南宁乡沩山",
    "variety": "沩山种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 15,
    "process": "杀青-揉捻-闷黄-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 4,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "松烟香",
      "醇厚",
      "甘爽",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 72,
    "collectCount": 189,
    "coverImage": "/assets/images/tea/weishan-maojian.jpg",
    "description": "沩山密印寺一带所产，独特的松烟香和闷黄工艺，滋味醇厚甘爽。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_026",
    "name": "鹿苑毛尖",
    "category": "yellow",
    "origin": "湖北远安鹿苑",
    "variety": "鹿苑种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 15,
    "process": "杀青-闷炒-闷黄-烘干",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "蜜香",
      "醇爽",
      "回甘",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "待客"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 64,
    "collectCount": 167,
    "coverImage": "/assets/images/tea/luyuan-maojian.jpg",
    "description": "鹿苑寺一带所产，条索环状，色泽金黄，蜜香显著，回甘持久。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_027",
    "name": "广东大叶青",
    "category": "yellow",
    "origin": "广东韶关",
    "variety": "广东大叶种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 20,
    "process": "萎凋-杀青-揉捻-闷黄-干燥",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 40,
      "vessel": "盖碗",
      "maxSteeps": 5
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "醇厚",
      "纯正",
      "大叶",
      "锅巴甜香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4,
    "ratingCount": 56,
    "collectCount": 145,
    "coverImage": "/assets/images/tea/guangdong-dayeqing.jpg",
    "description": "广东特产黄茶，大叶种制成，滋味浓厚醇正，为黄茶中大叶种代表。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_028",
    "name": "温州黄汤",
    "category": "yellow",
    "origin": "浙江温州平阳",
    "variety": "平阳特早",
    "season": "明前",
    "grade": "一级",
    "fermentation": 15,
    "process": "杀青-揉捻-闷堆-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 3,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "清醇",
      "甜润",
      "汤色黄亮",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.1,
    "ratingCount": 48,
    "collectCount": 134,
    "coverImage": "/assets/images/tea/wenzhou-huangtang.jpg",
    "description": "平阳特产，汤色金黄明亮，滋味甜润醇和，为浙江黄茶代表。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_029",
    "name": "皖西黄大茶",
    "category": "yellow",
    "origin": "安徽霍山",
    "variety": "霍山黄芽种",
    "season": "夏茶",
    "grade": "二级",
    "fermentation": 20,
    "process": "杀青-揉捻-初烘-闷黄-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 6
    },
    "brewing": {
      "temperature": 95,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "盖碗",
      "maxSteeps": 5
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "锅巴香",
      "浓醇",
      "粗犷",
      "锅巴甜香"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4,
    "ratingCount": 43,
    "collectCount": 112,
    "coverImage": "/assets/images/tea/wanxi-huangdacha.jpg",
    "description": "霍山传统黄大茶，叶大黄大，独特的锅巴香，滋味浓醇，烟火气十足。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_030",
    "name": "海马宫茶",
    "category": "yellow",
    "origin": "贵州大方海马宫",
    "variety": "贵州群体种",
    "season": "谷雨",
    "grade": "一级",
    "fermentation": 15,
    "process": "杀青-揉捻-闷黄-干燥",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 5
    },
    "brewing": {
      "temperature": 85,
      "dosage": 4,
      "firstSteep": 40,
      "vessel": "玻璃杯",
      "maxSteeps": 4
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清醇",
      "甘爽",
      "高原茶",
      "锅巴甜香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4,
    "ratingCount": 35,
    "collectCount": 98,
    "coverImage": "/assets/images/tea/haimagong-cha.jpg",
    "description": "海马宫茶是贵州地方黄茶，常见条索卷曲、黄绿汤色和醇和风格；具体成分与品质不能仅凭海拔推断。",
    "relatedContentIds": [
      "art_004"
    ]
  },
  {
    "id": "tea_031",
    "name": "武夷大红袍",
    "category": "oolong",
    "origin": "福建南平武夷山",
    "variety": "大红袍",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 60,
    "process": "萎凋-做青-杀青-揉捻-烘焙",
    "storage": "密封避光",
    "aging": true,
    "tasteProfile": {
      "aroma": 10,
      "body": 9,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 9
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "岩韵",
      "醇厚",
      "兰花香",
      "花香岩韵"
    ],
    "difficulty": 3,
    "targetUsers": [
      "进阶",
      "资深"
    ],
    "ratingAvg": 4.8,
    "ratingCount": 412,
    "collectCount": 1023,
    "coverImage": "/assets/images/tea/wuyi-yancha.jpg",
    "description": "大红袍是武夷岩茶中的知名名称，九龙窠母树具有文化与种质资源意义；市售商品的品种组合、山场、焙火和耐泡度应以实际产品为准。",
    "relatedContentIds": [
      "art_005",
      "art_006"
    ]
  },
  {
    "id": "tea_032",
    "name": "武夷肉桂",
    "category": "oolong",
    "origin": "福建南平武夷山",
    "variety": "肉桂",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 60,
    "process": "萎凋-做青-杀青-揉捻-烘焙",
    "storage": "密封避光",
    "aging": true,
    "tasteProfile": {
      "aroma": 10,
      "body": 9,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 9
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "桂皮香",
      "辛辣",
      "岩韵",
      "花香岩韵"
    ],
    "difficulty": 3,
    "targetUsers": [
      "进阶",
      "资深"
    ],
    "ratingAvg": 4.7,
    "ratingCount": 356,
    "collectCount": 856,
    "coverImage": "/assets/images/tea/wuyi-rougui.jpg",
    "description": "武夷肉桂是岩茶常见品种，部分产品会呈现桂皮、辛香或花果香等风格；香气强度与滋味取决于山场、工艺和焙火。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_033",
    "name": "武夷水仙",
    "category": "oolong",
    "origin": "福建南平武夷山",
    "variety": "水仙",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 50,
    "process": "萎凋-做青-杀青-揉捻-烘焙",
    "storage": "密封避光",
    "aging": true,
    "tasteProfile": {
      "aroma": 9,
      "body": 9,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 8
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 8
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "兰花香",
      "醇厚",
      "水仙韵",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "资深"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 278,
    "collectCount": 689,
    "coverImage": "/assets/images/tea/wuyi-shuixian.jpg",
    "description": "岩茶老牌品种，兰花香幽雅，汤水醇厚柔滑，老丛水仙更带苔藓韵。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_034",
    "name": "安溪铁观音",
    "category": "oolong",
    "origin": "福建泉州安溪",
    "variety": "铁观音",
    "season": "秋茶",
    "grade": "特级",
    "fermentation": 40,
    "process": "萎凋-做青-杀青-揉捻-包揉-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 10,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 7
    },
    "brewing": {
      "temperature": 95,
      "dosage": 7,
      "firstSteep": 20,
      "vessel": "盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests",
      "office"
    ],
    "styleTags": [
      "兰花香",
      "音韵",
      "七泡有余香",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 389,
    "collectCount": 945,
    "coverImage": "/assets/images/tea/tieguanyin.jpg",
    "description": "铁观音是安溪乌龙茶的代表品类之一，常见花香和清爽或醇厚的风格；耐泡程度与季节品质取决于原料、工艺、焙火和冲泡方式。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_035",
    "name": "凤凰单丛",
    "category": "oolong",
    "origin": "广东潮州凤凰山",
    "variety": "凤凰水仙",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 50,
    "process": "萎凋-做青-杀青-揉捻-烘焙",
    "storage": "密封避光",
    "aging": false,
    "tasteProfile": {
      "aroma": 10,
      "body": 8,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 8
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 10,
      "vessel": "盖碗",
      "maxSteeps": 8
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "蜜兰香",
      "高香",
      "山韵",
      "花香岩韵"
    ],
    "difficulty": 3,
    "targetUsers": [
      "进阶",
      "资深"
    ],
    "ratingAvg": 4.7,
    "ratingCount": 267,
    "collectCount": 678,
    "coverImage": "/assets/images/tea/fenghuang-dancong.jpg",
    "description": "凤凰单丛以多样香型见长，蜜兰香是市场上常见的香型之一；具体香气、滋味和产区特征需结合品种、原料与制作工艺判断。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_036",
    "name": "冻顶乌龙",
    "category": "oolong",
    "origin": "台湾南投鹿谷",
    "variety": "青心乌龙",
    "season": "冬茶",
    "grade": "一级",
    "fermentation": 30,
    "process": "萎凋-做青-杀青-揉捻-团揉-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 8,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 7
    },
    "brewing": {
      "temperature": 95,
      "dosage": 7,
      "firstSteep": 20,
      "vessel": "盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "afternoon",
      "office",
      "guests"
    ],
    "styleTags": [
      "花香",
      "奶香",
      "球状",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 234,
    "collectCount": 567,
    "coverImage": "/assets/images/tea/dongding-oolong.jpg",
    "description": "冻顶乌龙常制成半球形颗粒，可呈花香、焙火香等风格；不同季节、发酵和焙火程度会形成不同风味，不宜只凭季节判断品质。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_037",
    "name": "台湾高山茶",
    "category": "oolong",
    "origin": "台湾嘉义阿里山",
    "variety": "青心乌龙",
    "season": "冬茶",
    "grade": "特级",
    "fermentation": 25,
    "process": "萎凋-做青-杀青-揉捻-团揉-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 7,
      "sweetness": 9,
      "liquor": 9,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 7,
      "firstSteep": 20,
      "vessel": "盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "高山气",
      "花香",
      "清甜",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 289,
    "collectCount": 678,
    "coverImage": "/assets/images/tea/taiwan-gaoshan.jpg",
    "description": "“台湾高山茶”通常用于描述台湾较高海拔茶区的乌龙茶产品，常见花香、清甜等风格；海拔并非品质的唯一判断依据。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_038",
    "name": "漳平水仙",
    "category": "oolong",
    "origin": "福建龙岩漳平",
    "variety": "水仙",
    "season": "秋茶",
    "grade": "一级",
    "fermentation": 35,
    "process": "萎凋-做青-杀青-揉捻-木模压饼-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 20,
      "vessel": "盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "office",
      "guests"
    ],
    "styleTags": [
      "兰花香",
      "清醇",
      "方饼",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 145,
    "collectCount": 367,
    "coverImage": "/assets/images/tea/zhangping-shuixian.jpg",
    "description": "漳平水仙以方形紧压茶形态较有辨识度，常采用纸包定型，部分产品呈花香与醇和滋味，便于分块携带和冲泡。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_039",
    "name": "岭头单丛",
    "category": "oolong",
    "origin": "广东潮州饶平",
    "variety": "岭头单丛",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 50,
    "process": "萎凋-做青-杀青-揉捻-烘焙",
    "storage": "密封避光",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 8,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 7
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "蜜香",
      "花韵",
      "高香",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 112,
    "collectCount": 289,
    "coverImage": "/assets/images/tea/lingtou-dancong.jpg",
    "description": "饶平岭头所产单丛，蜜香显著，口感醇厚，是凤凰单丛的姊妹茶。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_040",
    "name": "黄金桂",
    "category": "oolong",
    "origin": "福建泉州安溪",
    "variety": "黄金桂",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 35,
    "process": "萎凋-做青-杀青-揉捻-包揉-烘焙",
    "storage": "密封冷藏",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 6,
      "sweetness": 7,
      "liquor": 7,
      "endurance": 6
    },
    "brewing": {
      "temperature": 95,
      "dosage": 7,
      "firstSteep": 20,
      "vessel": "盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "afternoon",
      "office"
    ],
    "styleTags": [
      "桂花香",
      "清醇",
      "早芽种",
      "花香岩韵"
    ],
    "difficulty": 2,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 98,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/huangjingui.jpg",
    "description": "安溪四大名茶之一，桂花香明显，是乌龙茶中早芽种，香气高锐。",
    "relatedContentIds": [
      "art_005"
    ]
  },
  {
    "id": "tea_041",
    "name": "祁门红茶",
    "category": "black",
    "origin": "安徽黄山祁门",
    "variety": "祁门种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 90,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 9,
      "body": 8,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office",
      "guests"
    ],
    "styleTags": [
      "祁门香",
      "蜜糖香",
      "醇厚",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.7,
    "ratingCount": 345,
    "collectCount": 856,
    "coverImage": "/assets/images/tea/keemun.jpg",
    "description": "祁门红茶是安徽祁门等相关产区的工夫红茶，常见花香、果香、蜜香等复合香气；“王室御用”等说法不作为本条目的品质依据。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_042",
    "name": "正山小种",
    "category": "black",
    "origin": "福建南平武夷山",
    "variety": "武夷菜茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 80,
    "process": "萎凋-揉捻-发酵-松柴烘焙",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "松烟香",
      "桂圆甜",
      "醇厚",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 267,
    "collectCount": 634,
    "coverImage": "/assets/images/tea/lapsang.jpg",
    "description": "正山小种与武夷山桐木一带的红茶历史密切相关，传统烟熏型可呈松烟香，也有非烟熏风格；具体产地与工艺应核对产品标识。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_043",
    "name": "金骏眉",
    "category": "black",
    "origin": "福建南平武夷山",
    "variety": "武夷菜茶",
    "season": "明前",
    "grade": "特级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 10,
      "body": 8,
      "sweetness": 9,
      "liquor": 9,
      "endurance": 7
    },
    "brewing": {
      "temperature": 90,
      "dosage": 3,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "蜜香",
      "花果香",
      "甜润",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "待客"
    ],
    "ratingAvg": 4.8,
    "ratingCount": 423,
    "collectCount": 1067,
    "coverImage": "/assets/images/tea/jinjunmei.jpg",
    "description": "正山小种创新精品，单芽制作，金黄黑相间，蜜糖花果香交织，甜润顺滑。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_044",
    "name": "滇红",
    "category": "black",
    "origin": "云南临沧凤庆",
    "variety": "凤庆大叶种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 90,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 9,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 7
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 7
    },
    "scenes": [
      "morning",
      "afternoon",
      "office",
      "guests"
    ],
    "styleTags": [
      "薯香",
      "浓厚",
      "金毫",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 298,
    "collectCount": 712,
    "coverImage": "/assets/images/tea/dianhong.jpg",
    "description": "滇红通常以云南大叶种茶树鲜叶制成，部分产品金毫显露，常见甜香、薯香或花果香以及较浓醇的滋味。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_045",
    "name": "闽红工夫",
    "category": "black",
    "origin": "福建宁德福安",
    "variety": "福安大白茶",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "花果香",
      "醇和",
      "条索紧细",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 178,
    "collectCount": 423,
    "coverImage": "/assets/images/tea/minhong-gongfu.jpg",
    "description": "福建三大工夫红茶之一，条索紧细匀整，花果香明显，滋味醇和。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_046",
    "name": "宜红工夫",
    "category": "black",
    "origin": "湖北宜昌宜都",
    "variety": "宜红种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "甜香",
      "醇厚",
      "冷后浑",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 134,
    "collectCount": 312,
    "coverImage": "/assets/images/tea/yihong-gongfu.jpg",
    "description": "宜红工夫与湖北宜昌等产区相关，常见甜香和醇厚滋味。部分红茶冷却后会出现“冷后浑”，但不能只凭这一现象判断整体品质。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_047",
    "name": "川红工夫",
    "category": "black",
    "origin": "四川宜宾筠连",
    "variety": "川茶群体种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "橘糖香",
      "醇爽",
      "早春",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 145,
    "collectCount": 345,
    "coverImage": "/assets/images/tea/chuanhong-gongfu.jpg",
    "description": "川红工夫与四川宜宾等茶区相关，部分产品采制期较早，可呈甜香、花果香和醇爽滋味；价格与品质需结合具体产品判断。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_048",
    "name": "宁红工夫",
    "category": "black",
    "origin": "江西九江修水",
    "variety": "宁州种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 7,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "office"
    ],
    "styleTags": [
      "清醇",
      "甜润",
      "条索紧结",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.1,
    "ratingCount": 98,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/ninghong-gongfu.jpg",
    "description": "江西修水所产红茶，历史悠久，滋味清醇甜润，茶汤红亮。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_049",
    "name": "红碎茶",
    "category": "black",
    "origin": "云南临沧",
    "variety": "勐库大叶种",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 95,
    "process": "萎凋-揉切-发酵-干燥",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 5
    },
    "brewing": {
      "temperature": 95,
      "dosage": 3,
      "firstSteep": 60,
      "vessel": "茶壶",
      "maxSteeps": 3
    },
    "scenes": [
      "morning",
      "office"
    ],
    "styleTags": [
      "浓强",
      "鲜爽",
      "调饮",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4,
    "ratingCount": 87,
    "collectCount": 189,
    "coverImage": "/assets/images/tea/hongsuicha.jpg",
    "description": "红碎茶颗粒较小、浸出较快，常用于加奶或加糖调饮，也是奶茶常见基底之一；浓度和风味随等级与拼配变化。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_050",
    "name": "坦洋工夫",
    "category": "black",
    "origin": "福建宁德福安",
    "variety": "坦洋菜茶",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 85,
    "process": "萎凋-揉捻-发酵-烘焙",
    "storage": "密封常温",
    "aging": false,
    "tasteProfile": {
      "aroma": 8,
      "body": 7,
      "sweetness": 8,
      "liquor": 8,
      "endurance": 6
    },
    "brewing": {
      "temperature": 90,
      "dosage": 5,
      "firstSteep": 30,
      "vessel": "白瓷盖碗",
      "maxSteeps": 6
    },
    "scenes": [
      "morning",
      "afternoon",
      "guests"
    ],
    "styleTags": [
      "桂圆香",
      "清甜",
      "醇和",
      "甜香蜜韵"
    ],
    "difficulty": 1,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 167,
    "collectCount": 423,
    "coverImage": "/assets/images/tea/tanyang-gongfu.jpg",
    "description": "坦洋工夫是福建传统工夫红茶之一，与福安坦洋等产区相关，常见甜香、果香和较顺滑的滋味。",
    "relatedContentIds": [
      "art_007"
    ]
  },
  {
    "id": "tea_051",
    "name": "普洱生茶",
    "category": "dark",
    "origin": "云南西双版纳",
    "variety": "大叶种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 10,
    "process": "杀青-揉捻-日光干燥-蒸压成型",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 9,
      "sweetness": 6,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 10,
      "vessel": "紫砂壶",
      "maxSteeps": 12
    },
    "scenes": [
      "afternoon",
      "evening",
      "guests",
      "solo"
    ],
    "styleTags": [
      "生津",
      "回甘",
      "山野气",
      "陈香樟香"
    ],
    "difficulty": 3,
    "targetUsers": [
      "进阶",
      "资深"
    ],
    "ratingAvg": 4.6,
    "ratingCount": 356,
    "collectCount": 892,
    "coverImage": "/assets/images/tea/puer.jpg",
    "description": "普洱生茶通常以云南大叶种晒青毛茶为原料，滋味会随原料、加工和仓储发生变化；并非所有产品都适合长期收藏，也不是年份越久品质越高。",
    "relatedContentIds": [
      "art_008",
      "art_009"
    ]
  },
  {
    "id": "tea_052",
    "name": "普洱熟茶",
    "category": "dark",
    "origin": "云南西双版纳",
    "variety": "大叶种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 100,
    "process": "杀青-揉捻-日光干燥-渥堆发酵-蒸压成型",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 9,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 12
    },
    "scenes": [
      "evening",
      "winter",
      "office",
      "guests"
    ],
    "styleTags": [
      "醇厚",
      "糯滑",
      "陈香",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "入门",
      "日常"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 312,
    "collectCount": 778,
    "coverImage": "/assets/images/tea/puer-shucha.jpg",
    "description": "经渥堆工艺制成，汤色通常红浓，口感多呈醇厚、顺滑；饮用感受因人而异，不能据此宣称养胃或不伤胃。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_053",
    "name": "安化黑茶",
    "category": "dark",
    "origin": "湖南益阳安化",
    "variety": "安化群体种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-揉捻-渥堆-复揉-干燥",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 8,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 10
    },
    "scenes": [
      "afternoon",
      "evening",
      "office"
    ],
    "styleTags": [
      "松烟香",
      "醇厚",
      "金花",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 234,
    "collectCount": 567,
    "coverImage": "/assets/images/tea/anhua-heicha.jpg",
    "description": "安化雪峰山区代表性黑茶之一，可见俗称“金花”的冠突散囊菌，常呈菌花香与醇厚口感；风味会随原料、工艺和储存条件变化。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_054",
    "name": "六堡茶",
    "category": "dark",
    "origin": "广西梧州",
    "variety": "梧州群体种",
    "season": "春茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-揉捻-渥堆-复揉-干燥-陈化",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 7,
      "firstSteep": 15,
      "vessel": "紫砂壶",
      "maxSteeps": 10
    },
    "scenes": [
      "afternoon",
      "evening",
      "office"
    ],
    "styleTags": [
      "槟榔香",
      "红浓",
      "醇陈",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 167,
    "collectCount": 423,
    "coverImage": "/assets/images/tea/liubao-cha.jpg",
    "description": "六堡茶是广西梧州相关产区的黑茶，部分产品会呈现槟榔香、木香或陈香；能否长期存放取决于产品和仓储条件。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_055",
    "name": "雅安藏茶",
    "category": "dark",
    "origin": "四川雅安",
    "variety": "雅安群体种",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-蒸揉-渥堆发酵-干燥-压型",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 6,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 8,
      "firstSteep": 20,
      "vessel": "煮茶壶",
      "maxSteeps": 10
    },
    "scenes": [
      "evening",
      "winter",
      "office"
    ],
    "styleTags": [
      "醇厚",
      "陈香",
      "边疆茶",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 98,
    "collectCount": 256,
    "coverImage": "/assets/images/tea/yaan-zangcha.jpg",
    "description": "康砖属于传统紧压黑茶，历史上与边销茶贸易关系密切，常见醇和、陈香等风味；可依产品说明和个人口味选择冲泡或煮饮。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_056",
    "name": "茯砖茶",
    "category": "dark",
    "origin": "湖南益阳安化",
    "variety": "安化群体种",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-揉捻-渥堆-压制成砖-发花干燥",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 7,
      "body": 8,
      "sweetness": 7,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 10,
      "firstSteep": 20,
      "vessel": "煮茶壶",
      "maxSteeps": 10
    },
    "scenes": [
      "afternoon",
      "evening",
      "winter"
    ],
    "styleTags": [
      "菌花香",
      "金花",
      "醇厚",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 145,
    "collectCount": 378,
    "coverImage": "/assets/images/tea/fuzhuan-cha.jpg",
    "description": "茯砖茶中常见俗称“金花”的冠突散囊菌，成品可呈菌花香与醇厚滋味；它仍属于普通茶饮，不宣称消食、健胃等保健功效。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_057",
    "name": "千两茶",
    "category": "dark",
    "origin": "湖南益阳安化",
    "variety": "安化群体种",
    "season": "夏茶",
    "grade": "特级",
    "fermentation": 100,
    "process": "杀青-揉捻-渥堆-竹篾捆压-日晒夜露",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 8,
      "body": 9,
      "sweetness": 8,
      "liquor": 9,
      "endurance": 10
    },
    "brewing": {
      "temperature": 100,
      "dosage": 10,
      "firstSteep": 15,
      "vessel": "煮茶壶",
      "maxSteeps": 12
    },
    "scenes": [
      "afternoon",
      "evening",
      "guests",
      "winter"
    ],
    "styleTags": [
      "竹香",
      "醇厚",
      "陈香",
      "陈香樟香"
    ],
    "difficulty": 3,
    "targetUsers": [
      "资深",
      "收藏"
    ],
    "ratingAvg": 4.7,
    "ratingCount": 178,
    "collectCount": 489,
    "coverImage": "/assets/images/tea/qianliang-cha.jpg",
    "description": "千两茶是安化传统花卷茶，常以竹篾等材料包扎成柱形后加工；“千两”是历史名称，具体重量与工艺以产品标准和标识为准。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_058",
    "name": "青砖茶",
    "category": "dark",
    "origin": "湖北咸宁赤壁",
    "variety": "鄂南群体种",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-揉捻-渥堆-压制成砖-干燥",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 6,
      "body": 8,
      "sweetness": 6,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 10,
      "firstSteep": 20,
      "vessel": "煮茶壶",
      "maxSteeps": 10
    },
    "scenes": [
      "afternoon",
      "evening",
      "winter"
    ],
    "styleTags": [
      "陈香",
      "浓厚",
      "边销茶",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4.1,
    "ratingCount": 87,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/qingzhuan-cha.jpg",
    "description": "羊楼洞所产老青砖，历史悠久，汤色红黄，滋味浓厚，为西北牧区日常饮品。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_059",
    "name": "康砖茶",
    "category": "dark",
    "origin": "四川雅安",
    "variety": "雅安群体种",
    "season": "夏茶",
    "grade": "一级",
    "fermentation": 100,
    "process": "杀青-蒸揉-渥堆发酵-压制成砖-干燥",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 6,
      "body": 8,
      "sweetness": 6,
      "liquor": 8,
      "endurance": 9
    },
    "brewing": {
      "temperature": 100,
      "dosage": 8,
      "firstSteep": 20,
      "vessel": "煮茶壶",
      "maxSteeps": 10
    },
    "scenes": [
      "evening",
      "winter"
    ],
    "styleTags": [
      "陈醇",
      "浓厚",
      "藏区",
      "陈香樟香"
    ],
    "difficulty": 2,
    "targetUsers": [
      "进阶",
      "日常"
    ],
    "ratingAvg": 4,
    "ratingCount": 65,
    "collectCount": 178,
    "coverImage": "/assets/images/tea/kangzhuan-cha.jpg",
    "description": "康砖茶是四川边茶体系中的紧压茶，历史上与藏区等地的茶叶贸易和消费密切相关，常见较浓醇的滋味。",
    "relatedContentIds": [
      "art_008"
    ]
  },
  {
    "id": "tea_060",
    "name": "老班章",
    "category": "dark",
    "origin": "云南西双版纳勐海",
    "variety": "班章大叶种",
    "season": "春茶",
    "grade": "特级",
    "fermentation": 10,
    "process": "杀青-揉捻-日光干燥",
    "storage": "通风干燥",
    "aging": true,
    "tasteProfile": {
      "aroma": 9,
      "body": 10,
      "sweetness": 7,
      "liquor": 9,
      "endurance": 10
    },
    "brewing": {
      "temperature": 95,
      "dosage": 8,
      "firstSteep": 8,
      "vessel": "紫砂壶",
      "maxSteeps": 15
    },
    "scenes": [
      "afternoon",
      "guests",
      "solo"
    ],
    "styleTags": [
      "茶气",
      "霸气",
      "苦尽甘来",
      "陈香樟香"
    ],
    "difficulty": 4,
    "targetUsers": [
      "资深",
      "收藏"
    ],
    "ratingAvg": 4.8,
    "ratingCount": 289,
    "collectCount": 734,
    "coverImage": "/assets/images/tea/laobanzhang.jpg",
    "description": "老班章是普洱茶市场中知名的产区名称，常被描述为滋味浓强、苦味明显并伴随回甘；具体表现取决于原料真实性、年份、工艺和冲泡方式。",
    "relatedContentIds": [
      "art_008",
      "art_009"
    ]
  }
];

const travelsData = [
  {
    "id": "travel_001",
    "title": "武夷山三日慢行 · 一场岩茶之旅",
    "primaryDomain": "travel",
    "destination": {
      "name": "武夷山",
      "region": "福建南平",
      "history": "武夷山于1999年列入世界文化与自然遗产名录。九曲溪、丹霞地貌、寺观与书院遗存共同构成其自然和文化景观，这里也与宋代以来理学的发展传播密切相关。",
      "culture": "武夷岩茶是当地重要的茶文化名片，“三坑两涧”常用于指称传统核心山场。山中保留多处宗教与书院遗存，游览时应把景观、茶史和当代商业宣传区分开来。"
    },
    "route": [
      {
        "day": 1,
        "title": "抵武夷 · 茶馆初识岩茶",
        "spots": [
          {
            "name": "三姑兰汤",
            "desc": "抵武夷山第一站，找一间临溪茶馆，先泡一壶肉桂歇脚"
          },
          {
            "name": "武夷宫",
            "desc": "了解武夷山历史文化，并从九曲溪一带开始慢行"
          },
          {
            "name": "宋街",
            "desc": "傍晚漫步仿宋古街，在老茶铺试饮几款岩茶小样"
          }
        ]
      },
      {
        "day": 2,
        "title": "三坑两涧 · 走岩茶核心产区",
        "spots": [
          {
            "name": "牛栏坑",
            "desc": "传统岩茶山场之一，可观察丹崖、沟谷与茶园环境"
          },
          {
            "name": "慧苑坑",
            "desc": "传统岩茶山场之一，沿途了解水仙等品种及山场环境"
          },
          {
            "name": "大红袍景区",
            "desc": "九龙窠绝壁上的六株母树大红袍，岩茶图腾"
          },
          {
            "name": "天心永乐禅寺",
            "desc": "午后在寺中喝一杯禅茶，听山风过松"
          }
        ]
      },
      {
        "day": 3,
        "title": "天游峰 · 告别与回味",
        "spots": [
          {
            "name": "天游峰",
            "desc": "清晨登顶看云海九曲，武夷全景尽收眼底"
          },
          {
            "name": "九曲溪竹筏",
            "desc": "顺流而下，从水上再看一遍丹崖茶山"
          },
          {
            "name": "星村茶市",
            "desc": "离山前在茶市选几泡岩茶带回家"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_031",
        "context": "大红袍母树就在九龙窠绝壁上"
      },
      {
        "domain": "tea",
        "refId": "tea_032",
        "context": "牛栏坑肉桂，走产区必喝的一泡"
      },
      {
        "domain": "tea",
        "refId": "tea_033",
        "context": "慧苑坑老丛水仙，岩茶中的温润派"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "山居期间尽量保持规律作息与适量步行"
      }
    ],
    "essay": "这条路线把九曲溪、丹霞山水与岩茶产区放在同一次慢行中。所谓“岩韵”是茶叶品评语汇，不宜简单归因于某一种矿物或地质成分；真正体验时，可把不同品种、焙火程度和冲泡方式放在一起比较。进入山场应遵守景区与生产区域规定，不采摘茶叶，也不把商家故事当作产地或年份证明。",
    "coverImage": "/assets/images/travel/wuyishan.jpg",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "3天",
    "pace": "slow"
  },
  {
    "id": "travel_002",
    "title": "苏州两日慢行 · 园林评弹与碧螺春",
    "primaryDomain": "travel",
    "destination": {
      "name": "苏州",
      "region": "江苏苏州",
      "history": "苏州古城拥有两千多年历史。以拙政园等为代表的九座古典园林列入世界遗产名录，展示了江南园林在有限空间中组织水、石、植物与建筑的传统。",
      "culture": "洞庭山地区与碧螺春生产关系密切，茶园中可见茶树与果树相邻种植的传统景观。苏州评弹以苏州话演唱说表，是当地重要的曲艺形式。"
    },
    "route": [
      {
        "day": 1,
        "title": "拙政园 · 评弹书场",
        "spots": [
          {
            "name": "拙政园",
            "desc": "清晨入园，观察水池、山石、植物与建筑形成的空间层次"
          },
          {
            "name": "苏州博物馆",
            "desc": "参观贝聿铭主持设计的新馆，留意现代建筑与苏州城市肌理的衔接"
          },
          {
            "name": "平江路评弹书场",
            "desc": "午后听一段评弹，配一壶碧螺春，吴侬软语里消磨半日"
          },
          {
            "name": "山塘街",
            "desc": "傍晚水街灯火，找间临河小馆吃一碗苏式面"
          }
        ]
      },
      {
        "day": 2,
        "title": "洞庭碧螺春 · 太湖风光",
        "spots": [
          {
            "name": "洞庭东山",
            "desc": "碧螺春原产地，茶园与枇杷杨梅间作"
          },
          {
            "name": "紫金庵",
            "desc": "庵中罗汉塑像传神，在此喝一杯碧螺春"
          },
          {
            "name": "太湖大桥",
            "desc": "黄昏过桥看太湖落日，烟波浩渺"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "洞庭山与碧螺春生产关系密切，可观察当地茶园景观"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "在书场了解苏州评弹的说表、唱腔与伴奏"
      }
    ],
    "essay": "这条路线以古典园林、评弹书场和洞庭山茶园为三条线索。园林适合观察借景、对景与空间转换，评弹则应提前确认场次和演出内容。碧螺春的香气受品种、采摘、加工和保存共同影响，“茶果相邻”可作为地域景观理解，不宜被写成单一、确定的香气成因。",
    "coverImage": "/assets/images/travel/suzhou-garden.jpg",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "2天",
    "pace": "slow"
  },
  {
    "id": "travel_003",
    "title": "徽州三日 · 古村香事与黄山茶",
    "primaryDomain": "travel",
    "destination": {
      "name": "徽州",
      "region": "安徽黄山",
      "history": "徽州历史文化区域以商业传统、宗族聚落和地方建筑著称。西递、宏村作为皖南古村落代表列入世界遗产名录，保存了街巷、水系、民居与装饰工艺等历史信息。",
      "culture": "黄山毛峰、太平猴魁和祁门红茶均与黄山地区相关。古村中的祠堂、民居、木石雕刻和地方戏曲遗存，可作为理解徽州社会文化的线索；具体香铺或演出需以现场开放信息为准。"
    },
    "route": [
      {
        "day": 1,
        "title": "宏村西递 · 粉墙黛瓦",
        "spots": [
          {
            "name": "宏村南湖",
            "desc": "清晨薄雾中的月沼和南湖，水墨画就是写实"
          },
          {
            "name": "西递牌坊",
            "desc": "观察胡文光牌坊的结构、题刻与石雕细节"
          },
          {
            "name": "承志堂",
            "desc": "参观承志堂，观察徽州民居布局与木雕装饰"
          }
        ]
      },
      {
        "day": 2,
        "title": "黄山 · 云海毛峰",
        "spots": [
          {
            "name": "黄山风景区",
            "desc": "天都峰看云海，迎客松前打卡"
          },
          {
            "name": "半山寺茶亭",
            "desc": "在合规开放的休息点品饮黄山毛峰，饮水以安全水源为准"
          },
          {
            "name": "老香铺",
            "desc": "下山后漫步屯溪老街，按实际营业情况了解地方用香与手工艺"
          }
        ]
      },
      {
        "day": 3,
        "title": "祁门 · 红茶故里",
        "spots": [
          {
            "name": "祁门茶山",
            "desc": "走访祁红产区，看槠叶种茶树"
          },
          {
            "name": "老茶厂",
            "desc": "参观传统祁红工夫制作工艺"
          },
          {
            "name": "古村戏台",
            "desc": "傍晚在古戏台前喝祁红，听一段徽调"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "黄山毛峰，可在正规茶馆比较不同水温与冲泡方式"
      },
      {
        "domain": "tea",
        "refId": "tea_006",
        "context": "太平猴魁，黄山北麓猴坑所产"
      },
      {
        "domain": "tea",
        "refId": "tea_041",
        "context": "祁门红茶，以当地工夫红茶制作与香气风格闻名"
      },
      {
        "domain": "wellness",
        "refId": "wellness_010",
        "context": "徽州老香铺的合香手艺与地方用香文化"
      }
    ],
    "essay": "这条路线串联皖南古村、黄山景区与祁门茶区。宏村和西递适合从水系、街巷、民居及雕刻细节理解传统聚落；黄山段需根据天气、索道和步道开放情况调整；茶厂、香铺与戏台并非固定开放点，出发前应预约确认。路线中的品饮和手作体验属于文化活动，不代表产品疗效或品质背书。",
    "coverImage": "/assets/images/travel/huangshan.jpg",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "3天",
    "pace": "slow"
  },
  {
    "id": "travel_004",
    "title": "杭州两日 · 龙井村与古琴雅集",
    "primaryDomain": "travel",
    "destination": {
      "name": "杭州",
      "region": "浙江杭州",
      "history": "杭州曾为南宋都城。西湖及其三面环山的文化景观于2011年列入世界遗产名录，堤、岛、桥、寺塔与园林共同体现长期营造形成的山水审美传统。",
      "culture": "西湖龙井是杭州代表性茶类，相关保护范围和产区划分应以现行地理标志与监管信息为准。“十八棵御茶”与乾隆南巡的关联属于广泛流传的地方茶文化叙事。"
    },
    "route": [
      {
        "day": 1,
        "title": "西湖龙井村 · 茶山漫步",
        "spots": [
          {
            "name": "龙井村",
            "desc": "清晨入村，看茶农炒茶，闻满村茶香"
          },
          {
            "name": "十八棵御茶",
            "desc": "了解“十八棵御茶”相关的地方传说与龙井茶文化展示"
          },
          {
            "name": "龙井寺",
            "desc": "寺里喝一杯龙井，看龙井泉池"
          },
          {
            "name": "梅家坞",
            "desc": "午后在梅家坞茶农家泡一壶龙井，对着茶山发呆"
          }
        ]
      },
      {
        "day": 2,
        "title": "灵隐禅茶 · 古琴雅集",
        "spots": [
          {
            "name": "灵隐寺",
            "desc": "清晨参拜，在飞来峰下喝一杯禅茶"
          },
          {
            "name": "法镜寺",
            "desc": "三天竺之一，比灵隐更幽静，适合散步"
          },
          {
            "name": "西湖琴社",
            "desc": "傍晚参加一场古琴雅集，一琴一茶，湖风入弦"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "西湖龙井，可结合龙井村茶文化展示了解相关地方传说"
      },
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "径山茶，余杭径山寺的禅茶一味"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "古琴雅集，适合作为了解古琴音乐与茶空间的文化活动"
      },
      {
        "domain": "wellness",
        "refId": "wellness_007",
        "context": "禅茶冥想，灵隐寺的静心体验"
      }
    ],
    "essay": "这条路线把西湖文化景观、龙井茶区和古琴活动放在两天内体验。茶农炒制、寺院茶事和琴社雅集都受季节、预约与场次影响，页面不预设一定能够遇到。购买西湖龙井时应查看产地、标识和经营资质，不以“御茶”等故事替代来源核验。",
    "coverImage": "/assets/images/travel/hangzhou-xihu.jpg",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "2天",
    "pace": "slow"
  },
  {
    "id": "travel_005",
    "title": "成都三日 · 盖碗茶与川戏慢生活",
    "primaryDomain": "travel",
    "destination": {
      "name": "成都",
      "region": "四川成都",
      "history": "成都平原拥有悠久的城市与水利文化。茶馆、川剧以及蜀锦蜀绣等传统，共同构成当代成都可见的地方文化景观。",
      "culture": "盖碗茶是成都常见的茶馆体验；蒙顶山茶与川红则来自四川不同茶区。川剧演出内容和场地会变化，应以剧场当日节目及安全提示为准。"
    },
    "route": [
      {
        "day": 1,
        "title": "人民公园 · 盖碗茶日常",
        "spots": [
          {
            "name": "鹤鸣茶社",
            "desc": "百年老茶社，竹椅盖碗，成都慢生活的标志"
          },
          {
            "name": "宽窄巷子",
            "desc": "午后逛宽窄，找间茶馆喝碗花茶"
          },
          {
            "name": "蜀风雅韵",
            "desc": "晚上看川剧变脸吐火，老戏园子里的成都味道"
          }
        ]
      },
      {
        "day": 2,
        "title": "蒙顶山 · 茶祖故里",
        "spots": [
          {
            "name": "蒙顶山",
            "desc": "了解蒙顶山茶史，以及吴理真植茶的地方传说"
          },
          {
            "name": "天盖寺",
            "desc": "蒙顶五峰中心，喝一杯蒙顶甘露"
          },
          {
            "name": "皇茶园",
            "desc": "参观皇茶园相关茶文化景观与历史展示"
          }
        ]
      },
      {
        "day": 3,
        "title": "宜宾 · 川红工夫",
        "spots": [
          {
            "name": "宜宾茶山",
            "desc": "了解宜宾茶区与川红工夫的原料、加工和市场历史"
          },
          {
            "name": "老茶馆",
            "desc": "喝一碗川红，配本地小吃"
          },
          {
            "name": "锦里夜市",
            "desc": "回成都后逛锦里，吃碗担担面收尾"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_010",
        "context": "蒙顶甘露，可结合当地茶史与吴理真传说了解"
      },
      {
        "domain": "tea",
        "refId": "tea_047",
        "context": "川红工夫，宜宾所产的早春红茶"
      },
      {
        "domain": "wellness",
        "refId": "wellness_003",
        "context": "午后小憩，成都人的盖碗茶午休哲学"
      },
      {
        "domain": "wellness",
        "refId": "wellness_008",
        "context": "从茶馆日常观察成都的公共休闲文化"
      }
    ],
    "essay": "这条路线从成都茶馆延伸到蒙顶山和宜宾茶区，跨城距离较长，三天安排需要预留交通时间。吴理真植茶属于地方历史传说，应与可核验的遗址、文献和现代茶业展示分开理解。茶馆休息可以是旅行节奏的一部分，但不承担“养生”或治疗作用。",
    "coverImage": "/assets/images/travel/chengdu-teahouse.jpg",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "3天",
    "pace": "slow"
  },
  {
    "id": "travel_006",
    "title": "泉州两日 · 海丝香料与铁观音",
    "primaryDomain": "travel",
    "destination": {
      "name": "泉州",
      "region": "福建泉州",
      "history": "“泉州：宋元中国的世界海洋商贸中心”于2021年列入世界遗产名录。系列遗产展示了10至14世纪泉州的生产、运输、贸易及多元社会文化联系。",
      "culture": "安溪县隶属泉州，与铁观音生产密切相关。开元寺、清净寺、码头、桥梁等遗产要素反映了历史商贸与多元信仰；南音是闽南地区重要的传统音乐形式。"
    },
    "route": [
      {
        "day": 1,
        "title": "古城寻香 · 南音雅乐",
        "spots": [
          {
            "name": "开元寺",
            "desc": "千年古刹，东西双塔是泉州地标"
          },
          {
            "name": "涂门街",
            "desc": "步行了解清净寺、府文庙等古城文化遗存，按各点开放时间安排"
          },
          {
            "name": "海交馆或古城街巷",
            "desc": "通过博物馆展陈和遗产点了解宋元泉州的海洋贸易"
          },
          {
            "name": "南音艺苑",
            "desc": "如有公开场次，可现场了解南音的唱腔与乐器组合"
          }
        ]
      },
      {
        "day": 2,
        "title": "安溪 · 铁观音原乡",
        "spots": [
          {
            "name": "安溪铁观音文化园",
            "desc": "了解铁观音从种到制的全流程"
          },
          {
            "name": "西坪镇",
            "desc": "了解西坪与铁观音相关的地方历史、制作传统和来源传说"
          },
          {
            "name": "茶农家",
            "desc": "在正规经营场所比较不同工艺铁观音的香气与滋味"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_034",
        "context": "安溪铁观音，可在西坪了解相关地方历史与制作传统"
      },
      {
        "domain": "tea",
        "refId": "tea_040",
        "context": "黄金桂，安溪四大名茶之一"
      },
      {
        "domain": "wellness",
        "refId": "wellness_010",
        "context": "通过博物馆与遗产点了解海洋贸易中的香料和商品交流"
      }
    ],
    "essay": "第一天以泉州古城和世界遗产点为主，通过遗址与博物馆理解宋元海洋贸易，不把后世商业故事写成确定史实；南音演出需提前核对公开场次。第二天前往安溪了解铁观音，关于“母树”和起源的不同说法应作为地方传说看待，购买茶叶则以可追溯产地、执行标准和经营资质为准。",
    "coverImage": "",
    "bestSeason": [
      "spring",
      "autumn"
    ],
    "duration": "2天",
    "pace": "slow"
  }
];

const wellnessData = [
  {
    "id": "wellness_001",
    "title": "春日作息：规律睡眠与户外活动",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "spring",
    "organ": "liver",
    "difficulty": 1,
    "duration": "10分钟/天",
    "body": "春季昼长逐渐增加，可以把生活重点放在固定起床时间、白天接触自然光和适量户外活动上。花茶或绿茶可以作为日常饮品，但不承担“排毒”或治疗情绪、肝脏问题的作用；对咖啡因敏感的人，下午和晚上宜选择无咖啡因饮品。若持续出现明显不适，应咨询专业医务人员。",
    "tips": [
      "尽量保持稳定的入睡和起床时间",
      "白天安排散步等适量活动",
      "把茶当作饮品，不替代诊断、药物或治疗"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹常见花香，可按口味与咖啡因耐受情况选择"
      },
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春常见清鲜与花果香风格，可作为日常饮品"
      }
    ],
    "coverImage": "/assets/images/wellness/spring.jpg"
  },
  {
    "id": "wellness_002",
    "title": "夏日午间休息：补水与短暂放松",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "summer",
    "organ": "heart",
    "difficulty": 1,
    "duration": "20分钟/天",
    "body": "炎热天气里，优先关注补水、遮阳、通风和避免长时间暴晒。午间如果困倦，可以在安全舒适的环境中短暂闭目休息，具体时长以醒后不影响夜间睡眠为准。出现头晕、恶心、意识异常等疑似中暑表现时，应停止活动、转移到凉爽处并及时寻求医疗帮助。",
    "tips": [
      "随身准备饮用水，按口渴程度及时补充",
      "避免正午长时间暴晒和剧烈活动",
      "身体明显不适时不要用茶饮或偏方代替就医"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针风味较清鲜，可按个人口味选择"
      },
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "西湖龙井是含咖啡因茶饮，午后饮用需结合个人耐受情况"
      }
    ],
    "coverImage": "/assets/images/wellness/summer.jpg"
  },
  {
    "id": "wellness_003",
    "title": "午后小憩：给注意力一次短暂停顿",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "午后出现困意很常见。条件允许时，可以设置十几到二十分钟的休息时间，闭目或短睡都可以；有人适合更短，也有人并不适合午睡。关键是醒后状态舒适，并且不影响晚间入睡。若长期白天嗜睡或伴随打鼾、呼吸暂停等情况，应咨询医生。",
    "tips": [
      "设置闹钟，避免无意中睡得过久",
      "找安全、安静且能支撑颈背的位置",
      "长期异常嗜睡需要专业评估"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_034",
        "context": "铁观音是含咖啡因茶饮，饮用量与时间因人而异"
      }
    ],
    "coverImage": "/assets/images/wellness/nap.jpg"
  },
  {
    "id": "wellness_004",
    "title": "秋日舒适：补水、通风与规律作息",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "autumn",
    "organ": "lung",
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "秋季空气可能更干燥，可以通过适量饮水、保持室内通风和按需使用加湿设备提高舒适度。梨、银耳等可以作为普通食物选择，但不能替代对咳嗽、过敏或皮肤问题的诊疗。保持规律睡眠和适量活动，比用单一食物解释或解决所有不适更稳妥。",
    "tips": [
      "按体感调节室内湿度并定期清洁加湿器",
      "饮食保持多样，不把单一食物当作药物",
      "持续咳嗽、气促或过敏应及时就医"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_017",
        "context": "老白茶可能呈现枣香、木质香等陈香，可按口味选择"
      },
      {
        "domain": "tea",
        "refId": "tea_013",
        "context": "部分陈年寿眉适合煮饮，具体以产品状态和说明为准"
      }
    ],
    "coverImage": "/assets/images/wellness/autumn.jpg"
  },
  {
    "id": "wellness_005",
    "title": "旅行中的作息：用晨光帮助调整节律",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "3天",
    "body": "安静环境、规律作息和白天自然光都有助于建立稳定的睡眠节奏，但不存在“住山里三天就能重置生物钟”的统一结论。旅行或居家都可以从固定起床时间、早晨接触自然光、睡前减少强光和刺激性活动开始。调整需要时间，效果也因人而异。",
    "tips": [
      "先固定起床时间，再逐步调整入睡时间",
      "早晨接触自然光，晚上降低环境亮度",
      "不要自行长期使用褪黑素或助眠药物"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_017",
        "context": "晚间对咖啡因敏感者应留意白茶仍可能含咖啡因"
      },
      {
        "domain": "travel",
        "refId": "travel_001",
        "context": "武夷山三日慢行，可在旅行中保持规律作息"
      }
    ],
    "coverImage": "/assets/images/wellness/mountain-rest.jpg"
  },
  {
    "id": "wellness_006",
    "title": "听曲放松：留出二十分钟安静时间",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "20分钟/次",
    "body": "音乐可以成为放松练习的一部分，但每个人对曲目、节奏和音色的反应不同。选择自己觉得舒适的音乐，以安全音量聆听，并观察情绪和身体感受即可。音乐不能替代焦虑、失眠或心血管问题的专业诊疗；若症状持续或加重，应寻求专业帮助。",
    "tips": [
      "音量以不掩盖周围重要声音为宜",
      "选择自己真正觉得舒适的曲目",
      "不要把音乐描述为降血压或治疗焦虑的方法"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与古琴可作为茶席中的文化搭配"
      },
      {
        "domain": "travel",
        "refId": "travel_002",
        "context": "苏州评弹书场，可作为了解地方曲艺的实地体验"
      }
    ],
    "coverImage": "/assets/images/wellness/music-relax.jpg"
  },
  {
    "id": "wellness_007",
    "title": "正念饮茶：一杯茶里的十分钟练习",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "10分钟/次",
    "body": "正念饮茶是一种注意力练习：观察茶叶、温度、香气和入口感受，发现走神后再把注意力带回当下。它不要求特定姿势，也不保证产生某种效果。对咖啡因敏感、孕期或正在服药的人，应根据专业建议选择饮品和饮用量。",
    "tips": [
      "放慢冲泡和饮用速度，留意五感变化",
      "茶水温度以入口舒适、避免烫伤为准",
      "晚上容易失眠时选择无咖啡因饮品"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "径山茶与当地寺院、茶文化历史有关"
      },
      {
        "domain": "travel",
        "refId": "travel_004",
        "context": "杭州灵隐寺，可了解当地宗教与茶文化语境"
      }
    ],
    "coverImage": "/assets/images/wellness/zen-tea.jpg"
  },
  {
    "id": "wellness_008",
    "title": "慢生活练习：给日常留一点余量",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "每天",
    "body": "“慢一点”可以理解为减少同时处理多件事，给吃饭、步行和休息留出完整时间。它是一种生活安排，不是治疗内分泌或让身体“自动修复”的医学方法。可以从每天安排一段无屏幕时间、专心吃一顿饭或散步开始，并根据自己的工作与健康状况调整。",
    "tips": [
      "一次只做一件事，减少频繁切换",
      "规律进餐并留意饥饱感",
      "把短暂休息纳入日程，而不是等到精疲力尽"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_052",
        "context": "普洱熟茶风味较醇和，可按个人口味选择"
      },
      {
        "domain": "travel",
        "refId": "travel_005",
        "context": "成都三日，观察当地茶馆与公共休闲文化"
      }
    ],
    "coverImage": "/assets/images/wellness/slow-life.jpg"
  },
  {
    "id": "wellness_009",
    "title": "冬日作息：保暖与适度活动",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "winter",
    "organ": "kidney",
    "difficulty": 2,
    "duration": "每天",
    "body": "冬季可以根据气温增加衣物、保持规律睡眠，并选择步行、拉伸等适合自己的活动。羊肉、坚果和茶都只是普通饮食的一部分，不具有统一的“补肾”效果。老年人、慢性病患者或正在服药的人调整饮食和运动前，应结合医生建议。",
    "tips": [
      "在安全条件下保持适度日间活动",
      "饮食多样，留意盐、糖和总能量",
      "极端低温或路面湿滑时优先保证安全"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_052",
        "context": "普洱熟茶可作为冬日热饮选择之一"
      },
      {
        "domain": "tea",
        "refId": "tea_053",
        "context": "安化黑茶可按个人口味和咖啡因耐受情况饮用"
      }
    ],
    "coverImage": "/assets/images/wellness/winter.jpg"
  },
  {
    "id": "wellness_010",
    "title": "睡前仪式：用低刺激活动结束一天",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "30分钟/次",
    "body": "稳定的睡前流程可以帮助大脑识别“准备休息”的时间，例如调暗灯光、停止工作、阅读纸质书或做轻柔拉伸。焚香不是失眠治疗；燃烧产生烟雾，也存在火灾风险，不应在睡着时继续燃烧。长期失眠或伴随明显情绪问题时，应寻求专业评估。",
    "tips": [
      "睡前减少强光、工作消息和刺激性内容",
      "不要在卧室无人看管地燃烧香品",
      "持续失眠不要依赖香、茶或偏方处理"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_013",
        "context": "寿眉仍可能含咖啡因，睡前饮用需结合个人耐受情况"
      },
      {
        "domain": "travel",
        "refId": "travel_003",
        "context": "徽州街巷用香与手工艺体验需提前核对开放信息"
      }
    ],
    "coverImage": "/assets/images/wellness/incense-sleep.jpg"
  },
  {
    "id": "wellness_011",
    "title": "晨起补水：按口渴程度饮水",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "2分钟/天",
    "body": "起床后可以按口渴程度喝水，温度和饮用速度以舒适为准。没有必要规定每个人必须在五分钟内喝完固定水量，也不能把晨起饮水描述成“稀释血液、排毒或治疗便秘”。心脏、肾脏疾病患者若需要限制饮水，应遵循医生建议。",
    "tips": [
      "选择洁净饮用水，温度以舒适为准",
      "无需强迫自己一次喝下大量水",
      "需要限水的人按医嘱安排饮水量"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/morning-water.jpg"
  },
  {
    "id": "wellness_012",
    "title": "温水泡脚：舒适与安全优先",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "温水泡脚可以带来温暖和放松感，但不能“打通经络”或治疗失眠、手脚冰凉。水温应避免烫伤，时间以皮肤没有明显发红、疼痛或头晕为准。糖尿病周围神经病变、足部伤口、循环障碍或感觉减退者，泡脚前应咨询医务人员。",
    "tips": [
      "先用温度计或手肘确认水温不过热",
      "出现疼痛、头晕或皮肤异常立即停止",
      "不要随意加入可能刺激皮肤的草药或化学品"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/foot-bath.jpg"
  },
  {
    "id": "wellness_013",
    "title": "屏幕间歇：让眼睛定时休息",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": "eye",
    "difficulty": 1,
    "duration": "5分钟/次",
    "body": "长时间近距离看屏幕容易引起眼干和视疲劳。可以尝试“20-20-20”休息法：每二十分钟看约六米外至少二十秒，同时主动眨眼并调整屏幕距离与环境光。茶饮和掌心热敷不能治疗近视、飞蚊症或眼病；视力突然变化、眼痛或闪光感应及时就医。",
    "tips": [
      "定时远眺并主动眨眼",
      "屏幕与眼睛保持舒适距离，避免眩光",
      "突发视力变化或眼痛应及时就医"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_007",
        "context": "安吉白茶是绿茶品类，可按香气与口味选择"
      }
    ],
    "coverImage": "/assets/images/wellness/eye-care.jpg"
  },
  {
    "id": "wellness_014",
    "title": "每周半天数字休息：把注意力还给生活",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 3,
    "duration": "半天/周",
    "body": "数字休息是主动减少非必要屏幕使用，不需要把刚开始的不适称为医学意义上的“戒断反应”。可以提前告知亲友，保留紧急联络方式，再用散步、阅读、做饭或面对面交流替代刷屏。目标不是完全拒绝技术，而是重新安排注意力。",
    "tips": [
      "从一小时或半天开始，逐步调整",
      "保留紧急联系人和必要通知",
      "准备无需屏幕的替代活动"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/digital-detox.jpg"
  }
];

const incenseData = [
  {
    "id": "incense_001",
    "title": "沉香：层次细腻的木质香",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "海南",
    "difficulty": 2,
    "duration": "30-60分钟",
    "price": "高端",
    "body": "沉香来自瑞香科树木受伤后形成的含树脂木质，香气会因树种、产地、结香方式和加工方法而不同。品香时可以记录凉、甜、木质或树脂等个人感受，不把“静心”描述为确定的生理功效。购买时应选择来源可追溯、符合野生动植物保护和贸易规定的产品。",
    "tips": [
      "少量、短时使用并保持通风",
      "选择来源和成分标识清楚的产品",
      "离开房间前确认火源完全熄灭"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与沉香可分别用于茶席和嗅觉文化体验"
      },
      {
        "domain": "music",
        "refId": "music_001",
        "context": "古琴与用香常见于传统文人生活的文化叙述"
      }
    ],
    "coverImage": "/assets/images/incense/chenxiang.jpg"
  },
  {
    "id": "incense_002",
    "title": "檀香：温润的木质气息",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "印度",
    "difficulty": 1,
    "duration": "20-40分钟",
    "price": "中端",
    "body": "檀香通常呈现温润、奶甜或木质调，但气味体验具有主观性，不宜用“最好”给产地或等级下统一结论。天然檀香涉及不同树种与贸易规则，购买时应核对学名、产地和合法来源。香气只能作为嗅觉体验，不能宣称助眠或治疗作用。",
    "tips": [
      "先从低浓度、短时间体验",
      "核对产品成分与合法来源",
      "呼吸道敏感者出现不适应立即停止"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种与檀香可形成茶香、木香并置的主观体验"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "檀香可作为嗅觉与用香文化体验，燃烧时注意通风"
      }
    ],
    "coverImage": "/assets/images/incense/tanxiang.jpg"
  },
  {
    "id": "incense_003",
    "title": "龙涎香：来自海洋的香料传奇",
    "primaryDomain": "incense",
    "category": "animal",
    "origin": "海洋",
    "difficulty": 3,
    "duration": "特殊场合",
    "price": "顶级",
    "body": "龙涎香与抹香鲸消化系统有关，经过海水和空气长期作用后气味会发生变化，历史上常用于调香和定香。不同地区对拾取、持有和交易的规定并不相同，来源不明的所谓“真品”难以仅凭气味判断。日常体验可优先选择成分透明的合成替代品。",
    "tips": [
      "不要根据商家故事判断真伪",
      "交易前核对所在地的保护与贸易规定",
      "优先选择成分和来源清晰的替代香料"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针与龙涎香相关香品的搭配属于个人嗅味偏好"
      }
    ],
    "coverImage": "/assets/images/incense/longxianxiang.jpg"
  },
  {
    "id": "incense_004",
    "title": "艾草香：端午习俗中的草本气息",
    "primaryDomain": "incense",
    "category": "herbal",
    "origin": "中国",
    "difficulty": 1,
    "duration": "15-30分钟",
    "price": "平价",
    "body": "端午悬艾是常见民俗，艾草燃烧后会产生鲜明草本气味和烟雾。这里介绍的是文化与嗅觉体验，不宣称祛湿、通经络、驱蚊或比蚊香更健康。室内使用任何燃烧型香品都应控制时间、保持通风，并远离儿童、宠物和可燃物。",
    "tips": [
      "不要在密闭空间大量燃烧",
      "不把香品当作驱蚊或治疗用品",
      "使用稳定耐热的香具并全程看护"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "艾草香可作为传统时令用香文化了解，不宣称祛湿功效"
      }
    ],
    "coverImage": "/assets/images/incense/aicao.jpg"
  },
  {
    "id": "incense_005",
    "title": "桂花香：秋日花香记忆",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "中国",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "桂花气味常被描述为甜润、带果香，不同配方可能使用天然提取物、合成香料或二者混合。气味容易唤起个人记忆，但这种联想没有统一答案。挑选时可以关注配料、浓度和自己是否舒适，而不是追求所谓固定功效。",
    "tips": [
      "先试闻再决定使用时长",
      "避免用“天然”直接等同于安全",
      "出现头痛、咳嗽或刺激感立即通风停用"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音与桂花香的搭配属于个人嗅味偏好"
      },
      {
        "domain": "film",
        "refId": "film_001",
        "context": "观看《小森林》时可从桂花等季节意象理解影片氛围"
      }
    ],
    "coverImage": "/assets/images/incense/guihua-xiang.jpg"
  },
  {
    "id": "incense_006",
    "title": "崖柏香：清凉而带树脂感的木香",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "中国",
    "difficulty": 2,
    "duration": "30-50分钟",
    "price": "中端",
    "body": "市售“崖柏”产品的树种、来源和命名可能并不一致，气味通常带木质、树脂或清凉感。它不应被宣传为消炎、安神、助眠，更不能与安眠药比较。购买时应关注合法来源与真实成分，避免为稀缺故事支付不透明溢价。",
    "tips": [
      "核对树种、产地和来源证明",
      "不要把香气体验当作医疗效果",
      "卧室使用时保持通风且睡前完全熄灭"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱与崖柏相关香品的搭配属于个人嗅味偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "崖柏气味较鲜明，体验时注意通风并控制燃烧时间"
      }
    ],
    "coverImage": "/assets/images/incense/yabai-xiang.jpg"
  },
  {
    "id": "incense_007",
    "title": "麝香：传统香料中的定香角色",
    "primaryDomain": "incense",
    "category": "animal",
    "origin": "中国/俄罗斯",
    "difficulty": 3,
    "duration": "特殊场合",
    "price": "顶级",
    "body": "传统天然麝香来自麝类动物，相关物种受到保护，贸易和使用受到严格管理。现代香水与香品通常使用合成麝香来提供留香和定香效果。消费者不应购买来源不明的天然麝香，也不要把动物性来源当作品质保证。",
    "tips": [
      "优先选择合法合规的合成麝香产品",
      "避开来源不明的动物性原料",
      "低浓度试闻，出现不适立即停用"
    ],
    "linkedDomains": [
      {
        "domain": "incense",
        "refId": "incense_005",
        "context": "配方香中的麝香调与桂花调需按实际成分和配方理解"
      }
    ],
    "coverImage": "/assets/images/incense/shexiang.jpg"
  },
  {
    "id": "incense_008",
    "title": "茉莉花香：夏夜清雅花香",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "中国/印度",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "茉莉香常呈现清甜花香，具体气味取决于原料、提取和调配方式。它可以用于营造个人喜欢的空间氛围，但不能保证提神或改善健康。室内使用应控制浓度并保持空气流通。",
    "tips": [
      "选择成分标识清楚的产品",
      "书房使用也要保持通风",
      "气味偏好因人而异，不必追求固定搭配"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与茉莉香的搭配属于个人嗅味偏好"
      },
      {
        "domain": "music",
        "refId": "music_002",
        "context": "古筝与茉莉香可形成个人化的听觉、嗅觉体验"
      }
    ],
    "coverImage": "/assets/images/incense/molihua-xiang.jpg"
  },
  {
    "id": "incense_009",
    "title": "降真香：传统仪式中的用香",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "东南亚",
    "difficulty": 2,
    "duration": "40-60分钟",
    "price": "中高端",
    "body": "降真香在部分历史记载和宗教仪式中出现，“通神”“净场”属于传统信仰语境，不是可验证的产品功效。现代使用可以关注木质、甜香或树脂感等嗅觉层次，并尊重不同文化背景。购买和使用时同样需要核对来源、控制烟量和注意防火。",
    "tips": [
      "把仪式含义与事实功效分开表达",
      "使用耐热香具并保持通风",
      "香材受潮或来源不明时不要燃烧"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍与降真香相关香品的搭配属于个人嗅味偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "安静练习时若使用燃烧型香品，应通风并看护火源"
      }
    ],
    "coverImage": "/assets/images/incense/jiangzhen-xiang.jpg"
  },
  {
    "id": "incense_010",
    "title": "藿香：鲜明的草本香气",
    "primaryDomain": "incense",
    "category": "herbal",
    "origin": "中国",
    "difficulty": 1,
    "duration": "15-20分钟",
    "price": "平价",
    "body": "藿香具有辨识度较高的草本气味，但闻香与服用药物不是一回事。燃烧藿香不能替代中暑处理、胃肠不适诊疗或驱蚊产品，也不能声称比其他蚊香更健康。出现疑似中暑或持续不适时，应优先降温、补水并按情况就医。",
    "tips": [
      "不要把香品当作药品或驱蚊用品",
      "味道较强时缩短使用时间并通风",
      "身体不适时优先采取规范处置"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "藿香相关香品可作为气味与传统文化体验，不宣称防暑功效"
      }
    ],
    "coverImage": "/assets/images/incense/huoxiang.jpg"
  },
  {
    "id": "incense_011",
    "title": "乳香：跨越多种文明的树脂香",
    "primaryDomain": "incense",
    "category": "resin",
    "origin": "阿拉伯/非洲",
    "difficulty": 2,
    "duration": "30-45分钟",
    "price": "中端",
    "body": "乳香是乳香属植物分泌的芳香树脂，在中东、地中海及其他地区的宗教和贸易史中长期出现。焚烧时会产生树脂与柑橘、木质等气味，但“净化空间”只能作为文化或感受描述，不能理解为消毒或改变所谓气场。直接炭烧烟量较大，更要注意通风和防火。",
    "tips": [
      "区分文化象征与消毒、治疗等实际功能",
      "避免在密闭空间直接炭烧",
      "树脂和炭火完全冷却后再处理"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍与乳香的并置可用于比较茶香与树脂香"
      }
    ],
    "coverImage": "/assets/images/incense/ruxiang.jpg"
  },
  {
    "id": "incense_012",
    "title": "薰衣草：柔和的草本花香",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "法国",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "薰衣草常被用于香氛产品，很多人觉得其草本花香适合安静场景，但个体感受和研究结果并不支持把它称作“紫色安眠药”。薰衣草香不能替代失眠或焦虑的诊疗。燃烧型产品仍会产生烟雾，卧室使用尤其要注意通风和火源安全。",
    "tips": [
      "不要把薰衣草香与安眠药作效果比较",
      "先低浓度试闻，留意头痛或呼吸道刺激",
      "睡前必须确认香品完全熄灭"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "薰衣草可作为气味偏好体验，不替代睡眠问题的诊疗"
      },
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹与薰衣草气味的搭配属于个人偏好，不宣称助眠"
      }
    ],
    "coverImage": "/assets/images/incense/xunyicao.jpg"
  }
];

const musicData = [
  {
    "id": "music_001",
    "title": "《流水》：高山流水遇知音",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "先秦",
    "difficulty": 2,
    "duration": "8分13秒",
    "body": "《流水》是古琴代表曲目之一，历代谱本和演绎版本并不完全相同。它常与伯牙、钟子期“知音”的传说联系在一起，音乐中可听到由舒缓到密集、再归于平静的层次。1977年旅行者号金唱片收录的是管平湖演奏的《流水》；本应用当前采用的是另一份有明确许可的现代录音，两者不可混为同一版本。",
    "tips": [
      "先完整听一遍，再留意速度与密度的变化",
      "保持舒适音量，区分本应用录音与金唱片版本",
      "可以记录自己听到的水流意象"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与古琴常见于传统文人生活的文化叙述"
      },
      {
        "domain": "incense",
        "refId": "incense_001",
        "context": "沉香与古琴的搭配属于个人嗅觉、听觉体验"
      }
    ],
    "audioSrc": "/assets/audio/liushui.mp3",
    "audioLicense": {
      "performer": "Charlie Huang",
      "sourceName": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Liu_Shui.ogg",
      "licenseName": "CC BY 2.5",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
      "changeNote": "使用 Wikimedia Commons 自动生成的 MP3 格式转码，未作内容剪辑"
    },
    "coverImage": "/assets/images/music/gaoshan.jpg"
  },
  {
    "id": "music_002",
    "title": "《渔舟唱晚》：夕阳下的归舟",
    "primaryDomain": "music",
    "category": "guzheng",
    "instrument": "古筝",
    "dynasty": "唐代",
    "difficulty": 1,
    "duration": "5分钟",
    "body": "《渔舟唱晚》是二十世纪广泛流传的古筝曲，标题取自中国古典诗文中的渔舟晚归意象。旋律由舒展逐渐转为明快，常被理解为水面、夕照和归舟的音乐画面。关于早期整理与传承存在不同说法，介绍时不把单一版本写成唯一来源。",
    "tips": [
      "留意由舒展到明快的节奏变化",
      "不同演奏版本的速度和段落可能不同",
      "把画面联想当作个人感受而非唯一答案"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种与古筝可形成个人化的嗅味、听觉体验"
      },
      {
        "domain": "film",
        "refId": "film_002",
        "context": "可比较古筝曲与武侠电影配乐的不同表达方式"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/yuzhou.jpg"
  },
  {
    "id": "music_003",
    "title": "《二泉映月》：阿炳留下的二胡名篇",
    "primaryDomain": "music",
    "category": "erhu",
    "instrument": "二胡",
    "dynasty": "近代",
    "difficulty": 2,
    "duration": "4分28秒",
    "body": "《二泉映月》与民间音乐家华彦钧（阿炳）密切相关。1950年，音乐工作者为他录下包括这首作品在内的曲目，使其得以保存和传播。作品的情绪常被听众理解为低回、沉郁而有力量，但具体感受属于个人聆听体验。",
    "tips": [
      "先听旋律线条，再关注弓法和力度变化",
      "情绪感受因人而异，不必预设一定会悲伤",
      "保持舒适音量，避免长时间高音量耳机聆听"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱与二胡可形成个人化的嗅味、听觉体验"
      }
    ],
    "audioSrc": "/assets/audio/erquan-yingyue.mp3",
    "audioLicense": {
      "performer": "张沛坚（Zhang Peijian）",
      "recorder": "David290",
      "sourceName": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E4%BA%8C%E6%B3%89%E6%98%A0%E6%9C%88.ogg",
      "licenseName": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "changeNote": "使用 Wikimedia Commons 自动生成的 MP3 格式转码，未作内容剪辑"
    },
    "coverImage": "/assets/images/music/erquan.jpg"
  },
  {
    "id": "music_004",
    "title": "《春江花月夜》：月光下的东方画卷",
    "primaryDomain": "music",
    "category": "ensemble",
    "instrument": "民乐合奏",
    "dynasty": "唐代",
    "difficulty": 1,
    "duration": "10分钟",
    "body": "《春江花月夜》与琵琶曲《夕阳箫鼓》的传播和改编有关，后来形成广为人知的民族管弦乐版本。音乐通过多个段落展开江面、月色与远处歌声等意象。不同编制和版本的结构、时长会有差异。",
    "tips": [
      "比较琵琶独奏与民族管弦乐版本的差异",
      "留意段落之间的速度与织体变化",
      "版本时长不同属于正常现象"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针与《春江花月夜》的搭配属于个人偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_004",
        "context": "夜间聆听请控制音量，并避免影响正常作息"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/chunjiang.jpg"
  },
  {
    "id": "music_005",
    "title": "《十面埋伏》：传统琵琶武曲",
    "primaryDomain": "music",
    "category": "pipa",
    "instrument": "琵琶",
    "dynasty": "明代",
    "difficulty": 3,
    "duration": "6分钟",
    "body": "《十面埋伏》是传统琵琶武曲，通常以楚汉战争和垓下之战的紧张场面为叙事背景。快速轮指、扫弦等演奏效果营造出行军、交锋和追逐的戏剧感。它是一种音乐化叙事，不应把具体段落当作历史事件的录音式还原。",
    "tips": [
      "用舒适音量感受力度，不需要刻意开大音量",
      "留意轮指、扫弦带来的节奏效果",
      "把历史背景与音乐化叙事区分开"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍与《十面埋伏》的搭配属于个人偏好"
      },
      {
        "domain": "film",
        "refId": "film_003",
        "context": "可比较琵琶曲与电影《英雄》配乐的不同叙事作用"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/shimian-maifu.jpg"
  },
  {
    "id": "music_006",
    "title": "《梅花三弄》：凌寒独自开",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "晋代",
    "difficulty": 2,
    "duration": "8分钟",
    "body": "《梅花三弄》在古琴、箫等不同器乐传统中都有流传。“三弄”通常与主题在不同音区或段落中的反复呈现有关，梅花意象则常被赋予清雅、坚韧的文化联想。具体结构应以所听版本为准。",
    "tips": [
      "留意主题如何在不同段落中重现",
      "可以比较古琴与箫等不同器乐版本",
      "文化意象允许有个人理解"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种与《梅花三弄》的搭配属于个人偏好"
      },
      {
        "domain": "incense",
        "refId": "incense_002",
        "context": "檀香与《梅花三弄》的搭配属于个人嗅觉、听觉体验"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/meihua-sannong.jpg"
  },
  {
    "id": "music_007",
    "title": "《百鸟朝凤》：唢呐名曲中的百鸟声",
    "primaryDomain": "music",
    "category": "suona",
    "instrument": "唢呐",
    "dynasty": "民间",
    "difficulty": 1,
    "duration": "5分钟",
    "body": "《百鸟朝凤》是流传广泛的唢呐曲，不同地区和演奏家形成了多种版本。乐曲常用唢呐技巧模拟鸟鸣，并在舒展与热烈的段落之间变化。2016年上映的同名电影以唢呐传承为主题，但电影故事与乐曲版本并不是同一件事。",
    "tips": [
      "留意唢呐模拟鸟鸣的音色变化",
      "可以比较不同地区或演奏家的版本",
      "高音段落应以舒适音量聆听"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与《百鸟朝凤》的搭配属于个人偏好"
      },
      {
        "domain": "film",
        "refId": "film_004",
        "context": "电影《百鸟朝凤》以唢呐传承为重要主题"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/bainiao-zhaofeng.jpg"
  },
  {
    "id": "music_008",
    "title": "《平沙落雁》：秋高气爽，雁阵惊寒",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "明代",
    "difficulty": 2,
    "duration": "7分14秒",
    "body": "《平沙落雁》是流传版本很多的古琴曲，明代琴谱中已经可以见到相关谱本。作品常借雁群远近、起落与栖息的意象表现开阔、从容的空间感。不同琴派的节奏和句法各有处理。",
    "tips": [
      "留意旋律中远近、疏密的空间感",
      "不同琴派版本不必追求完全相同",
      "安静环境更容易听到弱音细节"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音与《平沙落雁》的搭配属于个人偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_001",
        "context": "秋季聆听时可留意曲中舒展的节奏与留白"
      }
    ],
    "audioSrc": "/assets/audio/pingsha-luoyan.mp3",
    "audioLicense": {
      "performer": "Charlie Huang",
      "sourceName": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg",
      "licenseName": "CC BY 2.5",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
      "changeNote": "使用 Wikimedia Commons 自动生成的 MP3 格式转码，未作内容剪辑"
    },
    "coverImage": "/assets/images/music/pingsha-luoyan.jpg"
  },
  {
    "id": "music_009",
    "title": "《阳关三叠》：劝君更尽一杯酒",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "唐代",
    "difficulty": 2,
    "duration": "5分50秒",
    "body": "《阳关三叠》以王维《送元二使安西》的送别诗意为基础，是诗、歌与琴乐结合的代表性作品之一。“三叠”与曲中诗句和曲调的反复展开有关，不同传谱版本的唱词和结构可能不同。",
    "tips": [
      "先读王维原诗，再听曲调如何反复展开",
      "有唱词与纯器乐版本可供比较",
      "离别意象是理解路径之一"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_006",
        "context": "君山银针与《阳关三叠》的搭配属于个人偏好"
      }
    ],
    "audioSrc": "/assets/audio/yangguan-sandie.mp3",
    "audioLicense": {
      "performer": "Charlie Huang（Charles R Tsua）",
      "sourceName": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Guqin-Yangguan_Sandie.ogg",
      "licenseName": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "changeNote": "使用 Wikimedia Commons 自动生成的 MP3 格式转码，未作内容剪辑"
    },
    "coverImage": "/assets/images/music/yangguan-sandie.jpg"
  },
  {
    "id": "music_010",
    "title": "《高山》：巍巍乎志在高山",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "先秦",
    "difficulty": 3,
    "duration": "9分钟",
    "body": "《高山》常与《流水》并列，并与伯牙、钟子期的知音传说相联系。它借高山意象表现沉稳、开阔的气质，但具体作者与早期形态难以用单一说法确定。聆听时可以关注散音、按音与泛音之间的音色变化。",
    "tips": [
      "留意散音、按音和泛音的对比",
      "可以与《流水》的不同版本对照聆听",
      "不要把传说直接当作确定作者史料"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍与《高山》的搭配属于个人偏好"
      },
      {
        "domain": "incense",
        "refId": "incense_001",
        "context": "沉香与《高山》的搭配属于个人嗅觉、听觉体验"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/gaoshan-2.jpg"
  },
  {
    "id": "music_011",
    "title": "《琵琶行》：大珠小珠落玉盘",
    "primaryDomain": "music",
    "category": "pipa",
    "instrument": "琵琶",
    "dynasty": "唐代",
    "difficulty": 2,
    "duration": "12分钟",
    "body": "“琵琶行”常被用来指以白居易长诗《琵琶行》为主题创作或改编的琵琶作品，并非只有一个固定的古代标准版本。不同演奏版本会选择不同段落和技法来回应诗中的声音描写，因此曲目名称、结构和时长需要结合具体录音说明。",
    "tips": [
      "先确认具体录音的作曲、改编和演奏信息",
      "可对照诗中的声音描写聆听",
      "不同版本不能仅凭同名视为同一作品"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹与《琵琶行》主题音乐的搭配属于个人偏好"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/pipaxing.jpg"
  },
  {
    "id": "music_012",
    "title": "《渔樵问答》：隐士的哲学对话",
    "primaryDomain": "music",
    "category": "guqin",
    "instrument": "古琴",
    "dynasty": "明代",
    "difficulty": 2,
    "duration": "8分钟",
    "body": "《渔樵问答》是古琴传统曲目，借渔者与樵者的问答意象表达山林生活和处世思考。不同谱本与演奏版本的段落数量和处理并不完全一致。聆听时可以留意旋律句子之间仿佛问答般的呼应。",
    "tips": [
      "留意旋律句子之间的呼应",
      "可以比较不同琴谱或演奏版本",
      "把哲学联想保留为开放理解"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与《渔樵问答》的搭配属于个人偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "安静练习时可用安全音量聆听古琴，感受因人而异"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/yuqiao-wenda.jpg"
  }
];

const filmData = [
  {
    "id": "film_001",
    "title": "《小森林》：四季里的自给生活",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "森淳一",
    "year": 2014,
    "difficulty": 1,
    "duration": "120分钟",
    "body": "日本电影《小森林》分为夏秋篇与冬春篇，主人公市子回到东北地区的小森生活，通过耕作、烹饪和四季变化重新理解家庭与自己的选择。食物既是日常劳动，也是人物记忆和关系的线索。影片节奏舒缓，但“慢生活”并不等于逃避现实。",
    "tips": [
      "留意食物与人物记忆之间的联系",
      "可以分两部观看，不必一次看完",
      "把影片生活方式视为叙事选择而非通用答案"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井与《小森林》的搭配属于个人观影偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_003",
        "context": "从家庭饮食与关系变化理解影片主题"
      }
    ],
    "coverImage": "/assets/images/film/xiaosenlin.jpg"
  },
  {
    "id": "film_002",
    "title": "《卧虎藏龙》：欲望、责任与自由",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "李安",
    "year": 2000,
    "difficulty": 1,
    "duration": "120分钟",
    "body": "李安执导的《卧虎藏龙》围绕青冥剑、李慕白、俞秀莲和玉娇龙展开。竹林、屋顶等动作场面把武术与人物关系结合起来，压抑的情感和对自由的渴望贯穿全片。玉娇龙结尾的选择具有开放性，不宜把单一解释写成确定答案。",
    "tips": [
      "留意动作场面如何表达人物关系",
      "比较李慕白、俞秀莲与玉娇龙的不同选择",
      "对结尾保留多种解释"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春与《卧虎藏龙》的搭配属于个人观影偏好"
      },
      {
        "domain": "music",
        "refId": "music_005",
        "context": "可把《十面埋伏》与其他武侠作品作主题比较"
      }
    ],
    "coverImage": "/assets/images/film/wohu-canglong.jpg"
  },
  {
    "id": "film_003",
    "title": "《英雄》：不同叙述中的同一场刺杀",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "张艺谋",
    "year": 2002,
    "difficulty": 1,
    "duration": "100分钟",
    "body": "张艺谋执导的《英雄》通过红、蓝、白等不同色彩段落呈现关于刺秦行动的多种叙述。颜色帮助区分版本和情绪，但其含义并不存在唯一官方答案。影片把个人复仇、权力与“天下”的观念放在一起讨论，观众可以同时关注其视觉形式和价值争议。",
    "tips": [
      "留意同一事件在不同叙述中的变化",
      "把色彩理解视为分析而非固定答案",
      "讨论影片价值观时区分人物立场与作品立场"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种与《英雄》的搭配属于个人观影偏好"
      },
      {
        "domain": "music",
        "refId": "music_005",
        "context": "可比较琵琶曲与《英雄》配乐的不同叙事作用"
      }
    ],
    "coverImage": "/assets/images/film/yingxiong.jpg"
  },
  {
    "id": "film_004",
    "title": "《百鸟朝凤》：唢呐传承与时代变化",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "吴天明",
    "year": 2016,
    "difficulty": 2,
    "duration": "108分钟",
    "body": "吴天明执导的《百鸟朝凤》以师徒关系和唢呐班的处境为主线，呈现传统技艺在社会变化中的传承压力。影片关注的不只是某一种乐器，也包括行业尊严、学习选择和乡土礼俗。它可以作为理解传承困境的入口，但不代表所有民间音乐的现实状况。",
    "tips": [
      "留意师徒关系如何推动人物选择",
      "把电影情节与真实行业调查区分开",
      "观影后可进一步了解不同地区的唢呐传统"
    ],
    "linkedDomains": [
      {
        "domain": "music",
        "refId": "music_007",
        "context": "电影《百鸟朝凤》以唢呐传承为重要主题"
      },
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱与《百鸟朝凤》的搭配属于个人观影偏好"
      }
    ],
    "coverImage": "/assets/images/film/bainiao-zhaofeng-film.jpg"
  },
  {
    "id": "film_005",
    "title": "《千与千寻》：名字、劳动与成长",
    "primaryDomain": "film",
    "category": "anime",
    "director": "宫崎骏",
    "year": 2001,
    "difficulty": 1,
    "duration": "125分钟",
    "body": "宫崎骏的《千与千寻》讲述千寻误入异世界后，为救父母进入澡堂工作。汤婆婆把她改名为“千”，名字由此成为身份与记忆的重要线索。影片包含成长、劳动、欲望和环境等多重主题，不必归结为单一寓意。",
    "tips": [
      "留意名字在人物关系中的作用",
      "观察无脸男在不同环境中的变化",
      "允许儿童与成人得到不同理解"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_009",
        "context": "黄山毛峰与《千与千寻》的搭配属于个人观影偏好"
      }
    ],
    "coverImage": "/assets/images/film/qianyu-qianxun.jpg"
  },
  {
    "id": "film_006",
    "title": "《饮食男女》：饭桌上的家庭变化",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "李安",
    "year": 1994,
    "difficulty": 1,
    "duration": "124分钟",
    "body": "李安执导的《饮食男女》围绕退休厨师老朱和三个女儿的家庭生活展开。每周聚餐连接着婚恋、职业和代际沟通，也不断被新的选择打破。精细的烹饪场面不是装饰，而是人物表达关心和维系家庭关系的方式。",
    "tips": [
      "留意每次家庭聚餐前后的关系变化",
      "观察食物如何代替人物说出情感",
      "不要提前查结局，保留叙事转折"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音与《饮食男女》的搭配属于个人观影偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_003",
        "context": "从家庭饮食与关系变化理解影片主题"
      }
    ],
    "coverImage": "/assets/images/film/yinshi-nannv.jpg"
  },
  {
    "id": "film_007",
    "title": "《入殓师》：职业、告别与尊严",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "�的田洋次",
    "year": 2008,
    "difficulty": 2,
    "duration": "130分钟",
    "body": "泷田洋二郎执导的《入殓师》讲述大悟从大提琴手转行从事入殓工作的经历。影片通过一次次告别呈现职业偏见、家庭关系和对死亡的态度。它可能触发与丧亲有关的情绪，是否适合在特定阶段观看应由观众自己判断。",
    "tips": [
      "留意主人公对职业态度的变化",
      "对丧亲内容敏感时可暂停或择期观看",
      "把影片仪式与现实地区习俗区分开"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹与《入殓师》的搭配属于个人观影偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_007",
        "context": "影片涉及死亡、职业与家庭关系，适合结合观众承受度观看"
      }
    ],
    "coverImage": "/assets/images/film/rulishi.jpg"
  },
  {
    "id": "film_008",
    "title": "《海街日记》：共同生活中的四姐妹",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "是枝裕和",
    "year": 2015,
    "difficulty": 1,
    "duration": "128分钟",
    "body": "是枝裕和执导的《海街日记》讲述三姐妹邀请同父异母的妹妹一起生活。做饭、梅酒、烟花和步行等日常细节逐渐显出每个人对父母、离别和家庭的不同感受。影片没有给“家”下唯一结论，而是让关系在共同生活中慢慢形成。",
    "tips": [
      "留意日常物件如何承载家庭记忆",
      "观察四姐妹不同的表达方式",
      "节奏舒缓，适合完整观看而非只看片段"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春与《海街日记》的搭配属于个人观影偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "可从夏日场景与姐妹日常理解影片氛围"
      }
    ],
    "coverImage": "/assets/images/film/haijieriji.jpg"
  },
  {
    "id": "film_009",
    "title": "《花样年华》：克制与错过",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "王家卫",
    "year": 2000,
    "difficulty": 2,
    "duration": "98分钟",
    "body": "王家卫执导的《花样年华》以二十世纪六十年代香港为背景，周慕云与苏丽珍在发现各自配偶的关系后逐渐靠近。狭窄空间、重复音乐、服装和慢动作共同构成克制的情绪。影片大量留白，人物是否相爱、为何退让都可以有不同理解。",
    "tips": [
      "留意空间和重复音乐对情绪的作用",
      "不要把流传台词都默认成正片对白",
      "对人物关系保留开放解释"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱与《花样年华》的搭配属于个人观影偏好"
      },
      {
        "domain": "music",
        "refId": "music_003",
        "context": "可比较《二泉映月》与《花样年华》的情绪表达"
      }
    ],
    "coverImage": "/assets/images/film/huayang-nianhua.jpg"
  },
  {
    "id": "film_010",
    "title": "《龙猫》：乡间生活与儿童想象",
    "primaryDomain": "film",
    "category": "anime",
    "director": "宫崎骏",
    "year": 1988,
    "difficulty": 1,
    "duration": "86分钟",
    "body": "宫崎骏的《龙猫》讲述小月和小梅随父亲搬到乡间，并在母亲住院期间遇见森林中的神秘生物。现实中的家庭担忧与儿童想象交织在一起，猫巴士、雨夜候车等场景因此既轻盈又带有不安。影片可以带来安慰感，但不能保证“立刻治愈”情绪问题。",
    "tips": [
      "留意现实处境与幻想场景如何交替",
      "可以和孩子讨论害怕、等待和想象",
      "情绪低落持续时不要只依赖影视作品调节"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_010",
        "context": "茉莉花茶与《龙猫》的搭配属于个人观影偏好"
      }
    ],
    "coverImage": "/assets/images/film/longmao.jpg"
  },
  {
    "id": "film_011",
    "title": "《一代宗师》：武术传承与时代流变",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "王家卫",
    "year": 2013,
    "difficulty": 2,
    "duration": "111分钟",
    "body": "王家卫执导的《一代宗师》以叶问及多位武林人物的经历讨论门派、传承与时代变化。雨夜、金楼和火车站等场面通过光线、速度和剪辑塑造记忆感。影片存在不同发行版本，观看时应区分版本差异，也不必把角色台词当作历史人物原话。",
    "tips": [
      "先确认所观看的是哪个发行版本",
      "留意动作设计如何服务人物关系",
      "区分电影人物、历史人物与艺术加工"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍与《一代宗师》的搭配属于个人观影偏好"
      },
      {
        "domain": "music",
        "refId": "music_010",
        "context": "可比较古琴曲《高山》与《一代宗师》的审美表达"
      }
    ],
    "coverImage": "/assets/images/film/yidaizongshi.jpg"
  },
  {
    "id": "film_012",
    "title": "《情书》：书信里的记忆重访",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "岩井俊二",
    "year": 1995,
    "difficulty": 1,
    "duration": "117分钟",
    "body": "岩井俊二执导的《情书》从渡边博子寄往旧地址的一封信开始，两位同名“藤井树”的往事逐渐被重新拼合。书信、图书卡和雪景连接着悼念、误认与未说出口的感情。影片更关注记忆如何被理解，而不是为遗憾提供标准答案。",
    "tips": [
      "留意两条时间线如何通过书信连接",
      "观察图书卡等物件的叙事作用",
      "对丧亲内容敏感时按自己的节奏观看"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针与《情书》的搭配属于个人观影偏好"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "可从冬日场景与书信结构理解影片氛围"
      }
    ],
    "coverImage": "/assets/images/film/qingshu.jpg"
  }
];

module.exports = {
  teas: teasData,
  travels: travelsData,
  wellness: wellnessData,
  incense: incenseData,
  music: musicData,
  film: filmData,
  tutorials: studyData.tutorials,
  knowledge: studyData.knowledge,
  interviewQuestions: studyData.interviewQuestions,
  studyTaxonomy: studyData.taxonomy,
};
