const fs = require('fs');
const path = require('path');

const questions = [
  {
    id: 'interview_036',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React Hooks 闭包陷阱与底层 Fiber 链表存取原理',
    difficulty: 4,
    frequency: 5,
    question: '在 React Hooks 中为什么会出现“闭包陷阱”（获取到旧的 state）？它的底层 Fiber 链表存取原理是什么？如何优雅解决？',
    answer: {
      short: '闭包陷阱源于 Hook 回调函数在特定渲染周期创建，捕获了当时的局部 state 变量；底层由于 Hooks 以链表顺序存取在 Fiber 节点的 memoizedState 中，若依赖数组配置不当则不会更新函数引用。',
      thinkingProcess: '1. 联想分析：开发时经常在 useEffect/useCallback 的回调里拿到老数据。\n2. 核心原因：JS 函数形成闭包，它记住的是它被声明时的环境，而在 React 每次 Render 时，函数组件重新执行，产生全新的 state 变量与回调。\n3. 底层机制：Fiber 的 memoizedState 是单向链表，如果 useCallback 依赖为空，React 会直接复用上一次保存在链表中的旧函数，绑定的是上一次的旧 state。',
      deepDive: 'Hooks 必须保证每次渲染的执行顺序完全一致，因为 React 全靠 Fiber 节点上的链表指针进行 next 偏移复用。解决闭包陷阱的方法包括：1. 补全依赖数组；2. 针对高频变化但不需要触发重绘的变量使用 useRef；3. useState 更新时采用函数式回调。',
      structured: [
        '闭包原理：Hooks 回调捕获了声明周期内的 state 局部常量，当次渲染后该值只读',
        '底层链表：Hooks 依序挂载在 Fiber 的 memoizedState 单链表上，靠游标偏移读写',
        '依赖复用：若 deps 未变，React 沿链表直接提取上一次 the 旧函数，其闭包绑定的是历史 Term 变量',
        '三大解法：补全依赖数组、Ref 代理转移引用、useState 回调更新形式'
      ]
    },
    keyPoints: ['闭包陷阱', 'Fiber 链表', 'memoizedState', '依赖项数组', 'useRef'],
    traps: ['使用 useRef 虽然能解决闭包陷阱，但修改 ref.current 不会触发组件重新渲染，不能用于存放需要在模板中直接渲染的数据'],
    relatedIds: []
  },
  {
    id: 'interview_react_002',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'JSX 编译与虚拟 DOM 原理',
    difficulty: 1,
    frequency: 5,
    question: '什么是 JSX？它是如何编译为浏览器可执行的代码的？它与虚拟 DOM 有什么关系？',
    answer: {
      short: 'JSX 是 JS 语法扩展，编译时被 Babel 转化为 React.createElement() 或 React 17+ 的 _jsx() 函数调用；执行后生成描述 DOM 结构的轻量 JS 对象，即虚拟 DOM。',
      thinkingProcess: '1. 概念还原：浏览器不能直接识别 JSX 标签。\n2. 编译链路：通过打包工具（Babel）将 HTML 样式的代码翻译成 createElement 嵌套调用。\n3. 对象映射：createElement 执行后返回一个普通的 ReactElement JS 对象，代表了 VDOM 的树形结构。',
      deepDive: '在 React 17 之前，<div>hello</div> 被编译为 React.createElement("div", null, "hello")。在 React 17 之后引入了全新的 JSX 转换，无需手动导入 React，Babel 自动从 react/jsx-runtime 引入 _jsx。虚拟 DOM 树的好处是它作为一层抽象，可用于跨平台渲染（React Native / SSR）。',
      structured: [
        'JSX 语法：JavaScript XML，将 HTML 的声明式写法引入 JS',
        'Babel 编译：将标签静态转化为 React.createElement 或 _jsx() 运行时函数',
        '虚拟 DOM：执行 createElement 返回的 Plain Object（对象），包含 type, props, children 等属性',
        '跨平台：VDOM 脱离浏览器物理 DOM，可在 Web、Mobile、服务端进行定制解析'
      ]
    },
    keyPoints: ['JSX', 'Babel 编译', 'React.createElement', '虚拟 DOM'],
    traps: ['虚拟 DOM 并不一定比直接操作物理 DOM 快，它的优势在于提供了“声明式开发”的抽象和“跨平台渲染”的基础'],
    relatedIds: []
  },
  {
    id: 'interview_react_003',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: '类组件与函数组件的区别',
    difficulty: 1,
    frequency: 5,
    question: 'React 中 Class Component（类组件）和 Functional Component（函数组件）有什么区别？为什么现代 React 推荐使用函数组件？',
    answer: {
      short: '类组件基于面向对象，使用 state 和生命周期方法，存在 this 指向问题且逻辑不易复用；函数组件是函数式编程，通过 Hooks 引入状态管理，代码更精简、没有 this 困扰，且天然对组件复用和 tree-shaking 友好。',
      thinkingProcess: '1. 范式对比：面向对象（OOP） vs 函数式（FP）。\n2. 状态机制：Class 用 Class Field 和生命周期拦截（componentDidMount）；Functional 用 Hook (useState, useEffect)。\n3. 编译效益：函数更容易被压缩，没有 prototype 链的额外体积。',
      deepDive: '类组件的核心局限在于：1. 业务逻辑被割裂在不同的生命周期方法中（例如在 componentDidMount 开启定时器，在 componentWillUnmount 关闭，逻辑无法聚合）；2. HOC 和 Render Props 复用逻辑会造成嵌套地狱。函数组件配合 Hooks 实现了“状态与逻辑的完全解耦”，逻辑可以用自定义 Hook 轻松提取。',
      structured: [
        '范式：类组件是面向对象，函数组件是函数式编程',
        'this 问题：函数组件捕获了渲染时的值（Capture Value），没有 this 悬空隐患',
        '逻辑复用：类组件用 Mixins/HOC（易导致嵌套污染），函数组件用自定义 Hook（极简组合）',
        '性能：函数组件无类实例化开销，更适合打包体积压缩和 Tree Shaking'
      ]
    },
    keyPoints: ['类组件', '函数组件', 'Hooks', '逻辑复用', 'Capture Value'],
    traps: ['函数组件每次渲染都是独立的调用，因此它会捕获当次渲染时的 props 和 state（闭包特性），这与类组件始终通过 this.state 读最新值有着本质的不同'],
    relatedIds: []
  },
  {
    id: 'interview_react_004',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'State 与 Props 的根本区别',
    difficulty: 1,
    frequency: 5,
    question: '请简述 State 和 Props 的概念，它们在 React 组件数据流中分别扮演什么角色？',
    answer: {
      short: 'State 是组件内部私有的、可变的状态数据，用于控制自身交互和重新渲染；Props 是父组件传入的、只读的配置数据，遵循单向数据流原则，组件不能直接修改自身的 Props。',
      thinkingProcess: '1. 数据流定位：自变量 vs 因变量。\n2. 可变性：State 内部可更新，Props 外部传入，子组件只读。\n3. 重绘诱因：两者发生变化都会触发组件的重新渲染。',
      deepDive: 'React 秉承单向数据流（Unidirectional Data Flow）架构。Props 是由上至下流动的只读配置。如果子组件想要改变父组件的 Props，必须由父组件通过 Props 传入回调函数（Callback），子组件调用该函数去改变父组件的 State，从而驱动重新渲染。这确保了组件行为的可预测性。',
      structured: [
        'State：内部可变状态，是组件的主动数据，用 setState/useState 修改',
        'Props：外部只读配置，是组件的被动数据，由父组件传入',
        '不可变性：Props 在子组件中为只读，直接修改会触发严格模式警告或引起状态混乱',
        '单向数据流：数据向下传递，事件向上回调'
      ]
    },
    keyPoints: ['State', 'Props', '单向数据流', '只读性'],
    traps: ['直接修改 state 的值（如 this.state.count = 1）并不会触发 React 渲染更新，必须通过 setState() 或 useState 的 set 函数进行不可变更新'],
    relatedIds: []
  },
  {
    id: 'interview_react_005',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: '组件生命周期与 Hooks 映射关系',
    difficulty: 2,
    frequency: 5,
    question: '类组件常用的生命周期方法有哪些？它们在函数组件中如何使用 useEffect 进行一一映射映射？',
    answer: {
      short: '类组件核心生命周期为 componentDidMount、componentDidUpdate 和 componentWillUnmount；在函数组件中，这三者分别通过 useEffect 的空依赖数组、包含依赖项的更新、以及返回的 cleanup 清理函数进行映射实现。',
      thinkingProcess: '1. 概念对应：生命周期的功能是在特定渲染时机执行副作用。\n2. 依赖项驱动：useEffect 是响应依赖变化的，而不是模拟生命周期，但在功能上可以映射。\n3. 清理机制：返回的函数相当于组件销毁前或下一次 effect 执行前的回调。',
      deepDive: 'componentDidMount：useEffect(() => { ... }, [])。依赖为空数组，仅在挂载时运行一次。\ncomponentDidUpdate：useEffect(() => { ... }, [dep])。当 dep 改变时触发，但首次挂载也会执行。\ncomponentWillUnmount：useEffect(() => { return () => { ... } }, [])。返回的析构函数在组件注销时触发。',
      structured: [
        'componentDidMount -> useEffect(fn, [])',
        'componentDidUpdate -> useEffect(fn, [deps])',
        'componentWillUnmount -> useEffect 返回的清理回调函数',
        '设计差异：生命周期是基于时间节点的面向对象钩子；useEffect 是基于数据同步的函数式机制'
      ]
    },
    keyPoints: ['生命周期', 'useEffect', 'componentDidMount', 'cleanup'],
    traps: ['useEffect 返回的清理函数不仅在组件卸载时执行，在每次由于依赖项变化导致 effect 重新执行之前，也会先运行上一次的清理函数'],
    relatedIds: []
  },
  {
    id: 'interview_react_006',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'React 合成事件系统原理',
    difficulty: 3,
    frequency: 5,
    question: '为什么 React 要设计合成事件（SyntheticEvent）系统？其底层代理和事件冒泡机制是如何实现的？在 React 17/18 中有什么重要变化？',
    answer: {
      short: '合成事件是对原生事件的跨浏览器封装，旨在统一跨端表现并实现高性能事件代理；React 通过在容器根节点监听所有事件，并根据 DOM 树结构模拟事件捕获与冒泡；React 17+ 将事件代理从 document 节点移到了挂载节点，避免了多实例微应用下的冲突。',
      thinkingProcess: '1. 为什么需要合成事件：抹平兼容性；提高性能，防止万级 DOM 节点绑定万级 EventListener 撑爆内存。\n2. 事件代理（Event Delegation）：所有 onClick 都没有直接绑定在 physical 元素上，而是在根节点代理捕获。\n3. 版本变更：React 17 改变了代理目标，解决了微前端沙箱隔离的冲突问题。',
      deepDive: '在 React 中，当事件触发时，原生事件会先冒泡到 Root 节点（React 17 之前是 document，React 17+ 是 App container Root）。React 的 EventSystem 捕获到后，会创建合成事件对象 SyntheticEvent，并沿组件树向上寻找所有的 React 事件处理器，模拟冒泡执行。这使得在 Portal 组件中，即使物理节点已经跑出了父容器，合成事件依然能向上冒泡。',
      structured: [
        '跨端抹平：封装 SyntheticEvent，抹平各浏览器的事件差异',
        '性能优化：单事件代理，避开为大量 DOM 子节点频繁绑定事件的内存消耗',
        '事件绑定点：React 16 在 document 上代理；React 17+ 移到了根 DOM 节点（如 #root）',
        'Portal 冒泡：基于虚拟 React 组件树（Fiber 树）模拟冒泡，而非物理 DOM 树'
      ]
    },
    keyPoints: ['合成事件', '事件代理', 'SyntheticEvent', 'React 17 变革', 'Portal 冒泡'],
    traps: ['在 React 合成事件中调用 e.stopPropagation() 只能阻止 React 组件树上的冒泡，无法阻止冒泡到原生 DOM 节点（除非使用 e.nativeEvent.stopImmediatePropagation()）'],
    relatedIds: []
  },
  {
    id: 'interview_react_007',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'Reconciliation 协调算法与 Diff 策略',
    difficulty: 3,
    frequency: 5,
    question: 'React 的虚拟 DOM Diff 算法是如何工作的？如何将复杂度从 O(n^3) 优化到 O(n)？请简述其三大 Diff 策略。',
    answer: {
      short: 'React 采用启发式协调算法，基于三个前提将复杂度降为 O(n)：同级比较（不同级不复用）、同类组件复用（不同类型直接销毁重造）、以及 Key 属性标识（保证同层节点的复用和移动位置）。',
      thinkingProcess: '1. 算法背景：计算两棵树的完全差异复杂度为 O(n^3)，在 UI 渲染中不可接受。\n2. 优化思路：React 做了三个极其符合工程常识的约束性假设，将算法简化为单次深度优先遍历。\n3. Diff 三策略：Tree Diff, Component Diff, Element Diff。',
      deepDive: 'Web UI 中跨层级移动 DOM 节点的操作少到可以忽略：因此只进行同级节点比较（Tree Diff），一旦某节点在父级消失，直接销毁。\n两个不同类型的组件会产生不同的树形结构：如果 <Counter> 换成了 <List>，直接销毁 Counter 及其子孙，创建 List，哪怕子组件长得很像。\n开发者可以通过 key 属性暗示哪些子元素在不同的渲染中保持稳定。',
      structured: [
        '同级比较：只对比同层 DOM，跨层级直接销毁，放弃全局最小编辑算法',
        '组件对比：类型不同则直接拆除老树重新建新树，不尝试做跨类复用',
        'Key 优化：同级子列表引入 Key，快速识别节点发生了移动、插入还是删除',
        '最终复杂度：从 O(n^3) 暴降至线性 O(n)，满足 UI 高帧率绘制'
      ]
    },
    keyPoints: ['Reconciliation', 'Diff 算法', 'O(n) 复杂度', '同级比较', 'Key 机制'],
    traps: ['Diff 阶段是不可以被打断的（React 15 以前的 Stack Reconciler），但 React 18 的 Fiber 架构将 Diff 和物理 Render 过程分成了协调（可中断）和提交（不可中断）两个阶段'],
    relatedIds: []
  },
  {
    id: 'interview_react_008',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: '列表 Key 属性的作用与 Index 作 Key 的危害',
    difficulty: 2,
    frequency: 5,
    question: '在 React 循环渲染列表时，key 属性的底层作用是什么？为什么强烈不建议使用数组的 index 作为 key？会产生什么具体 Bug？',
    answer: {
      short: 'Key 属性是 React 在 Diff 算法中识别虚拟 DOM 节点唯一身份的身份证；使用 index 作 key 会导致在列表中间进行插入、删除、排序等操作时，React 错误复用旧节点的 DOM 结构与内部状态，产生非预期的渲染 Bug。',
      thinkingProcess: '1. 场景联想：控制台提示 "Each child in a list should have a unique key"。\n2. 机制拆解：Diff 算法在比对子节点数组时，会先匹配 key。如果 key 相同，React 就认为这是同一个组件，仅进行 props 的 patch 更新。\n3. Bug 复现：如果 index 作 key，在头部插入一个新项，所有原本项的 index 全加 1。React 匹配 key 时会判定‘最后一个是新加的’，而前面的旧项只是属性变了。这会导致旧项内部非受控的 input 状态、展开折叠状态无法被重置，出现内容串联错误。',
      deepDive: '如果列表只用于静态展示，不涉及增删改排，用 index 作为 key 是安全的。但如果涉及增删，使用 index 作 key 会导致极大的重绘开销（因为所有位置错位的组件都无法进行 Diff 复用，全部发生 props 更新甚至重造）。应该使用全局唯一的 id（如业务数据的主键）作为 key。',
      structured: [
        'Key 底层作用：给 VDOM 节点分配唯一标识，辅助 Reconciler 高速识别移动和增删',
        'Index 危害：当数组顺序发生打乱，原节点的 index 会发生移位，React 会错误匹配并复用错误的物理 DOM',
        '常见 Bug 表现：列表内的 Input 文本框在插入新数据后，框里的文字错位或保留在错误行上',
        '正确做法：使用后端返回的唯一 id，或者在本地使用 uuid/nanoid 在数据生成时就绑定 ID'
      ]
    },
    keyPoints: ['Key 属性', 'Index 陷阱', 'DOM 复用', '列表渲染', '状态错乱'],
    traps: ['绝对不要用 Math.random() 在 render 期间动态生成 key，这会导致每次 Render 时的 key 全面变动，React 会销毁所有列表元素并从头创建，性能直接崩溃'],
    relatedIds: []
  },
  {
    id: 'interview_react_009',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: '受控组件与非受控组件',
    difficulty: 2,
    frequency: 4,
    question: 'React 中的受控组件（Controlled）和非受控组件（Uncontrolled）有什么区别？在什么业务场景下该如何选择？',
    answer: {
      short: '受控组件的数据由 React 组件的 state 统一管理，通过 value 和 onChange 进行双向数据流同步；非受控组件的数据保留在 DOM 元素自身，通过 ref 直接读取物理节点。',
      thinkingProcess: '1. 概念界定：谁是 Single Source of Truth (单一事实源)。\n2. 受控：React 控制一切。数据在 State 里，输入框强行绑定 value。更新必须 set。\n3. 非受控：保留传统原生表单行为，用 useRef.current.value 提取。',
      deepDive: '受控组件提供了极强的控制力，非常适合表单实时校验、输入格式化、关联级联下拉框。其缺点是每次按键都会触发 React state 变更和组件重绘。非受控组件配合 defaultValue 使用，适合不需要实时校验、直接提交的一次性大表单或第三方富文本编辑器集成。',
      structured: [
        '受控组件：状态存在 React State，更新通过绑定的事件回调完成，React 掌握绝对控制权',
        '非受控组件：状态存在物理 DOM 中，取值通过 useRef，保留 HTML 默认表单特性',
        '场景抉择（受控）：实时密码强度提示、输入仅限数字、下拉框联动',
        '场景抉择（非受控）：大表单一次性提交、集成需要自由操作 DOM 的 jQuery/富文本库'
      ]
    },
    keyPoints: ['受控组件', '非受控组件', 'useRef', '表单绑定', '单向流动'],
    traps: ['在受控组件中，如果把 value 设为了 undefined，输入框会自动转为非受控状态，此时用户输入不受 React 控制，如果后续又传了有效值，控制台会抛出“受控状态转换”的警告'],
    relatedIds: []
  },
  {
    id: 'interview_react_010',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 性能优化三大件：memo, useMemo, useCallback',
    difficulty: 3,
    frequency: 5,
    question: '请详细阐述 React.memo、useMemo 和 useCallback 的作用与区别，并说明在什么场景下应该避免使用它们？',
    answer: {
      short: 'React.memo 缓存组件本身以防父组件重绘带跑子组件；useMemo 缓存耗时的计算计算结果；useCallback 缓存函数引用以防每次重绘生成新引用；在普通轻量组件或传简单值时应避免使用，因为缓存查找也有开销。',
      thinkingProcess: '1. 优化痛点：React 的默认更新机制是“父组件重绘，所有子组件默认无脑跟着重绘”，这极易造成无意义的 CPU 浪费。\n2. 机制划分：组件级别（memo） vs 变量值级别（useMemo） vs 函数引用级别（useCallback）。\n3. 负面效应：过度优化是万恶之源。写 useCallback 会产生额外的依赖项比对、闭包保留开销，甚至使代码变得极难维护。',
      deepDive: 'useCallback 的真正价值不在于“避免函数重复创建”（在 JS 中创建普通匿名函数极快，内存微乎其微），而在于配合 React.memo 保证传递给子组件的函数 props 引用地址保持稳定，防止子组件无意义重绘。如果子组件没有使用 memo 包裹，那你对父组件的函数包裹 useCallback 是没有任何性能优化效果的。',
      structured: [
        'React.memo：浅比较组件的 props 是否发生变化，没有变化就跳过重绘',
        'useMemo：类似 Vue 的 computed，仅在依赖项变动时重新计算复杂数据并缓存',
        'useCallback：锁定函数指针，当 deps 改变时才返回新引用',
        '反例：简单基础类型的 props 传递（如 <Button onClick={cb} />），不要盲目用 useCallback，因为闭包开销大于直接生成函数的消耗'
      ]
    },
    keyPoints: ['React.memo', 'useMemo', 'useCallback', '浅比较', '过度优化'],
    traps: ['useMemo 只能起到“缓存提升性能”的作用，React 规范明确声明它不保证数据永远不被释放，未来弱物理内存不足时可能会自动清除缓存，不可用来存业务持久数据'],
    relatedIds: []
  },
  {
    id: 'interview_react_011',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: '逻辑复用演进：HOC vs Render Props vs Hooks',
    difficulty: 3,
    frequency: 4,
    question: 'React 历史上有哪几种组件逻辑复用方案？请对比高阶组件（HOC）、Render Props 以及 React Hooks 的优缺点。',
    answer: {
      short: '高阶组件使用装饰器模式包裹组件，但易导致 Props 来源不明和嵌套地狱；Render Props 依靠函数分发渲染，同样存在层级嵌套；Hooks 是函数式组合，逻辑直接以扁平化形式挂载在组件内部，无侵入性，是现代最佳方案。',
      thinkingProcess: '1. 演进脉络：Mixins（React 早期已废弃） -> HOC -> Render Props -> Hooks。\n2. HOC 缺陷：包装多层后，不知道某个 props.theme 到底是哪个 HOC 塞进来的，且命名冲突难防。\n3. Hooks 终结者：Hooks 直接将状态和副作用聚合，调用就像写普通 JS 变量一样扁平，彻底清空了 DOM 包装地狱。',
      deepDive: 'HOC (High-Order Component)：const Enhanced = withAuth(withTheme(MyComponent))。容易产生大量的嵌套层级，调试困难（React DevTools 会有一层层的 wrapper）。\nRender Props：<Mouse render={mouse => <Cat mouse={mouse} />} />。通过动态回调，把控制权交给使用方。写法别扭且依然有层级嵌套。\nHooks：const { x, y } = useMouse()。完全扁平，变量直接在作用域，清晰明了，且支持多个 Hooks 任意逻辑组合。',
      structured: [
        'Mixins：已被 React 彻底废弃，因为隐式依赖冲突、逻辑关系凌乱',
        'HOC：利用高阶函数包裹组件（返回新组件），Props 易冲突、层级树极其深重',
        'Render Props：通过 props 传递一个返回 JSX 的函数进行内部消费，依然存在嵌套表现',
        'Hooks：纯粹扁平化函数式组合，状态隔离，调用清爽，逻辑彻底解耦'
      ]
    },
    keyPoints: ['高阶组件', 'Render Props', 'Hooks', '逻辑复用', '嵌套地狱'],
    traps: ['HOC 必须注意把子组件的静态方法进行 copy 复制（可以使用 hoist-non-react-statics 库），并且需要正确传递 Ref（使用 forwardRef），否则外层无法拿到子组件的 DOM 引用'],
    relatedIds: []
  },
  {
    id: 'interview_react_012',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'Context API 状态广播与无意义重绘防范',
    difficulty: 2,
    frequency: 4,
    question: 'Context API 解决了什么痛点？使用 Context 广播全局状态时，如何防止消费该 Context 的所有子组件发生大面积无意义重绘？',
    answer: {
      short: 'Context 解决了深层层级数据跨组件透传（Prop Drilling）的痛点；防范大面积重绘可通过拆分细粒度的 Context、配合 React.memo 拦截中间组件、或者将 Context 属性作为 children 传入等方案实现。',
      thinkingProcess: '1. 问题根源：Context.Provider 的 value 每次如果都是新对象，那么只要 Provider 的 state 一更新，哪怕子组件只用到了其中的一个小属性，由于整个 value 引用地址变了，所有消费这个 Context 的子组件都会强制重绘。\n2. 优化方向：避免粗暴的大杂烩 value。\n3. 技术技巧：将不需要订阅 Context 的中间组件用 React.memo 进行拦截，使其 Props 未变时不重绘；或者将 Context 分成 ThemeContext, UserContext 等多个独立的小容器。',
      deepDive: '另一种极度的优化手段是“拆分读写”或使用“Children 隔离法”：\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  return (\n    <ThemeContext.Provider value={theme}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n对于频繁变动的高频全局状态，Context API 不是最佳选择（因为它没有精细订阅机制），应考虑 Zustand 或 Redux Toolkit 等外部状态管理。',
      structured: [
        '解决痛点：跨越数十层 DOM 的孙辈组件传值，避免中间组件充当传话筒',
        '重绘隐患：Provider 的 value 引用一旦发生改变，所有 useContext 的子代组件强制重绘',
        '优化一：Context 职责单一化，不同业务维度的数据用各自 the Provider 进行广播',
        '优化二：配合 useMemo 锁定 value 对象的引用，中间传递层使用 React.memo'
      ]
    },
    keyPoints: ['Context API', 'useContext', 'Prop Drilling', '组件优化', 'Children 隔离'],
    traps: ['Zustand/Redux 通过选择器（Selector）能做到精确按需更新（只在选中的状态变了才重绘），而 Context 只要 Provider value 变了，子级 useContext 组件无视选择条件必定重绘'],
    relatedIds: []
  },
  {
    id: 'interview_react_013',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React Ref 传递与 forwardRef、useImperativeHandle',
    difficulty: 3,
    frequency: 4,
    question: '为什么不能直接给函数组件传递 ref？forwardRef 的作用是什么？如何配合 useImperativeHandle 限制父组件对子组件 DOM 节点的越界操作？',
    answer: {
      short: '因为函数组件没有实例，直接传递 ref 会因无法挂载报错；forwardRef 用于将父组件的 ref 转发透传给子组件内部的物理 DOM；useImperativeHandle 可以自定义子组件暴露给父组件的方法，实现仅暴露安全的安全接口而非直接交出底层 DOM。',
      thinkingProcess: '1. 范式瓶颈：函数组件只是执行函数，没有 instance。React 无法将 ref 挂在上面。\n2. forwardRef 原理：高阶函数包装，接收 (props, ref)，将 ref 继续向下传递挂在真实的 <input> 节点上。\n3. 安全防范：如果父组件拿到了 <input> 物理节点，就能随意修改其 style, focus, 甚至把它删除，破坏封装性。useImperativeHandle 仅对外暴露比如 focus() 和 clear() 两个空方法。',
      deepDive: '使用 useImperativeHandle 自定义暴露接口的典型代码：\nconst FancyInput = forwardRef((props, ref) => {\n  const inputRef = useRef();\n  useImperativeHandle(ref, () => ({\n    focus: () => { inputRef.current.focus(); },\n  }));\n  return <input ref={inputRef} />;\n});',
      structured: [
        '问题：函数组件无类实例，直接传 ref 无法找到宿主而失效',
        'forwardRef：透传中转，接收 (props, ref) 作为参数以使内部接收外部 ref 绑定',
        'useImperativeHandle：接口代理，过滤暴露属性，拒绝直接暴露底层原生 HTML DOM 节点',
        '设计哲学：高内聚与封装性，父组件不应直接越权干预子组件的内部 DOM 细节'
      ]
    },
    keyPoints: ['forwardRef', 'useImperativeHandle', 'Ref 转发', '安全封装', 'DOM操作'],
    traps: ['过度使用 useImperativeHandle 会导致代码退回到 jQuery 时代那种父子组件靠方法呼叫交互的命令式状态，应当优先考虑声明式的数据流动驱动方式'],
    relatedIds: []
  },
  {
    id: 'interview_react_014',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'Error Boundary 错误边界降级隔离',
    difficulty: 3,
    frequency: 4,
    question: '什么是 React 的错误边界（Error Boundary）？它的实现原理是什么？为什么目前只能用类组件实现？',
    answer: {
      short: '错误边界是能捕获其子组件树中任何 JS 运行时错误并展示降级 UI 的组件；其原理是利用 getDerivedStateFromError() 计算错误状态并用 componentDidCatch() 上报日志；因为 Hooks 目前没有对应的函数式副作用钩子，故目前只能用 Class 组件编写。',
      thinkingProcess: '1. 线上痛点：在 JS 执行中如果某个列表渲染报了 null.toString()，会导致整个 React 树挂掉，页面瞬间一片空白。\n2. 隔离作用：错误边界包裹的区块如果挂了，只有该区块降级显示“组件出错了”，页面其他地方（如导航栏、侧边栏）继续能用。\n3. 类组件局限：React 目前并没有推出 useErrorBoundary 之类的官方 Hook 钩子，编写此功能必须继续保留 Class。',
      deepDive: '错误边界类组件的典型实现：\nclass ErrorBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError(error) {\n    return { hasError: true }; \n  }\n  componentDidCatch(error, errorInfo) {\n    logErrorToService(error, errorInfo); \n  }\n  render() {\n    if (this.state.hasError) return <h1>局部出错，正在紧急抢修...</h1>;\n    return this.props.children;\n  }\n}\n注意：它无法捕获事件处理器内部的错误、异步代码（setTimeout）、或者是服务端渲染（SSR）过程中的错误。',
      structured: [
        '作用：局限崩溃范围，杜绝局部小错误导致全局应用直接崩溃白屏的尴尬',
        '核心 API：getDerivedStateFromError (更新降级 State)、componentDidCatch (日志收集)',
        '无法捕获类型：事件 Handler 内部、异步 setTimeout/Promise 回调、服务端渲染 (SSR) 时错误',
        '行业标准：生产环境必须全局和主要版块（如 Dashboard Card）嵌套 ErrorBoundary'
      ]
    },
    keyPoints: ['Error Boundary', 'getDerivedStateFromError', '降级渲染', '日志监控'],
    traps: ['千万不要在错误边界内部又去执行会导致报错的逻辑，这会引发死循环崩溃，应当在降级 UI 中编写极其稳定、无复杂状态的纯 HTML/CSS 视觉呈现'],
    relatedIds: []
  },
  {
    id: 'interview_react_015',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: 'React Fiber 架构与并发模式时间切片原理',
    difficulty: 5,
    frequency: 5,
    question: '什么是 React Fiber？它解决了 React 15 之前架构的什么核心痛点？它是如何利用时间切片（Time Slicing）实现可中断渲染的？',
    answer: {
      short: 'React Fiber 是将递归重绘任务拆解为链表式小工作单元的新架构，解决了大型 DOM 树重绘时主线程被长期霸占导致页面卡死的问题；它利用时间切片机制，在浏览器每帧空闲时间执行微型工作单元，若超出 5ms 则主动交还主线程控制权，实现并发式可中断渲染。',
      thinkingProcess: '1. 历史痛点：React 15 更新时是递归遍历，一旦开始，JS 引擎会一直占用主线程直至遍历完，在此期间用户无法点击、浏览器无法动画，产生明显卡顿。\n2. 架构飞跃：Fiber 意为“纤维”，把工作拆成极细小的链表节点。每一个 Fiber 对应一个 React 元素，有 child, sibling, return 指针。\n3. 时间切片：基于 MessageChannel/RequestIdleCallback 模拟的调度器，每做完一个 Fiber 节点的 Diff，就看一眼时间是否用超（5ms），超了就挂起任务，等下一帧继续。',
      deepDive: 'Fiber 架构将渲染过程划分为了两个阶段：\n1. Reconciliation / Render 阶段：基于 Fiber 链表进行增量深度优先遍历和 Diff 计算。这个过程是可以被中断、暂停或重启的，因为不涉及任何真实 DOM 的修改。高优先级的用户交互（如输入）可以插队抢占主线程。\n2. Commit 阶段：将计算出来的 DOM 变更一次性、同步地写入物理 DOM。这个阶段是绝对不可打断的，以防止页面出现只渲染了一半的半挂状态。',
      structured: [
        '旧架构弊端：递归无法中途退出，大节点重绘霸占主线程，用户交互卡死丢帧',
        'Fiber 链表：将 VDOM 改写为带 child/sibling/return 双向指针的单链表网格，支持断点续传',
        '时间切片（Time Slicing）：任务切分为 5ms 工作单元，超出则退回控制权给浏览器绘制线程',
        '两大阶段：Render 协调阶段（可暂停、可插队）、Commit 提交阶段（同步、不可中断）'
      ]
    },
    keyPoints: ['React Fiber', '时间切片', '双向链表', '可中断渲染', 'Scheduler 调度器'],
    traps: ['因为 Render 阶段的代码可能会被 React 强行多次重复执行，所以千万不要在 Render 阶段或生命周期（如函数组件 body 直接执行处）写入引起外部副作用的代码，这会导致网络请求被莫名触发多次'],
    relatedIds: []
  },
  {
    id: 'interview_react_016',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React Fiber Lane 优先级机制',
    difficulty: 5,
    frequency: 3,
    question: '在 React Fiber 架构中，Lane 优先级机制是如何运作的？它是如何取代旧的 ExpirationTime 机制并解决优先级饥饿与多任务合并问题的？',
    answer: {
      short: 'Lane 优先级机制利用 31 位二进制的位掩码（Bitmask）代表不同的优先级通道，支持多优先级任务的批量合并与分离；相比 ExpirationTime 的单维度时间比对，Lane 能够支持更细粒度的任务插队和打散，利用位运算快速判断和组合任务集合。',
      thinkingProcess: '1. 技术深度：这是 React 调度系统最底层、最核心的算法设计之一。\n2. 机制升级：在 React 16 中，使用的是 ExpirationTime。它的限制是无法表示“批量更新”和“部分任务合并”。\n3. 二进制掩码：Lane 用 31 个比特位，每一位代表一个频带。例如 SyncLane, InputContinuousLane, DefaultLane。可以用位运算快速过滤和合并。',
      deepDive: 'React 17 引入 Lane 模型。二进制位掩码实现了多任务合并（Batching）：比如两个默认优先级的 State 变动，其 Lane 并集后可以合并在同一个渲染批次中执行。如果发生插队，高优先级的 Lane 直接通过位操作屏蔽掉低 Lane 任务，先进行同步协调渲染。低优先任务如果长期被抢占插队，React 会自动将其 Lane 提升，转化为高优先级 Lane 强制调度，防止饥饿发生。',
      structured: [
        '前身痛点：ExpirationTime 用单个数字表达优先级，无法实现多通道独立更新和异步任务的细粒度组合',
        '核心概念：Lane（车道），使用 31 位二进制位掩码，每一位对应一条车道级别',
        '位运算高效性：利用二进制按位与 (&) 、按位或 (|) 完成任务插队、过滤和批量更新判定',
        '饥饿防御：低优先任务被长时间插队后，React 自动将其过期时间强行拉满提升到同步车道强制调度'
      ]
    },
    keyPoints: ['Lane 优先级', '位掩码', 'ExpirationTime', '多任务批处理', '任务抢占'],
    traps: ['虽然 React 的优先级机制高度智能，但极高的渲染负载依然会导致主线程被填满，日常仍应使用 startTransition 降低次要状态更新的优先级以换取交互第一顺位响应'],
    relatedIds: []
  },
  {
    id: 'interview_react_017',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React 18 自动批处理（Automatic Batching）',
    difficulty: 3,
    frequency: 4,
    question: 'React 中的批处理（Batching）是什么？React 18 引入的自动批处理（Automatic Batching）与 React 17 在哪些场景下表现不同？如果想在 18 中强行同步更新该怎么做？',
    answer: {
      short: '批处理是将多个 state 更新合并为一次重新渲染以提升性能；React 17 仅在 React 原生事件回调和生命周期中支持批处理，在 Promise、setTimeout 等异步回调中无法合并；React 18 在任何场景下都默认支持自动批处理；若想强制同步更新，可使用 flushSync 包裹更新逻辑。',
      thinkingProcess: '1. 概念：如果连续调用三次 setCount，React 只会渲染一次。这是因为批处理将任务塞入了更新队列，在事件执行完毕后一次性应用。\n2. 历史局限：在 React 17 中，如果在 fetch().then() 异步回调中更新，由于脱离了 React 事件上下文，只能被迫执行多次重绘。\n3. 18 进化：全场景自动批处理（Automatic Batching），在 Promise、超时器内也能自动合并 state 渲染。',
      deepDive: '在 React 18 中，所有的更新都会自动合并。如果你有特定需求需要立即读取最新的 DOM 尺寸，必须打破批处理执行同步重绘，可以用 flushSync：\nimport { flushSync } from \'react-dom\';\nflushSync(() => { setCount(c => c + 1); });\n代码运行到这里，DOM 已经更新完毕，可以安全地读取 offsetHeight。',
      structured: [
        '批处理机制：合并多次 state 更新，一次性 Render 绘出，防止频繁重绘掉帧',
        'React 17 限制：异步回调函数、setTimeout、原生 DOM 监听器内无法进行合并批处理',
        'React 18 升级：真正的“全自动批处理”，在 Promise、超时器内也能自动合并 state 渲染',
        '同步逃生舱：使用 ReactDOM.flushSync(() => { ... }) 强令立刻执行物理重绘并阻塞主线程'
      ]
    },
    keyPoints: ['自动批处理', 'React 18 变革', 'flushSync', '异步渲染性能'],
    traps: ['频繁使用 flushSync 会极大破坏 React 协调引擎的任务编排和性能优化机制，只有在第三方不兼容库需要即时 DOM 测量时才能作为最后的手段使用'],
    relatedIds: []
  },
  {
    id: 'interview_react_018',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 18 Transitions 并发转场 API',
    difficulty: 4,
    frequency: 4,
    question: 'React 18 中的 startTransition 解决了什么场景下的卡顿问题？它与 debounce（防抖）/throttle（节流）有什么本质区别？',
    answer: {
      short: 'startTransition 用于标记非紧急的高清渲染更新（如大列表过滤、图表重绘），允许浏览器在用户继续输入时中途打断它，优先保障输入的流畅响应；这与防抖节流通过物理时间延迟任务不同，startTransition 是立刻开始渲染，但在 CPU 调度层以低优先级异步执行，可被随时插队打断。',
      thinkingProcess: '1. 典型痛点：一个搜索输入框，用户输入文本时，下方列表要过滤并重绘 2000 个节点。如果输入和列表更新绑定在同一个 state 上，输入框由于等待列表重排计算，会产生卡顿。\n2. 传统方案：用 debounce 延迟列表更新。缺点是必须等待 300ms 物理时间，体验不够即时。\n3. Transition 原理：将列表更新包裹在 startTransition 中。当用户继续打字，React 优先渲染打字的字符，在空闲时间继续算列表。',
      deepDive: 'useTransition 还会返回一个 isPending 状态，用于在次要任务计算期间展示全局的 Loading 骨架屏：\nconst [isPending, startTransition] = useTransition();\nconst handleChange = (e) => {\n  setInputValue(e.target.value); // 紧急更新，立刻重绘输入框保证流畅\n  startTransition(() => {\n    setSearchQuery(e.target.value); // 非紧急更新，低优先级异步计算大列表\n  });\n};',
      structured: [
        '解决场景：打字同步搜索、大面积卡片筛选、图表动态刷新等高重绘消耗的非紧急交互',
        '防抖防节流弊端：强行拖延物理时间执行任务，产生明显的人工响应迟钝滞后感',
        'Transition 并发机制：任务立刻交付调度器，中途如果遇到用户新指令输入，旧协调计算随时被腰斩丢弃，保障最高交互响应',
        '体验升级：isPending 属性能够完美感知低优先级后台计算的执行状态，无缝呈现骨架占位'
      ]
    },
    keyPoints: ['startTransition', 'useTransition', '并发模式', 'isPending', '防抖与节流'],
    traps: ['被传入 startTransition 回调的函数，必须是一个能够同步改变 state 的更新函数，不能在其内部写入异步的 API fetch 请求（应当是请求完数据后，对数据的 set 动作进行包装）'],
    relatedIds: []
  },
  {
    id: 'interview_react_019',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: 'React Server Components（RSC）架构深度对比',
    difficulty: 4,
    frequency: 4,
    question: '什么是 React Server Components（RSC，服务端组件）？它与传统的服务端渲染（SSR）有什么本质不同？它的底层网络传输格式是什么样的？',
    answer: {
      short: 'RSC 是在服务端运行并生成虚拟 DOM 数据流直接传输至客户端的组件，其代码和依赖不计入打包体积；它与传统 SSR（直接输出 HTML 字符串）不同，RSC 在客户端保留所有当前状态（无状态丢失），支持与客户端组件无缝混合交互；其底层传输为流式的 JSON-like 数据结构（RSC Payload）。',
      thinkingProcess: '1. 前沿探索：这是 React 18/19 最大的架构转型，Next.js App Router 的底层技术核心。\n2. 本质区别：SSR 目的是提升首屏速度（FCP），生成的是纯 HTML 字符串。客户端收到后需要经历注水（Hydration）。RSC 则是将组件在服务器拉取数据库直接算好，返回二进制的虚拟 DOM 节点，客户端直接贴入现有的 DOM 树。\n3. 零包体积优势：如果在 RSC 里引用了巨大的 marked markdown 渲染库，这个库只会在服务端被加载，其依赖包完全不计入打包在浏览器的 JS 里。',
      deepDive: 'RSC 的底层传输格式并非 HTML，也不是普通的 REST JSON，而是一种流式编码协议。客户端通过 React 运行时逐步读取这个流，无需清空已有的 input 输入值或滚动条位置，就能将最新的服务端数据无缝合入局部 DOM，极大地减少了网络往返的通信负担和浏览器体积。',
      structured: [
        'RSC（Server Component）：只在服务端执行并渲染，代码绝不打包进客户端 JS 包，极度瘦身',
        'SSR（Server-Side Rendering）：一种渲染管道技术，将全页转化为 HTML，需要客户端下载全部 JS 重新 Hydrate 注水激活',
        '混合架构：RSC 是服务器组件，内部可以嵌套客户端组件 (Client Component, 标有 \'use client\')，实现零缝合集成',
        '网络协议：采用专有 RSC Payload 数据格式进行流式传输，在保持客户端状态的前提下动态更新树结构'
      ]
    },
    keyPoints: ['RSC', 'SSR', 'Hydration', 'use client', '零打包体积', 'Next.js App Router'],
    traps: ['在 Server Component 中无法使用 useState、useEffect、useContext 以及各种原生事件处理器（如 onClick），一旦需要这些浏览器特有的运行时交互，必须通过在文件头部写 \'use client\' 声明其为客户端组件'],
    relatedIds: []
  },
  {
    id: 'interview_react_020',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'Suspense 与路由组件动态懒加载',
    difficulty: 3,
    frequency: 4,
    question: 'React.lazy 的工作原理是什么？如何配合 <Suspense> 容器在路由跳转时实现优雅的异步分包加载和骨架屏加载？',
    answer: {
      short: 'React.lazy 利用动态 import() 语法拦截组件加载，返回一个包装过的 Promise；当组件未加载完毕时，Suspense 容器会捕获这个 Pending 状态并自动渲染 fallback 中的占位组件，加载成功后恢复显示子组件。',
      thinkingProcess: '1. 场景分析：首屏如果打包了巨大的 JS 代码，用户会经历漫长的白屏。必须在路由层面做 Code Splitting。\n2. lazy 原理：lazy() 动态加载组件，Babel 看到 import() 会自动打包成独立的 chunk 文件，运行时才发起加载。\n3. Suspense 机制：子组件抛出 Promise，Suspense 捕获并挂起组件，渲染 fallback，等 Promise resolve 之后恢复子树渲染。',
      deepDive: '动态组件懒加载配合 Webpack Chunk 命名：\nconst Detail = React.lazy(() => import(/* webpackChunkName: "detail" */ \'./Detail\'));\n在 App 根部包裹 <Suspense fallback={<SkeletonLoader />}><Detail /></Suspense> 即可实现物理文件按需拉取，优化首屏。',
      structured: [
        'React.lazy：基于 JS 动态 import()，将组件编译分割成独立的静态 js 分片',
        'Suspense 容器：捕获子节点抛出的 Promise，在 pending 期自动激活 fallback 占位图',
        '捕获机制：与 Error Boundary 捕获 Error 的逻辑一致，Suspense 则是捕获 Promise 抛出',
        '体验保障：防范白屏卡顿，网络延迟时平滑展示骨架组件，加载完自动热插拔替换'
      ]
    },
    keyPoints: ['React.lazy', 'Suspense', '代码分割', '动态 import', '骨架屏 fallback'],
    traps: ['动态组件懒加载必须放置在 <Suspense> 内部。如果没有被 Suspense 包裹，当 React 尝试异步加载时会抛出未捕获的渲染异常，直接导致整个应用崩溃白屏'],
    relatedIds: []
  },
  {
    id: 'interview_react_021',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: '状态管理生态选型：Zustand vs Redux vs MobX vs Context',
    difficulty: 4,
    frequency: 4,
    question: '在现代 React 应用中，面对 Redux Toolkit、MobX、Zustand 和原生的 Context API，我们该如何根据项目体量和性能要求进行架构选型？',
    answer: {
      short: '原生 Context 仅适合低频更新的全局简单值；Redux 模式规范成熟但模板冗余，适合超大型团队多人协作；MobX 采用响应式代理，适合高频局部刷新；Zustand 极简、零模板、基于选择器进行精确按需订阅更新，是中小型现代项目的首选方案。',
      thinkingProcess: '1. 架构师思维：技术选型没有绝对的好坏，只有业务合适度与维护成本的比拼。\n2. Context 局限：缺乏精确更新机制，高频 state 会导致子树重绘大雪崩。\n3. Redux 传统：Actions、Reducers、Store、单向流，概念多但极其规范成熟。',
      deepDive: 'Zustand 在外部维护了一个纯 JS 的 store 闭包，并不依赖 React 的上下文广播。当 store 发生改变，Zustand 在外部触发监听器，利用 useSyncExternalStore Hook。它会根据选择器 const user = useStore(state => state.user) 进行浅比较，只有订阅的对象地址改变了才会重新渲染该组件。这在根源上彻底阻断了全局状态更新对非相关组件的重绘污染。',
      structured: [
        'Context API：原生零安装，适合配置级低频广播，不宜作为频繁刷新的数据中心',
        'Zustand：现代最推崇，无冗余 Boilerplate，基于 Selector 精细化按需订阅，性能爆表',
        'Redux / Redux Toolkit：绝对严格的单向数据流与标准，易于工程化规范大团队协作调试',
        'MobX：基于 Observable（类似 Vue 响应式），数据直接修改，适合复杂树形关系数据高频修改'
      ]
    },
    keyPoints: ['Zustand', 'Redux Toolkit', 'MobX', 'Context API', '状态选型', '按需订阅'],
    traps: ['使用 Zustand 时如果忘记书写 Selector（如 const state = useStore()），会导致组件订阅了整个 store。这会使全局任何一个 state 发生变动都触发该组件的重绘，失去优化的价值'],
    relatedIds: []
  },
  {
    id: 'interview_react_022',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'Redux 异步中间件：Thunk vs Saga 架构对比',
    difficulty: 3,
    frequency: 3,
    question: 'Redux 异步中间件在 Redux 数据流中起到什么作用？请对比 Redux Thunk 和 Redux Saga 的设计模式与核心区别。',
    answer: {
      short: '异步中间件用于在 dispatch 行动到达 Reducer 之前执行异步请求、日志上报等副作用；Redux Thunk 采用回调函数模式，极易编写但逻辑复杂时易陷入回调地狱；Redux Saga 基于 Generator（生成器）和协程机制，使用声明式的 Effects 描述副作用，让复杂的异步逻辑像同步代码般清晰。',
      thinkingProcess: '1. 数据流管道：Redux 默认只支持同步的 Action 派发。异步请求必须由中间件拦截。\n2. Thunk 思想：允许 dispatch 接收函数，函数里可以拿到 dispatch 引用，执行异步操作。\n3. Saga 思想：运行一个独立的 Saga 协程监听线程，监听特定 Action，使用 Generator 机制管理。',
      deepDive: 'Saga 的核心优势在于易于测试和支持复杂的异步流控制（如竞态条件、取消请求等）。例如声明式调用 yield call(api.fetchResult)，极易写单元测试进行 Mock。目前在新项目中，Saga 已较少作为首选，中小型项目多选用 Zustand，大型项目多选用 RTK Query。',
      structured: [
        '中间件原理：拦截 dispatch(action)，提供在到达 reducer 前的第三方扩展能力（如日志、异步）',
        'Redux Thunk：直接将 action 改造为带有副作用执行能力的 function，轻量简单，对异步流控制力较弱',
        'Redux Saga：引入协程与 Generator 机制，提供 cancel/fork/takeLatest 等极强的高级并发控制 API',
        '现代趋势：中小型项目已被 Zustand 淘汰，大型 Redux 项目多已迁移到 RTK Query，Saga 已较少作为新项目首选'
      ]
    },
    keyPoints: ['Redux中间件', 'Redux Thunk', 'Redux Saga', 'Generator 协程', '副作用控制'],
    traps: ['在 Redux Thunk 中，如果把异步请求写在 Action Creator 里，这些异步逻辑会散落在各个模块中，很难进行跨组件的竞态控制和错误统一拦截'],
    relatedIds: []
  },
  {
    id: 'interview_react_023',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: '虚拟 DOM Diff：React vs Vue 2 vs Vue 3 核心算法对比',
    difficulty: 4,
    frequency: 5,
    question: 'React、Vue 2 和 Vue 3 的虚拟 DOM Diff 算法各有什么核心差异？它们在优化渲染和移动节点时的策略有何不同？',
    answer: {
      short: 'React 采用单向链表单指针的从左向右单侧遍历对比；Vue 2 采用双端比较算法（双指针收缩遍历）；Vue 3 引入了基于最长递增子序列（LIS）的快速 Diff 算法，最大程度减少了节点复用移动时的物理 DOM 映射开销，性能在三者中最高。',
      thinkingProcess: '1. 跨框架对比思维。\n2. React 机制：受限于 Fiber 链表单向指针，无法实现双端比较，使用第一轮循环对旧节点进行哈希映射，遍历新数组计算位移。\n3. Vue 2 双端：新前旧前、新后旧后、新前旧后、新后旧前两两对比。\n4. Vue 3 核心：合并相同头部尾部，余下乱序部分使用“最长递增子序列”算出相对最不需要发生移动的节点，移动剩余节点。',
      deepDive: 'Vue 3 在算法之外，更强的地方在于编译时静态标记（PatchFlags），只对动态节点做靶向更新。React 只能在运行时对全量 Fiber 节点树进行深度优先遍历计算差异，因此对运行时算力要求更高，重度依赖 Fiber 时间切片和手动 memo 调优。',
      structured: [
        'React Diff：受制于单向链表结构，采用单侧对比和 Map 映射快速寻址移动',
        'Vue 2 Diff：经典的双指针双端比较算法，首尾收缩效率极佳',
        'Vue 3 Diff：预处理头部/尾部相同节点 + LIS (最长递增子序列) 移动节点算法，物理移动次数最少',
        '架构差异：Vue 依靠静态模板编译优化（PatchFlags/SFC）极大减负了 Diff 开销；React 纯运行时纯函数式遍历，重度依赖 Fiber 时间切片和手动 memo 调优'
      ]
    },
    keyPoints: ['Diff 比较', '最长递增子序列', '双端比较', '静态标记 PatchFlags', '编译期优化'],
    traps: ['虽然 React 的 Diff 相对没做静态编译优化，但由于现代 CPU 算力极强，对于常规规模的组件树，这些微秒级的算法差异在用户感官上完全是零感知的，核心性能瓶颈一般出在不合理的无防备全局重绘上'],
    relatedIds: []
  },
  {
    id: 'interview_react_024',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React Portal 传送门与全局 Modal 渲染',
    difficulty: 2,
    frequency: 4,
    question: 'React Portals（传送门）的作用是什么？为什么它适合做全局 Modal、Tooltip 弹窗？Portal 内部的事件冒泡机制有什么特别之处？',
    answer: {
      short: 'React Portals 允许将组件的 DOM 节点挂载到当前组件树之外的任意物理 DOM 节点；它适合做弹窗以防止被父级的 CSS 溢出截断（overflow:hidden）或层级盖住（z-index）；Portal 挂载的节点虽然在物理 DOM 之外，但在 React 虚拟 Fiber 树上依然保持原有的父子层级，故原生的合成事件冒泡可以正常向上穿透。',
      thinkingProcess: '1. 痛点：写全局 Modal 时，若挂载在组件内部，容易因为祖先元素设置了 transform、overflow: hidden 或 z-index 导致 Modal 截断。\n2. Portal 原理：使用 createPortal(JSX, targetDOM)。React 会在物理上把这个 DOM 分支贴入 targetDOM 节点，避开局部 CSS 束缚。\n3. 事件回溯：事件系统是合成的，按照 Fiber 树层级向上冒泡，而不是物理 DOM 节点。',
      deepDive: '在 Portal 容器中绑定的点击事件仍能被其 React 父组件捕获。这保障了在把交互组件物理剥离出宿主的同时，依然能维持 React 内聚的数据交互和状态通知管道畅通。',
      structured: [
        '作用: createPortal 允许将 VDOM 组件传送到页面任何指定容器下渲染',
        '消除截断: 解决父容器 overflow: hidden 导致气泡弹窗被剪切、或者层级 z-index 互相盖住的恶劣体验',
        '冒泡反常识: Portal 内部的事件冒泡依然会沿 React 组件树向上投射，即使它们在 HTML 树中是隔离的',
        '核心优势: 完美实现了物理 DOM 排版剥离与逻辑事件流合一'
      ]
    },
    keyPoints: ['React Portal', 'createPortal', '样式溢出', 'Portal 事件冒泡', '弹窗组件'],
    traps: ['由于 Portal 内部的事件依然会向 React 父级冒泡，如果在 Modal 内做点击交互时不想影响父级，必须显式在 Modal 容器上调用 e.stopPropagation() 以防止无意义触发外层事件监听'],
    relatedIds: []
  },
  {
    id: 'interview_react_025',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 性能分析工具与 Profiler 调优',
    difficulty: 3,
    frequency: 4,
    question: '在大型 React 项目中如果出现掉帧卡顿，如何使用 React Developer Tools 中的 Profiler 进行性能检测？在分析图表时，如何快速定位无意义重绘的罪魁祸首？',
    answer: {
      short: '通过 Profiler 录制用户交互操作，观察火焰图和耗时排行图；重点关注黄色和深灰色长柱卡片，点击组件后侧边栏会详细显示“Why did this render”（为什么发生重绘），依据此提示进行精准的缓存调优。',
      thinkingProcess: '1. 实战诊断：前端遇到性能问题不能瞎猜，必须用 Profiler 数据说话。\n2. Profiler 使用：在浏览器 DevTools 中录制用户交互。\n3. 火焰图分析：黄色代表渲染耗时高，灰色代表成功跳过渲染（Memo 拦截成功）。',
      deepDive: '如果看到 Props changed: [onClick] 说明子组件虽然用了 React.memo，但因为父组件每次生成的 onClick 函数引用不同导致失效。此时优化动作是对父组件的 onClick 使用 useCallback 缓存。在生产环境下需要配置 keep_classnames 或 profile 编译指令参数才能保留完整分析名。',
      structured: [
        '工具依托：React Developer Tools 浏览器插件的 Profiler 面板',
        '火焰图视角：纵轴是组件嵌套链条，横轴代表渲染耗时。深灰色为成功跳过渲染的节点，黄色为重绘卡顿处',
        '诊断法宝：开启 "Record why each component rendered" 设置，侧边栏直接告知 Props/State 变动具体键名',
        '优化闭环：根据指标，若 Prop 改变是函数则补 useCallback，若是对象补 useMemo，若是 state 则考虑状态下放'
      ]
    },
    keyPoints: ['Profiler', '火焰图', 'Why did this render', '性能调优', '大列表卡顿'],
    traps: ['Profiler 必须在 React 的开发模式下才能捕捉到如此详尽的重绘原因，生产环境需特殊打包配置。'],
    relatedIds: []
  },
  {
    id: 'interview_react_026',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'useEffect 清理函数的执行时机与内存泄漏控制',
    difficulty: 2,
    frequency: 5,
    question: 'useEffect 返回的清理函数（Cleanup Function）在什么时机执行？它对于控制组件内存泄漏有什么关键作用？',
    answer: {
      short: '清理函数在组件卸载时执行，且在每次组件因依赖更新重新触发 Effect 渲染之前也会执行；主要用于注销定时器、取消 API 请求、解绑全局 DOM 事件以防止残留常驻内存造成内存泄漏。',
      thinkingProcess: '1. 副作用管理：开创了监听和清除放在一起的函数式模式。\n2. 执行时机：组件卸载，或者依赖项变动在运行新 Effect 之前，先清除老 Effect 产生的垃圾。\n3. 泄漏预防：最典型的场景是 addEventListener 必须在 cleanup 里 removeEventListener。',
      deepDive: '如果不做清理，例如在 useEffect 中进行了 `window.addEventListener(\'resize\', handle)`。当组件销毁后，`handle` 的函数引用由于挂载在全局 `window` 上，JS 的垃圾回收（GC）无法释放，这就导致了内存泄漏，且每次挂载都会增加一个新的监听器，最终使页面卡死崩溃。',
      structured: [
        '卸载执行：在组件被 DOM 彻底注销移除时触发执行',
        '更新执行：当 deps 改变引发重绘前，先执行上一次 Effect 的清理函数擦屁股',
        '防漏手段：在清理函数中清除 timer、abort 请求、移除事件监听、取消订阅',
        '示例代码：return () => { clearInterval(timer); }'
      ]
    },
    keyPoints: ['useEffect', '清理函数', '内存泄漏', '解绑监听', '垃圾回收'],
    traps: ['在开发环境下，React 18+ 的 StrictMode 会在组件挂载时故意执行“挂载 -> 卸载 -> 挂载”两次流程，以强行暴露并排查你未写清理函数的漏洞'],
    relatedIds: []
  },
  {
    id: 'interview_react_027',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: '自定义 Hooks 封装最佳实践与逻辑复用',
    difficulty: 3,
    frequency: 4,
    question: '如何封装一个高内聚、低耦合的自定义 Hook（如 useFetch/useLocalStorage）？自定义 Hook 与普通辅助函数的根本区别是什么？',
    answer: {
      short: '自定义 Hook 必须以 use 开头，内部可以调用其他 React 原生 Hook（如 useState/useEffect）并返回状态值或操作函数；与普通辅助函数的根本区别在于它能够持有并更新 React 的“响应式状态与副作用生命周期”，直接驱动关联组件重绘。',
      thinkingProcess: '1. 自定义 Hook 理念：不仅仅是封装静态逻辑，更是封装“状态（State）与副作用（Effect）”的复合体。\n2. 命名契约：必须以 use 开头，eslint-plugin-react-hooks 会根据这个名字来检查其内部是否正确使用了 Hooks 规范（例如不放入 if 语句）。\n3. 驱动重绘：自定义 Hook 返回的 state 只要被修改，引用该 Hook 的所有组件都会触发正常的更新链路。',
      deepDive: '封装 useLocalStorage 的核心：\n```javascript\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n  const setValue = value => {\n    setStoredValue(value);\n    window.localStorage.setItem(key, JSON.stringify(value));\n  };\n  return [storedValue, setValue];\n}\n```\n这使得本地缓存的读写逻辑完全内聚成一个类似 useState 的 API，极大减轻了业务组件的书写负担。',
      structured: [
        'Hook 本质：封装状态逻辑（Stateful Logic）的函数，可以内部调用其他 Hooks',
        '普通辅助函数限制：纯静态，无法接入 React 的重绘调度通道和 Fiber 上下文',
        '命名规则：以 use 开头，支持 Hooks 的规范校验检查',
        '设计精髓：高内聚（逻辑内藏）、低耦合（通过参数和返回值进行交互）'
      ]
    },
    keyPoints: ['自定义 Hooks', '逻辑封装', '响应式状态', '状态共享', '代码复用'],
    traps: ['自定义 Hook 的调用会为每个使用它的组件独立创建一个隔离的 Hook 状态链表，组件之间不会共享 Hook 的内部状态，若需要跨组件共享状态，需要配合 Context 或外部 store'],
    relatedIds: []
  },
  {
    id: 'interview_react_028',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React 18 严格模式（StrictMode）挂载两次机制',
    difficulty: 2,
    frequency: 4,
    question: '在 React 18 的本地开发环境下，为什么 useEffect 的空依赖数组会执行两次回调？这是由于什么机制引起的？如何正确应对？',
    answer: {
      short: '这是由于 React 18 在开发模式的 StrictMode（严格模式）下，会故意对组件进行模拟卸载再重新挂载（Mount -> Unmount -> Mount）；目的是强行暴露未妥善做清理的副作用（如未清除的定时器或事件监听），只需编写正确的清理函数即可，无需强行关闭此检测。',
      thinkingProcess: '1. 开发困惑：很多新手升级 React 18 后，发现请求发了两次，以为是 Bug，甚至去改源码关掉 StrictMode。\n2. 设计初心：React 未来支持“离屏渲染（Offscreen）”和“并发重组”，这要求组件随时可能在后台被挂起和销毁。严格模式在开发期模拟这种多次挂载，能够提早排查出隐藏的内存泄漏漏洞。\n3. 解法指导：不要尝试写 Hack 阻止它执行两次，而是确保你的 Effect 都有清理函数。如果是 fetch 发两次，可以使用 AbortController 进行请求取消。',
      deepDive: '应对 StrictMode 双挂载的 API 取消请求示例：\n```javascript\nuseEffect(() => {\n  const controller = new AbortController();\n  fetch(\'/api/data\', { signal: controller.signal })\n    .then(res => res.json())\n    .then(data => setData(data));\n  return () => {\n    controller.abort(); // 第二次重挂时，会立刻取消第一次正在进行中的请求\n  };\n}, []);\n```',
      structured: [
        '双挂载现象：严格模式下，挂载生命周期故意走两遍（Mount-Unmount-Mount）',
        '设计目的：提前排查不规范副作用，为并发模式及后台标签页挂起（Offscreen）提供稳定保障',
        '应对策略：补全清理函数（cleanup），例如定时器、事件监听的注销',
        '防范误区：不要滥用 useRef 计数器去阻断第二次执行，顺应 React 幂等性规范设计代码'
      ]
    },
    keyPoints: ['严格模式', 'StrictMode', '双挂载', 'AbortController', '幂等性'],
    traps: ['千万不要在生产环境包里保留把严格模式当作全局包裹的做法（虽然 React 自动在生产包过滤了双挂载，但规范写法依然能保持代码纯净）'],
    relatedIds: []
  },
  {
    id: 'interview_react_029',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React SSR 水合失败（Hydration Mismatch）定位与治理',
    difficulty: 4,
    frequency: 4,
    question: '在 React 服务端渲染（SSR）项目中，什么是“水合失败”（Hydration Mismatch）？它是如何发生的？在项目里该如何定位和治理这种错误？',
    answer: {
      short: '水合失败是服务端生成的 HTML 结构与客户端初次渲染生成的虚拟 DOM 树结构不一致，导致浏览器水合对比失败并抛出警告；常见原因为使用本地时间/随机数、或者 HTML 标签嵌套错误；定位可通过控制台差异 DOM 输出提示，治理可采用 useEffect 延迟客户端特定逻辑加载。',
      thinkingProcess: '1. SSR 核心原理：服务端用 renderToString 输出静态 HTML，客户端接手后拉取 JS，React 遍历 DOM 树在其上绑定事件（Hydration 水合）。\n2. 失败原因：在水合遍历时，React 发现“期待一个 <div>，这里却是一个 <p>”，这就发生了 mismatch。为了安全，React 只能丢弃服务器的 DOM 并重新全量重绘，导致 SSR 性能大打折扣并可能出现闪烁。\n3. 典型错误：在服务端 `new Date()` 渲染出了北京时间，但在美国客户端由于时区不同，水合时渲染出了美国时间。',
      deepDive: '解决水合不一致的经典方案（两阶段渲染）：\n```jsx\nfunction ClientOnlyComponent() {\n  const [isMounted, setIsMounted] = useState(false);\n  useEffect(() => {\n    setIsMounted(true); // useEffect 仅在客户端挂载后运行，避开服务端和初次水合\n  }, []);\n  if (!isMounted) return <Skeleton />; // 服务端和客户端首屏渲染一致的占位图\n  return <div>{new Date().toLocaleString()}</div>; // 客户端专属动态数据\n}\n```\n对于某些无法避免微小差异的静态节点，可以在 HTML 元素上加上 `suppressHydrationWarning={true}` 强制忽略该节点的对比警告。',
      structured: [
        '水合失败：服务端生成的 HTML 与客户端首次 render 的虚拟 DOM 结构/内容无法匹配一致',
        '高发元凶：使用了 Date.now()、Math.random()，或者 HTML 嵌套违背规范（如 <p> 嵌套 <div>）',
        '危害：破坏局部水合，导致 React 被迫丢弃服务端节点重新执行重绘，加载变慢且屏幕跳闪',
        '治理法则：利用 useEffect 确保客户端独有状态延迟加载，使用 suppressHydrationWarning 标记豁免节点'
      ]
    },
    keyPoints: ['Hydration Mismatch', 'SSR 优化', '水合注水', 'suppressHydrationWarning', '两阶段渲染'],
    traps: ['不要滥用 suppressHydrationWarning。它只是选择性屏蔽控制台警告，并没有解决水合失败导致的“重绘性能损耗”本质问题，必须根治数据一致性'],
    relatedIds: []
  },
  {
    id: 'interview_react_030',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'useLayoutEffect 与 useEffect 深度对比',
    difficulty: 3,
    frequency: 4,
    question: 'useLayoutEffect 和 useEffect 有什么根本区别？它们在浏览器的渲染管线（Layout/Paint）中各处于什么时机？在什么业务场景下必须使用 useLayoutEffect？',
    answer: {
      short: 'useEffect 是在浏览器绘制（Paint）完成、屏幕显示画面后异步执行，不阻塞渲染；useLayoutEffect 是在 DOM 变更之后、浏览器进行排版与绘制之前同步执行，会阻塞页面渲染；当需要读取或操作 DOM 尺寸并避免页面闪烁（如 Tooltip 动态定位）时，必须使用 useLayoutEffect。',
      thinkingProcess: '1. 渲染管线对比：DOM 改变 -> Layout -> useLayoutEffect -> Paint -> useEffect。\n2. 机制分析：useEffect 优于 useLayoutEffect，因为它不阻塞主线程。但如果我们在 useEffect 里去获取某个 DOM 宽度，然后修改它的 left，这会导致浏览器先画一帧（旧left），然后 useEffect 触发，修改 left，再重排画第二帧，产生明显的“闪烁”。\n3. 同步阻塞：useLayoutEffect 里的代码是同步执行的，会把 DOM 修改直接在绘制前合并，用户看到的就是定位好的最终画面。',
      deepDive: 'useLayoutEffect 运行在 React 的 commit 阶段。它比浏览器开始绘制像素（Paint）要早。如果在 useLayoutEffect 中发生死循环或者耗时极长的同步计算，整个浏览器页面会卡死在白屏状态，因此除 DOM 测量修改外，所有网络请求、定时器等副作用一律只使用 useEffect。',
      structured: [
        'useEffect：异步、Paint 绘制后触发，对流畅度友好，不阻塞浏览器交互',
        'useLayoutEffect：同步、Layout 计算后 Paint 前触发，会阻塞渲染，保证 DOM 合并计算',
        '闪烁治理：任何涉及测量 DOM 尺寸（getBoundingClientRect）并微调样式的动作必须在此执行',
        '使用忠告：默认 99% 场景无脑选 useEffect，只有测量和防闪烁布局时才使用 Layout 变体'
      ]
    },
    keyPoints: ['useLayoutEffect', 'useEffect', '渲染管线', '视觉闪烁', 'DOM测量'],
    traps: ['如果在 SSR 项目中使用 useLayoutEffect，由于服务端没有真实的浏览器 DOM 树，控制台会抛出明显的“useLayoutEffect does nothing on the server”警告，可使用动态判断降级为 useEffect'],
    relatedIds: []
  },
  {
    id: 'interview_react_031',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: 'React Server Actions（React 19）全栈数据流',
    difficulty: 4,
    frequency: 4,
    question: 'React 19 全面引入的 Server Actions 机制是什么？它是如何重塑客户端与服务端交互数据流的？如何配合 <form> 的 action 属性实现渐进增强？',
    answer: {
      short: 'Server Actions 是允许客户端直接像调用本地异步函数一样调用运行在服务端的函数的全栈交互协议；客户端通过 form 标签原生关联此 action，即使在 JS 未加载加载完成前也支持表单提交（渐进增强），并内置了并发重试和加载状态感知。',
      thinkingProcess: '1. 颠覆性技术：这是 React 从纯前端框架走向“全栈框架”的里程碑（与 Next.js 深深度绑定）。\n2. 传统流程：写个表单 -> addEventListener 拦截 -> fetch 发 JSON 给 API -> Express 路由处理 -> 返回 JSON -> set state。前后端割裂。\n3. Server Actions：在服务端写一个异步函数，写上 `"use server"`。客户端表单直接 `<form action={myServerAction}>`。React 自动在底层编译成一个 POST 接口，自动传递 FormData，甚至直接返回服务端修改后的最新 state，两端合一。',
      deepDive: '渐进增强（Progressive Enhancement）优势：\n在传统 SPA 中，如果网络极差，页面骨架虽然出来了，但 JS bundle 还没下完并绑定 onClick，用户点击提交按钮毫无反应，体验极其糟糕。在 Server Actions 中，React 19 会利用 HTML 原生的 `<form action=\"/POST_URL\">` 特性，在 JS bundle 加载完前通过原生的浏览器表单提交机制正常与服务器通信。当 JS 加载完后，自动升级为无刷新的 Fetch 拦截模式。',
      structured: [
        '本质：服务端异步函数直接对外暴露，客户端直接 Import 并以普通函数方式触发调用',
        '全栈无接口化：彻底消除了手动编写冗长 fetch API 和服务端 Web 路由（Routes）的代码负担',
        '渐进增强：利用 HTML5 标签机制，支持在客户端 JS 尚未下载激活前，原生提交表单完成处理',
        '联合 Hook：配合 useFormStatus, useActionState, useOptimistic 组成强大的交互闭环'
      ]
    },
    keyPoints: ['Server Actions', 'React 19', '渐进增强', 'useActionState', '全栈开发', 'Next.js'],
    traps: ['由于 Server Action 本质是在服务器端运行，所以传入该 action 函数的参数和返回值必须是可序列化（Serializable）的（例如普通的 Object/Array/String），无法传递复杂的 JS 类实例或函数闭包'],
    relatedIds: []
  },
  {
    id: 'interview_react_032',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'React Diff 算法三大层级比较规则',
    difficulty: 3,
    frequency: 4,
    question: '请详细阐述 React Diff 算法的三个比较级别：Tree Diff、Component Diff 和 Element Diff 分别的具体比对和匹配规则。',
    answer: {
      short: 'Tree Diff 对同层级节点进行深度优先比较，跨层级直接销毁新建；Component Diff 对同类型组件进行复用，不同类型直接重造；Element Diff 对同级子节点结合唯一 Key 进行 Map 哈希比对以识别移动、插入与删除。',
      thinkingProcess: '1. 细节展开：将 Diff 拆开成三个层面介绍，展示扎实的底层原理功底。\n2. Tree Diff：基于 DOM 树结构。只比较相同父级的子节点，一旦跨层移动直接不认。\n3. Component Diff：基于组件类名。如果同名且 Props 没怎么变，只触发 patch；不同名直接拔掉换新的。\n4. Element Diff：基于相同层级的子节点列表，通过 key 寻找旧列表中对应的旧节点并决定物理位移。',
      deepDive: '在 Element Diff 中，React 使用了一个名为 `lastPlacedIndex` 的游标。如果在旧列表中发现复用节点的旧索引小于这个游标，说明该节点在新列表中跑到了前面，需要进行物理 DOM 移动。如果在旧列表中完全找不到这个 key，说明是新加的，会执行插入。这保证了在不破坏整体 DOM 树结构下进行最小开销修改。',
      structured: [
        'Tree Diff：同层深度优先遍历。跨层级移动节点的操作会导致老节点彻底注销、新节点彻底重新挂载',
        'Component Diff：组件类型比对。类型相同则按 Diff 链继续比对子代，类型不同则直接拆除老树重新建新树',
        'Element Diff：同级子列表节点比对。分为两轮遍历，第一轮尝试复用，第二轮对未匹配项构建 Map 并移动游标'
      ]
    },
    keyPoints: ['Tree Diff', 'Component Diff', 'Element Diff', 'lastPlacedIndex', '协调算法'],
    traps: ['Element Diff 比对如果列表非常长，且频繁在列表首部插入元素，会导致所有后续节点的索引都发生改变，造成大量的节点物理移动开销，这就是为什么对于大列表应加倍注意优化'],
    relatedIds: []
  },
  {
    id: 'interview_react_033',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: '组件通信与状态提升（Lifting State Up）',
    difficulty: 2,
    frequency: 4,
    question: '当两个同级组件（兄弟组件）需要共享或根据彼此的行为发生数据交互时，在 React 经典的声明式流中该如何设计？什么叫状态提升？',
    answer: {
      short: '状态提升是将两个兄弟组件需要共享的状态提取并声明到它们共同的最近父组件（Ancestor）中，由父组件通过 Props 将状态和更新该状态的回调函数向下传递，实现两端同步联动。',
      thinkingProcess: '1. 基础架构：React 没有像 Vue 那样的 EventBus 机制，提倡单向流动。\n2. 兄弟联手：A 和 B 是同级，A 的输入要影响 B。A 不能直接发消息给 B。\n3. 解决方案：把这个 state 搬迁到 A 和 B 的爸妈（Parent）那儿，Parent 拥有这个 state，传 `value` 给 B，传 `onChange` 回调给 A。',
      deepDive: '如果状态提升层级过深，会导致中间所有中转的组件都要层层传递 props（Prop Drilling），让组件树变得极难维护。针对这种复杂的跨层共享，应该停止提升，改为使用 Context 或是轻量状态库（Zustand/Redux）进行全局接入。',
      structured: [
        '状态提升：将共享的状态提取到公共的最近父节点，由父节点扮演数据中心',
        '数据分发：父级通过 props 将只读数据向下灌输，子组件消费展现',
        '事件反馈：子组件通过执行父级传入的回调函数，反向通知父组件修改 State 促成刷新',
        '瓶颈防范：层级过多产生 Prop Drilling 污染，需用 Context 或全局 store 拆解'
      ]
    },
    keyPoints: ['状态提升', '单向数据流', 'Prop Drilling', '组件通信', '回调函数'],
    traps: ['提升状态时，尽量只提升“必不可少”的共享核心状态，不要把子组件纯私有的局部状态（如输入框是否 focus 状态）也跟着盲目提升，这会导致无意义的父组件整体重绘'],
    relatedIds: []
  },
  {
    id: 'interview_react_034',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'CSS in JS 运行时性能与替代方案',
    difficulty: 3,
    frequency: 3,
    question: '以 styled-components 为代表的 CSS in JS 方案在提升开发体验的同时，会对 React 带来哪些运行时的性能损耗？在大型高频交互项目下，有什么现代替代方案？',
    answer: {
      short: 'styled-components 会在组件重绘时动态执行样式解析、哈希计算并在 head 标签中插入新的 style 样式，这占用了 CPU 主线程并极易造成动画掉帧；在高频交互场景下，应使用 Vanilla Extract、Tailwind CSS 或 CSS Modules 等零运行时（Zero-Runtime）或静态编译方案替代。',
      thinkingProcess: '1. 性能痛点：styled-components 很好用，支持在 CSS 里写 JS 逻辑。但它是运行时（Runtime）解析的。\n2. 运行时代价：每次组件 rerender，CSS-in-JS 库都要提取 props、算新的 CSS 规则、哈希比对、把新样式插进 DOM。当遇到上千个卡片做拖拽排序，主线程会卡出明显的顿挫。\n3. 破局之道：静态编译样式，把样式的提取和合并挪到打包期（Build time）完成。',
      deepDive: '现代替代方案 Vanilla Extract 或是 CSS Modules，它们采用 **Zero-runtime（零运行时）**。样式在 Webpack/Vite 打包时就直接输出为普通的静态 `.css` 文件，组件挂载时只做类名字符串拼接（className="btn active"）。这消除了所有运行时解析的 JS 开销，性能媲美手写普通 CSS。',
      structured: [
        '运行时耗损：JS 解析 CSSOM、生成哈希类名、修改 CSS 规则树，高频变动导致主线程拥堵',
        '动态样式劣势：在 react 并发渲染（Concurrent）模式下，高频 style 插入可能会和浏览器渲染发生线程抢占',
        'Vanilla Extract / CSS Modules：静态输出为物理 CSS，运行时零开销，适合追求极限速度项目',
        'Tailwind CSS：编译期生成原子类，没有运行时的性能开销，开发体验优'
      ]
    },
    keyPoints: ['CSS in JS', 'styled-components', '运行时开销', 'CSS Modules', 'Zero-Runtime', '性能损耗'],
    traps: ['如果使用 styled-components，尽量不要在 CSS 模板字符串中通过 `${props => props.val}` 高频更新定位（如 left 偏移），应该使用普通的 inline style style={left} 来躲开 CSSOM 的高频解析重插'],
    relatedIds: []
  },
  {
    id: 'interview_react_035',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: 'React Scheduler 调度原理与任务分片实现',
    difficulty: 5,
    frequency: 4,
    question: 'React Scheduler 是如何进行任务优先权排序和宏任务分片的？为什么它没有直接使用原生的 requestIdleCallback？它是如何用 MessageChannel 模拟时间切片的？',
    answer: {
      short: 'React 没使用 requestIdleCallback 是因为其在不同浏览器上执行频率极不稳定且在 Safari 上完全不支持；Scheduler 利用 MessageChannel 创建一个高频的宏任务通道，在主线程每帧刷新间隙发起异步回调，在回调里通过 while 循环执行 Fiber 工作单元并严格监控 5ms 阈值，超时则通过 postMessage 发起下一次调度挂起当前任务。',
      thinkingProcess: '1. 调度核心：Scheduler 是 React 性能优化和时间切片的灵魂。\n2. ric 淘汰：`requestIdleCallback` 只有 20fps 甚至更低的触发频率，且容易被用户连续滑动导致的页面频繁绘制卡死在队列末尾。\n3. 方案替代：MessageChannel 属于宏任务（Macrotask），其执行优先级高，且触发频率稳定。',
      deepDive: 'Scheduler 的任务队列在底层采用**最小堆（Min-Heap）**数据结构维护。队列有两个：`timerQueue`（未就绪任务）和 `taskQueue`（已就绪任务）。在每次消息通道的回调中：\n- 运行一个同步 `workLoop` 循环。\n- 依次弹出 `taskQueue` 中堆顶（最紧急）的任务执行。\n- 执行完一个 Fiber 的 Reconciliation 之后，比对 `performance.now()`。若超出 5ms：\n- 将该任务挂起，保留当前已 Diff 完的 Fiber 链表指针。\n- 发起 `port.postMessage(null)`，强行让出主线程给浏览器执行物理排版和 Paint。\n- 浏览器在空闲后立刻响应 postMessage 宏任务，回调中继续从挂起指针处继续 DFS 遍历。',
      structured: [
        'RIC 弃用原因：requestIdleCallback 兼容性极佳差，触发频率低下且不可控（最高延迟 50ms）',
        '位选方案：MessageChannel (宏任务通道)，比 setTimeout(fn, 0) 拥有更低的等待开销且绝不产生浏览器锁频',
        '最小堆队列：基于任务过期时间（expirationTime）构建最小堆进行任务极速重排序',
        '循环分片：执行单个 Fiber 工作前核对系统时钟，超 5ms 自动挂起并派发 Message 预约下一次宏任务续传'
      ]
    },
    keyPoints: ['Scheduler', 'MessageChannel', 'requestIdleCallback', '最小堆', '时间切片', 'workLoop'],
    traps: ['因为 Scheduler 依靠的是宏任务分片，所以如果在 while 执行期间写了阻塞主线程的同步死循环代码（如 Math.sin 算十万次），MessageChannel 的回调也将无法进入，页面依然会当场卡死'],
    relatedIds: []
  },
  {
    id: 'interview_react_036',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'deps 依赖项深层比对与 useDeepCompareEffect',
    difficulty: 3,
    frequency: 3,
    question: 'useEffect 默认对 deps 进行什么比较？当传入一个复杂对象作为依赖项时，如何防止无限循环触发 Effect？如何手写一个 useDeepCompareEffect？',
    answer: {
      short: 'useEffect 默认使用 Object.is() 进行浅比较（Shallow Compare）；如果将复杂对象传入 deps，由于每次重绘对象引用地址不同，Object.is 判定为 false，会引发无限重绘；解决方案包括解构基本属性后传入、用 useMemo 锁定对象引用、或手写 useDeepCompareEffect 引入 lodash isEqual 进行深层内容值对比。',
      thinkingProcess: '1. 踩坑复现：写 `useEffect(() => {}, [user])`，如果每次 render 都在父级动态声明 `const user = { name: "jack" }`，页面直接卡死在死循环里。\n2. 浅比缺陷：`Object.is({a:1}, {a:1})` 结果为 false。因为物理指针地址不同。\n3. 深比 Hook：我们需要维护一个 ref 缓存上一次的深层对象内容。通过 isEqual 比对。如果内容一样，拒绝更新 ref.current 的引用，从而避开浅比。',
      deepDive: '手写 `useDeepCompareEffect` 的核心逻辑：\n```javascript\nimport lodash from \'lodash\';\n\nfunction useDeepCompareMemoize(value) {\n  const ref = useRef();\n  // 只有在深层比对发现内容确实变了，才更新 ref 的物理引用\n  if (!lodash.isEqual(value, ref.current)) {\n    ref.current = value;\n  }\n  return ref.current;\n}\n\nfunction useDeepCompareEffect(effect, dependencies) {\n  // 传入的是锁死内容的 ref 指针，从而成功让 useEffect 绕过引用地址不同的限制\n  useEffect(effect, useDeepCompareMemoize(dependencies));\n}\n```',
      structured: [
        '浅比局限：React 使用 Object.is() 校验依赖项，只对比指针地址，无法识别内容相等的两个不同对象',
        '死循环高发：在渲染体内声明临时对象作为 deps 依赖，触发 Rerender -> 生成新对象 -> 判定变化 -> 触发 Effect -> 再次 Rerender',
        '解法一：将 `user.id` 或 `user.name` 基础类型属性直接写在 deps 数组中',
        '解法二：自定义用 isEqual 进行深比较的 useDeepCompareEffect Hook'
      ]
    },
    keyPoints: ['Object.is', '浅比较', '深比较', 'isEqual', 'useDeepCompareEffect', '依赖循环'],
    traps: ['深比较在对象层级极深、数据量巨大时会有非常高昂的递归算力开销。对于超大型复杂对象，不应无脑深比，应当使用 ID 或时间戳字段作为依赖项'],
    relatedIds: []
  },
  {
    id: 'interview_react_037',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'React Render 阶段与 Commit 阶段差异',
    difficulty: 3,
    frequency: 4,
    question: '请详细阐述 React Fiber 渲染流程中 Render（协调）阶段和 Commit（提交）阶段的核心职责、区别以及各阶段的生命周期函数执行时机。',
    answer: {
      short: 'Render 阶段负责生成最新的 Fiber 树、计算组件 state 变动并执行 Diff 算法，其过程是异步且可中断的；Commit 阶段负责将 Diff 结果同步修改到浏览器的真实 DOM 节点上并执行相关的生命周期，其过程是同步且不可中断的。',
      thinkingProcess: '1. 流程细分：React 执行不是一把梭完的，分为逻辑计算和物理渲染。\n2. 协调阶段（Render）：DFS 深度优先遍历 Fiber 节点。调用 render()、计算 Hook 等。这个阶段由于没有任何物理 DOM 修改，只要有高优先级任务随时可以丢弃重来。\n3. 提交阶段（Commit）：一口气写完 DOM。调用 componentDidMount、useLayoutEffect 都在这里执行。必须同步一气呵成，防止画面撕裂。',
      deepDive: '在 Render 阶段：React 利用双缓存技术（Double Buffering）。在内存里计算一棵全新的 `workInProgress` Fiber 树。一旦计算完成并被调度到 Commit 阶段：React 仅仅需要将当前正在屏幕上显示的 `current` 指针指向这棵 `workInProgress` 树，瞬间完成图层交替，然后同步遍历 DOM 插入和修改指令（EffectList）。',
      structured: [
        'Render 阶段：异步调度，执行 Fiber 树构建和 Reconciliation 协调算法，可挂起/可重入',
        'Commit 阶段：同步执行，操纵真实 Host DOM 修改，触发 useLayoutEffect / componentDidMount',
        '双缓存技术：current 树代表当前页面展现，workInProgress 树在内存里悄悄计算，计算好后直接指针交换',
        '调试忠告：因为 Render 阶段可重入，在函数组件 body 里直接执行带有副作用（网络请求/修改全局变量）的代码会导致多次多余的请求发送'
      ]
    },
    keyPoints: ['Render 阶段', 'Commit 阶段', '双缓存', 'workInProgress', '生命周期时机'],
    traps: ['任何 DOM 修改、事件绑定、定时器设置、全局变量改写等副作用逻辑，严禁写在 Render 阶段（如函数组件的 body 直接执行处），必须包裹在 useEffect 或是事件回调中'],
    relatedIds: []
  },
  {
    id: 'interview_react_038',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'React 19 use() Hook 核心机制',
    difficulty: 3,
    frequency: 4,
    question: 'React 19 全新推出的 use() 这一特殊 Hook 有什么底层特色？它与普通的 React Hooks（如 useState/useEffect）在使用规范上有什么最大不同？',
    answer: {
      short: 'use() 是 React 19 新增的用于在运行时直接读取 Promise 或 Context 值的 API；与传统 Hooks 必须写在组件顶层、不能写在 if 条件语句或循环中的严格规范不同，use() 可以在条件判断和循环结构中自由调用，实现灵活的按需条件消费。',
      thinkingProcess: '1. 前沿演进：React 19 对 Hooks 规范的重要松绑。\n2. 核心区别：之前 useState/useEffect 依赖于 Fiber 单向链表的“绝对索引顺序”，如果放进 if 就会导致链表指针偏移崩溃。而 `use()` 可以在条件语句里直接消费 Promise。\n3. 消费 Promise：如果传入 Promise，use 会自动挂起（Suspend）该组件，直到 Promise 被 resolve，配合 `<Suspense>` 直接在页面展现数据。',
      deepDive: '使用 `use()` 动态读取 Context 示例：\n```jsx\nfunction Message({ showTheme }) {\n  if (showTheme) {\n    const theme = use(ThemeContext); // 可以在 if 语句中调用！这在普通 Hook 里直接报编译错误\n    return <div className={theme.color}>带有主题的卡片</div>;\n  }\n  return <div>普通卡片</div>;\n}\n```\n它打破了 React 原来“一旦封装 Hook 必须全局置顶”的强制性教条限制，大幅提升了运行时灵活控制状态订阅的能力。',
      structured: [
        'use() 特性：可以直接消费 Promise 数据或 Context，让数据消费完全内联',
        '解绑限制：支持在 conditionals (if条件语句) 和 loops (循环语句) 内部直接使用',
        'Suspense 融合：如果 use(Promise) 未 resolve，自动触发最近的父级 Suspense fallback 展示',
        '注意区别：普通的 React Hooks（useState/useEffect）依然必须遵守“只在最顶层调用”的铁律'
      ]
    },
    keyPoints: ['use() Hook', 'React 19', '条件调用', 'Promise 消费', 'Suspense 集成'],
    traps: ['虽然可以在条件语句里使用 use()，但是调用它的组件本身依然必须是 React 函数组件或自定义 Hook，不能在普通的纯 JS 辅助函数中随意塞入它'],
    relatedIds: []
  },
  {
    id: 'interview_react_039',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 19 表单状态管理：useFormStatus 与 useActionState',
    difficulty: 3,
    frequency: 4,
    question: 'React 19 配合 Server Actions 推出的 useFormStatus 和 useActionState 有什么作用？它们是如何简化传统表单提交（Pending 态、Error 处理）代码的？',
    answer: {
      short: 'useFormStatus 允许子组件直接感知父表单当前是否正在提交（Pending 状态），免去层层传递 loading props；useActionState（旧称 useFormState）用于接收一个 action 异步处理函数，并自动返回该 Action 运行的最新状态（如 Error 响应）和 Pending 状态，实现表单全栈闭环交互。',
      thinkingProcess: '1. 痛点：以前提交表单，需要写 `const [loading, setLoading] = useState(false)`。在点击提交时 setLoading(true)，try-catch 里 setLoading(false)。极其重复冗余。\n2. useFormStatus 闪光点：写在 Form 内部的 Button 里。直接解构出 `const { pending } = useFormStatus()`。只要父 form 在发送，按钮自动获得 loading 态，无需父组件传递任何 props。\n3. useActionState 聚合：将 action 绑定，自动吐出 `[state, formAction, isPending]`。',
      deepDive: 'useActionState 实战配置代码：\n```jsx\n// 服务端 Action 处理函数\nasync function updateName(prevState, formData) {\n  const name = formData.get(\'name\');\n  if (name.length < 3) return { error: \'名字太短！\' };\n  await saveToDb(name);\n  return { success: true };\n}\n\nfunction NameForm() {\n  const [state, formAction, isPending] = useActionState(updateName, null);\n  return (\n    <form action={formAction}>\n      <input type=\"text\" name=\"name\" />\n      <button type=\"submit\" disabled={isPending}>更新</button>\n      {state?.error && <p className=\"error\">{state.error}</p>}\n    </form>\n  );\n}\n```\n这彻底将传统表单提交中的 loading、try-catch 字段映射全部消灭，代之以完全数据驱动的简洁状态机。',
      structured: [
        'useFormStatus：利用 Context 广播原理，子组件直接通过 { pending } 读取表单提交中状态，杜绝 Props 垃圾传递',
        'useActionState：将 form 的 Action 副作用封装，吐出 [state, actionDispatch, isPending] 三元组，聚合状态机制',
        '作用：简化 80% 表单的 useState(loading/error) 的模版状态声明代码',
        '协同优势：与 React 19 Server Actions 结合使用，全栈通信行云流水'
      ]
    },
    keyPoints: ['useFormStatus', 'useActionState', 'React 19', '表单状态机', 'Pending 状态'],
    traps: ['useFormStatus 只能读取“祖先级 <form>”的提交状态。如果在同一个组件内，useFormStatus 和 <form> 并列，由于它不是该 form 的子孙节点，它将无法捕捉到任何提交状态'],
    relatedIds: []
  },
  {
    id: 'interview_react_040',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 组件内存泄漏预防与排查',
    difficulty: 3,
    frequency: 4,
    question: '在 React 实际开发中，导致组件产生内存泄漏（Memory Leak）的常见场景有哪些？如果在控制台看到了“Can\'t perform a React state update on an unmounted component”警告，如何根治？',
    answer: {
      short: '内存泄漏常见于组件销毁后残留的原生 DOM 事件监听、未清除的 setInterval/setTimeout、未取消的 RxJS 订阅或未 abort 的异步网络请求回调；根治“卸载组件上更新 state”的报错，必须在 useEffect 的 cleanup 中彻底注销这些副作用，或利用信号取消异步 Promise。',
      thinkingProcess: '1. 生产故障：页面越用越卡，甚至直接报 OOM 崩溃。这大都是内存泄漏累积导致的。\n2. 机制痛点：当一个请求发出去，耗时 5s。在这 5s 内，用户点击了返回按钮，组件被销毁（Unmounted）。5s 后，网络数据返回，代码执行 `setData(result)`。由于组件已经销毁，React 找不到宿主去重新渲染，就会抛出经典的“卸载后更新state”大预警。\n3. 解除之法：使用 signal 或 flag 在卸载时截断 state 修改。',
      deepDive: '利用 AbortController 或者设置 isMounted 标志位拦截异步回调的经典做法：\n```javascript\nuseEffect(() => {\n  let isMounted = true;\n  fetchData().then(data => {\n    if (isMounted) {\n      setData(data); // 只有当组件依然挂载时，才允许执行 state 修改\n    }\n  });\n  return () => {\n    isMounted = false; // 组件卸载时，把标杆闭包标志置为 false，拦截后续异步 state 更新\n  };\n}, []);\n```\n注意：React 18 为了减少扰民，虽然去除了这个警告，但内存泄漏的物理事实依然存在！不写 cleanup 依然会导致内存中的垃圾对象无法被回收。',
      structured: [
        '元凶一：在全局 window/body 绑定了 addEventListener，组件注销时未执行 removeEventListener',
        '元凶二：在 React 组件中开启了 setInterval，直到销毁也未调用 clearInterval',
        '告警根源：异步回调中触发了 setState，但此时其宿主 Fiber 节点已经在页面中被卸载',
        '根本疗法：补全 useEffect 清理函数，使用 AbortController 主动熔断异步 Promise'
      ]
    },
    keyPoints: ['内存泄漏', 'isMounted', 'AbortController', '清理回调', '垃圾回收'],
    traps: ['虽然 React 18 移除了“Can\'t perform state update...”警告，但它并不是帮你把内存泄漏自动修复了，你依然需要严格清除事件绑定和超时器，防止物理垃圾驻留'],
    relatedIds: []
  },
  {
    id: 'interview_react_041',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: '并发渲染性能调优：useDeferredValue',
    difficulty: 4,
    frequency: 3,
    question: 'React 18 中的 useDeferredValue 解决了什么性能问题？它与 useTransition 有什么区别和联系？如何用它优化长列表过滤？',
    answer: {
      short: 'useDeferredValue 用于为某个频繁变动的 state 值生成一个延迟的副本，使其关联的慢渲染组件（如超长过滤列表）以低优先级进行后台异步计算，防止卡死主线程；它与 useTransition 逻辑一致，区别在于 useTransition 包装的是“修改状态的动作（函数）”，而 useDeferredValue 包装的是“状态值本身”。',
      thinkingProcess: '1. 业务痛点：有时候我们拿不到修改 state 的那行代码（比如 state 是由父组件直接通过 props 传下来的，或者从路由 query 提取的）。我们无法给它套 `startTransition`。\n2. useDeferredValue 原理：`const deferredValue = useDeferredValue(value)`。React 会立刻用最新的 `value` 刷新输入框等高优组件。然后偷偷在后台算 `deferredValue` 改变引发的子树重绘。',
      deepDive: '列表渲染根据 useDeferredValue 自动降低优先级的典型代码：\n```jsx\nfunction ProductList({ query }) {\n  // 包装 props 传下来的 query 值为延迟值\n  const deferredQuery = useDeferredValue(query);\n  \n  // 此耗时大的列表过滤只会响应 deferredQuery，由于其被标记为低 Lane 优先级，它在协调计算中可被随时打断，保证外部 query 输入框 100% 响应\n  const list = useMemo(() => {\n    return largeArray.filter(item => item.includes(deferredQuery));\n  }, [deferredQuery]);\n\n  return <ul>{list.map(x => <li key={x}>{x}</li>)}</ul>;\n}\n```',
      structured: [
        'useDeferredValue：为复杂状态值生成一个延迟更新副本，实现“值级别”的并发切片',
        '与 transition 区别：useTransition 适合控制事件回调内部的多 state 触发；useDeferredValue 适合处理 Props 传下来的只读值或第三方库吐出来的值',
        '调度原理：值变动后优先响应紧急任务，多余算力在后台算延迟值引发的更新，支持打断机制',
        '视觉感知：可结合新旧值比对 `query !== deferredQuery`，在计算期间把列表置为半透明（opacity: 0.5），暗示用户正在计算中'
      ]
    },
    keyPoints: ['useDeferredValue', 'useTransition', '并发模式', '长列表优化', '时间切片'],
    traps: ['useDeferredValue 并不是“防抖”，它不会因为你疯狂输入而延迟到 300ms 后才执行，它是立即以低优先级调度，只要 CPU 算力有盈余，它就会在后台全力计算，一旦有新打字输入则直接打断重来'],
    relatedIds: []
  },
  {
    id: 'interview_react_042',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: '列表 Key 属性比对规则深度探究',
    difficulty: 2,
    frequency: 4,
    question: '当 React 发现新旧虚拟 DOM 树中某个节点的 key 和 type 完全相同，它会执行什么操作？如果 key 相同但 type 改变了，又会如何处理？',
    answer: {
      short: '若 key 和 type 均相同，React 认定该节点未发生本质变更，会复用其物理 DOM 节点与组件实例，仅对 props 和 state 发生改变的部分执行增量更新（Patch）；若 key 相同但 type 改变了，React 会强制销毁旧节点（包括其所有子树）并重新从头创建全新的物理 DOM。',
      thinkingProcess: '1. 协调底层细节：这是 Reconciler 在协调对比时的基本逻辑闸口。\n2. 复用前提：`key` 相同且 `type` 相同。缺一不可。\n3. 类型突变：如果 `key` 都是 `card`，但旧节点是 `<div>`，新节点是 `<section>`，React 哪怕看到它们结构一模一样，也会暴力执行 `componentWillUnmount` -> 物理 DOM 卸载 -> 重新实例化。',
      deepDive: '这一规则对于控制状态重置极其有用。例如当我们在同一个位置需要切换两个完全独立的表单（例如“个人注册”和“企业注册”）时，由于它们长得很像（都是 Form 下的 input），如果不加 Key，React 在切换时会错误地直接复用 DOM 结构，导致个人表单里填的字直接串连残留到了企业表单中。此时只要分别给它们加上 `key="personal"` 和 `key="company"`，切换时 React 会立即销毁前者的 DOM，保证表单状态被干干净净重置。',
      structured: [
        '复用双规：Key 属性（身份证）与 Type 属性（组件类型）必须完全双重符合',
        'Patch 增量更新：双规符合时复用 Host DOM，仅进行属性比对（diffProps）更新样式与值',
        '强制销毁：只要 Type 变了，无视子元素长相，整棵子树当场连根拔起卸载，重建新物理节点',
        '工程利用：通过给组件传入不同的 key 变量，可以强行让 React 销毁并重置组件的全部内部状态'
      ]
    },
    keyPoints: ['DOM 复用', 'Reconciliation', '元素类型', '状态重置', 'Key 原理'],
    traps: ['千万不要用随机数作为 Key。这会导致每次组件渲染时，新旧节点的 key 绝对对不上，React 会全部暴力销毁并重造 DOM，页面内所有的 input 输入焦点当场丢失'],
    relatedIds: []
  },
  {
    id: 'interview_react_043',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'react',
    title: 'PureComponent 与 Component 的核心区别',
    difficulty: 2,
    frequency: 3,
    question: '在 React 类组件中，PureComponent 和普通的 Component 有什么区别？它在底层是如何自动进行重绘防范优化的？',
    answer: {
      short: 'PureComponent 通过内置的 shouldComponentUpdate 生命周期，自动对组件当前的的 state 和 props 进行“浅比较”（Shallow Comparison），若未发生变化则直接返回 false 拒绝组件重新渲染；而普通 Component 默认无条件每次都进行重新渲染。',
      thinkingProcess: '1. 历史演进：这是类组件（Class）时代的性能调优核心。在函数组件时代，它的对应物是 `React.memo`。\n2. 浅比算理：浅比较只会比对基础类型的数值（如 number, string 是否相等）以及对象的物理内存指针地址。如果对象内容变了，但是指针没变（如直接 `arr.push(1)`），PureComponent 将无法感知更新，引发页面不渲染 Bug。',
      deepDive: '因为浅比较的逻辑是：\n`Object.keys(nextProps).every(key => nextProps[key] === this.props[key])`\n这会避开深度遍历。所以如果传入了一个多层嵌套的对象（如 `props.user.address.city` 发生了修改），`address` 对象的引用地址没有变，PureComponent 会错误地返回 `false` 导致组件漏渲染。因此在使用 PureComponent 时，必须配合“不可变数据（Immutable Data）”更新范式（每次更新都通过 `{...user}` 生成新对象）。',
      structured: [
        'Component：默认 `shouldComponentUpdate` 始终返回 `true`，父组件重绘，子组件无脑重绘',
        'PureComponent：内置 `shouldComponentUpdate` 逻辑，执行浅层比对（Shallow Compare）',
        '更新范式：必须使用不可变数据模式，任何修改数组或对象的动作必须生成新的引用，否则会造成组件拒绝重绘',
        '现代替代：在 Hook 时代，使用 React.memo() 包裹函数组件，其底层工作机理与 PureComponent 完全等同'
      ]
    },
    keyPoints: ['PureComponent', 'shouldComponentUpdate', '浅比较', '不可变数据', 'React.memo'],
    traps: ['如果在 PureComponent 的 props 中每次都传入一个内联的箭头函数（如 `<Child onClick={() => this.do()} />`），由于每次 render 该函数的内存地址全变，浅比较必定判定失效，PureComponent 将完全失去优化效果'],
    relatedIds: []
  },
  {
    id: 'interview_react_044',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 动态组件加载与渲染',
    difficulty: 3,
    frequency: 3,
    question: '在配置化 Dashboard、动态表单等业务中，如何根据后端返回的组件类型字符串（如 "input", "select", "datePicker"）在运行时动态加载并渲染对应的 React 组件？',
    answer: {
      short: '可以预先维护一个包含所有可选组件的本地映射表对象（Registry）；运行时根据后端返回的 key 获取对应组件引用，再以 JSX 变量形式（注意组件首字母大写）结合 props 展开属性动态渲染输出。',
      thinkingProcess: '1. 业务痛点：很多中后台系统要求实现“可视化配置”。页面上的卡片或输入框完全是由数据库里的 JSON 配置决定的。前端必须有一套动态组件分发（Dynamic Component Dispatcher）机制。\n2. JSX 规范：JSX 编译时，首字母小写的标签会被翻译成字符串 `"div"` 传入 createElement，首字母大写的变量会被翻译成 JS 组件变量引用。所以必须用 `const Component = Registry[type]` 首字母大写的格式保存引用。',
      deepDive: '动态表单渲染核心模板代码：\n```jsx\nimport { Input, Select, DatePicker } from \'./components\';\n\n// 1. 注册组件映射字典\nconst ComponentRegistry = {\n  input: Input,\n  select: Select,\n  date: DatePicker,\n};\n\nfunction DynamicFormItem({ type, fieldProps }) {\n  // 2. 根据字符串类型提取组件引用\n  const TargetComponent = ComponentRegistry[type];\n  \n  if (!TargetComponent) {\n    return <div>未知的组件类型: {type}</div>;\n  }\n  \n  // 3. 直接以 JSX 标签渲染，展开配置项\n  return <TargetComponent {...fieldProps} />;\n}\n```\n如果组件库非常巨大，可以配合 `React.lazy` 实现 Registry 中的按需动态 Chunk 加载，防止主 JS 包因导入过多未使用组件而体积爆炸。',
      structured: [
        '核心原理：维护一个 Key-Value 映射字典，把后端类型字符串映射为真实的组件引用',
        'JSX 大写约束：获取到组件后，必须赋值给首字母大写的变量名，否则 React 会将其误认为普通 HTML 标签',
        '性能考量：若组件极多，可将 Registry 内的组件改用 React.lazy 声明，按需进行网络分包拉取',
        '属性传递：利用 JSX 属性展开 `{...fieldProps}` 将后端配置的属性动态注入组件'
      ]
    },
    keyPoints: ['动态组件', '配置化表单', 'ComponentRegistry', 'JSX大写规范', 'React.lazy'],
    traps: ['千万不要尝试直接拼接动态代码，如 `<${type}Component />`，这违背了 JSX 的编译原理，在打包时会报严重的编译期语法错误'],
    relatedIds: []
  },
  {
    id: 'interview_react_045',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'react',
    title: '长列表渲染优化与虚拟列表（Virtual List）架构',
    difficulty: 4,
    frequency: 5,
    question: '当我们在 React 中需要展示上万条数据（如 IM 聊天记录、商品瀑布流）时，直接渲染会造成严重的页面卡死。请阐述虚拟列表（Virtual List）的设计原理以及如何在 React 中实现一个基础的虚拟滚动组件。',
    answer: {
      short: '虚拟列表的原理是仅创建并渲染用户当前视口（Viewport）可见的少量 DOM 节点，在滚动时通过计算偏移量动态复用和替换节点内容；实现上需在最外层设固定高的溢出容器，内部设一个等比于总数据长度的撑高占位骨架，并根据容器的 scrollTop 实时计算当前显示的起始索引，截取数据切片渲染。',
      thinkingProcess: '1. 掉帧卡顿根源：浏览器在渲染超过 1000 个 DOM 时，内存开销和排版重绘开销会呈指数级上升。一次滑动会导致主线程卡死。\n2. 虚拟化理念：哪怕数据有 10 万条，用户的手机屏幕一次也只能装下 10 条。我们永远只渲染这 10 条 DOM 节点。数据滑动时只是改变这几个 DOM 里面的文字和图片，DOM 总数恒定不变。\n3. 数学计算：`startIndex = Math.floor(scrollTop / itemHeight)`。',
      deepDive: '一个典型的 React 虚拟列表结构包含三层：\n1. **容器层 (Viewport Container)**：固定高度（如 400px），设置 `overflow-y: auto`，并绑定 `onScroll` 监听器。\n2. **撑高占位层 (Phantom Skeleton)**：无实质内容，其高度绝对等于 `总数据条数 * 每行高度`。目的是为了撑开容器的滚动条，让用户感觉列表确实有那么长，滚动条的滑动比例符合直觉。\n3. **真实渲染层 (Render List)**：使用绝对定位 `position: absolute`，高度等于 `可见元素数 * 行高`。随着滚动，计算其 `transform: translateY(offsetTop)`，使其始终定位在当前视口的正中央，截取数据 `list.slice(startIndex, endIndex)` 渲染。\n\n为了防范滑动太快露出白屏，通常会在视口上下方多渲染 3-5 个节点作为**缓冲区（Buffer）**。',
      structured: [
        '性能瓶颈：万级 DOM 耗尽显存、引发重排灾难；虚拟列表核心为“按需渲染”',
        '三层拓扑：外层固定视口容器、中层占位绝对撑高骨架（撑大滚动条）、内层绝对定位真实切片列表',
        '计算公式：首个渲染项索引 = Math.floor(scrollTop / itemHeight)；偏移高度 = startIndex * itemHeight',
        '缓冲区（Buffer）：在视口上下方多渲染几条，对抗惯性滚动造成的视觉瞬时空白'
      ]
    },
    keyPoints: ['虚拟列表', '长列表优化', 'scrollTop', '滚动占位', '缓冲区 Buffer', 'react-window'],
    traps: ['如果列表项的高度不是固定的（如包含不同长短的推文内容），计算 startIndex 会非常困难，需要引入动态高度缓存计算（如利用 ResizeObserver 实时测算并记录各行高度的方案）'],
    relatedIds: []
  },
  {
    id: 'interview_react_046',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React Compiler（React Forget）编译时记忆原理',
    difficulty: 4,
    frequency: 3,
    question: 'React 19 引入的 React Compiler（原名 React Forget）是什么？它是如何工作的？为什么说它终结了手动书写 useMemo 和 useCallback 的时代？',
    answer: {
      short: 'React Compiler 是一个自动编译工具，在构建期对 JS 代码进行 AST（抽象语法树）分析，识别组件间的依赖数据并自动注入细粒度的记忆化（Memoization）缓存逻辑；它能自动识别哪些对象和函数需要缓存，让开发者无需再手动书写 useCallback/useMemo 即可获得极致的按需重绘性能。',
      thinkingProcess: '1. 技术前沿：React 19 最重磅的底层变革，改变了 React 开发者的心智模型。\n2. 心智负担：在 React 中，为了性能我们不得不写大量的 `useMemo`、`useCallback`。这被称为“Memo 垃圾代码”。不仅写起来累，一旦 deps 依赖项漏写，还会产生诡异的闭包 bug。\n3. 编译解决：React 认为这本该是编译器干的活。Compiler 像是一个智能的“代码改写器”。',
      deepDive: 'React Compiler 的底层在 AST 转换时，会把所有的变量计算、子组件标签、函数声明自动改写为带有缓存校验的结构。例如：\n```javascript\n// 我们写的普通代码：\nconst data = calculate(a);\n\n// 编译器改写后的等价运行时代码：\nconst data = _$cache[0] !== a ? (_$cache[0] = a, _$cache[1] = calculate(a)) : _$cache[1];\n```\n它利用了一个全局的缓存数组（类似于 Hooks 的存储机制），在编译阶段就插入了这些记忆化代码。只要你的 React 代码符合 Hooks 规范和不可变数据规范，整个应用就会在没有任何 useCallback 的情况下，自动达到完美精准重绘的水平。',
      structured: [
        '本质：React 官方编译期优化工具，在打包构建期对代码进行 AST 降解并注入自动缓存机制',
        '心智解脱：解决开发者因顾忌性能频繁手写 useMemo/useCallback 的心智负担与遗漏 deps 的 Bug 隐患',
        '缓存粒度：从“组件级”细化到“值与分支级”，能自动判断出哪些 DOM 节点依赖了哪些变量，仅做靶向渲染',
        '使用前提：要求代码必须是纯函数、不可改写入参 props，严格遵守 React 官方规则（Rules of React）'
      ]
    },
    keyPoints: ['React Compiler', 'React 19', 'React Forget', '自动记忆化', 'AST编译', 'Rules of React'],
    traps: ['如果你的项目代码中包含违背 React 规范的“不纯函数”（例如直接在渲染里改写全局变量，或者直接 mutation 修改传入的 props），React Compiler 检测到后会直接对该组件报编译警告并跳过优化，退回到无缓存的常规渲染'],
    relatedIds: []
  },
  {
    id: 'interview_react_047',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'useState 惰性初始化（Lazy Initialization）原理',
    difficulty: 2,
    frequency: 4,
    question: 'useState(initValue) 中的 initValue 如果是一个高耗时的函数计算结果（如读取并解析 LocalStorage），直接传入值会带来什么性能问题？如何通过惰性初始化进行优化？',
    answer: {
      short: '若直接传入函数计算结果（如 useState(parseData())），该计算函数在组件后续每次重绘（Rerender）时都会被强制调用，造成严重的算力浪费；通过传入一个匿名函数回调（如 useState(() => parseData())），该高耗时计算只会在组件首次挂载时执行一次，后续渲染直接忽略此函数。',
      thinkingProcess: '1. 踩坑原理：在函数组件中，每次重绘都是整个函数体的重新执行。组件 rerender 时，useState 里的入参表达式会被重新计算一遍，哪怕 React 底层已经复用了旧 state，这个计算出来的入参也会被白白丢弃。\n2. 惰性初始化：`useState(() => getHeavyData())`。这里传入的是一个函数引用。React 只有在初次挂载初始化状态链表时，才会调用这个函数；在后续的重绘时，React 会跳过该函数的执行，直接返回缓存的 state。',
      deepDive: '性能对比：\n```javascript\n// 性能差：每次输入框打字导致 Rerender 时，都会重新执行 localStorage.getItem 并做 JSON.parse（虽然 count 已经初始化完了）\nconst [data, setData] = useState(JSON.parse(localStorage.getItem(\'data\')));\n\n// 性能优：只有在首次组件加载时执行一次 JSON.parse，后续打字重绘时此匿名函数完全不执行\nconst [data, setData] = useState(() => JSON.parse(localStorage.getItem(\'data\')));\n```\n这对于读取大体积缓存、进行复杂数学矩阵变换初始化 state 场景，是极其关键的微优化技巧。',
      structured: [
        '普通模式弊端：useState(expr) 里的表达式 expr 每次重绘都会执行并计算出新值，即使该值已被 React 丢弃不用',
        '惰性初始化：useState(() => expr) 传递初始化函数，React 只有在挂载期（Mount）调用它一次',
        '优化价值：避免每次重绘时反复进行 LocalStorage 读写、大量 JSON 解析或复杂数学运算',
        '应用守则：只要初始化值涉及 I/O 读写或非简单常数值，强烈推荐使用函数包裹惰性初始化'
      ]
    },
    keyPoints: ['useState', '惰性初始化', '性能优化', '函数组件重绘'],
    traps: ['惰性初始化函数必须是一个“纯函数”，不能在其内部写入 fetch 网络请求或修改 DOM 的副作用动作，因为它在首次渲染挂载时同步执行，会阻塞排版流'],
    relatedIds: []
  },
  {
    id: 'interview_react_048',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React 事件池（Event Pooling）及其在 17 中的移除',
    difficulty: 3,
    frequency: 3,
    question: 'React 16 之前的事件池（Event Pooling）机制是什么？为什么它会导致我们在异步回调中无法读取到事件的 target 属性？为什么 React 17 决定彻底移除这一机制？',
    answer: {
      short: '事件池是 React 16 之前为了节省内存复用合成事件对象（SyntheticEvent）的机制，事件执行完后其属性会被全部清空清零；这导致在异步回调中读取 e.target 会得到 null；React 17+ 移除事件池是因为现代浏览器内存垃圾回收性能大幅提升，复用带来的微弱性能提升无法抵消异步 Bug 的心智负担。',
      thinkingProcess: '1. 历史考古：这是 React 经典古老面试题，有助于说明合成事件的底层历史设计。\n2. 事件池设计：为了防止高频产生大量的 SyntheticEvent 对象造成垃圾回收（GC）抖动，React 16 之前会把所有的事件对象丢进一个池子里。当一个 onClick 完事了，React 顺手就把这个 `e` 对象的属性全擦除掉置为 null，等待下一次点击复用同一个 `e` 实例。\n3. 异步 bug：如果在 `setTimeout(() => console.log(e.target.value), 100)` 里使用，因为此时事件处理器早已执行完了，`e` 已被清空，就会报错。以前只能手动调用 `e.persist()` 来退出事件池。',
      deepDive: 'React 17 升级日志中明确写道：\n*“事件池机制在现代浏览器上完全没有性能优势，反而因为异步引用的 Bug 给开发者带来了长达数年的困扰，因此我们在 17 中将其彻底移除，并直接将普通的 SyntheticEvent 暴露给垃圾回收处理。”*\n这使得我们在 17 之后，可以在任何异步代码（Promise、setTimeout）中自由读取 `e.target` 等数据，代码变得非常自然。',
      structured: [
        '事件池目的：React 16 之前在内存中循环复用 SyntheticEvent 实例，减免垃圾回收机制的压力',
        '异步 Bug：事件处理器执行完毕后，事件对象的所有属性当场被清空为 null，导致异步读取报错',
        '旧解决方案：必须手动调用 e.persist() 阻止 React 将该事件对象归还给事件池',
        'React 17 变革：彻底移除事件池，顺应现代浏览器强大的 GC 引擎，消灭了这道心智障碍'
      ]
    },
    keyPoints: ['事件池', 'e.persist()', 'SyntheticEvent', 'React 17 升级', '垃圾回收 GC'],
    traps: ['如果在维护 React 16 或更老的旧代码库时，遇到在异步中操作事件对象报错的情况，一定要记住加上 e.persist()，否则代码上线的报错率会极高'],
    relatedIds: []
  },
  {
    id: 'interview_react_049',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'react',
    title: 'React Portal 跨物理边界事件冒泡细节',
    difficulty: 3,
    frequency: 3,
    question: '在使用 React Portal 时，如果被传送的子组件触发了点击事件，为什么该事件仍能在物理 DOM 树上完全隔离的 React 父组件中被监听到？这在底层是如何做到的？',
    answer: {
      short: '因为 React 的合成事件冒泡不依赖物理 HTML DOM 树，而是完全沿着 React 的 Fiber 节点树（虚拟组件嵌套结构）向上遍历执行；尽管 Portal 节点在浏览器里被 append 到了 body 底部，但它在 Fiber 树中的父节点依然是原来的声明组件，因而事件能顺着 Fiber 指针完美冒泡回去。',
      thinkingProcess: '1. 机制细节：深入合成事件与 Portal 的结合点。\n2. DOM 视角：A 节点是 B 节点的物理父级。事件冒泡是通过原生浏览器的 DOM Event path 往上传递的。\n3. React 视角：Portal 中的元素虽然物理上放在了 body 底，但在 React 树中，Portal 节点在 Fiber 树上是作为子节点挂载在父组件 Fiber 下的。当合成事件在根节点被拦截后，React 会依据自己的 Fiber 链表顺着往上执行 handler。',
      deepDive: '这在开发组件库时极为方便。例如，父组件 `<div onClick={handleClose}>` 包裹了一个由 Portal 渲染的弹窗。我们不需要在弹窗里写任何 Props 回调，直接点击弹窗里的关闭按钮，父组件的 `onClick` 就能被触发并捕获。这极大地简化了跨 DOM 层级的事件捕获逻辑设计。',
      structured: [
        '物理断裂：Portal 组件挂载在 document.body 底部，在物理 DOM 结构上已彻底脱离父组件',
        '逻辑关联：Portal 节点在 React 内部的 Fiber 树上，其 `return` 指针依然指向它声明处的父级 Fiber',
        '合成派发：合成事件系统在根容器统一捕获原生事件后，会遵循 Fiber 链表的层次结构模拟向下捕获和向上冒泡',
        '设计意义：让开发者能用“声明式”的组件书写层级，去直觉地设计事件监听，无视物理排版的撕裂'
      ]
    },
    keyPoints: ['React Portal', '事件冒泡', 'Fiber树', '合成事件', '物理分离'],
    traps: ['由于 Portal 事件依然会往上冒泡，如果子组件在 body 里的 Modal 弹窗里有各种交互（如输入、点击），如果不加 e.stopPropagation()，可能会意外触发父组件上绑定的某些全局快捷键或点击关闭事件，产生诡异的冲突'],
    relatedIds: []
  },
  {
    id: 'interview_react_050',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'react',
    title: 'React 高频状态更新防抖节流优化',
    difficulty: 3,
    frequency: 4,
    question: '在 React 输入框搜索等高频重绘场景下，如果我们直接对 value state 进行防抖，会导致输入框字符出现打字不跟手或卡顿问题。请阐述为什么不能直接防抖受控组件的 value 状态？如何正确实现 React 输入框防抖搜索？',
    answer: {
      short: '直接防抖 value state 会导致输入框变为“滞后受控”，用户的输入字符需要等待防抖时间结束后才会显示，造成严重的打字延迟卡顿；正确做法是使用两个 state：一个紧急状态实时控制输入框的 value（非防抖），另一个非紧急状态（防抖更新）用来触发实际的接口搜索，或者使用 React 18 的 useDeferredValue。',
      thinkingProcess: '1. 踩坑解析：受控组件的 value 必须实时响应 onChange 更新状态，否则输入框字都打不出来（被掐断了）。如果给这个 setValue 加防抖 300ms，每次打字都会卡 300ms 才会显示出来。\n2. 双状态模式：一个 state `inputVal` 实时无防抖绑定输入框，保证手感丝滑；另一个 state `searchQuery`，通过 lodash.debounce 进行 300ms 防抖修改。',
      deepDive: '双状态防抖搜索的经典实现代码：\n```jsx\nfunction SearchInput() {\n  const [text, setText] = useState(\'\'); // 紧急状态，实时控制 value，保障手感\n  const [query, setQuery] = useState(\'\'); // 非紧急状态，防抖更新，触发接口\n\n  // 缓存防抖函数，确保每次 render 不重新创建\n  const debouncedSetQuery = useCallback(\n    debounce((val) => setQuery(val), 300),\n    []\n  );\n\n  const handleChange = (e) => {\n    const val = e.target.value;\n    setText(val); // 立即更新输入框\n    debouncedSetQuery(val); // 防抖触发查询\n  };\n\n  useEffect(() => {\n    if (query) fetchSearchApi(query);\n  }, [query]);\n\n  return <input value={text} onChange={handleChange} />;\n}\n```',
      structured: [
        '受控硬伤：直接防抖 value state 会导致更新函数被拖延执行，造成用户输入打字出现反人类的严重卡顿滞后',
        '正确方案：设立“双状态双数据流”机制，一个 state 强控输入框交互，另一个 state 防抖控制网络接口',
        'useCallback 锁死：防抖的 debounce 函数必须套在 useCallback 中，以防父组件重绘时防抖计时器被反复重置重置',
        '现代方案：可以使用 useDeferredValue 或是 useTransition，将搜索任务标记为低 Lane 优先级并发处理'
      ]
    },
    keyPoints: ['表单防抖', '受控组件', 'useCallback', '双状态管理', '打字流畅度'],
    traps: ['在使用 useCallback 包裹 debounce 时，如果依赖项（deps）不小心放了 `text`，这会导致每次 text 变了回调都重新生成，原有的 debounce 会被全部销毁，导致防抖彻底失效（每次都发请求），依赖项必须设为空数组 []'],
    relatedIds: []
  }
];

const fileContent = `// interview-react.js
// 自动生成主题题库：React (归属于 frontend)

const questions = ${JSON.stringify(questions, null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-react.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-react.js with all 50 questions!');
