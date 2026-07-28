#!/usr/bin/env node
'use strict'

/**
 * 自动化故障路径测试：_uploadImages 部分上传失败时的孤儿文件回滚
 *
 * 测试覆盖：
 * 1. 全部上传成功 → 正常返回
 * 2. 部分上传失败、回滚删除全部成功 → 抛错，无 manifest 残留
 * 3. 部分上传失败、回滚删除部分失败 → 抛错，manifest 保存剩余 File ID
 * 4. 全部上传失败 → 抛错，不调用 deleteFile
 * 5. 原投稿已有图片不被删除
 * 6. cleanup manifest 账号隔离
 * 7. retryCleanupManifests 重试成功
 * 8. 源码检查：Promise.allSettled 替代 Promise.all
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const fromRoot = relativePath => path.join(ROOT, relativePath)
const flush = () => new Promise(resolve => setImmediate(resolve))

function clearModule(modulePath) {
  delete require.cache[require.resolve(modulePath)]
}

async function main() {
  // ---- 源码检查：contribute.js 必须使用 Promise.allSettled ----
  const contributeSource = fs.readFileSync(
    fromRoot('miniapp/pages/contribute/contribute.js'),
    'utf8'
  )
  assert(
    contributeSource.includes('Promise.allSettled(uploadPromises)'),
    '_uploadImages 必须使用 Promise.allSettled'
  )
  assert(
    !contributeSource.includes('Promise.all(uploadPromises)'),
    '_uploadImages 不得再使用 Promise.all'
  )
  assert(
    contributeSource.includes('saveCleanupManifest'),
    '_uploadImages 必须在清理不完整时保存 cleanup manifest'
  )
  assert(
    contributeSource.includes('deleteCloudFilesConfirmed'),
    '_uploadImages 必须使用逐项确认的 deleteCloudFilesConfirmed'
  )

  // ---- 源码检查：ugc.js 导出 cleanup manifest API ----
  const ugcSource = fs.readFileSync(
    fromRoot('miniapp/utils/ugc.js'),
    'utf8'
  )
  assert(ugcSource.includes('CLEANUP_MANIFESTS_PREFIX'), 'ugc.js 必须定义 cleanup manifest 前缀')
  assert(ugcSource.includes('function saveCleanupManifest'), 'ugc.js 必须导出 saveCleanupManifest')
  assert(ugcSource.includes('function retryCleanupManifests'), 'ugc.js 必须导出 retryCleanupManifests')
  assert(ugcSource.includes('function getCleanupManifests'), 'ugc.js 必须导出 getCleanupManifests')

  // ---- 测试 1：全部上传成功 ----
  await testAllUploadsSucceed()

  // ---- 测试 2：部分上传失败，回滚全部成功 ----
  await testPartialUploadFailureAllRollbackSucceed()

  // ---- 测试 3：部分上传失败，回滚部分失败 ----
  await testPartialUploadFailurePartialRollbackFail()

  // ---- 测试 4：全部上传失败 ----
  await testAllUploadsFail()

  // ---- 测试 5：原投稿已有图片不被删除 ----
  await testExistingImagesNotDeleted()

  // ---- 测试 6：cleanup manifest 账号隔离 ----
  await testCleanupManifestAccountScoped()

  // ---- 测试 7：retryCleanupManifests 重试成功 ----
  await testRetryCleanupManifests()

  console.log('Upload cleanup tests: 7 groups passed')
}

/**
 * 设置 mock 环境并返回 page 对象和辅助工具
 */
function setupMockEnv(options) {
  const storage = {
    user_info: { id: 'user-1', nickname: '测试用户' },
    cloud_login_token: 'token',
    ...options.initialStorage
  }

  const deletedFiles = []
  const uploadedFiles = []
  const failUploadPaths = new Set(options.failUploadPaths || [])
  const failDeleteFileIds = new Set(options.failDeleteFileIds || [])

  let pageDefinition = null

  global.getCurrentPages = () => []
  global.Page = definition => {
    pageDefinition = definition
  }
  global.wx = {
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
    showModal() {},
    cloud: {
      uploadFile({ cloudPath, filePath, success, fail }) {
        uploadedFiles.push({ cloudPath, filePath })
        if (failUploadPaths.has(filePath)) {
          fail(new Error(`upload failed: ${filePath}`))
        } else {
          success({ fileID: `cloud://test-env/${cloudPath}` })
        }
      },
      deleteFile({ fileList, success, fail }) {
        fileList.forEach(f => deletedFiles.push(f))
        success({
          fileList: fileList.map(fileID => ({
            fileID,
            status: failDeleteFileIds.has(fileID) ? -1 : 0,
            errMsg: failDeleteFileIds.has(fileID) ? 'delete failed' : 'ok'
          }))
        })
      },
      callFunction({ data, success, fail }) {
        if (options.cloudResponder) {
          try {
            success({ result: options.cloudResponder(data) })
          } catch (err) {
            fail(err)
          }
        } else {
          fail(new Error('no cloud responder'))
        }
      }
    }
  }

  const accountScopePath = fromRoot('miniapp/utils/account-scope.js')
  const storePath = fromRoot('miniapp/store/index.js')
  const ugcPath = fromRoot('miniapp/utils/ugc.js')
  const authPath = fromRoot('miniapp/utils/auth.js')
  const contributePath = fromRoot('miniapp/pages/contribute/contribute.js')

  clearModule(accountScopePath)
  clearModule(storePath)
  clearModule(ugcPath)
  clearModule(authPath)
  clearModule(contributePath)

  const store = require(storePath)
  store.setState({ isLoggedIn: true })
  const ugc = require(ugcPath)
  ugc.activateUserScope('user-1', 'user-1')
  require(contributePath)

  assert(pageDefinition, 'contribute.js 必须注册 Page')

  const page = {
    ...pageDefinition,
    data: JSON.parse(JSON.stringify(pageDefinition.data)),
    setData(patch) {
      Object.assign(this.data, patch)
    }
  }

  return {
    page,
    ugc,
    storage,
    deletedFiles,
    uploadedFiles,
    flush
  }
}

