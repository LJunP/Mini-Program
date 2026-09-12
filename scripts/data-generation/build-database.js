const fs = require('fs');
const path = require('path');

const questions = [
  {
    "id": "interview_008",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 索引原理",
    "difficulty": 2,
    "frequency": 5,
    "question": "请解释 MySQL 索引的工作原理，以及为什么索引能提高查询效率。",
    "answer": {
      "short": "索引是一种有序的数据结构（通常 B+ 树），通过减少磁盘 I/O 次数来加速查询。",
      "structured": [
        "B+ 树索引存储键值和行指针",
        "查询时按树查找，时间复杂度 O(log n)",
        "聚簇索引叶子节点存整行数据，非聚簇索引存主键",
        "最左前缀原则影响联合索引命中"
      ],
      "deepDive": "索引虽好但会占用额外存储、降低写性能，且需要维护统计信息。设计索引时要结合查询条件、排序和覆盖扫描，避免过多冗余索引。"
    },
    "keyPoints": [
      "B+ 树",
      "聚簇索引",
      "非聚簇索引",
      "最左前缀",
      "覆盖索引",
      "回表"
    ],
    "traps": [
      "索引不是越多越好，写操作需要维护索引结构"
    ],
    "relatedIds": [
      "interview_009"
    ]
  },
  {
    "id": "interview_010",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "backend",
    "topic": "database",
    "title": "秒杀场景数据库如何设计",
    "difficulty": 3,
    "frequency": 4,
    "question": "秒杀活动流量大、库存敏感，数据库层应该如何设计？",
    "answer": {
      "short": "核心思路是流量削峰、库存扣减原子化、读写分离和异步化，避免直接打到数据库。",
      "structured": [
        "库存扣减使用 UPDATE ... SET stock=stock-1 WHERE stock>0",
        "利用数据库行锁保证原子性",
        "缓存预热 + 限流削峰",
        "订单异步创建/消息队列"
      ],
      "deepDive": "秒杀不是纯数据库问题，而是全链路设计。前端要防刷，网关要限流，缓存要抗读，数据库只处理最终一致性。超卖可通过唯一索引/状态机二次兜底。"
    },
    "keyPoints": [
      "原子扣减",
      "行锁",
      "缓存预热",
      "限流",
      "消息队列",
      "幂等"
    ],
    "traps": [
      "不要一上来就分库分表，先确认瓶颈在数据库还是流量"
    ],
    "relatedIds": [
      "interview_003",
      "interview_014"
    ]
  },
  {
    "id": "interview_019",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 事务隔离级别与 MVCC 原理",
    "difficulty": 3,
    "frequency": 5,
    "question": "请详细说明 MySQL InnoDB 的事务隔离级别，以及 MVCC（多版本并发控制）的底层实现原理？",
    "answer": {
      "short": "隔离级别包括读未提交、读已提交、可重复读、串行化。MVCC 核心利用 Undo Log（版本链）和 Read View（一致性视图）在非锁定状态下实现并发读。",
      "structured": [
        "四种隔离级别及其解决并发问题（脏读、不可重复读、幻读）",
        "Undo Log 构成记录的多个历史版本版本链",
        "DB_TRX_ID (事务ID) 与 DB_ROLL_PTR (回滚指针) 隐式字段",
        "Read View 包含 m_ids, min_trx_id, max_trx_id, creator_trx_id 控制版本可见性",
        "RC 级别在每次执行 SELECT 时都生成新的 Read View；RR 级别仅在第一次执行 SELECT 时生成并复用"
      ],
      "deepDive": "MVCC 主要工作在 RC 和 RR 级别。通过判断当前事务读取时的 Read View，来决定应该沿版本链回溯到哪个历史记录。以此实现读写并发，避免了昂贵的行级锁排他性。"
    },
    "keyPoints": [
      "事务隔离级别",
      "MVCC",
      "Read View",
      "Undo Log",
      "版本链",
      "可重复读"
    ],
    "traps": [
      "幻读的彻底解决需要结合 MVCC 和 Next-Key Locks（间隙锁），纯 MVCC 在某些写写冲突或二次查询下依然可能产生幻读"
    ],
    "relatedIds": [
      "interview_008",
      "interview_020"
    ]
  },
  {
    "id": "interview_020",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 锁机制（行锁、间隙锁、意向锁）",
    "difficulty": 3,
    "frequency": 4,
    "question": "InnoDB 引擎中有哪些锁？间隙锁（Gap Lock）和 Next-Key Lock 是如何解决幻读的？",
    "answer": {
      "short": "InnoDB 支持行锁（共享锁 S、排他锁 X）、意向锁（IS、IX）、间隙锁（Gap Lock）和临键锁（Next-Key Lock）。Next-Key Lock 锁住行记录及其左侧间隙防插入。",
      "structured": [
        "共享锁与排他锁的兼容性",
        "意向锁的作用（表级，避免全表扫描判断冲突）",
        "间隙锁（锁区间，不包含记录本身）防止幻读插入",
        "Next-Key Lock 是行锁与间隙锁的组合，为默认锁定区间",
        "锁升级与死锁判定（等待图 wait-for graph 检测环）"
      ],
      "deepDive": "幻读是指在同一事务内，连续执行相同查询却看到新插入的行。InnoDB 默认的可重复读级别，在执行当前读时会使用 Next-Key Lock，锁定当前记录和前后的索引间隙，从而拒绝其他事务插入新数据。"
    },
    "keyPoints": [
      "共享锁/排他锁",
      "意向锁",
      "间隙锁",
      "Next-Key Lock",
      "当前读",
      "快照读"
    ],
    "traps": [
      "间隙锁只在可重复读（RR）及以上级别生效，在读已提交（RC）级别下会被关闭"
    ],
    "relatedIds": [
      "interview_008",
      "interview_019"
    ]
  },
  {
    "id": "interview_021",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "backend",
    "topic": "database",
    "title": "慢 SQL 诊断与执行计划调优",
    "difficulty": 3,
    "frequency": 5,
    "question": "线上接口响应变慢，经查是慢 SQL 导致。你将如何使用 EXPLAIN 进行诊断，并给出优化手段？",
    "answer": {
      "short": "首先开启 slow_query_log 捕获 SQL，接着用 EXPLAIN 分析执行计划，关注 type、key、rows 和 Extra，通过建索引、改写查询或优化结构来解决。",
      "structured": [
        "使用慢查询日志或 APM 定位问题 SQL",
        "EXPLAIN 分析：type（应避免 ALL/index，争取 ref/eq_ref/const）",
        "关注 key（实际命中索引）与 rows（扫描行数）",
        "观察 Extra：避免 Using filesort (需要优化排序) / Using temporary",
        "调优手段：覆盖索引、最左前缀、小表驱动大表、联合索引顺序优化"
      ],
      "deepDive": "遇到 Using filesort 时，表示无法利用索引顺序完成排序，通常可以通过在 (where_col, order_col) 上建联合索引来消除。若 rows 过大但实际返回极少，需排查是否发生了隐式类型转换或索引失效（如对索引字段使用函数、like \"%xxx\" 等）。"
    },
    "keyPoints": [
      "EXPLAIN",
      "慢查询日志",
      "索引失效",
      "Using filesort",
      "覆盖索引",
      "连接查询"
    ],
    "traps": [
      "不要只盯着 type，rows 扫描行数配合 filter 比例更能说明真实 I/O 损耗"
    ],
    "relatedIds": [
      "interview_008"
    ]
  },
  {
    "id": "interview_022",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "database",
    "title": "分库分表设计与分布式事务",
    "difficulty": 4,
    "frequency": 4,
    "question": "当单表数据量达到瓶颈（如数千万行）时，如何设计分库分表？如何解决由此带来的分布式事务和跨节点分页问题？",
    "answer": {
      "short": "垂直拆分解决宽表 IO 瓶颈，水平拆分按 Shard Key 路由数据。通过二阶段提交（2PC）、TCC 或本地消息表（最终一致性）解决分布式事务；跨节点分页采用分片键聚合或双写冗余。",
      "structured": [
        "垂直拆分：按业务将表/字段分库",
        "水平拆分：根据 Shard Key（如 userId % N）散列数据",
        "跨库查询：分片中间件（ShardingSphere）的路由与归并",
        "分页限制：在大偏移量下必须做折中（禁止超大分页，使用滚动 id 游标）",
        "分布式事务：强一致性（XA） vs 最终一致性（Saga/本地消息表）"
      ],
      "deepDive": "分库分表是一剂大招。尽量先优化索引、冷热数据分离、引入 NoSQL。必须分表时，Shard Key 的选择决定了 90% 的查询是否需要跨分片（广播查询）。跨节点分页（LIMIT 1000000, 10）会导致各个节点都返回大量数据在中间件中排序，必须通过游标（如 where id > max_id）代替偏移量。"
    },
    "keyPoints": [
      "水平分片",
      "Shard Key",
      "分布式事务",
      "Saga",
      "跨节点分页",
      "ShardingSphere"
    ],
    "traps": [
      "避免盲目追求分布式事务的强一致性，互联网高并发场景 95% 采用基于消息队列的最终一致性"
    ],
    "relatedIds": [
      "interview_010",
      "interview_014"
    ]
  },
  {
    "id": "interview_023",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 主从复制原理与高可用架构",
    "difficulty": 3,
    "frequency": 4,
    "question": "MySQL 主从复制的底层原理是什么？如何解决主从延迟问题，确保高可用？",
    "answer": {
      "short": "主库写 binlog，从库 I/O 线程拉取并写入 relay log，SQL 线程重放 relay log。解决延迟可通过多线程复制（MTS）、半同步复制或关键读强制走主库。",
      "structured": [
        "主从同步三部曲（binlog, relay log, 线程分工）",
        "复制类型：异步、全同步、半同步（Semi-Sync，保证至少一个从库收到）",
        "延迟成因：单线程重放、主库大事务、从库高负载",
        "解决延迟：并行复制、拆分大事务、读写分离中间件动态路由",
        "高可用方案：MHA、Orchestrator、双主多从双活"
      ],
      "deepDive": "在主从延迟较大的情况下，用户写完立刻读从库可能会发生“刚发布却看不到”的现象。对于此类敏感业务，应在中间件（如 MyCat）上配置规则，将写入后数秒内的读请求或特定高危读路由回主库。"
    },
    "keyPoints": [
      "binlog",
      "relay log",
      "主从延迟",
      "半同步复制",
      "并行复制",
      "读写分离"
    ],
    "traps": [
      "半同步复制只是保证从库接收到了 Binlog，并不保证从库已经重放（执行）完毕，因此仍然可能读到旧数据"
    ],
    "relatedIds": [
      "interview_008",
      "interview_022"
    ]
  },
  {
    "id": "interview_029",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 最左匹配原则与索引失效追问",
    "difficulty": 3,
    "frequency": 5,
    "question": "（追问）联合索引 (a, b, c) 在哪些情况下会发生索引失效？where a > 1 and b = 2 和 where a = 1 and c = 3 的匹配情况是怎样的？",
    "answer": {
      "short": "联合索引严格遵守最左匹配原则。a > 1 属于范围查询，会使后面的 b 索引失效；a = 1 and c = 3 会在 a 字段进行索引匹配，c 字段失效（但在 5.6 之后会触发 ICP 索引下推优化）。",
      "structured": [
        "最左匹配：必须以联合索引最左侧的字段（这里是 a）作为查询起点",
        "范围中断：一旦查询条件中出现范围比较（>、<、between、like），则索引后续列失效",
        "对 a > 1 and b = 2：由于 a 为范围，仅 a能利用索引，b 失效",
        "对 a = 1 and c = 3：由于缺失 b 字段，仅 a 能匹配索引，c 无法命中联合索引",
        "对 b = 2 and c = 3：因为没有最左字段 a，索引完全失效，走全表扫描"
      ],
      "deepDive": "MySQL 5.6 引入了索引下推（Index Condition Pushdown, ICP）。对于 where a = 1 and c = 3，虽然 c 无法用于索引检索定位，但在回表前，存储引擎会先过滤掉 c 不等于 3 的记录，减少了回表的次数，优化了 IO 损耗。"
    },
    "keyPoints": [
      "最左匹配原则",
      "联合索引",
      "范围失效",
      "索引下推 ICP",
      "回表"
    ],
    "traps": [
      "where b = 2 and a = 1 虽然书写顺序不同，但优化器会自动调整顺序匹配索引，不会失效；只有查询缺失最左前缀字段时才会真正失效"
    ],
    "relatedIds": [
      "interview_008",
      "interview_021"
    ]
  },
  {
    "id": "interview_034",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "backend",
    "topic": "database",
    "title": "MySQL 分区分表选型与大表深分页优化",
    "difficulty": 3,
    "frequency": 5,
    "question": "当 MySQL 单表数据量超过 5000 万行时，面对 limit 5000000, 10 的超大深分页查询，应当如何进行索引或架构层优化？",
    "answer": {
      "short": "深分页性能差源于高额的“回表”I/O 开销。优化手段包括游标查询（Id 锚点）、子查询延迟关联覆盖索引，或将非结构化搜索迁移至 Elasticsearch。",
      "structured": [
        "深分页瓶颈：扫描前 5000010 行并丢弃前 500 万行，涉及大量无效回表",
        "游标法：如果主键递增，使用 where id > last_max_id limit 10 转换为范围扫描",
        "延迟关联：利用 select id from table order by create_time limit 5000000, 10 先定位主键 ID",
        "结合主键 ID 关联原表获取完整行数据，利用覆盖索引避免对整行数据的读取",
        "最终升级：对于大批量复杂筛选分页，直接构建 Canal 实时同步数据至 Elasticsearch 进行查询"
      ],
      "deepDive": "延迟关联的精髓在于：在内层查询中只查询索引列（例如 ID），因为索引列通常可以全部放入缓冲池中，扫描速度极快。定位到具体的 10 个 ID 后再回表关联提取列，从而将回表次数从 500 万次降到 10 次，性能提升可达百倍以上。"
    },
    "keyPoints": [
      "深分页",
      "回表开销",
      "游标查询",
      "延迟关联",
      "覆盖索引",
      "Elasticsearch"
    ],
    "traps": [
      "分区表（Partition Table）并不能解决深分页问题，因为它只是将一个大物理文件拆成多个，底层的扫描损耗依然存在，必须结合索引或分表来优化"
    ],
    "relatedIds": [
      "interview_008",
      "interview_021",
      "interview_022"
    ]
  }
];

