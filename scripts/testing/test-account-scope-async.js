#!/usr/bin/env node
'use strict'

const assert = require('assert')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const fromRoot = relativePath => path.join(ROOT, relativePath)

function clearModule(filePath) {
  delete require.cache[require.resolve(filePath)]
}

async function main() {
  const storage = {
    'account_snapshot:user-b': {
      user_preferences: {
        tea: { value: 22 }
      },
      notification_settings: {
        pushEnabled: false,
        notificationTypes: { daily: false }
      },
      study_progress: {
        b_question: { status: 'learning', updatedAt: 200 }
      },
      study_wrong_book: ['b_question'],
      browse_history: [{
        domain: 'film',
        refId: 'b_history',
        name: 'B 的历史',
        date: '2026-07-28'
      }],
      fengya_collections: [{
        target_domain: 'film',
        target_ref_id: 'film_001'
      }]
    }
  }
  const pending = []

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
    cloud: {
      callFunction(options) {
        pending.push(options)
      }
    }
  }

  const modulePaths = [
    'miniapp/utils/account-scope.js',
    'miniapp/services/preferences.js',
    'miniapp/services/notification-settings.js',
    'miniapp/utils/study-progress.js',
    'miniapp/services/history.js',
    'miniapp/services/collection.js',
    'miniapp/store/index.js'
  ].map(fromRoot)
  modulePaths.forEach(clearModule)

  const accountScope = require(fromRoot('miniapp/utils/account-scope.js'))
  const preferences = require(fromRoot('miniapp/services/preferences.js'))
  const notifications = require(fromRoot('miniapp/services/notification-settings.js'))
  const studyProgress = require(fromRoot('miniapp/utils/study-progress.js'))
  const history = require(fromRoot('miniapp/services/history.js'))
  const collection = require(fromRoot('miniapp/services/collection.js'))

  accountScope.activateUserScope('user-a')
  const operations = [
    preferences.syncFromCloud(),
    notifications.syncFromCloud(),
    studyProgress.syncFromCloud(),
    history.getHistoryList(),
    collection.getGroups('all')
  ]
  assert.strictEqual(pending.length, 5)

  accountScope.suspendUserScope('user-a')
  accountScope.activateUserScope('user-b')

  const resultsByName = {
    preferences: {
      code: 0,
      has_data: true,
      preferences: { tea: { value: 99 } }
    },
    notificationSettings: {
      code: 0,
      has_data: true,
      settings: { pushEnabled: true, notificationTypes: { daily: true } }
    },
    studyProgress: {
      code: 0,
      has_data: true,
      progress: { a_question: { status: 'mastered', updatedAt: 999 } },
      wrong_book: ['a_question']
    },
    history: {
      code: 0,
      list: [{
        domain: 'tea',
        ref_id: 'a_history',
        name: 'A 的历史',
        visited_at: '2026-07-28T00:00:00.000Z'
      }]
    },
    collection: {
      code: 0,
      list: [{
        id: 'a_collection',
        target_domain: 'tea',
        target_ref_id: 'tea_001'
      }]
    }
  }
  pending.forEach(call => {
    call.success({ result: resultsByName[call.name] })
  })
  await Promise.all(operations)

  assert.strictEqual(storage.user_preferences.tea.value, 22)
  assert.strictEqual(storage.notification_settings.pushEnabled, false)
  assert.deepStrictEqual(
    Object.keys(storage.study_progress),
    ['b_question']
  )
  assert.deepStrictEqual(storage.study_wrong_book, ['b_question'])
  assert.strictEqual(storage.browse_history[0].refId, 'b_history')
  assert.strictEqual(
    storage.fengya_collections[0].target_ref_id,
    'film_001'
  )

  console.log('Account-scope async regression tests: 5 flows passed')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
