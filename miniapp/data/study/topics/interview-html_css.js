// interview-html_css.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_html_css_001",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "html_css",
    "title": "CSS 盒模型详解",
    "difficulty": 1,
    "frequency": 5,
    "question": "请解释 CSS 盒模型（Box Model）的组成，以及标准盒模型与 IE 盒模型的区别和如何转换。",
    "answer": {
      "short": "盒模型由 content、padding、border、margin 组成；标准盒模型 width 仅包含 content，IE 盒模型 width 包含 content+padding+border；通过 box-sizing: border-box 进行转换。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【CSS 盒模型详解】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【CSS 盒模型详解】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 联想分析：盒模型是 CSS 布局的基础，几乎所有面试都会以此为起点。\n2. 核心原理：标准盒模型（content-box）计算宽度时，padding 和 border 往外加；而 IE 盒模型（border-box）计算宽度时，已经将 padding 和 border 包含在设定的 width 内部。\n3. 实战总结：现代前端开发中几乎全量使用 box-sizing: border-box，以保证计算尺寸时符合直觉。",
      "deepDive": "标准盒模型下：盒子的实际宽度 = width + padding-left + padding-right + border-left + border-right。\nIE 盒模型下：盒子的实际宽度 = width（其中 width 已经扣除了 padding 和 border 得到 content 的宽度）。\n在 CSS 中，我们可以使用 box-sizing: content-box（默认值，标准盒模型）和 box-sizing: border-box（IE 盒模型/怪异盒模型）来进行显式转换。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。",
      "structured": [
        "组成部分：content (内容)、padding (内边距)、border (边框)、margin (外边距)",
        "标准盒模型：width = content 宽度",
        "IE 盒模型：width = content + padding + border",
        "切换属性：box-sizing: content-box | border-box"
      ]
    },
    "keyPoints": [
      "盒模型",
      "box-sizing",
      "border-box",
      "IE盒模型"
    ],
    "traps": [
      "不要忘记 margin 是盒子外部的距离，不计入盒子自身的实际尺寸（但影响占用空间）",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_html_css_002",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "html_css",
    "title": "CSS 选择器优先级与权重计算",
    "difficulty": 1,
    "frequency": 5,
    "question": "CSS 选择器的优先级是如何计算的？当有冲突时，浏览器是如何决定应用哪条样式的？",
    "answer": {
      "short": "优先级由特异性权重决定，从高到低为：!important > 行内样式 > ID 选择器 > 类/伪类/属性选择器 > 标签/伪元素选择器 > 通配符/继承；同权重下后声明者胜出。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【CSS 选择器优先级与权重计算】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【CSS 选择器优先级与权重计算】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 知识梳理：CSS 样式的叠加与覆盖（Cascading）。\n2. 权重计算规则：通常采用四位权重值表示法 (a, b, c, d)。\n3. 细节防脱：!important 并不属于选择器权重的一部分，但它具有最高优先级。继承的样式的权重最低，甚至不如通配符选择器 (*)。",
      "deepDive": "特异性（Specificity）权重计算法：\n- a: 行内样式（style 属性），计为 (1, 0, 0, 0)\n- b: ID 选择器，计为 (0, 1, 0, 0)\n- c: 类选择器、伪类选择器（如 :hover）、属性选择器（如 [type=\"text\"]），计为 (0, 0, 1, 0)\n- d: 标签选择器、伪元素选择器（如 ::before），计为 (0, 0, 0, 1)\n计算时从左向右逐位比较，大者胜出，不进行低位向高位的进制转换。!important 用来强制覆盖所有权重，但应避免滥用。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【CSS 选择器优先级与权重计算】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【CSS 选择器优先级与权重计算】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "!important 优先级最高",
        "权重四位表示法：(行内, ID, 类/伪类/属性, 标签/伪元素)",
        "继承的样式权重为 0",
        "权重相同时，CSS 文件中后声明的样式覆盖先声明的"
      ]
    },
    "keyPoints": [
      "选择器权重",
      "!important",
      "特异性",
      "伪类"
    ],
    "traps": [
      "伪类（如 :first-child）属于类权重，伪元素（如 ::before）属于标签权重，二者权重大不相同",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_html_css_003",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "frontend",
    "topic": "html_css",
    "title": "Flexbox 弹性布局核心属性与应用",
    "difficulty": 2,
    "frequency": 5,
    "question": "请阐述 Flex 布局中 flex-direction, justify-content, align-items 的作用，并给出一个水平垂直居中的 Flex 配置。",
    "answer": {
      "short": "flex-direction 控制主轴方向，justify-content 控制主轴对齐方式，align-items 控制交叉轴对齐方式；水平垂直居中配置为 display: flex; justify-content: center; align-items: center;。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Flexbox 弹性布局核心属性与应用】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Flexbox 弹性布局核心属性与应用】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 布局原理：Flexbox 是一维布局系统，基于主轴 and 交叉轴（侧轴）。\n2. 属性定位：flex-direction 决定主轴是水平（row）还是垂直（column）。一旦主轴方向改变，justify-content 和 align-items 作用的具体方向也会对调。\n3. 居中经典：直接使用 justify-content: center 与 align-items: center。",
      "deepDive": "Flexbox 容器（Container）属性：\n- flex-direction: row | row-reverse | column | column-reverse\n- justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly (主轴对齐)\n- align-items: stretch | flex-start | flex-end | center | baseline (侧轴单行对齐)\n- align-content: 针对多行容器的侧轴对齐方式。\n子项（Item）属性：flex-grow、flex-shrink、flex-basis。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。",
      "structured": [
        "Flexbox 基于双轴：主轴 (Main Axis) 与交叉轴 (Cross Axis)",
        "flex-direction 定义主轴，justify-content 决定主轴分配",
        "align-items 控制交叉轴单行子元素的排布方式",
        "极简垂直水平居中：justify-content: center + align-items: center"
      ]
    },
    "keyPoints": [
      "Flexbox",
      "主轴与侧轴",
      "水平垂直居中",
      "弹性对齐"
    ],
    "traps": [
      "如果父容器 flex-direction 为 column，水平居中由 align-items 负责，垂直居中由 justify-content 负责",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_html_css_004",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "frontend",
    "topic": "html_css",
    "title": "CSS Grid 网格布局实战",
    "difficulty": 3,
    "frequency": 4,
    "question": "CSS Grid 与 Flexbox 有何区别？如何使用 CSS Grid 实现一个响应式三栏布局且不需要媒体查询？",
    "answer": {
      "short": "Grid 是二维网格布局，Flex 是一维轴线布局；无媒体查询响应式三栏可使用 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 实现。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【CSS Grid 网格布局实战】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【CSS Grid 网格布局实战】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 深度对比：Flex 适合局部、线性的排列（一维排列）；Grid 适合整体大局、块状结构（二维行和列）。\n2. 响应式布局：传统做法是 @media 媒体查询。Grid 提供了 auto-fit、auto-fill 以及 minmax 属性，能够根据容器宽度自动伸缩并换行。\n3. 实战推导：使用 repeat 和 minmax 来规定网格轨道的自适应大小。",
      "deepDive": "Grid 核心属性：\n- grid-template-columns & grid-template-rows: 定义网格轨道的行与列。\n- repeat(auto-fit, minmax(min, max)): auto-fit 会自动填充剩余空间并折行，minmax 确保子元素宽度介于 min（如 200px）和 max（如 1fr 剩余比重）之间。当父级空间不足 600px 时，原本并排的三栏会自动塌陷为两栏或一栏，实现完美响应式。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。",
      "structured": [
        "Flexbox 是一维布局，Grid 是二维布局（行 and 列同时控制）",
        "Grid 适合页面大骨架布局，Flexbox 适合组件级小范围对齐",
        "auto-fit 与 auto-fill 区别：auto-fit 会伸展子项填满空余，auto-fill 会保留空白网格",
        "无媒体查询响应式：repeat(auto-fit, minmax(200px, 1fr))"
      ]
    },
    "keyPoints": [
      "CSS Grid",
      "二维布局",
      "minmax",
      "auto-fit",
      "响应式布局"
    ],
    "traps": [
      "Grid 在旧版本浏览器（如 IE11）上的兼容性较差，若要向后兼容需考虑优雅降级为 Flex 或 Float 布局",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_html_css_005",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "frontend",
    "topic": "html_css",
    "title": "CSS Position 定位属性对比",
    "difficulty": 2,
    "frequency": 4,
    "question": "请解释 position 的 relative, absolute, fixed, sticky 值的区别，并说明 sticky 的生效条件。",
    "answer": {
      "short": "relative 相对于自身定位，占位；absolute 相对于最近的非 static 祖先定位，脱标；fixed 相对于浏览器视口定位；sticky 结合 relative 和 fixed，基于特定滚动阈值定位。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【CSS Position 定位属性对比】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【CSS Position 定位属性对比】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 属性解析：CSS 定位模型是前端控图的核心。\n2. 生效特性：重点是 sticky 粘性定位。它在视口内像 relative，但当页面滚动到指定的 top 等距离时，它就会像 fixed 一样粘在窗口固定位置。\n3. 坑点规避：sticky 的父级不能有 overflow: hidden/auto 属性，否则由于父容器截断了视口滚动，sticky 会失效。",
      "deepDive": "- static: 默认文档流。\n- relative: 相对于自身原位置定位，原来的物理空间依然保留。\n- absolute: 脱离文档流，相对于最近的一个非 static 祖先元素定位。如果找不到，则相对于根元素 <html> 定位。\n- fixed: 脱离文档流，相对于视口（Viewport）进行定位，滚动页面时位置保持不变。\n- sticky: 混合定位。生效条件包括：必须指定 top/bottom/left/right 之一；父元素高度要大于 sticky 元素；所有祖先元素不能设置 overflow: hidden/auto/scroll。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。\n\n【渲染原理/治理之道】：浏览器在解析样式时会构建 Render Tree，任何修改几何尺寸的属性都会强制触发回流，引发整个视口的重新计算排版，极耗 CPU。而修改颜色则只会触发重绘。现代前端治理动画的黄金法则，是利用 CSS3 transform 强制开启 GPU 硬件加速层，避开回流。",
      "structured": [
        "relative: 不脱离文档流，偏移参考自身",
        "absolute: 脱离文档流，偏移参考最近非 static 祖先",
        "fixed: 脱离文档流，偏移参考视口",
        "sticky: 滚动阈值前 relative，之后 fixed。要求指定边距阈值，且祖先无 overflow 截断"
      ]
    },
    "keyPoints": [
      "position",
      "relative",
      "absolute",
      "sticky",
      "粘性定位"
    ],
    "traps": [
      "sticky 定位元素的生效范围受限于其父容器的边界。当父容器滚动出视口时，sticky 元素也会被带走",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。",
      "警惕面试官追问“如何避免动画在低端手机上发生闪烁和卡顿？”。防撕话术：1. 严禁使用会触发回流的 top/left 做元素平移动画。2. 必须使用 transform 开启独立合成层。3. 对动画元素加上 will-change: transform，并设置 z-index 提升层级，防止层爆炸。"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
