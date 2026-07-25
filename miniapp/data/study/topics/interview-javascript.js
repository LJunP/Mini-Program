// interview-javascript.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_001",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "javascript",
    "title": "说一下浏览器事件循环",
    "difficulty": 2,
    "frequency": 5,
    "question": "请解释浏览器中的 Event Loop，宏任务和微任务的执行顺序是什么？",
    "answer": {
      "short": "同步代码先执行，随后清空微任务队列，再进入下一个宏任务；浏览器会在合适时机进行渲染。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【说一下浏览器事件循环】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【说一下浏览器事件循环】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 概念定位：Event Loop 是 JS 异步单线程的调度枢纽。\n2. 队列划分：宏任务（setTimeout/I/O）与微任务（Promise/queueMicrotask）。\n3. 执行流水线：一个宏任务出栈 -> 执行所有微任务直至清空 -> 渲染检查 -> 发起下一个宏任务。",
      "deepDive": "Promise.then 属于微任务，setTimeout 属于宏任务。浏览器在执行一段脚本（这是首个宏任务）后，会将遇到的微任务全部执行完毕。在进入下一个宏任务前，如果发生了样式变动，浏览器会进行物理渲染。这意味着微任务的触发时机在一帧重绘之前，能阻断物理重绘的进行。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。",
      "structured": [
        "执行当前调用栈中的同步代码",
        "清空微任务队列中所有等待的任务",
        "执行渲染步骤，进行屏幕刷新",
        "取出宏任务队列中堆首的第一个宏任务执行"
      ]
    },
    "keyPoints": [
      "调用栈",
      "宏任务",
      "微任务",
      "Promise",
      "setTimeout",
      "渲染时机"
    ],
    "traps": [
      "不要把浏览器事件循环和 Node.js 事件循环完全混为一谈",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。"
    ],
    "relatedIds": [
      "interview_017"
    ]
  },
  {
    "id": "interview_004",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "javascript",
    "title": "var、let、const 的区别",
    "difficulty": 1,
    "frequency": 5,
    "question": "var、let、const 在作用域、提升和重复声明上有什么区别？",
    "answer": {
      "short": "var 函数作用域且存在变量提升，可重复声明；let/const 块级作用域、暂时性死区，不可重复声明；const 声明后不可重新赋值。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【var、let、const 的区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【var、let、const 的区别】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 变量提升：var 在编译期初始化为 undefined，let/const 在编译期只声明不初始化，进入 TDZ。\n2. 作用域划分：块级花括号的作用范围。\n3. const 绑定限制：只针对指向地址只读，非属性封死。",
      "deepDive": "const 限制的是变量的指针地址绑定，并非强锁数据。对于 const 声明的对象，我们依然可以对其内部属性执行增删改操作。若要冻结对象，必须手动使用 Object.freeze()。let/const 在声明前如果被读取，会触发 TDZ（暂时性死区）报错，避开了 var 声明前读取 undefined 的逻辑混乱。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【var、let、const 的区别】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【var、let、const 的区别】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "作用域：var 属于函数级作用域；let/const 属于 {} 块级作用域",
        "提升：var 提升且默认赋 undefined；let/const 提升但不赋初值，处于暂时性死区 (TDZ)",
        "重复声明：let/const 禁止在同一作用域内重复命名，否则报 SyntaxError",
        "const 限制：声明时必须初始化，且变量的内存地址绑定不可变动"
      ]
    },
    "keyPoints": [
      "作用域",
      "变量提升",
      "暂时性死区 TDZ",
      "重复声明",
      "const 只读绑定"
    ],
    "traps": [
      "const 不是让对象内容不可变，而是让变量绑定不可变",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。"
    ],
    "relatedIds": [
      "interview_017"
    ]
  },
  {
    "id": "interview_005",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "javascript",
    "title": "this 的指向如何判断",
    "difficulty": 2,
    "frequency": 4,
    "question": "请说明 JavaScript 中 this 的指向规则，并举例 arrow function 与普通函数的区别。",
    "answer": {
      "short": "this 取决于调用方式；箭头函数没有自己的 this，会捕获定义时的上下文。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【this 的指向如何判断】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【this 的指向如何判断】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 绑定分支：默认、隐式、显式、new、箭头函数。\n2. 优先级判定：new 绑定 > 显式 bind > 隐式 obj.fn > 默认全局。\n3. 箭头函数：声明时作用域 lexical this，永不可用 call 篡改。",
      "deepDive": "普通函数的 this 指向是在“运行期”确定的，看谁调用了它；箭头函数的 this 是在“定义期”确定的，看它当时所在的词法上下文环境。箭头函数由于没有 `[[Construct]]`，没有 prototype，所以绝对不支持使用 `new` 实例化操作。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。",
      "structured": [
        "默认绑定：非严格模式指向 window/global，严格模式指向 undefined",
        "隐式绑定：被对象点语法调用（如 obj.func()），this 指向调用主体对象 obj",
        "显式绑定：利用 call/apply/bind 强制锁定函数内 this",
        "new 绑定：构造函数实例化时，this 指向即将返回的新建实例对象",
        "箭头函数：没有专属的 this，顺着词法作用域链读取其声明父级的 this"
      ]
    },
    "keyPoints": [
      "默认绑定",
      "隐式绑定",
      "显式绑定",
      "new 绑定",
      "箭头函数词法 this"
    ],
    "traps": [
      "不要看到函数定义位置就判断 this，关键看调用位置",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_017",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "frontend",
    "topic": "javascript",
    "title": "setTimeout(fn, 0) 会立即执行吗",
    "difficulty": 2,
    "frequency": 4,
    "question": "setTimeout(fn, 0) 中的回调会立即执行吗？为什么？",
    "answer": {
      "short": "不会立即执行，setTimeout 属于宏任务，0 毫秒只是最小延迟，回调仍需等当前调用栈清空并经过事件循环调度。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【setTimeout(fn, 0) 会立即执行吗】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【setTimeout(fn, 0) 会立即执行吗】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 宏微时序：setTimeout 0 是在宏任务队列排队。\n2. 执行时序：调用栈清空 -> 清空所有微任务 -> 调度宏任务。\n3. 延迟下限：浏览器规范通常有 4ms 限制，实际存在延迟。",
      "deepDive": "setTimeout(fn, 0) 的作用是将任务推迟到下一个事件循环迭代中执行。当你想把一个高开销计算分割、让出浏览器主线程以便响应用户 UI 点击时，setTimeout 0 是极好的方案。但在精准度上，它的延迟要显著大于 Promise 的微任务更新。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。\n\n【底层源码/V8引擎】：JavaScript 在 V8 引擎中执行时，闭包的形成是因为外部函数的变量被内部函数引用，导致即使外部上下文退出，V8 也无法在堆内存中回收该变量域。V8 的垃圾回收（GC）采用分代收集：新生代使用拷贝清理；老年代采用标记-清除与标记-整理。",
      "structured": [
        "回调登记：由 Web API 线程计时后将其回调入队到宏任务队列（Macrotask Queue）",
        "微任务堵塞：即使当前调用栈执行完，也必须先清空 queueMicrotask / Promise 队列中的所有微任务",
        "浏览器限制：在嵌套调用超过 5 次时，标准规定有最小 4 毫秒的物理底线限制",
        "应用目的：非阻塞分割计算，让出主线程给 GUI 渲染线刷新页面"
      ]
    },
    "keyPoints": [
      "宏任务",
      "最小延迟",
      "事件循环",
      "让出主线程"
    ],
    "traps": [
      "不要认为 setTimeout 0 就是下一帧或立即执行",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。",
      "如何排查和解决前端线上闭包引起的内存泄漏？防撕要点：1. 使用 Chrome DevTools 的 Performance 面板录制，观察 Heap 内存是否阶梯状上升。2. 通过 Memory 面板拍取 Heap Snapshot 比对增量。3. 将不再使用的闭包引用手动置为 null。"
    ],
    "relatedIds": [
      "interview_001"
    ]
  },
  {
    "id": "interview_028",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "frontend",
    "topic": "javascript",
    "title": "箭头函数可以作为构造函数吗",
    "difficulty": 2,
    "frequency": 4,
    "question": "（追问）箭头函数是否可以使用 new 实例化？为什么？它与普通函数在底层 prototype 上有什么不同？",
    "answer": {
      "short": "不可以。箭头函数没有自己的 this 绑定，没有 [[Construct]] 内部方法，且不具备 prototype 属性，因此无法作为构造函数。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【箭头函数可以作为构造函数吗】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【箭头函数可以作为构造函数吗】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. new 原理：分配临时新对象，绑定原型，借用 constructor 执行。\n2. 箭头功能缺乏：无 prototype，无 [[Construct]] 内部执行器。\n3. arguments 局限：亦不绑定 argument 集合对象，不能用作 generator。",
      "deepDive": "JavaScript 引擎在通过 new 实例化一个普通函数时，会先创建一个空对象，将空对象的 __proto__ 指向函数的 prototype，然后将函数内的 this 绑定到这个新对象上并执行。箭头函数因缺乏 prototype 且 this 是固定的词法绑定，无法被实例化。若强行使用 new 调用箭头函数，引擎在检测时会直接抛出 TypeError 异常。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【箭头函数可以作为构造函数吗】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【箭头函数可以作为构造函数吗】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "原型链断档：无 prototype 属性，无法将新实例的 __proto__ 正确指向构造链",
        "执行机能欠缺：底层缺少 [[Construct]] 机制，仅存在供直接执行调用的 [[Call]]",
        " arguments 缺乏：不具备专属 arguments 对象，需通过 rest 剩余参数处理参数"
      ]
    },
    "keyPoints": [
      "[[Construct]]",
      "prototype",
      "词法作用域 this",
      "原型链",
      "TypeError"
    ],
    "traps": [
      "不要只是回答“因为没有自己的 this”，更根本的原因是引擎层面没有 [[Construct]] 方法 and prototype 属性",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。"
    ],
    "relatedIds": [
      "interview_005"
    ]
  }
];

module.exports = questions;
