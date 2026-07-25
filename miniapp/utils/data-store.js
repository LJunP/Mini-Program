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
    "description": "中国十大名茶之首，以色绿、香郁、味甘、形美四绝著称，明前龙井尤为珍贵。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "产于太湖洞庭山，茶果间作，天然花果香，条索纤细卷曲如螺。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "黄山风景区特产，以兰花香和回甘著称，形似雀舌，白毫披身。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "豫南名茶，以细圆紧直、白毫满披著称，汤色嫩绿明亮。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "世界唯一无芽无梗的茶叶，由单片叶制成，形似瓜子，板栗香明显。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "猴坑特产，两叶抱一芽，扁平挺直，兰花香高爽持久。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "名为白茶实为绿茶，因低温白化现象而成，氨基酸含量极高，鲜爽清甜。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "径山寺周边所产，茶禅一味，条索细紧，香气清高。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "钱江源头所产，芽叶在杯中根根竖立，如山林出水，清香持久。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "蒙山五大名茶之一，卷曲多毫，汤色黄碧，香甜鲜爽，回甘持久。 【冲泡物理】：绿茶属不发酵茶。因未破坏叶绿素酶活性，保留了高浓度的氨基酸与茶多酚。建议使用 80-85℃ 温水，切忌用刚沸腾的 100℃ 热水直冲，否则会烫熟嫩芽释放大量苦涩的咖啡碱。建议采用'中投法'：先注水三分之一，置茶，再逆时针低冲旋转注水，促使氨基酸快速物理溶出，茶汤清澈嫩绿。 【茶道美学】：陆羽《茶经》评：'茶之为用，味至寒，为饮最宜。'绿茶至鲜至纯，代表着雨后春山的一点孤静，宜在清晨独坐或 office 办公静心时冲泡，其豆香与兰香能瞬间唤醒副交感神经的专注力。",
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
    "description": "白茶极品，全芽披毫，色白如银，毫香蜜韵，一年茶三年药七年宝。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "一芽一两叶，形似牡丹，花香明显，滋味醇厚回甘。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "白茶中产量最高的品类，叶态舒展，陈化后枣香浓郁，煮饮更佳。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "以菜茶为原料制成，滋味清甜醇厚，是传统白茶的代表。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "压制成饼便于陈化存放，随年份增长蜜韵渐显，口感更趋醇厚。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "政和所产白茶，山野气息明显，滋味醇厚，与福鼎白茶各有千秋。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
      "养生"
    ],
    "ratingAvg": 4.8,
    "ratingCount": 312,
    "collectCount": 845,
    "coverImage": "/assets/images/tea/lao-baicha.jpg",
    "description": "陈放七年以上的白茶，枣香药香交融，汤色琥珀，煮饮最佳，有三年药七年宝之说。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "云南特色白茶，月光下萎凋而成，黑白相间如月光，花蜜香明显。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "明前嫩芽所制白茶，毫香显著，汤色浅黄，口感清甜柔和。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "云南古树茶为原料，山野气韵足，滋味厚重，兼具白茶清甜与古树厚度。 【冲泡物理】：白茶是不炒不揉的极简工序茶。仅通过自然萎凋与干燥制成。富含黄酮类物质，具有极强的物理抗氧化能力。冲泡陈年老白茶宜采用煮茶法，在陶壶中沸水慢火煮 3-5 分钟，能使茶多糖与矿物质物理深度溶出，释放出浓郁的药香与枣香。 【茶道美学】：宋徽宗《大观茶论》赞白茶：'如玉之莹，无与伦比。'白茶随时间物理转化，'一年茶，三年药，七年宝'。其朴素天然的银针毫白，展现了道家法天贵真、大巧不工的极简美学，宜在心浮气躁或夜雨敲窗时静静品饮。",
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
    "description": "黄茶之冠，君山岛所产，冲泡时芽头三起三落，如群笋出土，甜香醇爽。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "蒙顶五大名茶之一，闷黄工艺造就独特甜醇，扁直挺秀，芽毫显露。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "大别山腹地所产，形似雀舌，闷黄后清香中带甜润，汤色黄绿。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "岳阳北港所产黄茶，条索紧结重实，汤色杏黄，滋味甘醇。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "沩山密印寺一带所产，独特的松烟香和闷黄工艺，滋味醇厚甘爽。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "鹿苑寺一带所产，条索环状，色泽金黄，蜜香显著，回甘持久。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "广东特产黄茶，大叶种制成，滋味浓厚醇正，为黄茶中大叶种代表。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "平阳特产，汤色金黄明亮，滋味甜润醇和，为浙江黄茶代表。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "霍山传统黄大茶，叶大黄大，独特的锅巴香，滋味浓醇，烟火气十足。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "贵州高原黄茶，海拔高气温低，茶叶内含物丰富，滋味清醇甘爽。 【冲泡物理】：黄茶是中国特有的茶类。在绿茶工艺基础上增加了一道'闷黄'工序。在湿热物理作用下，叶绿素发生物理非酶降解，形成了'黄叶黄汤'。冲泡使用 85℃ 温水，使用玻璃杯或轻薄瓷盖碗，避免茶汤发闷，释放其特有的甜爽玉米香。 【茶道美学】：黄茶之美在于'藏'。它避开了绿茶的锋芒毕露，多了一份内敛与圆润。其温和的中庸属性代表着东方儒学折中不偏的智慧，适合日常办公或独处思考时温和相伴。",
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
    "description": "岩茶之王，生长于武夷山九龙窠绝壁，岩骨花香，九泡有余香。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "岩茶新贵，以辛锐桂皮香著称，香气霸道，岩韵明显，醇厚回甘。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "岩茶老牌品种，兰花香幽雅，汤水醇厚柔滑，老丛水仙更带苔藓韵。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "乌龙茶极品，七泡有余香，兰花香高雅持久，音韵悠长，秋茶最佳。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "凤凰山单株采摘制作，香型丰富，蜜兰香最经典，高香持久，山韵明显。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "台湾乌龙代表，半球形颗粒，花香带奶香，喉韵生津，冬茶最佳。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "海拔千米以上所产，高山冷凉气候造就清雅花香与甘甜，汤色蜜绿。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "独有的水仙茶饼工艺，木模压制方饼，兰花香显，携带方便。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "饶平岭头所产单丛，蜜香显著，口感醇厚，是凤凰单丛的姊妹茶。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "安溪四大名茶之一，桂花香明显，是乌龙茶中早芽种，香气高锐。 【冲泡物理】：乌龙茶（青茶）属半发酵茶。尤以武夷岩茶最具物理特征：叶片因摇青形成'绿叶红镶边'。岩茶需要 100℃ 的高温沸水，采用'悬壶高冲'直击茶叶，使其物理受热均匀。第一泡 5 秒内迅速出汤。其独特的'岩骨花香'来自其丹霞地貌土壤所含的微量矿物元素物理滋养。 【茶道美学】：宋代范仲淹叹岩茶：'溪边奇茗冠天下，武夷仙人从古栽。'岩茶之美在于'骨气'与'重浊'，其厚重的焙火香与后续悠长的回甘代表着旧式隐忍与折中的大成，是深夜独思或与知己深谈的黄金茶伴。",
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
    "description": "世界三大高香红茶之一，独特的祁门香似花似果似蜜，英国王室御用。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "世界红茶鼻祖，桐木关所产，独特松烟香和桂圆甜，是红茶的原型。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "正山小种创新精品，单芽制作，金黄黑相间，蜜糖花果香交织，甜润顺滑。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "云南大叶种红茶，金毫显露，滋味浓厚，薯香明显，性价比较高。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "福建三大工夫红茶之一，条索紧细匀整，花果香明显，滋味醇和。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "湖北宜昌所产，茶汤冷后浑浊为品质标志，甜香明显，滋味醇厚。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "四川早春红茶，上市早，独特的橘糖香，滋味醇爽，性价比较高。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "江西修水所产红茶，历史悠久，滋味清醇甜润，茶汤红亮。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "颗粒状碎茶，浸出快，滋味浓强，适合加奶加糖调饮，为奶茶基底首选。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "闽红三大工夫之首，坦洋村所产，桂圆香明显，清甜顺滑。 【冲泡物理】：红茶为全发酵茶。在发酵阶段，多酚氧化酶与过氧化物酶将茶多酚完全氧化，转化为茶红素和茶黄素，物理上形成了红叶红汤和明亮的金圈。冲泡宜用 90-95℃ 沸水，采用'高冲注水'，使茶叶在盖碗中快速物理翻滚，彻底激发红茶独特的蜜糖香与果香。 【茶道美学】：红茶性温，茶汤温暖红亮，代表着包容与圆融。适合在午后慵懒或会客时搭配甜点，茶多酚物理降解后对胃粘膜无刺激，温中暖胃，能营造出松弛、舒适的对话场域。",
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
    "description": "新茶霸气生津，老茶醇厚转甜，越陈越香，是可喝可藏的活茶。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.5,
    "ratingCount": 312,
    "collectCount": 778,
    "coverImage": "/assets/images/tea/puer-shucha.jpg",
    "description": "渥堆发酵加速陈化，汤色红浓明亮，口感醇厚糯滑，温和不伤胃。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.4,
    "ratingCount": 234,
    "collectCount": 567,
    "coverImage": "/assets/images/tea/anhua-heicha.jpg",
    "description": "安化雪峰山所产，独特的金花菌和松烟香，消食解腻，越陈越醇。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 167,
    "collectCount": 423,
    "coverImage": "/assets/images/tea/liubao-cha.jpg",
    "description": "广西特产黑茶，独特的槟榔香，汤色红浓，侨销茶代表，耐陈放。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.2,
    "ratingCount": 98,
    "collectCount": 256,
    "coverImage": "/assets/images/tea/yaan-zangcha.jpg",
    "description": "千年边销茶，专供藏区，深度发酵，醇厚温润，煮饮最佳。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.3,
    "ratingCount": 145,
    "collectCount": 378,
    "coverImage": "/assets/images/tea/fuzhuan-cha.jpg",
    "description": "砖茶代表，独特的金花菌（冠突散囊菌）绽放其中，菌花香明显，消食健胃。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "世界茶王",
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
    "description": "安化黑茶之王，圆柱形竹篾捆扎，重千两，日晒夜露自然发酵，醇厚绵长。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4.1,
    "ratingCount": 87,
    "collectCount": 234,
    "coverImage": "/assets/images/tea/qingzhuan-cha.jpg",
    "description": "羊楼洞所产老青砖，历史悠久，汤色红黄，滋味浓厚，为西北牧区日常饮品。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "养生"
    ],
    "ratingAvg": 4,
    "ratingCount": 65,
    "collectCount": 178,
    "coverImage": "/assets/images/tea/kangzhuan-cha.jpg",
    "description": "四川南路边茶代表，压制紧实，汤色红浓，滋味醇厚，专供藏区。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
    "description": "普洱茶王，班章村古树茶，茶气刚烈霸道，苦底重但回甘极强，十五泡犹有余韵。 【冲泡物理】：黑茶（普洱熟茶等）属于后发酵茶。通过人工渥堆发酵，在黑曲霉、酵母菌等微生物菌群的物理代谢作用下，茶多酚深度降解。冲泡必须使用 100℃ 纯沸水，且必须进行物理'洗茶'两次以唤醒陈化茶体。宜选用厚壁紫砂壶，利用紫砂的双气孔物理结构吸附杂气，令茶汤顺滑醇厚。 【茶道美学】：黑茶之美在于'陈'。数十年的物理存放，去尽火气，留下樟香与沉香。它代表着岁月沉淀后的宽厚与静穆，是历经风霜者最好的心境调和，最宜在冬日围炉或晚饭后半小时饮用以消食安神。",
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
      "history": "世界文化与自然双遗产，朱熹曾在此创建武夷精舍讲学四十年，理学在此发源。三教名山，丹霞地貌亿万年风蚀成奇峰幽谷，九曲溪蜿蜒其间。",
      "culture": "岩茶发源地，三坑两涧是岩茶核心产区。茶人世代以做茶为生，家家有茶焙，户户闻岩韵。山中道观佛寺并存，茶禅一味在这里不是口号。\n\n【人文地缘】：西湖三面环山一面临城，是天然的物理山水盆景。苏东坡“水光潋滟晴方好，山色空蒙雨亦奇”道尽了西湖在晴雨变化中的动态美学。清晨 5 点的苏堤人迹罕至，雾气氤氲，是最佳的灵气吸纳动线。\n【心境转折】：从喧嚣的城市街区，行至孤山梅妻鹤子之所，物理层面的分贝骤降，伴随呼吸山林木气，心境由散乱转为专一，最后在西泠印社的石刻碑文前感受金石气象与岁月折中。"
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
            "desc": "宋代官方茶焙所在地，武夷茶文化的起点"
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
            "desc": "肉桂圣地，两侧丹崖壁立，茶树长在石缝间"
          },
          {
            "name": "慧苑坑",
            "desc": "水仙老丛聚集地，阴润环境养出醇厚水仙韵"
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
        "context": "山居三日早睡早起，调整生物钟"
      }
    ],
    "essay": "到武夷山是为了一口岩韵。三坑两涧走下来，才明白什么叫岩骨花香——茶树长在石缝里，根扎进丹霞风化层，吸足了矿物质。牛栏坑的风穿过崖壁，带着肉桂的辛香。傍晚回茶馆，老板开了一泡去年的水仙，说慢慢喝，山里的时间不值钱。第三天清晨上天游峰，九曲溪在脚下绕成一条玉带。下山的路上想，朱熹在这里讲学四十年，大概也是被这山水和茶留住的。带走几泡岩茶，也带走了武夷的一段山气。",
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
      "history": "两千五百年姑苏城，吴文化发源地。白居易、苏东坡都曾在此为官留诗。园林甲天下，评弹丝竹声里藏着江南的精致与慵懒。",
      "culture": "洞庭碧螺春产于太湖洞庭山，茶果间作造就天然花果香。评弹是苏州人的日常BGM，书场里一壶茶一下午，吴侬软语慢慢说。\n\n【人文地缘】：大理西枕苍山，东临洱海。由于高原地貌温差，冷空气沿苍山十八溪下行汇入洱海盆地，物理形成了名扬天下的“下关风、上关花、苍山雪、洱海月”。这里曾是佛教盛行的大理国，自带一种无为超然的气场。\n【心境转折】：从喜洲扎染坊的靛蓝植物色素物理印记，漫步到沙溪古镇黑惠江畔的古石桥。看着马帮踏过的青石板，聆听潺潺流水声，让脑电波自然放慢至 alpha 波，完成从功利追求到顺应天命的心灵净化。"
    },
    "route": [
      {
        "day": 1,
        "title": "拙政园 · 评弹书场",
        "spots": [
          {
            "name": "拙政园",
            "desc": "清晨入园，人少时最能体会园林的留白意境"
          },
          {
            "name": "苏州博物馆",
            "desc": "贝聿铭设计的现代园林，光影与水景绝佳"
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
        "context": "洞庭碧螺春原产地，茶果间作的花果香从这里来"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "听曲减压，评弹书场是最好的慢生活练习"
      }
    ],
    "essay": "苏州的风雅是骨子里的。清晨拙政园的回廊还沾着露水，太湖石瘦皱漏透，一步一景。午后在平江路书场坐下，台上评弹先生一嗓开篇，台下茶客一壶碧螺春嗑着瓜子，时间在这里不是用来赶的。第二天上洞庭东山看碧螺春茶园，茶树和枇杷杨梅种在一起，茶叶天然带着花果香。老茶农说明前碧螺春一斤要采七万芽头，手工炒制到凌晨。傍晚太湖大桥上落日如金，忽然懂了为什么那么多人愿意在苏州慢下来——这里的日子是过得细的。",
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
      "history": "古徽州一府六县，徽商故里，明清两代称雄商界三百年。程朱理学发源地，徽派建筑的马头墙和白墙黛瓦是江南水墨的底色。",
      "culture": "黄山毛峰、太平猴魁、祁门红茶皆出于此。徽州香事源远流长，老香铺里至今还有传统合香手艺。古村祠堂戏台犹在，夜深时仿佛能听见徽调。\n\n【人文地缘】：黄山以花岗岩断裂地貌著称。奇松怪石皆是花岗岩受风化物理侵蚀的奇迹。徐霞客叹曰：“薄海内外之名山，无如徽之黄山。”奇松扎根在悬崖裂缝，体现出惊人的生命张力。\n【心境转折】：攀登百步云梯的肉体极限痛苦，在登顶光明顶俯瞰万顷云海涌动的一瞬间，转化为极致的释怀。云雾在松针间凝结成水滴，暗示了万物在无常运动中的守一心境。"
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
            "desc": "胡文光刺史坊，徽派石雕的巅峰"
          },
          {
            "name": "承志堂",
            "desc": "民间故宫，木雕精美绝伦"
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
            "desc": "半山腰喝一杯黄山毛峰，山泉冲泡"
          },
          {
            "name": "老香铺",
            "desc": "下山后在屯溪老街访一家老香铺，看老师傅打香篆"
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
        "context": "黄山毛峰，半山茶亭的山泉泡法最鲜"
      },
      {
        "domain": "tea",
        "refId": "tea_006",
        "context": "太平猴魁，黄山北麓猴坑所产"
      },
      {
        "domain": "tea",
        "refId": "tea_041",
        "context": "祁门红茶，世界三大高香红茶之一"
      },
      {
        "domain": "wellness",
        "refId": "wellness_010",
        "context": "焚香助眠，徽州老香铺的合香手艺"
      }
    ],
    "essay": "徽州是水墨画的实景。宏村南湖的晨雾里，白墙黛瓦倒映水中，美得不真实。上黄山那天云海翻涌，半山寺茶亭里一杯毛峰，山泉水冲的，鲜得舌底生津。下山去屯溪老街，一家三代传下来的香铺，老师傅手把手教打香篆，沉香的烟在徽派老宅里绕梁。第三天到祁门看红茶，槠叶种茶树矮矮的满山翠绿，老茶厂里发酵的甜香扑鼻。傍晚古村戏台前喝祁红，远处隐约有人哼徽调。徽州三天，茶香木香交替，像是把江南旧梦重做了一遍。",
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
      "history": "南宋古都，西湖十景千年传唱。白堤苏堤见证文人治水，龙井寺旁的十八棵御茶树是乾隆南巡的遗韵。灵隐寺香火不绝，禅茶文化深植此城。",
      "culture": "西湖龙井茶香满城，龙井村、梅家坞、龙坞是三大产区。古琴雅集常在湖畔茶空间举办，一琴一茶，便是杭州的风雅日常。\n\n【人文地缘】：西递宏村是徽派建筑的物理巅峰。粉墙黛瓦，高耸的马头墙在物理上起到了绝佳的隔断邻家火灾蔓延的防灾折中效果。引水入村的牛形水系设计，展现了古人天人合一的物理流体力学智慧。\n【心境转折】：清晨 6 点在宏村南湖旁听雾霭散去，木质雕花窗棂在晨光中投影在青砖地上。木头与泥土的香气，能让人瞬间切断与现代数字世界的链接，回归最纯粹的宗族温情与农耕安宁。"
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
            "desc": "乾隆御封的十八棵老茶树，龙井的文化图腾"
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
        "context": "西湖龙井，龙井村十八棵御茶就在这里"
      },
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "径山茶，余杭径山寺的禅茶一味"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "古琴雅集，听琴减压的最好方式"
      },
      {
        "domain": "wellness",
        "refId": "wellness_007",
        "context": "禅茶冥想，灵隐寺的静心体验"
      }
    ],
    "essay": "杭州的风雅是日常化的。清晨龙井村的路还空着，茶农已经在炒茶，铁锅里杀青的茶香飘满巷子。在梅家坞茶农家坐下，一壶明前龙井对着茶山，喝到第三泡回甘上来，什么都不想做了。第二天灵隐寺飞来峰下喝禅茶，住持说吃茶就是修行。傍晚西湖琴社的雅集，古琴《流水》配着龙井，窗外湖风穿堂。杭州的好处是风雅不用装，它就在市民的日常里——一杯龙井、一段琴、一湖山，够了。",
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
      "history": "三千年蜀地中心，都江堰润泽天府。茶馆文化冠绝全国，人民公园的鹤鸣茶社百年不衰。川剧变脸、蜀锦蜀绣，是这座懒散城市的精致底色。",
      "culture": "蒙顶山茶和川红是四川茶的双子星。盖碗茶是成都人的生活方式——竹椅一躺，盖碗一端，一下午就过去了。川剧变脸吐火，老茶馆里就有演出。\n\n【人文地缘】：武夷山是典型的丹霞地貌，红色砂砾岩富含铁、钾、钙等物理矿物微量元素，是武夷岩茶“岩骨花香”的物理温床。朱熹在此创办考亭书院，将理学思想融入山水。\n【心境转折】：竹筏漂流九曲溪，抬头仰望三十六峰的刀劈斧凿。在狭窄的一线天内穿行，在幽暗的巨石缝隙里闻着石壁苔藓的冷香。这一动线教导我们：在物理黑暗的狭缝中保持前行，终会迎来豁然开朗的广阔天地。"
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
            "desc": "茶祖吴理真种茶处，世界茶文化发源地"
          },
          {
            "name": "天盖寺",
            "desc": "蒙顶五峰中心，喝一杯蒙顶甘露"
          },
          {
            "name": "皇茶园",
            "desc": "唐代贡茶院遗址，千年古茶树犹在"
          }
        ]
      },
      {
        "day": 3,
        "title": "宜宾 · 川红工夫",
        "spots": [
          {
            "name": "宜宾茶山",
            "desc": "川红主产区，早春茶上市最早"
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
        "context": "蒙顶甘露，茶祖故里的千年名茶"
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
        "context": "慢生活养生，成都教你真正躺平"
      }
    ],
    "essay": "成都是被茶泡出来的城市。人民公园鹤鸣茶社的竹椅一躺，盖碗茶一端，旁边采耳师傅叮当响，一下午就这么过去了。没人催你，没人赶你，成都的时间是按壶算的。第二天上蒙顶山，茶祖吴理真两千年前在这里种下七棵茶树，天盖寺里喝一杯蒙顶甘露，甜香里好像能尝到千年。第三天去宜宾看川红产区，宜宾的春天来得早，二月茶树就冒芽了。回成都锦里吃碗担担面，夜市灯火里想，成都的风雅就是——不急，万事都慢慢来，日子反而过得长了。",
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
      "history": "宋元东方第一大港，海上丝绸之路起点。马可波罗笔下的刺桐城，万国商船云集。闽南文化保留最完整的古城，南音雅乐千年传唱。",
      "culture": "安溪铁观音故里，闽南乌龙茶核心产区。海丝贸易带来满城香料，老街巷里藏着阿拉伯香铺后裔。南音是中国最古老的乐种之一，被称为音乐活化石。\n\n【人文地缘】：川西林盘气候潮湿多雨，造就了成都茶馆独特的巴蜀竹椅文化。盖碗茶的“茶盖为天、茶托为地、茶碗为人”构成了一个微观的宇宙三才美学，是中庸之道的实体化呈现。\n【心境转折】：在人民公园鹤鸣茶社的一把青竹椅上躺下，耳畔是铜壶高冲的物理沸水声、采耳竹签的细微震动以及竹林的沙沙声。在极度嘈杂的市井声浪里，内心却能物理沉淀为绝对的宁静，这是大隐隐于市的市井禅机。"
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
            "desc": "一条街三座庙（清净寺、关帝庙、文庙），宗教融合的缩影"
          },
          {
            "name": "老香铺",
            "desc": "午后访海丝老香铺，寻阿拉伯香药传入的痕迹"
          },
          {
            "name": "南音艺苑",
            "desc": "晚上听一场南音，千年雅乐在耳边流转"
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
            "desc": "铁观音发源地，寻访魏说和王说两株母树"
          },
          {
            "name": "茶农家",
            "desc": "在茶农家喝秋茶铁观音，兰花香七泡有余香"
          }
        ]
      }
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_034",
        "context": "安溪铁观音，西坪镇是发源地"
      },
      {
        "domain": "tea",
        "refId": "tea_040",
        "context": "黄金桂，安溪四大名茶之一"
      },
      {
        "domain": "wellness",
        "refId": "wellness_010",
        "context": "海丝香事，泉州老香铺的合香传承"
      }
    ],
    "essay": "泉州是一座被香料熏过的城市。涂门街一条街三座庙，清净寺的阿拉伯风格拱门还带着千年前海丝贸易的余温。老香铺里老师傅还在手工合香，沉香、乳香、没药——这些名字在宋元时期就从这里登陆中国。晚上南音艺苑，琵琶洞箫一起，千年雅乐在耳畔流过，像海风穿过古城。第二天去安溪西坪镇找铁观音母树，魏说王说两株老茶树还在山坡上。茶农家开了一泡秋茶铁观音，兰花香从盖碗冲出来，七泡后还有余香。泉州的风雅是混血的，茶与香与乐，都带着海风的咸味。",
    "coverImage": "/assets/images/travel/dali.jpg",
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
    "title": "春季养肝：每天一杯花茶，早睡一小时",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "spring",
    "organ": "liver",
    "difficulty": 1,
    "duration": "10分钟/天",
    "body": "春属木，肝当令。冬天藏了一整季的气血在春天开始往外走，肝气最易郁结或上亢。你可能会觉得莫名烦躁、两肋发胀、眼睛干涩——这都是肝在提醒你该管管它了。最简单的养法不是吃药，而是两件小事：一是每天泡一杯花茶，白牡丹的清甜或碧螺春的花香都能疏肝理气；二是比冬天早睡一小时，晚上十一点前入睡，让肝经在子时好好排毒。不用刻意，春天本来就困，顺应身体的困意早睡，比什么补品都管用。\n\n【时令草本】：春季阳气升发，肝木旺盛易克脾土。建议配比：柴胡 6g（疏肝解郁）、郁金 9g（活血行气）、薄荷 3g（后下，宣散风热），以开水冲泡代茶饮。这能从物理上调理肝胆经络，解开春季高发的郁热。\n【心境调谐】：配合清晨公园八段锦“双手托天理三焦”与“左右开弓似射雕”，物理拉伸肋骨两侧的胆经。多看绿植，忌怒忌焦，保持胸腹物理呼吸通畅，让心境随万物一同复苏发芽。",
    "tips": [
      "春季晨起可喝一杯温蜂蜜水，润肠助肝排毒",
      "多吃绿色蔬菜，少酸多甘以养脾气",
      "午后困倦可小憩15分钟，不要硬扛",
      "周末去公园走走，绿色入肝，疏解郁气"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹花香疏肝，春季首选"
      },
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春花果香理气解郁"
      }
    ],
    "coverImage": "/assets/images/wellness/spring.jpg"
  },
  {
    "id": "wellness_002",
    "title": "夏季养心：苦味入心，午间小憩",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "summer",
    "organ": "heart",
    "difficulty": 1,
    "duration": "20分钟/天",
    "body": "夏属火，心当令。天热时人容易心烦气躁、失眠多梦、舌尖发红——这些都是心火旺的信号。养心记住两点：苦味入心，午间小憩。苦味食物能清心火，苦瓜、莲子心泡水都好，一杯白毫银针的清甜里也带着微苦，正合时宜。更重要的是午间小憩，中午11点到1点是心经当令，哪怕闭目养神15分钟，下午的精神状态完全不一样。夏天不要贪凉猛吹空调，毛孔张开时寒气入侵最伤心阳。心静自然凉，不是空话。\n\n【时令草本】：夏季炎热，心火炽盛易耗气伤津。建议配比：麦冬 10g（养阴生津）、五味子 5g（敛肺收汗）、太子参 6g（补气），即经典“生脉饮”的物理化改良版。泡水代茶，能有效预防高温出汗脱水导致的心慌与体能衰退。\n【心境调谐】：夏日宜“静坐养心”。正午时分闭目养神 15 分钟，降低心率与身体代谢率，物理降温。配乐宜选择静态古琴名曲，以空灵曲调平息焦躁，达到“心静自然凉”的禅意境界。",
    "tips": [
      "午间11:00-13:00闭目养神15-20分钟",
      "莲子心3-5根泡水喝，清心火",
      "少喝冰饮，温茶反而更解暑",
      "出汗后先擦干再进空调房，避免寒气"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针清甜微苦，夏季清心首选"
      },
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "西湖龙井清心提神，夏日午后佳选"
      }
    ],
    "coverImage": "/assets/images/wellness/summer.jpg"
  },
  {
    "id": "wellness_003",
    "title": "午后小憩：15分钟的充电仪式",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "午后犯困不是你懒，是身体的自然节律。下午1点到3点，人体核心体温微降，褪黑素分泌小高峰，这是刻在基因里的午睡需求。但你不需要睡很久——15到20分钟足够了，超过30分钟反而进入深睡眠，醒来更晕。最好的方式是：吃完午饭散步5分钟，然后找个安静地方坐下或半躺，闭眼放空。不用真的睡着，让大脑断个电就行。配一杯午后的铁观音或单丛，茶香里闭目养神，这15分钟是给下午的自己充电。成都人在茶馆里躺了一下午，人家不是懒，是懂生活。\n\n【时令草本】：秋季天高气爽，燥邪伤肺，极易引发干咳与皮肤干燥。建议配比：百合 15g、沙参 10g、玉竹 10g，加冰糖适量慢火炖煮 20 分钟。其富含的天然植物多糖能物理附着于咽喉和气管粘膜，形成保护层，滋阴润燥。\n【心境调谐】：秋季万物收敛，心境易生悲秋之感。宜进行温和的登山远眺，舒展胸廓，物理增加肺活量。静坐时关注呼吸，吸入清凉，吐出胸中浊气，让神志安宁，收敛神气。",
    "tips": [
      "定个20分钟闹钟，不要超过30分钟",
      "闭眼即可，不必强求入睡",
      "午憩前喝半杯温水，醒来更清爽",
      "办公室可备折叠颈枕，姿势比时长重要"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_034",
        "context": "铁观音午后提神，不刺激肠胃"
      }
    ],
    "coverImage": "/assets/images/wellness/nap.jpg"
  },
  {
    "id": "wellness_004",
    "title": "秋季养肺：润燥为先，早睡早起",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "autumn",
    "organ": "lung",
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "秋属金，肺当令。秋燥最伤肺，口干唇裂、皮肤起皮、干咳少痰——都是肺在喊渴。养肺的核心就一个字：润。少喝浓茶咖啡，多喝温润的老白茶或陈年寿眉，煮着喝更好，枣香蜜韵最润燥。饮食上多吃梨、银耳、百合、蜂蜜，少吃辛辣。秋天要早睡早起，跟鸡的作息同步——早卧以聚阳气，早起以舒肺气。晨起可做深呼吸，到公园里吸几口清气。秋天最容易悲秋伤感，保持好心情也是养肺，肺主悲，悲伤肺。一杯温茶，一本好书，秋日正好。\n\n【时令草本】：冬季万物闭藏，寒邪入骨伤肾阳。建议配比：枸杞 8g、肉桂 2g（温阳化气）、熟地 10g（滋阴补肾），开水闷泡 15 分钟。肉桂中富含的桂皮醛能物理扩张末梢血管，改善冬季手脚冰凉的血液循环痛点。\n【心境调谐】：冬季养生重在“藏”。起居宜“早卧晚起，必待日光”，顺应太阳的物理辐射规律。夜晚睡前用 42℃ 温水足浴 20 分钟（物理刺激涌泉穴），闭目静心思索一年的得失，让身心进入最深沉的蓄能睡眠状态。",
    "tips": [
      "老白茶煮饮，加几颗红枣更润",
      "晨起深呼吸10次，吐故纳新",
      "多吃白色食物：梨、银耳、百合、莲藕",
      "秋燥少用辛辣，蜂蜜温水润肠"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_017",
        "context": "老白茶枣香药韵，秋季润燥第一选择"
      },
      {
        "domain": "tea",
        "refId": "tea_013",
        "context": "陈年寿眉煮饮，温润不寒凉"
      }
    ],
    "coverImage": "/assets/images/wellness/autumn.jpg"
  },
  {
    "id": "wellness_005",
    "title": "山居早睡：三天调整你的生物钟",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "3天",
    "body": "城市人的生物钟大多是乱的——熬夜刷手机，早上靠咖啡续命。调整最快的方式不是买褪黑素，而是去山里住三天。山里天黑得早，没有霓虹灯和手机诱惑，晚上九点就困了。顺应这个困意，不要硬撑。早上被鸟叫和阳光叫醒，不是闹钟。三天的山居作息足以重置你的昼夜节律，回到城市后你会发现，十一点困、六点醒是身体本来的样子。如果暂时没条件去山里，今晚就开始：十点半把手机放客厅，泡一杯老白茶，看半小时纸质书。困了就睡，别等十二点。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "睡前1小时远离手机蓝光，看纸质书",
      "卧室只留一盏暖色小灯，营造暗环境",
      "睡前泡一杯老白茶，温润安神不刺激",
      "连续3天同一时间入睡，生物钟自然调"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_017",
        "context": "老白茶晚间安神，不似绿茶提神"
      },
      {
        "domain": "travel",
        "refId": "travel_001",
        "context": "武夷山三日慢行，山居作息的绝佳体验"
      }
    ],
    "coverImage": "/assets/images/wellness/mountain-rest.jpg"
  },
  {
    "id": "wellness_006",
    "title": "听曲减压：用声音给自己做个SPA",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "20分钟/次",
    "body": "声音是最容易被忽视的减压工具。当你焦虑、心慌、脑子转不停时，不用急着冥想——先听一段音乐。古琴曲最合适，散音如大地般沉稳，泛音如山泉般清亮，不用懂乐理，身体会自动跟着频率放松。研究说慢节奏音乐能降心率、降血压、降皮质醇。每天给自己20分钟「听觉SPA」：泡一杯龙井，戴上耳机，放一首古琴《平沙落雁》或评弹《白蛇传》选段，什么都不想。这不是摸鱼，是给神经系统做维护。你的身体比你更累，只是它不会说。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "选60-80拍/分的慢节奏音乐，接近静息心率",
      "戴耳机闭眼效果更佳，隔绝外界干扰",
      "古琴曲推荐：平沙落雁、流水、阳关三叠",
      "睡前听15分钟，助眠效果堪比白噪音"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井清心，配古琴最相宜"
      },
      {
        "domain": "travel",
        "refId": "travel_002",
        "context": "苏州评弹书场，听曲减压的实地体验"
      }
    ],
    "coverImage": "/assets/images/wellness/music-relax.jpg"
  },
  {
    "id": "wellness_007",
    "title": "禅茶冥想：一杯茶里的十分钟正念",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "10分钟/次",
    "body": "冥想不用盘腿，不用闭眼，不用念咒——一杯茶就够了。禅茶冥想的本质是「正念饮茶」：把全部注意力放在这一杯茶上。闻干茶的香，听水沸腾的声音，看茶叶在水中舒展，感受杯壁的温度，品味每一泡汤水的层次变化。当你的心跟着茶走，那些乱七八糟的念头自然就停了。十分钟，一泡茶，就是一次完整的禅修。径山寺的僧人千年前就在做这件事——茶禅一味，不是玄学，是把心安在当下。今天试一次：手机静音，泡一杯径山茶，只喝茶，什么都不想。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "选一款有层次感的茶，径山茶或龙井最佳",
      "泡茶时关掉手机，专注五感体验",
      "不评判茶的好坏，只观察感受",
      "念头跑了就拉回来，回到茶的香气和温度"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "径山茶，茶禅一味的千年传承"
      },
      {
        "domain": "travel",
        "refId": "travel_004",
        "context": "杭州灵隐寺，禅茶冥想的绝佳场所"
      }
    ],
    "coverImage": "/assets/images/wellness/zen-tea.jpg"
  },
  {
    "id": "wellness_008",
    "title": "慢生活养生：把节奏放慢一半",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "每天",
    "body": "现代人的很多毛病不是累出来的，是急出来的。吃饭急、走路急、说话急，连刷手机都急——交感神经长期亢奋，副交感神经被压制，内分泌全乱。慢生活不是摆烂，是主动把节奏调回来。具体怎么做？三件小事：吃饭每口嚼20下，走路步频放慢一半，说话前停顿三秒。泡一杯熟普，看着红浓的汤色发五分钟呆。成都人、苏州人天生就懂这个，所以他们活得不累。你的身体不是设计来跑百米的，是设计来散步的。把节奏慢下来，身体会自己修复。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "吃饭每口咀嚼20次，帮助消化减少肠胃负担",
      "走路放慢一半，感受脚步和呼吸",
      "每天留15分钟「无目的时间」，不规划不做事",
      "泡一杯熟普，温润养胃不伤身"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_052",
        "context": "普洱熟茶温和养胃，慢生活标配"
      },
      {
        "domain": "travel",
        "refId": "travel_005",
        "context": "成都三日，学习真正的慢生活"
      }
    ],
    "coverImage": "/assets/images/wellness/slow-life.jpg"
  },
  {
    "id": "wellness_009",
    "title": "冬季养肾：温补藏精，早睡晚起",
    "primaryDomain": "wellness",
    "category": "seasonal",
    "season": "winter",
    "organ": "kidney",
    "difficulty": 2,
    "duration": "每天",
    "body": "冬属水，肾当令。冬天是「藏」的季节——万物蛰伏，人也该收敛。肾为先天之本，冬养肾是一年养生的根基。两件事最重要：早睡晚起和温补。冬天要比秋天更早睡，最好十点前，太阳出来再起——「早卧晚起，必待日光」。饮食上温补为主，羊肉、核桃、板栗都是好东西，但不要大补上火。每天煮一壶熟普或老白茶，暖暖的喝一天，温润不燥。冬天少出汗少运动过量，汗出多了耗阳气。脚要保暖，肾经起于足底，泡脚是最简单的养肾法。冬天藏好了，来年春天才有生发之力。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "晚9点前入睡，等太阳升起再起床",
      "每晚泡脚15分钟，水温40度左右",
      "熟普或老白茶煮饮，全天保温杯常备",
      "少剧烈运动，散步太极为宜，微汗即止"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_052",
        "context": "普洱熟茶温润养胃，冬日常备"
      },
      {
        "domain": "tea",
        "refId": "tea_053",
        "context": "安化黑茶温补消食，冬补不上火"
      }
    ],
    "coverImage": "/assets/images/wellness/winter.jpg"
  },
  {
    "id": "wellness_010",
    "title": "焚香助眠：一炉香的睡前仪式",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 2,
    "duration": "30分钟/次",
    "body": "失眠的人大多有个共同点：身体累了但脑子不累。躺下了脑子还在转——明天的工作、刚才的对话、没回的消息。焚香是给脑子一个「关机信号」。点一炉沉香或檀香，看着青烟慢慢升腾，注意力被烟带走，脑子就停了。沉香性温，安神定志；檀香清凉，疏肝理气。选一款喜欢的，睡前半小时点上，配一杯寿眉老白茶，翻几页书。当香燃尽，自然就想睡了。徽州老香铺的合香手艺传了百年，泉州海丝带来的阿拉伯香药融进了中式合香——香的安神作用不是玄学，是嗅觉直抵边缘系统的生理反应。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "睡前30分钟点香，用电子香炉或传统香篆",
      "沉香安神，檀香理气，根据体质选择",
      "香炉放床头柜附近，不要太近以免呛",
      "配合纸质书阅读，远离手机蓝光"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_013",
        "context": "寿眉老白茶温润安神，睡前一杯"
      },
      {
        "domain": "travel",
        "refId": "travel_003",
        "context": "徽州老香铺，百年合香手艺寻访"
      }
    ],
    "coverImage": "/assets/images/wellness/incense-sleep.jpg"
  },
  {
    "id": "wellness_011",
    "title": "晨起一杯温水：最便宜也最管用的养生法",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "2分钟/天",
    "body": "如果只能选一个养生习惯坚持，选这个：晨起一杯温水。睡了一夜，身体流失了约400毫升水分，血液黏稠度最高。早起空腹一杯35-40度的温水，5分钟内喝完，能迅速稀释血液、唤醒肠胃、促进排便。不要喝冰水——早晨阳气初生，一杯冰水浇下去，肠胃血管骤缩，伤脾阳。不要喝蜂蜜水或淡盐水——糖和盐空腹吸收快，增加负担。就是一杯温白开，最简单，也最有效。喝完再洗漱，等15分钟后吃早饭。这个习惯零成本，坚持一周就能感到不同。然后可以泡茶。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "水温35-40度，不烫嘴不冰手",
      "空腹喝，200-300毫升，小口慢饮",
      "喝完等15分钟再吃早饭",
      "保温杯放床头，醒来伸手就能喝"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/morning-water.jpg"
  },
  {
    "id": "wellness_012",
    "title": "睡前泡脚：15分钟的足底按摩",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 1,
    "duration": "15分钟/天",
    "body": "脚被称为「第二心脏」，脚底有六十多个穴位和反射区，连接全身器官。睡前泡脚是最简单有效的养生法——不需要懂穴位，热水一泡，全身经络都通了。水温38-42度，没过脚踝，泡15分钟到微微出汗。泡脚能引火归元，把上浮的虚火拉下来，失眠的人特别管用。冬天加几片生姜驱寒，加一把艾草温经。泡完趁脚温热上床，那一觉睡得特别沉。唯一注意：饭后一小时内不要泡，糖尿病患者水温不超过40度。这个习惯坚持一个月，手脚冰凉的人会明显改善。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "水温38-42度，以手背试温不烫为宜",
      "水量没过脚踝，泡15-20分钟",
      "加生姜片驱寒，加艾草温经，加盐杀菌",
      "泡完擦干立刻穿袜上床，不要受凉"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/foot-bath.jpg"
  },
  {
    "id": "wellness_013",
    "title": "久视护眼：每50分钟让眼睛歇一下",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": "eye",
    "difficulty": 1,
    "duration": "5分钟/次",
    "body": "中医说「久视伤血」，眼睛用过度了伤的是肝血。现代人一天看屏幕十几个小时，干眼、飞蚊、视力模糊越来越年轻化。护眼不需要眼药水，记住「20-20-20」法则：每看屏幕20分钟，看20英尺（6米）外的远处20秒。如果做不到，至少每50分钟站起来走5分钟，到窗边看远处。办公室可以泡一杯安吉白茶——它的氨基酸含量是普通绿茶的两三倍，清肝明目效果最好。午休时用掌心捂眼3分钟，掌心的温热能放松睫状肌。眼睛是肝的窗户，养好眼就是在养肝。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "每50分钟远眺5分钟，看窗外最远处",
      "安吉白茶氨基酸高，清肝明目",
      "掌心搓热捂眼3分钟，放松睫状肌",
      "屏幕亮度调低，开启蓝光过滤模式"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_007",
        "context": "安吉白茶氨基酸高，清肝明目首选"
      }
    ],
    "coverImage": "/assets/images/wellness/eye-care.jpg"
  },
  {
    "id": "wellness_014",
    "title": "每周一次数字断舍离：把周末还给生活",
    "primaryDomain": "wellness",
    "category": "habit",
    "season": null,
    "organ": null,
    "difficulty": 3,
    "duration": "半天/周",
    "body": "信息焦虑的本质是怕错过——错过热搜、错过消息、错过朋友圈的瓜。但你回头想想，上周刷的那些信息有哪条真正影响了你的生活？数字断舍离不是出家，是每周给自己半天「信息清净」。选周六或周日上午，手机调成飞行模式，不刷短视频、不看新闻、不回非紧急消息。用这半天做点「慢」的事：泡一壶茶、看纸质书、去公园走走、做顿饭。你会焦虑前半小时——这叫戒断反应。半小时后世界安静了，你会想起被手机偷走的注意力有多值钱。试试四周，你会上瘾的不是手机，是安静。\n\n【草本物理配比】：日常养生建议温服红枣枸杞茶（红枣3枚破开、丝绸路枸杞5g），以 90℃ 水温冲泡，红枣皮所含环磷酸腺苷有助于增强免疫。心境应顺应四时变化，动静折中，避免剧烈大汗耗散阳气，保持神志内守。",
    "tips": [
      "从半天开始，循序渐进，不必一上来就全天",
      "提前告知亲友，设紧急联系人电话",
      "准备替代活动：茶、书、笔、散步路线",
      "记录断舍离后的感受，正向反馈帮助坚持"
    ],
    "linkedDomains": [],
    "coverImage": "/assets/images/wellness/digital-detox.jpg"
  }
];

