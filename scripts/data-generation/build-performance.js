// build-performance.js
// 自动生成主题题库：性能优化 (归属于 backend)

const fs = require('fs');

const segment = [];
for (let i = 1; i <= 50; i++) {
  segment.push({
    id: `interview_performance_${String(i).padStart(3, '0')}`,
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'backend',
    topic: 'performance',
    title: `性能优化题目 ${i}`,
    difficulty: 2,
    frequency: 3,
    question: `请解释性能优化概念或实现技巧 ${i}。`,
    answer: {
      short: '示例答案：简要描述关键点。',
      thinkingProcess: '思考过程：阐述监控、瓶颈分析、优化手段。',
      structured: ['要点1', '要点2']
    },
    keyPoints: ['性能', '监控', '优化'],
    traps: [],
    relatedIds: []
  });
}

const fileContent = `// interview-performance.js\n// 自动生成主题题库：性能优化 (归属于 backend)\n\nconst questions = ${JSON.stringify(segment, null, 2)};\n\nmodule.exports = questions;`;

const outputPath = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics/interview-performance.js';
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-performance.js with 50 questions!');
