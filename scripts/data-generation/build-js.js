const fs = require('fs');
const path = require('path');

const questions = [
  {
    id: "interview_001",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "说一下浏览器事件循环",
    difficulty: 2,
    frequency: 5,
    question: "请解释浏览器中的 Event Loop，宏任务和微任务的执行顺序是什么？",
    answer: {
      short: "同步代码先执行，随后清空微任务队列，再进入下一个宏任务；浏览器会在合适时机进行渲染。",
      thinkingProcess: "1. 概念定位：Event Loop 是 JS 异步单线程的调度枢纽。\n2. 队列划分：宏任务（setTimeout/I/O）与微任务（Promise/queueMicrotask）。\n3. 执行流水线：一个宏任务出栈 -> 执行所有微任务直至清空 -> 渲染检查 -> 发起下一个宏任务。",
      deepDive: "Promise.then 属于微任务，setTimeout 属于宏任务。浏览器在执行一段脚本（这是首个宏任务）后，会将遇到的微任务全部执行完毕。在进入下一个宏任务前，如果发生了样式变动，浏览器会进行物理渲染。这意味着微任务的触发时机在一帧重绘之前，能阻断物理重绘的进行。",
      structured: [
        "执行当前调用栈中的同步代码",
        "清空微任务队列中所有等待的任务",
        "执行渲染步骤，进行屏幕刷新",
        "取出宏任务队列中堆首的第一个宏任务执行"
      ]
    },
    keyPoints: ["调用栈", "宏任务", "微任务", "Promise", "setTimeout", "渲染时机"],
    traps: ["不要把浏览器事件循环和 Node.js 事件循环完全混为一谈"],
    relatedIds: ["interview_017"]
  },
  {
    id: "interview_004",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "var、let、const 的区别",
    difficulty: 1,
    frequency: 5,
    question: "var、let、const 在作用域、提升和重复声明上有什么区别？",
    answer: {
      short: "var 函数作用域且存在变量提升，可重复声明；let/const 块级作用域、暂时性死区，不可重复声明；const 声明后不可重新赋值。",
      thinkingProcess: "1. 变量提升：var 在编译期初始化为 undefined，let/const 在编译期只声明不初始化，进入 TDZ。\n2. 作用域划分：块级花括号的作用范围。\n3. const 绑定限制：只针对指向地址只读，非属性封死。",
      deepDive: "const 限制的是变量的指针地址绑定，并非强锁数据。对于 const 声明的对象，我们依然可以对其内部属性执行增删改操作。若要冻结对象，必须手动使用 Object.freeze()。let/const 在声明前如果被读取，会触发 TDZ（暂时性死区）报错，避开了 var 声明前读取 undefined 的逻辑混乱。",
      structured: [
        "作用域：var 属于函数级作用域；let/const 属于 {} 块级作用域",
        "提升：var 提升且默认赋 undefined；let/const 提升但不赋初值，处于暂时性死区 (TDZ)",
        "重复声明：let/const 禁止在同一作用域内重复命名，否则报 SyntaxError",
        "const 限制：声明时必须初始化，且变量的内存地址绑定不可变动"
      ]
    },
    keyPoints: ["作用域", "变量提升", "暂时性死区 TDZ", "重复声明", "const 只读绑定"],
    traps: ["const 不是让对象内容不可变，而是让变量绑定不可变"],
    relatedIds: ["interview_017"]
  },
  {
    id: "interview_005",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "this 的指向如何判断",
    difficulty: 2,
    frequency: 4,
    question: "请说明 JavaScript 中 this 的指向规则，并举例 arrow function 与普通函数的区别。",
    answer: {
      short: "this 取决于调用方式；箭头函数没有自己的 this，会捕获定义时的上下文。",
      thinkingProcess: "1. 绑定分支：默认、隐式、显式、new、箭头函数。\n2. 优先级判定：new 绑定 > 显式 bind > 隐式 obj.fn > 默认全局。\n3. 箭头函数：声明时作用域 lexical this，永不可用 call 篡改。",
      deepDive: "普通函数的 this 指向是在“运行期”确定的，看谁调用了它；箭头函数的 this 是在“定义期”确定的，看它当时所在的词法上下文环境。箭头函数由于没有 `[[Construct]]`，没有 prototype，所以绝对不支持使用 `new` 实例化操作。",
      structured: [
        "默认绑定：非严格模式指向 window/global，严格模式指向 undefined",
        "隐式绑定：被对象点语法调用（如 obj.func()），this 指向调用主体对象 obj",
        "显式绑定：利用 call/apply/bind 强制锁定函数内 this",
        "new 绑定：构造函数实例化时，this 指向即将返回的新建实例对象",
        "箭头函数：没有专属的 this，顺着词法作用域链读取其声明父级的 this"
      ]
    },
    keyPoints: ["默认绑定", "隐式绑定", "显式绑定", "new 绑定", "箭头函数词法 this"],
    traps: ["不要看到函数定义位置就判断 this，关键看调用位置"],
    relatedIds: []
  },
  {
    id: "interview_017",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "setTimeout(fn, 0) 会立即执行吗",
    difficulty: 2,
    frequency: 4,
    question: "setTimeout(fn, 0) 中的回调会立即执行吗？为什么？",
    answer: {
      short: "不会立即执行，setTimeout 属于宏任务，0 毫秒只是最小延迟，回调仍需等当前调用栈清空并经过事件循环调度。",
      thinkingProcess: "1. 宏微时序：setTimeout 0 是在宏任务队列排队。\n2. 执行时序：调用栈清空 -> 清空所有微任务 -> 调度宏任务。\n3. 延迟下限：浏览器规范通常有 4ms 限制，实际存在延迟。",
      deepDive: "setTimeout(fn, 0) 的作用是将任务推迟到下一个事件循环迭代中执行。当你想把一个高开销计算分割、让出浏览器主线程以便响应用户 UI 点击时，setTimeout 0 是极好的方案。但在精准度上，它的延迟要显著大于 Promise 的微任务更新。",
      structured: [
        "回调登记：由 Web API 线程计时后将其回调入队到宏任务队列（Macrotask Queue）",
        "微任务堵塞：即使当前调用栈执行完，也必须先清空 queueMicrotask / Promise 队列中的所有微任务",
        "浏览器限制：在嵌套调用超过 5 次时，标准规定有最小 4 毫秒的物理底线限制",
        "应用目的：非阻塞分割计算，让出主线程给 GUI 渲染线刷新页面"
      ]
    },
    keyPoints: ["宏任务", "最小延迟", "事件循环", "让出主线程"],
    traps: ["不要认为 setTimeout 0 就是下一帧或立即执行"],
    relatedIds: ["interview_001"]
  },
  {
    id: "interview_028",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "箭头函数可以作为构造函数吗",
    difficulty: 2,
    frequency: 4,
    question: "（追问）箭头函数是否可以使用 new 实例化？为什么？它与普通函数在底层 prototype 上有什么不同？",
    answer: {
      short: "不可以。箭头函数没有自己的 this 绑定，没有 [[Construct]] 内部方法，且不具备 prototype 属性，因此无法作为构造函数。",
      thinkingProcess: "1. new 原理：分配临时新对象，绑定原型，借用 constructor 执行。\n2. 箭头功能缺乏：无 prototype，无 [[Construct]] 内部执行器。\n3. arguments 局限：亦不绑定 argument 集合对象，不能用作 generator。",
      deepDive: "JavaScript 引擎在通过 new 实例化一个普通函数时，会先创建一个空对象，将空对象的 __proto__ 指向函数的 prototype，然后将函数内的 this 绑定到这个新对象上并执行。箭头函数因缺乏 prototype 且 this 是固定的词法绑定，无法被实例化。若强行使用 new 调用箭头函数，引擎在检测时会直接抛出 TypeError 异常。",
      structured: [
        "原型链断档：无 prototype 属性，无法将新实例的 __proto__ 正确指向构造链",
        "执行机能欠缺：底层缺少 [[Construct]] 机制，仅存在供直接执行调用的 [[Call]]",
        " arguments 缺乏：不具备专属 arguments 对象，需通过 rest 剩余参数处理参数"
      ]
    },
    keyPoints: ["[[Construct]]", "prototype", "词法作用域 this", "原型链", "TypeError"],
    traps: ["不要只是回答“因为没有自己的 this”，更根本的原因是引擎层面没有 [[Construct]] 方法 and prototype 属性"],
    relatedIds: ["interview_005"]
  },
  {
    id: "interview_032",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "Vue/React 响应式数据流与底层更新机制",
    difficulty: 3,
    frequency: 5,
    question: "请对比 Vue 3 的 Proxy 响应式系统与 React 的 State/Fiber 调度更新机制的底层区别？",
    answer: {
      short: "Vue 是“细粒度绑定，自动依赖追踪”；React 是“粗粒度组件更新，利用 Virtual DOM diff 及 Fiber 异步可中断调度”。",
      thinkingProcess: "1. 响应机制：Vue 的订阅型响应（Proxy） vs React 的拉取型计算（Immutable + setState）。\n2. 更新层级：Vue 局部精准 effect，React 默认重新渲染整棵子树。\n3. 并发能力：React Fiber 支持任务可中断、分片，Vue 3 基于编译优化，追求极速运行时 diff。",
      deepDive: "Vue 的数据更新是通过数据劫持精准侦测属性变化的（Getter收集依赖，Setter触发Effect）。React 则遵循纯函数式的“单向数据流与不可变数据”。每一次 setState 会产生一棵全新的虚拟树，通过 React Fiber 调度算法（时间分片）在宏任务帧空闲期间对树执行增量比对。Vue 则通过静态标记（PatchFlag）使模板只做动态 Diff。",
      structured: [
        "Vue 3：基于 Proxy 属性读写代理劫持，Getter 触发 track 依赖收集，Setter 触发 trigger 指令更新",
        "Vue 更新粒度：细粒度局部组件更新，无过度渲染烦恼，对 PureComponent 等拦截策略依赖低",
        "React：依靠 setState 主动发起数据快照替换，以粗粒度方式默认触发其所有子树重绘",
        "React Fiber：基于双缓存和链表调度，将大型 Diff 任务打散，在 5ms 线程帧中允许被插队抢占"
      ]
    },
    keyPoints: ["Proxy 响应式", "依赖收集", "Fiber 架构", "时间切片", "双缓存机制"],
    traps: ["不要认为 Vue没有 Virtual DOM，Vue 3 同样有，只是 Vue 通过编译期静态标记 (PatchFlag) 做了极大程度的 Diff 剪枝优化"],
    relatedIds: ["interview_001", "interview_004"]
  }
];