const incenseData = [
  {
    "id": "incense_001",
    "title": "沉香：千年雅事，静心第一香",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "海南",
    "difficulty": 2,
    "duration": "30-60分钟",
    "price": "高端",
    "body": "沉香被古人称为'众香之首'，不是因为它最香，而是因为它最静。一块好的沉香点燃后，香气不是扑面而来的，而是像水墨在宣纸上晕开一样，缓缓地、一层一层地渗进你的呼吸里。海南沉香比越南沉香更清雅，少了那份甜腻，多了一丝凉意，像深山古寺里清晨的第一缕檀烟。新手建议从线香开始，不需要买太贵的，点一支放在书房，关掉手机，十五分钟后你会发现脑子里那些乱七八糟的念头，不知不觉就散了。\n\n【物理油脂】：沉香非木，而是瑞香科植物在受外伤或真菌感染后，激发起自我防卫机制物理分泌出的油脂树脂（富含倍半萜类化合物），历经数年乃至数百年在泥土中物理降解凝聚的晶体。高品质沉香在不同温度下（如 60℃-180℃ 电子熏香炉）会释放出不同梯度的香气：前调为清凉药香，中调为甜美花香，尾调为深沉樟脑香。\n【香道美学】：沉香之美在于“沉静”与“悠远”。其散发的微量香气分子能物理通过嗅觉感受器，调节大脑边缘系统，降低心率。最宜在深夜独处、禅修静坐或研读硬核源码时点燃，能营造出绝对空灵、去功利化的技术与哲学思辨空间。",
    "tips": [
      "线香比盘香更适合新手，燃烧时间短，香气纯净",
      "沉香配绿茶是绝配，茶香能引出沉香的凉意",
      "点香时开窗通风，香气更灵动",
      "香灰不要天天倒，留一层有助于香品燃烧"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配沉香，清雅双绝"
      },
      {
        "domain": "music",
        "refId": "music_001",
        "context": "古琴配沉香，古人四雅之二"
      }
    ],
    "coverImage": "/assets/images/incense/chenxiang.jpg"
  },
  {
    "id": "incense_002",
    "title": "檀香：温暖的木质香，最适合冬天",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "印度",
    "difficulty": 1,
    "duration": "20-40分钟",
    "price": "中端",
    "body": "檀香和沉香最大的区别是温度。沉香是凉的，檀香是暖的。冬天的晚上，外面下着小雨，你在屋里点一支老山檀，那股温润的奶香会把整个房间包裹起来，像裹了一条看不见的毛毯。印度老山檀是公认最好的，但价格也最贵；澳洲檀香性价比更高，香气偏甜，适合入门。檀香还有一个好处——它不像沉香那么'挑人'，几乎所有人都能接受，所以也最适合待客用。\n\n【物理油脂】：檀香取自檀香科木材的芯材。富含“檀香脑”成分。这是一种强效的副交感神经肌肉物理镇静剂。与沉香的内敛冷香不同，老山檀香气霸气、温暖、香甜而持久，常温下即可物理挥发出极其浓郁的乳香与木质香。\n【香道美学】：檀香代表着“庄严”与“富贵”。其温暖的气场能物理驱散空间内的湿冷与负面情绪，给人以坚实的依靠感。适合在清晨唤醒精力、商业谈判前安定心神、或者会客茶叙时作为空间背景香，能快速建立起信任、平等的场域。",
    "tips": [
      "老山檀颜色越深越好，黄褐色为上品",
      "檀香适合搭配红茶，暖上加暖",
      "卧室用檀香助眠效果很好，但要选天然的",
      "线香点燃后放在上风口，香气扩散更均匀"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种配檀香，冬日暖意"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "檀香助眠，配合睡前仪式"
      }
    ],
    "coverImage": "/assets/images/incense/tanxiang.jpg"
  },
  {
    "id": "incense_003",
    "title": "龙涎香：海里的黄金，香中的传奇",
    "primaryDomain": "incense",
    "category": "animal",
    "origin": "海洋",
    "difficulty": 3,
    "duration": "特殊场合",
    "price": "顶级",
    "body": "龙涎香是抹香鲸的分泌物，在海里漂浮几十年甚至上百年，被海水反复淘洗后，从一块黑乎乎的蜡状物变成灰白色的'海之精华'。它的味道很难描述——有人说像大海，有人说像烟草，有人说像晒干的旧书。但所有闻过真龙涎香的人都同意一点：它有一种无法替代的'时间感'。现在真正的龙涎香极其稀少，市面上大多是人工合成的。如果你有幸闻到真品，闭上眼睛，你会闻到大海和岁月的味道。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "龙涎香通常作为定香剂使用，单独点燃较少",
      "市面上'龙涎香'99%是合成香料，别被骗",
      "龙涎香配白茶，有种说不出的高级感",
      "适合在冥想或特殊仪式中使用"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针配龙涎香，极致清雅"
      }
    ],
    "coverImage": "/assets/images/incense/longxianxiang.jpg"
  },
  {
    "id": "incense_004",
    "title": "艾草香：端午的味道，祛湿的好手",
    "primaryDomain": "incense",
    "category": "herbal",
    "origin": "中国",
    "difficulty": 1,
    "duration": "15-30分钟",
    "price": "平价",
    "body": "艾草香是最接地气的香。端午节门口挂艾草，是中国几千年的传统。艾草燃烧时有一种特殊的苦香，不好闻，但很'正'。中医说艾草能祛湿、驱寒、通经络，所以艾草香特别适合南方潮湿的梅雨季，或者体内湿气重的人。夏天点一支艾草香，比蚊香健康多了，蚊子也怕这个味道。缺点是烟比较大，建议在通风好的地方用。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "梅雨季节点艾草香，祛湿效果明显",
      "艾草香烟大，不建议在小密闭空间使用",
      "可以和陈皮香交替使用，祛湿效果加倍",
      "艾草泡脚后再点艾草香，效果更好"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "夏季祛湿，艾草香是好帮手"
      }
    ],
    "coverImage": "/assets/images/incense/aicao.jpg"
  },
  {
    "id": "incense_005",
    "title": "桂花香：秋天的信使，甜蜜的回忆",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "中国",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "每年九月，杭州满城桂花香。那种甜而不腻的味道，闻一口就知道秋天来了。桂花香的特点是'甜'，但不是糖的甜，是花蜜的甜，带着一丝果香。桂花线香适合在下午茶时间点，配一壶桂花乌龙，吃两块桂花糕，窗外有风最好。桂花香还有一个隐藏功能——它能让人想起往事。很多人闻到桂花香会突然想起小时候外婆家的院子，或者大学校园里的那条路。香气和记忆的连接，比任何照片都深刻。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "桂花香配乌龙茶是绝配",
      "下午3-5点使用最佳，符合'下午茶'的氛围",
      "桂花香留香时间短，适合短时品香",
      "可以和绿茶香交替，清新不腻"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音配桂花香，秋日午后"
      },
      {
        "domain": "film",
        "refId": "film_001",
        "context": "看《小森林》时点桂花香，氛围满分"
      }
    ],
    "coverImage": "/assets/images/incense/guihua-xiang.jpg"
  },
  {
    "id": "incense_006",
    "title": "崖柏香：悬崖上的生命，药香里的禅意",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "中国",
    "difficulty": 2,
    "duration": "30-50分钟",
    "price": "中端",
    "body": "崖柏长在悬崖峭壁上，风吹日晒几百年，木质里浓缩了岁月的精华。崖柏香的味道很特别——有松木的清新，有药草的苦涩，还有一丝薄荷的凉。中医说崖柏能安神、助眠、消炎，所以崖柏香特别适合失眠的人。晚上九点以后，在卧室点一支崖柏线香，看二十页书，困意就来了。比吃安眠药健康多了。崖柏香还有一层文化含义——它象征'逆境中的生命力'，送朋友也很合适。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "崖柏香适合睡前使用，助眠效果好",
      "崖柏配普洱熟茶，药香和茶香很搭",
      "崖柏香不怕放，越陈越香",
      "第一次闻可能不习惯，多闻几次会上瘾"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱配崖柏，陈香对陈香"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "崖柏助眠，睡前仪式推荐"
      }
    ],
    "coverImage": "/assets/images/incense/yabai-xiang.jpg"
  },
  {
    "id": "incense_007",
    "title": "麝香：最古老的香，最私密的香",
    "primaryDomain": "incense",
    "category": "animal",
    "origin": "中国/俄罗斯",
    "difficulty": 3,
    "duration": "特殊场合",
    "price": "顶级",
    "body": "麝香是人类最早使用的香料之一，比沉香、檀香都早。它来自雄麝的腺体，味道极其复杂——有人闻到的是皮革，有人闻到的是泥土，有人闻到的是某种说不清的'动物感'。天然麝香现在是保护品，市面上基本买不到真的。但麝香作为香料的贡献在于'定香'——它能让其他香料的味道留得更久。很多高端香水里都有麝香成分，就是这个道理。品麝香，品的是历史，是人与自然最古老的连接。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "天然麝香已禁止交易，购买需谨慎",
      "麝香通常作为调香原料，不单独使用",
      "麝香适合搭配玫瑰香，经典组合",
      "麝香浓度要低，多了会头晕"
    ],
    "linkedDomains": [
      {
        "domain": "incense",
        "refId": "incense_005",
        "context": "麝香定香，桂花增甜"
      }
    ],
    "coverImage": "/assets/images/incense/shexiang.jpg"
  },
  {
    "id": "incense_008",
    "title": "茉莉花香：夏夜的清凉，宋人的雅趣",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "中国/印度",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "茉莉花香是夏天的味道。宋朝人喜欢在晚上乘凉时点茉莉香，配上冰镇的绿豆汤，听老人讲故事。茉莉花香的特点是'清'——不甜不腻，像一阵晚风吹过花园。茉莉香特别适合在书房用，不会抢了茶香的风头，反而能让空气更清新。如果你在南方，夏天的晚上点一支茉莉香，开窗让晚风进来，那感觉比开空调舒服多了。茉莉香还有一个隐藏技能——它能提神，下午困的时候闻一闻，比喝咖啡温和。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "茉莉香配绿茶是绝配，清新加倍",
      "夏天晚上使用最佳，有'乘凉'的感觉",
      "茉莉香适合放在书房，提神不扰人",
      "可以和桂花香交替，一清一甜"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配茉莉，文人最爱"
      },
      {
        "domain": "music",
        "refId": "music_002",
        "context": "古筝配茉莉香，夏日清凉"
      }
    ],
    "coverImage": "/assets/images/incense/molihua-xiang.jpg"
  },
  {
    "id": "incense_009",
    "title": "降真香：道家的仙香，通灵的媒介",
    "primaryDomain": "incense",
    "category": "woody",
    "origin": "东南亚",
    "difficulty": 2,
    "duration": "40-60分钟",
    "price": "中高端",
    "body": "降真香在道家文化里地位很高，被认为是'能通神灵'的香。它的味道介于沉香和檀香之间——比沉香甜，比檀香凉，有一种特殊的'仙气'。古人炼丹、打坐、画符之前，都要先点降真香'净场'。现代人虽然不炼丹了，但降真香的静心效果确实一流。冥想、瑜伽、或者需要深度专注的时候，点一支降真香，比白噪音管用。降真香还有一个好处——它的烟很细很轻，不会熏眼睛。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "降真香适合冥想、瑜伽、打坐时使用",
      "降真香配岩茶，有种'仙风道骨'的感觉",
      "降真香燃烧时间长，适合长时段品香",
      "降真香怕潮，保存要密封防湿"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍配降真香，岩骨花香"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "冥想配降真香，深度放松"
      }
    ],
    "coverImage": "/assets/images/incense/jiangzhen-xiang.jpg"
  },
  {
    "id": "incense_010",
    "title": "藿香：正气之香，夏天的守护者",
    "primaryDomain": "incense",
    "category": "herbal",
    "origin": "中国",
    "difficulty": 1,
    "duration": "15-20分钟",
    "price": "平价",
    "body": "藿香正气水你肯定喝过，但藿香香你可能没闻过。藿香的味道很'正'——有点冲，有点辣，但闻完之后整个人都精神了。夏天中暑、头晕、没食欲的时候，点一支藿香香，比喝藿香正气水舒服多了。藿香香还有一个妙用——驱蚊。它的味道蚊子很讨厌，比化学蚊香健康多了。在南方的夏天，傍晚在阳台点一支藿香香，既能纳凉，又能防蚊，一举两得。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "藿香香适合夏天户外使用，驱蚊效果好",
      "藿香香味道较冲，室内使用要通风",
      "藿香配薄荷茶，清凉感翻倍",
      "藿香香不贵，适合大量使用"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "夏季防暑，藿香香是好帮手"
      }
    ],
    "coverImage": "/assets/images/incense/huoxiang.jpg"
  },
  {
    "id": "incense_011",
    "title": "乳香：西方的神圣之香，跨越文明的芬芳",
    "primaryDomain": "incense",
    "category": "resin",
    "origin": "阿拉伯/非洲",
    "difficulty": 2,
    "duration": "30-45分钟",
    "price": "中端",
    "body": "乳香是东西方文明都认可的神圣之香。在中东，乳香比黄金还贵重；在西方教堂，乳香是弥撒必备；在中国，乳香是中药里的活血圣品。乳香的味道很'干净'——像刚下过雨的松林，清冽中带着一丝甜。乳香的烟很轻，向上飘，古人说它能'上达天听'。现代人用乳香，主要是为了净化空间。搬新家、开新店、或者感觉家里'气场不好'的时候，点一支乳香走一圈，比什么风水大师都管用。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "乳香适合净化空间，搬家、开业必备",
      "乳香配岩茶，有种东西方交融的感觉",
      "乳香树脂可以直接放在炭火上烧，香气更原始",
      "乳香保存要避光，否则会变质"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍配乳香，东西方雅事"
      }
    ],
    "coverImage": "/assets/images/incense/ruxiang.jpg"
  },
  {
    "id": "incense_012",
    "title": "薰衣草：紫色的安眠药，法式的浪漫",
    "primaryDomain": "incense",
    "category": "floral",
    "origin": "法国",
    "difficulty": 1,
    "duration": "20-30分钟",
    "price": "平价",
    "body": "薰衣草是全世界公认的'助眠之花'。法国普罗旺斯的薰衣草田，是无数人的梦中场景。薰衣草香的特点是'柔'——不像茉莉那么清，不像桂花那么甜，它是一种温柔的、包裹性的香气，像妈妈的手轻轻拍着你的背。薰衣草香最适合睡前使用，点一支薰衣草线香，看几页轻松的书，困意就来了。薰衣草还有一个隐藏功能——它能缓解焦虑，考试前、面试前、约会前，闻一闻薰衣草，心就没那么慌了。\n\n【香材物理】：此款香材富含挥发性芳香烃，对中枢神经具有物理平抚和舒缓效果。熏香宜使用电熏炉进行恒温加热，以避免明火炭化产生有害的焦油异味，从而完美释放香材最纯净的天然本香。",
    "tips": [
      "薰衣草香是助眠首选，比安眠药健康",
      "薰衣草配洋甘菊茶，双重助眠",
      "薰衣草香适合放在卧室，书房用会太困",
      "薰衣草香浓度要适中，太浓反而睡不着"
    ],
    "linkedDomains": [
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "薰衣草助眠，睡前仪式必备"
      },
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹配薰衣草，温柔入梦"
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
    "duration": "7分钟",
    "body": "《流水》是中国最古老的琴曲之一，讲的是伯牙和钟子期的故事。伯牙弹琴，钟子期听出'巍巍乎志在高山'和'洋洋乎志在流水'。后来钟子期死了，伯牙摔琴，从此不再弹——因为没人能听懂他的音乐了。这首曲子从低音缓缓升起，像山间的溪流，然后逐渐激昂，变成瀑布飞泻，最后又归于平静。听这首曲子，你会明白什么叫'知音难觅'。1977年，《流水》被刻在金唱片上，随着旅行者号飞向太空——如果外星人听到，他们会知道地球上有一种文明，叫'中国'。\n\n【指法曲律】：古琴名曲《高山》底层曲谱使用特殊的“减字谱”记录指法。核心物理演奏手法包括：左手大指与无名指在琴弦上的“吟”、“猱”（产生类似于弦乐物理揉弦的微小频率抖动，形成幽远的声韵），右手“挑”、“劈”激发琴弦的物理基音。泛音段落清亮空灵，象征着冰山融水与高山耸立的空静。\n【乐教哲学】：伯牙子期“高山流水”典故代表着人与人之间跨越语言阻碍的灵魂共鸣。古琴音量微弱，其共鸣箱物理材质为古松木与生漆鹿角霜胶合，声音沉浊内敛，体现了道家“大音希声”的留白折中之美。最宜在清晨烹茶后、身心处于绝对放松时静默聆听。",
    "tips": [
      "听《流水》要闭眼，想象自己坐在山涧旁",
      "古琴的声音很小，要安静的环境才能听清",
      "配一杯清茶，效果更好",
      "初听可能觉得慢，多听几次会上瘾"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配古琴，文人四雅"
      },
      {
        "domain": "incense",
        "refId": "incense_001",
        "context": "沉香配古琴，静心绝配"
      }
    ],
    "audioSrc": "",
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
    "body": "《渔舟唱晚》是古筝入门必听的曲子。曲子描绘的是傍晚时分，渔夫满载而归，渔船在夕阳下缓缓靠岸的场景。开头很安静，像夕阳洒在水面上；中间逐渐欢快，像渔夫们互相打招呼；最后高潮迭起，像大家一起庆祝丰收。这首曲子特别适合在傍晚听，配一杯红茶，看窗外的晚霞，你会觉得生活其实挺美好的。如果你没听过古筝，从这首开始最好——它不会吓到你，只会让你爱上这个乐器。\n\n【指法曲律】：古琴名曲《广陵散》是我国古代著名的戈矛杀伐之曲。其曲调激昂、高亢，在古琴音乐中极其罕见地使用了“拨刺”、“大撮”等极具物理打击感的重指法，制造出战鼓震天、刀光剑影的物理音响效果，是对传统儒家“哀而不伤、怨而不怒”中庸乐教审美的叛逆。\n【乐教哲学】：竹林七贤之首嵇康临刑前索琴弹奏此曲，叹曰：“广陵散于今绝矣！”此曲代表着魏晋名士们孤高不阿、宁死不妥协的风骨与技术尊严。适合在攻克极其复杂的代码死锁、面临重大技术决策、或需要激发内心决绝意志时聆听，能产生强大的精神共振。",
    "tips": [
      "傍晚时分听最佳，配合夕阳",
      "配红茶或普洱熟茶",
      "古筝的声音很'水'，和茶很搭",
      "可以作为背景音乐，不打扰做事"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种配古筝，暖意融融"
      },
      {
        "domain": "film",
        "refId": "film_002",
        "context": "《卧虎藏龙》里的古筝配乐"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/yuzhou.jpg"
  },
  {
    "id": "music_003",
    "title": "《二泉映月》：瞎子阿炳的心声",
    "primaryDomain": "music",
    "category": "erhu",
    "instrument": "二胡",
    "dynasty": "近代",
    "difficulty": 2,
    "duration": "8分钟",
    "body": "阿炳是无锡的瞎子艺人，每天在街头拉琴。这首曲子是他即兴创作的，没有名字，后来别人给它起了《二泉映月》。二胡的声音很'苦'，像人在深夜里独自流泪。但《二泉映月》不只是苦，它还有一种'不服'——阿炳眼睛瞎了，穷得叮当响，但他还在拉琴，还在表达。小泽征尔听完这首曲子说：'这种音乐应该跪着听。'听这首曲子，你会明白什么叫'苦难中的尊严'。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "深夜独处时听最有效果",
      "二胡的声音很'人声'，容易共情",
      "配一杯浓茶，不要加糖",
      "准备好纸巾，可能会哭"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱配二胡，苦尽甘来"
      }
    ],
    "audioSrc": "",
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
    "body": "《春江花月夜》原本是一首琵琶曲，后来改编成民乐合奏。曲子描绘的是春天的夜晚，江水静静流淌，月光洒在花丛中的美景。整首曲子像一幅慢慢展开的画卷——先是江面的宁静，然后是花丛的芬芳，接着是月亮升起的壮丽，最后一切归于平静。这首曲子特别适合在月圆之夜听，配一杯白茶，看窗外的月亮，你会想起张若虚的那句诗：'江畔何人初见月？江月何年初照人？'\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "月圆之夜听最有意境",
      "配白茶或花茶",
      "可以作为晚餐背景音乐",
      "适合和朋友一起听，分享感受"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针配《春江》，清雅绝伦"
      },
      {
        "domain": "wellness",
        "refId": "wellness_004",
        "context": "月夜养生，顺应天时"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/chunjiang.jpg"
  },
  {
    "id": "music_005",
    "title": "《十面埋伏》：琵琶的战争史诗",
    "primaryDomain": "music",
    "category": "pipa",
    "instrument": "琵琶",
    "dynasty": "明代",
    "difficulty": 3,
    "duration": "6分钟",
    "body": "《十面埋伏》是琵琶武曲的巅峰之作，讲的是楚汉相争，刘邦设下十面埋伏围困项羽的故事。这首曲子的速度极快，技巧极难，琵琶的声音像刀剑碰撞，像万马奔腾，像箭如雨下。听这首曲子，你会心跳加速，手心出汗——这就是中国音乐的力量。但最震撼的是结尾：战争结束，一切归于寂静，只剩下项羽在乌江边自刎的悲壮。这首曲子告诉我们：再强大的英雄，也敌不过命运。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "音量要开大，才能感受到气势",
      "不要在睡前听，会兴奋得睡不着",
      "配一杯浓咖啡或浓茶",
      "第一次听可能会被吓到，慢慢适应"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍配《十面埋伏》，霸气侧漏"
      },
      {
        "domain": "film",
        "refId": "film_003",
        "context": "《英雄》里的琵琶配乐"
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
    "body": "《梅花三弄》讲的是梅花在寒冬中傲然绽放的故事。'三弄'是指主题出现了三次，每次都用不同的音区和手法，像梅花在不同的角度展示它的美。这首曲子的意境是'高洁'——梅花不与百花争春，偏在最冷的时候开，这是一种怎样的骨气？听这首曲子，你会想起那些在逆境中不低头的人。冬天的晚上，窗外下着雪，屋里点着沉香，听一曲《梅花三弄》，你会觉得冷也是一种美。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "冬天听最有感觉，尤其是下雪天",
      "配一杯热红茶或姜茶",
      "古琴的声音很'木'，和冬天很搭",
      "可以和《流水》交替听，一动一静"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种配《梅花》，冬日暖意"
      },
      {
        "domain": "incense",
        "refId": "incense_002",
        "context": "檀香配《梅花》，温暖高洁"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/meihua-sannong.jpg"
  },
  {
    "id": "music_007",
    "title": "《百鸟朝凤》：唢呐也能这么好听",
    "primaryDomain": "music",
    "category": "suona",
    "instrument": "唢呐",
    "dynasty": "民间",
    "difficulty": 1,
    "duration": "5分钟",
    "body": "唢呐在中国的地位很特殊——它既能出现在最喜庆的婚礼上，也能出现在最悲伤的葬礼上。《百鸟朝凤》是唢呐的代表作，模仿各种鸟叫的声音，从麻雀到凤凰，惟妙惟肖。这首曲子特别欢快，像春天的树林里百鸟争鸣。听完这首曲子，你会对唢呐改观——它不只是'土'的，它也可以很'雅'。2016年有部电影叫《百鸟朝凤》，讲的就是唢呐艺人的故事，看完电影再听这首曲子，感受会更深。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "心情不好的时候听，立马能开心起来",
      "唢呐的声音很'亮'，适合早上听",
      "配一杯绿茶，清爽提神",
      "可以和家人一起听，老少皆宜"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配《百鸟朝凤》，清新欢快"
      },
      {
        "domain": "film",
        "refId": "film_004",
        "context": "电影《百鸟朝凤》"
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
    "duration": "7分钟",
    "body": "《平沙落雁》描绘的是秋天的傍晚，大雁落在沙滩上休息的场景。曲子开头很空旷，像无边的沙漠；然后大雁的声音从远处传来，越来越近；最后群雁落下，嘎嘎叫着，热闹非凡。这首曲子的意境是'闲适'——大雁飞了一天，终于可以休息了，那种放松的感觉，你听完也会有。秋天的下午，配一杯乌龙茶，听一曲《平沙落雁》，你会觉得'躺平'也是一种智慧。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "秋天听最有感觉，尤其是傍晚",
      "配一杯铁观音或大红袍",
      "古琴的声音很'远'，适合在大空间听",
      "可以作为读书的背景音乐"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音配《平沙落雁》，秋日午后"
      },
      {
        "domain": "wellness",
        "refId": "wellness_001",
        "context": "秋季养生，顺应自然"
      }
    ],
    "audioSrc": "",
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
    "duration": "6分钟",
    "body": "《阳关三叠》是根据王维的诗《送元二使安西》改编的琴曲。'渭城朝雨浥轻尘，客舍青青柳色新。劝君更尽一杯酒，西出阳关无故人。'曲子把这首诗唱了三遍，每遍都有变化，像朋友在离别时反复叮嘱。这首曲子特别适合送别的时候听——但不只是送朋友，也可以送自己。每次换工作、搬家、或者结束一段关系的时候，听一曲《阳关三叠》，你会明白：离别不是结束，是新的开始。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "离别的时候听，会有特别的感受",
      "配一杯送别的酒，或者送别的茶",
      "古琴的声音很'人声'，像在和你说话",
      "可以和朋友一起听，分享回忆"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_006",
        "context": "君山银针配《阳关》，依依惜别"
      }
    ],
    "audioSrc": "",
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
    "body": "《高山》和《流水》是一对，都是伯牙的作品。《流水》是水，《高山》是山。山的特点是'稳'——它不动，不摇，不急，就那么立在那里。听《高山》，你会感受到一种'定力'，像山一样，任凭风吹雨打，我自岿然不动。这首曲子特别适合在心烦意乱的时候听——它不会让你开心，但会让你平静。配一杯岩茶，坐在窗前，看远处的山，听一曲《高山》，你会明白什么叫'仁者乐山'。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "心烦意乱的时候听，能让你平静",
      "配一杯岩茶，岩骨花香",
      "古琴的声音很'沉'，适合独处时听",
      "可以和《流水》交替听，一山一水"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍配《高山》，岩骨花香"
      },
      {
        "domain": "incense",
        "refId": "incense_001",
        "context": "沉香配《高山》，静心绝配"
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
    "body": "白居易的《琵琶行》你肯定背过，但你听过用琵琶弹出来的版本吗？这首曲子把白居易的诗变成了音乐——从'浔阳江头夜送客'的凄凉，到'大珠小珠落玉盘'的华丽，再到'同是天涯沦落人'的共鸣。琵琶的声音很'脆'，像珍珠落在玉盘上，清脆悦耳。听这首曲子，你会明白为什么白居易会'江州司马青衫湿'。秋天的晚上，配一杯老白茶，听一曲《琵琶行》，你会觉得古人的心，和我们是一样的。\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "先读一遍《琵琶行》再听，感受更深",
      "琵琶的声音很'脆'，适合安静环境",
      "配一杯老白茶，岁月的味道",
      "可以和《十面埋伏》交替听，一文一武"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹配《琵琶行》，岁月静好"
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
    "body": "《渔樵问答》是古琴曲里最有哲学味道的一首。曲子模拟的是渔夫和樵夫在山涧边的对话——渔夫问樵夫：你天天砍柴累不累？樵夫问渔夫：你天天打鱼闷不闷？两人一问一答，聊着聊着，就聊到了人生的意义。这首曲子告诉我们：人生不必太执着，像渔夫一样打鱼，像樵夫一样砍柴，简简单单，就是幸福。听这首曲子，你会想起陶渊明的那句诗：'采菊东篱下，悠然见南山。'\n\n【乐曲声学】：本曲在音阶排列上遵循中国传统五声音阶（宫、商、角、徵、羽），在物理上与人体心、肝、脾、肺、肾的生物频率产生同频共振。建议使用高保真无损音源配合开放式耳机聆听，能完美还原古乐器的物理泛音细节，达到物理级别的身心疗愈。",
    "tips": [
      "适合在山里或公园听，更有意境",
      "配一杯简单的绿茶就好",
      "古琴的声音很'淡'，像白开水",
      "可以作为冥想的背景音乐"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配《渔樵》，淡泊明志"
      },
      {
        "domain": "wellness",
        "refId": "wellness_006",
        "context": "冥想配古琴，深度放松"
      }
    ],
    "audioSrc": "",
    "coverImage": "/assets/images/music/yuqiao-wenda.jpg"
  }
];

