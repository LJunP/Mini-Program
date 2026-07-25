// interview-vue.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_037",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "vue",
    "title": "Vue 3 Composition API 与 React Hooks 依赖管理对比",
    "difficulty": 3,
    "frequency": 4,
    "question": "Vue 3 的 setup (Composition API) 与 React Hooks 在底层机制上有何本质不同？为什么 Vue 3 不需要手动声明依赖数组？",
    "answer": {
      "short": "Vue 3 的 setup 只在组件初始化时执行一次，依赖追踪是运行时的“自动订阅”（响应式代理）；而 React Hooks 每次渲染都会重复执行，依赖追踪是“手动声明的依赖项数组对比”。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Vue 3 Composition API 与 React Hooks 依赖管理对比】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Vue 3 Composition API 与 React Hooks 依赖管理对比】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 现象联想：写 Vue 3 的 computed/watch 时，不需要声明依赖；而写 React 的 useMemo/useEffect 必须写末尾的依赖数组。\n2. 底层更新对比分析：React Hooks 强依赖于函数的重复执行。每次状态变化，整个函数重新跑以遍，在链表上比对依赖项。Vue 3 的 setup 只在组件 mount 时执行一次，创建响应式代理对象（Proxy），此后数据变化直接触发具体的渲染 Effect，不需要重新运行 setup 块，因而天然避开了闭包陷阱。\n3. 依赖追踪：Vue 底层在 getter 中自动收集全局活跃的 Effect，并在 setter 触发时分发更新。这是一个运行时的自依赖收集过程。",
      "deepDive": "Vue 3 这种“一次执行加响应式劫持”的架构，极大地降低了心智负担，避免了 React 令人头疼的闭包陷阱与 useCallback 滥用引起的额外开销。但它的局限在于：1. 依赖 Proxy 劫持，对解构赋值不友好（会丢失响应式，需要 toRefs 辅助）；2. 运行时劫持会占用较多的内存对象开销。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。",
      "structured": [
        "执行频次：setup 只跑一次，Hooks 每次 render 均重跑",
        "依赖收集：Vue 通过 Proxy Getter/Setter 运行时订阅，React 通过 deps 浅比较人工决定",
        "状态心智：Vue 无闭包陷阱，React 需高度关注函数引用和依赖项完整性",
        "局限性：Vue 无法直接对响应式对象解构，需要借助 toRefs 工具"
      ]
    },
    "keyPoints": [
      "setup",
      "Composition API",
      "自动依赖收集",
      "Proxy 响应式",
      "依赖项对比"
    ],
    "traps": [
      "Vue 3 的 ref 在 JS 中必须通过 .value 读写，而在 template 中会自动解包，这是初学者最容易混淆的语法边界",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_vue_002",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "vue",
    "title": "响应式系统对比：defineProperty vs Proxy",
    "difficulty": 3,
    "frequency": 5,
    "question": "Vue 2.x 的 Object.defineProperty 与 Vue 3.x 的 Proxy 响应式原理有什么区别？各有什么优缺点？",
    "answer": {
      "short": "Vue 2 使用 Object.defineProperty 深度递归劫持现有属性，无法监听属性新增/删除及数组索引变化；Vue 3 使用 ES6 Proxy 代理整个对象，在运行时动态收集依赖，天然支持新增属性和数组监听，且具有懒代理的高性能。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【响应式系统对比：defineProperty vs Proxy】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【响应式系统对比：defineProperty vs Proxy】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 时代演进：响应式系统的底层升级。\n2. Vue 2 缺陷：递归调用 defineProperty，如果对象层级极深，初次加载慢；且无法监测 `$set` 之外的新属性。\n3. Vue 3 飞跃：Proxy 直接拦截外界对整个对象的读写（包含 13 种拦截方法）。且它是“懒代理”，只有读到深层属性时，才会动态将子树包装为 Proxy，性能强悍。",
      "deepDive": "Object.defineProperty 的原理是直接修改对象属性描述符，必须对每个属性进行显式绑定，所以无法感知属性的 `delete` 和 `add`。而 Proxy 原理是代理了整个对象，任何通过该 Proxy 的读写（getter/setter）都要经过拦截层。缺点是 Proxy 是 ES6 新特性，无法通过 Polyfill 完美向下兼容，所以 Vue 3 彻底放弃了对 IE11 编译的支持。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。",
      "structured": [
        "Vue 2：Object.defineProperty，静态劫持属性，无法监听 delete/add，无法监听数组直接赋值",
        "Vue 3：Proxy，动态代理整个对象，支持全部数据类型（Map/Set/Array），支持运行时新增属性",
        "性能差异：Vue 2 初始化时需要暴力深度递归；Vue 3 在读取时才动态包裹 Proxy（惰性代理），首开效率极大提升",
        "兼容性：Proxy 无法被 ES5 Polyfill 模拟，Vue 3 不支持 IE11 浏览器"
      ]
    },
    "keyPoints": [
      "Object.defineProperty",
      "Proxy 代理",
      "惰性代理",
      "Reactivity",
      "IE 兼容"
    ],
    "traps": [
      "即使在 Vue 3 中，Proxy 也只能拦截“通过代理对象”发起的读写。如果是对原生 target 原始对象直接进行修改，依然无法触发响应式重绘",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_vue_003",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "vue",
    "title": "Ref 与 Reactive 的深层区别与使用场景",
    "difficulty": 2,
    "frequency": 5,
    "question": "在 Vue 3 中，ref 和 reactive 在声明响应式数据时有什么本质区别？在实际开发中该如何进行最佳实践选型？",
    "answer": {
      "short": "ref 用于声明基础类型或对象类型的响应式数据，底层通过 RefImpl 类的 getter/setter 及 Proxy 进行包装，在 JS 中必须使用 .value 读写；reactive 仅用于声明对象/数组类型，底层直接调用 Proxy 包装；建议优先全量使用 ref 以保持写法的一致性，且 ref 能够避免 reactive 解构丢失响应式响应式的问题。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Ref 与 Reactive 的深层区别与使用场景】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Ref 与 Reactive 的深层区别与使用场景】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 概念厘清：ref 是响应式引用，reactive 是响应式对象。\n2. 原理差异：如果是基础类型（如数字、字符串），Proxy 无法拦截，因为 Proxy 只能代理对象。所以 ref 内部会将其包装为一个 `{ value: x }` 对象，并定义 get/set 拦截。如果是复杂类型，ref 内部也是调用 reactive 代理。\n3. 解构坑点：reactive 返回的对象，如果执行 `let { name } = state`，`name` 就变成了普通字符串，响应式断裂。而 ref 通过包装类，可以通过 toRefs 保持响应。",
      "deepDive": "为什么 reactive 容易丢失响应式？\n```javascript\nlet state = reactive({ count: 0 });\n// 错误更新一：重新赋值导致引用丢失\nstate = reactive({ count: 1 }); // 此时页面不会重绘，原 Proxy 绑定被新对象覆盖，旧订阅失效\n// 错误更新二：解构\nconst { count } = state; // count 变成纯数字，Setter 无法被拦截\n```\n而使用 `const count = ref(0)`，无论如何传递这个引用，只要读写 `count.value`，React 响应式系统就能精准拦截并跟踪。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。",
      "structured": [
        "底层机制：ref 用属性访问器（get/set value）和对象拦截；reactive 直接使用 Proxy 代理",
        "类型限制：ref 可接受任何类型（包含数字、布尔、对象）；reactive 只能接受对象/数组/Map/Set",
        "解构陷阱：reactive 直接解构或整体重新赋值会丢掉响应式；ref 通过 value 包裹层避免了这一缺陷",
        "选型指南：推荐优先全量使用 ref，不仅语法一致，且配合 script setup 的 defineModel 开发效率更高"
      ]
    },
    "keyPoints": [
      "ref",
      "reactive",
      "toRefs",
      "解构陷阱",
      ".value",
      "最佳实践"
    ],
    "traps": [
      "使用 ref 时在 JS 中要写 .value，但在 <template> 模板渲染中千万不要写 .value（会自动解包），而在 reactive 的普通对象解包规则中也有所不同，必须注意识别",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_vue_004",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "frontend",
    "topic": "vue",
    "title": "Computed 与 Watch、WatchEffect 区别",
    "difficulty": 2,
    "frequency": 5,
    "question": "computed, watch 和 watchEffect 三者有什么核心区别？在实际业务中应该如何选择？",
    "answer": {
      "short": "computed 具有缓存性，只有在依赖值变动时重新计算，用于衍生只读状态；watch 是惰性的、需要手动指定监听源，支持获取新旧值并做异步副作用；watchEffect 是立即执行的、会自动收集其回调内用到的所有响应式依赖，适合无需获取旧值且依赖项繁多的场景。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Computed 与 Watch、WatchEffect 区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Computed 与 Watch、WatchEffect 区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 概念对应：衍生值 vs 主动监听副作用。\n2. computed 缓存性：其内部有一个 `dirty` 标志位。如果依赖没变，直接读缓存，开销极小。适用于繁重的格式化计算。\n3. watch 与 watchEffect：watchEffect 相当于 React 的 useEffect，首次无脑跑一次以收集依赖；而 watch 首次默认不跑，除非加 `immediate: true`。",
      "deepDive": "watchEffect 与 watch 的最大区别是**自动收集依赖**：\n```javascript\n// watchEffect 会自动感知到内部用到了 user.id 并自动订阅它\nwatchEffect(() => {\n  console.log('用户ID改变了：', user.id);\n});\n```\n如果使用 watch，你必须显式写出监听源：`watch(() => user.id, (newVal, oldVal) => { ... })`。但在需要知道“旧值是多少”来做逻辑差异比对、或者执行耗时大的 API 请求防抖时，应该用 watch。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。",
      "structured": [
        "computed：计算衍生属性，具有缓存惰性（dirty 标志位），依赖未变直接使用旧值，严禁在其中写修改 state 的副作用",
        "watch：精细化副作用，惰性监听，需要显式指定源，提供 newVal/oldVal，适合复杂的网络请求和防抖",
        "watchEffect：自动副作用，立即执行，自动收集依赖，不支持旧值，代码极简"
      ]
    },
    "keyPoints": [
      "computed",
      "watch",
      "watchEffect",
      "自动依赖收集",
      "缓存机制"
    ],
    "traps": [
      "如果在 computed 中写了修改状态（修改 ref/reactive）的副作用代码，会导致响应式循环触发，控制台会报调用栈溢出（Maximum call stack size exceeded）",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_vue_005",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "frontend",
    "topic": "vue",
    "title": "Vue 3 模板编译优化（PatchFlags/Static Hoisting）",
    "difficulty": 4,
    "frequency": 4,
    "question": "Vue 3 是如何通过编译期优化（Compiler Optimization）超越 React 纯运行时 Diff 性能的？请详述 PatchFlags、静态提升（Static Hoisting）和 BlockTree 的工作原理。",
    "answer": {
      "short": "Vue 3 依靠模板编译器在构建期对静态和动态节点进行区分；PatchFlags 仅对动态绑定属性打上数值标记，Diff 时仅针对性更新对应属性；静态提升将无变化的 DOM 提取到 render 函数外，避免每次渲染重复创建对象；Block Tree 将动态节点直接提取扁平化为一层，实现跳过静态 DOM 直接遍历动态节点的超高性能 Diff。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Vue 3 模板编译优化（PatchFlags/Static Hoisting）】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Vue 3 模板编译优化（PatchFlags/Static Hoisting）】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 编译优势：Vue 的 SFC 模板语法在编译阶段提供了极大的结构确定性。React 是纯运行时 JS（JSX 可以任意写 map/if），难以进行静态推导。\n2. PatchFlags 详解：比如一个节点 `<div :class=\"cls\">hello</div>`，编译后会变成 `_createVNode(\"div\", null, \"hello\", 2 /* CLASS */)`。Diff 时看到 2，直接比对 class，不用去管 style, text 等其他属性。\n3. 静态提升（Static Hoisting）：没有绑定的静态 div，直接提取到外部为全局常量 `_hoisted_1 = _createVNode(\"span\", null, \"静态内容\")`。",
      "deepDive": "Block Tree 机制突破了“嵌套 DOM 层级”的限制。当页面中有 `<div><div><span>静态</span><p>{{dynamic}}</p></div></div>` 时，如果没有 Block Tree，Diff 仍然要层层递归节点。Vue 3 在带有 `v-if/v-for` 的临界点创建 Block，把内部所有的动态子节点拉平挂在这个 Block 的 `dynamicChildren` 数组中。这样在更新时，直接遍历这个一维数组，Diff 复杂度直接与“动态节点数”关联，而非 DOM 树层级深度。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。\n\n【源码级原理/深度机制】：Vue 2 依靠 Object.defineProperty 响应式，其硬伤是无法监听到属性新增和数组索引修改，且必须初始化时深度递归劫持。Vue 3 重构为基于 Proxy 的代理拦截，实现了原生的属性拦截，并利用懒劫持提升首屏内存效率。其底层依靠 track 依赖收集和 trigger 派发更新。",
      "structured": [
        "PatchFlags（靶向更新）：对动态属性添加二进制位数值（如 CLASS, TEXT），Diff 时只靶向比对有标记的属性",
        "静态提升（Static Hoisting）：把静态的节点和 props 提取到 render 闭包外，零重复创建开销，降低 GC 压力",
        "预字符串化（Hoist Static Text）：遇到大段静态 HTML，直接编译为一串 _createStaticVNode(htmlString) 字符串，提升解析速度",
        "BlockTree（扁平化动态更新）：跳过静态包裹层，仅将动态节点聚合为一个一维数组进行更新遍历"
      ]
    },
    "keyPoints": [
      "PatchFlags",
      "Static Hoisting",
      "Block Tree",
      "SFC 编译优化",
      "编译运行结合"
    ],
    "traps": [
      "因为 Vue 3 依赖这套高度契合的编译器优化，所以如果你在 Vue 3 中全量使用手动写 render() 函数或 JSX 写法，整个 Compiler 优化就会完全失效，退回到和 React 类似的纯运行时深度 Diff 状态",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。",
      "Vue 内部的 nextTick 机制是怎样实现的，为什么能拿到最新的 DOM 节点？防撕核心：Vue 在修改数据后并不立刻修改真实 DOM，而是将更新推入异步任务队列。nextTick 的原理就是将 callback 放入这个异步队列的末尾。JS 事件循环机制会先清空微任务队列（执行 DOM 更新），接着再执行 nextTick 注入 of callback，因此拿到的必然是最新状态。"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
