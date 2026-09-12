const fs = require('fs');
const path = require('path');

const rootDir = require('path').resolve(__dirname, '../..');
const srcBaseDir = path.join(rootDir, '小程序图片');
const destBaseDir = path.join(rootDir, 'miniapp/assets/images');
const dataStorePath = path.join(rootDir, 'miniapp/utils/data-store.js');

console.log('=== 开始执行休闲模块缺失图片自动补充脚本 ===\n');

if (!fs.existsSync(srcBaseDir)) {
  console.error(`❌ 错误: 未能找到源图片文件夹 ${srcBaseDir}`);
  process.exit(1);
}

if (!fs.existsSync(dataStorePath)) {
  console.error(`❌ 错误: 未能找到数据源文件 ${dataStorePath}`);
  process.exit(1);
}

// 递归创建目录
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 读取 data-store 内容
let dataStoreContent = fs.readFileSync(dataStorePath, 'utf8');

const categories = ['tea', 'film', 'incense', 'music', 'wellness'];
let totalCopied = 0;
let totalUpdated = 0;

for (const cat of categories) {
  const srcCatDir = path.join(srcBaseDir, cat);
  const destCatDir = path.join(destBaseDir, cat);

  if (!fs.existsSync(srcCatDir)) {
    console.log(`⚠️ 提示: 未在源文件夹中找到类型目录: ${cat}`);
    continue;
  }

  ensureDir(destCatDir);

  const files = fs.readdirSync(srcCatDir).filter(f => !f.startsWith('.'));
  console.log(`\n正在处理类型 [${cat}]，共发现 ${files.length} 张图片...`);

  for (const file of files) {
    const srcFilePath = path.join(srcCatDir, file);
    const stat = fs.statSync(srcFilePath);

    if (stat.isDirectory()) continue;

    // 解析编号与清理后的文件名
    // 例如 003-huangshan-maofeng.png -> 编号 003，干净文件名 huangshan-maofeng.png
    const dashIndex = file.indexOf('-');
    if (dashIndex === -1) {
      console.log(`  - 忽略格式不合规文件: ${file}`);
      continue;
    }

    const numStr = file.substring(0, dashIndex).trim();
    const cleanName = file.substring(dashIndex + 1).trim();
    
    // 构建标准的 ID，例如 tea_003
    const id = `${cat}_${numStr}`;
    const destFilePath = path.join(destCatDir, cleanName);
    const relativeWebPath = `/assets/images/${cat}/${cleanName}`;

    // 1. 复制图片到小程序资源目录
    try {
      fs.copyFileSync(srcFilePath, destFilePath);
      totalCopied++;
      console.log(`  - 已复制并重命名: ${file} -> miniapp/assets/images/${cat}/${cleanName}`);
    } catch (err) {
      console.error(`  - ❌ 复制文件失败 ${file}:`, err.message);
      continue;
    }

    // 2. 更新 data-store.js 中的 coverImage 路径
    const idMarker = `"id": "${id}"`;
    const idIndex = dataStoreContent.indexOf(idMarker);

    if (idIndex === -1) {
      console.warn(`  - ⚠️ 未在 data-store.js 中找到 ID 为 [${id}] 的数据项，跳过路径更新。`);
      continue;
    }

    // 从 ID 标记处往后寻找下一个 coverImage 关键字
    const coverImageKeyword = '"coverImage":';
    const coverImageIndex = dataStoreContent.indexOf(coverImageKeyword, idIndex);

    if (coverImageIndex === -1) {
      console.warn(`  - ⚠️ 找到 ID [${id}] 但未在其后发现 coverImage 字段`);
      continue;
    }

    // 限制在当前对象范围内寻找，如果在 coverImage 之前出现了另一个 "id": 则说明当前项确实没有 coverImage 属性
    const nextIdIndex = dataStoreContent.indexOf('"id":', idIndex + idMarker.length);
    if (nextIdIndex !== -1 && coverImageIndex > nextIdIndex) {
      console.warn(`  - ⚠️ 找到 ID [${id}] 但其对应的 coverImage 字段可能缺失或越界`);
      continue;
    }

    // 寻找引号并替换
    const startQuote = dataStoreContent.indexOf('"', coverImageIndex + coverImageKeyword.length);
    const endQuote = dataStoreContent.indexOf('"', startQuote + 1);

    if (startQuote === -1 || endQuote === -1) {
      console.warn(`  - ⚠️ 路径引号解析失败 ID [${id}]`);
      continue;
    }

    const oldPath = dataStoreContent.substring(startQuote + 1, endQuote);
    const prefix = dataStoreContent.substring(0, startQuote + 1);
    const suffix = dataStoreContent.substring(endQuote);

    dataStoreContent = prefix + relativeWebPath + suffix;
    totalUpdated++;
    console.log(`  - 已更新数据路径: [${id}] -> ${relativeWebPath}`);
  }
}

// 写回数据源文件
try {
  fs.writeFileSync(dataStorePath, dataStoreContent, 'utf8');
  console.log(`\n🎉 数据源路径更新完毕！已成功修改 ${totalUpdated} 处图片配置。`);
} catch (err) {
  console.error(`\n❌ 写入 data-store.js 失败:`, err.message);
}

console.log(`\n=== 任务完成：成功移动 ${totalCopied} 张图片，并同步更新数据配置！ ===`);