async function testAllUploadsSucceed() {
  const { page, uploadedFiles } = setupMockEnv({})

  page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg']
  })

  const result = await page._uploadImages()

  assert.strictEqual(result.length, 2, '应返回 2 个云 File ID')
  assert(result[0].startsWith('cloud://'), '结果应包含云 File ID')
  assert(result[1].startsWith('cloud://'), '结果应包含云 File ID')
  assert.strictEqual(uploadedFiles.length, 2, '应上传 2 个文件')
}

async function testPartialUploadFailureAllRollbackSucceed() {
  const { page, deletedFiles, storage } = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img2.jpg'])
  })

  page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg', 'wxfile://tmp/img3.jpg']
  })

  let uploadError = null
  try {
    await page._uploadImages()
  } catch (err) {
    uploadError = err
  }

  assert(uploadError, '部分上传失败必须抛错')
  assert.strictEqual(uploadError.code, 'upload_partial_failed')
  assert.strictEqual(uploadError.failedCount, 1, '1 个上传失败')

  // img1 和 img3 上传成功，必须被回滚删除
  assert.strictEqual(deletedFiles.length, 2, '应回滚删除 2 个成功上传的文件')

  // 回滚全部成功，不应保存 manifest
  const manifests = storage['ugc_cleanup_manifests:user-1']
  assert(!manifests || manifests.length === 0, '回滚全部成功时不应保存 cleanup manifest')
}

async function testPartialUploadFailurePartialRollbackFail() {
  const { page, deletedFiles, storage } = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img2.jpg'])
  })

  // 设置一个 deleteFile 失败的 File ID
  // 先执行上传以获取实际 File ID，再设置失败
  page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg', 'wxfile://tmp/img3.jpg']
  })

  // 我们需要在 deleteFile 时让其中一个失败
  // 由于 File ID 是动态生成的，我们先获取上传后的 File ID
  // 但 _uploadImages 是一个原子操作，所以我们需要预先知道 File ID
  // 解决方案：在 mock 中使用可预测的 File ID

  // 重新设置环境，使用可预测的 File ID
  const env2 = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img2.jpg']),
    initialStorage: {},
    // 通过自定义 uploadFile 的 fileID 来控制
  })

  // 覆盖 uploadFile 以使用可预测的 File ID
  let uploadCounter = 0
  global.wx.cloud.uploadFile = function({ cloudPath, filePath, success, fail }) {
    uploadCounter++
    const fileID = `cloud://test-env/predictable_${uploadCounter}`
    if (filePath === 'wxfile://tmp/img2.jpg') {
      fail(new Error('upload failed'))
    } else {
      success({ fileID })
    }
  }

  // 设置 deleteFile 让 predictable_1 失败
  global.wx.cloud.deleteFile = function({ fileList, success }) {
    success({
      fileList: fileList.map(fileID => ({
        fileID,
        status: fileID === 'cloud://test-env/predictable_1' ? -1 : 0,
        errMsg: fileID === 'cloud://test-env/predictable_1' ? 'delete failed' : 'ok'
      }))
    })
  }

  const page2 = env2.page
  page2.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg', 'wxfile://tmp/img3.jpg']
  })

  let uploadError = null
  try {
    await page2._uploadImages()
  } catch (err) {
    uploadError = err
  }

  assert(uploadError, '部分上传失败必须抛错')
  assert.strictEqual(uploadError.code, 'upload_partial_failed')
  assert.strictEqual(uploadError.cleanupPending, true, '回滚不完整时 cleanupPending 必须为 true')
  assert(
    uploadError.cleanupFailedFileIds.includes('cloud://test-env/predictable_1'),
    '失败的 File ID 必须在 cleanupFailedFileIds 中'
  )

  // manifest 必须保存了失败的 File ID
  const manifests = env2.storage['ugc_cleanup_manifests:user-1']
  assert(manifests && manifests.length > 0, '回滚不完整时必须保存 cleanup manifest')
  const allManifestFileIds = manifests.flatMap(m => m.fileIds)
  assert(
    allManifestFileIds.includes('cloud://test-env/predictable_1'),
    'manifest 必须包含清理失败的 File ID'
  )
  assert(
    !allManifestFileIds.includes('cloud://test-env/predictable_3'),
    'manifest 不应包含已成功删除的 File ID'
  )
}

