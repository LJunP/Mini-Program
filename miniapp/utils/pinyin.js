// utils/pinyin.js — 轻量拼音搜索工具
// 支持：首字母匹配（如 "xlj" → "西湖龙井"）、全拼匹配（如 "longjing" → "龙井"）
// 采用词组映射表，覆盖茶品/行旅/养生/香道/音乐/电影领域的高频词汇

// ============================================================
// 1. 单字拼音映射（只收录项目中实际出现的汉字）
// ============================================================
const _P = {
  '龙':'long','井':'jing','西':'xi','湖':'hu','碧':'bi','螺':'luo','春':'chun',
  '安':'an','吉':'ji','白':'bai','毫':'hao','银':'yin','针':'zhen','铁':'tie',
  '观':'guan','音':'yin','大':'da','红':'hong','袍':'pao','正':'zheng','山':'shan',
  '种':'zhong','小':'xiao','祁':'qi','门':'men','滇':'dian','云':'yun','南':'nan',
  '福':'fu','建':'jian','浙':'zhe','江':'jiang','苏':'su','广':'guang','东':'dong',
  '四':'si','川':'chuan','北':'bei','河':'he','武':'wu','夷':'yi','岩':'yan',
  '太':'tai','洞':'dong','庭':'ting','梅':'mei','家':'jia','坞':'wu',
  '绿':'lv','黄':'huang','青':'qing','黑':'hei','花':'hua','果':'guo',
  '香':'xiang','清':'qing','鲜':'xian','甘':'gan','醇':'chun','厚':'hou',
  '柔':'rou','滑':'hua','甜':'tian','苦':'ku','涩':'se','回':'hui',
  '古':'gu','琴':'qin','筝':'zheng','笛':'di','箫':'xiao','琵':'pi','琶':'pa',
  '二':'er','胡':'hu','鼓':'gu','瑟':'se','编':'bian','钟':'zhong',
  '沉':'chen','檀':'tan','艾':'ai','草':'cao','陈':'chen','皮':'pi',
  '涎':'xian','乳':'ru','木':'mu','竹':'zhu',
  '夏':'xia','秋':'qiu','冬':'dong','肝':'gan','心':'xin',
  '脾':'pi','肺':'fei','肾':'shen','眼':'yan','睡':'shui','眠':'mian',
  '养':'yang','生':'sheng','茶':'cha','道':'dao','乐':'le',
  '影':'ying','游':'you','旅':'lv','行':'xing',
  '州':'zhou','杭':'hang','成':'cheng','都':'du',
  '景':'jing','德':'de','镇':'zhen','九':'jiu','曲':'qu','溪':'xi',
  '天':'tian','峰':'feng','拙':'zhuo','政':'zheng','园':'yuan',
  '平':'ping','路':'lu','沧':'cang','浪':'lang','亭':'ting',
  '留':'liu','网':'wang','狮':'shi','林':'lin',
  '导':'dao','演':'yan','年':'nian','难':'nan','度':'du',
  '价':'jia','格':'ge','品':'pin','质':'zhi','评':'ping','分':'fen',
  '收':'shou','藏':'cang','数':'shu','量':'liang','热':'re',
  '推':'jian','荐':'jian','搜':'sou','索':'suo','历':'li','史':'shi',
  '记':'ji','录':'lu','筛':'shai','选':'xuan','排':'pai','序':'xu',
  '相':'xiang','关':'guan','时':'shi','间':'jian','新':'xin',
  '艺':'yi','器':'qi','具':'ju','杯':'bei','壶':'hu',
  '紫':'zi','砂':'sha','陶':'tao','瓷':'ci','玻':'bo','璃':'li',
  '冲':'chong','泡':'pao','温':'wen','水':'shui','量':'liang',
  '叶':'ye','嫩':'nen','芽':'ya','全':'quan',
  '明':'ming','前':'qian','雨':'yu','后':'hou','谷':'gu',
  '立':'li','分':'fen','寒':'han','露':'lu',
  '霜':'shuang','降':'jiang','雪':'xue','至':'zhi','芒':'mang',
  '处':'chu','暑':'shu','蛰':'zhe','惊':'jing',
  '仙':'xian','老':'lao','丛':'cong','肉':'rou','桂':'gui',
  '密':'mi','封':'feng','冷':'leng','干':'gan','燥':'zao',
  '通':'tong','风':'feng','避':'bi','光':'guang','防':'fang','潮':'chao',
  '盖':'gai','碗':'wan','公':'gong','闻':'wen',
  '赏':'shang','焚':'fen','听':'ting','作':'zuo','画':'hua','书':'shu',
  '法':'fa','插':'cha','挂':'gua','文':'wen','房':'fang',
  '宝':'bao','笔':'bi','墨':'mo','纸':'zhi','砚':'yan',
  '人':'ren','雅':'ya','事':'shi','禅':'chan','意':'yi',
  '境':'jie','界':'jie','修':'xiu','炼':'lian','悟':'wu',
  '静':'jing','冥':'ming','想':'xiang','呼':'hu','吸':'xi',
  '吐':'tu','纳':'na','引':'yin','气':'qi','功':'gong',
  '极':'ji','拳':'quan','瑜':'yu','伽':'jia','八':'ba',
  '段':'duan','锦':'jin','五':'wu','禽':'qin','戏':'xi','六':'liu',
  '字':'zi','诀':'jue','易':'yi','筋':'jin','经':'jing',
  '食':'shi','疗':'liao','药':'yao','膳':'shan','粥':'zhou','汤':'tang',
  '羹':'geng','炖':'dun','煮':'zhu','蒸':'zheng','烤':'kao',
  '煎':'jian','炒':'chao','拌':'ban','腌':'yan','卤':'lu','酱':'jiang',
  '蔬':'shu','豆':'dou','鱼':'yu','虾':'xia','蟹':'xie','蛋':'dan',
  '奶':'nai','蜜':'mi','枣':'zao','枸':'gou','杞':'qi','莲':'lian',
  '合':'he','薏':'yi','仁':'ren','芡':'qian','实':'shi','茯':'fu',
  '苓':'ling','芪':'qi','当':'dang','归':'gui','党':'dang',
  '参':'shen','石':'shi','斛':'hu','麦':'mai','麻':'ma',
  '杜':'du','仲':'zhong','附':'fu','姜':'jiang','薄':'bo','荷':'he',
  '菊':'ju','玫':'mei','瑰':'gui','茉':'mo','莉':'li',
  '桑':'sang','杏':'xing','罗':'luo','汉':'han','胖':'pang','海':'hai',
  '蒲':'pu','英':'ying','连':'lian','翘':'qiao','板':'ban','蓝':'lan',
  '根':'gen','芩':'qin','柏':'bo','栀':'zhi','枯':'ku',
  '决':'jue','精':'jing','覆':'fu','盆':'pen','味':'wei',
  '茱':'zhu','萸':'yu','女':'nv','贞':'zhen','旱':'han',
  '松':'song','兰':'lan','牡':'mu','丹':'dan','芍':'shao',
  '樱':'ying','桃':'tao','梨':'li','棠':'tang','鹃':'juan',
  '洛':'luo','阳':'yang','菏':'he','泽':'ze','曹':'cao',
  '扬':'yang','京':'jing','咸':'xian','宁':'ning','桂':'gui',
  '芙':'fu','蓉':'rong','棉':'mian','拉':'la','萨':'sa',
  '格':'ge','济':'ji','石':'shi','榴':'liu','理':'li',
  '丽':'li','武':'wu','汉':'han','锡':'xi','青':'qing','岛':'dao',
  '连':'lian','顺':'shun',
  '李':'li','张':'zhang','谋':'mou','凯':'kai','歌':'ge','冯':'feng',
  '刚':'gang','王':'wang','卫':'wei','侯':'hou','孝':'xiao','贤':'xian',
  '杨':'yang','昌':'chang','贾':'jia','樟':'zhang','柯':'ke','娄':'lou',
  '烨':'ye','是':'shi','枝':'zhi','裕':'yu','吴':'wu','念':'nian',
  '真':'zhen','许':'xu','鞍':'an','华':'hua','森':'sen','淳':'chun',
  '俊':'jun','宫':'gong','崎':'qi','骏':'jun','下':'xia','圭':'gui',
  '郎':'lang','津':'jin','野':'ye','健':'jian','田':'tian','洋':'yang',
  '次':'zi','寺':'si','岛':'dao','秀':'xiu','雄':'xiong','今':'jin',
  '村':'cun',
  '柏':'bai','威':'wei','尼':'ni','斯':'si','戛':'jia',
  '奥':'ao','卡':'ka','金':'jin','球':'qiu','奖':'jiang',
  '电':'dian','术':'shu','学':'xue','院':'yuan',
  '节':'jie','鸡':'ji','百':'bai','表':'biao','马':'ma',
  '像':'xiang','曲':'qu','莱':'lai','美':'mei','钟':'zhong',
  '印':'yin','巴':'ba','根':'gen','廷':'ting','墨':'mo','哥':'ge',
  '加':'jia','拿':'na','澳':'ao','利':'li','亚':'ya',
  '瑞':'rui','典':'dian','挪':'nuo','威':'wei','丹':'dan','麦':'mai',
  '芬':'fen','波':'bo','捷':'jie','克':'ke','匈':'xiong','牙':'ya',
  '罗':'luo','保':'bao','希':'xi','腊':'la','土':'tu','耳':'er','其':'qi',
  '以':'yi','色':'se','列':'lie','伊':'yi','朗':'lang','泰':'tai',
  '越':'yue','越':'yue','印':'yin','菲':'fei','律':'lv','宾':'bin',
  '来':'lai','坡':'po','港':'gang','台':'tai','湾':'wan','门':'men',
  '鹰':'ying','隼':'sun','郎':'lang','尔':'er','曼':'man','科':'ke',
  '波':'bo','顿':'dun','乔':'qiao','治':'zhi','卡':'ka','梅':'mei',
  '隆':'long','西':'xi','亚':'ya','伦':'lun','敦':'dun','纽':'niu',
  '约':'yue','洛':'luo','杉':'shan','矶':'ji','旧':'jiu','金':'jin',
  '芝':'zhi','哥':'ge','底':'di','特':'te','律':'lv','费':'fei',
  '城':'cheng','巴':'ba','尔':'er','的':'di','摩':'mo','亚':'ya',
  '圣':'sheng','地':'di','亚':'ya','哥':'ge','西':'xi','雅':'ya',
  '图':'tu','丹':'dan','佛':'fo','尔':'er','波':'bo','特':'te',
  '兰':'lan','盐':'yan','湖':'hu','城':'cheng','丹':'dan','佛':'fo',
  '堪':'kan','萨':'sa','斯':'si','城':'cheng','堪':'kan','萨':'sa',
  '斯':'si','奥':'ao','马':'ma','哈':'ha','纳':'na','达':'da',
  '威':'wei','奇':'qi','塔':'ta','尔':'er','萨':'sa','斯':'si',
  '城':'cheng','小':'xiao','石':'shi','城':'cheng','阿':'a','尔':'er',
  '伯':'bo','克':'ke','基':'ji','尔':'er','奥':'ao','斯':'si','汀':'ting',
  '达':'da','拉':'la','斯':'si','休':'xiu','斯':'si','敦':'dun',
  '圣':'sheng','安':'an','东':'dong','尼':'ni','奥':'ao','迈':'mai',
  '阿':'a','密':'mi','坦':'tan','帕':'pa','坦':'tan','奥':'ao',
  '兰':'lan','多':'duo','杰':'jie','克':'ke','逊':'xun','维':'wei',
  '尔':'er','明':'ming','顿':'dun','亚':'ya','特':'te','兰':'lan',
  '大':'da','迈':'mai','阿':'a','密':'mi','坦':'tan','新':'xin',
  '奥':'ao','尔':'er','良':'liang','孟':'meng','菲':'fei','斯':'si',
  '纳':'na','什':'shi','维':'wei','尔':'尔','明':'ming','顿':'dun',
  '罗':'luo','利':'li','达':'da','勒':'le','姆':'mu','夏':'xia','洛':'luo',
  '特':'te','弗':'fu','吉':'ji','尼':'ni','亚':'ya','比':'bi','奇':'qi',
  '诺':'nuo','福':'fu','克':'ke','韦':'wei','斯':'si','特':'te',
  '里':'li','士':'shi','满':'man','切':'qie','斯':'si','特':'te',
  '尔':'er','布':'bu','法':'fa','洛':'luo','罗':'luo','切':'qie','斯':'si',
  '特':'te','尔':'er','阿':'a','克':'ke','伦':'lun','罗':'luo','切':'qie',
  '斯':'si','特':'te','尔':'尔','里':'li','士':'shi','满':'man',
  '切':'qie','斯':'si','特':'te','尔':'尔','布':'bu','法':'fa',
  '罗':'luo','切':'qie','斯':'si','特':'te','尔':'尔','阿':'a',
  '克':'ke','伦':'lun','罗':'luo','切':'qie','斯':'si','特':'te',
  '尔':'尔','里':'li','士':'shi','满':'man','切':'qie','斯':'si',
  '特':'te','尔':'尔',
};

