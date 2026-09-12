const tutorials = require(require('path').resolve(__dirname, '../../miniapp/data/study/tutorials.js'));
const knowledge = require(require('path').resolve(__dirname, '../../miniapp/data/study/knowledge.js'));

console.log('=== 教程与知识科普数据全量自动化质检 ===\n');

let totalCount = 0;
let duplicates = 0;
let errors = 0;
const ids = new Set();

// 1. 检查教程
console.log(`正在检查 ${tutorials.length} 篇教程...`);
const requiredTutorialFields = ['id', 'mode', 'domain', 'title', 'category', 'difficulty', 'duration', 'tags', 'summary', 'sections'];
for (const t of tutorials) {
  totalCount++;
  if (ids.has(t.id)) {
    console.error(`  - 冲突: 重复的教程 ID [${t.id}] - "${t.title}"`);
    duplicates++;
  }
  ids.add(t.id);

  for (const f of requiredTutorialFields) {
    if (t[f] === undefined || t[f] === null) {
      console.error(`  - 错误: 教程 [${t.id}] 缺少字段 [${f}]`);
      errors++;
    }
  }

  if (t.sections && (!Array.isArray(t.sections) || t.sections.length === 0)) {
    console.error(`  - 错误: 教程 [${t.id}] sections 字段不合法`);
    errors++;
  }
}

// 2. 检查知识科普
console.log(`正在检查 ${knowledge.length} 篇知识科普...`);
const requiredKnowledgeFields = ['id', 'mode', 'domain', 'title', 'category', 'difficulty', 'duration', 'tags', 'summary', 'keyPoints', 'sections'];
for (const k of knowledge) {
  totalCount++;
  if (ids.has(k.id)) {
    console.error(`  - 冲突: 重复的知识科普 ID [${k.id}] - "${k.title}"`);
    duplicates++;
  }
  ids.add(k.id);

  for (const f of requiredKnowledgeFields) {
    if (k[f] === undefined || k[f] === null) {
      console.error(`  - 错误: 知识科普 [${k.id}] 缺少字段 [${f}]`);
      errors++;
    }
  }

  if (k.sections && (!Array.isArray(k.sections) || k.sections.length === 0)) {
    console.error(`  - 错误: 知识科普 [${k.id}] sections 字段不合法`);
    errors++;
  }
}

console.log('\n=== 质检结果汇总 ===');
console.log(`文章总篇数: ${totalCount}`);
console.log(`重复 ID 数量: ${duplicates}`);
console.log(`结构性错误数量: ${errors}`);

if (duplicates === 0 && errors === 0) {
  console.log('\n🎉 SUCCESS: 教程与知识科普板块数据 100% 通过质检，格式健康，ID 唯一！');
} else {
  console.error('\n❌ FAILED: 发现数据错误，请检查上述日志。');
}
