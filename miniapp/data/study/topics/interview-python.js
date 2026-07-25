// interview-python.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_python_001_gil",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "python",
    "title": "Python GIL 全局解释器锁与 3.13 自由线程",
    "difficulty": 4,
    "frequency": 5,
    "question": "什么是 CPython 的 GIL（全局解释器锁）？为什么它会导致多线程无法利用多核 CPU？Python 3.13 引入的自由线程（Free-Threaded, PEP 703）是如何在不降低单线程性能的前提下移除 GIL 的？",
    "answer": {
      "short": "GIL 是 CPython 解释器中保证同一时刻只有一个线程执行 Python 字节码的互斥锁，导致多线程在 CPU 密集型任务下退化为单核轮转；Python 3.13 引入 PEP 703，通过偏向锁、Mimalloc 内存分配器优化以及垃圾回收的无锁化改造，实现了移除 GIL 的自由线程构建。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Python GIL 全局解释器锁与 3.13 自由线程】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. GIL 历史成因：CPython 内存管理不是线程安全的。为了简化设计、防止多线程引用计数冲突，CPython 引入了全局互斥锁 GIL。任何线程在执行字节码前必须抢占 GIL。\n2. 为什么多核失效：CPU 密集型任务中，多线程在多核上运行时，会因为频繁抢占和释放 GIL 产生大量的系统线程上下文切换，不仅无法加速，甚至可能因为线程唤醒和争抢导致性能比单线程更慢。\n3. Python 3.13 自由线程（PEP 703）突破点：\n   - **偏向锁（Biased Locking）**：优化引用计数。如果对象只被单个线程访问，不执行昂贵的原子操作计数，避免单线程性能倒退。\n   - **mimalloc 内存分配器**：使用微软的高性能无锁分配器，解决多线程并发申请内存时的锁竞争。\n   - **无锁 GC（Hazard Pointers）**：垃圾回收阶段的循环检测采用无锁设计，避免了因为无 GIL 导致的多线程 GC 并发安全崩溃。",
      "structured": [
        "GIL 互斥锁：CPython 底层保护引用计数与运行时内部状态的安全屏障，强制字节码只能单核串行串行",
        "多核竞争惩罚：多线程在多核运行 CPU 密集型任务时，线程间频繁争抢锁和唤醒，造成大量物理 CPU 空转",
        "PEP 703 自由线程（3.13）：重构内存与垃圾回收层。将 GIL 设为编译期可选，提供 `--disable-gil` 模式",
        "无锁优化（偏向锁）：单线程访问对象避开原子指令计数开销，配合 mimalloc 分配器彻底释放多线程并发效率"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Python（CPython 解释器）有 GIL 全局解释器锁限制，保证了字节码执行的线程安全，但使得多线程无法利用多核。垃圾回收以引用计数为主，标记-清除和分代收集为辅。由于引用计数无法解决循环引用，Python 会定期扫描容器对象，剔除孤立闭环。"
    },
    "keyPoints": [
      "GIL",
      "CPython 限制",
      "多线程多核",
      "PEP 703",
      "Free-Threaded",
      "偏向锁",
      "mimalloc"
    ],
    "traps": [
      "在含有 GIL 的常规 Python 中，多线程只适用于 I/O 密集型任务（如爬虫、网络请求），此时线程在等待 I/O 时会主动释放 GIL 让出 CPU；如果是 CPU 密集型计算，必须使用 `multiprocessing` 多进程或调用 C 扩展释放 GIL",
      "既然有 GIL 限制，Python 怎么实现高并发？防撕要点：1. 对于 CPU 密集型任务，改用多进程（multiprocessing）绕过 GIL，利用多核。2. 对于 I/O 密集型任务，使用协程（asyncio）在单线程下实现非阻塞 of 并发调度。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_python_002_gc",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "python",
    "title": "Python 引用计数与分代垃圾回收机制",
    "difficulty": 4,
    "frequency": 5,
    "question": "请详述 Python 的垃圾回收（GC）机制。引用计数（Reference Counting）是如何与分代回收（Generational GC）以及循环引用检测配合工作的？",
    "answer": {
      "short": "Python 回收以引用计数为主（即时释放，开销平摊），分代回收为辅；引用计数无法解决循环引用（如 A 指 B，B 指 A），因此 GC 会定期启动，通过三色标记法寻找并切断容器对象之间的双向链表引用，计算有效可达引用，将存活对象在 0/1/2 三代中逐渐晋升。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Python 引用计数与分代垃圾回收机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 引用计数（第一防线）：\n   - 每个 PyObject 都有 `ob_refcnt`。创建/引用时 +1，销毁时 -1。清零时立即物理释放，内存开销小且无延时。\n   - 缺点：循环引用（Circular References）导致计数永远不为 0，引发内存泄漏。\n2. 循环引用检测与分代回收（第二防线）：\n   - **针对容器对象**：只有 dict, list, tuple, class 实例等容器对象才会产生循环引用。常规 int, str 不参与。\n   - **标记-清除（Mark and Sweep）**：GC 拷贝一份所有容器对象的引用计数副本。遍历对象，如果对象 A 指向 B，就将 B 的副本计数减 1。遍历结束后，副本计数非 0 的是真正可达的（GC Roots），将其引用的链条标记为存活；副本计数为 0 的则是循环引用孤岛，直接清除。\n   - **分代机制（Generations）**：分为 0 代（新创建，高频 GC）、1 代、2 代（常驻，低频 GC）。新对象在 0 代。经历一次 GC 存活后移入 1 代，再存活晋升 2 代。当各代对象数或分配比达到阈值时触发对应代 GC，极大优化了垃圾扫描的 CPU 开销。",
      "structured": [
        "引用计数即时释放：每个对象 ob_refcnt 记录生命周期。清零瞬间立即执行 tp_dealloc 释放，平摊垃圾回收耗时",
        "循环引用死结：A 与 B 互指，即使外界解除引用，ob_refcnt 依然为 1，导致计数器彻底失效失效",
        "分代回收降噪：对象划分为三代。经历 GC 考验则向上升级晋升，只对低代（0代）频繁扫描，减少全局 STW 卡顿",
        "标记-清除算法：GC 拷贝计数并模拟减枝。排除容器间的循环引用，揪出孤立不可达链表进行物理擦除"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Python（CPython 解释器）有 GIL 全局解释器锁限制，保证了字节码执行的线程安全，但使得多线程无法利用多核。垃圾回收以引用计数为主，标记-清除和分代收集为辅。由于引用计数无法解决循环引用，Python 会定期扫描容器对象，剔除孤立闭环。"
    },
    "keyPoints": [
      "引用计数 ob_refcnt",
      "循环引用",
      "分代回收",
      "0/1/2 代阈值",
      "标记-清除",
      "容器对象链表"
    ],
    "traps": [
      "Python 中的循环引用对象如果定义了 `__del__` 析构函数，在 Python 3.4 之前会导致 GC 无法安全判定回收顺序而直接将其放入 `gc.garbage` 常驻内存中，导致泄漏；3.4+ 引入 PEP 442 解决了此回收顺序限制，但仍应尽量避免循环引用",
      "既然有 GIL 限制，Python 怎么实现高并发？防撕要点：1. 对于 CPU 密集型任务，改用多进程（multiprocessing）绕过 GIL，利用多核。2. 对于 I/O 密集型任务，使用协程（asyncio）在单线程下实现非阻塞 of 并发调度。"
    ],
    "relatedIds": [
      "interview_python_001_gil"
    ]
  },
  {
    "id": "interview_python_003_dict",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "python",
    "title": "Python dict 底层哈希表布局与 3.6 优化",
    "difficulty": 4,
    "frequency": 5,
    "question": "Python 中的 dict 是如何实现的？在 Python 3.6 之后，其底层哈希表结构做出了什么革命性的空间优化（Indices 数组与 Entries 数组分离）？它是如何解决哈希冲突的？",
    "answer": {
      "short": "Python dict 基于开放寻址哈希表实现；在 3.6 之前，哈希表是稀疏的大数组（每个 entry 占 24 字节，空间浪费严重）；3.6+ 将其重构为紧凑的 entries 数组（顺序存储 KV）加上一个占用空间极小的 indices 索引数组，使内存消耗降低 30% 以上，并天然实现了 dict 遍历的插入有序性；冲突通过伪随机探测算法解决。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Python dict 底层哈希表布局与 3.6 优化】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 3.6 之前的 dict 布局：\n   - 底层是一个 `PyDictKeysObject`，里面是一个大数组 `ma_keys`，每个格子是一个 `PyDictKeyEntry` 结构体：`{me_hash, me_key, me_value}`（占 24 字节）。\n   - 因为哈希表为了防止冲突，必须保持稀疏（装载因子 < 2/3）。这导致数组中有大量的空格子（每个空槽占 24 字节），物理内存非常空耗。\n2. 3.6+ 新版 dict 布局（紧凑数组）：\n   - **indices 数组**：一个简单的一维整数数组（例如 `[nil, 0, nil, 1]`），其格子根据 dict 大小，元素可以仅用 `int8` 或 `int16`（占 1-2 字节）存储。Key 的哈希取模后直接映射在此数组中。\n   - **entries 数组**：一个紧凑的、没有任何空隙的 `PyDictKeyEntry` 数组。按键值的真实插入顺序挨个存放：`[ {hash1, k1, v1}, {hash2, k2, v2} ]`。没有空槽。\n   - **工作流**：哈希取模算出来的索引去查 `indices`，得到紧凑 entries 数组的下标（如 0），再查 `entries[0]` 获取对应数据。内存利用率极大提升，且 entries 数组天然保留了插入的先后顺序，这就是 Python 3.6+ dict 默认变为**插入有序**的底层奥秘。\n3. 冲突解决：使用**伪随机探测（Pseudo-random probing）**：`j = (5*j + 1 + perturb) >> 5`。perturb 会在每次冲突时右移，随着冲突加深，perturb 变为 0，探测退化为普通的线性随机分布，保证了极佳的聚集抗性。",
      "structured": [
        "稀疏表内存痛点（旧版）：老版哈希表槽位占 24 字节且需维持稀疏装载，导致空闲空槽白白吃掉大笔物理内存",
        "Indices/Entries 分离（新版）：Indices 存储短字节索引，Entries 顺序连贯紧密排布 KV 实体，内存开销直降 30%+",
        "遍历有序性红利：因为 entries 数组是按 insert 顺序物理追加的，遍历 dict 时直接遍历 entries，使字典天然有序",
        "伪随机探测寻址：采用开放寻址法，哈希冲突时通过混入哈希高位的位移公式 `(5*j + 1 + perturb)` 动态改变探测步长"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Python（CPython 解释器）有 GIL 全局解释器锁限制，保证了字节码执行的线程安全，但使得多线程无法利用多核。垃圾回收以引用计数为主，标记-清除和分代收集为辅。由于引用计数无法解决循环引用，Python 会定期扫描容器对象，剔除孤立闭环。"
    },
    "keyPoints": [
      "dict 底层",
      "indices 索引数组",
      "entries 紧凑数组",
      "插入有序性",
      "伪随机探测",
      "哈希冲突"
    ],
    "traps": [
      "由于新版 dict 天然有序，很多开发者开始依赖 `list(dict.keys())` 的顺序；但注意，如果在运行期高频地删除和新增 key，entries 数组中会留存被标记删除的 dummy 槽位，并可能在触发 resizing 时发生物理重新分配，导致顺序重排",
      "既然有 GIL 限制，Python 怎么实现高并发？防撕要点：1. 对于 CPU 密集型任务，改用多进程（multiprocessing）绕过 GIL，利用多核。2. 对于 I/O 密集型任务，使用协程（asyncio）在单线程下实现非阻塞 of 并发调度。"
    ],
    "relatedIds": [
      "interview_python_024_hashable_keys"
    ]
  },
  {
    "id": "interview_python_004_list_tuple",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "python",
    "title": "Python list 动态扩容与 tuple 自由链表缓存",
    "difficulty": 3,
    "frequency": 4,
    "question": "请对比 Python 中 list（列表）与 tuple（元组）的底层物理实现差异。list 是如何执行动态过分配（Over-allocation）扩容的？tuple 又是如何利用 freelist（自由链表）缓存机制优化内存分配效率的？",
    "answer": {
      "short": "list 是可变动态数组，其扩容公式为 `new_allocated = (size >> 3) + (size < 9 ? 3 : 6) + size`，采用过分配减少拷贝；tuple 是只读固定长数组，创建后不可变，且 CPython 内部维护了 `free_list`，复用被销毁的元组对象，省去了高频申请系统物理内存的开销。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Python list 动态扩容与 tuple 自由链表缓存】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 物理结构对比：\n   - **list**：底层为 `PyListObject`。包含 `ob_item`（指向元素指针数组的二级指针），`allocated`（物理分配容量），`ob_size`（实际元素个数）。\n   - **tuple**：底层为 `PyTupleObject`。长度在创建时即固定，没有 `allocated` 概念，直接跟着 `ob_size`，结构体极度紧凑（省去了扩容的指针消耗）。\n2. list 扩容物理机制：\n   - 当 `len(list) == allocated` 且执行 `append` 时，触发 `list_resize`。\n   - 扩容并不是加 1。公式：`new_allocated = (size >> 3) + (size < 9 ? 3 : 6) + size`。\n   - 这会在需要的大小之上，过分配约 1/8 的额外冗余空间，使得后续的 append 大概率能以 O(1) 瞬时完成，防止高频触发 `realloc` 数组迁移。\n3. tuple 的 freelist 优化（CPython 核心黑魔法）：\n   - 由于 tuple 经常在高频拼装、参数传递中使用（如 `*args`），销毁极频繁。\n   - CPython 源码中为大小在 1 到 20 之间的 tuple 分别建立了数组 `free_list` 缓存池。\n   - 当一个小 tuple（如长度 2）执行垃圾回收被销毁时，系统**不将其物理内存释放回 OS**，而是清除其数据后，将 `PyTupleObject` 头部挂入对应长度的 `free_list[2]` 中。\n   - 下一次代码执行 `t = (a, b)` 时，直接从 `free_list[2]` 中直接把这个结构体拔出来复用，改写数据。省去了 `malloc` 内存申请开销，速度极快。",
      "structured": [
        "list 二级指针结构：PyListObject 持有 allocated 容量和 ob_size 大小，依靠 ob_item 连续指针物理寻址",
        "动态过分配公式：扩容步长约为当前大小的 12.5%（1/8）。大容量时能将高并发 append 拷贝折旧摊销至常数级",
        "tuple 固定只读：直接连同数据打包在单一物理内存块中，不可动态 resizing，节省了管理属性，内存极其紧凑",
        "freelist 对象池化：CPython 内置 free_list。缓存被释放的小元组结构体，省去内核态物理内存分配系统调用"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Python（CPython 解释器）有 GIL 全局解释器锁限制，保证了字节码执行的线程安全，但使得多线程无法利用多核。垃圾回收以引用计数为主，标记-清除和分代收集为辅。由于引用计数无法解决循环引用，Python 会定期扫描容器对象，剔除孤立闭环。"
    },
    "keyPoints": [
      "PyListObject",
      "PyTupleObject",
      "过分配扩容",
      "free_list 缓存",
      "指针数组",
      "值拷贝开销"
    ],
    "traps": [
      "在写高频循环时，使用 `list += [x]` 会隐式创建一个临时单元素 list 并触发合并，带来无谓的 GC 消耗，应始终无脑使用 `list.append(x)` 以享受 allocated 预留空间的物理优化",
      "既然有 GIL 限制，Python 怎么实现高并发？防撕要点：1. 对于 CPU 密集型任务，改用多进程（multiprocessing）绕过 GIL，利用多核。2. 对于 I/O 密集型任务，使用协程（asyncio）在单线程下实现非阻塞 of 并发调度。"
    ],
    "relatedIds": [
      "interview_python_023_numpy_layout"
    ]
  },
  {
    "id": "interview_python_005_metaclass",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "python",
    "title": "Python 元类 metaclass 底层运作与 new/init 执行差异",
    "difficulty": 4,
    "frequency": 4,
    "question": "什么是 Python 中的元类（metaclass）？请结合类创建的物理流，详细阐述元类中的 `__new__` 方法与 `__init__` 方法在参数接收、调用顺序及核心职责上的本质区别。",
    "answer": {
      "short": "元类是创建“类对象”的类（默认元类是 `type`）；在类声明被解析时，元类的 `__new__` 首先被执行，负责在内存中物理创建并返回一个全新的类对象（Class Object）；而元类的 `__init__` 在类创建完毕后执行，负责对已创建的类对象进行属性初始化和修饰。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Python 元类 metaclass 底层运作与 new/init 执行差异】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 什么是元类：\n   - Python 里一切皆对象。类本身也是一个对象（Class Object），它是元类 `type` 的实例。\n   - 元类可以拦截、修改、注册类的定义，是 ORM 框架（如 Django ORM, SQLAlchemy）的核心实现工具。\n2. 类创建生命周期：\n   - 当解释器看到 `class MyClass(metaclass=MyMeta):` 时，会收集类名（name）、父类元组（bases）以及类体内定义的属性字典（dct）。\n   - 调用元类 `MyMeta` 来实例化这个类对象。\n3. `__new__` vs `__init__` 在元类中的差异：\n   - **`__new__(cls, name, bases, dct)`**：\n     - 必须返回一个真正的类对象：`return super().__new__(cls, name, bases, dct)`。\n     - 核心职责是**内存分配与物理塑造**。在类对象还不存在时被调用，你可以在此处强行改写 `dct`（如强制把所有属性名变大写，或者自动注入特殊的属性字段）。\n   - **`__init__(self, name, bases, dct)`**：\n     - `self` 此时是已经被 `__new__` 物理创建出来的那个类对象了。它没有返回值（返回 None）。\n     - 核心职责是**后置修饰与逻辑注册**。此时你无法替换类对象本身，只能做些属性填充、方法挂载或者把这个类注册到全局 registry 字典里。",
      "structured": [
        "一切皆对象（Type）：类是元类的实例，创建类等同于实例化元类。自定义元类需要继承 `type` 这一唯一始祖",
        "__new__ 内存塑造：参数为 `cls, name, bases, dct`。职责是向 CPython 申请内存并物理生成类实体，可篡改属性字典",
        "__init__ 初始化修饰：参数为 `self, name, bases, dct`。Self 已经是生成的类。职责是对类变量做装饰或注册，无替换权",
        "执行顺序控制：先执行元类 `__new__`，返回类对象后再激活元类 `__init__`，最后主线程才能拿到该类去实例化普通对象"
      ],
      "deepDive": "\n\n【底层机制/折中设计】：Python（CPython 解释器）有 GIL 全局解释器锁限制，保证了字节码执行的线程安全，但使得多线程无法利用多核。垃圾回收以引用计数为主，标记-清除和分代收集为辅。由于引用计数无法解决循环引用，Python 会定期扫描容器对象，剔除孤立闭环。"
    },
    "keyPoints": [
      "metaclass 元类",
      "type",
      "__new__ vs __init__",
      "属性字典 dct",
      "类对象创建",
      "ORM 原理"
    ],
    "traps": [
      "在元类的 `__new__` 中修改 `dct` 字典时，必须直接对传入的 `dct` 内存执行修改，或者传入修改后的副本，若不慎在 `__new__` 里返回了非类对象（如返回了一个普通 string），会导致整个类的初始化流程死锁崩溃并引发运行时报错",
      "既然有 GIL 限制，Python 怎么实现高并发？防撕要点：1. 对于 CPU 密集型任务，改用多进程（multiprocessing）绕过 GIL，利用多核。2. 对于 I/O 密集型任务，使用协程（asyncio）在单线程下实现非阻塞 of 并发调度。"
    ],
    "relatedIds": [
      "interview_python_009_descriptor",
      "interview_python_010_mro_c3"
    ]
  }
];

module.exports = questions;
