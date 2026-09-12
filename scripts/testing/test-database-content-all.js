const fs = require('fs');
const path = require('path');

const topicsDir = require('path').resolve(__dirname, '../../miniapp/data/study/topics');
const files = fs.readdirSync(topicsDir).filter(f => f.endsWith('.js'));

console.log('=== 全量面试题自动化质检 ===\n');

const ids = new Set();
let duplicates = 0;
let totalQuestions = 0;
let failures = 0;

const requiredFields = [
  'id', 'mode', 'domain', 'type', 'track', 'topic',
  'title', 'difficulty', 'frequency', 'question',
  'answer', 'keyPoints', 'traps', 'relatedIds'
];

for (const file of files) {
  const filePath = path.join(topicsDir, file);
  let questions = [];
  try {
    questions = require(filePath);
  } catch (e) {
    console.error(`- FAILED: 无法加载文件 ${file}:`, e.message);
    failures++;
    continue;
  }

  console.log(`正在检查 ${file}，包含 ${questions.length} 道题目...`);

  for (const q of questions) {
    totalQuestions++;

    // 1. 唯一 ID 检查
    if (ids.has(q.id)) {
      console.error(`  - 冲突: 发现重复 ID [${q.id}] 在文件 ${file} 中`);
      duplicates++;
    }
    ids.add(q.id);

    // 2. 字段完整性检查
    for (const field of requiredFields) {
      if (q[field] === undefined || q[field] === null) {
        console.error(`  - 错误: 题目 [${q.id}] 缺少字段 [${field}]`);
        failures++;
      }
    }

    // 3. 答案结构检查
    if (q.answer) {
      if (!q.answer.short || !q.answer.structured) {
        console.error(`  - 错误: 题目 [${q.id}] 答案字段不完整`);
        failures++;
      }
    }

    // 4. 数组字段检查
    if (q.keyPoints && !Array.isArray(q.keyPoints)) {
      console.error(`  - 错误: 题目 [${q.id}] keyPoints 必须为数组`);
      failures++;
    }
    if (q.traps && !Array.isArray(q.traps)) {
      console.error(`  - 错误: 题目 [${q.id}] traps 必须为数组`);
      failures++;
    }
    if (q.relatedIds && !Array.isArray(q.relatedIds)) {
      console.error(`  - 错误: 题目 [${q.id}] relatedIds 必须为数组`);
      failures++;
    }
  }
}

console.log('\n=== 质检结果汇总 ===');
console.log(`总题目数: ${totalQuestions}`);
console.log(`重复 ID 数量: ${duplicates}`);
console.log(`结构性错误数量: ${failures}`);

if (duplicates === 0 && failures === 0) {
  console.log('\n🎉 SUCCESS: 所有面试题均通过质检，结构完整，ID 唯一！');
} else {
  console.error('\n❌ FAILED: 质检未通过，请检查上述错误信息。');
}
