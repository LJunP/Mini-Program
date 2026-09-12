const fs = require('fs');
const path = require('path');

const originalQuestions = [
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
      "thinkingProcess": "1. 【基础算法联想】：JVM 最基础的垃圾定位使用“可达性分析（GC Roots）”，基础算法为复制（多用于新生代）、标记整理与标记清除（多用于老年代）。\n2. 【G1 演进剖析】：G1 颠覆了传统的物理分代，将整个堆内存划分为数千个大小相等的 Region。每个 Region 扮演不同角色（Eden, Survivor, Old, Humongous）。G1 会估算每个 Region 的回收价值与预设 of STW 目标时间，在 STW 内优先回收价值最大的 Region（Garbage First）。\n3. 【ZGC 极致突破分析】：ZGC 追求超低延迟。它的核心武器是染色指针，它把 64 位虚拟地址指针中的高 4 位用于存放 GC 元数据状态（Marked0/Marked1/Remapped）。当应用线程读取对象引用时，JVM 会触发读屏障，检查指针的染色状态。如果发现对象正在被移动，读屏障会利用 Self-Healing（自愈）机制，顺手根据 Forwarding Table 将指针修正并指向新地址。这就使得大量的对象移动操作可以和应用线程完全并发运行，STW 时间缩短到微秒级，且不随堆内存大小而增长。",
      "deepDive": "ZGC 目前已成为现代 Java（JDK 15+）高性能服务抗下大堆（T 级别）垃圾回收的首选。在实战中需要注意：ZGC 的最大吞吐量相比于 Parallel GC 或吞吐量优先的回收器有 10% 左右的微弱下降，因为并发阶段的读屏障和对象转移会消耗额外的 CPU 时间和总线带宽。",
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
      "ZGC 在 JDK 16 之前是不支持分代的（Non-generational），这在创建大量短生命周期对象的场景下会产生内存分配速率跟不上回收速率的 allocation stall 问题"
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
      "thinkingProcess": "1. 【基础数据结构】：HashMap 内部是一个 Node 数组。定位 key 通过 (n - 1) & hash 定位桶位置。\n2. 【树化边界】：为什么是 8 转换？根据泊松分布，在负载因子 0.75 下，哈希冲突使同一个桶内链表长度达到 8 的概率仅为千万分之六。设置 8 树化既保障了极端冲突下的性能退化（链表 O(n) -> 树 O(log n)），又避免了频繁树化（红黑树节点占用空间是链表两倍，且树维护开销大）。树化前提是数组长度 >= 64，若长度 < 64 则优先通过 resize() 扩容解决。\n3. 【扩容 Rehash 的巧妙设计】：JDK 8 扩容时数组长度翻倍。由于长度是 2 的次幂，元素 Rehash 后的位置只可能在：当前位置，或者当前位置 + 老数组长度。通过判断 hash & oldCap 的值是 0 还是 1，可以将链表分成高位和低位两个子链表，高低位链表一次性挂接到新数组的相应位置，完全不需要重新计算 hash 值，避免了 JDK 7 扩容时多线程并发产生的循环链表死锁问题。",
      "deepDive": "HashMap 不是线程安全的，在高并发多线程写操作下，推荐使用 ConcurrentHashMap。ConcurrentHashMap 在 JDK 8 中弃用了 JDK 7 的 Segment 分段锁机制，直接采用 Node 数组 + CAS 操作 + synchronized 实现行级细粒度加锁，在保障并发安全的同时极大地提升了读写吞吐量。",
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
      "HashMap 扩容在多线程下会导致数据覆盖或死循环（JDK 7 头部插入法引起的），生产环境中千万不要多线程共用 HashMap"
    ],
    "relatedIds": [
      "interview_008",
      "interview_039"
    ]
  }
];

const segment1 = [
  {
    id: "interview_java_003",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "JVM 内存区域划分及作用",
    difficulty: 2,
    frequency: 5,
    question: "请详细说明 Java 虚拟机（JVM）运行时数据区（Runtime Data Area）的划分为哪些部分？哪些是线程私有的，哪些是线程共享的？",
    answer: {
      short: "JVM 运行时数据区划分为：堆、方法区（线程共享）以及虚拟机栈、本地方法栈、程序计数器（线程私有）。",
      thinkingProcess: "1. 共享与私有：堆（Heap）与方法区（Method Area/元空间）是所有线程共享的，主要用于存放对象和类元数据；栈与程序计数器（PC）是线程私有的，用于维护方法调用上下文和指令地址。\n2. 结构详解：\n   - **虚拟机栈（JVM Stack）**：由一个个栈帧（Stack Frame）组成，包含局部变量表、操作数栈、动态链接、方法出口。栈溢出会报 StackOverflowError，栈空间申请不到内存会报 OOM。\n   - **堆（Heap）**：JVM 中最大的一块，存放几乎所有的对象实例及数组，是 GC 的主战场。\n   - **方法区/元空间（Metaspace）**：存放类信息、常量、静态变量、编译后的代码。JDK 8 之后将永久代（PermGen）替换为元空间，直接使用本地物理内存。",
      deepDive: "在 JVM 调优中，通常用 `-Xms` 和 `-Xmx` 锁死堆内存大小（避免运行时动态扩容导致的垃圾回收卡顿）；使用 `-XX:MaxMetaspaceSize` 限制元空间大小，防止因为类加载过多（如动态代理或反射过多）导致宿主机物理内存彻底耗尽发生 OOM。",
      structured: [
        "程序计数器（PC）：线程私有。记录当前线程正在执行的字节码指令地址，唯一不会 OOM 的区域",
        "虚拟机栈（Stack）：线程私有。每个方法调用对应一个栈帧，存放局部变量表和操作数栈",
        "本地方法栈：线程私有。专门为 JVM 调用 Native 方法服务，结构与虚拟机栈类似",
        "堆（Heap）：线程共享。存放所有新创建的对象，是垃圾回收（GC）的最核心的管理物理区域",
        "方法区/元空间：线程共享。JDK 8 起使用本地内存做 Metaspace，存储被装载的 Class 元数据"
      ]
    },
    keyPoints: ["运行时数据区", "虚拟机栈", "堆内存 Heap", "方法区 Metaspace", "程序计数器", "线程私有/共享"],
    traps: ["很多开发者认为方法区就是永久代，其实永久代只是 HotSpot 虚拟机在 JDK 8 之前对方法区的一种实现方式，现在已经被完全移除，改为了元空间"],
    relatedIds: ["interview_039"]
  },
  {
    id: "interview_java_004",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java 类加载机制与双亲委派模型",
    difficulty: 3,
    frequency: 5,
    question: "什么是 Java 的类加载机制？请详细说明双亲委派模型（Parent Delegation Model）的工作原理及其价值。",
    answer: {
      short: "类加载是指将 Class 文件读入内存并进行校验、准备、解析和初始化的过程；双亲委派模型要求类加载器收到加载请求时，先委派给父类加载器处理，父类加载器无法加载时子加载器才尝试自己加载，这保障了核心 Java API 不被篡改且避免了类的重复加载。",
      thinkingProcess: "1. 阶段：加载（Loading）、连接（Verification, Preparation, Resolution）、初始化（Initialization）。\n2. 委派层次：Bootstrap ClassLoader（引导类，加载 rt.jar） -> Extension ClassLoader（扩展类，加载 lib/ext） -> Application ClassLoader（应用类，加载 classpath） -> Custom ClassLoader（自定义类加载器）。\n3. 工作流：当 AppClassLoader 收到加载类请求时，它先把请求提交给 ExtClassLoader，ExtClassLoader 又委派给 BootstrapClassLoader。BootstrapClassLoader 在它的搜索范围内寻找，找不到后 ExtClassLoader 才在自己范围内找，也找不到，AppClassLoader 才会尝试在 classpath 下自己加载。保证了安全性与唯一性。",
      structured: [
        "三大步骤：加载（读入二进制） -> 连接（验证安全性、准备静态变量、符号解析） -> 初始化（执行类构造器 <clinit>）",
        "四层架构：Bootstrap（根，C++实现） -> Ext（扩展） -> App（应用） -> Custom（自定义类加载器）",
        "自下而上委派：子加载器收到请求，优先委派给父类加载器，层层上推，最终推至顶层 Bootstrap",
        "自上而下加载：如果父类加载器在其管辖路径下找不到目标类，才反馈给子类加载器，由子加载器自行尝试解析"
      ]
    },
    keyPoints: ["类加载过程", "双亲委派模型", "BootstrapClassLoader", "AppClassLoader", "类隔离", "初始化 clinit"],
    traps: ["在类加载的准备（Preparation）阶段，静态变量仅会被初始化为系统默认零值（如 0/null），真正的程序员赋予的初始值是在“初始化（Initialization）”阶段通过执行 `<clinit>` 字节码才被赋值的"],
    relatedIds: ["interview_java_003"]
  },
  {
    id: "interview_java_005",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "打破双亲委派模型及实战场景",
    difficulty: 4,
    frequency: 4,
    question: "（追问）在什么场景下我们需要打破双亲委派模型？请结合 JDBC SPI 和 Tomcat Web 容器的类加载器设计进行分析。",
    answer: {
      short: "打破双亲委派是为了实现“逆向委派”或“类版本隔离”；JDBC SPI 通过线程上下文类加载器（Thread Context ClassLoader）让 BootstrapClassLoader 能加载 classpath 下的第三方数据库驱动类；Tomcat 则是为每个 Web 应用分配独立的 WebappClassLoader，优先加载 Web 自身的 class，以实现多应用间同名类不同版本的物理隔离。",
      thinkingProcess: "1. 打破契机：\n   - **契机一：底向上逆向加载（SPI）**。基础类（Bootstrap）需要调用第三方提供的实现类（如 Driver 接口与 MySQL Driver 实现）。BootstrapClassLoader 无法看到 Classpath 下的代码。为了打破这个限制，Java 引入了 `Thread.currentThread().getContextClassLoader()`，让父类加载器能找子类加载器借用加载能力。\n   - **契机二：版本隔离（Tomcat）**。Tomcat 作为一个容器，可以部署两个 Spring 应用。应用 A 依赖 Spring 4.0，应用 B 依赖 Spring 5.0。如果遵守双亲委派，父加载器只会加载一份 Spring 类，导致另一个应用直接崩溃。Tomcat 设计了 `WebappClassLoader`，它的加载规则是：**优先在自己目录下找类加载，找不到才委派给 SharedClassLoader 和 SystemClassLoader**。这打破了双亲委派的委派顺序，实现了完美的类空间隔离。",
      structured: [
        "SPI 打破原理：利用线程上下文类加载器（TCCL），在父加载器管理的 JDK 核心库中，逆向委托子加载器去 classpath 中装载驱动",
        "Tomcat 隔离树：WebappClassLoader 打破规则。不先往上推，而是优先自己找类，隔离了不同应用的依赖库版本",
        "Tomcat 共享机制：Tomcat 设计了 SharedClassLoader 共享公共库，CommonClassLoader 加载容器自身类，多层级协作",
        "打破核心API：重写 `ClassLoader.loadClass(String name, boolean resolve)` 方法逻辑，破坏原有的先委派后加载流程"
      ]
    },
    keyPoints: ["打破双亲委派", "TCCL 上下文类加载器", "Tomcat 类加载器", "WebappClassLoader", "JDBC SPI", "loadClass 重写"],
    traps: ["打破双亲委派不代表可以覆盖核心类。如果尝试自定义一个名为 `java.lang.String` 的类并用自定义类加载器强制 load，JVM 在 `defineClass` 时会直接抛出 `SecurityException` 阻止加载，因为沙箱安全模型不允许加载以 java. 开头的核心包"],
    relatedIds: ["interview_java_004"]
  },
  {
    id: "interview_java_006",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "Java 对象的内存布局细节",
    difficulty: 4,
    frequency: 4,
    question: "Java 对象在堆内存中是如何存储的？请详细分析对象头（Object Header）的结构及其在并发锁状态下的变化规律。",
    answer: {
      short: "Java 对象内存布局包含：对象头（Object Header）、实例数据（Instance Data）和对齐填充（Padding）；对象头主要由 Mark Word（存储哈希码、GC分代年龄、锁标记位）和 Klass Word（类型指针，指向方法区类元数据）组成，开启指针压缩时 Klass Word 会从 8 字节降为 4 字节。",
      thinkingProcess: "1. 布局大纲：对象头（Header） + 实例数据（Instance Data） + 对齐填充（Padding，为了 8 字节对齐）。\n2. 对象头细化：\n   - **Mark Word**（64位系统下占 8 字节）：存放对象自身运行时数据。它的锁标记位结构是重点：\n     - 无锁状态：001（分代年龄 4bit，HashCode 31bit）\n     - 偏向锁：101（ThreadID 54bit，Epoch 2bit，分代年龄 4bit）\n     - 轻量级锁：000（指向栈中锁记录 Lock Record 的指针）\n     - 重量级锁：010（指向互斥量 Monitor 监视器的指针）\n     - GC标记：011\n   - **Klass Word**：指向元空间的指针，判断对象是哪个 Class 实例。开启 `-XX:+UseCompressedClassPointers` 压缩为 4 字节。\n   - **数组长度**：如果是数组对象，对象头还会多出 4 字节记录数组长度。",
      structured: [
        "对象头（Header）：包含 Mark Word（8字节）和 Klass Pointer（类型指针，4或8字节，视是否开启压缩而定）",
        "Mark Word 锁切换：锁升级的关键地带。利用最后 2bit 的锁标记位在偏向锁、轻量锁、重量锁及无锁间弹性切换状态",
        "实例数据（Data）：存储对象中定义的各种变量和字段内容，包括从父类继承下来的属性",
        "对齐填充（Padding）：占位符。JVM 要求对象起始物理地址必须是 8 字节的整数倍，不足 8 字节则填充补全"
      ]
    },
    keyPoints: ["对象内存布局", "Mark Word", "Klass Pointer", "对齐填充 Padding", "锁升级标志", "指针压缩"],
    traps: ["因为 JVM 要求 8 字节对齐，所以即使是一个空对象（只有 8字节 Mark Word 和 4字节 Klass 指针，共 12 字节），它在堆中实际占用的空间也是 16 字节（Padding 填充了 4 字节）"],
    relatedIds: ["interview_java_003"]
  },
  {
    id: "interview_java_007",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java 四大引用类型及 ReferenceQueue 用法",
    difficulty: 3,
    frequency: 4,
    question: "请对比 Java 中的强引用、软引用、弱引用和虚引用。并说明虚引用为什么必须配合引用队列（ReferenceQueue）使用？",
    answer: {
      short: "强引用在任何时候都不会被 GC 回收；软引用在系统内存不足时会被回收；弱引用在下一次 GC 时会被无条件回收；虚引用不对生存时间产生任何影响，必须配合引用队列（ReferenceQueue）使用，在对象被垃圾回收器回收时收到系统通知以安全释放堆外内存。",
      thinkingProcess: "1. 对比：\n   - 强引用（Strong）：Object obj = new Object()。即便 OOM 也不回收。\n   - 软引用（Soft）：SoftReference。用于实现内存敏感的缓存（如图片缓存）。内存够不收，不够就收。\n   - 弱引用（Weak）：WeakReference。WeakHashMap 原理。GC 扫过发现就收。\n   - 虚引用（Phantom）：PhantomReference。get() 永远返回 null。无法通过虚引用获取对象实例。\n2. ReferenceQueue 价值：当垃圾回收器准备回收一个对象时，如果发现它还有虚引用，就会在回收对象后，将这个虚引用加入到与之关联的引用队列中。应用线程可以通过监控该队列（通常在堆外内存 DirectByteBuffer 的 Cleaner 线程中），判断对应的 Java 对象是否已经被 GC，从而安全地回收分配给该对象的物理堆外内存（避免内存泄漏）。",
      structured: [
        "强引用（Strong）：普通的赋值引用。只要强引用存在，GC Roots 可达，垃圾回收器永远不回收",
        "软引用（Soft）：垃圾回收缓冲。堆内存面临耗尽时触发回收，适合构建读频繁的临时性缓存",
        "弱引用（Weak）：短命引用。下一次 GC 时无论内存是否足够，只要扫描到该弱引用，无条件回收",
        "虚引用与引用队列：不对生命周期构成任何干扰，GC 回收后自动放入 ReferenceQueue，用于追踪并安全释放物理堆外内存"
      ]
    },
    keyPoints: ["强/软/弱/虚引用", "ReferenceQueue", "内存泄漏", "堆外内存", "DirectByteBuffer", "Cleaner 线程"],
    traps: ["在写软引用代码时，千万不要把软引用包装的对象又赋值给了一个局部强引用变量（如 `Object real = softRef.get()`），这会导致在该局部变量作用域内，该对象因为强引用的存在而无法在内存紧张时被回收，使软引用失效"],
    relatedIds: ["interview_039"]
  },
  {
    id: "interview_java_008",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "ThreadLocal 原理与内存泄漏防范",
    difficulty: 3,
    frequency: 5,
    question: "ThreadLocal 的工作原理是怎样的？为什么 ThreadLocalMap 中的 Key 必须设计为弱引用？在什么情况下会导致内存泄漏（Memory Leak）？如何彻底预防？",
    answer: {
      short: "ThreadLocal 通过在每个线程（Thread）内部维护一个专属的 ThreadLocalMap 从而实现线程间数据隔离；Key 设计为弱引用是为了让 ThreadLocal 实例在外部被置 null 后能被 GC 回收；但因为 Value 是强引用，若线程不退出且不调用 remove()，会导致 Entry 的 Value 无法回收造成内存泄漏；预防手段是每次使用完毕后务必显式执行 remove()。",
      thinkingProcess: "1. 核心图解：每个 Thread 对象里都有一个 `threadLocals` 字段，指向 ThreadLocalMap。\n   ThreadLocalMap 内部是一个 Entry 数组，Entry 的 Key 是 ThreadLocal 对象的弱引用（WeakReference<ThreadLocal<?>>），Value 是绑定的真实变量值。\n2. 为什么 Key 用弱引用：如果 Key 是强引用，一旦外部的 ThreadLocal 变量被置 null 了，但因为线程里的 ThreadLocalMap 还持有该 ThreadLocal 的强引用，会导致 ThreadLocal 对象永远无法回收。用弱引用后，GC 能自动把 Key 回收（此时 Key 变为 null）。\n3. 内存泄漏成因：Key 虽然变成了 null，但 Value 还在（强引用 `Entry.value -> Object`）。如果该线程是线程池里的常驻线程（如 Tomcat 线程池），生命周期极长，那么这个 null 对应的 Value 就会一直存在于堆中，发生内存泄漏。\n4. 彻底解决：用完后，强制调用 `threadLocal.remove()`。JVM 会定位到当前线程的 Map 并物理删除对应的 Entry 节点节点。",
      structured: [
        "物理绑定：每个 Thread 内部独立持有一个 ThreadLocalMap 表，通过 ThreadLocal 实例作为 key 读写专属私有数据",
        "弱引用 Key 设计：当外部对 ThreadLocal 的强引用断开后，GC 运行能自动将 Map 中对应的 WeakReference Key 置 null 释放",
        "泄漏导火索（Value 强持）：Key 变 null 但 Entry.value 的强引用依旧悬空挂在常驻线程的 Thread 对象上，造成空间无法回收",
        "终极闭环（remove）：由于线程池线程被循环复用，必须在请求拦截器/AOP切面执行 finally { threadLocal.remove() } 清空数据"
      ]
    },
    keyPoints: ["ThreadLocal", "ThreadLocalMap", "弱引用 Key", "内存泄漏", "线程池复用危害", "remove 释放"],
    traps: ["如果在 SpringBoot 的 Controller 接口中使用了 ThreadLocal 传递用户信息且没有 remove，由于 Tomcat 线程池会循环复用该线程，会导致下一个无辜用户的请求随机读取到上一个用户的残留数据，造成严重的安全生产事故"],
    relatedIds: ["interview_java_007"]
  },
  {
    id: "interview_java_009",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java 线程池 ThreadPoolExecutor 核心机制",
    difficulty: 3,
    frequency: 5,
    question: "请列举 ThreadPoolExecutor 核心线程池的 7 个构造参数。当新任务提交时，线程池内部的工作流程是怎样的？常见的拒绝策略有哪些？",
    answer: {
      short: "7参数包含：corePoolSize（核心线程数）、maximumPoolSize（最大线程数）、keepAliveTime（空闲线程存活时间）、unit（时间单位）、workQueue（工作/阻塞队列）、threadFactory（线程工厂）和 handler（拒绝策略）；新任务提交时：优先给核心线程执行 -> 核心满则推入工作队列 -> 队列满则开辟非核心线程 -> 达到最大线程数且队列仍满则触发拒绝策略。",
      thinkingProcess: "1. 7参数：\n   - corePoolSize：常驻线程数。\n   - maximumPoolSize：最大能容纳的线程数。\n   - keepAliveTime / unit：非核心线程空闲多久后销毁。\n   - workQueue：存放等待执行任务的阻塞队列（如 LinkedBlockingQueue）。\n   - threadFactory：用于创建线程，规范线程名。\n   - handler：拒绝策略。\n2. 执行流程：核心未满创核心线程 -> 核心已满塞入阻塞队列 -> 队列塞满且未超最大线程开辟非核心线程 -> 超出最大线程调用拒绝策略。\n3. 四大拒绝策略：\n   - AbortPolicy（默认）：直接抛 RejectedExecutionException 异常。\n   - CallerRunsPolicy：由提交任务的线程（调用者线程）来同步运行该任务（降级限流）。\n   - DiscardPolicy：直接丢弃任务，没有任何反馈。\n   - DiscardOldestPolicy：丢弃队列里最老的任务（队列头部），然后重新尝试执行该任务。",
      structured: [
        "七参数清单：核心线程数、最大线程数、空闲生存时间、存活单位、阻塞队列、线程工厂、拒绝策略处理器",
        "任务分发优先级：核心线程（Core） -> 阻塞队列（Queue） -> 临时非核心线程（Max） -> 拒绝策略（Reject）",
        "AbortPolicy 默认阻断：直接拉响异常报 RejectedExecutionException，最安全但需要应用层兜底捕获",
        "CallerRunsPolicy 调用者退让：哪个线程提交任务，哪个线程自己去跑。实现对生产端的天然反压（Backpressure）限流"
      ]
    },
    keyPoints: ["ThreadPoolExecutor", "7个核心参数", "阻塞队列", "拒绝策略", "CallerRunsPolicy", "任务分发工作流"],
    traps: ["绝对不要使用 `Executors.newCachedThreadPool()`，因为它的 maximumPoolSize 默认是 `Integer.MAX_VALUE`，高并发下会无限制开辟新线程，导致 CPU 瞬间 100% 并直接 OOM 崩溃"],
    relatedIds: ["interview_java_008"]
  },
  {
    id: "interview_java_010",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "线程池参数动态调优与核心数设计",
    difficulty: 4,
    frequency: 4,
    question: "（追问）在实际生产中，如何根据 CPU 密集型与 I/O 密集型任务来合理设计初始线程数？如何实现线上线程池参数的动态修改（不重启服务）？",
    answer: {
      short: "CPU 密集型任务通常设计为 $N_{cpu} + 1$ 线程以减少上下文切换；I/O 密集型任务设计为 $2N_{cpu}$ 或根据公式 $N_{cpu} \\times (1 + \\frac{\\text{等待时间}}{\\text{计算时间}})$ 评估；动态调优可通过集成配置中心，利用 ThreadPoolExecutor 提供的 `setCorePoolSize` 和 `setMaximumPoolSize` 动态更新参数，并同步修改阻塞队列容量。",
      thinkingProcess: "1. 线程数公式：\n   - CPU 密集型（计算、加密、图形处理）：线程数等于 $N_{cpu} + 1$。加 1 是为了防范某个线程偶尔缺页中断导致的 CPU 闲置。\n   - I/O 密集型（数据库读写、RPC、文件读写）：由于线程大量时间都在等待 I/O 返回，CPU 空闲。可以配置更大的线程数。经典公式是 $N_{cpu} \times (1 + \frac{WT}{CT})$。WT（Wait Time）、CT（Compute Time）。\n2. 动态修改核心原理：\n   - ThreadPoolExecutor 允许在运行时动态修改参数。通过 Spring Cloud Config、Apollo 或 Nacos 修改参数后，代码监听到变更，调用：\n     `threadPool.setCorePoolSize(newCoreSize);`\n     `threadPool.setMaximumPoolSize(newMaxSize);`\n   - **Gotcha：阻塞队列容量 of 动态调整**。JDK 默认的 `LinkedBlockingQueue` 的 `capacity` 是 `final` 的，不支持修改。在工业界（如美团动态线程池设计），通常需要自定义一个 `ResizableCapacityLinkedBlockingQueue`，去掉 capacity 的 final 修饰符，提供 setCapacity 方法，从而支持队列容量的动态缩放。",
      structured: [
        "CPU 密集型策略：Core = N_cpu + 1，避开过密上下文切换（Context Switch）损耗，发挥 CPU 核心最大物理效能",
        "I/O 密集型策略：Core = N_cpu * (1 + Wait_Time / Compute_Time)，通过大量线程抢占等待时的空余算力",
        "动态核心 API：利用 `setCorePoolSize`，JVM 内部会自动对多余线程进行缩容或激活新工作线程填补，安全无感",
        "队列重塑调优：继承并重写 LinkedBlockingQueue 逻辑，移除 final 限制以支持动态容量增删防范 OOM"
      ]
    },
    keyPoints: ["动态线程池", "I/O 密集型公式", "CPU 密集型数", "setCorePoolSize", "队列扩容限制", "配置中心配置"],
    traps: ["在动态修改 `maximumPoolSize` 时，如果新设置的最大线程数比当前的核心线程数还要小，JVM 会抛出 `IllegalArgumentException` 报错，所以修改代码时必须注意先调大 Max，再调大 Core 的安全赋值顺序"],
    relatedIds: ["interview_java_009"]
  }
];

