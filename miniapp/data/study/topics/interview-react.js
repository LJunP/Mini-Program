// interview-react.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_036",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "frontend",
    "topic": "react",
    "title": "React Hooks 闭包陷阱与底层 Fiber 链表存取原理",
    "difficulty": 4,
    "frequency": 5,
    "question": "在 React Hooks 中为什么会出现“闭包陷阱”（获取到旧的 state）？它的底层 Fiber 链表存取原理是什么？如何优雅解决？",
    "answer": {
      "short": "闭包陷阱源于 Hook 回调函数在特定渲染周期创建，捕获了当时的局部 state 变量；底层由于 Hooks 以链表顺序存取在 Fiber 节点的 memoizedState 中，若依赖数组配置不当则不会更新函数引用。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【React Hooks 闭包陷阱与底层 Fiber 链表存取原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【React Hooks 闭包陷阱与底层 Fiber 链表存取原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 联想分析：开发时经常在 useEffect/useCallback 的回调里拿到老数据。\n2. 核心原因：JS 函数形成闭包，它记住的是它被声明时的环境，而在 React 每次 Render 时，函数组件重新执行，产生全新的 state 变量与回调。\n3. 底层机制：Fiber 的 memoizedState 是单向链表，如果 useCallback 依赖为空，React 会直接复用上一次保存在链表中的旧函数，绑定的是上一次的旧 state。",
      "deepDive": "Hooks 必须保证每次渲染的执行顺序完全一致，因为 React 全靠 Fiber 节点上的链表指针进行 next 偏移复用。解决闭包陷阱的方法包括：1. 补全依赖数组；2. 针对高频变化但不需要触发重绘的变量使用 useRef；3. useState 更新时采用函数式回调。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。",
      "structured": [
        "闭包原理：Hooks 回调捕获了声明周期内的 state 局部常量，当次渲染后该值只读",
        "底层链表：Hooks 依序挂载在 Fiber 的 memoizedState 单链表上，靠游标偏移读写",
        "依赖复用：若 deps 未变，React 沿链表直接提取上一次 the 旧函数，其闭包绑定的是历史 Term 变量",
        "三大解法：补全依赖数组、Ref 代理转移引用、useState 回调更新形式"
      ]
    },
    "keyPoints": [
      "闭包陷阱",
      "Fiber 链表",
      "memoizedState",
      "依赖项数组",
      "useRef"
    ],
    "traps": [
      "使用 useRef 虽然能解决闭包陷阱，但修改 ref.current 不会触发组件重新渲染，不能用于存放需要在模板中直接渲染的数据",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_react_002",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "react",
    "title": "JSX 编译与虚拟 DOM 原理",
    "difficulty": 1,
    "frequency": 5,
    "question": "什么是 JSX？它是如何编译为浏览器可执行的代码的？它与虚拟 DOM 有什么关系？",
    "answer": {
      "short": "JSX 是 JS 语法扩展，编译时被 Babel 转化为 React.createElement() 或 React 17+ 的 _jsx() 函数调用；执行后生成描述 DOM 结构的轻量 JS 对象，即虚拟 DOM。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【JSX 编译与虚拟 DOM 原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【JSX 编译与虚拟 DOM 原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 概念还原：浏览器不能直接识别 JSX 标签。\n2. 编译链路：通过打包工具（Babel）将 HTML 样式的代码翻译成 createElement 嵌套调用。\n3. 对象映射：createElement 执行后返回一个普通的 ReactElement JS 对象，代表了 VDOM 的树形结构。",
      "deepDive": "在 React 17 之前，<div>hello</div> 被编译为 React.createElement(\"div\", null, \"hello\")。在 React 17 之后引入了全新的 JSX 转换，无需手动导入 React，Babel 自动从 react/jsx-runtime 引入 _jsx。虚拟 DOM 树的好处是它作为一层抽象，可用于跨平台渲染（React Native / SSR）。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。",
      "structured": [
        "JSX 语法：JavaScript XML，将 HTML 的声明式写法引入 JS",
        "Babel 编译：将标签静态转化为 React.createElement 或 _jsx() 运行时函数",
        "虚拟 DOM：执行 createElement 返回的 Plain Object（对象），包含 type, props, children 等属性",
        "跨平台：VDOM 脱离浏览器物理 DOM，可在 Web、Mobile、服务端进行定制解析"
      ]
    },
    "keyPoints": [
      "JSX",
      "Babel 编译",
      "React.createElement",
      "虚拟 DOM"
    ],
    "traps": [
      "虚拟 DOM 并不一定比直接操作物理 DOM 快，它的优势在于提供了“声明式开发”的抽象和“跨平台渲染”的基础",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_react_003",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "react",
    "title": "类组件与函数组件的区别",
    "difficulty": 1,
    "frequency": 5,
    "question": "React 中 Class Component（类组件）和 Functional Component（函数组件）有什么区别？为什么现代 React 推荐使用函数组件？",
    "answer": {
      "short": "类组件基于面向对象，使用 state 和生命周期方法，存在 this 指向问题且逻辑不易复用；函数组件是函数式编程，通过 Hooks 引入状态管理，代码更精简、没有 this 困扰，且天然对组件复用和 tree-shaking 友好。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【类组件与函数组件的区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【类组件与函数组件的区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 范式对比：面向对象（OOP） vs 函数式（FP）。\n2. 状态机制：Class 用 Class Field 和生命周期拦截（componentDidMount）；Functional 用 Hook (useState, useEffect)。\n3. 编译效益：函数更容易被压缩，没有 prototype 链的额外体积。",
      "deepDive": "类组件的核心局限在于：1. 业务逻辑被割裂在不同的生命周期方法中（例如在 componentDidMount 开启定时器，在 componentWillUnmount 关闭，逻辑无法聚合）；2. HOC 和 Render Props 复用逻辑会造成嵌套地狱。函数组件配合 Hooks 实现了“状态与逻辑的完全解耦”，逻辑可以用自定义 Hook 轻松提取。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。",
      "structured": [
        "范式：类组件是面向对象，函数组件是函数式编程",
        "this 问题：函数组件捕获了渲染时的值（Capture Value），没有 this 悬空隐患",
        "逻辑复用：类组件用 Mixins/HOC（易导致嵌套污染），函数组件用自定义 Hook（极简组合）",
        "性能：函数组件无类实例化开销，更适合打包体积压缩和 Tree Shaking"
      ]
    },
    "keyPoints": [
      "类组件",
      "函数组件",
      "Hooks",
      "逻辑复用",
      "Capture Value"
    ],
    "traps": [
      "函数组件每次渲染都是独立的调用，因此它会捕获当次渲染时的 props 和 state（闭包特性），这与类组件始终通过 this.state 读最新值有着本质的不同",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_react_004",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "react",
    "title": "State 与 Props 的根本区别",
    "difficulty": 1,
    "frequency": 5,
    "question": "请简述 State 和 Props 的概念，它们在 React 组件数据流中分别扮演什么角色？",
    "answer": {
      "short": "State 是组件内部私有的、可变的状态数据，用于控制自身交互和重新渲染；Props 是父组件传入的、只读的配置数据，遵循单向数据流原则，组件不能直接修改自身的 Props。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【State 与 Props 的根本区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【State 与 Props 的根本区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 数据流定位：自变量 vs 因变量。\n2. 可变性：State 内部可更新，Props 外部传入，子组件只读。\n3. 重绘诱因：两者发生变化都会触发组件的重新渲染。",
      "deepDive": "React 秉承单向数据流（Unidirectional Data Flow）架构。Props 是由上至下流动的只读配置。如果子组件想要改变父组件的 Props，必须由父组件通过 Props 传入回调函数（Callback），子组件调用该函数去改变父组件的 State，从而驱动重新渲染。这确保了组件行为的可预测性。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。",
      "structured": [
        "State：内部可变状态，是组件的主动数据，用 setState/useState 修改",
        "Props：外部只读配置，是组件的被动数据，由父组件传入",
        "不可变性：Props 在子组件中为只读，直接修改会触发严格模式警告或引起状态混乱",
        "单向数据流：数据向下传递，事件向上回调"
      ]
    },
    "keyPoints": [
      "State",
      "Props",
      "单向数据流",
      "只读性"
    ],
    "traps": [
      "直接修改 state 的值（如 this.state.count = 1）并不会触发 React 渲染更新，必须通过 setState() 或 useState 的 set 函数进行不可变更新",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_react_005",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "react",
    "title": "组件生命周期与 Hooks 映射关系",
    "difficulty": 2,
    "frequency": 5,
    "question": "类组件常用的生命周期方法有哪些？它们在函数组件中如何使用 useEffect 进行一一映射映射？",
    "answer": {
      "short": "类组件核心生命周期为 componentDidMount、componentDidUpdate 和 componentWillUnmount；在函数组件中，这三者分别通过 useEffect 的空依赖数组、包含依赖项的更新、以及返回的 cleanup 清理函数进行映射实现。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【组件生命周期与 Hooks 映射关系】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【组件生命周期与 Hooks 映射关系】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 概念对应：生命周期的功能是在特定渲染时机执行副作用。\n2. 依赖项驱动：useEffect 是响应依赖变化的，而不是模拟生命周期，但在功能上可以映射。\n3. 清理机制：返回的函数相当于组件销毁前或下一次 effect 执行前的回调。",
      "deepDive": "componentDidMount：useEffect(() => { ... }, [])。依赖为空数组，仅在挂载时运行一次。\ncomponentDidUpdate：useEffect(() => { ... }, [dep])。当 dep 改变时触发，但首次挂载也会执行。\ncomponentWillUnmount：useEffect(() => { return () => { ... } }, [])。返回的析构函数在组件注销时触发。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。\n\n【源码深度/协调更新】：React 16+ 引入了 Fiber 协调架构。Fiber Node 将传统的 DOM 树改造成了 child-sibling-return 的链表，使得 Diff 过程可以拆分为微小单元在时间分片中运行。React 的 Diff 基于两大假设进行 O(N) 复杂度的单层同级比较。",
      "structured": [
        "componentDidMount -> useEffect(fn, [])",
        "componentDidUpdate -> useEffect(fn, [deps])",
        "componentWillUnmount -> useEffect 返回的清理回调函数",
        "设计差异：生命周期是基于时间节点的面向对象钩子；useEffect 是基于数据同步的函数式机制"
      ]
    },
    "keyPoints": [
      "生命周期",
      "useEffect",
      "componentDidMount",
      "cleanup"
    ],
    "traps": [
      "useEffect 返回的清理函数不仅在组件卸载时执行，在每次由于依赖项变化导致 effect 重新执行之前，也会先运行上一次的清理函数",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。",
      "为什么 React Hooks 只能在组件顶层调用，严禁写在 if 分支里？防撕核心：因为 React Fiber 节点在物理存储 Hooks 状态时使用单向链表。React 仅靠 Hooks 的调用顺序（顺序索引）去链表中依次匹配和读取状态。如果在 if 中跳过某个 Hook，会导致链表读取顺序错乱崩溃。"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
