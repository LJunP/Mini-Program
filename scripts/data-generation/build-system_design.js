// build-system_design.js
// 自动生成主题题库：系统设计 (归属于 backend)

const fs = require('fs');

const segment = [];
for (let i = 1; i <= 50; i++) {
  segment.push({
    id: `interview_system_design_${String(i).padStart(3, '0')}`,
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'backend',
    topic: 'system_design',
    title: `系统设计题目 ${i}`,
    difficulty: 3,
    frequency: 3,
    question: `请解释系统设计概念或方案细节 ${i}。`,
    answer: {
      short: '示例答案：简要描述关键点。',
      thinkingProcess: '思考过程：阐述设计目标、约束、关键模块。',
      structured: ['要点1', '要点2']
    },
    keyPoints: ['系统设计', '可扩展性', '高可用'],
    traps: [],
    relatedIds: []
  });
}

const fileContent = `// interview-system_design.js\n// 自动生成主题题库：系统设计 (归属于 backend)\n\nconst questions = ${JSON.stringify(segment, null, 2)};\n\nmodule.exports = questions;`;

const outputPath = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics/interview-system_design.js';
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-system_design.js with 50 questions!');
