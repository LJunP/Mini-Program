// subpackages/tools/pages/gold-purchase/calculator.js
// 收币采购成本估算器
// 通用工具：估算通过收购金币→寄售换代币券→购买礼包的实际人民币花费

// 金币寄售档位（万金币），从大到小贪心拆分
// 每个档位的代币券价格由用户填写，随市场波动
const CONSIGNMENT_TIERS = [
  { name: '1亿', amountWan: 10000 },
  { name: '5000万', amountWan: 5000 },
  { name: '1000万', amountWan: 1000 },
  { name: '500万', amountWan: 500 },
  { name: '100万', amountWan: 100 }
]

// 金币寄售实收率：无券95%，有券99%（手续费5%→1%）
const CONSIGNMENT_RATES = {
  withoutCoupon: 95,
  withCoupon: 99
}

// 收币方式手续费（买家承担）
// 面对面交易：3%手续费（到手97%），不受拍卖行优惠券影响
// 拍卖行上架：无券5%（到手95%），有券3%（到手97%）
const ACQUISITION_METHODS = {
  faceToFace: {
    name: '面对面交易',
    receiveRateWithoutCoupon: 97,
    receiveRateWithCoupon: 97 // 面对面不受拍卖行优惠券影响
  },
  auction: {
    name: '拍卖行上架',
    receiveRateWithoutCoupon: 95,
    receiveRateWithCoupon: 97
  }
}

