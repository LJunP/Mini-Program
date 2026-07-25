const fs = require('fs');
const path = require('path');

const targetFile = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics/interview-database.js';
const questions = require(targetFile);

console.log('=== 开始修复数据库面试题中的 structured 字段 ===');

let fixedCount = 0;

for (const q of questions) {
  if (!q.answer) continue;

  if (!q.answer.structured || !Array.isArray(q.answer.structured) || q.answer.structured.length === 0) {
    console.log(`正在修复 [${q.id}] - "${q.title}"...`);
    
    let structured = [];
    if (q.answer.thinkingProcess) {
      // 尝试按行切分 thinkingProcess
      const lines = q.answer.thinkingProcess.split('\n');
      for (const line of lines) {
        let cleaned = line.trim();
        // 过滤掉类似于 "1. "、"- "、"【" 这样的前缀
        cleaned = cleaned.replace(/^(\d+\.\s*|-\s*|【[^】]+】)/g, '');
        if (cleaned.length > 0) {
          structured.push(cleaned);
        }
      }
    }

    // 如果还是空的，使用 short 或者一个兜底
    if (structured.length === 0) {
      structured = [q.answer.short || '暂无结构化要点'];
    }

    q.answer.structured = structured;
    fixedCount++;
  }
}

if (fixedCount > 0) {
  const fileContent = `// interview-database.js
// 自动生成主题题库：数据库 (归属于 backend)

const questions = ${JSON.stringify(questions, null, 2)};

module.exports = questions;
`;
  fs.writeFileSync(targetFile, fileContent, 'utf8');
  console.log(`\n🎉 成功修复了 ${fixedCount} 道题目的 structured 字段！并已写回文件。`);
} else {
  console.log('\n没有发现需要修复的题目。');
}
