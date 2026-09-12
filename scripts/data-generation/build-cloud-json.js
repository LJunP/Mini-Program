const fs = require('fs');
const path = require('path');

const workspaceDir = require('path').resolve(__dirname, '../..');

const topicsBackupDir = path.join(workspaceDir, 'data/cdn_backup/study/topics');
const studyBackupDir = path.join(workspaceDir, 'data/cdn_backup/study');

const destJsonPath = path.join(workspaceDir, 'data/study_data.json');

console.log('=== 开始打包全量云开发题库与文章 JSON ===');

function buildCloudJson() {
  const data = {
    tutorials: [],
    knowledge: [],
    topics: {}
  };

  // 1. 读取 tutorials 备份
  const tutorialsPath = path.join(studyBackupDir, 'tutorials.js');
  if (fs.existsSync(tutorialsPath)) {
    data.tutorials = require(tutorialsPath);
  } else {
    // 降级读取 miniapp 目录（以防未瘦身）
    const devPath = path.join(workspaceDir, 'miniapp/data/study/tutorials.js');
    if (fs.existsSync(devPath)) data.tutorials = require(devPath);
  }

  // 2. 读取 knowledge 备份
  const knowledgePath = path.join(studyBackupDir, 'knowledge.js');
  if (fs.existsSync(knowledgePath)) {
    data.knowledge = require(knowledgePath);
  } else {
    const devPath = path.join(workspaceDir, 'miniapp/data/study/knowledge.js');
    if (fs.existsSync(devPath)) data.knowledge = require(devPath);
  }

  // 3. 读取 18 个面试科目
  const targetTopicsDir = fs.existsSync(topicsBackupDir) ? topicsBackupDir : path.join(workspaceDir, 'miniapp/data/study/topics');
  if (fs.existsSync(targetTopicsDir)) {
    const files = fs.readdirSync(targetTopicsDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const topicKey = file.replace('interview-', '').replace('.js', '');
      const filePath = path.join(targetTopicsDir, file);
      data.topics[topicKey] = require(filePath);
    }
  }

  // 统计
  let questionCount = 0;
  Object.values(data.topics).forEach(list => {
    questionCount += list.length;
  });

  console.log(`- 成功读取教程: ${data.tutorials.length} 篇`);
  console.log(`- 成功读取科普: ${data.knowledge.length} 篇`);
  console.log(`- 成功读取 18 类面试题: ${questionCount} 道`);

  // 写入 JSON 文件
  fs.writeFileSync(destJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n🎉 打包完成！生成文件路径: ${destJsonPath}`);
  console.log(`👉 请将此文件上传到微信小程序云开发控制台的存储中，路径设为: study/study_data.json`);
}

try {
  buildCloudJson();
} catch (e) {
  console.error('打包过程中出错:', e);
}