const segment1 = [
  {
    id: "interview_db_010",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "MySQL 事务 ACID 保证机制与日志",
    difficulty: 4,
    frequency: 5,
    question: "请问 MySQL InnoDB 引擎是如何保证事务的 ACID（原子性、一致性、隔离性、持久性）特性的？各自依托什么底层日志与缓存机制？",
    answer: {
      short: "A 原子性由 Undo Log（回滚日志）保证；C 一致性是目的，由其余三者和应用层逻辑共同保障；I 隔离性由锁机制和 MVCC（Read View）保证；D 持久性由 Redo Log（重做日志）和 Doublewrite Buffer（双写缓冲区）保证。",
      thinkingProcess: "1. 核心定位：ACID 各自实现底座。\n2. 原子性：Undo Log 记录反向操作，崩溃时反向重放回滚。\n3. 持久性：WAL (Write-Ahead Logging) 协议。写数据页太慢，先写 Redo Log 顺序 IO 锁定。Doublewrite Buffer 解决半页写入破损问题。",
      deepDive: "InnoDB 采用 Write-Ahead Logging (WAL) 机制，在修改内存页时，必须先将对应的重做日志记录写入磁盘的 Redo Log，然后事务即可提交。即使脏页还没来得及刷盘，发生断电故障时，启动时通过重跑 Redo Log 依然能将数据页恢复到最新状态，保证了持久性。而 Undo Log 则是多版本并发控制和原子性的物理基础。",
      structured: [
        "原子性（Atomicity）：利用 Undo Log 实现。Undo Log 记录相反修改动作，报错时逆向执行回滚还原",
        "持久性（Durability）：基于 Redo Log 与 WAL 协议。将随机磁盘 IO 修改转化为顺序 Redo Log 追加，断电重启时自动前滚修复",
        "隔离性（Isolation）：结合锁机制和 MVCC。快照读依靠 Undo 版本链与 Read View 隔离；当前读依靠 Record Lock / Next-Key Lock 锁隔离",
        "一致性（Consistency）：事务的最终追求。底层由原子性、隔离性、持久性三者共同提供完整约束保证"
      ]
    },
    keyPoints: ["ACID 保证", "Redo Log", "Undo Log", "WAL 协议", "Doublewrite Buffer", "故障恢复"],
    traps: ["Redo Log 是保证持久性的物理底座，而 Binlog 是 MySQL 服务层保证数据备份和主从复制的逻辑日志，二者性质完全不同"],
    relatedIds: ["interview_019", "interview_020"]
  },
  {
    id: "interview_db_011",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "Redo Log vs Undo Log vs Binlog 区别",
    difficulty: 3,
    frequency: 5,
    question: "请对比 MySQL 中的 Redo Log、Undo Log 和 Binlog，说明它们的工作层次、记录格式、写入时机和崩溃恢复作用。",
    answer: {
      short: "Redo Log 和 Undo Log 是 InnoDB 引擎层的物理日志，用于事务的持久性、回滚和 MVCC，Redo Log 循环写入；Binlog 是 MySQL 服务层的逻辑日志，记录 SQL 或行变更，追加写入，用于数据备份和主从复制。",
      thinkingProcess: "1. 三种日志的核心对比。\n2. Redo: 引擎层，物理日志（“在某个数据页的某个偏移量上做了什么修改”），大小固定循环写。\n3. Undo: 引擎层，逻辑日志，记录修改前的样子，用于回滚和MVCC。\n4. Binlog: 服务层，逻辑日志（“对 table 做了一次 update”），追加写，全量备份和主从桥梁。",
      deepDive: "在两阶段提交（2PC）中：Prepare 阶段，InnoDB 写入 Redo Log 并将事务状态置为 prepare，将修改写入内存。Commit 阶段，MySQL 服务层写入 Binlog，并将 binlog 刷盘。接着调用引擎接口将 Redo Log 状态修改为 commit。保证了两个日志数据的一致性。"
    },
    "keyPoints": ["Redo Log", "Undo Log", "Binlog", "二阶段提交", "物理日志", "逻辑日志"],
    "traps": ["两阶段提交可以避免主库通过 Redo Log 恢复了数据，但从库因为 Binlog 缺失而没有同步导致的主从数据不一致问题"],
    "relatedIds": ["interview_db_010"]
  },
  {
    id: "interview_db_012",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "Change Buffer 与自适应哈希索引原理",
    difficulty: 4,
    frequency: 3,
    question: "什么是 InnoDB 中的 Change Buffer 和自适应哈希索引（AHI）？它们是如何自动优化磁盘写与内存读性能的？",
    answer: {
      short: "Change Buffer 针对非唯一的辅助索引写优化，将写操作暂存在内存中以减少磁盘随机读写，待未来读取时再 Merge 刷盘；自适应哈希索引（AHI）由 InnoDB 监控索引查询频率，对高频热点索引页自动在内存建立哈希索引，实现 O(1) 级的快速读查询。",
      thinkingProcess: "1. Change Buffer: 针对非唯一二级索引。若是唯一索引，写之前必须读盘确认唯一性，Change Buffer 失效。若非唯一，直接把写缓存在 Change Buffer，下次读的时候顺便 merge，或者 Master 线程定时 merge，省了随机 IO 读盘。\n2. Adaptive Hash Index (AHI): B+ 树虽然快，但每次都要走 3-4 次寻址。对经常 SELECT 的热点叶子页，InnoDB 内部自动为其 key 建立 Hash index，直接命中叶子节点，把 B+ 树查询降维成哈希查询 O(1)。",
      deepDive: "自适应哈希索引（AHI）是一个完全由 InnoDB 自行决定并掌控的隐形优化。它监控同一个查询索引条件的模式，如果发现有某种 pattern 连续被读取了多次，就会启用。但在某些高并发写密集且锁冲突激烈的场景下，AHI 可能会因为内部 Hash 锁争抢导致 CPU 负载飙升，可以通过 `innodb_adaptive_hash_index=OFF` 选项将其关闭。",
      structured: [
        "Change Buffer（写缓冲）：针对辅助索引（非唯一）。当数据页不在 Buffer Pool 时，写操作先存入 Change Buffer，延迟刷盘",
        "Change Buffer 限制：唯一性索引无法使用，因为唯一性判断必须强制将磁盘上的数据页读入内存进行校验",
        "自适应哈希索引（AHI）：监控 B+ 树索引查询，对经常被读取的热点索引页，自动在 Buffer Pool 中建立 Hash 索引加速",
        "AHI 价值：将 B+ 树的 O(log N) 级查找直接降到 O(1) 级，彻底消除索引定位过程中的多次寻址"
      ]
    },
    keyPoints: ["Change Buffer", "自适应哈希索引", "AHI", "写缓冲", "唯一索引限制", "B+树优化"],
    traps: ["辅助索引如果频繁写入且紧接着频繁读取，Change Buffer 会因为频繁被迫执行 Merge 动作而失去合并写的优势，并产生额外管理开销"],
    relatedIds: ["interview_008"]
  },
  {
    id: "interview_db_013",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "B+ 树索引与 LSM 树（LSM-Tree）对比",
    difficulty: 4,
    frequency: 4,
    question: "请对比关系型数据库常用的 B+ 树索引与 NoSQL（如 Hbase/LevelDB）常用的 LSM 树（Log-Structured Merge-Tree）的物理结构与读写性能差异。",
    answer: {
      short: "B+ 树采用多路平衡树结构，叶子节点存整行或主键并通过双向链表相连，适合高频读、范围查询，写性能受制于随机 I/O；LSM 树通过内存 MemTable 顺序写入追加，达到阈值后顺序写入磁盘 SSTable 并定期进行 Compaction 合并，写性能极强，但读存在写放大与多层查询开销。",
      thinkingProcess: "1. 结构对比：原地更新 (In-place Update) vs 追加更新 (Append-only)。\n2. B+ 树：叶子有序，方便范围扫描。修改是原地修改，会导致随机磁盘写，写放大较小，读 O(log N)。\n3. LSM-Tree：在内存中写，直接顺序刷盘变成不变量的 SSTable。读取时要查 MemTable 加上多层 SSTable，写性能无懈可击，但需要后台进行大面积合并，消耗大量 IO 频带。",
      deepDive: "LSM 树为了解决读性能低下的问题，引入了布隆过滤器。每个 SSTable 都有对应的布隆过滤器，如果布隆过滤器判断某个 key 不在当前 SSTable 中，就可以直接跳过读取该文件，避免了大量的无效磁盘读 I/O 损耗。",
      structured: [
        "B+ 树（写弱读强）：原地更新架构。每次更新需要修改对应的物理页，带来较多磁盘随机写 IO，但能提供极为稳定的读寻址表现",
        "LSM 树（写强读弱）：追加写架构。写操作在内存 MemTable 顺序完成追加，随后落盘为只读 SSTable，极高写入吞吐",
        "LSM 读放大问题：读取同一个 key 时，需要由内向外查遍多层 SSTable 文件，存在写放大和读性能波动",
        "LSM 合并（Compaction）：后台默默启动多路归并排序合并 SSTable 并清空被覆盖的历史版本记录"
      ]
    },
    keyPoints: ["B+ 树", "LSM-Tree", "SSTable", "随机 I/O", "顺序写入", "布隆过滤器", "写放大"],
    traps: ["LSM 树由于存在后台 Compaction，当系统写入量极大导致合并速度跟不上写入速度时，会触发写入挂起，产生严重的请求延迟陡增"],
    relatedIds: ["interview_008"]
  },
  {
    id: "interview_db_014",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "InnoDB Buffer Pool 内存页淘汰与管理机制",
    difficulty: 4,
    frequency: 3,
    question: "MySQL InnoDB 中的 Buffer Pool 是如何管理内存页 of the LRU 链表的？",
    answer: {
      short: "Buffer Pool 通过 Free List、Flush List 和 LRU List 管理；为防全表扫描和预读失效污染缓存，将 LRU 划分为 Old 和 New 两部分，新读入页先放在 Old 区，经过设定时间限制（默认 1 秒）再次被访问后才晋升到 New 区。",
      thinkingProcess: "1. 内存管理：Free list 存空闲块地址，Flush list 存脏页块地址以备 Page Cleaner 线程异步刷盘。\n2. LRU 改进：将链表按 5:8 比例划分为 new（young）和 old（sublist）。新页载入只挂在 old 头。配置 `innodb_old_blocks_time`（默认1000ms），在一秒内重复访问不晋升。只有超出一秒且再次访问才推入 young 区头，针对全表扫描进行优化。",
      deepDive: "InnoDB 还有一个预读机制。当顺序访问同一个区的页面数超过一定阈值时，会异步将下一个区的页面提前读入 Buffer Pool。改进的 LRU 同样能够保证这些没有被真正访问的预读失效页老老实实冷冻在 old 区并被快速淘汰，不污染热数据。",
      structured: [
        "Free List：记录未分配的 Buffer 页控制地址，方便快速调度分配",
        "Flush List：记录在内存中被修改但尚未刷入磁盘的脏页，由专门的后台线程平滑刷盘",
        "分代 LRU（Young/Old）：划分为 Young (63%) 和 Old (37%) 区。新读入页落在 Old 头，超过 1s 再次访问才晋升 Young"
      ]
    },
    keyPoints: ["Buffer Pool", "LRU 链表", "预读失效", "全表扫描污染", "innodb_old_blocks_time", "分代LRU"],
    traps: ["如果在短时间内有大量连续的小批量全表扫描，分代 LRU 依然可能失效，必须从 SQL 优化层面彻底消灭全表大扫描"],
    relatedIds: ["interview_021"]
  },
  {
    id: "interview_db_015",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 死锁检测与自动防范机制",
    difficulty: 3,
    frequency: 4,
    question: "MySQL InnoDB 是如何进行死锁检测与处理的？我们在业务代码中该如何编写以防范死锁的产生？",
    answer: {
      short: "InnoDB 通过维护锁的信息链表并启动“等待图（wait-for graph）”算法自动检测回路，发现死锁后自动选择回滚代价最小的事务释放锁；防范死锁应在业务中保证以完全一致的顺序申请锁、使用较低隔离级别、避免大事务、及合理使用乐观锁。",
      thinkingProcess: "1. 检测原理：等待依赖图环路检测。\n2. 处理对策：一般把持有最少行级排他锁的那个事务强行回滚。\n3. 防范守则：顺序性原则（确保所有接口按相同 ID 顺序上锁）。",
      deepDive: "在高并发更新同一热点行场景下，开启死锁检测会导致 CPU 资源被死锁检测线程的图算法排查彻底占满。对此，可选择关闭死锁检测，并设置极短的锁超时等待时间（`innodb_lock_wait_timeout=2`）让其自动超时报错回退以保护服务器。",
      structured: [
        "等待图（wait-for graph）：有向图表示事务与锁等待依赖，后台线程高频扫描",
        "回滚裁决：选择 Undo Log 量最少、回滚成本最低的事务强行阻断回滚，释放锁资源",
        "防范规约一（顺序申请）：业务代码中对多个资源上锁时，必须保证所有接口按相同 ID 排序后再上锁",
        "防范规约二（降低行锁）：尽量缩小事务物理范围，快速提交，避开长事务挂锁；高并发下用乐观锁代替"
      ]
    },
    keyPoints: ["死锁检测", "等待图", "回滚选择", "顺序上锁", "innodb_lock_wait_timeout"],
    traps: ["死锁发生时，应用端会收到 1213 报错，代码中必须实现重试机制以应对此概率性异常"],
    relatedIds: ["interview_020"]
  },
  {
    id: "interview_db_016",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "乐观锁与悲观锁应用与自旋优化",
    difficulty: 2,
    frequency: 4,
    question: "请对比乐观锁与悲观锁的概念、底层实现、并发开销及各自的最优选型场景。",
    answer: {
      short: "悲观锁假定冲突高概率发生，通过数据库排他锁强锁行记录，适合写密集、一致性要求极高的场景；乐观锁假定冲突极少，通过在表加版本号（version）或时间戳，在更新时校验版本是否变更，适合读密集、冲突极少的场景。",
      thinkingProcess: "1. 核心对比：排他数据库行锁 vs CAS 无锁自旋。\n2. 悲观锁：阻塞读写，有上下文切换开销，防范脏数据。\n3. 乐观锁：无锁更新，利用版本过滤。失败时需要自旋重试。",
      deepDive: "乐观锁在“高并发写冲突剧烈”的场景下性能会极度恶化。因为大量事务更新失败，进入频繁自旋重试，会导致应用服务器的 CPU 被空转占满。所以秒杀扣减库存这种极度冲突点，反而要使用悲观锁（行锁原子扣减）或者 Redis 预扣减，而不是乐观锁自旋。",
      structured: [
        "悲观锁：调用数据库 `FOR UPDATE` 锁定行。独占锁机制，保障修改期间无人能碰，但并发吞吐低",
        "乐观锁：通过 `version` 控制。更新执行 `WHERE version = #{version}`，成功则提交，失败则选择报错或自旋重试",
        "读写比选型：读多写少、冲突概率微弱选用乐观锁，吞吐量翻倍；写多读少、冲突激烈选用悲观锁"
      ]
    },
    keyPoints: ["乐观锁", "悲观锁", "版本号控制", "FOR UPDATE", "并发冲突比", "CAS自旋"],
    traps: ["乐观锁更新时如果忘记在 WHERE 里判断版本号，会直接发生覆盖更新造成严重的脏数据"],
    relatedIds: ["interview_010", "interview_020"]
  },
  {
    id: "interview_db_017",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "MySQL 亿级大表 Online DDL 最佳实践",
    difficulty: 4,
    frequency: 4,
    question: "在线上亿级大表上直接执行 ALTER TABLE 会带来什么灾难？如何利用 pt-online-schema-change 或 gh-ost 工具安全地执行大表 DDL？",
    answer: {
      short: "直接大表 DDL 会导致长时间锁表（锁住元数据 MDL），引发大量写入阻塞，甚至把连接池打满崩溃；安全手段是使用 pt-osc（基于触发器双写）或 gh-ost（基于订阅 binlog 并行拷贝），创建影子表，逐步同步历史和增量数据，最后原子重命名置换。",
      thinkingProcess: "1. 灾难：锁表、连接暴涨。\n2. pt-online-schema-change 原理：触发器同步。\n3. gh-ost 改进：订阅 Binlog 模拟从节点，无触发器负担，允许挂起，安全系数高。",
      deepDive: "gh-ost 在拷贝历史数据时，支持动态监控主库的负载。如果发现主库的 CPU 占用、主从延迟超过了设定的安全阈值，gh-ost 会自动暂停拷贝历史数据，让出 I/O 资源给主业务，等待负载平稳后自动恢复。这使其成为目前大表 DDL 最佳实践。",
      structured: [
        "风险阐述：MySQL 执行大表 DDL 时锁住 Metadata Lock (MDL)，读写阻塞，耗尽线程连接池",
        "pt-osc 架构：使用 Triggers 实时捕获主表增量同步到影子表，批量拷备旧数据。缺点：对主表性能有损",
        "gh-ost 架构：免触发器设计。通过伪装 Slave 抓取 Binlog 解析增量更新，低开销、可随时暂停",
        "最终割接：历史数据同步完成后，使用原子 Rename 完成影子表对调无缝秒级切换"
      ]
    },
    keyPoints: ["Online DDL", "Metadata Lock", "pt-online-schema-change", "gh-ost", "影子表", "Binlog 订阅"],
    traps: ["在执行期间，大表的主从同步延迟会显著拉大，必须合理控制批量拷贝行数以防撑爆从库"],
    relatedIds: ["interview_023"]
  },
  {
    id: "interview_db_018",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "MongoDB 与 MySQL 选型深度对比",
    difficulty: 2,
    frequency: 4,
    question: "MongoDB 与 MySQL 的核心差异是什么？在微服务系统架构中，各自适用于哪些业务场景？",
    answer: {
      short: "MySQL 是关系型数据库，基于表格和严格模式，支持强一致性的多表外键与复杂事务，适合财务、订单等核心业务；MongoDB 是 Document 文档型 NoSQL 数据库，Schema-free 无预定义结构，读写极快、支持海量嵌套数据，适合日志、社交关系、非结构化配置及大并发写入。",
      thinkingProcess: "1. 区别：关系型表格 vs JSON-like 文档。\n2. 优势场景：多表强事务用 MySQL；字段灵活变化、高频吞吐大嵌套用 MongoDB。",
      deepDive: "对于经常需要变动字段结构且读写吞吐极高的场景，MySQL 的宽表设计或多表关联会面临高额的 Join 损耗和频繁的 DDL 锁表。而 MongoDB 采用一个 BSON 文档即可将整件装备及其嵌套的属性全部收纳，实现单次 I/O 读写，吞吐能力远超 MySQL。",
      structured: [
        "数据模型：MySQL 严格规定 Schema，多表关联；MongoDB 使用 Schema-free BSON 存储大嵌套结构",
        "事务一致：MySQL 完美支持 ACID 复杂分布式事务；MongoDB 主打单文档原子性修改",
        "横向扩容：MySQL 分库分表维护极其繁重；MongoDB 天生原生支持副本集和自动分片",
        "选型应用：财务记账、ERP 订单流强行选用 MySQL；日志分析、用户动态墙、物联网传感器数据首选 MongoDB"
      ]
    },
    keyPoints: ["MySQL", "MongoDB", "NoSQL 选型", "Schema-free", "BSON 文档", "分布式高并发"],
    traps: ["不要在 MongoDB 中大量使用 $lookup 进行跨文档联表查询，会导致内存缓冲池负载暴增，性能呈指数级崩溃"],
    relatedIds: ["interview_022"]
  },
  {
    id: "interview_db_019_mongo",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MongoDB WiredTiger 存储引擎原理",
    difficulty: 4,
    frequency: 3,
    question: "MongoDB 默认的 WiredTiger 存储引擎底层是如何管理内存并刷盘的？",
    answer: {
      short: "WiredTiger 基于 B-Tree 和 LSM 树双引擎架构（B-Tree 为主），利用内存缓存（Cache）和 Journal（预写日志）保障持久性；采用基于页（Page）的行级锁和无锁并发框架，缓存淘汰使用 Hazard Pointer 结合 Eviction 线程在 Cache 耗尽前进行后台平滑页逐出，不阻塞主线程读写。",
      thinkingProcess: "1. 物理结构：Checkpoint 周期写入快照（默认 60s 或 2GB 脏数据）。\n2. 并发管理：Hazard Pointer 跟踪页并发读写，实现无锁化，高并发下表现优秀。\n3. 数据压缩：WiredTiger 原生支持 Snappy / Zlib 压缩算法，落盘空间仅为 MySQL 的 1/3。",
      deepDive: "WiredTiger 对磁盘存储极其友好，默认开启了 Snappy 压缩算法。落盘的 BSON 数据页经过压缩，体积通常能缩减为 MySQL 物理表格的 1/3 到 1/4。这使得 MongoDB 在应对高吞吐的海量日志记录时，能大幅降低磁盘 I/O 带宽开销。",
      structured: [
        "内存结构：WiredTiger Cache 分配堆内存，通过 Checkpoint 将内存中已修改的数据页合并为物理不变快照",
        "持久机制（Journal）：类似 WAL，先将修改写磁盘 Journal 日志（默认 100ms 刷盘一次），断电后重放恢复",
        "锁管理优化：摒弃传统读写锁，使用 Hazard Pointer 技术在内存页进行原子 CAS 更新操作，高吞吐并发表现卓越",
        "缓存驱逐机制：Eviction 进程实时监控 Cache 脏页占比，动态启动并发驱逐线程在后台清理释放内存"
      ]
    },
    keyPoints: ["WiredTiger", "MongoDB 存储引擎", "Journal 日志", "Snappy 压缩", "Hazard Pointer", "内存驱逐"],
    traps: ["WiredTiger 默认会占满系统可用内存的 50% 减去 1GB，在单机多应用部署时，如果不限制其 cacheSizeGB，极易触发系统的 OOM Killer 被强行杀死进程"],
    relatedIds: ["interview_db_014"]
  },
  {
    id: "interview_db_020_mongo",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "MongoDB 副本集（Replica Set）高可用机制",
    difficulty: 3,
    frequency: 4,
    question: "请详细说明 MongoDB 副本集（Replica Set）的组成结构与选举机制。",
    answer: {
      short: "副本集由 Primary（主节点）、Secondary（从节点）和 Arbiter（仲裁节点，只投票不存数据）组成；Primary 挂掉时，Secondary 基于 Raft 类似共识算法在多数派节点同意下选举出新 Primary；复制是通过 Secondary 异步拉取 Primary 的 oplog 并重放记录实现。",
      thinkingProcess: "1. 角色组成：Primary（可读写） + Secondary（可读备份） + Arbiter（只投票，无数据）。\n2. 多数派规则（Majority）：选举必须得到半数以上节点的认可才能胜出，防范脑裂。\n3. oplog 机制：Primary 记录写操作至固定大小的 oplog 集合，Secondary 通过游标增量同步拉取。",
      deepDive: "MongoDB 副本集支持精细控制的 Write Concern（写确认配置）：w: 1 只要 Primary 写入成功即返回；w: majority 必须同步到多数派节点从库后才返回成功，这能完全确保发生主备切换时数据绝对不丢失，提供强一致性保护。",
      structured: [
        "节点配比：三节点或多节点副本集，Primary 独占写请求；Secondary 跟踪 Primary，Arbiter 仅参选不持数据",
        "多数派选举原则：在发生宕机时，存活节点必须大于副本集总节点数的一半才能选出新主，杜绝脑裂",
        "oplog 机制：Primary 记录所有写动作为物理 oplog 并存入 capped collection；Secondary 异步拖拽并重放",
        "读写分离：通过配置 `Read Preference` 控制请求将查询路由到最近的 Secondary 缓解主库读压力"
      ]
    },
    keyPoints: ["MongoDB 副本集", "多数派原则", "Raft 共识选举", "oplog 异步复制", "Write Concern", "脑裂防护"],
    traps: ["如果副本集部署在偶数个机房中，一旦发生机房断网，由于无法联系到严格的“多数派”存活节点，副本集将无法选出主节点，变成全只读状态"],
    relatedIds: ["interview_023"]
  }
];

