const fs = require('fs');
const path = require('path');

const srcDir = require('path').resolve(__dirname, '../../miniapp/assets/images');
const destDir = require('path').resolve(__dirname, '../../data/cdn_backup/assets/images');

const topicsDir = require('path').resolve(__dirname, '../../miniapp/data/study/topics');
const topicsBackupDir = require('path').resolve(__dirname, '../../data/cdn_backup/study/topics');

const studyDir = require('path').resolve(__dirname, '../../miniapp/data/study');
const studyBackupDir = require('path').resolve(__dirname, '../../data/cdn_backup/study');

console.log('=== 开始执行上线前大图、题库与文章全量超限瘦身脚本 ===');

// 递归创建目录
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 递归移动大图
function moveLargeImages(currentSrc, currentDest) {
  if (!fs.existsSync(currentSrc)) return;
  ensureDir(currentDest);

  const files = fs.readdirSync(currentSrc);
  for (const file of files) {
    const srcPath = path.join(currentSrc, file);
    const destPath = path.join(currentDest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      moveLargeImages(srcPath, destPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ((ext === '.jpg' || ext === '.png') && !file.includes('tab-') && stat.size > 20 * 1024) {
        console.log(`正在移动大图: ${path.relative(srcDir, srcPath)} (${(stat.size / 1024).toFixed(1)} KB) -> CDN 备份区`);
        fs.renameSync(srcPath, destPath);
      }
    }
  }
}

// 清理空文件夹
function cleanEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanEmptyDirs(fullPath);
      if (fs.readdirSync(fullPath).length === 0) {
        fs.rmdirSync(fullPath);
      }
    }
  }
}

// 瘦身面试题库
function slimTopics() {
  if (!fs.existsSync(topicsDir)) return;
  ensureDir(topicsBackupDir);

  const files = fs.readdirSync(topicsDir).filter(f => f.endsWith('.js'));
  console.log('\n正在备份并瘦身 18 个面试题库文件...');

  for (const file of files) {
    const srcPath = path.join(topicsDir, file);
    const destPath = path.join(topicsBackupDir, file);

    fs.copyFileSync(srcPath, destPath);

    const questions = require(srcPath);
    const slimmed = questions.slice(0, 5); // 每科保留 5 题

    const fileContent = `// ${file}
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = ${JSON.stringify(slimmed, null, 2)};

module.exports = questions;
`;
    fs.writeFileSync(srcPath, fileContent, 'utf8');
    console.log(`  - 瘦身完毕: ${file} (已从 ${questions.length} 题精简至 ${slimmed.length} 题)`);
  }
}

// 瘦身教程和科普文章
function slimArticles() {
  ensureDir(studyBackupDir);
  const articleFiles = ['tutorials.js', 'knowledge.js'];

  console.log('\n正在备份并瘦身教程与科普文章文件...');

  for (const file of articleFiles) {
    const srcPath = path.join(studyDir, file);
    const destPath = path.join(studyBackupDir, file);

    if (fs.existsSync(srcPath)) {
      // 1. 备份完整版
      fs.copyFileSync(srcPath, destPath);

      // 2. 截取前 3 篇作为提审用
      const items = require(srcPath);
      const slimmed = items.slice(0, 3);

      const fileContent = `// ${file}
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云数据库动态下发）

const items = ${JSON.stringify(slimmed, null, 2)};

module.exports = items;
`;
      fs.writeFileSync(srcPath, fileContent, 'utf8');
      console.log(`  - 瘦身完毕: ${file} (已从 ${items.length} 篇精简至 ${slimmed.length} 篇)`);
    }
  }
}

try {
  moveLargeImages(srcDir, destDir);
  cleanEmptyDirs(srcDir);
  slimTopics();
  slimArticles();

  console.log('\n🎉 上线提审包二次超限瘦身完美成功！');
  console.log('  - 本地大图片已移出至 cdn_backup');
  console.log('  - 面试题库已降维为每科 5 题');
  console.log('  - 教程与知识科普文章已降维为每科 3 篇，主包体积缩减至最小安全限度！');
} catch (e) {
  console.error('瘦身过程中出错:', e);
}
