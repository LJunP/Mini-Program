// build-algorithms.js
// 自动生成主题题库：算法 (归属于 backend)

const fs = require('fs');

const segment = [];
for (let i = 1; i <= 50; i++) {
  segment.push({
    id: `interview_algorithms_${String(i).padStart(3, '0')}`,
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'backend',
    topic: 'algorithms',
    title: `算法题目 ${i}`,
    difficulty: 2,
    frequency: 3,
    question: `请解释算法概念或实现细节 ${i}。`,
    answer: {
      short: '示例答案：简要描述关键点。',
      thinkingProcess: '思考过程：阐述分析思路、关键步骤。',
      structured: ['要点1', '要点2']
    },
    keyPoints: ['算法', '时间复杂度', '空间优化'],
    traps: [],
    relatedIds: []
  });
}

const fileContent = `// interview-algorithms.js
// 自动生成主题题库：算法 (归属于 backend)\n\nconst questions = ${JSON.stringify(segment, null, 2)};\n\nmodule.exports = questions;`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-algorithms.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-algorithms.js with 50 questions!');
