const fs = require('fs');
const path = require('path');

const questions = [
  {
    id: 'interview_html_css_001',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 盒模型详解',
    difficulty: 1,
    frequency: 5,
    question: '请解释 CSS 盒模型（Box Model）的组成，以及标准盒模型与 IE 盒模型的区别和如何转换。',
    answer: {
      short: '盒模型由 content、padding、border、margin 组成；标准盒模型 width 仅包含 content，IE 盒模型 width 包含 content+padding+border；通过 box-sizing: border-box 进行转换。',
      thinkingProcess: '1. 联想分析：盒模型是 CSS 布局的基础，几乎所有面试都会以此为起点。\n2. 核心原理：标准盒模型（content-box）计算宽度时，padding 和 border 往外加；而 IE 盒模型（border-box）计算宽度时，已经将 padding 和 border 包含在设定的 width 内部。\n3. 实战总结：现代前端开发中几乎全量使用 box-sizing: border-box，以保证计算尺寸时符合直觉。',
      deepDive: '标准盒模型下：盒子的实际宽度 = width + padding-left + padding-right + border-left + border-right。\nIE 盒模型下：盒子的实际宽度 = width（其中 width 已经扣除了 padding 和 border 得到 content 的宽度）。\n在 CSS 中，我们可以使用 box-sizing: content-box（默认值，标准盒模型）和 box-sizing: border-box（IE 盒模型/怪异盒模型）来进行显式转换。',
      structured: [
        '组成部分：content (内容)、padding (内边距)、border (边框)、margin (外边距)',
        '标准盒模型：width = content 宽度',
        'IE 盒模型：width = content + padding + border',
        '切换属性：box-sizing: content-box | border-box'
      ]
    },
    keyPoints: ['盒模型', 'box-sizing', 'border-box', 'IE盒模型'],
    traps: ['不要忘记 margin 是盒子外部的距离，不计入盒子自身的实际尺寸（但影响占用空间）'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_002',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 选择器优先级与权重计算',
    difficulty: 1,
    frequency: 5,
    question: 'CSS 选择器的优先级是如何计算的？当有冲突时，浏览器是如何决定应用哪条样式的？',
    answer: {
      short: '优先级由特异性权重决定，从高到低为：!important > 行内样式 > ID 选择器 > 类/伪类/属性选择器 > 标签/伪元素选择器 > 通配符/继承；同权重下后声明者胜出。',
      thinkingProcess: '1. 知识梳理：CSS 样式的叠加与覆盖（Cascading）。\n2. 权重计算规则：通常采用四位权重值表示法 (a, b, c, d)。\n3. 细节防脱：!important 并不属于选择器权重的一部分，但它具有最高优先级。继承的样式的权重最低，甚至不如通配符选择器 (*)。',
      deepDive: '特异性（Specificity）权重计算法：\n- a: 行内样式（style 属性），计为 (1, 0, 0, 0)\n- b: ID 选择器，计为 (0, 1, 0, 0)\n- c: 类选择器、伪类选择器（如 :hover）、属性选择器（如 [type="text"]），计为 (0, 0, 1, 0)\n- d: 标签选择器、伪元素选择器（如 ::before），计为 (0, 0, 0, 1)\n计算时从左向右逐位比较，大者胜出，不进行低位向高位的进制转换。!important 用来强制覆盖所有权重，但应避免滥用。',
      structured: [
        '!important 优先级最高',
        '权重四位表示法：(行内, ID, 类/伪类/属性, 标签/伪元素)',
        '继承的样式权重为 0',
        '权重相同时，CSS 文件中后声明的样式覆盖先声明的'
      ]
    },
    keyPoints: ['选择器权重', '!important', '特异性', '伪类'],
    traps: ['伪类（如 :first-child）属于类权重，伪元素（如 ::before）属于标签权重，二者权重大不相同'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_003',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'Flexbox 弹性布局核心属性与应用',
    difficulty: 2,
    frequency: 5,
    question: '请阐述 Flex 布局中 flex-direction, justify-content, align-items 的作用，并给出一个水平垂直居中的 Flex 配置。',
    answer: {
      short: 'flex-direction 控制主轴方向，justify-content 控制主轴对齐方式，align-items 控制交叉轴对齐方式；水平垂直居中配置为 display: flex; justify-content: center; align-items: center;。',
      thinkingProcess: '1. 布局原理：Flexbox 是一维布局系统，基于主轴 and 交叉轴（侧轴）。\n2. 属性定位：flex-direction 决定主轴是水平（row）还是垂直（column）。一旦主轴方向改变，justify-content 和 align-items 作用的具体方向也会对调。\n3. 居中经典：直接使用 justify-content: center 与 align-items: center。',
      deepDive: 'Flexbox 容器（Container）属性：\n- flex-direction: row | row-reverse | column | column-reverse\n- justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly (主轴对齐)\n- align-items: stretch | flex-start | flex-end | center | baseline (侧轴单行对齐)\n- align-content: 针对多行容器的侧轴对齐方式。\n子项（Item）属性：flex-grow、flex-shrink、flex-basis。',
      structured: [
        'Flexbox 基于双轴：主轴 (Main Axis) 与交叉轴 (Cross Axis)',
        'flex-direction 定义主轴，justify-content 决定主轴分配',
        'align-items 控制交叉轴单行子元素的排布方式',
        '极简垂直水平居中：justify-content: center + align-items: center'
      ]
    },
    keyPoints: ['Flexbox', '主轴与侧轴', '水平垂直居中', '弹性对齐'],
    traps: ['如果父容器 flex-direction 为 column，水平居中由 align-items 负责，垂直居中由 justify-content 负责'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_004',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Grid 网格布局实战',
    difficulty: 3,
    frequency: 4,
    question: 'CSS Grid 与 Flexbox 有何区别？如何使用 CSS Grid 实现一个响应式三栏布局且不需要媒体查询？',
    answer: {
      short: 'Grid 是二维网格布局，Flex 是一维轴线布局；无媒体查询响应式三栏可使用 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 实现。',
      thinkingProcess: '1. 深度对比：Flex 适合局部、线性的排列（一维排列）；Grid 适合整体大局、块状结构（二维行和列）。\n2. 响应式布局：传统做法是 @media 媒体查询。Grid 提供了 auto-fit、auto-fill 以及 minmax 属性，能够根据容器宽度自动伸缩并换行。\n3. 实战推导：使用 repeat 和 minmax 来规定网格轨道的自适应大小。',
      deepDive: 'Grid 核心属性：\n- grid-template-columns & grid-template-rows: 定义网格轨道的行与列。\n- repeat(auto-fit, minmax(min, max)): auto-fit 会自动填充剩余空间并折行，minmax 确保子元素宽度介于 min（如 200px）和 max（如 1fr 剩余比重）之间。当父级空间不足 600px 时，原本并排的三栏会自动塌陷为两栏或一栏，实现完美响应式。',
      structured: [
        'Flexbox 是一维布局，Grid 是二维布局（行 and 列同时控制）',
        'Grid 适合页面大骨架布局，Flexbox 适合组件级小范围对齐',
        'auto-fit 与 auto-fill 区别：auto-fit 会伸展子项填满空余，auto-fill 会保留空白网格',
        '无媒体查询响应式：repeat(auto-fit, minmax(200px, 1fr))'
      ]
    },
    keyPoints: ['CSS Grid', '二维布局', 'minmax', 'auto-fit', '响应式布局'],
    traps: ['Grid 在旧版本浏览器（如 IE11）上的兼容性较差，若要向后兼容需考虑优雅降级为 Flex 或 Float 布局'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_005',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Position 定位属性对比',
    difficulty: 2,
    frequency: 4,
    question: '请解释 position 的 relative, absolute, fixed, sticky 值的区别，并说明 sticky 的生效条件。',
    answer: {
      short: 'relative 相对于自身定位，占位；absolute 相对于最近的非 static 祖先定位，脱标；fixed 相对于浏览器视口定位；sticky 结合 relative 和 fixed，基于特定滚动阈值定位。',
      thinkingProcess: '1. 属性解析：CSS 定位模型是前端控图的核心。\n2. 生效特性：重点是 sticky 粘性定位。它在视口内像 relative，但当页面滚动到指定的 top 等距离时，它就会像 fixed 一样粘在窗口固定位置。\n3. 坑点规避：sticky 的父级不能有 overflow: hidden/auto 属性，否则由于父容器截断了视口滚动，sticky 会失效。',
      deepDive: '- static: 默认文档流。\n- relative: 相对于自身原位置定位，原来的物理空间依然保留。\n- absolute: 脱离文档流，相对于最近的一个非 static 祖先元素定位。如果找不到，则相对于根元素 <html> 定位。\n- fixed: 脱离文档流，相对于视口（Viewport）进行定位，滚动页面时位置保持不变。\n- sticky: 混合定位。生效条件包括：必须指定 top/bottom/left/right 之一；父元素高度要大于 sticky 元素；所有祖先元素不能设置 overflow: hidden/auto/scroll。',
      structured: [
        'relative: 不脱离文档流，偏移参考自身',
        'absolute: 脱离文档流，偏移参考最近非 static 祖先',
        'fixed: 脱离文档流，偏移参考视口',
        'sticky: 滚动阈值前 relative，之后 fixed。要求指定边距阈值，且祖先无 overflow 截断'
      ]
    },
    keyPoints: ['position', 'relative', 'absolute', 'sticky', '粘性定位'],
    traps: ['sticky 定位元素的生效范围受限于其父容器的边界。当父容器滚动出视口时，sticky 元素也会被带走'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_006',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'BFC（块级格式化上下文）深度解析',
    difficulty: 3,
    frequency: 5,
    question: '什么是 BFC？它的渲染规则是什么？如何触发它以及它能解决什么布局问题？',
    answer: {
      short: 'BFC 是页面上独立的隔离容器，容器内布局不影响外部；渲染规则包括防 margin 重叠、防浮动覆盖等；触发方式有 overflow:hidden、display:flex、position:absolute 等；能解决 margin 塌陷和清除浮动。',
      thinkingProcess: '1. 理论根基：BFC (Block Formatting Context) 是 CSS 精细布局的底层概念。\n2. 机制分析：BFC 就像一堵墙，内部的东西无论怎么翻江倒海（如浮动、外边距大），都不会越界影响到墙外面的元素。\n3. 经典案例：清除内部浮动（自适应高度）；防止垂直方向上相邻两个块级元素的 margin 塌陷/重叠；实现左图右文的双栏自适应布局。',
      deepDive: '触发 BFC 的常见方式：\n1. 根元素 <html>\n2. 浮动元素（float 不为 none）\n3. 绝对定位元素（position 为 absolute 或 fixed）\n4. display 值为 inline-block、flex、grid、inline-flex、flow-root\n5. overflow 值为 hidden、auto、scroll (不为 visible)\n\nBFC 渲染规则：\n- 内部的 Box 会在垂直方向一个接一个地放置。\n- 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。\n- 计算 BFC 的高度时，浮动元素也参与计算（因此能解决高度塌陷问题）。\n- BFC 的区域不会与 float box 重叠（因此能实现自适应双栏布局）。',
      structured: [
        '定义：Block Formatting Context，块级格式化上下文',
        '规则一：计算 BFC 高度时，内部浮动元素会计入其中（清除浮动）',
        '规则二：BFC 区域不会与外面的 float 元素重叠',
        '常见触发：overflow: hidden/auto、position: absolute/fixed、display: flex/grid'
      ]
    },
    keyPoints: ['BFC', '清除浮动', 'margin塌陷', 'overflow:hidden', '自适应布局'],
    traps: ['只有在同一个 BFC 内部的元素才会发生 margin 重叠，如果想阻止重叠，可以把其中一个元素包裹在新的 BFC 中'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_007',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '水平垂直居中方案汇总',
    difficulty: 2,
    frequency: 5,
    question: '在不确定子元素宽高的情况下，有哪几种实现水平垂直居中的 CSS 方案？',
    answer: {
      short: '主要有三类方案：Flex 布局（justify-content/align-items: center）、Grid 布局（place-items: center）、以及 absolute + transform 定位法（top:50%; left:50%; transform:translate(-50%,-50%)）。',
      thinkingProcess: '1. 实用度考量：这是前端编码最基础的日常操作。\n2. 分类总结：必须展示不同历史时期 and 布局规范下的最优解。\n3. 技术深度：不确定宽高的情况下，定位法必须依赖 transform: translate(-50%, -50%)，因为 transform 里的百分比是相对于子元素自身的宽度和高度来计算的，而 top/left 是相对于父容器计算的。',
      deepDive: '1. Flex 方案 (推荐，最常用):\n.parent { display: flex; justify-content: center; align-items: center; }\n2. Grid 方案 (最简短):\n.parent { display: grid; place-items: center; }\n3. 定位 + Transform 方案 (适合绝对定位组件，如 Modal 弹窗):\n.parent { position: relative; }\n.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }\n4. Margin Auto 定位方案 (非常优雅):\n.parent { position: relative; }\n.child { position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; }',
      structured: [
        'Flex 方案：justify-content: center + align-items: center',
        'Grid 方案：place-items: center 或 align-content: center',
        '绝对定位 + transform 偏移：利用 transform 的自身比重实现自适应偏移',
        'Margin auto 定位：top/bottom/left/right 设为 0，margin 设为 auto'
      ]
    },
    keyPoints: ['垂直居中', 'transform', 'Flex', 'Grid', 'margin:auto'],
    traps: ['使用 transform 居中可能会导致文本变得模糊，这是由于平移后的坐标计算出现半像素导致的，可通过设置 text-rendering 或像素微调解决'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_008',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 预处理器与原生 CSS 变量对比',
    difficulty: 2,
    frequency: 3,
    question: 'Sass/Less 等预处理器和 CSS 原生自定义属性（CSS Variables）有何核心区别？',
    answer: {
      short: '预处理器在构建时静态编译为普通 CSS，变量不可在运行时改变；原生 CSS 变量在浏览器中动态解析，支持作用域且可以通过 JavaScript 在运行时动态修改。',
      thinkingProcess: '1. 动静对比：核心逻辑是“编译时静态”与“运行时动态”。\n2. 特性差异：Sass 变量以 $ 开头，在 Webpack 等工具打包后全部消失，变成具体的颜色值或长度值。原生 CSS 变量以 -- 开头，保留在 CSS 树中。\n3. 应用场景：换肤、动态交互等功能使用原生 CSS 变量极其简单，直接修改 CSS 属性或通过 JS 修改 style 属性即可。',
      deepDive: 'Sass / Less：\n- 优点：支持嵌套规则、混合（Mixins）、继承、更强大的数学函数和逻辑判断，易于维护复杂的静态布局。\n- 限制：变量属于静态资产，无法获取 DOM 状态，编译后便失去了变量属性。\n\nCSS Custom Properties (原生变量)：\n- 优点：完全动态，遵循 CSS 级联（Cascade）和继承规则。可以通过 JS 动态获取和更新：element.style.setProperty(\'--theme-color\', \'blue\')。\n- 限制：不支持复杂的嵌套与 Mixin（目前原生 CSS 嵌套规范正在普及，但预处理器的宏混合依然更强）。',
      structured: [
        'Sass/Less 变量：编译期替换，运行时已死，无法动态变更',
        '原生 CSS 变量：运行时动态解析，支持级联继承，支持 JS 交互修改',
        '语法形式：Sass 用 $var，原生用 --var 定义，var(--var) 使用',
        '联合使用：实际项目中通常用 Sass 做嵌套/函数，用原生变量做主题切换（Dark Mode）'
      ]
    },
    keyPoints: ['CSS 预处理器', 'CSS 变量', '动态主题', 'setProperty'],
    traps: ['原生 CSS 变量如果提供不合法的属性值，会被浏览器判定为无效，并退回到继承值或初始值，而预处理器在编译期就会直接抛出语法错误'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_009',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 工程化隔离方案：CSS Modules vs Scoped CSS',
    difficulty: 3,
    frequency: 4,
    question: '请解释 CSS Modules 和 Vue 中 Scoped CSS 的实现原理，以及二者有什么不同？',
    answer: {
      short: 'CSS Modules 将类名哈希化输出为独一无二的映射；Scoped CSS 通过在 DOM 节点添加自定义属性（data-v-hash）并编译 CSS 选择器（如 selector[data-v-hash]）来实现局部隔离。',
      thinkingProcess: '1. 工程挑战：CSS 默认是全局生效的，容易造成命名冲突 and 污染。\n2. 机制拆解：CSS Modules 是 React 社群常用的方案，将原本的类名在打包时改写为包含组件名称和随机哈希的字符串。Vue 的 Scoped CSS 则是通过 PostCSS 对 CSS 文件加上属性选择器后缀。\n3. 应用细节：在子组件样式污染、样式渗透（如 ::v-deep 或 :deep()）的处理方式上也有所差异。',
      deepDive: 'CSS Modules 原理：\n通过 Webpack 的 css-loader。将 .title 编译为类似 _App_title_1a2b3 的类名，并在 JS 中导出类名映射表。开发时通过 className={styles.title} 动态引用绑定。\n\nScoped CSS 原理 (Vue 独有)：\n通过 vue-loader / vite。在模板编译时，为组件内所有 HTML 元素加上 data-v-[hash] 属性，同时把 CSS 样式选择器编译为 .title[data-v-[hash]]，从而形成样式隔离锁定。若要修改第三方子组件的样式，必须使用深度选择器 :deep()（其原理是将属性选择器移到父级类名之后，使之匹配后代）。',
      structured: [
        'CSS Modules：将 className 静态哈希化映射，JS 动态引用键值',
        'Scoped CSS：保留原始类名，对 DOM 元素追加唯一 data 属性进行选择器匹配',
        '样式穿透：CSS Modules 需使用 :global()，Scoped CSS 使用 :deep() 或 ::v-deep',
        '目的相同：解决 CSS 全局污染、命名冲突与覆盖问题'
      ]
    },
    keyPoints: ['CSS Modules', 'Scoped CSS', 'PostCSS', '样式穿透', ':deep()'],
    traps: ['Scoped CSS 虽然能隔离样式，但由于它保留了原有类名，全局如果有高优先级的相同类名选择器（非 scoped），依然有可能突破隔离覆盖组件内部样式'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_010',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '响应式设计与媒体查询',
    difficulty: 2,
    frequency: 4,
    question: '如何设计响应式网页？常用的移动端适配方案（如 rem, vw/vh）有什么优缺点？',
    answer: {
      short: '响应式设计通常结合媒体查询与流式网格布局；移动适配中 rem 方案依赖 JS 动态计算 html 字体大小，vw/vh 方案完全由 CSS 决定视口比例，是目前更主流的推荐做法。',
      thinkingProcess: '1. 时代更迭：以前移动端适配被 rem 方案垄断（如手淘 Flexible.js），现在随着浏览器对视口单位（vw/vh）的完美支持，vw 方案成了新宠。\n2. 原理对比：rem 是相对于根元素的 font-size；vw 是相对于视口宽度的 1%。\n3. 落地对比：rem 需要在页面头部引入 JS 监听 resize 事件并修改 html 节点的 font-size；vw 不需要任何 JS 介入，完全由渲染引擎原生实现，体验更好，性能也更优。',
      deepDive: '1. 媒体查询 (Media Queries)：\n主要用于针对大屏幕（PC）、中屏幕（Tablet）、小屏幕（Mobile）进行布局级突变式切换。\n2. rem 适配方案：\n将 html 根元素的 font-size 设为 屏幕宽度 / 10。设计图上的 px 尺寸全部换算为 rem。虽然实现了等比例缩放，但是在极宽屏下容易造成布局过大，且需要额外的 JS 脚本在首屏运行，容易引起布局闪烁。\n3. vw/vh 适配方案 (主流推荐)：\n直接将尺寸写为 vw，如 1vw 等于视口宽度的 1%。配合 calc 或者 CSS 预处理器的编译工具（如 postcss-px-to-viewport），可以直接书写 px 自动转换，零 JS 依赖。',
      structured: [
        '核心策略：媒体查询 (调整排版) + 相对单位 (微调尺寸)',
        'rem 原理：以 HTML 根元素 font-size 为基准，利用 JS 根据屏宽动态修改基准值',
        'vw/vh 原理：以视口物理宽高百分比为基准，100vw = 视口总宽',
        '现代趋势：优先使用 vw/vh，结合 CSS Grid/Flexbox 自适应布局'
      ]
    },
    keyPoints: ['响应式布局', 'rem适配', 'vw/vh', 'postcss', '媒体查询'],
    traps: ['vh 适配在移动端有一个经典陷阱：很多手机浏览器的底部工具栏展开和收起时，会动态改变 vh 的高度，从而造成页面元素高度产生诡异的闪烁。对于这类场景应考虑使用 dvh (dynamic vh) 或 px 配合 calc 兜底'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_011',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 长度单位 rem、em、vh、vw 对比',
    difficulty: 2,
    frequency: 4,
    question: '请详细解释 CSS 中 em、rem、vw、vh 各代表什么，以及 em 与 rem 的计算基准有何不同？',
    answer: {
      short: 'rem 相对于 html 根元素的 font-size；em 相对于当前元素的 font-size（若用于 font-size 属性本身则相对于父元素）；vw/vh 是视口宽度和高度的百分之一。',
      thinkingProcess: '1. 概念厘清：这是对 CSS 各种相对单位计算规则的严谨考察。\n2. 计算陷阱：特别是 em。如果在一个层层嵌套 of DOM 树中，所有的子元素都使用 em 来指定字体大小或 margin，那么这些尺寸会发生“滚雪球”般的复合叠加计算，极难微护。这也是为什么 rem 方案被提出来并作为替代的首要原因。',
      deepDive: '- em (Element body):\n若用于 font-size，则是相对于父元素的 font-size；若用于非 font-size 属性（如 width、padding），则是相对于自身元素的 font-size。\n- rem (Root em):\n始终相对于根元素 <html> 的 font-size。只要根元素的 font-size 不变，rem 表示的具体像素大小在整个页面内是绝对一致的。\n- vw (Viewport Width) & vh (Viewport Height):\n视口度量单位。1vw 等于当前视口宽度的 1%。1vh 等于当前视口高度的 1%。',
      structured: [
        'rem：绝对以 root（<html>）的字体大小为唯一准绳，规避级联缩放问题',
        'em：相对于当前上下文的字体大小，容易形成层级嵌套连乘效应',
        'vw/vh：直接基于浏览器视口的物理边界计算，不依赖任何字体尺寸',
        '使用指南：排版字号/全局组件尺寸推荐用 rem；视口填满或屏占比定位推荐用 vw/vh'
      ]
    },
    keyPoints: ['em', 'rem', 'vw', 'vh', '级联计算'],
    traps: ['若页面没有设置默认 html font-size，rem 会相对于浏览器默认的 font-size (通常为 16px) 进行计算'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_012',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'HTML5 语义化元素与 SEO/无障碍',
    difficulty: 2,
    frequency: 3,
    question: '什么是 HTML5 语义化？为什么我们要避免全篇使用 <div> 布局？',
    answer: {
      short: '语义化是使用恰当的 HTML 标签（如 header、article、footer）表达内容结构；能让代码更具可读性，提升 SEO 友好度，并帮助无障碍屏幕阅读器正确解析网页。',
      thinkingProcess: '1. 标准化诉求：早期的网页被 div/span 充斥（“div 汤”），结构不清晰。\n2. 好处阐述：语义化标签最大的受益者是除人类开发者以外的“外部解析者”——例如搜索引擎蜘蛛（Googlebot）以及障碍群体使用的屏幕阅读器（ARIA 辅助设备）。\n3. 细节延伸：像 article、section、aside 各有定义，有助于建立清晰的纲要结构。',
      deepDive: 'HTML5 典型语义化标签包括：\n- <header>: 头部导航或介绍信息。\n- <nav>: 导航链接块。\n- <main>: 页面的核心主体内容，一个页面只应有一个。\n- <article>: 独立的、可复用的内容块（如博客文章、论坛帖子）。\n- <section>: 文档中的节、分段。\n- <aside>: 侧边栏，与主文内容间接相关。\n- <footer>: 底部版权与说明。\n\n优势分析：\n- 可读性与维护性：结构一目了然，方便开发和团队交接。\n- SEO：搜索引擎更喜欢语义明确的结构，有助于提高搜索排名和提取网页摘要。\n- 无障碍性（Accessibility）：读屏设备能利用导航地标（Landmarks）直接跳到 <main> 或 <nav>，大幅提升盲人用户操作体验。',
      structured: [
        '概念：根据内容的结构和含义，选择语义匹配的 HTML5 标签',
        '避免 div 滥用：div 无任何实际语义，对分析器而言是黑盒',
        'SEO：让搜索引擎算法更容易提取页面的权重区域和核心内容',
        '无障碍辅助：为盲人读屏软件提供页面结构路标导航'
      ]
    },
    keyPoints: ['语义化 HTML', 'header/footer', 'SEO', '无障碍访问', 'ARIA'],
    traps: ['不要单纯为了样式使用特定的标签（例如为了加粗而使用 <h1> 却破坏了文章的标题层级结构），应当严格遵从内容本质来抉择标签'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_013',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'HTML5 新特性与本地存储机制',
    difficulty: 2,
    frequency: 4,
    question: '请列举 HTML5 的核心新特性，并对比 Cookie、LocalStorage 和 SessionStorage 的区别。',
    answer: {
      short: '新特性包括 canvas/svg、音视频标签、语义化标签、本地存储等；LocalStorage 永久存储且容量大，SessionStorage 会话期存储，Cookie 容量极小且随 HTTP 请求发送，影响性能。',
      thinkingProcess: '1. 知识脉络：HTML5 是一次重大的平台级升级，核心是让浏览器拥有原生应用级别的处理能力。\n2. 存储考量：这是高频必考题。Cookie 的核心目的是为了进行网络会话状态的管理，却常被误用做客户端大容量存储；LocalStorage/SessionStorage 是为了大容量本地存储而生。\n3. 细节补强：Cookie 限制 4KB，每次请求都会被浏览器塞进 HTTP header 中，浪费带宽；LocalStorage 限制 5MB，不需要手动上传服务器。',
      deepDive: '1. HTML5 核心特性：\n- 语义化元素：<header>、<footer> 等。\n- 多媒体支持：<audio>、<video> 标签，不需要 Flash 插件。\n- 图形绘制：<canvas> API、SVG 原生集成。\n- 客户端存储：Web Storage (LocalStorage, SessionStorage) 与 IndexedDB。\n- API 升级：Web Worker (多线程)、WebSocket (双向通信)、Geolocation 等。\n\n2. 三方存储机制详细对比：\nCookie: 容量约 4KB，设置的过期时间前有效，每次 HTTP 请求都会携带在 header 中，易受 XSS 攻击。\nLocalStorage: 容量约 5MB，永久有效，不参与服务器通信，仅本地使用。\nSessionStorage: 容量约 5MB，仅在当前标签页（会话）有效，关闭标签页即销毁。',
      structured: [
        'HTML5 新特性：语义化、Canvas 绘图、音视频、Web Storage、WebSockets、IndexedDB',
        'Cookie 痛点：大小 4KB 局限，频繁随网络请求发送，性能损耗，安全性差',
        'LocalStorage：大小 5MB 局限，永久存储，支持多标签页共享',
        'SessionStorage：大小 5MB 局限，生命周期局限于当前浏览器选项卡'
      ]
    },
    keyPoints: ['HTML5 新特性', 'Cookie', 'LocalStorage', 'SessionStorage', '会话管理'],
    traps: ['不要在 LocalStorage 中存放用户的密码、Token 等极其敏感的信息，因为 LocalStorage 可以通过简单的 JS 代码直接被读取，极易受到 XSS 漏洞的攻击盗取'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_014',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'html_css',
    title: 'Web Components 技术规范与架构',
    difficulty: 4,
    frequency: 3,
    question: '什么是 Web Components？它由哪些核心规范组成？它在现代前端架构中有什么意义？',
    answer: {
      short: 'Web Components 是浏览器原生支持的组件化开发标准，由 Custom Elements（自定义元素）、Shadow DOM（影子DOM）和 HTML Templates（模板）三项技术规范组成，实现跨框架的通用组件库。',
      thinkingProcess: '1. 进阶探究：随着跨平台和多框架（React/Vue/Angular）共存的需求增加，Web Components 正在被很多大型企业用于设计“通用 UI 规范”。\n2. 机制拆解：需要分清 Custom Elements（JS 注册）、Shadow DOM（样式/DOM 深度物理隔离）和 Template（静态模版结构）。\n3. 劣势分析：由于其没有成熟的状态机双向绑定，数据响应式逻辑需要配合原生的属性监听，开发体验略微繁重。',
      deepDive: 'Web Components 核心三大技术规范：\n1. Custom Elements：允许开发者在 JS 中定义并注册全新的 HTML 标签。通过继承 HTMLElement 类，并在构造函数中定义周期（如 connectedCallback），最后使用 customElements.define(\'my-card\', MyCard) 激活标签。\n2. Shadow DOM：能够创建一个与外部页面完全隔离的“影子”DOM 树。影子内部的 CSS 绝不会污染外界，外界也无法波及内部样式，实现完美沙箱隔离。\n3. HTML Templates & Slots：利用 <template> 和 <slot> 标签，定义不会在页面初始渲染时显示的 DOM 骨架，在实例化时动态克隆，配合插槽实现灵活的内容分发。',
      structured: [
        '三大规范：Custom Elements 注册、Shadow DOM 样式隔离、Template 模板结构',
        '生命周期：connectedCallback (挂载)、disconnectedCallback (卸载)、attributeChangedCallback (属性变更)',
        'Shadow DOM 隔离：样式和 DOM 结构与外界完全隔离，天然防冲突',
        '核心痛点：缺乏主流框架的数据响应式机制，组件间复杂的状态流转开发成本较高'
      ]
    },
    keyPoints: ['Web Components', 'Shadow DOM', 'Custom Elements', '组件隔离', '跨框架组件库'],
    traps: ['在 React 18 以前的旧版本中，由于 React 本身拥有一套合成事件系统，直接消费 Web Components 的自定义事件时，可能会出现事件监听绑定失败的问题，需要手动通过 ref 进行 addEventListener 绑定'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_015',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 硬件加速与渲染合成线程',
    difficulty: 4,
    frequency: 4,
    question: 'CSS 硬件加速的原理是什么？为什么 transform 和 opacity 的动画性能远优于 left 和 top？',
    answer: {
      short: '硬件加速是通过把特定 DOM 元素提升为独立的合成层（Composite Layer），交给 GPU 执行渲染和变换；transform 和 opacity 动画仅触发 Composite（合成），不触发重排（Layout）和重绘（Paint），因而极为流畅。',
      thinkingProcess: '1. 渲染原理：深入浏览器内核渲染管线（Reflow -> Repaint -> Composite）。\n2. 机制对比：修改 left/top 会改变元素的物理布局位置，导致浏览器重新计算几何布局，触发布局计算（Reflow）。修改 transform 只是对该层元素进行矩阵平移，由 GPU 直接变换，不破坏原有的几何结构，因而只需要进行图层合成（Composite）。\n3. 实战指导：使用 will-change 或 transform: translate3d(0,0,0) 诱导浏览器将元素提层。',
      deepDive: '浏览器渲染一个页面的主要步骤：\n1. JavaScript：执行逻辑改变 DOM 或样式。\n2. Style：计算每个元素应用的最终 CSS 样式。\n3. Layout (重排)：计算每个元素的几何位置和大小（如修改 width, height, left, top 都会触发此步骤）。\n4. Paint (重绘)：将每个元素绘制在内存中的位图上（如修改 color, background-color 触发此步骤）。\n5. Composite (合成)：将各个图层送到合成线程中，由 GPU 合成最终的一帧画面。\n\n硬件加速原理：\n当使用 transform、opacity、filter 等属性，或者使用了 will-change，浏览器会将该 DOM 节点分配至单独的“合成层（Composited Layer）”。GPU 在显存中对位图直接进行旋转、缩放、偏移等矩阵运算。这避免了占用主线程去重新计算布局和绘制像素，从而能稳定跑满 60fps。',
      structured: [
        '渲染管线三步走：重排 (Layout) -> 重绘 (Paint) -> 合成 (Composite)',
        '修改 left/top：触发重排和重绘，耗费 CPU 算力和主线程时间',
        '修改 transform/opacity：仅在 GPU 合成层操作，仅触发 Composite，性能极高',
        '提层触发：will-change: transform、translate3d(0, 0, 0)、backface-visibility: hidden'
      ]
    },
    keyPoints: ['硬件加速', 'GPU 渲染', '重排与重绘', 'will-change', '合成层'],
    traps: ['不要盲目对所有元素使用硬件加速。每个合成层都需要占用额外的 GPU 显存，如果滥用（如大量 will-change），会导致显存暴涨，反而引起页面卡顿甚至浏览器崩溃'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_016',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '大图加载性能优化：CSS Sprite、SVG、Iconfont 对比',
    difficulty: 2,
    frequency: 4,
    question: '在项目开发中，雪碧图（CSS Sprite）、SVG 矢量图、Iconfont（字体图标）有什么优缺点？在现代项目中该如何选择？',
    answer: {
      short: '雪碧图减少 HTTP 请求但维护困难；Iconfont 轻量且可改颜色但只支持单色；SVG 是矢量格式，支持多色、无损缩放、支持动画，在 HTTP/2 下直接引用是现代的首选方案。',
      thinkingProcess: '1. 历史演进：从早期的优化网络连接限制（HTTP/1.1 雪碧图）到后来的字体图标（Iconfont），再到目前的超高清屏适配与矢量设计（SVG）。\n2. 协议影响：HTTP/2 引入了多路复用技术，这使得“为了减少请求数而把所有图拼在一张大图上”的雪碧图模式失去了绝大部分网络层面的优势，反而增加了后期切图和维护的负担。',
      deepDive: '1. CSS Sprite (雪碧图/精灵图)：\n- 优点：合并图减少 HTTP 请求次数，兼容性极佳。\n- 缺点：不支持高清屏无损缩放，改动一个图标就要重新切图排版，维护成本极高。\n2. Iconfont (字体图标)：\n- 优点：本质是字体文件，可以通过 CSS color 和 font-size 轻松修改大小和颜色，完全矢量无损。\n- 缺点：只支持单色，可能会在弱网下导致渲染为方块乱码。\n3. SVG (矢量图形)：\n- 优点：矢量无损，支持任意放大；支持多色彩；可直接作为 HTML DOM 被 CSS 样式控制，甚至可以加 CSS 动画，是现代首选。',
      structured: [
        '雪碧图：HTTP/1.1 遗留产物，为减少 HTTP 连接，但切图复杂，现已较少采用',
        'Iconfont：利用字体原理实现单色图标，通过 CSS 控制颜色字号，但在超高清屏上抗锯齿可能发虚',
        'SVG：主流首选，支持全色彩、多元素隔离、内联动画，支持高分屏无损显示',
        '现代项目推荐：使用 SVG，在构建时通过插件将其打包为精灵节点，在页面中以组件化方式引入'
      ]
    },
    keyPoints: ['雪碧图', 'Iconfont', 'SVG 矢量图', 'HTTP/2 多路复用', '图标优化'],
    traps: ['使用 Iconfont 时，如果字体文件过大且在首屏加载慢，可能会在网络加载期间看到一瞬间的方块乱码，对用户体验极不友好，应合理拆分或精简字体包'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_017',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'Flexbox 的 flex-grow/shrink/basis 计算原理',
    difficulty: 3,
    frequency: 4,
    question: '当子元素的 flex 属性设为 flex: 1 2 100px 时，这三个参数代表什么？剩余空间和溢出空间的分配机制是如何精确计算的？',
    answer: {
      short: '三个参数依次为 flex-grow、flex-shrink 和 flex-basis；空间充足时按 grow 比例分配多余空间；空间不足且溢出时，按 shrink权重 = 基础尺寸 * shrink系数 的比例计算收缩大小，最终分配差值。',
      thinkingProcess: '1. 精确算理：这是对弹性布局中非常核心且考察深度的计算逻辑进行拆解。\n2. 属性定位：grow 代表剩余空间拉伸比，shrink 代表溢出空间收缩比，basis 代表参与分配前的弹性基准尺寸（优先于 width）。\n3. 数学计算：收缩比（shrink）的计算公式有坑，它不仅看 flex-shrink 本身，还要和元素设定的 flex-basis（基准宽度）做乘积加权。',
      deepDive: '1. 属性概念解释：\n- flex-grow: 默认 0（不拉伸）。若容器有空余，子项拉伸的权重。\n- flex-shrink: 默认 1（自动缩小）。若空间不足溢出，子项缩小的权重。\n- flex-basis: 默认 auto（以元素 width 为准）。在计算弹性空间前，子项占用的主轴基准长度。\n\n2. flex-grow 计算步骤 (假设容器有多余空间 S):\n- 所有子项的 flex-grow 总和为 TotalGrow = sum(grow_i)。\n- 如果 TotalGrow >= 1，第 i 个子项分到的额外宽度 = S * (grow_i / TotalGrow)。\n\n3. flex-shrink 计算步骤 (假设容器溢出空间 W):\n- 计算每个元素的收缩因子权重：Weight_i = basis_i * shrink_i。\n- 汇总所有子元素的收缩总因子：TotalWeight = sum(basis_i * shrink_i)。\n- 第 i 个子元素应当收缩减少的宽度为：ShrinkWidth_i = W * (basis_i * shrink_i) / TotalWeight。',
      structured: [
        '参数顺序：flex: [flex-grow] [flex-shrink] [flex-basis]',
        'flex-basis 拥有最高尺寸覆盖权，阻碍并覆盖 width 设定',
        '空间拉伸：按各元素 flex-grow 比例瓜分盈余',
        '空间缩减：加权收缩计算，缩减大小 = 溢出宽 × (basis × shrink) / 所有(basis × shrink)之和'
      ]
    },
    keyPoints: ['flex-grow', 'flex-shrink', 'flex-basis', '弹性计算', '加权收缩'],
    traps: ['当设置 flex-shrink 大于 0 导致缩小时，子元素绝对不会缩小到比它内部包裹的纯文本/内容所需的最小宽度（min-width）还小，除非显式修改子项的 overflow 属性'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_018',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: '隐藏元素的三种方式：display vs visibility vs opacity',
    difficulty: 1,
    frequency: 5,
    question: 'display: none、visibility: hidden 和 opacity: 0 在隐藏元素时有什么区别？',
    answer: {
      short: 'display:none 脱离文档流，不占位且不触发绑定事件；visibility:hidden 保留位置但不能点击，其子元素若设 visibility:visible 会重新显示；opacity:0 占位且保留事件监听。',
      thinkingProcess: '1. 知识整理：这是前端基础题中的高频经典，要求在占位、事件、性能和回流三个维度回答。\n2. 性能差异：display: none 属于彻底摧毁节点，触发布局重排（Reflow）；visibility: hidden 只是改变图层的可见性，不影响物理布局，只触发重绘（Repaint）；opacity: 0 涉及图层合成（Composite），性能最高。',
      deepDive: '1. DOM 占位与文档流：\n- display: none: 从渲染树（Render Tree）中完全移除，不占任何空间。\n- visibility: hidden: 元素隐藏，但在页面中仍占据原本的物理空间。\n- opacity: 0: 元素隐藏，占据物理空间，只是设置了全透明（Alpha = 0）。\n\n2. 事件响应与交互：\n- display: none / visibility: hidden: 无法接收任何点击、悬浮等交互事件。\n- opacity: 0: 依然完全接受交互事件，用户看不见也能点击触发绑定的 onClick 逻辑。',
      structured: [
        'display: none: 不占位，不响应事件，会引发 Reflow 重排',
        'visibility: hidden: 占位，不响应事件，只引发 Repaint 重绘，子级 visible 可穿透显示',
        'opacity: 0: 占位，保留交互响应，性能最优（仅 Composite 合成）'
      ]
    },
    keyPoints: ['display:none', 'visibility:hidden', 'opacity', '重排与重绘', '事件捕获'],
    traps: ['如果在做页面性能调优时，想要在隐藏元素的同时避免造成主线程布局卡顿，应该使用 opacity: 0 或配合 visibility: hidden，尽量减少 display: none 带来的回流损耗'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_019',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 伪类与伪元素的区别',
    difficulty: 1,
    frequency: 4,
    question: '请解释 CSS 伪类（Pseudo-classes）与伪元素（Pseudo-elements）的区别，并在书写规范上如何区分？',
    answer: {
      short: '伪类表示元素的特定状态（如 :hover，使用单冒号）；伪元素用于在文档中插入虚拟内容（如 ::before，规范建议使用双冒号）。',
      thinkingProcess: '1. 规范对比：这是对 CSS 规范理解细节的检验。\n2. 概念核心：伪类相当于给现有的 DOM 元素在特定状态下套了一个虚拟类名；伪元素则是无中生有，创建了一个新的虚拟 DOM 节点插在宿主元素里。\n3. 冒号标准：在 CSS3 规范中，为了明显区分伪类和伪元素，伪类统一采用单冒号 `:`，伪元素统一采用双冒号 `::`。',
      deepDive: '1. 伪类 (Pseudo-classes)：\n- 作用：用于定义元素的特殊状态（如用户交互、结构位置等），它们修饰的是已有元素。\n- 常见项：:hover, :active, :focus, :first-child, :nth-child(n), :not()。\n2. 伪元素 (Pseudo-elements)：\n- 作用：用于创建一些不在 DOM 树中显式存在的虚拟元素，用于美化或注入特定内容。\n- 常见项：::before, ::after, ::first-letter, ::placeholder。必须配合 content 属性才能生效。',
      structured: [
        '伪类：描述已有元素的状态变化（单冒号 : 表示，如 :hover）',
        '伪元素：向页面注入新的虚拟内容节点（双冒号 :: 表示，如 ::before）',
        '权重：伪类相当于类选择器权重 (0,0,1,0)；伪元素相当于标签选择器权重 (0,0,0,1)',
        '伪元素要求：必须配合 content 属性，否则在渲染树中无法挂载'
      ]
    },
    keyPoints: ['伪类', '伪元素', '::before', 'CSS规范', '选择器权重'],
    traps: ['::before 和 ::after 伪元素所插入的虚拟内容是无法通过 JS 直接在 DOM 树中进行 document.querySelector 获取并绑定原生事件监听器的，所有的交互逻辑必须作用在宿主元素上'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_020',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 变量作用域与运行时 JS 联动',
    difficulty: 3,
    frequency: 4,
    question: '如何利用 CSS 自定义属性（原生 CSS 变量）在项目里动态实现一个主题切换（如一键切换暗黑模式）？请说明关键 of CSS 声明和 JS API。',
    answer: {
      short: '在 CSS 的 :root 下声明全局变量，在 .dark 类下覆盖变量值；通过 JavaScript 动态修改 body 元素的 class 或利用 style.setProperty() 在运行时更改变量值。',
      thinkingProcess: '1. 工程场景：一键换肤/黑白模式是目前中大型系统非常标准的用户体验配置。\n2. 变量级联：CSS 原生变量具备继承和级联作用。只需在 :root 声明一套颜色，再在 [data-theme=\'dark\'] 下将变量覆盖。一旦外部容器切换了属性，内部所有的 var() 变量颜色会自动顺延重绘。',
      deepDive: '1. CSS 变量声明：\n:root {\n  --bg-color: #ffffff;\n  --text-color: #333333;\n}\n[data-theme=\'dark\'] {\n  --bg-color: #1a1a1a;\n  --text-color: #f5f5f5;\n}\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  transition: background-color 0.3s ease;\n}\n\n2. JS 切换逻辑：\nfunction toggleTheme(isDark) {\n  const theme = isDark ? \'dark\' : \'light\';\n  document.documentElement.setAttribute(\'data-theme\', theme);\n}',
      structured: [
        'CSS 变量范围：在 :root 中声明全局变量，在特定选择器下覆盖同名变量',
        '切换机理：利用 CSS Cascading（级联），容器类名一变，后代应用的所有 var() 变量随之生效',
        'JS 控制 API：element.style.setProperty(name, value) / style.getPropertyValue()',
        '优点：不需要像以前一样去加载多套独立的 CSS 文件，避免白屏和资源浪费'
      ]
    },
    keyPoints: ['CSS 变量', '暗黑模式切换', '级联覆盖', 'setProperty', '网页主题'],
    traps: ['若项目在旧版浏览器中运行，原生变量需要使用 css-vars-ponyfill 进行 polyfill 兼容转换'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_021',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: '回流与重绘的根本区别与调优策略',
    difficulty: 3,
    frequency: 5,
    question: '请解释什么是浏览器的回流（Reflow）和重绘（Repaint）？哪些操作会触发它们？在前端开发中该如何进行性能优化以减少回流？',
    answer: {
      short: '回流是重新计算布局结构，开销极大；重绘是重新填色画位图，不改变几何位置，开销较小；减少回流可通过读写分离、离线修改 DOM、使用 class 代替逐条 style 修改以及合并操作等实现。',
      thinkingProcess: '1. 渲染原理：这是衡量中高级前端对浏览器核心渲染流程和流畅度优化掌握情况的标准题。\n2. 机制定义：回流（Reflow）又称重排，必将导致重绘；重绘（Repaint）不一定会导致回流。\n3. 优化干货：核心在于避免强行触发排队同步布局刷新（Layout Thrashing），例如在循环里读取 offsetHeight 属性又写入 style。',
      deepDive: '1. 回流 (Reflow / 重排)：\n当 DOM 树中部分元素的几何尺寸、布局结构发生改变时（如位置、宽高、隐藏与否等），浏览器需要重新计算元素在视口内的确切位置和大小。这会造成整个渲染树（Render Tree）局部或全局的重新计算，对性能消耗极大。触发：改变窗口大小、增加/删除节点、获取 offsetTop/scrollTop 等。\n2. 重绘 (Repaint)：\n元素的布局几何尺寸没有改变，仅影响视觉外观的属性发生变化时（如 color, background-color, visibility 等），浏览器只需要重新绘制受影响部分的像素位图。\n3. 优化方案：\n- 读写分离，避免 Layout Thrashing。\n- 集中修改样式，用 class 或 cssText。\n- 使用 document.createDocumentFragment() 或先 display: none 再进行复杂的 DOM 变动。\n- 对复杂动画元素采用绝对定位脱离文档流。',
      structured: [
        '回流 (重排)：重新计算页面元素的几何模型，必定引发后续重绘',
        '重绘：仅更新元素外观像素表现，不改变文档结构与定位',
        '强制同步布局 (Layout Thrashing)：频繁读取 offsetTop/scrollTop 等只读参数，会强行打破异步渲染渲染队列导致回流',
        '批处理优化：使用 DocumentFragment、读写分离、虚拟 DOM 渲染'
      ]
    },
    keyPoints: ['回流', '重绘', 'offset家族', 'DocumentFragment', 'Layout Thrashing', '读写分离'],
    traps: ['即便你没写任何写操作，仅仅是连续读取 offsetTop 也会导致浏览器强行在主线程同步触发回流以计算最新的像素值。如果读写交替在循环中出现，网页会产生灾难性的布局抖动和掉帧'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_022',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: '层叠上下文（Stacking Context）与 z-index 规则',
    difficulty: 3,
    frequency: 4,
    question: 'z-index 是如何决定层叠优先级的？为什么有时候子元素的 z-index 设置得非常大，却依然被别的父级元素压在下面？',
    answer: {
      short: 'z-index 的比较仅在同一个层叠上下文中有效；若父级未生成层叠上下文或父级层叠上下文本身被压在低层，子元素的 z-index 再大也无法突破父级的层级限制越界显示。',
      thinkingProcess: '1. 机制解析：层叠上下文（Stacking Context）是三维 CSS 层级定位的灵魂概念。\n2. 比较原理：两代元素比高低，首先要看它们是不是在同一个“擂台”（层叠上下文）里。如果在不同的擂台，直接比较各自擂台（父容器）的等级。\n3. 生成条件：熟悉哪些属性（如 opacity 不为 1、filter、transform 不为 none）会在元素上悄悄生成层叠上下文。',
      deepDive: '1. 层叠上下文的生成条件（常见项）：\n- 文档根元素 <html>\n- position 为 relative / absolute 且 z-index 值不为 auto 的元素。\n- position 为 fixed / sticky 的元素。\n- CSS3 新特性：元素的 opacity 小于 1；transform, filter, perspective 值不为 none。\n\n2. 层叠黄金规则：\n正 z-index > z-index:0/auto > inline 行内 > float 浮动 > block 块级 > 负 z-index。\n\n3. 经典失效案例：\n如果父级 A 和 B 都生成了层叠上下文，A 的 z-index 是 1，B 的 z-index 是 2。哪怕 A 内部的子元素设置 z-index: 99999，也会因为 A 被压在 B 下面，子元素 A-sub 也永远在 B 及其所有子代下面。',
      structured: [
        '层叠原则：先比比拼层叠上下文（拼爹），如果爹不是同级别，子辈 z-index 毫无意义',
        '层叠上下文生成：除了 position + z-index，opacity<1、transform 等 CSS3 属性也会诱发生成',
        '同级比较：正 z-index > z-index:0/auto > inline 行内 > float 浮动 > block 块级 > 负 z-index'
      ]
    },
    keyPoints: ['层叠上下文', 'z-index', '定位规则', 'CSS3层级'],
    traps: ['很多时候开发者会把 opacity 设为 0.99 来做微小的半透明，但这会使元素悄悄变成层叠上下文，可能导致它内部的绝对定位子项和外部发生莫名其妙的层级错乱'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_023',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Houdini 架构与 Paint API 实践',
    difficulty: 5,
    frequency: 2,
    question: '什么是 CSS Houdini？它在 CSS 渲染管线中扮演了什么角色？请简述如何利用 Paint API 实现自定义图形绘制。',
    answer: {
      short: 'Houdini 是允许开发者通过 JS 直接钩入浏览器渲染管线（DOM、CSSOM、Layout、Paint、Composite）的 API 集合；通过 CSS.paintWorklet 注册 Worklet 并编写 Canvas-like 画布脚本，可直接用 CSS 属性驱动自定义的高性能渲染效果。',
      thinkingProcess: '1. 尖端前沿：Houdini 是 CSS 未来的终极路线，也是高级/专家级前端需要关注的底层技术。\n2. 原理解构：传统上 CSS 渲染是个“黑盒”，开发只能调样式，等待浏览器黑盒渲染。Houdini 将管线拆解，开放了 Typed OM、Paint API、Layout API 等。\n3. 实战示例：通过注册 registerPaint 可以在 CSS 样式里使用 background: paint(my-fancy-shape)，它的渲染发生在合成和绘制线程，不阻塞主线程。',
      deepDive: 'Houdini 核心技术栈：\n- CSS Typed OM：将原本的字符串样式 "20px" 变成带有类型的 JS 对象 CSS.px(20)，提高了 JS 修改样式的计算性能。\n- Paint API：使用类似 HTML5 Canvas 的绘图命令直接在渲染层绘图，且运行在独立的 Worklet 线程中，完全不占用 CPU 主线程。\n- Properties and Values API：允许自定义 CSS 属性的继承规则、初始值以及类型（使得以前不支持过渡动画的渐变色可以支持过渡）。\n\nCSS Paint API 实施步骤：\n1. 在独立 JS 文件 paint-worklet.js 中注册绘制逻辑：\nregisterPaint(\'circle-bg\', class {\n  static get inputProperties() { return [\'--circle-color\']; }\n  paint(ctx, geom, properties) {\n    const color = properties.get(\'--circle-color\').toString();\n    ctx.fillStyle = color;\n    ctx.beginPath();\n    ctx.arc(geom.width / 2, geom.height / 2, Math.min(geom.width, geom.height) / 2, 0, 2 * Math.PI);\n    ctx.fill();\n  }\n});\n2. 在主线程 JS 中注册加载：CSS.paintWorklet.addModule(\'paint-worklet.js\');\n3. 在 CSS 中调用：.bubble { --circle-color: orange; background: paint(circle-bg); }',
      structured: [
        'Houdini 宗旨：打破 CSS 渲染引擎黑盒限制，向开发者开放渲染底层的 API 钩子',
        'Typed OM：引入强类型样式模型，提升 JS 解析样式计算性能并消除拼写错漏',
        'Paint API Worklet：使用 Canvas 的 2D 绘图命令，且运行在独立绘制线程，零阻塞主线程',
        'Properties & Values API：可以强类型定义变量并支持之前无法插值的属性进行平滑动画过渡'
      ]
    },
    keyPoints: ['CSS Houdini', 'Paint API', 'Worklet', 'Typed OM', 'Properties & Values API', '底层渲染管线'],
    traps: ['Houdini 特性在 Safari 和 Firefox 上的支持程度仍然不均，目前属于渐进增强技术，对于核心业务布局，必须提供静态 CSS 兼容兜底方案，防止在低版本浏览器上完全白屏'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_024',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Containment 渲染性能优化规范',
    difficulty: 4,
    frequency: 3,
    question: 'CSS 中的 contain 属性有什么作用？它是如何帮助浏览器进行重绘和重排范围控制以实现高性能渲染的？',
    answer: {
      short: 'contain 属性能够显式告诉浏览器该元素及其子树在布局、样式或大小上是与外部页面完全隔离的，限制了重排重绘在组件内部闭环发生，防止牵一发而动全身，大幅提升复杂页面局部刷新的性能。',
      thinkingProcess: '1. 性能进阶：这是一个被很多日常开发忽略但对于重度大型页面优化非常有效的属性。\n2. 原理透视：浏览器在修改某个小元素的 DOM 节点时，无法预测这个改动是否会往上波及到父容器（比如父容器高度包裹子元素）。因此，浏览器通常会采取保守的安全做法：重新从上往下或者重新全局进行布局计算。contain 属性打破了这一保守的做法。',
      deepDive: 'contain 的属性值与隔离级别：\n- contain: layout：告诉浏览器该元素内部的任何布局变化，绝不会影响外部任何元素的布局。浏览器在重排子元素时，计算范围被牢牢框在这个元素盒子内部，大大缩小了重排的树节点深度。\n- contain: paint：告诉浏览器这个元素的子孙元素绝不会超出这个元素的边界显示（相当于隐式 overflow: hidden）。如果子元素超出了，也不会在屏幕上渲染。这意味着当元素被滑出视口时，浏览器可以直接跳过绘制其内部的内容，能显著节省内存开销和合成耗时。\n- contain: size：该元素在计算自身大小时，不需要去管子孙元素的尺寸，尺寸完全由自身属性（如 width/height）决定。这使得浏览器可以直接缓存该盒子的尺寸，哪怕它的子元素动态增删，也决不触发重新测算父级宽度高度的操作。\n- contain: content：等价于 contain: layout paint，是最常用的组件级优化项。\n- contain: strict：等价于 contain: layout paint size，是最强级别的防御策略。',
      structured: [
        '本质：CSS 渲染边界硬隔离，告知浏览器该元素与其子树是一具自治的孤岛组件',
        'contain: layout: 阻止布局信息向外级级联传播，隔离重排开销',
        'contain: paint: 保证子树不溢出渲染，允许浏览器跳过视口外后代节点的重绘',
        '主要应用：高频局部变更的独立组件、大容量卡片列表、交互频繁的容器'
      ]
    },
    keyPoints: ['CSS contain', '渲染隔离', '重排性能优化', '长列表优化', 'Layout boundary'],
    traps: ['设置 contain: size 时，如果该元素没有设置具体的 width 和 height 属性，它会因为无视子元素尺寸而直接折叠塌陷为 0x0 像素的大小，使用时必须配合显式宽高设定'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_025',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '响应式图片加载：srcset 与 picture 标签详解',
    difficulty: 2,
    frequency: 4,
    question: '为了优化移动端的流量并适配高清屏幕，如何利用 HTML 的 srcset、sizes 以及 <picture> 标签实现根据设备像素比（DPR）和屏幕宽度自动加载最佳分辨率图片的响应式图片方案？',
    answer: {
      short: 'srcset 提供不同分辨率或宽度图源，sizes 规定不同媒体查询下图片的显示宽度，浏览器根据这些参数和设备 DPR 自动挑选最省流量图源；<picture> 配合 <source> 标签可通过媒体查询提供完全不同的裁剪图片或下一代格式（如 WebP/AVIF）。',
      thinkingProcess: '1. 业务痛点：如果直接给移动端加载大图，不仅流量浪费，更会导致移动端页面首次渲染和解码出现严重卡顿；反之如果加载 300px 的图在 iMac 高清屏上会模糊不清。\n2. 原理解析：需要区分 srcset 宽度选择器（w）以及物理倍率选择器（1x, 2x），还有用于美术裁剪（Art Direction）和多格式优雅降级的 <picture> 标签。',
      deepDive: '1. 设备像素比 (DPR) 适配 (1x / 2x / 3x)：\n<img src="logo-1x.png" srcset="logo-2x.png 2x, logo-3x.png 3x" alt="Logo">\n\n2. 屏幕宽度与视口比例自适应 (w 描述符与 sizes)：\n<img src="fallback.jpg" srcset="pic-320w.jpg 320w, pic-640w.jpg 640w, pic-1024w.jpg 1024w" sizes="(max-width: 600px) 100vw, 50vw" alt="Banner">\n当视口宽度小于 600px 时，图片显示宽度占视口宽度的 100vw，否则占 50vw。浏览器会结合当前屏幕的 DPR（如 2.0），计算出需要的物理像素宽度，并在 srcset 中挑选不小于该宽度的、最接近且最小的图片下载。\n\n3. <picture> 标签与高级控制：\n- 美术裁剪 (Art Direction)：移动端需要看竖版裁剪，PC 看宽屏全景，可以用媒体查询加载完全不同的裁切图。\n- 下一代格式降级：优先使用 avif/webp，若都不支持则退回到 jpeg。\n<picture>\n  <source srcset="image.avif" type="image/avif">\n  <source srcset="image.webp" type="image/webp">\n  <img src="image.jpg" alt="响应式大图">\n</picture>',
      structured: [
        'srcset 1x/2x：针对固定物理尺寸下的不同高分屏屏幕密度（DPR）进行图源自适应',
        'srcset w + sizes：针对流式宽度下，声明图片实际宽高和媒体查询匹配规则，交由浏览器抉择最省流量图源',
        'picture 标签：用于多类型艺术裁剪（Art Direction）或实现新图片格式（AVIF/WebP）的优雅降级',
        '核心效益：削减移动端无意义的宽频超大图流量消耗，提升网页的首次内容绘制时间 (FCP)'
      ]
    },
    keyPoints: ['srcset', 'sizes', 'picture标签', '设备像素比 DPR', 'WebP/AVIF 优雅降级', '首屏性能'],
    traps: ['使用 srcset 宽度描述符（如 640w）时，绝对不要在 sizes 属性里使用诸如 px 的静态单位，它必须是描述图片在视口中所占百分比（如 50vw、100vw）或配合媒体查询的复合描述，否则浏览器无法正确做出下载分配决策'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_026',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Subgrid 网格布局嵌套',
    difficulty: 3,
    frequency: 3,
    question: '什么是 CSS Subgrid？它是如何解决嵌套网格（Nested Grid）中行或列对齐问题的？',
    answer: {
      short: 'Subgrid 允许子网格（嵌套网格）直接继承并复用其父网格的轨道定义（Rows 或 Columns），使不同网格容器中的子元素能够跨越父边界完美对齐。',
      thinkingProcess: '1. 规范演进：在 CSS Grid 1.0 中，如果一个 Grid 单元格里嵌套了另一个 Grid 容器，子 Grid 的内部轨道尺寸无法得知父 Grid 其他列的宽度，只能独立进行排版，导致卡片标题与描述很难上下行对齐。\n2. Subgrid 原理：Subgrid 是 Grid Level 2 引入的规范。当在子网格上声明 grid-template-columns: subgrid 时，子网格的列数和各列宽度会自动对齐它所占据的父网格的列划分，实现极其精确的对齐效果。',
      deepDive: '在没有 Subgrid 的时代，要让嵌套子组件（如多个商品卡片中的价格和按钮部分）在高度不一致的卡片中完全水平对齐，需要写死固定高度或写 JS 监听高度。而在 Subgrid 中：\n.parent-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto auto auto; \n}\n.card {\n  grid-row: span 3;\n  display: grid;\n  grid-template-rows: subgrid; /* 行尺寸直接与父网格各行对齐 */\n}\n这样，即便第一个卡片的内容长、第二个卡片内容短，它们各自的内容区高度依然会以这组卡片中最高的内容高度自动看齐，标题和底部的按钮也保持在同一水平线上，完全由浏览器渲染层处理。',
      structured: [
        '痛点：传统的嵌套 Grid 中，子网格的轨道划分独立于父网格，多栏对齐困难',
        '原理：声明 subgrid 能够让子组件直接绑定并利用父网格的行列线',
        '声明形式：grid-template-columns: subgrid 或 grid-template-rows: subgrid',
        '兼容性：主流现代浏览器已全面原生支持'
      ]
    },
    keyPoints: ['Subgrid', '嵌套网格', '轨道对齐', 'CSS Grid'],
    traps: ['Subgrid 会继承父网格在该区域定义的 gap (间距)。如果想在子网格使用不同的间距，需要显式在子网格上书写新的 gap 属性覆盖继承值'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_027',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'inline-block 间隙之谜与消除技巧',
    difficulty: 1,
    frequency: 4,
    question: '当两个元素设置 display: inline-block 并排排列时，它们之间为什么会产生大约 4px 的空隙？如何彻底消除这个间隙？',
    answer: {
      short: '因为浏览器将 HTML 代码中的换行符和空格解析为一个空白字符；消除方法包括：将父元素 font-size 设为 0、将 HTML 标签紧贴着写不换行、或者使用 Flex 布局替代。',
      thinkingProcess: '1. 渲染原理：在常规文档流中，inline 和 inline-block 元素会被当成文本字符对待。换行和空格在文本节点中，会被合并并渲染成一个字距宽度的间隙（通常在默认 font-size 下为 4px 到 8px 之间）。\n2. 实用方案：最完美的现代方案是直接抛弃 display: inline-block 布局，全部升级为 display: flex；但在特定古老项目里，调整父级 font-size: 0 或者在 HTML 中把节点尾部连着头部写依然是高频的解决办法。',
      deepDive: '消除 inline-block 间隙的几种核心方案：\n1. HTML 标签连写（不推荐，影响可读性）：\n<div class="box"></div><div class="box"></div>\n2. 父级字体归零法：\n.parent { font-size: 0; }\n.child { display: inline-block; font-size: 14px; }\n3. 升级为 Flex/Grid 容器（推荐的首选最佳实践）：\n.parent { display: flex; }',
      structured: [
        '原因：inline-block 本质拥有字符特性，HTML 的换行折行被合并为一个空白字符',
        '方法一：父容器设置 font-size: 0，子容器单独重置正常 font-size',
        '方法二：去除 HTML 标签之间的空格或换行符号',
        '最佳实践：直接改用现代 Flexbox 弹性盒子布局'
      ]
    },
    keyPoints: ['inline-block', '空白折叠', 'font-size:0', 'Flexbox'],
    traps: ['若使用父级 font-size: 0 方案，如果子元素内部使用了 em 作为相对长度单位，那么子元素的 1em 也会变成 0，导致所有基于 em 的尺寸塌陷，必须特别防范'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_028',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'Shadow DOM 样式隔离与 CSS 变量穿透',
    difficulty: 4,
    frequency: 3,
    question: 'Shadow DOM 能够完美物理隔离外部样式。若想给 Shadow DOM 内部组件穿透定制特定的样式或颜色，有哪些原生的方式可以做到？',
    answer: {
      short: '主要可以通过三类原生方式：利用 CSS 自定义属性（CSS 变量）天然的穿透继承能力、使用 ::part() 伪元素穿透暴露、以及利用已废弃的 ::shadow 或 /deep/（现代浏览器已不支持）。',
      thinkingProcess: '1. 规范理解：Shadow DOM 设立的宗旨是严格封装，禁止外部破坏内部，但在实际工程里，外部需要具备定制内部组件样式的能力（如主题颜色定制）。\n2. 原理深究：CSS 变量（Custom Properties）具有继承属性，它们不受 Shadow Boundary 的阻隔。只要内部组件使用了 color: var(--theme-color)，外部在全局或父级容器定义了 --theme-color，内部即可轻松渲染并响应。',
      deepDive: '1. CSS 变量继承（首选方案）：\nShadow DOM 会阻止普通的选择器（如 .title）渗透，但不会阻止继承性属性的传递，包括原生 CSS 变量。如果在外部定义：\nmy-web-component { --primary-color: #ff5722; }\n在 Web Component 内部的 Shadow DOM 样式中直接读取 var(--primary-color)，即可无痛实现主题穿透绑定。\n\n2. CSS ::part 伪元素（精细化样式修改）：\n在 Shadow DOM 内部模版中，为需要暴露的元素标记 part 属性：\n<button part="action-btn">提交</button>\n在外部全局 CSS 中，可以直接对该组件的特定部位选择重写：\nmy-web-component::part(action-btn) { background-color: blue; border-radius: 4px; }',
      structured: [
        '样式边界：Shadow DOM 默认具有封闭性，外部选择器无法穿透渲染',
        '变量透射：利用 CSS Variables 的天然继承链条，可顺利跨越影子边界',
        '::part 选择器：组件内部标记 part，外部用双冒号 ::part(name) 进行精细控制',
        '注意：::part() 伪元素中只能修改预先暴露出处的样式，无法获取影子内部更深层的私有 DOM'
      ]
    },
    keyPoints: ['Shadow DOM', '::part', 'CSS 变量', '样式穿透', 'Web Components'],
    traps: ['不要在主流项目里继续使用 /deep/、>>> 或 ::shadow 伪类，这些选择器在现代规范中已经被废弃，并且早已被 Chrome 等现代浏览器内核彻底移除了支持'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_029',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS will-change 属性与内存占用',
    difficulty: 4,
    frequency: 4,
    question: 'will-change 属性的作用是什么？它是如何工作的？为什么在日常开发中不能对大量元素滥用 will-change？',
    answer: {
      short: 'will-change 用于提前告知浏览器该元素将发生哪些变化，促使浏览器提前为该元素建立独立的合成层并预先进行加速计算；滥用会导致大量显存（GPU VRAM）被长期占用，反而使网页卡顿。',
      thinkingProcess: '1. 渲染原理：深入 GPU 加速与内存管理。\n2. 机制分析：浏览器做硬件加速是在元素开始变换时临时创建图层。will-change 相当于告诉浏览器“我这个按钮马上要旋转了，请你现在就把图层分好，分配好 GPU 显存”。当动画开始时就能达到零闪烁的流畅切换。\n3. 滥用惩罚：图层（Layer）在显存里储存为未压缩的 RGBA 像素位图。如果对页面里几百个卡片都加上 will-change: transform，显存很快就会被占用完毕，导致卡顿。',
      deepDive: '1. will-change 机制：\n它是一项前置性渲染优化机制。当声明 will-change: transform 时，浏览器会强行将这个元素提到 GPU 的独立合成层（Composite Layer）中，并为它的动画重绘做好准备。这可以避开动态提层时的渲染开销，从而达到零延迟流畅。\n\n2. 最佳实践规则：\n- 用完即删：只在需要发生动画的元素上临时添加 will-change，在动画结束后立刻移除。\n- 只在确实发生掉帧卡顿的复杂交互组件使用，不要在静态组件上预先优化。\n- 留给浏览器时间：建议在 hover 悬停时添加，在 click 或动画触发前分层完毕。',
      structured: [
        '定义：提前警示属性，告知浏览器某元素将执行高频动画',
        '原理：将元素强制提到硬件层，开辟专有 GPU 显存进行位图缓存，换取动画零闪烁',
        '致命缺陷：位图占用显存极大，滥用会导致移动设备显存迅速耗尽而崩溃',
        '守则：只对卡顿组件使用、在动画前悬停时添加、动画完毕及时通过 JS 撤销 will-change'
      ]
    },
    keyPoints: ['will-change', '合成层', '显存消耗', '图层创建', '硬件加速'],
    traps: ['绝对不要在全局样式表中写 * { will-change: transform, opacity; }。这行代码在复杂页面下能够瞬间让电脑风扇狂飙并把手机浏览器卡退'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_030',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'Flexbox 多行换行对齐：align-content 与 align-items 对比',
    difficulty: 2,
    frequency: 4,
    question: '在 Flex 布局中设置 flex-wrap: wrap 允许换行后，align-items 和 align-content 的对齐行为有什么区别？',
    answer: {
      short: 'align-items 控制每一单行内部子元素相对于当前行的垂直居中；align-content 控制多行之间在交叉轴上的整体间隔分布，对单行 Flex 容器无效。',
      thinkingProcess: '1. 经典混淆点：这是每个初中级前端在排版换行卡片列表时，经常遇到的行间距为什么很大的终极根源。\n2. 概念解析：单行 Flexbox 里，align-items 是绝对的主角；而一旦开启 flex-wrap: wrap 产生多行，align-items 依然只负责各自行的子元素对齐，而多行之间的排布会由 align-content 整体控制。',
      deepDive: '1. align-items：\n作用范围为单行。决定了每个单行内部的子元素在中线、基线或首尾端如何进行纵向对齐，完全不管行与行之间的空隙。\n\n2. align-content：\n作用范围为多行。它把整个 Flexbox 的多行看作是多条轨道线，决定这些轨道线如何去瓜分侧轴容器的全部多余高度。可设值包括 flex-start、flex-end、center、space-between 等。若 flex-wrap 为 nowrap（不换行），则 align-content 完全被忽略。',
      structured: [
        'align-items: 单行层级控制，决定同一行内子项的侧轴相对对齐',
        'align-content: 多行整体控制，决定换行后的多行之间该如何瓜分侧轴纵深高度',
        '关系类比：align-content 之于交叉轴，就如同 justify-content 之于主轴',
        '日常坑点：换行列表如果出现行间距过大，请在父级设置 align-content: flex-start'
      ]
    },
    keyPoints: ['align-items', 'align-content', 'flex-wrap', '弹性对齐', '换行间距'],
    traps: ['如果设置了 flex-wrap: wrap 但父容器没有固定的 height 属性，由于没有盈余的侧轴高度，align-content: center 也不会看到多行挤到中间的效果，必须配合高容器才会生效'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_031',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Transition 与 Animation 性能与场景对比',
    difficulty: 3,
    frequency: 4,
    question: 'CSS transition（过渡）和 animation（动画）有什么区别？在做动画性能优化时，如何决定使用哪一个？',
    answer: {
      short: 'transition 是触发式的双状态平滑渐变，不能循环或定义多帧；animation 是自主运行的多帧关键帧动画，支持循环、反向播放等复杂逻辑；二者在性能上相当，主要取决于是否需要多状态控制和自动循环。',
      thinkingProcess: '1. 概念对比：一个是“两点过渡”（A状态到B状态，由JS或hover等外界条件触发），一个是“时间轴动画”（可脱离交互自动运行，基于关键帧 keyframes 包含复杂过程）。\n2. 性能核心：两者本身性能在现代引擎中等同。真正的性能决定因素是动画作用的属性（是否触发回流重绘）和是否开启了 GPU 硬件加速。',
      deepDive: '1. CSS Transition：\n需要状态触发器。只有起止两个状态点，不支持多帧。常用于按钮 Hover 变色缩放、弹窗平滑拉起等单次渐变。\n\n2. CSS Animation：\n配合 @keyframes 可以定义任意 0%-100% 阶段的关键帧；支持 animation-iteration-count 进行循环、animation-fill-mode 决定状态保留等。适合 Loading 持续旋转、复杂逐帧动画等不需要依赖主动触发的持续交互动作。',
      structured: [
        'transition: 单次、触发式、两点渐变（A -> B）',
        'animation: 自动、多状态、多属性关键帧控制（A -> B -> C -> A）',
        '性能共性：性能不取决于 transition 还是 animation 标签本身，而取决于动画改变的物理属性是什么',
        '首选优化：优先改变 transform 和 opacity，绕开 Layout 和 Paint 管线'
      ]
    },
    keyPoints: ['transition', 'animation', '@keyframes', '插值过渡', '图层合成'],
    traps: ['使用 transition 做隐藏动画时，如果尝试对 display 属性做过渡（如 display: none 变 block）会发现完全没有渐变效果，因为 display 是布尔类型突变属性，不支持数学插值，应当用 visibility/opacity 替代'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_032',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '打印样式表（Print CSS）优化实战',
    difficulty: 2,
    frequency: 3,
    question: '在医疗系统、财务系统等后台管理网页中，如何通过 CSS 优化页面的打印表现（如一键打印发票、病历表）？请列出常用的 Print 媒体查询与控制技巧。',
    answer: {
      short: '利用 @media print 编写专用打印样式；技巧包括隐藏页眉页脚（如 @page { margin: 10mm; }）、隐藏非打印组件（display: none）、强制分页控制（break-inside: avoid）以及将文字颜色设为黑白。',
      thinkingProcess: '1. 业务场景：企业级应用常有打印报表、订单凭证的需求。如果直接打印普通网页，常常由于包含无关的顶部导航和背景色而导致打印排版非常混乱。\n2. 打印控制：使用 @media print 覆写全局样式，并利用专门的打印分页规范（如 break-inside: avoid 防止行被切碎）。',
      deepDive: '1. 声明打印媒体查询：\n@media print {\n  .header, .sidebar, .print-btn { display: none !important; }\n  .main-content { width: 100% !important; margin: 0 !important; }\n  body { color: #000 !important; background: #fff !important; }\n}\n\n2. 分页控制：\ntr, .invoice-card {\n  break-inside: avoid; /* 强令该区块不能被跨页切碎，必须作为一个整体印在某张纸上 */\n}\n.next-section {\n  break-before: always; /* 强令在此之前分页 */\n}\n\n3. 消除浏览器水印：\n@page { size: auto; margin: 10mm; }',
      structured: [
        '媒介选择：@media print { ... } 专门在打印机解析时覆盖全局 CSS',
        '降噪去杂：display: none 剔除所有网页专属控件，黑白色系覆写',
        '防断控制：break-inside: avoid 杜绝多行表格单行被强行切碎至两页印出的惨剧',
        '页边距擦除：@page { margin: 10mm } 处理系统默认页眉页脚网址水印'
      ]
    },
    keyPoints: ['@media print', '分页控制', 'break-inside', '打印排版', '@page'],
    traps: ['网页的背景图片和颜色在默认打印设置下一般会被浏览器自动忽略以节省墨水。如果发票中有重要的彩色盖章或背景，需要设置 -webkit-print-color-adjust: exact; 强制打印色彩'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_033',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'Web 字体加载优化与 font-display 策略',
    difficulty: 3,
    frequency: 3,
    question: '在使用自定义字体（Web Font）时，如何避免字体未加载完成时的白屏或闪烁？请详细说明 font-display 属性的作用和各值区别。',
    answer: {
      short: '自定义字体加载慢会导致 FOUT（闪烁无样式字体）或 FOIT（白屏无文字）；通过 font-display 属性可以控制字体加载期内的替换展现行为，推荐使用 font-display: swap 让无样式默认文字先行展示。',
      thinkingProcess: '1. 用户体验：这也是性能指标之一（CLS 累积布局偏移）。如果使用大型中文字体包，在首屏网络未拉取完毕前，网页会呈现空白（FOIT）或先用默认字体然后突变到艺术字（FOUT）。\n2. font-display 原理：它是 CSS 自带的字体渲染生命周期控制阀，将字体加载过程切分为“阻塞期”、“过渡期”和“失效期”。',
      deepDive: 'font-display 的参数值对比：\n- auto：采用浏览器默认的阻断展示逻辑（多数浏览器默认阻断 3s）。\n- block：强FOIT。阻塞期 3s，没有过渡期。网页哪怕白屏 3s 也要等该字体渲染。\n- swap：强FOUT。阻断期为 0s。先以本地默认字形垫底，字体包下载完毕后动态强制重绘更新。保障了文字内容以最快速度投射出来。\n- fallback：折中方案。极短阻断期（100ms），约 3s 过渡期，超时不再替换。\n- optional：极佳性能。100ms 内下载完就用，没下完直接永远放弃，完全杜绝后期文字替换带来的视觉晃动。',
      structured: [
        'FOIT：字体未加载完成时文本呈隐藏白屏状，严重损害 FCP 指标',
        'FOUT：字体未加载完成时先显示默认后备字体，载入后突变替换，会造成 CLS 抖动',
        'font-display: swap：不阻断，以默认字体垫底，载入即替换，首选用户体验',
        'font-display: optional：极短阻断期，下不完直接放弃，零重绘抖动，性能优化极品'
      ]
    },
    keyPoints: ['font-display', 'FOIT / FOUT', '字体子集化', '首屏性能', '后备字体'],
    traps: ['即使设置了 font-display: swap 解决了白屏，如果自定义字体的字宽和系统默认后备字体的字宽差异过大，在字体替换的一瞬间仍会造成页面段落换行、整体高度剧烈晃动，应该配合后备字体微调器调整其尺寸比例'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_034',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'HTML5 微数据（Microdata）与 SEO 结构化标记',
    difficulty: 2,
    frequency: 3,
    question: '什么是 HTML5 微数据（Microdata）？它是如何帮助搜索引擎提取网页富摘要（Rich Snippets）的？',
    answer: {
      short: '微数据是 HTML 规范中通过指定标签属性（itemscope、itemtype、itemprop）提供机器可读元数据的机制；能帮助搜索引擎直接在搜索结果中渲染评分、价格、活动时间等富摘要信息。',
      thinkingProcess: '1. 技术维度：SEO 高级技术。通过微数据可以直接将数据的含义在 HTML 标签中指明，减少搜索引擎的自然语言分析成本。\n2. 原理剖析：搜索引擎喜欢符合格式约定的元信息卡片。',
      deepDive: '微数据三大属性：\n- itemscope：创建一个条目（Item），声明该 DOM 容器代表一个特定的结构化实体。\n- itemtype：规定该条目的数据模型类型。如 http://schema.org/Product (商品) 或 http://schema.org/Recipe (菜谱)。\n- itemprop：为条目添加具体的属性键值（如 name, price, ratingValue）。\n\n代码示例（向搜索引擎标明一本书）：\n<div itemscope itemtype="http://schema.org/Book">\n  <h1 itemprop="name">三体</h1>\n  <span>作者：<span itemprop="author">刘慈欣</span></span>\n</div>\n搜索引擎解析后会将其渲染为包含评分和作者的卡片富摘要（Rich Snippets），提高搜索 CTR。',
      structured: [
        '概念：根据内容的结构和含义，选择语义匹配的 HTML5 标签',
        '避免 div 滥用：div 无任何实际语义，对分析器而言是黑盒',
        'SEO：让搜索引擎算法更容易提取页面的权重区域和核心内容',
        '无障碍辅助：为盲人读屏软件提供页面结构路标导航'
      ]
    },
    keyPoints: ['微数据', 'SEO 优化', '结构化数据', 'schema.org', 'JSON-LD', '富摘要'],
    traps: ['微数据的属性值必须符合 schema.org 中 itemtype 所规定的词典格式（如价格必须为数字，日期必须为 ISO 格式），否则搜索引擎在格式验证时会直接忽略'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_035',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '跨浏览器滚动条样式定制与流畅度优化',
    difficulty: 2,
    frequency: 3,
    question: '如何为网页或特定容器定制符合 UI 设计的滚动条样式？如何避免滚动时出现卡顿并保证滚动的流畅度？',
    answer: {
      short: '使用 Webkit 专属伪类（::-webkit-scrollbar）和 Firefox 标准属性（scrollbar-color/width）组合适配；为保证流畅度，应开启 CSS 平滑滚动（scroll-behavior: smooth）并在复杂滚动区块上应用 will-change 优化重绘。',
      thinkingProcess: '1. 兼容难点：滚动条样式是非标准兼容历史遗留问题，各家浏览器做法迥异。\n2. 适配思路：WebKit 内核使用 ::-webkit-scrollbar 家族伪类；Firefox 在新规范中推出了 scrollbar-width 和 scrollbar-color 两个正式属性。',
      deepDive: '1. WebKit 滚动条样式定制 (Chrome/Safari)：\n.scroll-container::-webkit-scrollbar { width: 8px; }\n.scroll-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }\n.scroll-container::-webkit-scrollbar-track { background: #f1f1f1; }\n\n2. Firefox 滚动条定制：\n.scroll-container { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) #f1f1f1; }\n\n3. 流畅度调优：\n- 移动端开启惯性滚动：-webkit-overflow-scrolling: touch;\n- 平滑过渡：scroll-behavior: smooth;\n- 绑定 scroll 事件时确保 passive: true 以解绑 preventDefault 拦截检查，防止主线程死锁。',
      structured: [
        'WebKit 内核：::-webkit-scrollbar 系列伪类（支持宽度、圆角、背景精细定制）',
        'Firefox 浏览器：scrollbar-color & scrollbar-width 核心属性进行基础粗细和色值适配',
        '平滑回弹（移动端核心）：-webkit-overflow-scrolling: touch 触发弹性渲染',
        'JS 监听优化：passive: true 参数解除默认事件预防拦截以防滚动延迟掉帧'
      ]
    },
    keyPoints: ['::-webkit-scrollbar', 'scrollbar-color', 'scroll-behavior', 'passive 监听', '惯性滚动'],
    traps: ['自定义滚动条会挤占内容区宽度。如果页面在“无滚动条”和“出现滚动条”之间来回切换，会导致页面内容发生宽度抖动，可通过 scrollbar-gutter: stable; 提前预留空间解决'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_036',
    mode: 'study',
    domain: 'interview',
    type: 'follow_up',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Aspect-ratio 属性与累计布局偏移（CLS）优化',
    difficulty: 2,
    frequency: 4,
    question: 'CSS 的 aspect-ratio 属性有什么作用？它与传统的利用 padding-top 实现等比例宽高盒子（Padding Hack）相比有什么优势？如何通过它解决页面的 CLS（累计布局偏移）指标问题？',
    answer: {
      short: 'aspect-ratio 直接原生指定元素的纵横比（如 16/9），不需要借助于 padding Hack；在弱网大图加载前它能让浏览器提前在渲染流中占好比例高度，防止大图载入后页面突然下沉抖动（消除 CLS）。',
      thinkingProcess: '1. 演进演进：传统的等比例宽高盒子（如 16:9 响应式卡片）需要使用 padding-top: 56.25% 并对子元素做 absolute 定位。写起来复杂且不直觉。\n2. 原理本质：aspect-ratio: 16 / 9 的出现终结了这一复杂的做法，使子元素可以正常书写排列。',
      deepDive: 'Aspect-ratio 现代规范写法：\n.ratio-box {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n}\n相比于 Padding Hack，它无需子元素 absolute 定位撑满，代码非常清爽。\n\nCLS 优化原理：\n在网页性能核心指标中，CLS（Cumulative Layout Shift）权重非常大。如果图片标签只有 width: 100%，浏览器在未下完大图时高度定位为 0 像素。图片下载成功后高度突增，会引发剧烈的排版挤压抖动。而设置了 aspect-ratio: 16/9 后，浏览器在图片下载完成前即可根据宽度算出对应的高度预留好空间，实现 CLS 归零。',
      structured: [
        '作用：指定原生的比例盒子（如 aspect-ratio: 16 / 9），不需要脱标定位',
        '淘汰 Padding Hack：告别 padding 百分比父容器嵌套与绝对定位写法，代码精简 60%',
        'CLS 调优：图片标签只写宽度配合 aspect-ratio，可在图源未载入时占领排版高度，阻断页面抖动',
        '联合属性：可以配合 min-height 或 max-height 使用，拥有合理的自适应边界'
      ]
    },
    keyPoints: ['aspect-ratio', 'CLS', 'Padding Hack', '响应式高度', '布局偏移'],
    traps: ['若元素同时显式指定了具体的 width 和 height 属性值，aspect-ratio 属性自动失效，高度将直接遵从显式指定的大小'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_037',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '容器查询（Container Queries）实战',
    difficulty: 4,
    frequency: 3,
    question: '容器查询（Container Queries）和媒体查询（Media Queries）有什么根本区别？请给出一个使用容器查询实现同一个卡片组件在不同宽度容器中自动变化排版的典型场景。',
    answer: {
      short: '媒体查询基于整个浏览器视口（Viewport）的宽度进行样式响应；容器查询基于该组件最近的“父级容器”的宽度变化进行样式响应，极大提升了通用型 UI 组件在不同宿主环境下的自适应能力。',
      thinkingProcess: '1. 革命性进步：这是 CSS 最近几年最重要的规范升级之一，被很多前端专家誉为“响应式设计的下半场”。\n2. 痛点重现：一个商品卡片组件，在主页面显示为“左图右文”横排，在侧边栏显示为“上图下文”竖排。若用媒体查询由于两者处于相同视口宽下，难以使用相同类名区分。容器查询可以完美完美解决。',
      deepDive: '1. 声明级联容器：\n.card-wrapper {\n  container-type: inline-size; /* 声明基于该容器的横向尺寸做查询基准 */\n  container-name: card-container; \n}\n\n2. 默认排版及容器断点过渡：\n.card-item { display: flex; flex-direction: column; }\n\n@container card-container (min-width: 400px) {\n  .card-item { flex-direction: row; gap: 16px; }\n}\n这使组件做到了高内聚和自适应，扔进任何父栏目中都能根据实际真实空间来调整排版，不依赖外部页面样式的强行覆盖。',
      structured: [
        '媒体查询缺点：只能侦测视口大局，无法适配同一页面里不同位置的相同组件',
        '容器查询优势：基于宿主父容器的真实空间宽度，实现真正的“组件自治”',
        'container-type: inline-size: 声明容器在主轴宽度方向上需要被监听',
        '@container：取代 @media，编写局部断点样式逻辑'
      ]
    },
    keyPoints: ['容器查询', 'container-type', '@container', '自适应组件', '响应式下半场'],
    traps: ['当对一个元素设置了 container-type 后，该元素会产生尺寸限制隔离特性。其内部的子元素无法撑开该父容器的高度，必须小心处理容器自身的高度流排版'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_038',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: '现代 CSS 色彩空间（OKLCH、LCH vs sRGB）',
    difficulty: 4,
    frequency: 2,
    question: 'CSS Color 4 规范中引入了 OKLCH、LCH 等色彩空间。它们与传统的 sRGB（hex、rgb、hsl）色彩空间相比有什么本质改进？OKLCH 中的三个维度各代表什么？',
    answer: {
      short: 'sRGB 色彩空间并非“感知均匀”的，调整色相或明度会导致人眼感知的亮度发生突变；LCH/OKLCH 是基于人眼视觉特性的“感知均匀”色彩空间，OKLCH 的维度包括 Lightness（明度）、Chroma（彩度）和 Hue（色相），能提供一致的视觉亮度和更宽广的色域支持。',
      thinkingProcess: '1. 前沿探索：这是 CSS3/CSS4 色彩学的高级问题，常用于 UI 系统自动计算配色色阶。\n2. 痛点阐释：在 HSL 空间下，同样设置 lightness: 50% 的黄色和蓝色，黄色会非常刺眼，而蓝色却暗得看不清，因为 HSL 只是纯物理数学模型，没有考虑人类对不同光线敏感度的生理特征。OKLCH 对此进行了补偿。',
      deepDive: 'OKLCH 语法与参数：\noklch(L C H [/ A])\n- L (Lightness)：0.0 到 1.0，代表感知明度。在 OKLCH 下，L=0.6 的蓝色和 L=0.6 的黄色在人眼中具有完全等同的视觉亮度和辨识度。\n- C (Chroma)：彩度（纯度），表示颜色中纯色的浓度。通常极限在 0.4 左右。\n- H (Hue)：色相环角度（0 - 360 度），从红黄绿蓝过渡。\n\n由于感知明度等比的特点，在做系统的 Hover 状态、Disable 状态时，只需要微调 L 属性，Chroma 和 Hue 保持不动，就能确保所有背景色的文字都具有等同的易读性，完全免去写死各种 Hex 值的主观尝试。且 OKLCH 支持现代广色域屏幕的高级渲染支持。',
      structured: [
        'sRGB 瓶颈：HSL/RGB 没有考虑人类对绿色波长高度敏感对蓝波敏感度低的生物事实，亮度计算不符合生理直觉',
        'OKLCH 革命：基于人眼感官视网膜优化，相同明度指标在任何颜色下，视觉亮度完全等同',
        '参数释义：L (Lightness, 明度 0-1)；C (Chroma, 彩度 0-0.4+)；H (Hue, 色相 0-360)',
        '工程价值：利用算法自动动态构建 UI 辅助状态调色板时，不会再发生色彩失真与偏色'
      ]
    },
    keyPoints: ['OKLCH', '色彩空间', '感知均匀', '广色域', 'Design System', 'HSL'],
    traps: ['OKLCH 是新规范。在极古老的设备上无法识别，需使用 postcss-oklab 插件进行向后兼容 hex 的转换'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_039',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: '原生 CSS 嵌套（CSS Nesting）规范',
    difficulty: 2,
    frequency: 4,
    question: '现代浏览器已经原生支持 CSS 嵌套。请简述原生 CSS 嵌套的语法规则以及它与 Sass/Less 等预处理器的嵌套有什么异同？',
    answer: {
      short: '原生 CSS 嵌套允许将子选择器直接写在父选择器大括号内，不再必须使用 & 符号；原生嵌套在运行时由浏览器直接解析，不需要经过任何打包编译，性能和排查错误体验更好。',
      thinkingProcess: '1. 时代进化：曾经大家用 Webpack/Vite 编译 Sass/Less，核心理由之一就是为了嵌套写法。如今嵌套已经成为 W3C 的原生 CSS 标准规范。\n2. 原理规则：原生嵌套的结构会在浏览器控制台直接显示，并挂载在 CSSOM 树的嵌套分支中，大大减小了样式文件自身的体积。\n3. 注意：原生嵌套的 & 符号必须是完整的独立选择器，不能像 Sass 一样做字符串片段拼接（如 &-item）。',
      deepDive: '1. 原生 CSS 嵌套语法：\n.card {\n  background-color: white;\n  padding: 16px;\n  .title { font-size: 18px; } /* 原生嵌套子类名 */\n  p { color: #666; }          /* 原生嵌套元素 */\n  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); } /* 伪类状态关联 */\n}\n\n2. 与预处理器的本质差异：\n- 运行机制：Sass 嵌套属于编译期静态平展生成长选择器，增加冗余代码；原生嵌套在运行时由 CSSOM 原生挂载维护树结构。\n- 拼接限制：Sass 支持强大的类名片段拼接，如 .menu { &-item { ... } }，编译为 .menu-item。原生嵌套只支持完整选择器拼接，&-item 会直接被浏览器视作非法抛弃。',
      structured: [
        '基本语法：允许将类名、标签、伪类样式规则嵌套在父级块级括号中',
        '无需编译：浏览器内核渲染引擎直接解析嵌套格式，降低项目对预编译器的绝对依赖',
        '& 拼接限制：Sass 支持 .menu { &-item { ... } }，原生 CSS 只支持完整的节点拼接，如菜单悬停 &:hover',
        '支持情况：目前主流现代浏览器（Chrome 112+, Safari 16.5+, Firefox 117+）已 100% 原生支持'
      ]
    },
    keyPoints: ['CSS 嵌套', '& 占位符', 'CSSOM 树', 'Sass对比', '代码体积优化'],
    traps: ['不要在原生嵌套中写如 .parent { &-suffix { ... } } 来妄图拼接类名，这在浏览器解析时会被判定为无效规则而丢弃，若必须拼接仍需保留 Sass'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_040',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'HTML5 原生表单校验机制与交互优化',
    difficulty: 2,
    frequency: 3,
    question: '如何利用 HTML5 原生的表单属性（如 required, pattern, min/max）进行无 JS 辅助的前端校验？当校验失败时，如何通过 CSS 伪类动态美化错误提示状态并阻止提交？',
    answer: {
      short: '通过在 input 上配置 required、type、pattern（正则）属性，浏览器会自动阻止表单提交并弹出提示；在 CSS 中可使用 :invalid、:valid、:placeholder-shown 伪类在用户输入过程中动态高亮校验状态。',
      thinkingProcess: '1. 实用场景：如果每个输入表单都要写几十行 JS 去正则验证并动态加 error-class，不仅冗余而且在提交表单时会有卡顿。HTML5 已经内置了高度成熟的底层表单校验（Constraint Validation）。\n2. 校验反馈：CSS 提供了极为丰富的校验状态伪类，可以实现当输入不合法时输入框变红。同时使用 :not(:placeholder-shown) 能够防止空表单初始渲染时报错。',
      deepDive: '1. HTML5 校验配置：\n<input type="email" required placeholder=" " />\n<input type="text" pattern="^[0-9]{6}$" required placeholder=" " />\n\n2. CSS 动态无缝状态美化：\n/* 只有在用户输入了字符且不合法时，才高亮红框，避开初始空状态 */\ninput:not(:placeholder-shown):invalid {\n  border-color: #ff4d4f;\n  background-color: #fff2f0;\n}\ninput:not(:placeholder-shown):valid {\n  border-color: #52c41a;\n}\n\n3. 阻止原生弹出气泡的 JS 定制：\nemailInput.addEventListener(\'invalid\', function (e) {\n  e.preventDefault();\n  this.setCustomValidity(\'请输入您格式正确的企业电子邮箱！\');\n});',
      structured: [
        '原生理念：用最少的 JS，依靠浏览器原生属性（required、pattern、min/max）筑牢表单第一关',
        'CSS 伪类：:invalid (无效输入)、:valid (有效输入)、:user-invalid (代表用户交互过的无效状态)',
        '精细交互：input:not(:placeholder-shown):invalid 可在用户输入初始状态阶段免于报错红框预警',
        '阻止机制：只要 form 内部有任一 input 不满足约束，系统自动阻止 submit 事件并锁定提交'
      ]
    },
    keyPoints: ['表单校验', ':invalid', 'pattern属性', 'setCustomValidity', '用户体验'],
    traps: ['原生表单校验的系统提示气泡在不同的操作系统和浏览器上长相风格完全不同，如果对 UI 统一性要求极严，需要使用 preventDefault 屏蔽系统提示并用 JS 渲染自定义 Tip'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_041',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS Scroll Snap 滚动吸附实战',
    difficulty: 3,
    frequency: 3,
    question: '如何利用 CSS Scroll Snap 实现一个轮播图（Carousel）或全屏滚动（Fullpage）的无 JS 滚动吸附效果？',
    answer: {
      short: '在父滚动容器上设置 scroll-snap-type，在子元素上设置 scroll-snap-align，浏览器会自动在滚动结束时将子元素对齐到容器指定位置。',
      thinkingProcess: '1. 布局体验：以前实现滚屏吸附或轮播图必须引入 Swiper.js 等重度库，或者写 JS 监听 scroll 事件加 requestAnimationFrame 频繁修改 scrollTop 强行拉拢坐标，会有极严重的掉帧和交互生硬问题。\n2. 原理阐释：Scroll Snap 是 CSS 规范中提供的用于解决这一交互模式的纯排版属性。它直接在浏览器的滚动引擎中计算，能够配合物理惯性滚动达到极其丝滑的回弹吸附。',
      deepDive: 'CSS Scroll Snap 核心属性配置：\n- 父滚动容器：\n.scroll-container {\n  overflow-y: scroll;\n  scroll-snap-type: y mandatory; /* mandatory 代表强制吸附；proximity 代表临界值接近才吸附 */\n  height: 100vh;\n}\n- 子元素（对齐目标）：\n.scroll-slide {\n  height: 100vh;\n  scroll-snap-align: start; /* 对齐边界：start / center / end */\n}\n使用纯 CSS 滚动吸附可以完全脱离 JS 动效监听，即便在极其低配置的手机上也能跑满 60fps。',
      structured: [
        '作用：无 JS 参与的高性能惯性滚动吸附（轮播、全屏滚动专题等）',
        'scroll-snap-type: [axis] [strictness]：父级属性，axis 为 x/y/both，strictness 为 mandatory/proximity',
        'scroll-snap-align: 子级属性，定义吸附时该元素的哪条边与滚动边界对齐（start、center、end）',
        '联合属性：scroll-padding 可以为吸附区域设置内边距，防范顶部固定导航栏遮挡'
      ]
    },
    keyPoints: ['Scroll Snap', 'scroll-snap-type', 'scroll-snap-align', '无JS动画', '滚动优化'],
    traps: ['若子元素的高度超出了父滚动容器的高度，强制 mandatory 会导致用户无法停留在子元素的中途内容上，一松手就会被强行吸附到顶部或底部，对于这种长内容子项，应使用 proximity 降级'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_042',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: '原生 Popover API 核心优势与实践',
    difficulty: 3,
    frequency: 3,
    question: 'HTML5 新推出的原生 Popover 属性有什么作用？它与传统的自定义定位弹出层相比，在渲染机制（如 Top Layer 顶层）和无障碍上有何核心改进？',
    answer: {
      short: 'Popover 是原生弹出层 API，配置 popover 属性和 popovertarget 即可实现无 JS 开闭；它能强制挂载到浏览器的“顶层（Top Layer）”，彻底摆脱父级 overflow:hidden 和 z-index 遮挡的困扰，且天然支持键盘 ESC 键一键关闭。',
      thinkingProcess: '1. 尖端前沿：这是近两年 HTML 语义标签最实用的 API 之一。以前写弹窗或悬浮菜单，经常遇到按钮在表格里，被表格的 overflow: hidden 截断了或者层级被隔壁组件盖住了的问题。\n2. 顶层渲染：Top Layer 是一个特殊的排版通道，挂载在 Top Layer 的元素拥有绝对至高无上的层叠优先级，它脱离了普通文档流的 z-index 和父级 overflow 截断规则，比 body 还要顶层。',
      deepDive: '1. 原生 Popover 的最简配置：\n<button popovertarget="my-menu">打开悬浮菜单</button>\n<div id="my-menu" popover>\n  <h3>这组选项卡挂载在 Top Layer</h3>\n</div>\n\n2. 顶层 (Top Layer) 渲染精髓：\n当 Popover 激活时，浏览器会自动把它提升到一个名为 Top Layer 的虚拟分层通道。在这里，无论它的父元素设置了多么严格的 overflow: hidden;，Popover 都能够毫发无损地悬浮于整个页面最上方渲染。这就终结了以前要借助 React Portal 或 Vue Teleport 将弹窗节点强行抛射到 body 底部的历史。\n\n3. 遮罩层美化 (::backdrop 伪元素)：\n#my-menu::backdrop { background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); }',
      structured: [
        '基本用法：Popover 元素声明 popover 属性，按钮设置 popovertarget 指针即可完成联动',
        'Top Layer 机制：直接脱离常规层叠排布，不屈从父级的 overflow 截断限制，无需 Teleport 传送门',
        '轻量关闭（Light Dismiss）：自动侦听外围空白处点击、或按键盘 ESC 键自动将弹窗关闭',
        '无障碍加持：内置合理的弹出层屏幕阅读器标签绑定，保障无障碍易用性'
      ]
    },
    keyPoints: ['Popover API', 'Top Layer', '::backdrop', 'Teleport 消除', 'Light Dismiss', '无障碍'],
    traps: ['Popover 目前主要负责布局排布和开关交互。关于弹出框与按钮之间的智能定位，仍需配合 CSS Anchor Positioning（锚点定位属性）或使用 JavaScript 测量坐标计算才能做到完美'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_043',
    mode: 'study',
    domain: 'interview',
    type: 'system_design',
    track: 'frontend',
    topic: 'html_css',
    title: '原生 CSS 视图过渡 API（View Transitions API）',
    difficulty: 5,
    frequency: 3,
    question: '什么是 View Transitions API？它是如何允许我们在同一个页面进行 DOM 重构甚至在跨页面（MPA）跳转时，以纯原生级的高性能实现丝滑的元素过渡动画的？',
    answer: {
      short: 'View Transitions 是浏览器原生的转场动画接口，它在 DOM 变化前后分别截取新旧状态屏幕快照，并自动在合成线程生成平滑的淡入淡出、平移等转场过渡；开发者通过 view-transition-name 声明共享元素即可实现转场效果。',
      thinkingProcess: '1. 顶层架构设计：这是前端近年非常惊艳的高性能动画转场方案，在各大技术大会上出场率极高。\n2. 传统痛点：在 SPA 里，如果想做一个点击卡片小图，卡片无缝飞起放大成详情页大图的共享元素动画，代码极其复杂。\n3. 原理剖析：调用 document.startViewTransition(callback)，浏览器会冻结当前页面渲染，捕获旧状态，在回调中更新 DOM，接着捕获新状态，并在 GPU 中对两者进行跨越状态的关键帧补间混合渲染。',
      deepDive: '1. 核心转场生命周期：\n当调用 document.startViewTransition(callback) 后，浏览器捕捉页面旧样式的快照，在回调内完成 DOM 的更新（比如替换节点内容、显示/隐藏组件等），随后捕捉新界面的快照，并在合成线程创建一组伪元素树（如 ::view-transition-old(root) 和 ::view-transition-new(root)），自动对两个快照应用淡入淡出转场效果。\n\n2. 共享元素动画（Shared Element）：\n想让列表页的图片平滑变成详情页的 Banner 头图，只需在两边对应的图片 CSS 上指定相同的原生视图过渡标识名：\n.card-thumbnail { view-transition-name: active-banner; }\n.detail-banner { view-transition-name: active-banner; }\n只要名字一致，浏览器会自动算物理轨迹进行飞越渐变，无需任何复杂的 DOM 计算克隆逻辑。',
      structured: [
        '核心意义：由浏览器在 GPU 合成层直接生成转场过渡，终结了手写 DOM 克隆飞越动画的历史',
        '工作流程：startViewTransition() 触发 -> 截取旧快照 -> 执行回调改 DOM -> 截取新快照 -> 图像平滑插值合成转场',
        '共享元素名称：使用 view-transition-name 关联变化前后的元素，浏览器自动识别两端坐标并执行路径补间动画',
        '跨页转场：目前部分现代浏览器已支持在多页面系统下实现无 JS 配合的原生跨页转场'
      ]
    },
    keyPoints: ['View Transitions API', '共享元素动画', '视图过渡', 'Top Layer', 'GPU 合成', 'MPA 转场'],
    traps: ['view-transition-name 的值在当前页面中必须是独一无二的。如果在列表中对所有的项都写死相同的过渡名字，浏览器由于不知道哪个要发生飞越，会导致动画完全失效，应在点击时动态绑定名字'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_044',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 级联层（@layer）级联规则控制',
    difficulty: 4,
    frequency: 3,
    question: '什么是 CSS 级联层（@layer）？它是如何解决大型项目或第三方库样式相互覆盖冲突问题的？',
    answer: {
      short: 'CSS 级联层允许开发者显式划分不同的样式层级级别（如 base, components, utilities）；即使处于低级层的选择器拥有极高的特异性（如 ID），也无法覆盖高级层级中的基础类名样式，从而彻底解决了第三方库和业务代码的层叠冲突。',
      thinkingProcess: '1. 痛点分析：在没有级联层时，决定样式的优先级只看选择器特异性和文件加载顺序。引入的库样式如果很复杂（如 #menu ul li.active），为了在业务中覆盖它，我们不得不写出更长的选择器甚至使用 !important 强压。这会导致样式权重失去控制。\n2. layer 原理：@layer 建立了全新的图层维度。在比较样式时，浏览器先比元素所在的 @layer 等级；高 layer 里的样式直接压死低 layer。',
      deepDive: '1. CSS 级联层级（@layer）的声明与排列：\n@layer base, theme, components, utilities;\n\n@layer base {\n  h1 { color: black; }\n}\n\n@layer components {\n  /* 即使 h1 的特异性只是类名，由于 components 层高于 base 层，此处的红色会完美覆盖 base 层的黑色 */\n  .card h1 { color: red; }\n}\n\n2. 突破选择器特异性的限制：\n如果在外部（无 layer 包裹的普通 CSS 代码）定义了样式，它们默认属于“最外层/无层”级别，拥有比所有 @layer 内部更高的优先级。这非常适合我们在业务代码中对第三方库进行终极覆写。',
      structured: [
        '定义：CSS Cascade Layers，样式级联层，W3C 样式表层叠规则的重构',
        '核心能力：在传统的“选择器权重”之外，增加一个决定权更高的“图层级别维度”',
        '防污染：@layer 设定 base < components < utilities。 components 层的普通类名样式绝对胜出 base 层的 ID 样式',
        '加载优化：支持通过 @import 导入外部库并直接划入特定级联层中进行安全合拢'
      ]
    },
    keyPoints: ['@layer', '级联层', '特异性覆盖', '样式污染', '层叠顺序'],
    traps: ['如果在使用 @layer 时没有在样式头部预先通过 @layer base, components; 声明顺序，那么层级的优先级将取决于页面解析该 layer 块出现的物理先后顺序'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_045',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'SVG 图标在 HTML 中嵌入与 CSS 控制优化',
    difficulty: 3,
    frequency: 4,
    question: '如何在 HTML 中以最优形式使用 SVG 图标以支持 CSS 灵活控制其内部线条颜色（stroke）、填充（fill）以及大小变化？请对比 <img> 标签引入、Inline 嵌入和 <use> 符号引入的区别。',
    answer: {
      short: 'img 引入无法用外部 CSS 修改图标内部颜色；Inline 嵌入能完全由 CSS 控制但增加 HTML 体积；<use> 标签配合 SVG 雪碧图（Symbols）是现代最佳实践，通过设置 fill: currentColor 即可实现外部 CSS 灵活控制颜色。',
      thinkingProcess: '1. 业务场景：一个复杂的图标按钮，正常态为灰色，Hover 态为蓝色，禁用态为浅灰。如果使用位图，我们需要准备多张图，会产生额外的网络请求和抖动。\n2. SVG 嵌入策略：若 img 标签引入，SVG 会被当成封闭图像，CSS 进不去；若 inline 会导致 HTML 臃肿；use 标签可以兼顾两者的优点。',
      deepDive: '1. CSS currentColor 特性应用：\n在制作 SVG 图标时，应在源文件中把需要动态改变颜色的属性设为 currentColor：\n<svg viewBox="0 0 24 24">\n  <path fill="currentColor" d="..." />\n</svg>\ncurrentColor 代表该元素继承的 color 值。外部改变文字颜色，SVG 自动同步变色。\n\n2. 三种引入方式全面对比：\n- <img> 标签：可缓存，但外界 CSS 进不去，无法实现悬停变色。\n- Inline SVG：可完全控制，但增加 HTML 包体，无法有效缓存。\n- SVG Sprites (<svg><use> 方案)：在 body 底部声明隐藏的 symbol 集合，通过 <svg class="my-arrow"><use xlink:href="#icon-arrow"></use></svg> 引用，结合了高度复用与外置控制的双重优势。',
      structured: [
        'img 瓶颈：视作隔离图像，无法修改内部属性，只适于不需要颜色交互的纯插图',
        '内联 SVG：交互性极强，但导致模板代码体积巨大且难以缓存',
        'use 方案：把 SVG 合并成 symbol 列表挂在头部，用 use 引用指定 ID，结合了高度复用与外置控制的双重优势',
        '配色秘籍：SVG 内路径设置 fill/stroke 为 currentColor，外部通过普通 class color 更改配色'
      ]
    },
    keyPoints: ['currentColor', 'SVG Use', 'Symbol 节点', '雪碧图', '填充 fill'],
    traps: ['如果从设计软件直接导出 SVG，文件内通常会默认写死 fill="#333333" 的绝对值。如果不把这些硬编码的颜色清除或改为 currentColor，外部的 CSS 变色指令将完全无法生效'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_046',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 计数器（CSS Counters）纯样式列表序号定制',
    difficulty: 2,
    frequency: 3,
    question: '当需要实现一个非常复杂的列表序号排版（如多级标题：1.1、1.2、1.2.1）且不希望手动在 HTML 中拼接数字时，如何使用 CSS 计数器实现纯样式自动累加生成？',
    answer: {
      short: '使用 counter-reset 在父容器上声明并重置计数器，使用 counter-increment 在子元素上自增，最后配合伪元素通过 content: counters(my-counter, \'.\') 动态渲染出层级序号。',
      thinkingProcess: '1. 业务痛点：多级标题自增若直接写在模板里，增删节点会导致需要全局重算。使用 CSS 计数器可以完全交给排版层处理，极大降低逻辑复杂性。\n2. 原理剖析：CSS 计数器是样式计算层维护的变量，支持自增自减，配合 counters() 还能生成多级嵌套的复杂编号。',
      deepDive: '1. CSS 计数器核心三大指令：\n- counter-reset：命名并重置一个计数器，通常写在父容器上。\n- counter-increment：设置计数器的自增步长，默认每次加 1。写在循环的列表项上。\n- counter() / counters()：在伪元素的 content 中读取并输出。\n\n2. 嵌套序号（1.1, 1.1.1）实战配置：\nol {\n  counter-reset: list-cnt; /* 每一层 ol 都会独立重置自己的计数器 */\n  list-style-type: none;\n}\nli {\n  counter-increment: list-cnt;\n}\nli::before {\n  content: counters(list-cnt, \".\") " "; /* 自动拼接所有祖先级别序号 */\n  font-weight: bold;\n}',
      structured: [
        '作用：零 JS，依靠样式层变量逻辑实现列表、表格、标题的多层级自增序号排版',
        '初始化：counter-reset: counter-name [initial-value] 启动一个本地样式栈计数器',
        '自增动作：counter-increment: counter-name 每次执行让当前计数值按步长累加',
        '渲染格式：counter() 渲染单层序号；counters(name, connector) 自动解析 DOM 嵌套级别输出类似 1.2.1 递归序号'
      ]
    },
    keyPoints: ['CSS 计数器', 'counter-reset', 'counter-increment', 'counters()', '伪元素 content'],
    traps: ['若把一个元素的 display 设为了 none，该元素所关联的 counter-increment 自增规则将不会被执行；若只是想隐蔽且不中断编号自增，应使用 visibility: hidden 占位'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_047',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: '等比例宽高容器与传统的 Padding Hack 技巧',
    difficulty: 2,
    frequency: 3,
    question: '在 aspect-ratio 属性被浏览器广泛支持之前，前端是如何实现一个宽度为 100% 且高度随着宽度缩放自动维持固定比例（如 16:9）的盒子的？请阐述其背后的 CSS 原理。',
    answer: {
      short: '利用子元素 padding-top/bottom 设为百分比时，其计算基准为“父元素的宽度”这一 CSS 特性；将盒子高度设为 0，设置 padding-top: 56.25%（16:9）即可撑开完美比例盒子，内部子元素采用 absolute 填满。',
      thinkingProcess: '1. 兼容性历史：在遇到旧系统需要向下兼容或者必须支持老版本浏览器时，我们无法直接使用 aspect-ratio。\n2. 原理精髓：在 CSS 规范中，margin-top/bottom、padding-top/bottom 的百分比值是相对于包含块（即最近的父元素）的“宽度（width）”计算的，而不是高度。这是为了防止在文档流中因高度互锁导致无限循环计算。',
      deepDive: 'Padding Hack 实现细节：\n.container {\n  width: 100%;\n  height: 0;             /* 高度必须清零 */\n  position: relative;\n  padding-top: 56.25%;   /* 16:9 (9 / 16 = 0.5625) */\n}\n.content {\n  position: absolute;\n  top: 0; left: 0; width: 100%; height: 100%; /* 绝对定位贴合撑满父级 padding 区 */\n}\n\n为什么以父级 width 为基准？\n因为如果按照 height 计算，在普通网页中父容器的高度往往是由内部子元素的高度自然撑开的。一旦子元素的 padding 又依赖父级高度，父级高度又依赖子元素，就会产生致命的“死循环互锁计算（Circular Dependency）”。为了杜绝这一隐患，W3C 规定边距的百分比全部以父容器的“宽度（width）”为计算基准。',
      structured: [
        'CSS 规范：padding-top/bottom 声明为百分比时，其参考对象是父元素的宽度 (width)',
        '做法：height 置为 0，用 padding-top 撑开对应的比例高度，形成一个比例骨架',
        '填充物处理：比例骨架因为高度为 0 无法直接挂载内容，子元素必须声明 absolute 满屏覆盖',
        '局限：相比原生 aspect-ratio 产生了多余的 DOM 嵌套和复杂的 absolute 定位逻辑'
      ]
    },
    keyPoints: ['Padding Hack', '百分比计算基准', '等比例缩放', '盒模型百分比'],
    traps: ['使用 Padding Hack 时，父容器绝对不能设置任何 overflow: scroll/auto，否则会因为盒子内部没有实质高度而导致容器渲染不完整或滚动条出现未知排版异常'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_048',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'CSS 裁剪与遮罩：clip-path 与 mask-image 实战',
    difficulty: 3,
    frequency: 3,
    question: '在做复杂不规则图形裁剪或渐变消隐交互时，CSS 的 clip-path 和 mask-image 有什么区别？它们各自的优势和适用场景是什么？',
    answer: {
      short: 'clip-path 是基于几何路径（如多边形、圆形）的物理裁剪，超出路径部分直接被切除且不响应事件；mask-image 是基于遮罩图片通道的像素混合，能实现精细的半透明渐变消隐效果，常用于复杂的边缘淡出过渡。',
      thinkingProcess: '1. 视觉进阶：这是前端开发炫酷视觉效果和高级动效不可或缺的 CSS 进阶技术。\n2. 原理对比：clip-path 是几何切割，非黑即白，边缘非常锐利；mask-image 是通道遮罩，支持渐变，类似 Photoshop 蒙版透明度叠加。',
      deepDive: '1. CSS Clip-path（几何裁剪）：\n利用矢量路径直接截取元素。支持 circle, polygon 等。\n.triangle-img { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }\n优势：GPU 硬件加速性能优异，支持路径动画过渡。被裁剪掉的区域不会响应任何鼠标事件，事件流能够正常穿透落到下层元素上。\n\n2. CSS Mask-image（遮罩蒙版）：\n利用渐变或镂空图片作为掩膜，元素的最终透明度等于该位置掩膜的 Alpha 值。\n.fade-text { mask-image: linear-gradient(to bottom, black 60%, transparent 100%); }\n优势：支持边缘淡出、羽化渐变等高阶设计。',
      structured: [
        'clip-path：矢量剪切（polygon/circle），非 0 即 1，裁剪边缘硬朗，支持几何坐标动画过渡',
        'mask-image：像素图层蒙版，根据遮罩的 Alpha 通道决定透明度，支持羽化渐变消隐',
        '事件差异：clip-path 裁剪区域外界彻底不响应任何事件；mask-image 透明区域在旧版内核里仍可能阻挡并捕获点击事件',
        '性能：clip-path 属于 GPU 友好型剪切路径，性能表现略胜于大面积实时像素蒙版运算'
      ]
    },
    keyPoints: ['clip-path', 'mask-image', 'polygon()', '图层蒙版', '渐变消隐', '异形剪切'],
    traps: ['mask-image 在主流内核中开发多需加 -webkit- 前缀（-webkit-mask-image）才能稳定运作，书写时应确保前缀与标准写法并存'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_049',
    mode: 'study',
    domain: 'interview',
    type: 'baguwen',
    track: 'frontend',
    topic: 'html_css',
    title: 'HTML5 Canvas 与 SVG 渲染原理深度对比',
    difficulty: 3,
    frequency: 4,
    question: 'HTML5 Canvas 和 SVG 都是浏览器中强有力的图形技术，请深度对比它们在渲染模式、DOM 树关联、海量节点性能以及适用业务场景上的核心区别。',
    answer: {
      short: 'Canvas 是即时模式（Immediate Mode）位图绘制，不与 DOM 关联，节点过万时性能更佳，适合游戏和复杂粒子动画；SVG 是保留模式（Retained Mode）矢量图描述，每个图形都是独立 DOM 节点，适合图表、地图及需要精细交互的矢量图标。',
      thinkingProcess: '1. 图像学原理：这是一道图像渲染底层机制的对比题。区分“即时模式”（只管画像素，画完就忘了，不保留状态）与“保留模式”（在内存中维护一棵完整的场景对象树，可被选中和修改样式）。\n2. 性能分水岭：随着图形元素增多，SVG 会被 DOM 树膨胀带来的垃圾回收和重排拖死；而 Canvas 保持极高的重绘帧率。但在高分辨率下 Canvas 重绘整张位图的像素带宽开销会变大，此时矢量图 SVG 反而有优势。',
      deepDive: '1. SVG (矢量保留模式)：\n每个图形都是真实存在的 DOM 元素，支持 css 变色和 onClick 监听。矢量无损，放大边缘依然高清。但图形节点过万时，DOM 树的构建和维护开销会让页面卡死。\n\n2. Canvas (位图即时模式)：\n整个画布在 HTML 中仅占一个节点，所有的绘图指令都是直接往显存位图上画像素，浏览器不记得你画过什么。若要删掉矩形必须清空重绘。交互响应必须监听全局 Canvas 点击事件，结合 X/Y 像素坐标，计算碰撞体积（Hit Testing）来判定点击了哪一个图形。不管你画 10 万个粒子，DOM 节点数始终为 1。',
      structured: [
        'SVG 原理：保留模式渲染，生成真实的 DOM 图形树，天然融合 CSS 与 DOM 事件',
        'Canvas 原理：即时模式渲染，输出纯位图像素块，无 DOM 痕迹，交互需通过坐标碰撞逆向计算',
        '性能曲线：SVG 随图形元素数量增多呈指数卡顿；Canvas 随画布物理分辨率（显存尺寸）增大增加刷新开销',
        '抉择策略：需要精细交互、文本可搜索、全尺寸无损的选 SVG；高频物理运动、超大散点流、游戏场景选 Canvas'
      ]
    },
    keyPoints: ['Canvas', 'SVG', '即时模式', '保留模式', 'DOM 膨胀', '坐标碰撞计算'],
    traps: ['在 Retina 高清屏上使用 Canvas 时，如果不把 Canvas 绘图上下文的像素大小（width 属性）放大为 CSS 逻辑尺寸乘以当前屏幕的 DPR（devicePixelRatio），画出的图像和文字会出现明显的边缘锯齿和模糊'],
    relatedIds: []
  },
  {
    id: 'interview_html_css_050',
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'frontend',
    topic: 'html_css',
    title: 'Web 无障碍（A11y）WCAG 色彩对比度规范与自适应',
    difficulty: 3,
    frequency: 3,
    question: '什么是 WCAG 2.1 无障碍色彩对比度规范？AA 级与 AAA 级对比度的数值要求是多少？在编写 CSS 样式时如何保证我们的系统对视力障碍用户友好并满足无障碍规范？',
    answer: {
      short: 'WCAG 是 Web 内容无障碍指南；AA 级要求普通文本对比度至少为 4.5:1（大字为 3:1），AAA 级要求至少为 7:1（大字为 4.5:1）；在 CSS 中可使用原生高对比度媒体查询（prefers-contrast）提供视障自适应样式。',
      thinkingProcess: '1. 国际化与社会责任：高级开发面试或大厂出海项目必问的 A11y (Accessibility) 高级规范。\n2. 机制剖析：视力受损、弱视、色盲或老年用户在使用系统时，如果文字和背景的色差过低，将完全无法辨认。WCAG 指导方针提供了科学的明度差比值。\n3. CSS 解决方案：不仅仅是设计上改配色，在技术层我们可以监听操作系统的高对比度开关，通过媒体查询自动加载高反差主题。',
      deepDive: '1. 对比度核心数值要求 (WCAG 2.1)：\n- AA 级：普通文本对比度不得低于 4.5:1；大文本不得低于 3:1。\n- AAA 级：普通文本对比度不得低于 7:1；大文本不得低于 4.5:1。\n\n2. CSS prefers-contrast 自适应适配：\n.text-muted { color: #8c8c8c; }\n@media (prefers-contrast: more) {\n  .text-muted { color: #434343; font-weight: 500; } /* 提升对比度至 7.5:1，过 AAA 级 */\n}\n\n3. 屏幕阅读器隐藏类 (sr-only)：\n有些纯图标组件没有文字，我们需要添加只对盲人读屏软件可见的辅助文字：\n.sr-only {\n  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;\n  overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;\n}',
      structured: [
        '规范全称：Web Content Accessibility Guidelines (网页内容无障碍指南 2.1 版)',
        'AA级对比度：普通文字对背景明度比 >= 4.5:1；大文本 >= 3:1',
        'AAA级对比度：普通文字对背景明度比 >= 7:1；大文本 >= 4.5:1',
        '样式探测：CSS 媒体查询 @media (prefers-contrast: more) 自适应重写视障高对比主题',
        'A11y 盲人播报：使用 aria-label 或 .sr-only 贴心类为图标按钮提供语音语义导航'
      ]
    },
    keyPoints: ['WCAG 2.1', '对比度比率', 'Accessibility', 'prefers-contrast', 'aria-label', 'sr-only'],
    traps: ['有些开发喜欢在聚焦时设置 outline: none。这会导致只使用键盘 Tab 键进行阅读的视障者彻底失去焦点指引，具有严重的无障碍隐患，必须保留 :focus-visible 样式'],
    relatedIds: []
  }
];

const fileContent = `// interview-html_css.js
// 自动生成主题题库：HTML与CSS (归属于 frontend)

const questions = ${JSON.stringify(questions, null, 2)};

module.exports = questions;
`;

const outputPath = '/Users/lijunpeng/Desktop/workbuddy_project/miniapp/data/study/topics/interview-html_css.js';
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-html_css.js with 50 questions!');
