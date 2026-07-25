// interview-docker_k8s.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_040",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "infra",
    "topic": "docker_k8s",
    "title": "Kubernetes Pod 调度原理与健康检查机制",
    "difficulty": 3,
    "frequency": 4,
    "question": "请详细描述 Kubernetes (K8s) 中一个 Pod 从创建到调度成功并在节点运行的全生命周期？K8s 是如何进行健康检查的？",
    "answer": {
      "short": "Pod 创建经 API Server 写入 etcd，Scheduler 监听并执行过滤与优选调度，Kubelet 接管调用容器运行时拉起；运行期通过 Liveness、Readiness 和 Startup 三种探针（Probe）监控健康状态并执行自愈。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Kubernetes Pod 调度原理与健康检查机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【生命周期还原】：用户 kubectl apply 发起请求 -> 经过 API Server 验证 -> 写入 etcd 存储。\n2. 【调度器介入】：kube-scheduler 监听未绑定节点的 Pod，开始调度。调度分为 Predicate（预选/过滤，如资源是否够、亲和性检测等）和 Prioritize（优选/打分，如资源利用率等），得分最高的节点被选定并发起 Binding。\n3. 【节点接管与拉起】：目标节点的 Kubelet 监听到绑定事件，调用底层的容器运行时（CRI，如 Containerd/Docker）拉起容器，调用 CNI 挂载网络，调用 CSI 挂载卷。\n4. 【监控自愈机制分析】：三种探针：Startup Probe（启动探针，防止慢启动容器在初始化时被错杀）、Liveness Probe（存活探针，判断容器是否活着，失败则重启容器）、Readiness Probe（就绪探针，判断是否能接受流量，失败则从 Service Endpoint 剔除）。",
      "deepDive": "在实战中，Readiness Probe 对无缝滚动更新（Rolling Update）至关重要。如果只配置 Liveness，K8s 会在 Pod 容器进程刚刚启动时就直接将流量分发过去，而此时子系统（例如 Spring Boot）可能还没完成 Bean 初始化，从而导致用户直接拿到 502/504 错误。必须合理搭配 Readiness 探针并设置 InitialDelaySeconds。\n\n【底层机制/折中设计】：Docker 容器不是虚拟机，它只是 Linux 主机上的一个受隔离的普通进程。隔离性依靠 Namespace，资源额度限制依靠 Cgroups。Pod 本质上是共享同一个网络 Namespace 和同一个存储 Volume 的一组紧密协作的普通进程集合。",
      "structured": [
        "写入流转：APIServer 写入持久化 etcd，通知 Scheduler 进行调度",
        "调度打分：预选过滤不符节点，优选进行优先级加权分配得分，决定绑定目标",
        "节点挂载：目标机器 Kubelet 调用 CRI/CNI/CSI 挂载网络卷并拉起容器",
        "三大探针：Startup（防初始化打扰）、Liveness（挂了重启）、Readiness（失败切断 Service 流量）"
      ]
    },
    "keyPoints": [
      "Kubernetes Pod",
      "调度原理",
      "Kubelet",
      "探针机制",
      "就绪探针",
      "etcd"
    ],
    "traps": [
      "Liveness 失败会导致容器被 Kubelet 重启，而 Readiness 失败只会将容器从流量路由剔除，千万不要混淆它们的应用场景",
      "面试官常用套路：“如果容器内进程发生了 OOMKilled，是哪个层级触发的，如何排查？”。正确回答：是由 Linux 内核的 OOM-Killer 机制检测到该进程超出了 Cgroups 中限制的内存上限触发的。应通过宿主机 dmesg 命令排查内核日志，不能单靠容器内部日志。"
    ],
    "relatedIds": [
      "interview_027",
      "interview_030"
    ]
  },
  {
    "id": "interview_docker_k8s_001_namespaces",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "docker_k8s",
    "title": "Linux Namespace 隔离隔离类型与原理",
    "difficulty": 4,
    "frequency": 5,
    "question": "容器技术的本质是 Linux 进程隔离。请详述 Linux 内核支持的七大 Namespace（命名空间）各自的隔离维度与物理作用。在 C 语言中，创建容器进程的核心系统调用是什么？",
    "answer": {
      "short": "Namespace 实现轻量级系统资源虚隔离；七大 Namespace 为 PID（进程号）、NET（网络）、IPC（进程间通信）、MNT（文件挂载点）、UTS（主机名）、USER（用户映射）和 CGROUP（控制组路径）；创建进程使用 `clone()` 系统调用配合特定 CLONE 标志位拦截物理资源。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Linux Namespace 隔离隔离类型与原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 命名空间（Namespace）隔离维度：\n   - **PID Namespace**：隔离进程号。使得容器内主进程 PID 为 1，与宿主机的真实 PID 体系解耦。\n   - **NET Namespace**：隔离网络设备、IP 路由表、端口监听。使容器拥有独立的虚拟网卡（eth0）、网卡路由和 iptables 表。\n   - **IPC Namespace**：隔离 System V IPC 和 POSIX 消息队列，防止容器间通过共享内存互刷信息。\n   - **MNT Namespace**：隔离文件系统挂载点。使容器拥有独立的 `mount` 挂载视图。结合 `pivot_root` 实现根文件系统隔离。\n   - **UTS Namespace**：隔离主机名和域名（Hostname / Domainname）。\n   - **USER Namespace**：隔离用户和组 ID。允许容器内部的 `root` 用户（UID 0）映射为宿主机上的普通无权限用户，保障宿主主机安全。\n   - **CGROUP Namespace**：隔离 cgroup 树的视图，隐藏宿主机 cgroup 根节点物理路径。\n2. 核心系统调用（物理拉起）：\n   - 容器进程的物理诞生依靠 `clone(fn, stack, flags, arg)` 系统调用。\n   - 在 `flags` 中传入：`CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWIPC | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWUSER | CLONE_NEWCGROUP`。\n   - 随后通过 `setns()` 允许其他进程（如 exec）加入已有命名空间，用 `unshare()` 动态剥离共享，达成资源虚化。",
      "structured": [
        "PID 树独立：隔离进程树。容器内 1 号 PID 映射宿主机高位真实 PID，实现进程分支隐藏",
        "NET 网络堆栈物理隔离：每个容器拥有独立的 veth pair设备、IP 地址及路由表，端口端口绑定互不冲突",
        "MNT 挂载隔离：提供专属的只读与读写挂载树，搭配 pivot_root 切入根文件系统镜像，形成沙箱环境",
        "clone 系统调用：通过 flags 位掩码将新进程与系统物理资源断开，实现低成本的用户态系统隔离"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Docker 容器不是虚拟机，它只是 Linux 主机上的一个受隔离的普通进程。隔离性依靠 Namespace，资源额度限制依靠 Cgroups。Pod 本质上是共享同一个网络 Namespace 和同一个存储 Volume 的一组紧密协作的普通进程集合。"
    },
    "keyPoints": [
      "Namespace 隔离",
      "PID / NET / MNT / IPC",
      "USER 映射",
      "clone 系统调用",
      "setns / unshare",
      "容器沙箱"
    ],
    "traps": [
      "Namespace 仅仅是资源的“视线隔离”（View Isolation），**容器和宿主机依然共享同一个 Linux 操作系统内核**！如果容器进程触发了内核 Panic，或者调用了没有 Namespace 化的内核全局属性（如修改系统物理时钟），宿主机 and 所有其他容器会跟着一起崩溃或被篡改，绝非完全物理隔离",
      "面试官常用套路：“如果容器内进程发生了 OOMKilled，是哪个层级触发的，如何排查？”。正确回答：是由 Linux 内核的 OOM-Killer 机制检测到该进程超出了 Cgroups 中限制的内存上限触发的。应通过宿主机 dmesg 命令排查内核日志，不能单靠容器内部日志。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_docker_k8s_002_cgroups",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "docker_k8s",
    "title": "Linux Cgroups v1 vs v2 资源配额与 CFS 调度",
    "difficulty": 4,
    "frequency": 5,
    "question": "Linux Cgroups（控制组）是如何限制容器 CPU 和内存的？Cgroups v1 与 v2 的层级结构有什么本质区别？K8s 中的 CPU limit 限制是如何通过 CFS 调度器周期机制触发 OOM-killer 的？",
    "answer": {
      "short": "Cgroups 通过内核虚拟文件系统限制物理资源：v1 使用多树独立结构导致多维资源联合控制冲突，v2 采用统一单树结构规避冲突；CPU 限制通过 CFS 调度器的 `cpu.cfs_period_us` 与 `cpu.cfs_quota_us` 实现，超限则被挂起 throttled；Memory 超限则触发 OOM-killer 强制杀死容器进程。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Linux Cgroups v1 vs v2 资源配额与 CFS 调度】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 资源限制物理实质（Cgroups）：\n   - 在 `/sys/fs/cgroup/` 目录下为容器创建专属目录，通过改写里面的控制参数强加内核调度约束。\n2. v1 与 v2 架构进化差异：\n   - **Cgroups v1（多树独立）**：每个子系统（CPU, Memory, BlkIO）各自构成一棵独立的树。一个进程可以挂在 CPU 树的 A 节点，同时挂在 Memory 树的 B 节点。这导致当我们要进行“联合资源管控”（如限制某个 I/O 操作产生的写内存页面刷盘）时，不同树之间无法安全传递上下文，产生设计冲突。\n   - **Cgroups v2（统一单树）**：将所有子系统统一挂在一棵树上，所有子系统共享同一个进程层级划分，完美解决了跨资源协同同步和控制缺陷。\n3. K8s 配额落实与 CFS 调度约束机制（限流与 OOM）：\n   - **CPU 限制（CFS Scheduler）**：\n     - 采用完全公平调度（CFS）的带宽控制模式。\n     - 两个核心参数：`cpu.cfs_period_us`（时间周期，K8s 默认 100ms = 100000us）与 `cpu.cfs_quota_us`（配额，指在这个周期内该容器可使用的最大 CPU 时间，如 limit 设为 2 核，则配额为 200000us）。\n     - **Throttling 限流**：如果容器在 100ms 周期内把 200ms 的 CPU 额度用完了，CPU 调度器会**强行将该容器的所有进程挂起（Throttled）**，直到下一个 100ms 周期到来才重新解冻。这导致程序虽然不崩溃，但响应延时会发生严重的阶跃式突变卡顿。\n   - **Memory 限制（OOM Killer）**：\n     - 写入 `memory.limit_in_bytes`。\n     - **OOM-killer 触发**：当容器物理内存使用量加上 swap 超过了 limits 限制，内核内存分配器触发失败。由于没有限流降级余地，内核会启动 **OOM Killer 机制**。根据 `oom_score_adj` 计算得分，**当场把容器内消耗内存最高的主进程强行物理杀死（Kill -9）**，容器挂掉，K8s 控制台报 `OOMKilled` 状态。",
      "structured": [
        "CFS CPU 周期配额：以 100ms（period）为时间周期，设定最大累加 CPU 时间额度（quota），超标触发 Throttle 挂起",
        "Memory 物理死线（OOMKilled）：内存超额直接触发缺页分配失败，内核激活 Out-Of-Memory 强杀机制强行枪毙进程",
        "v1 独立多叉树冲突：子系统控制链割裂，进程归类复杂，多维控制协调（如 IO 和内存合并限速）无法闭环",
        "v2 单树协同大一统：进程必须处于相同的层级控制叶节点，统一了资源管理视图，支持无缝的全局级联限流"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Docker 容器不是虚拟机，它只是 Linux 主机上的一个受隔离的普通进程。隔离性依靠 Namespace，资源额度限制依靠 Cgroups。Pod 本质上是共享同一个网络 Namespace 和同一个存储 Volume 的一组紧密协作的普通进程集合。"
    },
    "keyPoints": [
      "Cgroups v1 vs v2",
      "CFS 调度器",
      "cpu.cfs_quota_us",
      "CPU Throttling",
      "OOM-killer",
      "oom_score_adj"
    ],
    "traps": [
      "在 Java 等多线程运行时环境中，早期 JDK（8u131 之前）无法感知容器 Cgroups 的 CPU 和内存 limit 限制，默认会读取宿主机的 CPU 核心数，导致 JVM 开启过多的 GC 线程和并发线程池，在高频争抢中引发严重的 CPU 限流卡顿甚至频繁 OOM，必须升级 JDK 或手动指定 `-XX:ActiveProcessorCount`",
      "面试官常用套路：“如果容器内进程发生了 OOMKilled，是哪个层级触发的，如何排查？”。正确回答：是由 Linux 内核的 OOM-Killer 机制检测到该进程超出了 Cgroups 中限制的内存上限触发的。应通过宿主机 dmesg 命令排查内核日志，不能单靠容器内部日志。"
    ],
    "relatedIds": [
      "interview_040"
    ]
  },
  {
    "id": "interview_docker_k8s_003_overlay2",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "docker_k8s",
    "title": "Docker Overlay2 联合文件系统物理层析",
    "difficulty": 4,
    "frequency": 4,
    "question": "Docker 的镜像分层结构是如何实现的？请结合 `overlay2` 存储驱动的 `lowerdir`、`upperdir`、`merged` 和 `workdir` 详述联合文件系统（UnionFS）的物理挂载与读写写时复制（COW）过程。",
    "answer": {
      "short": "Overlay2 利用 UnionFS 将多个目录联合挂载：`lowerdir` 为只读镜像层，`upperdir` 为可写容器层，`merged` 为用户可见的最终挂载点；读文件时按层由上至下检索；写文件时若修改只读文件，触发 Copy-On-Write，将 lowerdir 文件完整复制一份到 upperdir 供改写，删除则通过创建 whiteout 特殊文件实现遮蔽。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Docker Overlay2 联合文件系统物理层析】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 联合文件系统（UnionFS）物理层析：\n   - Docker 镜像每一层都是宿主机上的一个普通目录，里面包含发生变化的文件。\n   - `overlay2` 驱动利用 Linux 内核的 overlayfs 模块，将这些不同目录的文件合并展示在一个统一虚拟目录中。\n2. Overlay2 核心目录角色拆解：\n   - **`lowerdir`（只读层，镜像层）**：包含所有的基础镜像文件。最底层是 OS rootfs，往上是各层应用。为了节省磁盘，相同的只读镜像层会被宿主机上所有的运行容器共享。\n   - **`upperdir`（读写层，容器层）**：容器启动时创建的专属可写层。容器内所有的增删改文件实体，物理上都保存在这个目录中。\n   - **`merged`（合并挂载层）**：容器进程运行时真正看到的根目录视图。是只读层和可写层按照遮蔽规则合并后的物理挂载呈现点。\n   - **`workdir`（工作中转层）**：OverlayFS 内部使用的辅助目录，在文件写时复制、原子操作时作为临时中转暂存区。\n3. 读写与修改的物理写时复制（COW）链路：\n   - **读文件**：容器读取文件 A。存储驱动从最上层 `upperdir` 往下搜索。若可写层存在，直接读；若不存在，顺着 `lowerdir` 由新到旧往下查找，一旦找到立即返回。读取性能接近原生文件系统。\n   - **修改只读文件（Copy-On-Write）**：容器尝试写入属于只读镜像层的文件 B。\n     - 1. 内核拦截此写请求。\n     - 2. 在底层把该文件 B **完整物理复制一份**到可写层 `upperdir` 中。\n     - 3. 在 `upperdir` 里的副本上执行修改动作，并把修改呈现给 `merged` 层。这导致第一次写入大文件时会发生短时 IO 延迟。\n   - **删除文件（Whiteout）**：容器执行 `rm` 删除属于镜像层的只读文件 C。只读层绝对不允许被篡改。\n     - 驱动会在 `upperdir` 中创建一个名为 `.wh.C` 的特殊 **Whiteout（白洞）字符设备文件**。\n     - 挂载挂载合并时，内核看到 `wh.C`，会主动在 `merged` 呈现中**将该文件隐藏遮蔽**，造成物理上已被删除的假象，设计非常巧妙。",
      "structured": [
        "lowerdir 只读镜像栈：存放只读各层文件。宿主机多容器共享同一份 lower 磁盘，极省存储",
        "upperdir 动态读写口：容器专属存放地。所有新增、改写的实体数据物理落盘在此，容器销毁时直接删除该目录",
        "写时复制（COW）惩罚：修改镜像层大文件时，内核强制进行一次底至顶的完整文件拷贝，首次写入产生短暂 IO 阻塞",
        "Whiteout 白洞遮蔽：删除只读文件不改动底层，仅在 upperdir 放置 `.wh.` 前缀标志，在挂载层实现视觉遮蔽"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Docker 容器不是虚拟机，它只是 Linux 主机上的一个受隔离的普通进程。隔离性依靠 Namespace，资源额度限制依靠 Cgroups。Pod 本质上是共享同一个网络 Namespace 和同一个存储 Volume 的一组紧密协作的普通进程集合。"
    },
    "keyPoints": [
      "overlay2 驱动",
      "lowerdir / upperdir",
      "merged 挂载点",
      "Copy-On-Write 写时复制",
      "Whiteout 字符文件",
      "联合文件系统"
    ],
    "traps": [
      "由于写时复制（COW）在修改镜像层文件时是以**文件为整体单位**进行完整拷贝的（哪怕只修改 1 字节也会拷贝 100MB 文件），所以严禁在容器的可写层执行频繁的大文件日志追加或数据库写盘，高性能数据存储必须挂载 `Volume` 绕过驱动层",
      "面试官常用套路：“如果容器内进程发生了 OOMKilled，是哪个层级触发的，如何排查？”。正确回答：是由 Linux 内核的 OOM-Killer 机制检测到该进程超出了 Cgroups 中限制的内存上限触发的。应通过宿主机 dmesg 命令排查内核日志，不能单靠容器内部日志。"
    ],
    "relatedIds": [
      "interview_docker_k8s_001_namespaces"
    ]
  },
  {
    "id": "interview_docker_k8s_004_etcd_raft",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "docker_k8s",
    "title": "etcd Raft 一致性协议与 MVCC 版本机制",
    "difficulty": 4,
    "frequency": 5,
    "question": "etcd 作为 K8s 唯一的数据基石，是如何通过 Raft 共识协议保证高可用的？它的内部 MVCC（多版本并发控制）和 Lease（租约）机制是如何支持 K8s 声明式 API 的高频 Watch 监听的？",
    "answer": {
      "short": "etcd 通过 Raft 协议达成强一致性共识（Leader 选举、日志复制及过半提交）；MVCC 机制为每次写操作赋予全局递增的版本号（Revision），记录数据历史快照以支持非阻塞的无锁历史查询；Lease 机制将租约生命期与 Keys 绑定；Watch 机制通过监听 Revision 序列，实现了高效的事件主动推送通知。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【etcd Raft 一致性协议与 MVCC 版本机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. etcd 强一致性底座（Raft）：\n   - Raft 协议划分为三步：Leader 选举、日志复制（Log Replication）、安全性保护。\n   - 所有的写请求必须汇聚到 Leader。Leader 将写操作写为 Entry 写入本地预写日志（WAL），并广播给 Followers。\n   - **过半确认提交（Quorum）**：一旦收到过半数节点（如 3 节点中的 2 节点，5 节点中的 3 节点）的确认响应，Leader 将日志标记为 Committed，应用到状态机（bbolt 键值库），并通知 Follower 提交。保障了脑裂防范和脑裂分区自愈。\n2. MVCC 多版本并发控制（无锁读写分离）：\n   - etcd 底层数据结构采用 `bbolt`（一个纯单机 B+ 树 KV 数据库）。\n   - **双索引设计**：\n     - 内存索引（`keyIndex`）：一个基于红黑树的 B-Tree 索引，记录了用户 Key 到其物理存储 Revision（版本号）的历史版本映射。\n     - 磁盘索引（`bbolt`）：以 Revision 作为 Key，真实 KV 数据作为 Value 存储。\n   - **物理优势**：每次修改数据（如修改 Pod 状态），etcd **从不物理覆盖旧值**，而是向磁盘写入一个新的 Revision 条目。这使得 etcd 拥有全局历史快照能力。读取时，可以指定 Revision 读历史版本，无需加全局锁，实现了读写并发非阻塞。\n3. Watch 与 Lease 声明式驱动：\n   - **Watch 监听机制**：K8s 的 Controller 经常需要“监听 Pod 变动”。如果是客户端高频轮询，etcd 瞬间瘫痪。\n   - etcd Watch 基于 MVCC 的 Revision 概念：Controller 告诉 etcd “我目前拿到了 Revision 100，请把 101 及之后的所有变动推给我”。etcd 只需要在 `bbolt` 里顺序扫描 100 之后的 Revision，并通过 HTTP/2 gRPC 流式源源不断推给客户端，极省网络，且保证事件绝无漏掉。\n   - **Lease（租约）机制**：将 un 过期时间 TTL 抽象为 Lease 对象（有独立 ID，定期 KeepAlive 心跳）。把多个 Key 挂接在这个 Lease 上。一旦心跳中断 Lease 过期，挂接的所有 Key 自动级联删除。这正是 K8s Node 节点在线状态、Leader 选举分布式锁的核心底座物理支撑。",
      "structured": [
        "Raft 过半提交：Leader 强制复制 WAL 日志，必须收拢超过 50% 物理节点确认响应才能应用状态机，防止脑裂发生",
        "MVCC Revision 体系：每次变更递增全局版本号 Revision。B+ 树磁盘顺序写入历史快照，实现无锁的读写并发隔离",
        "Watch 序列推送：Controller 凭借 Revision 水水位线发起 gRPC 流监听。etcd 定向推送差额事件，避免盲目轮询拉取",
        "Lease 级联消亡：多 Key 合并绑定租约 ID。依赖统一的 Lease 心跳定时器维持生命，失效瞬间极速级联删除清理"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Docker 容器不是虚拟机，它只是 Linux 主机上的一个受隔离的普通进程。隔离性依靠 Namespace，资源额度限制依靠 Cgroups。Pod 本质上是共享同一个网络 Namespace 和同一个存储 Volume 的一组紧密协作的普通进程集合。"
    },
    "keyPoints": [
      "etcd",
      "Raft 一致性",
      "MVCC 机制",
      "Revision 版本号",
      "Watch 推送",
      "Lease 租约",
      "bbolt"
    ],
    "traps": [
      "由于 MVCC 永远不覆盖旧数据，etcd 的磁盘占用会只增不减，最终会触及 `quota-backend-bytes`（默认 2GB 或 8GB）物理上限引发 etcd 发生全局只读锁定崩溃；必须高频定期执行 `Compact`（压缩历史版本）和 `Defrag`（碎片整理）来释放物理空间",
      "面试官常用套路：“如果容器内进程发生了 OOMKilled，是哪个层级触发的，如何排查？”。正确回答：是由 Linux 内核的 OOM-Killer 机制检测到该进程超出了 Cgroups 中限制的内存上限触发的。应通过宿主机 dmesg 命令排查内核日志，不能单靠容器内部日志。"
    ],
    "relatedIds": [
      "interview_040"
    ]
  }
];

module.exports = questions;
