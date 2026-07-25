// subpackages/tools/pages/dnf-summer-2026/calculator.js
// DNF 2026 夏日礼包回血计算器

const pkgData = require('../../../../data/dnf/summer-package-2026.js')

const toNumber = value => {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

const toInteger = value => Math.max(0, Math.floor(toNumber(value)))

const round2 = value => Math.round(value * 100) / 100

const buildPricedItems = (items, selected = true) => items.map(item => ({
  ...item,
  quantity: item.defaultQuantity || 0,
  price: item.defaultPrice || 0,
  selected,
  totalGold: 0
}))

Page({
  data: {
    packageName: pkgData.PACKAGE_INFO.name,
    normalPrice: pkgData.PACKAGE_INFO.normalPrice,
    multiBuySetsPerRound: pkgData.PACKAGE_INFO.multiBuySetsPerRound,
    multiBuyRewardsPerRound: pkgData.PACKAGE_INFO.multiBuyRewardsPerRound,

    normalPackageCount: 8,
    sevenFoldCount: 0,
    nineFoldCount: 0,

    hasAuctionCoupon: false,
    itemReceiveRateWithoutCoupon: pkgData.AUCTION_RECEIVE_RATES.itemWithoutCoupon,
    itemReceiveRateWithCoupon: pkgData.AUCTION_RECEIVE_RATES.itemWithCoupon,
    goldReceiveRateWithoutCoupon: pkgData.AUCTION_RECEIVE_RATES.goldWithoutCoupon,
    goldReceiveRateWithCoupon: pkgData.AUCTION_RECEIVE_RATES.goldWithCoupon,
    ownGold: 0,
    consignmentTiers: [],

    multiBuyMode: 'round',
    fixedTradableItems: [],
    multiBuyRoundItems: [],
    multiBuyManualItems: [],
    coinExchangeItems: pkgData.COIN_EXCHANGE_REFERENCE_ITEMS,
    sweetTicketLotteryItems: pkgData.SWEET_TICKET_LOTTERY_REFERENCE_ITEMS,
    extraManualItems: [],
    normalPackageItems: pkgData.NORMAL_PACKAGE_ITEMS,

    result: null,
    showResult: false,

    expandedSections: {
      basic: true,
      fees: true,
      consignment: false,
      fixed: true,
      multibuy: true,
      coin: false,
      sweet: false,
      extra: false,
      result: true
    }
  },

  onLoad() {
    this._initItems()
  },

  _initItems() {
    this.setData({
      fixedTradableItems: buildPricedItems(pkgData.FIXED_TRADABLE_ITEMS, true),
      multiBuyRoundItems: buildPricedItems(pkgData.MULTI_BUY_TRADABLE_ITEMS, true),
      multiBuyManualItems: buildPricedItems(pkgData.MULTI_BUY_TRADABLE_ITEMS, false),
      extraManualItems: buildPricedItems(pkgData.EXTRA_MANUAL_ITEMS, false),
      consignmentTiers: pkgData.CONSIGNMENT.tiers.map(tier => ({
        name: tier.name,
        amountWan: tier.amountWan,
        token: tier.defaultToken || 0
      }))
    })
  },

  onNormalPackageCountChange(e) {
    this.setData({ normalPackageCount: toInteger(e.detail.value) })
  },

  onSevenFoldCountChange(e) {
    this.setData({ sevenFoldCount: toInteger(e.detail.value) })
  },

  onNineFoldCountChange(e) {
    this.setData({ nineFoldCount: toInteger(e.detail.value) })
  },

  onAuctionCouponToggle(e) {
    this.setData({ hasAuctionCoupon: e.detail.value })
  },

  onReceiveRateChange(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ [key]: toNumber(e.detail.value) })
  },

  onOwnGoldChange(e) {
    this.setData({ ownGold: toNumber(e.detail.value) })
  },

  onConsignmentTierTokenChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`consignmentTiers[${index}].token`]: toNumber(e.detail.value) })
  },

  onFixedItemPriceChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`fixedTradableItems[${index}].price`]: toNumber(e.detail.value) })
  },

  onFixedItemToggle(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`fixedTradableItems[${index}].selected`]: e.detail.value })
  },

  onMultiBuyModeChange(e) {
    this.setData({ multiBuyMode: e.currentTarget.dataset.mode })
  },

  onManualItemQuantityChange(e) {
    const { group, index } = e.currentTarget.dataset
    this.setData({ [`${group}[${index}].quantity`]: toNumber(e.detail.value) })
  },

  onManualItemPriceChange(e) {
    const { group, index } = e.currentTarget.dataset
    this.setData({ [`${group}[${index}].price`]: toNumber(e.detail.value) })
  },

  onManualItemToggle(e) {
    const { group, index } = e.currentTarget.dataset
    this.setData({ [`${group}[${index}].selected`]: e.detail.value })
  },

  toggleSection(e) {
    const { section } = e.currentTarget.dataset
    this.setData({ [`expandedSections.${section}`]: !this.data.expandedSections[section] })
  },

  calculate() {
    const {
      normalPackageCount,
      sevenFoldCount,
      nineFoldCount,
      hasAuctionCoupon,
      itemReceiveRateWithoutCoupon,
      itemReceiveRateWithCoupon,
      goldReceiveRateWithoutCoupon,
      goldReceiveRateWithCoupon,
      ownGold,
      consignmentTiers,
      multiBuyMode,
      fixedTradableItems,
      multiBuyRoundItems,
      multiBuyManualItems,
      extraManualItems
    } = this.data

    if (normalPackageCount <= 0) {
      wx.showToast({ title: '请输入礼包数量', icon: 'none' })
      return
    }

    const costResult = this._calcTotalCost({
      normalPackageCount,
      sevenFoldCount,
      nineFoldCount
    })

    if (!costResult.valid) {
      wx.showToast({ title: costResult.message, icon: 'none' })
      return
    }

    const itemDetails = []
    const fixedGold = this._sumFixedItems(fixedTradableItems, normalPackageCount, itemDetails)
    const fullRounds = Math.floor(normalPackageCount / pkgData.PACKAGE_INFO.multiBuySetsPerRound)
    const multiBuyGold = multiBuyMode === 'round'
      ? this._sumMultiBuyRounds(multiBuyRoundItems, fullRounds, itemDetails)
      : this._sumManualItems(multiBuyManualItems, '多买多送手动获得', itemDetails)
    const coinGold = 0 // 硬币商店全为账号绑定，不产生回血
    const extraGold = this._sumManualItems(extraManualItems, '手动补充', itemDetails)
    const recoveryGoldBeforeFee = fixedGold + multiBuyGold + coinGold + extraGold

    const itemReceiveRate = hasAuctionCoupon
      ? itemReceiveRateWithCoupon
      : itemReceiveRateWithoutCoupon
    const itemFeeRate = Math.max(0, 100 - itemReceiveRate)
    const itemFeeGold = recoveryGoldBeforeFee * (itemFeeRate / 100)
    const recoveryGoldAfterItemFee = recoveryGoldBeforeFee - itemFeeGold
    const totalGoldToSell = recoveryGoldAfterItemFee + ownGold
    const goldReceiveRate = hasAuctionCoupon
      ? goldReceiveRateWithCoupon
      : goldReceiveRateWithoutCoupon
    const goldFeeRate = Math.max(0, 100 - goldReceiveRate)
    const consignmentResult = this._calcConsignment(totalGoldToSell, consignmentTiers, goldReceiveRate)
    const recoveryToken = consignmentResult.totalToken
    const actualCost = costResult.totalCost - recoveryToken
    const recoveryRate = costResult.totalCost > 0 ? recoveryToken / costResult.totalCost * 100 : 0

    this.setData({
      result: {
        ...costResult,
        totalPackages: normalPackageCount,
        fullRounds,
        multiBuyMode,
        fixedGold: round2(fixedGold),
        multiBuyGold: round2(multiBuyGold),
        coinGold: round2(coinGold),
        extraGold: round2(extraGold),
        recoveryGoldBeforeFee: round2(recoveryGoldBeforeFee),
        hasAuctionCoupon,
        itemReceiveRate: round2(itemReceiveRate),
        itemFeeRate: round2(itemFeeRate),
        itemFeeGold: round2(itemFeeGold),
        recoveryGoldAfterItemFee: round2(recoveryGoldAfterItemFee),
        ownGold: round2(ownGold),
        totalGoldToSell: round2(totalGoldToSell),
        goldReceiveRate: round2(goldReceiveRate),
        goldFeeRate: round2(goldFeeRate),
        goldConsignmentFee: consignmentResult.totalFee,
        recoveryToken,
        actualCost,
        recoveryRate: recoveryRate.toFixed(2),
        itemDetails,
        consignmentBreakdown: consignmentResult.breakdown,
        remainingGoldWan: consignmentResult.remainingGoldWan,
        normalPackageItems: this._buildPackageSummary(pkgData.NORMAL_PACKAGE_ITEMS, normalPackageCount)
      },
      showResult: true
    })

    setTimeout(() => {
      wx.pageScrollTo({ selector: '.result-section', duration: 300 })
    }, 100)
  },

  _calcTotalCost({ normalPackageCount, sevenFoldCount, nineFoldCount }) {
    const normalPrice = pkgData.PACKAGE_INFO.normalPrice
    const totalPackages = normalPackageCount
    if (totalPackages <= 0) {
      return { valid: false, message: '请输入礼包数量' }
    }
    // 7折券是买一套后才送的，不能用于首套
    const maxSevenFold = Math.max(0, totalPackages - 1)
    if (sevenFoldCount > maxSevenFold) {
      return { valid: false, message: '7折券只能用于首购后的礼包' }
    }
    if (sevenFoldCount + nineFoldCount > totalPackages) {
      return { valid: false, message: '优惠券数量不能超过礼包总数' }
    }

    let remaining = normalPackageCount
    let remainingSeven = sevenFoldCount
    let remainingNine = nineFoldCount
    let totalCost = 0
    const costDetails = []

    const consume = (label, count, unitPrice) => {
      if (count <= 0) return
      const total = Math.round(count * unitPrice)
      totalCost += total
      costDetails.push({ label, count, unitPrice: Math.round(unitPrice), total })
    }

    // 首套：可用9折券（如果拥有），不可用7折券
    if (remaining > 0) {
      if (remainingNine > 0) {
        consume('首购9折券', 1, normalPrice * pkgData.DISCOUNTS.nineFold.discount)
        remainingNine -= 1
      } else {
        consume('首购原价', 1, normalPrice)
      }
      remaining -= 1
    }

    // 后续礼包：优先使用7折券（更划算），再9折券，最后原价
    const sevenUsed = Math.min(remainingSeven, remaining)
    consume('7折券', sevenUsed, normalPrice * pkgData.DISCOUNTS.sevenFold.discount)
    remaining -= sevenUsed

    const nineUsed = Math.min(remainingNine, remaining)
    consume('9折券', nineUsed, normalPrice * pkgData.DISCOUNTS.nineFold.discount)
    remaining -= nineUsed

    consume('普通礼包原价', remaining, normalPrice)

    return { valid: true, totalCost, costDetails }
  },

  _sumFixedItems(items, normalPackageCount, itemDetails) {
    return items.reduce((sum, item) => {
      if (!item.selected) return sum
      const quantity = item.perNormalPackage * normalPackageCount
      const totalGold = quantity * item.price
      if (quantity > 0) {
        itemDetails.push({
          name: item.name,
          source: item.source,
          quantity: round2(quantity),
          unitPrice: round2(item.price),
          totalGold: round2(totalGold)
        })
      }
      return sum + totalGold
    }, 0)
  },

  _sumMultiBuyRounds(items, fullRounds, itemDetails) {
    if (fullRounds <= 0) return 0
    return items.reduce((sum, item) => {
      if (!item.selected) return sum
      const quantity = item.roundQuantity * fullRounds
      const totalGold = quantity * item.price
      itemDetails.push({
        name: item.name,
        source: `多买多送整轮 ×${fullRounds}`,
        quantity: round2(quantity),
        unitPrice: round2(item.price),
        totalGold: round2(totalGold)
      })
      return sum + totalGold
    }, 0)
  },

  _sumManualItems(items, fallbackSource, itemDetails) {
    return items.reduce((sum, item) => {
      if (!item.selected || item.quantity <= 0) return sum
      const totalGold = item.quantity * item.price
      itemDetails.push({
        name: item.name,
        source: item.source || fallbackSource,
        quantity: round2(item.quantity),
        unitPrice: round2(item.price),
        totalGold: round2(totalGold)
      })
      return sum + totalGold
    }, 0)
  },

  _calcConsignment(totalGoldWan, tiers, goldReceiveRate) {
    let remainingGoldWan = totalGoldWan
    let totalToken = 0
    let totalFee = 0
    const breakdown = []

    // 没有任何档位有价格时，直接返回
    const hasAnyPrice = tiers.some(t => t.token > 0)
    if (!hasAnyPrice) {
      return {
        totalToken: 0,
        totalFee: 0,
        breakdown,
        remainingGoldWan: round2(remainingGoldWan)
      }
    }

    tiers.forEach(tier => {
      const count = Math.floor(remainingGoldWan / tier.amountWan)
      if (count <= 0 || tier.token <= 0) return
      const goldWan = tier.amountWan * count
      const grossToken = count * tier.token
      // 每笔寄售获得的代币券向上取整
      const netTokenPerUnit = Math.ceil(tier.token * goldReceiveRate / 100)
      const netToken = netTokenPerUnit * count
      const fee = grossToken - netToken
      totalToken += netToken
      totalFee += fee
      remainingGoldWan -= goldWan
      breakdown.push({
        tierName: tier.name,
        count,
        goldWan: round2(goldWan),
        tokenPerUnit: tier.token,
        grossToken: round2(grossToken),
        fee: round2(fee),
        netToken
      })
    })

    return {
      totalToken,
      totalFee: round2(totalFee),
      breakdown,
      remainingGoldWan: round2(remainingGoldWan)
    }
  },

  _buildPackageSummary(items, count) {
    if (count <= 0) return []
    return items.map(item => ({
      name: item.name,
      count: item.quantity * count,
      tradeType: item.tradeType
    }))
  },

  resetCalc() {
    this._initItems()
    this.setData({
      normalPackageCount: 8,
      sevenFoldCount: 0,
      nineFoldCount: 0,
      hasAuctionCoupon: false,
      itemReceiveRateWithoutCoupon: pkgData.AUCTION_RECEIVE_RATES.itemWithoutCoupon,
      itemReceiveRateWithCoupon: pkgData.AUCTION_RECEIVE_RATES.itemWithCoupon,
      goldReceiveRateWithoutCoupon: pkgData.AUCTION_RECEIVE_RATES.goldWithoutCoupon,
      goldReceiveRateWithCoupon: pkgData.AUCTION_RECEIVE_RATES.goldWithCoupon,
      ownGold: 0,
      consignmentTiers: pkgData.CONSIGNMENT.tiers.map(tier => ({
        name: tier.name,
        amountWan: tier.amountWan,
        token: tier.defaultToken || 0
      })),
      multiBuyMode: 'round',
      result: null,
      showResult: false
    })
  },

  // 分享回血结果
  onShareResult() {
    if (!this.data.result) {
      wx.showToast({ title: '请先计算回血', icon: 'none' })
      return
    }
    wx.showActionSheet({
      itemList: ['保存结果图到相册', '复制结果文字', '分享给好友'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this._generatePoster()
        } else if (res.tapIndex === 1) {
          this._copyResultText()
        } else if (res.tapIndex === 2) {
          // 触发系统分享
          wx.showShareMenu({ withShareTicket: true })
          wx.showToast({ title: '点击右上角分享', icon: 'none' })
        }
      }
    })
  },

  // 生成海报并保存
  _generatePoster() {
    wx.showLoading({ title: '生成中...' })
    const result = this.data.result
    const query = wx.createSelectorQuery()
    query.select('#dnfPosterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          wx.hideLoading()
          wx.showToast({ title: 'Canvas 初始化失败', icon: 'none' })
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getWindowInfo().pixelRatio
        const width = 600
        const height = 800

        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 背景
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
        bgGradient.addColorStop(0, '#1a1a2e')
        bgGradient.addColorStop(1, '#16213e')
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, width, height)

        // 顶部标题
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('DNF 2026夏日礼包', width / 2, 60)
        ctx.font = '24px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText('回血计算结果', width / 2, 95)

        // 分割线
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(40, 120)
        ctx.lineTo(width - 40, 120)
        ctx.stroke()

        // 核心数据卡片
        const cardY = 150
        const cardH = 120
        const cardW = (width - 80 - 24) / 2

        const drawDataCard = (x, y, w, h, label, value, unit, isHighlight) => {
          ctx.fillStyle = isHighlight ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.08)'
          ctx.beginPath()
          ctx.roundRect(x, y, w, h, 12)
          ctx.fill()
          ctx.strokeStyle = isHighlight ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255,255,255,0.1)'
          ctx.stroke()

          ctx.fillStyle = 'rgba(255,255,255,0.5)'
          ctx.font = '20px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(label, x + 16, y + 32)

          ctx.fillStyle = isHighlight ? '#2ecc71' : '#FFFFFF'
          ctx.font = 'bold 40px sans-serif'
          ctx.fillText(value, x + 16, y + 80)

          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '18px sans-serif'
          ctx.fillText(unit, x + 16, y + 105)
        }

        drawDataCard(40, cardY, cardW, cardH, '总花费', result.totalCost, '点券', false)
        drawDataCard(40 + cardW + 24, cardY, cardW, cardH, '回血代币券', result.recoveryToken, '代币券', true)
        drawDataCard(40, cardY + cardH + 16, cardW, cardH, '实际花费', result.actualCost, '点券', false)
        drawDataCard(40 + cardW + 24, cardY + cardH + 16, cardW, cardH, '回血率', result.recoveryRate + '%', '', false)

        // 中间流水区
        const flowY = cardY + cardH * 2 + 48
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '20px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('回血流水', 40, flowY)

        const flows = [
          ['礼包数量', result.totalPackages + ' 套'],
          ['固定产物金币', result.fixedGold + ' 万'],
          ['多买多送金币', result.multiBuyGold + ' 万'],
          ['拍卖行实收率', result.itemReceiveRate + '% / ' + result.goldReceiveRate + '%'],
          ['物品手续费', '-' + result.itemFeeGold + ' 万']
        ]

        flows.forEach((item, i) => {
          const y = flowY + 30 + i * 32
          ctx.fillStyle = 'rgba(255,255,255,0.5)'
          ctx.font = '18px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(item[0], 40, y)
          ctx.fillStyle = '#FFFFFF'
          ctx.textAlign = 'right'
          ctx.fillText(item[1], width - 40, y)
        })

        // 底部品牌
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
          ctx.fillText('妙不可园 · DNF 回血计算器', width / 2, height - 30)

        // 保存到相册
        wx.canvasToTempFilePath({
          canvas: canvas,
          x: 0,
          y: 0,
          width: width,
          height: height,
          destWidth: width * dpr,
          destHeight: height * dpr,
          success: (saveRes) => {
            wx.hideLoading()
            wx.saveImageToPhotosAlbum({
              filePath: saveRes.tempFilePath,
              success: () => {
                wx.showToast({ title: '已保存到相册', icon: 'success' })
              },
              fail: (err) => {
                if (err.errMsg.includes('auth deny')) {
                  wx.showModal({
                    title: '提示',
                    content: '需要相册权限才能保存图片，请授权后重试',
                    confirmText: '去设置',
                    success: (modalRes) => {
                      if (modalRes.confirm) wx.openSetting()
                    }
                  })
                } else {
                  wx.previewImage({ urls: [saveRes.tempFilePath] })
                }
              }
            })
          },
          fail: () => {
            wx.hideLoading()
            wx.showToast({ title: '生成失败', icon: 'none' })
          }
        })
      })
  },

  // 复制结果文字
  _copyResultText() {
    const r = this.data.result
    const text = `【DNF 2026夏日礼包回血计算】\n礼包数量：${r.totalPackages}套\n总花费：${r.totalCost}点券\n回血代币券：${r.recoveryToken}\n实际花费：${r.actualCost}点券\n回血率：${r.recoveryRate}%\n\n固定产物：${r.fixedGold}万金币\n多买多送：${r.multiBuyGold}万金币\n\n—— 妙不可园 DNF 回血计算器`

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制结果', icon: 'success' })
      }
    })
  },

  onShareAppMessage() {
    const r = this.data.result
    return {
      title: r ? `回血${r.recoveryToken}代币券，回血率${r.recoveryRate}%` : 'DNF 2026夏日礼包回血计算器',
      path: '/subpackages/tools/pages/dnf-summer-2026/calculator'
    }
  },

  // 探索妙不可园
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
})