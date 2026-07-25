// interview-golang.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_038",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "golang",
    "title": "Go 语言 GMP 调度模型与抢占式调度原理",
    "difficulty": 4,
    "frequency": 5,
    "question": "请详细描述 Go 语言中的 GMP 协程调度模型，以及 Go 1.14 之后是如何实现基于信号的非合作式抢占调度的？",
    "answer": {
      "short": "GMP 模型中 G 为协程，M 为系统线程，P 为逻辑处理器；Go 1.14 引入基于 OS 信号（SIGURG）的抢占机制，通过发送信号并在中断处理中注入抢占标志，彻底解决了死循环协程霸占线程的瓶颈。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Go 语言 GMP 调度模型与抢占式调度原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Go 语言 GMP 调度模型与抢占式调度原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【概念定义】：首先界定 GMP 含义：G (Goroutine)、M (Machine 物理线程)、P (Processor 逻辑上下文)。\n2. 【协作机制】：M 必须绑定 P 才能执行 G。P 拥有局部运行队列，还有一个全局队列。如果 P 没有 G 了，会去其他 P 那里窃取工作（Work Stealing），或者去全局队列拉取。\n3. 【抢占式的历史痛点】：Go 1.12 之前是协作式抢占。如果一个 G 里写了一个死循环且内部没有任何函数调用（不触发 runtime.morestack 扩容检测），该 G 就会永久独占这个 M/P，导致该线程下的其他协程活活饿死。\n4. 【Go 1.14 革命性抢占】：引入基于系统信号的异步抢占。Sysmon 系统监视线程如果发现某个 G 执行超过 10ms，就通过系统调用向运行该 G 的 M 发送 SIGURG 信号。OS 收到信号后中断 M，进入信号处理函数。函数将 M 的寄存器保存，修改指令指针寄存器（RIP）使其跳转到抢占调度函数 asyncPreempt，从而让出 CPU。",
      "deepDive": "GMP 的 Work Stealing 机制和 Spin Mutex（自旋锁）大大减少了系统线程在内核态与用户态之间的上下文切换开销。每个 P 都有一个独立的本地无锁双端队列（Local Queue）来存放 G，这避免了全局锁的激烈竞争。抢占式调度不仅保障了垃圾回收（GC）时 STW（Stop The World）的快速响应，也极大地提升了并发服务在极端计算负载下的公平调度率。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。",
      "structured": [
        "角色分工：G 携带上下文和指令，M 绑定内核线程运行，P 提供局部队列与调度上下文",
        "负载均衡：Work Stealing 动态窃取其他 P 队伍 of G，Hand Off 剥离阻塞的 M 与 P 绑定",
        "协作缺陷：早期仅在函数调用栈扩容检测点触发让出，死循环直接导致单线程无限死锁",
        "信号抢占：系统线程 Sysmon 发送 SIGURG 信号，OS 中断后修改寄存器 RIP 跳转至 asyncPreempt 强行转让"
      ]
    },
    "keyPoints": [
      "GMP 模型",
      "抢占式调度",
      "Work Stealing",
      "SIGURG 信号",
      "asyncPreempt"
    ],
    "traps": [
      "GMP 中的 P 不是真实的 CPU 核心，而是指 Go 运行时拥有的逻辑处理器，默认数量通常等于 CPU 物理核心数，可通过 GOMAXPROCS 调整",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。"
    ],
    "relatedIds": [
      "interview_013",
      "interview_035"
    ]
  },
  {
    "id": "interview_042",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "backend",
    "topic": "golang",
    "title": "Go 语言 Channel 底层实现与安全并发原理",
    "difficulty": 3,
    "frequency": 5,
    "question": "请结合 runtime/chan.go 的 hchan 结构，详细分析 Go 语言中 channel（通道）的底层存储与阻塞唤醒机制？向已关闭的 channel 发送数据会发生什么？",
    "answer": {
      "short": "channel 底层是一个环形数组缓冲区，由一把互斥锁与两个双向链表等待队列（接收等待 recvq / 发送等待 sendq）组成；向已关闭的 channel 发送数据会直接触发 panic。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Go 语言 Channel 底层实现与安全并发原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Go 语言 Channel 底层实现与安全并发原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【底层结构探寻】：Go 的 channel 在底层是一个名为 hchan 的 struct。核心字段包括：qcount (环形队列中元素数量)、dataqsiz (环形队列总长度，即 buffer 大小)、buf (环形队列指针，存放缓存的数据)、recvq 与 sendq (双向链表，存放因通道阻塞而等待挂起协程 Sudog 包装)、lock (互斥锁，保证整个 channel 操作的线程安全)。\n2. 【阻塞与唤醒流程剖析】：无缓冲或缓冲满时发送数据 -> 协程 G 被打包成 Sudog 挂在 sendq 链表尾部，调用 gopark 挂起并释放 lock -> 等待另一个协程调用接收 -> 接收协程发现 sendq 有等待的 Sudog，直接将其出列并将其数据拷入自己的接收变量，调用 goready 唤醒该挂起协程放入调度 P。同理，无数据读取时协程挂载在 recvq，等待发送者唤醒。\n3. 【关闭通道的异常边界】：向关闭的 channel 发送数据触发 panic；向关闭的 channel 重复关闭触发 panic；从关闭 of channel 读取数据可以继续读，如果缓冲区有数则读数，无数据则直接返回零值与 false。",
      "deepDive": "Go 的哲学是：“不要通过共享内存来通信，而要通过通信来共享内存”。channel 的底层由于加锁了（hchan.lock），所以它并不是完全无锁的，但是 runtime 通过将协程挂载到 sudog 等待链表并让出当前 M 线程的 CPU 执行权，实现了极高的协程级并发响应速度。设计并发程序时，应当严格遵循：谁创建谁关闭，谁发送谁维护的原则，避免发生“向已关闭通道发送”的 Panic 事故。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。",
      "structured": [
        "数据结构：hchan 锁控制，环形 buf 缓存，双向链表接收（recvq）/发送（sendq）阻塞队列",
        "阻塞挂起：gopark 释放锁，协程封包为 Sudog 并挂入等待队列，转让 M 资源给其他 P",
        "接收唤醒：对端取出 Sudog 直接拷贝数据，通过 goready 将等待者置入可运行就绪队列",
        "安全红线：向 nil 通道发送将永久阻塞，向关闭通道发送数据直接 Panic"
      ]
    },
    "keyPoints": [
      "hchan 结构",
      "环形队列",
      "Sudog",
      "recvq/sendq",
      "关闭异常",
      "gopark/goready"
    ],
    "traps": [
      "向未初始化的 nil channel 读写数据不会触发 Panic，但会永久阻塞当前协程，这是极易被忽略的内存泄露陷阱",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。"
    ],
    "relatedIds": [
      "interview_038",
      "interview_013"
    ]
  },
  {
    "id": "interview_golang_003_mutex_starvation",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "golang",
    "title": "Go Mutex 互斥锁正常模式与饥饿模式",
    "difficulty": 4,
    "frequency": 5,
    "question": "请详细分析 Go 语言中 sync.Mutex 互斥锁的底层工作机制。正常模式（Normal）与饥饿模式（Starvation）有什么区别？它是如何防止 Goroutine 长期饿死的？",
    "answer": {
      "short": "sync.Mutex 默认采用正常模式：新抢锁协程与被唤醒队列头协程通过 CAS 竞争，新协程更易成功；当某个协程排队超 1ms，锁转入饥饿模式，此时新抢锁者不自旋，锁直接从释放线程移交给排队头协程，防止协程饿死。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Go Mutex 互斥锁正常模式与饥饿模式】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Go Mutex 互斥锁正常模式与饥饿模式】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 底层结构：sync.Mutex 主要由一个 state int32 表示状态，一个 sema uint32 控制信号量等待。\n2. 正常模式：\n   - 新来抢锁的协程很多已经占有 CPU 并处于自旋（Spinning）状态，而刚被唤醒的排队协程需要经历线程上下文切换。\n   - 导致唤醒协程抢锁大概率抢不过自旋的新协程，导致高并发下排队的协程可能无限饿死。\n3. 饥饿模式切换：\n   - 如果排队的协程等待时间超过 1ms，Mutex 就会进入饥饿状态。\n   - 在饥饿模式中，释放锁的协程会把锁**直接移交给排队头部的协程**，新来的协程完全不能参与抢锁，也不自旋，无条件挂入排队队列尾部。\n4. 饥饿模式退出：\n   - 当被唤醒的协程是队列中最后一个，或者其排队等待时间小于 1ms 时，Mutex 会从饥饿模式重新切回正常模式。",
      "structured": [
        "正常模式优先吞吐：释放锁后自旋抢占者与唤醒者 CAS 竞争，利用自旋在 CPU 上的现存性，最大化系统总吞吐性能",
        "饥饿模式强制移交：排队超 1ms 触发饥饿，锁控制权直接通过信号量投递给队头 G，新来协程被迫挂起排队，防止饥饿",
        "自旋条件限制：自旋次数不能超 4 次、CPU 核心数必须大于 1 且 GOMAXPROCS > 1，且当前 P 本地队列必须为空，防 CPU 空转",
        "原子位域映射：state 字段包含 mutexLocked (锁标记), mutexWoken (唤醒标记), mutexStarving (饥饿标记) 及 waiterCount (等待数)"
      ],
      "deepDive": "\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。"
    },
    "keyPoints": [
      "sync.Mutex",
      "正常模式/饥饿模式",
      "自旋条件",
      "信号量 sema",
      "state 状态位",
      "Goroutine 饥饿防止"
    ],
    "traps": [
      "sync.Mutex 是**不可重入锁**，同一个协程如果连续加锁两次，会由于第二次加锁时 state 字段 locked 始终为 1 且无法自我释放，导致当前协程自己将自己死锁在信号量上",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。"
    ],
    "relatedIds": [
      "interview_038"
    ]
  },
  {
    "id": "interview_golang_004_rwmutex",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "golang",
    "title": "Go RWMutex 读写锁设计与写者优先机制",
    "difficulty": 3,
    "frequency": 4,
    "question": "Go 语言中的 sync.RWMutex 是如何实现读写分离的？它是如何避免写锁饥饿（Writer Starvation）的？",
    "answer": {
      "short": "sync.RWMutex 底层基于互斥锁（w）与读写两个计数器实现；当写锁请求到来时，它会原子地给读者计数器 readerCount 加上一个极大负数（rwmutexMaxReaders），从而使新读锁全部受阻挂起，保障了写者能够优先获取锁而不被无限读请求所淹没。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Go RWMutex 读写锁设计与写者优先机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【Go RWMutex 读写锁设计与写者优先机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 核心字段：\n   - `w Mutex`：互斥锁，保障写锁之间的互斥关系。\n   - `writerSem/readerSem`：读写协程排队挂起的信号量。\n   - `readerCount`：当前活动的读者数（或等待写锁的负数标记）。\n   - `readerWait`：写锁到来前，还有多少个读锁未完成释放。\n2. 避免写饥饿原理：\n   - 如果只有普通的读写分离，大量的并发读请求会导致 `readerCount` 永远大于 0，写锁线程将被无限挂起（写饥饿）。\n   - RWMutex 的突破：写锁调用 `Lock()` 时，会将 `readerCount` 减去 `rwmutexMaxReaders`（1<<30），代表将其置为负数。\n   - 新来的读锁 `RLock()` 看到 `readerCount < 0`，判定有写锁在排队，自觉将自己挂起在 `readerSem` 上。\n   - 已有的读者释放锁时 `RUnlock()` 递减 `readerWait`。当 `readerWait` 清零，立即释放 `writerSem` 唤醒写锁线程。",
      "structured": [
        "写者加锁互斥：写锁获取前必须先占有 w Mutex，阻断其他写者竞争；然后扣减极大偏置数阻断新读者加锁",
        "读写状态分发：readerCount 为负数代表写者介入。RLock() 发现负数便调用 gopark 挂载 readerSem 等待队列",
        "写者等待清空（readerWait）：写锁进入时记录当前存活的读者数，当所有存活读者调用 RUnlock 释放后，唤醒写者",
        "写者释放恢复：写锁 Unlock 时给 readerCount 加上 rwmutexMaxReaders，恢复正数状态，并循环释放 readerSem 唤醒挂起读者"
      ],
      "deepDive": "\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。"
    },
    "keyPoints": [
      "sync.RWMutex",
      "写锁优先",
      "readerCount 偏置",
      "readerWait 状态",
      "读写信号量",
      "防止写锁饥饿"
    ],
    "traps": [
      "禁止在同一个协程中嵌套使用读锁，即 RLock() 内部再调用 RLock()，若在两次 RLock 之间恰好有写锁请求 Lock()，会导致第二次 RLock 因为写锁阻断而挂起，而写锁又在等待第一次读锁释放，发生循环等待死锁",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。"
    ],
    "relatedIds": [
      "interview_golang_003_mutex_starvation"
    ]
  },
  {
    "id": "interview_golang_005_waitgroup",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "golang",
    "title": "sync.WaitGroup 内存对齐与信号量同步机制",
    "difficulty": 3,
    "frequency": 5,
    "question": "Go 语言中的 sync.WaitGroup 是如何支持多协程同步等待的？为什么其内部 state 字段在 32 位系统与 64 位系统上要采取不同的内存对齐与地址计算方式？",
    "answer": {
      "short": "sync.WaitGroup 通过一个原子操作的计数器 counter、等待数 waiter 加上信号量 sema 实现同步；由于 64 位原子操作要求 8 字节对齐，WaitGroup 在 64 位下将 state1 的前 8 字节作为 state 状态（counter+waiter），后 4 字节作为 sema；在 32 位下则根据起始地址是否对齐，动态调整前 4 字节和后 8 字节的映射，以保证原子操作的绝对安全性。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【sync.WaitGroup 内存对齐与信号量同步机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【sync.WaitGroup 内存对齐与信号量同步机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 核心字段：`noCopy` 静态查错辅助，`state1 [3]uint32`（包含 counter, waiter, sema）。\n2. 为什么对齐：\n   - 64 位 CPU 执行原子操作（如 `sync/atomic` 针对 64 位整数）要求操作数的内存地址必须是 8 字节对齐（地址为 8 的倍数），否则 32 位架构机器下会发生 Panic 崩溃。\n3. state 字段对齐设计（Go 1.19 之前为 `[3]uint32`，1.20 做了简化重构）：\n   - 早期：3 个 uint32 共占用 12 字节。\n   - 在 64 位架构下：`state1` 本身起始地址必然是 8 字节对齐的。所以前 8 字节（2个uint32）可以安全合并为 64位 的 state（高32位为 counter，低32位为 waiter），最后 4 字节作为 sema 信号量。\n   - 在 32 位架构下：`state1` 的地址可能不满足 8 字节对齐（可能是 4 字节对齐）。此时若地址不是 8 的倍数，前 4 字节作为 sema，后 8 字节（对齐了的地址）作为 64位的 state 状态。通过动态运算 `unsafe.Pointer` 寻址，保证 64位 原子读写一定落在 8 字节对齐的内存段上。",
      "structured": [
        "计数与等待状态：WaitGroup 本质是一个 64 位整型（高 32 位为 Add 进来的任务数 counter，低 32 位为正在 Wait 的协程数 waiter）",
        "64位对齐保障：32位机对 64位原子读写必须确保 8 字节对齐。通过检测 state1 地址模 8，动态偏移映射 counter/waiter 寻址",
        "noCopy 静态保护：结构体内嵌空 struct `noCopy`。如果使用 govet 检测复制传递 WaitGroup 的情况，会抛出编译级警告",
        "Wait 与 Done：Add/Done 修改 counter。Wait 发现 counter > 0 则 waiter++ 并调用 gopark 挂起；Done 清零后通过 semrelease 唤醒所有等待者"
      ],
      "deepDive": "\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。\n\n【源码深度/调度逻辑】：Go 语言中 Channel 的底层结构体为 `hchan`，包含锁 `lock`、循环链表缓冲区 `buf` 以及等待队列。Go 的 GC 采用三色标记法加混合写屏障机制，在并发标记阶段，写屏障能够强行将任何新指针赋值的对象标记为灰色，从而在不暂停主线程的前提下安全完成可达性扫描。"
    },
    "keyPoints": [
      "sync.WaitGroup",
      "内存对齐",
      "state1 数组",
      "64位原子操作",
      "govet noCopy",
      "信号量同步"
    ],
    "traps": [
      "WaitGroup 的 `Add(delta)` 必须在 `go func()` 启动协程**之前**在主协程中调用，如果写在子协程内部，在高并发下子协程还未来得及执行 Add，主协程的 Wait 已经通过 counter == 0 判定直接通过，导致同步彻底失效",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。",
      "面试官常套路“向已关闭的 channel 发送数据、以及读取已关闭的 channel 会发生什么？”。防撕脑图：1. 向已关闭的 channel 发送数据会直接触发 panic 崩溃。2. 重复关闭同一个 channel 会发生 panic。3. 读取已关闭的 channel，会立刻返回该类型的零值，且不会阻塞。"
    ],
    "relatedIds": [
      "interview_golang_004_rwmutex"
    ]
  }
];

module.exports = questions;
