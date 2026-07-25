const fs = require('fs');
const path = require('path');

const rootDir = '/Users/lijunpeng/Desktop/workbuddy_project';
const miniappDir = path.join(rootDir, 'miniapp');
const dataDir = path.join(rootDir, 'data');

console.log('=== Start Scanning Workbuddy Project ===');

const stats = {
  jsFiles: 0,
  jsLines: 0,
  wxmlFiles: 0,
  wxmlLines: 0,
  wxssFiles: 0,
  wxssLines: 0,
  jsonFiles: 0,
  jsonLines: 0,
  mdFiles: 0,
  imageFiles: 0,
  imageSize: 0,
  otherFiles: 0
};

const fileTypes = {};

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        scanDir(fullPath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      
      if (ext === '.js') {
        stats.jsFiles++;
        stats.jsLines += fs.readFileSync(fullPath, 'utf8').split('\n').length;
      } else if (ext === '.wxml') {
        stats.wxmlFiles++;
        stats.wxmlLines += fs.readFileSync(fullPath, 'utf8').split('\n').length;
      } else if (ext === '.wxss') {
        stats.wxssFiles++;
        stats.wxssLines += fs.readFileSync(fullPath, 'utf8').split('\n').length;
      } else if (ext === '.json') {
        stats.jsonFiles++;
        stats.jsonLines += fs.readFileSync(fullPath, 'utf8').split('\n').length;
      } else if (ext === '.md') {
        stats.mdFiles++;
      } else if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        stats.imageFiles++;
        stats.imageSize += stat.size;
      } else {
        stats.otherFiles++;
      }
    }
  }
}

scanDir(miniappDir);
console.log('\n--- Miniapp Directory Code Metrics ---');
console.log(JSON.stringify(stats, null, 2));

// Scan study questions, topics, leisure data
// Check files in miniapp/data/study/
const studyPath = path.join(miniappDir, 'data/study');
console.log('\n--- Study Data Summary ---');
if (fs.existsSync(studyPath)) {
  const topicsPath = path.join(studyPath, 'topics');
  if (fs.existsSync(topicsPath)) {
    const topics = fs.readdirSync(topicsPath).filter(f => f.endsWith('.js'));
    console.log(`面试科目数量: ${topics.length}`);
    let totalQuestions = 0;
    for (const t of topics) {
      try {
        const questions = require(path.join(topicsPath, t));
        totalQuestions += questions.length;
      } catch (e) {
        console.log(`加载 ${t} 失败:`, e.message);
      }
    }
    console.log(`包内现有题目数 (当前提审精简态): ${totalQuestions}`);
  }
}

// Let's also check backup dir for full database if exists
const backupStudyPath = path.join(dataDir, 'cdn_backup/study');
console.log('\n--- Backup Study Data Summary ---');
if (fs.existsSync(backupStudyPath)) {
  const backupTopicsPath = path.join(backupStudyPath, 'topics');
  if (fs.existsSync(backupTopicsPath)) {
    const topics = fs.readdirSync(backupTopicsPath).filter(f => f.endsWith('.js'));
    console.log(`备份面试科目数量: ${topics.length}`);
    let totalQuestions = 0;
    for (const t of topics) {
      try {
        const questions = require(path.join(backupTopicsPath, t));
        totalQuestions += questions.length;
      } catch (e) {
        console.log(`加载备份 ${t} 失败:`, e.message);
      }
    }
    console.log(`备份区总题目数 (完整库): ${totalQuestions}`);
  }
}

// Check current config state
const configPath = path.join(miniappDir, 'utils/config.js');
console.log('\n--- Config.js Current State ---');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  console.log(configContent.split('\n').filter(line => line.includes('cdnBaseUrl') || line.includes('enableMock') || line.includes('currentEnv')).join('\n'));
}

console.log('\n=== Scan Completed ===');
