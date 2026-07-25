/**
 * DNF 2026 夏日礼包数据 - 果味一整夏礼包
 *
 * 数据口径：严格对齐 docs/tools/《DNF-2026夏日礼包-果味一整夏礼包爆料内容统计.md》事实区。
 * 非图片直接确认的价格、手续费、寄售费率、抽奖结果，一律不提供默认值。
 */

const PACKAGE_INFO = {
  name: '果味一整夏礼包',
  year: 2026,
  saleStart: '2026年7月9日维护后',
  saleEnd: '2026年8月27日维护前',
  normalPrice: 27800,
  freshTicketPrice: 800,
  freshTicketPack10Price: 7500,
  multiBuySetsPerRound: 8,
  multiBuyRewardsPerRound: 16,
  multiBuyNormalRate: 0.9,
  multiBuySpecialRate: 0.1,
  multiBuyPityNormalCount: 4
}

const AUCTION_RECEIVE_RATES = {
  // 物品拍卖行手续费：无券5%，有券3%
  itemWithoutCoupon: 95,
  itemWithCoupon: 97,
  // 金币寄售手续费：无券5%，有券降至1%
  goldWithoutCoupon: 95,
  goldWithCoupon: 99
}

const CONSIGNMENT = {
  // 每个档位的代币券价格由用户填写，默认0
  tiers: [
    { name: '1亿', amountWan: 10000, defaultToken: 0 },
    { name: '5000万', amountWan: 5000, defaultToken: 0 },
    { name: '1000万', amountWan: 1000, defaultToken: 0 },
    { name: '500万', amountWan: 500, defaultToken: 0 },
    { name: '100万', amountWan: 100, defaultToken: 0 }
  ]
}

const DISCOUNTS = {
  sevenFold: { name: '7折券', discount: 0.7 },
  nineFold: { name: '9折券', discount: 0.9 }
}

// 保留 CONSIGNMENT_TIERS 作为向后兼容别名
const CONSIGNMENT_TIERS = CONSIGNMENT.tiers

