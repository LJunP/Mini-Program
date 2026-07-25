// scripts/ops/encrypt-study-db.js — 兼容现有云函数的 RC4 数据打包脚本
const fs = require('fs');
const path = require('path');

const SECRET_KEY = process.env.STUDY_DATA_KEY || '';
const workspaceDir = path.resolve(__dirname, '../..');

const srcJsonPath = path.join(workspaceDir, 'data/study_data.json');
const destEncPath = path.join(workspaceDir, 'data/study_data.enc');

console.log('=== 开始生成兼容现有云函数的数据包 ===');

// 1. RC4 字节流加解密算法
function rc4Bytes(key, buffer) {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  let j = 0;
  const keyLen = key.length;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % keyLen)) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
  }
  let i = 0;
  j = 0;
  const resBuffer = Buffer.alloc(buffer.length);
  for (let y = 0; y < buffer.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
    resBuffer[y] = buffer[y] ^ s[(s[i] + s[j]) % 256];
  }
  return resBuffer;
}

try {
  if (!SECRET_KEY) {
    console.error('❌ 缺少 STUDY_DATA_KEY 环境变量。密钥不得写入代码或文档。');
    process.exit(1);
  }

  if (!fs.existsSync(srcJsonPath)) {
    console.error(`❌ 未找到全量 JSON 数据文件: ${srcJsonPath}\n请先运行 node scripts/data-generation/build-cloud-json.js 导出全量题库数据！`);
    process.exit(1);
  }

  // 读取 JSON 原始 UTF-8 字节
  console.log(`- 正在读取 JSON 原始文件 (大小: ${(fs.statSync(srcJsonPath).size / 1024 / 1024).toFixed(2)} MB)...`);
  const rawData = fs.readFileSync(srcJsonPath);

  // 兼容既有云函数的 RC4 字节流处理。
  // RC4 仅用于兼容当前数据格式，不应作为强加密或访问控制边界。
  console.log('- 正在生成 RC4 兼容数据...');
  const encryptedBuffer = rc4Bytes(SECRET_KEY, rawData);

  // Base64 用于避免传输中的字符集损坏；它会增加体积，不提供加密强度。
  console.log('- 正在生成 Base64 传输编码...');
  const base64String = encryptedBuffer.toString('base64');

  // 写入外部 .enc 加密文件
  console.log(`- 正在写入文件: ${destEncPath}...`);
  fs.writeFileSync(destEncPath, base64String, 'utf8');

  console.log(`\n✅ 兼容数据包生成成功。`);
  console.log(`👉 密文文件路径: ${destEncPath}`);
  console.log(`⚠️ RC4 数据包不是安全边界；访问控制仍应由云端权限负责。`);
  console.log(`💡 操作：请将此 study_data.enc 连同 images 上传到你的免费公共云存储中作为热更新资源。`);

} catch (e) {
  console.error('❌ 加密打包过程中出错:', e);
}
