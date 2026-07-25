// interview-cpp.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_cpp_001_smart_pointers",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cpp",
    "title": "C++ 智能指针底层控制块与引用计数原理",
    "difficulty": 4,
    "frequency": 5,
    "question": "C++ 智能指针 `std::unique_ptr`、`std::shared_ptr` 和 `std::weak_ptr` 的底层物理实现原理是怎样的？`shared_ptr` 的控制块（Control Block）里包含哪些信息？`weak_ptr` 是如何升级为 `shared_ptr` 的？",
    "answer": {
      "short": "`unique_ptr` 零开销封装，独占指针；`shared_ptr` 内部包含指向对象的指针和指向堆上共享控制块的指针，控制块含强引用计数、弱引用计数及自定义释放器；`weak_ptr` 持有控制块指针但不增加强计数，升级时通过 `lock()` 执行 CAS 原子操作检查强计数是否大于 0，大于则生成新的 `shared_ptr`。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 智能指针底层控制块与引用计数原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. unique_ptr 物理实现：\n   - 基本上是一个 naked 指针的包裹。通过 RAII 机制，在析构函数里 `delete` 指针。\n   - 大小等于一个指针的大小（8字节）。若使用自定义 deleter，可能会因为保存 deleter 状态导致大小增加（可用空基类优化 EBO 避免）。\n2. shared_ptr 物理实现与控制块（Control Block）：\n   - 大小为 16 字节（包含两个指针：一个指向所托管的原始资源对象，另一个指向共享的“控制块”）。\n   - 控制块物理内存位于堆上，为所有共享当前对象的 `shared_ptr` 共用。包含：\n     - **Strong Ref Count（强引用计数）**：记录有多少个 `shared_ptr` 共享该资源。当其归零时，释放托管的原始资源对象，并执行自定义 Deleter。\n     - **Weak Ref Count（弱引用计数）**：记录有多少个 `weak_ptr` 关联该资源。注意：控制块的最终物理释放，必须等强引用计数和弱引用计数**同时归零**时发生。\n     - **Custom Deleter（自定义释放器）** 与 **Allocator（分配器）**。\n   - 引用计数修改必须是原子操作（使用原子指令如 `lock xadd`），确保多线程下的计数安全，但这也带来了少许并发性能开销。\n3. weak_ptr 升级（Promotion）：\n   - `weak_ptr` 同样占 16 字节（资源指针 + 控制块指针），但不累加强引用计数，仅累加弱计数。避免了 `shared_ptr` 的循环引用死结。\n   - 不能直接访问资源。必须调用 `wp.lock()` 升级。\n   - **升级核心（CAS原子锁定）**：`lock()` 方法会原子地检查控制块内的强引用计数是否大于 0。如果是，说明资源还活着，它将强计数原子地加 1，并返回一个合法的 `shared_ptr`；如果强计数已为 0，说明资源已被销毁，返回一个空的 `shared_ptr`。整个过程是线程安全的。",
      "structured": [
        "unique_ptr 独占零成本：利用 C++ 析构函数保证单一 ownership 资源自动回收，大小与原生指针无二，移动时执行所有权转移",
        "shared_ptr 控制块双指针：包含托管对象指针和堆分配控制块指针。控制块内聚强引用、弱引用计数和自定义释放器",
        "原子计数修改：强弱计数的累加/递减均通过原子 CPU 指令（CAS/原子自增）保证多线程读写安全，但会产生微小同步损耗",
        "weak_ptr lock 升级：弱指针不计强计数，调用 lock() 时原子验证强计数 > 0，执行 CAS 累加成功后包装为 shared_ptr 返回"
      ],
      "deepDive": "\n\n【源码底层/安全防御】：C++ 的多态是通过虚函数表指针（vptr）和虚函数表（vtable）在运行期跳转实现的。每个包含虚函数的类实例在首部物理存储着一个 vptr 指针，这会产生 8 字节的额外物理内存开销。智能指针 shared_ptr 包含强引用计数和弱引用计数的控制块，由于控制块在堆上分配，频繁创建会产生内存碎片，必须配合 weak_ptr 解决循环引用。"
    },
    "keyPoints": [
      "unique_ptr",
      "shared_ptr",
      "weak_ptr",
      "控制块 Control Block",
      "强弱引用计数",
      "CAS 原子升级",
      "自定义 Deleter"
    ],
    "traps": [
      "如果使用同一个原始指针初始化两个独立的 `shared_ptr`（如 `int* p = new int; shared_ptr<int> sp1(p); shared_ptr<int> sp2(p);`），这会创建两个**独立的堆控制块**，导致 `p` 在析构时被 `delete` 两次，引发严重的 Double Free 崩溃崩溃；必须使用 `std::make_shared` 或 `shared_from_this` 规避",
      "面试官常问“智能指针 shared_ptr 是否线程安全？”。避坑核心：shared_ptr 本身的引用计数加减操作使用原子操作，是线程安全的；但是，其指向的原始对象在多线程下读写是没有加锁保护的，完全线程不安全！必须由业务层加互斥锁（std::mutex）保护。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_cpp_002_vtable_vptr",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cpp",
    "title": "C++ 虚函数表 vtable 与多重继承内存布局",
    "difficulty": 4,
    "frequency": 5,
    "question": "C++ 的多态虚函数表（vtable）与虚表指针（vptr）是如何实现动态绑定的？在多重继承（Multiple Inheritance）和虚继承（Virtual Inheritance）下，派生类对象的物理内存布局是怎样的？什么是 Thunk 技术？",
    "answer": {
      "short": "多态通过对象首部的 vptr 指针指向类的 vtable（存虚函数地址）实现；多重继承下，派生类会有多个 vptr，对应不同的基类子对象内存区；虚继承引入 vbptr 指向虚基表，将虚基类物理移到对象最末端以消除菱形继承重复；Thunk 技术是一小段汇编，用于在多重继承虚函数回调时动态修正 `this` 指针偏移量。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 虚函数表 vtable 与多重继承内存布局】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 虚函数表与动态绑定：\n   - 若类含有虚函数，编译器在编译期为该类生成一个静态的虚函数表（vtable），里面是虚函数的地址数组。\n   - 该类的实例对象在最前端（或根据编译器偏移）自动插入一个虚表指针（vptr），指向对应的 vtable。\n   - 调用时，通过 `obj->vptr[index]()` 进行间接寻址寻址，达成运行时动态多态。\n2. 多重继承的内存布局：\n   - 假设 `class C : public A, public B`。\n   - `C` 的对象布局依次为：`[A 包含其 vptrA ] -> [B 包含其 vptrB ] -> [ C 自身的成员 ]`。\n   - 此时对象有**两个虚表指针**。当我们把 `C*` 隐式强转为 `B*` 时，编译器会把指针的值**向后偏移 sizeof(A) 字节**，使其精确指向 B 子对象部分。\n3. 虚继承与虚基类布局（菱形继承消除）：\n   - `class B : virtual public A`，`class C : virtual public A`。\n   - 虚继承的对象中不再直接包含基类 A 的副本，而是引入了**虚基类指针（vbptr）**。\n   - 物理布局：把共同的虚基类 A 移到对象的**最末端**，虚基表里记录了从当前子对象到末端 A 对象的偏移量。无论继承链多复杂，最末端只有一份基类 A，彻底解决了多重拷贝冲突。\n4. Thunk 技术原理解析：\n   - 当通过 `B*` 指针调用 B 中被 C 重写的虚函数时，虚函数需要访问 C 自身的成员。但是此时 `this` 指针指向的是 B 子对象（偏移后的地址），如果直接执行 C 的代码，会导致成员变量读取越界崩溃。\n   - vtable 中该虚函数槽位指向的不是真正的函数体，而是一段被称为 **Thunk（指针调整跳板）** 的汇编代码。\n   - Thunk 执行两步：1. 将 `this` 寄存器原子扣除偏移量，使其重新指向 C 对象的物理起点；2. 执行 `jmp` 跳转到 C 类的真实虚函数代码处。完美解决了多继承下的 this 指针漂移安全问题。",
      "structured": [
        "vptr 首部植入：包含虚函数的类实例在首部携带指向 vtable 的 vptr。调用时查表跳转跳转，增加了指针间接寻址时延",
        "多重继承双 vptr 偏移：多重继承对象包含多个基类影子，强转不同基类时，编译器静态改写 this 指针数值指向对应虚指针",
        "虚继承末端漂移：将祖先基类独立出来放置在对象最尾部，子类通过 vbptr 偏移表动态寻址，从物理上消除菱形数据冗余",
        "Thunk 汇编跳板：在 vtable 中插入 CPU 指令段，在虚函数跳转瞬间对 this 指针作减法修正，保障多继承类函数调用的寻址安全"
      ],
      "deepDive": "\n\n【源码底层/安全防御】：C++ 的多态是通过虚函数表指针（vptr）和虚函数表（vtable）在运行期跳转实现的。每个包含虚函数的类实例在首部物理存储着一个 vptr 指针，这会产生 8 字节的额外物理内存开销。智能指针 shared_ptr 包含强引用计数和弱引用计数的控制块，由于控制块在堆上分配，频繁创建会产生内存碎片，必须配合 weak_ptr 解决循环引用。"
    },
    "keyPoints": [
      "虚函数表 vtable",
      "虚表指针 vptr",
      "多重继承布局",
      "虚继承 vbptr",
      "菱形继承消除",
      "Thunk 指针修正",
      "this 调整"
    ],
    "traps": [
      "在构造函数或析构函数内部调用虚函数时，**C++ 的动态多态机制是失效的**。因为此时派生类部分还未构建完毕（或已被销毁），对象的 vptr 依然指向基类的虚表，只会执行基类版本的函数，可能导致业务逻辑未按预期运行",
      "面试官常问“智能指针 shared_ptr 是否线程安全？”。避坑核心：shared_ptr 本身的引用计数加减操作使用原子操作，是线程安全的；但是，其指向的原始对象在多线程下读写是没有加锁保护的，完全线程不安全！必须由业务层加互斥锁（std::mutex）保护。"
    ],
    "relatedIds": [
      "interview_cpp_021_virtual_destructor"
    ]
  },
  {
    "id": "interview_cpp_003_move_semantics",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cpp",
    "title": "C++ 移动语义与完美转发底层原理",
    "difficulty": 4,
    "frequency": 5,
    "question": "C++11 为什么要引入右值引用（Rvalue Reference）？`std::move` 的物理本质是什么？什么是完美转发（Perfect Forwarding）？引用折叠（Reference Collapsing）是如何配合 `std::forward` 实现转发的？",
    "answer": {
      "short": "`std::move` 物理上只是一个无条件强制类型转换，将左值转为右值引用以激活移动构造函数，避免深拷贝；完美转发通过万能引用接收参数，在转发时利用 `std::forward` 配合引用折叠规则（只有右值引用折叠为右值引用，其余皆为左值引用），使参数的左/右值属性原封不动地传递给下游函数。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 移动语义与完美转发底层原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 引入右值引用的初衷：\n   - 解决深拷贝开销。例如临时对象（右值）在函数返回时被销毁，如果能把它的内存“偷”过来（直接移走指针），就能极大提升资源搬运效率。\n2. std::move 的本质：\n   - 源码：`static_cast<typename std::remove_reference<T>::type&&>(t)`。\n   - **物理本质**：它**没有移动任何数据**！它仅仅是一个**编译期的强制类型转换**，把传入的变量强转为右值引用类型（`T&&`）。以便告诉编译器，这个变量后续可以被“合法的抢劫资源”（调用其移动构造函数）。\n3. 万能引用（Universal/Forwarding Reference）：\n   - 在模板函数参数 `template<typename T> void func(T&& arg)` 中，`T&&` 并不是简单的右值引用，而是万能引用，既能接左值，也能接右值。\n4. 引用折叠（Reference Collapsing）与 std::forward 原理：\n   - 为了在传递中保持原样，C++ 规定了引用折叠规则：\n     - `& &` -> `&`（左值引用）\n     - `& &&` -> `&`（左值引用）\n     - `&& &` -> `&`（左值引用）\n     - `&& &&` -> `&&`（右值引用）\n     - 规律：**只有两个都是右值引用时，折叠结果才是右值引用；只要有左值引用参与，折叠结果就是左值引用**。\n   - **std::forward 机制**：\n     - `std::forward<T>(arg)` 内部也是强制强转：`static_cast<T&&>(arg)`。\n     - 如果传进来的是左值 `X&`，T 被推导为 `X&`。代入强转：`static_cast<X& &&>`，引用折叠为 `X&`。转发左值。\n     - 如果传进来的是右值 `X&&`，T 被推导为 `X`。代入强转：`static_cast<X&&>`，没有折叠，仍是 `X&&`。转发右值。完美实现了参数特征的无损投递。",
      "structured": [
        "右值引用偷取所有权：利用 T&& 锁定无名临时对象，通过改写内部指针直接抢夺底层堆空间，彻底干掉冗余拷贝",
        "std::move 强转面具：底层不产生任何机器码复制指令。仅在编译期将左值强制降级转换为右值引用以触发移动构造",
        "引用折叠物理法：C++ 为处理模板复合引用，推导折叠规则。四类组合中，只有 `&& &&` 能收敛为右值引用",
        "std::forward 完美传递：配合折叠规则，将泛型 T&& 传递参数的左/右值属性分类重铸并原样抛送给下游目标方法"
      ],
      "deepDive": "\n\n【源码底层/安全防御】：C++ 的多态是通过虚函数表指针（vptr）和虚函数表（vtable）在运行期跳转实现的。每个包含虚函数的类实例在首部物理存储着一个 vptr 指针，这会产生 8 字节的额外物理内存开销。智能指针 shared_ptr 包含强引用计数和弱引用计数的控制块，由于控制块在堆上分配，频繁创建会产生内存碎片，必须配合 weak_ptr 解决循环引用。"
    },
    "keyPoints": [
      "右值引用 T&&",
      "std::move 转换",
      "完美转发",
      "std::forward",
      "引用折叠 rules",
      "万能引用",
      "移动构造"
    ],
    "traps": [
      "在执行 `std::move(x)` 之后，原对象 `x` 的物理状态取决于其移动构造函数的具体实现（通常其内部指针会被置为 `nullptr`），但它**依然处于生命周期内**，再次对 `x` 进行读取操作属于未定义行为或容易导致崩溃，必须先对其进行重新赋值赋值",
      "面试官常问“智能指针 shared_ptr 是否线程安全？”。避坑核心：shared_ptr 本身的引用计数加减操作使用原子操作，是线程安全的；但是，其指向的原始对象在多线程下读写是没有加锁保护的，完全线程不安全！必须由业务层加互斥锁（std::mutex）保护。"
    ],
    "relatedIds": [
      "interview_cpp_008_rule_of_five"
    ]
  },
  {
    "id": "interview_cpp_004_memory_alignment",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cpp",
    "title": "C++ 内存对齐 alignas 约束与 Struct 填充原理",
    "difficulty": 3,
    "frequency": 4,
    "question": "为什么 CPU 需要内存对齐（Memory Alignment）？C++ 中的 `alignof` 和 `alignas` 关键字有什么作用？在没有手动干预下，编译器是如何按照什么规则对 `struct` 进行空间填充（Padding）的？",
    "answer": {
      "short": "CPU 并非按单字节读取内存，而是以 2/4/8/16 字节为粒度的 Cache Line 读取，未对齐会导致跨步二次读取，降低效率；`alignof` 获取类型对齐字节数，`alignas` 强行指定对齐边界；struct 填充规则是：1. 成员起始偏移量必须是其自身大小的整倍数；2. 结构体总大小必须是最大成员大小的整倍数。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 内存对齐 alignas 约束与 Struct 填充原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 内存对齐 alignas 约束与 Struct 填充原理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 为什么对齐：\n   - 硬件限制：CPU 和内存总线之间通过数据总线连接。32位 CPU 每次读 4 字节，64位读 8 字节。数据在内存中的地址如果不整除 8，比如跨越了 `0x07` 和 `0x08` 两个 8 字节边界。\n   - 跨步读取：未对齐时，CPU 必须发起 **2 次内存访问**，并进行移位、拼接，极大拖慢了内存吞吐和执行速度，有些架构（如 ARM）甚至会抛出硬件对齐异常崩溃。\n2. struct 空间填充（Padding）三大黄金规则：\n   - **规则一：成员对齐**：每个成员的起始地址偏移量（offset），必须能够整除该成员的对齐单位（通常是该成员的大小，如 `int` 占 4 字节，起始偏移必须整除 4）。如果不满足，编译器在前一个成员后填充（Padding）空闲字节。\n   - **规则二：结构体自身对齐**：结构体本身也有对齐要求，等于其**所有成员中对齐单位最大的那一个**（如结构体含有 `double`，则结构体整体对齐为 8）。\n   - **规则三：总大小收尾对齐**：结构体的总大小（sizeof）必须是其自身最大对齐单位（规则二算出的值）的**整数倍**。如果不够，在尾部填充空字节。这是为了在定义该结构体数组时，保证数组第二个元素的起始地址依然能完美对齐。\n3. C++11 alignof / alignas 关键字：\n   - `alignof(MyStruct)`：返回该类型所要求的对齐字节数。\n   - `alignas(16) int arr[4]`：强制数组 arr 在物理内存中必须以 16 字节（如 SSE 指令集对齐要求）的边界开始存放，方便执行高速矢量化指令。",
      "structured": [
        "Cache Line 读取粒度：CPU 以 4 或 8 字节为边界对齐读取。未对齐会触发硬件跨边界二次寻址并拼接，伤害带宽",
        "成员首偏移判定（规则一）：各成员首地址偏移必须是自身基本大小的整倍数，不满足则在空位填充 padding 填充",
        "结构体尾收拢对齐（规则三）：总大小必须是最大宽度成员大小的整数倍，保证结构体数组排布时的各元素对齐无偏离",
        "alignas 强制边界：支持指定 16/32/64 等对齐，方便 SSE/AVX 向量化指令直接执行高速读写，避免慢速非对齐指令"
      ],
      "deepDive": "\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【C++ 内存对齐 alignas 约束与 Struct 填充原理】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【C++ 内存对齐 alignas 约束与 Struct 填充原理】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。"
    },
    "keyPoints": [
      "内存对齐",
      "alignof 关键字",
      "alignas 强制对齐",
      "struct padding",
      "Cache Line 读取",
      "物理地址寻址"
    ],
    "traps": [
      "在编写跨平台网络通信程序时，由于不同操作系统/编译器默认的结构体对齐机制（如 32 位 vs 64 位）可能不同，直接通过 TCP 发送 struct 二进制流会导致接收端解析出脏数据，必须使用 `#pragma pack(push, 1)` 强行取消 padding 对齐对齐进行序列化",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。",
      "避坑指南：注意防范面试官针对此考点追问极限高并发和网络分区脑裂等临界故障，回答时要体现真实的生产容灾预案。"
    ],
    "relatedIds": [
      "interview_cpp_003_move_semantics"
    ]
  },
  {
    "id": "interview_cpp_005_sfinae_enable_if",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "cpp",
    "title": "C++ 模板元编程 SFINAE 原理与 enable_if 分支",
    "difficulty": 4,
    "frequency": 4,
    "question": "什么是 C++ 模板中的 SFINAE（匹配失败不是错误）原则？`std::enable_if` 是如何利用这一原则在编译期实现函数重载决议（Overload Resolution）控制的？",
    "answer": {
      "short": "SFINAE 指编译器在候选模板特化推导时，如果出现参数/类型替换失败，并不会报错中断编译，而是默默将该特化从候选队列中剔除；`std::enable_if` 利用结构体内嵌 `type` 存在性：当条件为真时含有 `type`，为假时不含 `type` 触发 SFINAE 替换失败，从而关闭不符合条件的重载分支。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【C++ 模板元编程 SFINAE 原理与 enable_if 分支】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. SFINAE (Substitution Failure Is Not An Error)：\n   - 在重载解析期间，编译器会将传入实参推导替换模板形参 `T`。\n   - 如果在这个过程中，某一个重载候选导致了语法错误（例如尝试读取一个不存在的内嵌类型 `T::value_type`），**只要这个错误发生在模板签名的替换阶段**，编译器就不报错，只把这个候选剔除，继续尝试其他候选。\n2. std::enable_if 原理深度剖析（模板元编程核心）：\n   - `std::enable_if` 源码基本实现：\n     ```cpp\n     template<bool B, typename T = void> struct enable_if {};\n     template<typename T> struct enable_if<true, T> { using type = T; };\n     ```\n   - **物理区别**：\n     - 如果 `B` 为 `true`，命中偏特化版本，含有 `using type = T;` 定义。\n     - 如果 `B` 为 `false`，命中基础版本，里面**空空如也，没有任何叫 `type` 的内嵌类型**。\n3. 如何实现编译期分支：\n   - 例子：想写一个函数，当 T 是整型时才生效：\n     `template<typename T, typename = typename std::enable_if<std::is_integral<T>::value>::type>`\n     `void process(T val) {}`\n   - **编译决议流**：\n     - 传入 `double 3.14` 调用 `process`。\n     - 编译器尝试推导该函数签名。`std::is_integral<double>::value` 为 `false`。代入得 `std::enable_if<false>::type`。\n     - 此时 `std::enable_if<false>` 里没有 `type`！替换失败（Substitution Failure）。\n     - **SFINAE 生效**：不报错，直接抛弃此重载。如果外面有其他支持 double 的 process 重载，则调用它；若没有，报无合适重载错误。实现了完美的编译期静态分发。",
      "structured": [
        "SFINAE 编译器共识：特化推导替换（Substitution）中出现的局部类型不适配仅移出候选，不触发编译红灯阻断",
        "enable_if 编译期开关：偏特化技巧。利用 bool 参数控制内嵌 type 定义是否存在，成为调控替换失败的物理杠杆",
        "函数重载决议剔除：当条件不符导致 `::type` 读取失败，编译器触发 SFINAE 默默关闭当前分支，寻找更佳重载",
        "类型萃取配合：广泛配合 `std::is_class`, `std::is_pointer` 等 type_traits 组合使用，奠定了现代 C++ 泛型库的基石"
      ],
      "deepDive": "\n\n【源码底层/安全防御】：C++ 的多态是通过虚函数表指针（vptr）和虚函数表（vtable）在运行期跳转实现的。每个包含虚函数的类实例在首部物理存储着一个 vptr 指针，这会产生 8 字节的额外物理内存开销。智能指针 shared_ptr 包含强引用计数和弱引用计数的控制块，由于控制块在堆上分配，频繁创建会产生内存碎片，必须配合 weak_ptr 解决循环引用。"
    },
    "keyPoints": [
      "SFINAE",
      "std::enable_if",
      "替换失败不是错误",
      "重载决议 Overload",
      "偏特化",
      "type_traits"
    ],
    "traps": [
      "SFINAE 只对**模板参数替换阶段**发生的错误起作用。如果参数替换成功，但在函数体内发生了语法错误（如在 `process` 函数内部调用了不存在的方法），SFINAE 会失效失效，编译器会直接报致命编译错误终止流程",
      "面试官常问“智能指针 shared_ptr 是否线程安全？”。避坑核心：shared_ptr 本身的引用计数加减操作使用原子操作，是线程安全的；但是，其指向的原始对象在多线程下读写是没有加锁保护的，完全线程不安全！必须由业务层加互斥锁（std::mutex）保护。"
    ],
    "relatedIds": [
      "interview_cpp_006_concepts_cxx20",
      "interview_cpp_023_variadic_templates"
    ]
  }
];

module.exports = questions;
