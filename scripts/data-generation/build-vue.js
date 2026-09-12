const fs = require('fs');
const path = require('path');

const questions = [
  {
    id: 'interview_037',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Composition API 与 React Hooks 依赖管理对比',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3 的 setup (Composition API) 与 React Hooks 在底层机制上有何本质不同？为什么 Vue 3 不需要手动声明依赖数组？',
    answer: {
      short: 'Vue 3 的 setup 只在组件初始化时执行一次，依赖追踪是运行时的“自动订阅”（响应式代理）；而 React Hooks 每次渲染都会重复执行，依赖追踪是“手动声明的依赖项数组对比”。',
      thinkingProcess: '1. 现象联想：写 Vue 3 的 computed/watch 时，不需要声明依赖；而写 React 的 useMemo/useEffect 必须写末尾的依赖数组。\n2. 底层更新对比分析：React Hooks 强依赖于函数的重复执行。每次状态变化，整个函数重新跑以遍，在链表上比对依赖项。Vue 3 的 setup 只在组件 mount 时执行一次，创建响应式代理对象（Proxy），此后数据变化直接触发具体的渲染 Effect，不需要重新运行 setup 块，因而天然避开了闭包陷阱。\n3. 依赖追踪：Vue 底层在 getter 中自动收集全局活跃的 Effect，并在 setter 触发时分发更新。这是一个运行时的自依赖收集过程。',
      deepDive: 'Vue 3 这种“一次执行加响应式劫持”的架构，极大地降低了心智负担，避免了 React 令人头疼的闭包陷阱与 useCallback 滥用引起的额外开销。但它的局限在于：1. 依赖 Proxy 劫持，对解构赋值不友好（会丢失响应式，需要 toRefs 辅助）；2. 运行时劫持会占用较多的内存对象开销。',
      structured: [
        '执行频次：setup 只跑一次，Hooks 每次 render 均重跑',
        '依赖收集：Vue 通过 Proxy Getter/Setter 运行时订阅，React 通过 deps 浅比较人工决定',
        '状态心智：Vue 无闭包陷阱，React 需高度关注函数引用和依赖项完整性',
        '局限性：Vue 无法直接对响应式对象解构，需要借助 toRefs 工具'
      ]
    },
    keyPoints: ['setup', 'Composition API', '自动依赖收集', 'Proxy 响应式', '依赖项对比'],
    traps: ['Vue 3 的 ref 在 JS 中必须通过 .value 读写，而在 template 中会自动解包，这是初学者最容易混淆的语法边界'],
    relatedIds: []
  },
  {
    id: 'interview_vue_002',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: '响应式系统对比：defineProperty vs Proxy',
    difficulty: 3,
    frequency: 5,
    question: 'Vue 2.x 的 Object.defineProperty 与 Vue 3.x 的 Proxy 响应式原理有什么区别？各有什么优缺点？',
    answer: {
      short: 'Vue 2 使用 Object.defineProperty 深度递归劫持现有属性，无法监听属性新增/删除及数组索引变化；Vue 3 使用 ES6 Proxy 代理整个对象，在运行时动态收集依赖，天然支持新增属性和数组监听，且具有懒代理的高性能。',
      thinkingProcess: '1. 时代演进：响应式系统的底层升级。\n2. Vue 2 缺陷：递归调用 defineProperty，如果对象层级极深，初次加载慢；且无法监测 `$set` 之外的新属性。\n3. Vue 3 飞跃：Proxy 直接拦截外界对整个对象的读写（包含 13 种拦截方法）。且它是“懒代理”，只有读到深层属性时，才会动态将子树包装为 Proxy，性能强悍。',
      deepDive: 'Object.defineProperty 的原理是直接修改对象属性描述符，必须对每个属性进行显式绑定，所以无法感知属性的 `delete` 和 `add`。而 Proxy 原理是代理了整个对象，任何通过该 Proxy 的读写（getter/setter）都要经过拦截层。缺点是 Proxy 是 ES6 新特性，无法通过 Polyfill 完美向下兼容，所以 Vue 3 彻底放弃了对 IE11 编译的支持。',
      structured: [
        'Vue 2：Object.defineProperty，静态劫持属性，无法监听 delete/add，无法监听数组直接赋值',
        'Vue 3：Proxy，动态代理整个对象，支持全部数据类型（Map/Set/Array），支持运行时新增属性',
        '性能差异：Vue 2 初始化时需要暴力深度递归；Vue 3 在读取时才动态包裹 Proxy（惰性代理），首开效率极大提升',
        '兼容性：Proxy 无法被 ES5 Polyfill 模拟，Vue 3 不支持 IE11 浏览器'
      ]
    },
    keyPoints: ['Object.defineProperty', 'Proxy 代理', '惰性代理', 'Reactivity', 'IE 兼容'],
    traps: ['即使在 Vue 3 中，Proxy 也只能拦截“通过代理对象”发起的读写。如果是对原生 target 原始对象直接进行修改，依然无法触发响应式重绘'],
    relatedIds: []
  },
  {
    id: 'interview_vue_003',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Ref 与 Reactive 的深层区别与使用场景',
    difficulty: 2,
    frequency: 5,
    question: '在 Vue 3 中，ref 和 reactive 在声明响应式数据时有什么本质区别？在实际开发中该如何进行最佳实践选型？',
    answer: {
      short: 'ref 用于声明基础类型或对象类型的响应式数据，底层通过 RefImpl 类的 getter/setter 及 Proxy 进行包装，在 JS 中必须使用 .value 读写；reactive 仅用于声明对象/数组类型，底层直接调用 Proxy 包装；建议优先全量使用 ref 以保持写法的一致性，且 ref 能够避免 reactive 解构丢失响应式响应式的问题。',
      thinkingProcess: '1. 概念厘清：ref 是响应式引用，reactive 是响应式对象。\n2. 原理差异：如果是基础类型（如数字、字符串），Proxy 无法拦截，因为 Proxy 只能代理对象。所以 ref 内部会将其包装为一个 `{ value: x }` 对象，并定义 get/set 拦截。如果是复杂类型，ref 内部也是调用 reactive 代理。\n3. 解构坑点：reactive 返回的对象，如果执行 `let { name } = state`，`name` 就变成了普通字符串，响应式断裂。而 ref 通过包装类，可以通过 toRefs 保持响应。',
      deepDive: '为什么 reactive 容易丢失响应式？\n```javascript\nlet state = reactive({ count: 0 });\n// 错误更新一：重新赋值导致引用丢失\nstate = reactive({ count: 1 }); // 此时页面不会重绘，原 Proxy 绑定被新对象覆盖，旧订阅失效\n// 错误更新二：解构\nconst { count } = state; // count 变成纯数字，Setter 无法被拦截\n```\n而使用 `const count = ref(0)`，无论如何传递这个引用，只要读写 `count.value`，React 响应式系统就能精准拦截并跟踪。',
      structured: [
        '底层机制：ref 用属性访问器（get/set value）和对象拦截；reactive 直接使用 Proxy 代理',
        '类型限制：ref 可接受任何类型（包含数字、布尔、对象）；reactive 只能接受对象/数组/Map/Set',
        '解构陷阱：reactive 直接解构或整体重新赋值会丢掉响应式；ref 通过 value 包裹层避免了这一缺陷',
        '选型指南：推荐优先全量使用 ref，不仅语法一致，且配合 script setup 的 defineModel 开发效率更高'
      ]
    },
    keyPoints: ['ref', 'reactive', 'toRefs', '解构陷阱', '.value', '最佳实践'],
    traps: ['使用 ref 时在 JS 中要写 .value，但在 <template> 模板渲染中千万不要写 .value（会自动解包），而在 reactive 的普通对象解包规则中也有所不同，必须注意识别'],
    relatedIds: []
  },
  {
    id: 'interview_vue_004',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Computed 与 Watch、WatchEffect 区别',
    difficulty: 2,
    frequency: 5,
    question: 'computed, watch 和 watchEffect 三者有什么核心区别？在实际业务中应该如何选择？',
    answer: {
      short: 'computed 具有缓存性，只有在依赖值变动时重新计算，用于衍生只读状态；watch 是惰性的、需要手动指定监听源，支持获取新旧值并做异步副作用；watchEffect 是立即执行的、会自动收集其回调内用到的所有响应式依赖，适合无需获取旧值且依赖项繁多的场景。',
      thinkingProcess: '1. 概念对应：衍生值 vs 主动监听副作用。\n2. computed 缓存性：其内部有一个 `dirty` 标志位。如果依赖没变，直接读缓存，开销极小。适用于繁重的格式化计算。\n3. watch 与 watchEffect：watchEffect 相当于 React 的 useEffect，首次无脑跑一次以收集依赖；而 watch 首次默认不跑，除非加 `immediate: true`。',
      deepDive: 'watchEffect 与 watch 的最大区别是**自动收集依赖**：\n```javascript\n// watchEffect 会自动感知到内部用到了 user.id 并自动订阅它\nwatchEffect(() => {\n  console.log(\'用户ID改变了：\', user.id);\n});\n```\n如果使用 watch，你必须显式写出监听源：`watch(() => user.id, (newVal, oldVal) => { ... })`。但在需要知道“旧值是多少”来做逻辑差异比对、或者执行耗时大的 API 请求防抖时，应该用 watch。',
      structured: [
        'computed：计算衍生属性，具有缓存惰性（dirty 标志位），依赖未变直接使用旧值，严禁在其中写修改 state 的副作用',
        'watch：精细化副作用，惰性监听，需要显式指定源，提供 newVal/oldVal，适合复杂的网络请求和防抖',
        'watchEffect：自动副作用，立即执行，自动收集依赖，不支持旧值，代码极简'
      ]
    },
    keyPoints: ['computed', 'watch', 'watchEffect', '自动依赖收集', '缓存机制'],
    traps: ['如果在 computed 中写了修改状态（修改 ref/reactive）的副作用代码，会导致响应式循环触发，控制台会报调用栈溢出（Maximum call stack size exceeded）'],
    relatedIds: []
  },
  {
    id: 'interview_vue_005',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 模板编译优化（PatchFlags/Static Hoisting）',
    difficulty: 4,
    frequency: 4,
    question: 'Vue 3 是如何通过编译期优化（Compiler Optimization）超越 React 纯运行时 Diff 性能的？请详述 PatchFlags、静态提升（Static Hoisting）和 BlockTree 的工作原理。',
    answer: {
      short: 'Vue 3 依靠模板编译器在构建期对静态和动态节点进行区分；PatchFlags 仅对动态绑定属性打上数值标记，Diff 时仅针对性更新对应属性；静态提升将无变化的 DOM 提取到 render 函数外，避免每次渲染重复创建对象；Block Tree 将动态节点直接提取扁平化为一层，实现跳过静态 DOM 直接遍历动态节点的超高性能 Diff。',
      thinkingProcess: '1. 编译优势：Vue 的 SFC 模板语法在编译阶段提供了极大的结构确定性。React 是纯运行时 JS（JSX 可以任意写 map/if），难以进行静态推导。\n2. PatchFlags 详解：比如一个节点 `<div :class="cls">hello</div>`，编译后会变成 `_createVNode("div", null, "hello", 2 /* CLASS */)`。Diff 时看到 2，直接比对 class，不用去管 style, text 等其他属性。\n3. 静态提升（Static Hoisting）：没有绑定的静态 div，直接提取到外部为全局常量 `_hoisted_1 = _createVNode("span", null, "静态内容")`。',
      deepDive: 'Block Tree 机制突破了“嵌套 DOM 层级”的限制。当页面中有 `<div><div><span>静态</span><p>{{dynamic}}</p></div></div>` 时，如果没有 Block Tree，Diff 仍然要层层递归节点。Vue 3 在带有 `v-if/v-for` 的临界点创建 Block，把内部所有的动态子节点拉平挂在这个 Block 的 `dynamicChildren` 数组中。这样在更新时，直接遍历这个一维数组，Diff 复杂度直接与“动态节点数”关联，而非 DOM 树层级深度。',
      structured: [
        'PatchFlags（靶向更新）：对动态属性添加二进制位数值（如 CLASS, TEXT），Diff 时只靶向比对有标记的属性',
        '静态提升（Static Hoisting）：把静态的节点和 props 提取到 render 闭包外，零重复创建开销，降低 GC 压力',
        '预字符串化（Hoist Static Text）：遇到大段静态 HTML，直接编译为一串 _createStaticVNode(htmlString) 字符串，提升解析速度',
        'BlockTree（扁平化动态更新）：跳过静态包裹层，仅将动态节点聚合为一个一维数组进行更新遍历'
      ]
    },
    keyPoints: ['PatchFlags', 'Static Hoisting', 'Block Tree', 'SFC 编译优化', '编译运行结合'],
    traps: ['因为 Vue 3 依赖这套高度契合的编译器优化，所以如果你在 Vue 3 中全量使用手动写 render() 函数或 JSX 写法，整个 Compiler 优化就会完全失效，退回到和 React 类似的纯运行时深度 Diff 状态'],
    relatedIds: []
  },
  {
    id: 'interview_vue_006',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'nextTick 实现原理与微任务调度',
    difficulty: 3,
    frequency: 5,
    question: 'Vue 的 nextTick 的作用是什么？它的底层是如何利用浏览器的微任务（Microtask）队列实现 DOM 更新劫持的？',
    answer: {
      short: 'nextTick 用于在下一个 DOM 更新循环结束之后执行延迟回调，确保获取到更新后的最新 DOM；它的底层将用户传入的回调函数和响应式更新渲染包裹进同一个 Promise.then() 的微任务队列中，利用微任务在事件循环中优先于渲染绘制执行的特点，合并多次 DOM 修改，统一执行渲染。',
      thinkingProcess: '1. 痛点：Vue 的 DOM 更新是“异步批处理”的。你在 JS 里改了 `count.value = 1`，下一行立马去拿 textContent 还是老值。\n2. nextTick 目的：让你的回调排在 Vue 的 DOM 渲染微任务之后执行，这样你的回调里就能稳稳拿到最新 DOM。\n3. 核心机制：Vue 维护一个全局队列 `queue`，每次数据变化，把更新渲染 Effect 塞入队列。nextTick 相当于执行 `Promise.resolve().then(flushJobs)`，把队列里的更新任务和你的回调都推入浏览器的微任务栈里，依次执行。',
      deepDive: '在 Vue 2 中，由于要支持老浏览器，nextTick 会有一套优雅降级降级方案：优先使用 `Promise.then`（微任务），如果不支持降级为 `MutationObserver`（微任务），再降级为 `setImmediate`（宏任务），最后降级为 `setTimeout(fn, 0)`（宏任务）。在 Vue 3 中，由于放弃了对旧版 IE 的支持，底层彻底精简，直接使用原生的 `Promise.resolve().then(flushJobs)` 来进行微任务分发调度，性能极其稳定。',
      structured: [
        '作用：解决 Vue 异步状态修改后，同步获取 DOM 数据陈旧的常见时序 Bug',
        '异步批处理：State 改变后，Vue 不会立刻触重排，而是缓存渲染任务在 flushQueue 中，下个事件循环微任务中执行',
        '微任务通道：Vue 3 内部将任务全部交由 Promise.then()，利用 Event Loop 在一帧绘制前将队列里的 DOM 刷新清空',
        '用法：支持 async/await 语法：`await nextTick(); console.log(el.innerText)`'
      ]
    },
    keyPoints: ['nextTick', 'Promise.then', '微任务', 'Event Loop', '异步更新队列'],
    traps: ['不要在同步循环里反复高频调用 nextTick，这会导致微任务队列过长，阻塞浏览器的 UI 渲染和交互主线程，引起页面严重掉帧卡顿'],
    relatedIds: []
  },
  {
    id: 'interview_vue_007',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 生命周期映射（Vue 2 vs Vue 3）',
    difficulty: 1,
    frequency: 4,
    question: '请列出 Vue 2.x 和 Vue 3.x 常用生命周期钩子的对应映射关系，并说明 Composition API 中的生命周期在执行上有何特点？',
    answer: {
      short: 'Vue 3 在 Composition API 中将 beforeDestroy 改名为 onBeforeUnmount，destroyed 改名为 onUnmounted；其最大的特点是无需在 options 选项里声明，可以直接在 setup() 函数内部以 onBeforeMount() 等函数式调用多次注册。',
      thinkingProcess: '1. 概念对照：组件生命周期的阶段是相同的（创建 -> 挂载 -> 更新 -> 卸载）。\n2. 命名变更：为了更贴合 Unmount 语义，Vue 3 舍弃了 Destroy 命名。\n3. setup 执行：注意 Vue 3 中没有 `onBeforeCreate` 和 `onCreated` 的 Hook 映射。因为 `setup()` 函数本身就是在这两个生命周期的时机执行的，初始化代码直接写在 setup 内部即可。',
      deepDive: '在 Options API 中，一个组件只能写一个 `mounted` 方法。但在 Composition API 中，你可以写多个 `onMounted`，它们会按照你的书写顺序依次被注册进一个数组中，等到组件挂载时依次执行。这极易于按逻辑关注点组织代码，把同一个功能的初始化和卸载逻辑聚拢在一起：\n```javascript\n// 功能一：监听窗口尺寸\nsetup() {\n  onMounted(() => window.addEventListener(\'resize\', handle));\n  onUnmounted(() => window.removeEventListener(\'resize\', handle));\n  \n  // 功能二：统计定时器\n  onMounted(() => startTimer());\n  onUnmounted(() => stopTimer());\n}\n```',
      structured: [
        'beforeCreate / created -> 直接在 setup() 内部书写执行代码',
        'beforeMount / mounted -> onBeforeMount() / onMounted()',
        'beforeUpdate / updated -> onBeforeUpdate() / onUpdated()',
        'beforeDestroy / destroyed -> onBeforeUnmount() / onUnmounted()命名更名',
        '多次注册：可在同一个 setup 里重复调用 onMounted 绑定不同的业务逻辑段，底层为数组顺序执行'
      ]
    },
    keyPoints: ['生命周期', 'onMounted', 'onUnmounted', 'Options API对比', '多次调用'],
    traps: ['onMounted 等 Hook 只能在 setup() 或其直接子函数调用树同步执行期间同步注册，不能在异步的回调（如 setTimeout 或 fetch().then()）中去调用注册，否则会因为找不到当前渲染上下文而失效报错'],
    relatedIds: []
  },
  {
    id: 'interview_vue_008',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue Router 路由模式：Hash vs History 原理',
    difficulty: 2,
    frequency: 4,
    question: 'Vue Router 中的 Hash 模式和 History 模式有什么根本区别？它们的底层浏览器 API 是什么？History 模式为什么需要后端配置支持？',
    answer: {
      short: 'Hash 模式基于 URL 中的 # 符号，底层利用 hashchange 事件监听路由，不需要后端配置；History 模式基于 HTML5 History API，利用 pushState/replaceState 改变地址并监听 popstate 事件；History 模式在刷新页面时会向服务器发起真实网络请求，若后端未配置重定向到 index.html，会导致 404 错误。',
      thinkingProcess: '1. 原理差异：前端路由的本质是在“不刷新浏览器页面”的前提下，局部重绘 DOM。\n2. Hash 优势：# 后面的路径变化不会被浏览器塞进 HTTP 请求中发送给服务器。服务器只看前面的域名，所以刷新永远不报 404。\n3. History 痛点：当用户直接在地址栏敲下 `https://my-vue.com/user/detail` 并刷新。浏览器会误以为这是一个真实存在的后端接口并去发请求，如果服务器上没有 /user/detail 这个物理目录和文件，直接返回 404 挂掉。',
      deepDive: 'History 模式的后端治理（以 Nginx 为例）：\nNginx 必须配置 `try_files`，强令所有未命中的静态文件路径全部回退重定向到首屏的 `index.html`。由 index.html 中的 Vue Router JS 启动后，再去重新解析 URL 路径并分发组件呈现。\n```nginx\nlocation / {\n  try_files $uri $uri/ /index.html;\n}\n```',
      structured: [
        'Hash 模式：利用 window.location.hash 与 hashchange 事件，开发部署简单，不需要任何服务器干预',
        'History 模式：利用 HTML5 的 history.pushState() 与 popstate 监听，URL 不带 # 符号，体验逼真优雅',
        'History 404 症结：刷新网页导致浏览器将前端路由当成后端物理 API 发请求导致 404',
        'Nginx 修复：配置 try_files 指向 index.html，让路由的解析权重新回归到前端 SPA 应用手中'
      ]
    },
    keyPoints: ['Vue Router', 'Hash模式', 'History模式', 'pushState', 'Nginx try_files', 'popstate'],
    traps: ['在 History 模式下，项目中的所有静态资源引用（如 img src, js script）最好都写成绝对路径（如以 / 开头），如果写成相对路径，多级前端路由刷新后会导致路径计算错误引起资源加载白屏'],
    relatedIds: []
  },
  {
    id: 'interview_vue_009',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Keep-alive 缓存组件机制与生命周期',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 的 <keep-alive> 组件有什么作用？它的底层是如何实现组件实例缓存的？当组件被缓存后，生命周期会发生什么变化？',
    answer: {
      short: '<keep-alive> 是内置抽象组件，用于在多个组件动态切换时缓存其 DOM 结构和实例状态，避免重复销毁与重建；其底层在内部维护了一个 cache 映射表和 keys 数组（基于 LRU 缓存淘汰算法）；被缓存的组件会失去普通的 mounted 和 unmounted 生命周期，转而触发 activated 和 deactivated 专属钩子。',
      thinkingProcess: '1. 业务痛点：用户在一个长列表页往下滑动，点进详情页，点击返回。如果没有 keep-alive，列表页会重新挂载，滚动条回到了最顶端，重新发请求，体验极差。\n2. 底层实现：Keep-alive 不渲染真实的 DOM。它拦截了组件的挂载卸载。把组件的 `vnode.componentInstance` 缓存在内存的 map 对象中。\n3. LRU 算法：Least Recently Used（最近最少使用）。如果设置了 max=10，缓存满了以后，会自动销毁最久没有被点击消费的组件。',
      deepDive: 'Keep-alive 缓存的组件在切换时：\n- 首次进入：`created` -> `mounted` -> `activated`。\n- 离开组件：`deactivated`（不触发 unmounted，DOM 被移出文档流，但实例存在内存中）。\n- 再次进入：不走 created/mounted，直接触发 `activated`。如果需要在每次返回时重新刷新某段核心数据，必须把这部分初始化代码挪到 `activated` 钩子中执行。',
      structured: [
        '作用：内置容器组件，保留切出组件的实例状态与渲染出的真实 DOM，避开重新实例化的开销',
        '淘汰算法：LRU 算法机制控制缓存堆叠上限，当 max 超标时自动清理最久未激活的实例',
        '生命周期：activated (唤醒激活)、deactivated (离线冻结)',
        '使用配置：通过 include / exclude 属性传入正则或组件名，做精确的靶向缓存过滤控制'
      ]
    },
    keyPoints: ['keep-alive', 'LRU 算法', 'activated', 'deactivated', '组件状态缓存'],
    traps: ['缓存组件最大的问题是数据易过期。必须在 activated 生命周期中去获取需要随页面返回实时刷新变化的数据，防止用户看到陈旧的数据内容'],
    relatedIds: []
  },
  {
    id: 'interview_vue_010',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: '动态组件与异步组件 defineAsyncComponent',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3 中如何使用 <component :is="..."> 实现动态组件？如何配合 defineAsyncComponent 实现大包静态分包与异步组件加载？',
    answer: {
      short: '动态组件通过 <component> 容器标签结合 :is 绑定组件变量名实现按需挂载；异步组件通过 defineAsyncComponent 包裹动态 import() 引入，实现代码在编译时打包分块（Code Splitting），并在运行时按需加载，从而优化首屏加载包体大小。',
      thinkingProcess: '1. 动态消费：`<component :is="currentTab" />`，可用于页签切换。\n2. 异步优化：如果我们的页面很大，有一些重的模态框（Modal）或复杂的折线图（ECharts）可能用户一次都不会点。我们不应该在首屏打包它们。\n3. 核心 API：`defineAsyncComponent` 可以接受一个加载配置，包括 loadingComponent (加载中骨架)、errorComponent (加载失败降级) 以及超时时间。',
      deepDive: '配置完善的 `defineAsyncComponent` 示例：\n```javascript\nconst AsyncChart = defineAsyncComponent({\n  loader: () => import(\'./components/HeavyChart.vue\'),\n  loadingComponent: LoadingSpinner,\n  errorComponent: ErrorFallback,\n  delay: 200, // 超过 200ms 才展示 Loading，防闪烁\n  timeout: 3000 // 3s 超时报错\n});\n```\n这实现了在运行时通过 JSONP 动态拉取 chunk js，是中大型 Vue 项目进行性能优化的必备招式。',
      structured: [
        '动态组件：使用内置 <component :is="ComponentObj"> 动态切换挂载实例对象',
        '异步加载：defineAsyncComponent 拦截组件打包，自动切分为独立的 chunk.js 文件',
        '加载态控制：内置 loading / error / delay / timeout 等精细的异步加载生命周期控制阀',
        '联合使用：配合 <Suspense> 容器在 Vue 3 中实现更高规格的全栈异步组件挂载与骨架屏插座渲染'
      ]
    },
    keyPoints: ['动态组件', 'defineAsyncComponent', '代码分割', '异步加载', 'Vite分包'],
    traps: ['使用 defineAsyncComponent 引入的组件是一个“异步包装对象”。如果把这个异步组件直接当做 key 值放入 reactive 对象中进行高频轮询读写，由于其 Proxy 拦截，可能会在某些极老版机型下产生额外的运行时计算开销'],
    relatedIds: []
  },
  {
    id: 'interview_vue_011',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 自定义指令（Custom Directives）实战',
    difficulty: 2,
    frequency: 4,
    question: '请简述 Vue 3 中如何声明并注册一个自定义指令？常用生命周期钩子有哪些？如何手写一个防连击（防抖）提交或按钮权限控制指令？',
    answer: {
      short: '自定义指令是在选项中定义 v- 前缀命名的对象，或通过 app.directive 全局注册；Vue 3 常用生命周期有 created、mounted、updated 和 unmounted；防抖指令可通过在 mounted 中拦截目标 DOM 的点击事件，计算防抖执行后才触发传入的 binding.value 函数。',
      thinkingProcess: '1. 功能界定：当需要对底层的物理 DOM 进行直接操作、修改其属性或劫持事件时，使用自定义指令（Directives）是最高内聚的做法。\n2. 生命周期对齐：Vue 3 对自定义指令的钩子命名进行了重构，使之与组件生命周期完全对齐（之前 Vue 2 是 bind/inserted/update/unbind）。\n3. 实战手写：权限控制指令（v-permission）根据用户的 role 判定是否存在于数组中，如果不存在直接执行 `el.parentNode.removeChild(el)` 强行移除。',
      deepDive: '手写一个全局防连击点击指令 `v-debounce` 的核心代码：\n```javascript\napp.directive(\'debounce\', {\n  mounted(el, binding) {\n    let timer = null;\n    el._clickDebounce = (e) => {\n      if (timer) clearTimeout(timer);\n      timer = setTimeout(() => {\n        binding.value(e); // 执行指令绑定的回调函数\n      }, binding.arg || 300); // 接收传入的毫秒时间参数\n    };\n    el.addEventListener(\'click\', el._clickDebounce);\n  },\n  unmounted(el) {\n    el.removeEventListener(\'click\', el._clickDebounce); // 注销事件，预防内存泄漏\n  }\n});\n```',
      structured: [
        '注册机制：通过 `app.directive(\'name\', directiveConfig)` 全局注册，以 `v-name` 格式进行标签属性消费',
        '生命周期：created -> beforeMount -> mounted -> beforeUpdate -> updated -> beforeUnmount -> unmounted',
        '权限指令原理：mounted 中获取当前存储的角色权限，不符则直接利用 parentNode 剔除自身 Host DOM',
        '防漏控制：必须在 unmounted 钩子中执行绑定的 DOM 事件移除（removeEventListener），防止事件泄漏驻留'
      ]
    },
    keyPoints: ['自定义指令', '防抖指令', '权限控制', 'unmounted 移除', 'DOM 操作'],
    traps: ['在 mounted 中使用自定义指令移除当前 DOM 时，如果父容器尚未挂载完成（parent 为空），直接调用 el.parentNode 会报错，应在 beforeMount 或通过 nextTick 安全获取祖先'],
    relatedIds: []
  },
  {
    id: 'interview_vue_012',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 状态管理升级：Pinia vs Vuex 对比',
    difficulty: 3,
    frequency: 4,
    question: 'Pinia 作为 Vue 3 官方推荐的状态管理库，与老一代的 Vuex 3.x/4.x 相比有什么重大的改进和优势？',
    answer: {
      short: 'Pinia 彻底移除了 mutation，所有状态修改都简化合并为在 action 中直接更新，支持同步和异步；天然支持 Vue 3 官方的 Composition API 语法（通过 setup 编写 Store）；去除了复杂的 modules 模块嵌套，改为更直觉的扁平化多 Store 设计；且天生内置了完美的 TypeScript 类型推导支持。',
      thinkingProcess: '1. 技术更迭：Pinia 被称为“下一代的 Vuex”（Vuex 5 的方案被合并为了 Pinia）。\n2. 痛点消除：在 Vuex 里，为了执行一个简单的修改操作，我们必须先 dispatch 调 action，在 action 里 commit 调 mutation，最后由 mutation 修改 state。冗余且繁琐。Pinia 精简了这一链路。\n3. 类型支持：Vuex 的 string 拼写 mutations 很难做 TS 自动类型安全校验；Pinia 完美原生推导。',
      deepDive: '在 Pinia 中，每一个 Store 都是一个扁平的实体。你不需要再写 `store.state.user.info`。你可以定义 `useUserStore`、`useCartStore` 等多个独立的 Store，并在需要时跨 Store 调用。同时，Pinia 可以非常完美地和 Composition API 配合：\n```javascript\nexport const useCounterStore = defineStore(\'counter\', () => {\n  const count = ref(0);\n  const double = computed(() => count.value * 2);\n  function increment() { count.value++; }\n  return { count, double, increment }; // setup 编写 store，极度直觉\n});\n```',
      structured: [
        '链路精简：砍掉 Mutation 概念，Action 支持同步/异步直接修改 State，开发代码量削减 50%',
        '扁平设计：抛弃 Modules 嵌套树，每个业务模块是独立的扁平 Store，跨 Store 直接调用极其简单',
        'TS 拥抱：不用像 Vuex 般手写繁重的自定义类型注解，API 天然完美推导类型安全',
        '写法革新：支持 setup() 函数式定义，与 Composition API 达到了设计美学的高度统一'
      ]
    },
    keyPoints: ['Pinia', 'Vuex对比', 'Action合并', '扁平化Store', 'TS类型推导', 'setup定义'],
    traps: ['从 Pinia Store 中解构状态（如 `const { count } = useCounterStore()`）会导致 count 丢失响应式。必须使用 `storeToRefs(store)` 才能安全进行响应式解构'],
    relatedIds: []
  },
  {
    id: 'interview_vue_013',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Teleport 传送门原理与 React Portal 对比',
    difficulty: 2,
    frequency: 4,
    question: 'Vue 3 的 <Teleport> 组件有什么作用？它与 React 的 createPortal 有什么异同？',
    answer: {
      short: 'Teleport 是内置组件，用于将模板中的子元素传送到指定的 DOM 节点下渲染；它与 React 的 createPortal 目的相同，都是解决全局 Modal 层级被父级 overflow 截断的问题；不同之处在于 Teleport 提供了声明式的组件写法（<teleport to="body">），比 React 的命令式 API 更符合 HTML 的直觉编写习惯。',
      thinkingProcess: '1. 概念对照：Vue Teleport vs React Portal。\n2. 声明式优势：Vue 用 `<teleport to="#modal-container">`；React 必须调用 `createPortal(JSX, container)`，需要在 JS 逻辑中控制挂载点。\n3. 原理共性：在组件树的逻辑层级上，它们依然维持原有的父子关系（数据传递 provide/inject 照常工作），只在最终物理渲染时将 DOM 剪切移动。',
      deepDive: 'Teleport 核心源码机制：\n在 Vue 3 的 VNode 渲染链路中，Teleport 被标记为一个特殊的组件。在 Mount 挂载阶段，渲染器（Renderer）如果发现该节点的 `shapeFlag` 属于 Teleport，会调用专门的 `teleport.process` 方法。它会额外创建两个占位锚点（Anchor），然后调用浏览器的 `insert` 方法，直接将生成的物理 DOM 树插入到指定的 `to`（如 body）节点下。卸载时，也会去 `to` 节点下把元素干净清除，确保逻辑与物理表现统一。',
      structured: [
        '作用：将子组件的 HTML 结构物理传送到目标宿主 DOM（如 #modal-root）中，打破 CSS z-index 锁定',
        '写法区别：Vue 使用声明式 `<teleport to="body">` 标签；React 必须使用命令式 `createPortal` 异步函数包装',
        '逻辑统一：不干扰 Vue 组件的数据通道，Provide/Inject、Props 传递在传送后依然有效正常',
        '条件传送：可以通过 disabled 属性动态控制是否开启传送，灵活度极高'
      ]
    },
    keyPoints: ['Teleport', 'createPortal', '样式隔离', '逻辑继承', 'disabled 属性'],
    traps: ['当使用 Teleport 时，目标容器 DOM（如 to="body" 里的 body）必须在 Teleport 组件挂载时“已经存在于物理文档流中”，否则会抛出无法找到目标 DOM 的运行时错误'],
    relatedIds: []
  },
  {
    id: 'interview_vue_014',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: '插槽（Slots）底层编译原理与作用域插槽',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 的默认插槽、具名插槽和作用域插槽（Scoped Slots）底层编译后的本质是什么？作用域插槽是如何实现子组件向父组件传参的？',
    answer: {
      short: '插槽底层被编译为返回虚拟 DOM（VNode）的函数；父组件的插槽内容在子组件渲染时被作为回调函数执行并传入子组件的内部状态；具名插槽编译为键值对对象；作用域插槽本质是带参数的回调函数：`slots.default({ data: childState })`。',
      thinkingProcess: '1. 原理深究：把标签模板转换成代码函数。`<slot>` 是个“占位符”。\n2. 编译产物：父组件使用子组件时，传入的插槽内容会被包裹成一个对象。对象的每个 Key 是插槽名，Value 是一个返回 VNode 数组的“函数”。\n3. 作用域插槽核心：在子组件内部执行这个函数时，可以把子组件的 state 作为参数传进去。这样父组件在定义插槽时就能在这个函数的形参里拿到数据并做响应。',
      deepDive: 'Vue 3 对插槽的编译做到了**极致的性能优化**：\n在 Vue 2 中，由于插槽在父组件中编译，父组件的数据变化会导致插槽重新编译，进而引发子组件被动更新。Vue 3 将插槽统一编译为“懒执行函数（Lazy Function）”，在子组件渲染时才真正调用执行。这意味着如果插槽内依赖的数据只在子组件内部发生改变，父组件**完全不会被触发重新渲染**，实现了组件层面的精准重绘隔离。',
      structured: [
        '本质：插槽在编译后全部被转化为返回 VNode 的 JavaScript 函数',
        '具名插槽：编译为 `{ header: () => VNode, default: () => VNode }` 的函数映射字典',
        '作用域插槽：本质是一个带形参的函数，子组件调用时传入私有状态 `slots.default(childState)` 完成向上传值',
        'Vue 3 优化：插槽函数懒执行，从原本的父组件执行重绘转移到子组件内执行，避免父组件无意义联动渲染'
      ]
    },
    keyPoints: ['Slots', '作用域插槽', '懒执行函数', 'VNode映射', '组件更新隔离'],
    traps: ['在父组件中定义作用域插槽时，不要在插槽内部执行重度的、会触发父组件状态更新的副作用操作，否则由于懒执行函数的多次触发，极易引发无限循环死锁更新'],
    relatedIds: []
  },
  {
    id: 'interview_vue_015',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 快速 Diff 算法与 LIS 最长递增子序列',
    difficulty: 4,
    frequency: 4,
    question: 'Vue 3 的 Diff 算法相比 Vue 2 有哪些大升级？它是如何利用最长递增子序列（LIS）算法将 DOM 移动操作降到最少的？',
    answer: {
      short: 'Vue 3 引入了快速 Diff 算法；首先执行头部和尾部的相同节点合并（打掉无变化首尾），对剩下乱序的子节点数组计算出“最长递增子序列”的索引集合，这些索引所对应的物理 DOM 节点在新旧列表中相对顺序未变，因此在重排时完全不移动，只去移动子序列之外的元素，将物理 DOM 变动次数降到极限最低。',
      thinkingProcess: '1. 对比升级：Vue 2 使用双端比较算法（头头、尾尾、头尾、尾头四指针比对）。Vue 3 抛弃了双端，采用了类似 ivi 和 snabbdom 的快速 Diff。\n2. 算法细节：比如旧节点为 `[a, b, c, d, e, f]`，新节点为 `[a, b, d, c, e, f]`。首尾相同的 `a, b` 和 `e, f` 会在第一步直接被合并复用并排除。剩下乱序的 `[c, d]` 与 `[d, c]`。\n3. LIS 核心：计算最长递增子序列（Longest Increasing Subsequence）。计算出的递增序列所代表的节点是不需要移动的，只需把非序列内的节点移动到正确位置，确保性能最优。',
      deepDive: '手写最长递增子序列是一个经典的动态规划+二分查找查找问题。Vue 3 的底层使用该算法，主要是为了解决大型复杂动态子列表（如拖拽排序列表、大量看板卡片顺序调整）时的渲染卡顿。通过该算法，Vue 3 保证了真实的 DOM 原生操作（insert/move）次数在数学理论上达到了最小的绝对下限，极大地释放了浏览器的重排主线程带宽。',
      structured: [
        'Vue 2 双端算法：通过头尾双指针不断向中心收缩比对，但针对复杂乱序时的位移处理效率较低',
        'Vue 3 快速算法：1. 头部比对复用；2. 尾部比对复用；3. 对余下乱序节点做哈希映射比对',
        '最长递增子序列（LIS）应用：计算乱序中相对位置未变的最长节点索引子集，在 DOM 重排时锁定这些节点不移动',
        '优化成果：将最消耗物理性能的物理 DOM insert / append 操作降低到极致最少'
      ]
    },
    keyPoints: ['快速 Diff', '最长递增子序列 LIS', '双端比较', 'DOM 物理重排', '算法优化'],
    traps: ['虽然 LIS 算法极其高效，但它的运行基础也是“列表项必须绑定了正确的非 index 唯一 key”，如果 key 绑定有错，Vue 3 会由于哈希表匹配失效，退回到最暴力的全量销毁重建模式'],
    relatedIds: []
  },
  {
    id: 'interview_vue_016',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 服务端渲染（SSR）架构与水合（Hydration）流程',
    difficulty: 4,
    frequency: 4,
    question: '在 Nuxt.js 或原生 Vue SSR 中，服务端渲染的整体管线是什么样的？水合（Hydration）在客户端是如何被激活并让静态 HTML 具备交互能力的？',
    answer: {
      short: '服务端接收请求，将 Vue 组件树编译为虚拟 DOM 并利用 renderToString 输出静态 HTML 字符串返回；客户端下载 HTML 后瞬间完成首屏渲染，同时加载 JS bundle；React/Vue 运行时在客户端执行“水合（Hydration）”：扫描页面现有的 DOM 节点，与客户端本地渲染的虚拟 DOM 进行比对，绑定事件监听器，使静态页面获得动态响应式交互能力。',
      thinkingProcess: '1. 架构管线：服务端渲染不仅可以极大优化 FCP（首屏速度），更是 SEO 友好的必备手段（爬虫可以直接读取完整的 HTML，不用等待 JS 渲染）。\n2. 水合过程（Hydration）：是让静态 DOM 拥有活力的过程。这个过程极其微妙。客户端如果生成的 VDOM 和服务端返回的 HTML 标签结构对不上，就会发生“水合失败Mismatch”。\n3. 双端脱水与挂载：服务端会将当前引用的初始 Store 状态以 JSON 格式（通常是 `window.__INITIAL_STATE__`）注入 HTML 底部的 `<script>` 中，客户端读取该状态作为初始化 Store 值，保证数据绝对对齐（此过程称为“注水”与“脱水”）。',
      deepDive: '水合（Hydration）的底层实现机制分析：\n在 Hydrate 挂载期间，Vue 不会调用 `document.createElement` 去为每个虚拟节点创建新 DOM，而是直接通过 `el.firstChild` 等方法遍历扫描现有的物理 HTML 节点。它会把每个 Virtual Node 关联到现有的真实 DOM 节点上。一旦发现类型相同，它就直接为这个 DOM 节点执行 `addEventListener`。如果比对发现标签不一致，则会警告并降级，当场删除物理节点重新创建，引起首屏闪烁。',
      structured: [
        '服务端阶段：renderToString 执行全树同步解析，返回完整的、包含数据骨架的物理 HTML 网页',
        '数据注水与脱水：服务端将内存状态序列化（__NUXT__ 或 INITIAL_STATE）注入 script，客户端解析以对齐 state 内存',
        '客户端水合（Hydration）：Vue 运行时扫描现有 DOM 节点，绑定响应式监听事件，将静态页面激活为动态 SPA',
        '性能瓶颈：客户端水合阶段需要执行全量 VDOM 构建与 DOM 比对，如果 JS 包体过大会阻塞主线程首屏可交互时间 (TTI)'
      ]
    },
    keyPoints: ['SSR', 'Hydration', 'renderToString', '注水与脱水', 'TTI 优化', 'Nuxt.js'],
    traps: ['在进行 Vue SSR 开发时，绝对不要在 setup() 的生命周期或同步初始化代码中直接访问 window、document 或 localstorage 等浏览器特有对象，因为这些代码会在 Node.js 服务端执行，直接导致服务崩溃抛出 ReferenceError'],
    relatedIds: []
  },
  {
    id: 'interview_vue_017',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Reactivity 精细响应式 API 详解',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3 中 shallowRef, customRef, toRaw, markRaw 各有什么用途？在什么调优场景下使用它们？',
    answer: {
      short: 'shallowRef 只代理 value 属性本身，对其内部深层字段不做 Proxy 响应，用于优化超大只读对象；customRef 允许自定义 track 和 trigger 的执行逻辑，可实现防抖 Ref；toRaw 能够获取 Proxy 代理后的底层原生对象，避开响应式监听以提高计算速度；markRaw 能够给对象打上永久无法被代理的标记，防止外部意外对其响应化。',
      thinkingProcess: '1. 精细控制：Vue 3 默认是“深度响应”的。但很多业务场景不需要深响应，甚至深响应会带来极大的性能损耗。\n2. shallowRef 价值：例如我们把一个大地图对象（如 Mapbox 实例或 Three.js 场景对象）存入 state。这个对象包含成千上万个复杂的内部指针和矩阵，如果我们用 ref，Vue 会尝试递归把所有深层属性全部包裹 Proxy，这会导致严重的卡死和内存泄露。使用 `shallowRef` 可以锁定这个大实例本身，内部属性修改不触发 Proxy 追踪。\n3. toRaw：如果我们想把一个大响应式数组发送给 Web Worker 或做极其沉重的矩阵算法，用 toRaw 脱去 Proxy 包装可以大幅提升循环性能。',
      deepDive: '`customRef` 自定义防抖 Ref（useDebounceRef）经典手写：\n```javascript\nfunction useDebouncedRef(value, delay = 200) {\n  return customRef((track, trigger) => {\n    let timeout;\n    return {\n      get() {\n        track(); // 收集依赖\n        return value;\n      },\n      set(newValue) {\n        clearTimeout(timeout);\n        timeout = setTimeout(() => {\n          value = newValue;\n          trigger(); // 触发更新\n        }, delay);\n      }\n    };\n  });\n}\n```',
      structured: [
        'shallowRef：浅响应代理，只监听 `.value = newVal` 的替换，内部属性改动直接忽略，适合大实例/三方库集成',
        'customRef：依赖劫持，自定义 get (手动 track()) 与 set (手动 trigger())，可实现防抖/节流/计算拦截',
        'toRaw：脱壳操作，返回响应式 Proxy 的原生 target 原始引用，用于做沉重只读算法计算时提速',
        'markRaw：防代理标记，往对象挂载不可响应键值，常用于大图、第三方复杂 UI 实例等'
      ]
    },
    keyPoints: ['shallowRef', 'customRef', 'toRaw', 'markRaw', '非响应式优化', '大实例防卡死'],
    traps: ['使用 shallowRef 时，如果你直接修改了它深层的某个属性（如 `myRef.value.name = \'new\'`），页面是绝对不会重绘的，若想强行触发重绘，必须调用 `triggerRef(myRef)` 进行手动刷新'],
    relatedIds: []
  },
  {
    id: 'interview_vue_018',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 v-model 绑定与多个 v-model 修饰符',
    difficulty: 2,
    frequency: 4,
    question: 'Vue 3 的 v-model 双向绑定原理是什么？它与 Vue 2.x 相比有什么大升级？如何在同一个组件上绑定多个 v-model 并支持自定义修饰符？',
    answer: {
      short: 'Vue 3 的 v-model 本质是 modelValue 属性（prop）和 update:modelValue 事件的语法糖；Vue 3 最大的升级是彻底移除了 Vue 2 的 .sync 修饰符，支持通过 v-model:name 绑定多个独立的变量；且支持为每个 v-model 传入自定义修饰符，在 emit 前对数据进行清洗加工。',
      thinkingProcess: '1. 语法糖解构：默认 `<Child v-model="val" />` 等价于 `<Child :modelValue="val" @update:modelValue="n => val = n" />`。\n2. 双向绑定多路复用：如果一个表单项需要同时双向绑定“姓名”和“年龄”，可以写 `<Child v-model:name="userName" v-model:age="userAge" />`。这在 Vue 2 里必须写 `.sync` 或传入复杂的自定义事件，Vue 3 大大统一了 API。\n3. 自定义修饰符：比如需要输入的内容自动首字母大写，可以自定义 `v-model.capitalize`，在子组件里通过检测 `modelModifiers` 并作加工。',
      deepDive: '子组件处理多个自定义修饰符的实现模板：\n```javascript\n// 子组件定义接收：\nconst props = defineProps({\n  name: String,\n  nameModifiers: { default: () => ({}) } // 约定格式：属性名 + Modifiers\n});\nconst emit = defineEmits([\'update:name\']);\n\nfunction handleInput(e) {\n  let value = e.target.value;\n  if (props.nameModifiers.capitalize) {\n    value = value.charAt(0).toUpperCase() + value.slice(1); // 自动首字母大写\n  }\n  emit(\'update:name\', value);\n}\n```',
      structured: [
        '底层语法糖：默认绑定 `:modelValue` 属性与侦听 `@update:modelValue` 派发事件',
        '统一进化：干掉 Vue 2 复杂的 value/input + .sync 双轨设计，用多 v-model:name 直接取代之',
        '多路双绑：`<Comp v-model:title="text" v-model:content="desc" />`，逻辑清晰直观',
        '修饰符扩展：子组件通过 `[propName]Modifiers` 接收修饰符判定，可以在 Emit 前进行任意截断、转换或格式化操作'
      ]
    },
    keyPoints: ['v-model', 'update:modelValue', 'modelModifiers', '多v-model绑定', '.sync移除'],
    traps: ['如果直接给 v-model 传入的值是子组件只读的 props 属性（如 `v-model="props.name"`），由于子组件尝试直接修改 props 会引发单向数据流冲突，Vue 会在运行时抛出修改只读属性的红色警告'],
    relatedIds: []
  },
  {
    id: 'interview_vue_019',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'watch 侦听器选项深度剖析：deep, immediate, flush',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 的 watch 侦听器中，deep: true 的底层原理是什么？immediate 选项的作用是什么？flush 选项的 pre, post, sync 值各有什么区别和应用场景？',
    answer: {
      short: 'deep: true 的原理是深度递归遍历对象的所有属性以触发它们的 getter 以便进行依赖收集，若对象层级深则有极高的性能开销；immediate 选项指明在组件初始化时立刻执行一次回调；flush 选项控制回调在 DOM 更新前（pre）、DOM 更新后（post）还是同步（sync）执行，默认 pre，当需要在回调里读取最新的物理 DOM 时，必须设为 flush: post。',
      thinkingProcess: '1. 机制细节：这是 watch 进阶调优的重度考察点。\n2. deep 原理：如果不写 `deep: true`，watch 一个 reactive 对象，改变其深层属性 `obj.a.b = 1` 时是无法触发回调的。开启 deep 后，Vue 内部会执行一个 `traverse(value)` 函数，深度递归把所有嵌套属性读一遍，让所有深层属性都记住这个 watch 的 Effect。如果对象极其庞大，这会产生巨大的遍历开销。\n3. flush 参数：\n- `pre`：默认值。回调在 DOM 更新渲染之前被调用。\n- `post`：重要。回调在 DOM 更新之后被调用。非常适合“在侦听到数据变化后，要获取最新的 DOM 尺寸/宽度/高度并进行二次计算”的业务场景。\n- `sync`：同步执行。只要 setter 触发，当场立刻执行回调，不进入异步批处理队列，容易导致重复渲染掉帧。',
      deepDive: '为了节省性能，在 Vue 3 中如果你 watch 的是一个通过 `reactive` 声明的对象，Vue 默认会自动把 `deep` 选项设为 `true`。这就意味着，哪怕你没有写 `deep: true`，Vue 也会在底层自动进行深度递归遍历。如果你想避免这种自动深度遍历的开销，应该只去 watch 该对象的某一个特定的属性 getter：`watch(() => obj.a, (newVal) => { ... })`。这样 Vue 就只会单点监听 `obj.a` 的变化，不再会去深度递归遍历。',
      structured: [
        'deep: true：深度递归执行 traverse() 遍历全属性触发 getter 依赖收集，极度消耗大对象性能',
        'immediate: true：初始化挂载阶段同步强行触发一次回调渲染',
        'flush: pre：默认项，在 Vue DOM 更新机制前触发，DOM 数据较旧',
        'flush: post：在 Vue DOM 批更新后触发，回调中可以通过 ref 拿到最热的 DOM 像素值',
        'flush: sync：同步执行，避开异步合并机制，可能引发页面连续刷新的性能滑轨'
      ]
    },
    keyPoints: ['watch选项', 'deep原理', 'traverse', 'flush:post', '依赖项劫持'],
    traps: ['注意，直接侦听 `reactive` 对象的引用，会默认强制开启 `deep: true`，且无法通过手动设置 `deep: false` 来关闭此自动行为，大对象应尽量用 ref 搭配 shallowRef 优化'],
    relatedIds: []
  },
  {
    id: 'interview_vue_020',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'v-if 与 v-for 为什么不建议同签使用（Vue 2 vs Vue 3 优先级演变）',
    difficulty: 2,
    frequency: 5,
    question: '为什么 Vue 官方强烈不建议在同一个 HTML 元素上同时使用 v-if 和 v-for？在 Vue 2.x 和 Vue 3.x 中它们的优先级有什么根本不同？在实际开发中该如何进行优雅避坑？',
    answer: {
      short: '因为这会导致无谓的循环开销，即哪怕 v-if 为 false，系统仍然会为了列表进行遍历或报错；在 Vue 2 中 v-for 优先级高于 v-if，会导致列表全部生成后再挨个被 v-if 销毁；在 Vue 3 中 v-if 优先级高于 v-for，此时在 v-if 中如果引用了 v-for 的循环变量会直接报变量未定义的编译错误；优雅避坑方案是使用 computed 预过滤列表，或者在外层嵌套一个 <template> 专门承载 v-if。',
      thinkingProcess: '1. 面试经典：几乎是初中级前端人人皆知的经典规范。\n2. 优先级逆转：\n- Vue 2.x：`v-for` 先行。组件每次重新渲染时，会先把全部元素渲染成 VNode，然后才去比对 `v-if` 条件是否匹配，如果不匹配又把这堆 DOM 全删掉。开销极高。\n- Vue 3.x：`v-if` 先行。由于它先执行，此时 `v-if` 的逻辑会去寻找 `item` 变量（如 `v-if="item.isActive"`），但因为 `item` 是下面 `v-for="item in list"` 才定义的局部变量，此时 `v-if` 还没看到循环，直接报错 `Cannot read property ... of undefined`。\n3. 最优解：在父级套 `<template v-if="visible">` 内部写 `v-for`；或者用 `computed` 提前把 `list` 过滤好。',
      deepDive: '使用 computed 进行预过滤的性能优势：\n```javascript\nconst activeUsers = computed(() => {\n  return users.value.filter(u => u.isActive); // 过滤发生在内存中，只对符合条件的子集进行 DOM 节点创建，渲染开销最小\n});\n```',
      structured: [
        'Vue 2.x：v-for 优先级高，先循环后判定，造成大范围 DOM 重造和二次销毁，极度浪费 CPU',
        'Vue 3.x：v-if 优先级高，先判定后循环，如果 v-if 引用了 v-for 里的元素变量，会因作用域时序问题直接报未定义编译错',
        '优解一：在循环外层套用虚拟标签 `<template v-if="...">`，将判断逻辑上提，隔离渲染',
        '优解二：使用 computed 在内存里预处理过滤好干净的数组，再把干净的数组直接交给 v-for 循环'
      ]
    },
    keyPoints: ['v-if 与 v-for', '优先级演变', '作用域错误', 'template 标签', 'computed过滤'],
    traps: ['千万不要通过在 v-for 标签里写 `v-if="true"` 这种无脑硬判，这会导致 Vue 3 依然需要多做一次编译期校验，应始终让 template 扮演结构容器'],
    relatedIds: []
  },
  {
    id: 'interview_vue_021',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 事件修饰符底层实现与 passive 优化',
    difficulty: 1,
    frequency: 4,
    question: '请简述 Vue 中常用事件修饰符（.stop, .prevent, .capture, .passive）的用途，并解释 .passive 是如何提升移动端滚动流畅度的？',
    answer: {
      short: '.stop 阻止冒泡，.prevent 阻止默认事件，.capture 改为捕获期监听，.passive 声明回调绝不阻止默认行为；.passive 通过提前告知浏览器无需等待 JS stopPropagation/preventDefault 的判定检查，直接在主线程触发原生的物理惯性滚动，彻底消除了移动端滑动时的顿挫感。',
      thinkingProcess: '1. 概念热身：事件修饰符是 Vue 极好的开发体验细节（不需要在 JS 手写 e.preventDefault()）。\n2. 机制拆解：Vue 编译器在遇到 `.stop` 时，会在编译生成的 render 函数中，自动为该 onClick 包装一层 `withModifiers(cb, ["stop"])`，底层其实就是帮我们执行了 `e.stopPropagation()`。\n3. passive 流畅优化：当用户在手机上滑动一个大列表，浏览器在每次触发 `touchstart`/`touchmove` 时，**必须同步等待 JS 监听器执行完**，因为它不知道你会不会在 JS 里写 `e.preventDefault()` 来阻止滚动。这种“等待检查”是移动端滚动卡顿的元凶。`.passive` 告诉浏览器：你只管滑，我肯定不拦截！浏览器就可以直接开启硬件级的流畅滚动，不用等待 JS 线程。',
      deepDive: '在 Vue 中配置 `.passive` 提升滚动体验代码：\n```html\n<!-- .passive 专门优化移动端的 touch/scroll 监听 -->\n<div @touchmove.passive="handleTouchMove" class="scroll-box">\n  列表内容\n</div>\n```\n这相当于底层调用了 `window.addEventListener(\'touchmove\', cb, { passive: true })`，极大地释放了浏览器的重排主线程带宽，杜绝弱网或重渲染下的手势滑轨滞后。',
      structured: [
        '.stop：阻止事件向上传递（e.stopPropagation()），规避父元素点击事件误触发',
        '.prevent：拦截默认行为（e.preventDefault()），如阻止 a 标签跳转、form 提交重绘',
        '.capture：改用事件捕获机制运行，让事件由外向内响应',
        '.passive：最高级，告知浏览器该监听绝不会阻止默认滚动行为，开启硬件惯性加速渲染'
      ]
    },
    keyPoints: ['事件修饰符', '.passive 优化', '阻止冒泡', '事件流捕获', '移动端滚动'],
    traps: ['绝对不要把 .prevent 和 .passive 连在一起使用（如 @touchmove.prevent.passive），因为 .passive 承诺了不拦截默认行为，而 .prevent 又强行去拦截，这两者会发生冲突导致 .passive 报错失效'],
    relatedIds: []
  },
  {
    id: 'interview_vue_022',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 列表 Key 属性机制与 Transition 元素切换',
    difficulty: 2,
    frequency: 4,
    question: '在 Vue 列表渲染中，key 属性的底层复用机制是什么？除了用于 v-for，为什么在 <transition> 标签切换不同元素时也必须绑定不同的 key 属性？',
    answer: {
      short: 'Key 属性是 VNode 的唯一标识；在 v-for 中，key 辅助 Diff 算法高速定位节点位移并避免原地复用状态 Bug；在 <transition> 中，key 用于强令 Vue 在切换时将新旧两个元素识别为完全不同的独立节点，从而能正确触发切出（leave）与切入（enter）的过渡动画，若无 key 绑定则只会触发属性的原地 patch 更新而无动画效果。',
      thinkingProcess: '1. 复用核心：在 Vue 渲染器中，如果两个 VNode 的 `type` 相同且 `key` 相同，就默认它们是“相同的节点”，直接执行原地复用（Patch），只改属性，不拆 DOM。\n2. Transition 痛点：如果我们有 `<transition><span v-if="isLogin">已登录</span><span v-else>未登录</span></transition>`。在切换 `isLogin` 时，由于两个子节点都是 `<span>`，且都没有 key，Vue 默认会判定为“相同的节点”，执行 patch（只是把 span 的 textNode 文字从“已登录”修改为“未登录”），完全不发生 DOM 的拆除与挂载。由于 DOM 没动，`<transition>` 的 leave/enter 样式就完全挂载不上，转场动画当场失效。',
      deepDive: '在 Transition 中解决动画失效的正确写法：\n```html\n<transition name="fade">\n  <!-- 绑定不同的 key，强令 Vue 在 Diff 时将其判定为完全独立的两个节点，强制执行注销与挂载，从而触发转场动画 -->\n  <span :key="isLogin ? \'logged\' : \'guest\'">\n    {{ isLogin ? \'欢迎回来\' : \'请先登录\' }}\n  </span>\n</transition>\n```',
      structured: [
        'v-for 复用：key 是 Diff 快速哈希比对的唯一凭证，避免非受控状态错乱',
        'Transition 盲区：若切换的两个组件/元素标签类型相同且无 key，Vue 默认仅进行 patch 属性更新',
        '动画劫持原理：Transition 靠检测 DOM 节点的物理插入 (enter) 和移除 (leave) 来动态挂载 CSS class',
        '动画修复：为切换元素加上 :key="state"，迫使 Diff 发生老 DOM 注销新 DOM 重造，使动画完美生效'
      ]
    },
    keyPoints: ['Key 机制', 'Transition 动画', '原地复用', 'DOM patch', '转场失效'],
    traps: ['给 Transition 内部切换的元素赋予 key 时，要确保切换前后的 key 值绝对不同，且不要用随机数作 key 导致每次 Rerender 动画反复被触发'],
    relatedIds: []
  },
  {
    id: 'interview_vue_023',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Tree-Shaking 摇树优化支持与包体控制',
    difficulty: 3,
    frequency: 3,
    question: 'Vue 3 是如何实现全面的 Tree-shaking（摇树优化）支持的？它与 Vue 2 的单包导出模式有什么本质不同？',
    answer: {
      short: 'Vue 2 是一个单包整体导出模式，即使只用了基础功能，整个 Vue runtime 也会被打包进生产包；Vue 3 采用 ES Modules 的具名导出模式，将全局 API、组件、响应式核心（如 ref, computed, watch）以及内置辅助函数全部解耦为独立的 export，在打包构建期（Vite/Webpack）能静态分析并剔除项目中未被引用的无效代码，使最终的包体积减少高达 30% 以上。',
      thinkingProcess: '1. 痛点：Vue 2 的全局 API（如 `Vue.nextTick`、`Vue.set`）是挂载在全局 `Vue` 构造函数原型上的。这种设计导致打包工具在进行 Tree Shaking 静态分析时，无法拆解 `Vue` 这一巨无霸对象，只能把它们全部打包进去。\n2. Vue 3 重构：彻底打破全局大单体，采用扁平化具名导出：`import { nextTick, watch } from \'vue\'`。如果你的小项目里没写 watch，打包产物里就绝对不包含任何关于 watch 的底层算法源码。',
      deepDive: 'Vue 3 甚至把内置的组件（如 `<Transition>`、`<KeepAlive>`、`<Teleport>`）也做成了 Tree-shaking 结构。在模板编译时，如果你没有写过 `<teleport>` 标签，编译器在生成 render 函数时就不会生成 `_resolveComponent("teleport")` 这种引入引用。打包工具就能安全地把 Teleport 的底层 C++ 绑定渲染逻辑直接摇掉，为移动端 H5 页面进行极限包体瘦身。',
      structured: [
        'Vue 2 弊端：挂载全局 Vue 原型，内部逻辑纠缠不清，无法做代码裁剪，包体积偏大',
        'Vue 3 飞跃：全面的 ES Modules 具名导出机制，扁平化的 API 拓扑',
        '按需加载：没有在项目里引用的组件、API、副作用逻辑，打包构建时直接剔除',
        '具体收益：极限减小首屏打包产物体积（Gzip 后纯 runtime 仅 10KB+），极利于 H5 轻量化快速加载'
      ]
    },
    keyPoints: ['Tree-shaking', 'ES Modules', '具名导出', '打包瘦身', '静态分析'],
    traps: ['即使支持 Tree-shaking，如果你的代码里包含“副作用引入”（如直接 `import \'vue\'`），或者编写了难以被打包工具判定为无副作用（sideEffects: false）的冗余代码，摇树效果仍会受阻，应保持干净的解构导入风格'],
    relatedIds: []
  },
  {
    id: 'interview_vue_024',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 组件通信八大件与 expose 限制',
    difficulty: 2,
    frequency: 4,
    question: 'Vue 3 中组件通信常用方式有哪些？在 script setup 中使用 defineExpose 有什么必要性？',
    answer: {
      short: '组件通信包括 props/emits、provide/inject、attrs/listeners、Pinia、以及 ref 获取子实例；在 script setup 中，由于组件默认是封闭（closed）的，父组件通过 ref 获取子组件实例时无法读取其内部声明的变量，必须在子组件中使用 defineExpose 显式暴露属性或方法，父组件才能访问。',
      thinkingProcess: '1. 通信全景：父子用 Props/Emit；跨层用 Provide/Inject；全局用 Pinia；兄弟用提升或外部订阅。\n2. Expose 机制：在 Options API 时代，父组件拿到子组件 ref 就能直接读取 `this.xxx` 修改其数据，破坏了组件的黑盒封装性。Vue 3 setup 实行了强封装：默认父级只能拿到一个空对象。\n3. 实战配置：如果子组件有一个 `openModal` 方法需要被父组件调用，必须显式 `defineExpose({ openModal })`。',
      deepDive: 'Expose 控制父级获取方法的代码：\n```javascript\n// 子组件 MyModal.vue\nconst isVisible = ref(false);\nconst open = () => { isVisible.value = true; };\nconst close = () => { isVisible.value = false; };\n\n// 核心：若不 expose，父组件使用 ref.value 时什么都拿不到；这里只暴露 open 方法，安全隐藏 close 和 isVisible\ndefineExpose({\n  open\n});\n```',
      structured: [
        '基础桥梁：props (向下灌输只读数据)、emit (向上反馈回调通知)',
        '跨层广播：provide / inject，父孙跨级传参，比 props 一层层传递更干净',
        '透传降噪：$attrs 包含父级未声明的所有属性及事件，支持组件无侵入二次封装',
        'Expose 防御：defineExpose 控制子组件实例只向父组件暴露极少数安全的操作方法接口'
      ]
    },
    keyPoints: ['组件通信', 'defineExpose', 'ref子实例', 'Provide/Inject', '单向流动'],
    traps: ['虽然 provide/inject 很好用，但对于深层修改响应式数据的操作，一定要由 Provide 方提供更新的方法回调一并传下去，严禁在 Inject 子组件内部直接修改注入的 ref.value（违背单向数据流原则）'],
    relatedIds: []
  },
  {
    id: 'interview_vue_025',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: '逻辑复用演进：Mixins 的缺陷与 Composables（组合API）的完胜',
    difficulty: 2,
    frequency: 4,
    question: '在 Vue 2.x 中常用的 Mixins（混入）有什么设计缺陷？为什么在 Vue 3 中它被 Composables（组合式函数）完全取代了？',
    answer: {
      short: 'Mixins 会导致命名冲突难以解决、隐式依赖不透明、以及 Props/State 来源不清晰等硬伤；Vue 3 的 Composables 采用纯函数式封装，逻辑与状态作为函数的参数和返回值显式声明，解决了命名冲突，且让数据的来源和流向一目了然，实现了逻辑复用的完美闭环。',
      thinkingProcess: '1. 历史痛点：大型 Vue 2 项目里，一个组件可能引入了 5 个 Mixins。当我们在组件模板里看到一个 `this.active`，或者在 methods 看到一个 `this.submit`，我们根本分不清这个属性是哪一个 mixin 塞进来的，代码变得像一团浆糊。\n2. 命名灾难：如果 mixin A 和 mixin B 都写了 `data() { return { loading: false } }`，它们会发生静默覆盖，产生极其诡异的 Bug。\n3. Composable 完胜：利用解构赋值 `const { loading: userLoading, fetchUser } = useUser()`。数据源头清清楚楚，且允许通过重命名完美避开命名冲突。',
      deepDive: '组合式函数（Composables）在设计上更加遵循函数式编程（Functional Programming）的组合精神：\n```javascript\n// Vue 3 的 Composable 逻辑组合\nconst { position } = useMouse();\nconst { data: userData, loading } = useFetch(`/api/user/${position.x}`); // 甚至可以把一个 Composable 的返回值作为参数传入另一个 Composable，实现动态响应关联\n```\n这种高度灵活、逻辑高度聚拢的形态，是选项式 Mixins 模式绝对无法企及的高度。',
      structured: [
        'Mixins 缺陷一：隐式依赖不透明，混入的逻辑像黑盒，调用者难以获知其内部逻辑结构',
        'Mixins 缺陷二：同名冲突直接覆盖，缺乏参数中转，导致多个 mixin 并存时维护极其混乱',
        'Composables 优势：显式入参和解构出参，变量来源 100% 追踪，无命名冲突，且支持 composables 之间的动态相互调用'
      ]
    },
    keyPoints: ['Mixins 缺陷', 'Composables', '组合式函数', '逻辑聚合', '命名冲突'],
    traps: ['在 Composables 函数中如果返回了多个 Ref 状态，出参时必须以 `{ refA, refB }` 对象格式返回。如果直接以 `[refA, refB]` 数组格式返回，解构时容易因为顺序错误而绑定错变量'],
    relatedIds: []
  },
  {
    id: 'interview_vue_026',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'vue',
    title: '极简 Vue 3 响应式系统手写实现',
    difficulty: 5,
    frequency: 4,
    question: '请手写实现一个包含 reactive、track（收集依赖）和 trigger（触发更新）的极简 Vue 3 响应式系统核心代码，并说明响应式副作用函数 effect 的收集原理。',
    answer: {
      short: '利用 Proxy 代理对象的 getter 和 setter；在 getter 中执行 track 将当前的全局活跃 effect 收集并注册到双层 Map 构成的 targetMap 依赖收集桶中；在 setter 中执行 trigger，从 targetMap 中取出该属性对应所有的 effect 集合并依次重新运行执行，实现闭环更新。',
      thinkingProcess: '1. 源码底子：这是对 Vue 3 Reactivity 最底层算法逻辑的考核，面试官用来区分高级与专家程序员的试金石。\n2. 依赖桶结构：`targetMap` (WeakMap) -> `depsMap` (Map) -> `dep` (Set)。\n   - WeakMap 的 Key 是目标对象 `target`（垃圾回收友好，当对象被销毁，依赖关系自动释放）。\n   - Map 的 Key 是属性名 `key`。\n   - Set 里面装的是一个个的副作用 `effect` 监听回调函数。\n3. 全局活跃 Effect 指针：维护一个全局 `activeEffect`，在执行 `effect(fn)` 时将 activeEffect 指向 fn，触发 getter，完成无痛自订阅，执行完后清空。',
      deepDive: '手写迷你响应式系统（精简干货代码）：\n```javascript\nconst targetMap = new WeakMap();\nlet activeEffect = null;\n\nfunction effect(fn) {\n  activeEffect = fn;\n  fn(); // 立即执行，从而触发内部响应式数据的 getter\n  activeEffect = null; // 清空\n}\n\nfunction track(target, key) {\n  if (!activeEffect) return;\n  let depsMap = targetMap.get(target);\n  if (!depsMap) {\n    targetMap.set(target, (depsMap = new Map()));\n  }\n  let dep = depsMap.get(key);\n  if (!dep) {\n    depsMap.set(key, (dep = new Set()));\n  }\n  dep.add(activeEffect); // 核心：将全局活跃的副作用函数加入此属性的依赖 Set 桶中\n}\n\nfunction trigger(target, key) {\n  const depsMap = targetMap.get(target);\n  if (!depsMap) return;\n  const dep = depsMap.get(key);\n  if (dep) {\n    dep.forEach(effect => effect()); // 核心：属性改变，拉出所有订阅它的 effect 回调全部重跑\n  }\n}\n\nfunction reactive(target) {\n  return new Proxy(target, {\n    get(target, key, receiver) {\n      const res = Reflect.get(target, key, receiver);\n      track(target, key); // 读取数据，依赖收集\n      return res;\n    },\n    set(target, key, value, receiver) {\n      const oldValue = target[key];\n      const res = Reflect.set(target, key, value, receiver);\n      if (oldValue !== value) {\n        trigger(target, key); // 写入数据，触发更新\n      }\n      return res;\n    }\n  });\n}\n```',
      structured: [
        'Reactive：基于 Proxy 拦截对象的读 (Getter) 写 (Setter) 操作',
        'targetMap 结构：WeakMap -> Map -> Set (WeakMap 选用可防止内存泄漏，对象销毁自动回收)',
        'track 机制：利用全局 `activeEffect` 栈指针，在 Getter 被触发时，将该 effect 塞入 Set 收集桶里',
        'trigger 机制：当属性被修改（触发 Setter），依据 target 和 key 定向从依赖 Set 桶中抽出全部 effect 并同步执行重绘'
      ]
    },
    keyPoints: ['reactive', 'track', 'trigger', 'effect', 'WeakMap 依赖桶', 'Proxy 拦截'],
    traps: ['如果副作用函数（effect）中包含修改响应式数据的操作，执行它又会再次触发 setter -> trigger，会导致无限死循环调用栈溢出，底层需要进行 activeEffect 防重入校验限制'],
    relatedIds: []
  },
  {
    id: 'interview_vue_027',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Ref 响应式自动解包（Unwrapping）规则',
    difficulty: 2,
    frequency: 4,
    question: '在 Vue 3 中，使用 ref 声明的响应式变量在什么情况下会被“自动解包”（不需要写 .value），在什么情况下又必须写出 .value？请总结其解包规则。',
    answer: {
      short: 'ref 会在 template 模板视图中、作为 reactive 对象的直接属性被读取时自动解包；若 ref 变量在 JS 逻辑中被作为 Array、Map 等集合对象的子项，或是在模板中作为表达式的非顶层节点（如未直接绑定的对象深层属性），则不会解包，必须写 .value。',
      thinkingProcess: '1. 语法痛点：.value 是 Vue 3 开发体验被诟病最多的地方（心智负担）。理解它为什么被自动剥离非常重要。\n2. 模板自动解包：模板编译器在遇到顶层的 ref 变量时，会在生成的 render 代码中自动调用 `unref(x)`（本质是 `x.__v_isRef ? x.value : x`）。\n3. 对象属性解包：当一个 ref 对象被放在 reactive 中：`const state = reactive({ count: ref(0) })`，我们读 `state.count` 会自动解包，直接返回 0。但如果把 ref 放进数组：`const arr = reactive([ref(0)])`，读 `arr[0]` 并不会自动解包，它仍是 RefImpl 实例，必须写 `arr[0].value`。',
      deepDive: '如果在模板中，ref 不是作为一个独立的变量，而是作为某个对象嵌套的深层属性出现在表达式中，Vue 3 的模板编译器将**无法执行顶层的自动解包**：\n```html\n<!-- 情况一：自动解包成功 (顶层 ref) -->\n<div>{{ count }}</div> \n\n<!-- 情况二：解包失败！因为 count 挂在了普通对象 obj 下，属于非顶层 ref，控制台会渲染出 [object Object] 的错误，必须写 .value -->\n<div>{{ obj.count }}</div> \n\n<!-- 正确处理情况二：在 JS 里解构或者直接在模板写出 .value -->\n<div>{{ obj.count.value }}</div>\n```',
      structured: [
        '模板解包：作为 template 根级渲染节点或双大括号内顶层 ref 对象，编译器自动使用 unref 解包',
        'reactive 解包：当 ref 变量挂载在 reactive 响应式对象的直接属性上时，读取自动脱壳 value',
        '解包失效（集合）：ref 放入 Array 数组或 Map 实例中时，为了不破坏原生的集合索引，Vue 不执行自动解包',
        '解包失效（非顶层）：模板中作为对象的深层嵌套链出现时，必须在末尾写出 .value'
      ]
    },
    keyPoints: ['自动解包', 'unref', 'reactive', '数组解包失败', '.value 规则'],
    traps: ['在 Vue 3.4+ 之前，很多开发喜欢用解构工具来脱 value，但会彻底丢掉响应，请严格依据 Vue 官方 unwrapping 规范书写代码'],
    relatedIds: []
  },
  {
    id: 'interview_vue_028',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 静态节点提升与预字符串化优化',
    difficulty: 3,
    frequency: 3,
    question: 'Vue 3 编译器是如何在编译期利用静态节点提升（Static Hoisting）和预字符串化（Stringify Static Content）来大幅缩减首次内容绘制（FCP）性能的？',
    answer: {
      short: '静态提升将组件内不带任何动态绑定的虚拟节点对象提取至 render 函数外部声明为全局常量，避免组件每次重绘重新实例化节点；预字符串化将包含大段（如连续5个以上）静态 DOM 节点的 VNode 直接编译为一串原生 HTML 字符串节点（_createStaticVNode(htmlString)），免去深层 VNode 的解析与比对。',
      thinkingProcess: '1. 编译期核心：Vue 的 Compiler 是它最大的杀手锏。React 不做这类优化，所以渲染压力全在 JS 主线程的运行时。\n2. 静态提升（Static Hoisting）：不仅提升 DOM 对象本身，甚至把不需要改变的 props 对象也提升出去：`const _hoisted_1 = { class: "nav-bar" }`。\n3. 预字符串化：当一个页面包含大量静态文章排版、条款说明时，生成成千上万个 VNode 会非常消耗 CPU。Vue 直接把它变成一长串 HTML 字符串。挂载时直接用浏览器的 `innerHTML` 一把梭，速度是创建 VNode 的数倍。',
      deepDive: 'Vue 3 的预字符串化阈值通常设定为“包含 5 个以上的连续静态节点”。此时编译器会自动将其改写为：\n```javascript\nconst _hoisted_1 = _createStaticVNode(\'<div class=\"header\"><h1>标题</h1><ul><li>导航1</li><li>导航2</li><li>导航3</li><li>导航4</li><li>导航5</li></ul></div>\', 1);\n```\n浏览器直接调用底层极为高效的 C++ 级别字符串 HTML 解析器（innerHTML），避免了 JS 引擎去逐个 `document.createElement` 并挂载属性的庞大开销，使大型新闻、电商页面的首屏白屏时间成倍缩短。',
      structured: [
        'Hoisting（静态提升）：避免组件 render Rerender 时重新创建纯静态 VNode 对象，大幅减少浏览器的 GC (垃圾回收) 负担',
        'Stringify（预字符串化）：将大体量连续静态元素编译为纯 HTML 文本段落，借助浏览器 innerHTML 加速首屏渲染',
        '核心原理：在 AST（抽象语法树）分析阶段就识别出这棵 DOM 子树是绝对纯静态的，直接贴上静态标记并剥离出 render 循环',
        '性能对比：纯静态 VNode 在更新对比时，Vue 3 的 Diff 算法直接执行 `prevNode === nextNode` 物理判断，开销降为 0'
      ]
    },
    keyPoints: ['静态提升', '预字符串化', 'Compiler 优化', 'VNode 垃圾回收', 'innerHTML'],
    traps: ['如果对静态提升出的节点在运行时通过自定义指令（v-my-directive）去强行操作并修改了其物理结构，可能会引发 Vue 3 在下一次局部更新时的 VNode 对比对不齐引发物理 DOM 撕裂 Bug'],
    relatedIds: []
  },
  {
    id: 'interview_vue_029',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 手写渲染函数与 h() 助手函数',
    difficulty: 3,
    frequency: 3,
    question: '在什么业务场景下需要抛弃 <template> 模板而手写 Vue 渲染函数？h() 助手函数的作用是什么？请手写一个可以根据 props.level 动态渲染 <h1> 到 <h6> 标题的 Render 组件。',
    answer: {
      short: '在需要高动态控制组件标签（如动态生成 h1-h6）或编写高复用底层 UI 组件库时需手写渲染函数；h() 函数用于创建并返回一个 VNode 对象；通过在 setup 语法中直接返回一个返回 h() 调用的渲染函数即可实现高动态组件输出。',
      thinkingProcess: '1. 适用场景：如果用模板写动态标题，我们不得不写 `v-if="level === 1"` 到 `v-if="level === 6"`，有大量重复标签，非常笨拙。\n2. h 函数入参：`h(type, props, children)`。\n   - type：标签名（字符串）或组件本身。\n   - props：属性对象。\n   - children：子节点数组或字符串。',
      deepDive: '使用渲染函数实现高动态 Title 组件的最佳实践代码：\n```javascript\nimport { h } from \'vue\';\n\nexport default {\n  props: {\n    level: {\n      type: Number,\n      default: 1\n    }\n  },\n  setup(props, { slots }) {\n    // setup 可以直接返回一个函数，该函数会作为当前组件的 render 函数执行\n    return () => h(\n      `h${props.level}`, // 动态标签字符串拼接：h1、h2、...\n      { class: \'dynamic-title\' }, // 传递属性 props\n      slots.default ? slots.default() : \'\' // 渲染插槽内容\n    );\n  }\n};\n```',
      structured: [
        'h() 助手：全称 hyperscript，是 Vue 内置创建虚拟节点（VNode）的轻量级底子工厂函数',
        '应用场景：高度动态渲染排版、高阶组件代理、无模板纯 JS 底层 UI 库（如 Element 内部渲染逻辑）',
        '入参设计：h(type, props, children)，children 可以是字符串、VNode 或者是函数式 Slot 渲染结果',
        'Setup 返回：若 setup() 返回一个 render 函数，该函数会在每次响应式状态更新时被触发重绘'
      ]
    },
    keyPoints: ['h() 函数', 'Render 渲染函数', '动态标签', 'VNode 创建', 'UI 组件开发'],
    traps: ['在手写渲染函数渲染子组件时，传递插槽必须写成函数调用（如 `slots.default()` ），不能直接把 slots 对象本身传给 h()，否则会因为没有执行惰性求值而导致插槽丢失响应式更新'],
    relatedIds: []
  },
  {
    id: 'interview_vue_030',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3.4+ defineModel 表单绑定新范式',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3.4 引入的 defineModel 宏有什么作用？它是如何终结了以前繁琐的 props + emit 或者是 computed 代理 v-model 双向绑定写法的？',
    answer: {
      short: 'defineModel 是 Vue 3.4 官方推出的用于在组件中轻松实现 v-model 双向绑定的宏命令；它会在底层自动将其编译为一个 props 属性与对应的 update 事件监听器，返回一个可读写的 Ref 对象；我们在子组件中只需直接修改这个 ref 的值即可无缝触发父组件状态的更新，免去了手动写 defineProps 和 defineEmits。',
      thinkingProcess: '1. 踩坑背景：在 Vue 3.4 之前，要在子组件实现 v-model 支持，代码极其冗长。需要先用 `defineProps` 声明 `modelValue`，再用 `defineEmits` 声明 `update:modelValue`，最后在输入框上写绑定，或者写一个带 get/set 的 `computed` 属性做中转。\n2. defineModel 革命：Vue 3.4 底层做了语法糖合拢。直接 `const modelValue = defineModel()`。它既能做 props 读，写它的时候又会自动触发 `emit(\'update:modelValue\', value)`。',
      deepDive: 'Vue 3.4+ 之前和之后的写法对比：\n**旧做法 (Vue 3.2)**：\n```javascript\nconst props = defineProps([\'modelValue\']);\nconst emit = defineEmits([\'update:modelValue\']);\nconst value = computed({\n  get: () => props.modelValue,\n  set: (val) => emit(\'update:modelValue\', val)\n});\n// 模板绑定 v-model="value"\n```\n**新做法 (Vue 3.4+)**：\n```javascript\nconst value = defineModel(); // 一行搞定，value 变成可直接读写的 ref！\n// 模板直接绑定 v-model="value"，修改 value 自动触发父级更新\n```\n还支持配置必填、默认值和自定义修饰符：`const title = defineModel(\'title\', { required: true, default: \'\' })`。',
      structured: [
        '作用：合并 v-model 底层的 Prop 与 Emit 事件，实现子组件内部对双绑值像普通 Ref 一样可直接读写',
        'Vue 3.4+ 特性：定义 defineModel 宏，免除冗余的 defineProps 和 defineEmits 组合书写',
        '多 Model 支持：支持 `const count = defineModel(\'count\')` 来直接实现 `v-model:count` 的绑定',
        '底层机制：修改返回的 Ref 时，Vue 底层编译器拦截并自动分发 update:modelValue 事件回传父级'
      ]
    },
    keyPoints: ['defineModel', 'Vue 3.4', 'v-model 语法糖', '双向数据流', '代码精简'],
    traps: ['虽然 defineModel 让子组件能直接改值，但它的底层依然遵循单向数据流。在子组件修改 defineModel 的 ref 时，实际上是触发了父组件的 State 修改，父组件修改后数据再次向下流回到子组件'],
    relatedIds: []
  },
  {
    id: 'interview_vue_031',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'vue',
    title: 'Nuxt.js 的渲染模式：SSR、SSG 与 ISR 全景架构',
    difficulty: 4,
    frequency: 4,
    question: '在 Nuxt.js 中，SSR（服务端渲染）、SSG（静态站点生成）和 ISR（增量静态再生）这三种渲染渲染模式有什么区别？在什么业务场景下该如何选型？',
    answer: {
      short: 'SSR 在每次请求时动态从服务器数据库获取数据并渲染 HTML，适合内容变化快且 SEO 敏感的系统（如商城）；SSG 在打包构建期一次性生成全部静态 HTML 文件，适合内容极少变动的文档或官网，加载速度极快；ISR 允许我们在打包后对特定页面设定过期时间，在后台动态增量重建静态缓存，完美兼顾了高首屏性能与数据实时性。',
      thinkingProcess: '1. 全栈架构选型：大型 Vue 工程项目必备的前端架构设计思维。\n2. SSG (Static Site Generation)：构建期就生成完 `index.html`。缺点：有 10 万个商品，打包要好几个小时，且价格一变就得重新打包。\n3. SSR (Server Side Rendering)：实时渲染。缺点：高并发下服务器 CPU 压力巨大，响应时间受限于数据库查询慢。\n4. ISR (Incremental Static Regeneration)：折中艺术。先渲染 100 个热门商品成 SSG。其余冷门商品在用户访问时动态触发后台渲染并缓存。且设置 `revalidate: 60`，60s 后用户访问会自动返回旧缓存同时静默在后台拉新数据更新缓存，实现“增量静态再生”。',
      deepDive: 'Nuxt 3 对渲染模式的支持做到了**路由级别（Route Rules）**。你可以在同一个项目里混合使用这几种模式：\n```javascript\n// nuxt.config.ts 配置示例\nexport default defineNuxtConfig({\n  routeRules: {\n    \'/\': { prerender: true }, // 首页：编译期直接 SSG 预渲染\n    \'/products/**\': { swr: 3600 }, // 商品详情页：启用 SWR/ISR 缓存，1小时内只读静态缓存，过期后后台增量重建\n    \'/admin/**\': { ssr: false }, // 后台管理：完全降级为单页面应用 (SPA) 渲染\n  }\n});\n```',
      structured: [
        'SSR：实时动态计算渲染，SEO 完美，支持千人千面展示，但服务器 CPU 并发负荷高',
        'SSG：构建打包期固化输出物理 html 静态包，超速 CDN 分发，但数据实时更新困难，打包耗时长',
        'ISR (SWR)：动态增量渲染，通过 revalidate 缓期更新，保障高流量下的服务器安全，且不用全量重新打包',
        'Nuxt 3 路由规则：支持在 nuxt.config 中针对不同子路由混合配置 SSR/SSG/SPA 规则，极致灵活性'
      ]
    },
    keyPoints: ['Nuxt.js', 'SSR', 'SSG', 'ISR', 'Route Rules', 'SWR 缓存', '首屏可交互'],
    traps: ['使用 ISR 时，如果 revalidate 设置得过短且接口极慢，可能会导致大量后台重绘进程拥堵，必须配合合理的 Redis 缓存或者长效 SWR 策略'],
    relatedIds: []
  },
  {
    id: 'interview_vue_032',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'CSS 作用域隔离与样式渗透（Deep Selectors）',
    difficulty: 2,
    frequency: 4,
    question: 'Vue 单文件组件（SFC）中 <style scoped> 的隔离原理是什么？为什么我们需要样式渗透（:deep()）？:deep() 的底层编译产物是什么样的？',
    answer: {
      short: 'SFC 的 scoped 隔离原理是 PostCSS 自动为组件内的 DOM 节点加上唯一的 data-v-hash 属性，同时把 CSS 选择器编译为 selector[data-v-hash]；需要样式渗透是因为外部无法直接修改第三方子组件（由于其 data 属性不同）的内部样式；:deep() 底层会将属性选择器移动到父级类名之后，变为 .parent[data-v-hash] .child 格式，从而实现对子孙节点的跨界穿透修改。',
      thinkingProcess: '1. 技术深度：从 PostCSS 的编译实现来分析 scoped 隔离原理。\n2. 隔离痛点：当引入第三方组件库（如 Element Plus）时，其内部生成的 DOM 结构（如 `.el-input__inner`）并没有被打上我们当前组件的 `data-v-hash` 属性。所以在 scoped 样式表里直接写 `.el-input__inner` 是匹配不到它的。\n3. :deep() 原理：PostCSS 解析器把 `[data-v-hash]` 限制放在父元素类名上，留下子类名作为后代选择器。',
      deepDive: 'Vue 3 对样式渗透的语法演进：\n- Vue 2 中使用 `/deep/` 或 `>>>`（非标准，CSS 预处理器支持，原生不支持）。\n- Vue 3 废弃了上述写法，统一推荐使用 `:deep(selector)`：\n```css\n/* 编译前 */\n.parent :deep(.child) {\n  color: red;\n}\n/* 编译后产物 */\n.parent[data-v-e1a2b3] .child {\n  color: red; /* 只要父元素匹配到了 Hash，后代中所有 class 为 child 的元素都会变红 */\n}\n```',
      structured: [
        'scoped 原理：PostCSS 插件解析 DOM，为元素标记唯一 data-v-hash，样式编译为带属性选择器后缀以锁定范围',
        '样式渗透背景：父组件 scoped 样式只对本组件第一层子节点生效，无法染指第三方子组件的深层结构',
        ':deep() 编译产物：将[data-v-hash]属性限制上提到父级类名选择器上，放行后代选择器',
        '旧版废弃：不要再使用 `/deep/` 或是 `>>>`，这些写法在新版 Vue 3 编译器中会直接抛出警告'
      ]
    },
    keyPoints: ['style scoped', 'PostCSS 隔离', '样式渗透', ':deep() 编译', '属性选择器'],
    traps: ['滥用 :deep() 会导致局部样式在子组件中大面积逃逸，增加样式污染全局的概率，应当仅在需要微调第三方库样式时局部、精准使用'],
    relatedIds: []
  },
  {
    id: 'interview_vue_033',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 渲染性能调优：v-once 与 v-memo',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3 新引入的 v-once 和 v-memo 指令有什么用途？它们是如何帮助我们优化大型长列表和高频重绘场景下页面流畅度的？',
    answer: {
      short: 'v-once 规定元素及其子节点只渲染一次，之后即使数据改变也直接跳过 Diff 比较，适合完全不改变的纯静态说明内容；v-memo 接收一个依赖项数组，只有当依赖项发生改变时才重新渲染并 Diff 该区块的子树，否则直接从缓存复用 VNode，能极大地提升包含了数千个复杂子节点的大型列表重绘性能。',
      thinkingProcess: '1. 性能进阶：这是 Vue 3 精细化控制 Diff 和 Rerender 的高级技巧。\n2. v-once 价值：适合网站的静态介绍、页脚版权、大段固定的 FAQ 列表。Vue 渲染器在第二次 Diff 到这里时，直接判定这里是静态的，跳过整棵子树，渲染开销瞬间降为 0。\n3. v-memo 价值：类似 React 的 useMemo 作用在 DOM 级别。比如一个 500 行的表格，每一行有很多列和复杂计算。如果只有第 5 行的数据改变了，如果没有 v-memo，Vue 仍然需要对这 500 行的 VNode 执行全面的 Diff 遍历。如果在行上写 `v-memo="[row.updatedAt]"`，只有第 5 行的 updatedAt 变了，Vue 才会去重绘第 5 行，其余 499 行直接复用之前的渲染树，速度提升上百倍。',
      deepDive: 'v-memo 的语法与性能提升实战：\n```html\n<!-- 只有在 item.id 或 item.commentCount 发生更新时，才重新重绘和 Diff 这个列表项 -->\n<div v-for="item in heavyList" :key="item.id" v-memo="[item.id, item.commentCount]">\n  <h3>{{ item.title }}</h3>\n  <p>{{ item.content }}</p>\n  <span>评论数: {{ item.commentCount }}</span>\n</div>\n```\n注意：如果传入了空依赖 `v-memo="[]"`，它的表现就和 `v-once` 完完全全一样了。',
      structured: [
        'v-once：单次渲染指令，初次挂载后将其永久判定为静态节点，后续重绘零 Diff 开销',
        'v-memo：按需记忆更新，基于传入的 deps 数组做浅比较。未变化时直接复制使用内存中缓存的旧 VNode',
        '优化场景：极其复杂的报表表格、IM 滚动消息行、数据变动频率极低的卡片块',
        '关系逻辑：v-memo="[]" 约等于 v-once 的表现效果'
      ]
    },
    keyPoints: ['v-once', 'v-memo', 'VDiff 优化', '长列表调优', '缓存渲染树'],
    traps: ['在 v-for 中使用 v-memo 时，必须要确保 `:key` 属性也同时存在，且不要把频繁变动、甚至不需要记忆的状态（如 hover 态）也漏填进 deps，否则会导致 hover 时样式无法更新的 Bug'],
    relatedIds: []
  },
  {
    id: 'interview_vue_034',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'watch 与 watchEffect 深度机制对比',
    difficulty: 3,
    frequency: 4,
    question: 'Vue 3 中 watch 和 watchEffect 在惰性执行、依赖项变更捕获、以及清理回调（onCleanup）上有什么核心设计差异？',
    answer: {
      short: 'watch 默认是惰性执行的（除非加 immediate: true），要求显式传入侦听源，可以拿到新旧值；watchEffect 在挂载时立即执行一次以自动收集依赖，无法获取新旧值；两者都可以通过参数接收一个 onCleanup 回调，用于在下一次执行副作用或组件卸载前取消未完成的异步操作。',
      thinkingProcess: '1. 依赖对比：watch 更加精细和可预测，而 watchEffect 更加自动化（写到哪追踪到哪，极其方便但容易收集到意料之外的依赖）。\n2. 清理机制：当用户在搜索框疯狂输入字符，watch/watchEffect 监听 query。如果 query 改变，会发起 fetch 请求。如果前一次请求还在加载中，我们需要取消它，防止网络竟态（Race Condition）导致旧数据覆盖新数据。',
      deepDive: '在 watchEffect 中使用 `onCleanup` 取消异步任务示例：\n```javascript\nwatchEffect(async (onCleanup) => {\n  const controller = new AbortController();\n  // 注册清理回调：如果 query 在接口返回前再次变动，或者组件销毁，Vue 会先触发此清理，强行取消 pending 请求\n  onCleanup(() => {\n    controller.abort();\n  });\n  const data = await fetch(`/api/search?q=${query.value}`, { signal: controller.signal });\n  searchResults.value = data;\n});\n```',
      structured: [
        'watch：精细监听、默认惰性，可拿到 (newVal, oldVal)，必须指定源，适合需要根据前后值变动执行不同逻辑的场景',
        'watchEffect：自动监听、立即执行，无法获取旧值，回调内部读取的所有响应式变量自动成为依赖项',
        'onCleanup 清理：两者回调第一个入参均是 onCleanup(fn)，在下次侦听触发前或组件销毁时同步运行，防范 Race Condition',
        '选择：90% 复杂异步逻辑推荐用 watch 以免意外收集依赖；纯状态自动计算同步推荐 watchEffect'
      ]
    },
    keyPoints: ['watch', 'watchEffect', 'onCleanup', '自动依赖追踪', '网络竞态控制'],
    traps: ['如果在 watchEffect 的异步语句 `await` 之后去读取其他的响应式变量，由于 await 会导致执行权挂起，Vue 无法将 await 之后的变量作为当前 effect 的依赖进行收集，依赖收集只对第一个 await 之前的同步段生效'],
    relatedIds: []
  },
  {
    id: 'interview_vue_035',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue Router 路由导航守卫执行顺序',
    difficulty: 2,
    frequency: 4,
    question: '当用户从路由 A 跳转到路由 B 时，Vue Router 中各种路由守卫（全局守卫、路由独享守卫、组件内守卫）的完整执行流程和生命周期顺序是什么？',
    answer: {
      short: '完整流程为：在失活组件中调用 beforeRouteLeave -> 触发全局 beforeComposite/beforeEach -> 触发重用组件 beforeRouteUpdate -> 触发路由配置 beforeEnter -> 触发激活组件 beforeRouteEnter -> 触发全局 beforeEach/beforeResolve -> 完成导航并调用 afterEach -> 执行 DOM 挂载生命周期。',
      thinkingProcess: '1. 路由拦截时序：这是项目级登录权限拦截设计、表单未保存拦截防丢的根基。\n2. 完整执行流：必须理清离开（Leave） -> 全局（Global） -> 更新（Update） -> 进入（Enter） -> 渲染（Resolve） 的闭环顺序。',
      deepDive: '导航守卫完整流水线解析：\n1. 导航被触发。\n2. 在失活的组件里调用 `beforeRouteLeave`（非常适合在这里拦截用户并弹出：‘表单尚未保存，确认离开吗？’）。\n3. 调用全局的 `beforeEach` 守卫。\n4. 在重用的组件里调用 `beforeRouteUpdate` 守卫（例如 `/user/1` 跳转到 `/user/2`）。\n5. 在路由配置里调用 `beforeEnter` 守卫。\n6. 解析异步路由组件。\n7. 在被激活的组件里调用 `beforeRouteEnter` 守卫。\n8. 调用全局的 `beforeResolve` 守卫（此时全部解析完毕，准备跳转）。\n9. 导航被确认。\n10. 调用全局的 `afterEach` 钩子。\n11. 触发 DOM 更新和挂载（组件的 `created` -> `mounted` 等生命周期）。\n12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数（创建好的组件实例会作为参数传入）。',
      structured: [
        '失活撤退：失活组件的 beforeRouteLeave (最先出发，可阻止跳转拦截)',
        '全局校验：全局的 beforeEach -> 重用组件 beforeRouteUpdate -> 路由专享 beforeEnter',
        '实例激活：激活组件 beforeRouteEnter -> 全局 beforeResolve 确认终审',
        '尘埃落定：全局 afterEach 触发 -> 挂载组件生命周期 -> 执行 beforeRouteEnter next 中的实例化回调'
      ]
    },
    keyPoints: ['导航守卫', 'beforeRouteLeave', 'beforeEach', 'beforeResolve', 'next回调时机'],
    traps: ['在 beforeRouteEnter 中，你绝对无法直接使用 `this` 读取当前组件实例，因为在执行该守卫时，新组件尚未被创建。必须通过 `next(vm => { ... })` 回调在挂载完成后去获取 vm 实例'],
    relatedIds: []
  },
  {
    id: 'interview_vue_036',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 响应式追踪的边界与集合类型劫持',
    difficulty: 4,
    frequency: 3,
    question: 'Vue 3 是如何实现对 ES6 Map、Set 集合类型以及数组索引和长度（length）的响应式劫持的？为什么说它彻底解决了 Vue 2 无法监听数组变化的弊端？',
    answer: {
      short: 'Vue 3 通过拦截 Array 的重构方法（如 push, pop）并在内部特殊重写，以及对 Map/Set 的 size 属性进行 getter 拦截和对 add, delete, clear 等核心方法执行自定义代理包装实现集合的响应式劫持；这从根本上解决了解除 defineProperty 无法监听 length 和 index 改变的缺陷。',
      thinkingProcess: '1. 数据类型挑战：Proxy 虽然强大，但如果直接对 Map/Set 执行代理，由于它们的内部方法（如 `set.add`）强依赖底层的 `this` 物理槽，直接通过代理调用会报 `Method Set.prototype.add called on incompatible receiver` 错误。\n2. 重写方法：Vue 3 对集合的内部方法做了“特殊代理”，重写了集合的拦截器方法。在 getter 中，如果发现 key 是 `add`，返回的是 Vue 自定义的 `add` 函数包裹层，在其内部绑定原生 target，并同步执行 `trigger` 派发更新。',
      deepDive: '对于数组，Vue 3 对 `includes`、`indexOf`、`lastIndexOf` 三种读取方法也进行了重写。因为如果数组里的元素也是代理对象，我们直接 `arr.indexOf(rawObj)` 会因为类型不一致（代理对象 !== 原生对象）而返回 -1。Vue 3 底层在重写这三个方法时，会先在代理数组上找，找不到会自动在原生 target 数组上再找一遍，极力保障了代码直觉一致性。',
      structured: [
        '集合特殊代理：针对 Map/Set 的 get/set/add/delete 方法进行了底层重写，绑定 target receiver 规避 C++ 原生方法 this 报错',
        '数组 length 监控：Proxy 的 set 拦截器如果检测到 length 发生改变，会自动触发对 length 键以及受影响索引的 trigger() 派发重绘',
        '数组定位重写：重写 includes/indexOf，支持在代理数组上同时匹配 proxy 和原始原生 rawObject',
        '成果：消除了 Vue 2 必须使用 Vue.set/vm.$set 才能添加新属性和直接修改数组索引的历史遗留难题'
      ]
    },
    keyPoints: ['集合代理', 'Reflect', '数组劫持', 'indexOf 重写', 'this 绑定错误', 'Vue.set 废弃'],
    traps: ['虽然 Vue 3 支持监听集合，但如果频繁对超大型 Set / Map 执行 `size` 读取并修改，由于频繁触发 traverse 遍历和 Set 重建，性能消耗依然较大，应配合 shallowReactive 做针对性优化'],
    relatedIds: []
  },
  {
    id: 'interview_vue_037',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 父子组件生命周期嵌套执行顺序',
    difficulty: 2,
    frequency: 4,
    question: '在 Vue 中，父子组件嵌套时，挂载（Mount）阶段、更新（Update）阶段和销毁（Unmount）阶段的生命周期函数执行先后顺序是什么？为什么是这种顺序？',
    answer: {
      short: '挂载阶段顺序为父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted；更新阶段为父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated；销毁阶段为父 beforeUnmount -> 子 beforeUnmount -> 子 unmounted -> 父 unmounted。',
      thinkingProcess: '1. 生命周期逻辑层叠：Vue 组件挂载和渲染是个“深度优先遍历（DFS）”的递归过程。\n2. 挂载顺序：父组件在挂载前（beforeMount），必须先解析并生成其 template 下的所有子组件的虚拟 DOM 节点。因此子组件必须在父组件 mounted 挂载结束前，完成自己的全套 created/mounted 挂载动作。这体现了“自下而上挂载，自上而下开始”的逻辑。\n3. 更新与销毁：同样遵循父组件先发起，子组件先完成，父组件再收尾的洋葱圈结构。',
      deepDive: '通过洋葱模型可以完美记忆这个过程：\n1. 父组件开启门槛 (`beforeMount`)\n2. 子组件深入进去 (`created` -> `mounted`)\n3. 子组件完事出来并挂载完成 (`child mounted`)\n4. 父组件最终收尾宣告挂载完成 (`parent mounted`)\n这一顺序在 React、Vue 2、Vue 3 中是完全一致的，它是由 Virtual DOM 树的递归解析特性决定的。',
      structured: [
        '挂载：父 beforeMount -> 子 beforeMount -> 子 mounted (子先上墙) -> 父 mounted (父后挂载完毕)',
        '更新：父 beforeUpdate -> 子 beforeUpdate -> 子 updated (子先重绘好) -> 父 updated (父后重绘完毕)',
        '卸载：父 beforeUnmount -> 子 beforeUnmount -> 子 unmounted (子先撤退) -> 父 unmounted (父后宣告注销)',
        '核心机制：深度优先遍历。父级创建模板时遇到子标签触发子实例创建，子实例挂载妥当了，父节点才能最终宣告 Mount 完成'
      ]
    },
    keyPoints: ['生命周期顺序', '深度优先遍历 DFS', '组件嵌套', '洋葱模型'],
    traps: ['在子组件的 mounted 钩子中，不要同步去获取父组件的 DOM 节点尺寸，因为此时父组件尚未执行到 mounted，父级 DOM 节点尚未真正插入物理文档流，数据可能会出现偏差，需在 parentMounted 或 nextTick 获取'],
    relatedIds: []
  },
  {
    id: 'interview_vue_032',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Provide/Inject 响应式数据管理最佳实践',
    difficulty: 3,
    frequency: 4,
    question: '使用 Provide/Inject 进行跨组件传参时，如何保证传递的数据在后代组件中依然是响应式的？如何规范在后代组件中对注入的数据进行修改？',
    answer: {
      short: '可以直接 provide 一个 ref 或 reactive 响应式对象，后代 inject 时能完美保留响应式；规范修改的方案是：在 Provide 数据的同时，必须一同 provide 一个用于修改该数据的 action 回调函数，后代组件禁止直接修改 inject 注入的值，严格遵守单向数据流。',
      thinkingProcess: '1. 跨级通信痛点：虽然 reduce 状态提升好，但隔代传参太累。Provide/Inject 能够跨越任意层级广播。\n2. 响应式穿透：在 setup 中，直接 `provide(\'theme\', themeRef)`。因为 themeRef 本身是响应式引用，子组件注入后读写它的 .value 依然能触发 setter，从而让整个 Vue 订阅系统重绘。\n3. 修改权规范（单向数据流）：如果任何一个曾孙子组件都能直接 `theme.value = \'dark\'`，当项目变大时，爷爷组件根本查不出这个颜色到底是被哪一个孙子偷偷改掉的，调试灾难。所以应该把“修改的方法”统一写在爷爷组件，提供给子代调用。',
      deepDive: '最佳实践配置代码（为了彻底堵死子组件的越权直接修改，可用 `readonly` 包装暴露）：\n```javascript\n// 爷爷组件 Grandparent.vue\nconst count = ref(0);\nconst updateCount = (newVal) => { count.value = newVal; };\n\n// 核心：使用 readonly 包装，这样孙子组件如果尝试 count.value = 100 会直接报错拦截，必须调用 updateCount\nprovide(\'count\', readonly(count));\nprovide(\'updateCount\', updateCount);\n```',
      structured: [
        '响应传导：直接注入 ref / reactive 变量，注入端消费时可保持原生的 Getter/Setter 依赖追踪',
        '单向流动原则：数据所有权在 Provide 端，Inject 端只有读取权，不得跨权直接改写',
        '修改委托：爷爷端同步 provide 改值函数 `provide(\'changeState\', changeState)`',
        '安全盾牌：利用 `readonly(state)` 包装后 provide，从编译器和运行时两端防范孙辈组件的非法篡改'
      ]
    },
    keyPoints: ['Provide/Inject', 'readonly', '响应式传参', '数据修改规范', '单向流动'],
    traps: ['如果 provide 传入的是解构后的 reactive 属性值（如 `provide(\'age\', state.age)`，其中 age 为普通 number），数据会彻底失去响应性，必须传入 ref 引用或使用 toRef(state, \'age\') 包裹'],
    relatedIds: []
  },
  {
    id: 'interview_vue_039',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 多级嵌套路由与布局（Layout）系统设计',
    difficulty: 3,
    frequency: 3,
    question: '在大型中后台项目中，如何使用 Vue Router 配合嵌套路由（Nested Routes）与 <router-view> 设计一个支持“全局框架布局（DefaultLayout） -> 模块面板布局（PanelLayout） -> 子页面”的多级自适应嵌套布局系统？',
    answer: {
      short: '在路由配置中使用 children 数组声明子路由；在各个父级路由对应的组件中嵌套 <router-view> 标签作为子路由组件的占位插座；并在最外层结合 <component :is="layout"> 动态加载不同的 Layout 包装组件，实现精细化嵌套排版。',
      thinkingProcess: '1. 工程实战：管理系统（SaaS 平台）通常有多级结构：最外层（无登录页、有登录页的 sidebar 大框架），内容区（三级目录的局部 tab 页）。\n2. 嵌套机理：当访问 `/admin/user/detail` 时，Vue Router 需要根据 children 嵌套层级，一级一级地把组件渲染到对应的 `<router-view>` 占位里。\n3. Layout 抽象：使用 meta 属性配置 Layout，避免在每个页面里都重复写 `<Sidebar>` 和 `<Header>` 标签。',
      deepDive: '嵌套路由配置与组件设计示范：\n```javascript\n// router/index.js\nconst routes = [\n  {\n    path: \'/admin\',\n    component: AdminLayout, // 包含 Sidebar, Header 以及一个嵌套的 <router-view />\n    children: [\n      {\n        path: \'user\',\n        component: UserPanelLayout, // 用户板块的子 Layout（包含用户左侧导航和一个嵌套 <router-view />）\n        children: [\n          { path: \'list\', component: UserList }, // 三级页面：真正渲染在最里层 router-view 的组件\n          { path: \'detail\', component: UserDetail }\n        ]\n      }\n    ]\n  }\n];\n```',
      structured: [
        '路由拓扑：路由树状结构配置，利用 children 嵌套定义层级映射关联',
        '插座占位：父级模板必须放置一个 `<router-view>`，作为下一级子路由组件的渲染载体',
        '动态 Layout：路由元信息 `meta: { layout: \'AdminLayout\' }` 配合全局 App.vue 中的动态 `<component :is="layout">` 完成框架切换',
        '数据共享：嵌套路由的各级组件，可以通过 provide/inject 或 Pinia 共享当前模块的公共状态（如当前操作的用户 ID）'
      ]
    },
    keyPoints: ['嵌套路由', 'router-view', 'Layout 布局设计', '动态 Layout', 'SaaS 架构设计'],
    traps: ['在嵌套路由中，如果子路由的 path 写成了以 `/` 开头（如 `path: \'/list\'`），它会被 Vue Router 视作根级路由，而不是 `/admin/user/list` 级别的嵌套路由，导致渲染定位错误'],
    relatedIds: []
  },
  {
    id: 'interview_vue_040',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 全局错误捕捉与 errorHandler 监控设计',
    difficulty: 3,
    frequency: 4,
    question: '在 Vue 项目上线后，如何全局捕获组件运行时的 JS 异常以进行错误上报（Sentry 监控集成）？请对比 app.config.errorHandler 和 errorCaptured 钩子的职责与冒泡规则。',
    answer: {
      short: '使用全局的 app.config.errorHandler 可以捕获项目内所有未处理的生命周期和事件处理器错误并上报；使用组件内部的 errorCaptured 生命周期钩子可以捕获其子孙组件树中抛出的错误；errorCaptured 默认会向上传递错误（即冒泡到父级的 errorCaptured 直至全局 errorHandler），但在其内部返回 false 即可直接截断该错误冒泡，起到错误局部消音作用。',
      thinkingProcess: '1. 生产高可用：企业级前端必须具备全方位的防灾与监控机制。\n2. errorHandler 范围：Vue 3 做了强化，可以自动捕获指令错误、生命周期错误、v-on 异步回调内抛出的未捕获 Promise 错误。\n3. errorCaptured 精细隔离：相当于 Vue 版本的错误边界。可以包裹敏感组件，在出错时展示“组件加载失败，点击重试”，而不是任由错误冒泡导致页面渲染死锁。',
      deepDive: 'Sentry 监控系统与 Vue 3 的集成设计方案：\n```javascript\n// main.js 全局集成\nconst app = createApp(App);\n\napp.config.errorHandler = (err, instance, info) => {\n  // 1. err：错误对象；instance：报错的组件实例；info：Vue 特有的错误来源信息（如 "mounted hook"）\n  console.error(\'Vue 全局捕获：\', err);\n  \n  // 2. 上报给哨兵系统 (Sentry)\n  Sentry.captureException(err, {\n    extra: {\n      componentName: instance?.$options?.name || \'Anonymous\',\n      lifecycleHook: info\n    }\n  });\n};\n```',
      structured: [
        '全局拦截：`app.config.errorHandler`，Vue 统一拦截全局 runtime 报错，生产环境监控终点站',
        '组件捕获：`errorCaptured(err, instance, info)`，专门用于开发局部容灾降级组件，防止渲染爆栈',
        '冒泡阻断：在组件 `errorCaptured` 钩子中返回 `false`，可强令错误在当前节点静音，不再向上级和全局上报',
        '上报信息：除了 JS 的 Error Stack，Vue 会贴心附带组件上下文信息和具体的生命周期时序标记，极利于排查'
      ]
    },
    keyPoints: ['errorHandler', 'errorCaptured', 'Sentry 监控', '错误冒泡', '容灾降级'],
    traps: ['注意，errorCaptured 只能捕获其“子孙组件”的错误，它“无法”捕获自身组件内部生命周期所抛出的异常，自身错误必须由更上一层父级的 errorCaptured 或全局 errorHandler 捕获'],
    relatedIds: []
  },
  {
    id: 'interview_vue_041',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Raw 响应式脱壳技术：toRaw 与 markRaw',
    difficulty: 3,
    frequency: 3,
    question: '在 Vue 3 中，toRaw 和 markRaw 分别能解决什么性能或业务问题？请给出一个典型的 markRaw 使用场景。',
    answer: {
      short: 'toRaw 用于获取一个响应式 Proxy 对象的底层原生 target 原始引用，常用于沉重算法计算以跳过 Proxy 拦截提速；markRaw 用于永久标记一个普通对象，使之永远不会被 Proxy 包装为响应式对象；markRaw 典型场景是存放第三方大型组件实例（如 Leaflet 地图、ECharts 实例或 HTML5 Canvas 实例），防止深层递归代理导致内存溢出。',
      thinkingProcess: '1. 原理剖析：Proxy 带来的运行时代价。每个属性的读写都有 getter/setter 函数执行。如果数据有 5 万条，每一条我们都要通过 Proxy 遍历，CPU 会发热。\n2. toRaw 原理：直接打破 Proxy 外层壳，返回普通 JS 对象，失去响应式，但读取速度提升。\n3. markRaw 原理：往原始对象上挂一个特殊不可写属性 `__v_skip: true`。Vue 的 reactive 探测到这个标记，直接退回原对象，不进行任何代理。',
      deepDive: 'markRaw 解决地图/图表库内存泄露的典型实战：\n```javascript\nimport { ref, markRaw } from \'vue\';\nimport echarts from \'echarts\';\n\nconst chartInstance = ref(null);\n\nfunction initChart(el) {\n  const myChart = echarts.init(el);\n  // 核心：若不加 markRaw，chartInstance.value = myChart 会导致 Vue 深度递归 myChart 的上千个底层属性进行 Proxy 代理，不仅性能崩溃，更会由于 chart 内部方法 receiver 丢失导致各种内部异常或频繁内存泄露。使用 markRaw 完美隔离代理行为。\n  chartInstance.value = markRaw(myChart);\n  chartInstance.value.setOption({ ... });\n}\n```',
      structured: [
        'toRaw 作用：脱去外壳，获取 Proxy 包装底层的原生 Javascript 对象，摆脱 Getter 拦截提升循环算力速度',
        'markRaw 作用：写入不可响应标记 `__v_skip: true`，永久隔离 Proxy 响应式系统劫持',
        'markRaw 场景一：保存大型第三方库实例，如 ECharts, Mapbox, Three.js 场景对象',
        'markRaw 场景二：渲染只读的大数据富文本段落或表格列表以防无谓的内存消耗'
      ]
    },
    keyPoints: ['toRaw', 'markRaw', '__v_skip', '三方库性能调优', 'Proxy 隔离', '内存优化'],
    traps: ['markRaw 标记是“永久生效”的。一旦一个对象被 markRaw 标记，无论它以后被嵌套进多么深层的 reactive 容器中，它的所有属性也永远保持普通状态，再也无法被响应式劫持，操作时需明确业务边界'],
    relatedIds: []
  },
  {
    id: 'interview_vue_042',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'customRef 自定义防抖 Ref 实现',
    difficulty: 3,
    frequency: 3,
    question: 'Vue 3 的 customRef 解决了什么问题？请手写一个利用 customRef 实现的“防抖输入框绑定（useDebouncedRef）”的自定义响应式变量。',
    answer: {
      short: 'customRef 允许开发者显式重写响应式数据的 track（收集依赖）和 trigger（触发更新）执行时机，用以实现状态的异步防抖、节流或条件拦截更新；手写上它接收一个回调函数，函数内通过 customRef 返回带 get 和 set 方法的对象，在 set 里用 setTimeout 延时执行 trigger()。',
      thinkingProcess: '1. 响应式劫持进化：常规的 ref，其 get 和 set 是同步且原生的。一旦修改 `.value`，立刻 trigger 更新整个组件重绘。\n2. 异步与防抖：在双向绑定的输入框中，如果用户打字，我们希望绑定的 `searchTerm` 能够延迟 300ms 再更新。如果使用普通 Ref，打字时每次按键页面都会频繁刷新触发请求。使用 customRef 可以劫持触发时机。\n3. 原理精髓：只有在 `setTimeout` 延迟到期后，才调用 `trigger()` 通知 Vue 渲染器：‘这里变了，开始重绘吧！’',
      deepDive: '手写响应式防抖 `useDebouncedRef` 的完整 Composable 模块代码：\n```javascript\nimport { customRef } from \'vue\';\n\nexport function useDebouncedRef(value, delay = 300) {\n  let timeout = null;\n  return customRef((track, trigger) => {\n    return {\n      get() {\n        track(); // 1. 显式调用 track()，让 Vue 知道该变量在哪个组件中被消费并建立依赖订阅\n        return value;\n      },\n      set(newValue) {\n        // 2. 劫持写入：清除上一个定时器，不立即通知 trigger()，实现防抖机制\n        clearTimeout(timeout);\n        timeout = setTimeout(() => {\n          value = newValue;\n          trigger(); // 3. 延时到期后，执行 trigger()，派发更新通知渲染器重绘 DOM\n        }, delay);\n      }\n    };\n  });\n}\n```',
      structured: [
        '底层目的：customRef 将原生的 getter/setter 响应式逻辑代理权完全下放给开发者',
        '接口参数：接收 (track, trigger) 双回调，在 get 中执行 track() 收集，在 set 中执行 trigger() 更新',
        '防抖优势：将防抖逻辑直接下沉内聚到“响应式变量本身”，外部组件直接 `v-model="debouncedText"`，无需写任何事件监听和防抖函数',
        '扩展潜力：除了防抖，还可编写在满足特定安全条件（如 age 必须 > 18）时才 trigger 更新的校验 Ref'
      ]
    },
    keyPoints: ['customRef', 'useDebouncedRef', 'track()', 'trigger()', '依赖拦截', '防抖双向绑定'],
    traps: ['在 customRef 的 get() 方法中如果不写 `track()`，该变量就会彻底失去响应式（Vue 无法在模板渲染时收集到依赖，即使后续触发了 trigger，页面也不会有任何重绘）'],
    relatedIds: []
  },
  {
    id: 'interview_vue_043',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 Block Tree 与动态节点收集优化',
    difficulty: 4,
    frequency: 3,
    question: 'Vue 3 渲染器底层的 Block Tree 机制是如何工作的？它是如何做到让复杂模板在更新时的 Diff 速度只与“动态节点数”相关，而无视页面整体静态 DOM 节点深度的？',
    answer: {
      short: 'Block Tree 在编译期将含有 v-if/v-for 等动态分叉的节点作为 Block（块级根节点）划分；每个 Block 在挂载时将其内部所有的动态子孙 VNode 节点扁平化收集并扁平挂载到自身的 dynamicChildren 数组中；更新 Diff 时，渲染器跳过层层 DOM 结构，直接对 dynamicChildren 一维数组进行遍历和 Patch，使性能与模板内动态元素数完全绑定。',
      thinkingProcess: '1. 对标 React 痛点：React 遇到大页面，即使里面 99% 的 DOM 都是静态文字，由于 JSX 没有编译期结构提示，Diff 时必须老老实实进行全树的深度优先遍历（递归对比每个 node）。\n2. Block Tree 突破：Vue 3 编译器分析 AST。一个普通的 div 块里，可能包了一万个 span，但只有一个 span 里有双括号 `{{count}}`。编译器会把这个 count-span 直接塞入最外层 Block 节点的 `dynamicChildren` 里。一旦 count 变了，Diff 时连里面的 div 都不用看，直接一步定位到 count-span 执行 Patch 文本修改。',
      deepDive: '为什么 v-if 和 v-for 必须作为“Block 的边界”？\n因为 `v-if` 的切换会导致 DOM 树的“物理结构”发生改变（原本有的节点突然没了），这会破坏原有的扁平化 `dynamicChildren` 数组长度一致性。为了解决这个问题，Vue 3 的编译器在遇到 `v-if` 或 `v-for` 时，会自动将其提升并实例化为一个**全新的子 Block（Sub-Block）**。这个子 Block 内部会再次建立自己独立的 dynamicChildren 收集树。这套分层级的 Block 拓扑网（Block Tree）完美解决了结构突变时的更新准确性。',
      structured: [
        '痛点突破：传统 Diff 速度直接受限于 DOM 树的总深度和总节点数，Vue 3 Block Tree 将更新解耦',
        '扁平化收集：在 Mount 阶段，将 Block 内深层嵌套的所有带 PatchFlag 的动态虚拟节点提取挂在根数组下',
        'Diff 提速：渲染更新时直接对 dynamicChildren 执行线性一维循环，跳过全部静态 HTML 组件和外壳 DOM 节点',
        '分叉控制：v-if 和 v-for 等能够改变 DOM 树几何结构的指令会作为子 Block 边界，单独自治，形成 Block 树'
      ]
    },
    keyPoints: ['Block Tree', 'dynamicChildren', '更新拉平', 'Diff 优化', '结构分叉边界', 'PatchFlags'],
    traps: ['如果过度手写 render 函数去模拟复杂的动态 v-if，由于无法享受编译器自动生成 Block 边界的待遇，必须手动在 render 中调用 `openBlock()` 和 `createBlock()`，否则会导致结构变动时 Vue 运行时报错崩溃'],
    relatedIds: []
  },
  {
    id: 'interview_vue_044',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Transition & TransitionGroup 过渡类名与物理动画实战',
    difficulty: 2,
    frequency: 4,
    question: 'Vue 的 <Transition> 和 <TransitionGroup> 的过渡原理是什么？请列出它们在过渡过程中动态挂载和移除的 6 个 CSS 类名，并说明 TransitionGroup 中 v-move 的妙用。',
    answer: {
      short: '过渡原理是在元素的插入、卸载或位置移动时，Vue 在特定时机自动挂载和卸载相应的 CSS 类名以触发浏览器的 CSS 过渡和动画；6 个类名为 v-enter-from, v-enter-active, v-enter-to（切入过程）和 v-leave-from, v-leave-active, v-leave-to（切出过程）；v-move 类名用于在列表项移动时自动挂载 transform 平移动画，实现平滑的洗牌和插队排序效果。',
      thinkingProcess: '1. 动效体验：Vue 提供的 Transition 极其符合直觉。它不需要你自己用 JS 算时间、加样式，它在 DOM 改变时只帮你挂 class，动画由 CSS transition 承载，性能极高。\n2. 6 个 CSS 状态类：\n- **切入**：\n  - `v-enter-from`：初始状态。\n  - `v-enter-active`：过渡中。通常写 `transition: all 0.3s ease;`。\n  - `v-enter-to`：结束状态。\n- **切出**：`v-leave-from` -> `v-leave-active` -> `v-leave-to`。\n3. TransitionGroup 的 v-move：列表增加或减少一项，其余未变的列表项位置会发生突变。`v-move` 能够检测到这种位置变化，利用 CSS FLIP 原理自动在后台生成平滑的滑动过渡。',
      deepDive: '利用 `<TransitionGroup>` 和 `v-move` 实现洗牌列表滑动动画的 CSS 核心：\n```css\n/* 列表项的进入和离开过渡效果 */\n.list-enter-active,\n.list-leave-active {\n  transition: all 0.5s ease;\n}\n.list-enter-from,\n.list-leave-to {\n  opacity: 0;\n  transform: translateX(30px);\n}\n/* 核心：v-move 会在其他元素被增删导致位置移位时自动挂载，通过 CSS transform 实现缓动，让列表项滑过去，而不是突变跳动 */\n.list-move {\n  transition: transform 0.5s ease;\n}\n/* 确保离开的元素脱离正常文档流，防止挤压周围元素导致移动动画不平滑 */\n.list-leave-active {\n  position: absolute;\n}\n```',
      structured: [
        'Transition：针对单节点显示隐藏的过渡封装，在生命周期插入/移除时动态切合 CSS 类',
        'TransitionGroup：针对多个列表项的过渡容器，要求子项必须绑定唯一的 :key，不可使用 index',
        '6个类名时序：v-enter-from (始) -> active (程) -> to (终)；切出同理',
        'v-move 类：基于 FLIP 布局动画思想，Vue 自动测算位置位移差值并在移位元素上挂载 transform 过渡，达到洗牌流畅效果'
      ]
    },
    keyPoints: ['Transition', 'TransitionGroup', '6 个类名', 'v-move', 'FLIP 动画', '列表洗牌'],
    traps: ['在使用 TransitionGroup 时，如果子元素被切出（leave-active）时没有设置 position: absolute 脱离文档流，被移除的元素会继续占用文档空间，导致旁边移动的兄弟元素发生生硬的“跳动”而非平滑移动'],
    relatedIds: []
  },
  {
    id: 'interview_vue_045',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'vue',
    title: '大型表格渲染优化设计',
    difficulty: 4,
    frequency: 4,
    question: '在开发企业级大屏、复杂 ERP 系统时，经常需要一次性渲染上千行、几十列的复杂表格。在 Vue 中如果直接用 v-for 循环渲染，会造成严重的掉帧卡死。请设计一套完整的 Vue 表格渲染渲染性能调优方案。',
    answer: {
      short: '调优方案应多管齐下：使用 shallowRef 存储表格行数据以彻底避开深层 Proxy 递归代理；在表格行上合理应用 v-memo="[row.id, row.version]"，仅在行数据真正变更时执行重新渲染和 Diff；关闭所有非必要的双向绑定，改用只读展示；对视口外的数据使用虚拟列表（Virtual List）做 DOM 插拔，将总 DOM 节点数锁定在极低数量。',
      thinkingProcess: '1. 性能瓶颈分析：一个 1000 行 * 20 列的表格，直接产生 2 万个单元格 DOM 节点。哪怕一个小的 cell 更新，Vue 默认也会做这 2 万个节点的遍历和对比，极易出现打字卡顿或滑动卡顿。\n2. 优化手段一：**shallowRef / shallowReactive**。表格数据通常是从后端拉取的只读 JSON 列表，我们完全不需要响应式去代理里面的“每个单元格的对象属性”。`data.value = markRaw(list)` 或者 `shallowRef(list)`，可以省去庞大的 Proxy 内存开销和初始化耗时。\n3. 优化手段二：**v-memo 靶向过滤**。`v-memo` 可以保证只有数据变了的那一行执行重绘。\n4. 优化手段三：**虚拟滚动**。如果数据量过万，必须采用虚拟滚动，只渲染屏幕内的几十行。',
      deepDive: '大表格调优架构图与数据流程设计：\n- **数据拉取层**：`const tableData = shallowRef([]); tableData.value = res.data;` —— 零深层递归，秒级加载。\n- **表格骨架层**：利用 `v-memo` 锁死：\n```html\n<tr v-for="row in tableData" :key="row.id" v-memo="[row.id, row.status, row.updatedAt]">\n  <td>{{ row.name }}</td>\n  <!-- 哪怕其他行的数据在 Pinia 里变了，只要这行的 status 和 updatedAt 没变，这里连 Diff 都直接跳过 -->\n  <td><StatusBadge :status="row.status" /></td>\n</tr>\n```\n- **视口限载层**：引入 `useVirtualList` 滚动计算，确保 DOM 节点不超标。',
      structured: [
        '数据层优化：用 shallowRef 取代 ref，阻止 Vue 递归代理大表格的数万个键值，削减 90% 响应式对象开销',
        'Diff层优化：TR 行元素配置 v-memo 依赖更新数组，保证修改单行数据时，其余几百行行不参与任何协调 Diff 运算',
        'DOM层优化：引入虚拟列表机制（如 vue-virtual-scroller），确保物理 DOM 节点数不随数据增多而无限膨胀',
        '逻辑层优化：表格内的只读列避免使用任何 v-model 双绑，对高频动作执行 debounce 防抖节流'
      ]
    },
    keyPoints: ['表格性能优化', 'shallowRef', 'v-memo', '虚拟表格', 'Proxy 开销控制', '大屏性能'],
    traps: ['使用 shallowRef 时，千万不要直接用 `tableData.value[index].status = \'new\'` 企图修改状态，因为这无法触发浅层响应式 Setter，组件不会重绘，必须重新赋值整个 value 指针：`tableData.value = [...tableData.value]`'],
    relatedIds: []
  },
  {
    id: 'interview_vue_046',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3.5 响应式系统底层重构与链表架构',
    difficulty: 4,
    frequency: 3,
    question: 'Vue 3.5 对响应式系统进行了重大的底层重构。请问这次重构的核心变化是什么？为什么说它将响应式系统的内存开销降低了 56% 并消除了内存泄漏隐患？',
    answer: {
      short: 'Vue 3.5 将原本基于 Map 和 Set 的双层依赖收集机制改写为基于“双向链表”的紧凑型内存结构；同时重构了追踪机制，消除了当组件卸载后未注销的 Effect 长期占用内存所导致的潜在内存泄漏；使得垃圾回收（GC）能高效回收不活跃节点，性能与内存控制大幅超越旧版。',
      thinkingProcess: '1. 技术前沿：Vue 3.5 的最新响应式变革。这是展现候选人持续跟进前沿动态的加分项。\n2. 重构背景：在 Vue 3.4 之前，每个响应式变量（Ref/Reactive）的属性都有一个 `Dep` 对象，里面包含一个 `Set` 用来装 `ReactiveEffect`。而每个 `ReactiveEffect` 里又包含一个 `Array` 用来装 `Dep`。这种复杂的双向 Set/Array 结构会产生大量零碎的内存小对象，垃圾回收负担重，且在复杂动态切换模板（v-if 频繁开关）时容易有指针悬空造成内存泄漏。\n3. 链表大法：Vue 3.5 彻底用“双向链表”（Double Linked List）重写了这个底座。组件内的每次依赖收集，只是建立了一个链表节点的指针链接，内存占用暴跌，且清理只需断开链表指针，速度极快。',
      deepDive: 'Vue 3.5 链表重构的数学与内存效益：\n这次重构由 Vue 核心团队成员完成，主要的优化是：组件内的依赖关系变成了紧凑排列的二进制结构。不需要为每次依赖创建独立的 Set 实例。由于链表可以天然在 `untrack` 或者是 Effect 重新计算时实现 O(1) 的断开与重连，这避免了旧版中因为模板更新导致的老依赖无法被彻底删除（Uncleaned Dep）的漏洞，使得 Vue 3.5 的**响应式响应式开销和首开速度都有了惊人的爆发**。',
      structured: [
        '重构背景：旧版响应式依赖 Set/Map 双向绑定产生海量微小对象，垃圾回收 GC 抖动频繁，高频切换 DOM 时易出内存滞留',
        '双向链表：用指针链接取代哈希表容器，在 O(1) 内完成依赖解绑与合并，结构极其轻量',
        '内存奇迹：实测响应式系统自身的常驻内存消耗骤降达 56%，大型系统运行更加轻盈',
        'A11y 与性能双收：响应式重构不仅节省内存，更使 computed 的计算在复杂链路下吞吐速度提升 2-3 倍'
      ]
    },
    keyPoints: ['Vue 3.5 重构', '双向链表', '内存优化', 'Dep 链表', '依赖收集', '垃圾回收 GC'],
    traps: ['Vue 3.5 响应式底座虽然大改，但在暴露出来的公共 API（ref, reactive, computed）表现上保持了 100% 的向下向后兼容，开发者只需无感升级 Vue 版本即可享受这一飞跃'],
    relatedIds: []
  },
  {
    id: 'interview_vue_047',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'vue',
    title: 'watchEffect 依赖清理机制（onCleanup）原理',
    difficulty: 3,
    frequency: 3,
    question: '在 watchEffect 中，onCleanup 回调函数的底层原理是什么？为什么它能在数据变化或组件销毁时，先于下一次副作用函数执行前触发？',
    answer: {
      short: 'onCleanup 是 Vue 3 响应式系统为副作用定制的生命周期注销钩子；当 watchEffect 重新调度或组件准备注销时，响应式系统在执行 effect 重新运行前，会先读取上一次执行时保存的 cleanup 函数引用并同步执行；它的底层将清理函数挂载在当前 ReactiveEffect 的 cleanup 属性上，从而能精准管控时序。',
      thinkingProcess: '1. 机制解析：理解副作用的“闭环管理”。\n2. 时序链条：数据变化 -> 触发 trigger -> 查找对应的 ReactiveEffect -> 发现其上有上一次注册的 `cleanup` 函数 -> 执行 `cleanup()` -> 执行 `effect.run()`。\n3. 好处：自动防范网络竟态、定时器堆叠，代码内聚性极高。',
      deepDive: 'Vue 3 内部 `ReactiveEffect` 的清理逻辑微观解析：\n在 `effect.run` 执行前，Vue 会调用 `cleanupEffect(effect)`。如果用户在 `watchEffect` 回调中调用了 `onCleanup(fn)`，Vue 会把 `fn` 挂在当前 `activeEffect.cleanup = fn`。当下一次状态改变，trigger 被触发，Vue 在调用该 effect 之前会判定 `if (effect.cleanup) effect.cleanup()`。这保证了旧的异步副作用资源在新的副作用开始前一定会被干干净净清理掉。',
      structured: [
        '作用：专为副作用的回撤与清理设计，如取消 Pending 的网络请求、注销注册的定时器',
        '时序逻辑：下一次 Effect 回调开始执行前 -> 同步触发上一次 Effect 所注册的 cleanup 函数',
        '底层原理：将 cleanup 闭包挂载在当前副作用对应的 `ReactiveEffect` 实例的私有属性上',
        '销毁合并：当组件 unmount 注销时，该 cleanup 方法也会随着 ReactiveEffect 的销毁而被同步执行一遍，防止内存泄漏'
      ]
    },
    keyPoints: ['watchEffect', 'onCleanup', 'ReactiveEffect', '时序逻辑', '异步取消'],
    traps: ['在 onCleanup 回调内部千万不能再去修改当前 watchEffect 所依赖的其他响应式变量，这会导致当前 effect 立刻再次被 trigger，陷入无限死循环调用栈溢出'],
    relatedIds: []
  },
  {
    id: 'interview_vue_048',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: '复杂表单校验架构设计',
    difficulty: 2,
    frequency: 4,
    question: '在开发具有几十个输入项、多步流程以及复杂关联校验（如“开始时间必须小于结束时间”）的中后台表单时，你会如何设计表单校验架构？',
    answer: {
      short: '推荐采用以声明式校验模式为核心的架构：选用 VeeValidate / Formily 等成熟表单库进行状态与校验解耦；对于关联校验，利用 computed 或 watch 动态监听关联依赖字段并更新校验规则；对大表单实行按步骤组件化拆分，利用 defineExpose 暴露子表单的 validate 校验方法供父组件集中调度。',
      thinkingProcess: '1. 架构思维：避免在普通组件里写满 `if (!name) error.name = ...`，这是面条代码的灾难。\n2. 工具选型：VeeValidate（Vue 生态最火，基于 Yup/Zod 校验对象），Formily（阿里开源，适合极度复杂的动态表单场景）。\n3. 联动校验：比如“A 勾选了，B 必填；A 没勾选，B 可空”。可以在 computed 里动态生成 Yup/Zod 校验 schema，保证逻辑完全声明式。',
      deepDive: '多步骤组件化表单校验集中分发架构设计：\n- **父组件**：管理当前的 `step` 状态和全局提交动作。\n- **步骤子组件（Step1.vue / Step2.vue）**：各自内聚自己的响应式状态和校验规则，向外 `expose` 一个统一的校验方法 `validate`：\n```javascript\n// 子组件 Step1.vue\nconst validate = async () => {\n  const { valid } = await form.validate();\n  return valid; // 返回布尔值告知校验结果\n};\ndefineExpose({ validate });\n```\n- **父级控制**：点击下一步时，通过 `stepRef.value.validate()` 执行局部异步校验，校验通过才放行至下一步。这保证了巨型表单逻辑的极大内聚与清爽。',
      structured: [
        '架构分层：表单数据层（Pinia/局部reactive）、校验规则层（Yup/Zod 声明式 Schema）、视图反馈层（UI控件）',
        '联动校验：computed 动态驱动 Zod 校验规则，当依赖项 state 变动，校验逻辑自动更新重算',
        '组件拆分：按业务块切分为 SubForm 子组件，通过 defineExpose 统一暴露 `validate()` 承诺接口',
        '用户体验：开启首次聚焦（Touched）后才触发红框报警报错，避免一开局页面就红一大片损毁体验'
      ]
    },
    keyPoints: ['表单校验', 'defineExpose', 'VeeValidate', 'Yup/Zod', '声明式校验', '多步骤表单'],
    traps: ['在对动态表单的 input 执行注销（如 v-if 隐藏）时，必须及时在 state 容器里把对应的 key 属性直接 `delete` 清除掉，否则这些被隐藏的脏数据在表单 submit 提交时仍会混入发送给后端'],
    relatedIds: []
  },
  {
    id: 'interview_vue_049',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 3 对 Host DOM 物理节点的获取与操作',
    difficulty: 2,
    frequency: 4,
    question: '在 Vue 3 的 script setup 语法中，如何获取真实的 DOM 元素节点？如何避免组件生命周期在不同阶段获取 DOM 失败的 Bug？',
    answer: {
      short: '通过声明一个与 template 元素上 ref 属性同名的 ref 变量来绑定物理 DOM；必须在 onMounted 生命周期钩子之后才能安全获取到真实的 DOM 节点，因为在 created 或是 setup 同步运行阶段，DOM 节点尚未在浏览器中挂载渲染，值为 null。',
      thinkingProcess: '1. 基础规范：Vue3 中获取 DOM 的写法变化。\n2. 机制分析：在 setup 中，由于整个函数是在挂载前同步运行的，此时浏览器连 VNode 树都没解析完，物理 DOM 更是一片空白。必须等待 mounted 阶段。\n3. 联动时序：如果 DOM 的显示是由 `v-if` 控制的，当 `visible.value = true` 后，直接去拿 `domRef.value` 依然为 null。因为 DOM 更新是异步的，必须配合 `nextTick()` 才能获取最新渲染。',
      deepDive: '在 script setup 中安全操作 DOM 的典型代码：\n```html\n<script setup>\nimport { ref, onMounted, nextTick } from \'vue\';\n\nconst inputEl = ref(null); // 声明一个同名 ref，初始为 null\n\nonMounted(() => {\n  inputEl.value.focus(); // 挂载完成，安全执行 DOM 获取和焦点调用\n});\n\nasync function triggerShow() {\n  showInput.value = true;\n  // 错误：inputEl.value.focus(); 会直接报错！因为 v-if 的 DOM 重绘还没发生\n  await nextTick();\n  inputEl.value.focus(); // 正确：在下一个 DOM 周期重绘后，安全聚焦\n}\n</script>\n<template>\n  <input ref="inputEl" v-if="showInput" />\n</template>\n```',
      structured: [
        '绑定机制：在 setup 中定义 `const domRef = ref(null)`，template 标签上写 `ref="domRef"` 自动识别挂载',
        '时效关卡：setup 执行时物理 DOM 尚未生成，必须在 onMounted / onUpdated 之后才能安全操作',
        '动态 DOM 坑点：v-if 控制的节点在状态置真后，必须使用 `await nextTick()` 等待渲染器刷完队列才可获取',
        '卸载清理：在组件销毁（onUnmounted）阶段，原绑定的 ref 引用会自动被 Vue 释放置为 null，防止产生内存垃圾'
      ]
    },
    keyPoints: ['DOM获取', '模板 Ref', 'onMounted', 'nextTick', 'v-if DOM操作'],
    traps: ['不要使用 `document.getElementById` 等原生 DOM 选择器在 Vue 中强行修改样式，这会绕开 Vue 虚拟 DOM 树的状态管理追踪，极其容易导致虚拟 DOM 与物理 DOM 在下一次 Diff 时发生重合紊乱'],
    relatedIds: []
  },
  {
    id: 'interview_vue_050',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'vue',
    title: 'Vue 高频状态更新防抖节流与 computed 控制',
    difficulty: 3,
    frequency: 4,
    question: '在 Vue 3 中，如果遇到高频触发的状态更新（如鼠标移动监听、Canvas 坐标高频修改），如何对 computed 或 watch 进行防抖与节流优化以防页面性能暴跌？',
    answer: {
      short: '防抖与节流应作用在“修改响应式数据的源头回调”上，而不是作用在计算属性 computed 本身；对 computed 进行防抖可使用 customRef 封装防抖 Ref 变量控制 trigger 时机；对 watch 进行防抖可配合其内置的 onCleanup 清理回调在下一次监听触发前注销上一次的延时器。',
      thinkingProcess: '1. 痛点：高频触发事件（如 mousemove）会每秒调用上百次。如果在事件里无脑 `state.value = x`，而 computed 又依赖这个 state，computed 会每秒重算上百次，引发组件大范围疯狂 rerender。\n2. 源头控制：最简单最正确的方案是在 mousemove 监听器上加 `throttle` 节流，让数据修改的速度降下来（如 50ms 一次）。\n3. watch 防抖：利用 watch 接收的 `onCleanup` 优雅控制定时器。',
      deepDive: '在 watch 中优雅实现输入防抖查询：\n```javascript\nconst searchInput = ref(\'\');\nconst searchResults = ref([]);\n\nwatch(searchInput, (newQuery, oldQuery, onCleanup) => {\n  // 每次 searchInput 变动，先开定时器 300ms 后才发请求\n  const timer = setTimeout(async () => {\n    searchResults.value = await api.get(newQuery);\n  }, 300);\n  \n  // 核心：若用户在 300ms 内再次打字，Vue 会自动先触发此 cleanup 回调，把前一次的 timer 清空，完美实现无震荡防抖\n  onCleanup(() => {\n    clearTimeout(timer);\n  });\n});\n```',
      structured: [
        '源头节流：在修改响应式数据的源头事件监听器（如 scroll/mousemove）上绑定节流函数，降频写入',
        'computed 防抖限制：computed 是只读缓存性设计，无法直接防抖，必须通过 customRef 设计防抖 Ref 来控制 trigger',
        'watch 防抖：利用 `onCleanup` 参数闭包，在每次新字符打入时自动 clearTimeout 清空前一次的计时器',
        '性能考量：针对极高频更新的展示，可考虑脱离 Vue 响应式，直接在 window 宏任务层手动操作局部 DOM 样式'
      ]
    },
    keyPoints: ['高频状态更新', '节流与防抖', 'onCleanup', 'customRef', 'computed缓存', 'mousemove优化'],
    traps: ['不要直接在 computed 的 getter 里写 setTimeout 返回值，这违背了 computed “同步、纯净无副作用计算”的本质，会导致 computed 的缓存标志位彻底错乱，引发页面无限重绘死循环'],
    relatedIds: []
  }
];

const fileContent = `// interview-vue.js
// 自动生成主题题库：Vue.js (归属于 frontend)

const questions = ${JSON.stringify(questions, null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-vue.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-vue.js with all 50 questions!');
