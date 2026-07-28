#!/usr/bin/env node
'use strict'

const assert = require('assert')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const fromRoot = relativePath => path.join(ROOT, relativePath)
const flush = () => new Promise(resolve => setImmediate(resolve))

async function main() {
  const storage = {
    'account_snapshot:user-b': {
      user_points: 5,
      points_log: []
    }
  }
  const pendingCloud = []
  let pageDefinition = null

  global.getCurrentPages = () => []
  global.Page = definition => {
    pageDefinition = definition
  }
  global.wx = {
    getStorageInfoSync() {
      return { keys: Object.keys(storage) }
    },
    getStorageSync(key) {
      return storage[key]
    },
    setStorageSync(key, value) {
      storage[key] = value
    },
    removeStorageSync(key) {
      delete storage[key]
    },
    showToast() {},
    cloud: {
      callFunction(options) {
        return new Promise((resolve, reject) => {
          pendingCloud.push({ options, resolve, reject })
        })
      }
    }
  }

  const accountScopePath = fromRoot('miniapp/utils/account-scope.js')
  const indexPath = fromRoot('miniapp/pages/index/index.js')
  delete require.cache[require.resolve(accountScopePath)]
  delete require.cache[require.resolve(indexPath)]
  const accountScope = require(accountScopePath)
  accountScope.activateUserScope('user-a')
  require(indexPath)
  assert(pageDefinition)

  const page = {
    ...pageDefinition,
    data: JSON.parse(JSON.stringify(pageDefinition.data)),
    setData(patch) {
      Object.assign(this.data, patch)
    }
  }

  page.onCheckinTap()
  assert.strictEqual(pendingCloud.length, 1)
  accountScope.suspendUserScope('user-a')
  accountScope.activateUserScope('user-b')
  pendingCloud.shift().resolve({
    result: {
      code: 0,
      signedToday: true,
      alreadySigned: false,
      signDays: 1
    }
  })
  await flush()
  await flush()
  assert.strictEqual(storage.user_points, 5, 'A 的延迟签到回包不得给 B 加积分')
  assert.strictEqual(
    storage.daily_elegance_checkin,
    undefined,
    'A 的延迟签到回包不得写入 B 的打卡记录'
  )

  page.data.checkedToday = false
  page.onCheckinTap()
  assert.strictEqual(pendingCloud.length, 1)
  pendingCloud.shift().resolve({
    result: {
      code: 0,
      signedToday: true,
      alreadySigned: true,
      signDays: 3,
      records: []
    }
  })
  await flush()
  await flush()
  assert.strictEqual(storage.user_points, 5, '重复签到只能同步状态，不能重复加分')
  assert.strictEqual(storage.daily_elegance_checkin.length, 1)

  delete storage.daily_elegance_checkin
  page.data.checkedToday = false
  page.onCheckinTap()
  pendingCloud.shift().resolve({
    result: {
      code: 0,
      signedToday: true,
      alreadySigned: false,
      signDays: 1,
      records: []
    }
  })
  await flush()
  await flush()
  assert(storage.user_points > 5, '首次确认签到应增加签到及首次徽章积分')
  assert(
    storage.points_log.some(item => item.reason.includes('每日签到')),
    '首次确认签到应记录且只在云端确认后记录积分'
  )

  console.log('Index sign scope regression tests: 3 flows passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
