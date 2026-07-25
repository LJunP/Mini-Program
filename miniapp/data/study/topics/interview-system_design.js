// interview-system_design.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_system_design_005_database_sharding",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "system_design",
    "title": "数据库分库分表",
    "difficulty": 4,
    "frequency": 4,
    "question": "请解释数据库分库分表的策略和分片键选择。",
    "answer": {
      "short": "分表解决单表数据量大，分库解决单库并发压力。分片键决定数据分布，需避免跨片查询和热点。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【数据库分库分表】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 垂直分表：按字段拆分（热表+冷表）。\n2. 垂直分库：按业务拆分（订单库/用户库）。\n3. 水平分片：按 sharding key 分到多表。\n4. 分片策略：Hash（均匀有迁移）、范围（利于范围查有热点）。\n5. 分片键选查询频率最高字段。",
      "deepDive": "水平分片引入复杂性：跨片 JOIN、分布式事务、全局唯一 ID（Snowflake）。范围分片最后一片容易热点。Hash 分片节点增减需全量迁移。分库分表后分页查询极慢——需游标或 ES。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【数据库分库分表】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "垂直分表：热冷字段拆分",
        "垂直分库：按业务拆分",
        "水平分片：sharding key 分布",
        "Hash/范围分片策略",
        "分片键选查询最高频字段",
        "跨片查询：ES 宽表/数据冗余"
      ]
    },
    "keyPoints": [
      "分库分表",
      "ShardingSphere",
      "Snowflake",
      "一致性Hash",
      "跨片查询"
    ],
    "traps": [
      "面试官追问：分片键怎么选？答：查询频率最高字段。",
      "分库分表后分页查询为什么慢？答：跨片合并。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_system_design_019_distributed_transaction",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "system_design",
    "title": "分布式事务方案",
    "difficulty": 4,
    "frequency": 4,
    "question": "请比较 2PC、3PC、TCC、Saga、本地消息表五种分布式事务方案。",
    "answer": {
      "short": "2PC 强一致但阻塞，3PC 非阻塞但仍不一致，TCC 适合短事务，Saga 适合长流程，本地消息表最简单。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【分布式事务方案】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 2PC：协调者准备→提交。强一致但阻塞、协调者单点、数据不一致风险。\n2. 3PC：CanCommit→PreCommit→DoCommit。非阻塞但仍有不一致。\n3. TCC：Try-Confirm-Cancel。强隔离但侵入业务。\n4. Saga：正序执行+反序补偿。适合长流程。\n5. 本地消息表：业务+消息同事务，定时扫描发送。最终一致。\n6. 事务消息（RocketMQ）：half message+本地事务。",
      "deepDive": "2PC 的协调者宕机导致参与者阻塞。Seata 的 AT 模式是 2PC 优化：本地事务自动提交+ undo log 回滚。TCC 的 Confirm/Cancel 必须幂等。Saga 的补偿操作需业务设计。分布式事务的核心取舍：一致性 vs 可用性 vs 性能。互联网场景通常选最终一致性。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【分布式事务方案】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "2PC 强一致但阻塞协调者单点",
        "3PC 非阻塞仍可能不一致",
        "TCC Try-Confirm-Cancel 强隔离侵入业务",
        "Saga 正序执行+反序补偿长流程",
        "本地消息表最简单最终一致",
        "Seata AT/StarXman"
      ]
    },
    "keyPoints": [
      "分布式事务",
      "2PC",
      "3PC",
      "TCC",
      "Saga",
      "本地消息表",
      "Seata"
    ],
    "traps": [
      "面试官追问：2PC 的协调者宕机怎么办？答：阻塞。",
      "TCC 为什么必须幂等？答：Confirm/Cancel 可能重试。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_system_design_028_seckill",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "system_design",
    "title": "秒杀系统设计",
    "difficulty": 4,
    "frequency": 4,
    "question": "请设计一个秒杀系统，支撑百万级并发请求。",
    "answer": {
      "short": "前端限流+CDN 静态化+Nginx 限流+Redis 预扣库存+MQ 异步下单+DB 最终一致。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【秒杀系统设计】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 前端：按钮防抖+验证码+答题限流。\n2. CDN：静态页面+静态资源 CDN 分发。\n3. Nginx：limit_req 限流（漏桶）。\n4. API 网关：Token 校验+黑名单。\n5. Redis：预扣库存（DECR 原子操作），库存<=0 直接拒绝。\n6. MQ：异步下单写入 MQ，消费者按 DB 承受能力处理。\n7. DB：乐观锁扣减库存+唯一约束防超卖。\n8. 降级：DB 压力大时直接返回「排队中」。",
      "deepDive": "秒杀核心思想：层层削峰将百万 QPS 降到 DB 可承受的千级 TPS。Redis DECR 原子预扣：100 件商品扣到 0 后 99.99% 请求在前几层被拦截。MQ 异步保证 DB 不被打挂。超卖防护：Redis 预扣 + DB 乐观锁双重保障。热点数据隔离：秒杀订单表与普通订单表分离，避免影响普通交易。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【秒杀系统设计】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "前端防抖+验证码限流",
        "CDN 静态化减少服务端压力",
        "Nginx limit_req 限流",
        "Redis DECR 原子预扣库存",
        "MQ 异步下单削峰",
        "DB 乐观锁+唯一约束防超卖",
        "降级返回排队中",
        "秒杀订单表隔离"
      ]
    },
    "keyPoints": [
      "秒杀系统",
      "削峰",
      "Redis DECR",
      "MQ 异步",
      "乐观锁",
      "防超卖",
      "CDN",
      "Nginx限流"
    ],
    "traps": [
      "面试官追问：Redis DECR 预扣库存如果下单失败怎么办？答：回补库存+定时对账。",
      "秒杀表和普通交易表为什么隔离？答：避免影响普通交易。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_system_design_050_design_url_shortener",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "system_design",
    "title": "设计一个短 URL 系统",
    "difficulty": 4,
    "frequency": 4,
    "question": "请完整设计一个短 URL 系统，包括生成、存储、跳转、统计、高可用。",
    "answer": {
      "short": "发号器→Base62 编码→Redis+DB 存储→302 跳转+统计→多级缓存+高可用集群。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【设计一个短 URL 系统】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 生成：Snowflake 发号器→ID→Base62 编码→6 位短码。\n2. 存储：短码→长 URL 存 Redis（缓存）+ MySQL（持久化）。\n3. 跳转：短码→查 Redis→未命中查 DB→302 重定向→异步记录统计。\n4. 统计：点击量/来源/时间写入 Kafka→Spark 聚合→MySQL 报表。\n5. 高可用：多副本+Redis 集群+MySQL 主从+CDN。\n6. 布隆过滤器：短码查重防冲突。\n7. 预生成：提前生成一批短码存队列实时取用。\n8. 容量：6 位 Base62 = 568 亿短链，10 年足够。",
      "deepDive": "短链系统的核心 QPS 在跳转（读远大于写）。Redis 集群缓存短码映射，命中率>99% 时 DB 压力极低。302 vs 301：302 每次经过服务端可统计点击，301 浏览器缓存不统计。短码自定义：用户可自定义短码（如 bit.ly/my-product），需查重+保留词过滤。防滥用：频控+黑名单+短码内容审核。CDN 加速跳转：边缘节点直接 302 不回源。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【设计一个短 URL 系统】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "Snowflake 发号器→Base62 编码 6 位短码",
        "Redis 缓存+MySQL 持久化",
        "302 跳转可统计点击",
        "Kafka→Spark 聚合统计",
        "Redis 集群+MySQL 主从+CDN",
        "布隆过滤器查重",
        "预生成队列取用",
        "6 位=568 亿容量"
      ]
    },
    "keyPoints": [
      "短链系统",
      "Base62",
      "Snowflake",
      "302重定向",
      "布隆过滤器",
      "预生成",
      "CDN加速",
      "Kafka统计"
    ],
    "traps": [
      "面试官追问：短链跳转 QPS 极高怎么优化？答：Redis 缓存+CDN 边缘跳转。",
      "自定义短码怎么防冲突？答：查重+保留词。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_system_design_003_multi_level_cache",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "system_design",
    "title": "多级缓存架构",
    "difficulty": 3,
    "frequency": 5,
    "question": "请设计一个多级缓存系统并说明各级缓存的职责。",
    "answer": {
      "short": "浏览器缓存→CDN 边缘→本地缓存（Caffeine）→分布式缓存（Redis）→数据库。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【多级缓存架构】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 浏览器缓存：静态资源 Cache-Control+ETag。\n2. CDN 缓存：边缘节点，回源率<5%。\n3. 本地缓存（Caffeine）：JVM 内存，纳秒级。\n4. 分布式缓存（Redis）：跨节点共享，亚毫秒级。\n5. Cache-Aside：读时先查缓存→未命中查 DB→回填。",
      "deepDive": "布隆过滤器防缓存穿透。多级缓存一致性是个难题——需 TTL+消息通知+延迟双删。Write-Behind 异步写 DB 写性能高但可能丢数据。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【多级缓存架构】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "浏览器→CDN→本地→Redis→DB",
        "本地缓存纳秒级",
        "Redis 分布式亚毫秒级",
        "Cache-Aside 旁路缓存",
        "布隆过滤器防穿透",
        "多级缓存一致性 TTL+消息+双删"
      ]
    },
    "keyPoints": [
      "多级缓存",
      "Caffeine",
      "Redis",
      "Cache-Aside",
      "布隆过滤器",
      "Write-Behind"
    ],
    "traps": [
      "面试官追问：缓存穿透/击穿/雪崩怎么解决？答：布隆过滤器+互斥锁+TTL 随机。",
      "多级缓存一致性怎么保证？"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