const filmData = [
  {
    "id": "film_001",
    "title": "《小森林》：一个人的田园生活",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "森淳一",
    "year": 2014,
    "difficulty": 1,
    "duration": "120分钟",
    "body": "《小森林》分夏秋篇和冬春篇，讲的是一个叫市子的女孩，离开城市回到老家小森村，一个人种地、做饭、生活的故事。这部电影没有反派，没有冲突，没有高潮——只有四季的更替，和一道道用当季食材做的饭菜。夏天做西红柿罐头，秋天做糖煮栗子，冬天做纳豆味噌，春天做野菜天妇罗。看这部电影，你会明白什么叫'好好吃饭，好好生活'。它最适合在不想努力的时候看——看完你会觉得，躺平也没什么不好，至少你在认真地活着。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "饿的时候不要看，会馋死",
      "看完会想自己做饭，提前准备好食材",
      "夏秋篇比冬春篇更'下饭'",
      "配一杯日本煎茶，氛围更搭"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_001",
        "context": "龙井配《小森林》，清新自然"
      },
      {
        "domain": "wellness",
        "refId": "wellness_003",
        "context": "好好吃饭，就是最好的养生"
      }
    ],
    "coverImage": "/assets/images/film/xiaosenlin.jpg"
  },
  {
    "id": "film_002",
    "title": "《卧虎藏龙》：武侠的最高境界",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "李安",
    "year": 2000,
    "difficulty": 1,
    "duration": "120分钟",
    "body": "《卧虎藏龙》是华语电影的巅峰之一。李安把武侠拍成了诗——竹林打斗那场戏，两人在竹梢上飞来飞去，像两只鸟；玉娇龙和李慕白的对话，每一句都是哲学。这部电影讲的是'压抑'——李慕白压抑对俞秀莲的爱，玉娇龙压抑对自由的渴望，俞秀莲压抑对李慕白的情。最后玉娇龙跳崖，不是因为绝望，而是因为自由。看这部电影，你会明白：真正的自由，不是想做什么就做什么，而是不想做什么就不做什么。\n\n【镜头语言与物理钢丝】：李安与摄影师鲍德熹在这部奥斯卡史诗中，使用“实体钢丝挂载”配合物理重力动力学，创造了划时代的竹林打斗戏。镜头没有使用夸张的快速剪辑，而是用大远景和长镜头，将李慕白与玉娇龙在绿竹摇曳顶端的起伏起落，与风的物理动力学完美融合，制造出轻盈如羽、化骨绵掌的写意空间。\n【声影隐喻与哲学折中】：竹林的翠绿与武当山大殿的灰冷构成色彩反差，隐喻着自由江湖与社会礼教的终极冲突。李慕白对青冥剑的舍弃与重握，展示了道家“无为而无不为”与儒家“明知不可为而为之”的折中挣扎。适合深夜独自观看，泡一杯清新微苦的西湖龙井，在茶香中体会人性的隐忍与放手。",
    "tips": [
      "一定要看粤语版，配音更有味道",
      "竹林打斗那场戏是影史经典",
      "配一杯竹叶青，竹林配竹茶",
      "看完会想学太极，但别冲动"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春配《卧虎藏龙》，江南韵味"
      },
      {
        "domain": "music",
        "refId": "music_005",
        "context": "《十面埋伏》配武侠，绝配"
      }
    ],
    "coverImage": "/assets/images/film/wohu-canglong.jpg"
  },
  {
    "id": "film_003",
    "title": "《英雄》：色彩的史诗",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "张艺谋",
    "year": 2002,
    "difficulty": 1,
    "duration": "100分钟",
    "body": "《英雄》是张艺谋最被低估的电影。它用颜色讲故事——红色代表嫉妒，蓝色代表理智，白色代表纯洁，绿色代表回忆。每一段故事都是不同颜色的，像一幅流动的油画。这部电影讲的是'天下'——为了天下太平，个人的恩怨算什么？无名最终放弃刺杀秦王，不是因为打不过，而是因为他明白了：杀一个暴君容易，但天下大乱更可怕。看这部电影，你会明白什么叫'以天下为己任'。最经典的场景是箭竹海打斗，两个红衣女子在水面上飞来飞去，美到窒息。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "一定要看高清版，色彩是这部电影的灵魂",
      "箭竹海那场戏是影史最美打斗",
      "配一杯红茶，暖色调配暖茶",
      "可以和《卧虎藏龙》对比着看"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_005",
        "context": "正山小种配《英雄》，暖意融融"
      },
      {
        "domain": "music",
        "refId": "music_005",
        "context": "琵琶配《英雄》，杀伐果断"
      }
    ],
    "coverImage": "/assets/images/film/yingxiong.jpg"
  },
  {
    "id": "film_004",
    "title": "《百鸟朝凤》：传统文化的挽歌",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "吴天明",
    "year": 2016,
    "difficulty": 2,
    "duration": "108分钟",
    "body": "《百鸟朝凤》讲的是唢呐艺人的故事。焦三爷是无双镇的唢呐王，他把毕生技艺传给徒弟天鸣。但时代变了，西洋乐队来了，没人听唢呐了。焦三爷吐着血还在吹，因为他答应过师父：唢呐不能断在我们手里。这部电影是吴天明导演的遗作，上映时排片极低，制片人方励下跪求排片，才引起关注。看这部电影，你会心痛——不是为唢呐心痛，是为所有正在消失的传统文化心痛。它告诉我们：有些东西，一旦断了，就再也接不上了。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "准备好纸巾，会哭",
      "看完会想学一门传统手艺",
      "配一杯老茶，岁月的味道",
      "可以和《小森林》对比，一个坚守，一个离开"
    ],
    "linkedDomains": [
      {
        "domain": "music",
        "refId": "music_007",
        "context": "《百鸟朝凤》唢呐曲"
      },
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱配《百鸟朝凤》，苦尽甘来"
      }
    ],
    "coverImage": "/assets/images/film/bainiao-zhaofeng-film.jpg"
  },
  {
    "id": "film_005",
    "title": "《千与千寻》：成长的代价",
    "primaryDomain": "film",
    "category": "anime",
    "director": "宫崎骏",
    "year": 2001,
    "difficulty": 1,
    "duration": "125分钟",
    "body": "《千与千寻》是宫崎骏最好的作品，没有之一。它讲的是一个叫千寻的女孩，误入神灵的世界，为了救变成猪的父母，不得不在汤婆婆的澡堂打工。这部电影讲的是'成长'——千寻从一个胆小怕事的女孩，变成一个勇敢独立的少女。但成长是有代价的：她失去了名字，失去了记忆，差点失去了自己。最后她想起来自己叫'荻野千寻'，才救回了父母。看这部电影，你会明白：成长不是变强，是找回自己。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "一定要看日语原版，配音更有味道",
      "无脸男是全片最复杂的角色",
      "配一杯日本抹茶，和风氛围",
      "每年看一次，每次感受都不一样"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_009",
        "context": "黄山毛峰配《千与千寻》，清新脱俗"
      }
    ],
    "coverImage": "/assets/images/film/qianyu-qianxun.jpg"
  },
  {
    "id": "film_006",
    "title": "《饮食男女》：中国人的饭桌哲学",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "李安",
    "year": 1994,
    "difficulty": 1,
    "duration": "124分钟",
    "body": "《饮食男女》是李安'家庭三部曲'的最后一部，讲的是退休大厨老朱和三个女儿的故事。老朱每周日都要做一桌大菜，把女儿们叫回家吃饭。但女儿们各有各的秘密，饭桌上的气氛越来越尴尬。最后老朱宣布了一个惊人的秘密，全家人都惊呆了。这部电影讲的是'沟通'——中国人表达爱的方式，从来不是说'我爱你'，而是做一桌好菜。看这部电影，你会想起你爸妈，想起家里的饭桌，想起那些没说出口的话。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "饿的时候不要看，会馋死",
      "开头的做菜戏是影史经典",
      "配一杯乌龙茶，配点心",
      "看完会想给爸妈打电话"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_003",
        "context": "铁观音配《饮食男女》，家的味道"
      },
      {
        "domain": "wellness",
        "refId": "wellness_003",
        "context": "好好吃饭，就是最好的养生"
      }
    ],
    "coverImage": "/assets/images/film/yinshi-nannv.jpg"
  },
  {
    "id": "film_007",
    "title": "《入殓师》：死亡的温柔",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "�的田洋次",
    "year": 2008,
    "difficulty": 2,
    "duration": "130分钟",
    "body": "《入殓师》讲的是一个大提琴手失业后，误打误撞成了入殓师的故事。他每天的工作是为死者清洗、化妆、穿衣，让体面地离开这个世界。这部电影很慢，很安静，但每一帧都在告诉你：死亡不是可怕的，它是生命的一部分。最感人的一幕是老入殓师为一个老奶奶化妆，边化边说：'她年轻的时候一定很美。'看这部电影，你会明白：对死者最大的尊重，是让他们走得体面。它适合在失去亲人之后看，会让你释怀。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "准备好纸巾，会哭",
      "不要在公共场合看，会失态",
      "配一杯热茶，温暖自己",
      "看完会想给逝去的亲人扫墓"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_012",
        "context": "白牡丹配《入殓师》，温柔告别"
      },
      {
        "domain": "wellness",
        "refId": "wellness_007",
        "context": "生死观教育"
      }
    ],
    "coverImage": "/assets/images/film/rulishi.jpg"
  },
  {
    "id": "film_008",
    "title": "《海街日记》：四姐妹的夏天",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "是枝裕和",
    "year": 2015,
    "difficulty": 1,
    "duration": "128分钟",
    "body": "《海街日记》是是枝裕和最温柔的电影。讲的是镰仓四姐妹的故事——父亲去世后，三个姐姐把同父异母的妹妹接来一起住。四个人性格迥异，但在一起生活，慢慢磨合，慢慢理解。这部电影没有大起大落，只有日常的琐碎：一起做饭，一起看烟花，一起在海边散步。但它会让你明白：家不是血缘决定的，是爱决定的。看这部电影，你会想有个姐姐，或者想对姐姐好一点。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "夏天看最有感觉",
      "镰仓的风景很美，会想去旅游",
      "配一杯冷泡茶，夏日清爽",
      "适合和家人一起看"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_002",
        "context": "碧螺春配《海街日记》，清新自然"
      },
      {
        "domain": "wellness",
        "refId": "wellness_002",
        "context": "夏日养生，清凉一夏"
      }
    ],
    "coverImage": "/assets/images/film/haijieriji.jpg"
  },
  {
    "id": "film_009",
    "title": "《花样年华》：错过的人",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "王家卫",
    "year": 2000,
    "difficulty": 2,
    "duration": "98分钟",
    "body": "《花样年华》是王家卫最美的电影。讲的是1960年代的香港，周慕云和苏丽珍发现各自的配偶出轨了，两人在痛苦中互相靠近，但始终没有越界。这部电影全是'留白'——旗袍的颜色，昏暗的灯光，狭窄的楼梯，欲言又止的眼神。它讲的是'错过'——有些人，明明相爱，却不能在一起。最经典的台词是：'如果多一张船票，你会不会跟我走？'看这部电影，你会想起那个错过的人，然后释怀：错过，也是一种美。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "一定要看粤语版，梁朝伟的配音太绝",
      "张曼玉换了23套旗袍",
      "配一杯陈年普洱，岁月的味道",
      "适合一个人看，不要和现任一起"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_008",
        "context": "普洱配《花样年华》，岁月留香"
      },
      {
        "domain": "music",
        "refId": "music_003",
        "context": "《二泉映月》配《花样年华》，都是错过"
      }
    ],
    "coverImage": "/assets/images/film/huayang-nianhua.jpg"
  },
  {
    "id": "film_010",
    "title": "《龙猫》：童年的夏天",
    "primaryDomain": "film",
    "category": "anime",
    "director": "宫崎骏",
    "year": 1988,
    "difficulty": 1,
    "duration": "86分钟",
    "body": "《龙猫》是宫崎骏最简单的电影，也是最治愈的。讲的是小月和小梅两姐妹搬到乡下，遇到了森林守护者龙猫。龙猫很大，很胖，很可爱，它会飞，会召唤猫巴士，会在雨中等车时送你一把伞。这部电影没有反派，没有冲突，只有童年的夏天：捉迷藏，摘玉米，等爸爸回家。看这部电影，你会想起小时候，想起那个相信世界上有魔法的自己。它适合在心情不好的时候看——看完你会觉得，世界还是美好的。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "心情不好的时候看，立马能治愈",
      "龙猫巴士那场戏是影史经典",
      "配一杯甜甜的花茶，像童年一样",
      "适合和孩子一起看"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_010",
        "context": "茉莉花茶配《龙猫》，清新甜美"
      }
    ],
    "coverImage": "/assets/images/film/longmao.jpg"
  },
  {
    "id": "film_011",
    "title": "《一代宗师》：念念不忘，必有回响",
    "primaryDomain": "film",
    "category": "chinese",
    "director": "王家卫",
    "year": 2013,
    "difficulty": 2,
    "duration": "111分钟",
    "body": "《一代宗师》是王家卫拍了12年的电影，讲的是叶问的一生。但这部电影不是传统意义上的功夫片——它讲的是'传承'。宫二说：'世间所有的相遇，都是久别重逢。'叶问说：'念念不忘，必有回响。'每一句台词都像诗。最经典的场景是金楼打斗，雨中的拳脚，慢镜头，每一帧都是水墨画。看这部电影，你会明白：武术的最高境界不是打赢别人，是找到自己。\n\n【镜头语言与物理抽帧】：王家卫在这部耗时 12 年的杰作中，将“慢速快门”与“物理抽帧”发挥到了极致。在金楼雨中打斗的经典一幕中，快门速度被降至 1/12 秒甚至更低，物理上让高速落下的雨滴拉长成一道道明亮的玻璃丝线。随后通过重印画面帧，让叶问拳脚在拖影中呈现出凝固的力度美。暗调逆光的使用，让演员的轮廓与雨水折射出如水墨画般的物理反差。\n【声影隐喻与哲学折中】：电影不是在写武功，而是在写“大时代下人的妥协与操守”。宫二代表了至死不妥协的古典武林尊严（“宁可无碑，不可无名”）；而叶问则代表了顺应时代洪流、将武术带入寻常百姓家的折中智慧。念念不忘，必有回响。看这部电影，搭配一杯焙火重浊的武夷大红袍，最能品出那份逝去的岩骨风骨。",
    "tips": [
      "一定要看3D版，雨滴打在脸上的感觉",
      "台词很'装'，但装得很美",
      "配一杯岩茶，武夷山的味道",
      "可以和《卧虎藏龙》对比，一个写意，一个写实"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_004",
        "context": "大红袍配《一代宗师》，武夷风骨"
      },
      {
        "domain": "music",
        "refId": "music_010",
        "context": "《高山》配《一代宗师》，宗师气度"
      }
    ],
    "coverImage": "/assets/images/film/yidaizongshi.jpg"
  },
  {
    "id": "film_012",
    "title": "《情书》：你好吗？我很好",
    "primaryDomain": "film",
    "category": "japanese",
    "director": "岩井俊二",
    "year": 1995,
    "difficulty": 1,
    "duration": "117分钟",
    "body": "《情书》是日本纯爱电影的巅峰。讲的是渡边博子在未婚夫藤井树去世后，寄了一封信到他老家的地址，没想到收到了回信——回信的人也叫藤井树，是个女孩。原来，男藤井树在中学时暗恋女藤井树，但从来没说过。博子通过和女藤井树通信，慢慢发现了未婚夫少年时的秘密。最经典的台词是博子对着雪山喊：'你好吗？我很好。'看这部电影，你会想起那个暗恋过的人，然后微笑：有些爱，不说出来，也很美。\n\n【镜头与声影美学】：本片在镜头美学上采用了黄金分割构图与低饱和度冷暖反差色调，物理上降低了视网膜的刺激疲劳度，营造出沉静的质感。其音轨采用大动态冷门乐器点缀，实现了声画分立与哲学留白，是一部兼具工业美学与人文内涵的宗师级视觉杰作。建议调低视口环境亮度静静品鉴。",
    "tips": [
      "冬天看最有感觉，尤其是下雪天",
      "准备好纸巾，最后会哭",
      "配一杯热可可，温暖自己",
      "适合一个人看，回忆青春"
    ],
    "linkedDomains": [
      {
        "domain": "tea",
        "refId": "tea_011",
        "context": "白毫银针配《情书》，纯白如雪"
      },
      {
        "domain": "wellness",
        "refId": "wellness_005",
        "context": "冬日养生，温暖自己"
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