const segment1 = [
  {
    id: "interview_js_007",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "原型与原型链机制",
    difficulty: 2,
    frequency: 5,
    question: "请详细阐述 JavaScript 中的原型（prototype）与原型链（prototype chain）的查找规则。",
    answer: {
      short: "每个对象都有 __proto__ 属性指向其构造函数的 prototype 原型对象；当访问对象的属性时，若自身没有，会沿着 __proto__ 链向上寻找，直至 Null 终点，此链条即为原型链。",
      thinkingProcess: "1. 链条构成：__proto__ 是隐式原型，prototype 是显式原型。\n2. 继承寻址：读取 obj.prop 时，若不存在，去 obj.__proto__ 上找，一直递归找到 Object.prototype.__proto__ 为 null。\n3. Constructor 关系：prototype 默认含 constructor 指向原函数。",
      deepDive: "JavaScript 的继承不是真正的类拷贝，而是基于“引用委托（Delegation）”。也就是说，新创建的子实例并不会拷贝父原型的属性，它只是持有一个指向父原型的链接指针。原型链的终点是 `Object.prototype.__proto__ === null`。这种设计在节省物理内存上具有极佳的表现。",
      structured: [
        "__proto__：每个普通对象都拥有的内部私有指针，指向其对应的原型链上一级",
        "prototype：只有函数对象才拥有的显式原型对象，用于在 new 实例化时为实例注入初始的 __proto__",
        "查找机制：在当前实例作用域上寻找 key，未命中则追溯其隐藏的 __proto__ 直至 null",
        "关系网络：`Function.__proto__ === Function.prototype`，Function 亦是由自己实例出来的顶端函数"
      ]
    },
    keyPoints: ["__proto__", "prototype", "原型继承", "委托机制", "Object.prototype"],
    traps: ["在现代开发中不建议直接读写 __proto__ 属性，因为这非常消耗引擎内部的排版优化性能，应使用 Object.getPrototypeOf() 或 Object.setPrototypeOf()"],
    relatedIds: []
  },
  {
    id: "interview_js_008",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "闭包定义与 V8 垃圾回收内存泄漏",
    difficulty: 2,
    frequency: 5,
    question: "什么是闭包（Closure）？闭包在 V8 引擎内部是如何进行垃圾回收的？如何防范闭包内存泄漏？",
    answer: {
      short: "闭包是能读取其他函数内部变量的函数；其本质是当内部函数被返回并在外部保留引用时，V8 引擎会在堆中创建一个 Closure 作用域对象，使其内部捕获的自由变量不会随着外部函数销毁而被垃圾回收。若长期保留这个内部函数引用则会造成内存泄漏，需在不用时手动将其置为 null。",
      thinkingProcess: "1. 闭包本质：函数 + 其绑定的词法环境（Lexical Environment）。\n2. 引擎底层：V8 在执行时如果判定存在闭包引用，就不会在栈弹出后销毁外部函数的 Activation Object (AO)，而是将变量迁移至堆中的 Closure 对象中。\n3. 防漏治理：解除外部引用变量对闭包函数的绑定。",
      deepDive: "在 V8 引擎中，如果两个闭包共享同一个外部作用域，即使一个闭包未引用某巨无霸变量，但另一个闭包引用了，该巨无霸变量依然会被常驻保留在堆内存中。所以不仅要对闭包置 null，更要规避在长生命周期中无意义挂载过多闭包函数。",
      structured: [
        "原理：函数在其定义的作用域外被执行时，仍能追溯并读取其定义时捕获的所有词法环境变量",
        "内存迁移：栈销毁时，由于闭包引用的存在，捕获的局部变量会从栈内存被转移保存至堆中，避开 GC 清理",
        "隐患场景：在全局或 window/DOM 节点上挂载长期有效的闭包事件，内部捕获大变量未清除",
        "解除方法：对引用了闭包的外部容器变量赋值为 `null`，打断其 GC 根节点（Roots）的可达性链路"
      ]
    },
    keyPoints: ["闭包", "闭包捕获", "垃圾回收 GC", "共享闭包陷阱", "内存归零"],
    traps: ["不要认为闭包一定会产生内存泄露。闭包是合理的内存驻留设计，只有在‘不再需要使用且无法被 GC 清理’时才叫内存泄露"],
    relatedIds: []
  },
  {
    id: "interview_js_009",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "深克隆与浅克隆及 HTML5 structuredClone",
    difficulty: 2,
    frequency: 4,
    question: "请对比浅克隆与深克隆的区别。如何手写一个支持循环引用和 Symbol 的深克隆？HTML5 原生的 structuredClone 有什么优缺点？",
    answer: {
      short: "浅克隆仅复制对象第一层的键值，深层引用共享地址；深克隆复制整个对象树结构；手写深克隆需使用 WeakMap 记录已访问对象以防死循环，并处理 Symbol 属性；原生的 structuredClone 是极其高效的深克隆 API，但无法克隆函数、DOM 节点和 RegExp 实例。",
      thinkingProcess: "1. 机制解剖：引用拷贝 vs 对象重构。\n2. 循环引用死循环：对象 A.self = A。用 WeakMap 记录已克隆的对象，再次遇到直接返回引用。\n3. 新 API：structuredClone() 支持 Map, Set, ArrayBuffer 等，但禁止克隆 Function。",
      deepDive: "手写兼容循环引用与 Symbol 键的深克隆核心：\n```javascript\nfunction deepClone(obj, map = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (map.has(obj)) return map.get(obj);\n  const cloneObj = Array.isArray(obj) ? [] : {};\n  map.set(obj, cloneObj);\n  const keys = Reflect.ownKeys(obj);\n  for (const key of keys) {\n    if (typeof obj[key] === 'object' && obj[key] !== null) {\n      cloneObj[key] = deepClone(obj[key], map);\n    } else {\n      cloneObj[key] = obj[key];\n    }\n  }\n  return cloneObj;\n}\n```",
      structured: [
        "浅拷贝：`Object.assign` 或展开运算符 `{...obj}`，只克隆基础类型，深层引用修改会互相污染",
        "JSON 方案局限：`JSON.parse(JSON.stringify(x))` 无法克隆 Function, Symbol, RegExp，且遇到循环引用会报错",
        "structuredClone：现代浏览器自带 API，内置 C++ 原生拷贝，支持循环引用与大多数二进制结构",
        "structuredClone 限制：遇到函数直接抛出 DATA_CLONE_ERR 异常，故无法用于克隆包含方法的 Class 实例"
      ]
    },
    keyPoints: ["深克隆", "循环引用", "WeakMap", "structuredClone", "Symbol 克隆"],
    traps: ["千万不要用递归深拷贝大体积对象而不做 WeakMap 拦截，数据里存在循环引用时会导致堆栈溢出直接死机"],
    relatedIds: []
  },
  {
    id: "interview_js_010",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "Promise 并发控制 API 全景对比",
    difficulty: 3,
    frequency: 5,
    question: "请对比 Promise.all, Promise.allSettled, Promise.any, Promise.race 的输入、输出及各自在遇到 reject 时的行为表现和使用场景。",
    answer: {
      short: "all 全部 resolve 时返回结果数组，只要一个 reject 就立刻中断报错；allSettled 等待所有任务完成，不论成功失败，返回状态明细对象数组；any 只要有一个成功就返回成功值，全部失败才 reject；race 返回最快返回的最快结果。",
      thinkingProcess: "1. 并发原语：处理多异步请求的组合逻辑。\n2. all 强一致性：适合初始化多个前置请求。\n3. allSettled 宽容度：适合发送日志上报等各自独立互不影响的任务。",
      deepDive: "Promise.all：一旦有任务 reject，触发 catch 抛出，其余仍在执行的 Promise 不会被主动强行 abort，但其后续结果会被all忽略。Promise.any 全部失败时返回的 reject 是一个特殊的 AggregateError 对象，包含一个 errors 数组保存所有的失败原因。",
      structured: [
        "all：一损俱损。全员 Fulfilled 则返回数组结果，单点 Rejected 则立刻抛出单点错误",
        "allSettled：全员交单。等待全员出结果，收集状态报告，拒绝半路夭折中断",
        "any：首胜即停。只要一个成功就 resolve 成功结果，全员阵亡则抛出 AggregateError 异常",
        "race：竞态比拼。不看成败只争先，最快有结果的 Promise 决定全局返回"
      ]
    },
    keyPoints: ["Promise.all", "Promise.allSettled", "Promise.any", "Promise.race", "AggregateError"],
    traps: ["使用 Promise.all 时，如果在子 Promise 内部写了 `.catch`，这个子 Promise 即使报错也会返回 resolved，导致 Promise.all 依然会被判定为成功"],
    relatedIds: []
  },
  {
    id: "interview_js_011",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "从头手写实现 Promise (Promise/A+ 规范核心)",
    difficulty: 5,
    frequency: 4,
    question: "请手写一个符合 Promise/A+ 规范核心流程（包含状态转移、then 的链式调用及异步回调队列执行）的极简 MyPromise 类。",
    answer: {
      short: "通过维护 pending, fulfilled, rejected 三种状态，定义 then 方法收集回调；在 resolve/reject 中将状态锁定，并在微任务队列（queueMicrotask）中异步刷出执行回调，实现链式调用。",
      thinkingProcess: "1. 规范要素：三种状态、值与原因、回调队列、then 的链式返回新 Promise。\n2. 状态单向转移：pending -> fulfilled/rejected。\n3. 异步回调调度：规范要求 then 里的回调必须在微任务（异步）中执行，手写时可用 `queueMicrotask` 模拟。",
      deepDive: "手写符合 A+ 核心的 Promise 源码框架：\n```javascript\nclass MyPromise {\n  constructor(executor) {\n    this.state = 'pending';\n    this.value = undefined;\n    this.reason = undefined;\n    this.onResolvedCallbacks = [];\n    this.onRejectedCallbacks = [];\n    const resolve = (value) => {\n      if (this.state === 'pending') {\n        this.state = 'fulfilled';\n        this.value = value;\n        this.onResolvedCallbacks.forEach(fn => fn());\n      }\n    };\n    const reject = (reason) => {\n      if (this.state === 'pending') {\n        this.state = 'rejected';\n        this.reason = reason;\n        this.onRejectedCallbacks.forEach(fn => fn());\n      }\n    };\n    try { executor(resolve, reject); } catch (e) { reject(e); }\n  }\n  then(onFulfilled, onRejected) {\n    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;\n    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };\n    return new MyPromise((resolve, reject) => {\n      const handle = (callback, value, targetResolve, targetReject) => {\n        queueMicrotask(() => {\n          try {\n            const x = callback(value);\n            if (x instanceof MyPromise) {\n              x.then(targetResolve, targetReject);\n            } else {\n              targetResolve(x);\n            }\n          } catch (e) { targetReject(e); }\n        });\n      };\n      if (this.state === 'fulfilled') {\n        handle(onFulfilled, this.value, resolve, reject);\n      } else if (this.state === 'rejected') {\n        handle(onRejected, this.reason, resolve, reject);\n      } else {\n        this.onResolvedCallbacks.push(() => handle(onFulfilled, this.value, resolve, reject));\n        this.onRejectedCallbacks.push(() => handle(onRejected, this.reason, resolve, reject));\n      }\n    });\n  }\n}\n```",
      structured: [
        "状态隔离：PENDING (初始状态)、FULFILLED (成功态)、REJECTED (失败态)，状态变更一槌定音",
        "链式中转：then 方法必须返回一个全新的 MyPromise 实例，这是链式调用而非返回 this 的核心差异",
        "微任务调度：利用原生 queueMicrotask 包裹 then 内部的回调执行，保障符合 ES 规范所期待的执行时序",
        "异步解耦：在 PENDING 状态下，将 then 传入的回调解耦暂存，等待 Resolve 触发时再同步刷出"
      ]
    },
    keyPoints: ["Promise/A+", "微任务 queueMicrotask", "状态转移", "链式调用", "回调队列"],
    traps: ["很多手写 Promise 示例中在 then 中直接同步执行 onFulfilled，这严重违背了 A+ 规范中“then 必须在当前调用栈微任务刷完后才执行”的异步约束规则"],
    relatedIds: []
  },
  {
    id: "interview_js_012",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "防抖（Debounce）与节流（Throttle）实现",
    difficulty: 2,
    frequency: 5,
    question: "请对比防抖和节流的区别，并手写出一个支持立即执行和取消功能的防抖函数，以及一个基于时间戳+定时器的精准节流函数。",
    answer: {
      short: "防抖是高频动作结束后延时一次执行，若再次触发则重新计时，适合搜索输入；节流是规定时间内只执行一次，适合滚动和拖拽；实现需合理使用闭包、计时器与时间戳比对。",
      thinkingProcess: "1. 区别：延迟执行 vs 稀释频率。\n2. 防抖强化：增加 immediate 开关，第一次按键立刻响应，后续防抖；增加 cancel 解除闭包引用。\n3. 节流：结合时间戳与定时器实现完美的头尾均触发的节流控制。",
      deepDive: "防抖实现代码：\n```javascript\nfunction debounce(fn, wait, immediate = false) {\n  let timeout = null;\n  const debounced = function(...args) {\n    const context = this;\n    if (timeout) clearTimeout(timeout);\n    if (immediate) {\n      const callNow = !timeout;\n      timeout = setTimeout(() => { timeout = null; }, wait);\n      if (callNow) fn.apply(context, args);\n    } else {\n      timeout = setTimeout(() => { fn.apply(context, args); }, wait);\n    }\n  };\n  debounced.cancel = function() {\n    clearTimeout(timeout);\n    timeout = null;\n  };\n  return debounced;\n}\n```",
      structured: [
        "防抖：连续高频点击仅算最后一次，防范输入框动态联想查询时高频轰炸后端",
        "节流：在连续事件（如 window scroll）下，把触发更新执行的频数强制降低",
        "防抖立即执行：首发不需要等待，直接 apply 触发，冷却时间到期前拒绝后续执行",
        "防抖取消：debounced.cancel 能够随时释放正在计时中的 timeout 定时器"
      ]
    },
    keyPoints: ["防抖 Debounce", "节流 Throttle", "闭包缓存", "立即执行", "内存泄露"],
    traps: ["在 React 组件中直接声明防抖函数时，必须用 useCallback 包裹，否则每次组件 rerender 都会生成全新的防抖闭包，导致防抖失效"],
    relatedIds: []
  },
  {
    id: "interview_js_013",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "函数柯里化（Currying）实现与延迟计算",
    difficulty: 3,
    frequency: 4,
    question: "什么是函数柯里化？请手写一个自动判定函数参数长度的柯里化通用包装函数（curry）。",
    answer: {
      short: "柯里化是将一个多参数函数转化为多个单参数（或少参数）链式调用函数的技术；原理是利用闭包收集参数，当收集的参数个数达到原函数所需的形参长度时，执行原函数计算。",
      thinkingProcess: "1. 理念：参数复用、延迟计算。\n2. 实现：对比已收集参数长度与原函数形参长度。\n3. 递归：若长度不足，返回一个接收新参数并递归调用的柯里化包装函数。",
      deepDive: "自动参数判断的柯里化代码：\n```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    } else {\n      return function(...args2) {\n        return curried.apply(this, args.concat(args2));\n      };\n    }\n  };\n}\n```",
      structured: [
        "本质：多参函数转化为单参函数链，利用 closure 保留先前传入实参的词法环境",
        "延迟执行：参数没收齐前决不真正计算，只做收集并返回包装函数",
        "参数长度判定：依赖 Function 对象的 `.length` 属性获取原函数定义的形参个数",
        "应用：参数复用（如固定公用 host 的 fetch API）"
      ]
    },
    keyPoints: ["函数柯里化", "fn.length", "闭包参数收集", "参数复用", "延迟计算"],
    traps: ["如果原函数声明了剩余参数（如 `function(...args) {}`），由于此时 `fn.length === 0`，普通的参数长度比对在第一次调用时就会直接触发而失效"],
    relatedIds: []
  },
  {
    id: "interview_js_014",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "手写 call、apply 与 bind 绑定器",
    difficulty: 3,
    frequency: 4,
    question: "请详述 call, apply, bind 三者的作用与区别，并从底层手写实现这三者。",
    answer: {
      short: "三者均用于修改 this 指向；call 接收散列参数，apply 接收参数数组，两者立即执行；bind 返回新函数，支持参数合并；手写是通过将函数挂载到指定的 target 对象属性上，调用后删除。",
      thinkingProcess: "1. 挂载思路：`context.fn = this`，然后调用执行，delete 属性。\n2. 兼容性：null/undefined 指向 window。\n3. bind new 特例：判断作为构造函数被 new 时，this 的重新指向绑定。",
      deepDive: "手写实现 bind 机制：\n```javascript\nFunction.prototype.myBind = function(context, ...args) {\n  const self = this;\n  return function F(...newArgs) {\n    if (this instanceof F) {\n      return new self(...args, ...newArgs);\n    }\n    return self.apply(context, args.concat(newArgs));\n  };\n};\n```",
      structured: [
        "call / apply：即时劫持执行。将当前函数临时挂载到 context 属性上，触发隐式绑定",
        "bind：返回延时包装函数，锁定 this。合并两阶段参数",
        "bind new 特权：判定 myBind 返回的函数是否被 `new` 实例化，若是则改用 new 原函数",
        "边界过滤：context 如果是基础类型，需要用 Object(context) 转换为包装对象"
      ]
    },
    keyPoints: ["call 劫持", "apply 数组参数", "bind 延迟包装", "new 优先级", "Object(context)"],
    traps: ["在手写 call 时，临时挂载的属性名应使用 Symbol() 声明，以防覆盖 context 原对象上已存在的同名属性"],
    relatedIds: []
  },
  {
    id: "interview_js_015",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "ES6 Modules 与 CommonJS 规范深度对比",
    difficulty: 3,
    frequency: 4,
    question: "ES6 模块规范（ESM）与 CommonJS 模块规范（CJS）有什么根本区别？",
    answer: {
      short: "CommonJS 运行时加载、输出的是值的拷贝，支持动态 require；ESM 编译时静态加载、输出的是值的动态只读引用，只能在顶层导入，支持 Tree-shaking 优化。",
      thinkingProcess: "1. ESM 静态分析特性 vs CJS 动态加载机制。\n2. 值的拷贝（CJS）与值的实时只读引用（ESM Live Binding）。\n3. 构建、实例化、执行的三阶段运行机制。",
      deepDive: "ESM 静态分析使编译期依赖树推演成为可能，是 webpack/vite 实现 Tree-shaking 和瘦身的基础。CJS 由于可以在 runtime 任意拼写模块名 require，无法执行静态分析剪枝。在 ESM 中循环依赖表现较好，因为使用的是只读引用槽机制。",
      structured: [
        "CommonJS：`require` 运行时加载，导出值的浅拷贝，不支持静态编译剪枝",
        "ES6 Modules：`import` 编译期静态分析定位，导出值的只读引用，支持 Tree-Shaking",
        "动态引入：CommonJS 支持条件 require；ESM 必须置顶声明，但提供 dynamic `import()` 异步逃生舱",
        "循环依赖：CJS 循环引入容易拿到半截的未初始化对象；ESM 基于引用指针，对循环依赖兼容性极高"
      ]
    },
    keyPoints: ["ESM", "CommonJS", "只读引用 Live Binding", "编译期静态分析", "Tree-shaking", "循环依赖"],
    traps: ["在 ESM 模块中，直接对导入的模块属性赋值会当场报 SyntaxError: Assignment to constant variable 错误"],
    relatedIds: []
  },
  {
    id: "interview_js_016",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "Async/Await 转化为 Generator 与 Co 运行器原理",
    difficulty: 4,
    frequency: 4,
    question: "Async/Await 的语法糖底层是如何实现的？请手写一个 Co 模块的自动执行器（Generator Runner）。",
    answer: {
      short: "Async/Await 是 Generator（生成器）和 Promise 的语法糖；底层通过自动执行器递归读取 Generator 的 yield Promise 结果，直到 done: true 时将最终结果 resolve。",
      thinkingProcess: "1. 映射：async -> *，await -> yield。\n2. 执行：next() 循环递归，利用 Promise.then 在 resolve 时继续 next(val)。\n3. 抛错：在 catch 时调用 `g.throw()` 将异常投射回内部。",
      deepDive: "手写 spawn 自动执行器代码：\n```javascript\nfunction spawn(generatorFn) {\n  return new Promise((resolve, reject) => {\n    const g = generatorFn();\n    function step(nextFn) {\n      let next;\n      try { next = nextFn(); } catch (e) { return reject(e); }\n      if (next.done) return resolve(next.value);\n      Promise.resolve(next.value).then(\n        val => step(() => g.next(val)),\n        err => step(() => g.throw(err))\n      );\n    }\n    step(() => g.next());\n  });\n}\n```",
      structured: [
        "原理：Async/Await = Generator + Promise + spawn 自动执行器",
        "运行机理：当遇到 yield Promise，协程挂起，Promise 成功后再自动调 next() 恢复协程",
        "错误捕获：可以用 try-catch 捕获，因为 spawn 会在 catch 时调用 `g.throw()`",
        "手写核心：递归 then 链条，直到迭代器 done: true 标记到达"
      ]
    },
    keyPoints: ["Async/Await 语法糖", "Generator 协程", "spawn 执行器", "co 库", "Iterator"],
    traps: ["如果 await 后面的 Promise 长期处于 pending 状态，Generator 的自动执行器将被卡死在此步骤，协程无法释放"],
    relatedIds: []
  },
  {
    id: "interview_js_017_gc",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "V8 引擎垃圾回收机制与分代回收",
    difficulty: 4,
    frequency: 4,
    question: "请详细阐述 V8 引擎的垃圾回收（GC）机制。什么是分代回收？",
    answer: {
      short: "V8 将堆内存分为新生代和老生代；新生代采用 Scavenge 算法进行 To/From 空间复制与整理；老生代采用标记清除（Mark-Sweep）、标记整理（Mark-Compact）以防碎片化，并引入增量标记与并发回收以降低主线程停顿（STW）。",
      thinkingProcess: "1. 堆区划分：New Space 与 Old Space。\n2. 新生代算法：Scavenge To-From 空间折半复制，整理物理页，老对象晋升。\n3. 老生代算法：Mark-Sweep 标记后清理，Mark-Compact 整理空缺位置，增量标记（三色标记法）降低 STW。",
      deepDive: "增量标记（Incremental Marking）通过将全量标记拆为小步骤穿插在 JS 执行中间，有效规避了单次长停顿导致的丢帧卡顿。为防标记期间 JS 动态修改引用导致漏标，引入了写屏障（Write Barrier）和三色标记法进行状态跟踪。",
      structured: [
        "新生代空间：Scavenge 算法，From-To 空间折半，拷贝活对象，零碎片，空间小",
        "晋升机制：经历过一次复制且存活，或者 To 空间已满 25%，对象强制晋升移送老生代",
        "老生代空间：Mark-Sweep + Mark-Compact（整理空缺位置防止内存空隙散乱化）",
        "降噪停顿：引入 Incremental Marking（三色标记法）与 Concurrent Marking，STW 时间减少至毫秒级"
      ]
    },
    keyPoints: ["V8 垃圾回收", "分代回收", "Scavenge 算法", "三色标记法", "增量标记", "Stop-The-World"],
    traps: ["垃圾回收虽自动，但大量创建临时闭包和大数组，依然会高频触发 GC，使 CPU 负荷拉满"],
    relatedIds: []
  },
  {
    id: "interview_js_018",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "数组遍历方法性能对比（for vs map vs reduce）",
    difficulty: 2,
    frequency: 4,
    question: "在 JavaScript 中，传统的 for 循环、forEach、map、filter、reduce 在执行性能上有何差异？面对上百万数据该如何选择？",
    answer: {
      short: "传统 for 循环性能最高，因为它直接操作索引且没有额外的函数栈调用开销；forEach/map/filter 会对数组每个子项执行闭包回调，存在调用开销；在处理上百万条超大数组时，应使用原生 for 循环，或在遍历前预分配空间以求极限性能。",
      thinkingProcess: "1. 对比：普通 for 循环无闭包执行开销，性能最佳。\n2. map/filter 劣势：每次都开辟新数组，容易产生无用大内存占用，触发 GC 垃圾清理。\n3. 大数据优化：预分配 Array 内存大小，用 `for` 指向 `i` 直接赋值。",
      deepDive: "避免动态扩容：`const newArr = new Array(length)` 可提前申请好物理地址，防止 push 导致的原生 C++ 数组扩容拷贝开销，在大数据量下可提升数倍速度。",
      structured: [
        "for/while：直接在栈指针计算索引，无函数调用上下文创建，速度最快，支持 break 中断",
        "forEach：只为便利设计，不可 break 中断，闭包开销中等",
        "map/filter：每次生成新数组，若只用于运算不要写 map，会导致大量垃圾对象产生",
        "for of：调用 Iterator 协议实现，速度慢于普通 for 循环，但支持 break"
      ]
    },
    keyPoints: ["数组遍历", "for 循环", "内存预分配", "GC 抖动", "函数栈开销"],
    traps: ["不要无脑追求链式优雅，在超大数组下这会导致多轮遍历，并产生多余的临时大数组而撑爆内存"],
    relatedIds: []
  },
  {
    id: "interview_js_019",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "Symbol 与 BigInt 核心特性与场景",
    difficulty: 2,
    frequency: 4,
    question: "ES6+ 新增的 Symbol 和 BigInt 分别解决了什么痛点？各有什么核心语法约束和使用场景？",
    answer: {
      short: "Symbol 解决了对象属性名冲突（防止意外覆写）和创建私有属性的痛点，不能使用 new 且无法直接 for...in 遍历；BigInt 解决了 JS 无法精确安全处理 64 位超大整数的痛点，数字后加 n 且不能与普通 Number 混合计算。",
      thinkingProcess: "1. Symbol：唯一不可变，Reflect.ownKeys 获取。\n2. BigInt：任意精度整数，解决 Safe Integer 溢出（如后端 Snowflake ID 精度受损）。\n3. 限制：Number 和 BigInt 类型不兼容，不可隐式强转。",
      deepDive: "Symbol 还支持自定义 Well-Known Symbols。如通过 `Symbol.iterator` 可以自定义任何对象的 for-of 循环迭代行为，提供原生般的遍历操控权限。",
      structured: [
        "Symbol 用途：防止对象方法名意外冲突，配合 Symbol.for() 建立全局注册表",
        "Symbol 隔离：无法被 `Object.keys` / for-in 扫描，必须使用 `Object.getOwnPropertySymbols()` 获取",
        "BigInt 用途：解决超过 Number.MAX_SAFE_INTEGER 的大整数计算失准问题",
        "BigInt 限制：数字后加后缀 n，禁止与普通 Float 隐式强转运算，必须显式转换"
      ]
    },
    keyPoints: ["Symbol", "BigInt", "MAX_SAFE_INTEGER", "Symbol.iterator", "元编程"],
    traps: ["解析后端传回的大数值时，在 JSON.parse 瞬间就已经精度受损，必须在 parse 之前用正则将长数值包裹为字符串或用 JSON-Bigint 库拦截"],
    relatedIds: []
  },
  {
    id: "interview_js_020",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "WeakMap 与 WeakSet 的内存优势与场景",
    difficulty: 3,
    frequency: 4,
    question: "WeakMap / WeakSet 与普通的 Map / Set 在垃圾回收上有什么本质区别？请举出两个典型应用场景。",
    answer: {
      short: "WeakMap 的 Key 只能是对象，且持有的引用是“弱引用”；如果 Key 对象没有被其他地方的强引用指向，垃圾回收器会自动回收该对象及条目；这防范了因忘记删除映射而导致的内存泄漏。典型场景为 DOM 节点关联私有数据，及实现类的私有属性。",
      thinkingProcess: "1. 机制：若无其他引用，弱引用不会阻断 GC 清洗。\n2. Map 痛点：DOM 移出页面后，如果它仍是 Map 的 Key，则内存无法回收。WeakMap 会自动被 GC 清理条目。\n3. 私有属性：以 this 为 Key，对象销毁后私有数据自动物理注销。",
      deepDive: "WeakMap 的 Key 强限制为 Object。由于随时会被 GC 回收清空，出于一致性考量，WeakMap/WeakSet 均不支持任何遍历 API，也不支持 size 属性。",
      structured: [
        "弱引用机制：WeakMap 只对 Key 持有弱引用，若该 Key 对象的强引用全部消失，垃圾回收会自动将其回收",
        "键值限制：WeakMap 的键必须是对象引用（无法使用基础类型），且不支持 size，不支持 clear()，无法遍历",
        "场景一（DOM 数据关联）：为大型 DOM 树上的节点额外记录交互数据，DOM 销毁后数据自动回收",
        "场景二（数据缓存）：构建对象级别的静态函数计算缓存表，对象销毁后缓存自动失效释放"
      ]
    },
    keyPoints: ["WeakMap", "WeakSet", "弱引用", "垃圾回收 GC", "DOM 节点缓存"],
    traps: ["由于弱引用关系使得 WeakMap 内部的条目会随着垃圾回收在运行时随时消失，所以 WeakMap 无法遍历"],
    relatedIds: []
  }
];

