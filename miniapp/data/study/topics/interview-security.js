// interview-security.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_security_006_jwt",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "fullstack",
    "topic": "security",
    "title": "JWT 原理与安全",
    "difficulty": 3,
    "frequency": 5,
    "question": "请解释 JWT 的结构、优缺点和安全实践。",
    "answer": {
      "short": "Header.Payload.Signature 三段式。优点无状态，缺点无法主动失效。安全：短过期+RefreshToken+HttpOnly Cookie。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【JWT 原理与安全】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 结构：Header（算法）.Payload（数据）.Signature（签名）。\n2. 签名：HMAC（对称）或 RSA/ECDSA（非对称）。\n3. 优点：无状态、跨服务传递。\n4. 缺点：无法主动失效、Payload 不加密（Base64）。\n5. 安全实践：短过期 15min+RefreshToken、HttpOnly Cookie 存储。",
      "deepDive": "Payload 是 Base64 非加密。Refresh Token 存 HttpOnly Cookie。JWT 撤销：Redis 黑名单 JTI。算法混淆攻击：alg=none 绕过签名。RS256 适合微服务：网关签发公钥验证。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【JWT 原理与安全】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "Header.Payload.Signature 三段式",
        "Payload 是 Base64 不加密",
        "短过期 15min + Refresh Token",
        "HttpOnly Cookie 存储",
        "算法混淆攻击防护"
      ]
    },
    "keyPoints": [
      "JWT",
      "Payload",
      "Signature",
      "RefreshToken",
      "JTI",
      "RS256"
    ],
    "traps": [
      "面试官追问：JWT 如何主动失效？答：Redis 黑名单 JTI。",
      "算法混淆攻击是什么？alg=none。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_security_007_https_tls",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "fullstack",
    "topic": "security",
    "title": "HTTPS/TLS 握手原理",
    "difficulty": 3,
    "frequency": 5,
    "question": "请描述 TLS 1.2/1.3 握手过程和安全特性。",
    "answer": {
      "short": "TLS 1.2 需 2-RTT 握手，TLS 1.3 优化为 1-RTT 并支持 0-RTT。核心：证书验证+密钥协商+对称加密。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【HTTPS/TLS 握手原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. TLS 1.2：ClientHello→ServerHello+证书+密钥交换→Finished，2-RTT。\n2. TLS 1.3：合并步骤 1-RTT，支持 0-RTT 恢复。\n3. 证书链：服务端→中间 CA→根 CA。\n4. ECDHE 前向安全：私钥泄露不影响历史会话。\n5. AES-GCM 或 ChaCha20-Poly1305 对称加密。",
      "deepDive": "前向安全：ECDHE 每次生成临时密钥对。TLS 1.3 移除了 RSA 密钥交换和 CBC 模式。0-RTT 有重放风险只用于幂等请求。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【HTTPS/TLS 握手原理】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "TLS 1.2: 2-RTT，TLS 1.3: 1-RTT+0-RTT",
        "证书链：服务端→中间CA→根CA",
        "ECDHE 前向安全",
        "AES-GCM/ChaCha20 加密",
        "TLS 1.3 移除不安全算法"
      ]
    },
    "keyPoints": [
      "HTTPS",
      "TLS",
      "证书链",
      "ECDHE",
      "前向安全",
      "0-RTT"
    ],
    "traps": [
      "面试官追问：前向安全是什么？答：私钥泄露不影响历史。",
      "0-RTT 的重放风险？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_security_003_csp",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "fullstack",
    "topic": "security",
    "title": "CSP 内容安全策略",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释 CSP 的工作原理和配置策略。",
    "answer": {
      "short": "通过 HTTP 头声明资源加载白名单，阻止 XSS 数据外泄。核心：default-src 兜底+细粒度指令+nonce。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【CSP 内容安全策略】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 核心指令：default-src、script-src、style-src、img-src、connect-src。\n2. 关键值：'self'、'none'、'unsafe-inline'、nonce-xxx。\n3. report-uri：违规上报。\n4. strict-dynamic：允许被 nonce 脚本动态添加的脚本。\n5. report-only 模式：先观察不阻断。",
      "deepDive": "nonce-based CSP 是现代推荐方案。strict-dynamic 解决第三方脚本链信任传递。report-only 先观察后切换强制。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【CSP 内容安全策略】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "default-src 兜底+细粒度指令",
        "'self' 同源 / 'none' 禁止",
        "nonce-xxx 允许特定内联脚本",
        "strict-dynamic 信任传递",
        "report-uri 违规上报",
        "report-only 先观察"
      ]
    },
    "keyPoints": [
      "CSP",
      "default-src",
      "nonce",
      "strict-dynamic",
      "report-uri",
      "report-only"
    ],
    "traps": [
      "面试官追问：nonce-based CSP 的优势？",
      "strict-dynamic 解决什么问题？"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_security_011_oauth2",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "fullstack",
    "topic": "security",
    "title": "OAuth 2.0 授权流程",
    "difficulty": 3,
    "frequency": 4,
    "question": "请解释 OAuth 2.0 的四种授权模式和 PKCE。",
    "answer": {
      "short": "授权码（最安全）、隐式（废弃）、密码、客户端凭证。PKCE 防止授权码截获。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【OAuth 2.0 授权流程】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 授权码模式：跳转授权→回调 code→服务端换 token。\n2. PKCE：code_verifier + code_challenge 防截获。\n3. 隐式模式已废弃，被 PKCE+授权码替代。\n4. 客户端凭证：服务间 M2M。\n5. OIDC = OAuth + ID Token 做认证。",
      "deepDive": "授权码安全原因：token 只在服务端交换。PKCE 原理：前端生成 verifier，算 challenge，换 token 时校验 verifier。OIDC 在 OAuth 上加 ID Token。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【OAuth 2.0 授权流程】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "授权码：跳转授权→回调 code→换 token",
        "PKCE：verifier + challenge 防截获",
        "隐式模式已废弃",
        "客户端凭证：M2M",
        "OIDC = OAuth + ID Token"
      ]
    },
    "keyPoints": [
      "OAuth 2.0",
      "授权码",
      "PKCE",
      "隐式模式",
      "OIDC",
      "ID Token"
    ],
    "traps": [
      "面试官追问：PKCE 如何防止截获？答：verifier 校验。",
      "OAuth 和 OIDC 的区别？授权 vs 认证。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_security_012_rate_limiting",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "security",
    "title": "API 限流策略",
    "difficulty": 3,
    "frequency": 4,
    "question": "请比较固定窗口、滑动窗口、令牌桶、漏桶四种限流算法。",
    "answer": {
      "short": "固定窗口简单有突刺，滑动窗口精确，令牌桶允许突发，漏桶匀速输出。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【API 限流策略】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 固定窗口：每分钟计数，重置时突刺。\n2. 滑动窗口：时间窗口滑动更精确。\n3. 令牌桶：固定速率生成令牌，允许突发。\n4. 漏桶：固定速率处理，超出排队或拒绝。\n5. Redis + Lua 原子分布式限流。",
      "deepDive": "令牌桶适合 API（允许突发），漏桶适合保护下游（匀速）。Redis Lua 保证原子性。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【API 限流策略】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "固定窗口：简单有突刺",
        "滑动窗口：精确内存高",
        "令牌桶：允许突发",
        "漏桶：匀速输出",
        "Redis + Lua 原子"
      ]
    },
    "keyPoints": [
      "限流",
      "令牌桶",
      "漏桶",
      "滑动窗口",
      "Redis Lua"
    ],
    "traps": [
      "面试官追问：令牌桶和漏桶适用场景？突发 vs 匀速。",
      "Redis 限流为什么用 Lua？原子性。"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