const toNumber = value => {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

const toInteger = value => Math.max(0, Math.floor(toNumber(value)))

const round2 = value => Math.round(value * 100) / 100

Page({
  data: {
    // 购买目标
    packagePrice: 27800,
    packageCount: 8,
    targetToken: 0, // 自动计算

    // 寄售参数
    hasAuctionCoupon: false,
    consignmentTiers: [], // [{ name, amountWan, token }]

    // 收币方式
    acquisitionMethod: 'faceToFace', // faceToFace | auction

    // 采购参数
    ownGold: 0, // 仓库已有金币（万）
    sellerRatioWan: 50, // 1元 = X万金币

    // 结果
    result: null,
    showResult: false
  },

  onLoad() {
    this._initTiers()
    this._updateTargetToken()
  },

  _initTiers() {
    this.setData({
      consignmentTiers: CONSIGNMENT_TIERS.map(tier => ({
        name: tier.name,
        amountWan: tier.amountWan,
        token: 0
      }))
    })
  },

  onPackagePriceChange(e) {
    this.setData({ packagePrice: toInteger(e.detail.value) }, () => this._updateTargetToken())
  },

  onPackageCountChange(e) {
    this.setData({ packageCount: toInteger(e.detail.value) }, () => this._updateTargetToken())
  },

  onAuctionCouponToggle(e) {
    this.setData({ hasAuctionCoupon: e.detail.value })
  },

  onConsignmentTierTokenChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`consignmentTiers[${index}].token`]: toNumber(e.detail.value) })
  },

  onAcquisitionMethodChange(e) {
    this.setData({ acquisitionMethod: e.currentTarget.dataset.method })
  },

  onOwnGoldChange(e) {
    this.setData({ ownGold: toNumber(e.detail.value) })
  },

  onSellerRatioChange(e) {
    this.setData({ sellerRatioWan: toNumber(e.detail.value) })
  },

  _updateTargetToken() {
    this.setData({
      targetToken: this.data.packagePrice * this.data.packageCount
    })
  },

  /**
   * 正向寄售计算：给定金币和档位价格，求代币券
   */
  _forwardConsignment(totalGoldWan, tiers, receiveRate) {
    let remaining = totalGoldWan
    let totalGrossToken = 0
    let totalNetToken = 0
    let totalFee = 0
    const breakdown = []

    tiers.forEach(tier => {
      const count = Math.floor(remaining / tier.amountWan)
      if (count <= 0 || tier.token <= 0) return
      const goldWan = tier.amountWan * count
      const grossToken = count * tier.token
      const fee = grossToken * ((100 - receiveRate) / 100)
      const netToken = grossToken - fee
      totalGrossToken += grossToken
      totalNetToken += netToken
      totalFee += fee
      remaining -= goldWan
      breakdown.push({
        tierName: tier.name,
        count,
        goldWan: round2(goldWan),
        tokenPerUnit: tier.token,
        grossToken: round2(grossToken),
        fee: round2(fee),
        netToken: round2(netToken)
      })
    })

    return {
      totalGrossToken: round2(totalGrossToken),
      totalNetToken: Math.floor(totalNetToken),
      totalFee: round2(totalFee),
      breakdown,
      remainingGoldWan: round2(remaining)
    }
  },

  /**
   * 反向寄售计算：给定目标代币券，求最小金币
   * 用最小有价格的档位作为步进单位逐步逼近
   */
  _reverseConsignment(targetToken, tiers, receiveRate) {
    // 找到最小有价格的档位作为步进
    const pricedTiers = tiers.filter(t => t.token > 0)
    if (pricedTiers.length === 0) {
      return { goldNeeded: 0, totalNetToken: 0, totalFee: 0, breakdown: [], remainingGoldWan: 0 }
    }

    const minTier = pricedTiers.reduce((min, t) => t.amountWan < min.amountWan ? t : min)
    const step = minTier.amountWan

    // 估算初始值：用最小档位的价格粗算
    const minTokenPerGold = minTier.token / minTier.amountWan
    let goldEstimate = Math.ceil(targetToken / (receiveRate / 100) / minTokenPerGold)
    // 对齐到步进
    goldEstimate = Math.ceil(goldEstimate / step) * step

    // 正向校验，不足则补步进
    let result = this._forwardConsignment(goldEstimate, tiers, receiveRate)
    let attempts = 0
    while (result.totalNetToken < targetToken && attempts < 200) {
      goldEstimate += step
      result = this._forwardConsignment(goldEstimate, tiers, receiveRate)
      attempts++
    }

    return { goldNeeded: goldEstimate, ...result }
  },

  calculate() {
    const {
      packagePrice,
      packageCount,
      hasAuctionCoupon,
      consignmentTiers,
      acquisitionMethod,
      ownGold,
      sellerRatioWan
    } = this.data

    const targetToken = packagePrice * packageCount

    if (targetToken <= 0) {
      wx.showToast({ title: '请输入有效的单价和数量', icon: 'none' })
      return
    }

    // 检查至少有一个档位有价格
    const hasAnyPrice = consignmentTiers.some(t => t.token > 0)
    if (!hasAnyPrice) {
      wx.showToast({ title: '请至少填写一个档位价格', icon: 'none' })
      return
    }

    // 1. 反向寄售：求需要多少金币寄售才能得到 targetToken 代币券
    const consignmentRate = hasAuctionCoupon
      ? CONSIGNMENT_RATES.withCoupon
      : CONSIGNMENT_RATES.withoutCoupon
    const reverseResult = this._reverseConsignment(targetToken, consignmentTiers, consignmentRate)

    // 2. 扣除已有金币
    const goldToConsign = reverseResult.goldNeeded
    const goldToAcquire = Math.max(0, goldToConsign - ownGold)

    // 3. 收币方式手续费
    const methodConfig = ACQUISITION_METHODS[acquisitionMethod]
    const acquireReceiveRate = hasAuctionCoupon
      ? methodConfig.receiveRateWithCoupon
      : methodConfig.receiveRateWithoutCoupon
    const acquireFeeRate = 100 - acquireReceiveRate
    // 买家需要购买的金币总量（含手续费损耗）
    const goldToBuy = goldToAcquire > 0
      ? goldToAcquire / (acquireReceiveRate / 100)
      : 0
    const acquisitionFee = goldToBuy - goldToAcquire

    // 4. 人民币花费
    const rmbCost = sellerRatioWan > 0 ? goldToBuy / sellerRatioWan : 0

    this.setData({
      result: {
        targetToken,
        goldToConsign: round2(goldToConsign),
        consignmentRate,
        consignmentFee: reverseResult.totalFee,
        actualToken: reverseResult.totalNetToken,
        ownGold: round2(ownGold),
        goldToAcquire: round2(goldToAcquire),
        acquisitionMethodName: methodConfig.name,
        acquireReceiveRate,
        acquireFeeRate,
        acquisitionFee: round2(acquisitionFee),
        goldToBuy: round2(goldToBuy),
        sellerRatioWan: round2(sellerRatioWan),
        rmbCost: round2(rmbCost),
        consignmentBreakdown: reverseResult.breakdown,
        remainingGoldWan: reverseResult.remainingGoldWan,
        hasAuctionCoupon
      },
      showResult: true
    })

    setTimeout(() => {
      wx.pageScrollTo({ selector: '.result-section', duration: 300 })
    }, 100)
  },

  resetCalc() {
    this._initTiers()
    this.setData({
      packagePrice: 27800,
      packageCount: 8,
      hasAuctionCoupon: false,
      acquisitionMethod: 'faceToFace',
      ownGold: 0,
      sellerRatioWan: 50,
      result: null,
        showResult: false
    }, () => this._updateTargetToken())
  },

  // 探索妙不可园
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // ====== 分享功能 ======

  onShareResult() {
    wx.showLoading({ title: '生成海报中…' });
    this._generatePoster();
  },

  _generatePoster() {
    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          wx.hideLoading();
          wx.showToast({ title: '海报生成失败', icon: 'none' });
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = (wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()).pixelRatio || 1;
        const width = 600;
        const height = 900;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const r = this.data.result;

        // 背景
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1a1a2e');
        bgGrad.addColorStop(0.5, '#16213e');
        bgGrad.addColorStop(1, '#0f3460');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 标题
        ctx.fillStyle = '#ffc857';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('收币采购成本估算', width / 2, 80);

        // 副标题
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '20px sans-serif';
        ctx.fillText('收购金币 → 寄售换代币券 → 购买礼包', width / 2, 115);

        // 分割线
        ctx.strokeStyle = 'rgba(255, 200, 87, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 145);
        ctx.lineTo(width - 60, 145);
        ctx.stroke();

        // 核心结果区
        let y = 195;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '22px sans-serif';
        ctx.fillText('人民币花费', width / 2, y);
        y += 50;
        ctx.fillStyle = '#ffc857';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText(r.rmbCost + ' 元', width / 2, y);

        // 详细数据
        y += 60;
        ctx.strokeStyle = 'rgba(255, 200, 87, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(width - 60, y);
        ctx.stroke();

        const rows = [
          { label: '目标代币券', value: r.targetToken + ' 代币券' },
          { label: '需购金币总量', value: r.goldToBuy + ' 万金币' },
          { label: '需寄售金币', value: r.goldToConsign + ' 万金币' },
          { label: '仓库已有金币', value: r.ownGold + ' 万金币' },
          { label: '收币方式', value: r.acquisitionMethodName },
          { label: '卖家售价', value: '1元 = ' + r.sellerRatioWan + '万金币' },
          { label: '拍卖行优惠券', value: r.hasAuctionCoupon ? '有' : '无' }
        ];

        y += 40;
        rows.forEach(row => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(row.label, 60, y);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(row.value, width - 60, y);
          y += 42;
        });

        // 底部品牌
        y = height - 80;
        ctx.fillStyle = 'rgba(255, 200, 87, 0.3)';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('※ 结果仅供参考，实际以游戏内为准', width / 2, y);
        y += 30;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '16px sans-serif';
        ctx.fillText('妙不可园 · DNF工具', width / 2, y);

        // 导出图片
        wx.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            wx.hideLoading();
            wx.previewImage({
              urls: [res.tempFilePath],
              current: res.tempFilePath
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '海报生成失败', icon: 'none' });
          }
        });
      });
  },

  onCopyResult() {
    const r = this.data.result;
    const text = [
      '【收币采购成本估算】',
      '━━━━━━━━━━━━━',
      '💰 人民币花费：' + r.rmbCost + ' 元',
      '🎯 目标代币券：' + r.targetToken,
      '📦 需购金币：' + r.goldToBuy + ' 万金币',
      '📤 需寄售金币：' + r.goldToConsign + ' 万金币',
      '🏠 仓库已有：' + r.ownGold + ' 万金币',
      '🔄 收币方式：' + r.acquisitionMethodName,
      '💵 售价比例：1元 = ' + r.sellerRatioWan + '万金币',
      '🎫 拍卖行优惠券：' + (r.hasAuctionCoupon ? '有' : '无'),
      '━━━━━━━━━━━━━',
      '※ 结果仅供参考，实际以游戏内为准'
    ].join('\n');

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  onShareAppMessage() {
    const r = this.data.result;
    return {
      title: r ? '收币采购成本：' + r.rmbCost + '元，快来算算你的花费' : 'DNF收币采购成本估算器',
      path: '/subpackages/tools/pages/gold-purchase/calculator'
    };
  }
})