// ============================================================
// 2. 词组拼音映射（覆盖项目数据中的高频词）
// ============================================================
const _W = {
  '西湖龙井': ['xihulongjing', 'xlj'],
  '洞庭碧螺春': ['dongtingbiluochun', 'dtblc'],
  '安吉白茶': ['anjibicha', 'ajbc'],
  '铁观音': ['tieguanyin', 'tgy'],
  '大红袍': ['dahongpao', 'dhp'],
  '正山小种': ['zhengshanxiaozhong', 'zsxz'],
  '祁门红茶': ['qimenghongcha', 'qmhc'],
  '金骏眉': ['jinjunmei', 'jjm'],
  '白毫银针': ['baihaoyinzhen', 'bhyz'],
  '白牡丹': ['baimudan', 'bmd'],
  '福鼎白茶': ['fudingbicha', 'fdbc'],
  '武夷山': ['wuyishan', 'wys'],
  '武夷岩茶': ['wuyiyancha', 'wylc'],
  '牛栏坑': ['niulankeng', 'nlk'],
  '慧苑坑': ['huiyuankeng', 'hyk'],
  '水仙': ['shuixian', 'sx'],
  '肉桂': ['rougui', 'rg'],
  '苏州': ['suzhou', 'sz'],
  '杭州': ['hangzhou', 'hz'],
  '成都': ['chengdu', 'cd'],
  '景德镇': ['jingdezhen', 'jdz'],
  '九曲溪': ['jiuquxi', 'jqx'],
  '天游峰': ['tianyoufeng', 'tyf'],
  '拙政园': ['zhuozhengyuan', 'zzy'],
  '平江路': ['pingjianglu', 'pjl'],
  '沧浪亭': ['canglangting', 'clt'],
  '留园': ['liuyuan', 'ly'],
  '狮子林': ['shizilin', 'szl'],
  '古琴': ['guqin', 'gq'],
  '古筝': ['guzheng', 'gz'],
  '笛子': ['dizi', 'dz'],
  '洞箫': ['dongxiao', 'dx'],
  '琵琶': ['pipa', 'pp'],
  '二胡': ['erhu', 'eh'],
  '沉香': ['chenxiang', 'cx'],
  '檀香': ['tanxiang', 'tx'],
  '龙涎香': ['longxianxiang', 'lxx'],
  '艾草': ['aicao', 'ac'],
  '陈皮': ['chenpi', 'cp'],
  '春季养肝': ['chunjiyanggan', 'cjyg'],
  '夏季养心': ['xiajiyangxin', 'xjyx'],
  '秋季养肺': ['qiujiiyangfei', 'qjyf'],
  '冬季养肾': ['dongjiyangshen', 'djys'],
  '助眠': ['zhumian', 'zm'],
  '安神': ['anshen', 'as'],
  '养肝': ['yanggan', 'yg'],
  '养心': ['yangxin', 'yx'],
  '养脾': ['yangpi', 'yp'],
  '养肺': ['yangfei', 'yf'],
  '养肾': ['yangshen', 'ys'],
  '小森林': ['xiaosenlin', 'xsl'],
  '卧虎藏龙': ['wuhucanglong', 'whcl'],
  '英雄': ['yingxiong', 'yx'],
  '森淳一': ['senchunyi', 'scy'],
  '李安': ['lian', 'la'],
  '张艺谋': ['zhangyimou', 'zym'],
  '绿茶': ['lvcha', 'lc'],
  '红茶': ['hongcha', 'hc'],
  '白茶': ['baicha', 'bc'],
  '黄茶': ['huangcha', 'huc'],
  '青茶': ['qingcha', 'qc'],
  '乌龙茶': ['wulongcha', 'wlc'],
  '黑茶': ['heicha', 'hc'],
  '普洱茶': ['puercha', 'pec'],
  '花茶': ['huacha', 'hc'],
  '明前': ['mingqian', 'mq'],
  '雨前': ['yuqian', 'yq'],
  '特级': ['teji', 'tj'],
  '清新': ['qingxin', 'qx'],
  '豆香': ['douxiang', 'dx'],
  '鲜爽': ['xianshuang', 'xs'],
  '花果香': ['huaguoxiang', 'hgx'],
  '岩骨花香': ['yanguhuaxiang', 'yghx'],
  '兰花香': ['lanhuaxiang', 'lhx'],
  '观音韵': ['guanyinyun', 'gyy'],
  '蜜香': ['mixiang', 'mx'],
  '松烟香': ['songyanxiang', 'syx'],
  '祁门香': ['qimenxiang', 'qmx'],
  '毫香蜜韵': ['haoxiangmiyun', 'hxmy'],
  '陈香': ['chenxiang', 'cx'],
  '流水': ['liushui', 'ls'],
  '渔舟唱晚': ['yuzhouchangwan', 'yzcw'],
  '高山流水': ['gaoshanliushui', 'gsls'],
  '梅花三弄': ['meihuasannong', 'mhsn'],
  '十面埋伏': ['shimianmaifu', 'smmf'],
  '春江花月夜': ['chunjianghuayueye', 'cjhye'],
  '二泉映月': ['erquanyingyue', 'eqyy'],
  '百鸟朝凤': ['biniaochaofeng', 'bncf'],
  '茉莉花': ['molihua', 'mlh'],
  '良宵': ['liangxiao', 'lx'],
  '赛马': ['saima', 'sm'],
  '广陵散': ['guanglingsan', 'gls'],
  '日本': ['riben', 'rb'],
  '中国': ['zhongguo', 'zg'],
  '印度': ['yindu', 'yd'],
  '海南': ['hainan', 'hn'],
  '福建': ['fujian', 'fj'],
  '浙江': ['zhejiang', 'zj'],
  '江苏': ['jiangsu', 'js'],
  '云南': ['yunnan', 'yn'],
  '广东': ['guangdong', 'gd'],
  '四川': ['sichuan', 'sc'],
  '北京': ['beijing', 'bj'],
  '上海': ['shanghai', 'sh'],
  '天津': ['tianjin', 'tj'],
  '重庆': ['chongqing', 'cq'],
  '深圳': ['shenzhen', 'sz'],
  '广州': ['guangzhou', 'gz'],
  '武汉': ['wuhan', 'wh'],
  '南京': ['nanjing', 'nj'],
  '西安': ['xian', 'xa'],
  '长沙': ['changsha', 'cs'],
  '厦门': ['xiamen', 'xm'],
  '青岛': ['qingdao', 'qd'],
  '大连': ['dalian', 'dl'],
  '昆明': ['kunming', 'km'],
  '丽江': ['lijiang', 'lj'],
  '大理': ['dali', 'dl'],
  '桂林': ['guilin', 'gl'],
  '拉萨': ['lasa', 'ls'],
  '乌镇': ['wuzhen', 'wz'],
  '周庄': ['zhouzhuang', 'zz'],
  '西塘': ['xitang', 'xt'],
};