async function testAllUploadsFail() {
  const { page, deletedFiles } = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg'])
  })

  page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg']
  })

  let uploadError = null
  try {
    await page._uploadImages()
  } catch (err) {
    uploadError = err
  }

  assert(uploadError, '全部上传失败必须抛错')
  assert.strictEqual(uploadError.code, 'upload_all_failed')
  assert.strictEqual(deletedFiles.length, 0, '全部上传失败时不应调用 deleteFile')
}

async function testExistingImagesNotDeleted() {
  const { page, deletedFiles } = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/new2.jpg'])
  })

  // 模拟编辑模式：已有云图片 + 新选择图片
  page.setData({
    images: [
      'cloud://test-env/existing/old1.jpg',  // 原投稿已有
      'cloud://test-env/existing/old2.jpg',  // 原投稿已有
      'wxfile://tmp/new1.jpg',                // 新上传成功
      'wxfile://tmp/new2.jpg'                 // 新上传失败
    ]
  })

  let uploadError = null
  try {
    await page._uploadImages()
  } catch (err) {
    uploadError = err
  }

  assert(uploadError, '部分上传失败必须抛错')

  // 只应删除新上传成功的 new1，不删除已有的 old1、old2
  assert.strictEqual(deletedFiles.length, 1, '只应回滚 1 个新上传成功的文件')
  assert(
    deletedFiles[0].includes('new1') || !deletedFiles[0].includes('existing'),
    '不应删除原投稿已有图片'
  )
  assert(
    !deletedFiles.some(f => f.includes('existing')),
    '原投稿已有图片绝不能被删除'
  )
}

async function testCleanupManifestAccountScoped() {
  // 账号 1 保存 manifest
  const env1 = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img2.jpg'])
  })

  let uploadCounter = 0
  global.wx.cloud.uploadFile = function({ cloudPath, filePath, success, fail }) {
    uploadCounter++
    const fileID = `cloud://test-env/scope_test_${uploadCounter}`
    if (filePath === 'wxfile://tmp/img2.jpg') {
      fail(new Error('upload failed'))
    } else {
      success({ fileID })
    }
  }

  // 让所有 deleteFile 都失败
  global.wx.cloud.deleteFile = function({ fileList, success }) {
    success({
      fileList: fileList.map(fileID => ({
        fileID,
        status: -1,
        errMsg: 'delete failed'
      }))
    })
  }

  env1.page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg']
  })

  try {
    await env1.page._uploadImages()
  } catch (err) {
    // expected
  }

  const manifestsUser1 = env1.storage['ugc_cleanup_manifests:user-1']
  assert(manifestsUser1 && manifestsUser1.length > 0, '账号 1 应有 cleanup manifest')

  // 切换到账号 2，manifest 不应串号
  env1.ugc.deactivateUserScope()
  env1.ugc.activateUserScope('user-2', 'user-2')

  const manifestsUser2 = env1.ugc.getCleanupManifests()
  assert.strictEqual(manifestsUser2.length, 0, '账号 2 不应有账号 1 的 cleanup manifest')
}

async function testRetryCleanupManifests() {
  const env = setupMockEnv({
    failUploadPaths: new Set(['wxfile://tmp/img2.jpg'])
  })

  let uploadCounter = 0
  global.wx.cloud.uploadFile = function({ cloudPath, filePath, success, fail }) {
    uploadCounter++
    const fileID = `cloud://test-env/retry_test_${uploadCounter}`
    if (filePath === 'wxfile://tmp/img2.jpg') {
      fail(new Error('upload failed'))
    } else {
      success({ fileID })
    }
  }

  // 第一次 deleteFile 全部失败
  let deleteShouldFail = true
  global.wx.cloud.deleteFile = function({ fileList, success }) {
    success({
      fileList: fileList.map(fileID => ({
        fileID,
        status: deleteShouldFail ? -1 : 0,
        errMsg: deleteShouldFail ? 'delete failed' : 'ok'
      }))
    })
  }

  env.page.setData({
    images: ['wxfile://tmp/img1.jpg', 'wxfile://tmp/img2.jpg']
  })

  try {
    await env.page._uploadImages()
  } catch (err) {
    // expected
  }

  let manifests = env.ugc.getCleanupManifests()
  assert(manifests.length > 0, '应有待重试的 manifest')
  const fileIdsBeforeRetry = manifests.flatMap(m => m.fileIds)
  assert(fileIdsBeforeRetry.length > 0, 'manifest 应有待清理 File ID')

  // 重试时让 deleteFile 成功
  deleteShouldFail = false
  const retryResult = await env.ugc.retryCleanupManifests()

  assert.strictEqual(retryResult.cleared, manifests.length, '应清理完成的 manifest 数量')
  assert.strictEqual(retryResult.remaining, 0, '不应有残留')

  // 重试后 manifest 应被清除
  manifests = env.ugc.getCleanupManifests()
  assert.strictEqual(manifests.length, 0, '重试成功后 manifest 应被清除')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
