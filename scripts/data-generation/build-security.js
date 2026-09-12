// build-security.js
// 自动生成主题题库：安全 (归属于 backend)

const fs = require('fs');

const segment = [];
for (let i = 1; i <= 50; i++) {
  segment.push({
    id: `interview_security_${String(i).padStart(3, '0')}`,
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'backend',
    topic: 'security',
    title: `安全题目 ${i}`,
    difficulty: 2,
    frequency: 3,
    question: `请解释安全概念或最佳实践 ${i}。`,
    answer: {
      short: '示例答案：简要描述关键点。',
      thinkingProcess: '思考过程：阐述风险、防护措施。',
      structured: ['要点1', '要点2']
    },
    keyPoints: ['安全', '漏洞防护', '加密'],
    traps: [],
    relatedIds: []
  });
}

const fileContent = `// interview-security.js
// 自动生成主题题库：安全 (归属于 backend)\n\nconst questions = ${JSON.stringify(segment, null, 2)};\n\nmodule.exports = questions;`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-security.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-security.js with 50 questions!');