/**
 * 获取单字拼音
 * @param {string} char 单个汉字
 * @returns {string} 拼音或空字符串
 */
function getCharPinyin(char) {
  return _P[char] || '';
}

/**
 * 获取字符串的拼音（逐字拼接）
 * @param {string} str 中文字符串
 * @returns {string} 拼音（无空格）
 */
function getStringPinyin(str) {
  if (!str) return '';
  return str.split('').map(c => getCharPinyin(c)).join('');
}

/**
 * 获取字符串的拼音首字母
 * @param {string} str 中文字符串
 * @returns {string} 首字母组合
 */
function getInitials(str) {
  if (!str) return '';
  return str.split('').map(c => {
    const py = getCharPinyin(c);
    return py ? py[0] : '';
  }).join('');
}

/**
 * 检查词组是否匹配拼音查询
 * @param {string} word 原始词（如 "西湖龙井"）
 * @param {string} query 用户输入的拼音查询（如 "xlj" 或 "longjing"）
 * @returns {boolean}
 */
function matchPinyin(word, query) {
  if (!word || !query) return false;
  const q = query.toLowerCase().trim();

  // 1. 检查词组拼音映射
  const pinyins = _W[word];
  if (pinyins) {
    for (const py of pinyins) {
      if (py === q || py.startsWith(q)) return true;
    }
  }

  // 2. 逐字拼音匹配
  const fullPinyin = getStringPinyin(word);
  if (fullPinyin.includes(q)) return true;

  // 3. 首字母匹配
  const initials = getInitials(word);
  if (initials.includes(q)) return true;

  return false;
}

/**
 * 计算拼音匹配的得分
 * @param {string} word 原始词
 * @param {string} query 拼音查询
 * @returns {number} 0-100 得分，0表示不匹配
 */
function scorePinyin(word, query) {
  if (!word || !query) return 0;
  const q = query.toLowerCase().trim();

  // 词组精确匹配最高分
  const pinyins = _W[word];
  if (pinyins) {
    for (const py of pinyins) {
      if (py === q) return 100;
      if (py.startsWith(q)) return 80;
    }
  }

  // 全拼包含
  const fullPinyin = getStringPinyin(word);
  if (fullPinyin === q) return 90;
  if (fullPinyin.startsWith(q)) return 70;
  if (fullPinyin.includes(q)) return 50;

  // 首字母匹配
  const initials = getInitials(word);
  if (initials === q) return 60;
  if (initials.startsWith(q)) return 40;
  if (initials.includes(q)) return 20;

  return 0;
}

module.exports = {
  getCharPinyin,
  getStringPinyin,
  getInitials,
  matchPinyin,
  scorePinyin
};
