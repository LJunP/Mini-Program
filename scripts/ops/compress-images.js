const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = '/Users/lijunpeng/Desktop/workbuddy_project';
const miniappImagesDir = path.join(rootDir, 'miniapp/assets/images');
const dataStorePath = path.join(rootDir, 'miniapp/utils/data-store.js');

console.log('=== 开始执行微信小程序全量大图高保真压缩优化工具 (sips 引擎) ===\n');

if (!fs.existsSync(miniappImagesDir)) {
  console.error(`❌ 错误: 未能找到图片目录 ${miniappImagesDir}`);
  process.exit(1);
}

// 目标子目录
const targetDirs = ['tea', 'film', 'incense', 'music', 'wellness', 'travel'];

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let fileCount = 0;
let pathReplacements = [];

// 读取 data-store 内容
let dataStoreContent = fs.readFileSync(dataStorePath, 'utf8');

targetDirs.forEach(subDir => {
  const dirPath = path.join(miniappImagesDir, subDir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => !f.startsWith('.'));
  console.log(`\n正在处理目录: assets/images/${subDir} ...`);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) return;

    // 过滤规则：跳过图标文件
    if (file.includes('icon') || file.includes('tab-')) {
      console.log(`  - 跳过图标文件: ${file}`);
      return;
    }

    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    const originalSize = stat.size;
    totalOriginalSize += originalSize;
    fileCount++;

    const baseName = path.basename(file, ext);
    const destFileName = `${baseName}.jpg`;
    const destFilePath = path.join(dirPath, destFileName);

    // 运行 sips 压缩命令
    // 限制宽度为 750px（Retina 屏幕下完美适配卡片），质量设为 70%（视觉无损）
    try {
      console.log(`  - 正在压缩: ${file} (${(originalSize / 1024).toFixed(1)} KB) -> ${destFileName}`);
      execSync(`sips -s format jpeg -s formatOptions 70 --resampleWidth 750 "${filePath}" --out "${destFilePath}"`, { stdio: 'ignore' });
      
      const compStat = fs.statSync(destFilePath);
      const compressedSize = compStat.size;
      totalCompressedSize += compressedSize;

      console.log(`    ↳ 压缩完成: ${(compressedSize / 1024).toFixed(1)} KB (压缩率: ${((1 - compressedSize / originalSize) * 100).toFixed(1)}%)`);

      // 如果原文件名不是 .jpg，或者发生了文件名变更，则删除旧文件
      if (filePath !== destFilePath) {
        fs.unlinkSync(filePath);
      }

      // 记录路径变更，用于更新 data-store.js
      const oldRelPath = `/assets/images/${subDir}/${file}`;
      const newRelPath = `/assets/images/${subDir}/${destFileName}`;
      if (oldRelPath !== newRelPath) {
        pathReplacements.push({ oldPath: oldRelPath, newPath: newRelPath });
      }
    } catch (err) {
      console.error(`  - ❌ 压缩文件失败 ${file}:`, err.message);
      totalCompressedSize += originalSize; // 降级加上原始大小
    }
  });
});

// 对数据源进行更新
console.log('\n正在同步更新 data-store.js 中的图片引用路径...');
let replacedCount = 0;
pathReplacements.forEach(({ oldPath, newPath }) => {
  if (dataStoreContent.includes(oldPath)) {
    dataStoreContent = dataStoreContent.split(oldPath).join(newPath);
    replacedCount++;
    console.log(`  - 已替换: ${oldPath} -> ${newPath}`);
  }
});

if (replacedCount > 0) {
  fs.writeFileSync(dataStorePath, dataStoreContent, 'utf8');
  console.log(`🎉 成功同步修改了 data-store.js 中的 ${replacedCount} 处图片后缀！`);
} else {
  console.log('💡 未发现需要修改后缀的图片引用。');
}

console.log('\n=== 压缩汇总报告 ===');
console.log(`处理图片总数: ${fileCount} 张`);
console.log(`原始总体积: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`压缩后总体积: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`节省空间: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
console.log(`🎉 优化成功！图片加载速度预期提升 ${((totalOriginalSize / totalCompressedSize)).toFixed(1)} 倍！`);