const segment2 = [
  {
    id: "interview_db_021_mongo",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "MongoDB 分片集群（Sharding）架构设计",
    difficulty: 4,
    frequency: 4,
    question: "什么是 MongoDB 的分片集群（Sharding）架构？由哪些核心组件构成？数据是如何进行路由与分片的？",
    answer: {
      short: "分片集群由 Shard（存储分片数据）、Mongos（路由路由器）和 Config Servers（存储集群元数据）三部分组成；客户端请求全部发送至 Mongos，Mongos 读取 Config Server 中的分片映射表，根据 Shard Key 将请求精准分发至对应 Shard 节点执行。",
      thinkingProcess: "1. 架构：Mongos（路由代理，无状态） -> Config Server（配置元数据） -> Shard（实际分片副本集）。\n2. 均衡：后台 Balancer 自动迁移 Chunk（默认 64MB），实现数据物理负载均衡。",
      deepDive: "分片键的选择是分片集群设计的生命线。如果选择了一个递增的字段（如 `createTime`）作为 Range 分片键，会导致最新的写入流量永远只打到最后一个 Shard 节点上（产生热点单点写）。必须选用高散列度的 Key（例如 `hash(userId)`）或复合键，才能将写压力分摊至各个分片。"
    },
    "keyPoints": ["MongoDB 分片", "Mongos 路由", "Config Server", "Shard Key 选型", "Hash 分片", "数据倾斜"],
    "traps": ["分片键一旦确定并写入集合，在低版本 MongoDB 中是绝对不允许修改或注销的，选型失误将导致全库重构悲剧"],
    "relatedIds": ["interview_022"]
  },
  {
    id: "interview_db_022_rel",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "数据库范式设计（1NF、2NF、3NF）与反范式",
    difficulty: 2,
    frequency: 4,
    question: "请对比第一范式（1NF）、第二范式（2NF）、第三范式（3NF）的规则约束。为什么在高并发互联网业务中，我们经常要故意违反范式执行“反范式设计”？",
    answer: {
      short: "1NF 要求属性不可拆分（原子性）；2NF 在 1NF 基础上要求非主属性完全依赖于主键（消除部分依赖）；3NF 在 2NF 基础上要求非主属性直接依赖主键（消除传递依赖）；反范式是通过冗余字段以避免高频 Join 联表，极大提升读取速度性能。",
      thinkingProcess: "1. 范式核心：减少数据冗余、防止数据插入修改异常。\n2. 反范式：故意冗余（如在订单表存 userName），以牺牲更新性能（需要异步同步修正）和数据空间为代价，换取不需要 Join 联表的极高读取速度。",
      deepDive: "使用反范式的前提是：冗余字段的修改频度必须非常低。如果 userName 每秒被修改数十次，那么修复各处订单表数据一致性的同步开销会远远超出单表查询带来的红利，此时必须退回范式化设计或利用 Redis 做联合缓存。"
    },
    "keyPoints": ["数据库范式", "1NF/2NF/3NF", "消除部分依赖", "传递依赖", "反范式设计", "冗余与读性能"],
    "traps": ["反范式一定要配合可靠的补偿更新逻辑，如果冗余字段因代码 Bug 长期与源数据不符，会引发业务财务数据紊乱"],
    "relatedIds": []
  },
  {
    id: "interview_db_023_pg",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "PostgreSQL MVCC 与 MySQL MVCC 差异对比",
    difficulty: 4,
    frequency: 3,
    question: "请对比 PostgreSQL 独特的元组级 MVCC 实现与 MySQL 基于 Undo Log 的 MVCC 实现的物理结构区别。PostgreSQL 为什么必须使用 VACUUM 清理内存？",
    answer: {
      short: "MySQL 采用原地更新，老版本写入独立的 Undo Log 文件以节省空间；PostgreSQL 采用多版本元组直接追加插入，老版本仍留在原表中，这导致表文件会膨胀，因此必须定期通过 VACUUM 进程在后台扫描清理无用老版本数据页并回收物理磁盘空间。",
      thinkingProcess: "1. 机制：原地更新+Undo版本链（MySQL） vs 物理追加+死元组驻留原表（PG）。\n2. 弊端：PG 因为追加写，老版本数据依然占地方，时间长了会导致 Table Bloat（表文件膨胀），必须定期通过 autovacuum 扫描释放标记为空闲地址。",
      deepDive: "PostgreSQL 多版本写入的一大优势是回滚极快。因为回滚只需要在事务状态表中将当前事务状态标记为 aborted 即可，不需要像 MySQL 那样去真正重放 Undo 物理日志。但劣势是写放大严重，且频繁触发的 autovacuum 会对磁盘吞吐造成一定挤占。"
    },
    "keyPoints": ["PostgreSQL MVCC", "MySQL MVCC", "追加元组", "VACUUM 机制", "死元组清理", "写放大"],
    "traps": ["若在 PostgreSQL 中长期挂载着一个未提交的长事务，autovacuum 将因为无法判断老元组是否彻底无用而拒绝清理，导致表文件急速膨胀"],
    "relatedIds": ["interview_019"]
  },
  {
    id: "interview_db_024_pg",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "预写式日志（WAL - Write-Ahead Logging）协议",
    difficulty: 3,
    frequency: 4,
    question: "什么是预写式日志（WAL）协议？为什么无论是关系型数据库还是 NoSQL，在数据修改时都强制要求“日志必须先于数据页刷盘”？",
    answer: {
      short: "WAL 协议规定非易失性日志必须在数据页修改写入磁盘之前完成刷盘；这是因为日志是顺序写入磁盘，速度极快，而数据页刷盘是随机 I/O，速度慢；“日志先刷盘”保障了系统在遭遇断电等灾难时，能利用只增不减的磁盘日志进行重放恢复，彻底防范内存脏页丢失。",
      thinkingProcess: "1. WAL 核心：顺序写追加日志极快（微秒级），随机修改数据页极慢（毫秒级）。\n2. 容灾底线：不能发生数据页刷盘、但对应日志未刷盘的颠倒现象，否则断电后由于日志缺失，物理页修改非法无法回滚，数据库报废。"
    },
    "keyPoints": ["WAL 协议", "顺序写入", "随机 I/O", "脏页刷盘", "物理一致性", "故障前滚"],
    "traps": ["如果为了追求极致写性能而将刷盘策略配置为仅写入内存缓存不立即刷盘，相当于违背了严格的 WAL，断电时会丢失数据"],
    "relatedIds": ["interview_db_010"]
  },
  {
    id: "interview_db_025_cons",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "分布式共识算法（Raft / Paxos）在数据库复制中的应用",
    difficulty: 5,
    frequency: 3,
    question: "传统的 MySQL 主从异步复制与基于分布式共识协议的强一致数据库复制有什么本质区别？",
    answer: {
      short: "传统主从复制是单向异步传递日志，主库挂掉强切从库易丢数据或产生脑裂；基于 Raft/Paxos 的复制在写数据时必须经过集群多数派确认通过后才认为提交成功；主库挂载时自动选举出包含最新日志的节点为新主，杜绝了脑裂，保障了强一致性与 RPO=0。",
      thinkingProcess: "1. 区别：单向异步拉取（容易发生数据丢失或脑裂） vs 多数派共识写入（过半数写成功才算提交，数据防丢失）。\n2. 脑裂防护：Raft 规定候选人必须获得半数以上选票，两机房分区时，少于半数的子分区无法起主，彻底防御脑裂。"
    },
    "keyPoints": ["Raft 共识", "Paxos 算法", "多数派写机制", "脑裂预防", "RPO=0", "金融级容灾"],
    "traps": ["Raft 强一致复制会增加写入延迟，因为每次写请求都要经历一次跨节点的网络往返比对协商"],
    "relatedIds": ["interview_023"]
  },
  {
    id: "interview_db_026_cap",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "CAP 定理下分布式数据库的选型与妥协",
    difficulty: 4,
    frequency: 4,
    question: "请结合 CAP 定理，分析 Spanner (CP) 与 Cassandra (AP) 数据库在遇到网络分区（P）时的不同抉择与底层技术支撑。",
    answer: {
      short: "CAP 定理指分布式系统遇到网络分区时，只能在强一致性（C）与高可用性（A）中选择其一；Google Spanner 优先保证 CP，在网络故障时拒绝无法达成多数派的写操作，利用原子钟实现全球外部一致；Cassandra 保证 AP，在网络分区时各节点仍能本地写入，故障恢复后通过向量时钟和 Read Repair 异步修复不一致。",
      thinkingProcess: "1. CAP 原理。Spanner 选用 CP，写不成功就死等拒绝服务，依赖原子钟 TrueTime API 锁定全网时钟漂移。\n2. Cassandra 选用 AP，Dynamo 去中心化环，写成功 W 个节点即可，用 Hinted Handoff 恢复增量写，最终一致性。"
    },
    "keyPoints": ["CAP 定理", "Spanner", "Cassandra", "TrueTime 原子钟", "Tunable Consistency", "网络分区"],
    "traps": ["虽然 Spanner 宣称是 CP 数据库，但依靠 Google 奢华的内网专线和多备灾冗余，其可用性在物理上依然达到了惊人的 5 个 9"],
    "relatedIds": ["interview_db_025_cons"]
  },
  {
    id: "interview_db_027_col",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "列式存储（Column-Family）与 HBase 存储结构",
    difficulty: 4,
    frequency: 3,
    question: "请对比行式存储与列式存储（Column-Family）的底层差异。为什么列式存储在海量数据聚合统计时速度极快？其高压缩率是如何实现的？",
    answer: {
      short: "行式存储将整行数据连续存放在一个物理页块中，适合单行 CRUD，但大范围统计时需扫描大量无用字段造成高额 I/O；列式存储将同一列的数据聚集在一起连续存储，检索时只读取被查询字段，免去整行扫描；其高压缩率得益于同列数据类型完全相同，可采用游程编码（RLE）或字典编码等高效算法。",
      thinkingProcess: "1. 物理连续差异。行式：[R1C1, R1C2, R1C3]。列式：[R1C1, R2C1, R3C1]。\n2. 性能：查询单列聚合（如求和）时只读单列文件，减少 90% 的无效磁盘 I/O。同列数据类型相同，压缩比大（如 1:10）。"
    },
    "keyPoints": ["列式存储", "HBase", "ClickHouse", "数据压缩", "OLAP 聚合", "I/O 吞吐比"],
    "traps": ["列式存储非常不适合高频随机单行更新或单行插入，这会导致文件频繁碎裂重写，引发巨大的 CPU 重整开销"],
    "relatedIds": ["interview_db_013"]
  },
  {
    id: "interview_db_028_es",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "Elasticsearch 倒排索引与 Lucene 检索原理",
    difficulty: 3,
    frequency: 5,
    question: "为什么传统关系型数据库的 LIKE 模糊查询无法使用索引，而 Elasticsearch 全文检索却能做到毫秒级响应？请阐述倒排索引的底层结构与分词查找原理。",
    answer: {
      short: "传统 B+ 树索引只能按最左前缀或全字搜索，遇到 %keyword% 的两边模糊查询只能退化为全表扫描；Elasticsearch 利用 Lucene 引擎在写入文档时进行分词，将分词提取出的“单词（Term）”作为 Key，文档 ID 列表（Posting List）作为 Value 构建倒排索引，查询时通过哈希/FST 快速定位包含该词的文档，实现毫秒级秒回。",
      thinkingProcess: "1. 倒排索引：Term Dictionary（单词字典，利用 FST 前缀树压缩常驻内存） -> Posting List（倒排文档 ID 链表）。\n2. 复合查询：对 Posting List 进行 SkipList 跳表或 Roaring Bitmaps 快速位图交并集计算，秒回结果。"
    },
    "keyPoints": ["倒排索引", "Posting List", "FST 压缩", "分词器", "全文检索 ES", "BM25 评分"],
    "traps": ["Elasticsearch 内存开销巨大，因为其为了保证读极速，会将 Term Index 长期强制常驻在 JVM 堆内存中，必须做好内存容量监控与 JVM GC 优化"],
    "relatedIds": ["interview_034"]
  },
  {
    id: "interview_db_029_join",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 连接查询底层算法：BNL, INL 与 Hash Join",
    difficulty: 4,
    frequency: 4,
    question: "MySQL 在执行多表 JOIN 时，底层有哪些执行算法？请对比 Index Nested-Loop Join (INL), Block Nested-Loop Join (BNL) 与 MySQL 8.0 引入的 Hash Join 的工作原理及性能开销。",
    answer: {
      short: "INL 适用于被驱动表上有索引的场景，通过索引快速查询，复杂度正比于外表行数；BNL 适用于无索引场景，将驱动表数据分批载入 Join Buffer 在内存中进行扫描比对以降低磁盘读；Hash Join 针对无索引大表连接，在内存中为驱动表构建哈希表，扫一次被驱动表通过哈希比对出结果，执行效率极高。",
      thinkingProcess: "1. BNL 缺陷：无索引时双循环比对，磁盘 IO 及 CPU 极高。\n2. Hash Join（8.0 引入）：构建小表的内存哈希映射，大表扫一次查哈希，复杂度直接降至 O(N + M)，彻底根治无索引 Join 灾难。"
    },
    "keyPoints": ["JOIN 算法", "Index Nested-Loop", "Block Nested-Loop", "Hash Join 8.0", "小表驱动大表", "Join Buffer"],
    "traps": ["如果 Join Buffer 分配内存过小，驱动表会被切分成多次装载，导致被驱动表依然需要被磁盘全量扫描多次"],
    "relatedIds": ["interview_008", "interview_021"]
  },
  {
    id: "interview_db_030_pool",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "数据库连接池架构调优与 HikariCP 原理",
    difficulty: 3,
    frequency: 4,
    question: "在高并发后端系统中，为什么必须使用数据库连接池？为什么 HikariCP 连接池的性能能大幅度超越 Druid 等竞争对手？",
    answer: {
      short: "连接池避免了每次请求高频进行 TCP 三次握手及数据库身份鉴权的巨大开销，实现了连接的可重用复用；HikariCP 超越同类得益于：1. 字节码级极致精简优化；2. 使用 FastList 消除 ArrayList 遍历索引开销；3. 采用无锁 ThreadLocal 局部缓存（ConcurrentBag）提升多线程抢占效率。",
      thinkingProcess: "1. 痛点：频繁建连开销高。\n2. HikariCP 极速秘诀：ConcurrentBag 局部无锁化缓存，优先 ThreadLocal 分配；FastList 重写 ArrayList，去除安全范围检查，从尾端倒序删除，逼近 CPU 极限。\n3. 池大小神学：maxPoolSize = ((cpu_cores * 2) + effective_spindle_count) 物理极限公式。"
    },
    "keyPoints": ["数据库连接池", "HikariCP 优化", "ConcurrentBag 无锁", "FastList 重写", "ThreadLocal 局部缓存", "池大小公式"],
    "traps": ["不要将连接池的空闲超时时间设置得大于 MySQL 的 wait_timeout，否则连接被 MySQL 单向关闭后，连接池会下发失效死管道报 Communications link failure 异常"],
    "relatedIds": ["interview_012"]
  },
  {
    id: "interview_db_031_doublewrite",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 双写缓冲区（Doublewrite Buffer）机制",
    difficulty: 4,
    frequency: 4,
    question: "什么是 MySQL 中的双写缓冲区（Doublewrite Buffer）？为什么有了 Redo Log，仍然必须使用双写缓冲区？它防范了什么底层磁盘写入故障？",
    answer: {
      short: "双写缓冲区是 InnoDB 保证写入安全的重要机制，用于防范“部分页面写入（Partial Page Write）”导致的物理页损坏故障；因为 OS 磁盘物理扇区通常为 4KB，而 MySQL 数据页为 16KB，写入中途断电会导致数据页物理破损，而 Redo Log 记录的是增量物理偏移，无法在破损的页块上重放恢复；双写缓冲区通过先将页写入连续的双写区，刷盘失败时利用该页完整副本覆盖修复后再重跑 Redo Log。",
      thinkingProcess: "1. 故障根源：Partial Page Write。页大小 16KB。磁盘底层是 4KB 或 512 字节写入。如果写到 8KB 时断电，这个 16KB 页就废了（坏页）。\n2. Redo 局限：Redo log 是物理逻辑日志（“在页偏移 10 处写入值 A”）。它要求基准数据页必须是“完整的、没有损坏的”。如果是坏页，算不出 checksum，Redo 无法重放。\n3. 解决：双写缓存。要刷物理盘时，先把页浅拷贝到内存中的 Doublewrite Buffer，然后顺序写入系统表空间的双写磁盘区（IO非常高效）。之后再把页刷到真实的 `.ibd` 数据文件。如果刷真实文件时断电了，重启时，从双写磁盘区里找到该页的完整拷贝，强行覆盖坏页，使其恢复成一个好的旧页。然后再用 Redo Log 去前滚，数据安全得救！",
      structured: [
        "物理断档（Partial Page Write）：系统写 16KB 页中途断电导致页块物理破损，Checksum 校验失败成为坏页",
        "Redo 修复盲区：Redo Log 属于增量物理日志，必须依赖原物理页完整无损才能执行重放覆盖，对坏页无计可施",
        "双写落盘时序：Buffer Pool 脏页 -> 内存 Doublewrite Buffer -> 磁盘系统表空间双写区（顺序写） -> 真实数据文件（随机写）",
        "崩溃补天：重启检测到真实数据页损坏，直接去双写区拉出完整副本强行覆盖，物理页变好后，再重放 Redo Log 恢复"
      ]
    },
    keyPoints: ["双写缓冲区", "部分页面写入", "物理坏页", "Redo 限制", "崩溃前滚修复"],
    traps: ["在一些使用高级文件系统且原生支持原子写（Atomic Write，能完全保证 16KB 一次写成功）的服务器上（如 ZFS 或部分企业级 SSD），可以安全关闭双写缓冲区以提升 20% 的写入吞吐性能"],
    relatedIds: ["interview_db_010"]
  },
  {
    id: "interview_db_032_replica_lag",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "主从复制延迟监控与多维优化方案",
    difficulty: 3,
    frequency: 4,
    question: "在生产环境中，如何准确监控 MySQL 主从复制延迟？如果从库延迟（Seconds_Behind_Master）拉大，你将从哪些维度入手进行排查和优化？",
    answer: {
      short: "监控可通过 SHOW SLAVE STATUS 的 Seconds_Behind_Master 字段，或使用 Pt-heartbeat 精准测量；排查及优化维度包括：1. 开启从库多线程并行复制（MTS）；2. 拆分主库大事务，避免单事务长时间占用重放；3. 升级从库磁盘硬件，关闭从库双一限制（sync_binlog/flush_log）以释放 I/O 能力。",
      thinkingProcess: "1. 监控：`Seconds_Behind_Master` 是对比从库 SQL 线程重放的时间戳与拉取到的主库 binlog 时间戳的差值。但在网络卡顿时这个值不准。用 `pt-heartbeat` 在主库每秒写一个时间戳表，从库读时间差，最精准。\n2. 延迟源头：\n   - 主库并发写，从库单线程重放（老版本痛点）。\n   - 主库执行了大事务（如一次性 delete 100万行），这个事务在主库执行了 10 秒，在从库也必须单线程重放 10 秒，主从延迟必定拉大 10 秒。\n   - 从库磁盘 IO 能力弱。\n3. 优化：开启多线程复制（MTS，基于 Group Commit 组提交或者 Writeset 冲突检测并行重放）。主库大事务拆分。从库性能优化（如 `innodb_flush_log_at_trx_commit=2` 降低刷盘频率）。",
      structured: [
        "监控手段：结合 `show slave status` 指标审查，配合 Percona Toolkit 的 `pt-heartbeat` 定时注入物理时间戳校验延迟",
        "优化方向一（多线程 MTS）：配置 `replica_parallel_workers`，改用基于 WriteSet 的并行复制，打碎单线程重放瓶颈",
        "优化方向二（事务控制）：强制禁止业务写单次超万行的大事务，delete/update 必须 limit 分批执行，规避重放死锁",
        "优化方向三（I/O 卸载）：若从库纯用于读，配置 `innodb_flush_log_at_trx_commit=2` 提升从库重放性能"
      ]
    },
    keyPoints: ["主从延迟", "pt-heartbeat", "并行复制 MTS", "WriteSet", "大事务拆分", "I/O 性能释放"],
    traps: ["如果主从延迟严重，读写分离中间件会持续向从库读到脏数据，架构上对一致性敏感的读取必须强制加上强制路由走主库注解（如 `@Master`）"],
    relatedIds: ["interview_023"]
  },
  {
    id: "interview_db_033_lock_escalation",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "InnoDB 锁升级与行锁行数限制",
    difficulty: 3,
    frequency: 3,
    question: "（追问）SQL Server 等数据库在行锁过多时会自动执行“锁升级（Lock Escalation）”为表锁。MySQL InnoDB 是否也存在锁升级机制？如果有，触发条件是什么？如果没有，它是如何支撑数百万行锁的？",
    answer: {
      short: "MySQL InnoDB 不存在传统的“锁升级”机制；InnoDB 对行锁的存储并没有像其他数据库那样为每行数据分配一个锁对象，而是将锁信息保存在数据页（Page）的锁信息结构（Bitmap）中，每个数据页只占用极小的锁存储开销，因此即使锁定数百万行，也不会因为内存不足而被迫升级为表锁。",
      thinkingProcess: "1. 锁升级概念：行锁多，消耗内存多。SQL Server 等为了防内存爆满，会自动把 5000 个行锁融合成一个表锁。表锁会严重阻塞并发。\n2. InnoDB 奇妙设计：InnoDB 把锁的信息挂在页上。一个页 16KB，里面有上百条记录。如果对该页上的 50 条记录加锁，InnoDB 只需要在这个页的锁信息结构里分配一个 `lock_rec_t` 结构，里面用一个位图（Bitmap）的 bit 位来代表具体哪一行被锁了。内存开销恒定极小。所以 InnoDB 不管锁多少行，内存几乎无感觉，绝对不会锁升级。",
      deepDive: "InnoDB 唯一的类似于“锁升级”的表级表现是：**当一个更新语句没有走任何索引时，MySQL 必须进行全表扫描。此时会在每一行上都加上行级排他锁（X锁）**。虽然这从表现上看类似于封死了整张表（等同于表锁），但底层的物理机制依然是大量的行级锁叠加，而且当优化器过滤完不匹配行后，会释放掉不满足 where 条件的行锁，而不是像表锁那样一直占满。",
      structured: [
        "锁升级定义：为防行锁过多导致内存耗尽，系统自动将大量细粒度锁（行锁）转化为粗粒度锁（表锁）的过程",
        "InnoDB 锁物理设计：不针对“行”分配锁节点，而是针对“数据页”分配锁结构，用 Bitmap 标记页内各行上锁状态",
        "无损内存：锁定一页内的 1 行与锁定一页内的 100 行，内存消耗基本一致，消除了锁升级的诱因",
        "无索引扫描误区：无索引更新导致的“全表锁定”，本质是扫描过程中全行加行锁，未满足条件的行锁会被提前释放"
      ]
    },
    keyPoints: ["锁升级", "InnoDB 位图锁", "锁内存消耗", "数据页加锁", "无索引全表锁"],
    traps: ["在读已提交（RC）级别下，无索引更新扫完行后，不匹配的行锁会立即释放；但在可重复读（RR）级别下，行锁和间隙锁会一直保留到事务提交，会引发严重的并发冲突"],
    relatedIds: ["interview_020"]
  },
  {
    id: "interview_db_034_mdl",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 元数据锁（MDL）阻塞与规避",
    difficulty: 3,
    frequency: 4,
    question: "什么是 MySQL 中的元数据锁（MDL - Metadata Lock）？为什么在一张小表上执行加列操作也可能导致整个系统瞬间瘫痪（雪崩）？如何安全规避？",
    answer: {
      short: "MDL 是保证表结构读写安全的表级锁，查询时加 MDL 读锁，DDL 时申请 MDL 写锁；当大查询或未提交事务持有 MDL 读锁时，Alter Table 申请 MDL 写锁会被阻塞排队，而后续的所有增删改查请求为了排队在写锁后面，全都会被 MDL 写锁阻塞挂起，导致线程连接池瞬间打满而雪崩；规避方案是设置 DDL 超时时间，或者通过查询 processlist 强行 kill 掉前面的长事务。",
      thinkingProcess: "1. MDL 机制：5.5 引入。为了防止一个事务在 SELECT 的过程中，另一个线程把表给 DROP 了，导致前一个事务读不到数据结构出错。所以 SELECT 会加 MDL 读锁，ALTER 会加 MDL 写锁。读读兼容，读写互斥，写写互斥。\n2. 雪崩时序：\n   - 线程 A 开启事务，执行了一个慢 SELECT，持有 MDL 读锁。\n   - 线程 B 执行 `ALTER TABLE t ADD col INT`，申请 MDL 写锁，被 A 阻塞，在队列里排队等待。\n   - 重点来了：**MDL 写锁的排队优先级高于读锁。后续的所有读写线程（C, D, E...）进来执行 SELECT，发现队列前面有个写锁在排队，它们也必须在写锁后面排队！**\n   - 结果：全站的 SELECT, INSERT 全都被卡死。数据库连接数在几秒内飙升到几千个，连接池占满，整个业务线崩溃。\n3. 防范：\n   - DDL 加上 lock wait timeout：`SET lock_wait_timeout = 2; ALTER TABLE t ...`，拿不到写锁主动报错退出，不持续排队堵死通道。\n   - 查询 `information_schema.innodb_trx`，找出没提交的长事务，直接 `kill` 掉。",
      deepDive: "由于 MDL 锁是**不记录在 InnoDB 锁监控日志中的（它是服务层的锁）**，普通的 `show engine innodb status` 根本看不到它。必须通过查询 `performance_schema` 的 `metadata_locks` 表，才能定位到是哪一个 ThreadID 占着 MDL 读锁不放导致了全盘挂死。",
      structured: [
        "MDL 作用：保证表元数据一致性，防止事务在读取数据时，表结构被其他线程动态修改损坏",
        "雪崩时钟链：长事务持有 MDL 读锁 -> DDL 申请 MDL 写锁被挂起等待 -> 读写锁优先级抢占 -> 后续读写全部挂起排队",
        "隐蔽特征：MDL 锁存在于 Server 层，InnoDB 锁监视器无法扫描到，需从 performance_schema 检索排查",
        "防御战术：1. DDL 配短 lock_wait_timeout 超时；2. 绝不在高峰期执行 DDL；3. 提前 kill 掉未提交的事务"
      ]
    },
    keyPoints: ["元数据锁 MDL", "MDL 读锁写锁", "连接池耗尽", "lock_wait_timeout", "processlist 检索"],
    traps: ["在有未提交事务（即使只是 SELECT 了一下）的连接上进行 DDL 依然会触发 MDL 阻塞，因此在 DDL 前必须确认是否有长连接会话挂着没有 commit/rollback"],
    relatedIds: ["interview_db_017"]
  },
  {
    id: "interview_db_035_neo4j",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "图数据库（Neo4j）与关系型数据库对比",
    difficulty: 3,
    frequency: 3,
    question: "什么是图数据库？它与传统关系型数据库在处理复杂关联关系（如社交人脉、反洗钱资金流）时有什么本质的技术优势？",
    answer: {
      short: "图数据库以节点（Node）、关系（Relationship）和属性为核心模型，采用“免索引邻接（Index-Free Adjacency）”物理寻址；优势在于在关系型数据库中处理 3 层以上 Join 联表会导致索引查询呈指数级慢化，而图数据库通过物理指针直接跳跃遍历，查询速度与图的规模大小无关，仅与遍历路径长度呈线性相关。",
      thinkingProcess: "1. 邻接寻址：Index-Free Adjacency。图数据库直接把“关系的指向”做成物理指针存在磁盘和内存页里。要从人 A 找他的朋友 B，直接读取 A 节点中指向 B 节点的物理地址即可（类似链表跳转）。\n2. 关系型尴尬：在 MySQL 里，做社交关系通常需要一张中间表。多层关系（我朋友的朋友的朋友买过什么）需要 3-4 次 JOIN。由于每次 JOIN 都要走索引 B+ 树定位寻址，计算复杂度是 $O(N^d)$（$d$是层数），数据量大时直接计算超时。\n3. 图数据库复杂度：$O(d \times k)$（$k$是每个节点的平均出度），只和走几步有关。不管库里有 1 亿人还是 10 亿人，找 3 层朋友的时间完全是一样的。",
      deepDive: "Neo4j 使用 Cypher 查询语言。如查询两节点间的最短路径：\n`MATCH (p1:Person {name:'A'}), (p2:Person {name:'B'}), p = shortestPath((p1)-[*..5]->(p2)) RETURN p`\n在关系型数据库中，手写这种“不知道中间隔了多少层”的最短路径查询，需要写复杂的递归存储过程，且几乎没有可实战的性能表现，而 Neo4j 内部能通过双向广度优先搜索算法瞬间在毫秒内给出答案。",
      structured: [
        "免索引邻接（物理指针）：节点物理页块中直接保存指向相邻节点地址的硬编码指针，跳转关系免去索引检索",
        "关系型瓶颈：社交多度关系、供应链追溯在关系型数据库中伴随高昂 JOIN 折算，性能随层数加深而呈指数级崩坏",
        "复杂度降维：图搜索复杂度取决于遍历局域路径步数，与全局图数据体量脱钩，支撑高频多层人脉穿透",
        "专有语言 Cypher：声明式图查询规范，完美描述模式匹配（Pattern Matching）及最短路径图演化计算"
      ]
    },
    keyPoints: ["图数据库", "Neo4j", "免索引邻接", "Cypher 语言", "多度关系穿透", "最短路径算法"],
    traps: ["图数据库极其不适合大批量、全局性的属性扫描或传统的表级财务对账，在处理结构化表格汇总统计时其表现远落后于关系型数据库"],
    relatedIds: ["interview_db_022_rel"]
  },
  {
    id: "interview_db_036_influxdb",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "时序数据库（TSDB）与 InfluxDB 存储架构",
    difficulty: 4,
    frequency: 3,
    question: "什么是时序数据？时序数据库（如 InfluxDB）为了应对每秒数百万次的高频监控数据写入，在底层存储引擎（如 TSM 树）和数据压缩上做了哪些针对性设计？",
    answer: {
      short: "时序数据是以时间戳为主轴的结构化指标序列，读多写少、写多无更新；InfluxDB 底层使用 TSM（Time Structured Merge-tree）存储引擎，将时序的 Tag 和 Field 字段分离，利用内存 Cache 加上只读的 TSM 磁盘页追加写入；压缩上针对时间戳使用 Delta-of-delta 编码，对浮点指标使用 Gorilla 压缩，将存储空间压缩 90% 以上。",
      thinkingProcess: "1. 时序特征：写密集、无随机更新（时间往前走，历史不修改）、以时间段范围聚合查询（冷热分明，99%读最近的）。\n2. LSM 优化时序的问题：LSM 会对 key 进行排序，但在时序场景，由于大量不同指标（metric）并发写入，如果按指标排序，会导致同一时刻写的文件乱序，Compaction 时压力极大。\n3. TSM 树原理：InfluxDB 将元数据（SeriesKey，包含测量值名、tag 组合）与实际数据点（Timestamp + Field）分离。磁盘上的 TSM 文件将相同 SeriesKey 的时间戳和 Field 数据连续存储在 Block 中。这使得按时间段拉取某个指标的曲线图时，可以实现纯顺序物理读取，吞吐量极大。\n4. 时序压缩：\n   - **Delta-of-delta 压缩（时间戳）**：因为时序采集往往是固定间隔（如每 10 秒）。差值的差值大多是 0。通过比特位打包存储，时间戳压缩空间近乎忽略。\n   - **Gorilla 压缩（浮点数）**：计算连续浮点数的 XOR（异或）值，由于指标变动微小，异或结果前导 0 极多，只存非零比特位，压缩率极高。",
      deepDive: "InfluxDB 还设计了**保留策略（Retention Policy, RP）与分片（Shard）**。它将数据按时间段（如 1 天）切分为不同的物理 Shard 文件夹。当历史冷数据超出保留策略期限（如只留30天数据），时序数据库不需要执行高昂的 delete 表操作，而是**直接在文件系统层将 30 天前的 Shard 物理文件夹一键 rm 删除**。这对磁盘 I/O 没有任何抖动压力，展示了极致的工程美学。",
      structured: [
        "时序特征定位：Append-only 只能追加写，零随机修改，写多读少，强烈的以时间区间为主线的范围拉取",
        "TSM 存储树：将同一指标的序列时间戳与测量值聚合在一起（Column-store 列式块化排布），最大化顺序读效率",
        "双压缩神技：时间戳走 Delta-of-delta 差值压缩；指标浮点数走 Gorilla 异或压缩，极大节省硬盘带宽开销",
        "Shard 物理生命周期：以天为单位直接分区建 Shard，过期 RP 数据直接执行系统级物理文件切除，零 I/O 垃圾碎片"
      ]
    },
    keyPoints: ["时序数据库 TSDB", "InfluxDB", "TSM 引擎", "Gorilla 压缩", "Delta-of-delta 编码", "保留策略 Shards"],
    traps: ["时序数据库在应对“Tag 的基数（Cardinality）过大”（如将用户唯一的 UUID 作为 Tag 写入）时，会导致内存中的倒排索引膨胀崩溃，发生内存溢出，应严格控制 Tag 维度度数"],
    relatedIds: ["interview_db_013", "interview_db_027_col"]
  },
  {
    id: "interview_db_037_tidb",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "NewSQL 架构与 TiDB 分布式数据库原理",
    difficulty: 5,
    frequency: 3,
    question: "什么是 NewSQL 分布式关系型数据库？请以 TiDB 为例，详细阐述其计算层（TiDB）、配置中心（PD）和存储层（TiKV）构成的三层解耦架构的工作原理，以及它是如何支持弹性横向扩容与强一致分布式事务的？",
    answer: {
      short: "NewSQL 融合了关系型的 ACID/SQL 能力与 NoSQL 的无限横向扩容能力；TiDB 采用计算与存储分离架构：1. TiDB 无状态计算层接收 SQL 并解析为抽象语法树（AST），翻译成 Key-Value 操作发送至存储层；2. TiKV 分布式存储层以 Region（96MB）为单位进行数据划分，采用 Multi-Raft 强一致复制；3. PD 集群作为大脑，负责元数据路由及 Region 负载均衡调度；事务采用基于 percolator 模型优化的两阶段提交分布式事务，保障强一致。",
      thinkingProcess: "1. NewSQL 历史：解决单机关系数据库分库分表繁重、无分布式事务痛点。提供无限水平拓展的分布式数据库。\n2. 架构三组件：\n   - **TiDB Server**：无状态计算节点，负责协议解析、优化器评估、生成执行计划。可以通过加机器无限水平扩容。\n   - **TiKV Server**：分布式强一致 Key-Value 存储引擎。底层是 RocksDB。数据划分成一个个 Region。每个 Region 有 3 副本，运行 Raft 协议。TiKV 也可以无限加机器扩容。\n   - **PD (Placement Driver)**：分布式大脑。分配分布式全局唯一事务时间戳（TSO），记录数据在哪个 TiKV 节点上，监控负载并指挥 Region 自动迁移均衡。\n3. 强一致性事务：使用 Google Percolator 的去中心化两阶段提交算法。每个事务选出一个 Primary Key 作为事务标识，其余 key 作为 Secondary 关联它。通过乐观锁/悲观锁在 TiKV 各节点落锁，Primary 写入成功即代表事务成功提交，去除了中心化协调者的单点瓶颈。",
      deepDive: "TiDB 还是一个优秀的 **HTAP（混合事务/分析处理）** 数据库。在 TiKV 行存的基础上，TiDB 还可以挂载 **TiFlash** 列存引擎。数据通过 Raft Learner 协议实时近乎零延迟同步到 TiFlash。当用户发起复杂聚合报表 SQL 时，TiDB 优化器会自动将分析语句路由到 TiFlash 列存引擎处理，将事务与大屏统计完美融合在一套架构中，互不干扰。",
      structured: [
        "计算存储彻底分离：TiDB Server 无状态处理 SQL，TiKV 承载底层数据存储，彻底告别单机磁盘上限",
        "Multi-Raft Region 机制：物理存储划分为 96MB Region 块，以 Raft 强一致多节点同步，高弹性副本迁移",
        "PD 大脑大脑：Placement Driver，统一签发物理全局一致时间戳（TSO），实现动态自动扩容负载平衡",
        "HTAP 混部：行存 TiKV (支持 OLTP 交易) + 列存 TiFlash (支持 OLAP 报表分析)，一套架构满足混合计算场景"
      ]
    },
    keyPoints: ["NewSQL", "TiDB 架构", "TiKV Region", "Placement Driver TSO", "Multi-Raft", "HTAP 混合数据库"],
    traps: ["TiDB 的全局时间戳 TSO 是由 PD 集中签发的，高并发写事务下，如果网速延迟大，PD 签发 TSO 会成为系统的吞吐上限瓶颈"],
    relatedIds: ["interview_db_025_cons", "interview_db_026_cap"]
  },
  {
    id: "interview_db_038_backup",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "MySQL 物理备份与逻辑备份对比",
    difficulty: 2,
    frequency: 4,
    question: "请对比 MySQL 的物理备份（如 Percona XtraBackup）与逻辑备份（如 mysqldump）的区别、工作原理、备份速度及对线上业务性能的影响。",
    answer: {
      short: "逻辑备份通过扫描数据并生成 INSERT 等 SQL 脚本，速度慢、恢复慢，对 CPU/IO 压力大，但平台兼容性好，适合中小表备份；物理备份通过直接拷贝底层的 ibd 二进制数据文件，速度极快、恢复极快，Percona XtraBackup 通过后台复制物理页并监听 Redo Log 变化实现非阻塞热备份，对线上写业务几乎无阻碍。",
      thinkingProcess: "1. 区别：备份文本 SQL (逻辑) vs 备份二进制页块 (物理)。\n2. 逻辑备份 (mysqldump)：发 SELECT 语句把数据读出来，还原时重新执行 SQL。100GB 的库需要导出几十小时，导入重放更慢。导出时会产生大量的读 IO 并把 Buffer Pool 里的热数据全部洗掉（全表扫描污染）。\n3. 物理热备 (XtraBackup)：\n   - 开始备份时，直接拷贝物理数据页（.ibd）。\n   - 由于拷贝期间，主库依然在写入，数据页会被修改。XtraBackup 启动后台线程监听 Redo Log，把备份期间产生的重做日志全部存盘。\n   - 拷贝完后，利用 Redo Log 对拷贝出来的物理页进行“准备（Prepare）”前滚，使备份的数据页状态一致，实现无锁非阻塞热备。",
      deepDive: "mysqldump 在进行备份时，为了保证数据一致性（不能一边备份一边修改导致表之间外键失错），必须开启事务隔离级别为 `REPEATABLE READ` 并执行 `--single-transaction`。这能确保在 InnoDB 引擎下不锁表进行备份。但对于非事务型表（如 MyISAM），依然需要使用全局读锁（FTWRL - Flush Tables With Read Lock），这会导致整库全只读挂起，线上极度危险。",
      structured: [
        "逻辑备份（mysqldump）：生成结构与数据 SQL 脚本。恢复时重新执行，对 CPU/内存 Buffer 消耗极重。优势是支持跨主从、跨版本恢复",
        "物理备份（XtraBackup）：直接拷贝物理页块。恢复时直接将文件复制回数据目录执行重启，几分钟内完成大库恢复",
        "物理热备原理：拷备页时后台同步收集 Redo 日志，最后通过 Apply-log 将 Redo 前滚同步，实现无锁非阻塞",
        "选型底线：大体量数据库（>50GB）必须部署物理备份，小库或临时单表结构迁移可采用逻辑备份"
      ]
    },
    keyPoints: ["物理备份", "逻辑备份", "mysqldump", "XtraBackup", "无锁热备", "备份恢复时延"],
    traps: ["在执行物理备份恢复时，必须确保目标服务器的 MySQL 主版本号及存储引擎配置与备份源完全一致，否则可能因二进制不兼容而报错无法启动"],
    relatedIds: ["interview_db_010", "interview_db_014"]
  },
  {
    id: "interview_db_039_conn_storm",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "数据库连接风暴与线程池治理",
    difficulty: 3,
    frequency: 4,
    question: "什么是数据库“连接风暴（Connection Storm）”？当后端应用服务大面积横向扩容或高并发瞬时流量打来时，为什么会导致 MySQL 线程数暴增并最终挂起挂起？如何利用 thread_pool 治理？",
    answer: {
      short: "连接风暴是高并发下大量应用线程由于慢查询、锁等待阻塞，连接迟迟不释放，导致应用不断开辟新连接，迅速耗尽 MySQL 物理连接上限的现象；MySQL 默认采用 one-thread-per-connection（一个连接一个物理线程）模型，线程暴增会导致 CPU 剧烈上下文切换而假死；启用 Thread Pool 线程池模式可限制固定物理工作线程，避免 CPU 崩溃崩溃。",
      thinkingProcess: "1. 风暴成因：慢SQL或行锁阻塞 -> 连接不释放 -> 应用端（如 Spring 连接池）发现池内无可用连接，继续开辟新连接 -> 恶性循环，直到 MySQL `max_connections`（默认151）被打满，报 `Too many connections`，系统彻底瘫痪。\n2. 默认模型缺陷：MySQL 默认是 `one-thread-per-connection`。每一个客户端连进来，MySQL 内核就创建一个 OS 物理线程。当有 3000 个活跃连接，OS 在 3000 个线程之间高频切换，CPU 算力全部浪费在上下文切换上，真正执行 SQL 的 CPU 降到零，数据库挂起假死。\n3. 线程池（Thread Pool）救火：把“连接”与“工作线程”解耦。连接归连接，只管接收请求。后端核心维护一个大小固定的工作线程池（如 CPU 核心数的数倍）。所有的连接请求放到队列里排队执行。即使开 10000 个连接，也只有 64 个工作线程在跑，彻底守护了 CPU 资源不崩塌。",
      deepDive: "MySQL 企业版或开源的 MariaDB/Percona 默认集成了高性能的 Thread Pool。它将线程池划分为多个 Group。每个 Group 自带优先级队列，当遇到高并发查询时，如果检测到队列里的某个 SQL 是长查询，会将工作移至专门的备用工作线程，防范因为个别长事务慢查询将整个 Group 线程池全部卡死占满。",
      structured: [
        "风暴根源：底层线程与 TCP 连接强绑定。慢 SQL 累积导致大并发连接倾泻，MySQL 物理线程数暴涨崩溃",
        "上下文切换开销：成千上万个操作系统线程在单个 CPU 上轮转，寄存器指针换页开销超过真实计算开销，系统瘫痪",
        "Thread Pool 原理：解耦物理连接与执行线程。划分多个 Thread Group，引入队列排队缓冲，只用固定物理线程消费",
        "治理红利：即使有上万连接并发，数据库也能保持高吞吐和稳定的响应时间，防范了突发流量下的雪崩假死"
      ]
    },
    keyPoints: ["连接风暴", "线程池 thread_pool", "one-thread-per-connection", "上下文切换", "连接池耗尽", "系统防假死"],
    traps: ["启用 thread_pool 后，如果一个事务内部包含了需要等待外部网络回调的操作，会导致该工作线程长期挂起，极易将整个线程组卡死，因此事务内严禁包含任何外部网络 I/O 阻塞调用"],
    relatedIds: ["interview_db_030_pool"]
  },
  {
    id: "interview_db_040_sql_injection",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "backend",
    topic: "database",
    title: "后端 ORM 框架中的 SQL 注入防范与漏洞诱因",
    difficulty: 3,
    frequency: 5,
    question: "在使用 MyBatis, GORM 等后端 ORM 框架时，很多开发者认为用了框架就天然免疫 SQL 注入。请指出在 MyBatis 中 #{} 与 ${} 占位符有什么区别？在什么业务场景下我们不得不使用 ${}，此时如何进行安全防御？",
    answer: {
      short: "#{} 采用 PreparedStatement 预编译占位符，由数据库引擎强行做参数解析绑定，天然免疫 SQL 注入；${} 是直接进行字符串拼接，存在 SQL 注入隐患；当需要动态传入表名、列名或进行 ORDER BY 排序方向选择时无法使用预编译，必须使用 ${}，防范手段是在后端使用白名单严格限制可传入的值，或使用正则过滤输入。",
      thinkingProcess: "1. 注入机制：改变 SQL 原有的语法树结构。如 `select * from users where name = '${name}'`，若输入 `' or '1'='1`，SQL 变为 `name = '' or '1'='1'`，全表暴露。\n2. 占位符差异：\n   - `#{}`：预编译为 `where name = ?`。在发送具体值时，数据库只把传入的内容当作纯字面量（Literal）字符串，绝不作为 SQL 命令解析。即使传入了 SQL 指令也会被原样当成字符串搜索，物理拦截注入。\n   - `${}`：直接把值拼进 SQL 中，再发给数据库编译。有注入风险。\n3. 必须使用 `${}` 的场景：SQL 预编译时，**占位符 `?` 只能绑定参数值，绝对不能用于绑定“表名”、“列名”或“排序关键词（ASC/DESC）”**。例如 `select * from ${tableName} order by ${columnName} ${orderType}`。因为这些地方数据库编译时必须明确，无法预编译成 `?`。\n4. 防御底线：对表名/列名使用严格的代码层白名单校验。如果 `columnName` 不在 `['id', 'create_time', 'price']` 白名单中，直接拦截抛异常。排序方向强制用 `orderType.toUpperCase().equals(\"ASC\") ? \"ASC\" : \"DESC\"` 卡死判定，防范字符拼接拼接。",
      deepDive: "手写 MyBatis 漏洞代码分析：\n`SELECT * FROM articles WHERE title LIKE '%${keyword}%'`\n上面这行代码是由于开发者图省事，直接用 `${}` 拼接模糊查询，引发了严重的 SQL 注入。正确的写法是使用数据库提供的字符串拼接函数，或者用 `#{}` 结合内置 concat：\n`SELECT * FROM articles WHERE title LIKE CONCAT('%', #{keyword}, '%')`\n这从底层物理机制上重新套回了预编译，保障了安全性。",
      structured: [
        "预编译防守（#{}）：使用 PreparedStatement。编译阶段生成占位符 `?`，值作为只读字面量绑定，消除命令执行权",
        "字符串拼接（${}）：在生成 SQL 字符串阶段直接将参数拼写进去，导致攻击者输入可改变原有语法解析结构",
        "不得不用的硬拼现场：动态表名路由、动态 order by 列名排序。因为预编译 `?` 严禁用于元数据标识符位置",
        "白名单强过滤：对于不得不拼的动态字段，在 Java/Go 控制器层使用 map 白名单过滤，或使用正则表达式过滤非法字符"
      ]
    },
    keyPoints: ["SQL 注入防范", "#{}与${}区别", "预编译 Prepared", "动态表名拼接", "参数化绑定", "白名单校验"],
    traps: ["有些 ORM 框架中的动态 SQL 条件判断（如 MyBatis 的 `<if>` 标签中）如果书写不当，依然可能泄露未经转义的动态参数，上线前必须通过扫描工具审计"],
    relatedIds: []
  },
  {
    id: "interview_db_041_vector",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "向量数据库（Vector DB）与大模型 RAG 架构原理",
    difficulty: 4,
    frequency: 4,
    question: "什么是向量数据库？为什么传统数据库无法进行高维向量的快速检索？请详述 HNSW（分层导航小世界）算法在向量索引中的检索原理。",
    answer: {
      short: "向量数据库是存储和高频检索大模型生成的 Embedding 高维向量数据的系统；传统数据库面对数千维向量的相似度计算（余弦/欧氏距离）只能进行全库扫描，遭遇“维度灾难”；向量数据库通过构建近似最近邻（ANN）索引，如 HNSW 算法，将高维向量构造成分层图，实现对数级 O(log N) 的相似度召回。",
      thinkingProcess: "1. 大模型痛点：RAG (Retrieval-Augmented Generation，检索增强生成)。需要把用户的提问化为向量（如 1536 维），去库里搜索最接近的文档，拼成 prompt 发给 GPT。传统 B+ 树只能做标量大小比较，对 1536 个浮点数计算余弦夹角只能逐行扫，效率雪崩。\n2. 向量检索核心：ANN (Approximate Nearest Neighbor) 近似最近邻。不要求 100% 精准，但要求毫秒级召回。\n3. HNSW (Hierarchical Navigable Small World) 原理：\n   - 借鉴了跳表（SkipList）的多层思想，将其拓展到高维图（Graph）中。\n   - **最顶层（第 L 层）**：节点非常稀疏，边长。查询从顶层随机点开始，做贪心搜索，快速定位到局部的最近节点。\n   - **逐层向下**：跳到第 L-1 层，以上一层找到的最近点为起点继续搜索。层层向下，网络越来越密集，最后在底层（第 0 层）找到全局的近似最近邻点。\n   - 检索复杂度从 $O(N)$ 降到 $O(\log N)$，支撑亿级向量在毫秒内召回相似结果。",
      deepDive: "向量数据库的召回指标分为两步：\n1. **Index 构建**：在内存中用 HNSW/IVF-PQ 建立拓扑关联图。\n2. **度量距离（Distance Metrics）**：常见的有余弦相似度（Cosine Similarity，最适合文本语义）、欧氏距离（L2 Distance，适合图像特征匹配）和内积（Inner Product）。大模型开发中需要对 Embedding 向量做归一化，之后内积计算最快。",
      structured: [
        "维度灾难：超长浮点向量计算距离公式复杂，传统索引无法建立二叉或多叉区间，计算退化为全库大扫",
        "ANN 近似最近邻：通过牺牲微弱精度换取速度，将计算量从亿级缩减到十万级，实现在线秒级匹配召回",
        "HNSW 跳表图架构：分层图遍历。顶层跳跃式定位粗略块，向下在更密集图中做局部贪心逼近，O(log N) 寻址",
        "RAG 协同：大模型核心周边。将知识语料 Embedding 分块存库，用户提问实时求相似度检索，作为 Prompt 上下文喂给 LLM"
      ]
    },
    keyPoints: ["向量数据库", "HNSW 算法", "ANN 近似最近邻", "Embedding", "RAG 架构", "余弦相似度"],
    traps: ["HNSW 索引必须全量装载在物理内存中。1 亿条 1536 维的向量会占用上百 GB 内存，对服务器硬件内存配置要求极高，容易因 OOM 崩溃"],
    relatedIds: ["interview_db_028_es"]
  },
  {
    id: "interview_db_042_pg_jsonb",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "PostgreSQL JSON vs JSONB 格式区别与索引性能",
    difficulty: 3,
    frequency: 4,
    question: "在 PostgreSQL 中，JSON 和 JSONB 两种数据类型有什么本质区别？为什么在实际开发中更推荐使用 JSONB？如何针对 JSONB 字段内部嵌套的 Key 建立高效索引？",
    answer: {
      short: "JSON 格式是以纯文本形式原样保存数据，写入极快但读取时需要重复解析，不支持 GIN 倒排索引；JSONB 采用解析后的二进制格式存储，去除了多余空格和重复键，支持 GIN 倒排索引，读取性能远胜 JSON；嵌套字段可以通过 `CREATE INDEX ... USING gin ((col -> 'key'))` 或对整个 JSONB 列建 GIN 索引优化。",
      thinkingProcess: "1. 本质差异：文本存储（JSON） vs 二进制存储（JSONB，Binary）。\n2. 写入与读出开销：\n   - JSON：存字符串，快。但每次 `SELECT col->'name'` 都要当场重新把字符串 parse 一遍，效率低下。\n   - JSONB：存二进制树。写的时候要花 CPU 做解析压缩去重，慢。但读的时候是直接定位二进制偏移，速度极快。\n3. 索引优化：JSONB 完美支持 GIN（Generalized Inverted Index，广义倒排索引）。可以直接对整列加索引，或者对指定路径建表达示索引，彻底扫清非结构化字段的查询瓶颈。",
      deepDive: "JSONB 建立 GIN 倒排索引有两种经典配置：\n- **默认 jsonb_ops**：`CREATE INDEX idx_data ON users USING gin (info)`。这支持对 info 内部任意嵌套字段的包含运算符（`@>`）查询，范围最广，但索引文件较大。\n- **jsonb_path_ops**：`CREATE INDEX idx_data_path ON users USING gin (info jsonb_path_ops)`。此配置只记录路径与值，索引比默认的小很多，对指定键值对匹配（如 `info @> '{\"age\": 18}'`）查询性能更好，但不支持部分存在运算符（`?`）。",
      structured: [
        "JSON（文本格式）：原样保留输入文本、包含重复键与空格。写入零开销，读取每次都需 parse，不建议生产大规模用",
        "JSONB（二进制格式）：对 JSON 解析后二进制紧凑存储，合并重复字段。读性能极佳，支持物理索引优化",
        "GIN 倒排索引：广义倒排索引。将 JSONB 内的所有嵌套键值拆解建立倒排映射，支持对未知结构的极速检索",
        "表达式索引：针对特定高频字段如 `(info->>'userId')` 建立精细 B+ 树索引，节省索引磁盘空间"
      ]
    },
    keyPoints: ["PostgreSQL JSONB", "JSONB vs JSON", "GIN 倒排索引", "jsonb_path_ops", "嵌套查询优化"],
    traps: ["JSONB 在写入或高频更新时需要消耗较多 CPU 资源进行重构校验，若字段几乎不需查询仅做数据通道传输，使用 JSON 文本或 TEXT 效率更好"],
    relatedIds: ["interview_db_018", "interview_db_028_es"]
  },
  {
    id: "interview_db_043_mongo_agg",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MongoDB 聚合管道（Aggregation）与 SQL 映射映射",
    difficulty: 2,
    frequency: 4,
    question: "什么是 MongoDB 的聚合管道（Aggregation Pipeline）？请列出常见的管道操作符（如 $match, $group 等）并写出一个求“各部门平均薪水且薪水大于 5000”的聚合查询语句。",
    answer: {
      short: "聚合管道是 MongoDB 用于处理多文档统计、过滤并输出计算结果的框架，类似于数据处理流水线；$match 相当于 SQL 中的 WHERE，$group 对应 GROUP BY，$project 对应 SELECT；求均值薪水查询语句为使用 aggregate 传入 $match 薪水大于 5000，再在 $group 中按部门 id 统计，用 $avg 算 salary 的均值。",
      thinkingProcess: "1. 聚合概念：数据像流水线一样流过多个阀门（Stage），每个阀门过滤或修改数据，最后输出汇总结果。\n2. 算术映射：\n   - SQL: `SELECT dept, AVG(salary) FROM users WHERE salary > 5000 GROUP BY dept`。\n   - Mongo Agg: 先 match { salary: { $gt: 5000 } }，再 group { _id: '$dept', avg_salary: { $avg: '$salary' } }。\n3. Pipeline 操作符记忆：$match, $group, $sort, $limit, $project, $lookup(联表)。",
      deepDive: "写出具体的 MongoDB 聚合查询代码：\n```javascript\ndb.users.aggregate([\n  { \n    $match: { salary: { $gt: 5000 } } \n  },\n  { \n    $group: {\n      _id: \"$department\",\n      avgSalary: { $avg: \"$salary\" }\n    }\n  },\n  { \n    $project: {\n      _id: 0,\n      department: \"$_id\",\n      avgSalary: 1\n    }\n  }\n]);\n```\n在此阶段中，`$project` 重新整理了输出的键名，把默认的 `_id` 转换为 `department` 输出，增强了前端可读性。",
      structured: [
        "聚合管道：采用管道式 Stage 组合模式。上一个 Stage 输出的 Document 数组直接作为下一个 Stage 的数据源输入",
        "$match 阶段：根据条件筛选文档，强烈建议放在 Pipeline 的最顶端，以便利用索引快速剪枝减少后续处理量",
        "$group 阶段：按指定 Key 聚合数据。支持 `$sum`、`$avg`、`$min`、`$max` 以及 `$push`(将元素聚合成数组)",
        "性能优化：尽量在首个 Stage 完成 match 和 sort，否则后续阶段由于文档发生重组结构化，将完全无法利用索引"
      ]
    },
    keyPoints: ["MongoDB 聚合", "Aggregation Pipeline", "$match", "$group", "$avg 均值", "Stage 流水线"],
    traps: ["在聚合管道中如果把 $sort 放在 $group 之后，由于 group 已把数据移出索引物理表，会导致 sort 必须在内存中进行全量排序，若数据超 100MB 会当场报错崩溃，必须开启 allowDiskUse 选项"],
    relatedIds: ["interview_db_018"]
  },
  {
    id: "interview_db_044_dr",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "database",
    title: "数据库灾备核心指标：RTO 与 RPO",
    difficulty: 2,
    frequency: 4,
    question: "在评估数据库及业务系统的高可用和灾备方案时，RTO（恢复时间目标）和 RPO（恢复点目标）分别代表什么含义？在金融系统架构中，对这两个指标有什么极致要求？",
    answer: {
      short: "RTO 是故障发生到系统恢复服务的“最长等待时间”；RPO 是故障发生时允许丢失的“最大数据历史时间”；金融级系统的极致要求是 RPO = 0（数据零丢失），RTO 趋近于 0（秒级无感热切故障恢复）。",
      thinkingProcess: "1. 概念定位：高可用灾备的量化标准。\n2. RTO (Recovery Time Objective)：业务中断多久。考验的是故障检测速度、主备倒换流程、冷备载入速度。\n3. RPO (Recovery Point Objective)：数据丢失多久。考验的是备份频率、日志同步时效。如果是昨天的备份恢复，RPO 就是 24 小时。\n4. 金融高可用指标：金融核心系统一旦丢数据会引发严重的账目错乱。所以 RPO 必须死锁为 0。这就必须依靠 Paxos/Raft 的强一致同步，或者两地三中心物理强一致同步写落盘。而 RTO 秒级甚至毫秒级（Orchestrator 自动高可用切换）。",
      deepDive: "灾备级别划分：\n- **同城双活（Active-Active）**：两个机房都有流量，且数据实时互相同步，任何一个机房挂掉，另一个机房瞬间接管 100% 流量，RTO 趋近于 0，RPO = 0。\n- **异地灾备（Active-Passive）**：跨省异地备份。由于光速物理限制，跨省同步必有网络延时，通常采用异步复制，因此 RPO 往往大于 0（比如允许丢5秒数据，RPO=5s），主要应对城市性地震等极端灾难。",
      structured: [
        "RTO（Recovery Time Objective，时间目标）：断网宕机后，业务从瘫痪状态恢复正常对外运营所需的物理时间长度",
        "RPO（Recovery Point Objective，点目标）：允许因宕机造成的数据历史丢失量。比如每小时备份一次，RPO 最大为 1 小时",
        "RPO = 0 实战依托：利用共识复制（Raft/Paxos）或双写落盘，保证主备数据完全对齐后再返回成功给用户",
        "同城双活架构：打破冷备僵局，两机房同时接入活跃流量，秒级心跳热切，金融核心系统容灾标准"
      ]
    },
    keyPoints: ["RTO", "RPO", "同城双活", "异地容灾", "金融级灾备", "脑裂控制"],
    traps: ["不要脱离成本空谈 RPO=0 和 RTO=0，因为两地三中心强同步在跨地域专线建设、光纤租用和写时延性能上会带来数倍的昂贵资金预算和时延损耗"],
    relatedIds: ["interview_db_025_cons"]
  },
  {
    id: "interview_db_045_autocommit",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 自动提交（Autocommit）与隐式提交",
    difficulty: 2,
    frequency: 4,
    question: "在 MySQL 中，autocommit 变量开启和关闭对事务有什么影响？有哪些 SQL 语句会触发事务的“隐式提交（Implicit Commit）”从而导致当前的事务中途被迫强制提交？",
    answer: {
      short: "autocommit 开启时，每条独立的 SQL 都会被自动作为一个独立事务提交；关闭时，必须手动执行 commit 才会生效；会触发隐式提交的语句包括：所有 DDL 语句（如 ALTER TABLE、CREATE INDEX）、权限控制语句（GRANT）以及事务锁表语句（LOCK TABLES）。",
      thinkingProcess: "1. autocommit 控制：默认开启。即 `UPDATE ...` 就会立刻写 Redo 并刷盘。若关闭，所有的 SQL 都会在一个长事务里，直到敲 `COMMIT`，容易产生大事务挂死。\n2. 隐式提交：也被称为“自动隐式确认”。如果在事务中写了：\n   `BEGIN; UPDATE t SET a=1; ALTER TABLE t ADD col INT;`\n   当执行到 `ALTER` 瞬间，MySQL 内核会强制自动执行一次 `COMMIT`，把之前的 `UPDATE` 给提交了。然后执行 `ALTER`。如果 `ALTER` 报错了，先前的 `UPDATE` 也无法回滚。这就是隐式提交的危害。\n3. DDL 不能在事务内回滚：由于 DDL 涉及到数据字典的修改（修改文件、元数据），InnoDB 无法为其记录 Undo 逻辑回滚信息，因此必须在执行前强制提交之前的事务。",
      deepDive: "在写业务代码时，应该尽量避免将 DDL 操作混入到 Spring 的 `@Transactional` 事务方法中。这不仅会导致事务被提前隐式提交，破坏了原有的 ACID 保证，还可能引发 MDL 锁等待，造成高并发下的接口大面积卡死崩溃。",
      structured: [
        "autocommit = 1（自动提交）：单句 SQL 即为一个独立事务，省去 BEGIN 操作，但高频小修改会导致频繁刷盘 IO 瓶颈",
        "autocommit = 0（手动事务）：多句 SQL 汇入同一个事务中，直到遇到显式 `COMMIT` 或是连接异常断开时 `ROLLBACK`",
        "隐式提交诱因（DDL系列）：CREATE / ALTER / DROP / RENAME 等表结构修改动作执行瞬间，系统无条件强制自动提交当前事务",
        "隐式提交诱因（锁与权限）：LOCK TABLES / TRUNCATE TABLE / GRANT 等亦会切断当前事务执行强制提交"
      ]
    },
    keyPoints: ["autocommit", "隐式提交", "DDL 锁", "事务切断", "回滚失败"],
    traps: ["如果在事务中间不小心写了一句 TRUNCATE TABLE（截断清空表），会导致前面积累的修改立即落盘且再也无法 ROLLBACK"],
    relatedIds: ["interview_db_034_mdl"]
  },
  {
    id: "interview_db_046_cdc",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "Change Data Capture (CDC) 架构与 Debezium 原理",
    difficulty: 4,
    frequency: 4,
    question: "什么是数据库变更数据捕获（CDC - Change Data Capture）？相比传统的定时轮询查询，基于日志的 CDC（如 Debezium / Canal）有什么架构优势？它是如何保障数据捕获不漏不重的？",
    answer: {
      short: "CDC 是实时捕获数据库变更并分发到下游缓存或数仓的技术；相比轮询，基于日志的 CDC 伪装成 Slave 订阅物理 Binlog/WAL 日志，对数据库零性能损耗、无时延且能捕获删除物理动作；保障不重不漏依靠记录唯一的日志偏移量（binlog filename + position / GTID）并实现分布式消费确认确认机制。",
      thinkingProcess: "1. CDC 由来：实时数据同步需求（MySQL 同步到 ES，或者大数据数仓）。\n2. 轮询弊端：`where update_time > last_time`。每次发起大 SELECT 会对主库磁盘造成极高负载，且无法感知“物理 DELETE 动作”（因为删了就扫描不到了，除非做逻辑删除）。\n3. 日志 CDC 优势（Canal/Debezium）：不发起 SQL 查询。纯网络层伪装成 slave，主库直接把 binlog 字节流推送过来。CDC 引擎解析 binlog 生成结构化 JSON 消息发送到 Kafka。对数据库几乎没有任何读 IO 损耗。\n4. 不漏不重：\n   - 捕获端：保存当前消费到的 binlog 位点（Filename + Position）。如果 CDC 进程挂了，重启后从该位点继续读取。对于支持 GTID 的 MySQL，可以根据全局事务 ID 校验，保证绝对不漏。\n   - 投递端：由于网络抖动可能发生重发（At-least-once），下游消费端（如 ES 写入、Redis 写入）必须**实现幂等性写入（使用数据库主键作为 DocumentID/CacheKey）**，将重复数据自然覆盖，确保最终一致性。",
      deepDive: "在微服务架构中，CDC 还被用来实现 **Outbox Pattern（发件箱模式）**。在分布式事务难以实现的情况下，应用在更新主业务表的同时，将需要发送的事件写入本地的 `outbox` 表中。CDC 引擎（如 Debezium）实时监控 `outbox` 表的 binlog 变化并投递到 Kafka，完美避开了跨库强一致事务，用可靠的一致性投递完成了微服务间的消息通信。",
      structured: [
        "CDC 释义：Change Data Capture，数据库变更数据实时监听与捕获，用于异构数据库实时同步及分析",
        "无损解析优势：不执行 SQL select。纯内存旁路抓取 binlog file 并以流式格式导出，捕获物理 DELETE 动作无压力",
        "GTID 校验（不漏）：Global Transaction Identifier。全局事务唯一号，系统按号追踪，故障重启位点自愈",
        "幂等兜底（不重）：投递链路按“最少一次”保证，消费端以主键 id 写入，覆盖相同数据消除重复污染"
      ]
    },
    keyPoints: ["CDC 架构", "Debezium", "Canal", "Binlog 订阅", "Outbox Pattern", "GTID 幂等"],
    traps: ["如果主库开启了 Binlog Statement 格式，CDC 会因为无法从逻辑 SQL 语句中抽取出变动前后的具体行数据而失效，必须强制开启 Binlog 的 Row 模式"],
    relatedIds: ["interview_023", "interview_db_011"]
  },
  {
    id: "interview_db_047_query_cache",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 8.0 废弃查询缓存（Query Cache）的深层考量",
    difficulty: 2,
    frequency: 4,
    question: "MySQL 为什么在 8.0 版本中决定彻底删除原有的“查询缓存（Query Cache）”功能？这一设计有什么历史局限性，在实际并发场景中为什么会导致性能滑坡？",
    answer: {
      short: "查询缓存的设计局限性在于其“缓存失效粒度过粗且锁竞争剧烈”；Query Cache 缓存的是整条 SQL 和结果集，一旦表发生任何一次微小更新，该表所有的查询缓存都会被强行全部清空；在高并发写频繁场景下，清空缓存操作会频繁抢占全局大锁，导致 CPU 空转，性能反而不如关闭缓存。",
      thinkingProcess: "1. 查询缓存原理：MySQL 把 `select * from users where id=1` 的字符串和结果集在内存中做 Map。下次来一模一样的，直接返回。看似很美。\n2. 致命局限：\n   - **高频失效**：对表 `users` 哪怕只做了一次 `UPDATE users SET login_count=login_count+1 WHERE id=99`。MySQL 为了保证一致性，会将内存中**所有和 users 表关联的查询缓存全量强行删除！**\n   - **全局锁竞争**：为了清空或写入缓存，必须持有全局的 Query Cache Lock。当写请求密集时，大量读线程都在等待这个锁去清空/读取，造成严重的写阻塞读、读阻塞写，单核心 CPU 负载瞬间顶满挂起。\n   - **字符敏感**：`SELECT * from user` 与 `select * from user`（大小写不同），或者带了个空格，Query Cache 会判定为不同的 SQL，无法命中，非常鸡肋。\n3. 8.0 决定：彻底废除。把缓存的工作彻底交回给应用层（如 Redis）或更高效的 Buffer Pool 脏页刷写控制。",
      deepDive: "现在推荐的替代方案是充分利用 **InnoDB Buffer Pool**。Buffer Pool 缓存的是数据页，而不是 SQL 结果。如果修改了某一行，只会把该页标记为脏页，只要该页未被刷盘或淘汰，其他行（如 id=1）的查询依然可以直接在内存页中完成计算定位（快速读），不需要任何锁清空大扫除。这在工程上才是合理的高性能缓存设计。",
      structured: [
        "查询缓存机制：以 SQL 文本为 Key，结果集为 Value 直接在 Server 层进行全量缓存",
        "粗粒度失效悲剧：表内任何一行数据发生微小变更，与该表关联的所有查询缓存当场全部作废物理清除",
        "全局锁绞杀：写事务高频去清空缓存映射，读事务等待锁去写入，全局排队导致 CPU 被上下文切换完全吃空",
        "8.0 顺理成章：彻底移除废除。将数据页级的内存缓存交给 InnoDB Buffer Pool 承载，业务级结果缓存交给外部 Redis"
      ]
    },
    keyPoints: ["查询缓存", "8.0 废弃", "全局大锁竞争", "脏数据淘汰", "Buffer Pool 页缓存"],
    traps: ["不要把查询缓存（Query Cache）和执行计划缓存（Prepared Statement Cache）混为一谈，后者在 8.0 中依然保留且对提升 SQL 解析速度至关重要"],
    relatedIds: ["interview_db_014"]
  },
  {
    id: "interview_db_048_internal_xa",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "MySQL 内部 XA 分布式事务与崩溃恢复",
    difficulty: 4,
    frequency: 3,
    question: "MySQL 内部是如何利用 XA 分布式事务规范，来保证存储引擎层的 Redo Log 与服务层的 Binlog 数据在物理上绝对一致的？",
    answer: {
      short: "MySQL 内部采用两阶段提交（2PC）的分布式 XA 事务机制：第一阶段（Prepare），引擎层写 Redo Log 并标记为 prepare；第二阶段（Commit），协调者将 Binlog 刷盘，随后通知引擎层将 Redo Log 修改为 commit；崩溃恢复时，通过扫描未完成的 XA 事务，若 binlog 已落盘则强制 commit，未落盘则回滚，保障一致性。",
      thinkingProcess: "1. 痛点：Binlog（复制备份）和 Redo Log（崩溃恢复）必须一致。如果不一致，比如主库用 redo 恢复了修改，但 binlog 没记录，从库同步时就会漏掉这一条，主从数据不一致。\n2. 内部 XA 流程：\n   - MySQL 服务层（连接线程）充当事务协调者（Coordinator）。\n   - **Prepare 阶段**：协调者发送命令。InnoDB 引擎层把本次事务的所有修改写入 Redo Log 并刷盘，将事务标记为 `TRX_PREPARED` 状态。\n   - **Commit 阶段**：协调者确认 Redo 写好了，把变更 SQL/Row 写入主库的 Binlog 并强制刷盘（fsync）。Binlog 刷盘成功后，协调者向 InnoDB 发起提交命令，InnoDB 将事务状态在 Redo Log 里修改为 `TRX_COMMITTED`。\n3. 崩溃恢复（Recovery）逻辑：\n   - 重启时，扫描 Redo Log。如果发现有一个事务状态是 `prepare`。\n   - 去查看 Binlog 中是否已经有了该事务的完整记录（根据 XID 关联比对）。\n   - **情况 A**：如果在 Binlog 里找到了，说明在写完 Binlog 之后、Redo commit 之前发生了断电。强制将该事务提交（前滚 commit）。\n   - **情况 B**：如果在 Binlog 里找不到该事务，说明写 Binlog 之前就断电了。强制调用 Undo Log 回滚该事务（回滚 rollback）。\n   从而做到了两套独立物理日志系统的完美数据对称性。",
      deepDive: "在开启两阶段提交时，为了保证写性能，MySQL 引入了**组提交（Group Commit）**。它将多个并发事务的 Redo Log 和 Binlog 刷盘操作合并为一个批量 fsync 调用。这大幅降低了物理磁盘磁盘写磁头的频繁敲击次数，使得高并发事务写入性能提升了数倍。",
      structured: [
        "内部 XA 构成：MySQL 服务层作为协调者协调两个资源管理器——存储引擎（Redo Log）和服务层（Binlog）",
        "第一阶段：主库执行写入，Redo Log 记录数据页变更并写入 XID，锁状态置为 prepared 并刷盘",
        "第二阶段：服务层将写好 XID 的 Binlog 数据写入文件并落盘。接着通知 InnoDB 更改 Redo Log 标记为 commit",
        "前滚与回滚裁决：崩溃重启若扫到 prepared 状态事务，若 Binlog 中存有对应 XID 则前滚提交；否则利用 Undo 回滚"
      ]
    },
    keyPoints: ["内部 XA 事务", "两阶段提交 2PC", "崩溃恢复机制", "XID 比对", "组提交 Group Commit"],
    traps: ["两阶段提交过程中，必须将参数 `sync_binlog=1` 和 `innodb_flush_log_at_trx_commit=1`（双一配置）配置开启，否则操作系统级别的缓存丢失会导致两阶段提交的持久化数据出现缺口"],
    relatedIds: ["interview_db_011"]
  },
  {
    id: "interview_db_049_uuid_key",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "database",
    title: "UUID 主键与雪花算法（Snowflake）主键对 B+ 树的性能影响",
    difficulty: 3,
    frequency: 4,
    question: "在 MySQL InnoDB 引擎中，为什么极度不建议使用随机的无序 UUID 作为表的主键？为什么使用自增 ID 或趋势递增的雪花算法 ID 性能会好得多？请从 B+ 树分裂和磁盘 I/O 层面深入剖析。",
    answer: {
      short: "因为 UUID 是完全无序的随机字符串，插入大表时会导致 B+ 树索引频繁发生“页分裂（Page Split）”并产生大量随机 I/O，严重降低写入吞吐并导致物理页空间碎片化；而趋势递增的主键能保证新数据总是追加写入到当前叶子节点的末尾，实现顺序 I/O 写入，避免了页分裂和数据行的大面积移动。",
      thinkingProcess: "1. B+ 树聚簇索引物理排布：InnoDB 的行数据是直接存储在主键 B+ 树的叶子节点上的。物理上，页面是按主键大小顺序排列的。\n2. 随机 UUID 插入悲剧：\n   - 当一条主键为随机 UUID 的行写入时，它可能需要被插入到某个已经写满的物理页的中间位置（比如 Page A 的 50% 处）。\n   - 为了腾出空间，InnoDB 必须申请一个新页 Page B，把 Page A 后面 50% 的数据拷贝过去，并将 Page A 的数据指针重组。这就是**页分裂（Page Split）**。\n   - 页分裂会产生大量的磁盘随机 I/O，同时原页面中会留下大量的空闲内存缝隙（碎片化，导致空间利用率降到 50% 左右）。\n   - 随着表变大，页分裂会导致磁盘垃圾碎片堆积， Buffer Pool 频繁换页，写入性能呈崩塌式下降。\n3. 自增/雪花 ID 优势：\n   - 趋势递增。新插入的数据主键一定大于之前的所有主键，每次写入都会直接追加在最新 Page 的最后一行。写满一页自动开辟新页，**页填充率逼近 100%，物理上绝不发生页分裂**。磁盘 IO 为极致的顺序追加，写入性能极佳且稳定。",
      deepDive: "如果业务必须要求主键具有全局唯一且防猜测特征（防竞争对手通过自增 ID 估算每日订单量），较佳的方案是：**在后端生成趋势递增的雪花 ID（Snowflake）作为物理聚簇索引主键，再在表上针对无序 UUID 建立辅助索引作为外露的订单号（业务ID）**。这平衡了 B+ 树的物理写入性能和业务层的安全性。",
      structured: [
        "聚簇索引物理序：行数据物理存储顺序严格依从主键大小排序。有序写入可大幅节省磁盘寻道开销",
        "随机 UUID 伤害（页分裂）：随机主键强插已满数据页，引发页分裂与重组，磁盘 IO 瞬间被大量随机物理块拷贝占满",
        "空间空隙化：页分裂导致物理页面产生大量空洞碎片，索引填充率低下，Buffer Pool 缓存页命中率大幅度滑落",
        "自增/雪花优势：趋势单调递增，数据页始终顺序填充（末尾追加），无分裂开销，物理页空间利用率最大化"
      ]
    },
    keyPoints: ["UUID 主键", "雪花算法 ID", "页分裂 Page Split", "顺序 I/O 追加", "索引空间碎片", "聚簇索引物理结构"],
    traps: ["雪花算法 ID 的时钟回拨（Clock Skew）可能会导致生成重复的主键 ID 引发主键冲突异常，必须在 Snowflake 工具类中做好时钟检测与回拨等待防御"],
    relatedIds: ["interview_008"]
  },
  {
    id: "interview_db_050_shard_skew",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "database",
    title: "分库分表 Shard Key 选型与数据倾斜治理",
    difficulty: 4,
    frequency: 4,
    question: "在进行分库分表设计时，应如何科学地选择分片键（Shard Key）？面对由于“大商家”、“热点用户”导致的数据倾斜（Data Skew）和流量倾斜问题，在系统设计上有什么优秀的治理方案？",
    answer: {
      short: "分片键选择应权衡业务查询频率和数据均匀度，通常选用高散列的 userId；应对热点商家导致的数据倾斜，可采用“双 Shard Key 拼接加盐”或“大商家独立分库”设计；对于大商家，在 Shard Key 后追加随机盐（如 SellerID_0 到 SellerID_3），将其订单分散路由到不同的物理节点存储，避免单分片打爆。",
      thinkingProcess: "1. 选键基准：选择最频繁用于 WHERE 条件的字段，并且值要分布均匀。userId 最常用（选hash(userId)分库分表）。如果选了 create_time（Range分片），会有严重的写倾斜（今天的数据全写进最后一个库）。\n2. 倾斜灾难：比如淘宝大商家的订单量占了总量的 10%。如果按 `sellerId` 分片，这个大商家的所有订单全跑到了 Shard 3 节点，导致 Shard 3 磁盘爆满、CPU 顶满，其他 Shard 闲置。\n3. 双 Shard Key + 盐（Salting）解法：\n   - 对于普通商家，ShardKey 就是 `sellerId`。\n   - 对于特大商家（如大品牌旗舰店，在配置表中注册为热点），系统在写订单时，自动将 ShardKey 改为 `sellerId_X`（X 为 0 到 3 之间的随机数）。\n   - 这样，同一个大商家的数据就会被均匀散落分流到 4 个不同的 Shard 物理节点中，成功打散了单点 I/O 和存储上限。\n   - 查询时，大商家的后台查询订单需要并发请求这 4 个 Shard 分片并聚合，虽然牺牲了读开销，但保全了系统的高写入安全界限。\n4. 独立库解法：将这几个超级商家的流量从分布式数据库分流出来，专门分配一个独立的物理库（大商家专线库），对主微服务集群进行物理隔离。",
      deepDive: "在执行多维度查询时（如既需要按买家 `buyerId` 查询，又需要按卖家 `sellerId` 查询），为防广播查询，通用的工业架构设计是：**采用 Canal 实时同步 Binlog 并在 Kafka 中分流，建立“买家表”和“卖家表”双写双维度分表冗余**。买家端查 buyerId 分表的库，卖家端查 sellerId 分表的库，通过空间换时间的架构思路消灭跨库广播。",
      structured: [
        "Shard Key 目标：数据量分布绝对均匀（防磁盘爆满）、写入流量分布绝对均匀（防单点性能瓶颈）、绝大多数 SQL 可以单片定位",
        "数据倾斜灾难：热点大账户（如明星/头部商家）的所有行被路由到单个物理 Shard，该节点网卡和 CPU 直接打满假死",
        "加盐打散机制（Salting）：判定为特大用户后，对其 Shard Key 追加随机后缀（如 ID_random），迫使底层散列归档到多台分片",
        "买卖双写冗余（双维度分表）：利用 Canal + MQ 将写入数据实时双向复制，分别以 buyerId 和 sellerId 分片，杜绝跨库广播"
      ]
    },
    keyPoints: ["Shard Key 选型", "数据倾斜 Data Skew", "加盐 Salting", "双写双维度分片", "广播查询规避", "独立大商家库"],
    traps: ["分库分表加盐后，针对该大商家的单点聚合排序（如 ORDER BY price）由于数据在多台机器上，中间件必须做跨分片归并排序，开发复杂度大幅拉升"],
    relatedIds: ["interview_022"]
  }
];

const fileContent = `// interview-database.js
// 自动生成主题题库：数据库 (归属于 backend)

const questions = ${JSON.stringify(questions.concat(segment1).concat(segment2), null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-database.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-database.js with all 50 questions!');