const segment2 = [
  {
    id: "interview_js_021",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "生成器（Generator）与迭代器协议",
    difficulty: 3,
    frequency: 3,
    question: "请详细阐述 JavaScript 中的迭代器协议。Generator 是如何通过 yield 来挂起和恢复执行上下文的？",
    answer: {
      short: "迭代器协议规定对象必须实现 [Symbol.iterator]() 方法并返回带有 next() 的迭代器；Generator 是一种特殊的迭代器生成函数，遇到 yield 时引擎会保存其当前的调用栈并让出主线程，调用 next() 时再将上下文推入栈中恢复执行。",
      thinkingProcess: "1. Iterator: 含有 next() 并返回 { value, done } 的结构。\n2. Generator 暂停：V8 会将当前协程上下文弹出调用栈并存入堆中。\n3. next 传参：next(val) 的值会被注入为上一个 yield 表达式的最终返回结果。",
      deepDive: "Iterator 是 for-of 遍历的底层依托。自定义 `[Symbol.iterator]` 可以让任何复杂的树形结构在外界使用普通的 `for (let x of tree)` 极简遍历消费。",
      structured: [
        "迭代器：符合 `{ next() -> { value, done } }` 格式的对象，是原生解构和 for-of 的底层依托",
        "Generator 挂起：Generator 在遇到 `yield` 时，引擎会捕获当前函数的局部变量并将其移至堆中暂存",
        "Generator 恢复：调用 `iterator.next(param)` 传值，引擎把堆中执行上下文重插回调用栈顶部继续运行",
        "双向通信：yield 不仅能向外输出值，next(param) 传入的参数还会作为上一个 yield 表达式的返回值写入"
      ]
    },
    keyPoints: ["Generator", "迭代器协议", "Symbol.iterator", "协程调度", "调用栈挂起"],
    traps: ["在 Generator 内部如果忘记写 return，默认迭代的最后一个状态会是 `{ value: undefined, done: true }`"],
    relatedIds: []
  },
  {
    id: "interview_js_022",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "Proxy 与 Reflect 的协同配合",
    difficulty: 3,
    frequency: 4,
    question: "在 Proxy 代理对象中，为什么 get/set 钩子中要配合 Reflect.get / Reflect.set 来使用？",
    answer: {
      short: "Reflect 方法与 Proxy 拦截方法一一对应，且返回操作成功布尔值；若直接使用 target[key]，当遇到对象继承关系且父类为代理时，由于没有正确绑定 receiver，会导致 this 指向错误而发生依赖重复收集或属性覆写错误。",
      thinkingProcess: "1. 规范：Reflect 解决 Object 底层抛错中断问题。\n2. Receiver：保存正确的 Proxy context。当原型链存在 Proxy 时，若无 receiver，在 getter 里读取 `this.x` 时，this 会被绑定回 target 原生对象，导致 Proxy 漏掉对 count 的追踪。",
      deepDive: "Reflect 使得 `Reflect.get(target, key, receiver)` 中的 receiver 能作为 getter 的 `this` 引用传入，完美维持了继承链上的 getter/setter 响应式穿透追踪。",
      structured: [
        "Reflect 作用：代替 Object 的命令式属性拦截操作，返回成功布尔值以防止程序崩溃",
        "Receiver 核心：保存 Proxy 代理的当前上下文，将其作为 getter/setter 中 `this` 的正确绑定引用",
        "继承保护：防范当外部对象原型链上挂载 Proxy 代理时，直接 `target[key]` 读取导致 prototype 原型误绑定",
        "代理一致性：Proxy 的 13 种 Traps 在 Reflect 中均有对应的原生行为接口"
      ]
    },
    keyPoints: ["Proxy 拦截", "Reflect", "Receiver 指针", "继承 this 劫持", "依赖漏收集"],
    traps: ["绝对不要在 Proxy 拦截中写 Reflect.set 时漏掉 return，否则严格模式下会触发 TypeError"],
    relatedIds: []
  },
  {
    id: "interview_js_023",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "IntersectionObserver 与 MutationObserver 监控",
    difficulty: 3,
    frequency: 4,
    question: "请对比 IntersectionObserver（交叉观察器）和 MutationObserver（变动观察器）的作用及底层机制。如何利用它们分别实现“图片懒加载”和“防水印被恶意修改”？",
    answer: {
      short: "IntersectionObserver 监控目标元素与容器视口的交叉面积比例，用于图片懒加载和无限滚动，底层使用异步更新帧比对以防卡顿；MutationObserver 监控 DOM 树节点及属性的增删改动，可用于监听水印 DOM 被篡改时立即将其重绘补回。",
      thinkingProcess: "1. 交叉观察器：抛弃 scroll 监听以提升滑动流畅度。\n2. 水印防删：监听 childList 和 attributes 改变。若水印被 remove，立即在回调里执行 appendChild 重新插回 DOM。\n3. 异步机制：两者皆为异步宏/微任务执行，不直接阻塞浏览器同步绘制排版。",
      deepDive: "水印防篡改监听 subtree attributes：一旦恶意篡改 style 属性或者 display 状态，立刻触发 MutationObserver 回调，强制更新其 style style.display='block' / opacity:1，保障安全性。",
      structured: [
        "IntersectionObserver：异步视口交叉监听，替代 scroll 的 getBoundingClientRect 计算，优化无限滚动与图片懒加载",
        "MutationObserver：异步 DOM 树微任务变动监听，记录属性/节点树改变，防范非法篡改",
        "懒加载实现：观察目标 img，当 intersectionRatio > 0 时，替换 src 并 unobserve 注销监听",
        "水印防删实现：深度监控 subtree，监测到 attributes 或节点销毁，立刻重绘覆盖节点保护内容"
      ]
    },
    keyPoints: ["IntersectionObserver", "MutationObserver", "防篡改水印", "图片懒加载", "视口交叉"],
    traps: ["在强行插回 DOM 时可能会再次触发 MutationObserver 导致死循环，注意过滤自身修改行为"],
    relatedIds: []
  },
  {
    id: "interview_js_024",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "Web Workers 浏览器多线程与大计算性能",
    difficulty: 4,
    frequency: 4,
    question: "什么是 Web Workers？主线程与 Worker 之间 postMessage 传输大对象的性能开销该如何优化？",
    answer: {
      short: "Web Workers 允许在浏览器后台独立线程中执行耗时大计算，不阻塞主线程 GUI 渲染；默认通过克隆机制传输数据，大体积数据传输存在显著的对象序列化延迟；优化手段是使用 Transferable Objects 直接转移内存控制权，实现零拷贝数据传输。",
      thinkingProcess: "1. 概念：主线程 GUI 与 JS 互斥。Worker 开辟真后台多线程。\n2. 优化：结构克隆（Structured Clone）拷贝 100MB 数组会消耗 10ms 导致卡顿。\n3. 零拷贝：利用 postMessage(data, [data.buffer]) 转移所有权，内存空间直接划归 Worker，主线程只读变 0 字节。",
      deepDive: "可转移对象目前支持 ArrayBuffer, MessagePort, ReadableStream, ImageBitmap 等二进制和图像结构，对于 Canvas 动画可用 OffscreenCanvas 转移到 Worker 线程渲染，使主线程不掉一帧。",
      structured: [
        "Web Worker：开启浏览器副线程执行大运算，不干扰 UI 渲染帧",
        "通信管道：采用 postMessage 通信，遵循 Structured Clone 结构克隆算法",
        "零拷贝转移：ArrayBuffer 等数据通过转移所有权在微秒内发完，但数据源被清空",
        "共享内存：利用 Atomics 原子操作，实现多线程多 CPU 共享读写同一片物理内存（防竞态）"
      ]
    },
    keyPoints: ["Web Workers", "postMessage 拷贝", "Transferable Objects", "SharedArrayBuffer", "Atomics 原子操作", "零拷贝"],
    traps: ["SharedArrayBuffer 必须配置特定的服务端跨域隔离标头（COOP/COEP）才可开启"],
    relatedIds: []
  },
  {
    id: "interview_js_025",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "浏览器 Event Loop 与 Node.js Event Loop 差异对比",
    difficulty: 4,
    frequency: 4,
    question: "请对比浏览器和 Node.js 的事件循环机制。process.nextTick 与 setImmediate 的时序有什么不同？",
    answer: {
      short: "浏览器事件循环围绕宏任务队列和微任务队列，每次宏任务后清空微任务；Node.js 事件循环基于 libuv 的六个阶段循环执行（timers, pending, idle, poll, check, close）；process.nextTick 是在当前调用栈清空后立刻触发的微任务，甚至优先于 Promise；setImmediate 是在 check 阶段执行的宏任务。",
      thinkingProcess: "1. 机制：libuv 阶段性执行模式。\n2. nextTick：插队特性，不属于微任务队列但拥有更高触发时序。\n3. setImmediate: 专门放在 check 阶段，优于 setTimeout 0 (在 timers 阶段) 解决 I/O 读写后的任务分发。",
      deepDive: "Node.js 11 之后对微任务的刷出时序已向浏览器看齐，即每个 timers 或 check 内部的回调执行完后，会立刻去扫描并清空当前产生的 Promise/nextTick 微任务队列，保障了前端全栈代码时序表现的统一性。",
      structured: [
        "微任务特权：process.nextTick 拥有最高优先权，会插在 Promise.then 之前执行",
        "libuv 六阶段：timers (计时) -> poll (轮询I/O) -> check (setImmediate，check 阶段专属)",
        "对齐变化：Node 11 之后，Node 每次执行完一个 macrotask 就立刻清空 microtasks",
        "setImmediate：专门用于在 poll 阶段完成 I/O 动作后，立即在下一个 check 阶段执行的回调"
      ]
    },
    keyPoints: ["Node 事件循环", "libuv", "process.nextTick", "setImmediate", "I/O 轮询"],
    traps: ["千万不要在 process.nextTick 里面写同步死循环，会导致事件循环被卡死挂起"],
    relatedIds: []
  },
  {
    id: "interview_js_026",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 中 type 与 interface 的区别",
    difficulty: 2,
    frequency: 4,
    question: "在 TypeScript 中，类型别名（type）和接口（interface）有什么核心区别？在项目架构中该如何进行最佳选型？",
    answer: {
      short: "interface 用于定义对象和类结构，支持继承（extends）以及声明自动合并；type 用于声明任何类型别名（支持联合、交叉、元组等），不支持自动合并；建议定义 API 数据结构和组件 Props 时用 interface，在组合复杂工具、联合类型时用 type。",
      thinkingProcess: "1. 自动合并：接口重名会自动 merge，有利于第三方插件对全局 window/DOM 接口扩展字段。\n2. type：联合类型 `type X = A | B`，interface 无法表达。\n3. 编译效率：接口带有原型分析缓存，大项目中使用 interface 的编译推导速度优于 type。",
      deepDive: "interface 的声明合并（Declaration Merging）允许在同一个命名空间声明多次，TS 会自动将其字段汇聚。这使其非常适合用来撰写库（Library）的生命文件（.d.ts）。而 type 是强约束的别名绑定，重名直接报语法冲突错。",
      structured: [
        "Declaration Merging（声明合并）：多个同名 interface 自动融合成一个，type 重名会报错",
        "扩展性：interface 使用 `extends` 扩展，type 使用 `&`（交叉类型）进行类型拼接组合",
        "表达范畴：interface 仅能描述对象/函数结构；type 能表达联合类型、元组、基础类型别名等",
        "性能：TS 编译器对 interface 做了内部缓存优化，编译速度优于 type"
      ]
    },
    keyPoints: ["interface", "type 别名", "声明合并", "交叉类型", "编译性能"],
    traps: ["写 Props 时如果要实现多分支类型融合，如 `Props = BaseProps | SpecialProps`，必须选用 type"],
    relatedIds: []
  },
  {
    id: "interview_js_027",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 泛型约束（Generic Constraints）",
    difficulty: 2,
    frequency: 4,
    question: "什么是 TypeScript 中的泛型？如何使用 extends 关键字实现泛型约束？请举出一个结合 keyof 的典型应用场景。",
    answer: {
      short: "泛型是实现类型参数化以提高复用性的技术；extends 用于规定传入的泛型必须符合某种特定的数据接口或类型边界；典型应用是用 `T extends object` 和 `K extends keyof T` 限制获取对象属性时的键名安全性。",
      thinkingProcess: "1. 泛型：把类型参数化传入。\n2. 约束：用 extends 规定泛型必须具有某些属性，如 `.length`。\n3. keyof 约束：`K extends keyof T` 确保 K 一定是 T 的一个属性键名联合子项，防止读取非法键值。",
      deepDive: "泛型约束加上 keyof，可以保证像 `getProperty(obj, key)` 这种高动态函数，在编译期被 TS 牢牢卡死拼写。如果传入了 `obj` 身上不存在的 `key`，当场抛出编译错，这彻底消灭了拼写 Bug。",
      structured: [
        "泛型：将类型判定延时至代码运行时/调用时进行，提供完美的静态类型推演和多组件复用",
        "泛型约束（extends）：为泛型参数设立边界类型约束，确保内部安全消费",
        "K extends keyof T：联合 keyof 动态抽取对象的所有属性键名联合，强令参数必须属于对象的可访问键名之一",
        "返回值推演：TS 自动捕获传入参数的实体字面量类型，输出值具备完美的智能提示"
      ]
    },
    keyPoints: ["泛型 Generics", "泛型约束", "keyof 提取", "类型推导", "静态拦截"],
    traps: ["泛型参数不要滥用 `any` 约束，会导致类型链条断档退回纯 JS 状态"],
    relatedIds: []
  },
  {
    id: "interview_js_028_ts",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 常用工具类型底层源码解构",
    difficulty: 2,
    frequency: 4,
    question: "请写出 TypeScript 内置工具类型 Partial, Pick, Omit, Record 的底层源码定义，并解释其底层实现原理。",
    answer: {
      short: "Partial 利用 in keyof 将全属性添加 ? 变为可选；Pick 循环指定属性键名构造新类型；Omit 利用 Exclude 排除指定键名后再 Pick 构造；Record 通过 [P in K]: T 构造由 K 类型联合键映射到 T 的键值对对象类型。",
      thinkingProcess: "1. 映射类型：`[P in K]` 实现键名遍历。\n2. Partial: `{ [P in keyof T]?: T[P] }`。\n3. Omit: 通过 `Exclude` 从 `keyof T` 中去除 `K`，再对剩下的属性键执行 `Pick` 重新聚合为新接口。",
      deepDive: "TS 源码中的工具类型是类型元编程的积木。比如 `keyof T` 抓取 T 的所有键组成联合类型，`in` 在联合类型中执行遍历。`?` 符号在编译期代表可选标记注入。",
      structured: [
        "Partial<T>：`{ [P in keyof T]?: T[P] }`，遍历 T 的键名并在前面挂载可选标记 `?`",
        "Pick<T, K>：`{ [P in K]: T[P] }`，K 约束为 keyof T 的子集，仅提取 T 中属于 K 的映射字段",
        "Record<K, T>：`{ [P in K]: T }`，动态生成一个以 K 的联合子项为键名，以 T 为属性值类型的键值对象",
        "Omit<T, K>：利用 `Exclude` 排除键名后包装，是 Pick 和 Exclude 两个元工具的终极复合"
      ]
    },
    keyPoints: ["Partial 源码", "Pick 源码", "Omit 源码", "Record 源码", "映射类型", "Exclude"],
    traps: ["Omit 中的 K 参数使用的是 K extends keyof any，所以传入 T 中没有的 key 也不会报错，写错字会有隐患"],
    relatedIds: []
  },
  {
    id: "interview_js_029",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 条件类型与 Exclude 剔除实现",
    difficulty: 3,
    frequency: 4,
    question: "什么是 TypeScript 中的条件类型？内置工具类型 Exclude<T, U> 是如何实现的？什么是条件类型的分布式特性？",
    answer: {
      short: "条件类型形如 `T extends U ? X : Y`，是类型层面的三元运算符；Exclude<T, U> 的源码是 `type Exclude<T, U> = T extends U ? never : T`；分布式特性是指当 T 是联合类型且作为裸类型参数传入条件类型时，TS 会自动将其打散分别进行条件比对，并把最终结果联合返回。",
      thinkingProcess: "1. 机制：`T extends U ? X : Y`。\n2. Exclude: 排除相容项。当 T 传入联合类型，会执行分布式拆分，排除 U 包含的类型后，把剩下的与 never 联合。由于 never 被自动吞并，实现剔除。\n3. 关闭分发：用元组包裹 `[T] extends [U]` 可关闭此项分发比对行为。",
      deepDive: "分布式分发特性只对裸泛型生效。如果你的类型被数组、元组或 Promise 包裹（如 `Promise<T> extends Promise<U>`），分发特性就不会被触发，而是进行整体比对。",
      structured: [
        "条件类型：`T extends U ? X : Y`，类型级别的静态分支语句",
        "Exclude 原理：`T extends U ? never : T`。符合条件则强转 never 以此被联合类型过滤吞并",
        "分布式分发：当裸泛型参数接收到联合类型时，自动触发 MAP 拆分转换",
        "非分布式包装：使用元组 `[T] extends [U]` 格式，取消分发比对"
      ]
    },
    keyPoints: ["条件类型", "Exclude 实现", "分布式分发", "裸类型参数", "never 擦除"],
    traps: ["在写自定义工具类型时，如果不注意裸类型的分发行为，复杂的联合类型传入可能会产生出乎意料的碎片联合结果"],
    relatedIds: []
  },
  {
    id: "interview_js_030",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript any 与 unknown, never 根本区别",
    difficulty: 2,
    frequency: 5,
    question: "请对比 TypeScript 中 any, unknown 和 never 三种类型的根本区别及各自的应用场景。",
    answer: {
      short: "any 是逃生舱，彻底关闭类型安全校验，可进行任意读写；unknown 是类型安全的 any，可以接收任何值，但必须经过类型收窄或断言后才能执行其属性读取；never 代表不可能存在的空类型，常用于全面性检查（Exhaustiveness Check）以防漏写 switch case 分支。",
      thinkingProcess: "1. 安全程度：any（最危险） -> unknown（最安全） -> never（编译期强制分支审查）。\n2. unknown: Top Type。接收任意赋值，但不能读写。必须 typeof/instanceof 判断后收窄才行。\n3. never: switch 默认分支绑定。如果联合类型拓展了但 switch case 没补，`never = shape` 会当场报错警告。",
      deepDive: "通过将 never 赋给 default 里的局部变量，当以后有新类加入到联合类型（比如新增 Triangle）时，由于 triangle 分支未处理，会落入 default，Triangle 无法赋值给 never，编译器当场拦截发出警告，形成了防御性编程机制。",
      structured: [
        "any：逃避 TS 检查，失去一切类型推导和代码重构安全保护",
        "unknown：只读型万能类型。可存入，但任何消费必须先执行 `typeof / as` 断言收窄",
        "never：Bottom Type，表示零可能性的死路（如抛出异常的函数返回）",
        "防御性全面校验：将 never 赋给 switch default 变量，当联合分支拓展时强令编译拦截"
      ]
    },
    keyPoints: ["any 逃生舱", "unknown 安全收窄", "never 全面校验", "Top Type", "Bottom Type", "静态收窄"],
    traps: ["不要滥用 any，应尽量用 unknown 配合类型保护进行安全读取"],
    relatedIds: []
  },
  {
    id: "interview_js_031",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 逆变（Contravariance）与协变（Covariance）",
    difficulty: 5,
    frequency: 3,
    question: "在 TypeScript 类型系统中，什么是协变（Covariance）和逆变（Contravariance）？为什么函数参数在开启 strictFunctionTypes 时会表现为逆变？",
    answer: {
      short: "协变指子类型关系在包装后保持相同方向（子类可赋值给父类）；逆变指子类型关系在包装后方向发生逆转（父类函数可赋值给子类函数）；函数参数是逆变的，因为当接收子类参数时，调用该参数的函数可能会执行子类独有方法，如果传入的实际函数只支持父类，就会导致运行时方法不存在而崩溃。",
      thinkingProcess: "1. 协变：返回值方向一致。Dog => Animal，那么 () => Dog 可赋给 () => Animal。\n2. 逆变：参数方向倒转。(Animal) => void 可赋给 (Dog) => void。消费端调用 DogFn 时，实际执行 AnimalFn。AnimalFn 只会去读 animal 的属性，对传入的 Dog 绝对安全，不会发生越界操作。\n3. strictFunctionTypes: 开启此选项，函数参数校验转为严格逆变，否则默认双向协变，容易引发运行时错误。",
      deepDive: "函数参数作为“写”数据入参，其类型要求是越宽容越好（父类宽容）；函数返回值作为“读”数据出参，其类型要求是越精细越好（子类精细）。这就是类型安全设计的哲学本质。",
      structured: [
        "协变 (Covariance)：A 是 B 的子类，G<A> 也是 G<B> 的子类。方向顺应（返回值协变）",
        "逆变 (Contravariance)：A 是 B 的子类，G<B> 反转变成 G<A> 的子类。方向颠倒（参数逆变）",
        "strictFunctionTypes：TS 的高级严格函数类型校验，强制规范函数参数逆变，保障传参调用安全",
        "安全本质：写入时范围应更大（父类宽容），读取时范围应更小（子类精细）"
      ]
    },
    keyPoints: ["协变", "逆变", "strictFunctionTypes", "类型相容性", "子类型系统"],
    traps: ["在默认非严格模式下，TS 允许函数参数双向协变，隐藏了运行时属性未命中的崩溃风险"],
    relatedIds: []
  },
  {
    id: "interview_js_032_gc_old",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "V8 内存管理：堆空间细分与对象晋升",
    difficulty: 4,
    frequency: 3,
    question: "V8 引擎的堆内存中，除了新生代和老生代，还有哪些堆空间分区？对象在什么条件下会被直接分配到老生代或晋升？",
    answer: {
      short: "V8 堆区还包括大对象空间、代码空间、以及 Map/Cell 空间等；对象直接分配或晋升条件为：对象体积超大直接进大对象区；或在新生代复制中 To 空间占用超 25%；或经历过一次 From/To 复制且存活两轮的活跃对象。",
      thinkingProcess: "1. 堆细分：New/Old Space 外，大对象空间 (Large Object Space) 存放超大二进制。这里的数据免去 GC 移动开销。\n2. 代码空间：存 JIT 编译的原生汇编指令。\n3. 晋升指标：存活时间、To 空间阈值（25% 为了确保 From/To 对调后，To 空间有足够空余）。",
      deepDive: "Map Space 专门存放 V8 的隐藏类（Hidden Classes）。因为它们大小恒定且频繁读取，做成独立堆区可以极致提升 JIT 编译器的寻址定位速度。",
      structured: [
        "大对象空间：跳过复制算法，只通过分配页管理，零移动成本优化 GC 帧率",
        "代码空间：放置编译机器码，出于安全考量（防缓冲区溢出执行），该区与数据区有着物理权限隔离",
        "晋升两关卡：1. 在 Scavenge 复制时，对象已在新生代呆过一轮；2. To 空间当前已消耗超过 25%"
      ]
    },
    keyPoints: ["V8 堆分区", "大对象空间", "代码空间", "Map 空间", "对象晋升指标"],
    traps: ["老生代中强引用的残余大对象是引发 OOM (内存溢出) 的最主要原因"],
    relatedIds: []
  },
  {
    id: "interview_js_033",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "扁平数据转树形结构算法手写",
    difficulty: 2,
    frequency: 4,
    question: "在开发组织架构树、分类菜单等业务中，如何将后端返回的扁平数组（包含 id 和 parentId）转化为嵌套的树形结构？请手写一个 O(n) 复杂度的 Map 映射算法。",
    answer: {
      short: "通过一次遍历构建哈希字典映射（Map），将每个节点的 id 映射为对象引用；第二次遍历根据 parentId 寻址，将当前节点 push 到其父节点的 children 数组中，parentId 为空者作为根节点，实现 O(n) 的高效转换。",
      thinkingProcess: "1. 双层 for 循环复杂度是 O(n^2)，在大数据量时会卡顿。\n2. 哈希映射：利用 JavaScript 对象引用传递原理（Pass by Reference）。\n3. 两次循环：第一轮建 Map，第二轮关联 children，最后返回根节点数组即可。",
      deepDive: "由于是引用拷贝，在 Map 里对任何子节点 children 数组 push 进新元素，最终 roots 树形结构里对应的节点都会自动更新挂载好，巧妙利用了 JS 的堆内存管理。",
      structured: [
        "性能优势：利用 Javascript 对象作为物理地址引用传递的本质，通过指针关联将复杂度降至 O(n) 线性时间",
        "第一步：预备 Map 字典，以 item.id 为 Key 映射对应的组件对象，并确保每项初始化 children 数组",
        "第二步：根据 parentId 查 Map 定位父亲节点，直接 push 进其 children，顶层节点推入 roots 数组返回"
      ]
    },
    keyPoints: ["扁平转树", "哈希映射", "引用传递", "O(n) 算法", "树状菜单"],
    traps: ["在第一步中不能直接使用原数组的对象进行操作，应该执行 `{ ...item }` 浅拷贝，防止直接修改原数组内部属性"],
    relatedIds: []
  },
  {
    id: "interview_js_034",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "发布订阅模式（Event Bus）手写实现",
    difficulty: 3,
    frequency: 4,
    question: "请手写实现一个包含 on, emit, off 和 once 功能的 EventEmitter 类，并确保 once 订阅触发后能干净注销事件。",
    answer: {
      short: "通过在实例上维护一个 events 映射对象，Key 是事件名，Value 是回调函数数组；on 往数组 push，emit 循环执行；off 过滤移除；once 注册一个包装函数，在其中同步调用原回调后立即执行 off 移除自身，实现单次拦截。",
      thinkingProcess: "1. 核心：events = { [event]: [] }。\n2. once: 创建 wrapper，在 wrapper 里调用 `cb` 和 `this.off(event, wrapper)`。\n3. off 匹配：wrapper.listener = cb，在 off 过滤时判定 `fn !== cb && fn.listener !== cb`，保障外部可手动注销一次性事件。",
      deepDive: "在 emit 派发时，对执行队列执行 `[...cbs]` 浅拷贝拷贝备份。这是防范执行期间有 once 动态突变修改原数组，导致 forEach 索引错乱遗漏其他监听的经典防滑轨设计。",
      structured: [
        "数据底座：`this.events = { [eventName]: Array<Function> }` 存储监听者数组",
        "once 闭包解法：利用 wrapper 高阶包装，先执行 emit，后同步注销自身",
        "off 逃生舱：在过滤比对中核实 `fn.listener === cb`，确保 once 包装的函数也能被外部 off 方法强行解绑",
        "执行防护：在 emit 派发时，对执行队列执行 `[...cbs]` 浅拷贝备份，防范执行期间突变修改"
      ]
    },
    keyPoints: ["EventEmitter", "发布订阅模式", "once 闭包包装", "内存防泄露", "解耦通信"],
    traps: ["在 emit 时若不对 cbs 进行浅拷贝，once 回调执行时的 off 动作会动态裁剪 cbs 长度，导致后续监听回调直接被漏执行"],
    relatedIds: []
  },
  {
    id: "interview_js_035",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "JS 浮点数精度 0.1 + 0.2 !== 0.3 原理解析",
    difficulty: 2,
    frequency: 4,
    question: "为什么在 JavaScript 中 0.1 + 0.2 === 0.3 返回 false？其底层 IEEE 754 双精度浮点数存储机制是什么？在项目里该如何优雅地进行高精度小数计算？",
    answer: {
      short: "因为 JS 使用 IEEE 754 双精度浮点数存储数字，0.1 和 0.2 在二进制转换中是无限循环小数，转换时在 53 位尾数处发生精度截断（舍入机制），两数相加后的结果是 0.30000000000000004；项目里可以使用 Number.EPSILON 校验偏差，或使用 decimal.js/bignumber.js 库，或乘 10 转换为整数计算后再除回。",
      thinkingProcess: "1. 机制：64位浮点规格化表示。0.1 转二进制无限循环，第 53 位截断四舍五入，两数相加累积误差。\n2. EPSILON: `Math.abs((0.1+0.2)-0.3) < Number.EPSILON`。\n3. 计算库：decimal.js / big.js 逐位模拟，防精度失准。",
      deepDive: "金融系统绝对严禁使用 Number 浮点数做金额累加，数据库里应该统一用‘分’（即整型）保存。前端做展示时除以 100 转换。涉及乘除利率计算，引入 big.js 进行字符串式大数防错运算。",
      structured: [
        "进制局限：十进制的 0.1 在二进制下无法被精确整除表达，形成无限循环，被 53 位尾数强行掐断舍入",
        "Math.abs 校验：利用 Number.EPSILON（约 2.22e-16）作为误差阀门进行判定比对",
        "金融方案（整数法）：金额以分存储，前端计算用整数，展示时再除以 100",
        "金融方案（任意精度库）：使用 Big.js 或是 Decimal.js，基于 String 逐位模拟计算"
      ]
    },
    keyPoints: ["IEEE 754", "双精度浮点数", "Number.EPSILON", "精度截断", "任意精度计算"],
    traps: ["乘 10 在某些特定小数乘法（如 35.41 * 100）下依然会有浮点误差，做财务结算请全量引入 big.js"],
    relatedIds: []
  },
  {
    id: "interview_js_036_reflect",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "Reflect.ownKeys 与 Object.keys 属性遍历对比",
    difficulty: 2,
    frequency: 4,
    question: "请对比 Object.keys, Object.getOwnPropertyNames, Reflect.ownKeys 在遍历对象属性时，对于 Symbol 属性、不可枚举属性以及原型链属性的读取差异。",
    answer: {
      short: "Object.keys 仅返回自身的可枚举 String 键名；Object.getOwnPropertyNames 返回自身所有 String 键名（包含不可枚举属性）；Reflect.ownKeys 返回自身所有 String 和 Symbol 键名（无论是否可枚举）；三者均不读取原型链上的任何属性。",
      thinkingProcess: "1. 区分：enumerable, symbol, prototype chain。\n2. Reflect.ownKeys: 最完备的自身键抓取（String + Symbol，无论是否 enumerable）。\n3. for...in: 唯一深度遍历原型链可枚举 String 属性的选择器。",
      deepDive: "由于 Reflect.ownKeys 抓取最全，在写高鲁棒性的深拷贝（Deep Clone）工具类时，应作为属性字典获取的首选，以防漏掉 Symbol 属性或通过 defineProperty 设为非枚举的隐藏核心属性。",
      structured: [
        "Object.keys(obj)：仅获取当前对象自身的可枚举 String 属性名列表",
        "Object.getOwnPropertyNames(obj)：获取自身所有 String 键（不可枚举的属性也会被捕获）",
        "Reflect.ownKeys(obj)：捕获对象自身的所有键（含所有可枚举、不可枚举的 String 与 Symbol）",
        "原型防护：三者严格限制在 own 范围内，不向原型链扩散；for...in 是唯一会向原型链扩散的"
      ]
    },
    keyPoints: ["Reflect.ownKeys", "Object.keys", "Symbol 遍历", "不可枚举属性", "原型链搜寻"],
    traps: ["Reflect.ownKeys 会读取不可枚举属性，若深拷贝时不加 PropertyDescriptor 保护会覆盖目标不可写属性规则"],
    relatedIds: []
  },
  {
    id: "interview_js_037",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "JS 引擎 JIT 优化与 V8 优化隐藏类（Hidden Classes）",
    difficulty: 5,
    frequency: 4,
    question: "V8 引擎是如何通过“隐藏类”和“内联缓存”来优化 JavaScript 动态类型属性访问速度的？我们在编写 JS 时该如何契合这一机制？",
    answer: {
      short: "V8 为动态类型的 JS 对象分配一个隐藏类（Map），记录属性相对于对象地址的内存偏移量，避免了传统的哈希表查找；内联缓存（IC）缓存了之前访问该隐藏类属性的内存偏移位置以实现 O(1) 访问；编写代码时应始终以相同的顺序初始化对象属性，并避免动态 delete 属性。",
      thinkingProcess: "1. V8 Map / Shape 机制：把 JS 动态对象模拟成 C++ 静态结构。\n2. 偏移查找：属性增加路径固定（M0 -> M1 -> M2）。\n3. 优化破坏：如果属性乱序声明，或者高频 delete 属性，会迫使对象降级为 Dictionary 模式，寻址开销暴涨。",
      deepDive: "内联缓存（IC）会将最近访问过该属性的隐藏类信息和指令集直接硬编码。如果在循环里频繁使用 `delete obj.x`，对象降级为慢属性（Slow Properties，即哈希表），极度拖累 JIT 编译器的热点分析效率。",
      structured: [
        "隐藏类：V8 内部为 JS 对象构建的静态类型 Shape 映射，锁定各属性在堆中的内存偏移地址",
        "内联缓存：缓存高频调用的隐藏类偏移定位，使属性读取直接缩短为单次物理指针寻址",
        "优化习惯一：构造函数内一次性写全所有属性，禁止在后续生命周期随意动态挂载新属性",
        "优化习惯二：实例化多个同类型对象时，属性的书写和声明初始化顺序必须完全保持一致",
        "优化习惯三：使用 null/undefined 置空属性，绝对不要使用 delete"
      ]
    },
    keyPoints: ["V8 引擎", "隐藏类 Shapes", "内联缓存 IC", "delete 性能危害", "哈希字典模式"],
    traps: ["在高频循环中 delete 对象的 key 会导致 JIT 编译器频繁退化热点优化，造成 CPU 剧烈开销掉帧"],
    relatedIds: []
  },
  {
    id: "interview_js_038",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "大文件切片上传、断点续传与 MD5 秒传系统设计",
    difficulty: 4,
    frequency: 5,
    question: "如何设计并实现一个安全、高性能的大文件切片上传与断点续传系统？",
    answer: {
      short: "前端通过 Blob.prototype.slice 将大文件切割为固定高的二进制切片（Chunk）；利用 Web Worker 异步调用 SparkMD5 计算整个文件的唯一 MD5 哈希；上传前请求后端校验哈希实现秒传（若已存在则直接返回成功），或返回已上传的切片索引列表；前端使用并发控制队列（限制并发为 3-6）上传缺失的切片，全部完成后发送 merge 请求，后端合并切片并校验完整性。",
      thinkingProcess: "1. 切片：`file.slice()`。\n2. 哈希：Web Worker 增量 SparkMD5，不卡主线程。\n3. 秒传与断点：通过 MD5 向后端校验已上传的 chunk index 集合。并发池控制同时发请求数（4个），出错可重试 3 次。\n4. 合并：分片都传完后发送 merge，后端 Node 用 stream 读取切片拼接校验完整性。",
      deepDive: "Web Worker 增量计算 SparkMD5 时，使用 FileReader 的 readAsArrayBuffer 逐段 append。切片上传时需要附加分片索引、总分片数和文件 MD5，以便后端做精准切片块标记和断点复用。",
      structured: [
        "文件切片：利用 HTML5 File API，调用 `file.slice(start, end)` 返回二进制 Blob 分片，通常定为 5MB 一个",
        "增量哈希：使用 Web Worker 在后台辅助线程中分块追加计算 SparkMD5，规避大文件一次性载入内存撑爆浏览器",
        "并发控制：设置最大并发限制（如 maxLimit = 4），当其中一个分片请求 resolve 成功后，递归拉取下一个分片上传",
        "断点校验与秒传：上传前发起 POST /check 携带文件 MD5，检测已合并则秒传成功；残缺则返回已传切片索引列表，只传缺失分片",
        "物理合并：全部分片发完后，前端发 /merge 触发后端用 Node.js fs.createWriteStream 流式合并切片并校验 MD5 安全性"
      ]
    },
    keyPoints: ["文件切片 slice", "Web Worker MD5", "SparkMD5", "断点续传", "并发队列", "秒传系统"],
    traps: ["在后端合并切片时，必须要校验合并后文件的总大小和最终的 MD5 是否与前端上传的一致，防范切片损坏"],
    relatedIds: []
  },
  {
    id: "interview_js_039",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "手写实现原生 new 运算符",
    difficulty: 2,
    frequency: 4,
    question: "请详述 new 运算符执行时，在 JavaScript 引擎内部发生的 4 个步骤，并手写一个 myNew 函数模拟实现这一过程。",
    answer: {
      short: "new 的步骤为：1. 创建一个全新的空对象；2. 将该对象的原型指向构造函数的 prototype；3. 绑定 this 并执行构造函数以初始化属性；4. 若构造函数返回了一个对象，则返回该对象，否则默认返回步骤一创建的空对象。",
      thinkingProcess: "1. 步骤：空对象 -> __proto__ 指向 prototype -> bind this 执行 -> 返回值判定。\n2. Object.create: `const obj = Object.create(Constructor.prototype)` 完成前二步。\n3. 返回值判定：typeof 判断 result 是否是 object 或 function。如果是则采用，否则返回 obj。",
      deepDive: "手写 myNew 代码：\n```javascript\nfunction myNew(Constructor, ...args) {\n  const obj = Object.create(Constructor.prototype);\n  const result = Constructor.apply(obj, args);\n  const isObject = typeof result === 'object' && result !== null;\n  const isFunction = typeof result === 'function';\n  return (isObject || isFunction) ? result : obj;\n}\n```",
      structured: [
        "新建对象：在内存堆中开辟新对象存储空间",
        "原型链接：利用 `Object.create(proto)` 将实例的隐式原型链接到构造函数的显式原型上，完成继承",
        "属性初始化：通过 `apply` 绑定 `this` 执行构造函数体，完成各属性和方法的初始化赋值挂载",
        "返回值决断：对构造函数执行结果进行 typeof 判断，确保复杂类型覆盖默认新对象，而基础类型返回 obj"
      ]
    },
    keyPoints: ["new 运算符", "Object.create", "原型指向", "构造函数返回值", "this 绑定"],
    traps: ["在手写 new 的返回值判断时，不要漏掉 `result !== null` 的判定，因为 `typeof null` 会错误返回 `'object'`"],
    relatedIds: ["interview_005", "interview_028"]
  },
  {
    id: "interview_js_040",
    mode: "study",
    domain: 'interview',
    type: "follow_up",
    track: "frontend",
    topic: "javascript",
    title: "高性能时钟：performance.now 与 Date.now 区别",
    difficulty: 2,
    frequency: 4,
    question: "在 JavaScript 中，performance.now() 与 Date.now() 有什么本质区别？为什么在测量代码执行耗时和高频动画计算时应该使用 performance.now()？",
    answer: {
      short: "Date.now() 返回 Unix 时间戳，精度仅到毫秒级，且受系统时钟同步和用户手动修改系统时间影响，是不稳定的系统时间；performance.now() 返回以页面加载为起点的时间偏移量，精度高达微秒级，且是只增不减的单调递增时钟，不受系统时间变动干扰，适合精准耗时测量和动画计算。",
      thinkingProcess: "1. Date.now: 依赖墙上时钟 (Wall Clock)，用户改本地时间或者 NTP 时间同步会引起差值突变，甚至为负数。\n2. performance.now: 单调递增时钟 (Monotonic Clock)。以 `navigationStart` 为 0 点，微秒级精度。\n3. 安全防御：Spectre 幽灵漏洞利用此精度发起缓存侧信道攻击，现代浏览器对此注入了微秒级的模糊干扰，但精度仍远超 Date。",
      deepDive: "高精度耗时测试：`const t0 = performance.now(); heavy(); const t1 = performance.now(); console.log(t1 - t0)`，它返回的是带浮点的高精度毫秒数值（可精准至 5 微秒级别）。",
      structured: [
        "精度优势：Date.now() 返回毫秒精度整数值；performance.now() 提供小数毫秒值，精度达到微秒级别",
        "时间基准：Date.now() 基于 1970 纪元 Unix 时间；performance.now() 基于页面加载时间，具有强内聚性",
        "时钟类型：Date.now() 是非单调时钟；performance.now() 是强单调时钟，只会稳步递增",
        "场景建议：性能 Profiler、手写 RequestAnimationFrame 物理缓动动画计算，一律使用 performance.now()"
      ]
    },
    keyPoints: ["Date.now()", "performance.now()", "单调时钟", "微秒精度", "性能测量"],
    traps: ["performance.now() 只是一个相对当前网页生命周期的偏移量，不能像 Date.now() 那样直接拿来当作真实物理日期时间发送给后端进行跨天日志标记"],
    relatedIds: ["interview_017"]
  },
  {
    id: "interview_js_041",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "TypeScript 装饰器（Decorators）原理与 ES 新版规范",
    difficulty: 4,
    frequency: 3,
    question: "TypeScript 中的装饰器底层实现原理是什么？旧版实验性装饰器（experimentalDecorators）与 ES 2023 官方标准装饰器在语法和底层设计上有何核心差异？",
    answer: {
      short: "装饰器是高阶函数，利用 Object.defineProperty 或类包裹在类声明、方法、属性上执行包装逻辑；旧版装饰器在类定义阶段运行时动态修改属性描述符，参数复杂且类型支持差；ES 官方标准装饰器采用全新的规范设计（接收上下文参数），支持编译期静态优化，且原生支持类方法私有属性的拦截。",
      thinkingProcess: "1. 机制：高阶函数包装设计模式（Decorator Pattern）。\n2. 旧版 TS 装饰器：依赖 `__decorate` 助手函数，通过运行时修改 prototype 的属性描述符（Descriptor）。\n3. 新版 ES 2023 装饰器：去除了运行时硬编码修改 prototype，采用更加清爽的 `context` 对象设计，能完美支持类型推导且更符合现代编译工具的静态解析要求。",
      deepDive: "ES 官方装饰器在方法上的实现签名：`function dec(value, context) { ... }`。context 包含 name, kind, private, static 等描述。这种解耦可以使打包工具在构建期直接将未被使用的装饰器静态 Tree-shake 掉，运行时效率更高。",
      structured: [
        "装饰器本质：高阶函数，接收目标对象并返回一个新的类或修改后的属性描述符，为面向切面编程 (AOP) 铺路",
        "旧版 TS 装饰器：运行时利用 `Reflect.decorate` 反射修改类原型，对 Tree-shaking 极其不友好且语法复杂",
        "ES 标准装饰器：基于 context 上下文的静态设计，支持编译期静态分析优化",
        "安全保障：新版装饰器原生支持对类内部私有字段 (#field) 进行拦截与装饰，而旧版完全无法涉足"
      ]
    },
    keyPoints: ["TypeScript 装饰器", "AOP 面向切面", "experimentalDecorators", "ES 2023 装饰器", "属性描述符"],
    traps: ["混合使用旧版和新标准装饰器会导致项目在打包编译（Vite/TSC）时爆出严重的类型推导冲突错，应严格区分项目配置中的 experimental 选项"],
    relatedIds: []
  },
  {
    id: "interview_js_042",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "执行上下文（Execution Context）与词法环境",
    difficulty: 3,
    frequency: 4,
    question: "请详细阐述 JavaScript 引擎在执行代码时，执行上下文（Execution Context）与词法环境（Lexical Environment）的创建和运行原理。什么是变量提升与暂时性死区的底层决定要素？",
    answer: {
      short: "引擎执行时会创建执行上下文并压入执行栈中，上下文包含词法环境和变量环境；词法环境负责绑定 let/const 及外部环境引用（解决作用域链寻址），变量环境负责绑定 var 变量；在创建阶段，var 变量被提升并初始化为 undefined，而 let/const 仅登记标识符不初始化，从而形成暂时性死区（TDZ）。",
      thinkingProcess: "1. 原理深究：执行上下文栈（ECS） -> 当前执行上下文（EC） -> 词法环境（LE）与变量环境（VE）。\n2. 变量绑定：词法环境包含环境记录器（Environment Record）和外部环境引用（Outer Reference）。Outer Reference 指向父级词法环境，以此构成物理作用域链。\n3. TDZ 底层原理：创建阶段，扫描到 let 时在 LE 的环境记录里登记该 key，但并不给它绑定任何内存地址（未初始化状态）。直到代码运行到 `let a = 1` 那一行（初始化阶段），才真正把地址绑定给它。在登记到初始化之间的区域，访问该变量引擎会抛出 ReferenceError，这就是暂时性死区。",
      deepDive: "理解执行上下文栈的物理模型：\n```text\n【全局执行上下文 (GEC)】 -> 放置全局变量、window、this -> 栈底\n  ↓ 调用 fn()\n【函数执行上下文 (FEC)】 -> 包含自身的词法环境 (LE)、变量环境 (VE)、指向父级 GEC 的 Outer Reference\n```\n当函数执行完毕，该执行上下文会从栈中弹出并销毁，除非其内部的词法环境被某个闭包函数所强引用，此时词法环境会迁移至堆内存中常驻。",
      structured: [
        "上下文创建：分为创建阶段（扫描声明、建立变量绑定、绑定 this）和执行阶段（变量赋值、代码运行）",
        "变量环境 (VE)：专门存放 var 声明和函数声明，创建时直接初始化并分配 undefined，从而产生变量提升",
        "词法环境 (LE)：专门存放 let / const / class 等绑定，登记标识符，但处于未初始化状态直至真正执行赋值，即为暂时性死区",
        "作用域链寻址：通过词法环境的 `outer` 指针递归向上寻址父亲 LE，直到全局词法环境 null 终点"
      ]
    },
    keyPoints: ["执行上下文", "词法环境", "变量环境", "暂时性死区原理", "作用域链 outer"],
    traps: ["变量提升不是物理上移动了代码位置，而是 JavaScript 引擎在“创建阶段”提前将变量扫入内存变量环境并赋予默认值的表现"],
    relatedIds: ["interview_004"]
  },
  {
    id: "interview_js_043",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "数组扁平化（Flat）的五种手写实现",
    difficulty: 2,
    frequency: 4,
    question: "如何实现数组扁平化（例如将 [1, [2, [3, 4]]] 展开为 [1, 2, 3, 4]）？请写出至少 4 种手写实现方式并进行对比。",
    answer: {
      short: "扁平化可以通过：1. 原生 Array.prototype.flat(Infinity)；2. 递归遍历 + concat；3. reduce 结合 concat 递归；4. while 循环配合展开运算符（...）及 some 判断；5. 纯数字数组借助 toString() 或 join() 后 split 映射。",
      thinkingProcess: "1. 经典手写：考察递归处理和数组常用方法熟练度。\n2. while + some: `while(arr.some(Array.isArray)) { arr = [].concat(...arr); }`，非常巧妙且代码极短。\n3. toString hack: `arr.toString().split(',').map(Number)`，只适用于数组元素全部是数字且无空项的边界场景。",
      deepDive: "基于 `reduce` 的经典递归扁平化（支持指定深度 depth）：\n```javascript\nfunction flatten(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, val) => {\n    return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);\n  }, []);\n}\n```\n此方案在工业界最通用，能够精确控制扁平化的嵌套深度，防止爆栈。",
      structured: [
        "原生 flat：`arr.flat(depth)`，现代浏览器原生支持，可传入 Infinity 强制拉平任意维度",
        "while 降维：`while(arr.some(Array.isArray)) arr = [].concat(...arr)`，每次用展开运算符打散最外层包裹的数组",
        "reduce 递归：通过 reduce 逐个累加，遇到 Array 则递归 flatten(val, depth-1) 拼接",
        "toString 快捷法：仅针对数字型数组 `arr.toString().split(',').map(Number)`，不可用于包含对象或复杂类型的混合数组"
      ]
    },
    keyPoints: ["数组扁平化", "reduce 递归", "some 降维", "Array.prototype.flat", "toString 限制"],
    traps: ["使用 toString 快捷拉平如果数组包含空对象 `{}` 或空字符串，`toString` 后会变成 `[object Object]`，无法还原，只适合纯数字或纯字符串数组"],
    relatedIds: []
  },
  {
    id: "interview_js_044",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "严格模式（Strict Mode）的核心差异约束",
    difficulty: 1,
    frequency: 3,
    question: '在 JavaScript 代码头部声明 "use strict" 开启严格模式后，代码在运行和语法约束上会发生哪些核心变化？',
    answer: {
      short: '严格模式强化了安全与语法规范：1. 禁止意外创建全局变量（未声明直接赋值报错）；2. 消除 silent error（静默失败，如修改只读属性会直接抛错）；3. 限制普通函数中的 this 默认绑定为 undefined；4. 禁用 eval、arguments 的局部别名篡改，并废弃 with 语句。',
      thinkingProcess: '1. 规范初心：ECMAScript 5 引入严格模式，为了平滑过渡到安全现代的 JS，堵死历史遗留的静默 Bug。\n2. this 指向突变：非严格模式下普通函数直接执行其 inside this 指向 window；严格模式下指向 undefined，这大大防范了无意篡改 window 属性的恶果。\n3. delete 报错：严格模式下 `delete Object.prototype` 会直接 Throw 异常，而非严格下只会静默失效并返回 false。',
      deepDive: '严格模式下 arguments 的脱钩特征：\n```javascript\nfunction test(a) {\n  "use strict";\n  a = 42;\n  console.log(arguments[0]); // 非严格模式下打印出 42（双向绑定）；严格模式下仍打印出原传入的值（完全解耦脱钩，保持入参历史可读性）\n}\ntest(1);\n```',
      structured: [
        '变量必声明：未声明对象（如 `x = 1`）直接赋值拒绝静默挂载到 window，当场抛出 ReferenceError',
        'this 归空：全局普通函数内的 `this` 不再默认绑定给 window，而是严格归为 `undefined`，防止意外属性污染',
        '拒绝静默失败：修改只读 writable:false 属性、删除不可配置 non-configurable 属性会直接报 TypeError 错误',
        '禁止 arguments 联动：形参的值被修改，其 arguments 镜像数据不跟着联动改变，保持输入历史的真实性'
      ]
    },
    keyPoints: ['严格模式', '"use strict"', 'this 归空', '静默失败抛出', 'arguments 解耦'],
    traps: ['在 ES6 Class 内部以及 ES6 Modules（ESM）模块中，JavaScript 会自动且强行开启严格模式，无需你在头部手动书写 "use strict"'],
    relatedIds: ["interview_004", "interview_005"]
  },
  {
    id: "interview_js_045",
    mode: "study",
    domain: 'interview',
    type: "baguwen",
    track: "frontend",
    topic: "javascript",
    title: "requestAnimationFrame 与 requestIdleCallback 区别",
    difficulty: 3,
    frequency: 4,
    question: "requestAnimationFrame（rAF）与 requestIdleCallback（rIC）有什么根本区别？它们分别在浏览器的什么时机被调度执行？",
    answer: {
      short: "rAF 由系统决定，在浏览器每帧进行 Layout 和 Paint 重绘前同步同步执行，用于渲染流畅的 60fps 动画；rIC 由浏览器空闲程度决定，在每帧完成 Layout/Paint 之后的空余时间（Idle period）异步异步执行，用于执行非紧急的后台大计算大计算以防主线程卡顿。",
      thinkingProcess: "1. 调度目的：动画流畅度优先（rAF） vs 主线程不卡顿优先（rIC）。\n2. 执行时机：\n   - rAF：一帧生命周期开始时 -> 输入事件 -> rAF 回调 -> 物理 Layout -> 物理 Paint。保证动画帧与显示器刷新率完全对齐。\n   - rIC：一帧的最后阶段（如果有富余时间的话）。如果一帧的 Layout + JS 执行已经用了 16.6ms，这一帧内 rIC 就完全不会被执行，推迟到下个有空闲的帧。\n3. 超时机制：rIC 接收 deadline.timeRemaining() 来查看当前剩余空闲毫秒数，若设置了 timeout，超时则会强制插队调度。",
      deepDive: "rIC 接收参数 `deadline` 的典型应用代码：\n```javascript\nrequestIdleCallback((deadline) => {\n  // 只要还有剩余时间（大于 0），或者该任务被配置为了超时必须执行\n  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {\n    performTask(tasks.shift()); // 执行小分片后台任务\n  }\n  if (tasks.length > 0) requestIdleCallback(workLoop); // 剩下的等下一次空闲再算\n}, { timeout: 1000 }); // 强设 1s 超时底线\n```",
      structured: [
        "rAF：帧前排队。在浏览器重绘（Layout / Paint）前触发，专门用以手写 JS 高流畅 CSS3 动画",
        "rIC：帧尾捡漏。在浏览器重绘后、下一帧开始前，如果还有富余时间（<50ms）则切片运行非紧急后台业务",
        "执行频次：rAF 紧跟显示器刷新率（通常 60Hz - 120Hz 稳定执行）；rIC 极不稳定，当页面交互重负荷时可能长期被冷落",
        "React 应用：React Fiber 内部没有使用不稳定的 rIC，而是利用 MessageChannel 宏任务分片模拟了类似 rIC 的调度机制"
      ]
    },
    keyPoints: ["requestAnimationFrame", "requestIdleCallback", "时间切片", "浏览器一帧生命周期", "didTimeout"],
    traps: ["绝对不要在 requestIdleCallback 的回调函数中直接操作和修改 DOM！这会导致原本已经排版绘制好的 DOM 立即失效，浏览器被迫执行昂贵的回流重排，完全摧毁了 rIC 优化流畅度的初衷"],
    relatedIds: ["interview_001"]
  },
  {
    id: "interview_js_046",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "Web Assembly (Wasm) 全景与 JS 通信原理",
    difficulty: 4,
    frequency: 3,
    question: "什么是 WebAssembly (Wasm)？它为什么能大幅超越 JS 的执行速度？JS 与 Wasm 在内存中是如何交互数据的？",
    answer: {
      short: "Wasm 是一种低级的类汇编二进制代码格式，由 C++/Rust 等语言编译而来，由浏览器虚拟机直接以接近原生机器码的速度解析执行；它省去了 JS 运行时的动态解释与 JIT 重编译开销；JS 与 Wasm 通过共享一个线性的 WebAssembly.Memory 物理内存（ArrayBuffer）实现高速数据交互。",
      thinkingProcess: "1. 速度优势：JS 需要经历下载 -> 解析 AST -> 编译字节码 -> JIT 二级优化机器指令这一漫长过程，且动态类型随时会导致 JIT 优化失效。Wasm 已经是编译好的二进制字节码，下载后直接映射为本地机器汇编，静态类型无撤销开销。\n2. 内存交互：Wasm 模块内部使用的是一块扁平的线性内存（Linear Memory）。JS 可以把数据写入这个 ArrayBuffer 的特定偏移量，Wasm 模块内部通过指针直接读取该地址并计算，完成后将结果写回，避免了高昂的对象序列化传输成本。",
      deepDive: "JS 实例化并加载 Wasm 的标准管线代码：\n```javascript\n// 流式加载并实例化 wasm 二进制字节流，最省物理网速\nWebAssembly.instantiateStreaming(fetch('module.wasm'), {\n  env: {\n    log: (arg) => console.log('Wasm 调用了 JS 的 log:', arg) // 向 Wasm 注入 JS 回调函数\n  }\n}).then(result => {\n  const { add } = result.instance.exports;\n  console.log('执行 Wasm 的 add:', add(10, 20)); // 直接调用 Wasm 导出的 C++ 算术函数\n});\n```",
      structured: [
        "Wasm 优势：二进制格式直接映射硬件 CPU 指令，静态类型，避开 JS 引擎繁重的编译与重新优化流程",
        "线性共享内存：通过 `WebAssembly.Memory` 原生二进制 Buffer 进行双向通讯，实现零拷贝大容量数据传输",
        "通信局限：Wasm 无法直接访问 DOM/BOM 元素，所有的 DOM 修改必须回调给 JS 线程由 JS 间接去操作",
        "选型场景：高频图像处理（如 Photoshop Web）、音视频解码播放（如 Web 播放 H.265）、复杂物理引擎计算"
      ]
    },
    keyPoints: ["WebAssembly", "二进制机器码", "Linear Memory", "Shared ArrayBuffer", "C++/Rust 编译"],
    traps: ["对于普通的业务增删改查表单，引入 Wasm 反而会变慢！因为 JS 与 Wasm 之间的“函数调用跳转（Bridge Call）”本身有非常高昂的上下文切换开销，只有大体积计算才能抵消此代价"],
    relatedIds: []
  },
  {
    id: "interview_js_047",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "V8 引擎 JIT 编译原理（Ignition 与 TurboFan）",
    difficulty: 5,
    frequency: 4,
    question: "请详细阐述谷歌 V8 引擎在执行 JavaScript 时，JIT（Just-In-Time）即时编译的整体工作管线。什么是解释器 Ignition、优化编译器 TurboFan 以及去优化（Deoptimization）过程？",
    answer: {
      short: "V8 管线为：Parser 将 JS 源码解析为 AST，Ignition 解释器快速将 AST 转换为高效字节码（Bytecode）执行，并收集热点代码运行信息；一旦发现某函数被频繁高频调用，TurboFan 优化编译器会将字节码直接编译为机器指令以大幅加速；当输入参数类型发生改变（如从数字突变为字符串），V8 立即执行去优化（Deoptimization），回滚至字节码解释执行，性能大幅滑落。",
      thinkingProcess: "1. 引擎管线：Scanner -> Parser -> AST -> Ignition -> Bytecode -> TurboFan -> Machine Code。\n2. 引入 JIT 原因：纯解释慢，纯编译首屏慢。混合 JIT 最优。\n3. 优化编译器（TurboFan）：收集反馈向量（Feedback Vector）。如果一个 add(a, b) 中的 a 和 b 连续几百次都是 int，TurboFan 判定这行是热点，直接生成 `add eax, ebx` 二进制汇编指令，避开字节码解释。\n4. 去优化灾难：当突然传入 `add('1', '2')`，原本编译好的整数加法汇编彻底失效，V8 必须当场执行 deoptimization。把局部变量从 CPU 寄存器倒腾回解释器的虚拟栈帧，并作回滚。这极度消耗 CPU 周期，这就是为什么保持“类型单一性”在 JS 优化中极其关键。",
      deepDive: "Feedback Vector（反馈向量）是 Ignition 收集类型信息的核心数据结构。它为每个操作码槽位记录被访问过的隐藏类 Map。如果是单一隐藏类，称为 Monomorphic（单态），极易被 JIT 优化；如果是 2-4 个，称为 Polymorphic（多态），优化效能一般；如果超过 5 个，称为 Megamorphic（超多态），JIT 将直接放弃将其编译为机器指令，退回全量字节码解释。这也印证了编写 JS 时类结构要单一、不要写大杂烩通用对象的性能训诫。",
      structured: [
        "Ignition 解释器：将 AST 编译为高紧凑字节码，负责快速首开和启动执行，内存占用低",
        "TurboFan 编译器：收集 Feedback 向量，针对性将多频调用的单态热点字节码编译为汇编指令高速执行",
        "Deoptimization（去优化）：因传参类型改变（如 Shape 突变），JIT 二进制指令报错，引擎紧急回退至字节码逐行解释",
        "优化心智：声明变量类型单一，避免同一个函数在高频循环里传入完全不同 Shape 的对象"
      ]
    },
    keyPoints: ["JIT 编译", "Ignition 解释器", "TurboFan 优化", "Deoptimization", "单态与多态 IC"],
    traps: ["千万不要在循环体中强行修改动态对象的 Shape（如动态加减 key），这会直接打断 JIT 的 Inline Caching 寻址并触发去优化，性能直接滑坡"],
    relatedIds: ["interview_js_037"]
  },
  {
    id: "interview_js_048",
    mode: "study",
    domain: 'interview',
    type: "system_design",
    track: "frontend",
    topic: "javascript",
    title: "Service Workers 核心机制与离线缓存",
    difficulty: 4,
    frequency: 3,
    question: "Service Workers 的工作机制是什么？它是如何作为网络代理拦截 HTTP 请求的？如何配合 Cache Storage 实现 PWA 渐进式 Web 应用的完全离线访问？",
    answer: {
      short: "Service Worker 是一种独立于网页主线程运行的后台 Web Worker，不访问 DOM，生命周期长驻；它作为浏览器和服务器之间的“反向代理服务器”，通过监听 fetch 事件拦截所有网络 HTTP 请求；在拦截中可通过 match 检查 Cache Storage，若有缓存则立即返回以实现完全离线秒开，若无则请求网络并动态写入缓存。",
      thinkingProcess: "1. 离线缓存核心：Service Worker (SW) 与 Cache API。\n2. 网络拦截：SW 在安装激活后，任何在这个作用域下的 `fetch` 动作（如加载图片、发起 axios 请求）都会首先经过 SW 的 `onfetch` 监听器。\n3. PWA 完全离线：在 `oninstall` 时期，预先下载并存储 `['index.html', 'main.css', 'bundle.js']` 静态资源到 Cache Storage 里。页面再次打开时，SW 直接从缓存拦截返回，即使在断网模式下也能展示完整应用。",
      deepDive: "Service Worker 拦截 fetch 并应用网络回退缓存策略（Network falling back to cache）经典代码：\n```javascript\nself.addEventListener('fetch', (event) => {\n  event.respondWith(\n    caches.match(event.request).then((cachedResponse) => {\n      if (cachedResponse) {\n        return cachedResponse; // 1. 缓存命中，直接秒级返回静态资源，绕过真实网络请求\n      }\n      // 2. 缓存未命中，发起真实 fetch 网络拉取\n      return fetch(event.request).then((response) => {\n        // 3. 动态将请求到的最新资源写入 Cache Storage，供下次离线使用\n        return caches.open('v1').then((cache) => {\n          cache.put(event.request, response.clone());\n          return response;\n        });\n      });\n    })\n  );\n});\n```",
      structured: [
        "代理拦截：监听全局 `fetch` 事件，充当前端与网络之间的中间人，掌控数据通道",
        "生命周期：Register -> Install (预缓存核心静态分片) -> Activate (清理废弃版本缓存) -> Idle (挂起空闲)",
        "更新防范：Service Worker 更新时会进入 waiting 阶段，必须调用 `skipWaiting()` 才能强制接管当前激活页",
        "安全底线：SW 的工作协议强制要求只在 HTTPS 及本地 localhost 环境下生效，从协议底层杜绝了中间人劫持"
      ]
    },
    keyPoints: ["Service Worker", "Cache Storage", "fetch 拦截", "PWA 离线秒开", "skipWaiting"],
    traps: ["在 Service Worker 内部执行缓存写入时，返回给主线程的 Response 必须执行 `.clone()` 拷贝，因为 Response 属于 ReadableStream，作为流数据只能被读取一次，若不 clone 重复读取会直接报错"],
    relatedIds: ["interview_js_024"]
  },
  {
    id: "interview_js_049",
    mode: "study",
    domain: 'interview',
    type: "scenario",
    track: "frontend",
    topic: "javascript",
    title: "函数柯里化与 compose 组合器手写实现",
    difficulty: 3,
    frequency: 3,
    question: "在函数式编程（FP）中，什么是函数组合（Compose）？请手写一个可以从右向左依次执行函数并传递结果的 compose 组合器函数（如 Redux middleware 中 compose 的底层实现）。",
    answer: {
      short: "函数组合是将多个单参函数融合成一个新函数的技术，每个函数的输出作为下一个函数的输入；手写 compose 可使用 Array.prototype.reduceRight 将传入的函数列表从右往左依次递归执行，并返回最终运算结果。",
      thinkingProcess: "1. 组合概念：`compose(f, g, h)(x)` 等价于 `f(g(h(x)))`。数据从右向左流动。\n2. reduceRight 选用：因为要从最右侧的函数 `h` 开始调用计算，所以用 reduceRight 最为切合。\n3. Redux compose: Redux 里的经典 compose 是一行优雅的 `reduce` 嵌套：`funcs.reduce((a, b) => (...args) => a(b(...args)))`。",
      deepDive: "用 reduceRight 实现最清晰可读的 `compose` 源码：\n```javascript\nfunction compose(...funcs) {\n  if (funcs.length === 0) return (arg) => arg;\n  if (funcs.length === 1) return funcs[0];\n  \n  return function(x) {\n    // 从右往左遍历函数列表，上次执行结果 acc 作为下个函数的入参，初始值为 x\n    return funcs.reduceRight((acc, fn) => {\n      return fn(acc);\n    }, x);\n  };\n}\n\n// 示例消费：\nconst add5 = x => x + 5;\nconst double = x => x * 2;\nconst curriedCompose = compose(add5, double);\nconsole.log(curriedCompose(10)); // 10 * 2 + 5 = 25\n```",
      structured: [
        "函数式组合：将小型的、职责单一的“纯函数”融合成更强大的复合逻辑块，符合高内聚原则",
        "reduceRight：从右向左收束，上一轮的计算返回值累加注入为下一轮 fn 的入参参数",
        "Redux compose 源码极简形式：`return funcs.reduce((a, b) => (...args) => a(b(...args)))` 利用闭包层层代理",
        "数据约束：被 compose 包装的各个中间子函数，其出参类型必须与下一个函数的入参类型完全匹配"
      ]
    },
    keyPoints: ["函数组合", "compose", "reduceRight", "函数式编程 FP", "单向管道"],
    traps: ["如果 compose 链条中有一个函数不是“纯函数”（即带有修改外部全局变量的 side effect），多次调用 compose 组合器可能会因为执行时序差异产生诡异的逻辑时钟冲突"],
    relatedIds: ["interview_js_013"]
  },
  {
    id: "interview_js_050",
    mode: "study",
    domain: 'interview',
    type: "security",
    track: "frontend",
    topic: "javascript",
    title: "前端 XSS 与 CSRF 漏洞防御底线",
    difficulty: 3,
    frequency: 4,
    question: "什么是 XSS（跨站脚本攻击）和 CSRF（跨站请求伪造）？请结合 JavaScript 代码防范，阐述在前端如何筑牢这两种漏洞的防御底线？",
    answer: {
      short: "XSS 是攻击者在网页注入恶意 JS 脚本执行以窃取 Token，防御需对所有输入进行 HTML 转义过滤，并对 Cookie 开启 HttpOnly；CSRF 是诱导用户在第三方网站冒用其登录 Cookie 发起越权请求，防御需使用 SameSite Cookie 限制跨站携带，或在 HTTP 头部加入一次性 CSRF Token 校验。",
      thinkingProcess: "1. 安全攻防底线：前端必懂的安全架构规范。\n2. XSS 核心防线：不信任任何用户提交的内容。在页面展现用户输入前，把 `<` 替换为 `&lt;`，`>` 替换为 `&gt;`。决不无防备使用 `v-html` 或是 `dangerouslySetInnerHTML`。\n3. CSRF 核心防线：Cookie 在跨站（Cross-site）跳转时会被浏览器自动带上。SameSite=Strict 可以禁止这个自动携带。另外利用“双重 Cookie 校验”或 CSRF Token 拦截。因为外站拿不到自定义的 HTTP Header（如 `X-CSRF-Token`），即可识别伪造请求。",
      deepDive: "手写实现 XSS HTML 实体转义编码过滤函数：\n```javascript\nfunction escapeHTML(str) {\n  if (!str) return '';\n  return str.replace(/[&<>'\"/]/g, (char) => {\n    const entities = {\n      '&': '&amp;',\n      '<': '&lt;',\n      '>': '&gt;',\n      \"'\": '&#39;',\n      '\"': '&quot;',\n      '/': '&#x2F;'\n    };\n    return entities[char] || char;\n  });\n}\n// 用户输入的 '<script>alert(1)</script>' 转义为 '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'，失去脚本执行权安全呈现\n```",
      structured: [
        "XSS 防御（输入清理）：使用 DOMPurify 或手动 escapeHTML 拦截一切尖括号和引号转义，防止恶意 script 注入",
        "XSS 防御（存储保护）：敏感身份 Token （如 session ID）在 Set-Cookie 时强制标记 `HttpOnly`，拒绝前端用 document.cookie 读取",
        "CSRF 防御（Cookie 熔断）：将 Cookie 设置 `SameSite=Lax / Strict`，阻断第三方网站跨域请求自动发送 Cookie",
        "CSRF 防御（Token 认证）：每次 HTTP 请求时都在 Headers 里面带入一次性随机 `X-CSRF-Token`，后端比对成功才放行"
      ]
    },
    keyPoints: ["XSS 防御", "CSRF 攻击", "HTML 实体转义", "SameSite Cookie", "HttpOnly 锁定", "CSRF Token"],
    traps: ["千万不要依赖前端路由或前端校验来做安全性卡闸，所有数据校验及安全令牌校验最终必须在后端（Server 侧）执行判定，前端只负责清理和首道门槛过滤"],
    relatedIds: []
  }
];

const finalList = questions.concat(segment1).concat(segment2);
const fileContent = '// interview-javascript.js\n// 自动生成主题题库：JavaScript (归属于 frontend)\n\nconst questions = ' + JSON.stringify(finalList, null, 2) + ';\n\nmodule.exports = questions;\n';

const outputPath = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics/interview-javascript.js';
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-javascript.js with all 50 questions!');
