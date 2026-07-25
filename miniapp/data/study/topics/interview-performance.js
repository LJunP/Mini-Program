// interview-performance.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_performance_004_virtual_dom_diff",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "fullstack",
    "topic": "performance",
    "title": "虚拟 DOM 与 Diff 算法原理",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释虚拟 DOM 的工作原理和 Diff 算法的同层比较策略。",
    "answer": {
      "short": "虚拟 DOM 是 JS 对象描述的真实 DOM 映射。Diff 算法对比新旧虚拟 DOM 树，只更新差异部分。采用同层比较 + key 优化。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【虚拟 DOM 与 Diff 算法原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 虚拟 DOM：JS 对象树，属性映射真实 DOM。\n2. Diff 策略：同层比较（不跨层）、类型不同直接替换、列表用 key 标识。\n3. 三种操作：新增、删除、移动。\n4. key 的作用：标识同元素，避免不必要的重建。",
      "deepDive": "传统 Diff O(n³) 不可行，React 通过同层比较降到 O(n)。Vue 2 双指针 Diff，Vue 3 最长递增子序列优化移动。key 用 index 的危害：数据顺序变化导致状态错乱（如表单输入）。Fiber 架构将 Diff 拆分为可中断的任务。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【虚拟 DOM 与 Diff 算法原理】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "虚拟 DOM = JS 对象映射真实 DOM",
        "Diff 同层比较降 O(n)",
        "列表用 key 标识避免重建",
        "key 不应用 index",
        "Fiber 可中断 Diff"
      ]
    },
    "keyPoints": [
      "虚拟DOM",
      "Diff算法",
      "同层比较",
      "key",
      "Fiber"
    ],
    "traps": [
      "面试官追问：为什么 Diff 不跨层比较？答：O(n) 保证。",
      "Vue 3 的 Diff 优化（最长递增子序列）原理？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_performance_006_tree_shaking",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "fullstack",
    "topic": "performance",
    "title": "Tree Shaking 原理",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释 Tree Shaking 的工作原理及其对包体积的影响。",
    "answer": {
      "short": "Tree Shaking 利用 ES Module 静态分析，标记未使用的导出为 unused，在生产构建时剔除。只对 ESM 有效，CJS 不支持。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Tree Shaking 原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 前提：ES Module（import/export 静态结构）。\n2. Webpack 标记 unused 的 export，Terser 在压缩时删除。\n3. 副作用：package.json 的 sideEffects 字段告知哪些文件有副作用。\n4. CJS 不支持（require 是运行时动态）。",
      "deepDive": "sideEffects: false 表示所有文件无副作用，可安全 Tree Shake。CSS/JSON 等文件需要标记 sideEffects。第三方库如 lodash 不支持 Tree Shaking（CJS），可用 lodash-es 代替。Babel 配置需保留 @babel/plugin-transform-modules-commonjs 的 module 设置。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【Tree Shaking 原理】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "ES Module 静态分析是前提",
        "Webpack 标记 unused export",
        "Terser 压缩时删除",
        "sideEffects 标记副作用",
        "CJS 不支持"
      ]
    },
    "keyPoints": [
      "Tree Shaking",
      "ES Module",
      "sideEffects",
      "Terser",
      "静态分析"
    ],
    "traps": [
      "面试官追问：为什么 CJS 不支持 Tree Shaking？答：require 是运行时的。",
      "sideEffects: false 的含义？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_performance_008_memory_leak",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "fullstack",
    "topic": "performance",
    "title": "前端内存泄漏排查",
    "difficulty": 3,
    "frequency": 4,
    "question": "线上页面运行时间越长越卡，如何排查和修复前端内存泄漏？",
    "answer": {
      "short": "用 Chrome DevTools Memory 面板拍取 Heap Snapshot 对比，或用 Performance 面板观察 Heap 增长曲线，定位泄漏对象。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【前端内存泄漏排查】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 检测：Performance 面板录制长操作，观察 JS Heap 是否阶梯上升不回收。\n2. 定位：Memory 面板拍两次 Snapshot，比较增量（detached DOM、闭包引用）。\n3. 常见泄漏：未清除的 setInterval/setTimeout、事件监听未移除、脱离 DOM 树的节点引用、全局缓存无限增长。\n4. 修复：及时 clearInterval、removeEventListener、将引用置 null。",
      "deepDive": "闭包泄漏是最隐蔽的：内部函数引用了外部变量，即使外部函数执行完毕，变量也无法回收。Detached DOM 是指节点从 DOM 树移除但 JS 仍有引用。WeakMap/WeakSet 可以避免某些缓存泄漏——键被回收后值自动清除。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【前端内存泄漏排查】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "Performance 面板观察 Heap 是否阶梯上升",
        "Memory 面板双 Snapshot 比较增量",
        "常见泄漏：定时器/事件/闭包/Detached DOM",
        "修复：clearInterval/removeEventListener/null"
      ]
    },
    "keyPoints": [
      "内存泄漏",
      "Chrome DevTools",
      "Heap Snapshot",
      "闭包",
      "Detached DOM"
    ],
    "traps": [
      "面试官追问：WeakMap 如何避免缓存泄漏？",
      "如何排查 Detached DOM 泄漏？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_performance_010_event_loop_rendering",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "fullstack",
    "topic": "performance",
    "title": "事件循环与渲染时机",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释浏览器事件循环中渲染的时机，以及 requestAnimationFrame 的作用。",
    "answer": {
      "short": "一次事件循环：宏任务 → 微任务队列清空 → 检查是否需要渲染（requestAnimationFrame 回调） → 渲染 → 下一个宏任务。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【事件循环与渲染时机】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 完整循环：一个宏任务 → 清空所有微任务 → 检查渲染 → requestAnimationFrame 回调 → 渲染 → 下一个宏任务。\n2. 渲染时机：每帧只渲染一次（约 16.7ms / 60fps）。\n3. requestAnimationFrame：回调在渲染前执行，保证动画流畅。\n4. 长任务（>50ms）会阻塞渲染导致掉帧。",
      "deepDive": "动画用 requestAnimationFrame 而非 setInterval/setTimeout：rAF 跟随刷新率（通常 60fps 或 120fps），在不可见标签页自动暂停节省 CPU。long task 可用 PerformanceObserver 监控。时间切片（Time Slicing）将长任务拆分为多个短任务避免阻塞渲染。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【事件循环与渲染时机】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "宏任务→清空微任务→检查渲染→rAF→渲染",
        "每帧约 16.7ms / 60fps",
        "rAF 在渲染前执行",
        "长任务 >50ms 阻塞渲染",
        "rAF 跟随刷新率"
      ]
    },
    "keyPoints": [
      "事件循环",
      "渲染时机",
      "requestAnimationFrame",
      "60fps",
      "长任务"
    ],
    "traps": [
      "面试官追问：为什么动画用 rAF 而非 setInterval？",
      "时间切片如何避免掉帧？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_performance_013_service_worker",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "fullstack",
    "topic": "performance",
    "title": "Service Worker 缓存策略",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释 Service Worker 的缓存策略及适用场景。",
    "answer": {
      "short": "Service Worker 是浏览器后台脚本，拦截网络请求实现离线缓存。策略：Cache First、Network First、Stale-While-Revalidate。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Service Worker 缓存策略】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. Cache First：先查缓存，命中直接返回，未命中走网络。\n2. Network First：先走网络，失败回退缓存。\n3. Stale-While-Revalidate：返回缓存同时后台更新。\n4. 适用：静态资源用 Cache First，API 数据用 Network First 或 SWR。",
      "deepDive": "Service Worker 生命周期：install → activate → fetch 事件拦截。更新策略：SW 文件本身变化触发安装新版本，skipWaiting + clients.claim 立即生效。Workbox 是 Google 的 SW 工具库，提供预设缓存策略。SW 缓存不受 HTTP 缓存限制，可长期保存。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【Service Worker 缓存策略】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "Cache First：先缓存后网络",
        "Network First：先网络后缓存",
        "SWR：返回旧+后台更新",
        "SW 生命周期：install→activate→fetch",
        "Workbox 工具库"
      ]
    },
    "keyPoints": [
      "Service Worker",
      "Cache First",
      "Stale-While-Revalidate",
      "Workbox",
      "离线缓存"
    ],
    "traps": [
      "面试官追问：SW 更新策略？答：文件变化触发安装+skipWaiting。",
      "Workbox 的预缓存和运行时缓存的区别？"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
