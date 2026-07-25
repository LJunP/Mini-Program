// interview-cache.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_009",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cache",
    "title": "Redis 常见使用场景",
    "difficulty": 2,
    "frequency": 4,
    "question": "Redis 在项目中通常用于哪些场景？使用时需要注意什么？",
    "answer": {
      "short": "Redis 常用于缓存、会话、限流、排行榜、消息队列等场景，核心优势是高性能和丰富的数据结构。",
      "structured": [
        "缓存：热点数据、接口结果",
        "计数/限流：String 原子自增",
        "会话/状态：分布式 Session",
        "排行榜/地理位置：ZSET、GEO",
        "消息队列：List/Stream"
      ],
      "deepDive": "使用 Redis 要注意数据一致性、过期策略、持久化、主从高可用和内存淘汰。缓存更新常用 Cache-Aside 模式，避免缓存与数据库数据不一致。\n\n【底层机制/折中设计】：Redis 淘汰策略（如 volatile-lru）并不是严格的 LRU，因为在内存极度受限的 Redis 内核中空间开销太大。Redis 采用的是“随机抽样模拟 LRU”，每次随机抽取 5 个 key 并淘汰其中最久未被访问的那个。此外，AOF 重写机制（BGREWRITEAOF）通过 Copy-On-Write 写时复制技术，在 fork 子进程时避免阻塞主线程，用一份只读内存快照实现高并发写性能的折中。"
    },
    "keyPoints": [
      "缓存",
      "限流",
      "Session",
      "排行榜",
      "数据结构",
      "一致性"
    ],
    "traps": [
      "不要把 Redis 当数据库用，它适合高频读写且可接受丢失的数据",
      "警惕面试官追问“Redis 淘汰和过期删除，在大内存下如何避免主线程阻塞？”。防撕要点：1. 过期删除是惰性删除加定期随机抽样，大批量过期会导致瞬时 CPU 负荷上升。2. Redis 4.0+ 引入了 UNLINK 异步删除，能够将内存释放操作交给后台 bio_lazy_free 线程异步执行，杜绝大 key 阻塞。"
    ],
    "relatedIds": [
      "interview_008",
      "interview_018"
    ]
  },
  {
    "id": "interview_018",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "backend",
    "topic": "cache",
    "title": "缓存穿透、击穿、雪崩的区别",
    "difficulty": 2,
    "frequency": 4,
    "question": "请解释缓存穿透、缓存击穿、缓存雪崩，以及如何分别应对。",
    "answer": {
      "short": "穿透是查询不存在的数据；击穿是热点 key 突然失效；雪崩是大量 key 同时失效或缓存整体宕机。",
      "structured": [
        "穿透：布隆过滤器/缓存空值",
        "击穿：互斥锁/热点数据永不过期",
        "雪崩：随机过期时间/高可用/降级"
      ],
      "deepDive": "三种问题的本质都是缓存保护失效。要根据业务特点选择方案，比如空值缓存会带来额外存储，布隆过滤器有误判率；热点 key 可设置逻辑过期时间。\n\n【底层机制/折中设计】：Redis 淘汰策略（如 volatile-lru）并不是严格的 LRU，因为在内存极度受限的 Redis 内核中空间开销太大。Redis 采用的是“随机抽样模拟 LRU”，每次随机抽取 5 个 key 并淘汰其中最久未被访问的那个。此外，AOF 重写机制（BGREWRITEAOF）通过 Copy-On-Write 写时复制技术，在 fork 子进程时避免阻塞主线程，用一份只读内存快照实现高并发写性能的折中。"
    },
    "keyPoints": [
      "缓存穿透",
      "缓存击穿",
      "缓存雪崩",
      "布隆过滤器",
      "互斥锁",
      "随机过期"
    ],
    "traps": [
      "不要把三种问题混为一谈，要先定位是哪种场景",
      "警惕面试官追问“Redis 淘汰和过期删除，在大内存下如何避免主线程阻塞？”。防撕要点：1. 过期删除是惰性删除加定期随机抽样，大批量过期会导致瞬时 CPU 负荷上升。2. Redis 4.0+ 引入了 UNLINK 异步删除，能够将内存释放操作交给后台 bio_lazy_free 线程异步执行，杜绝大 key 阻塞。"
    ],
    "relatedIds": [
      "interview_009"
    ]
  },
  {
    "id": "interview_024",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "general",
    "topic": "cache",
    "title": "数据库与缓存双写一致性方案",
    "difficulty": 3,
    "frequency": 5,
    "question": "如何保证 Redis 缓存与 MySQL 数据库中的数据双双一致？先写数据库还是先删缓存？",
    "answer": {
      "short": "推荐采用 Cache Aside 模式：更新时先更新数据库，再删除缓存。配合延迟双删或订阅 binlog 异步重试保证最终一致。",
      "structured": [
        "Cache Aside 策略：读时无缓存载入，写时写数据库+删缓存",
        "先删缓存可能产生并发读旧数据写入缓存的问题",
        "先更新数据库删缓存可能在极小概率下因删除失败出现不一致",
        "延迟双删：写入数据库后，延迟数百毫秒再次删除缓存",
        "Binlog 异步化：订阅 canal 解析 binlog，MQ 异步消费重试删除"
      ],
      "deepDive": "任何强一致性方案都会严重牺牲写吞吐量。高并发场景下一般选择最终一致性。利用 Canal 监听 MySQL binlog 并将其推送至 Kafka，由专门的消费者来执行 Redis 的 DEL 操作，这种解耦方案在实战中最为稳定，对主业务无侵入。\n\n【底层机制/折中设计】：Redis 淘汰策略（如 volatile-lru）并不是严格的 LRU，因为在内存极度受限的 Redis 内核中空间开销太大。Redis 采用的是“随机抽样模拟 LRU”，每次随机抽取 5 个 key 并淘汰其中最久未被访问的那个。此外，AOF 重写机制（BGREWRITEAOF）通过 Copy-On-Write 写时复制技术，在 fork 子进程时避免阻塞主线程，用一份只读内存快照实现高并发写性能的折中。"
    },
    "keyPoints": [
      "Cache Aside",
      "延迟双删",
      "Canal",
      "最终一致性",
      "binlog",
      "并发冲突"
    ],
    "traps": [
      "千万不要在写数据库时更新缓存（Update Cache），这在多事务并发更新时会因交错覆盖导致严重的永久不一致",
      "警惕面试官追问“Redis 淘汰和过期删除，在大内存下如何避免主线程阻塞？”。防撕要点：1. 过期删除是惰性删除加定期随机抽样，大批量过期会导致瞬时 CPU 负荷上升。2. Redis 4.0+ 引入了 UNLINK 异步删除，能够将内存释放操作交给后台 bio_lazy_free 线程异步执行，杜绝大 key 阻塞。"
    ],
    "relatedIds": [
      "interview_009",
      "interview_018"
    ]
  },
  {
    "id": "interview_033",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "cache",
    "title": "多级缓存架构一致性与热点 Key 治理",
    "difficulty": 4,
    "frequency": 5,
    "question": "如何设计高并发系统的多级缓存架构（本地缓存 + Redis 缓存）？如何解决本地缓存与 Redis 的数据一致性，以及热点 Key 的探测与防御？",
    "answer": {
      "short": "本地缓存（Caffeine/Guava）抗下 90% 流量，Redis 兜底。一致性通过 MQ 广播删除或 Canal 订阅 Binlog 类似实现；热点 Key 通过动态探测（如 Sentinel）结合本地缓存自动广播预热解决。",
      "structured": [
        "架构层次：Client -> 网关本地缓存 -> 应用内存缓存 -> Redis 集群 -> DB",
        "一致性同步：修改数据库后，发送 RocketMQ 消息通知所有应用节点失效其本地 JVM 缓存",
        "热点探测：利用滑动窗口或流式计算检测请求量剧增的 Key",
        "热点防御：自动将高频热点 Key 写入应用进程本地缓存（秒级过期），避开 Redis 单点瓶颈",
        "限流熔断：Sentinel 配合热点参数限流，阻断异常穿透"
      ],
      "deepDive": "当突然发生明星八卦或秒杀事件，千万级流量冲击同一个 Redis Key，会导致 Redis 单网卡满载而瘫痪。引入本地缓存是唯一的网络分流手段。使用分布式限流系统防止数据库被击穿。\n\n【底层机制/折中设计】：Redis 淘汰策略（如 volatile-lru）并不是严格的 LRU，因为在内存极度受限的 Redis 内核中空间开销太大。Redis 采用的是“随机抽样模拟 LRU”，每次随机抽取 5 个 key 并淘汰其中最久未被访问的那个。此外，AOF 重写机制（BGREWRITEAOF）通过 Copy-On-Write 写时复制技术，在 fork 子进程时避免阻塞主线程，用一份只读内存快照实现高并发写性能的折中。"
    },
    "keyPoints": [
      "多级缓存",
      "本地缓存",
      "Canal 订阅",
      "热点 Key 探测",
      "Caffeine",
      "MQ 广播"
    ],
    "traps": [
      "本地缓存如果不设合理的过期时间或不加限制，会导致每个应用节点内存飙升甚至 OOM 崩溃",
      "警惕面试官追问“Redis 淘汰和过期删除，在大内存下如何避免主线程阻塞？”。防撕要点：1. 过期删除是惰性删除加定期随机抽样，大批量过期会导致瞬时 CPU 负荷上升。2. Redis 4.0+ 引入了 UNLINK 异步删除，能够将内存释放操作交给后台 bio_lazy_free 线程异步执行，杜绝大 key 阻塞。"
    ],
    "relatedIds": [
      "interview_009",
      "interview_018",
      "interview_024"
    ]
  },
  {
    "id": "interview_cache_005",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cache",
    "title": "Redis 线程模型与 6.0 多线程引入原因",
    "difficulty": 4,
    "frequency": 5,
    "question": "Redis 为什么早期设计为单线程？为什么单线程还能做到超高吞吐量？而在 Redis 6.0 中，为什么又引入了多线程？它解决了什么瓶颈？",
    "answer": {
      "short": "早期单线程是为了规避多线程锁竞争和上下文切换开销，其速度快因为基于纯内存操作和 Epoll 非阻塞 I/O 多路复用；6.0 引入多线程只是将网络 I/O 读写交由副线程处理，而核心执行命令仍保持单线程运行，这解决了大流量下的网络 I/O 瓶颈。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Redis 线程模型与 6.0 多线程引入原因】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 早期单线程：CPU 不是 Redis 瓶颈，瓶颈在网络和内存。单线程设计简单、零多线程资源抢占。基于 IO 多路复用（epoll）。\n2. 6.0 升级：随着万兆网卡普及，网络 IO 的 read/write 系统调用开销（用户态与内核态数据拷贝）占了 CPU 的一大半，限制了整体吞吐。引入 IO 线程（I/O Threading），专门做读包和回包写包，最耗时的指令执行依然由主线程单线程排队跑，安全性保持不变。",
      "deepDive": "在 6.0 中，工作线程（IO 线程）处于等待状态。当主线程的 epoll 接收到多个 Socket 连接请求后，会将这些 socket 读写任务分发给 IO 线程组。IO 线程组并行进行数据读取和解析，完成后，**主线程以单线程顺序执行解析出的命令**。执行完后，再交由 IO 线程并发将数据写回 Socket。这巧妙地在不加任何锁的情况下解决了网络瓶颈。\n\n【底层机制/折中设计】：Redis 淘汰策略（如 volatile-lru）并不是严格的 LRU，因为在内存极度受限的 Redis 内核中空间开销太大。Redis 采用的是“随机抽样模拟 LRU”，每次随机抽取 5 个 key 并淘汰其中最久未被访问的那个。此外，AOF 重写机制（BGREWRITEAOF）通过 Copy-On-Write 写时复制技术，在 fork 子进程时避免阻塞主线程，用一份只读内存快照实现高并发写性能的折中。",
      "structured": [
        "单线程极速基因：纯内存存储（主频 O(1) 寻址） + 非阻塞 I/O 多路复用（Reactor 机制） + 杜绝了多线程 CPU 上下文切换",
        "网络 I/O 瓶颈：高并发大流量下，Socket 读写所需的 `read` / `write` 系统调用带来的网络带宽吞吐阻碍了吞吐量",
        "6.0 混合模型：主线程（核心命令排队处理） + I/O 子线程组（并发读写 Socket 字节流），分工明确",
        "配置启用：默认不开启，需配置 `io-threads-do-reads yes` 并在 `io-threads` 指定 CPU 核心数的物理配比"
      ]
    },
    "keyPoints": [
      "Redis 线程模型",
      "I/O 多路复用 Reactor",
      "IO 线程 6.0",
      "网络 I/O 瓶颈",
      "单线程命令执行"
    ],
    "traps": [
      "不要误以为 Redis 6.0 之后命令执行变成并发的了，它的事务、命令串行特性依然是 100% 保持单线程的，所以不会发生多线程并发竞态问题",
      "警惕面试官追问“Redis 淘汰和过期删除，在大内存下如何避免主线程阻塞？”。防撕要点：1. 过期删除是惰性删除加定期随机抽样，大批量过期会导致瞬时 CPU 负荷上升。2. Redis 4.0+ 引入了 UNLINK 异步删除，能够将内存释放操作交给后台 bio_lazy_free 线程异步执行，杜绝大 key 阻塞。"
    ],
    "relatedIds": [
      "interview_009"
    ]
  }
];

module.exports = questions;
