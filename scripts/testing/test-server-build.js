#!/usr/bin/env node
'use strict'

/**
 * 验证远端云函数的 server_build 标识
 * 需要在真机或微信开发者工具中运行，此处仅打印检查指引
 */

console.log('=== server_build 验证指引 ===')
console.log('')
console.log('请在微信开发者工具控制台或真机中执行以下代码：')
console.log('')
console.log(`wx.cloud.callFunction({
  name: 'ugc',
  data: { action: 'getMyPosts', page: 1, pageSize: 1 }
}).then(res => {
  console.log('server_build:', res.result.server_build);
  console.log('Expected: ugc-20260728-p0-4');
});`)
console.log('')
console.log('或者在 IDE 云函数测试面板中：')
console.log('  - 选择 ugc 云函数')
console.log('  - 测试参数: {"action":"getMyPosts","page":1,"pageSize":1}')
console.log('  - 查看返回结果中的 server_build 字段')
console.log('')
console.log('预期结果: server_build 应为 "ugc-20260728-p0-4"')
console.log('')
console.log('若 server_build 不匹配，说明部署的版本不是最新提交。')