const NORMAL_PACKAGE_ITEMS = [
  { id: 'costume_set', name: '果味一整夏装扮套装礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'title_box', name: '果味一整夏称号自选礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'pet_box', name: '果味一整夏宠物自选礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'pet_equip_box', name: '果味一整夏宠物装备自选礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'aura_box', name: '果味一整夏光环装扮自选礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'insignia_box', name: '果味一整夏纹章自选礼盒', quantity: 1, tradeType: '账号绑定' },
  { id: 'collection_bead_box', name: '果味一整夏收集箱宝珠自选礼盒', quantity: 1, tradeType: '可交易1次', isTradable: true },
  { id: 'sweet_ticket', name: '甜蜜果饮赏味券', quantity: 2, tradeType: '可交易1次', isTradable: true },
  { id: 'autumn_2026_9off', name: '2026金秋礼包9折优惠券', quantity: 1, tradeType: '账号绑定' },
  { id: 'party_invitation', name: '派对邀请函', quantity: 2, tradeType: '账号绑定' }
]

const FIXED_TRADABLE_ITEMS = NORMAL_PACKAGE_ITEMS
  .filter(item => item.isTradable)
  .map(item => ({
    id: item.id,
    name: item.name,
    perNormalPackage: item.quantity,
    defaultPrice: 0,
    source: '普通礼包固定产物',
    tradeType: item.tradeType
  }))

const MULTI_BUY_TRADABLE_ITEMS = [
  { name: '红12券', roundQuantity: 1 },
  { name: '红10券', roundQuantity: 2 },
  { name: '甜蜜果饮券', roundQuantity: 14 },
  { name: '神圣黄金增幅书', roundQuantity: 1 },
  { name: '300～500万曜星光', roundQuantity: 1 },
  { name: '玲珑黄绿', roundQuantity: 1 },
  { name: '透明天空套', roundQuantity: 1 },
  { name: '2026夏日装扮', roundQuantity: 1 },
  { name: '神器装扮1部位', roundQuantity: 1 },
  { name: '1～12期天空自选', roundQuantity: 1 }
].map((item, index) => ({
  id: `multi_${index + 1}`,
  name: item.name,
  roundQuantity: item.roundQuantity,
  defaultQuantity: 0,
  defaultPrice: 0,
  source: '多买多送',
  tradeType: '可交易'
}))

// 文档第10节确认：礼包硬币商店所有道具均为账号绑定，无可交易道具
// 以下为参考列表，不计入回血
const COIN_EXCHANGE_REFERENCE_ITEMS = [
  { id: 'coin_clone', name: '神器克隆皮肤/武器2选1', coinCost: 32 },
  { id: 'coin_red12', name: '红12券', coinCost: 48 },
  { id: 'coin_taichu', name: '太初星蕴跨界', coinCost: 40 },
  { id: 'coin_linglong', name: '玲珑黄绿自选', coinCost: 25 },
  { id: 'coin_bead_5in1', name: '称号等级/称号技攻/头肩等级/头肩技攻/左槽技攻附魔', coinCost: 15 },
  { id: 'coin_linglong2', name: '2个玲珑自选', coinCost: 20 },
  { id: 'coin_pet_red', name: '26新春红色宠物装备', coinCost: 10 },
  { id: 'coin_pet_enchant', name: '宠物附魔', coinCost: 10 },
  { id: 'coin_gold_book', name: '黄金书', coinCost: 5 },
  { id: 'coin_upgrade_box', name: '装备提升礼盒', coinCost: 1 },
  { id: 'coin_clone_upgrade', name: '梦幻克隆皮肤/武器升稀有克隆', coinCost: 8 },
  { id: 'coin_bg', name: '夏日选择角色背景', coinCost: 12 },
  { id: 'coin_hat', name: '夏日特别帽子', coinCost: 10 },
  { id: 'coin_weapon', name: '夏日武器装扮', coinCost: 12 },
  { id: 'coin_innerwear', name: '内衣套', coinCost: 16 },
  { id: 'coin_beast_innerwear', name: '野兽内衣套', coinCost: 15 },
  { id: 'coin_awaken1', name: '一觉插图', coinCost: 15 },
  { id: 'coin_awaken2', name: '二觉插图', coinCost: 20 },
  { id: 'coin_font', name: '夏日伤害字体', coinCost: 5 },
  { id: 'coin_info_bg', name: '夏日个人信息背景', coinCost: 8 }
]

// 文档第9.4节：派对邀请函可1:1兑换甜蜜果饮赏味券（可交易1次）
// 文档第7.3节：甜蜜果饮点数商店可兑换+12装备增幅券（可交易1次，需35点）
// 以上两项为确定可获得的可交易产物
// 另提供3个空白自定义栏，供用户填写自抽或其他途径获得的可交易道具
const EXTRA_MANUAL_ITEMS = [
  { id: 'party_to_sweet_ticket', name: '派对邀请函兑换甜蜜果饮赏味券', defaultQuantity: 0, defaultPrice: 0, source: '派对纪念币兑换商店', tradeType: '可交易1次' },
  { id: 'sweet_point_plus12', name: '+12装备增幅券［果味一整夏］', defaultQuantity: 0, defaultPrice: 0, source: '甜蜜果饮点数商店', tradeType: '可交易1次' },
  { id: 'custom_1', name: '自定义可交易道具1', defaultQuantity: 0, defaultPrice: 0, source: '自定义', tradeType: '按用户填写' },
  { id: 'custom_2', name: '自定义可交易道具2', defaultQuantity: 0, defaultPrice: 0, source: '自定义', tradeType: '按用户填写' },
  { id: 'custom_3', name: '自定义可交易道具3', defaultQuantity: 0, defaultPrice: 0, source: '自定义', tradeType: '按用户填写' }
]

// 文档第7.2节：甜蜜果饮赏味券自抽奖池中的可交易道具（概率获得，与卖券互斥）
// 以下为参考列表，不计入回血，用户自抽获得后可手动填入上方自定义栏
const SWEET_TICKET_LOTTERY_REFERENCE_ITEMS = [
  { id: 'sweet_clone_skin', name: '神器克隆皮肤装扮礼盒', probability: '0.15%' },
  { id: 'sweet_clone_weapon', name: '神器克隆武器装扮礼盒', probability: '0.2%' },
  { id: 'sweet_hidden_box', name: '果味一整夏特别礼盒[隐藏款]', probability: '0.45%' },
  { id: 'sweet_plus13', name: '+13装备强化券', probability: '0.5%' },
  { id: 'sweet_plus12_enchant', name: '+12装备强化券', probability: '1.5%' },
  { id: 'sweet_plus11_amp', name: '+11装备增幅券', probability: '0.7%' },
  { id: 'sweet_plus10_amp', name: '+10装备增幅券', probability: '3%' },
  { id: 'sweet_linglong4', name: '玲珑的徽章自选礼盒×4', probability: '3.5%' },
  { id: 'sweet_linglong2', name: '玲珑的徽章自选礼盒×2', probability: '3%' },
  { id: 'sweet_dream_platinum', name: '梦想白金徽章自选礼盒', probability: '3%' },
  { id: 'sweet_amp_protect', name: '装备增幅保护券×2', probability: '4%' },
  { id: 'sweet_ancient_book', name: '远古的黄金增幅书', probability: '4%' },
  { id: 'sweet_pure_book', name: '纯净的黄金增幅书', probability: '6%' }
]

module.exports = {
  PACKAGE_INFO,
  AUCTION_RECEIVE_RATES,
  CONSIGNMENT,
  DISCOUNTS,
  CONSIGNMENT_TIERS,
  NORMAL_PACKAGE_ITEMS,
  FIXED_TRADABLE_ITEMS,
  MULTI_BUY_TRADABLE_ITEMS,
  COIN_EXCHANGE_REFERENCE_ITEMS,
  EXTRA_MANUAL_ITEMS,
  SWEET_TICKET_LOTTERY_REFERENCE_ITEMS
}