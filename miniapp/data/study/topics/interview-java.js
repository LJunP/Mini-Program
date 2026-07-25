// interview-java.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_039",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "java",
    "title": "JVM 垃圾回收机制与 G1/ZGC 收集器对比",
    "difficulty": 4,
    "frequency": 5,
    "question": "请系统说明 Java 虚拟机（JVM）的垃圾回收算法？并对比 G1 与 ZGC 垃圾回收器的底层实现机制与停顿时间（STW）控制？",
    "answer": {
      "short": "JVM 垃圾回收核心包括标记-清除、标记-整理、复制算法；G1 将内存划分为 Region 并在 STW 期间进行可预测垃圾收集，而 ZGC 通过染色指针（Colored Pointers）与读屏障（Read Barriers）在并发阶段实现几乎为 0ms（<1ms）的 STW。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【JVM 垃圾回收机制与 G1/ZGC 收集器对比】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【基础算法联想】：JVM 最基础的垃圾定位使用“可达性分析（GC Roots）”，基础算法为复制（多用于新生代）、标记整理与标记清除（多用于老年代）。\n2. 【G1 演进剖析】：G1 颠覆了传统的物理分代，将整个堆内存划分为数千个大小相等的 Region。每个 Region 扮演不同角色（Eden, Survivor, Old, Humongous）。G1 会估算每个 Region 的回收价值与预设 of STW 目标时间，在 STW 内优先回收价值最大的 Region（Garbage First）。\n3. 【ZGC 极致突破分析】：ZGC 追求超低延迟。它的核心武器是染色指针，它把 64 位虚拟地址指针中的高 4 位用于存放 GC 元数据状态（Marked0/Marked1/Remapped）。当应用线程读取对象引用时，JVM 会触发读屏障，检查指针的染色状态。如果发现对象正在被移动，读屏障会利用 Self-Healing（自愈）机制，顺手根据 Forwarding Table 将指针修正并指向新地址。这就使得大量的对象移动操作可以和应用线程完全并发运行，STW 时间缩短到微秒级，且不随堆内存大小而增长。",
      "deepDive": "ZGC 目前已成为现代 Java（JDK 15+）高性能服务抗下大堆（T 级别）垃圾回收的首选。在实战中需要注意：ZGC 的最大吞吐量相比于 Parallel GC 或吞吐量优先的回收器有 10% 左右的微弱下降，因为并发阶段的读屏障和对象转移会消耗额外的 CPU 时间和总线带宽。\n\n【底层机制/并发安全】：Java 中的 volatile 关键字提供可见性与禁止指令重排序，底层实现是通过插入内存屏障，防止 CPU 乱序执行。HashMap 在 JDK 8 底层是数组+链表+红黑树。其扩容过程在多线程下虽然不会发生 JDK 1.7 的死锁，但由于操作不是原子性的，依然会发生严重数据覆盖丢失。",
      "structured": [
        "基础划分：分代收集理论，新生代多用复制算法，老年代多用整理/清除",
        "G1 架构：Region 分区化理念，根据预设的 STW 目标优先收集高收益垃圾分区",
        "ZGC 机制：染色指针将 GC 元数据直接标记在指针的高位中，省去额外标记位置",
        "读屏障自愈：当线程解引用被移动对象时，读屏障拦截并自愈指针为新地址，实现并发复制，STW 降至 1ms 内"
      ]
    },
    "keyPoints": [
      "G1 收集器",
      "ZGC",
      "染色指针",
      "读屏障",
      "STW 控制",
      "可达性分析"
    ],
    "traps": [
      "ZGC 在 JDK 16 之前是不支持分代的（Non-generational），这在创建大量短生命周期对象的场景下会产生内存分配速率跟不上回收速率的 allocation stall 问题",
      "HashMap 为什么在链表长度大于 8 时才转红黑树？正确回答：因为基于泊松分布概率统计，在哈希函数健康的情况下，同一个槽位上链表长度达到 8 的概率低于千万分之六。设置 8 既防范了恶意 Hash 碰撞攻击，又避免了频繁转换的计算开销。"
    ],
    "relatedIds": [
      "interview_023",
      "interview_034"
    ]
  },
  {
    "id": "interview_043",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "backend",
    "topic": "java",
    "title": "Java HashMap 底层扩容机制与红黑树转换",
    "difficulty": 3,
    "frequency": 4,
    "question": "Java 中 HashMap 的底层哈希表结构是怎样的？在 JDK 8 中是如何进行扩容（Rehash）和从链表转换为红黑树的？",
    "answer": {
      "short": "JDK 8 HashMap 基于数组 + 链表 + 红黑树实现；当链表长度达到 8 且数组总长度达到 64 时将链表转化为红黑树以优化查询，扩容时采用高低位指针对链表元素进行巧妙的二次幂分配以避免数据重新 Hash 冲突。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Java HashMap 底层扩容机制与红黑树转换】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【基础数据结构】：HashMap 内部是一个 Node 数组。定位 key 通过 (n - 1) & hash 定位桶位置。\n2. 【树化边界】：为什么是 8 转换？根据泊松分布，在负载因子 0.75 下，哈希冲突使同一个桶内链表长度达到 8 的概率仅为千万分之六。设置 8 树化既保障了极端冲突下的性能退化（链表 O(n) -> 树 O(log n)），又避免了频繁树化（红黑树节点占用空间是链表两倍，且树维护开销大）。树化前提是数组长度 >= 64，若长度 < 64 则优先通过 resize() 扩容解决。\n3. 【扩容 Rehash 的巧妙设计】：JDK 8 扩容时数组长度翻倍。由于长度是 2 的次幂，元素 Rehash 后的位置只可能在：当前位置，或者当前位置 + 老数组长度。通过判断 hash & oldCap 的值是 0 还是 1，可以将链表分成高位和低位两个子链表，高低位链表一次性挂接到新数组的相应位置，完全不需要重新计算 hash 值，避免了 JDK 7 扩容时多线程并发产生的循环链表死锁问题。",
      "deepDive": "HashMap 不是线程安全的，在高并发多线程写操作下，推荐使用 ConcurrentHashMap。ConcurrentHashMap 在 JDK 8 中弃用了 JDK 7 的 Segment 分段锁机制，直接采用 Node 数组 + CAS 操作 + synchronized 实现行级细粒度加锁，在保障并发安全的同时极大地提升了读写吞吐量。\n\n【底层机制/并发安全】：Java 中的 volatile 关键字提供可见性与禁止指令重排序，底层实现是通过插入内存屏障，防止 CPU 乱序执行。HashMap 在 JDK 8 底层是数组+链表+红黑树。其扩容过程在多线程下虽然不会发生 JDK 1.7 的死锁，但由于操作不是原子性的，依然会发生严重数据覆盖丢失。",
      "structured": [
        "结构演变：数组 + 链表，链表超 8 且数组超 64 自动重构为红黑树优化时间复杂度为 O(log n)",
        "树化权衡：利用泊松分布的千万分之六概率上限设计，取得空间（树比链表大一倍）与时间的平衡点",
        "扩容设计：翻倍扩容，利用 hash & oldCap 判断新高低位（0/1），高低链表挂接，省去 rehash 重算",
        "安全替换：HashMap 线程不安全，并发下需要替换为行级 CAS+Synchronized 锁的 ConcurrentHashMap"
      ]
    },
    "keyPoints": [
      "HashMap",
      "JDK 8 树化",
      "泊松分布",
      "红黑树",
      "高低位扩容",
      "ConcurrentHashMap"
    ],
    "traps": [
      "HashMap 扩容在多线程下会导致数据覆盖或死循环（JDK 7 头部插入法引起的），生产环境中千万不要多线程共用 HashMap",
      "HashMap 为什么在链表长度大于 8 时才转红黑树？正确回答：因为基于泊松分布概率统计，在哈希函数健康的情况下，同一个槽位上链表长度达到 8 的概率低于千万分之六。设置 8 既防范了恶意 Hash 碰撞攻击，又避免了频繁转换的计算开销。"
    ],
    "relatedIds": [
      "interview_008",
      "interview_039"
    ]
  },
  {
    "id": "interview_java_003",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "java",
    "title": "JVM 内存区域划分及作用",
    "difficulty": 2,
    "frequency": 5,
    "question": "请详细说明 Java 虚拟机（JVM）运行时数据区（Runtime Data Area）的划分为哪些部分？哪些是线程私有的，哪些是线程共享的？",
    "answer": {
      "short": "JVM 运行时数据区划分为：堆、方法区（线程共享）以及虚拟机栈、本地方法栈、程序计数器（线程私有）。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【JVM 内存区域划分及作用】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 共享与私有：堆（Heap）与方法区（Method Area/元空间）是所有线程共享的，主要用于存放对象和类元数据；栈与程序计数器（PC）是线程私有的，用于维护方法调用上下文和指令地址。\n2. 结构详解：\n   - **虚拟机栈（JVM Stack）**：由一个个栈帧（Stack Frame）组成，包含局部变量表、操作数栈、动态链接、方法出口。栈溢出会报 StackOverflowError，栈空间申请不到内存会报 OOM。\n   - **堆（Heap）**：JVM 中最大的一块，存放几乎所有的对象实例及数组，是 GC 的主战场。\n   - **方法区/元空间（Metaspace）**：存放类信息、常量、静态变量、编译后的代码。JDK 8 之后将永久代（PermGen）替换为元空间，直接使用本地物理内存。",
      "deepDive": "在 JVM 调优中，通常用 `-Xms` 和 `-Xmx` 锁死堆内存大小（避免运行时动态扩容导致的垃圾回收卡顿）；使用 `-XX:MaxMetaspaceSize` 限制元空间大小，防止因为类加载过多（如动态代理或反射过多）导致宿主机物理内存彻底耗尽发生 OOM。\n\n【底层机制/并发安全】：Java 中的 volatile 关键字提供可见性与禁止指令重排序，底层实现是通过插入内存屏障，防止 CPU 乱序执行。HashMap 在 JDK 8 底层是数组+链表+红黑树。其扩容过程在多线程下虽然不会发生 JDK 1.7 的死锁，但由于操作不是原子性的，依然会发生严重数据覆盖丢失。",
      "structured": [
        "程序计数器（PC）：线程私有。记录当前线程正在执行的字节码指令地址，唯一不会 OOM 的区域",
        "虚拟机栈（Stack）：线程私有。每个方法调用对应一个栈帧，存放局部变量表和操作数栈",
        "本地方法栈：线程私有。专门为 JVM 调用 Native 方法服务，结构与虚拟机栈类似",
        "堆（Heap）：线程共享。存放所有新创建的对象，是垃圾回收（GC）的最核心的管理物理区域",
        "方法区/元空间：线程共享。JDK 8 起使用本地内存做 Metaspace，存储被装载的 Class 元数据"
      ]
    },
    "keyPoints": [
      "运行时数据区",
      "虚拟机栈",
      "堆内存 Heap",
      "方法区 Metaspace",
      "程序计数器",
      "线程私有/共享"
    ],
    "traps": [
      "很多开发者认为方法区就是永久代，其实永久代只是 HotSpot 虚拟机在 JDK 8 之前对方法区的一种实现方式，现在已经被完全移除，改为了元空间",
      "HashMap 为什么在链表长度大于 8 时才转红黑树？正确回答：因为基于泊松分布概率统计，在哈希函数健康的情况下，同一个槽位上链表长度达到 8 的概率低于千万分之六。设置 8 既防范了恶意 Hash 碰撞攻击，又避免了频繁转换的计算开销。"
    ],
    "relatedIds": [
      "interview_039"
    ]
  },
  {
    "id": "interview_java_004",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "java",
    "title": "Java 类加载机制与双亲委派模型",
    "difficulty": 3,
    "frequency": 5,
    "question": "什么是 Java 的类加载机制？请详细说明双亲委派模型（Parent Delegation Model）的工作原理及其价值。",
    "answer": {
      "short": "类加载是指将 Class 文件读入内存并进行校验、准备、解析和初始化的过程；双亲委派模型要求类加载器收到加载请求时，先委派给父类加载器处理，父类加载器无法加载时子加载器才尝试自己加载，这保障了核心 Java API 不被篡改且避免了类的重复加载。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Java 类加载机制与双亲委派模型】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 阶段：加载（Loading）、连接（Verification, Preparation, Resolution）、初始化（Initialization）。\n2. 委派层次：Bootstrap ClassLoader（引导类，加载 rt.jar） -> Extension ClassLoader（扩展类，加载 lib/ext） -> Application ClassLoader（应用类，加载 classpath） -> Custom ClassLoader（自定义类加载器）。\n3. 工作流：当 AppClassLoader 收到加载类请求时，它先把请求提交给 ExtClassLoader，ExtClassLoader 又委派给 BootstrapClassLoader。BootstrapClassLoader 在它的搜索范围内寻找，找不到后 ExtClassLoader 才在自己范围内找，也找不到，AppClassLoader 才会尝试在 classpath 下自己加载。保证了安全性与唯一性。",
      "structured": [
        "三大步骤：加载（读入二进制） -> 连接（验证安全性、准备静态变量、符号解析） -> 初始化（执行类构造器 <clinit>）",
        "四层架构：Bootstrap（根，C++实现） -> Ext（扩展） -> App（应用） -> Custom（自定义类加载器）",
        "自下而上委派：子加载器收到请求，优先委派给父类加载器，层层上推，最终推至顶层 Bootstrap",
        "自上而下加载：如果父类加载器在其管辖路径下找不到目标类，才反馈给子类加载器，由子加载器自行尝试解析"
      ],
      "deepDive": "\n\n【底层机制/并发安全】：Java 中的 volatile 关键字提供可见性与禁止指令重排序，底层实现是通过插入内存屏障，防止 CPU 乱序执行。HashMap 在 JDK 8 底层是数组+链表+红黑树。其扩容过程在多线程下虽然不会发生 JDK 1.7 的死锁，但由于操作不是原子性的，依然会发生严重数据覆盖丢失。"
    },
    "keyPoints": [
      "类加载过程",
      "双亲委派模型",
      "BootstrapClassLoader",
      "AppClassLoader",
      "类隔离",
      "初始化 clinit"
    ],
    "traps": [
      "在类加载的准备（Preparation）阶段，静态变量仅会被初始化为系统默认零值（如 0/null），真正的程序员赋予的初始值是在“初始化（Initialization）”阶段通过执行 `<clinit>` 字节码才被赋值的",
      "HashMap 为什么在链表长度大于 8 时才转红黑树？正确回答：因为基于泊松分布概率统计，在哈希函数健康的情况下，同一个槽位上链表长度达到 8 的概率低于千万分之六。设置 8 既防范了恶意 Hash 碰撞攻击，又避免了频繁转换的计算开销。"
    ],
    "relatedIds": [
      "interview_java_003"
    ]
  },
  {
    "id": "interview_java_005",
    "mode": "study",
    "domain": "interview",
    "type": "follow_up",
    "track": "backend",
    "topic": "java",
    "title": "打破双亲委派模型及实战场景",
    "difficulty": 4,
    "frequency": 4,
    "question": "（追问）在什么场景下我们需要打破双亲委派模型？请结合 JDBC SPI 和 Tomcat Web 容器的类加载器设计进行分析。",
    "answer": {
      "short": "打破双亲委派是为了实现“逆向委派”或“类版本隔离”；JDBC SPI 通过线程上下文类加载器（Thread Context ClassLoader）让 BootstrapClassLoader 能加载 classpath 下的第三方数据库驱动类；Tomcat 则是为每个 Web 应用分配独立的 WebappClassLoader，优先加载 Web 自身的 class，以实现多应用间同名类不同版本的物理隔离。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【打破双亲委派模型及实战场景】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 打破契机：\n   - **契机一：底向上逆向加载（SPI）**。基础类（Bootstrap）需要调用第三方提供的实现类（如 Driver 接口与 MySQL Driver 实现）。BootstrapClassLoader 无法看到 Classpath 下的代码。为了打破这个限制，Java 引入了 `Thread.currentThread().getContextClassLoader()`，让父类加载器能找子类加载器借用加载能力。\n   - **契机二：版本隔离（Tomcat）**。Tomcat 作为一个容器，可以部署两个 Spring 应用。应用 A 依赖 Spring 4.0，应用 B 依赖 Spring 5.0。如果遵守双亲委派，父加载器只会加载一份 Spring 类，导致另一个应用直接崩溃。Tomcat 设计了 `WebappClassLoader`，它的加载规则是：**优先在自己目录下找类加载，找不到才委派给 SharedClassLoader 和 SystemClassLoader**。这打破了双亲委派的委派顺序，实现了完美的类空间隔离。",
      "structured": [
        "SPI 打破原理：利用线程上下文类加载器（TCCL），在父加载器管理的 JDK 核心库中，逆向委托子加载器去 classpath 中装载驱动",
        "Tomcat 隔离树：WebappClassLoader 打破规则。不先往上推，而是优先自己找类，隔离了不同应用的依赖库版本",
        "Tomcat 共享机制：Tomcat 设计了 SharedClassLoader 共享公共库，CommonClassLoader 加载容器自身类，多层级协作",
        "打破核心API：重写 `ClassLoader.loadClass(String name, boolean resolve)` 方法逻辑，破坏原有的先委派后加载流程"
      ],
      "deepDive": "\n\n【底层机制/并发安全】：Java 中的 volatile 关键字提供可见性与禁止指令重排序，底层实现是通过插入内存屏障，防止 CPU 乱序执行。HashMap 在 JDK 8 底层是数组+链表+红黑树。其扩容过程在多线程下虽然不会发生 JDK 1.7 的死锁，但由于操作不是原子性的，依然会发生严重数据覆盖丢失。"
    },
    "keyPoints": [
      "打破双亲委派",
      "TCCL 上下文类加载器",
      "Tomcat 类加载器",
      "WebappClassLoader",
      "JDBC SPI",
      "loadClass 重写"
    ],
    "traps": [
      "打破双亲委派不代表可以覆盖核心类。如果尝试自定义一个名为 `java.lang.String` 的类并用自定义类加载器强制 load，JVM 在 `defineClass` 时会直接抛出 `SecurityException` 阻止加载，因为沙箱安全模型不允许加载以 java. 开头的核心包",
      "HashMap 为什么在链表长度大于 8 时才转红黑树？正确回答：因为基于泊松分布概率统计，在哈希函数健康的情况下，同一个槽位上链表长度达到 8 的概率低于千万分之六。设置 8 既防范了恶意 Hash 碰撞攻击，又避免了频繁转换的计算开销。"
    ],
    "relatedIds": [
      "interview_java_004"
    ]
  }
];

module.exports = questions;
