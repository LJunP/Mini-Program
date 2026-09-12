const fs = require('fs');
const path = require('path');

const questions = [
  {
    id: "interview_011",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "HTTP 与 HTTPS 的区别",
    difficulty: 1,
    frequency: 5,
    question: "简述 HTTP 和 HTTPS 的主要区别，以及 HTTPS 如何保证安全。",
    answer: {
      short: "HTTPS 在 HTTP 下层加入 SSL/TLS 层，提供加密、身份认证和完整性校验。",
      thinkingProcess: "1. 安全诉求：防窃听、防篡改、防冒充。\n2. 加密机制：混合加密（非对称密钥协商，对称密钥加解密数据）。\n3. 证书校验：CA 数字证书确认服务端身份；数字签名防止篡改。",
      deepDive: "HTTPS 的核心是 TLS（传输层安全协议）。握手阶段通过非对称加密（RSA/ECDHE）同步一个随机对称密钥，之后的数据通信全部采用对称加密以提升效率。证书由权威 CA 签发，证书里包含公钥和 CA 的数字签名，客户端用系统内置的 CA 公钥解密验证，杜绝中间人攻击。",
      structured: [
        "明文 vs 密文：HTTP 明文传输；HTTPS 经过 TLS/SSL 二进制流加密",
        "握手流程：HTTP 仅 TCP 握手；HTTPS 需在此之上经历 TLS 握手协商对称密钥及安全套件",
        "身份鉴别：HTTPS 通过权威 CA 数字证书验证服务器公钥合法性，杜绝中间人代理伪造",
        "防篡改：利用 SHA256 等散列算法对传输内容生成数字摘要，防范网络流注入篡改"
      ]
    },
    keyPoints: ["TLS/SSL", "加密", "证书", "完整性", "握手"],
    traps: ["HTTPS 不等于绝对安全，证书配置错误仍会导致中间人攻击"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_012",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "TCP 三次握手和四次挥手",
    difficulty: 2,
    frequency: 5,
    question: "为什么 TCP 建立连接需要三次握手，断开连接需要四次挥手？",
    answer: {
      short: "三次握手是为了保证双方收发能力正常并同步初始序列号；四次挥手是因为全双工通信，双方都需要单独确认数据发送完毕。",
      thinkingProcess: "1. 握手三要素：同步序列号（ISN）、确认双方收发。两次握手无法确认客户端接收能力和历史旧连接；四次会造成浪费。\n2. 挥手四步：TCP 是全双工通道。当 A 发起 FIN，只能代表 A 不再发送数据，但 A 仍可接收 B 的数据。所以 B 必须先 ACK 确认，数据发完后再发自己的 FIN，最终由 A 做最后一回 ACK。",
      deepDive: "三次握手可以有效避免历史失效连接的重新建立。而挥手后的 TIME_WAIT 状态需要等待 2MSL，是为了确保最后的 ACK 能到达对方并防范历史旧数据包在网络中复活污染新连接。",
      structured: [
        "三次握手：SYN (Client) -> SYN+ACK (Server) -> ACK (Client)，同步双方 ISN 并确认收发畅通",
        "二次缺陷：若改两次，Server 收到网络滞后的旧 SYN 直接建连，若 Client 早已失效会造成资源浪费",
        "四次挥手：A 发 FIN 进入半关闭，B 回 ACK；B 把未发完数据发完后，发 FIN，A 回 ACK 完成通道彻底注销",
        "TIME_WAIT 状态：主动关闭方在 ACK 后强制静止 2MSL，确保被动关闭方能正常释放"
      ]
    },
    keyPoints: ["SYN", "ACK", "FIN", "全双工", "TIME_WAIT", "2MSL"],
    traps: ["三次握手不能减少成两次，否则无法确认双方收发都正常"],
    relatedIds: ["interview_011"]
  },
  {
    id: "interview_026",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "输入 URL 到页面渲染的全过程",
    difficulty: 2,
    frequency: 5,
    question: "在浏览器输入 URL 并回车后，经历了哪些步骤，请从网络与渲染引擎两方面详细阐述？",
    answer: {
      short: "网络端经历 DNS 解析、TCP 握手、TLS 协商、发送 HTTP 请求；接收响应后，渲染端解析 HTML/CSS 构建 DOM/CSSOM 树，合并为 Layout Tree 并绘制到屏幕。",
      thinkingProcess: "1. 阶段切分：网络流程 -> 渲染流程。\n2. 网络关键：DNS 逐级查找 -> 建立 TCP -> TLS 加密 -> 发送 HTTP 请求并缓存控制。\n3. 渲染关键：HTML 解析 DOM -> CSS 解析 CSSOM -> 生成渲染布局树 -> 分层 Layer -> 栅格化 (Raster) -> 画布绘制。",
      deepDive: "现代渲染引擎是多线程的，包含 Compositor 线程和 Raster 线程。在解析 HTML 遇到 `<script>` 标签时，如果标签没有 `defer` / `async` 属性，主线程会立即挂起 HTML 解析，去下载并执行该 JS 脚本，产生阻塞。CSS 的下载虽然不会中断 DOM 的解析，但由于 JS 的执行需要查询最新的 CSS 样式，所以 CSS 会阻塞其后 JS 的运行，进而间接影响页面白屏时长。",
      structured: [
        "DNS 解析：首先查询浏览器缓存、本地 hosts，无果则发起递归/迭代查询获取 IP",
        "建连传输：三次握手架设 TCP 通道，协商 TLS 对称密钥，发起 GET 请求拉取 HTML 字节流",
        "解析构树：HTML 解析器异步构建 DOM Tree，CSSOM 解析器构建样式规则树，结合两者生成 Layout Tree",
        "绘制上墙：执行重排（回流计算尺寸）与重绘（着色），Compositor 线程将图层划分为瓦片交由 GPU 栅格化上屏"
      ]
    },
    keyPoints: ["DNS 解析", "TCP 握手", "DOM 树", "CSSOM 树", "重排与重绘", "合成线程"],
    traps: ["不要漏掉浏览器对 JS 阻塞 HTML 解析的说明，以及 defer/async 脚本的加载时机"],
    relatedIds: ["interview_001", "interview_012"]
  },
  {
    id: "interview_net_004",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "DNS 域名解析完整流程与缓存层级",
    difficulty: 2,
    frequency: 5,
    question: "请详细阐述 DNS 域名解析的完整步骤，并列出从浏览器到根服务器的各级缓存查找时序。",
    answer: {
      short: "DNS 解析首先依次查找浏览器缓存、系统 Hosts 文件、本地 DNS 服务器（LDNS）；若未命中，LDNS 依次向根域名服务器、顶级域名服务器（TLD）、权威域名服务器发起迭代查询获取目标 IP，并逐级缓存。",
      thinkingProcess: "1. 本地缓存级别：浏览器缓存 -> OS hosts 文件 -> 路由器 DNS 缓存。\n2. 外网迭代查询：LDNS -> 根服务器 '.' -> 顶级服务器 '.com' -> 权威服务器 'example.com'。",
      deepDive: "DNS 在通信层默认使用 UDP 协议的 53 端口以保证低时延。当返回的解析报文体积超出 512 字节时，为了防止 UDP 切片发生丢包，DNS 会自动平滑切换至 TCP 协议传输。在 CDN 部署场景中，智能 DNS 会结合客户端 IP，返回最近的 CDN 节点服务器 IP，实现流量路由优化。",
      structured: [
        "本地极速查找：浏览器内核缓存 -> 操作系统 Hosts 静态映射表 -> 本地 Local DNS",
        "根节点迭代查询：Local DNS 发送请求至全球根域名服务器 '.' 询问，根服务器返回顶级域名服务器如 '.com' 节点的 IP",
        "分级追溯：Local DNS 访问 '.com' TLD 服务器，获取目标域名的权威 DNS 服务器 IP",
        "终极解析：Local DNS 访问权威 DNS，获取到真正绑定物理站点的 A 记录 IP，并逐级缓存"
      ]
    },
    keyPoints: ["DNS 缓存", "递归查询", "迭代查询", "A 记录", "TLD 顶级域名", "UDP 53端口"],
    traps: ["在解析结果极大时，系统会自动降级为 TCP 进行可靠传输"],
    relatedIds: []
  },
  {
    id: "interview_net_005",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "TCP 重传、流量控制与拥塞控制",
    difficulty: 4,
    frequency: 5,
    question: "TCP 是如何保障网络传输的可靠性的？请分别解释超时重传、滑动窗口和拥塞控制的机制。",
    answer: {
      short: "TCP 通过序列号与确认应答（ACK）实现有序传输，未收到 ACK 则触发超时重传；利用滑动窗口机制，接收端根据自身缓冲区剩余能力反馈窗口大小，实现流量控制；拥塞控制通过慢启动、拥塞避免、快速重传与快速恢复动态调整发送窗口，防范网络堵塞瘫痪。",
      thinkingProcess: "1. 流量控制（滑动窗口）：防止发送方发太多直接撑爆接收方 Buffer 产生溢出丢包。\n2. 拥塞控制：站在网络拓扑角度防拥塞，包含慢启动（指数增长）、拥塞避免（加法增长）、快速重传（3个冗余ACK触发）和快速恢复。",
      deepDive: "快速重传工作原理：如果发送方发送了 1-5 个包，2 号包中途丢了。接收方收到 3、4、5 时由于序列号不连贯，会连续回复 3 次对 1 的重复 ACK。发送方连续收到 3 次重复 ACK，立刻判定 2 丢失并立即重传，不需等定时器超时。",
      structured: [
        "流量控制：滑动窗口机制。接收端实时在 ACK 头部声明 `win` 限制发送端吞吐",
        "慢启动与避免：拥塞窗口 cwnd 从 1 开始指数增长，达到阈值 ssthresh 后转为线性拥塞避免（加法）",
        "拥塞降级：检测到丢包，ssthresh 降为当前 cwnd 的一半，cwnd 重置或进行快速恢复",
        "快速重传：收到三个冗余 ACK 时，立即无视超时定时器直接重传目标丢失报文"
      ]
    },
    keyPoints: ["滑动窗口", "拥塞控制", "慢启动", "快速重传", "流量控制", "拥塞窗口 cwnd"],
    traps: ["流量控制是为了防止接收端溢出，拥塞控制是为了防止网络中间节点堵塞，作用完全不同"],
    relatedIds: []
  },
  {
    id: "interview_net_006",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "HTTP 状态码全景分析",
    difficulty: 1,
    frequency: 5,
    question: "请列出 HTTP 状态码的五大类别，并解释 204, 301, 302, 304, 401, 403, 502, 504 的含义。",
    answer: {
      short: "1xx 提示，2xx 成功，3xx 重定向，4xx 客户端错误，5xx 服务端错误；204 无响应内容，301 永久重定向，302 临时重定向，304 协商缓存命中，401 需身份认证，403 无权限访问，502 网关错误，504 网关超时。",
      thinkingProcess: "1. 301 vs 302：301 永久重定向，浏览器自动缓存跳转，搜索引擎转移权重；302 临时跳转。\n2. 502 vs 504：502 是 Nginx 收到后端应用（如 Node）的非法响应；504 是上游后端处理超时，Nginx 未等来响应。",
      deepDive: "304（Not Modified）是 HTTP 缓存的核心。当客户端发起条件请求，服务端校验发现内容没有变更，返回 304 状态码，响应体为空，极大地节约了网路带宽和传输延时。",
      structured: [
        "301 Moved Permanently：永久重定向，浏览器会缓存此跳转行为，SEO 权重转移",
        "302 Found：临时跳转，每次仍需向原服务器发请求校验，SEO 权重不迁移",
        "304 Not Modified：协商缓存有效，直接复用本地静态数据，禁止带任何 Response Body 传输",
        "401 vs 403：401 代表需要身份验证；403 代表身份识别但服务器明确拒绝该资源授权",
        "502 Bad Gateway：网关代理正常，但后端进程宕机崩溃；504 Gateway Timeout：上游处理时间超时"
      ]
    },
    keyPoints: ["HTTP 状态码", "301/302 区别", "304 缓存", "502与504", "网关超时"],
    traps: ["301 浏览器会自动从本地缓存跳转，配置错 301 必须清理浏览器缓存才能看到新指向"],
    relatedIds: []
  },
  {
    id: "interview_net_007",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTP 强缓存与协商缓存机制",
    difficulty: 3,
    frequency: 5,
    question: "请详细阐述 HTTP 的强缓存和协商缓存的工作流程。Cache-Control 各属性值与 ETag、Last-Modified 的比对逻辑是什么？",
    answer: {
      short: "强缓存依据 Cache-Control（优先）或 Expires 直接在本地判断有效性，不向服务器发请求；协商缓存向服务器发送请求，携带 If-None-Match（对应 ETag，优先）和 If-Modified-Since（对应 Last-Modified），服务器校验未变则返回 304，改变则返回 200 并返回最新数据。",
      thinkingProcess: "1. 强缓存首部：`Cache-Control: max-age=3600`，`no-store` 禁止缓存，`no-cache` 强行协商缓存。\n2. 协商对比：ETag（文件内容 Hash，精度高）优先于 Last-Modified（文件最后修改时间，秒级精度）。",
      deepDive: "为什么 ETag 比 Last-Modified 更加可靠？Last-Modified 只能精确到秒级。如果一个文件在一秒内被修改了多次，Last-Modified 是无法感知的。另外，有时文件被重新写入但内容没变，Last-Modified 会判断失效，而 ETag 能保持一致直接返回 304，免去大流量传输。",
      structured: [
        "强缓存检查：若 Cache-Control 的 max-age 未过期，浏览器直接从 disk cache 或 memory cache 读取",
        "no-cache：指强缓存失效，每次必须强行向服务器发起协商缓存校验；no-store：禁止在本地磁盘缓存",
        "协商缓存首发：携带 `If-None-Match: [EtagVal]` 与 `If-Modified-Since: [TimeVal]` 抵达服务器",
        "服务器裁决：若 ETag 一致且时间未更新，直接返回 304；若失准，返回 200 与新包"
      ]
    },
    keyPoints: ["强缓存", "协商缓存", "Cache-Control", "ETag", "Last-Modified", "304 Not Modified"],
    traps: ["Cache-Control: no-cache 并不是不缓存，而是‘必须先进行协商缓存校验’，真正禁止缓存的是 no-store"],
    relatedIds: ["interview_net_006"]
  },
  {
    id: "interview_net_008",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "Cookie、Session 与 LocalStorage、SessionStorage 区别",
    difficulty: 2,
    frequency: 4,
    question: "请对比 Cookie, Session, LocalStorage, SessionStorage 四者的区别。",
    answer: {
      short: "Cookie 仅 4KB，每次请求自动携带，可设置 HttpOnly 防范安全；Session 存储于服务器端，依赖 Cookie 的 sessionID 查找；LocalStorage 和 SessionStorage 存储于浏览器，约 5MB 大小，不参与网络传输，LocalStorage 永久保存，SessionStorage 在窗口关闭时自动注销。",
      thinkingProcess: "1. 自动携带特性：Cookie 伴随 HTTP 请求自动发往服务端，太大会造成网路头部带宽浪费。\n2. WebStorage 优势：容量大（5MB），且纯在客户端操作，服务器无感。\n3. 安全属性：HttpOnly 杜绝 JS 读写 Cookie，防范 XSS 劫持；SameSite 规避 CSRF 攻击。",
      structured: [
        "Cookie：体积限 4KB，主用于身份识别。设置 `HttpOnly` 防范 XSS 劫持，每次网络请求自动自动携带",
        "Session：服务端机制，内存数据库存储，安全系数最高，依靠 SessionID 与客户端 Cookie 关联",
        "LocalStorage：客户端 5MB 本地持久化，无过期限制，纯 JS 读写，不随网络请求自动打包发送",
        "SessionStorage：会话级客户端 5MB 缓存，仅在当前标签页有效，Tab 关闭时内存数据立即自动销毁"
      ]
    },
    keyPoints: ["Cookie", "Session", "LocalStorage", "SessionStorage", "HttpOnly", "SameSite"],
    traps: ["LocalStorage 是共享的，而 SessionStorage 是隔离的，但在当前 Tab 打开的新同源 Tab 中会复制一份 SessionStorage"],
    relatedIds: []
  },
  {
    id: "interview_net_009",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "HTTP 版本演进：1.0 到 3.0 (QUIC)",
    difficulty: 4,
    frequency: 5,
    question: "请详细对比 HTTP/1.0, HTTP/1.1, HTTP/2 和 HTTP/3 (QUIC) 的技术差异，并说明它们各解决了前代的什么核心痛点？",
    answer: {
      short: "HTTP/1.0 每次请求都新建 TCP 连接；1.1 引入长连接和管线化，但存在线头阻塞；2.0 引入多路复用与头部压缩（HPACK），解决 HTTP 层线头阻塞；3.0 抛弃 TCP 改用基于 UDP 的 QUIC 协议，彻底解决了 TCP 层的线头阻塞，并支持连接迁移。",
      thinkingProcess: "1. 1.1 的 Keep-Alive 避免频繁握手。\n2. 2.0 二进制分帧消除 HTTP 层的 HOLB。HPACK 压缩头部。\n3. 3.0 UDP + QUIC 解决 TCP 层的 HOLB。单个丢包只影响自己 Stream，不卡死整条连接；支持连接迁移。",
      deepDive: "HTTP/2 多路复用解决了应用层线头阻塞。但由于 TCP 协议是面向可靠字节流的，如果传输中某一个 TCP 包在互联网中丢了，TCP 协议栈会阻塞后续所有包的读取。这导致 Stream 2 哪怕数据全到了也无法被浏览器读取，这就是 TCP 层的线头阻塞。HTTP/3 使用 UDP + QUIC，将可靠重传移到了应用层且基于 Stream 级别，丢包互不干扰，彻底治愈了这一顽疾。",
      structured: [
        "HTTP/1.1：支持 `Connection: keep-alive` 长连接复用，但存在物理性的管道线头阻塞（HOLB）",
        "HTTP/2.0：二进制分帧，头部压缩，多路复用复用单 TCP 连接，消除 HTTP 层的 HOLB",
        "TCP HOLB 痛点：HTTP/2 下单 TCP 连接丢包会卡死该连接下的所有并发 Stream 请求",
        "HTTP/3.0 (QUIC)：使用 UDP 原生通信，Stream 级丢包隔离，0-RTT 握手，基于连接 ID 实现连接迁移"
      ]
    },
    keyPoints: ["HTTP/2", "HTTP/3", "QUIC", "多路复用", "头部压缩 HPACK", "线头阻塞 HOLB", "连接迁移"],
    traps: ["部分企业防火墙会直接阻断一切 UDP 53 端口之外的 UDP 流量，导致 HTTP/3 自动降级为 HTTP/2 运行"],
    relatedIds: ["interview_net_005"]
  },
  {
    id: "interview_net_010",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "base",
    topic: "network",
    title: "CORS 跨域请求与预检（Preflight）机制",
    difficulty: 3,
    frequency: 5,
    question: "什么是同源策略？CORS 解决跨域的原理是什么？什么情况下会触发预检（Preflight）请求？",
    answer: {
      short: "同源策略限制不同源的脚本交互；CORS 依靠服务端返回 Access-Control-Allow-Origin 标头告知浏览器允许跨域；当请求为“非简单请求”（如含有自定义 Header、使用 PUT/DELETE、或 Content-Type 为 application/json）时，会触发 OPTIONS 预检请求确认安全。",
      thinkingProcess: "1. 简单请求 vs 非简单请求：非简单请求触发 OPTIONS 预检。\n2. 预检头：`Access-Control-Request-Method`，`Access-Control-Request-Headers`。服务器回复 `Access-Control-Allow-Methods` 并缓存预检结果。",
      deepDive: "一旦是不符合简单请求规则的操作，浏览器在发送真实请求前，必定自动发一个 OPTIONS。OPTIONS 不带任何 Body，如果后端没有正确响应 OPTIONS 200 并配足允许的 Header，浏览器就会当场拦截真实请求，报跨域错误。",
      structured: [
        "同源策略：协议 + 域名 + 端口必须完全一致，否则浏览器沙箱拦截跨域数据读取",
        "CORS 机制：由服务端在 Response 中配置 `Access-Control-Allow-Origin` 字段向浏览器发放通行证",
        "触发预检：使用了 PUT/DELETE 方法，或 Content-Type 设为了 application/json，或携带有自定义 Token 头部",
        "OPTIONS 握手：预检请求专用方法，通过 `Access-Control-Max-Age` 设定预检缓期限"
      ]
    },
    keyPoints: ["同源策略", "CORS 跨域", "OPTIONS 预检", "非简单请求", "Same-Origin Policy"],
    traps: ["跨域错误并不是服务器没响应，其实服务器已经收到请求并返回了，只是浏览器发现没有 CORS 头，把数据扣下了"],
    relatedIds: []
  },
  {
    id: "interview_net_021",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "WebSocket 协议握手与双向通信原理",
    difficulty: 3,
    frequency: 4,
    question: "WebSocket 协议是如何建立长连接的？它的握手协议与 HTTP 有什么关系？它是如何实现全双工双向通信的？",
    answer: {
      short: "WebSocket 借助 HTTP 协议发起首次握手，请求头包含 Upgrade: websocket 与 Connection: Upgrade；服务端校验通过后返回 101 Switching Protocols 状态码，完成协议升级；此后脱离 HTTP 协议，基于 TCP 隧道直接发送轻量级的 WebSocket 帧，实现低开销的全双工双向数据传输。",
      thinkingProcess: "1. 握手标志：Upgrade: websocket, Connection: Upgrade。\n2. 安全校对：Sec-WebSocket-Key 配对 Sec-WebSocket-Accept 确认升级合法性。\n3. 低开销通信：无 HTTP 繁重头部，纯帧传输，心跳简单。",
      deepDive: "WebSocket 帧格式头仅占 2-10 字节。对比 HTTP 每次发送都需要带上上百字节的 Header，WebSocket 能够极大地减少网络包体积，适合高频推送场景，如聊天室、游戏或金融看板。",
      structured: [
        "发起握手：客户端发 HTTP GET 请求，带上 `Upgrade: websocket` 与 `Sec-WebSocket-Key` 唯一随机串",
        "协议升级：服务端回复 `101 Switching Protocols` 及 `Sec-WebSocket-Accept` 表明接纳升级",
        "全双工隧道：TCP 连接被劫持复用，两端随时可以向对方派发二进制/文本帧",
        "低负担心跳：内置 Ping 和 Pong 控制帧，实现轻量级链路保活，省去 HTTP 心跳的巨大载荷"
      ]
    },
    keyPoints: ["WebSocket", "101 状态码", "Upgrade 协议升级", "Sec-WebSocket-Key", "全双工通信"],
    traps: ["WebSocket 默认无自动断线重连，必须在前端手写心跳检测与重连逻辑防假死"],
    relatedIds: []
  },
  {
    id: "interview_net_022",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "SSL/TLS 握手优化与 1.3 极速握手",
    difficulty: 4,
    frequency: 4,
    question: "TLS 1.2 的握手流程是怎样的？它需要几个 RTT？TLS 1.3 进行了哪些重大重构和优化以实现 0-RTT/1-RTT 极速建连？",
    answer: {
      short: "TLS 1.2 握手需要 2 个 RTT（四个往返）；TLS 1.3 将密钥协商与算法选择合并，仅需 1 个 RTT 完成握手；并引入 PSK 机制，允许客户端在第二次建连时利用缓存的 Session Key，在首个数据包中直接发送加密数据，实现 0-RTT 建连。",
      thinkingProcess: "1. 1.2 瓶颈：RSA 密钥协商繁琐，2 RTT 时延高。\n2. 1.3 改进：强制 DH 算法，首包 ClientHello 直接带上 Key Share 参数，Server 响应即可生成密钥，实现 1 RTT。\n3. 0-RTT：利用 PSK (Pre-Shared Key)，第二次连首包发数据。",
      deepDive: "TLS 1.3 废弃了所有不安全的旧密码套件（如 MD5, RC4, RSA 密钥分配）。强制前向安全（PFS），黑客即使拿到私钥也无法破解历史流量数据，安全性大幅度提纯。",
      structured: [
        "TLS 1.2 握手：两次往返（2 RTT）。第一轮拿证书协商，第二轮交换公钥确认加密生效",
        "TLS 1.3 1-RTT：一步到位。ClientHello 阶段直接猜测并发送 DH 算法的 Key Share 参数，ServerHello 回传即可计算出对称密钥",
        "0-RTT 会话恢复：基于 PSK。客户端利用历史 Session Ticket，在首个 TCP 握手包之后直接把应用加密数据发过去",
        "安全提纯：强制下线 RSA 密钥分配模式，彻底确保 Perfect Forward Secrecy (PFS)"
      ]
    },
    keyPoints: ["TLS 1.3 握手", "1-RTT", "0-RTT PSK", "前向安全性 PFS", "DH 密钥交换", "ChangeCipherSpec"],
    traps: ["0-RTT 会话恢复因为首包数据可以直接被拦截重发，容易遭受‘重放攻击’，严禁用于写请求（POST/PUT）"],
    relatedIds: ["interview_011"]
  },
  {
    id: "interview_net_023",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "JWT Token 认证架构与安全性防护",
    difficulty: 3,
    frequency: 4,
    question: "请详述 JWT (JSON Web Token) 的组成结构。与传统 Session 认证相比，JWT 的优缺点是什么？如何解决 JWT 无法中途注销的缺陷？",
    answer: {
      short: "JWT 由 Header、Payload 和 Signature 三部分用点号连接组成；优点是无状态、易扩展、免查数据库；缺点是一旦签发在过期前永久有效，且无法中途撤销；解决吊销缺陷可通过引入 Redis 维持黑名单列表、使用短生命周期 AccessToken 配合 RefreshToken 双 Token 机制等设计。",
      thinkingProcess: "1. 结构：Header（算法）、Payload（只读字段）、Signature（防止篡改签名）。\n2. 吊销方案：Redis 存黑名单阻断拦截；AccessToken 设 15 分钟，RefreshToken 设 7 天，注销时销毁 RefreshToken，将挂死区间缩至 15 分钟。",
      deepDive: "签名防篡改原理：`Signature = HMAC(base64(Header) + \".\" + base64(Payload), Secret)`。由于 secret 只在服务器，攻击者修改 Payload 里的用户 ID 后无法伪造签名，服务器校验即刻识别。",
      structured: [
        "三段结构：Header (加密算法)、Payload (存 userId 等只读数据)、Signature (服务端秘钥算签名)",
        "JWT 优势：分布式无状态认证，服务器免去查库或同步内存 Session，对微服务友好",
        "JWT 缺陷：信息透明（Payload 仅 base64）、不可撤回",
        "吊销解法：1. 双 Token 机制；2. 服务端 Redis 缓存注销黑名单列表（拦截机制）"
      ]
    },
    keyPoints: ["JWT 结构", "Signature 签名", "双 Token 机制", "Token 吊销", "无状态认证", "Redis 黑名单"],
    traps: ["Payload 数据只是进行 Base64 编码，并没有进行任何加密！绝对不能存密码或身份证等敏感字段"],
    relatedIds: []
  },
  {
    id: "interview_net_024",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "OAuth 2.0 授权码模式设计",
    difficulty: 4,
    frequency: 4,
    question: "请详细画出或描述 OAuth 2.0 授权码模式的完整通信时序图，并说明为什么要通过“临时授权码”再去置换 Access Token？",
    answer: {
      short: "授权码模式时序为：用户访问应用 -> 重定向至授权中心登录授权 -> 携带 code 重定向回应用回调地址 -> 应用后端携带 code + client_secret 向授权中心置换真正 Access Token；使用临时授权码中转是为了防范 Token 在前端浏览器中暴露，确保 Token 的交换全程在安全的后端网络中完成。",
      thinkingProcess: "1. 安全核心：Token 不在前端（浏览器）滞留。\n2. 回调 code：一次性、短寿命，泄露无妨，因为兑换 Token 强制要求 client_secret。\n3. client_secret：存储在后端内存，绝不发到前端。",
      deepDive: "前端重定向获取 `code` 时，通常会携带随机的 `state` 参数，授权中心原样带回，客户端比对 state 以防范 CSRF 授权劫持，确保请求由同一个浏览器发起。",
      structured: [
        "前端授权引导：用户确认授权，授权中心通过浏览器 302 临时重定向回调回应用地址，暴露出一次性 `code`",
        "后端安全兑换：应用后端在纯内网环境下发起 POST 接口调用，上报 `code + client_secret` 置换 Access Token",
        "双层保险：client_secret 是核心机密，只在后端内存保存，绝不分发到客户端浏览器中",
        "防范劫持（state参数）：发请求带上 state，回调后核对，防止跨站请求伪造"
      ]
    },
    keyPoints: ["OAuth 2.0", "授权码模式", "AccessToken", "client_secret", "state 防CSRF", "重定向回调"],
    traps: ["redirect_uri 必须配置精准的白名单，防止黑客伪造回调路径将 code 发送至钓鱼站"],
    relatedIds: []
  },
  {
    id: "interview_net_025",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "CDN 缓存控制与 GSLB 全局负载均衡原理",
    difficulty: 3,
    frequency: 4,
    question: "CDN 的工作原理是什么？它是如何通过 GSLB 将用户请求精准引导至距离最近、最畅通的边缘节点的？",
    answer: {
      short: "CDN 的原理是将源站静态资源缓存到全国各地的边缘服务器节点；当用户发起请求时，本地 DNS 解析将请求指向 CDN 的 GSLB 服务器，GSLB 结合用户 IP 进行地理位置计算、RTT 延迟评估及边缘节点健康度判定，返回最优节点的 IP，实现就近秒级访问。",
      thinkingProcess: "1. CNAME 劫持：解析 CNAME 映射至智能 GSLB。\n2. GSLB 策略：解析客户端 Local DNS IP，决定分发哪个省份运营商的节点 IP。\n3. 回源策略：命中缓存直接返回，失效则边缘节点向源站拉取（回源）。",
      deepDive: "当需要更新资源时，必须发起“刷新（Purge）”指令，清除边缘缓存；或者使用“预热（Preload）”，在新版本大文件上线前提前推送到边缘服务器，防范回源瞬间击挂源站。",
      structured: [
        "CNAME 中转：域名 DNS 配置 CNAME 记录指向 CDN 解析平台，将 DNS 解析决策权移交",
        "GSLB 调度：收集各节点负载、实时 RTT、客户端 IP，派发最匹配边缘节点 IP",
        "回源缓存机制：边缘节点未命中缓存则发起 TCP 回源拉取并缓存",
        "CDN 缓存规则：读取源站响应头里的 `Cache-Control` 控制自身的缓存失效周期"
      ]
    },
    keyPoints: ["CDN 原理", "GSLB 全局负载", "CNAME 记录", "回源拉取", "缓存失效"],
    traps: ["动态 API 接口必须设置 Cache-Control: no-cache，否则 CDN 会缓存接口响应，导致多用户串数据"],
    relatedIds: ["interview_net_004"]
  },
  {
    id: "interview_net_026_tcp",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "TCP 协议中 TIME_WAIT 状态与 2MSL 的必要性",
    difficulty: 3,
    frequency: 4,
    question: "在 TCP 四次挥手中，为什么主动关闭连接的一方必须在发送最后的 ACK 后进入 TIME_WAIT 状态？为什么这个状态要维持 2MSL 那么长的时间？",
    answer: {
      short: "进入 TIME_WAIT 状态是为了确保被动关闭方能收到最后的 ACK 并正常释放资源；维持 2MSL（两倍最大报文生存时间）是为了让本次连接在网络中滞留的所有失效历史报文全部消亡，防范在新建立的连接中混入历史脏数据。",
      thinkingProcess: "1. 容灾：若最后的 ACK 丢了，Server 超时重发 FIN，TIME_WAIT 中的主动方可以重新回复 ACK。若直接 closed 则会回复 RST 导致 Server 报错。\n2. 数据消亡：防止相同端口的新连接接收到迷路的旧数据产生紊乱。",
      deepDive: "高并发短连接服务器如果高频做主动关闭，会堆积大量 TIME_WAIT 连接导致端口耗尽。可在 sysctl 中设置 `net.ipv4.tcp_tw_reuse` 快速重用端口，或在应用层使用 keepalive 长连接规避频繁握手。",
      structured: [
        "ACK 丢包防御：被动关闭方超时重发 FIN 时，主动方能在 TIME_WAIT 中捕获并重新发送 ACK",
        "新老数据隔离：维持 2MSL 时长，使本次连接产生的所有 IP 数据包在网络中完全老化消亡",
        "TIME_WAIT 灾难：短连接大并发下，服务器端口被 TIME_WAIT 填满导致无法建立新连接",
        "治理良策：Linux 底座配置 `net.ipv4.tcp_tw_reuse` 复用端口，或者改用长连接减少建连频次"
      ]
    },
    keyPoints: ["TIME_WAIT", "2MSL", "四次挥手", "端口耗尽", "tcp_tw_reuse"],
    traps: ["不要强制开启快速释放（如发送 RST）直接绕开 TIME_WAIT，可能会在网路差时导致数据错乱"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_net_027",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "base",
    topic: "network",
    title: "TCP SYN Flood 洪水攻击原理与 SYN Cookies 防御",
    difficulty: 4,
    frequency: 4,
    question: "什么是 TCP SYN Flood 攻击？它的底层攻击机制是怎样的？服务端是如何通过开启 SYN Cookies 机制防范这一攻击的？",
    answer: {
      short: "SYN Flood 攻击是通过伪造大量不存在的 IP 地址向服务器高频发 SYN 报文，使服务器将连接挂在半连接队列中（SYN_RCVD）并等待 ACK，从而迅速撑爆服务器的半连接队列资源；SYN Cookies 在收到 SYN 时不分配存储空间，而是将连接信息哈希化为初始序列号（ISN）返回，客户端回 ACK 时解密确认才分配资源，从根本上避开了半连接队列占用限制。",
      thinkingProcess: "1. 攻击：伪造 IP，只发第一步 SYN，不回第三步 ACK，撑爆半连接队列。\n2. SYN Cookies：不写物理内存。用 client IP/Port 算个 Hash 作为 ISN。收到客户端 ACK 时（ack = seq + 1），对 ack 减 1 重新做 Hash 比对，通过后直接建连。",
      deepDive: "开启命令：`sysctl -w net.ipv4.tcp_syncookies=1`。虽然增加了微小的 CPU 校验算力，但在抵御 SYN Flood 狂轰滥炸时，它是服务器自保的底线防御配置。",
      structured: [
        "攻击机理：高频发送源 IP 虚假的 SYN 数据包，使服务器堆叠大量半连接（SYN_RCVD），耗尽内核内存",
        "半连接队列：存放收到 SYN 但未完成三次握手的连接；全连接队列：存放已完成三次握手但未被 accept 的连接",
        "SYN Cookies 机制：队列满后，服务器不分配内存，而是计算包含时钟与四元组哈希的特殊 `seq` 发回",
        "应答确认：收到 ACK 后，服务器逆向校验 ack_seq，验证通过即时为该连接分配内存，保障业务不中断"
      ]
    },
    keyPoints: ["SYN Flood 攻击", "半连接队列", "SYN Cookies", "DDoS 防御", "tcp_syncookies"],
    traps: ["SYN Cookies 会导致部分高级 TCP 协商参数（如窗口扩大因子）失效，非攻击状态下建议合理扩容半连接队列大小"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_net_028",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "TLS 握手中的对称加密与非对称加密",
    difficulty: 2,
    frequency: 4,
    question: "在 HTTPS/TLS 握手和通信过程中，对称加密与非对称加密是如何各司其职、协同保证安全与性能的？",
    answer: {
      short: "非对称加密仅用于握手阶段，用于安全地验证服务器证书身份并协商出对称加密的“预主密钥”；对称加密用于握手成功后的数据传输阶段，因为其解密计算速度比非对称加密快数千倍，保障了整体数据交互性能。",
      thinkingProcess: "1. 协同设计：非对称慢（安全协商密钥），对称快（快速加解密数据）。\n2. 过程：客户端用公钥（证书中）加密预主密钥发给服务器，服务器用私钥解密得到密钥。至此双方都拿到对称密钥，之后的数据全用这个密钥以对称加密算法传输。",
      deepDive: "只用对称加密会面临密钥如何在网络中安全分发的问题（一旦被截获直接破译）。只用非对称加密，由于每次传输都要进行大数模幂运算，服务器的 CPU 会瞬间超负荷掉帧。混合加密是安全与性能妥协的极致工程艺术。",
      structured: [
        "非对称加密（RSA/ECDHE）：用于 TLS 握手阶段。服务器将含有公钥的 CA 证书发送给客户端，客户端用其加密生成的预主密钥（Pre-Master Secret）回传，保证密钥分发的绝对机密",
        "对称加密（AES/ChaCha20）：用于数据通信阶段。双方利用预主密钥推导出的对称密钥，对后续传输的所有 HTTP Body 进行快速加解密",
        "性能收益：对称加密计算消耗小，满足了万兆带宽下大体量数据吞吐的实时加密渲染需求"
      ]
    },
    keyPoints: ["非对称加密", "对称加密", "混合加密", "预主密钥", "证书公钥"],
    traps: ["非对称加密只用于保护“对称密钥的协商过程”，实际传输的业务数据包绝对不是用证书里的公钥加密的"],
    relatedIds: ["interview_011"]
  },
  {
    id: "interview_net_029",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "TLS 会话恢复机制：Session ID vs Session Ticket",
    difficulty: 4,
    frequency: 3,
    question: "TLS 的会话恢复机制（Session Resumption）是如何减少重复握手延迟的？请对比 Session ID 和 Session Ticket 的实现区别与优缺点。",
    answer: {
      short: "会话恢复允许客户端复用之前协商好的会话参数，免去完整 TLS 握手；Session ID 将会话状态存储在服务端内存，通过 ID 标识符复用，但存在多服务器负载均衡无法共享及内存堆积缺陷；Session Ticket 采用客户端存储策略，服务器将加密后的会话信息封装成 Ticket 发送给客户端，再次连接时客户端上报解密，适合集群部署。",
      thinkingProcess: "1. 原理：TLS 握手需要 RTT 时延。如果用户短时间内重连，不需要完整重跑握手。\n2. Session ID: 类似 Session 机制，Key 在客户端，Value 在服务器内存。缺点是多台服务器做负载均衡时，A 机器没有 B 机器的 Session ID 记录，无法识别。\n3. Session Ticket: 类似 JWT。服务端用私钥加密会话参数发给客户端，客户端存。第二次连发过来，服务器解密成功直接恢复，免查库免查内存。",
      deepDive: "Session Ticket 的安全防护关键是服务端定期轮换用于加密 Ticket 的 STEK（Session Ticket Encryption Key）。如果 STEK 泄露，黑客就可以解密所有拦截下来的历史 Session Ticket 并还原出对称密钥，从而破坏了前向安全性，因此需严格配置轮换时钟。",
      structured: [
        "Session ID 方案：服务器内存维护 Session ID 映射表，多台服务器时需实现缓存同步（如 Redis），对分布式集群不友好",
        "Session Ticket 方案：服务器把会话状态用私钥加密后封装成 Ticket 交给客户端保存，再次建连时 Client 自动通过 ClientHello 的 extension 属性上报，服务器解密解密即恢复",
        "性能对比：两者均可将建连时延从 2 RTT 缩短至 1 RTT，大幅提升重连首屏加载速度"
      ]
    },
    keyPoints: ["Session ID", "Session Ticket", "会话恢复", "STEK", "1-RTT"],
    traps: ["Session Ticket 会导致前向安全性减弱，如果用于加密 Ticket 的密钥泄露，黑客将能够解密这段历史流量"],
    relatedIds: ["interview_net_022"]
  },
  {
    id: "interview_net_030",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "完美前向安全性（PFS - Perfect Forward Secrecy）",
    difficulty: 4,
    frequency: 4,
    question: "在 HTTPS 体系中，什么是完美前向安全性（PFS）？为什么 RSA 密钥协商无法保证 PFS，而 DH/ECDH 密钥协商可以保证？",
    answer: {
      short: "完美前向安全性（PFS）是指即使服务器的长期私钥被盗，黑客也无法破解历史记录下来的历史加密流量数据；RSA 无法保证 PFS 是因为对称密钥直接由服务器私钥解密得到，私钥泄露则历史密钥全泄露；DH/ECDH 依靠每次握手时动态生成一次性临时密钥对（Ephemeral Keys），且公网只传输公钥参数，私钥泄露也无法逆推对称密钥，从而保证了 PFS。",
      thinkingProcess: "1. 核心概念：历史流量的机密性。黑客可以把你的 HTTPS 流量存几年，等你服务器私钥被盗或泄露了，他再拿私钥去批量解密历史流量。这很不安全。\n2. RSA 漏洞：客户端算好 Pre-Master Secret，用服务器证书公钥加密。发给服务器，服务器用私钥解密。如果私钥被盗，黑客可以解密出这个 Pre-Master Secret，从而算出发往该连接的对称密钥。\n3. DH 算法优势：Diffie-Hellman 密钥协商。两端随机生成临时私钥 $a$ 和 $b$，算出公钥并交换。双方利用 DH 算法特性在本地直接计算出对称密钥。公网上完全没有传输过 Pre-Master Secret，且每次连接的 $a, b$ 都不同，用完即弃，从而实现了 PFS。",
      deepDive: "在 TLS 1.3 中，已经彻底删除了 RSA 密钥交换算法，**强制要求必须使用 DH 或其椭圆曲线变体（ECDHE）**作为唯一的密钥协商模式。这不仅提升了安全性（强制 PFS），也精简了协议设计，杜绝了由于配置错误导致的降级降级漏洞。",
      structured: [
        "PFS 释义：Perfect Forward Secrecy，保证即使服务器私钥泄露，历史已被拦截记录的加密网络流量依旧不可被破解",
        "RSA 弱点：对称密钥的保护完全建立在服务器私钥机密性上，一旦私钥失守，所有历史交互的密钥皆可被解密还原",
        "DH/ECDH 强项：利用大数离散对数数学难题，双方仅通过交换一次性临时生成的数学公参（Key Share），直接在本地独立计算出相同的对称密钥",
        "时代合拢：TLS 1.3 废除 RSA 密钥分配，强制只保留 ECDHE 等 PFS 加密流，将安全性提升到最高规格"
      ]
    },
    keyPoints: ["前向安全 PFS", "ECDHE", "DH 算法", "RSA 漏洞", "TLS 1.3 强制"],
    traps: ["虽然 ECDHE 保证了 PFS，但它仍需要 RSA 或 ECDSA 私钥对 DH 的公共参数进行“数字签名”，以防握手时被中间人拦截篡改参数"],
    relatedIds: ["interview_net_028"]
  },
  {
    id: "interview_net_031",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "HTTP 常见 Content-Type 请求体格式对比",
    difficulty: 2,
    frequency: 4,
    question: "请对比 HTTP 常见的请求体编码格式：application/x-www-form-urlencoded、multipart/form-data 和 application/json 的区别和使用场景。",
    answer: {
      short: "x-www-form-urlencoded 是传统表单格式，数据编码为 key1=val1&key2=val2 字符串，不适合传二进制；multipart/form-data 采用 boundary 分隔符，支持文件及大二进制数据混合传输；application/json 将数据格式化为标准 JSON 字符串，最适合传输复杂的嵌套结构化结构化数据。",
      thinkingProcess: "1. 格式对比：传统的 key-value 拼装 vs 大文件二进制分割 vs 现代 API 主导的 JSON 结构。\n2. Urlencoded：字符经过 URL 编码（如空格变 %20），不能有二进制。\n3. Multipart：`Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`，用 boundary 分割多个数据块，每一块都有自己的 Content-Type，可以同时发文本和文件流。\n4. JSON：最简单，前后端天然序列化解析最佳拍档。",
      deepDive: "在 Axios/Fetch 请求中，如果传入普通对象，Axios 默认会使用 `application/json` 序列化。如果想发送文件，在 JS 中需要手动使用 `new FormData()`，此时浏览器会自动将 Content-Type 修改为 `multipart/form-data` 并动态随机生成 boundary 边界字符串，无需手动配置，手动配错 boundary 会导致后端无法解析分割而出错。",
      structured: [
        "x-www-form-urlencoded：表单默认值，采用 key=value 串联，对非 ASCII 字符做 % 编码，适合简单纯文本表单提交",
        "multipart/form-data：通过随机 Boundary 分割线切分请求体，每部分带独立的 Content-Disposition，是大文件/图片上传的标准格式",
        "application/json：现代 RESTful API 标准，直接投射 JSON 字符串，支持高维度、多层级嵌套的对象和数组结构"
      ]
    },
    keyPoints: ["Content-Type", "urlencoded", "multipart/form-data", "application/json", "boundary"],
    traps: ["在手动设置 multipart/form-data 时千万不要自己去拼写 Content-Type 里的 boundary 属性，直接让浏览器根据 FormData 实例自动推导注入，否则会因为格式对不上导致后端接收报错"],
    relatedIds: []
  },
  {
    id: "interview_net_032",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "base",
    topic: "network",
    title: "HTTP 断点续传与 Range 分片请求",
    difficulty: 3,
    frequency: 4,
    question: "在开发大文件下载、视频拖拽播放时，HTTP 是如何通过 Range 头部实现分片请求和断点续传的？服务器如何响应？",
    answer: {
      short: "客户端通过在请求头中加入 Range: bytes=start-end 声明请求的数据范围；服务器如果支持分片，会截取对应字节段的数据返回，并回复 HTTP 206 Partial Content 状态码，在 Content-Range 响应头中声明当前返回区间及文件总大小。",
      thinkingProcess: "1. 原理：文件的 HTTP 请求支持只下载部分字节。\n2. Range 语法：`Range: bytes=0-499`（前500字节），`Range: bytes=500-`（从500字节到结束）。\n3. 响应头：`Content-Range: bytes 0-499/1000`（返回前500，总大小1000）。\n4. 缓存验证：配合 `If-Range`（携带 ETag），防止文件在下载期间被修改导致分片拼错。",
      deepDive: "视频播放器（如 <video> 标签）的底层拖拽快进播放就是依靠 `Range`。当用户拖拽进度条到 50% 处，播放器直接发起 `Range: bytes=5000000-` 请求，跳过前面未加载的视频内容直接向服务器拉取后面的分片，实现了秒开播放而不用等全片下载完。",
      structured: [
        "Range 请求：客户端发送请求包含 `Range: bytes=100-200`，指明所需下载的精确物理字节偏移行",
        "206 Partial Content：服务端支持分片，读取文件偏移段回传，状态码置为 206，非分片则退回 200 全量发送",
        "Content-Range：响应头格式如 `Content-Range: bytes 100-200/5000`，告知客户端当前返回段和总体积 5000 字节",
        "If-Range 校验：携带 ETag 或修改时间，如文件未变则返回 206 部分数据，若已变则直接退回 200 全量返回防文件篡改"
      ]
    },
    keyPoints: ["Range 头部", "206 状态码", "Content-Range", "If-Range", "视频快进播放"],
    traps: ["如果服务器响应的 ETag 发生了改变，且客户端直接把新老 206 切片强行拼接在一起，会导致最终合并出来的文件损坏，必须用 If-Range 保证一致性"],
    relatedIds: ["interview_net_006"]
  },
  {
    id: "interview_net_033",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "正向代理与反向代理区别",
    difficulty: 2,
    frequency: 4,
    question: "请对比正向代理（Forward Proxy）和反向代理（Reverse Proxy）的概念、工作位置、服务对象及各自的典型应用场景。",
    answer: {
      short: "正向代理位于客户端一侧，代理客户端发起请求并向服务器屏蔽客户端真实 IP，服务于客户端（如科学上网爬虫）；反向代理位于服务器一侧，代理服务器接收请求并向客户端屏蔽服务器真实集群结构，服务于服务端（如 Nginx 负载均衡和安全防护）。",
      thinkingProcess: "1. 谁的代理：正向代理代理客户端，反向代理代理服务器。\n2. 隐藏对象：正向隐藏客户端真实身份，反向隐藏后端服务器集群结构。\n3. Nginx 角色：Nginx 作为反向代理，负责做 Web 路由、SSL 卸载和均衡负载。",
      deepDive: "正向代理中，客户端必须主动进行配置（如在浏览器设置代理 IP 和端口），它很清楚自己访问的最终服务器是谁。而反向代理中，客户端完全无感，在客户端看来，反向代理服务器（如 `https://baidu.com`）就是真实提供服务的服务器，它完全不知道后面其实有数十台 Web 机器在分发计算。",
      structured: [
        "正向代理：客户端架设。代理客户端发送请求，服务器只看到代理服务器 IP，不知道真实 Client IP。典型：翻墙 VPN、企业网关过滤",
        "反向代理：服务端架设。代理服务端接收请求，客户端只看到反向代理服务器，不知内网集群。典型：Nginx 路由分发、CDN、安全防护盾",
        "心智总结：正向代理隐藏客户端；反向代理隐藏服务器"
      ]
    },
    keyPoints: ["正向代理", "反向代理", "Nginx", "负载均衡", "IP 隐藏"],
    traps: ["在反向代理中，为了让后端服务器拿到用户的真实 IP，反向代理服务器必须配置 X-Forwarded-For 标头将客户端 IP 向后透传，否则后端日志记录的 IP 全是 Nginx 的内网 IP"],
    relatedIds: []
  },
  {
    id: "interview_net_034",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "NAT 网络地址转换与 P2P 打洞原理",
    difficulty: 4,
    frequency: 3,
    question: "什么是 NAT 机制？为什么它导致了内网主机之间无法直接通信？P2P 打洞（NAT Traversal）的原理是怎样的？",
    answer: {
      short: "NAT 将内网私有 IP 转换为公网出口 IP 以缓解 IPv4 地址匮乏，但导致外部无法主动向内网发起连接；P2P 打洞是利用中介 STUN 服务器获取双方的公网 IP 和映射端口，双方同时向对方的公网出口发送数据包以在各自的 NAT 路由器上建立传输通道，实现直接通信。",
      thinkingProcess: "1. 痛点：内网 IP `192.168.1.5` 无法直接在互联网寻址。必须通过路由器 NAT 转化为公网 IP 并分配临时端口。\n2. 穿透障碍：A 在内网，B 在内网。A 想要给 B 发数据。由于 B 所在的 NAT 路由器会阻断一切外来主动发起、未在 NAT 表登记的请求，直接丢包。\n3. 打洞（Hole Punching）：A 向 STUN 发请求，得知自己映射出的公网 IP:Port。B 也得知。A 向 B 的公网 IP:Port 发包，B 也向 A 发包。这个过程在各自的路由器上建立了双向映射表，此后数据可以直接 P2P 互传。",
      deepDive: "根据 NAT 的类型，打洞成功率有很大不同：\n- **锥型 NAT (Cone NAT)**：映射端口固定，打洞极易成功。\n- **对称型 NAT (Symmetric NAT)**：每次建连都动态变动出口端口，猜测几率极低，打洞成功率基本为 0。针对对称型 NAT，必须降级使用 TURN 中转服务器进行中继数据流转发。",
      structured: [
        "NAT 机制：私有 IP 通过端口映射（NAPT）共享单一公网出口，阻断了外网主机主动对内网的通信",
        "STUN 探测：Session Traversal Utilities for NAT。P2P 双方通过它反向查知自己映射出的外网 [IP:Port] 四元组",
        "打洞核心：A 发包给 B 的公网端口，虽被 B 路由丢弃，但 A 路由处登记了‘发往B’；B 发包给 A 的公网端口，A 路由放行，打洞成功建立直连",
        "对称 NAT 妥协：若遇到对称型 NAT，每次连接端口均不同导致打洞失败，必须退回中继服务器（TURN）转发流量"
      ]
    },
    keyPoints: ["NAT", "P2P 打洞", "STUN", "TURN", "对称型 NAT", "WebRTC"],
    traps: ["P2P 并不是 100% 能打洞成功的，在复杂的对称 NAT 办公网中，必须配足 TURN 流量中转带宽以作兜底"],
    relatedIds: []
  },
  {
    id: "interview_net_035",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "TCP 滑动窗口与可靠重传底层机制",
    difficulty: 3,
    frequency: 4,
    question: "请详细阐述 TCP 的滑动窗口（Sliding Window）结构。发送窗口和接收窗口在数据流动中是如何移动的？",
    answer: {
      short: "滑动窗口是 TCP 流量控制的核心，分为发送和接收窗口；发送窗口根据接收端反馈的 window 大小动态划分已发送未确认、未发送可发送、未发送不可发送区域，收到确认 ACK 后窗口右移；接收窗口在收到连续有序数据包后向右移动并触发累积确认应答。",
      thinkingProcess: "1. 物理模型：窗口就是一段可用的 buffer 偏移指针。\n2. 发送端四区间：已发送且已收到ACK；已发送但未收到ACK；未发送但允许发送（窗口额度）；未发送且不允许发送。\n3. 接收端三区间：已收到已确认；允许接收的区间（滑动窗口）；不允许接收的区间。\n4. 移动法则：发送端收到前面的 ACK，左指针向右推；接收端收到连续的数据包，左指针向右推并回复最新 ACK。",
      deepDive: "SACK（Selective ACK，选择性确认）是对滑动窗口的重大优化。在传统 TCP 中，如果发送了 1-5 包，2 丢了，接收端只能连续回 1。发送端不得不重传 2 之后的所有包。SACK 在 TCP 头部加入了 Options 块，能直接告知：‘我已收到 1, 3, 4, 5，只有 2 丢了。’ 发送端从而**只需靶向重传 2 号包**，大幅节省网络流量带宽。",
      structured: [
        "滑动窗口：允许发送方在未收到 ACK 前，连续发送窗口大小内的数据包，避免了单包等待确认的时延开销",
        "发送端指针：Category 2（已发未确认）与 Category 3（可发未发）共同构成当前发送窗口尺寸",
        "接收端累积确认：只有收到连续的数据，接收窗口才向右滑动并更新 ACK 序号（如收到 1, 3，ACK 仍回 2，等 2 到了直接 ACK 5）",
        "SACK 机制：选择性确认。利用 TCP 头选项反馈不连续收包状态，避免无效的全量重传"
      ]
    },
    keyPoints: ["滑动窗口", "流量控制", "累积确认", "SACK", "TCP 报文头"],
    traps: ["SACK 机制的启用必须是两端 TCP 栈共同支持并在握手阶段协商同意的，若有一端不支持则会退回老版累积重传"],
    relatedIds: ["interview_net_005"]
  },
  {
    id: "interview_net_036",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "MTU 与 MSS：IP 分片与 TCP 分段机制",
    difficulty: 3,
    frequency: 3,
    question: "什么是 MTU 和 MSS？为什么 TCP 在建立连接时要进行 MSS 协商？它是如何有效防范 IP 分片（IP Fragmentation）带来的高丢包率的？",
    answer: {
      short: "MTU 是链路层能通过的最大数据包大小，以太网通常为 1500 字节；MSS 是 TCP 层限制单次发送的最大数据段大小，通常为 MTU 减去 IP/TCP 头部大小（1460 字节）；TCP 协商 MSS 是为了确保生成的 IP 数据报在链路层传输时绝不发生 IP 分片，因为 IP 层无重传机制，一旦某个分片丢失会导致整个大包重传，导致效率暴跌。",
      thinkingProcess: "1. 定义：MTU（最大传输单元，以太网物理硬件限制） vs MSS（最大分段大小，TCP应用层限制）。\n2. 计算：`MSS = MTU (1500) - IP Header (20) - TCP Header (20) = 1460 字节`。\n3. 分片悲剧：如果 TCP 发了一个 3000 字节的大包，在 IP 层会被强制切分成 3 个分片通过路由器。在路上只要丢了任何一个分片，由于 IP 层没有重传机制，接收端无法重组，整个 3000 字节的 TCP 包在传输层就会被断定丢失，触发全量重传，极易引起雪崩。所以必须由 TCP 在源头卡死 MSS 大小。",
      deepDive: "TCP 在三次握手阶段，会在 `SYN` 包的 Options 选项中写入自己期望的 MSS 大小。两端会对比并**选择其中较小的一个作为最终数据发送的 MSS 上限**。这从协议根源上直接规避了 IP 分片的发生，极大地增强了网络抖动环境下的传输抗压能力。",
      structured: [
        "MTU（Maximum Transmission Unit）：数据链路层物理硬限制，以太网最大为 1500 字节，超限直接被路由器丢弃或强行分片",
        "MSS（Maximum Segment Size）：TCP 传输层净负荷限制，握手时协商出 `min(MSS_A, MSS_B)` 锁死发送上限",
        "IP 分片致命点：IP 协议无可靠机制。多个分片任意丢一个，整个 TCP 报文作废，触发传输层全量重传，丢包率呈乘积级飙升",
        "源头切分：TCP 基于协商的 MSS 自行将大文件切割为多个 1460 字节的 TCP 报文段，完美绕开 IP 层的强制分片"
      ]
    },
    keyPoints: ["MTU", "MSS", "IP 分片", "TCP 分段", "SYN 选项", "丢包率优化"],
    traps: ["如果网络路径中存在某些 MTU 小于 1500 的特殊路由设备（如隧道路由），依然可能导致分片，可通过开启 DF（Don't Fragment）位进行路径 MTU 发现（PMTUD）进行动态调整"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_net_037",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "ARP 协议工作原理与局域网寻址",
    difficulty: 2,
    frequency: 4,
    question: "什么是 ARP 协议？它是如何将 IP 地址转换为物理 MAC 地址的？请简述 ARP 广播和单播的工作过程，以及什么是 ARP 欺骗攻击？",
    answer: {
      short: "ARP 是将 IP 地址解析为局域网物理 MAC 地址的协议；工作上，源主机在局域网内发起 ARP 广播询问谁拥有目标 IP，目标主机收到后以单播形式回复自己的 MAC 地址，源主机记录并缓存；ARP 欺骗是攻击者高频发送虚假的 ARP 响应，误导局域网交换机将流量发送到黑客主机以实现中间人劫持。",
      thinkingProcess: "1. 物理定位：局域网里网卡只认 MAC 地址。但我们在 IP 层只知道目的 IP。必须用 ARP 翻译。\n2. 流程：\n   - 广播：“谁是 192.168.1.100？把你的 MAC 告诉我！”（所有人都收到）。\n   - 单播回复：“我是 192.168.1.100，我的 MAC 是 xx-xx...”（只有发起者收到）。\n3. 欺骗漏洞：ARP 协议没有状态，任何主机都可以无条件发送 ARP 回复。黑客发送：“我是网关 1.1，我的 MAC 是黑客MAC”，局域网主机的流量就会全部走到黑客电脑中，导致信息泄漏。",
      deepDive: "在局域网主机内部，维护着一个 ARP 缓存表（可以使用 `arp -a` 命令行查看）。为了防止频繁发起局域网广播影响网卡性能，每次解析到的 MAC 会在缓存表中保留数分钟。防止 ARP 欺骗的最佳实践是在局域网交换机上配置静态 ARP 绑定（Dynamic ARP Inspection, DAI）或使用静态 ARP 表，强行锁定网关 MAC 地址。",
      structured: [
        "ARP 广播：主发送方封装以太网帧，目的 MAC 设为 `FF:FF:FF:FF:FF:FF`（全网广播），向局域网广播查询 IP 归属",
        "ARP 单播：持有该 IP 的目标网卡收到广播后，剥离包头，以一对一单播形式直接回传自己真实的 MAC 地址",
        "ARP 缓存表：动态缓存 IP 与 MAC 映射关系，TTL 过期后自动物理清除以支持动态 IP 刷新",
        "ARP 欺骗攻击（Spoofing）：利用协议无状态无校验缺陷，伪造响应将网关 IP 指向自己 MAC，实现中间人嗅探劫持"
      ]
    },
    keyPoints: ["ARP 协议", "MAC 地址", "局域网广播", "ARP 欺骗", "中间人攻击", "DAI安全"],
    traps: ["ARP 只能在局域网（同一子网）内工作。如果跨网段访问外网服务器，ARP 请求查询的只能是本地“默认网关”的 MAC 地址"],
    relatedIds: []
  },
  {
    id: "interview_net_038",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "ICMP 协议与 Ping / Traceroute 工作原理",
    difficulty: 2,
    frequency: 4,
    question: "ICMP 协议在网络层起到什么作用？请详细阐述 ping 和 traceroute 命令底层的 ICMP 报文交互原理。",
    answer: {
      short: "ICMP 用于在 IP 主机和路由器之间传递控制消息和差错报告；ping 底层利用 ICMP 的 Echo Request（回显请求）和 Echo Reply（回显应答）报文测算延迟和丢包率；traceroute 利用 IP 首部的 TTL（生存时间）从 1 开始递增发包，使沿途路由器因 TTL 过期返回 ICMP 超时报文，从而追踪出完整网路路由路径。",
      thinkingProcess: "1. 协议属性：网络层（与 IP 协议并列，但封装在 IP 数据报内）。不用于传用户数据，只传状态控制。\n2. ping 交互：最简单。客户端发 Type 8（请求），服务器收回并原样返回 Type 0（应答）。计算时间差。\n3. traceroute 精妙之处：\n   - 步骤一：发一个 TTL = 1 的 IP 包（通常封装一个高端口 UDP 包）。\n   - 第一个路由器收到，TTL 减 1 变成 0，路由器丢弃该包，并向源主机发送一个 ICMP Type 11 (Time Exceeded) 差错报文。源主机获取第一个路由器 IP。\n   - 步骤二：发 TTL = 2，获取第二个路由器 IP... 递增直到到达目标主机。目标主机由于收到的是不可用高端口 UDP，会返回一个 ICMP Type 3 (Destination Unreachable) 端口不可达报文，宣告追踪结束。",
      deepDive: "Traceroute 的局限：\n在现代网络中，很多防火墙和骨干网路由器为了安全防范嗅探，在收到 TTL=0 的包时会**直接静默丢弃，不回传任何 ICMP 报文**。这就导致 Traceroute 在终端里经常会输出一串 `* * *`（请求超时）。但这不代表网路不通，只是代表沿途节点把 ICMP 报文阻断过滤了。",
      structured: [
        "ICMP 职责：网络控制报文协议。负责路由不可达、数据超时、流量重定向等运维状态通知",
        "Ping 原理：向目标发送 `Echo Request` 报文，目标网卡底层直接硬件回传 `Echo Reply`，测算精确 RTT 时延",
        "Traceroute 递增 TTL 机制：利用 IP 头部的 TTL（每经一跳减一）特性，从 1 递增发包，迫使沿线路由依次抛出 `ICMP Time Exceeded`（超时）报文以确认地址",
        "Traceroute 终点站：发送不可达高端口 UDP 包，目的地收到后回传 `Destination Unreachable`（不可达）报文，宣告链路探测封顶"
      ]
    },
    keyPoints: ["ICMP 协议", "Ping 原理", "Traceroute", "TTL 递增", "差错控制", "网络探测"],
    traps: ["Traceroute 在 Windows 下默认发送的是 ICMP 请求，而在 Linux 下默认发送的是高端口 UDP 包，所以在防火墙阻断策略上可能会有所不同"],
    relatedIds: []
  },
  {
    id: "interview_net_039",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "Anycast（任播）路由与智能 DNS 架构",
    difficulty: 4,
    frequency: 3,
    question: "什么是 Anycast (任播) 路由技术？它是如何实现让全球多个地理位置不同的服务器共享同一个 IP 地址的？它在 CDN 和防范 DDoS 攻击中有什么关键作用？",
    answer: {
      short: "Anycast 是一种网络路由技术，允许全球多个地理位置独立的物理服务器节点在 BGP 协议中声明完全相同的 IP 地址；网络路由器根据最短路径算法（OSPF/BGP），自动将用户流量引向距离最近的那个 Anycast 节点；它在 CDN 中用于秒级就近接入，在防范 DDoS 时能把海量流量物理分散到全球各个边缘节点分担消化，避免单机房撑爆。",
      thinkingProcess: "1. 寻址区别：Unicast（单播，1对1），Multicast（多播，1对多组），Broadcast（广播，1对全），Anycast（任播，1对最近的1个）。\n2. 路由宣告：通过 BGP（边界网关协议）。洛杉矶、东京、北京的机房，都在公网声明自己是 `1.1.1.1`。全世界的骨干网路由器会计算最短路径，把流量引过去。\n3. DDoS 容灾：如果有 100Gbps 的攻击流量从全球打来，Anycast 会把流量打散，日本黑客的流量打到东京节点，欧美黑客的流量打到美西节点，各边缘节点就地清洗，源站纹丝不动。",
      deepDive: "Anycast 的主要局限是**对连接稳定性的考验**。因为 Anycast 依赖 BGP 动态选路，如果公网骨干路由突然发生抖动或切换，同一个用户的 TCP 握手包可能发到了东京节点，但后续的数据包却被路由重选送到了洛杉矶节点。由于洛杉矶节点没有该 TCP 的连接上下文，会直接回复 `RST` 导致连接断开。因此 Anycast 极度适合 UDP 业务（如 DNS 查询）或高弹性的 CDN 静态内容路由，不适合长连接高强一致性金融交易。",
      structured: [
        "Anycast 任播：全球多个物理节点共享宣告同一个公网 IP，路由器根据最短路由开销实现“就近投递”",
        "DNS 灾备（1.1.1.1/8.8.8.8）：将核心根 DNS 或公共 DNS 部署为 Anycast，遭遇断网或抖动时公网自动热备秒级切流",
        "DDoS 物理清洗：将超限流量按地理分布打散到全球各个清洗中心节点（Scrubbing Center），避免单节点被彻底打挂",
        "局限：BGP 路由瞬时切换可能导致 TCP 握手和数据发送落入不同物理机导致连接中断"
      ]
    },
    keyPoints: ["Anycast 任播", "BGP 路由宣告", "DDoS 清洗", "DNS 备灾", "TCP 路由抖动"],
    traps: ["Anycast 并不保证完全的绝对就近，因为 BGP 的路由开销是按自治系统（AS）跳数计算的，有时候物理上很近但由于跨运营商，流量可能会绕远路"],
    relatedIds: ["interview_net_004"]
  },
  {
    id: "interview_net_040",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTP/1.1 分块传输编码（Chunked Transfer Encoding）",
    difficulty: 2,
    frequency: 4,
    question: "什么是 HTTP 分块传输编码（Chunked Transfer Encoding）？它有什么用途？它是如何帮助服务端动态渲染大数据（如服务端流式响应 / ChatGPT 打字机效果）的？",
    answer: {
      short: "分块传输编码是 HTTP 允许发送方将响应体分为多个独立数据块传输的机制，在 HTTP 头部声明 Transfer-Encoding: chunked；它用于在服务端无法提前获知响应内容总大小时动态流式发送数据，打碎了 Content-Length 限制，是 ChatGPT 流式打字机响应和 SSE（Server-Sent Events）的基础底座。",
      thinkingProcess: "1. 传统局限：普通的 HTTP 响应必须指定 `Content-Length: 1000`。浏览器根据这个长度知道什么时候收完。但对于动态生成的大报告或流式响应，服务器在开始发包时根本不知道最终大小，只能先憋在内存里，严重影响首字节时间（TTFB）。\n2. Chunked 运作：不设 Content-Length，头设 `Transfer-Encoding: chunked`。每一个数据块都有一个十六进制的长度前缀加上 `\r\n`，再带上真实数据。最后发一个特殊的空分块（大小为0的块：`0\r\n\r\n`）宣告结束。",
      deepDive: "分块传输在现代前端的典型应用是 **SSE (Server-Sent Events) 与 Stream API**。ChatGPT 的交互中，后端大模型吐出一个字，服务器就通过 Chunked 协议立刻将这个字的分块推送给前端。前端的 `ReadableStream` 依次解构出文本并更新 state，用户看到的就是平滑丝滑的“打字机吐字动效”，大幅降低了等待焦虑。",
      structured: [
        "Transfer-Encoding: chunked：废除 Content-Length 头，将长响应体解耦切分为多块动态下发",
        "分块语法结构：每个数据分块由两行组成：`[十六进制的字节块大小]\\r\\n[真实的二进制或文本数据]\\r\\n`",
        "结束标志：发送特殊的终止分块 `0\\r\\n\\r\\n` 宣告数据流彻底发完，浏览器此时闭合读取流",
        "应用方向：大文件动态流式拉取、服务端渲染（SSR）首屏 HTML 边算边输出（TTFB 优化）、ChatGPT SSE 文本打字流"
      ]
    },
    keyPoints: ["分块传输", "Transfer-Encoding", "Content-Length 绕过", "ChatGPT 流式打字", "SSE"],
    traps: ["使用 Chunked 传输时，由于 Content-Length 缺失，客户端如果需要做下载进度条（百分比），必须依赖后端在自定义头部中回传总大小进行计算"],
    relatedIds: ["interview_net_006"]
  },
  {
    id: "interview_net_041",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "base",
    topic: "network",
    title: "HSTS 安全头协议与 HTTPS 降级防御",
    difficulty: 3,
    frequency: 3,
    question: "什么是 HSTS (HTTP Strict Transport Security)？它是如何防范 SSL/TLS 剥离攻击（降级攻击）的？Preload List 机制的作用是什么？",
    answer: {
      short: "HSTS 是一个 HTTP 安全响应头，强制浏览器在后续的一段时间内只使用 HTTPS 协议访问该网站，任何 HTTP 输入都会在浏览器端内部自动 307 跳转为 HTTPS；这从根本上避免了攻击者在初次非安全跳转时进行协议剥离；Preload List 允许将域名直接内置入浏览器内核源码中，实现初次初次访问即强制 HTTPS。",
      thinkingProcess: "1. 安全漏洞：即使用户配置了 HTTPS，但如果用户在地址栏手动输入 `http://my-bank.com` 并回车。浏览器首先会发起一个明文的 HTTP 请求，然后服务器返回 301 重定向到 `https://`。在这个短暂的 301 过程中，黑客如果进行“中间人劫持”，可以拦截这个 301 并向用户返回假页面，这就是 SSL Stripping（SSL 剥离攻击）。\n2. HSTS 介入：服务端返回 `Strict-Transport-Security: max-age=31536000; includeSubDomains`。浏览器记录后，以后只要用户敲 `http://`，浏览器内部直接改写成 `https://` 访问（307 Internal Redirect），明文包根本不会流向公网，防范了劫持。\n3. Preload List：解决“首次访问”仍需 301 握手的漏洞，各大浏览器联合维护白名单内置于浏览器源码中。",
      deepDive: "启用 HSTS 的响应头规范范例：\n`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`\n一旦你的域名进入了 Chrome 官方的 preload 列表，用户即使清理了浏览器缓存、第一次拿到新电脑敲下 http，浏览器也绝对不会发出任何一个明文 HTTP 包，防御等级达到物理死锁级别。",
      structured: [
        "SSL 剥离攻击：攻击者劫持 http 到 https 之间的 301 重定向跳转，使客户端始终与黑客进行明文 HTTP 交互",
        "HSTS 运作：服务端下发 `Strict-Transport-Security` 头，浏览器强制开启 307 内部重定向改写为安全 HTTPS",
        "includeSubDomains：使该强制规则无缝覆盖当前域名的所有二级、三级子域名",
        "Preload List 机制：硬编码内置白名单，彻底消灭“首次访问明文跳转”这一唯一的防线空隙"
      ]
    },
    keyPoints: ["HSTS", "SSL 剥离", "307 内部重定向", "Preload List", "网络安全头"],
    traps: ["一旦将域名申请加入 HSTS Preload List 并上线，如果中途需要退回 HTTP（如部分老业务不支持 SSL），浏览器将彻底拒绝连接，撤销流程需长达数月，必须深思熟虑"],
    relatedIds: ["interview_net_011"]
  },
  {
    id: "interview_net_042",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "base",
    topic: "network",
    title: "内容安全策略（CSP - Content Security Policy）机制",
    difficulty: 3,
    frequency: 3,
    question: "内容安全策略（CSP）的作用是什么？它是如何限制未知脚本加载并防御 XSS 攻击的？如何在 HTTP 头或 HTML 中进行安全配置？",
    answer: {
      short: "CSP 是通过限制浏览器只能加载经过开发者授权的外部资源来源（如 JS、CSS、图片域）的防御机制；通过 HTTP 响应头 Content-Security-Policy 声明各资源的白名单规则，默认禁止一切内联脚本执行（禁止 <script>alert(1)</script>）和 eval，从而彻底锁死了恶意 XSS 脚本的运行空间空间。",
      thinkingProcess: "1. 安全边界：XSS 虽然防过滤，但万一过滤有漏洞，黑客把脚本插进页面了怎么办？\n2. CSP 兜底防线：沙箱白名单。限制只能执行同源 JS：`default-src 'self'`。即使黑客把 `<script src=\"http://evil.com/x.js\"></script>` 插进去了，浏览器解析时发现域名 `evil.com` 不在 CSP 白名单内，会直接拒绝加载并向监控服务器发报错日志。\n3. 内联防范：黑客喜欢用 `<img src=\"\" onerror=\"hack()\">` 触发。CSP 默认把一切内联（inline）JS 全部阻断，只有带特定 nonce 随机盐值或 SHA256 哈希的脚本才放行。",
      deepDive: "配置 CSP 头部的通用高防范模版：\n`Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com; object-src 'none'; report-uri /csp-violation-report-endpoint/`\n在这个配置下，不仅禁止了 Flash（object-src 'none'），而且当网页内发生违背 CSP 的非法脚本加载时，浏览器会自动发起 POST 请求把错误堆栈发送至 `report-uri` 终点，供安全团队实时分析定位被攻击点。",
      structured: [
        "安全理念：建立沙箱白名单，严格审计并限制浏览器只能向哪些可信域名拉取和执行静态资源",
        "防御 XSS 核心：CSP 默认封杀内联脚本（inline script）和 `eval()`，使得注入的 HTML 沦为死文本无法执行",
        "配置入口：优先通过 HTTP Response Header `Content-Security-Policy` 广播，或在 HTML 头部写 `<meta http-equiv=\"...\" />`",
        "防御演进：支持 `strict-dynamic` 和 nonce（一次性数字盐值），保障动态打包构建的脚本也能被安全放行"
      ]
    },
    keyPoints: ["CSP", "XSS 兜底", "内联阻断", "report-uri", "安全标头"],
    traps: ["CSP 配置如果过于严苛，会导致项目里引入的合法第三方组件（如百度地图、第三方客服组件）因跨域拦截而直接失效瘫痪，上线前需开启 Content-Security-Policy-Report-Only 灰度测试"],
    relatedIds: []
  },
  {
    id: "interview_net_043",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "WebRTC 通信原理与 NAT 穿透管线",
    difficulty: 5,
    frequency: 4,
    question: "请详细阐述 WebRTC 实现浏览器间 P2P 实时音视频通信的完整管线流程。STUN, TURN, ICE, SDP 分别在建立连接中扮演什么角色？",
    answer: {
      short: "WebRTC 管线为：双方各自创建 PeerConnection 并生成描述自身音视频媒体格式的 SDP 报文；通过信令服务器（Signaling）交换 SDP；同时利用 ICE 框架，向 STUN 获取外网映射 IP，向 TURN 挂载中继备用通道；测试联通后完成 ICE 候选者（Candidates）交换建立连接，最终以 SRTP 加密流直接直连传输媒体数据。",
      thinkingProcess: "1. 实时性诉求：音视频如果走传统服务器中转，服务器带宽开销极大，且延迟高。必须 P2P 传输。\n2. SDP（Session Description Protocol）：会话描述协议。声明“我这能编解码 H.264 / Opus，分辨率是 1080P，准备用哪个端口”。双方需要交换这个白皮书才能配对。\n3. ICE 框架与 NAT 穿透：\n   - **STUN**：探针，获取本地外网 IP:Port。\n   - **TURN**：中继站，如果两端对称 NAT 无法打洞，退回这里由 TURN 中转。\n   - **ICE Candidate**：把所有能连的通路（本地局域网 IP、STUN 反射公网 IP、TURN 代理 IP）全部收集起来，依次进行连通性测试，选出最优路径建连。",
      deepDive: "WebRTC 建立连接的宏观管线流程图：\n```text\n【A 浏览器】 ----(SDP Offer)----> 【信令服务器 (Signaling)】 ----(SDP Offer)----> 【B 浏览器】\n【A 浏览器】 <---(SDP Answer)--- 【信令服务器 (Signaling)】 <---(SDP Answer)--- 【B 浏览器】\n      │                                                                   │\n  (ICE 探测)                                                           (ICE 探测)\n      ↓                                                                   ↓\n【STUN/TURN】                                                       【STUN/TURN】\n      │                                                                   │\n  (交换 ICE Candidates) ---------------------------------------------> (交换 ICE Candidates)\n      └────────────────────────────[ 建立 P2P 直连通道 ]──────────────────┘\n```\n注意：信令服务器（Signaling Server）在 WebRTC 规范中并没有规定实现方式，通常开发者会使用 WebSocket 或 SSE 自行手写，只用于中转握手前期的 SDP 和 Candidate 文本数据包。",
      structured: [
        "SDP 会话描述：交换多媒体硬件元信息，确定编解码套件与音视频编码规则（Offer / Answer 模式）",
        "ICE 候选者收集：整合局域网 Host IP、STUN 探测出的 Reflexive 公网 IP、以及 TURN 中继 IP 形成候选集合",
        "信令握手：信令服务器虽然不参与媒体传输，但必须作为前期桥梁，通过 WebSocket 中转双方的 SDP 和 Candidate 记录",
        "连通测试与保密：双方依据 ICE 优先级策略发送 STUN 握手包测试联通性，成功后直接升级为 SRTP 双向安全流直接直连"
      ]
    },
    keyPoints: ["WebRTC", "SDP", "ICE Candidates", "STUN/TURN", "信令服务器", "SRTP 实时流"],
    traps: ["在 WebRTC 中，媒体流走 UDP 传输以保证实时，但如果网络包损坏过大，会导致画面出现马赛克，必须自行在应用层做好帧重传补偿机制"],
    relatedIds: ["interview_net_034"]
  },
  {
    id: "interview_net_044",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "JWT Token 吊销与主动注销架构设计",
    difficulty: 3,
    frequency: 4,
    question: "在分布式或微服务系统中，既然 JWT (JSON Web Token) 是无状态且自包含的，一旦签发就无法收回。如何设计一套低开销、高可用的 Token 吊销与用户主动注销方案？",
    answer: {
      short: "可采用混合架构：1. 限制 Access Token 生命周期（如 10 分钟），配合 Refresh Token（如 7 天）刷新；2. 注销或禁用账户时，在 Redis 中记录 Token 标识的黑名单，拦截请求；3. 通过引入 JWT 中的 jti（唯一标识）和过期时间，确保 Redis 仅在 Token 原定过期前的一段极短时间内保存黑名单，防止内存无限膨胀。",
      thinkingProcess: "1. 架构痛点：JWT 是无状态的。如果黑客偷了 Token，或者管理员想强制下线某用户，由于 Token 在过期前在客户端被认为始终合法，服务端无法将其失效失效。\n2. 纯 Redis 验证弊端：如果每次请求都要去 Redis 查一遍 Token 在不在，那就完全丧失了 JWT“无状态免数据库查询”的设计优势，退回了 Session 模式。\n3. 优化折中：\n   - **AccessToken + RefreshToken**：正常访问不查 Redis，10分钟过期。过期后拿 RefreshToken 去认证服换新 Token。注销时直接拉黑或注销 RefreshToken。这样用户最多持有着已被注销但仍生效的 AccessToken 晃荡 10 分钟。\n   - **Redis 延迟精细拉黑**：将强制拉黑的 Token 的 `jti`（唯一UUID）和过期时间戳写入 Redis，设置 TTL 为该 Token 的剩余有效时长。当请求进来，先看 Signature 格式（99%正常），如果 Signature 过了，只有在 user_id 处于高风险监控名单、或 Token 的 `jti` 正好在 Redis 缓存里的极少数情况下，才去拦截拒绝。缓存到期后 Redis 自动清除，内存占用恒定极小。",
      deepDive: "黑名单 TTL 精细控制计算公式：\n`Redis_TTL = Token_Expiration_Time - Current_Time`\n例如 Token 在晚上 10:00 过期，用户在 9:40 点击注销，Redis 写入黑名单并设过期时间为 20 分钟（至10:00）。10:00 之后，由于该 Token 即使不查黑名单也会因为自身时间戳过期而被前端和服务器直接拒绝，所以 Redis 在 10:00 准时将其丢弃是绝对安全的。这避免了黑名单无限增大吃空 Redis 内存的经典悲剧。",
      structured: [
        "痛点所在：无状态 JWT 无法被服务器主动废弃，私钥签发后便脱离控制，给封号和注销功能带来巨大隐患",
        "双轨 Token 规避：AccessToken (10min) 走无状态快速校验；RefreshToken (7day) 存入中心，注销时直接注销 RefreshToken，阻断重发",
        "Redis 精细拉黑（JTI标记）：JWT 内置 jti (唯一UUID)，注销时将 jti 写入 Redis 并设定 TTL 值为该 Token 剩余秒数",
        "拦截优化：网关层（如 Kong/Nginx）利用 lua 脚本读取 Token 中的 jti，单点快速查询 Redis，避免将查询压力穿透到核心业务微服务中"
      ]
    },
    keyPoints: ["JWT 撤销", "jti 唯一标识", "AccessToken", "RefreshToken", "Redis 黑名单 TTL", "网关网关"],
    traps: ["如果将 AccessToken 的失效设置得过长（如 24 小时）且不做任何黑名单限制，一旦 Token 泄露，用户将处于无法自保被盗刷的极度危险状态"],
    relatedIds: ["interview_net_023"]
  },
  {
    id: "interview_net_045",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTP 304 状态码产生与更新判定规则",
    difficulty: 2,
    frequency: 4,
    question: "在 HTTP 协商缓存中，服务器是如何决定返回 200 还是 304 状态码的？请详细说明 ETag / If-None-Match 和 Last-Modified / If-Modified-Since 的完整比对判断规则。",
    answer: {
      short: "浏览器发起请求时自动在请求头中携带 If-None-Match 和 If-Modified-Since 字段；服务器接收后，优先比对 If-None-Match 与当前文件计算的 ETag 是否一致，若一致且 If-Modified-Since 时间大于等于文件最后修改时间，判定缓存未更新，返回 304 Not Modified 并清空响应体，否则返回 200 并携带新文件。",
      thinkingProcess: "1. 协商时序：强缓存过期 -> 发起请求 -> 带上本地缓存凭证 -> 服务器比对 -> 判定结果。\n2. 头字段对应：\n   - ETag（服务端响应头返回） -> `If-None-Match`（客户端再次请求时携带）。\n   - Last-Modified（服务端响应头返回） -> `If-Modified-Since`（客户端再次请求时携带）。\n3. 优先级原则：W3C 规范规定，`If-None-Match` 优先级更高。如果 ETag 校验不匹配，直接返回 200，不再进行 `If-Modified-Since` 的时间戳比对。",
      deepDive: "304 协商缓存流程时序图与字段映射逻辑：\n```text\n【浏览器】 ----------------(1. 请求资源)----------------> 【服务器】 (返回 200 + ETag: \"xyz\" + Last-Modified: 10:00)\n  ↓ (过了一小时，强缓存过期)\n【浏览器】 --(2. 带 If-None-Match: \"xyz\" 及 If-Modified-Since: 10:00)--> 【服务器】\n                                                                 │ (服务器校验)\n                                                                 ├──> 若 ETag === \"xyz\" 且时间未变：\n                                                                 │     返回 304 Not Modified (不包含 Body，极速返回)\n                                                                 └──> 若文件被编辑，ETag 变成 \"abc\"：\n                                                                       返回 200 OK + 新 ETag + 最新文件内容\n```",
      structured: [
        "请求凭证组装：强缓存失效后，浏览器自动提取上次响应的 ETag 和 Last-Modified，并装入对应 If- 头部发送",
        "比对优先级：服务器接收后，优先进行 `If-None-Match` 字符串内容比对，ETag 一致是协商缓存生效的首要关卡",
        "时间辅助核对：若没有 ETag 或 ETag 一致，服务器核对 `If-Modified-Since` 晚于或等于当前系统记录的文件修改时刻",
        "304 宣告：双重校验或单 ETag 校验成功，回复 307/304 报文，浏览器直接从沙箱缓存中提取资源，页面渲染完成"
      ]
    },
    keyPoints: ["304 产生流程", "If-None-Match", "If-Modified-Since", "ETag 优先级", "协商缓存机制"],
    traps: ["在多机部署集群中，若各台服务器计算 ETag 的算法不一致（如 Apache/Nginx 默认会把文件 inode 写入 ETag），会导致同一文件在不同机器间请求时频繁发生 ETag 错位判定而导致 304 失效，应关闭 ETag 里的 inode 选项"],
    relatedIds: ["interview_net_007"]
  },
  {
    id: "interview_net_046",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "DNS 安全与加密：DoH (DNS over HTTPS) vs DoT (DNS over TLS)",
    difficulty: 3,
    frequency: 3,
    question: "传统的 DNS 查询存在什么安全风险？DoH（DNS over HTTPS）和 DoT（DNS over TLS）是如何解决这些风险的？它们之间有什么区别和应用前景？",
    answer: {
      short: "传统 DNS 明文传输存在被监听、篡改（DNS 劫持）和投毒风险；DoT 在 TCP 层通过 TLS 协议加密 DNS 查询（端口 853），防范窃听但流量特征明显；DoH 将 DNS 查询封装在 HTTP/2 或 HTTP/3 的 HTTPS 请求中（端口 443），其流量与普通网页流量完全混淆，具有最强的抗审查和防阻断能力。",
      thinkingProcess: "1. 传统安全痛点：传统 DNS 发送的是明文 UDP 53 包。沿途的 ISP 宽带运营商或黑客可以随时截获该包，把 `google.com` 强行解析为一个钓鱼 IP（DNS 劫持），或者监听用户的访问域名画像。\n2. DoT 原理：将 DNS 请求直接通过 TLS 封装。端口改用 853。安全，但因为端口特殊，中间防火墙如果想阻断加密 DNS，直接封掉 853 端口即可。一刀切。\n3. DoH 原理：把 DNS 请求作为 `https://dns.cloudflare.com/dns-query?name=google.com` 的普通网页 POST/GET 流量发送。走的是标准的 443 端口。网络路由器和防火墙根本分不清这到底是你在看网页还是在解析域名，无法单独阻断，抗审查能力最高。",
      deepDive: "DoH (DNS over HTTPS) 还能无缝享受 **HTTP/2 的多路复用和首部压缩** 优化。在解析大量子域名静态资源时，DoH 可以在同一个 HTTPS 通道里并发发送数十个域名查询，且利用 HPACK 压缩掉重复的 User-Agent 头部，时延甚至低于普通的 UDP 建立开销。",
      structured: [
        "明文危机：传统 DNS 走 53 端口明文 UDP 协议，网络运营商可通过旁路监听分析用户画像，或发起 DNS 污染篡改",
        "DoT (DNS over TLS)：使用专门的 853 端口进行 TLS 加密传输，协议底层彻底安全，但物理端口特征过于明显易被阻断",
        "DoH (DNS over HTTPS)：将域名查询以 JSON-like 格式打包在常规的 HTTPS (443 端口) 报文内传输，与全网网页流量完美混淆，防封锁性最强",
        "应用趋势：各大操作系统及主流浏览器（Chrome/Firefox）已默认内置 DoH 一键切换，成为隐私保护的现代标配"
      ]
    },
    keyPoints: ["DoH", "DoT", "DNS 劫持", "DNS 污染", "UDP 53端口", "443 端口混淆"],
    traps: ["启用 DoH 会绕过本地局域网（如企业内网、学校网）的 DNS 拦截规则，可能导致企业内网的域名审计和广告拦截策略失效"],
    relatedIds: ["interview_net_004"]
  },
  {
    id: "interview_net_047",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "TCP 快速打开（TFO - TCP Fast Open）协议原理",
    difficulty: 4,
    frequency: 3,
    question: "什么是 TCP 快速打开（TFO）协议？它是如何将 TCP 三次握手中的第二次连接往返时延（RTT）降低为 0 的？其底层的 Cookie 验证机制是怎样的？",
    answer: {
      short: "TFO 是对 TCP 握手的优化协议；在首次连接时，服务器生成加密 Cookie 返回给客户端并缓存；在后续重连时，客户端在发送 SYN 报文时直接携带该 Cookie 和应用层数据，服务器验证 Cookie 合法后，在未收到第三步 ACK 前即可直接将数据派发给应用层并返回 SYN-ACK，实现了首包 0-RTT 的快速数据传输。",
      thinkingProcess: "1. 传统局限：普通的 TCP 必须等三次握手彻底完了（第三步 ACK 到了服务器），服务器才允许读取客户端的数据。这白白浪费了 1 个 RTT 的等待时延。\n2. TFO 提速：在第一次建连时，客户端请求 TFO Cookie。服务器把客户端 IP 加密算个 Cookie 回传。客户端把 Cookie 存在本地。\n3. 0-RTT 飞跃：第二次连接时，客户端直接发 `SYN + Cookie + HTTP GET`。服务器一核对 Cookie，判定是合法 IP，直接把 HTTP GET 的数据塞给后端的 Web 进程去算数据，并回复 `SYN-ACK + HTTP Response`。实现了在第一声打招呼时就完成了数据的回传。",
      deepDive: "TFO 防御重放攻击（Replay Attack）的机制：\n因为 `Cookie` 内部包含了客户端的 IP 地址和服务器的密钥。如果黑客截获了 SYN + Cookie 并重放，由于黑客的 IP 变了，服务器解密 Cookie 时会发现 IP 不匹配，直接拒绝并退回到普通的三次握手建连，保障了协议的强壮性。",
      structured: [
        "握手冗余：传统 TCP 连接必须先空跑三次握手完成，数据的发送只能在第三步 ACK 之后随同进行，时延高",
        "首次握手（Cookie 派发）：客户端发送带 TFO 请求的 SYN，服务器计算带有加密信息的一次性 Cookie 伴随 SYN-ACK 返回并缓存",
        "后续握手（0-RTT 提速）：客户端直接发起 `SYN + TFO Cookie + 数据 payload`，服务器直接剥离并传递给应用层计算，未等 ACK 到达即可返回业务数据",
        "兼容现状：需要两端操作系统内核（如 Linux 3.7+ 默认支持）和应用层 API 共同配置开启支持"
      ]
    },
    keyPoints: ["TFO 快速打开", "0-RTT", "TCP Cookie 机制", "SYN 数据携带", "时延优化"],
    traps: ["TFO 只能优化“重连/后续连接”的效率，首次连接依然需要完整的 1 RTT 进行 Cookie 的获取和验证"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_net_048",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "base",
    topic: "network",
    title: "客户端负载均衡 vs 服务端/DNS 负载均衡",
    difficulty: 3,
    frequency: 4,
    question: "在分布式微服务架构中，客户端负载均衡（如 Ribbon）与服务端负载均衡（如 Nginx、LVS）以及 DNS 负载均衡有什么区别？各适用于什么层面？",
    answer: {
      short: "DNS 负载均衡用于解析阶段，将不同地域的域名请求导向不同机房的反向代理；服务端负载均衡（如 Nginx/LVS）位于流量入口，通过单点代理分发流量到后端内网集群，存在单点瓶颈；客户端负载均衡（如 Ribbon）由微服务客户端直接维护后端实例列表并根据算法自选调用，无中间中转，效率最高。",
      thinkingProcess: "1. 三者层次：DNS（全局骨干级，外网入口） -> 服务端（局域网网关级，内网入口） -> 客户端（微服务内部节点，RPC级）。\n2. 服务端（Nginx）瓶颈：所有流量必须先流经 Nginx。如果并发极高，Nginx 自身的网卡带宽和 CPU 会成为最大木桶短板。\n3. 客户端负载均衡：微服务 A 调用微服务 B。A 通过注册中心（Eureka/Nacos）拉取 B 的 10 个实例地址。A 内部用轮询或随机算法自选一个 IP 发起 RPC 调用。不需要 Nginx 中转，彻底去中心化，可线性扩容。",
      deepDive: "各种负载均衡层次架构图对比：\n```text\n【用户】 ────(DNS 负载均衡)────> 广州机房 (Nginx) 或 北京机房 (Nginx)\n                                  │\n                       (服务端 LVS/Nginx 负载)\n                                  │\n                                  ▼\n                      【微服务网关 (Gateway)】\n                                  │\n                       (客户端 Ribbon 负载自选)\n                                  ▼\n                  【Service A1】 ────> 【Service B2】 (直接 RPC，不去中心中转)\n```",
      structured: [
        "DNS 负载均衡：最外层。根据 GSLB 和解析规则将域名分流至各物理机房出口，调度粗粒度，受限于客户端 DNS 缓存刷新迟滞",
        "服务端负载均衡（LVS/Nginx）：中间层。流量汇聚到单点代理反向代理，执行 SSL 卸载、安全过滤、硬件负载分发，适合南北向流量",
        "客户端负载均衡（Ribbon）：微服务内网层。服务消费端在本地缓存注册中心的服务列表，自行运行算法直连目标节点，适合东西向 RPC 流量",
        "优势对比：客户端负载均衡彻底消除中间中转网络开销，单点瓶颈低，支持极高性能的线性横向扩容"
      ]
    },
    keyPoints: ["客户端负载均衡", "服务端负载均衡", "DNS 负载均衡", "Ribbon", "Nginx", "东西向流量"],
    traps: ["客户端负载均衡必须高度依赖“服务注册中心”的健康状态。如果注册中心挂了或者服务节点刷新不及时，客户端可能会因为拿着陈旧的实例列表而持续调用死节点"],
    relatedIds: ["interview_net_025"]
  },
  {
    id: "interview_net_049",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "OSI 七层模型与 TCP/IP 四层模型映射映射",
    difficulty: 1,
    frequency: 4,
    question: "请写出 OSI 七层模型与 TCP/IP 四层模型的对应映射关系，并说明各层中传输的数据单元名称名称（帧、包、段等）。",
    answer: {
      short: "OSI 七层从上到下为应用、表示、会话、传输、网络、数据链路、物理层；TCP/IP 四层为应用层（对应 OSI 前三层）、传输层、网络层、网络接口层；数据单元名称在应用层为报文（Message），传输层为段（Segment），网络层为包（Packet），链路层为帧（Frame），物理层为比特（Bit）。",
      thinkingProcess: "1. 映射关系：\n   - 应用、表示、会话 -> TCP/IP 应用层。\n   - 传输层 -> TCP/IP 传输层。\n   - 网络层 -> TCP/IP 网络层。\n   - 数据链路、物理层 -> TCP/IP 网络接口层。\n2. 数据封装（Encapsulation）术语：\n   - 传输层：TCP segment / UDP datagram。\n   - 网络层：IP packet。\n   - 链路层：Ethernet frame。\n   - 物理层：Bit stream。",
      deepDive: "当我们在应用层发起一个 `GET /` 请求时：\n1. 应用层生成 HTTP 报文。\n2. 传输层在其前面贴上 TCP 报文头（包含源端口、目的端口），封装成 **Segment**。\n3. 网络层在其前面贴上 IP 报文头（包含源 IP、目的 IP），封装成 **Packet**。\n4. 数据链路层在前后贴上以太网首尾部（包含源 MAC、目的 MAC 以及 CRC 校验），封装成 **Frame**。\n5. 物理网卡将这一帧翻译成 010101 电信号（**Bit**）发送出去。这就是经典的 TCP/IP 数据封装与解封装管道。",
      structured: [
        "应用层（Application）：提供应用接口，代表协议有 HTTP, DNS, SMTP, FTP. 数据单元：报文 (Message)",
        "传输层（Transport）：提供端到端可靠/不可靠通信，代表协议有 TCP, UDP. 数据单元：段 (Segment)",
        "网络层（Network）：负责点到点寻址与路由选择，代表协议有 IP, ICMP, ARP. 数据单元：包 (Packet)",
        "链路层与物理（Link & Physical）：负责物理网卡及网线间的物理传输，代表协议有以太网. 数据单元：帧 (Frame) / 比特 (Bit)"
      ]
    },
    keyPoints: ["OSI 七层模型", "TCP/IP 四层模型", "数据封装", "报文段", "IP数据包", "以太网帧"],
    traps: ["网关和路由器工作在不同的层次：路由器工作在第三层（网络层，看IP），而普通交换机工作在第二层（链路层，看MAC）"],
    relatedIds: []
  },
  {
    id: "interview_net_050",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "TCP 与 UDP 协议根本区别",
    difficulty: 1,
    frequency: 5,
    question: "请对比 TCP 与 UDP 协议在可靠性、连接状态、传输效率、报文结构及首部大小上的根本区别。",
    answer: {
      short: "TCP 是面向连接、可靠传输（有确认、重传、流控）、面向字节流的，首部最小 20 字节，适合网页、文件传输；UDP 是无连接、不可靠传输（只管发、不保证收到）、面向报文的，首部仅 8 字节，开销极小，适合直播、游戏和 DNS 查询。",
      thinkingProcess: "1. 根本对比：可靠性 vs 效率。\n2. 结构差异：\n   - TCP 报文头：20-60字节。包含序号、确认号、滑动窗口、各种状态标志位。\n   - UDP 报文头：恒定 8 字节。只有源端口、目的端口、长度、校验和。\n3. 字节流 vs 报文：\n   - TCP 面向字节流：数据没有边界，像水流一样，接收方需要自己处理“粘包”问题。\n   - UDP 面向报文：保留数据边界，发多大收多大，不粘包，但超限会发生分片。",
      deepDive: "为什么实时视频和大型游戏用 UDP 更好？\n在网络抖动时，如果使用 TCP，由于丢包重传机制，后续的数据包会被强行阻塞。对于视频通话，1秒前的老图像重传回来已经毫无意义，反而导致画面卡顿延迟。使用 UDP 即使丢了一帧，播放器可以直接跳过这一帧去渲染下一帧，画面只会微微闪烁一下但保证了音视频的绝对实时性。",
      structured: [
        "连接性质：TCP 是面向连接的可靠通道（三次握手）；UDP 是无连接的、IP 数据包的直接投递",
        "可靠机制：TCP 引入 ACK 应答、超时重传、滑动窗口流量控制、拥塞避免；UDP 纯属尽力而为（Best-effort），丢包不反馈",
        "流式区别：TCP 面向字节流，数据无边界需要处理粘包；UDP 面向报文，发送边界与接收边界完全对齐",
        "首部负担：TCP 报文头最少 20 字节（包含大量控制状态）；UDP 报文头恒定 8 字节，网路开销极小"
      ]
    },
    keyPoints: ["TCP", "UDP", "面向字节流", "面向报文", "报文头开销", "粘包问题"],
    traps: ["TCP 面向字节流会导致接收端在读取数据时发生“粘包（Nagle算法合并）”或“半包”现象，在应用层必须自己通过定义包头长度或特殊分隔符来分包"],
    relatedIds: ["interview_012"]
  },
  {
    id: "interview_net_051",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTP Keep-Alive 与 TCP Keepalive 区别",
    difficulty: 2,
    frequency: 4,
    question: "HTTP Header 中的 Connection: keep-alive 与 TCP 协议底层的 Keepalive（保活机制）有什么根本区别？",
    answer: {
      short: "HTTP Keep-Alive 是应用层机制，用于复用同一个 TCP 连接发送多个 HTTP 请求以规避频繁握手开销；TCP Keepalive 是传输层机制，通过在空闲时段发送探测报文检测连接是否假死及对端是否在线。",
      thinkingProcess: "1. 层次不同：应用层 vs 传输层。\n2. 目的不同：提升传输效率（复用） vs 探测连接健康状况（探活）。\n3. 细节：HTTP Keep-Alive 默认在 HTTP/1.1 开启，节省三次握手时间。TCP Keepalive 在 Linux 内核中由 tcp_keepalive_time（通常2小时）控制，定时发无数据的 ACK 包探活。",
      deepDive: "在 Web 服务器开发中，如果客户端断网但没有正常关闭连接，服务器会残留一条“幽灵连接（Ghost Connection）”，白白吃掉文件描述符。TCP Keepalive 用于在 2 小时无数据交互后，自动启动心跳探测，若连续多次无响应则强制断开该死连。而 HTTP Keep-Alive 则通过指定 `timeout=5, max=100` 让 Nginx 在空闲 5 秒后主动挥手断开，防止连接被长期无意义占满。",
      structured: [
        "HTTP Keep-Alive（应用层）：在 HTTP/1.1 中默认开启，使同一个 TCP 通道可以多次复用传输 HTTP 请求，消除频繁建连时延",
        "TCP Keepalive（传输层）：操作系统内核保活探测机制。当连接空闲超限（默认 7200 秒），自动发送零字节 ACK 探测包",
        "保活救灾：若接收端崩溃或网络断开导致连接失联，TCP 探活多次未响应会强制终止该 TCB 释放端口资源",
        "协作关联：现代 Web 服务通常关闭或缩短 HTTP keepalive 闲置时间以应对海量短连接，而 TCP Keepalive 作为系统底层底座保驾护航"
      ]
    },
    keyPoints: ["Connection: keep-alive", "TCP Keepalive", "连接复用", "保活探测", "幽灵连接"],
    traps: ["不要把应用层的 keep-alive 超时时间当作传输层的 TCP 探测时间，前者一般以秒计，后者以小时计"],
    relatedIds: ["interview_012", "interview_net_009"]
  },
  {
    id: "interview_net_052",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTPS 证书链与信任传递机制",
    difficulty: 3,
    frequency: 4,
    question: "什么是 HTTPS 证书链（Certificate Chain）？浏览器是如何通过证书链和根证书（Root CA）验证一个服务器证书是合法的？",
    answer: {
      short: "证书链是由服务器证书、中间 CA 证书和根 CA 证书构成的信任链条；浏览器利用内置的权威根 CA 公钥，逐级解密和验证上一级证书颁发者的数字签名是否合法，直到推导确认服务器证书的可信度，任何一环被篡改即会发出证书不安全警告。",
      thinkingProcess: "1. 链条构成：服务器证书 -> 中间 CA -> 根 CA。\n2. 校验签名：利用公钥加密体系的不可逆和非对称性。用上级的公钥解密下级的签名 Hash，与下级证书算出的 Hash 对比，吻合代表未被篡改。\n3. 信任终点：系统或浏览器中预装的可信根证书。如果根证书一致，则全链条可信。",
      deepDive: "数字签名（Digital Signature）生成与校验原理：\n中间 CA 用自己的私钥对服务器证书（包含域名、公司名、公钥等）的散列值（SHA256）进行加密，生成签名并附在证书末尾。浏览器下载证书后，用中间 CA 的公钥解密该签名得到 Hash A，同时对证书内容用 SHA256 重新计算得到 Hash B。比对 Hash A === Hash B 即可确信该证书未被中间人篡改，且颁发者身份属实。",
      structured: [
        "信任传递：服务器证书由中间 CA 签发，中间 CA由根 CA 签发，形成一条链条",
        "数字签名防伪：使用颁发者的“私钥”加密证书内容摘要生成签名；浏览器使用其“公钥”解密核对",
        "本地信任锚点：Windows/macOS/Chrome 内部出厂便固化预装了全球百余家权威 Root CA 的公钥证书",
        "撤销校验（CRL/OCSP）：除了校验签名，浏览器还会通过在线证书状态协议（OCSP）向 CA 查询该证书当前是否被中途吊销"
      ]
    },
    keyPoints: ["证书链", "数字签名", "根证书 Root CA", "中间 CA", "OCSP 校验"],
    traps: ["服务器配置 SSL 证书时，如果不小心漏掉了中间证书（Intermediate Certificate）的合流配置，会导致部分移动端浏览器因找不到信任链中间节点而报证书不安全错"],
    relatedIds: ["interview_011"]
  },
  {
    id: "interview_net_053",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "ALPN 协议与应用层协议协商原理",
    difficulty: 4,
    frequency: 3,
    question: "什么是 ALPN (Application-Layer Protocol Negotiation) 协议？它在 TLS 握手中是如何帮助浏览器和服务器协商使用 HTTP/2 或 HTTP/3 的？",
    answer: {
      short: "ALPN 是 TLS 协议的扩展，允许在 TLS 握手阶段（ClientHello 与 ServerHello）直接协商出后续使用的应用层协议（如 h2、http/1.1）；它避免了握手完成后再发起额外往返进行协议升级，大幅缩短了连接握手时间。",
      thinkingProcess: "1. 由来：为了解决 SPDY / HTTP2 在建连时需要再次向服务端询问是否支持升级的 RTT 开销。之前用 NPN（Next Protocol Negotiation，客户端决定），ALPN 则是服务端最终裁决并宣布，更安全高效。\n2. 机制：ClientHello 带上 `alpn` 扩展，列出 `['h2', 'http/1.1']`。ServerHello 回应最终选定的 `h2`。TLS 握手完毕后，数据传输直接按 h2 帧格式发起。",
      deepDive: "因为 ALPN 的存在，客户端不需要经历从 HTTP/1.1 发起连接，再收到 101 Upgrade 转向 HTTP/2 的传统折腾流程。所有的协议协商都在明文的 ClientHello 和 ServerHello 交换里顺道完成了，使 HTTP/2 的握手延时完美等同于普通的 HTTPS 建连开销。",
      structured: [
        "传统弊端：握手完毕后，再次使用 HTTP Upgrade 头或者 NPN 进行二次升级协商，白白增加 1 RTT 时延",
        "ClientHello 提议：客户端在 TLS ClientHello 的 Extension 中塞入支持的协议标识列表（如 h2, http/1.1）",
        "ServerHello 决断：服务器从提议列表中挑选自己支持的最优协议，在 ServerHello 中回传宣告最终确定项",
        "握手零开销：随着 TLS 握手结束，两端立即启用选定协议，协商过程不引入任何额外的网络往返"
      ]
    },
    keyPoints: ["ALPN", "TLS 扩展", "HTTP/2 协商", "NPN 替代", "1-RTT"],
    traps: ["HTTP/2 规范强制要求必须在 TLS 下启用 ALPN。如果在非安全 HTTP 连接下，ALPN 将无法工作，浏览器通常会直接降级使用 HTTP/1.1"],
    relatedIds: ["interview_net_009", "interview_net_022"]
  },
  {
    id: "interview_net_054",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "同源策略（SOP）定义与沙箱隔离机制",
    difficulty: 1,
    frequency: 4,
    question: "什么是浏览器的同源策略（Same-Origin Policy）？它在哪些维度（DOM 访问、Cookie 读取、Ajax 请求）对网页安全进行了限制？",
    answer: {
      short: "同源策略是指协议、域名和端口必须完全相同的网页才能相互读取数据；它限制了不同源的网页间通过 iframe 互相读取 DOM 树结构、限制读取对方的 Cookie/LocalStorage，以及限制通过 Ajax（XMLHttpRequest）读取对方的 HTTP 响应内容。",
      thinkingProcess: "1. 核心定义：Same-Origin (Protocol, Host, Port)。\n2. 限制维度：DOM（iframe防护）、Cookie/Storage（防窃取Token）、网络（防跨域偷窃数据）。\n3. 允许放行：同源策略允许加载跨域的静态资源（如 <script src>, <img src>, <link href>），这也是 CDN 正常工作的基础，但这些资源的代码无法通过 JS 读取其内部的精细内容（除非有 CORS 授权）。",
      deepDive: "同源策略对 Ajax 的限制本质上是“读拦截”而非“写拦截”。即跨域 Ajax 请求其实已经顺利到达了服务器，服务器也完成了数据处理并把 200 OK 响应体发回了浏览器，但在网卡接收阶段，浏览器沙箱发现对方没有配置 CORS 响应头许可，于是为了保护用户安全，直接将响应数据拦截并抛出错误，阻止前端 JS 读取数据。",
      structured: [
        "同源三要素：协议（HTTP/HTTPS）+ 域名（Domain）+ 端口（80/443/8080），三者完全相同称为同源",
        "DOM 隔离：禁止不同源的网页通过 `window.parent` 或 iframe 对内部 DOM 进行读取或修改操作",
        "存储隔离：禁止 JS 跨域读取其他域名的 Cookie, LocalStorage 及 IndexedDB 敏感数据",
        "请求拦截：限制跨域发起 XMLHttp / Fetch 请求。请求能发出、服务器能处理，但浏览器沙箱会拦截读回应答体"
      ]
    },
    keyPoints: ["同源策略", "SOP", "三要素一致", "跨域请求限制", "沙箱安全机制"],
    traps: ["`<script>` 标签引入外部 JS 并不受同源策略限制，这也是早期 JSONP 跨域技术能成功加载数据的漏洞原理基础"],
    relatedIds: ["interview_net_010"]
  },
  {
    id: "interview_net_055",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "base",
    topic: "network",
    title: "网络四大常见漏洞安全防御底线",
    difficulty: 3,
    frequency: 5,
    question: "请分别简述 XSS, CSRF, SQL 注入和 SSRF 漏洞的定义及防范这四类安全问题的底线原则是什么？",
    answer: {
      short: "XSS 是跨站脚本攻击，靠 HTML 转义和 HttpOnly 防御；CSRF 是跨站请求伪造，靠 SameSite Cookie 和 CSRF Token 防御；SQL 注入是恶意 SQL 指令拼装，靠参数化查询（Prepare）防范；SSRF 是服务端请求伪造，靠内网 IP 黑名单及域名白名单拦截防御。",
      thinkingProcess: "1. 四大经典漏洞定义及前沿底线防御。\n2. SQL 注入底线：绝对禁止拼接 SQL 字符串，一律使用 PreparedStatement 预编译占位符，由数据库引擎强行做语义分离。\n3. SSRF (Server-Side Request Forgery)：攻击者诱导服务器代替自己去请求内网私有地址（如 `http://192.168.1.1/admin`）。防范底线是禁止服务端直接请求用户输入的任意 URL，必须对解析出的 IP 执行内网 CIDR 段（如 10.0.0.0/8）强行拉黑拦截。",
      deepDive: "SSRF 防范的难点是防止 DNS Rebinding（DNS 重绑定攻击）。攻击者配置一个动态 DNS，在第一次解析时指向公网安全 IP 以绕过服务器白名单校验，在服务器发起实际 fetch 瞬间瞬间将 DNS 解析修改为 `127.0.0.1`。防御手段是在解析阶段锁定 IP，后续请求直接对解析出的物理 IP 发起请求，并在 Host 头中携带原域名，杜绝二次解析发生重绑定劫持。",
      structured: [
        "XSS（跨站脚本）：黑客注入 JS 脚本越权执行。防范：HTML 转义、Content Security Policy 阻断、HttpOnly 锁死 Cookie",
        "CSRF（跨站请求伪造）：冒用浏览器 Cookie 发送请求。防范：设置 SameSite=Lax 限制跨域发送、Header 强制校验 CSRF Token",
        "SQL 注入：恶意输入改变 SQL 语法语义。防范：一律使用 SQL 预编译（Prepared Statement）进行参数化绑定",
        "SSRF（服务端请求伪造）：诱导服务器打内网机器。防范：严格限制协议为 HTTP/HTTPS，禁止解析并访问内网私有 IP 段"
      ]
    },
    keyPoints: ["XSS 攻击", "CSRF 劫持", "SQL 预编译", "SSRF 内网探测", "DNS 重绑定"],
    traps: ["SQL 注入不仅会泄漏数据，在某些配置不当的数据库环境下（如 SA 权限的 SQL Server），黑客可以通过执行 xp_cmdshell 直接拿到服务器操作系统的 Root 控制权"],
    relatedIds: []
  },
  {
    id: "interview_net_056",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "HTTP 请求方法深度对比：GET vs POST",
    difficulty: 2,
    frequency: 5,
    question: "请对比 HTTP 请求方法中 GET 和 POST 的区别。从幂等性、缓存、参数携带位置及报文大小限制等方面进行详细阐述。",
    answer: {
      short: "GET 是幂等的、可缓存的，参数拼接在 URL 路径上，大小受浏览器 URL 长度限制，只用于获取数据；POST 是非幂等的、不可缓存的，参数携带在请求体（Request Body）中，大小无限制，主要用于修改和创建数据。",
      thinkingProcess: "1. 规范核心：幂等性（Idempotency）。GET 无论执行多少次，对系统资源的影响都一样（只读）；POST 每次执行都会新建或修改状态（非幂等，如支付接口）。\n2. 缓存差异：GET 响应可以被浏览器、代理服务器和 CDN 缓存；POST 默认严禁缓存。\n3. 大小误区：HTTP 协议本身对 URL 和 Body 都没有做任何大小限制。URL 的长度限制是各家浏览器和 Web 服务器在软件工程层面的防内存爆满配置限制。",
      deepDive: "关于 POST 会发送两个 TCP 包的误区说明：部分文章称“POST 会先发 Header 收到 100 Continue，再发 Body”。这并不是 HTTP 协议的强制规范，而是部分浏览器或 HTTP Client 库为了防范大文件传输失败做的内部策略。在现代大流量场景下，绝大部分浏览器发起 POST 时，Header 和 Body 会在一个 TCP 数据包中打包发出，以减少网络往返消耗。",
      structured: [
        "幂等性差异：GET 为纯读接口，具有强幂等性；POST 为写操作，非幂等（连续发可能会产生两条重复记录）",
        "缓存控制：GET 资源能直接触发强缓存与协商缓存；POST 响应默认在绝大多数规范中禁止被缓存",
        "参数载体：GET 数据拼接在 URI QueryString，暴露在历史记录中；POST 数据封在 Body 内部，相对隐秘",
        "包体限制：GET 受浏览器 URL 2KB - 8KB 长度截断限制；POST 没有容量限制，可流式发送数 GB 二进制包"
      ]
    },
    keyPoints: ["GET", "POST", "幂等性", "HTTP 缓存", "URL 长度限制", "100 Continue"],
    traps: ["虽然 POST 把参数放在 Body 里，但如果未使用 HTTPS 进行 TLS 加密传输，在公网路由器上依然可以通过抓包明文读取 Body 里的所有内容，所以 POST 本身并不等同于“安全”"],
    relatedIds: ["interview_net_007"]
  },
  {
    id: "interview_net_057",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "base",
    topic: "network",
    title: "HTTP 劫持与 DNS 劫持防护机制",
    difficulty: 3,
    frequency: 4,
    question: "什么是 HTTP 劫持和 DNS 劫持？黑客是如何在网络通信中实施这两种劫持的？我们作为开发者该如何防范？",
    answer: {
      short: "DNS 劫持是在域名解析阶段返回错误的 IP 地址将用户引导至假网站，防范需开启 HTTPDNS 或 DoH 协议；HTTP 劫持是网络运营商或黑客在明文传输中拦截并修改 HTTP Response 插入垃圾广告，防范底线是全量强制开启 HTTPS，对传输流量进行全密文签名保护。",
      thinkingProcess: "1. 劫持机制：\n   - DNS 劫持：抢在正常解析回复前，或者修改 Local DNS 记录，返回错误 IP。\n   - HTTP 劫持：明文 TCP 通信。在网关处解析 HTML 并在 `<body>` 底端动态插入垃圾广告脚本。\n2. 防御核心：HTTPS。因为 HTTPS 数据全加密，中间人如果篡改，由于没有正确的对称密钥重新计算 MAC，客户端解析时当场发现并报错，彻底破坏了 HTTP 劫持的生存空间。",
      deepDive: "在移动端 App 开发中，防范 DNS 劫持最成熟的做法是引入 HTTPDNS。它绕过了本地操作系统的 Local DNS 解析，直接通过标准的 HTTP 接口向权威 DNS 发起域名查询，直接拿到 IP 后，由客户端 App 自行绑定 HTTP Request 的真实目标 IP 发起 TCP 连接，从根本上杜绝了运营商 DNS 的投毒和劫持漏洞。",
      structured: [
        "DNS 劫持（域名投毒）：在 DNS 解析的递归迭代中，伪造假的 IP 响应回复，让浏览器访问到黑客控制的钓鱼机房",
        "HTTP 劫持（旁路插入）：由于 HTTP 走明文，网关或路由器节点可直接在返回的 HTML 中强行注入广告和恶意脚本",
        "HTTPS 防御底线：数据包被 TLS 层层加密并加签，中间节点一旦篡改，浏览器由于解密失败会立刻中断连接并报警",
        "HTTPDNS 方案（移动端）：不走系统 DNS 端口，改走专有 HTTP 域名查询通道获取纯正 IP 集合进行直连建连"
      ]
    },
    keyPoints: ["DNS 劫持", "HTTP 劫持", "HTTPDNS", "全站 HTTPS", "消息完整性 MAC"],
    traps: ["在 HTTPS 站上，如果有少部分静态资源使用的是 http 协议（Mixed Content），这部分图片依然有可能被中间人劫持并替换成恶意广告图"],
    relatedIds: ["interview_net_011", "interview_net_046"]
  },
  {
    id: "interview_net_058",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "服务器推送全景：SSE vs WebSocket vs 轮询",
    difficulty: 3,
    frequency: 4,
    question: "请对比 SSE (Server-Sent Events), WebSocket 以及 Long Polling (长轮询) 在协议开销、网络兼容性、双向传输能力及断线重连支持上的差异。",
    answer: {
      short: "WebSocket 是全双工的、基于独立 TCP 隧道的长连接，支持高频双向通信，但协议开销和维护复杂度高；SSE 是单向的、基于标准 HTTP 协议的分块传输机制，支持自动重连和自定义事件，开发轻量极简，适合 ChatGPT 吐字和单向监控通知。",
      thinkingProcess: "1. 技术维度：单向 vs 双向，基于 HTTP vs 基于独立 TCP 通道。\n2. 长轮询：客户端定时请求，服务端 Hold 住。开销大。\n3. SSE：HTML5 标准，内置重连，Last-Event-ID，开发成本极低。\n4. WebSocket：全双工，实时性极高，但网络穿透一般，需要专门握手。",
      deepDive: "在需要大模型动态流式输出的 ChatGPT 场景中，选择 SSE 而不是 WebSocket 是因为：开发极简，走标准 HTTP 端口不需要额外配置握手穿透；浏览器原生 EventSource 会自动处理网络瞬断并自动重连，无需前端手写大量重连状态机代码。",
      structured: [
        "Long Polling（长轮询）：客户端定时请求，服务端 Hold 住连接延时返回。开销最大，已被时代边缘化",
        "WebSocket：真双向全双工，脱离 HTTP 走专有 WS 帧，开销最小，适合高频实时交互",
        "SSE（Server-Sent Events）：单向推送。利用 HTTP 的 chunked 传输将 text/event-stream 持续泵入客户端",
        "重连机制：SSE 浏览器自带 Last-Event-ID 原生自动重连；WebSocket 必须完全由前端手写检测和重连逻辑"
      ]
    },
    keyPoints: ["SSE", "WebSocket", "Long Polling", "Last-Event-ID", "单向推送", "EventSource"],
    traps: ["在 HTTP/1.1 下，浏览器对同一个域名有最多 6 个并发连接限制。如果开了 6 个 SSE 连接，会导致该域名下的其他普通 HTTP 请求全部卡死，在 HTTP/2 下无此限制"],
    relatedIds: ["interview_net_021", "interview_net_040"]
  },
  {
    id: "interview_net_059",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "base",
    topic: "network",
    title: "WebSocket 帧格式与掩码安全机制",
    difficulty: 3,
    frequency: 3,
    question: "WebSocket 的帧格式是怎样的？为什么客户端发送给服务端的数据帧必须进行“掩码”处理，而服务端发给客户端的却不用？",
    answer: {
      short: "WebSocket 帧由控制字（Opcode）、Payload 长度和掩码标志（Mask）等头部信息与数据体组成；客户端发服务端强制掩码是为了防范中间人代理缓存投毒攻击（阻止中间人缓存将解密后的帧当成 HTTP 响应误匹配给其他连接），服务端发客户端由于浏览器已具备独占沙箱环境，因此无需掩码。",
      thinkingProcess: "1. 帧格式：Opcode、Payload 长度、Mask-Key（4字节）。\n2. 掩码原因：防止代理缓存投毒。客户端混淆发送，中间代理无法缓存为静态资源响应；服务端回发数据浏览器沙箱天然隔离，无需掩码省CPU开销。",
      deepDive: "客户端掩码算法是客户端随机生成 4 字节的 MaskKey，与 payload 逐字节异或混淆。到达服务端后由服务端用相同的 MaskKey 执行异或还原，彻底破坏了利用静态缓存特征劫持透明代理的条件。",
      structured: [
        "WebSocket 帧结构：Opcode (4bit) + Mask 标志位 (1bit) + Payload len (7bit) + 4字节 MaskKey",
        "防范对象：针对局域网中的“中间透明代理缓存（Intermediary Proxies）”进行的缓存侧信道混淆",
        "掩码算法：客户端随机生成 4 字节 key，将 payload 进行逐字节按模 4 异或计算，公网链路呈乱码状",
        "单向约束：客户端 -> 服务端强制掩码；服务端 -> 客户端禁止掩码（减少浏览器解码开销）"
      ]
    },
    keyPoints: ["WebSocket 帧格式", "Masking 掩码", "XOR 异或计算", "代理缓存投毒", "安全防御"],
    traps: ["不要自己在后端解包时忽略了 Mask 标志位判断，格式不对应会导致解析为乱码"],
    relatedIds: ["interview_net_021"]
  },
  {
    id: "interview_net_060",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "base",
    topic: "network",
    title: "HTTP/2 HPACK 算法与霍夫曼编码机制",
    difficulty: 4,
    frequency: 3,
    question: "HTTP/2 中的头部压缩算法 HPACK 是如何工作的？静态表、动态表和哈希霍夫曼编码分别在压缩中起到什么作用？",
    answer: {
      short: "HPACK 通过三管齐下实现压缩：1. 静态表内置 61 个高频 HTTP 首部名值对（如 :method: GET），传输时仅传一个索引数字；2. 动态表在连接期间动态记录未包含在静态表中的自定义头部（如 Cookie），后续只传索引；3. 对于必须传明文的字符串，采用霍夫曼编码进行比特级无损压缩，将高频字符用短码表示，整体压缩率高达 80% 以上。",
      thinkingProcess: "1. 静态表：规范预定义 1-61 个常用 header。\n2. 动态表：连接期共享，LRU FIFO，重复发送只需引用索引。\n3. 霍夫曼编码：根据出现概率树压缩明文字符，极致减少字节开销。",
      deepDive: "HPACK 的动态表管理有严格的内存上限（默认 4096 字节）。当加入新头部超出上限时，最老的头部会被自动移出表格。因为动态表只在当前连接生命周期内生效，所以 HTTP/2 复用时间越长，头部压缩效果越显著。",
      structured: [
        "HPACK 构成：静态索引表（常驻61个键值对） + 动态索引滑动表（连接期共享，LRU淘汰） + 霍夫曼编码器",
        "静态表索引化：`:status: 200` 映射为索引 8，`:method: GET` 映射为索引 2，开销从十余字节缩减为 1 字节",
        "动态表去重：对于 Cookie 等长字符串，连接期间首次传输后写入动态表，后续再次请求时只传输索引",
        "比特霍夫曼压缩：根据字符概率树，将大写字母、符号用高压缩比 bit 序列替代传输，无损极致压缩"
      ]
    },
    keyPoints: ["HPACK 算法", "静态表", "动态表", "霍夫曼编码", "头部压缩", "HTTP/2 性能"],
    traps: ["为了防范 CRIME 等基于头部猜测的侧信道攻击，HPACK 对于 Authorization 或特别敏感的首部可以标记“禁止写入动态表”强制字样"],
    relatedIds: ["interview_net_009"]
  }
];

const fileContent = `// interview-network.js
// 自动生成主题题库：计算机网络 (归属于 base)

const questions = ${JSON.stringify(questions, null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-network.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-network.js with all 50 questions!');
