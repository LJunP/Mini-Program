#!/usr/bin/env python3
"""
gen_interview_complete.py — 完成剩余的 system_design 50题 + 合并逻辑
与 gen_interview_fill.py 配合使用
"""
import json
import os
import sys

# 导入 gen_interview_fill.py 中的函数和 make_question
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_interview_fill import make_question, gen_algorithms, gen_performance, gen_security


def gen_system_design():
    """生成 system_design 主题 50 道真实面试题"""
    Q = []
    a = lambda *args: Q.append(make_question(*args))

    a("interview_system_design_001_scalability", "baguwen", "backend", "system_design",
      "系统可扩展性设计", 2, 5,
      "请解释系统水平扩展和垂直扩展的区别及各自适用场景。",
      "垂直扩展（Scale Up）增加单机硬件，水平扩展（Scale Out）增加服务器数量。水平扩展无上限但需处理状态一致性。",
      "1. 垂直扩展：单机增加 CPU/内存/磁盘。简单但有硬件上限和单点故障。\n2. 水平扩展：增加服务器数量。无上限但需解决负载均衡、Session 共享、数据一致性。\n3. 无状态服务：服务层水平扩展，状态外置到 Redis/DB。\n4. 数据库分片：数据层水平扩展。\n5. CAP 定理约束分布式系统取舍。",
      "微服务架构天然适合水平扩展。数据库水平扩展最难——需分片+分布式事务。读写分离是入门方案。最终一致性是大多数互联网系统的选择。",
      ["垂直扩展有上限单点故障", "水平扩展无上限需负载均衡+状态共享", "无状态服务+状态外置", "数据库分片", "CAP 定理", "最终一致性"],
      ["可扩展性", "水平扩展", "垂直扩展", "Sharding", "CAP", "无状态"],
      ["面试官追问：为什么数据库水平扩展难？答：需分片+分布式事务。", "CAP 三选二的取舍？"])

    a("interview_system_design_002_load_balancing", "system_design", "backend", "system_design",
      "负载均衡策略", 2, 5,
      "请比较常见负载均衡算法及其适用场景。",
      "轮询、加权轮询、最少连接、IP Hash、一致性 Hash 各有适用场景。",
      "1. 轮询：依次分配，适合等性能服务器。\n2. 加权轮询：按性能权重分配。\n3. 最少连接：分配给连接最少的。\n4. IP Hash：相同 IP 固定到同一服务器。\n5. 一致性 Hash：节点增减只影响相邻节点。",
      "L4 负载均衡基于 IP+Port 性能高，L7 基于 HTTP 内容路由更灵活。一致性 Hash 解决全量迁移问题：虚拟节点解决数据倾斜。健康检查分主动和被动。",
      ["轮询：依次分配", "加权轮询：按性能权重", "最少连接：适合长连接", "IP Hash：Session 粘滞", "一致性 Hash：节点增减影响小", "L4 vs L7"],
      ["负载均衡", "轮询", "一致性Hash", "L4/L7", "健康检查", "Nginx"],
      ["面试官追问：一致性 Hash 解决什么问题？答：节点增减不全量迁移。", "L4 和 L7 的区别？"])

    a("interview_system_design_003_multi_level_cache", "system_design", "backend", "system_design",
      "多级缓存架构", 3, 5,
      "请设计一个多级缓存系统并说明各级缓存的职责。",
      "浏览器缓存→CDN 边缘→本地缓存（Caffeine）→分布式缓存（Redis）→数据库。",
      "1. 浏览器缓存：静态资源 Cache-Control+ETag。\n2. CDN 缓存：边缘节点，回源率<5%。\n3. 本地缓存（Caffeine）：JVM 内存，纳秒级。\n4. 分布式缓存（Redis）：跨节点共享，亚毫秒级。\n5. Cache-Aside：读时先查缓存→未命中查 DB→回填。",
      "布隆过滤器防缓存穿透。多级缓存一致性是个难题——需 TTL+消息通知+延迟双删。Write-Behind 异步写 DB 写性能高但可能丢数据。",
      ["浏览器→CDN→本地→Redis→DB", "本地缓存纳秒级", "Redis 分布式亚毫秒级", "Cache-Aside 旁路缓存", "布隆过滤器防穿透", "多级缓存一致性 TTL+消息+双删"],
      ["多级缓存", "Caffeine", "Redis", "Cache-Aside", "布隆过滤器", "Write-Behind"],
      ["面试官追问：缓存穿透/击穿/雪崩怎么解决？答：布隆过滤器+互斥锁+TTL 随机。", "多级缓存一致性怎么保证？"])

    a("interview_system_design_004_message_queue", "system_design", "backend", "system_design",
      "消息队列在系统中的作用", 3, 5,
      "请解释消息队列（Kafka/RabbitMQ）在系统设计中的三大作用。",
      "异步解耦、削峰填谷、广播通知。Kafka 适合高吞吐日志流，RabbitMQ 适合复杂路由和可靠投递。",
      "1. 异步解耦：订单发消息，库存/积分/通知异步消费。\n2. 削峰填谷：突发流量写入 MQ，消费者按能力处理。\n3. 广播通知：一个事件多个消费者。\n4. Kafka：高吞吐百万 TPS、分区有序。\n5. RabbitMQ：复杂路由、可靠投递、死信队列。",
      "异步解耦的收益：接口响应从 sum(所有服务) 降到 max(主流程)。消息一致性：本地消息表+定时补偿。DLQ 处理无法消费的消息。Kafka exactly-once 通过事务和幂等生产者实现。",
      ["异步解耦：非核心链路异步化", "削峰填谷：突发流量入 MQ", "广播通知：发布订阅", "Kafka 高吞吐百万 TPS", "RabbitMQ 复杂路由可靠投递", "DLQ 死信队列"],
      ["消息队列", "Kafka", "RabbitMQ", "RocketMQ", "异步解耦", "削峰填谷"],
      ["面试官追问：Kafka 和 RabbitMQ 怎么选？答：吞吐 vs 路由。", "消息一致性怎么保证？答：本地消息表+补偿。"])

    a("interview_system_design_005_database_sharding", "system_design", "backend", "system_design",
      "数据库分库分表", 4, 4,
      "请解释数据库分库分表的策略和分片键选择。",
      "分表解决单表数据量大，分库解决单库并发压力。分片键决定数据分布，需避免跨片查询和热点。",
      "1. 垂直分表：按字段拆分（热表+冷表）。\n2. 垂直分库：按业务拆分（订单库/用户库）。\n3. 水平分片：按 sharding key 分到多表。\n4. 分片策略：Hash（均匀有迁移）、范围（利于范围查有热点）。\n5. 分片键选查询频率最高字段。",
      "水平分片引入复杂性：跨片 JOIN、分布式事务、全局唯一 ID（Snowflake）。范围分片最后一片容易热点。Hash 分片节点增减需全量迁移。分库分表后分页查询极慢——需游标或 ES。",
      ["垂直分表：热冷字段拆分", "垂直分库：按业务拆分", "水平分片：sharding key 分布", "Hash/范围分片策略", "分片键选查询最高频字段", "跨片查询：ES 宽表/数据冗余"],
      ["分库分表", "ShardingSphere", "Snowflake", "一致性Hash", "跨片查询"],
      ["面试官追问：分片键怎么选？答：查询频率最高字段。", "分库分表后分页查询为什么慢？答：跨片合并。"])

    a("interview_system_design_006_microservices", "system_design", "backend", "system_design",
      "微服务架构设计", 3, 5,
      "请比较微服务和单体架构的优劣，以及微服务拆分原则。",
      "微服务优势：独立部署/技术异构/弹性扩展。劣势：分布式复杂性。拆分原则：DDD 限界上下文。",
      "1. 优势：独立部署故障隔离、技术异构、弹性扩展。\n2. 劣势：分布式事务、服务发现、链路追踪、运维复杂。\n3. 拆分原则：DDD 限界上下文、单一职责、数据自治。\n4. 通信：同步 REST/gRPC + 异步 MQ。\n5. 治理：限流/熔断/重试/超时（Sentinel）。",
      "微服务拆分粒度是关键：太粗退化为单体，太细变成分布式单体。Saga 模式分布式事务。Service Mesh 将通信逻辑下沉到 Sidecar。",
      ["独立部署故障隔离+技术异构", "分布式事务/发现/追踪/运维复杂", "DDD 限界上下文拆分", "同步 gRPC+异步 MQ", "限流熔断 Sentinel", "Saga 分布式事务"],
      ["微服务", "DDD", "限界上下文", "Saga", "Service Mesh", "Sidecar"],
      ["面试官追问：微服务拆分粒度怎么定？答：DDD 限界上下文。", "Saga 分布式事务怎么实现？"])

    a("interview_system_design_007_eventual_consistency", "baguwen", "backend", "system_design",
      "最终一致性实现方案", 3, 4,
      "请解释最终一致性的实现方案（Saga/TCC/本地消息表）。",
      "Saga 通过补偿事务回滚，TCC 通过 Try-Confirm-Cancel，本地消息表通过可靠消息保证。",
      "1. Saga：长事务拆分为多个本地事务+补偿操作。适合长流程。\n2. TCC：Try（预留）→Confirm（确认）或 Cancel（释放）。适合短事务。\n3. 本地消息表：业务+消息同事务写入，定时扫描发送。\n4. 事务消息（RocketMQ）：half message+本地事务→commit/rollback。\n5. 幂等消费是前提。",
      "Saga 适合跨服务长事务（订单→支付→库存→积分）。TCC 适合短事务需强隔离。RocketMQ 事务消息是本地消息表演进。幂等消费是最终一致性前提。",
      ["Saga：拆分+补偿事务回滚", "TCC：Try-Confirm-Cancel", "本地消息表：同事务写入定时扫描", "RocketMQ 事务消息 half message", "幂等消费是前提"],
      ["最终一致性", "Saga", "TCC", "本地消息表", "事务消息", "幂等"],
      ["面试官追问：Saga 和 TCC 怎么选？答：长流程 Saga 短事务 TCC。", "本地消息表的原理？"])

    a("interview_system_design_008_circuit_breaker", "baguwen", "backend", "system_design",
      "熔断降级策略", 2, 4,
      "请解释熔断器的工作原理和三个状态。",
      "三状态：Closed（正常）、Open（熔断快速失败）、Half-Open（半开试探）。防止级联故障。",
      "1. Closed：正常请求，统计失败率。\n2. Open：失败率达阈值，熔断打开快速失败。\n3. Half-Open：放少量请求试探，成功恢复 Closed，失败继续 Open。\n4. 降级：返回兜底数据（缓存/默认值）。\n5. 舱壁隔离：不同服务线程池隔离。",
      "熔断器核心价值是快速失败——下游不可用时不排队等待。Resilience4j 是 Hystrix 替代。舱壁隔离防止一个服务拖垮全局。",
      ["Closed 正常统计失败率", "Open 熔断快速失败", "Half-Open 半开试探", "降级返回兜底数据", "舱壁隔离线程池隔离"],
      ["熔断器", "Closed/Open/Half-Open", "降级", "舱壁隔离", "Resilience4j", "Sentinel"],
      ["面试官追问：舱壁隔离是什么？答：线程池隔离。", "Resilience4j 和 Hystrix 的区别？"])

    a("interview_system_design_009_read_write_split", "system_design", "backend", "system_design",
      "读写分离架构", 2, 4,
      "请解释数据库读写分离的原理和主从同步延迟问题。",
      "主库写+从库读，通过 binlog 同步。延迟问题用强制走主库或半同步复制解决。",
      "1. 架构：主库写+从库读，通过 binlog 同步。\n2. 延迟问题：写入后立即读可能读到旧数据。\n3. 解决一：强制走主库（同一会话内写后读走主库）。\n4. 解决二：半同步复制（至少一个从库确认收到 binlog）。\n5. 解决三：消息队列保证读写顺序。",
      "ShardingSphere/MyCat 实现读写分离。半同步复制（semi-sync）比异步复制延迟低但性能略降。写后读一致性：同一用户的写后读走主库，用 Session 粘滞。",
      ["主库写+从库读 binlog 同步", "延迟问题：写后立即读旧数据", "强制走主库（同会话写后读）", "半同步复制", "ShardingSphere/MyCat"],
      ["读写分离", "binlog", "主从同步", "半同步", "ShardingSphere"],
      ["面试官追问：写后读一致性怎么保证？答：同会话走主库。", "半同步和异步复制的区别？"])

    a("interview_system_design_010_distributed_id", "baguwen", "backend", "system_design",
      "分布式唯一 ID 生成", 2, 4,
      "请比较 Snowflake、UUID、Redis INCR、数据库号段四种分布式 ID 方案。",
      "Snowflake 是主流方案：时间戳+机器 ID+序列号，有序且高性能。UUID 无序不适合 DB 主键。",
      "1. Snowflake：64bit = 时间戳(41bit)+机器ID(10bit)+序列号(12bit)。有序、高性能、可反解。\n2. UUID：128bit 无序，不适合聚簇索引，索引碎片多。\n3. Redis INCR：简单但依赖 Redis 可用性。\n4. 数据库号段：批量取 ID 减少 DB 访问。\n5. Leaf（美团）：双 buffer 号段+Snowflake 兜底。",
      "Snowflake 的时钟回拨问题：机器时间被回调会导致 ID 重复。解决：等待时钟追上、或用序列号预留位。Snowflake 有序性利于 B+ 树聚簇索引插入效率。号段方案的精髓：每次从 DB 取一个范围（如 1000-2000），本地分配用完再取。",
      ["Snowflake：时间戳+机器ID+序列号有序高性能", "UUID 无序不适合聚簇索引", "Redis INCR 简单依赖可用性", "数据库号段批量取减少 DB 访问", "时钟回拨问题", "Leaf 双 buffer"],
      ["分布式ID", "Snowflake", "UUID", "号段", "Leaf", "时钟回拨"],
      ["面试官追问：Snowflake 时钟回拨怎么解决？答：等待或预留位。", "UUID 为什么不适合做主键？答：无序导致索引碎片。"])

    a("interview_system_design_011_redis_cluster", "system_design", "backend", "system_design",
      "Redis 集群架构", 3, 4,
      "请解释 Redis Cluster 的工作原理和数据分片机制。",
      "Redis Cluster 用 16384 个哈希槽分片，每个节点负责一部分槽。CRC16 计算 key 所属槽。自动故障转移。",
      "1. 数据分片：16384 个哈希槽，CRC16(key) % 16384 定位。\n2. 节点通信：Gossip 协议交换状态信息。\n3. 故障转移：Master 下线后 Slave 自动提升。\n4. 扩缩容：迁移哈希槽到新节点。\n5. 限制：跨槽操作需 hash tag（{}确保同槽）。\n6. Codis/Twemproxy：代理层分片（非官方方案）。",
      "Redis Cluster 是去中心化方案——无需代理，客户端直连数据节点。Gossip 协议传播集群状态。hash tag 让多个 key 落在同一槽：{user}:1 和 {user}:2 同槽可执行 MGET。Sentinel 是主从+自动故障转移但无分片。Redis Cluster = 分片 + 故障转移。",
      ["16384 哈希槽 CRC16 定位", "Gossip 协议节点通信", "故障转移 Slave 提升", "扩缩容迁移哈希槽", "hash tag{}确保同槽", "去中心化无代理"],
      ["Redis Cluster", "哈希槽", "Gossip", "故障转移", "hash tag", "Sentinel"],
      ["面试官追问：hash tag 怎么用？答：{}内相同则同槽。", "Redis Cluster 和 Sentinel 的区别？答：分片 vs 仅故障转移。"])

    a("interview_system_design_012_distributed_lock", "baguwen", "backend", "system_design",
      "分布式锁实现", 3, 4,
      "请比较 Redis 分布式锁和 ZooKeeper 分布式锁的优劣。",
      "Redis SETNX+EX 简单但有时钟漂移问题，ZooKeeper 强一致但复杂。RedLock 算法是 Redis 增强。",
      "1. Redis 锁：SET key value NX EX 30，原子加锁+过期。\n2. 问题一：锁过期但业务未完成→需要锁续约（看门狗）。\n3. 问题二：主从切换丢锁→RedLock 向多节点加锁。\n4. ZooKeeper 锁：创建临时顺序节点，最小序号获锁。Watch 前一个节点。\n5. ZK 优势：CP 模型强一致，客户端断开自动释放锁。",
      "Redis 锁的看门狗：后台线程定时续约 TTL 防止业务未完成锁过期。RedLock 算法：向 N 个独立 Redis 节点加锁，多数成功才算成功。ZooKeeper 的临时节点天然解决锁持有者宕机问题——Session 断开自动删除。etcd 也可做分布式锁（Lease 机制）。",
      ["Redis SETNX+EX 原子加锁+过期", "锁续约看门狗防业务未完成", "RedLock 多节点加锁", "ZooKeeper 临时顺序节点", "ZK CP 模型强一致", "etcd Lease"],
      ["分布式锁", "RedLock", "看门狗", "ZooKeeper", "临时节点", "etcd"],
      ["面试官追问：RedLock 算法的原理？答：多节点多数成功。", "ZooKeeper 锁为什么比 Redis 更可靠？答：CP+临时节点。"])

    a("interview_system_design_013_consistent_hash", "baguwen", "backend", "system_design",
      "一致性哈希原理", 3, 3,
      "请解释一致性哈希的原理和虚拟节点的作用。",
      "一致性哈希将节点和 key 映射到 0~2^32 环上，顺时针找到第一个节点。虚拟节点解决数据倾斜。",
      "1. 传统取模：hash(key) % N，节点增减 N 变化全量迁移。\n2. 一致性哈希：hash(key) 和 hash(node) 在环上，顺时针找最近节点。\n3. 节点增减只影响环上相邻段的数据。\n4. 虚拟节点：每个物理节点对应多个虚拟节点，解决数据倾斜。\n5. 应用：Redis Cluster 哈希槽、负载均衡、CDN 路由。",
      "传统取模 hash(key) % N 的问题：N 变化（增减节点）导致几乎所有 key 需要迁移。一致性哈希只迁移相邻段。虚拟节点解决节点少时数据不均匀：每个物理节点映射 150 个虚拟节点到环上。",
      ["传统取模 hash%N 节点增减全量迁移", "一致性哈希环顺时针找最近节点", "节点增减只影响相邻段", "虚拟节点解决数据倾斜", "每物理节点映射 150 虚拟节点"],
      ["一致性哈希", "虚拟节点", "哈希环", "数据倾斜", "Redis Cluster"],
      ["面试官追问：虚拟节点为什么解决倾斜？答：增加随机性均匀分布。", "一致性哈希在 Redis 中怎么用？"])

    a("interview_system_design_014_cache_patterns", "system_design", "backend", "system_design",
      "缓存设计模式", 3, 4,
      "请比较 Cache-Aside、Read-Through、Write-Through、Write-Behind 四种缓存模式。",
      "Cache-Aside 最常用（旁路缓存），Write-Behind 写性能最高但可能丢数据。",
      "1. Cache-Aside：读先查缓存未命中查 DB 回填。写先更 DB 再删缓存。最常用。\n2. Read-Through：缓存层自动从 DB 加载（应用不感知 DB）。\n3. Write-Through：写缓存+DB 同步，一致性高但写延迟高。\n4. Write-Behind（Write-Back）：写缓存后异步刷 DB，写性能高但可能丢数据。\n5. 删除缓存 vs 更新缓存：删除更优（避免并发写导致脏数据）。",
      "延迟双删：先删缓存→更新 DB→延迟再删缓存，解决并发读写导致脏数据。缓存一致性不可能完美——只能最终一致。Write-Behind 适合写多读少且容忍短时不一致的场景（如计数器）。Cache-Aside 的缓存雪崩/穿透/击穿分别用 TTL 随机、布隆过滤器、互斥锁解决。",
      ["Cache-Aside 旁路缓存最常用", "Read-Through 缓存层自动加载", "Write-Through 同步写一致性高", "Write-Behind 异步刷 DB 写性能高", "删除缓存优于更新缓存", "延迟双删"],
      ["Cache-Aside", "Write-Through", "Write-Behind", "延迟双删", "缓存雪崩/穿透/击穿"],
      ["面试官追问：删除缓存和更新缓存哪个更好？答：删除。", "延迟双删解决什么问题？答：并发读写脏数据。"])

    a("interview_system_design_015_idempotency", "system_design", "backend", "system_design",
      "幂等性设计", 3, 4,
      "请解释 API 幂等性的实现方案。",
      "请求 ID+Redis 去重、乐观锁版本号、Token 机制、唯一约束、状态机校验。",
      "1. 请求 ID + Redis SETNX 去重（防重复提交）。\n2. 乐观锁 version CAS（防并发覆盖）。\n3. Token 机制：获取→提交校验+删除。\n4. 数据库唯一约束（防重复插入）。\n5. 状态机校验（订单只在待支付可支付）。",
      "幂等不仅防网络重试也防竞态。支付场景必须幂等：网络超时重试不能扣两次款。at-least-once 语义需消费端幂等。",
      ["请求 ID + Redis SETNX 去重", "乐观锁 version CAS", "Token 用后即删", "唯一约束防重复", "状态机校验", "支付必须幂等"],
      ["幂等性", "请求ID", "SETNX", "乐观锁", "Token", "状态机"],
      ["面试官追问：支付接口如何保证幂等？答：请求ID+去重+状态。", "at-least-once 和幂等的关系？"])

    a("interview_system_design_016_rate_limit", "system_design", "backend", "system_design",
      "分布式限流方案", 3, 4,
      "请设计一个分布式限流系统，支持多维度限流。",
      "Redis + Lua 原子操作实现令牌桶，支持用户/IP/路由三维度，Sentinel/Nginx 集成。",
      "1. 算法选择：令牌桶（允许突发）。\n2. 存储选型：Redis + Lua 保证原子性。\n3. 限流维度：用户 ID+IP+路由路径。\n4. 分层限流：网关层（粗粒度）+ 应用层（细粒度）。\n5. 降级策略：限流后返回 429+Retry-After。",
      "Sentinel 支持流控规则+熔断降级+系统规则。Nginx limit_req 模块实现漏桶。Redis Lua 脚本三步（GET→判断→INCR+EXPIRE）原子执行。分布式限流的时钟同步问题：多节点时钟偏差导致限流不精确——可用逻辑时钟或 NTP 同步。",
      ["令牌桶允许突发", "Redis + Lua 原子操作", "用户+IP+路由三维度", "网关层粗粒度+应用层细粒度", "429+Retry-After 降级", "Sentinel/Nginx"],
      ["分布式限流", "令牌桶", "Redis Lua", "Sentinel", "Nginx limit_req", "Retry-After"],
      ["面试官追问：Redis Lua 为什么保证原子性？答：单线程执行。", "网关层和应用层限流的分工？"])

    a("interview_system_design_017_api_gateway", "system_design", "backend", "system_design",
      "API 网关设计", 3, 4,
      "请设计一个 API 网关，说明核心功能和技术选型。",
      "核心功能：路由转发、认证鉴权、限流熔断、协议转换、日志审计。选型：Kong/APISIX/Spring Cloud Gateway。",
      "1. 路由转发：按路径/Header 路由到后端服务。\n2. 认证鉴权：JWT/API Key/OAuth 统一校验。\n3. 限流熔断：保护后端服务。\n4. 协议转换：HTTP→gRPC、REST→GraphQL。\n5. 日志审计：全链路请求记录。\n6. 选型：Kong（Lua 插件生态）、APISIX（etcd 配置）、Spring Cloud Gateway（Java 生态）。",
      "API 网关是微服务统一入口，实现安全切面。BFF（Backend for Frontend）模式：为不同前端定制网关层。网关的单点故障：用多副本+VIP/VIP 保证高可用。动态路由：不重启配置中心下发路由规则。网关聚合多个微服务接口减少前端请求次数。",
      ["路由转发按路径/Header", "认证鉴权 JWT/API Key", "限流熔断保护后端", "协议转换 HTTP→gRPC", "日志审计全链路", "Kong/APISIX/Spring Cloud Gateway", "BFF 模式"],
      ["API网关", "Kong", "APISIX", "Spring Cloud Gateway", "BFF", "动态路由"],
      ["面试官追问：Kong 和 APISIX 怎么选？答：生态 vs 性能。", "BFF 模式是什么？答：为前端定制的网关层。"])

    a("interview_system_design_018_service_discovery", "system_design", "backend", "system_design",
      "服务注册与发现", 2, 4,
      "请比较 Nacos、Consul、Eureka、ZooKeeper 作为服务注册中心的优劣。",
      "Nacos 支持 AP/CP 切换，Consul 支持健康检查，Eureka 已废弃，ZooKeeper CP 强一致但复杂。",
      "1. Nacos：AP/CP 可切换，配置中心+服务发现一体。阿里开源。\n2. Consul：多数据中心、健康检查丰富。HashiCorp。\n3. Eureka：AP 模型，Netflix 开源，已进入维护模式。\n4. ZooKeeper：CP 模型强一致，但复杂且不适合服务发现。\n5. 客户端发现（Nacos）vs 服务端发现（网关）。",
      "AP 模型：服务列表可能短暂不一致但可用性高（Eureka/Nacos AP）。CP 模型：强一致但选举期间不可用（ZooKeeper）。服务发现更适合 AP——短暂看到旧服务列表比不可用好。健康检查：心跳超时标记下线。Nacos 的临时实例走 AP（Distro 协议），永久实例走 CP（Raft）。",
      ["Nacos AP/CP 可切换+配置中心", "Consul 多数据中心健康检查", "Eureka AP 已废弃", "ZooKeeper CP 不适合", "AP vs CP：服务发现更适合 AP", "客户端发现 vs 服务端发现"],
      ["服务发现", "Nacos", "Consul", "Eureka", "ZooKeeper", "AP/CP", "Distro"],
      ["面试官追问：服务发现选 AP 还是 CP？答：AP。", "Nacos 怎么切换 AP/CP？答：临时实例 vs 永久实例。"])

    a("interview_system_design_019_distributed_transaction", "system_design", "backend", "system_design",
      "分布式事务方案", 4, 4,
      "请比较 2PC、3PC、TCC、Saga、本地消息表五种分布式事务方案。",
      "2PC 强一致但阻塞，3PC 非阻塞但仍不一致，TCC 适合短事务，Saga 适合长流程，本地消息表最简单。",
      "1. 2PC：协调者准备→提交。强一致但阻塞、协调者单点、数据不一致风险。\n2. 3PC：CanCommit→PreCommit→DoCommit。非阻塞但仍有不一致。\n3. TCC：Try-Confirm-Cancel。强隔离但侵入业务。\n4. Saga：正序执行+反序补偿。适合长流程。\n5. 本地消息表：业务+消息同事务，定时扫描发送。最终一致。\n6. 事务消息（RocketMQ）：half message+本地事务。",
      "2PC 的协调者宕机导致参与者阻塞。Seata 的 AT 模式是 2PC 优化：本地事务自动提交+ undo log 回滚。TCC 的 Confirm/Cancel 必须幂等。Saga 的补偿操作需业务设计。分布式事务的核心取舍：一致性 vs 可用性 vs 性能。互联网场景通常选最终一致性。",
      ["2PC 强一致但阻塞协调者单点", "3PC 非阻塞仍可能不一致", "TCC Try-Confirm-Cancel 强隔离侵入业务", "Saga 正序执行+反序补偿长流程", "本地消息表最简单最终一致", "Seata AT/StarXman"],
      ["分布式事务", "2PC", "3PC", "TCC", "Saga", "本地消息表", "Seata"],
      ["面试官追问：2PC 的协调者宕机怎么办？答：阻塞。", "TCC 为什么必须幂等？答：Confirm/Cancel 可能重试。"])

    a("interview_system_design_020_grpc_rest", "baguwen", "backend", "system_design",
      "gRPC vs REST 通信选型", 2, 3,
      "请比较 gRPC 和 REST 的优劣和适用场景。",
      "gRPC 基于 HTTP/2+Protobuf 二进制，性能高、强类型。REST 基于 HTTP/1.1+JSON，通用、易调试。",
      "1. gRPC：HTTP/2 多路复用+Protobuf 二进制序列化。性能比 REST 高 5-10 倍。\n2. Protobuf 强类型+代码生成，跨语言。\n3. REST：HTTP/1.1+JSON 文本序列化。通用、浏览器原生支持、易调试。\n4. gRPC 适合：微服务内部通信、高频低延迟场景。\n5. REST 适合：对外 API、浏览器直接访问。\n6. gRPC-Web：浏览器支持 gRPC（通过代理转码）。",
      "gRPC 的流式传输（streaming）适合实时数据推送（比 WebSocket 更结构化）。Protobuf 的向后兼容：新增字段默认值兼容旧代码。gRPC 的健康检查和负载均衡：标准化的 health protocol。gRPC 的缺点：浏览器不原生支持，JSON 可读性差。GraphQL 是 REST 的演进：客户端声明所需字段减少过度获取。",
      ["gRPC HTTP/2+Protobuf 性能高 5-10 倍", "Protobuf 强类型代码生成跨语言", "REST HTTP/1.1+JSON 通用易调试", "gRPC 适合微服务内部高频通信", "REST 适合对外 API 浏览器访问", "gRPC-Web 浏览器支持", "GraphQL 客户端声明字段"],
      ["gRPC", "REST", "Protobuf", "HTTP/2", "GraphQL", "gRPC-Web"],
      ["面试官追问：gRPC 为什么比 REST 快？答：HTTP/2+二进制。", "gRPC-Web 怎么让浏览器支持？答：代理转码。"])

    a("interview_system_design_021_kafka_arch", "system_design", "backend", "system_design",
      "Kafka 架构与高吞吐原理", 3, 4,
      "请解释 Kafka 高吞吐的设计原理（零拷贝、顺序写、分区并行）。",
      "Kafka 高吞吐三大秘诀：顺序写磁盘（6 百 MB/s）、零拷贝（sendfile）、分区并行（水平扩展）。",
      "1. 顺序写磁盘：磁盘顺序写比随机写快 100 倍，接近内存速度。\n2. 零拷贝（sendfile）：数据直接从内核缓冲区到 socket，不经过用户空间。\n3. 分区并行：Topic 分多 Partition，Consumer Group 并行消费。\n4. 批量压缩：消息批量发送+压缩（减少网络 IO）。\n5. Page Cache：依赖操作系统页缓存而非应用缓存。",
      "Kafka 的 Partition 是并行单位：Producer 按 Key 路由到固定 Partition（保证同 Key 顺序）。Consumer Group 内每个 Consumer 消费不同 Partition。零拷贝技术：传统 4 次拷贝（磁盘→内核→用户→内核→socket）→ sendfile 2 次拷贝（磁盘→内核→socket）。ISR（In-Sync Replicas）保证副本一致性。",
      ["顺序写磁盘比随机写快 100 倍", "零拷贝 sendfile 内核→socket", "分区并行水平扩展", "批量发送+压缩减少网络 IO", "Page Cache 依赖 OS 页缓存", "ISR 副本一致性"],
      ["Kafka", "零拷贝", "顺序写", "sendfile", "Partition", "ISR", "Page Cache"],
      ["面试官追问：零拷贝 sendfile 原理？答：内核直传不经用户空间。", "Kafka 为什么不用应用层缓存？答：Page Cache 更高效。"])

    a("interview_system_design_022_redis_data_types", "baguwen", "backend", "system_design",
      "Redis 数据结构与场景", 2, 4,
      "请列举 Redis 核心数据结构及各自的应用场景。",
      "String（缓存/计数器）、Hash（对象存储）、List（消息队列）、Set（标签/去重）、ZSet（排行榜）、Stream（消息流）。",
      "1. String：缓存、计数器（INCR）、分布式锁（SETNX）。\n2. Hash：对象存储（user:1 → name/age/email）。\n3. List：消息队列（LPUSH/RPOP）、最新动态。\n4. Set：标签（user:tags）、去重、集合运算（交并差）。\n5. ZSet：排行榜（score 排序）、延时队列（score=时间戳）。\n6. Stream：5.0+ 消息流，支持消费者组。\n7. Bitmap：签到（SETBIT day 1）、布隆过滤器。\n8. Geo：地理位置（GEOADD 附近的人）。",
      "ZSet 延时队列：score 设为到期时间戳，定时 ZRANGEBYSCORE 取到期任务。Stream 是 Kafka 的 Redis 版替代品：消费者组+ACK+消息持久化。Bitmap 签到统计极省内存：1 亿用户 365 天仅需 4.6 MB。HyperLogLog 基数统计：12KB 估算 UV，误差 0.81%。Redis 7.0 新增 Function（替代 Lua 脚本）。",
      ["String 缓存/计数器/分布式锁", "Hash 对象存储", "List 消息队列/最新动态", "Set 标签/去重/集合运算", "ZSet 排行榜/延时队列", "Stream 消息流消费者组", "Bitmap 签到/布隆过滤器", "Geo 地理位置"],
      ["Redis", "String", "Hash", "List", "Set", "ZSet", "Stream", "Bitmap", "Geo", "HyperLogLog"],
      ["面试官追问：ZSet 怎么做延时队列？答：score=时间戳定时取。", "Bitmap 签到为什么省内存？1 亿用户 365 天 4.6MB。"])

    a("interview_system_design_023_mysql_index_optimization", "baguwen", "backend", "system_design",
      "MySQL 索引优化策略", 3, 4,
      "请列举 MySQL 索引优化的核心策略和常见误区。",
      "最左前缀匹配、覆盖索引避免回表、索引下推（ICP）、避免索引失效（函数/隐式转换/or）。",
      "1. 最左前缀：联合索引 (a,b,c) 可匹配 a、a,b、a,b,c 但不能匹配 b,c。\n2. 覆盖索引：查询字段都在索引中，不需要回表。\n3. 索引下推（ICP）：5.6+ 在存储引擎层过滤减少回表。\n4. 索引失效：WHERE 用函数/计算/类型转换/or/left join 右表。\n5. 深分页优化：LIMIT 1000000,10 → 延迟关联。\n6. 前缀索引：长字符串取前 N 个字符建索引。",
      "覆盖索引的极致用法：SELECT id FROM t WHERE name=? → 如果 name 有索引则走覆盖索引不回表。EXPLAIN 的 Extra 列显示 Using index = 覆盖索引，Using where = 需回表过滤。索引下推：联合索引 (name,age)，WHERE name LIKE '张%' AND age=20，5.6 前先回表再过滤 age，5.6+ 在引擎层过滤 age 减少回表。",
      ["最左前缀匹配联合索引", "覆盖索引避免回表 Using index", "索引下推 ICP 引擎层过滤", "避免函数/计算/类型转换索引失效", "深分页延迟关联优化", "前缀索引长字符串"],
      ["MySQL索引", "最左前缀", "覆盖索引", "回表", "ICP", "延迟关联", "EXPLAIN"],
      ["面试官追问：覆盖索引怎么判断？答：EXPLAIN Extra Using index。", "索引下推解决什么问题？答：减少回表。"])

    a("interview_system_design_024_elasticsearch_search", "system_design", "backend", "system_design",
      "Elasticsearch 搜索引擎", 3, 3,
      "请解释 Elasticsearch 的核心概念（倒排索引、分片、副本）和适用场景。",
      "ES 基于倒排索引，分片水平扩展，副本高可用。适合全文搜索、日志分析、聚合统计。",
      "1. 倒排索引：term→doc list，全文搜索 O(1) 查找。\n2. 分片（Shard）：数据水平切分到多节点。主分片不可变（建索引时确定）。\n3. 副本（Replica）：主分片备份，高可用+读负载均衡。\n4. 近实时：数据 1 秒后可搜索（refresh interval）。\n5. 场景：全文搜索、日志/ELK、指标聚合。\n6. 不适合：事务、强一致、频繁更新。",
      "ES 倒排索引的 FST（Finite State Transducer）压缩：内存中存储 term 的有限状态机，磁盘存 doc list 压缩。ES 的 segment 不可变——删除只是标记，merge 时物理删除。ES 不适合 OLTP 事务：无 ACID、无行锁。ES+MySQL：ES 搜索出 ID → MySQL 查详情（数据冗余+同步）。",
      ["倒排索引 term→doc list 全文搜索", "分片水平切分不可变", "副本高可用+读负载均衡", "近实时 1s refresh", "适合全文搜索/日志/聚合", "不适合事务/强一致/频繁更新"],
      ["Elasticsearch", "倒排索引", "分片", "副本", "FST", "segment", "ELK"],
      ["面试官追问：ES 为什么不适合做主存储？答：无 ACID 无行锁。", "ES+MySQL 怎么配合？答：ES 搜索 ID→MySQL 查详情。"])

    a("interview_system_design_025_log_aggregation", "system_design", "backend", "system_design",
      "分布式日志收集", 2, 3,
      "请设计一个分布式日志收集系统。",
      "Filebeat 采集→Kafka 缓冲→Logstash/Fluentd 处理→Elasticsearch 存储→Kibana 可视化。",
      "1. 采集层：Filebeat（轻量）或 Fluentd（丰富插件）。\n2. 缓冲层：Kafka 削峰防日志洪流。\n3. 处理层：Logstash/Fluentd 解析/过滤/富化。\n4. 存储层：ES 索引+热温冷分层。\n5. 可视化：Kibana 仪表板+告警。\n6. 结构化日志：JSON 格式便于解析。\n7. 采样：DEBUG 日志可采样降低量。",
      "ELK（Elasticsearch+Logstash+Kibana）是经典栈。EFK（Fluentd 替代 Logstash）更轻量。Loki（Grafana）是轻量替代：不索引全文只索引标签，成本更低。日志三维度：INFO/WARN/ERROR 级别、业务模块、traceId 链路。日志脱敏：中间件自动过滤敏感字段。",
      ["Filebeat 轻量采集", "Kafka 缓冲削峰", "Logstash/Fluentd 解析过滤", "ES 存储热温冷分层", "Kibana 可视化告警", "JSON 结构化日志", "Loki 轻量替代"],
      ["日志收集", "ELK", "EFK", "Filebeat", "Kafka", "Loki", "热温冷"],
      ["面试官追问：Loki 和 ES 日志的区别？答：只索引标签成本更低。", "日志 traceId 怎么串联？答：MDC+链路追踪。"])

    a("interview_system_design_026_link_tracing", "system_design", "backend", "system_design",
      "全链路追踪", 2, 3,
      "请设计一个分布式全链路追踪系统。",
      "基于 OpenTelemetry 标准，Trace=一次请求全局唯一，Span=一次操作。Agent 采集→收集器→存储→可视化。",
      "1. 概念：Trace（一次请求）包含多个 Span（一次操作）。\n2. TraceId 全局唯一，SpanId 父子关系形成调用树。\n3. 标准化：OpenTelemetry 统一 Trace+Metrics+Logs。\n4. 传播：HTTP Header（traceparent）/gRPC metadata 传递 traceId。\n5. 采样：头部采样（TraceId 决定）或尾部采样（响应后决定）。\n6. 存储：Jaeger/Tempo/Zipkin。\n7. 应用层注入：SDK 自动拦截 HTTP/RPC/DB 调用。",
      "OpenTelemetry 是 OpenTracing+OpenCensus 合并的标准。尾部采样比头部采样更灵活：可以只采样错误请求或慢请求。Baggage：跨服务传递业务上下文（如 userId）。Trace 与日志关联：traceId 写入 MDC，日志自动携带 traceId。服务网格 Sidecar 可无侵入实现追踪（代理拦截流量注入 Header）。",
      ["Trace=请求 Span=操作", "TraceId 全局唯一 SpanId 父子树", "OpenTelemetry 统一标准", "HTTP Header 传播 traceId", "头部采样 vs 尾部采样", "Jaeger/Tempo 存储", "Baggage 传递上下文"],
      ["全链路追踪", "OpenTelemetry", "Trace", "Span", "Jaeger", "Baggage", "MDC"],
      ["面试官追问：尾部采样为什么比头部好？答：可只采样错误/慢请求。", "Trace 和日志怎么关联？答：traceId 写入 MDC。"])

    a("interview_system_design_027_config_center", "system_design", "backend", "system_design",
      "配置中心设计", 2, 3,
      "请设计一个分布式配置中心，支持动态配置和灰度发布。",
      "配置存储（DB/etcd）+ 长连接推送（Watch）+ 客户端缓存 + 灰度发布（按 IP/标签）。",
      "1. 存储：DB 持久化配置 + 版本历史。\n2. 推送：长轮询/Watch/gRPC stream 实时推送配置变更。\n3. 客户端缓存：本地缓存配置 + 监听变更。\n4. 灰度发布：按 IP/应用/标签分组推送。\n5. 回滚：配置版本历史一键回滚。\n6. 权限：配置修改审批+审计日志。\n7. Nacos/Apollo/etcd 是常见选型。",
      "Apollo（携程）的配置推送：客户端定时拉取+长轮询，ConfigService 直连。Nacos 的配置：HTTP 长轮询，配合服务发现一体化。etcd Watch 基于 MVCC+Revision 的增量推送。配置中心的高可用：多副本+本地缓存兜底——配置中心宕机不影响已启动的服务（本地有缓存）。",
      ["DB 持久化+版本历史", "长轮询/Watch/gRPC stream 推送", "客户端本地缓存+监听", "灰度发布按 IP/标签分组", "版本回滚一键", "权限审批+审计", "Nacos/Apollo/etcd"],
      ["配置中心", "Nacos", "Apollo", "etcd", "长轮询", "灰度发布", "Watch"],
      ["面试官追问：配置中心宕机怎么办？答：本地缓存兜底。", "Apollo 和 Nacos 的区别？答：推送机制+功能范围。"])

    a("interview_system_design_028_seckill", "system_design", "backend", "system_design",
      "秒杀系统设计", 4, 4,
      "请设计一个秒杀系统，支撑百万级并发请求。",
      "前端限流+CDN 静态化+Nginx 限流+Redis 预扣库存+MQ 异步下单+DB 最终一致。",
      "1. 前端：按钮防抖+验证码+答题限流。\n2. CDN：静态页面+静态资源 CDN 分发。\n3. Nginx：limit_req 限流（漏桶）。\n4. API 网关：Token 校验+黑名单。\n5. Redis：预扣库存（DECR 原子操作），库存<=0 直接拒绝。\n6. MQ：异步下单写入 MQ，消费者按 DB 承受能力处理。\n7. DB：乐观锁扣减库存+唯一约束防超卖。\n8. 降级：DB 压力大时直接返回「排队中」。",
      "秒杀核心思想：层层削峰将百万 QPS 降到 DB 可承受的千级 TPS。Redis DECR 原子预扣：100 件商品扣到 0 后 99.99% 请求在前几层被拦截。MQ 异步保证 DB 不被打挂。超卖防护：Redis 预扣 + DB 乐观锁双重保障。热点数据隔离：秒杀订单表与普通订单表分离，避免影响普通交易。",
      ["前端防抖+验证码限流", "CDN 静态化减少服务端压力", "Nginx limit_req 限流", "Redis DECR 原子预扣库存", "MQ 异步下单削峰", "DB 乐观锁+唯一约束防超卖", "降级返回排队中", "秒杀订单表隔离"],
      ["秒杀系统", "削峰", "Redis DECR", "MQ 异步", "乐观锁", "防超卖", "CDN", "Nginx限流"],
      ["面试官追问：Redis DECR 预扣库存如果下单失败怎么办？答：回补库存+定时对账。", "秒杀表和普通交易表为什么隔离？答：避免影响普通交易。"])

    a("interview_system_design_029_feed_system", "system_design", "backend", "system_design",
      "Feed 流系统设计", 3, 3,
      "请设计一个微博/Twitter 式的 Feed 流系统。",
      "推模式（写扩散）适合粉丝少，拉模式（读扩散）适合粉丝多，推拉结合是主流方案。",
      "1. 推模式（Fan-out on write）：发布时写入所有粉丝的收件箱。读时直接拉取。适合粉丝少。\n2. 拉模式（Fan-out on read）：发布时只写发件箱。读时拉取关注人最新。适合大 V。\n3. 推拉结合：普通用户推，大 V 拉。读时合并。\n4. 存储：Redis ZSet（按时间排序）+ DB 持久化。\n5. 分页：游标分页（last_tweet_id）而非 OFFSET。",
      "推模式的写放大问题：一个用户 10 万粉丝→1 次发布写 10 万次。大 V 用拉模式避免。推拉结合：大 V 发文只写发件箱，粉丝读时主动拉取大 V 最新 + 本地收件箱普通用户推文。Feed 排序：按时间（微博）或按算法推荐（抖音/小红书）。Redis ZSet score=时间戳天然有序。Timeline 分页用游标而非 OFFSET 避免深分页。",
      ["推模式写扩散适合粉丝少", "拉模式读扩散适合大 V", "推拉结合：普通推大 V 拉", "Redis ZSet 按时间排序", "游标分页替代 OFFSET", "Feed 排序：时间 or 推荐算法"],
      ["Feed流", "推模式", "拉模式", "写扩散", "读扩散", "ZSet", "游标分页"],
      ["面试官追问：大 V 发文为什么不用推模式？答：写放大 10 万次。", "游标分页为什么比 OFFSET 好？答：避免深分页慢查询。"])

    a("interview_system_design_030_short_url", "system_design", "backend", "system_design",
      "短链系统设计", 2, 4,
      "请设计一个短链服务（如 bit.ly），支持生成、跳转、统计。",
      "发号器生成 ID→Base62 编码→短码映射存储→302 重定向→访问统计。",
      "1. 发号器：Snowflake/数据库自增生成唯一 ID。\n2. 编码：ID→Base62（a-zA-Z0-9）生成 6-7 位短码。\n3. 存储：短码→长 URL 映射存 Redis+DB。\n4. 跳转：301（永久缓存）或 302（可统计）重定向。\n5. 统计：异步记录点击量、来源、时间。\n6. 布隆过滤器：短码查重（避免冲突）。",
      "Base62 比 Base64 更适合 URL（不含 +/）。6 位 Base62 可表示 62^6 ≈ 568 亿个短链。301 vs 302：301 永久重定向浏览器缓存不经过服务端（无法统计），302 临时重定向每次经过服务端（可统计但增加延迟）。短链冲突：发号器唯一 ID 保证不冲突，哈希方案（MD6 取前 6 位）有冲突风险需查重。短链预生成：提前生成一批存队列，实时取用。",
      ["发号器 Snowflake 生成唯一 ID", "Base62 编码 6-7 位短码", "Redis+DB 存储短码→长 URL", "302 重定向可统计", "301 永久重定向浏览器缓存不可统计", "布隆过滤器查重", "短链预生成队列"],
      ["短链系统", "Base62", "Snowflake", "302重定向", "布隆过滤器", "短链预生成"],
      ["面试官追问：301 和 302 怎么选？答：统计选 302，性能选 301。", "Base62 为什么不用 Base64？答：不含+/适合 URL。"])

    a("interview_system_design_031_websocket_push", "system_design", "backend", "system_design",
      "实时推送系统设计", 3, 3,
      "请设计一个支持百万连接的实时推送系统。",
      "WebSocket 长连接+连接层集群+消息路由（用户→连接节点）+背压控制+心跳保活。",
      "1. 连接层：WebSocket 集群，每节点维护 10 万+长连接。\n2. 路由表：用户 ID→连接节点映射存 Redis。\n3. 消息推送：业务→查路由表→目标节点推送。\n4. 背压控制：客户端消费慢时服务端降速或丢弃。\n5. 心跳保活：定时 ping/pong 检测死连接。\n6. 重连策略：指数退避重连+断线消息补偿。",
      "百万连接的内存：每连接约 4KB→100 万连接约 4GB。Netty 的 Boss/Worker 线程模型：Boss 接收连接，Worker 处理 IO。连接路由表一致性：用户重连可能到不同节点，路由表需实时更新。消息可靠性：推送+ACK+重试+离线消息。WebSocket vs Server-SSE vs Long Polling：WebSocket 双向最优，SSE 单向简单，Long Polling 效率低。",
      ["WebSocket 集群每节点 10 万+连接", "路由表用户 ID→节点存 Redis", "消息推送查路由表→目标节点", "背压控制消费慢时降速", "心跳 ping/pong 保活", "指数退避重连+断线补偿", "Netty Boss/Worker"],
      ["实时推送", "WebSocket", "连接集群", "路由表", "背压", "心跳保活", "Netty"],
      ["面试官追问：百万连接内存怎么优化？答：Epoll+Netty 共享 EventLoop。", "用户重连后路由表怎么更新？答：实时刷新 Redis。"])

    a("interview_system_design_032_file_storage", "system_design", "backend", "system_design",
      "分布式文件存储", 3, 3,
      "请设计一个分布式文件存储系统（类似 OSS/S3）。",
      "文件分片存储+多副本冗余+FastDFS/MinIO+CDN 加速+断点续传。",
      "1. 上传：客户端→API 网关→分片上传→存储节点。\n2. 分片：大文件切片（如 5MB/片）并行上传。\n3. 存储：一致性哈希分布到多节点。\n4. 冗余：多副本（3 副本）或纠删码（EC 节省空间）。\n5. 断点续传：分片 MD5 校验+已传分片记录。\n6. CDN：文件访问走 CDN 边缘加速。\n7. MinIO：S3 兼容的开源对象存储。",
      "纠删码（Erasure Coding）比三副本节省 50% 空间：10+4 模式只需 14/10=1.4 倍空间 vs 三副本 3 倍。分片上传的 MD5 校验保证完整性。FastDFS 适合中小规模，MinIO 适合 S3 兼容。文件去重：SHA256 哈希去重，相同文件只存一份。冷热分层：热数据 SSD+冷数据 HDD，降低成本。",
      ["分片上传大文件切片并行", "一致性哈希分布到多节点", "多副本 3 副本或纠删码 EC", "断点续传分片 MD5 校验", "CDN 加速文件访问", "MinIO S3 兼容", "冷热分层 SSD+HDD"],
      ["分布式文件存储", "MinIO", "FastDFS", "分片上传", "纠删码", "断点续传", "冷热分层"],
      ["面试官追问：纠删码比多副本省多少空间？答：1.4 倍 vs 3 倍。", "文件去重怎么实现？答：SHA256 哈希。"])

    a("interview_system_design_033_search_suggest", "system_design", "backend", "system_design",
      "搜索联想词系统", 2, 3,
      "请设计一个搜索框联想词（autocomplete）系统。",
      "Trie 树前缀匹配+热点词排序+Redis ZSet 缓存+异步更新+拼音/模糊匹配。",
      "1. 数据结构：Trie 树前缀匹配，O(L) 查找。\n2. 热点词：ZSet score=搜索频次，取 Top N。\n3. 缓存：Redis 缓存热门前缀的结果，TTL 5 分钟。\n4. 拼音：汉字→拼音映射，支持拼音搜索。\n5. 模糊：编辑距离/Levenshtein 纠错。\n6. 异步：用户输入防抖 300ms 后请求。",
      "Trie 树适合前缀匹配但内存占用大，可用双数组 Trie 优化。ES 的 completion suggester 内置联想词功能。拼音分词：IK 分词器+拼音插件。热点词更新：离线 Spark 统计→Redis ZSet。搜索联想的 A/B 测试：不同用户组返回不同联想策略。",
      ["Trie 树前缀匹配 O(L)", "热点词 ZSet score=频次 Top N", "Redis 缓存热门前缀 TTL 5min", "拼音映射支持拼音搜索", "编辑距离模糊纠错", "防抖 300ms 后请求", "ES completion suggester"],
      ["搜索联想", "Trie树", "ZSet", "拼音", "编辑距离", "ES suggester", "防抖"],
      ["面试官追问：Trie 树内存大怎么优化？答：双数组 Trie。", "拼音搜索怎么实现？答：汉字→拼音映射+IK 分词。"])

    a("interview_system_design_034_delayed_task", "system_design", "backend", "system_design",
      "延时任务系统", 2, 3,
      "请设计一个延时任务系统（如订单 30 分钟自动取消）。",
      "Redis ZSet 延时队列+时间轮+RocketMQ 延时消息+DB 轮询兜底。",
      "1. Redis ZSet：score=到期时间戳，定时 ZRANGEBYSCORE 取到期任务。\n2. 时间轮：HashedWheelTimer，精度高但单机。\n3. RocketMQ：原生延时消息（固定 18 个延时级别）。\n4. DB 轮询：定时扫描到期记录，简单但效率低。\n5. 执行：取出任务→执行→ACK→失败重试。\n6. 兜底：多通道补偿防止任务丢失。",
      "Redis ZSet 的精度取决于扫描频率（每秒扫描一次精度 1s）。时间轮（Kafka/Netty 用）：刻度槽+指针转动，O(1) 插入和触发。RocketMQ 5.0 支持任意延时（之前只有固定级别）。分布式延时任务的幂等执行很重要——任务可能被重复触发。订单超时取消的兜底：Redis 延时 + 定时 DB 扫描双保险。",
      ["Redis ZSet score=时间戳定时取", "时间轮 HashedWheelTimer O(1)", "RocketMQ 延时消息", "DB 定时轮询兜底", "执行→ACK→失败重试", "幂等执行防重复", "多通道补偿"],
      ["延时任务", "Redis ZSet", "时间轮", "RocketMQ延时", "DB轮询", "幂等"],
      ["面试官追问：时间轮的原理？答：刻度槽+指针转动 O(1)。", "RocketMQ 5.0 延时消息 vs 之前固定级别？"])

    a("interview_system_design_035_data_consistency", "baguwen", "backend", "system_design",
      "缓存与数据库一致性", 3, 4,
      "请分析缓存与数据库一致性问题及解决方案。",
      "Cache-Aside 先更 DB 再删缓存。延迟双删解决并发脏读。最终一致是主流，强一致用 Write-Through。",
      "1. 问题：更新 DB 后缓存未更新→读到旧数据。\n2. 方案一：先更 DB 再删缓存（Cache-Aside）。删而非更新——避免并发写脏。\n3. 方案二：延迟双删——先删缓存→更 DB→延迟 500ms 再删缓存。\n4. 方案三：订阅 binlog（Canal）→删缓存。解耦业务代码。\n5. 最终一致是主流，强一致用 Write-Through 或分布式锁。",
      "先删缓存再更 DB 的问题：删缓存后另一线程读到 DB 旧值写入缓存→DB 更新后缓存仍是旧值。先更 DB 再删缓存的问题：更新 DB 后删缓存前另一线程读到缓存旧值。延迟双删缓解但不能完全消除。Canal 订阅 binlog 是最解耦方案——业务只管更新 DB，Canal 监听变更删缓存。TTL 是兜底：即使一致性出问题，TTL 过期后自动修正。",
      ["Cache-Aside 先更 DB 再删缓存", "删除缓存优于更新缓存", "延迟双删：先删→更DB→延迟再删", "Canal 订阅 binlog 删缓存解耦", "TTL 兜底自动修正", "强一致用 Write-Through"],
      ["缓存一致性", "Cache-Aside", "延迟双删", "Canal", "binlog", "TTL兜底", "Write-Through"],
      ["面试官追问：先删缓存还是先更 DB？答：先更 DB 再删。", "Canal 订阅 binlog 的优势？答：解耦业务。"])

    a("interview_system_design_036_hot_key", "system_design", "backend", "system_design",
      "热点 Key 问题", 3, 3,
      "请解释 Redis 热点 Key 问题和解决方案。",
      "热点 Key 是某个 Key 访问量远超其他，导致单节点 CPU 打满。解决：多副本分散+本地缓存+限流+分片。",
      "1. 检测：Redis hotkeys 命令+Monitor 采样+Proxy 统计。\n2. 方案一：多副本——热点 Key 写多份（key_1/key_2/...），读时随机选。\n3. 方案二：本地缓存——Caffeine 缓存热点 Key，减少 Redis 访问。\n4. 方案三：限流——热点 Key 限流保护 Redis。\n5. 方案四：分片——大 Value 拆分。",
      "热点 Key 典型场景：秒杀商品库存 Key、热门直播间点赞数。多副本方案：写时更新所有副本，读时随机选一个。本地缓存+Caffeine：TTL 设短（1s）防止数据过旧。Redis 4.0+ 的 LFU 模式可统计热点。CDN 层缓存热点数据也是有效手段——静态化热点页面。",
      ["检测：hotkeys 命令+Monitor 采样", "多副本 key_1/key_2 读时随机选", "本地缓存 Caffeine TTL 短", "限流保护 Redis", "大 Value 分片拆分", "CDN 静态化热点页面"],
      ["热点Key", "多副本", "Caffeine本地缓存", "限流", "hotkeys", "LFU"],
      ["面试官追问：多副本方案写时怎么保证一致？答：同步更新所有副本。", "本地缓存 TTL 设多长？答：1s 防过旧。"])

    a("interview_system_design_037_big_key", "system_design", "backend", "system_design",
      "大 Key 问题", 3, 3,
      "请解释 Redis 大 Key 问题和解决方案。",
      "大 Key 是 Value 过大（如 Hash 10 万元素），导致阻塞和内存不均。解决：拆分+异步删除+UNLINK。",
      "1. 检测：redis-cli --bigkeys 扫描+memory usage 命令。\n2. 标准：String > 10KB、Hash/List/Set/ZSet > 5 万元素。\n3. 危害：阻塞（DEL 大 Key 阻塞主线程）、内存不均（集群分片倾斜）。\n4. 方案一：拆分——大 Hash 按字段分组到多个小 Hash。\n5. 方案二：异步删除——UNLINK 替代 DEL（4.0+）。\n6. 方案三：压缩——大 Value 序列化压缩存储。\n7. 方案四：过期——设置 TTL 自动清理。",
      "DEL 大 Key 阻塞原因：Redis 单线程，DEL 10 万元素 Hash 需释放每个元素，阻塞数百毫秒。UNLINK 后台异步释放。大 Key 迁移（集群扩容）：KEYS/MIGRATE 可能超时。大 Hash 拆分：user:1 → user:1:basic（基本信息）+ user:1:posts（文章列表）+ user:1:followers（粉丝）。",
      ["检测：--bigkeys 扫描+memory usage", "标准：String>10KB 集合>5万元素", "危害：DEL 阻塞主线程+分片倾斜", "拆分大 Hash 为多个小 Hash", "UNLINK 异步删除替代 DEL", "压缩+TTL 过期", "拆分 user:1:basic/posts/followers"],
      ["大Key", "UNLINK", "拆分", "--bigkeys", "DEL阻塞", "分片倾斜"],
      ["面试官追问：DEL 大 Key 为什么阻塞？答：单线程逐个释放。", "UNLINK 和 DEL 的区别？答：异步释放。"])

    a("interview_system_design_038_circuit_breaker_pattern", "baguwen", "backend", "system_design",
      "服务降级策略", 2, 3,
      "请设计服务降级策略，在系统过载时保证核心功能可用。",
      "降级策略：读降级（返回缓存）、写降级（异步写）、功能降级（关闭非核心功能）、限流降级（排队/拒绝）。",
      "1. 读降级：DB 不可用时返回缓存数据或默认值。\n2. 写降级：MQ 不可用时先写本地队列异步重试。\n3. 功能降级：大促时关闭推荐/评论等非核心功能。\n4. 限流降级：超限返回 429 或排队提示。\n5. 触发条件：错误率超限、响应时间超限、资源使用率超限。\n6. 自动恢复：探测下游恢复后自动取消降级。\n7. 分级降级：L1 限流→L2 关非核心→L3 只保核心交易。",
      "降级与熔断的区别：熔断是下游不可用时快速失败，降级是系统过载时牺牲非核心保核心。预案演练：定期模拟故障验证降级效果。配置中心控制降级开关：一键关闭非核心功能。Sentinel 的降级规则支持慢调用比例、异常比例、异常数三种触发方式。Chaos Engineering（混沌工程）主动注入故障验证降级预案有效性。",
      ["读降级：返回缓存/默认值", "写降级：本地队列异步重试", "功能降级：关闭非核心功能", "限流降级：429/排队", "触发：错误率/响应时间/资源超限", "分级：L1限流→L2关非核心→L3保核心", "Chaos Engineering 混沌工程验证"],
      ["服务降级", "读降级", "写降级", "功能降级", "Sentinel", "混沌工程"],
      ["面试官追问：降级和熔断的区别？答：下游不可用 vs 系统过载。", "降级开关怎么管理？答：配置中心一键。"])

    a("interview_system_design_039_graceful_degradation", "system_design", "backend", "system_design",
      "优雅上下线", 2, 3,
      "请设计微服务优雅上下线方案，确保零中断发布。",
      "上线：预热+Health Check+流量渐进。下线：反注册+等消费完+SIGTERM+超时强杀。",
      "1. 下线流程：反注册（从注册中心摘除）→等待消费完存量请求→SIGTERM→超时 SIGKILL。\n2. 上线流程：服务启动→Health Check 通过→注册→渐进引流（小流量→全量）。\n3. 健康检查： readiness（就绪探针，不接流量）vs liveness（存活探针，重启容器）。\n4. 预热：JIT 预热+连接池预热+缓存预热。\n5. K8s：preStop hook（sleep 5s 等 Endpoints 更新）。",
      "K8s 下线时的 Endpoints 更新延迟：Pod 标记 Terminating 后 K8s 从 Endpoints 摘除，但 kube-proxy iptables 更新有延迟，preStop sleep 5s 等待摘除生效。Readiness Probe 不通过时不路由流量到该 Pod。Spring Boot 的 graceful shutdown：SIGTERM 后拒绝新请求，等待已有请求完成（server.shutdown=graceful）。蓝绿发布和金丝雀发布是零中断发布的策略。",
      ["下线：反注册→等消费→SIGTERM→超时强杀", "上线：Health Check→注册→渐进引流", "readiness 就绪不接流量 vs liveness 存活重启", "预热：JIT+连接池+缓存", "K8s preStop sleep 5s 等 Endpoints", "Spring Boot graceful shutdown", "蓝绿/金丝雀发布"],
      ["优雅上下线", "preStop", "readiness", "liveness", "graceful shutdown", "蓝绿发布", "金丝雀"],
      ["面试官追问：K8s preStop sleep 5s 解决什么？答：等 Endpoints 更新。", "readiness 和 liveness 的区别？"])

    a("interview_system_design_040_monitoring_alerting", "system_design", "backend", "system_design",
      "监控告警系统", 2, 4,
      "请设计一个微服务监控告警系统。",
      "四层监控：基础设施（CPU/内存/网络）+中间件（DB/Redis/MQ）+应用（QPS/延迟/错误率）+业务（订单/支付）。",
      "1. 采集：Prometheus（指标）+ ELK/Loki（日志）+ Jaeger（追踪）。\n2. 存储：Prometheus TSDB（短期）+ Thanos/VictoriaMetrics（长期）。\n3. 可视化：Grafana 仪表板。\n4. 告警：Alertmanager 规则→分组→路由→通知。\n5. 黄金信号：延迟（Latency）、流量（Traffic）、错误（Errors）、饱和度（Saturation）。\n6. SLO/SLI：可用性 99.9%→月停机 < 43 分钟。\n7. 错误预算：SLO 剩余预算耗尽时停止发布。",
      "Google SRE 的四大黄金信号是监控的标准框架。SLI（Service Level Indicator）是测量指标，SLO（Objective）是目标，SLA（Agreement）是合同。错误预算：99.9% SLO 月错误预算 43 分钟——用完前可以发布新功能，用完后只修 Bug 不发布。告警疲劳是最大问题——告警需可操作（Actionable），自动收敛合并。",
      ["Prometheus 指标+ELK 日志+Jaeger 追踪", "Grafana 仪表板", "Alertmanager 规则→分组→路由→通知", "黄金信号：延迟/流量/错误/饱和度", "SLO 99.9%→月停机<43min", "错误预算耗尽停止发布", "告警需 Actionable 防疲劳"],
      ["监控告警", "Prometheus", "Grafana", "Alertmanager", "黄金信号", "SLO", "错误预算", "SLI"],
      ["面试官追问：错误预算是什么？答：SLO 允许的不可用时间。", "告警疲劳怎么解决？答：自动收敛合并。"])

    a("interview_system_design_041_cdn_architecture", "system_design", "backend", "system_design",
      "CDN 架构原理", 2, 3,
      "请解释 CDN 的工作原理和边缘节点调度机制。",
      "CDN 通过 DNS 智能解析将用户路由到最近边缘节点，边缘节点缓存内容未命中时回源。",
      "1. DNS 调度：用户解析域名→CDN 智能 DNS 返回最近边缘节点 IP。\n2. 边缘节点：缓存静态资源，命中直接返回。\n3. 回源：未命中时回源站拉取并缓存。\n4. 缓存层级：边缘节点→中间节点→源站（多级）。\n5. 预热：发布前主动推送内容到边缘节点。\n6. 刷新：缓存更新时主动刷新（API/URL/目录）。\n7. 调度策略：基于 DNS/HTTP 302/Anycast。",
      "CDN DNS 调度的依据：用户 DNS 递归解析 IP 地理位置→返回最近边缘。HTTP 302 调度更精确：请求到任意边缘→302 重定向到最优节点。Anycast：同一 IP 广播到多节点，BGP 路由到最近。CDN 的缓存 key 设计：URL+查询参数+Header（Vary）。CDN 回源率是核心指标：<5% 为优。",
      ["DNS 智能解析返回最近边缘节点", "边缘节点缓存命中直接返回", "未命中回源拉取并缓存", "多级缓存：边缘→中间→源站", "预热发布前推送", "刷新：API/URL/目录", "回源率<5%为优"],
      ["CDN", "DNS调度", "边缘节点", "回源", "预热", "Anycast", "回源率"],
      ["面试官追问：CDN 调度的三种方式？答：DNS/HTTP 302/Anycast。", "CDN 回源率怎么降低？答：预热+长缓存。"])

    a("interview_system_design_042_api_versioning", "system_design", "backend", "system_design",
      "API 版本管理", 2, 3,
      "请设计 API 版本管理策略，支持平滑升级和废弃。",
      "URL 路径版本（/v1/）、Header 版本（Accept: application/vnd.xxx.v1+json）、查询参数（?v=1）。",
      "1. URL 路径：/v1/users → 简单直观，缓存友好，最常用。\n2. Header 版本：Accept: application/vnd.company.v1+json → URL 不变但不可见。\n3. 查询参数：?version=1 → 灵活但易忘。\n4. 废弃策略：Deprecation Header + Sunset Header 告知废弃时间。\n5. 向后兼容：新增字段可选、删除字段分版本、类型变更新字段。\n6. 灰度：新版本先灰度 1% 流量验证。",
      "Sunset Header（RFC 8594）：告知客户端该 API 将在指定日期移除。向后兼容原则：新版本只能加字段不能删/改字段类型。gRPC 的 Protobuf 天然向后兼容：新增字段用默认值，废弃字段用 reserved。GraphQL 的 schema 变更：@deprecated 标记废弃字段。API Gateway 可统一管理多版本路由。",
      ["URL 路径 /v1/ 简单直观最常用", "Header 版本 Accept 不改 URL", "查询参数 ?v=1 灵活但易忘", "Deprecation+Sunset Header 废弃通知", "向后兼容只加字段不删/改", "gRPC Protobuf reserved", "灰度 1% 流量验证"],
      ["API版本", "URL版本", "Header版本", "Sunset Header", "向后兼容", "Protobuf reserved", "@deprecated"],
      ["面试官追问：Sunset Header 的作用？答：告知废弃时间。", "Protobuf 怎么向后兼容？答：新增字段默认值+reserved。"])

    a("interview_system_design_043_data_migration", "system_design", "backend", "system_design",
      "数据迁移方案", 3, 3,
      "请设计一个零停机数据迁移方案。",
      "双写+全量同步+增量同步+校验+灰度切流+回滚。",
      "1. 全量同步：DBSnap/Dump→新库全量导入。\n2. 增量同步：binlog 订阅（Canal）→新库实时同步。\n3. 双写：应用同时写新旧库（新库写失败不阻断）。\n4. 校验：全量数据比对（CRC/Diff）。\n5. 灰度切流：读流量 1%→10%→50%→100% 切到新库。\n6. 回滚：发现问题切回旧库。\n7. 清理：稳定后停双写+关闭旧库。",
      "双写阶段要保证幂等：新库写失败时记录补偿队列，异步重试。数据校验的关键：增量同步延迟需小于双写间隔。影子库策略：新库只写不读，影子流量验证。分库分表迁移是最复杂的场景——需按 sharding key 分批迁移。MongoDB→MySQL 迁移需处理数据模型差异（嵌套文档→关联表）。",
      ["全量同步 Dump→新库导入", "增量同步 Canal binlog→新库", "双写应用同时写新旧库", "全量数据比对 CRC/Diff", "灰度切流 1%→10%→50%→100%", "回滚切回旧库", "影子库只写不读验证"],
      ["数据迁移", "双写", "Canal", "全量同步", "增量同步", "灰度切流", "影子库"],
      ["面试官追问：双写阶段写失败怎么办？答：补偿队列异步重试。", "数据校验怎么做？答：CRC/Diff 比对。"])

    a("interview_system_design_044_multi_tenant", "system_design", "backend", "system_design",
      "多租户架构设计", 3, 3,
      "请比较多租户 SaaS 的三种隔离模式。",
      "独立部署（最高隔离）、共享应用+独立 DB（中等隔离）、共享应用+共享 DB（最低成本）。",
      "1. 独立部署：每个租户独立应用+DB。最高隔离+最高成本。适合大客户。\n2. 共享应用+独立 DB：应用层按 tenant 路由 DB。中等隔离+中等成本。\n3. 共享应用+共享 DB：同一 DB tenant_id 字段隔离。最低成本但数据混在一起。\n4. 混合模式：大客户独立部署，小客户共享。\n5. 租户上下文：请求带 tenant_id → ThreadLocal/Context 传递。",
      "共享 DB 模式的最大风险：租户间数据泄露——必须在每条 SQL 加 WHERE tenant_id=?。ORM 层拦截自动注入 tenant_id 是最佳实践。大客户升级独立部署时的迁移：分批切换+数据迁移。按租户限流：每个租户 QPS 上限防影响其他租户。Tenant 上下文在异步场景（MQ/定时任务）需要传递。",
      ["独立部署最高隔离最高成本", "共享应用+独立 DB 中等隔离", "共享应用+共享 DB 最低成本", "混合模式大客户独立小客户共享", "ORM 自动注入 tenant_id", "按租户限流", "异步场景 tenant 上下文传递"],
      ["多租户", "SaaS", "tenant_id", "独立部署", "共享DB", "ORM拦截", "租户限流"],
      ["面试官追问：共享 DB 如何防数据泄露？答：ORM 自动注入 tenant_id。", "租户上下文异步怎么传递？答：MQ Header/定时任务参数。"])

    a("interview_system_design_045_event_driven", "system_design", "backend", "system_design",
      "事件驱动架构", 3, 3,
      "请比较事件驱动架构（EDA）和请求驱动架构的优劣。",
      "EDA 通过事件总线解耦生产者和消费者，异步松耦合。请求驱动同步耦合但简单直观。",
      "1. EDA 优势：松耦合（生产者不需知道消费者）、异步（不阻塞）、弹性（消费者独立扩展）。\n2. EDA 劣势：复杂（事件溯源+CQRS）、调试难（链路追踪必需）、最终一致。\n3. 事件类型：领域事件（DDD）、集成事件（跨服务）、通知事件。\n4. 事件存储：Event Store（如 Kafka/EventStoreDB）。\n5. 事件溯源（Event Sourcing）：存储事件而非状态，可回放重建状态。\n6. CQRS：读写分离——写模型存事件，读模型从事件投影。",
      "事件溯源的核心：状态 = 事件回放结果。如账户余额 = 所有存取款事件累加。优势：审计日志天然有、可回放重建、时间旅行调试。劣势：复杂、事件 schema 演进困难。CQRS+ES 是高级架构：写侧存事件，读侧投影为物化视图（如 Redis/Elasticsearch）。Kafka 是常用 Event Store：Append-only + 不可变 + 分区有序。",
      ["EDA 松耦合异步弹性", "劣势：复杂+调试难+最终一致", "领域事件/集成事件/通知事件", "Event Store 存储事件", "事件溯源：状态=事件回放", "CQRS 读写分离写事件读投影", "Kafka 作为 Event Store"],
      ["事件驱动", "EDA", "事件溯源", "CQRS", "Event Sourcing", "Kafka", "领域事件"],
      ["面试官追问：事件溯源的优势？答：审计+回放+时间旅行。", "CQRS 的读写怎么分离？答：写事件读投影。"])

    a("interview_system_design_046_chaos_engineering", "system_design", "backend", "system_design",
      "混沌工程", 3, 2,
      "请解释混沌工程的理念和实践方法。",
      "混沌工程主动注入故障验证系统韧性。核心：假设→实验→注入故障→观察→改进。",
      "1. 理念：主动注入故障验证系统韧性，而非等故障发生。\n2. 方法：假设（系统应能承受 Pod 宕机）→实验（随机杀 Pod）→观察→改进。\n3. 工具：Chaos Mesh（K8s 原生）、Chaos Monkey（Netflix）。\n4. 故障类型：网络延迟/丢包、CPU/内存压力、Pod 杀死、磁盘满、DNS 故障。\n5. 爆炸半径：先在测试环境小范围实验，逐步扩大到生产。\n6. Game Day：团队演练日模拟大规模故障。",
      "混沌工程不是破坏——是科学实验验证韧性假设。Netflix 的 Chaos Monkey 随机杀生产实例——如果系统因此崩溃说明韧性不足。爆炸半径控制：先非生产→单实例→多实例→可用区→地域。Chaos Mesh 在 K8s 中注入网络/IO/CPU/Pod 故障。Auto-remediation：故障自愈——检测到异常自动重启/扩容/切流。",
      ["主动注入故障验证韧性", "假设→实验→注入→观察→改进", "Chaos Mesh/Chaos Monkey", "故障：网络/CPU/Pod/磁盘/DNS", "爆炸半径逐步扩大", "Game Day 演练", "Auto-remediation 自愈"],
      ["混沌工程", "Chaos Mesh", "Chaos Monkey", "爆炸半径", "Game Day", "自愈"],
      ["面试官追问：混沌工程为什么要在生产做？答：测试环境无法覆盖真实流量。", "爆炸半径怎么控制？答：逐步扩大范围。"])

    a("interview_system_design_047_gitops", "system_design", "backend", "system_design",
      "GitOps 与声明式运维", 2, 3,
      "请解释 GitOps 的核心理念和实践。",
      "GitOps 以 Git 为唯一真实源，声明式描述基础设施状态，自动化工具（ArgoCD/Flux）同步。",
      "1. 核心理念：Git 仓库是基础设施的唯一真实源（Single Source of Truth）。\n2. 声明式：YAML 描述目标状态（K8s Manifest/Terraform）。\n3. 自动同步：ArgoCD/Flux 监听 Git 变更自动应用到集群。\n4. 版本控制：每次部署有 Git Commit 可追溯可回滚。\n5. PR 审核：基础设施变更通过 PR 审核后合并。\n6. 漂移检测：集群实际状态偏离 Git 声明时告警/自动修复。",
      "GitOps vs 传统 CI/CD：传统 push 模式（CI 推送到集群），GitOps pull 模式（集群内工具拉取 Git）。pull 模式更安全——集群不需要暴露凭据给 CI。ArgoCD 的漂移检测：实际状态和 Git 声明不一致时可以自动 sync 或告警。Kustomize/Helm 配合 GitOps 管理多环境配置。Terraform 也采用类似理念：Git 管理 IaC（Infrastructure as Code）。",
      ["Git 仓库是唯一真实源", "声明式 YAML 描述目标状态", "ArgoCD/Flux 自动同步", "版本控制可追溯可回滚", "PR 审核基础设施变更", "漂移检测实际偏离声明告警", "pull 模式比 push 更安全"],
      ["GitOps", "ArgoCD", "Flux", "声明式", "漂移检测", "IaC", "Terraform"],
      ["面试官追问：GitOps 和传统 CI/CD 的区别？答：pull vs push。", "漂移检测解决什么问题？答：手动修改集群导致不一致。"])

    a("interview_system_design_048_serverless", "system_design", "backend", "system_design",
      "Serverless 架构", 3, 3,
      "请解释 Serverless 的理念和适用场景。",
      "Serverless 无需管理服务器，按需付费自动伸缩。FaaS（Lambda）+BaaS（DynamoDB/S3）。",
      "1. FaaS（Function as a Service）：AWS Lambda/Cloudflare Workers。事件驱动、毫秒计费。\n2. BaaS（Backend as a Service）：DynamoDB/S3/Cognito。托管后端服务。\n3. 优势：无需管理服务器、自动伸缩到零、按请求付费。\n4. 劣势：冷启动延迟（50-500ms）、 Vendor Lock-in、长任务不适合。\n5. 场景：事件处理（图片上传触发处理）、定时任务、Webhook、SSR。\n6. 架构：API Gateway→Lambda→DynamoDB（全托管）。",
      "冷启动是 Serverless 的最大痛点：首次请求需加载运行时+代码+依赖。优化：预热请求、减小包体积、Provisioned Concurrency。Serverless 不适合：长连接（WebSocket）、大文件处理、高 QPS 固定流量（比包年贵）。Step Functions 编排多个 Lambda 工作流。Serverless Framework/SAM 是部署工具。",
      ["FaaS Lambda 事件驱动毫秒计费", "BaaS DynamoDB/S3 托管后端", "无需管理服务器自动伸缩到零", "按请求付费", "冷启动 50-500ms 延迟", "不适合长连接/大文件/固定高 QPS", "Step Functions 工作流编排"],
      ["Serverless", "FaaS", "BaaS", "Lambda", "冷启动", "DynamoDB", "Step Functions"],
      ["面试官追问：冷启动怎么优化？答：预热+减包体积+Provisioned Concurrency。", "Serverless 不适合什么场景？答：长连接+固定高 QPS。"])

    a("interview_system_design_049_ha_dr", "system_design", "backend", "system_design",
      "高可用与容灾架构", 3, 4,
      "请设计一个高可用容灾架构（同城双活/异地多活）。",
      "同城双活（RPO≈0）+异地灾备（RTO<1h）。核心：流量切换+数据同步+健康巡检。",
      "1. RPO（Recovery Point Objective）：可容忍的数据丢失量。RTO（Recovery Time Objective）：可容忍的恢复时间。\n2. 同城双活：同城两个机房同时对外服务，数据库主从同步（延迟<1ms）。\n3. 异地灾备：异地机房异步复制，RPO 几秒~几分钟。\n4. 流量切换：DNS/GSLB/负载均衡健康检查自动切换。\n5. 数据同步：DB binlog 异步复制+缓存跨机房同步。\n6. 脑裂：多机房网络分区导致双主，需仲裁节点（ZooKeeper）。",
      "同城双活的核心挑战：数据库跨机房延迟。金融级用 DWDM 专线延迟<1ms。Redis 跨机房同步：RedisShake。异地多活最复杂：数据需双向同步+冲突解决（CRDT/Last-Write-Wins）。单元化部署：用户按 ID 路由到就近机房，数据按单元隔离。故障切换的 DNS TTL 问题：TTL 太长切流慢，太短缓存不命中。",
      ["RPO 可容忍数据丢失量 RTO 可容忍恢复时间", "同城双活 DB 主从延迟<1ms", "异地灾备异步复制 RPO 秒级", "DNS/GSLB 流量自动切换", "DB binlog 异步复制+缓存跨机房同步", "脑裂需仲裁节点 ZooKeeper", "单元化部署按用户路由就近机房"],
      ["高可用", "容灾", "RPO", "RTO", "同城双活", "异地多活", "单元化", "GSLB"],
      ["面试官追问：同城双活数据库延迟怎么解决？答：DWDM 专线。", "异地多活数据冲突怎么解决？答：CRDT/LWW。"])

    a("interview_system_design_050_design_url_shortener", "system_design", "backend", "system_design",
      "设计一个短 URL 系统", 4, 4,
      "请完整设计一个短 URL 系统，包括生成、存储、跳转、统计、高可用。",
      "发号器→Base62 编码→Redis+DB 存储→302 跳转+统计→多级缓存+高可用集群。",
      "1. 生成：Snowflake 发号器→ID→Base62 编码→6 位短码。\n2. 存储：短码→长 URL 存 Redis（缓存）+ MySQL（持久化）。\n3. 跳转：短码→查 Redis→未命中查 DB→302 重定向→异步记录统计。\n4. 统计：点击量/来源/时间写入 Kafka→Spark 聚合→MySQL 报表。\n5. 高可用：多副本+Redis 集群+MySQL 主从+CDN。\n6. 布隆过滤器：短码查重防冲突。\n7. 预生成：提前生成一批短码存队列实时取用。\n8. 容量：6 位 Base62 = 568 亿短链，10 年足够。",
      "短链系统的核心 QPS 在跳转（读远大于写）。Redis 集群缓存短码映射，命中率>99% 时 DB 压力极低。302 vs 301：302 每次经过服务端可统计点击，301 浏览器缓存不统计。短码自定义：用户可自定义短码（如 bit.ly/my-product），需查重+保留词过滤。防滥用：频控+黑名单+短码内容审核。CDN 加速跳转：边缘节点直接 302 不回源。",
      ["Snowflake 发号器→Base62 编码 6 位短码", "Redis 缓存+MySQL 持久化", "302 跳转可统计点击", "Kafka→Spark 聚合统计", "Redis 集群+MySQL 主从+CDN", "布隆过滤器查重", "预生成队列取用", "6 位=568 亿容量"],
      ["短链系统", "Base62", "Snowflake", "302重定向", "布隆过滤器", "预生成", "CDN加速", "Kafka统计"],
      ["面试官追问：短链跳转 QPS 极高怎么优化？答：Redis 缓存+CDN 边缘跳转。", "自定义短码怎么防冲突？答：查重+保留词。"])

    return Q


