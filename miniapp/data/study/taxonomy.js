const tutorialCategories = [
  { key: 'all', name: '全部' },
  { key: 'tooling', name: '工具' },
  { key: 'engineering', name: '工程' },
  { key: 'language', name: '语言' },
  { key: 'system_design', name: '系统设计' }
];

const knowledgeCategories = [
  { key: 'all', name: '全部' },
  { key: 'person', name: '人物' },
  { key: 'company', name: '公司' },
  { key: 'tech_history', name: '技术史' },
  { key: 'field_map', name: '领域' }
];

const interviewTypes = [
  { key: 'all', name: '全部' },
  { key: 'baguwen', name: '八股文' },
  { key: 'scenario', name: '场景题' },
  { key: 'system_design', name: '系统设计' },
  { key: 'follow_up', name: '高频追问' }
];

const interviewTracks = [
  { key: 'all', name: '全部方向' },
  { key: 'frontend', name: '前端' },
  { key: 'backend', name: '后端' },
  { key: 'base', name: '计算机基础' },
  { key: 'infra', name: '基础设施' },
  { key: 'general', name: '通用' }
];

const interviewTopics = [
  { key: 'javascript', name: 'JavaScript', track: 'frontend' },
  { key: 'react', name: 'React', track: 'frontend' },
  { key: 'vue', name: 'Vue.js', track: 'frontend' },
  { key: 'html_css', name: 'HTML与CSS', track: 'frontend' },
  { key: 'performance', name: '性能优化', track: 'frontend' },
  { key: 'git_cicd', name: '工程化与 CI/CD', track: 'infra' },
  { key: 'golang', name: 'Go 语言', track: 'backend' },
  { key: 'java', name: 'Java', track: 'backend' },
  { key: 'python', name: 'Python', track: 'backend' },
  { key: 'cpp', name: 'C++', track: 'backend' },
  { key: 'database', name: '数据库', track: 'backend' },
  { key: 'cache', name: '缓存', track: 'backend' },
  { key: 'network', name: '计算机网络', track: 'base' },
  { key: 'os', name: '操作系统', track: 'base' },
  { key: 'docker_k8s', name: '云原生/容器化', track: 'infra' },
  { key: 'system_design', name: '系统设计', track: 'general' },
  { key: 'algorithms', name: '数据结构与算法', track: 'base' },
  { key: 'security', name: '安全与加密', track: 'general' }
];

module.exports = {
  tutorialCategories,
  knowledgeCategories,
  interviewTypes,
  interviewTracks,
  interviewTopics
};