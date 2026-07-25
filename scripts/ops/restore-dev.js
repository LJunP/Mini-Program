const fs = require('fs');
const path = require('path');

const srcDir = '/Users/lijunpeng/Desktop/workbuddy_project/data/cdn_backup/assets/images';
const destDir = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/assets/images';

const topicsBackupDir = '/Users/lijunpeng/Desktop/workbuddy_project/data/cdn_backup/study/topics';
const topicsDir = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics';

const studyBackupDir = '/Users/lijunpeng/Desktop/workbuddy_project/data/cdn_backup/study';
const studyDir = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study';

console.log('=== 开始执行开发环境图片、题库与文章资源全量还原脚本 ===');

// 递归创建目录
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 递归移动回本地
function restoreImages(currentSrc, currentDest) {
  if (!fs.existsSync(currentSrc)) return;
  ensureDir(currentDest);

  const files = fs.readdirSync(currentSrc);
  for (const file of files) {
    const srcPath = path.join(currentSrc, file);
    const destPath = path.join(currentDest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      restoreImages(srcPath, destPath);
    } else {
      console.log(`正在恢复图片: ${path.relative(srcDir, srcPath)} -> 小程序 assets 目录`);
      fs.renameSync(srcPath, destPath);
    }
  }
}

// 恢复完整题库
function restoreTopics() {
  const masterDbPath = '/Users/lijunpeng/Desktop/workbuddy_project/data/study_data.json';
  if (!fs.existsSync(masterDbPath)) {
    console.error('❌ 错误: 未能找到 master 数据文件 data/study_data.json！');
    return;
  }
  
  console.log('\n正在从 study_data.json 还原 18 个面试题库完整版数据...');
  ensureDir(topicsDir);
  
  const masterData = JSON.parse(fs.readFileSync(masterDbPath, 'utf8'));
  const topics = masterData.topics || {};
  
  Object.keys(topics).forEach(topicKey => {
    const filename = `interview-${topicKey}.js`;
    const destPath = path.join(topicsDir, filename);
    const fileContent = `// ${filename}
// 本地开发完整版（由 master study_data.json 还原生成）

const questions = ${JSON.stringify(topics[topicKey], null, 2)};

module.exports = questions;
`;
    fs.writeFileSync(destPath, fileContent, 'utf8');
    console.log(`  - 还原完毕: ${filename} (共 ${topics[topicKey].length} 道题目)`);
  });
}

// 恢复完整文章
function restoreArticles() {
  const masterDbPath = '/Users/lijunpeng/Desktop/workbuddy_project/data/study_data.json';
  if (!fs.existsSync(masterDbPath)) return;

  console.log('\n正在从 study_data.json 还原教程与知识科普完整版数据...');
  ensureDir(studyDir);

  const masterData = JSON.parse(fs.readFileSync(masterDbPath, 'utf8'));
  
  // 1. tutorials.js
  if (masterData.tutorials) {
    const destPath = path.join(studyDir, 'tutorials.js');
    const fileContent = `// tutorials.js
// 本地开发完整版（由 master study_data.json 还原生成）

const items = ${JSON.stringify(masterData.tutorials, null, 2)};

module.exports = items;
`;
    fs.writeFileSync(destPath, fileContent, 'utf8');
    console.log(`  - 还原完毕: tutorials.js (共 ${masterData.tutorials.length} 篇教程)`);
  }

  // 2. knowledge.js
  if (masterData.knowledge) {
    const destPath = path.join(studyDir, 'knowledge.js');
    const fileContent = `// knowledge.js
// 本地开发完整版（由 master study_data.json 还原生成）

const items = ${JSON.stringify(masterData.knowledge, null, 2)};

module.exports = items;
`;
    fs.writeFileSync(destPath, fileContent, 'utf8');
    console.log(`  - 还原完毕: knowledge.js (共 ${masterData.knowledge.length} 篇科普)`);
  }
}

// 清理空备份文件夹
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

try {
  restoreImages(srcDir, destDir);
  cleanEmptyDirs(srcDir);

  restoreTopics();
  // 清理可能遗留的旧 topics 备份以防止混淆
  if (fs.existsSync(topicsBackupDir)) {
    const files = fs.readdirSync(topicsBackupDir);
    for (const file of files) {
      fs.unlinkSync(path.join(topicsBackupDir, file));
    }
    cleanEmptyDirs(topicsBackupDir);
  }

  restoreArticles();
  if (fs.existsSync(studyBackupDir)) {
    const files = fs.readdirSync(studyBackupDir).filter(f => !fs.statSync(path.join(studyBackupDir, f)).isDirectory());
    for (const file of files) {
      fs.unlinkSync(path.join(studyBackupDir, file));
    }
    cleanEmptyDirs(studyBackupDir);
  }

  console.log('\n🎉 所有开发环境资源与 901 道面试题库已完整还原复位！您可以在本地微信开发者工具中无网/Mock 模式下完整预览。');
} catch (e) {
  console.error('还原过程中出错:', e.message);
}