const segment2 = [
  {
    id: "interview_java_011_sync",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "synchronized 锁升级流程与 Monitor",
    difficulty: 4,
    frequency: 5,
    question: "请详细说明 synchronized 关键字在 JVM 偏向锁、轻量级锁和重量级锁之间的升级流程？重量级锁底层对应的 Monitor（监视器）的 ObjectMonitor 结构是怎样的？",
    answer: {
      short: "锁升级是 HotSpot 为优化锁竞争引入的机制：偏向锁偏向首个线程，无竞争时零开销；出现轻量竞争时通过 CAS 自旋升级为轻量级锁；当自旋失败或多线程激烈竞争时升级为重量级锁，底层依靠 ObjectMonitor 在操作系统层进行互斥阻塞，线程挂入 EntryList 或 WaitSet 队列。",
      thinkingProcess: "1. 锁升级过程：\n   - **偏向锁（Biased Lock）**：JVM 假设锁无竞争，把 Mark Word 的 ThreadID 指向当前线程。每次加锁仅需比对 ThreadID，省去 CAS 开销。\n   - **轻量级锁（Lightweight Lock）**：当有其他线程尝试抢锁，偏向锁被撤销。线程在自己的栈帧中创建锁记录（Lock Record），通过 CAS 将锁对象的 Mark Word 指向该 Record。若成功拿到锁。若失败，表示有竞争，自旋等待。\n   - **重量级锁（Heavyweight Lock）**：当自旋超过一定次数，或者又有第三个线程来抢锁，锁升级为重量级锁。Mark Word 指向 `ObjectMonitor`。未抢到锁的线程进入内核级等待队列，状态变为 Blocked，发生上下文切换。\n2. ObjectMonitor 核心结构：\n   - `_owner`：指向持有 Monitor 的线程。\n   - `_cxq` / `_EntryList`：存放等待获取锁（Blocked）的线程队列。\n   - `_WaitSet`：存放调用了 `wait()` 方法进入 Waiting 状态的线程队列。等调用 `notify()` 后再移入 EntryList 竞争。",
      structured: [
        "偏向锁无感：偏向首个线程。仅在 Mark Word 登记 ThreadID，无多线程竞争时，加锁开销几乎为零",
        "轻量锁 CAS 自旋：出现锁交替执行。撤销偏向，线程在栈帧构建 Lock Record 并 CAS 指向对象头，失败则忙自旋",
        "重量级锁 Monitor：竞争升级。Mark Word 指针指向 ObjectMonitor。未竞争成功线程被迫让出 CPU 进入休眠",
        "ObjectMonitor 队列：_owner 记录占有者；_EntryList/cxq 收集阻塞线程；_WaitSet 管理挂起调用 wait 状态线程"
      ]
    },
    keyPoints: ["synchronized", "锁升级", "偏向锁/轻量锁", "ObjectMonitor", "EntryList", "WaitSet 队列"],
    traps: ["偏向锁在 JDK 15 之后被默认禁用了（Deprecated），在 JDK 18+ 更是被彻底移除，因为维护偏向锁撤销的 Stop-The-World（STW）开销在现代高并发多核服务下得不偿失"],
    relatedIds: ["interview_java_006"]
  },
  {
    id: "interview_java_012_aqs",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "AQS（队列同步器）底层架构实现",
    difficulty: 4,
    frequency: 5,
    question: "AQS（AbstractQueuedSynchronizer）的底层工作原理是怎样的？它是如何通过一个 volatile 的 state 状态和 CLH 变体双向队列来实现线程排队与唤醒的？",
    answer: {
      short: "AQS 通过一个 volatile 修饰的 state 变量表示同步状态（如 0 为无锁，1 为加锁），并基于 CAS 保证状态修改的原子性；当线程获取同步状态失败时，AQS 会将当前线程封装成 Node 节点，加入到 CLH 双向队列尾部并挂起（LockSupport.park），当持有锁线程释放时，会唤醒队列头部的后继节点线程。",
      thinkingProcess: "1. 核心状态：`private volatile int state`。子类实现（如 ReentrantLock）通过 `compareAndSetState` 去竞争这个 state。\n2. 排队队列（CLH变体）：\n   - AQS 维护一个先进先出（FIFO）的双向链表，有 `head` 和 `tail` 指针。\n   - 抢锁失败的线程，被封装成 `Node`（保存线程引用、等待状态 `waitStatus`、前驱 `prev` 和后继 `next` 指针），通过 CAS 安全地插入到队列尾部。\n   - 线程在队列中不断自旋判断前驱节点是否是 head，如果是 head 则再次尝试抢锁；若抢不到或前驱不是 head，通过 `LockSupport.park(this)` 进入挂起状态。\n3. 释放唤醒：持有锁的线程调用 release 释放 state 后，获取 head 节点的下一个有效后继节点（`head.next`），调用 `LockSupport.unpark(node.thread)` 唤醒它，让其重新竞争 state。",
      structured: [
        "volatile state：同步状态标记。利用 CAS 操作安全抢占。ReentrantLock 用其实现重入计数，Semaphore 用于限额",
        "CLH 双向链表：Node 队列。抢锁失败线程封装 Node 尾部插入。双向指针设计支持 O(1) 节点自我取消和出队",
        "自旋与挂起（Park）：入队后线程自旋检查前驱是否为 head 以快速响应，否则通过 LockSupport.park 挂起让出 CPU",
        "独占与共享：独占模式（同一个时间一人持锁，如 ReentrantLock）与共享模式（多人持锁，如 CountDownLatch）"
      ]
    },
    keyPoints: ["AQS", "volatile state", "CLH 双向队列", "LockSupport.park", "独占/共享模式", "CAS 状态修改"],
    traps: ["AQS 唤醒后继节点时，如果 `head.next` 为 null 或者其被取消了（waitStatus > 0），AQS 会从**队列尾部 tail 开始向前遍历**直到找到最靠前的有效节点进行唤醒，这是为了确保并发入队时链表next指针尚未拼接完成的极端安全"],
    relatedIds: ["interview_java_008", "interview_java_011_sync"]
  },
  {
    id: "interview_java_013_lock",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "ReentrantLock vs synchronized 多维对比",
    difficulty: 3,
    frequency: 5,
    question: "请对比 Java 中 ReentrantLock 与 synchronized 的多维度差异。ReentrantLock 是如何实现公平锁（Fair Sync）与非公平锁（Nonfair Sync）的？",
    answer: {
      short: "synchronized 是 JVM 隐式锁，使用简单，支持自动升级；ReentrantLock 是 API 显式锁，功能更丰富（支持超时获取、可中断、多等待条件）；公平锁在抢锁前会判断是否有前驱节点在排队（有则排队），非公平锁则不管排队直接尝试 CAS 抢锁，非公平锁吞吐量更高但可能导致线程饥饿。",
      thinkingProcess: "1. 多维对比：\n   - **实现层面**：synchronized 是 JVM 关键字（C++底层）；ReentrantLock 是 Java API 级别（基于 AQS）。\n   - **锁释放**：synchronized 自动释放；ReentrantLock 必须在 finally 里手动 unlock，否则死锁。\n   - **特性**：ReentrantLock 支持 `lockInterruptibly()`（可响应中断）、`tryLock(time)`（超时放弃）、`Condition`（多条件分组唤醒，synchronized 只能 notifyAll 一锅端）。\n2. 公平与非公平实现（基于 AQS）：\n   - **非公平锁（NonfairSync）**：线程一调 lock()，不管三七二十一直接执行 `compareAndSetState(0, 1)`。如果刚好碰上持锁线程释放锁，新来线程能直接插队抢到锁，避免了唤醒挂起线程的上下文切换开销。\n   - **公平锁（FairSync）**：线程加锁前，会调用 `hasQueuedPredecessors()`。判断当前 AQS 队列里是否有人在排队。如果有，无条件挂起并去排队。确保先来后到。",
      structured: [
        "关键字与类库：synchronized 关键字内置于字节码，简单稳健；ReentrantLock 是 API 级组件，灵活控制",
        "高级特性支持：ReentrantLock 独占锁中断抢占、可限时获取锁 `tryLock`、支持多个条件 Condition 等待唤醒",
        "非公平插队优先：NonfairSync 直接抢 CAS。如果运气好免去了唤醒排队线程的上下文切换，吞吐性能极佳",
        "公平排队保障：FairSync 严格检查 hasQueuedPredecessors()，队列有节点则必须排在尾部，杜绝饥饿但上下文开销大"
      ]
    },
    keyPoints: ["ReentrantLock", "synchronized", "公平锁/非公平锁", "hasQueuedPredecessors", "插队竞争", "Condition"],
    traps: ["在实例化 ReentrantLock 时，默认构造器 `new ReentrantLock()` 创建的是**非公平锁**，因为非公平锁在绝大多数高并发场景下的吞吐率显著高于公平锁，只有在必须按时间严格排序时才开启公平锁"],
    relatedIds: ["interview_java_012_aqs"]
  },
  {
    id: "interview_java_014_aba",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "CAS 底层 Unsafe 类及 ABA 问题突破",
    difficulty: 3,
    frequency: 4,
    question: "Java 中的 CAS 操作是如何通过 Unsafe 类调用底层硬件原子指令的？什么是 CAS 的 ABA 问题？我们在 Java 中如何利用版本号机制（AtomicStampedReference）来根治这一问题？",
    answer: {
      short: "CAS 底层通过 Unsafe 类发起 native 调用，利用 CPU 的 lock cmpxchg 指令实现原子操作；ABA 问题是变量值从 A 变成 B 又变回 A，CAS 无法察觉其发生过变更；根治方案是引入版本号，Java 提供的 `AtomicStampedReference` 在比对值的同时比对 Stamp 版本戳，两者皆一致才允许修改。",
      thinkingProcess: "1. Unsafe 底层：Unsafe 提供绕过 JVM 安全检查直接操作内存物理地址的能力。CAS 在 JDK 里封装为 `unsafe.compareAndSwapObject` 等。底层由 C++ 插入汇编 `lock cmpxchg`。\n2. ABA 危害场景：在无锁栈（Lock-Free Stack）中，线程 1 准备把栈顶 A 换成 B，栈顶下一个是 C。此时线程 2 插队，把 A 弹出，又把 B 弹出，最后压入 A。线程 1 恢复，比对栈顶依然是 A，判定无变化，直接 CAS 成功。但其实栈的内部结构（原本是 A->C 变成了现在的 A->B）已经损坏，导致重大指针悬空灾难。\n3. AtomicStampedReference 原理：将 `[引用, 整数版本号]` 绑定包装成一个 Pair 对象。每次 CAS 修改时，不仅比对引用（expectedReference），还比对版本号（expectedStamp）。\n   `compareAndSet(V expectedReference, V newReference, int expectedStamp, int newStamp)`\n   只有当引用和版本号双重匹配，才允许修改 Pair 指针，从物理上消灭了 ABA 幻读发生。",
      structured: [
        "Unsafe 内存直达：提供底层的内存偏移动态分配和原子读写，绕过类安全屏障直通物理内存空间",
        "lock cmpxchg 指令：CAS 在多核 CPU 下的真实底座，锁住缓存行/总线，强行原子执行比较并交换操作",
        "ABA 幻读陷阱：数值被偷梁换柱后回拨，单地址比对无法感知生命周期变化，在链式/栈式数据结构中引发断链灾难",
        "双版本戳防线：AtomicStampedReference 绑定 Stamp。每次写操作伴随版本单调递增，CAS 连同版本号原子比对"
      ]
    },
    keyPoints: ["CAS 原子性", "Unsafe", "ABA 问题", "AtomicStampedReference", "lock cmpxchg", "版本号"],
    traps: ["有些开发者尝试使用 `AtomicMarkableReference` 解决 ABA。注意它只绑定了一个 1-bit 的 boolean 标记，它只能减少连续两次突变的问题，但对于 A->B->A 类型的深层次 ABA，依然无法像 Integer 版本号那样根治，应严格选型"],
    relatedIds: ["interview_java_013_lock"]
  },
  {
    id: "interview_java_015_volatile",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "volatile 可见性与禁止指令重排实现",
    difficulty: 3,
    frequency: 5,
    question: "请详述 Java 中 volatile 关键字的作用。它是如何在字节码和硬件 CPU 层面保障变量修改的“可见性（Visibility）”与“禁止指令重排（Ordering）”的？它能保证原子性吗？",
    answer: {
      short: "volatile 保障变量对所有线程的即时可见性，并禁止指令重排优化，但无法保障非原子操作（如 i++）的原子性；JVM 在字节码生成时在读写 volatile 字段前后插入内存屏障指令，硬件层面通过 x86 的 lock 前缀指令，强制清空 Store Buffer 并利用 MESI 协议使其他 CPU 缓存失效，从而读取最新内存值。",
      thinkingProcess: "1. 作用大纲：可见性（Visibility）、有序性（Ordering，禁止重排）、**不保证原子性**（i++ 依然是非线程安全的，因为 i++ 分为读、加、写三步，volatile 无法锁住这三步的连续原子）。\n2. 可见性底层实现（MESI缓存一致性）：\n   - 当 CPU 写一个 volatile 变量时，JVM 会在其汇编指令前加一个 `lock` 前缀。\n   - `lock` 前缀触发：把当前 CPU 的 Store Buffer 写入 Cache Line，强行广播总线。根据 MESI 协议，其他所有 CPU 核中缓存了该变量地址的 Cache Line 状态直接变为 **Invalid（无效）**。\n   - 当其他线程（在其他 CPU 核心上）读取该变量时，发现本地 Cache Line 无效，被迫重新发起总线读取，直接从物理内存中拉取最新值。\n3. 禁止指令重排（内存屏障）：\n   - JMM（Java内存模型）在 volatile 变量的写操作前插入 **StoreStore 屏障**，写操作后插入 **StoreLoad 屏障**。\n   - 在 volatile 变量的读操作后插入 **LoadLoad 屏障** 和 **LoadStore 屏障**。\n   - 屏障强制阻止 CPU 和编译器将屏障前后的指令进行交叉排序优化，确保代码执行的绝对顺序符合程序逻辑。",
      structured: [
        "可见性（MESI 缓存一致）：写操作触发 lock 前缀汇编，强制刷写主存，使其他物理核心对应的缓存行直接失效",
        "禁止指令重排：JMM 在 volatile 读写动作前后硬性夹入四大内存屏障（Barriers），阻断了 CPU 流水线的乱序执行",
        "原子性死穴：只负责读写的可见，不负责复合操作。i++ 这种 `读-改-写` 复合动作依然需要 synchronized 或 Atomic 类",
        "单例 DCL 应用：双重检测锁单例中，必须用 volatile 修饰 instance 以防范 `new` 对象时指令重排导致拿到未初始化完的半成品"
      ]
    },
    keyPoints: ["volatile", "内存屏障", "MESI 协议", "lock 汇编前缀", "可见性/有序性", "指令重排限制"],
    traps: ["很多开发者认为 volatile 变量在并发下执行 `i++` 是安全的。事实上，由于 `i++` 编译后包含多条字节码指令，多线程并发时依然会发生数据覆盖，必须使用 `AtomicInteger` 或锁"],
    relatedIds: ["interview_java_006", "interview_java_014_aba"]
  },
  {
    id: "interview_java_016_lock_opt",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "JVM 锁优化机制：锁消除与锁粗化",
    difficulty: 3,
    frequency: 3,
    question: "Java 虚拟机在编译和运行期为了提升同步锁的效率，引入了哪些锁优化技术？请详细解释锁消除（Lock Elimination）、锁粗化（Lock Coarsening）和自适应自旋的原理。",
    answer: {
      short: "锁消除是通过逃逸分析发现锁对象只被单线程访问时，在即时编译（JIT）时将锁代码直接抹去以消灭同步开销；锁粗化是将多次连续对同一个对象的加锁解锁操作合并为一次大范围加锁，避免频繁加解锁的性能损耗；自适应自旋是根据该锁历史自旋成功率动态调整当前线程自旋等待次数，防止过度空转空耗 CPU。",
      thinkingProcess: "1. 锁消除 (Lock Elimination)：\n   - 基于**逃逸分析（Escape Analysis）**。如果 JVM 检测到某个锁对象是在方法内部创建的局部变量，且绝对不会逃逸到方法外部被其他线程访问（例如在本地方法里调用 `new StringBuffer().append(str)`，StringBuffer 内部 append 是 synchronized 的）。\n   - JIT 编译器在编译期判定此锁多余，直接进行**去锁编译**，运行期零同步开销。\n2. 锁粗化 (Lock Coarsening)：\n   - 如果在一个循环内频繁对同一个对象加锁解锁（如 `for(..){ synchronized(lock){..} }`）。\n   - JVM 检测到后，会把加锁的范围直接扩大到循环外部，使得只加锁一次、解锁一次，省去了循环内成千上万次加解锁的开销。\n3. 自适应自旋锁 (Adaptive Spining)：\n   - 轻量级锁自旋时，传统的自旋是固定的（如自旋 10次）。\n   - 自适应自旋锁：如果上次该锁自旋 10次成功拿到了，JVM 判定这次成功的概率也极大，允许自旋 20 次；如果某个锁很少自旋成功，JVM 会直接跳过自旋，让线程直接阻塞挂起，免去无用的 CPU 空转空耗。",
      structured: [
        "逃逸分析与锁消除：JIT 分析局部变量生存域。未逃逸出当前栈帧的对象锁在编译时被彻底剥除，消灭空锁损耗",
        "合并优化与锁粗化：将一系列高频分散的同一对象加解锁，由编译器整合成一次性宽范围锁，减低频繁加解开销",
        "自适应自旋防空转：根据历史自旋得手概率决定等待次数。拿到几率高则多自旋，几率低则瞬间休眠进程保护核心"
      ]
    },
    keyPoints: ["锁优化", "逃逸分析", "锁消除", "锁粗化", "自适应自旋", "JIT 编译器"],
    traps: ["锁消除的物理基石是逃逸分析，但如果我们在写代码时返回了该局部对象（逃逸了），逃逸分析会失效，锁消除将无法被触发，必须养成良好的局部变量封装习惯"],
    relatedIds: ["interview_java_011_sync", "interview_java_013_lock"]
  },
  {
    id: "interview_java_017_string",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "String 常量池与 intern() 物理演变",
    difficulty: 3,
    frequency: 4,
    question: "Java 中的字符串常量池（String Constant Pool）存放在哪里？在 JDK 6 和 JDK 7+ 以后，字符串常量池发生了什么物理迁移？`String.intern()` 的内存行为有什么根本变化？",
    answer: {
      short: "字符串常量池在 JDK 6 存放在永久代（PermGen），JDK 7+ 迁移至堆（Heap）中以防止元空间 OOM；当调用 `intern()` 时，JDK 6 会在常量池中拷贝并创建全新的 String 对象；而 JDK 7+ 如果发现堆中已有该字符串，仅需在常量池中记录并指向堆中已存在对象的引用地址，大幅节省了内存开销。",
      thinkingProcess: "1. 常量池迁移：\n   - JDK 6：字符串常量池在方法区（PermGen 永久代）中。永久代大小固定（默认几M），大量 intern() 会直接触发 `java.lang.OutOfMemoryError: PermGen space`。\n   - JDK 7+：字符串常量池迁移到了常规堆（Heap）中。利用了垃圾回收器的自动管理，不易发生 OOM。\n2. `intern()` 核心原理（以经典面试题为例）：\n   `String s3 = new String(\"1\") + new String(\"1\");`（此时堆中生成了 \"11\" 对象，但常量池中没有 \"11\"）。\n   `s3.intern();`\n   - **JDK 6**：intern() 发现常量池没有 \"11\"，在常量池复制并生成一个全新的 \"11\" 字符串对象。`s3 == s3.intern()` 返回 **false**（一个是堆里的 s3，一个是常量池里的全新对象）。\n   - **JDK 7+**：intern() 发现堆里已经有 \"11\" 了。为了省内存，**不在常量池里创建对象拷贝**，只是在常量池的 StringTable（本质是哈希表）中增加一个记录，**指向堆中 s3 的物理内存地址**。此时 `s3.intern()` 获取的其实就是 s3 的地址。`s3 == s3.intern()` 返回 **true**。",
      structured: [
        "永久代到堆区（JDK 7 物理位移）：常量池从容量狭小的永久代搬迁到常规 Java 堆，杜绝了高频动态 intern 引起的 PermGen OOM",
        "JDK 6 复制拷贝：intern 发现常量池无对应串，强行复制出独立的字符串对象副本放入常量池，返回常量池新指针",
        "JDK 7+ 引用记录：发现堆区已有该对象，常量池不建新对象，只存储指向堆中该对象的引用指针，显著节约内存",
        "StringTable 结构：JVM 内部维护的哈希表结构。其桶大小可配置，高频使用时需调大 `-XX:StringTableSize` 避免哈希冲突"
      ]
    },
    keyPoints: ["字符串常量池", "String.intern()", "永久代 PermGen", "堆 Heap 共享", "引用指向", "StringTable"],
    traps: ["在写高频拼接逻辑时，如果错误地将每次生成的随机字符串都调用一次 `.intern()`，会导致堆中的 StringTable 表极度臃肿，且由于 GC 回收优先级低，会导致 JVM 的 GC 扫描时间大幅变长并引发严重的卡顿"],
    relatedIds: ["interview_java_003"]
  },
  {
    id: "interview_java_018_exception",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java 异常体系与 try-catch-finally 字节码",
    difficulty: 2,
    frequency: 4,
    question: "请详述 Java 异常体系的划分。从 JVM 字节码层面分析，try-catch-finally 块中如果 try 和 finally 都包含 return，为什么 finally 中的 return 会覆盖 try 中的值？",
    answer: {
      short: "Java 异常顶层为 Throwable，分为 Error（严重错误）与 Exception（受检 RunTime 运行时异常与编译期受检异常 Exception）；finally 中 return 会覆盖 try 的原因是 JVM 编译时，会把 finally 中的字节码指令复制并插入到 try 和 catch 块的每一个退出路径（包括 return 之前），这导致 try 中的临时变量加载指令被 finally 中的覆盖覆盖。",
      thinkingProcess: "1. 异常划分：Throwable -> Error（如 OutOfMemoryError、StackOverflowError） + Exception（运行时异常 RuntimeException 如 NullPointerException，与编译时异常/受检异常如 IOException）。\n2. try-catch-finally 字节码执行秘密：\n   - JVM 在编译时，其实并没有“独占”的 finally 异常表跳转入口。而是采用了**“指令复制”**的手段。\n   - 编译器会把 finally 块中的指令，完整地复制到 try 块的 `return` 指令前、以及 catch 块的 `return` 指令前，并为这几块区域增加一个特殊的 Exception Table 路由，保障任何异常发生都会走一遍这段复制的指令。\n   - 当 try 准备 return 一个值时，JVM 会把这个值先压入**局部变量表（Local Variable Table）的临时槽位**里暂存起来。\n   - 接着执行被复制进来的 finally 代码块指令。如果 finally 块里也有一个 `return`，JVM 会直接加载 finally 里的值并执行 `ireturn`（返回当前栈顶值），这导致刚才暂存在局部变量表里的 try 返回值被彻底抛弃和覆盖，方法直接返回 finally 中的结果。",
      structured: [
        "Throwable 两大阵营：Error（系统级绝症，如 OOM/StackOverflow，不建议捕获）与 Exception（普通受检与非受检异常）",
        "RuntimeException 非受检：编译器不强制要求 try-catch，多为程序员逻辑漏洞（如 NPE、IndexOutOfBoundsException）",
        "指令复制逻辑：编译器把 finally 内的代码拷贝并拼接到 try/catch 块的所有 return 出口指令之前，确保无条件必定被执行",
        "栈帧覆盖细节：try 的 return 会把返回值暂存栈变量槽；finally 中的 return 指令会直接将其替换并将新值推入栈顶返回"
      ]
    },
    keyPoints: ["异常体系 Throwable", "Error vs Exception", "RuntimeException", "finally 覆盖", "字节码指令复制", "栈变量槽"],
    traps: ["在 catch / finally 块中绝对不推荐使用 `return` 语句。不仅会导致 try 块的返回值被吞掉，更致命的是如果 try 块抛出了异常，finally 里的 return 语句会使该异常直接被抹去，导致上层无法捕获到错误，隐蔽性极高"],
    relatedIds: ["interview_java_003"]
  },
  {
    id: "interview_java_019_generic",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "Java 泛型擦除机制与桥接方法",
    difficulty: 3,
    frequency: 4,
    question: "Java 中的泛型是如何实现的？什么是泛型擦除（Type Erasure）？为什么泛型擦除后多态性不会被破坏？桥接方法（Bridge Method）扮演了什么角色？",
    answer: {
      short: "Java 泛型是“伪泛型”，只在编译期进行类型检查，编译后会将泛型类型擦除为原始类型（如 Object 或上限类型）；擦除后为了保证多态的正确重写，编译器会自动在字节码中生成“桥接方法（Bridge Method）”，代为重写父类的方法并执行类型强制转换，从而保障了多态性。",
      thinkingProcess: "1. 泛型擦除：与 C# 的真泛型（运行期保留类型元数据）不同。Java 为了兼容 JDK 1.4 以前的 Class 规范，编译后把 `<T>` 换成对应的 `Object`，把 `<T extends Number>` 换成 `Number`。读取泛型数据时，编译器在字节码中自动插入强转指令。\n2. 桥接方法（Bridge Method）的必要性：\n   - 假设有父类 `class Node<T> { void setData(T data) { } }`，编译后为 `void setData(Object data)`。\n   - 有子类 `class MyNode extends Node<Integer> { void setData(Integer data) { } }`。\n   - 重点：子类的 `setData(Integer)` 和父类编译后的 `setData(Object)` 参数类型不同。根据多态规范，这根本**不属于 Method Override（重写）**，而是 **Overload（重载）**！这会导致父类引用在运行时无法调用到子类方法，破坏了多态性。\n   - 解决：编译器在编译子类 `MyNode` 时，会自动偷偷生成一个桥接方法：\n     `void setData(Object data) { this.setData((Integer) data); }`\n     这个方法签名与父类一致，完美重写，在内部强转后调用子类的 `setData(Integer)`，成功拯救了多态逻辑。",
      structured: [
        "伪泛型实现：泛型仅存在于源码中，编译成 class 后 `<T>` 全部退化为 Object，JVM 在运行期对类型一无所知",
        "强转指令织入：泛型擦除后，编译器在每个获取泛型属性的地方自动插入 `checkcast` 强转字节码指令确保安全",
        "多态断裂瓶颈：擦除导致子类 `setData(Integer)` 无法覆盖父类擦除后的 `setData(Object)`，重写退化为重载",
        "桥接方法（Bridge）：编译器在子类中自动织入参数为 Object 的桥接函数，代为实现 Override 并内聚强转分发"
      ]
    },
    keyPoints: ["Java 泛型", "泛型擦除 Type Erasure", "桥接方法 Bridge", "多态破坏防范", "逃逸分析", "类型强转 checkcast"],
    traps: ["因为泛型擦除的存在，我们无法通过 `new T()` 来创建泛型实例，也无法使用 `instanceof T` 进行类型判断，在运行时若需获取泛型的实际 Class 类型，必须显式传入 Class<T> 类型令牌"],
    relatedIds: ["interview_java_004"]
  },
  {
    id: "interview_java_020_reflect",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "Java 反射机制与 Method.invoke 膨胀优化",
    difficulty: 4,
    frequency: 4,
    question: "请问 Java 的反射（Reflection）机制底层是如何运作的？当频繁调用 `Method.invoke()` 时，JVM 是如何执行“通胀（Inflation）”优化以大幅提升调用效率的？",
    answer: {
      short: "反射底层依靠从方法区获取 Class 类元数据，进行动态查表调用；`Method.invoke` 默认使用 JNI 本地调用（速度慢），当单次反射调用次数超过阈值（默认 15 次）时，JVM 会触发通胀（Inflation）优化，在内存中动态生成专门用于此反射调用的字节码 Class 并进行 JIT 编译，将反射调用转化为直接方法调用，从而将性能提升数倍。",
      thinkingProcess: "1. 反射机制：通过 native 方法进入 JVM 内部类元信息表，查出对应的 Method/Field 偏移量并调用。\n2. Method.invoke(obj, args...) 底层通胀核心：\n   - **JNI 模式（本地方法）**：前 15 次调用。反射走 native 方法。因为需要通过 JNI 跨越 Java 与 C++ 边界，进行大量安全检查，每次反射调用都比较慢。\n   - **通胀阈值达到（默认15次）**：JVM 判定此方法是“热点方法”。为了性能，开启 Inflation 机制。动态利用字节码生成器生成一个继承自 `MagicAccessorImpl` 的全新字节码类（如 GeneratedMethodAccessor1），在里面直接硬编码写死：`((TargetClass)obj).targetMethod()`。\n   - **字节码加速**：从此以后，后续的反射调用直接通过这个动态生成的类实例调用，不再走 native 的 JNI 链路，反射开销降为普通的虚方法调用级别，性能暴涨。可以通过 `-Dsun.reflect.inflationThreshold=N` 调整该阈值。",
      structured: [
        "反射查表：利用 Class 对象在元空间查找 Method 元数据。由于有大量权限、安全检查，初始性能较低",
        "JNI 慢速路径（前15次）：调用委托给 NativeMethodAccessorImpl 走 native C++ 路由，面临 JNI 上下文跨界开销",
        "通胀激活（Inflation）：单方法调用超 15 次，通胀机制启动。JVM 自动在内存生成专有的 DirectMethodAccessor 字节码类",
        "直接方法重写：新生成的辅助类内部直接强转并同步调用目标函数，将反射跳转开销降到 O(1) 类直接调用级别"
      ]
    },
    keyPoints: ["反射底层", "Method.invoke", "通胀机制 Inflation", "MagicAccessorImpl", "JNI 跨界开销", "动态字节码生成"],
    traps: ["反射生成动态类的 Class 对象是存放在 JVM 的元空间（Metaspace）中的。如果应用高频、无限创建反射对象且不加复用（如某些动态框架 Bug），会导致元空间内堆积百万个 GeneratedMethodAccessor 垃圾类，导致 Metaspace OOM 内存泄漏"],
    relatedIds: ["interview_java_003", "interview_java_005"]
  },
  {
    id: "interview_java_021_spi",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "java",
    title: "Java SPI 机制缺陷与 Dubbo SPI 优化设计",
    difficulty: 4,
    frequency: 3,
    question: "什么是 Java 提供的 SPI（Service Provider Interface）服务发现机制？它有什么致命的设计缺陷？Apache Dubbo 是如何重构并设计出 Dubbo SPI（ExtensionLoader）来解决这些缺陷并支持自适应加载的？",
    answer: {
      short: "Java SPI 依靠在 META-INF/services 下配置实现类全路径，并通过 ServiceLoader 自动加载；缺陷是会一次性无脑实例化所有实现类，浪费资源且无法精准按需加载；Dubbo SPI 改进为 Key-Value 配置模式，支持懒加载（Lazy Load），并引入了 IOC/AOP 自适应拓展（Adaptive Extension）和自动注入，实现微内核架构的极致解耦。",
      thinkingProcess: "1. Java SPI 原理与痛点：\n   - 配置：`META-INF/services/com.sql.Driver`，里面写实现类。`ServiceLoader.load(Driver.class)` 自动读取。\n   - **致命缺陷**：ServiceLoader 只能通过迭代器 `Iterator` 遍历加载。这意味着**必须把配置里的所有实现类全部初始化一遍**。如果我配了 10 个 Driver 且其中一个需要连接数据库初始化 10 秒，但我今天只想用第一个，Java SPI 会强行初始化这 10 个，效率极低，且初始化报错会直接导致整个 ServiceLoader 报废。\n2. Dubbo SPI 改良设计：\n   - **KV配置**：在 `META-INF/dubbo/` 下配置成 `mysql=com.driver.MySqlDriver`。每个实现类绑定一个短 key。\n   - **懒加载与按需获取**：通过 `ExtensionLoader.getExtensionLoader(Protocol.class).getExtension(\"dubbo\")`。只有调用时，才会精准实例化 \"dubbo\" 对应的类，其他类不实例化，速度快，内存省。\n   - **自适应 IOC/AOP 注入**：Dubbo SPI 自带 IoC，如果实现类里有 setter 方法，会自动递归去加载并注入依赖；支持 Wrapper 包装类实现切面 AOP，功能完全等同于一个微型 Spring 容器，为 Dubbo 的高度插件化奠定基础。",
      structured: [
        "Java SPI 线性加载：ServiceLoader.load() 必须全量扫描并无脑实例化配置中所有子类，不支持选择性实例化",
        "初始化连带崩溃：Java SPI 在遍历实例化过程中，若其中某一个子类因缺失依赖包报错，会导致整个加载流程抛异常中断",
        "Dubbo SPI 懒加载：键值对映射命名。通过指定 Key 定向精准实例化目标共享拓展类，规避了无效内存占用",
        "自适应切面（AOP）：Dubbo 引入 Wrapper 链条包装实现类，动态生成代理类，支持自动执行 Filter/日志等切面拦截"
      ]
    },
    keyPoints: ["Java SPI 缺陷", "Dubbo SPI 优化", "ServiceLoader", "ExtensionLoader", "懒加载", "自适应拓展 Adaptive"],
    traps: ["在编写 Dubbo SPI 实现类时，如果该类需要有参构造器，由于 ExtensionLoader 底层反射是通过 `Class.newInstance()` 进行无参反射初始化的，会导致初始化失败，必须保留无参构造器"],
    relatedIds: ["interview_java_005", "interview_java_020_reflect"]
  },
  {
    id: "interview_java_022_io",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java BIO vs NIO vs AIO 核心架构对比",
    difficulty: 3,
    frequency: 5,
    question: "请详细对比 Java BIO（同步阻塞）、NIO（同步非阻塞）和 AIO（异步非阻塞）三大 I/O 模型的底层区别及适用场景。NIO 中的 Selector、Buffer 和 Channel 扮演了什么角色？",
    answer: {
      short: "BIO 采用一连接一线程模型，线程在读写时均会发生阻塞，适合少连接长链接；NIO 基于 I/O 多路复用，通过单个 Selector 轮询多个 Channel 上的就绪事件，适合高并发高吞吐长连接；AIO 依靠操作系统的异步 I/O 机制，由内核处理完读写后发送回调通知，适合连接数极多且长连接的场景。",
      thinkingProcess: "1. 模型对比：\n   - **BIO (Blocking IO)**：服务端每次 `accept` 新连接都必须开辟一个 `Thread` 专职伺候。当客户端没发包时，该线程在 `read` 方法上死等。无法支持十万级连接。\n   - **NIO (Non-blocking IO)**：基于 Selector（选择器）、Channel（通道）和 Buffer（缓冲区）。\n     - **Channel**：双向传输数据的物理管道（如 SocketChannel）。\n     - **Buffer**：存储数据的容器（ByteBuffer）。NIO 读写必须通过 Buffer。\n     - **Selector**：选择器。通过一个线程调用 `selector.select()`，底层依托 `epoll` 监听成千上万个 Channel 的就绪状态（OP_ACCEPT, OP_READ）。只有有事件发生时，该线程才苏醒并派发给工作线程读写，大幅减少了线程开销。\n   - **AIO (Asynchronous IO)**：基于回调（Proactive 模型）。调用 `read` 时传入 `CompletionHandler`，内核完成数据读取后自动执行回调方法，真正非阻塞。在 Windows 下用 IOCP 性能很好，但由于 Linux AIO 实现不成熟，Java AIO 在 Linux 性能相比 epoll 无明显优势。",
      structured: [
        "BIO 同步阻塞（一连一线程）：阻塞在 accept/read。线程并发数受限，高并发下会导致 JVM 堆栈内存溢出和高上下文切换",
        "NIO 多路复用（一线程多通道）：线程仅在 Selector.select 处阻塞。通过轮询就绪事件分发任务，极佳的并发吞吐",
        "NIO 三剑客：Channel（双向管道，解耦读写）；Buffer（内存缓冲区，提供 position/limit 控制）；Selector（多路轮询器）",
        "AIO 异步非阻塞（真正回调）：读写交由 OS 内核跑完才唤醒 Java 线程，属于 Proactor 模式，在 Linux 下利用 epoll 仿真模拟"
      ]
    },
    keyPoints: ["BIO / NIO / AIO", "Selector 多路复用", "SocketChannel", "ByteBuffer", "epoll 关联", "Proactor 模式"],
    traps: ["在编写 Java NIO 读写 Buffer 时，读取数据前必须调用 `buffer.flip()` 将 Buffer 从“写模式”切换为“读模式”；写完后若要复用，必须调用 `buffer.clear()` 重置指针，否则读写数据会发生错乱"],
    relatedIds: ["interview_java_009"]
  },
  {
    id: "interview_java_023_zerocopy",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "Java NIO 零拷贝：mmap 与 sendfile 实现",
    difficulty: 4,
    frequency: 4,
    question: "Java NIO 是如何支持零拷贝（Zero-Copy）的？请结合 MappedByteBuffer（mmap）与 FileChannel.transferTo()（sendfile）分析它们的底层物理实现及 API 区别。",
    answer: {
      short: "Java NIO 通过 `DirectByteBuffer` 分配堆外物理内存，利用 mmap 和 sendfile 实现零拷贝；`MappedByteBuffer` 映射文件到虚拟内存，共享内核 Page Cache，适合高频小块文件随机读写；`FileChannel.transferTo()` 底层调用 Linux 的 `sendfile` 系统调用，直接在内核将文件传输给网卡，效率最高，适合大宗数据顺序传输。",
      thinkingProcess: "1. 堆外直接内存 (Direct Memory)：\n   - 通过 `ByteBuffer.allocateDirect(size)` 申请。\n   - 普通 JVM 内存读写需从 JVM 堆拷贝到操作系统内核空间，再发送给硬件。使用 Direct Memory 申请的是不受 JVM 堆控制的系统本地堆外物理内存，Java 线程直接通过内存指针读写堆外空间，消除了“堆内->堆外”的一次内存拷贝（但仍存在态切换）。\n2. MappedByteBuffer (mmap实现)：\n   - 调用 `FileChannel.map(MapMode.READ_WRITE, 0, size)` 获取。\n   - 物理原理：通过 mmap 系统调用，把文件地址映射到进程虚拟地址空间。进程像读写内存一样直接读写文件。省去了 `Page Cache` 到用户缓冲区的 1 次 CPU 数据拷贝，且修改会自动异步写入磁盘。但它仍需 4 次用户态与内核态切换。\n3. FileChannel.transferTo() (sendfile实现)：\n   - `fileChannel.transferTo(position, count, targetChannel)`。\n   - 物理原理：底层直接发起 Linux 的 `sendfile` 系统调用。数据不流经用户态（Java 堆），直接在内核里将 Page Cache 送入 Socket Buffer 并由 DMA 发给网卡。仅需 2 次上下文切换与最少 0 次 CPU 拷贝，是零拷贝的极限效率实现。",
      structured: [
        "直接内存（DirectByteBuffer）：在 C 堆申请非 JVM 堆管理内存，Java 读写免去“JVM堆到堆外操作系统内存”拷贝",
        "MappedByteBuffer 映射（mmap）：将文件直接映射至虚拟内存。多进程共享 Page Cache，适合频繁高频的小文件随机读写",
        "transferTo 直传（sendfile）：一个调用打通。文件数据在内核态直接进入网卡，CPU 零负载，Kafka/Netty 的核心支柱",
        "回收 gotcha：DirectByteBuffer 依靠 JVM 的虚引用（PhantomReference）Cleaner 在 GC 时回收堆外，极度容易发生堆外内存溢出"
      ]
    },
    keyPoints: ["Java 零拷贝", "MappedByteBuffer", "transferTo()", "DirectByteBuffer", "堆外内存", "JNI 调用"],
    traps: ["DirectByteBuffer 的回收依赖 JVM 触发 GC。如果我们关掉了 `System.gc()`（配置了 `-XX:+DisableExplicitGC`），且 JVM 堆内压力很小不触发 Full GC，会导致堆外内存一直不被回收，直接发生全机 OOM（内存溢出）假死，需通过反射手动调用 Cleaner 强行释放"],
    relatedIds: ["interview_java_007", "interview_java_022_io"]
  },
  {
    id: "interview_java_024_netty",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "java",
    title: "Netty 线程模型与核心零拷贝设计",
    difficulty: 4,
    frequency: 5,
    question: "Netty 是如何实现高性能网络通信的？请详解 Netty 的双 EventLoopGroup（Boss 与 Worker）Reactor 线程模型以及 Netty 自身的逻辑零拷贝设计。",
    answer: {
      short: "Netty 采用主从 Reactor 多线程模型：BossGroup 专职负责 accept 新连接并注册到 Selector，WorkerGroup 负责多路复用读写和 ChannelPipeline 处理器链条的执行；Netty 的零拷贝主要是逻辑层面的：通过 CompositeByteBuf 组合缓冲区、ByteBuf.slice 切片以及 Wrap 包装机制，避免了在用户态进行多段内存数据的合并拷贝操作。",
      thinkingProcess: "1. Reactor 线程模型：\n   - **BossGroup**（主 Reactor）：循环执行 `select`。只管处理客户端的连接建立（Accept）。当连接建立后，生成 `SocketChannel`，将其包装为 `NioSocketChannel`，轮询注册到 WorkerGroup 的某一个 EventLoop 的 Selector 上。\n   - **WorkerGroup**（从 Reactor）：每个 EventLoop 绑定一个单独的线程，在自己的 Selector 上死循环监听读写事件。事件触发后，沿着 `ChannelPipeline` 依次调用用户配置的 `ChannelHandler` 处理器（编解码、心跳、业务处理）。这保证了 **I/O 读写和业务处理线程完全绑定在同一个 EventLoop 上**，消除了线程上下文切换的开销，实现无锁化（Single-Thread-Rule-Of-EventLoop）。\n2. Netty 自身的逻辑零拷贝（区别于 OS 零拷贝）：\n   - **CompositeByteBuf**：高并发下，包头和包体是分开的。Netty 不需要把包头和包体拷贝到一个新的大 Buffer 中，而是用 CompositeByteBuf 将它们逻辑“串联”起来，呈现出连续的 Buffer 视图，用户读取时无感，节省了 CPU 拷贝时钟。\n   - **Unpooled.wrappedBuffer**：直接把 byte[] 数组包装成 ByteBuf，不发生数据拷贝拷贝。\n   - **Slice 零拷贝**：把大 ByteBuf 划分成多个子 ByteBuf，各个子 Buffer 共享同一块底层的物理内存，修改子 Buffer 数据会实时在原 Buffer 生效，完全是逻辑指针层面的移位，零内存复写。",
      structured: [
        "主从 Reactor 模型：Boss 线程池接收 accept 链接分配给 Worker 线程池；Worker 线程池独立管理 epoll 轮询和 Pipeline 执行",
        "无锁串行化（Loop-rule）：每一个 Channel 的所有读写及 Handler 触发完全限定在同一个 EventLoop 线程内同步进行，规避了锁竞争",
        "CompositeByteBuf 逻辑合并：将协议头与数据体逻辑连接，向上层提供连续寻址，避免了数据实体的物理合并拷贝",
        "ByteBuf 内存池（PooledByteBuf）：引入类似 jemalloc 的 PoolArena 内存池，高频复用 DirectBuffer，极大地降低了 GC 压力"
      ]
    },
    keyPoints: ["Netty 零拷贝", "CompositeByteBuf", "Slice 缓冲区", "EventLoopGroup", "Reactor 线程模型", "无锁串行化"],
    traps: ["在 ChannelHandler 编写业务时，如果调用了高耗时的阻塞操作（如调用第三方慢接口或进行大型 SQL 慢查询），会直接把当前的 Worker EventLoop 线程死锁卡住，导致绑定在该 EventLoop 上的其他数千个客户端连接全部无法响应，耗时任务必须派发给自定义的专门业务线程池（EventExecutorGroup）处理"],
    relatedIds: ["interview_java_010", "interview_java_023_zerocopy"]
  },
  {
    id: "interview_java_025_stream",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java Stream 并行流与 ForkJoinPool 工作窃取",
    difficulty: 3,
    frequency: 3,
    question: "Java 8 中的 Stream API 是如何实现“惰性求值（Lazy Evaluation）”的？并行流（Parallel Stream）底层的 ForkJoinPool 是如何通过“工作窃取（Work-Stealing）”算法提高多核 CPU 利用率的？",
    answer: {
      short: "Stream 的惰性求值是通过将多个中间操作（Filter/Map）连接成一个双向链表，在遇到终结操作（Collect/Reduce）时才触发一次性循环遍历实现的；并行流使用全局共享的 `ForkJoinPool.commonPool()`，将大任务拆分为子任务（Fork），在线程空闲时，工作窃取算法允许空闲线程从其他繁忙线程的双端队列尾部窃取任务执行，从而保障各 CPU 核心负载均衡。",
      thinkingProcess: "1. 惰性求值（Lazy Evaluation）实现：\n   - 中间操作（Intermediate Operations）：如 `filter()`, `map()`。它们**不执行任何实际的计算**。只是在内存中创建一个个 `PipelineHelper` 节点（具体的实现是 `AbstractPipeline` 子类），把它们串成一个双向链表。\n   - 终结操作（Terminal Operations）：如 `collect()`, `forEach()`, `findFirst()`。此时才会真正遍历数据源，把数据沿着链表依次往后输送，实现“单次循环、多个操作一次性处理完”，效率极高。\n2. Parallel Stream 与 ForkJoinPool（工作窃取）：\n   - 并行流把数据按照 `Spliterator` 切分成多段，提交给 JVM 默认的共享线程池 `ForkJoinPool.commonPool()` 执行。\n   - ForkJoin 采用分治法，大任务拆分（Fork）到线程独占的**双端队列（WorkQueue）**的头部，线程自己也从队列头部获取任务（LIFO，后进先出，适合局部缓存）。\n   - **工作窃取（Work-Stealing）**：当线程 A 把自己的队列任务清空了（空闲状态），为了榨干多核 CPU。它会**随机寻找一个繁忙线程 B，从线程 B 的队列尾部（FIFO，先进先出）偷一个任务**帮其执行。这极大地减少了多线程下因任务分配不均导致的线程饥饿和 CPU 闲置闲置。",
      structured: [
        "惰性链条构建：中间操作不计算，只构建 Pipeline 双向链表节点；终结操作触发迭代，数据沿链流转，消除了多次循环",
        "ForkJoin 分治思想：将数组流拆分为更细小的片段，通过递归分叉（Fork）与数据合并（Join）分配到独立的线程工作队列中",
        "工作窃取（Work-Stealing）：空闲线程从他人队列尾部（Tail）以 FIFO 规则窃取任务执行，避免了高负载线程局部饥饿",
        "共享 commonPool：并行流默认全应用共用全局单例 commonPool，线程池大小默认为 N_cpu - 1，容易被慢 I/O 堵塞"
      ]
    },
    keyPoints: ["Stream 惰性求值", "ParallelStream", "ForkJoinPool", "工作窃取", "双端队列 LIFO/FIFO", "commonPool 瓶颈"],
    traps: ["千万不要在默认的 Parallel Stream 中执行高延时的 I/O 阻塞操作（如发 HTTP 请求）。因为并行流共用同一个全局唯一的 `commonPool`，如果一个地方卡住，会导致全站的并行流操作（包括其他无关接口的 Map/List 处理）全部陷入死锁等待挂起"],
    relatedIds: ["interview_java_009", "interview_java_010"]
  },
  {
    id: "interview_java_026_future",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "CompletableFuture 异步编排与多任务并发合并",
    difficulty: 3,
    frequency: 4,
    question: "在配置化 Dashboard 等高并发网关接口中，需要并发调用多个外部微服务并对结果进行拼装。请说明 CompletableFuture 的核心设计，以及如何优雅实现“任务 A、B 并行执行，两者皆完成后执行任务 C，且任何一个抛异常都安全熔断”的业务编排？",
    answer: {
      short: "CompletableFuture 基于事件驱动和链式回调设计，实现了非阻塞式异步编排；通过 `CompletableFuture.supplyAsync()` 提交异步任务，使用 `thenCombine()` 合并 A、B 任务结果并在两者皆完时触发 C，利用 `exceptionally()` 或 `handle()` 方法对异常进行集中熔断和默认值兜底控制控制。",
      thinkingProcess: "1. 核心设计：传统的 `Future` 必须通过 `future.get()` 阻塞式获取结果（或者轮询 isDone），无法做回调。`CompletableFuture` 实现了 `Future` 和 `CompletionStage` 接口。当异步任务执行完后，主线程或 ForkJoin 线程会自动执行其注册的回调方法（如 `thenApply`, `thenAccept`），实现了非阻塞的事件驱动。\n2. 并行合并与熔断实战代码逻辑：\n   - 任务 A：`CompletableFuture<ResultA> futureA = CompletableFuture.supplyAsync(() -> callServiceA(), executor);`\n   - 任务 B：`CompletableFuture<ResultB> futureB = CompletableFuture.supplyAsync(() -> callServiceB(), executor);`\n   - 并行合并：\n     ```java\n     CompletableFuture<ResultC> futureC = futureA.thenCombine(futureB, (resA, resB) -> {\n         return combineAndCallC(resA, resB);\n     }).exceptionally(ex -> {\n         log.error(\"Service call failed, fallback value returned\", ex);\n         return defaultResultC; // 熔断降级兜底\n     });\n     ```\n   - 通过 thenCombine 能够保证 A 和 B 共享线程池并行执行，并在两个 Future 都有结果后，将两个结果传入 lambda 并触发 C 任务，实现了清晰、优雅的链式响应流处理。",
      structured: [
        "事件驱动架构（CompletionStage）：基于回调注册。当 Future 写入结果时自动沿 DAG（有向无环图）触发下一级，告别 get 阻塞",
        "异步提交（supplyAsync）：将任务投递至自定义线程池。若不传入线程池，则默认使用 ForkJoinPool.commonPool 容易造成阻塞",
        "合并算子（thenCombine）：并行分发 A、B 任务，等待两者都执行完毕后（And 关系），将两结果合成传给 C 进行汇聚",
        "全栈熔断防护（exceptionally）：集中拦截链路中产生的任何 RuntimeException。发生错误时输出降级兜底数据，隔离风险"
      ]
    },
    keyPoints: ["CompletableFuture", "异步编排", "thenCombine", "exceptionally 熔断", "链式回调", "线程池隔离"],
    traps: ["在高并发网关服务中，必须强制为 `CompletableFuture` 传入**自定义的隔离线程池**作为第二个参数。如果使用默认无参方法，底层会使用 commonPool，在大流量下会卡住系统其他关键计算"],
    relatedIds: ["interview_java_009", "interview_java_025_stream"]
  },
  {
    id: "interview_java_027_spring_cycle",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Spring Bean 生命周期与三级缓存循环依赖",
    difficulty: 4,
    frequency: 5,
    question: "请详述 Spring 中 Bean 的生命周期流程。Spring 是如何通过三级缓存（Three-Level Cache）机制来彻底解决单例 Bean 之间的循环依赖（Circular Dependency）问题的？三级缓存分别存了什么？",
    answer: {
      short: "Bean 生命周期包含实例化、属性填充、初始化和销毁四个阶段；三级缓存包括：一级缓存 singletonObjects（完整单例对象）、二级缓存 earlySingletonObjects（未属性填充的早期半成品对象）和三级缓存 singletonFactories（对象工厂，存储 ObjectFactory 生产代理对象）；解决循环依赖是依靠三级缓存存放工厂，在 AOP 代理场景下，通过三级缓存延迟生成早期代理对象并晋升二级缓存，从而打破循环等待。",
      thinkingProcess: "1. Bean 生命周期：\n   - 实例化（Instantiation）：`createBeanInstance` 反射构造实例。\n   - 属性注入（Populate）：`populateBean` 注入 @Autowired 依赖。\n   - 初始化（Initialization）：各种 Aware 接口回调 -> BeanPostProcessor 前置方法 -> InitializingBean / init-method -> BeanPostProcessor 后置方法（**在此处进行 AOP 代理生成**）。\n   - 销毁（Destruction）：DisposableBean -> destroy-method。\n2. 三级缓存结构：\n   - `singletonObjects`（一级）：完全初始化好的单例 Bean，可以直接使用。\n   - `earlySingletonObjects`（二级）：半成品 Bean（已实例化，但未填充属性）。\n   - `singletonFactories`（三级）：存 `ObjectFactory<?>` 早期对象工厂。用来应对 AOP 代理对象。\n3. 解决循环依赖工作流（以 A、B 互转为例）：\n   - 实例化 A。把 A 的 ObjectFactory 塞入三级缓存。开始填充属性，发现依赖 B，触发加载 B。\n   - 实例化 B。把 B 的 ObjectFactory 塞入三级缓存。填充属性，发现依赖 A。开始调用 `getBean(A)`。\n   - `getBean(A)` 首先查一级缓存（没有），查二级缓存（没有），查三级缓存（命中 A 的 ObjectFactory）。\n   - 执行 A 的 ObjectFactory.getObject()。如果是 AOP 代理类，**在此处提前生成 A 的早期代理对象**；如果非 AOP，返回原始半成品 A。将该早期对象塞入二级缓存，并清除三级缓存。\n   - B 成功拿到 A 的早期对象，顺利完成属性注入并初始化完成，成为完全体，塞入一级缓存。\n   - B 返回给 A。A 拿到完整 B，完成 B 的属性注入并完成初始化，A 成为完全体晋升一级缓存，完美解耦。",
      structured: [
        "生命周期大纲：Instantiation（实例化） -> Populate（属性赋值） -> Initialization（Aware及PostProcessor初始化） -> Destruction（销毁）",
        "一级缓存（singletonObjects）：终极形态。存储所有完成了属性注入、初始化回调、AOP 代理的完全体 Bean，面向用户",
        "二级缓存（earlySingletonObjects）：早期代理缓存。存储已被其他循环依赖 Bean 引用的早期半成品代理类，防止重复代理",
        "三级缓存（singletonFactories）：工厂解耦。存放 ObjectFactory 实例。主要用于在遇到循环依赖时，能动态判断是否触发 AOP 代理"
      ]
    },
    keyPoints: ["Spring 生命周期", "三级缓存", "循环依赖", "ObjectFactory", "AOP 早期代理", "BeanPostProcessor"],
    traps: ["三级缓存只能解决 **单例（Singleton）的属性注入（Setter 注入）** 循环依赖；对于 **构造器注入（Constructor 注入）** 产生的循环依赖，由于在第一步实例化阶段就已经卡死，三级缓存无法发挥作用，此时会报错 `BeanCurrentlyInCreationException`，必须使用 `@Lazy` 解决"],
    relatedIds: ["interview_java_004", "interview_java_029_spring_aop"]
  },
  {
    id: "interview_java_028_spring_cycle_limit",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "为什么二级缓存无法根治 AOP 下的循环依赖？",
    difficulty: 3,
    frequency: 4,
    question: "（追问）既然二级缓存已经能存放早期半成品对象，那为什么 Spring 还要设计三级缓存？如果没有三级缓存，只使用一级和二级缓存，在遇到 AOP（面向切面编程）代理时为什么会发生问题？",
    answer: {
      short: "因为 AOP 代理默认是在 Bean 初始化的最后阶段（BeanPostProcessor.postProcessAfterInitialization）才会生成的；如果不使用三级缓存（仅有一、二级缓存），Spring 就必须在 Bean 实例化后就立即无脑生成 AOP 代理，这违反了 Spring 设计的生命周期规范，即在 Bean 完全填完属性后再做 AOP 包装；三级缓存通过工厂延迟了 AOP 的触发时机，仅在真正发生循环依赖时才提前执行 AOP 包装。",
      thinkingProcess: "1. 规范要求：Spring 的设计初衷是让 Bean 在经历了完整的生命周期（实例化、属性赋值、Aware调用、init-method）之后，在最后一刻（初始化后）才进行 AOP 代理。如果一切正常（无循环依赖），Bean 应该在初始化阶段才升级为代理类。\n2. 二级缓存的物理硬缺陷：\n   - 如果只有二级缓存。二级缓存存的是什么？只能是具体的 `Object`（要么是原始半成品，要么是代理半成品）。\n   - 为了支持 AOP，在 `createBeanInstance`（实例化）一结束，我们就必须立刻调用 AOP 逻辑，判定这个类要不要被代理，并在二级缓存中存入它的代理对象。\n   - 危害：这就使得**所有的单例 Bean** 不管有没有循环依赖，在属性赋值之前就被强制变成了代理类。这直接打破了 Spring 的生命周期设计标准，且增加了不必要的性能开销。\n   - 引入三级缓存（ObjectFactory）后：实例化后只在三级缓存存一个“生成工厂”。如果不发生循环依赖，这个工厂里的 ObjectFactory.getObject() 永远不会被调用。Bean 依旧走正常的生命周期，在最后初始化阶段才生成 AOP 代理。只有当遭遇循环依赖，急需 A 对象时，才去触发三级缓存调用 getObject() 提前执行 AOP。所以三级缓存是为了**在不违背生命周期规范的前提下，优雅兼顾 AOP 代理**的绝妙设计。",
      structured: [
        "Spring 规范冲突：AOP 规范要求在 Bean 初始化末期才织入代理，而二级缓存机制会迫使代理在实例化期提早发生",
        "工厂延迟计算（三级缓存核心）：通过将 AOP 创建逻辑封装在三级缓存的 ObjectFactory 中，只有当其他 Bean 触发 getBean 时才执行",
        "二级缓存防重：一旦通过三级工厂生成了早期代理，立即推入二级缓存，后续其他地方再次引用时直接从二级获取，防止重复代理",
        "结论：三级缓存并非多余，而是作为“延迟加载工厂”，完美化解了“AOP 代理发生时机”与“循环依赖急需早期引用”的逻辑冲突"
      ]
    },
    keyPoints: ["三级缓存设计", "AOP 代理生成时机", "二级缓存局限", "延迟计算", "Spring 设计原则", "BeanPostProcessor"],
    traps: ["如果我们在 AOP 切面中使用了某些非常规的代理生成（如自定义的 BeanPostProcessor 直接替换了 bean 引用且没有遵循 Spring 的 AOP 暴露规范），会导致二级缓存和一级缓存对象地址不一致，Spring 依然会报初始化失败异常"],
    relatedIds: ["interview_java_027_spring_cycle"]
  },
  {
    id: "interview_java_029_spring_aop",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Spring AOP 实现机制：JDK 动态代理与 CGLIB",
    difficulty: 3,
    frequency: 5,
    question: "Spring AOP 的底层实现原理是怎样的？它在什么场景下会选用 JDK 动态代理（JDK Dynamic Proxy），在什么场景下会选用 CGLIB？两者的底层字节码生成机制有什么本质区别？",
    answer: {
      short: "Spring AOP 基于动态代理实现：当目标类实现了接口时，默认采用 JDK 动态代理；若目标类没有实现接口，则选用 CGLIB。JDK 动态代理利用 InvocationHandler 动态生成接口的实现类字节码；CGLIB 通过 ASM 字节码技术在内存中动态生成目标类的子类以覆盖非 final 方法。",
      thinkingProcess: "1. 实现机制对比：\n   - **JDK 动态代理**：\n     - 要求目标类**必须实现至少一个接口**。\n     - 底层：使用 `Proxy.newProxyInstance(...)`。JVM 通过反射和符号拼接动态生成一个类（通常是 $Proxy0 ），它**继承了 `java.lang.reflect.Proxy` 并实现了目标类的接口**。反射调用通过 `InvocationHandler` 进行拦截拦截。\n   - **CGLIB 字节码生成**：\n     - 如果目标类没有实现接口。JDK 动态代理直接无法用。Spring 采用 CGLIB（Code Generation Library）。\n     - 底层：利用开源的 **ASM 字节码框架**，直接在内存中动态生成目标类的一个**子类（Subclass）**。子类重写了父类的所有非 final、非 private 方法，通过 MethodInterceptor 执行代理逻辑。\n2. 效率与限制：\n   - JDK 代理只能代理接口方法，不能代理类内部的普通方法。由于是继承 Proxy，Java 不支持多继承，限制多。\n   - CGLIB 无法代理被标记为 `final` 的类和方法，因为子类无法继承或重写它们。\n   - 在早期 JDK 版本中，CGLIB 生成类慢但执行快（反射跳转少），JDK 动态代理生成快但执行慢（依赖反射）。在现代 JDK（JDK 8+）中，随着 JVM 对反射和 InvocationHandler 调用的极致调优，JDK 动态代理的性能已经赶上甚至超越了 CGLIB。Spring Boot 2.x 起为了避免接口方法遗漏导致类型强转报错，默认无脑使用 CGLIB 代理。",
      structured: [
        "代理选择法则：实现接口选 JDK 动态代理（可通过 proxyTargetClass=true 强开 CGLIB）；未实现接口选 CGLIB",
        "JDK 代理本质（接口重构）：JVM 动态生成实现目标接口的 $Proxy 类，内部通过 InvocationHandler 反射调用切面逻辑",
        "CGLIB 代理本质（子类重写）：基于 ASM 框架在内存动态生成目标类的子类。子类拦截并重写非 final 方法，通过 MethodInterceptor 回调",
        "Spring Boot 2.x 默认更变：默认全部改为 CGLIB 进行类代理，避免了因接口实现类转型（Type Cast）引起的 ClassCastException"
      ]
    },
    keyPoints: ["Spring AOP", "JDK 动态代理", "CGLIB 代理", "ASM 字节码", "MethodInterceptor", "InvocationHandler"],
    traps: ["在类内部进行方法自调用时（如方法 A 内直接调用方法 B ），由于 AOP 代理是建立在代理类之上的，方法 A 内部的 `this.B()` 调用会绕过代理类，直接导致方法 B 上的 `@Transactional` 事务或 `@Cacheable` 缓存注解失效失效，必须通过 `AopContext.currentProxy()` 强行获取代理对象调用"],
    relatedIds: ["interview_java_020_reflect", "interview_java_028_spring_cycle_limit"]
  },
  {
    id: "interview_java_030_spring_mvc",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Spring MVC 核心工作流程全景",
    difficulty: 2,
    frequency: 4,
    question: "请详细阐述 Spring MVC（DispatcherServlet）接收一个 HTTP 请求到最终返回 HTTP 响应的完整核心工作流流程？各核心组件在其中扮演了什么角色？",
    answer: {
      short: "Spring MVC 工作流如下：1. DispatcherServlet 拦截 HTTP 请求并委托给 HandlerMapping；2. HandlerMapping 根据 URL 匹配找到对应的 HandlerExecutionChain（包含 Interceptor 和 Handler）；3. DispatcherServlet 调用 HandlerAdapter 适配器；4. HandlerAdapter 执行 Controller 业务方法返回 ModelAndView（或由 HttpMessageConverter 转化 JSON）；5. 渲染视图或输出内容返回返回。",
      thinkingProcess: "1. 核心流程步骤：\n   - **第一步**：客户端发请求到前端控制器 `DispatcherServlet`。它是整个 Spring MVC 的大总管（核心分发中心）。\n   - **第二步**：DispatcherServlet 收到请求，调用 `HandlerMapping`（处理器映射器）。HandlerMapping 查表找到该请求归属于哪个 Controller（具体为某个 HandlerExecutionChain，包含过滤器拦截器 HandlerInterceptor 链和 Controller 处理器对象）。\n   - **第三步**：DispatcherServlet 拿到了 Handler。为了抹平不同 Controller（基于类、注解、或简单方法）的方法签名差异，它调用 `HandlerAdapter`（处理器适配器）。\n   - **第四步**：HandlerAdapter 负责执行拦截器的 preHandle，然后正式执行 Controller 中的业务方法，返回 `ModelAndView`（包括 Model 数据和 View 视图逻辑名）。\n   - **第五步**：如果是前后端分离接口（带了 `@ResponseBody`），HandlerAdapter 会在内部直接调用 `HttpMessageConverter`（如 Jackson 转换器）把返回值转为 JSON 字符串，写入 HTTP 响应体，直接返回，不再走后续视图解析。\n   - **第六步（传统模板）**：若有 ModelAndView，DispatcherServlet 派发给 `ViewResolver`（视图解析器）进行物理视图文件定位并进行 Model 数据填充渲染，生成 HTML，最终响应返回客户端。",
      structured: [
        "前端控制转发（DispatcherServlet）：作为全局唯一的流量入口，拦截所有的 HTTP Web 请求，承担全局路由分配与统筹",
        "处理器路由寻找（HandlerMapping）：根据映射配置查找具体处理该 URL 的 Handler 节点，并带回拦截器链集合",
        "适配器调用（HandlerAdapter）：适配不同的 Controller 签名规范，执行 HandlerInterceptor 链，调用 Controller 业务逻辑",
        "HttpMessageConverter 转换：若加了 @ResponseBody，直接调用 HttpMessageConverter（如 Jackson）格式化为 JSON 吐回"
      ]
    },
    keyPoints: ["Spring MVC 流程", "DispatcherServlet", "HandlerMapping", "HandlerAdapter", "ModelAndView", "HttpMessageConverter"],
    traps: ["当在 Spring MVC 拦截器 `HandlerInterceptor` 的 `preHandle` 方法中返回了 `false` 时，请求会被立即拦截。此时注意：依然会按**逆序执行之前已经执行成功的拦截器的 `afterCompletion` 方法**进行资源清理，必须确保该清理方法健壮防 NPE"],
    relatedIds: ["interview_java_029_spring_aop"]
  }
];