# ============================================================
# 合并逻辑：替换 study_data.json 中的 4 个模板主题
# ============================================================

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    data_path = os.path.join(base_dir, 'data', 'study_data.json')

    print(f"Loading study_data.json from {data_path}...")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Generate all 4 topics
    print("Generating algorithms (50 questions)...")
    algo_q = gen_algorithms()
    print(f"  Generated {len(algo_q)} questions")

    print("Generating performance (50 questions)...")
    perf_q = gen_performance()
    print(f"  Generated {len(perf_q)} questions")

    print("Generating security (50 questions)...")
    sec_q = gen_security()
    print(f"  Generated {len(sec_q)} questions")

    print("Generating system_design (50 questions)...")
    sd_q = gen_system_design()
    print(f"  Generated {len(sd_q)} questions")

    # Replace template topics with real content
    data['topics']['algorithms'] = algo_q
    data['topics']['performance'] = perf_q
    data['topics']['security'] = sec_q
    data['topics']['system_design'] = sd_q

    # Count totals
    total = sum(len(v) for v in data['topics'].values())
    print(f"\nTotal questions: {total}")
    for topic in sorted(data['topics'].keys()):
        print(f"  {topic}: {len(data['topics'][topic])}")

    # Save
    print(f"\nSaving to {data_path}...")
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Done! study_data.json updated successfully.")


if __name__ == '__main__':
    main()