const segment3 = [
  {
    id: "interview_java_031_tx_failure",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "Spring @Transactional 事务失效高频场景",
    difficulty: 3,
    frequency: 5,
    question: "在实际 SpringBoot 业务开发中，有哪些典型场景会导致 `@Transactional` 声明式事务失效或不回滚？请分析其底层的代理拦截成因并给出修复对策。",
    answer: {
      short: "声明式事务失效主要源于：1. 方法自调用（绕过代理类）；2. 非 public 方法（AOP 拦截限制）；3. 异常被内部 try-catch 吞掉；4. 默认只针对 RuntimeException 回滚而抛出了受检异常；5. 数据库引擎本身不支持事务（如 MyISAM）；对策是使用 AopContext.currentProxy() 显式调用、配置 rollbackFor = Exception.class，或将抛异常逻辑抛出拦截线外。",
      thinkingProcess: "1. 代理失效成因：Spring 事务底层基于 AOP 动态代理。当外界调用 `proxy.method()` 时，代理类会在执行前开启事务，执行后根据结果 commit 或 rollback。\n2. 失效高频场景分析：\n   - **同类自调用**：在类 `ServiceA` 中，方法 `a()` 直接调用 `this.b()`（b 带有 @Transactional）。由于 `this` 指向的是原始目标对象而不是代理类，没有触发 Spring 的增强代码，事务失效。对策：使用 `((ServiceA) AopContext.currentProxy()).b()`，或者注入自己 `self.b()`。\n   - **非 public 方法**：Spring 事务在解析切面属性时，明确规定只能拦截 public 方法（`ComputeTransactionAttribute` 会做权限校验），对非 public 方法使用 @Transactional 静态校验会忽略，导致失效。\n   - **异常被吞**：Controller 或 Service 层做了 try-catch 却没有在 catch 块中重新抛出 `RuntimeException` 或 `Error`，Spring 无法监测到异常，判定执行成功直接 commit。\n   - **受检异常不回滚**：Spring 默认的回滚规则是 `rollbackOn(Throwable ex)` 中只判定 `ex instanceof RuntimeException || ex instanceof Error`。若抛出的是 `IOException` 或自定义的 `Exception`，默认是不回滚的。对策：配置 `@Transactional(rollbackFor = Exception.class)`，强制扩充回滚范围。",
      structured: [
        "内部调用拦截失效：方法内调用同类下的另一事务方法，因绕过 Proxy 直接调用 this，使切面通知完全失效",
        "方法权限屏障：@Transactional 注解在 private/protected 方法上，AOP 编译器判定权限非法自动忽略拦截",
        "异常处理吞没：内部 try-catch 捕获异常后不 throw 抛出，或者返回了 error-code 导致 Spring 判定执行成功执行 commit",
        "回滚规则不合规：默认仅对非受检异常（RuntimeException/Error）执行回滚，若抛出受检异常需用 rollbackFor 指定扩充"
      ]
    },
    keyPoints: ["Spring 事务失效", "@Transactional", "AopContext 代理自调用", "rollbackFor 异常扩充", "非 public 方法限制", "AOP 切面原理"],
    traps: ["如果将 `@Transactional` 配置在被异步执行的方法（如 `@Async`）上，事务在多线程异步环境下会由于无法共享当前线程的 `ThreadLocal Connection` 发生数据隔离问题，导致数据库连接和事务范围失控，切记不要混用"],
    relatedIds: ["interview_java_029_spring_aop"]
  },
  {
    id: "interview_java_032_boot_autocfg",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Spring Boot 自动装配原理",
    difficulty: 3,
    frequency: 5,
    question: "Spring Boot 的“自动装配（Auto-Configuration）”是如何工作的？请结合 `@EnableAutoConfiguration` 和 `spring.factories`（或 JDK 17+ 的 imports）进行原理解析。",
    answer: {
      short: "自动装配是通过 `@SpringBootApplication` 下的 `@EnableAutoConfiguration` 激活，利用 `AutoConfigurationImportSelector` 扫描类路径下所有 jar 包的 `META-INF/spring.factories`（新版为 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports）中配置的 AutoConfiguration 类，并通过条件注解（如 @ConditionalOnClass）按需将 Bean 装载入 IOC 容器。",
      thinkingProcess: "1. 核心注解：`@SpringBootApplication` 是一个复合注解，包含 `@SpringBootConfiguration`、`@ComponentScan` 和 `@EnableAutoConfiguration`（核心）。\n2. 装配流程：\n   - `@EnableAutoConfiguration` 引入了 `@Import(AutoConfigurationImportSelector.class)`。\n   - `AutoConfigurationImportSelector` 的 `selectImports` 方法会被 Spring 容器在启动时调用。\n   - 扫描读取：读取 ClassLoader 下所有 jar 里的 `META-INF/spring.factories`。该文件是 KV 格式，其中 Key 是 `org.springframework.boot.autoconfigure.EnableAutoConfiguration`，Value 是大批 Configuration 实现类的全类名。JDK 17+（Spring Boot 3.x）改为了读取 `org.springframework.boot.autoconfigure.AutoConfiguration.imports` 配置文件。\n   - **条件过滤（Conditional机制）**：获取到上百个候选配置类后，利用 `@ConditionalOnClass`（类路径有该类才加载）、`@ConditionalOnMissingBean`（容器无该 bean 才加载）、`@ConditionalOnProperty`（配置文件有该配置项才加载）进行条件判定。只有符合当前 jar 依赖和配置要求的配置类才会真正生效，完成 Bean 注册，实现了“开箱即用”。",
      structured: [
        "EnableAutoConfiguration 驱动：作为自动装配的开关，通过 @Import 机制引入 selector 装载组件",
        "配置文件扫描：扫描所有 jar 包里的 `spring.factories` 或 `imports`，整理出候选的配置类全路径列表",
        "条件注解判定（Conditional）：根据 Classpath 中是否存有对应的底层类、容器中是否缺失该 Bean 等状态动态决策装载",
        "按需注入实现：满足条件的候选类被注册进 Spring 容器，实现从基础连接池到 RedisTemplate 各种组件的开箱即用"
      ]
    },
    keyPoints: ["Spring Boot 自动装配", "@EnableAutoConfiguration", "spring.factories 扫描", "Conditional 条件注解", "imports 导入", "IOC 初始化"],
    traps: ["在写自定义 Starter 时，如果把配置类放在了主程序的包扫描范围之外，且忘记在 `spring.factories` 注册，Spring Boot 启动时将完全无法识别并加载该 starter Bean，必须规范配置"],
    relatedIds: ["interview_java_027_spring_cycle"]
  },
  {
    id: "interview_java_033_mybatis_cache",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "MyBatis 一级缓存与二级缓存失效场景",
    difficulty: 3,
    frequency: 4,
    question: "请详述 MyBatis 的一级缓存与二级缓存的工作原理。在什么场景下会导致缓存失效？为什么生产环境中大多建议关闭 MyBatis 二级缓存？",
    answer: {
      short: "一级缓存是 SqlSession 级别的本地缓存（默认开启），在同一个事务或会话内有效；二级缓存是 Mapper（Namespace）级别的跨会话缓存，需手动开启并要求实体类序列化；一级缓存失效源于会话关闭、执行 commit/update 写操作或清空缓存；建议关闭二级缓存是因为在多表关联查询或分布式环境下极易读到脏数据。",
      thinkingProcess: "1. 一级缓存原理与失效：\n   - 原理：基于 `PerpetualCache` 的 HashMap 实现。同一个 SqlSession 执行相同 SQL 时，直接读缓存。\n   - 失效场景：不同 SqlSession 之间不共享；同一个会话中执行了 `update/insert/delete` 操作并提交，缓存会被清空防止脏读；手动调用 `sqlSession.clearCache()`。\n2. 二级缓存原理与致命问题：\n   - 原理：多个 SqlSession 共享同一个 Mapper 命名空间下的缓存。提交事务后，数据才会从暂存区写入二级缓存。\n   - **致命脏读缺陷**：MyBatis 二级缓存的粒度是按 **Namespace** 划分的。如果进行了多表关联查询（如在 UserMapper 里 query 关联了 Class 部门表）。一旦在 ClassMapper 中对部门表执行了修改更新，由于 ClassMapper 和 UserMapper 是两个完全独立的 Namespace，UserMapper 里的二级缓存**完全无法感知部门表已被修改**，继续返回旧的缓存数据。这导致了严重的业务脏数据，所以微服务分布式架构中必须关闭二级缓存，全部交给 Redis 管理。",
      structured: [
        "一级缓存（SqlSession范围）：生命周期绑定当前会话。一旦执行 update 写入或 commit 会话，缓存全局清空",
        "二级缓存（Namespace范围）：跨 SqlSession 共享。要求实体实现 Serializable 接口，事务 commit 后缓存写入生效",
        "关联脏读死结：多表关联查询下，跨 Namespace 的写入无法使另一方的二级缓存失效，发生严重的业务数据不一致",
        "分布式失效：多台应用服务器之间无法同步本地缓存，集群架构下必然导致脏读，全部推荐用分布式缓存方案替代"
      ]
    },
    keyPoints: ["MyBatis 一级缓存", "二级缓存脏读", "SqlSession 本地缓存", "Namespace 隔离", "序列化要求", "分布式缓存替换"],
    traps: ["一级缓存在 Spring 集成环境下，如果**没有开启事务**，每次执行 SQL 都会创建一个新的 SqlSession 来完成查询并关闭，导致一级缓存当场失效，必须开启 `@Transactional` 事务才能让一级缓存生效"],
    relatedIds: ["interview_java_031_tx_failure"]
  },
  {
    id: "interview_java_034_shard",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "java",
    title: "ShardingSphere 分库分表分片策略与分布式事务",
    difficulty: 4,
    frequency: 3,
    question: "当单表数据达到千万级需要进行分库分表时，ShardingSphere 支持哪些常见的分片算法（Sharding Algorithm）？它是如何保障跨库分布式事务一致性的？",
    answer: {
      short: "ShardingSphere 支持标准分片（单分片键，支持精确、范围）、复合分片（多分片键）和 Hint 分片（强制分片路由）等分片策略；分布式事务上，它集成了 LOCAL（弱一致性本地事务）、XA（强一致性两阶段提交，如 Atomikos）和 BASE（柔性一致性，如 Seata SAGA/AT 模式）来保障跨库数据一致性。",
      thinkingProcess: "1. 分片算法：\n   - StandardShardingAlgorithm：适用于单个分片键的场景，支持 `=`、`IN`（PreciseShardingValue）和 `BETWEEN AND`（RangeShardingValue）过滤路由。\n   - ComplexShardingAlgorithm：复合分片，支持多分片键。用于复杂的业务多维度拆分路由。\n   - HintShardingAlgorithm：脱离 SQL 限制，通过 Java 代码 `HintManager` 强制将读写请求路由到指定物理库表。\n2. 分布式事务解决保障：\n   - **LOCAL 本地事务（默认）**：ShardingSphere 会并发给多个库表发送 SQL，若其中一个失败，已成功的无法回滚，只适合对一致性要求不高的场景。\n   - **XA 强一致事务**：集成 Atomikos/Narayana 事务管理器，基于二阶段提交（2PC）。准备阶段所有库 Lock 数据并反馈，提交阶段统一 commit。保证强一致，但由于占用锁时间长，高并发吞吐率极低。\n   - **BASE 柔性事务**：集成 **Seata** 框架。采用 AT 模式（通过 undo_log 自动生成反向 SQL 回滚）或 SAGA 模式。无长期锁占用，并发性能好，保证最终一致性。",
      structured: [
        "标准分片策略（Standard）：单主键路由。提供精确匹配与区间范围扫描，常基于 hash 取模或时间范围拆分",
        "复合与 Hint 路由：复合分片支持联合主键路由；Hint 机制支持在业务层写死强路由，避开 SQL 解析限制",
        "XA 强一致事务（2PC）：基于两阶段提交保证多物理库事务一致性，性能较差，适合金融转账等小并发交易",
        "BASE 最终一致（Seata）：集成 Seata，使用无锁 AT 模式。通过 undo_log 自动生成反向 SQL 回滚，并发性能佳"
      ]
    },
    keyPoints: ["ShardingSphere", "分片算法", "XA 强一致", "Seata AT 最终一致", "Hint 强制路由", "分布式事务"],
    traps: ["在进行分库分表后，分片键（Sharding Key）的修改是绝对禁止的。如果强行 update 分片键，会导致原本的数据物理路由发生错乱，必须先 delete 原数据，再 insert 新数据以完成分片偏移"],
    relatedIds: ["interview_java_031_tx_failure"]
  },
  {
    id: "interview_java_035_cow_list",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "CopyOnWriteArrayList 读写锁分离及弱一致迭代器",
    difficulty: 3,
    frequency: 3,
    question: "请详述 Java 中 CopyOnWriteArrayList 的线程安全实现机制。为什么它的写操作开销极大，而读操作速度惊人？为什么说它的迭代器（Iterator）是“弱一致性”的？",
    answer: {
      short: "CopyOnWriteArrayList 采用“写时复制”机制实现线程安全：读操作完全不上锁，直接读取底层的 volatile 数组引用；写操作（add/set）必须使用 ReentrantLock 加锁，并物理拷贝一个全新容量加一的数组，在副本上修改后将底层 volatile 指针指向新数组；其迭代器是弱一致性的，因为它在创建时绑定了当时的老数组快照，迭代期间发生的写入修改无法在迭代中呈现，但也杜绝了 ConcurrentModificationException 异常。",
      thinkingProcess: "1. 读写安全机制：\n   - **读无锁**：`public E get(int index) { return getArray()[index]; }`。由于底层 `array` 变量被 `volatile` 修饰，任何指针指向的变化能立刻被所有线程可见。读是纯内存读取，速度极快。\n   - **写独占拷贝**：写操作加锁（`final transient ReentrantLock lock = this.lock;`）。\n     `Object[] elements = getArray();`\n     `Object[] newElements = Arrays.copyOf(elements, len + 1);`（物理复制新数组，大数组时非常消耗 CPU 和内存空间）\n     `newElements[len] = e;`\n     `setArray(newElements);`（CAS/写屏障把 array 指向新数组，释放锁）。\n2. 弱一致性迭代器原理：\n   - 当调用 `iterator()` 时，返回的 `COWIterator` 会在构造器中**保留当时老数组的引用快照**：`final Object[] snapshot;`。\n   - 之后，无论其他线程如何 add/delete 数组，它们修改的都是拷贝后的新数组，老快照数组的内容绝对不会改变。\n   - 迭代器沿着 `snapshot` 遍历。所以是弱一致的（读到了旧数据）。好处是无锁且安全，不会触发 `ConcurrentModificationException` 抛错异常。",
      structured: [
        "读写分离（写时复制）：读操作零加锁，极致释放读并发性能；写操作全局排他，拷贝副本改写，保障写隔离",
        "物理开销沉重：大容量列表发生频繁写操作时，会导致内存高频产生大数组物理拷贝，增加垃圾回收和内存抖动压力",
        "弱一致性快照（Snapshot）：迭代器直接绑定创建时刻的旧数组实体，遍历过程中感知不到任何并发写入修改",
        "并发修改异常免杀：由于迭代器读写在物理隔离的两个数组上进行，绝对不会发生多线程并发修改引起的 C.M.E 异常"
      ]
    },
    keyPoints: ["CopyOnWriteArrayList", "写时复制", "volatile 数组", "弱一致性迭代器", "无锁并发读", "内存抖动"],
    traps: ["如果在高频写的场景（如大并发网络连接列表中）选用 CopyOnWriteArrayList，会导致堆内存中频繁创建销毁大 byte 数组，触发高频 Young GC 甚至是 Full GC 卡顿，写频繁场景建议改用 `ConcurrentHashMap.newKeySet()`"],
    relatedIds: ["interview_java_007", "interview_java_015_volatile"]
  },
  {
    id: "interview_java_036_cpu_100",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "线上 JVM CPU 100% 满负载故障排查五步法",
    difficulty: 3,
    frequency: 5,
    question: "如果线上 JVM 服务器突然 CPU 占用率达到 100%，请结合 Linux top 命令和 JVM 的 jstack 工具，详述排查并定位到具体 Java 业务代码行的五步法排查步骤。",
    answer: {
      short: "排查步骤如下：1. 使用 `top` 命令找到占用 CPU 最高的 Java 进程 PID；2. 使用 `top -Hp <PID>` 查出该进程内占用 CPU 最高的线程 TID；3. 使用 `printf '%x\n' <TID>` 将线程十进制 PID 转换为十六进制 hex 格式；4. 使用 `jstack <PID> > dump.txt` 导出线程堆栈日志；5. 在 dump 中搜索刚才的十六进制十六进制线程 ID，精准定位对应的 Java 业务代码行和线程状态。",
      thinkingProcess: "1. 真实故障排查逻辑梳理：\n   - **第一步（锁进程）**：执行 `top`，按 `P` 键（按 CPU 使用率排序），找出那个 CPU 爆表的 Java 进程，记下 PID（如 8888）。\n   - **第二步（锁线程）**：执行 `top -Hp 8888`。这个命令会展示 8888 进程下的所有轻量级线程。找出 CPU 占比最高的那个线程的 PID（在 Linux 下线程也是 task 也有 PID，其实就是 TID，例如 8912）。\n   - **第三步（格式转换）**：由于 jstack 导出的堆栈日志中，线程 ID（nid）使用的是十六进制表示。必须把十进制的 8912 换成十六进制。执行 `printf \"%x\n\" 8912`，得到 `22d0`。\n   - **第四步（抓堆栈）**：执行 `jstack 8888 > thread_dump.txt`。获取当前 JVM 的瞬时线程快照。\n   - **第五步（精确定位）**：打开 thread_dump.txt，全局搜索 `nid=0x22d0`（注意带上 0x 前缀）。定位到对应的线程描述，可以看到它是 `TASK_RUNNING` 状态并紧跟着展示了调用栈：`com.service.UserService.checkLimit(UserService.java:128)`。一眼判定 128 行代码里出现了死循环（如 while 写错了退出条件）或复杂的计算操作，大功告成。",
      structured: [
        "第一步：top 锁定故障进程。定位整机 CPU 占用绝对主力 Java 进程的 PID 号",
        "第二步：top -Hp PID 锁定真凶线程。展开线程视图，识别高频空转线程的 LWP 物理 ID（十进制）",
        "第三步：printf '%x' 转换十六进制。将 LWP 线程号换算为 16 进制小写，匹配 jstack 的 nid 规范",
        "第四步：jstack 强吐线程堆栈。执行 `jstack PID > stack.txt` 输出系统实时栈信息供线下审计",
        "第五步：grep nid 定位代码行。在堆栈文本中搜索刚才算出的 16 进制 ID，秒级锁定触发高载的类名和具体行号"
      ]
    },
    keyPoints: ["CPU 100% 排查", "top -Hp 命令", "printf 16进制转换", "jstack 堆栈", "nid 线程定位", "死循环排查"],
    traps: ["在执行 `top -Hp` 时，如果看到几个高 CPU 线程的 nid 搜索出来是 `VM Thread` 或 `GC task thread#`，这说明 CPU 100% 并不是业务死循环导致的，而是发生了垃圾回收 OOM 引起的频繁 GC 抖动（GC线程在狂转刷内存），下一步应立即排查 JVM 内存和 GC 日志"],
    relatedIds: ["interview_java_009", "interview_java_037_jvm_oom"]
  },
  {
    id: "interview_java_037_jvm_oom",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "JVM 线上内存溢出（OOM）根源分类与排查",
    difficulty: 3,
    frequency: 5,
    question: "在 JVM 线上运行中，常见的 OOM（OutOfMemoryError）异常有哪些类型？请分别指出它们的物理发生区域、常见诱因及排查定位手段。",
    answer: {
      short: "常见 OOM 包含：1. java.lang.OutOfMemoryError: Java heap space（堆溢出，内存泄漏或大对象堆积）；2. Metaspace（元空间溢出，动态加载 Class 数量超限）；3. GC overhead limit exceeded（GC 效率极低且内存已满）；4. Direct buffer memory（堆外直接内存溢出，NIO 未安全释放）；排查依靠 JVM 启动参数配置自动 Dump 并使用 MAT/JProfiler 分析内存大根。",
      thinkingProcess: "1. OOM 种类深入剖析：\n   - **Java heap space（堆溢出）**：对象太多，GC 无法回收。诱因：代码有内存泄漏（如静态 Map 狂塞数据不清理、ThreadLocal 未 remove），或者瞬时读取了超大容量的数据（如大报表未做分页）。\n   - **Metaspace（元空间溢出）**：方法区爆掉。诱因：引入了大量动态生成字节码的框架（CGLIB/Reflection/Groovy），或者频繁发布且不重启 JVM 导致类卸载失败积压。\n   - **GC overhead limit exceeded**：GC 占了 98% 以上的 CPU 时间，但回收掉的内存不足 2%。这预示着堆内存极度饱和，JVM 濒临假死状态，主动自我熔断。\n   - **Direct buffer memory**：堆外直接内存超限。诱因：NIO mmap/Netty 申请了直接内存却没有被 GC 回收（Cleaner 机制失效）。\n2. 排查实战铁律：\n   - 生产必须配置 `-XX:+HeapDumpOnOutOfMemoryError` 和 `-XX:HeapDumpPath=/data/logs/`。\n   - 一旦挂掉，拿到 `.hprof` 镜像文件。导入 **MAT (Memory Analyzer Tool)**。使用 Leak Suspects 分析，查看最大的 Dominator Tree（支配树）大节点，查看是什么类占用了 90% 的堆，直接顺藤摸瓜在代码里搜该类名定位解决。",
      structured: [
        "Java heap space 堆溢出：堆物理内存用尽。常见于内存泄漏、长生命周期大集合积压或大批大表无分页加载",
        "Metaspace 元空间溢出：元空间内存超限。多发生于反射生成Accessor类泛滥、动态 CGLIB 类加载器过多且无法卸载",
        "GC limit exceeded 预警熔断：JVM 自我保全机制。98% CPU 时间都在做 GC 且仅收回不到 2% 空间时直接自我抛错",
        "Direct buffer 堆外溢出：JVM 堆外本地物理内存打满。典型诱因为 NIO 直接内存分配过大且 Full GC 未被触发导致回收链条断裂"
      ]
    },
    keyPoints: ["OutOfMemoryError", "Java heap space", "Metaspace 元空间", "GC overhead limit", "Direct buffer 堆外", "MAT 分析工具"],
    traps: ["当发生 Metaspace OOM 时，有些开发者盲目调大 JVM 堆大小（如把 -Xmx 从 4G 改到 8G），这完全是南辕北辙的做法，因为元空间用的是堆外物理内存，调大堆大小反而会挤占操作系统留给元空间的空间，加速崩溃，应调大 `-XX:MaxMetaspaceSize`"],
    relatedIds: ["interview_java_003", "interview_java_008", "interview_java_036_cpu_100"]
  },
  {
    id: "interview_java_038_g1_3color",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "G1 垃圾回收三色标记法与 SATB 机制",
    difficulty: 4,
    frequency: 4,
    question: "在 G1/CMS 垃圾收集器并发标记阶段，如何利用三色标记（Tri-color Marking）算法追踪可达性？什么是“漏标（Lost Object）”？G1 是如何利用 SATB（原始快照）和写屏障（Write Barrier）防范漏标的？",
    answer: {
      short: "三色标记将对象分为白（未访问）、灰（自身访问但子引未访）、黑（自身及子皆访完）；漏标发生在并发标记时黑引用指向白且灰断开了与该白的引用；G1 采用原始快照（SATB）机制，在灰断开白的瞬间触发写屏障将白引用放入 satb_draft_queue 队列，并在最终标记阶段强行将这些白标记为灰色重新追踪，从而消除了漏标可能。",
      thinkingProcess: "1. 三色标记定义：\n   - 白色：尚未被 GC roots 访问到的对象。GC 结束后，白色对象会被当成垃圾清除。\n   - 灰色：已被访问过，但它引用的其他对象还没有全部被访问完。是追踪的“前沿阵地”。\n   - 黑色：已被访问过，且它引用的所有对象也已经完成了可达性分析。黑色不能直接指向白色，黑色的 present 表示安全。\n2. 漏标（Lost Object）发生条件（必须同时满足）：\n   - 条件一：赋值器插入了从黑色对象到白色对象的新引用。\n   - 条件二：赋值器删除了所有从灰色对象到该白色对象的直接或间接引用。\n   - 结果：由于黑色已经扫描完不会再扫，灰色又断开了引用，导致该白色对象被 GC 漏掉，惨遭误杀清除，程序崩溃。\n3. G1的解决武器 - SATB (Snapshot-At-The-Beginning，原始快照)：\n   - 关注**条件二的破坏**。在并发标记开始时做个逻辑快照。\n   - **写屏障（Write Barrier）**：每当应用线程执行 `field = null`（试图断开灰色到白色的引用）时，JVM 会触发 G1 的 pre-write barrier，强行把即将被断开的这个**旧引用指向的对象指针（白色对象）拦下，塞入当前线程绑定的 `satb_draft_queue` 队列中**。\n   - 最终标记阶段（Remark，需要 STW），G1 会扫描这些队列，把队列里的对象强行标记为灰色，重新进行扫描。这就保证了在并发标记开始时活着的任何对象在 GC 结束时都不会被漏标误杀，确保了安全性。",
      structured: [
        "三色逻辑着色：白色（未标记垃圾候选）、灰色（前线扫描中）、黑色（完全扫描存活，GC安全状态）",
        "并发标记漏标危机：黑色对象被应用注入指向白色的新指针，且同时灰色到该白色的旧引用被切断，导致白被漏标误杀",
        "G1 写屏障拦截（Write Barrier）：在执行字段赋值覆写瞬间强行介入，将旧有被切断的白色引用对象劫持",
        "SATB 原始快照（Remark 强追）：将劫持的引用记录在 `satb_queue` 中，Remark 阶段全部强行染灰重新追踪防误杀"
      ]
    },
    keyPoints: ["三色标记法", "漏标 Lost Object", "SATB 原始快照", "写屏障 Write Barrier", "并发标记", "GC Roots"],
    traps: ["CMS 垃圾回收器使用的是“增量更新（Incremental Update）”算法来防漏标（破坏条件一，记录黑指向白的新引用）。而 G1 使用 SATB（破坏条件二，记录灰断开白的旧引用）。因为 SATB 不需要像增量更新那样在 Remark 阶段去重新深度扫描整颗黑色引用链，所以 G1 的 Remark STW 时间相比 CMS 短且稳定许多"],
    relatedIds: ["interview_039", "interview_java_006"]
  },
  {
    id: "interview_java_039_virtual_thread",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "Java 21 虚拟线程（Project Loom）实现机制",
    difficulty: 4,
    frequency: 4,
    question: "JDK 21 强力推出了协程实现——虚拟线程（Virtual Threads）。请问虚拟线程与传统的平台线程（Platform Thread）有什么区别？它是如何在内核线程之上调度和运行的？什么是 Continuation？",
    answer: {
      short: "平台线程是操作系统的 1:1 内核线程，创建和切换开销达微秒级；虚拟线程是 JVM 维护的 M:N 用户态轻量级线程，创建仅需几十字节；其底层通过一个 ForkJoinPool 平台线程池作为载体线程（Carrier Thread）进行分发调度，利用 Continuation（延续性）机制在遇到 I/O 阻塞时将执行栈挂起并剥离载体线程，在 I/O 就绪后重新挂载恢复执行。",
      thinkingProcess: "1. 架构区别：\n   - 传统平台线程（Platform Thread）：包装了操作系统的内核线程，1:1 映射。线程多（如 >2000 个）会导致系统上下文切换消耗 40% 以上 CPU 算力，且每个线程默认占 1MB 栈空间。\n   - 虚拟线程（Virtual Thread）：JVM 自主管理的用户态线程。占内存极小（几百字节起）。可以轻松开辟百万个而不发生系统内存溢出。\n2. 调度模型（Carrier Thread 载体线程）：\n   - 虚拟线程的执行必须绑定在一个平台线程上。这个平台线程称为 **载体线程（Carrier Thread）**。JVM 默认使用一个 ForkJoinPool 管理这些载体线程。\n3. Continuation（延续性）运行秘密：\n   - Continuation 是虚拟线程的底层灵魂，它记录了当前代码的**“执行上下文快照（调用栈、PC指针、局部变量）”**。\n   - 当虚拟线程执行阻塞 I/O 操作时（例如调用 `Socket.read()`），底层已被 JDK 改装为非阻塞通道。虚拟线程会调用 `Continuation.yield()`，**强行把当前线程执行栈的数据从载体线程上拷贝下来（脱水），保存到 JVM 堆中**，载体线程变为空闲，立刻去调度执行其他虚拟线程。\n   - 当底层的网络数据包就绪后，JVM 唤醒 Continuation，把堆中保存的执行栈重新**拷贝回载体线程上（复水）**，并修改程序计数器 PC，虚拟线程从上次卡住的 read 代码行之后继续无缝运行，实现了同步编码、异步执行的高效无锁吞吐吞吐。",
      structured: [
        "平台线程限制（1:1）：绑定 OS 物理内核线程，切换面临昂贵的内核态陷阱上下文拷贝，内存固定占用 1MB 导致容量瓶颈",
        "虚拟线程革命（M:N）：JVM 堆内存虚拟化管理，体积仅百字节。多达百万的虚拟协程并发复用少量的物理载体线程",
        "Continuation 栈脱水：运行遇 I/O 挂起时，触发 yield() 剥离。将载体线程寄存器现场拷贝打包存入堆，释放载体核",
        "Continuation 栈复水：I/O 包到达后，重新挂载空闲载体线程，从堆读取快照压入 CPU 寄存器，原行恢复无缝执行"
      ]
    },
    keyPoints: ["虚拟线程 Virtual", "载体线程 Carrier", "Continuation 延续", "Project Loom", "工作窃取调度", "异步非阻塞"],
    traps: ["在虚拟线程内**避免使用 synchronized 锁**。如果在 synchronized 块中执行了 I/O 阻塞，由于 synchronized 依赖 ObjectMonitor 的底层 C++ 绑定，会导致当前虚拟线程被“锁死”在载体线程上（Thread Pinning，线程钉死）。此时载体线程无法释放去跑别的工作，导致协程退化为普通多线程挂起，应全面改用 `ReentrantLock` 锁"],
    relatedIds: ["interview_java_009", "interview_java_013_lock"]
  },
  {
    id: "interview_java_040_security_npe",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "backend",
    topic: "java",
    title: "JVM 沙箱安全模型与沙箱隔离",
    difficulty: 2,
    frequency: 3,
    question: "什么是 Java 虚拟机的沙箱安全模型（Sandbox Security Model）？双亲委派和安全管理器（SecurityManager）是如何协同构建這一纵深防御防线的？",
    answer: {
      short: "沙箱安全模型是限制 Java 程序只能在受控的虚拟机沙箱环境中运行以防止越权破坏系统的机制；双亲委派通过引导类加载器隔离，保护核心 Class（如 String）免受外部篡改；安全管理器（SecurityManager）在运行期对涉及物理文件读写、网络连接和进程启动等敏感系统调用进行全局权限校验防范防范越权。",
      thinkingProcess: "1. 沙箱定义：Java 程序默认运行在沙箱（Sandbox）内。不能随便删除宿主机文件，不能随意调操作系统指令。保护主机安全。\n2. 机制一：类加载器委派防线。防范用户自己伪造 `java.lang.System` 写入恶意代码后侵入系统。因为 BootstrapClassLoader 总是拥有绝对最高优先权加载 JDK 官方的 System，用户伪造的类直接被忽略，保证了 runtime 核心的纯净与安全。\n3. 机制二：SecurityManager 运行期拦截。每当 Java 代码尝试执行 `Runtime.getRuntime().exec()` 调 Shell，或者调用 `File.delete()` 删文件时。底层 JDK 源码都硬编码了权限检查：\n   `SecurityManager security = System.getSecurityManager();`\n   `if (security != null) { security.checkWrite(file); }`\n   若安全策略（policy 文件）未授权，直接抛出 `AccessControlException` 阻断执行，是完美的内核级防护。",
      structured: [
        "类加载器安全隔离：双亲委派从类加载阶段把控安全，禁止不受信字节码替换/污染 JDK 的 `java.*` 命名空间",
        "运行期权限拦截（SecurityManager）：全局系统管理器。对 IO 读写、Socket 连接、系统 exec 调用执行实时权限检查拦截",
        "安全策略文件（Policy）：通过声明式配置文件精细指定哪些 Jar 包对哪些磁盘路径可读、哪些网络域可通，最小化特权授权",
        "沙箱终结演变：在现代 Java（JDK 17+）中，由于容器和 Namespaces 虚拟化技术的普及，SecurityManager 已被弃用"
      ]
    },
    keyPoints: ["JVM 沙箱安全", "SecurityManager", "类隔离防御", "系统调用校验", "安全策略 Policy", "双亲委派机制"],
    traps: ["SecurityManager 拦截的系统检查是同步进行的，在开启 SecurityManager 之后，由于每次文件读写和网络收包都要经历一长串安全堆栈的查表校验，会导致系统 IO 性能下降 10% 左右，需做性能权衡"],
    relatedIds: ["interview_java_004", "interview_java_005"]
  },
  {
    id: "interview_java_041_sec_csrf",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "backend",
    topic: "java",
    title: "Spring Security CSRF 防御机制及 Token 比对",
    difficulty: 3,
    frequency: 4,
    question: "什么是 CSRF（跨站请求伪造）攻击？在 Spring Boot 项目中，Spring Security 默认是如何开启并执行 CSRF 防御策略的？",
    answer: {
      short: "CSRF 是黑客利用用户浏览器残留的 Cookie 凭证，跨越第三方网站诱导浏览器向受信任网站发起恶意请求的攻击；Spring Security 默认使用 CSRF Token 机制防御：在用户登录后生成唯一的随机 Token 并存入 Session 或 Cookie，要求客户端在非幂等请求（POST/PUT）的 Header 或 Body 中携带该 Token，后端拦截器核对一致才允许执行，否则直接抛 403 异常。",
      thinkingProcess: "1. 攻击原理：\n   - 用户登录了银行 A，浏览器存了 A 的 Cookie。\n   - 用户访问了黑客网站 B。B 上有个隐藏表单 `<form action=\"http://bankA.com/transfer\">`。\n   - 诱导用户点击。表单提交到银行 A。由于浏览器特性，会自动带上银行 A 的 Cookie。银行 A 判定请求合法，转账成功。黑客成功利用了 Cookie 的自动携带特性，但拿不到 Cookie 内容。\n2. Spring Security 防御实现：\n   - 开启后，在用户访问页面时，生成一个唯一的随机串 `CsrfToken`，分别存储在服务端的 `Session` 中、或写入 Cookie（使用 CookieCsrfTokenRepository，设置 HttpOnly 为 false 方便前端读取）。\n   - **请求核对**：对于所有可能改变数据的非幂等请求（POST, PUT, DELETE, PATCH），Spring Security 的 `CsrfFilter` 拦截器会强行从请求头（默认 `X-CSRF-TOKEN`）或请求体参数中读取 Token 值，与 Session 内保存的进行 equals 比对。\n   - **防御价值**：黑客即便能通过浏览器诱导带上 Cookie，但因为黑客无法跨域读取用户页面上的 CsrfToken 变量值，其恶意表单里就无法带上该 Token，比对必然失败，安全防御成功。",
      structured: [
        "CSRF 物理成因：利用浏览器在跨域提交表单时，无脑自动附带目标域名下已登录的身份凭证 Cookie 特性进行攻击",
        "Token 双向核对：Spring Security 在会话初始化时生成随机 CsrfToken 存入 Session，并在表单/Header 埋入标识",
        "拦截非幂等：CsrfFilter 专门阻击 POST/PUT/DELETE，从 Header 抽取 X-CSRF-TOKEN 校验。一致则过，不一致直接报 403 拒绝",
        "前后端分离对策：配置使用 `CookieCsrfTokenRepository.withHttpOnlyFalse()`，使 Angular/Vue 能够通过 JS 读取 Token 发送"
      ]
    },
    keyPoints: ["CSRF 攻击", "Spring Security", "CsrfFilter", "X-CSRF-TOKEN", "跨域 Cookie 自动携带", "CookieCsrfTokenRepository"],
    traps: ["在写前后端分离的 Restful API 时，如果接口全使用 Token（如 JWT）进行身份校验且**完全禁用了 Cookie 和 Session 机制**，此时由于 JWT 无法被浏览器跨域自动携带（需要 JS 写入 Authorization Header），CSRF 攻击天然失效，建议通过 `http.csrf().disable()` 主动关闭 CSRF 拦截以换取无谓的性能开销"],
    relatedIds: ["interview_java_030_spring_mvc", "interview_java_042_sec_jwt"]
  },
  {
    id: "interview_java_042_sec_jwt",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "backend",
    topic: "java",
    title: "JWT（JSON Web Token）安全漏洞及防范",
    difficulty: 3,
    frequency: 4,
    question: "使用 JWT（JSON Web Token）进行前后端分离认证时，有哪些典型安全风险（如签名绕过、密钥泄露、重放攻击）？我们应该如何进行 Java 后端代码加固？",
    answer: {
      short: "JWT 风险包含：1. algorithm 指定为 none 导致签名被绕过；2. 密钥强度过低被爆破；3. Token 被窃取后的重放攻击；加固对策是：后端严禁接收 none 算法，使用高强度的非对称加密算法（如 RS256），对 Token 加上合理的过期时间，并结合 Redis 黑名单实现单端登录与强制踢下线机制。",
      thinkingProcess: "1. 安全隐患深度解析：\n   - **签名绕过（None Algorithm 漏洞）**：JWT 的 Header 包含 `\"alg\": \"none\"`。有些弱智的验证库看到 none，就会直接信任 Payload，不再校验第三部分 Signature。黑客只需要把 alg 改为 none，并在 Payload 随意改写 userId，就能伪造任意用户身份登录。对策：校验时强制限定算法白名单，拒绝接收 none 级别的 alg 头部。\n   - **密钥爆破**：如果 JWT 使用 HMAC-SHA256（HS256），使用的是对称密钥。如果密码设置为了简单的 `123456`，黑客拿到一个 JWT 后，可以直接在本地离线暴力爆破出密钥，进而批量伪造 Token。对策：必须使用 256 位以上的高强度密钥，或者首选 **RS256（非对称私钥签名、公钥验签）**，公钥公开，私钥存在服务器，更加稳妥。\n   - **重放攻击与无法注销**：JWT 是无状态的。一旦生成并发放给客户端，在有效期内任何持有该 Token 的人都能访问。用户点“注销”只是前端删除了本地 Token，后端无法主动让其失效。对策：引入 Redis，存储 `jwt:blacklist:token_hash`，将注销的 Token 放入黑名单校验；或者存储用户的 `jwt_version` 整数，注销时将数据库版本号递增，拦截器比对版本不一致则直接判定 Token 失效失效。",
      structured: [
        "None 算法绕过：黑客篡改 alg 头部为 none 并删除签名域绕过检验。对策：后端硬编码拦截 `alg` 必须为 HS256/RS256 等",
        "对称密钥爆破：对称密码容易被离线暴破。加固对策：配置长字符高熵密钥，或者首选非对称 RSA256 防篡改",
        "无状态注销难：Token 扔出即生效无法收回。对策：每次请求去 Redis 比对 blacklist 缓存，实现秒级主动踢下线",
        "Payload 泄露：JWT Payload 只是 Base64 编码，并不是加密的。严禁在 Payload 存放密码、身份证等任何敏感字段"
      ]
    },
    keyPoints: ["JWT 漏洞", "None 算法绕过", "RS256 非对称加密", "Redis 黑名单", "Token 劫持重放", "Payload 编码本质"],
    traps: ["有些开发人员把高敏感度的信息（如用户密码、工资）塞在 JWT 的 Payload 里，认为这是安全的。注意：Base64 编码是一秒级可解码还原的，JWT 只防篡改（Signature 保证），不防泄露，绝对不能存隐私数据数据"],
    relatedIds: ["interview_java_041_sec_csrf"]
  },
  {
    id: "interview_java_043_java_agent",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "java",
    title: "Java Agent 字节码增强与 SkyWalking 原理",
    difficulty: 4,
    frequency: 3,
    question: "APM 链路追踪工具（如 SkyWalking）是如何在不修改任何业务代码的前提下，实现全链路追踪监控的？请详解 Java Agent 的底层字节码增强（ASM/ByteBuddy）与 ClassFileTransformer 拦截机制。",
    answer: {
      short: "Java Agent 基于 JVM 的 `Instrumentation` 机制实现：通过配置 `-javaagent` 参数，在类加载阶段（premain）或运行期（agentmain）拦截 Class 字节码加载流；利用内置的 ClassFileTransformer，配合 ASM 或 ByteBuddy 字节码修改框架，动态在目标类的方法执行前后织入追踪逻辑（如 TraceId 传递），生成新字节码加载运行，实现无感监控。",
      thinkingProcess: "1. 系统原理解析：\n   - **挂载时机**：JVM 在启动时，会优先调用 Java Agent 中定义的 `premain(String agentArgs, Instrumentation inst)` 方法。这在 `main` 方法之前执行。如果是运行时热挂载，则调用 `agentmain`。\n   - **拦截入口**：在 premain 中，调用 `inst.addTransformer(new MyClassFileTransformer())`。注册一个字节码文件转换器。\n   - **拦截核心**：当类加载器准备加载 `com.service.UserService` 时。会调用 `ClassFileTransformer.transform(...)`。这个方法的入参是原始的 `byte[] classfileBuffer`（原始字节码字节数组）。\n   - **字节码改造**：\n     - 使用 **ByteBuddy** 或 **ASM** 等字节码工具库，解析这个字节数组。\n     - 找到特定的类和方法（如拦截标注了 @RequestMapping 的方法）。\n     - 采用“插桩”技术，在方法首尾硬编码插入追踪代码：`TraceContext.start(); try { ... } finally { TraceContext.stop(); }`。\n     - 将修改后生成的全新 `byte[]` 字节数组返回给 JVM。类加载器最终载入的是被“二次改装增强”的 Class。业务人员写代码时对此完全无感，实现了高性能切面监控。",
      structured: [
        "Instrumentation 原语：JVM 核心反射装载增强机制。支持在类装载内存之前对 Class 的物理二进制流进行修改重定义",
        "premain 拦截器（启动期）：在 Application main 开启前接管控制权，注册 `ClassFileTransformer` 字节码变换器",
        "ByteBuddy/ASM 插桩：解析原始 Class 字节码流，在特定包/特定切点方法的前后位置动态注入链路统计与 TraceId 传递代码",
        "SkyWalking 无侵入：将改装好的字节码流归还类加载器运行，实现对 SQL、RPC、HTTP 等全方位透明链路追踪追踪"
      ]
    },
    keyPoints: ["Java Agent", "Instrumentation 机制", "premain / agentmain", "ClassFileTransformer", "ByteBuddy 增强", "无侵入监控"],
    traps: ["使用 Java Agent 进行字节码增强时，如果拦截切点配得太粗泛（例如拦截了 `java.lang.*` 或所有业务方法），会导致类加载速度极度变慢，且由于频繁调用监控代码，会带来 5%-15% 的 CPU 性能损耗与额外堆内存占用，应精细设计切点"],
    relatedIds: ["interview_java_004", "interview_java_020_reflect", "interview_java_029_spring_aop"]
  },
  {
    id: "interview_java_044_cache_db",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "本地一缓（Caffeine）+ Redis 二缓一致性设计",
    difficulty: 3,
    frequency: 4,
    question: "在秒杀高并发大吞吐场景中，单靠 Redis 会由于网卡带宽产生性能瓶颈。如何使用本地一级缓存（Caffeine） + 远程二级缓存（Redis）构建多级缓存系统？如何保证本地缓存与 Redis 及数据库之间的数据一致性？",
    answer: {
      short: "多级缓存设计为：优先读 Caffeine（本地） -> Caffeine 未命中读 Redis（远程） -> Redis 未命中查询 DB 并回写；为保障一致性，更新数据时采用 Cache-Aside 模式更新 DB 并清除 Redis，同时利用 Redis Pub/Sub（发布订阅）或 Canal 监听 binlog 广播失效消息，通知所有 JVM 本地实例清空对应的 Caffeine 本地缓存以防脏读。",
      thinkingProcess: "1. 多级缓存必要性：当 Redis 面临单 key 十万级并发时（如热点商品），即使 Redis 性能撑得住，千兆网卡的物理带宽也会被瞬间打满，导致网络发生严重卡顿。必须在 JVM 内存里开辟本地一级缓存（Caffeine）。\n2. 读写工作流：\n   - 读：`Caffeine.get(key)` -> 不存在则读 `Redis` 并回写 Caffeine -> 不存在则读 `DB` 并回写 Redis/Caffeine。\n3. **一致性死穴及破局方案**：\n   - 如果服务器 A 对数据库进行了修改并清空了 Redis。但服务器 B、服务器 C 的 JVM 内存中还驻留着 Caffeine 本地缓存，它们完全不知道数据已变，会在有效期内持续返回脏数据。\n   - **同步下发方案（Redis Pub/Sub）**：\n     - 当执行写更新操作时，先更新 DB，清空 Redis。\n     - 主动向 Redis 频道（Channel: `cache_invalid_channel`）发送广播消息：`{\"key\": \"goods_1001\"}`。\n     - 各台服务器上的 JVM 实例都会订阅此 Channel。收到消息后，强行执行 `caffeine.invalidate(\"goods_1001\")` 清除本地缓存。\n     - 完美的兜底：本地 Caffeine 必须配置合理的 **写入后过期（expireAfterWrite）** 策略（如 5-10 秒极短过期），即使广播丢失，本地也在极短时间内自我清空，保障了极佳的最终一致性表现。",
      structured: [
        "本地一缓防线（Caffeine）：将热点数据存放在 JVM 堆内中，纳秒级读取，消除了跨网络访问 Redis 的 IO 及网卡带宽瓶颈",
        "Cache-Aside 基础更新：更新操作先写入 DB，随即 delete 物理清除 Redis。保证 Redis 这一二级缓存不存垃圾脏页",
        "发布订阅同步清空：DB 修改后向 Redis 广播清空事件；所有应用集群订阅频道，触发本地 Caffeine 实例清除对应 Key 缓存",
        "异步 binlog 解耦（Canal）：业务系统只写 DB。Canal 伪装成 Slave 监听 binlog 投递给 MQ，由 MQ 异步清空 Redis 与本地 Caffeine"
      ]
    },
    keyPoints: ["多级缓存", "Caffeine 本地缓存", "Redis Pub/Sub 广播", "Canal 监听 binlog", "Cache-Aside 模式", "读写一致性"],
    traps: ["使用 Redis 发布订阅（Pub/Sub）广播失效消息时，由于 Pub/Sub 是“即发即弃”的不保障可靠达机制，如果某台服务器网络抖动瞬间漏掉了消息，对应的本地缓存将一直脏下去，因此必须强制为本地 Caffeine 锁死一个极短的自然过期时间（如 5 秒）进行最终一致性兜底"],
    relatedIds: ["interview_java_008"]
  },
  {
    id: "interview_java_045_redisson",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "backend",
    topic: "java",
    title: "Redisson 锁看门狗机制与 Redlock 局限性",
    difficulty: 4,
    frequency: 5,
    question: "在分布式系统开发中，Redisson 是如何利用 Lua 脚本和 Watchdog（看门狗）机制来实现分布式锁的防死锁和自动延期续约的？为什么 Martin Kleppmann 等大师说 Redlock 算法依然无法绝对保证分布式锁的安全？",
    answer: {
      short: "Redisson 分布式锁通过 Lua 脚本实现加锁、自增重入计数并原子判定，默认启动一个 Watchdog 定时任务，在锁快过期时（每隔 10 秒）重置过期时间为 30 秒以防业务未完锁被释放；Redlock 不安全是因为它强依赖于“所有节点时间物理同步”这一不可能完全成立的假设，且极易因 GC 长期卡顿导致时间过期从而丧失排他性安全。",
      thinkingProcess: "1. Redisson 锁与 Watchdog 续期原理：\n   - **加锁原子**：通过执行 Lua 脚本执行 `exists key`，不存在则 `hset key uuid:thread 1` 加锁，并配置默认 30秒 的 leaseTime。如果再次抢锁，发现是同一线程，`hincrby` 递增，实现锁的可重入性。\n   - **看门狗（Watchdog）续约**：如果我们在加锁时**没有显式指定 leaseTime**，Redisson 会启动一个后台定时线程（基于 Netty 的 HashedWheelTimer 轮询时间轮）。\n   - 它会每隔 `internalLockLeaseTime / 3 = 10` 秒检测一次当前线程是否依然持有锁。如果是，调用 Lua 脚本：`pexpire key 30000` 将其重新延期续约到 30 秒。这就保证了如果业务没执行完，锁绝对不会过期；若服务宕机，定时任务也挂了，30秒后锁自动从 Redis 物理清除，防范了死锁的堆积。\n2. Redlock 致命漏洞剖析（分布式大佬的对决）：\n   - Martin Kleppmann 指出 Redlock 的两大物理死穴：\n     - **物理时钟依赖**：Redlock 要求客户端向 N/2+1 个独立 Redis 实例申请锁，且要求它们的时间走速一致。但由于 NTP 漂移或系统跳时，某台机器时间突然变快跳跃，会导致该实例上的锁提前释放，使另一个客户端成功抢锁，锁安全性直接崩溃。\n     - **GC 卡顿（STW 惨剧）**：客户端 A 在向 Redis 节点 1,2,3 申请锁成功后。突然触发了 JVM 的 **Full GC / STW 长达 15秒**。在此期间，客户端 A 的业务线程停滞。这 15秒 内锁已经在 Redis 上全部过期被释放了。此时客户端 B 趁机向 1,2,3 发送请求并成功拿到了分布式锁。STW 结束，客户端 A 苏醒，认为自己还占着锁，开始写数据库，客户端 B 也开始写数据库，**锁的互斥排他性当场宣告破裂**。所以在对一致性要求 100% 成立的场景中，分布式锁必须用 ZooKeeper（基于强一致的 Paxos 与心跳 Session 临时节点判定）来保证，Redis 锁只适合高并发效率优先的高吞吐场景表现。",
      structured: [
        "Lua 脚本原子锁定：使用 hash 结构存放 `lockName -> <uuid_threadId, reentrant_count>`，单命令实现重入加锁",
        "看门狗自动延期（Watchdog）：无显式时间加锁后，后台轮询时间轮每 10 秒定时前滚续约锁过期时间至 30 秒，确保业务安全",
        "时钟漂移缺陷（Redlock 软肋）：强依赖 NTP 物理对时。若某节点遭遇时钟突变，会导致已锁键被提前删除，发生并发冲突",
        "GC 挂起（STW 夺锁）：客户端拿到锁后触发 GC 挂死，锁过期释放，新线程再次夺锁成功，老线程苏醒覆写数据"
      ]
    },
    keyPoints: ["Redisson", "看门狗 Watchdog", "HashedWheelTimer 时间轮", "Redlock 局限性", "时钟漂移", "GC 挂起 STW", "ZooKeeper 临时节点区别"],
    traps: ["在写 Redisson 分布式锁代码时，如果写成了 `lock.lock(10, TimeUnit.SECONDS)`，由于你显式指定了生存时间，Redisson 会**直接关闭 Watchdog 看门狗续期机制**，如果业务执行超出了 10 秒，锁会被强行释放导致并发安全故障，应默认不传生存时间让看门狗介入"],
    relatedIds: ["interview_java_039_virtual_thread", "interview_java_044_cache_db"]
  },
  {
    id: "interview_java_046_large_upload",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "大文件上传与分片上传 Java 后端架构",
    difficulty: 3,
    frequency: 4,
    question: "在秒传、断点续传大文件（如 5GB 视频）的 Java 后端架构设计中，如何合理设计分片上传（Chunk Upload）和 MD5 秒传校验？请说明其数据库及物理文件合并控制逻辑。",
    answer: {
      short: "架构设计为：前端计算文件 MD5 传给后端秒传校验，若已存在则直接秒传成功；若否，将文件按 5MB 分片并发上传；后端为每个分片记录序号并写入物理临时目录，接收完毕后，通过 MD5 合法性比对，使用内存管道或 RandomAccessFile 将各分片顺序合并，并清除物理临时临时垃圾文件。",
      thinkingProcess: "1. 核心流程：\n   - **秒传验证**：前端利用 SparkMD5 等库计算文件的唯一 `FileMD5`，发给后端。后端查 DB（`file_info`表），若存在该 MD5 且物理文件存在，直接把该文件的 URL 映射给当前用户，完成“秒传”成功，零网络上传开销。\n   - **分片上传**：前端按 5MB-10MB 切割文件。每个分片带上参数：`fileMd5`, `chunkNumber`（当前分片序号，从0开始）, `chunkSize`, `totalChunks`。\n   - **断点续传（并发支持）**：上传前请求后端 `check-chunks` 接口，后端查 `file_chunk` 临时表，返回当前“已上传成功的分片序号列表”（如 `[0,1,3,4]`）。前端过滤掉这些，只并发上传缺失的 `[2,5]` 分片，实现断点续传。\n   - **物理文件存储与合并**：\n     - 后端接收到分片后，在物理服务器创建一个临时文件夹，以 `fileMd5` 命名。把分片保存为小临时文件，命名为 `0.tmp`, `1.tmp` 等。\n     - 当所有分片上传完毕，前端发送 `merge` 合并请求。\n     - 后端接收请求，开辟一个 `RandomAccessFile(targetFile, \"rw\")` 或使用 NIO 的 `FileChannel`。\n     - 循环遍历 0 到 totalChunks-1，以 `Channel.transferTo` 把每个 tmp 分片文件按顺序追加写写入目标大文件中，完成后比对目标大文件的最终 MD5。一致后关闭 Channel，删除临时文件夹及零碎小 tmp 分片，落库完成上传。",
      structured: [
        "秒传防线（MD5比对）：文件计算整体 MD5，首发请求验证。若后台库表记录匹配则直接逻辑克隆，实现瞬时秒传",
        "分片与并发控制：大文件在前端拆分为等大分片（如 5MB），并行投递给后端。支持丢包后断点续传，不需全量重载",
        "断点续传查漏：上传前请求后端返回 `uploaded_chunks` 列表，过滤并仅上传缺失的分片，缩短传输开销",
        "零拷贝合并（transferTo）：合并时基于 RandomAccessFile 定位，利用 NIO 的 FileChannel.transferTo 极速拼接物理分片"
      ]
    },
    keyPoints: ["分片上传", "秒传", "断点续传", "FileChannel.transferTo", "RandomAccessFile", "SparkMD5"],
    traps: ["在进行多线程并发分片上传和最终合并时，如果由于网络丢包导致前端合并请求抢先到达，而后端还有最后几个分片还在接收写入中，此时合并会产生文件损坏，必须在合并时通过 Redis 分布式锁校验所有分片是否已被完整写入"],
    relatedIds: ["interview_java_023_zerocopy", "interview_java_045_redisson"]
  },
  {
    id: "interview_java_047_oom_dump",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "backend",
    topic: "java",
    title: "Java 堆内自修复诊断与 OOM 自动 Dump 设计",
    difficulty: 3,
    frequency: 4,
    question: "在生产高并发 JVM 服务中，当发生内存溢出（OOM）时，应用实例极易陷入僵死状态。为了在第一时间保留犯罪现场并配合 K8s 等容器自动摘除和自愈，我们应该如何进行 JVM 启动参数配置与自动化 Dump 设计？",
    answer: {
      short: "加固方案为：1. JVM 启动配置 `-XX:+HeapDumpOnOutOfMemoryError` 与 `-XX:HeapDumpPath=/data/logs/` 以自动生成 hprof 镜像；2. 配置 `-XX:OnOutOfMemoryError=\"/script/oom-kill-restart.sh\"` 触发自动脚本，发送告警短信、执行 K8s 容器健康检查下线，并主动重启服务实现服务自愈。",
      thinkingProcess: "1. 现场保留价值：线上挂掉后，如果不做 Dump，直接在 K8s 中自动被拉起来了，犯罪现场彻底消失，下一次流量一来还会继续爆。所以在爆的时候自动抓一份 Dump 是定位问题的铁律。\n2. JVM 核心参数加固清单：\n   - `-XX:+HeapDumpOnOutOfMemoryError`：当 JVM 触发 OOM 的那一刻，强行把当前内存堆的全部快照保存出来。\n   - `-XX:HeapDumpPath=/data/logs/jvm_oom_%p.hprof`：指定导出的地址，`%p` 会自动填充为进程的物理 PID，防止覆盖。\n   - `-XX:+CrashOnOutOfMemoryError`：很多时候 OOM 发生了，JVM 并没完全死透，还能接受健康检查，但实际业务已经卡住（假死）。该参数强行让 JVM 在 OOM 发生时主动崩溃退出，配合 Kubernetes 探针，容器立刻发现状态为 Dead 并执行自动重启拉起，保证了线上可用性。\n   - `-XX:OnOutOfMemoryError=\"/app/oom-handler.sh %p\"`：OOM 发生瞬间执行脚本，脚本执行：\n     - 第一步：向 Prometheus/Grafana 微信群发告警通知并带上 pod 名字。\n     - 第二步：执行 `kill -9` 枪毙进程，腾出机器资源，并主动引导 K8s 切换分流流量，实现了智能的自我诊断和系统自愈链路表现。",
      structured: [
        "堆dump锁定：通过配置 HeapDumpOnOutOfMemoryError 参数，使 JVM 在崩溃溢出的生死关头，将内存快照以 hprof 导出",
        "PID 区分防覆盖：设置 HeapDumpPath 时带上 `%p` 或 `%t` 标识，保证多实例并发 OOM 时文件名有区分不覆盖",
        "假死自动崩盘（CrashOnOOM）：强迫发生 OOM 假死但仍占着端口的进程彻底 Crash 退出，暴露给 K8s 探针（Probe）执行销毁",
        "脚本自我解救：利用 OnOutOfMemoryError 执行外部运维脚本。在进程彻底退出前，完成微信告警拉响和健康流量剔除"
      ]
    },
    keyPoints: ["OOM 现场保留", "HeapDumpOnOutOfMemoryError", "OnOutOfMemoryError 脚本", "K8s 探针自愈", "CrashOnOutOfMemoryError", "MAT 镜像导入分析"],
    traps: ["在 64G 内存的服务器上进行 OOM 导出时，JVM 生成几百 G 的 hprof 文件需要占用大量的磁盘 I/O 和 CPU，并且耗时可能长达数分钟，在这期间必须保证磁盘的存储容量充足（至少留有 100G 空间），否则会导致磁盘直接写满瘫痪"],
    relatedIds: ["interview_java_036_cpu_100", "interview_java_037_jvm_oom"]
  },
  {
    id: "interview_java_048_metaspace_tuning",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "backend",
    topic: "java",
    title: "JVM 元空间调优与动态扩容机制",
    difficulty: 3,
    frequency: 3,
    question: "在 JVM 参数配置中，MetaspaceSize（元空间初始大小）与 MaxMetaspaceSize（最大元空间大小）的作用是什么？为什么说如果不配置合理的初始值，会导致应用在启动阶段高频触发 Full GC 垃圾回收？",
    answer: {
      short: "MetaspaceSize 是触发元空间 GC 的初始水位线（默认仅约 20MB），MaxMetaspaceSize 是元空间分配的最大硬上限；若不调大初始值，应用启动时由于加载大量第三方 Class，元空间会因频繁冲破水位线而被迫不断触发 Full GC 进行空间整理和动态扩容，这会导致启动耗时严重延长，生产中建议将两者设为相同的大值（如 256MB/512MB）。",
      thinkingProcess: "1. 参数物理作用：\n   - MetaspaceSize：并不是限制“元空间的最小大小”，而是限制**“第一次触发垃圾回收（GC）的水位线阈值（High Watermark）”**。\n   - MaxMetaspaceSize：硬性物理上限。默认如果不设限制，JVM 可以吃光整个宿主机的物理内存，容易把机器拖死。\n2. 启动阶段 Full GC 惨剧成因：\n   - 在 HotSpot 虚拟机中，`MetaspaceSize` 的默认初始值非常低（通常只有 20.75MB 左右）。\n   - 当我们在 Spring Boot 项目中启动时，因为要加载 Spring 框架、MyBatis、RPC 等成千上万个 Class，20.75MB 瞬间就会被占满。\n   - **扩容与 GC 联动**：一旦元空间占用达到 MetaspaceSize，JVM 就会立马暂停业务，执行一次 **Full GC** 来尝试清空垃圾类。收效甚微后，JVM 把水位线阈值调高一点，继续加载。一会儿又满了，又被迫执行一次 Full GC，又被迫扩容。这个过程在启动阶段会高频重复 5-10 次，直接导致应用启动卡顿长达几十秒甚至几分钟，严重影响了微服务的启动和故障平滑弹性切流时效。\n   - **优化方案**：生产环境直接把 `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 设为完全相同的值（例如 `-XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=512m`），避免动态扩容带来的 Full GC 抖动。",
      structured: [
        "元空间水位线（MetaspaceSize）：并不是物理初始底限，而是启动垃圾收集 Full GC 进行元空间内存整理的水位警示线",
        "动态水位提升（GC抖动）：默认初始水位线极低（20MB）。启动期类爆涨，逼迫 JVM 发生多次 Full GC 扩容，带来巨大 STW 卡顿",
        "最大硬限度（MaxMetaspaceSize）：防范类加载内存泄露吃光物理机系统内存的防火墙，必须限额防止宿主机死锁",
        "最佳调优实践：将初始水位与最大物理限额参数设为完全等大（如 256m 或 512m），彻底关闭运行时水位线膨胀和 Full GC"
      ]
    },
    keyPoints: ["JVM 元空间", "MetaspaceSize 调优", "MaxMetaspaceSize 限制", "启动 Full GC", "High Watermark 水位线", "动态扩容开销"],
    traps: ["动态代理、反射和模板语言使用不当会产生大量的临时类，如果 Metaspace 设置过小，会触发频繁的元空间垃圾回收，若在排查中看到 GC 原因显示为 `Metadata GC Threshold`，说明必须调高这两个参数"],
    relatedIds: ["interview_java_003", "interview_java_020_reflect", "interview_java_037_jvm_oom"]
  },
  {
    id: "interview_java_049_bigdecimal",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "backend",
    topic: "java",
    title: "Java 浮点数计算失真与 BigDecimal 规范",
    difficulty: 2,
    frequency: 4,
    question: "为什么 Java 中的 double 和 float 会出现计算失真（如 0.1 + 0.2 = 0.30000000000000004）？在进行金融、金额等高精度计算时，我们该如何使用 BigDecimal 避坑？请分析 compareTo() 与 equals() 的区别。",
    answer: {
      short: "双精度浮点数失真是因为计算机底层使用二进制科学计数法无法精确表示十进制小数；金融高精度计算必须使用 `BigDecimal`，且构造时必须强制使用 `String` 构造器（严禁使用 double 构造器）；比较数值大小时必须使用 `compareTo()` 方法而不能使用 `equals()`，因为 equals 会校验 Scale 小数位数，导致 1.0 与 1.00 判定为不等。",
      thinkingProcess: "1. 浮点数失真物理根源：IEEE 754 规范规定，double/float 内部是二进制存储的。十进制的 0.1 转化为二进制是无限循环小数。由于尾数长度限制（double 为 52位），计算时执行了截断（舍入），产生了微小的偏差，高频累加后偏差显现。\n2. BigDecimal 避坑指南：\n   - **禁忌一：用 double 构造**。`new BigDecimal(0.1)` 传入 double。由于 double 本身已经失真了，传入后依然是 `0.10000000000000000555...`，避坑失败。对策：必须使用 `new BigDecimal(\"0.1\")` 或 `BigDecimal.valueOf(0.1)`，利用字符串解析，确保精度完美。\n   - **禁忌二：比对使用 equals**。`BigDecimal a = new BigDecimal(\"1.0\");` `BigDecimal b = new BigDecimal(\"1.00\");`\n     - `a.equals(b)` 会返回 **false**。因为 `equals` 不仅比对数值大小，还会严格比对 Scale（精度小数位数，a的scale是1，b的scale是2）。\n     - `a.compareTo(b)` 会返回 **0**（代表相等）。因为 `compareTo` 会忽略 Scale 属性，专门比对两个对象物理数值的大小。所以数值大小校验必须无脑使用 `compareTo`。",
      structured: [
        "IEEE 754 缺陷：双精度二进制浮点表示法对十进制小数（如 0.1）由于二进制转换会产生无限循环，导致舍入截断丢失精度",
        "强制 String 构造：必须无脑选用 `new BigDecimal(\"0.1\")`。传入 double 实参会直接导致构造阶段即继承 double 的失真偏离值",
        "equals 小数位陷阱：equals 函数会苛刻判定数值与 Scale 位数。1.0 与 1.00 会因为 Scale 不同被判定为 false 不等",
        "compareTo 单纯判定：忽略 Scale 的位数差异，只对逻辑大小比对，两数大小判定必须选用 `compareTo` 作为唯一标准"
      ]
    },
    keyPoints: ["BigDecimal 精度", "浮点数失真", "IEEE 754 标准", "String 构造器", "equals vs compareTo", "Scale 精度校验"],
    traps: ["在进行 BigDecimal 除法运算时（如 `a.divide(b)`），如果结果是一个无限循环小数（如 1/3），如果未指定舍入模式（RoundingMode），JVM 会直接抛出 `ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.` 报错，必须显式指定保留位数和舍入规则"],
    relatedIds: ["interview_java_018_exception"]
  },
  {
    id: "interview_java_050_cap_sec",
    mode: "study",
    domain: "interview",
    type: "security",
    track: "backend",
    topic: "java",
    title: "Java 安全管理器弃用与云原生安全替代",
    difficulty: 3,
    frequency: 3,
    question: "在现代 JDK（如 JDK 17 及 Java 21+）中，JVM 官方已经将传统的安全管理器（SecurityManager）标记为废弃（Deprecated for Removal）。为什么这一历史安全机制会被淘汰？在现代云原生微服务架构下，我们应该使用什么手段来进行平替与安全防护？",
    answer: {
      short: "SecurityManager 被淘汰是因为其在 Java 内部进行方法级栈扫描（Stack Walk）校验权限会产生严重的同步性能损耗，且维护极其繁琐，在容器和微服务盛行的今天，这些特权隔离已经完全可以在宿主机系统级别通过 Docker 容器的 Namespace、Cgroups、Seccomp 以及 Linux Capabilities（最小特权）以更高性能、更优雅地进行安全隔离和平替。",
      thinkingProcess: "1. 淘汰成因：\n   - **性能瓶颈**：SecurityManager 每一次检查都会进行 `AccessController.doPrivileged` 栈扫描（检查整个调用栈上每一层方法是否都有权限）。这会让每一次文件读写和 IO 都变慢。多线程下会产生巨大的锁竞争。\n   - **云原生平替**：以前 Java 跑在物理机，多租户共享一个 JVM 实例，需要 SecurityManager 保证租户间文件隔离。现在都是 Docker 容器化时代。每个微服务在 K8s 里独占一个 Pod，拥有完全独立的 NameSpace 视线隔离。文件系统只读（Read-Only root filesystem）以及 Cgroups 限制了 CPU 和内存。SecurityManager 在 Java 语言层做拦截已经变成了重复造轮子，且性能差。所以官方决定果断移除它。\n2. 现代加固手段：\n   - 在容器级别：关闭不需要的 Linux Capabilities（如 DROP ALL，仅保留 NET_BIND_SERVICE）。\n   - 使用 **Seccomp** 限制容器内可以发起的系统调用系统（Syscalls），禁止容器执行 exec 或 fork 派生新进程。\n   - 使用 **Read-Only Root Filesystem**，让容器除了专门的 Volume 挂载盘之外，其余磁盘目录全部只读，物理上防止木马写入执行，从系统底层提供了最高速、零侵入的云原生安全防护防护。",
      structured: [
        "Stack Walk 性能死结：SecurityManager 的栈深度检索在每次系统级 IO 时强行进行方法权限溯源，严重拖累高并发性能",
        "多租户时代谢幕：早期 Applets 多租户运行于同一个 JVM 机器上需要强隔离，现代微服务单容器单进程直接使其失去生存土壤",
        "云原生 Namespace 隔离：Docker/K8s 基于命名空间直接在 OS 层面提供网络、文件视口屏蔽，安全级别更高更省心",
        "Seccomp 最小调用加固：直接在 Linux 内核拦截高危 Syscalls，取代繁琐的 Java policy 文件授权，实现了高内聚纵深防御"
      ]
    },
    keyPoints: ["SecurityManager 废弃", "AccessController 栈扫描", "Seccomp 拦截", "Namespace 隔离", "Docker 最小特权", "AccessControlException"],
    traps: ["在一些遗留系统从 Java 8 升级到 Java 17+ 时，如果代码中显式调用了 `System.setSecurityManager()`，新版 JDK 默认会抛出 `UnsupportedOperationException` 报错，必须在启动参数中配置 `-Djava.security.manager=allow` 进行兼容，或者彻底重构移除它"],
    relatedIds: ["interview_java_040_security_npe"]
  }
];

const fileContent = `// interview-java.js
// 自动生成主题题库：Java (归属于 backend)

const questions = ${JSON.stringify(originalQuestions.concat(segment1).concat(segment2).concat(segment3), null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-java.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-java.js with all 50 questions!');











