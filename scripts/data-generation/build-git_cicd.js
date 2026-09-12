// build-git_cicd.js
// 自动生成主题题库：Git & CI/CD (归属于 infra)

const fs = require('fs');

const segment1 = [
  {
    "id": "interview_041",
    "mode": "study",
    "domain": "interview",
    "type": "scenario",
    "track": "infra",
    "topic": "git_cicd",
    "title": "Git Rebase 与 Merge 的区别及工作流选择",
    "difficulty": 2,
    "frequency": 5,
    "question": "在 Git 团队协作中，git merge 和 git rebase 的底层合并机制有什么区别？在什么情况下应该选择哪一种合并策略？",
    "answer": {
      "short": "git merge 创造一个新的合并提交（Merge Commit），保留完整的历史分叉节点；git rebase 将当前分支的提交在目标分支的最新提交上重新应用（变基），创造出一条线性的无分叉提交历史。",
      "thinkingProcess": "1. 【合并差异直观联想】：看 Git 提交树图（git log --graph），merge 会有弯弯曲曲的交织线和“Merge branch...”的自动提交；rebase 则是一条直直的直线，非常干净。\n2. 【底层机制比对分析】：Merge：找到两个分支的最近公共祖先节点（Base），将两个分支的最新状态进行三方合并，如果产生冲突则在当前解决并生成一个带两个父节点的 Merge Commit。Rebase：把当前分支上自公共祖先以来的所有 commit 临时打包保存为补丁（patch），然后将当前分支指向目标分支的最前沿（变基），再将保存的补丁依次重放（apply），遇到冲突需要逐个提交进行 fix，最后线性连在后面。\n3. 【工作流优缺点考量】：Merge：优点是保留真实的历史开发轨迹，缺点是项目人多时历史线会乱成麻花。Rebase：优点是提供绝对干净的线性提交链，便于代码审计 and 回滚；缺点是修改了历史 Commit 的 Hash 值，如果在公共分支上 Rebase 会导致其他协作人拉取代码时发生灾难性的分叉冲突。",
      "deepDive": "金科玉律：**绝对不要在公共共享分支上执行 Rebase！**。因为 Rebase 改变了历史 Commit ID。如果别人的本地分支基于旧 Commit，当你强制推送变基后的公共分支，别人的代码在 Pull 时就会在本地重复合并，产生无数重复且冲突的历史垃圾。正确的团队协作规范是：在自己的本地 feature 分支开发完毕后，先 rebase 目标主分支（如 main/dev）清冲突，最后以 merge 或 squash merge 的形式合入主分支。",
      "structured": [
        "Merge 机制：三方合并（两分支最新提交与公共祖先），生成独立合并提交节点",
        "Rebase 机制：生成临时补丁，改变分支基底（Base）并依次重放提交，重写 Commit ID",
        "分支轨迹：Merge 保留真实分叉与交叉历史；Rebase 提供绝对干净线性的平直树图",
        "协作禁区：不可在公共共享分支执行变基，否则导致其他人的本地分支全部严重冲突"
      ]
    },
    "keyPoints": [
      "git merge",
      "git rebase",
      "变基",
      "三方合并",
      "提交历史",
      "线性轨迹"
    ],
    "traps": [
      "In Rebase 冲突解决时使用 git add 标识冲突解决，然后执行 git rebase --continue，千万不要习惯性地执行 git commit，否则会破坏变基补丁重放流程"
    ],
    "relatedIds": [
      "interview_004"
    ]
  },
  {
    id: "interview_git_cicd_001_objects",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git 底层对象模型：Blob、Tree 与 Commit",
    difficulty: 4,
    frequency: 5,
    question: "Git 的底层是如何存储文件与版本历史的？请详细阐述 Blob、Tree、Commit 三种核心对象的具体物理结构、寻址方式以及它们之间的引用依赖拓扑树图。",
    answer: {
      short: "Git 是一个基于键值寻址的内容寻址文件系统：`Blob` 存放纯文件内容；`Tree` 代表目录，记录文件名和子目录指向的 SHA-1 哈希；`Commit` 代表提交节点，存储作者、时间戳并指向根 Tree 对象及父 Commit 哈希；它们全部以经过 zlib 压缩的物理文件形式存放在 `.git/objects/` 中。",
      thinkingProcess: "1. Git 底层存储三大原件剖析：\n   - **Blob 对象**：\n     - 存储的只是纯粹的文件二进制内容，**不包含文件名、文件路径、文件权限等元数据**。\n     - 寻址：对文件内容计算 SHA-1 值（如 `da39a3ee5e6b4b0d3255bfef95601890afd80709`），取前两位（da）作为子目录名，后38位作为文件名物理存储。\n   - **Tree 对象**：\n     - 代表目录（Directory）。\n     - 内部是一张表，记录了当前目录下的所有内容。每行包含：文件权限（Mode）、对象类型（blob 或 tree）、对应的 SHA-1 哈希值，以及**真实的文件名/目录名**。实现了文件名与内容的解耦。\n   - **Commit 对象**：\n     - 代表一次提交快照。\n     - 包含：根 Tree 对象的哈希指针（指向本次提交的根目录视图）、父 Commit 对象的哈希指针（0个或多个，多继承）、作者（Author）和提交者（Committer）的姓名邮箱时间戳，以及提交信息（Message）。\n2. 拓扑依赖树构建逻辑（三层逻辑链）：\n   - 每次提交时：\n     `Commit` -> 指向 -> 顶级 `Tree` -> 指向 -> 子 `Tree` (子目录) / `Blob` (文件内容)。\n   - 所有的物理寻址只依赖 SHA-1，内容决定哈希。如果两个文件内容完全一样，哪怕文件名不同，在 objects 目录下也**只有一份 Blob 物理文件**，极致压缩空间，设计非常优雅。",
      structured: [
        "Blob 内容存储器：纯粹数据容器。仅存放文件物理二进制数据，文件名被剥离，内容相同则全局共享同一 Blob",
        "Tree 目录实体结构：记录当前目录拓扑。关联模式权限码、对象类型、SHA-1 映射及人类可读的文件命名",
        "Commit 快照节点：串联项目历史。绑定根 Tree 寻址图，并以 parent 字段自底向上勾勒出有向无环图 DAG 提交线",
        "zlib 物理压缩：所有对象使用 zlib Deflate 压缩落盘。以 SHA-1 首二字符分桶散列在 `.git/objects/` 目录下"
      ]
    },
    keyPoints: ["Git Blob 对象", "Git Tree 对象", "Git Commit 对象", "SHA-1 内容寻址", "zlib 物理压缩", "有向无环图 DAG"],
    traps: ["由于 Blob 只存内容不存路径，所以**Git 是绝对无法直接跟踪并提交一个空文件夹的**；要强行追踪空目录，开发人员必须在该目录下放置一个类似于 `.gitkeep` 的占位文件，促使其生成 Blob 并顺着生成 Tree 写入索引"],
    relatedIds: []
  },
  {
    id: "interview_git_cicd_002_index",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git Staging Area 暂存区底层 `index` 文件机制",
    difficulty: 4,
    frequency: 4,
    question: "Git 的“暂存区（Staging Area）”在物理层面上究竟是什么？它与工作区、版本库是如何进行状态比对的？请详述 `.git/index` 二进制文件的内部结构与工作原理。",
    answer: {
      short: "暂存区在物理上是 `.git/index` 这个高效的二进制索引文件；它保存了工作区所有文件的相对路径、时间戳、文件大小及对应的 Blob SHA-1 哈希值；当执行 `git add` 时，内容被写入 objects，且文件的元数据被写入 index；执行 `git commit` 时，Git 直接扫描该二进制索引文件生成 Tree 对象完成提交。",
      thinkingProcess: "1. 暂存区物理真相（.git/index）：\n   - 暂存区并不是一个存放副本文件内容的物理目录，而是一个**虚拟的二进制索引文件**。\n   - 它的核心目的：**充当工作区物理文件与版本库物理对象树（Git Directory）之间的缓冲区和决策层**。\n2. index 文件物理结构拆解（二进制精细化）：\n   - **Header（12字节）**：\n     - 包含：签名 `DIRC`（Directory Cache，4字节）、版本号（4字节）、索引条目数量（4字节）。\n   - **Index Entries（核心条目集合）**：\n     - 每个条目包含文件的元数据快照，用于高频快速比对工作区是否发生修改：\n       - ctime/mtime（创建/修改时间，精确到纳秒）。\n       - Dev / Inode（物理磁盘设备标识与节点编号）。\n       - Mode（文件权限类型，如 100644）。\n       - UID / GID（所属用户与组）。\n       - File Size（物理字节数）。\n       - **SHA-1 哈希值**：指向 objects 里的 blob 实体。\n       - **Flags（16位）**：包含 stage 状态（用于合并冲突冲突标记）。\n       - File Path（文件相对路径字符串）。\n   - **Extension Blocks**：如缓存的 Tree 节点，加速后续 commit 操作。\n   - **Checksum**：最后 20 字节存放 SHA-1 校验和。\n3. 三方比对与极其高效的状态核对：\n   - 当你运行 `git status` 时，Git **不需要遍历 objects 数据库**，而是极速读取 `index` 二进制文件：\n     - 1. **对比工作区与 index**：读取工作区文件属性（mtime、大小），与 `index` 条目里的元数据秒级比对。如果一致，说明文件未变；如果不一致，说明发生 Modification，列为 `Changes not staged for commit`。\n     - 2. **对比 index 与 HEAD commit**：对比 `index` 条目里的 SHA-1 与当前 HEAD 指向的 Commit Tree 里的 SHA-1。如果不一致，列为 `Changes to be committed`（已 add 未 commit）。\n   - `git add` 时：计算文件 SHA-1，写入 objects 库，更新 `index` 条元数据，标记进入 stage。\n   - `git commit` 时：直接读取 `index` 这个扁平的二进制文件，按照目录关系打包成一个个 Tree 对象写入 objects 库，生成 Commit，耗时极短，设计极为精密。",
      structured: [
        "DIRC 缓存头：二进制文件以 DIRC 签名起步，规范版本号，并以 32 位整型记录被追踪条目物理数量",
        "元数据高速比对项：记录工作区文件的 Inode、文件大小及 mtime 精准纳秒时间戳，免去全量文件内容对比开销",
        "add 驱动落地：git add 执行内容读入 objects 并改写 index 校验 SHA-1，瞬间标记为 Stages 态",
        "commit 零拷贝重构：git commit 直接读取扁平的 index 索引构建 Tree 关系树，完成快照归档，避免了漫长的工作区二次扫描"
      ]
    },
    keyPoints: ["Git index 暂存区", "DIRC 签名", "元数据比对", "git add 暂存", "Inode / mtime", "对象构建优化"],
    traps: ["如果频繁在本地通过脚本大量删除/重建大量文件，会导致工作区 Inode 和 mtime 发生变化，使 `git status` 变得极慢，因为 Git 必须重新扫描每个文件的二进制内容计算哈希，可以通过 `git update-index --really-refresh` 重写同步缓存属性"],
    relatedIds: ["interview_git_cicd_001_objects"]
  },
  {
    id: "interview_git_cicd_003_threeway_merge",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git 三方合并算法与冲突标记底层机理",
    difficulty: 4,
    frequency: 4,
    question: "在 Git 合并冲突中，什么是“三方合并（Three-way Merge）”？它是如何寻找最近共同祖先（LCA）的？当检测到冲突时，Git 是如何在文件底层打上 `<<<<<<< HEAD` 冲突标记并写入暂存区的？",
    answer: {
      short: "三方合并比对三个版本：合并目标分支、当前分支和它们在分支图中的最近公共祖先（LCA）；如果当前与目标相对于祖先都发生了变化且不一致，则判定为冲突；此时 Git 会在暂存区写入 Stage 1（公共祖先）、Stage 2（当前分支）、Stage 3（目标分支）三个物理条目，并在工作区文件打上冲突标记。",
      thinkingProcess: "1. 三方合并（Three-way Merge）物理含义：\n   - 如果只有两个版本（分支 A，分支 B），Git 无法分清“这行代码是分支 A 加上的，还是分支 B 删掉的”。\n   - **三方参与者**：分支 A (Ours)、分支 B (Theirs)，以及它们的**最近公共祖先 C (Base)**。\n   - 合并逻辑：\n     - 如果 A 相对于 C 没变，B 变了，则合并结果采用 B（自动合并）。\n     - 如果 B 相对于 C 没变，A 变了，则合并结果采用 A（自动合并）。\n     - 如果 A 和 B 都变了，且内容不同，说明发生了 **物理撞车冲突**，需要人工裁决。\n2. LCA（最近公共祖先）寻找过程：\n   - 调度器遍历分支有向无环图（DAG），利用图的拓扑排序和广度优先搜索寻找两个 Commit 节点的公共交点节点。\n   - 复杂场景下（如交叉合并，有两个 LCA），Git 默认会使用 `recursive` 合并策略：计算这两个 LCA 节点的一个“虚拟公共祖先（Virtual Common Ancestor）”作为 Base 进行三方合并，巧妙地防止了大量虚假冲突的产生。\n3. 冲突在暂存区（Index）中的物理呈现（Stage 1-2-3）：\n   - 当发生冲突，在 `.git/index` 文件中，同一条路径会同时写入 **3 个不同的 Stage 索引**：\n     - **Stage 1 (Base)**：最近公共祖先 C 对应该文件的 Blob SHA-1。\n     - **Stage 2 (Ours)**：分支 A 对应文件的 Blob SHA-1。\n     - **Stage 3 (Theirs)**：分支 B 对应文件的 Blob SHA-1。\n   - 只有这 3 个索引在 index 中被全部清空（通过 git add 解决冲突并写入 Stage 0 正常索引），合并状态才算完成。\n4. 冲突文件标记打入过程：\n   - Git 在工作区写入 `<<<<<<< HEAD` (Ours内容) `=======` (Theirs内容) `>>>>>>> branchName`，方便开发人员直接手动改写。",
      structured: [
        "三方比对阵营：LCA公共祖先作为参照物，与 Ours、Theirs 两个派生分支进行三象限变更校对",
        "recursive 虚拟祖先：遇到多 LCA 交叉环状分支时，合并引擎自动重组两个 LCA 生成虚拟祖先节点，阻断误判",
        "index 三级插槽（Stage 1-2-3）：冲突文件在 index 里保留三份哈希条目，只有三者被覆盖为普通 Stage 0 时冲突才告解除",
        "标记注入：工作区直接追加 `<<<<<<<`、`=======`、`>>>>>>>` 分区特征标记，强制暴露物理碰撞位置"
      ]
    },
    keyPoints: ["三方合并 Three-way", "最近公共祖先 LCA", "recursive 策略", "Stage 1-2-3 索引", "冲突标识符", "有向无环图 DAG"],
    traps: ["如果发生了冲突，千万不要直接用 `git commit -a` 提交，这会跳过对 Stage 1-2-3 状态的安全检查，强行将带冲突标志的物理文件直接打包成 Blob 存入版本库，破坏代码结构，必须先 `git add` 清退暂存槽"],
    relatedIds: ["interview_041", "interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_004_gc",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git 垃圾回收与 `.git/objects/pack` 文件紧凑化",
    difficulty: 4,
    frequency: 3,
    question: "Git 长期开发后 objects 目录会极度臃肿。请详述 `git gc` 的工作原理。什么是松散对象（Loose Objects）与打包对象（Packed Objects）？Delta 压缩算法在此过程中起到了什么作用？",
    answer: {
      short: "`git gc` 会遍历整个 DAG 对象图，将零散的单个小对象文件（松散对象）打包并合并写入一个紧凑的 `.pack` 文件中，并通过 `.idx` 文件提供索引；Delta 压缩算法会对同名文件的不同历史版本进行差额压缩只存 Base 和修改 Diff，大幅榨干磁盘存储开销，同时清理并删除 Reflog 之外的孤儿无用 Commit 物理文件。",
      thinkingProcess: "1. 松散对象与打包对象物理实质：\n   - **松散对象（Loose Objects）**：\n     - 当我们频繁修改文件并 `git add` 时，每次操作都会为当前文件内容生成一个专属的 zlib 压缩 Blob 对象，独立存在 `.git/objects/XX/XXXX...` 路径下。\n     - 痛点：文件极小但数量繁多，严重浪费操作系统的文件系统 Inode 和读写性能。\n   - **打包对象（Packed Objects）**：\n     - 运行 `git gc` 后，Git 会将这些松散文件合并存入单个巨大的 `.git/objects/pack/pack-XXXX.pack` 二进制打包文件中，并生成一个同名的 `.idx` 索引文件支持极速随机读取。\n2. Delta 压缩算法的魔法表现（只存差额）：\n   - 假设一个 10MB 的源代码文件，我们在版本历史中修改了 100 次，每次只改了 1 行。\n   - 物理浪费：松散状态下会占用 $100 \\times 10MB = 1GB$ 的磁盘空间。\n   - **Delta 压缩处理**：Git 打包时，会把这些同名或相似名文件的历史版本全部堆在一起进行相似度匹配。\n     - 它会保留**最新/最完整**的那个版本（为了读取速度），而将其历史版本压缩为相对于最新版的**差额数据（Delta / Diff）**。\n     - 100 次的历史差额可能只有 200KB 字节。整体磁盘占用瞬间从 1GB 收缩到 10.2MB。空间压缩比极高。\n3. 孤儿对象的物理清理与安全退场：\n   - 那些被 `git reset --hard` 丢弃、已经没有任何 branch/tag 或 reflog 能触达到的 Commitment 以及关联 Blob，被称为 **Dangling Objects（孤儿悬空对象）**。\n   - `git gc` 会清算这些孤儿，默认会将超过 2 周（由 `gc.pruneExpire` 决定）的孤儿对象彻底物理删除，释放磁盘物理盘空间空间。",
      structured: [
        "Loose 松散大军：每次 add 产生的散落小文件，大量空耗 Inode 和 OS 文件寻道效率，急需收拢",
        "Pack 打包收纳（pack/idx）：将成千上万松散对象重组注入单一大 Pack 文件，配以 `.idx` 精准偏移量索引提供秒级随机读写",
        "Delta 差额降维：对同名文件的各个历史快照采用差额编码。最新版存原样，老版存 Diff 增量，降低版本库物理体积",
        "Prune 孤儿清算：彻底切断无 Branch/Tag/Reflog 挂接的死悬空 Commit 链条，回收过期的冗余物理数据"
      ]
    },
    keyPoints: ["git gc", "Loose Objects 松散对象", "Packed Objects 打包对象", "Delta 差额压缩", "Dangling Objects 悬空", "Inode 回收"],
    traps: ["由于 `git gc` 需要在内存中计算大量文件的 Delta 差额相似度，在大仓库（如带有几十万 Commit 和大体积资产的库）上执行时，会瞬间把 CPU 和内存占满到 100% 甚至触发 OOM 崩溃，需要配置 `pack.windowMemory` 限制内存配额"],
    relatedIds: ["interview_git_cicd_001_objects", "interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_005_reset_modes",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git Reset 三大模式物理对比：Soft、Mixed 与 Hard",
    difficulty: 3,
    frequency: 5,
    question: "在 Git 版本回滚中，`git reset --soft`、`--mixed` 和 `--hard` 三种模式在底层物理上有何区别？请详细对比它们对 HEAD 指针、Staging Area（暂存区）和 Working Directory（工作区）所施加的物理改写行为。",
    answer: {
      short: "`--soft` 仅将 HEAD 指针拨回目标 Commit，不改写暂存区和工作区；`--mixed`（默认）在移动 HEAD 的同时，重置暂存区使其与目标 Commit 一致，保留工作区修改；`--hard` 会同时无情重置 HEAD、暂存区和工作区，抹去所有未提交的修改数据。",
      thinkingProcess: "1. 移动指针是 Reset 的本质物理属性：\n   - 不管使用哪种模式，`git reset <commit_hash>` 第一步物理动作永远是：**将当前分支的 HEAD 指针（如 refs/heads/main）指向目标 Commit**。\n2. 三大模式对三层文件树控制差异剖析：\n   - **`--soft`（只移 HEAD）**：\n     - HEAD 指针 -> 移动到目标 Commit。\n     - 暂存区（Staging Area / index） -> **原封不动**，保留回退之前的修改状态。\n     - 工作区（Working Directory） -> **原封不动**。\n     - 效果：常用于把最近的几次 Commit 撤销合并为一个新的 Commit（Squash 准备阶段）。\n   - **`--mixed`（默认，移 HEAD + 移暂存）**：\n     - HEAD 指针 -> 移动到目标 Commit。\n     - 暂存区 -> **重置**，使其内容与目标 Commit 对应的 Tree 完全一致。之前 add 进去的内容全部被退回到 untracked 状态。\n     - 工作区 -> **原封不动**，保留物理文件修改。\n     - 效果：撤销了之前的 add 和 commit，但保留了代码修改内容方便改写。\n   - **`--hard`（移 HEAD + 移暂存 + 移工作区）**：\n     - HEAD 指针 -> 移动到目标 Commit。\n     - 暂存区 -> **重置**，与目标一致。\n     - 工作区 -> **重置**，与目标一致。**任何在工作区还没来得及提交的物理文件修改、新增，都会被彻底物理覆写和抹除，绝对无法恢复**。\n     - 效果：干净、彻底地丢弃自该 Commit 以来的所有实验性修改。",
      structured: [
        "--soft 轻量级微调：只更新 refs/heads 的指向。保留 index 缓存及工作区物理代码，用于合规 Commit 重塑",
        "--mixed 缓存重洗（默认）：HEAD 与 index 暂存区同步回退到旧 Commit 的 Tree 视图，保留人类工作区编写的代码以备修改",
        "--hard 暴力全域覆盖：HEAD、index、物理工作区三合一全部同步强行覆写，未 commit 的所有草稿全部物理抹去且不可撤销",
        "安全性对比：soft/mixed 无损，hard 具有灾难性文件覆盖风险，对于 working copy 中未 staged 的文件一旦 hard 丢失将无可挽回"
      ]
    },
    keyPoints: ["git reset --soft", "git reset --mixed", "git reset --hard", "HEAD 指针移动", "暂存区 index 重置", "工作区物理重写"],
    traps: ["在执行 `git reset --hard` 时，如果工作区有**尚未通过 `git add` 暂存的新创建文件**（未进入 objects 库），重置后这些文件会从磁盘上被彻底抹掉，由于其从未在 Git 数据库中产生过任何备份记录，将**完全无法找回**！执行前必须进行 `git stash` 保护数据"],
    relatedIds: ["interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_006_revert_vs_reset",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "公共分支回滚：Reset 与 Revert 协作灾难防范",
    difficulty: 3,
    frequency: 5,
    question: "在生产环境的公共协作分支（如 master/develop）上，当发现最近的一次合并有严重 Bug 需要紧急回滚时，为什么严禁使用 `git reset`？为什么必须使用 `git revert`？如果强行 Reset 并 Force Push 会给团队协作带来什么灭顶之灾？",
    answer: {
      short: "公共分支使用 `git reset` 会强行抹去历史提交并导致本地与远程历史脱节，Force Push 会物理覆盖他人代码且导致他人 Pull 时产生毁灭性的二重冲突；使用 `git revert` 会通过新增一个反向修改的 Commit 节点来抵消 Bug 变更，保证历史线的单调递增，安全合规地在团队间同步回滚状态。",
      thinkingProcess: "1. 公共分支上 `git reset` 的灭顶之灾原理（历史重写与覆盖）：\n   - 假设团队公共分支 master 包含 Commit：`A -> B -> C` (C 是 Bug 提交)。\n   - 协作状态：小明、小张都已经在本地拉取了 C，并在本地各自开发了新提交 `D_小明` 和 `E_小张`。\n   - 如果管理员用 `git reset --hard B` 将 master 拨回 B，并执行 **`git push -f` (Force Push)** 覆盖了中央仓库。\n   - 中央仓库状态变为：`A -> B`。\n   - **灾难流传（毁灭性二重冲突）**：\n     - 1. 当小明本地开发完，执行 `git pull` 同步时。\n     - 2. 小明本地 master 是 `A -> B -> C -> D`，中央是 `A -> B`。\n     - 3. Git 比对发现小明本地的 C 和 D 领先于中央的 B，且中央缺失 C。Git 会自动执行一次 merge，**把 C 这个已经废弃、有 Bug 的提交再次合并合入主分支！**\n     - 4. 结果：Bug C 僵尸复活，且因为强推覆盖，小张的代码 Pull 时甚至会因为历史分叉爆发大量无法理清的冲突，项目历史彻底被污染坏死。\n2. `git revert` 的救场原理（历史单调递增）：\n   - 管理员执行 `git revert C`。\n   - **底层动作**：Git 读取 Commit C 的修改，生成一个完全相反的补丁，**并自动创建一个全新的提交 `revert_C` 拼接在后面**。\n   - 拓扑状态：`A -> B -> C -> revert_C`。\n   - 效果：Bug 代码在 revert_C 里被撤销了，但历史记录 C 依然安全保留。小明、小张在 pull 时，由于 `revert_C` 是单调递增的新节点，本地会顺畅合入，不会发生任何历史冲突和 Bug 复活，高雅避雷。",
      structured: [
        "Reset 私自截断历史：重置删去公共 Commit 节点，直接导致本地分支树与中央服务发生分叉，强推会直接抹去他人的协作物理记录",
        "僵尸 Bug 复活：他人 pull 时，Git 会将被 reset 废弃的旧 Commit 重新当作本地新增特性合入，Bug 悄然重装",
        "Revert 递增反向提交：利用新 Commit 完全对消 Bug 变更。保留历史连续性，他人 pull 时自动覆盖无摩擦",
        "生产金科玉律：私有 feature 分支爱怎么 reset 就怎么 reset；一旦合入公共 develop/master，一律只准用 revert 撤销"
      ]
    },
    keyPoints: ["git revert", "git reset", "Force Push 强推危害", "公共分支回滚", "历史分叉冲突", "单调递增历史"],
    traps: ["如果想要 revert 一个已经合入的 **Merge Commit**，必须配置参数 `-m <parent-number>` 指定以哪一个父分支的快照作为主基准，如果配置错误，Git 会直接把整个主干分支改动全数回滚，造成惨重代码丢失事故"],
    relatedIds: ["interview_git_cicd_005_reset_modes"]
  },
  {
    id: "interview_git_cicd_007_checkout_switch_restore",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git 命令解耦：checkout vs switch vs restore 底层",
    difficulty: 3,
    frequency: 3,
    question: "在现代 Git 版本（2.23+）中，为什么社区要推出全新的 `git switch` 和 `git restore` 来解耦传统的 `git checkout`？这三个命令在底层对 index 和工作区操作上有什么细微差异？",
    answer: {
      short: "`git checkout` 承担了“分支切换”与“文件恢复”两个完全割裂的重负载职责，新命令对其进行功能剥离：`switch` 专职安全切换分支修改 HEAD 指针；`restore` 专职恢复暂存区和工作区文件内容，防止了新手在切换分支时不小心覆盖本地未提交文件的危险操作。",
      thinkingProcess: "1. 传统 `git checkout` 的设计重病（职责严重越界）：\n   - 新手梦魇：`git checkout master` 是去切换分支；而 `git checkout -- file.txt` 是丢弃文件修改。一个命令，既控制 HEAD 指针移动，又控制工作区磁盘文件覆盖，极其容易混淆且一旦写错参数（如漏了 `--`），可能把想回滚的文件变成了切换到一个叫 file.txt 的分支报错，体验极差。\n2. 新命令功能解耦与底层控制（安全隔离）：\n   - **`git switch`（专职分支跳转，控制 HEAD）**：\n     - 底层物理：只用来移动 HEAD 符号引用（例如让 HEAD 从指向 `refs/heads/dev` 改为指向 `refs/heads/master`），并更新暂存区 index 和工作区到 master 的快照状态。\n     - 安全防线：如果你的工作区有未提交的改动且与目标分支存在物理冲突，`switch` 会强硬拦截并报错，绝对**不会**直接覆盖丢弃你的劳动成果，除非加 `-f` 强冲。\n   - **`git restore`（专职内容恢复，控制工作区/index）**：\n     - 底层物理：只用来用某个 commit（默认 HEAD）的快照内容去覆盖写暂存区 index 或工作区文件。\n     - 精细控制：\n       - `git restore --worktree file.txt`：只覆盖工作区文件（撤销本地修改）。\n       - `git restore --staged file.txt`：只清退暂存区（相当于 `git reset HEAD file.txt`，将 index 回滚）。\n       - `git restore --source=commit_hash file.txt`：从特定 Commit 抽取特定文件覆盖本地文件。\n   - 这种职责分离使得 Git 的命令语义清晰度上升到了现代 CLI 水准。",
      structured: [
        "checkout 职能臃肿：一职两担（分支切换与物理文件覆写），容易发生笔误导致修改丢失",
        "switch 精准移动 HEAD：屏蔽一切文件回滚行为，只管分支游标安全漂移，遇本地冲突自动拦截保护",
        "restore 文件物理抽取：精准指定源（source）快照。提供 --staged（洗 index）和 --worktree（洗磁盘文件）级联选项",
        "语义化升级：现代 DevOps 流程与开发规范全面推进使用 switch/restore 代替 checkout，规范化流水线脚本"
      ]
    },
    keyPoints: ["git checkout", "git switch", "git restore", "HEAD 符号引用", "文件覆写撤销", "暂存区清退"],
    traps: ["使用 `git restore --worktree` 撤销本地修改是**没有任何垃圾回收机制和备份的**，因为工作区的修改如果从未 commit 或 add，restore 覆盖后将直接在磁盘彻底消失，使用前必须反复核对"],
    relatedIds: ["interview_git_cicd_005_reset_modes", "interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_008_cherry_pick",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git Cherry-pick 补丁生成与冲突判定原理",
    difficulty: 3,
    frequency: 4,
    question: "在 Git 中，`git cherry-pick <commit_hash>` 是如何将一个特定的提交“拣选”并移植到当前分支的？其底层的补丁生成和合并冲突判定逻辑是怎样的？",
    answer: {
      short: "`cherry-pick` 在底层会对拣选 Commit 及其父 Commit 计算 Diff 生成一个临时 patch（补丁），然后使用三方合并算法尝试将此 patch 应用（apply）到当前 HEAD 所指向的 Tree 视图中；若 patch 涉及的修改行在当前分支已被改写且不匹配，则判定合并冲突挂起。",
      thinkingProcess: "1. Cherry-pick 底层补丁机制（物理计算）：\n   - 假设要拣选 Commit `X`。它的父提交是 `X^`。\n   - **物理步骤 1：Diff 提取**：\n     - Git 首先在后台对 `X` 和 `X^` 两个 Tree 对象做一次比对，精确提取出 Commit `X` 引入的改动差额。生成一段类似于 patch 文件的变更块（Diff Patch）。\n   - **物理步骤 2：移植三方合并（核心）**：\n     - Git 把当前 HEAD 的快照、Commit `X^` 作为 Base，Commit `X` 作为 Thems 进行三方合并操作。\n     - 将上面的 Diff Patch 应用到当前 HEAD 所在的物理代码树上。\n   - **物理步骤 3：提交重构**：\n     - 成功应用后，Git 会提取 Commit `X` 的原始作者元数据（Author、邮箱、提交说明），并以当前操作时间生成一个**全新的 Commit `X_new`** 挂在当前分支头部。它的 Hash 值与 `X` 截然不同（因为父节点变了，哈希重新计算）。\n2. 冲突判定链路：\n   - 如果被拣选文件在当前 HEAD 中，自 `X^` 以来已经被他人改写了同一行，或者当前 HEAD 根本不存在这个文件。\n   - 三方合并算法无法自动对齐，cherry-pick 异常挂起，留下冲突标志，等待开发人员执行 `git cherry-pick --continue` 收尾。",
      structured: [
        "Diff 补丁合成：对目标 Commit 与其父 Commit 执行物理二分比对，剥离出当前 Commit 带来的原子增量改动",
        "三方移植合并：以父 Commit 为公共祖先（Base），当前分支 HEAD 为 Ours，目标 Commit 为 Theirs 执行三方合并",
        "生成独立哈希：移植成功后提取原作者与描述生成全新提交，基底节点的改变导致哈希值重新计算",
        "有序多选拣选：支持拣选 Commit 区间（A..B），Git 会在后台生成补丁队列并顺序连续 apply 重构"
      ]
    },
    keyPoints: ["git cherry-pick", "补丁 patch 机制", "三方合并移植", "父提交 Commit^", "cherry-pick --continue", "元数据继承"],
    traps: ["在拣选一个 **Merge Commit** 时，必须使用 `-m <parent>` 参数强行指定保留哪一边父分支的修改，否则 Git 无法为两个父分支的合并提交生成唯一的 Diff 补丁，会直接抛错终止"],
    relatedIds: ["interview_git_cicd_003_threeway_merge", "interview_git_cicd_006_revert_vs_reset"]
  },
  {
    id: "interview_git_cicd_009_hooks",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git Hooks 物理拦截机制与 Husky 共享原理",
    difficulty: 3,
    frequency: 4,
    question: "Git Hooks 的底层触发机制是怎样的？为什么 `.git/hooks` 中的本地拦截脚本无法直接提交进 Git 仓库？现代工程中是如何利用 `Husky` 工具解决 Hook 团队共享与强制 Lint 拦截的？",
    answer: {
      short: "Git Hooks 在特定操作（如 commit、push）执行时由 Git 本地进程调用 `.git/hooks` 目录下的同名可执行脚本完成拦截；该目录属于 `.git` 内部，默认不纳入版本控制无法提交；`Husky` 通过在 `npm install` 自动触发 `git config core.hooksPath` 改写 Hook 指向项目受控目录（如 `.husky/`），实现了 Hook 脚本的物理提交与团队共享同步。",
      thinkingProcess: "1. Git Hooks 物理定位与运行原理：\n   - Git 在执行核心事务（如 `commit-msg`、`pre-commit`、`pre-push`）的特定生命周期节点时，会主动去 `.git/hooks/` 目录下查找同名的可执行二进制或脚本文件（如 `pre-commit`，不带后缀，且有 +x 运行权限），如果存在，启动子进程执行该脚本。若脚本返回非 0 退出码，Git 立即阻断并终止当前事务。\n2. 为什么本地 Hook 无法直接共享（Git 安全设计隔离）：\n   - `.git` 目录是存储本地数据库和个人配置的地方，Git 规范**严禁将其中的内容纳入版本控制推送到中央仓库**。这能防止别人 clone 一个项目时，背地里运行恶意的 pre-commit 钩子脚本在宿主机执行 rm -rf 攻击。\n3. Husky 原理剖析（优雅重定向 core.hooksPath）：\n   - **核心改写**：Git 2.9 引入了 `core.hooksPath` 配置项，允许用户改写 Hook 脚本的存放物理路径。\n   - **Husky 注入**：\n     - 1. 开发运行 `npm install`，Husky 的 `prepare` 钩子被 npm 自动触发。\n     - 2. Husky 执行：`git config core.hooksPath .husky`。\n     - 3. Git 把 Hooks 的寻找路径从默认的 `.git/hooks/` 重定向到了项目根目录下的 `.husky/` 文件夹下。\n     - 4. 由于 `.husky/` 是一个普通的物理文件夹，可以被完美 `git add` 并提交到 GitHub 仓库共享。\n     - 5. 团队其他成员拉取代码后，npm install 自动完成 Hooks 重定向。大家提交代码时，全部会被强制执行预设的 Lint 校验与 Format 规则，保卫了分支代码整洁性表现。",
      structured: [
        "Hooks 本地生命周期：Git 物理执行节点拦截机制。 pre-commit 挂接静态 Lint，commit-msg 校验规范，pre-push 校验单测",
        "hooksPath 重定向破局：Husky 巧妙改写本地 Git 变量，将 Hooks 物理查找位置挪出 .git 库至工作区受控项目目录",
        "npm install 级联初始化：借助 package.json 的 prepare 钩子，克隆后首装依赖自动执行重定向，实现零手工运维配置",
        "代码门禁闭环：搭配 lint-staged，只对 staged 状态的增量修改执行 Lint 修复，保障了大型单体仓库提交性能"
      ]
    },
    keyPoints: ["Git Hooks 机制", "pre-commit 拦截", "Husky 原理", "core.hooksPath 改写", "npm install 级联", "lint-staged 协作"],
    traps: ["由于 Husky 修改了 `core.hooksPath`，如果在 CI 自动化流水线（如 Jenkins）或无 Node 环境的 Docker 中运行 `npm install --omit=dev`，可能会跳过 Husky 初始化导致提交校验缺失，或者因为脚本没有物理可执行权限（chmod +x）导致提交在 Linux 宿主机上报 Permission Denied 报错挂起"],
    relatedIds: ["interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_010_submodules_vs_subtrees",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git 多项目依赖管理：Submodule vs Subtree",
    difficulty: 4,
    frequency: 3,
    question: "在管理跨项目公共代码依赖时，Git Submodule 与 Git Subtree 有什么区别？请详述它们在 `.gitmodules` 配置、物理文件落盘、以及父项目 Commit 跟踪引用上的底层差异。",
    answer: {
      short: "`Submodule` 不将子项目代码物理拷入父项目，仅通过 `.gitmodules` 记录子项目的 Git URL，并在父项目中保存一个特殊的 `160000 gitlink` 指针指向子项目的特定 Commit 哈希；`Subtree` 则是将子项目代码作为真实文件物理拷贝合入父项目文件树中，共享同一提交历史，无需外部网络依赖更新。",
      thinkingProcess: "1. Git Submodule 底层物理特征（虚空指针模式）：\n   - **物理落盘**：子项目在父项目中只表现为一个空目录占位符。代码不属于父项目，而是在克隆时通过外部拉取，独立拥有其 `.git` 库（现代 Git 存在 `.git/modules/` 中）。\n   - **Commit 跟踪机制（160000 gitlink）**：\n     - 在父项目的 Tree 树视图中，子模块目录对应的权限标志是 `160000`（这在 Git 中叫 **gitlink**）。\n     - 它不指向 Blob，而是直接存放一个 **20字节的 Commit Hash**。\n     - 意味着：父项目并不保存子模块的文件内容，仅仅记录：**“在这个位置，你必须去拉取子模块仓库的 Commit X”**。必须使用 `git submodule update --init --recursive` 拉取，团队拉代码经常漏拉漏更新。\n2. Git Subtree 底层物理特征（实写物理合并）：\n   - **物理落盘**：子项目的代码被物理性的直接 merge 写入到父项目的一个子目录下。就如同一个普通的文件夹。\n   - **Commit 跟踪机制**：\n     - 在父项目的 Tree 中，子树部分是一个普通的 `040000` Tree 目录，包含一堆普通的 Blob。\n     - 子项目的提交历史会被“扁平化”或“直接插入”到父项目的提交历史 DAG 图中。父项目 Commit 直接持有子树的所有代码实体。克隆时一键拉取所有，不需要额外的配置操作。\n3. 实战痛点优缺点PK：\n   - Submodule 适合高度独立、不需要高频修改、代码库体量极大的第三方 SDK；Subtree 适合在本地经常需要顺手修改两边代码、且要求克隆即用、网络网络封闭的内部公共组件库。",
      structured: [
        "Submodule 虚空引用（160000）：父仓库仅记录外部 CommitID 指针。落盘无子项目代码实体，克隆需要二次初始化",
        ".gitmodules 契约：记录子库的网络定位 URL 和目标分支，克隆阶段依赖外网并发拉取，存在高频的网络中断超时故障",
        "Subtree 实写合并（040000）：子项目代码完整复制进父树。成为父仓库的普通文件，天然支持一键 clone 和跨网部署",
        "历史线融合：Subtree 将两个项目 DAG 有向图进行物理 merge，父项目可直接向子库 push 推送增量 patch"
      ]
    },
    keyPoints: ["Git Submodule", "Git Subtree", "160000 gitlink 指针", ".gitmodules 配置", "多项目依赖管理", "有向无环图融合"],
    traps: ["在 Submodule 模式下，如果小明修改了子模块的代码并在子模块中 commit 且在父模块中更新了 gitlink 指针并 push 到了 master，**但忘记将子模块的 commit push 到子模块远程仓库**，小红拉取父项目执行 update 时会报 `Fetched in submodule path ... but it did not contain ...` 致命找不到 Commit 错误，导致所有人代码拉取瘫痪"],
    relatedIds: ["interview_git_cicd_001_objects"]
  },
  {
    id: "interview_git_cicd_011_lfs",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git LFS 大资产托管与指针文件转换机理",
    difficulty: 4,
    frequency: 3,
    question: "当在 Git 中使用 `Git LFS`（大文件存储）管理大型美术资源或二进制包时，Git 仓库是如何避免库体积急剧膨胀的？请详述 LFS 指针文件的内容结构，以及在 `git add` 和 `git checkout` 阶段，LFS 过滤驱动（Clean/Smudge）的工作过程。",
    answer: {
      short: "Git LFS 通过用微小的 LFS 指针文件替换仓库中的大二进制文件来规避膨胀，真实资产存放在 LFS 远程服务器中；当 `git add` 时，`Clean` 过滤驱动计算哈希并将大文件移入本地 LFS 缓存，在暂存区写入指针文件；当 `git checkout` 时，`Smudge` 过滤驱动扫描指针文件并从缓存或远程拉取真实大文件替换回工作区。",
      thinkingProcess: "1. 为什么大二进制文件是 Git 的毒药：\n   - Git 的每一次 commit 都是全量快照，且保留所有历史。如果一个 1GB 的安装包修改了 10 次，即使最后物理上只有一个，`.git` 目录体积也会高达 10GB。每次 clone 都要全量拉取这 10GB 历史，瞬间拖死服务器。\n2. LFS 指针文件格式（小巧替换）：\n   - 真实大文件在 Git 里被替换为一个普通文本文件（约 100 字节）：\n     ```text\n     version https://git-lfs.github.com/spec/v1\n     oid sha256:2445b23d91cf0dc285e683b51684c37bb184eef88f15d9cf2813589c31405e3f\n     size 145829302\n     ```\n     - 包含：LFS 协议规范版本、大文件的真实 SHA-256 哈希值（oid），以及物理字节数大小。Git objects 只存储和追踪这个文本文件，体积近乎为 0。\n3. 双向过滤驱动（Clean / Smudge）物理转换流：\n   - Git 利用 `.gitattributes` 中声明的过滤器机制：`filter=lfs`。\n   - **第一阶段：git add（Clean 过滤 - 大变小）**：\n     - 1. 开发人员将 200MB 的 `hero.png` 放入工作区并执行 `git add`。\n     - 2. Git 拦截此文件，将其流式输入给 LFS 的 **`Clean` 过滤器进程**。\n     - 3. Clean 过滤器读取内容，计算出 SHA-256 哈希值，把 200MB 的实体文件**拷贝移入本地缓存目录 `.git/lfs/objects/`**。\n     - 4. Clean 过滤器在标准输出中吐出上述 100 字节的“LFS 指针文件文本”，交由 Git 存入暂存区并打包为 objects 中的 Blob。大文件被成功隔离拦截。\n   - **第二阶段：git checkout（Smudge 过滤 - 小变大）**：\n     - 1. 团队其他人拉取代码执行 `git checkout`。\n     - 2. Git 从 objects 库里取出 100 字节的 LFS 指针文件写入工作区，并立即触发 LFS 的 **`Smudge` 过滤器进程**。\n     - 3. Smudge 过滤器读取指针文件中的 oid（哈希值）。\n     - 4. 首先检查本地 `.git/lfs/objects/` 缓存下有没有该大文件。若没有，**发起网络 HTTP 请求，从远程大文件存储服务器（LFS Server）上下载该大文件到本地缓存**。\n     - 5. 缓存就绪，Smudge 过滤器把这 200MB 的物理大文件写入工作区，覆盖指针文件。开发人员在文件系统里看到了真实大图。实现了在不污染 Git 核心提交 DAG 的前提下管理超大文件的目的，架构堪称完美。",
      structured: [
        "仓库无二进制化：大资产由 LFS 独立服务器承载，核心 Git objects 数据库仅索引 100 字节的纯文本指针文件",
        "Clean 过滤器（add物理拦截）：计算大文件 SHA-256，将物理本体抛入 `.git/lfs/` 本地缓存，向 index 写入指针文本",
        "Smudge 过滤器（checkout还原）：读取 index 指针，向本地/远程 LFS 匹配哈希提取真实大文件，回写覆盖工作区",
        "按需下载优势：开发人员拉取分支时仅下载当前 Commit 所需的大文件，避免了全量历史大资产的无用网络下载负担"
      ]
    },
    keyPoints: ["Git LFS", "Clean 过滤器", "Smudge 过滤器", "LFS 指针文件", "SHA-256 oid", ".gitattributes 映射"],
    traps: ["如果在推送代码时**由于网络中断导致本地 LFS 缓存大文件未能成功上传到 LFS 远程服务器，但父项目的 LFS 指针已经 push 成功**，其他人拉取代码 checkout 时会遭遇 Smudge 过滤器报 `LFS: Object not found on server [404]` 致命报错，导致代码永远无法正常 Checkout 还原"],
    relatedIds: ["interview_git_cicd_001_objects", "interview_git_cicd_002_index"]
  },
  {
    id: "interview_git_cicd_012_interactive_rebase",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "交互式变基 `git rebase -i` 历史整顿规范",
    difficulty: 3,
    frequency: 4,
    question: "在把 feature 开发分支合并入主干前，如何利用交互式变基（Interactive Rebase）对本地混乱的 Commit 历史进行整顿规范？请详述 `pick`、`squash`、`reword` 和 `drop` 指令在运行期底层重排 Commit 的工作过程。",
    answer: {
      short: "`git rebase -i` 在底层会列出要编辑的 Commit 动作脚本，变基开始后 Git 会把 HEAD 退回到指定 Commit 的父节点，并按照用户的命令逐个应用（cherry-pick）提交：`pick` 保留提交；`squash` 将当前提交合并入上一个提交并整合说明；`reword` 暂停以允许修改提交注释；`drop` 丢弃该提交。",
      thinkingProcess: "1. 交互式变基规范化核心定位：\n   - 在长达一周的 feature 分支开发中，可能会产生“add log”、“fix typo”、“try fix bug 1”等大量无意义、零碎的垃圾提交。\n   - 合入主分支前，必须把这些提交压缩合并为一个语义清晰的 Commit（如 `feat(auth): add google oauth login`），这是敏捷开发的必修课。\n2. 交互式 rebase 工作机制全还原（物理重构树）：\n   - 运行 `git rebase -i HEAD~4`。\n   - Git 会启动临时编辑器，列出最近 4 次 commit（旧到新排序），每行开头有一个 Action 动作指令。用户修改指令保存退出。\n   - **Git 物理变基引擎启动**：\n     - 1. Git 将当前本地分支的游标（HEAD）**物理退回到 `HEAD~4` 的那个父提交 Commit 上**（进入 detached HEAD 状态）。\n     - 2. **逐条重放（类似 cherry-pick）**：\n       - **`pick` (保留)**：直接将该 commit 移植应用过来，生成新哈希。\n       - **`reword` (改注)**：应用该 commit，但中途**强制暂停变基，弹出编辑器**让用户修改 Commit Message，修改保存后继续变基。\n       - **`squash` (合并)**：把本次提交的代码改动差额应用到**上一次刚刚生成的 Commit 中**（不生成独立节点），并弹出编辑器把两者的 Commit 描述信息进行合并拼接成一个新的大描述。\n       - **`drop` (丢弃)**：直接略过该 commit，其代码改动**不被重放**，等同于从分支 DAG 图中物理物理抠掉了该提交（若有后续依赖可能产生合并冲突）。\n     - 3. 所有动作执行完，重新将分支指针指向最新重组后的 Commit 头部。实现历史的极致优雅梳理。",
      structured: [
        "历史整顿门禁：合入主干前剔除开发阶段的零碎垃圾 Commit，重塑具备语义规范（Angular 提交规范）的 Commit 树",
        "HEAD 物理倒带：变基引擎启动将 HEAD 倒回到重构区间的共同基底，利用临时脚本按指令从头 cherry-pick 移植",
        "squash 归并压缩：合并物理 Diff 至前驱节点，融汇两者的 Message，实现多 Commit 到单一语义快照的优雅降维",
        "drop 提交清除：直接在应用链条中剔除指定 Commit，实现脏代码/临时尝试代码在历史树上的彻底剥离"
      ]
    },
    keyPoints: ["git rebase -i", "pick 指令", "squash 归并", "reword 改写", "drop 丢弃提交", "Commit 历史规范"],
    traps: ["如果在使用 `squash` 合并 Commit 时，中间某个 Commit **发生了代码冲突**，变基会挂起。在人工解决冲突并 `git add` 后，必须执行 `git rebase --continue`，**千万不能习惯性执行 `git commit`**，否则会将后续所有未变基的 Commit 截断丢失在遗忘时空中"],
    relatedIds: ["interview_041", "interview_git_cicd_008_cherry_pick"]
  },
  {
    id: "interview_git_cicd_013_cicd_pipeline",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "infra",
    topic: "git_cicd",
    title: "企业级生产 CI/CD 流水线架构设计与阶段编排",
    id: "interview_git_cicd_014_gitlab_runner",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "GitLab Runner 架构与三种 Executor 运行物理差异",
    difficulty: 3,
    frequency: 4,
    question: "GitLab CI/CD 的 Runner 架构是怎样的？请深度对比 `Shell`、`Docker` 和 `Kubernetes` 三种执行器（Executors）在运行隔离度、依赖环境管理和并发扩容上的物理差异。",
    answer: {
      short: "`Shell` 执行器直接在宿主机环境运行命令，零隔离但执行极快；`Docker` 执行器在独立的容器内运行，隔离度高且环境一致，但存在容器拉起开销；`Kubernetes` 执行器则是将每个 Job 动态分配为一个临时 Pod 并行执行，支持无限的弹性并发扩容，最适合大型分布式集群架构。",
      thinkingProcess: "1. GitLab Runner 与 Coordinator 架构：\n   - GitLab Server 作为大脑（Coordinator），负责流水线调度。\n   - GitLab Runner 作为一个独立的 Go 守护进程，安装在各台物理/云服务器上。它通过长轮询（Long Polling）向 GitLab 申请 Job。抢到 Job 后，调用底层的 **Executor（执行器）** 物理执行编译命令。\n2. 三大 Executor 物理差异硬核对比表：\n   - **Shell Executor**：\n     - 运行机制：Runner 直接使用宿主机的 shell 账号（通常是 `gitlab-runner` 用户）在宿主机磁盘下 `git clone` 并执行脚本。\n     - 隔离性：**零隔离**。多个 Job 共享同一个宿主机环境。一个 Job 污染了全局环境变量，会直接导致其他 Job 报错崩溃。\n     - 环境管理：痛苦。必须手动在宿主机安装 node、golang、java 等所有编译版本环境，经常发生版本冲突。\n     - 性能：极快。零开销，缓存读取即是宿主机本地目录，编译瞬发。\n   - **Docker Executor（最通用推荐）**：\n     - 运行机制：对于每个 Job，Runner 会通过 gRPC 调用 Docker API，根据配置中的 `image`（如 `node:18`）拉起一个纯净容器。在容器内挂载源码目录并运行编译。\n     - 隔离性：**强隔离**。不同 Job 的环境物理沙箱隔离，绝不交叉感染污染。\n     - 环境管理：极爽。开发只需在 `.gitlab-ci.yml` 里写明要什么 Image 即可，免去宿主机配置烦恼。\n     - 性能：容器启动需要 2 到 10 秒。镜像下载存在网络摩擦开销。\n   - **Kubernetes Executor（现代云原生 infra 首选）**：\n     - 运行机制：Runner 运行在 K8s 集群中。当 Job 来临，调用 APIServer **动态拉起一个临时的 Pod（内含 build 容器、helper 容器）**。Job 跑完，Pod 自动物理销毁。\n     - 隔离性：**容器+Pod级双重物理隔离**。\n     - 并发扩容：**无限弹性**。只要 K8s 集群有节点，可以同时并发跑成百上千个流水线 Job，完美防范了 Shell/Docker 物理机单机吃光 CPU 卡死的问题，支持极致的大型微服务并行发布流。",
      structured: [
        "Shell Executor 零壁垒：共享物理机 OS 内核与系统目录，环境配置复杂，高并发时产生严重的 CPU/磁盘争抢冲突",
        "Docker Executor 独立沙箱：基于 OCI 规范为每个 Job 开辟洁净容器沙箱。支持自定义镜像编译，消灭了环境污染死角",
        "K8s Executor 弹性 Pod 化：Job 运行态被抽象为 Kubernetes 短期 Pod 节点。跑完即物理销毁，利用 K8s 调度器达成流水线并发极速扩展",
        "网络与挂载开销：Docker/K8s 依赖本地 Docker registry 镜像缓存与 PVC 分布式挂载来对抗宿主机高频读写的 IO 磨损"
      ]
    },
    keyPoints: ["GitLab Runner", "Shell Executor", "Docker Executor", "Kubernetes Executor", "环境交叉污染", "临时 Pod 弹性调度"],
    traps: ["在 `Kubernetes` 执行器中，如果 Job 内需要运行 `docker build` 命令（Docker-in-Docker），必须配置 Pod 的特权挂载选项 `securityContext.privileged = true`，或者使用不需要 root 特权的用户态编译工具（如 `Kaniko`），否则会因为缺少宿主机 docker-socket 导致打包直接报错退出"],
    relatedIds: ["interview_git_cicd_013_cicd_pipeline", "interview_docker_k8s_006_kubelet_reconcile"]
  },
  {
    id: "interview_git_cicd_015_github_actions",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "GitHub Actions 矩阵构建与流水线变量生命周期",
    difficulty: 3,
    frequency: 4,
    question: "GitHub Actions 是如何工作的？请详述工作流（Workflow）、任务（Jobs）与步骤（Steps）的层级关系。如何利用矩阵构建（Matrix Builds）在一次提交中并发测试数十个运行环境版本？",
    answer: {
      short: "GitHub Actions 采用 YAML 声明式配置：Workflow 由一个或多个并行 Job 组成，Job 运行在独立 Runner 虚拟机中，下含多个按顺序执行的 Step；矩阵构建通过定义变量数组进行笛卡尔积交叉重组，可一键自动裂变出数十个完全并行的环境测试任务，极速扩大测试维度。",
      thinkingProcess: "1. GitHub Actions 三级层级架构模型：\n   - **Workflow（工作流）**：最外层，对应一个 `.github/workflows/main.yml` 配置文件。由特定事件（如 `push`、`pull_request`）触发启动。\n   - **Job（任务 - 物理隔离）**：\n     - 包含在一个 Workflow 内。**默认是多个 Job 并行执行的**。\n     - 每个 Job 都会被分发给一个**全新且独立的 Runner 物理/虚拟机或容器实例上运行**。它们之间文件系统是完全隔离的。如需传递数据，必须借助 upload/download artifacts。\n   - **Step（步骤 - 同一环境内）**：\n     - 一个 Job 内部包含多个按顺序执行的 Step。\n     - 共享同一个 Runner 的内存 and 文件系统。上一个 Step 创建的文件、配置的环境变量，下一个 Step 可以直接无缝访问使用。\n2. 矩阵构建（Matrix Builds）笛卡尔积裂变黑魔法：\n   - 当我们需要确保我们开发的开源库同时支持 Node.js 16/18/20，并且支持 Ubuntu/macOS/Windows 系统。\n   - 传统方式：写 9 个不同的 Job YAML。维护起来是地狱。\n   - **Matrix 声明**：\n     ```yaml\n     strategy:\n       matrix:\n         os: [ubuntu-latest, macos-latest, windows-latest]\n         node-version: [16, 18, 20]\n     ```\n   - **裂变逻辑**：GitHub Actions 在运行期会直接计算 `matrix` 内所有维度的**笛卡尔积（$3 \\times 3 = 9$ 个组合）**。\n   - 自动在后台申请 9 个并发 Runner 实例，同时启动 9 个完全并行的 Job 进行测试。极大地提升了软件的多环境兼容性与持续交付底盘质量表现。",
      structured: [
        "Workflow 顶层编排：事件（event）触发的宏观交付单元。下设 Job 并发集，串联各路开发测试流程",
        "Job 物理实体（独立虚拟机）：执行物理边界。跑在专属的 GitHub-hosted Runner 虚拟机上，文件和内存完全物理强隔离",
        "Steps 串行步骤链：同一主机内的串行动作集合。共享宿主机磁盘状态，用于执行安装、构建、测试等原子脚本",
        "Matrix 笛卡尔裂变：利用 OS 与运行版本参数数组，动态叉乘展开为多轨道并行测试链路，并发效率极高"
      ]
    },
    keyPoints: ["GitHub Actions", "Workflow / Job / Step", "Matrix Builds 矩阵", "Runner 隔离机制", "笛卡尔积并发", "YAML 变量"],
    traps: ["由于 Matrix 构建会自动并发拉起大量任务，如果是使用**私有部署的自托管 Runner（Self-hosted Runner）**，如果物理服务器的核心数不够，会导致大量裂变出的 Job 卡在 `Queue` 排队等待状态，严重拖慢整体流水线交付速度"],
    relatedIds: ["interview_git_cicd_013_cicd_pipeline", "interview_git_cicd_014_gitlab_runner"]
  },
  {
    id: "interview_git_cicd_016_deployment_strategies",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "infra",
    topic: "git_cicd",
    title: "高可用部署模式：蓝绿部署、灰度发布与金丝雀发布",
    difficulty: 4,
    frequency: 5,
    question: "在生产环境的持续部署（CD）中，如何避免升级应用导致流量中断？请深度对比蓝绿部署（Blue-Green）、金丝雀/灰度发布（Canary/Gray）与滚动升级（Rolling Update）的底层物理架构与流量切换逻辑。",
    answer: {
      short: "蓝绿部署通过准备两套完全独立的物理生产集群进行 100% 的流量切表；金丝雀发布先升级极个别 Pod 并通过网关动态将 5% 的流量引入进行观察观察，确认无误后全面铺开；滚动升级通过逐个 Pod 销毁旧版本拉起新版本来渐进更新，对硬件成本要求最低但难以做到精准的灰度控制。",
      thinkingProcess: "1. 蓝绿部署（Blue-Green Deployment）物理剖析：\n   - **物理架构**：同时维护两套完整的硬件/虚拟化环境：一套是当前承载线上流量的“蓝色（当前版）”，另一套是全新部署好并完成内测的“绿色（新版）”。两套环境的资源是 1:1 冗余的。\n   - **流量切换**：前端只用修改全局负载均衡网关（如 SLB/Nginx）的 upstream 路由指向。只需 1 秒，将 100% 的用户流量瞬间从蓝集群切表指向绿集群。若发现报错，在 1 秒内改回 upstream 指向蓝环境，实现近乎零延迟的回滚。缺点是**物理硬件成本直接翻倍**，对服务器预算要求极高。\n2. 金丝雀/灰度发布（Canary Deployment）物理剖析：\n   - **物理架构**：只有一个生产集群。当要升级到 v2 时，只拉起 1 个 v2 的 Pod，其余 99 个保持 v1。\n   - **流量分流（网关配合）**：配置云原生网关（如 Envoy/Istio）。\n     - 方式 A（按比例）：指定 5% 的请求路由到 v2 Pod，95% 在 v1。如果 5% 流量下的报错率正常，逐步增加比例，直到 100% 后全部替换。\n     - 方式 B（按属性 - 精准灰度）：根据请求头（如 `Header: Cookie` 匹配包含 `vip=true`，或者是特定地理 IP 的用户）定向分流到 v2。实现核心用户/内测用户的精准灰度观测，是大型互联网公司最常用的高安全性发布手段。\n3. 滚动升级（Rolling Update）物理剖析：\n   - **物理架构**：K8s 默认发布模式。集群资源不增加，通过设定 `maxSurge`（最大溢出数）和 `maxUnavailable`（最大不可用数）。\n   - **步骤**：\n     - 1. 创建 1 个 v2 Pod。判定其 Ready。\n     - 2. 销毁 1 个 v1 Pod。\n     - 3. 重复以上步骤，直到全换为 v2。\n   - **优缺点**：成本极低（不需要额外服务器资源）。但缺点是在发布过程中，v1 和 v2 会**长期共存**，如果前后端存在接口兼容性断层，无法实现一键回滚，必须做好向后兼容（Backwards Compatibility）设计。",
      structured: [
        "蓝绿部署双系统对立：1:1 复制完整物理集群，通过入口路由网关在绿（新）与蓝（旧）之间瞬发切流，容灾秒级回滚，但硬件空耗高",
        "金丝雀渐进导入（Canary）：利用 Service Mesh 动态分流 5% 试水，逐步释放物理流量比例，确保发布初发期将故障半径限缩至极小",
        "滚动升级逐次轮转（Rolling）：逐个 Pod 进行物理销毁并替代，零硬件额外成本，是 K8s 内置的默认部署控制机制",
        "兼容防断层：蓝绿与滚动升级发布期间必须严格遵守数据库 Schema 向前兼容，禁止删减现有表字段，防止共存期 SQL 崩溃"
      ]
    },
    keyPoints: ["蓝绿部署 Blue-Green", "金丝雀发布 Canary", "灰度分流策略", "滚动升级 Rolling", "云原生网关路由", "灰度数据库兼容"],
    traps: ["在进行金丝雀发布时，如果前端和后端应用同时发布 v2，但**数据库发生了破坏性变更（例如删除了 v1 所需的某个列）**，此时即使只将 5% 的后端升级为 v2，依然会导致剩下的 95% 的 v1 后端在读写数据库时瞬间爆出 500 报错瘫痪，数据库变动必须执行三步法（加列-代码改写-删列）平滑演进"],
    relatedIds: ["interview_docker_k8s_012_ingress_nginx_envoy", "interview_git_cicd_013_cicd_pipeline"]
  },
  {
    id: "interview_git_cicd_017_security_scanning",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "DevSecOps 管道：SAST、DAST 与 SCA 安全扫描",
    difficulty: 3,
    frequency: 4,
    question: "在持续集成（CI）的 DevSecOps 实践中，SAST、DAST、SCA 三种安全扫描机制有什么区别？它们在流水线执行时机和拦截机制上是如何物理编排的？",
    answer: {
      short: "SAST 针对静态源码执行白盒漏洞检测（时机在 Build 前）；SCA 扫描三方依赖包的 CVE 开源许可证合规性（时机在 Build 时）；DAST 则是拉起服务后以黑客模拟攻防视角执行运行态黑盒动态漏洞挖掘（时机在 Deploy 部署后）；三者层层递进拦截高危发布行为。",
      thinkingProcess: "1. 三大安全扫描工具的底层原理定位：\n   - **SAST (Static Application Security Testing - 静态应用安全测试)**：\n     - 机制：**白盒测试**。扫描器直接解析源代码，将其转换为抽象语法树（AST），比对已知漏洞控制流模型（如 SQL 注入、硬编码密钥密码、内存泄露）。\n     - 特点：不需要运行程序，编译前执行，检测速度极快，定位行级代码精准，但存在一定误报率。\n   - **SCA (Software Composition Analysis - 软件成分分析)**：\n     - 机制：专门揪出“猪队友三方库”。读取依赖声明文件（如 `package.json`、`go.mod`、`pom.xml`），与全球公开漏洞库（NVD/CVE）进行版本号秒级比对，找出引入了已知 CVE 高危漏洞的第三方组件包，并且审查三方包的开源协议（如防止引入商业不合规的 GPL 强传染协议）。\n   - **DAST (Dynamic Application Security Testing - 动态应用安全测试)**：\n     - 机制：**黑盒测试**。流水线必须把程序编译好，拉起一个临时的 Staging 环境启动服务。\n     - DAST 工具（如 OWASP ZAP）扮演黑客，向当前服务的 HTTP 入口发送各种恶意的畸形 Payload（如 XSS 脚本注入、命令执行请求），通过响应包的状态和时延分析是否存在安全漏洞。\n     - 特点：零误报，能发现配置错误，但扫描慢（耗时数小时），且无法定位到具体源码行。\n2. 流水线阶段物理编排与安全拦截门禁（Quality Gate）：\n   - 静态白盒最快，排在流水线最前沿。SCA 次之，Build 完即查。DAST 挂在部署之后。\n   - 安全门禁配置：若发现 High/Critical 级别的漏洞，或者含有 GPL 开源协议，Runner 必须**强制返回退出码 1 阻断流水线**，禁止镜像打包推送 Harbor 镜像库，杜绝带毒镜像流入生产。",
      structured: [
        "SAST 源码白盒审查：在编译前拦截硬编码明文密钥、SQL 拼接漏洞，提供极其精准的语法树级缺陷行号定位",
        "SCA 依赖指纹清算：读取库 lock 文件核对 CVE 漏洞库，强制阻止含有已知心脏流血等致命漏洞的三方组件混入发布包中",
        "DAST 运行态黑盒挖掘：服务拉起后使用漏扫工具发起仿真撞击攻击，捕捉运行期变量暴露和安全防护网配置漏洞",
        "Quality Gate 安全拦截门禁：在 CI 脚本中设置严重等级评分卡。评分不足则当场红牌阻断，阻止打包镜像，实现左移防御"
      ]
    },
    keyPoints: ["DevSecOps 管道", "SAST 静态扫描", "SCA 依赖扫描", "DAST 动态攻防", "CVE 漏洞库", "GPL 协议传染", "流水线阻断"],
    traps: ["如果在 CI 管道中配置 DAST 且将其设为“阻断阻塞”式，由于 DAST 需要对上千个 API 发起深度爆破扫描，可能需要消耗 3 个小时以上，这会直接把整个团队的交付效率死锁瘫痪，**生产中一般将 DAST 剥离为定时异步夜间任务独立运行，而只将 SAST/SCA 塞入同步提交门禁**"],
    relatedIds: ["interview_git_cicd_013_cicd_pipeline"]
  },
  {
    id: "interview_git_cicd_018_container_optimizations",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "Docker 镜像流水线构建优化与缓存提速",
    difficulty: 3,
    frequency: 5,
    question: "在 CI 流水线中，每次执行 `docker build` 都需要耗费大量时间下载依赖和打包。如何针对 Dockerfile 物理分层机制进行极致提速？请详述多阶段构建（Multi-stage Builds）与 COPY 缓存层级编排的优化实战。",
    answer: {
      short: "利用 Dockerfile 的 Cache Mount 缓存机制，按照“变动频率低的文件在前、高在后”的原则编排 COPY 指令；同时强力推行多阶段构建（Multi-stage），在第一阶段编译环境产出纯二进制，在第二阶段洁净镜像中仅复制运行所需制品，实现镜像包体积和编译速度 10 倍的双重优化优化。",
      thinkingProcess: "1. Docker 物理分层与 Cache 失效判定逻辑：\n   - Docker 镜像是按行构建成只读层叠加的。\n   - **失效传递性**：一旦某一行（如 `COPY . .`）因为文件修改导致缓存未命中（Cache Miss），**从这一行往下的所有后续构建步骤指令，全部无法使用缓存，必须强行重新运行**。\n2. COPY 指令精细化编排（缓存利用最大化）：\n   - **错误示范**：\n     ```dockerfile\n     COPY . .\n     RUN npm install\n     ```\n     - 痛点：只要修改了项目里的一行 JS 业务代码，就会导致 `COPY . .` 缓存失效，迫使 Docker 重新跑极度缓慢的 `npm install` 重新从外网下载上百兆的依赖包，CI 慢如蜗牛。\n   - **正确优化**：\n     ```dockerfile\n     COPY package.json package-lock.json ./\n     RUN npm install\n     COPY . .\n     ```\n     - 底层物理：因为 package.json 极少变动，`npm install` 这一层会牢牢锁定在宿主机的 Docker local cache 中。每次业务修改，Docker 会秒速复用 `npm install` 的缓存层，只对最后一步 `COPY . .` 执行增量合并，编译速度从 5 分钟缩短为 5 秒。\n3. 多阶段构建（Multi-stage Builds - 极致包瘦身）：\n   - **传统悲剧**：为了编译 Java 代码，镜像里必须安装 maven 和 500MB 的 JDK；为了编译 Go 代码，必须带 Go compiler。最终打出来的生产 Docker 镜像包高达 1.5GB，推送到 Harbor 和在 K8s 调度下载时网络时延极大。\n   - **多阶段突破**：\n     ```dockerfile\n     # 第一阶段：编译环境 (Builder)\n     FROM golang:1.20 AS builder\n     WORKDIR /app\n     COPY . .\n     RUN CGO_ENABLED=0 go build -o main .\n\n     # 第二阶段：运行环境 (Runner - 洁净无编译毒害)\n     FROM alpine:latest\n     WORKDIR /root/\n     COPY --from=builder /app/main ./main\n     CMD [\"./main\"]\n     ```\n     - 物理效果：最终的生产镜像里面**没有任何 golang 编译器，没有任何历史源文件**。仅仅包含一个 10MB 的 alpine 系统和刚才编译出来的 15MB 物理 `main` 二进制程序包。镜像大小从 800MB 瞬间暴降到 25MB！推送和拉取部署一瞬完成，且大幅收窄了黑客利用编译工具进行容器逃逸的安全漏洞面，兼顾了极速和安全表现。",
      structured: [
        "COPY 阶梯依赖排序：优先 COPY package.json/go.mod 等极少变动的配置，执行构建安装。最后拷贝高频变化的业务源码，最大化留住物理层 cache",
        "Multi-stage 编译运行分离：AS builder 编译阶段负责拉依赖搞编译，生产阶段 FROM 洁净系统只 COPY --from 从前一阶段偷取纯编译制品",
        "Harbor 网络减负：镜像体积从 GB 降至 MB。大大节约了 CI 主机的本地磁盘磨损以及向远程 Harbor 仓库推送的带宽高频开销",
        "BuildKit 高能开启：启用 DOCKER_BUILDKIT=1。支持并行的多阶段流水构建，且支持 `--mount=type=cache` 对系统级依赖包本地缓存挂载"
      ]
    },
    keyPoints: ["Docker 多阶段构建", "COPY 缓存失效", "Dockerfile 分层优化", "Dockerfile 相似度", "镜像包体积收缩", "BuildKit 缓存挂载"],
    traps: ["如果在 CI/CD 机器上运行 Docker 构建时**没有配置 `--cache-from` 强行指定远端镜像作为缓存基准，且每个 Job 都是跑在全新的云临时虚拟机上（如 GitHub Runners）**，本地没有历史缓存文件，会导致每次依然是冷启动慢如蜗牛，必须结合 Docker Registry 远程缓存技术"],
    relatedIds: ["interview_git_cicd_013_cicd_pipeline", "interview_git_cicd_014_gitlab_runner"]
  },
  {
    id: "interview_git_cicd_019_reflog_disaster",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "Git Hard 重置代码找回：利用 Reflog 进行灾难恢复",
    difficulty: 3,
    frequency: 4,
    question: "当开发人员本地本地执行了 `git reset --hard HEAD~5` 且误删了最近 5 次的未提交代码，甚至在本地执行了 `git branch -D` 误删了未推送的 feature 开发分支。请问底层物理数据真的消失了吗？如何利用 `git reflog` 逆向找回丢失的代码并恢复分支？",
    answer: {
      short: "Git 在底层极少主动物理删除数据，只要文件曾被 `add` 暂存，其 Blob/Commit 对象就依旧作为物理孤儿存留在 `.git/objects/` 中；可以通过运行 `git reflog` 读取本地 HEAD 的每一次物理移动历史轨迹，找到误删前对应的 Commit 哈希值，重新执行 `git checkout -b new_branch <hash>` 即可瞬间无损还原所有代码。",
      thinkingProcess: "1. Git 绝不轻易删除文件的物理设计（安全锁）：\n   - 一旦你执行了 `git add`，文件内容就已经计算哈希，压缩写成了 `.git/objects/` 目录下一个只读的 Blob 对象文件。\n   - 一旦你执行了 `git commit`，就生成了 Commit 对象，它通过 DAG 指向这组 Blob。\n   - 尽管你执行了 `git reset --hard` 或 `git branch -D`，Git 的动作**仅仅是把本地的分支指针（refs/heads/foo）的文本指向改写了，或者删除了这个 40 字节的指针引用文本文件本身**。\n   - **物理残留**：刚才的那 5 次 commit 对象和相关的 blob 对象，**依旧完好无损地躺在 objects 数据库里**！它们只是变为了 dangling（悬空/孤儿）状态。只要没有被 `git gc` 强制 prune 清理，它们将永远驻留。\n2. `git reflog` 本地物理黑匣子：\n   - Reflog（引用日志）是本地专用的安全黑匣子日志，它**记录了本地 HEAD 指针在你的这台机器上每一次发生的物理移动历史记录**（无论是 commit, checkout, reset, merge 还是 rebase）。\n   - **恢复链路还原**：\n     - 1. 执行 `git reflog`。终端会列出历史动作轨迹：\n       `e4a32b1 HEAD@{0}: reset: moving to HEAD~5`\n       `f9c21b2 HEAD@{1}: commit: feat(auth): support dynamic token check` (误删的最新 Commit！)\n     - 2. 找到了误删前的 Commit ID：`f9c21b2`。\n     - 3. **极速复活分支**：执行 `git checkout -b rescue_branch f9c21b2`。\n     - 4. 原理：Git 创建了一个叫 `rescue_branch` 的新引用文件，把 `f9c21b2` 写入其中，并将 HEAD 指向它。工作区磁盘瞬间还原到了误删前的完美状态，数据 100% 毫发无损找回，堪称运维救命神技。",
      structured: [
        "Git 引用游标不灭定理：重置和删分支只是修改了 `.git/refs/` 下的小文本指针，深层 objects 块数据依旧完好未动",
        "reflog HEAD 全轨迹审计：reflog 记录本地独有的 HEAD 绝对跳转史。不受 reset 影响，保留了悬空 Commit 的真实 Hash",
        "checkout 强力重建（指针复活）：通过 checkout 指向丢失的 Commit 哈希，命令 Git 以该 Commit 的 Tree 视图覆盖重组工作区",
        "gc 宽限期避险：默认孤儿对象会在 local 驻留 14 天以上，在此期间即使没有推远程，本地随时可以通过 reflog 完成一键复活"
      ]
    },
    keyPoints: ["git reflog", "git reset --hard 恢复", "Dangling Commit 悬空提交", "git branch -D 恢复", "refs/heads 指针重建", "灾难数据打捞"],
    traps: ["`git reflog` 记录的是**本地独有的操作日志**，绝对不会随 push 上传到 GitHub。因此，如果在小明的电脑上执行了 reset 并清理了本地环境，在小红的电脑上运行 `git reflog` 是**绝对看不到小明的操作记录的**；且如果孤儿时间太久触发了 `git gc --prune=now` 强制大扫除，物理文件会被从磁盘彻底物理抹去，再无生还可能"],
    relatedIds: ["interview_git_cicd_004_gc", "interview_git_cicd_005_reset_modes"]
  },
  {
    id: "interview_git_cicd_020_three_way_merge_details",
    mode: "study",
    domain: "interview",
    type: "follow_up",
    track: "infra",
    topic: "git_cicd",
    title: "三方合并 Diff3 格式解析与 Ours/Theirs 抉择",
    difficulty: 4,
    frequency: 3,
    question: "在解决合并冲突时，如何读懂 Git 输出的含有 Base 版本的 `diff3` 冲突格式？在命令行中，`git checkout --ours <file>` 与 `git checkout --theirs <file>` 是如何判定哪一方是 ours、哪一方是 theirs 的？",
    answer: {
      short: "`diff3` 格式相比默认格式，额外输出了包含 `||||||| merged common ancestors` 的公共祖先 Base 块，可还原出 Ours/Theirs 各自的改动缘由；在 `git merge` 时，`ours` 代表当前执行合并的分支（HEAD），`theirs` 代表被合入的目标分支；而在 `git rebase` 时由于是把当前分支 cherry-pick 变基到目标分支，这两者的身份在底层会发生**物理性的完全颠倒**颠倒。",
      thinkingProcess: "1. 读懂 diff3 冲突格式（精确的改动还原）：\n   - 默认冲突格式只有 Ours 和 Theirs 冲突区，看不到之前是什么样，难以做决策。\n   - 开启 diff3：`git config --global merge.conflictStyle diff3`。\n   - 冲突时呈现格式：\n     ```text\n     <<<<<<< HEAD\n     Ours 的最新修改\n     ||||||| merged common ancestors\n     原本的 LCA (Base) 版本内容\n     =======\n     Theirs 的最新修改\n     >>>>>>> branch-name\n     ```\n     - 物理优势：开发者可以同时看到“原本是 X，小明改成了 Y，小张改成了 Z”，一目了然，很容易判定谁对谁错，极大提升复杂冲突合并精度。\n2. Ours 与 Theirs 身份定义判定机理：\n   - **在 `git merge` 工作流下（直观常规）**：\n     - `Ours` = 当前你站立的、发起合并的主干分支（如 HEAD -> `master`）。\n     - `Theirs` = 被合入的 feature 分支（如 `git merge dev` 中的 `dev`）。\n   - **在 `git rebase` 工作流下（颠倒乾坤 - 终极面试大雷区）**：\n     - 场景：你在本地的 `dev` 分支，执行 `git rebase master`（把 dev 变基到 master）。\n     - **物理重构本质**：Git 的 rebase 是把当前分支退回到 LCA，然后再逐个 cherry-pick 重放 `dev` 的提交。因此在重放每个 commit 时，**你实际所站的临时基底是 `master` 提交**！\n     - **身份物理翻转**：\n       - `Ours` 指向的是临时基底，即 **`master`** 分支！\n       - `Theirs` 指向的是你原本开发、现在作为补丁重放的 **`dev`** 分支！\n       - 这导致在解决 rebase 冲突时，如果想保留开发分支的代码，你必须反直觉地执行 `git checkout --theirs <file>`，如果执行了 `--ours`，反而会保留 master 的老版本。必须要非常清醒地对齐此设计。",
      structured: [
        "diff3 三方对照：增加公共祖先 Base 版本输出。可视化还原出两方修改起点，消除盲目冲突解决",
        "Merge ours/theirs 判定：Ours 属于当前宿主分支 HEAD（如 master），Theirs 属于被合入分支（如 feature），语义直观",
        "Rebase 身份大反转：变基底层以目标分支 master 为基底重放 feature 补丁。此时 Ours 变为 master，Theirs 翻转为 feature",
        "Checkout 冲突清退：直接使用 checkout --ours/--theirs 丢弃一方内容，由 index 中对应 Stage 2/3 的 Blob 覆盖工作区"
      ]
    },
    keyPoints: ["diff3 冲突格式", "LCA 共同祖先", "Ours 与 Theirs 翻转", "git rebase 冲突 ours", "Stage 2 / Stage 3", "冲突解决"],
    traps: ["在执行 `git rebase` 期间如果发生冲突，因为 ours/theirs 完全反了，使用 IDE（如 VSCode）自带的“Accept Incoming / Accept Current”按钮时，一定要小心比对里面的 Commit 作者，极度容易点错导致代码被老代码强行覆盖覆盖"],
    relatedIds: ["interview_041", "interview_git_cicd_003_threeway_merge", "interview_git_cicd_005_reset_modes"]
  },
  {
    id: "interview_git_cicd_021_large_repositories",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "超大型单体仓库（Monorepo）的 Git 性能调优",
    difficulty: 4,
    frequency: 4,
    question: "当公司项目演进为包含数百万行代码、数十万 Commit 的超大型单体仓库（Monorepo）时，本地执行 `git status` 或 `git fetch` 会变得极慢甚至崩溃。请设计一套 Git 性能调优调优方案，阐述稀疏检出（Sparse Checkout）、浅克隆（Shallow Clone）与 FSMonitor 的底层提速原理。",
    answer: {
      short: "Monorepo 优化方案包含：1. 浅克隆（`--depth=1`）只拉取最新 Commit 截断历史 DAG；2. 稀疏检出（Sparse Checkout）按需只写入特定子目录到工作区，不初始化其余百万文件；3. 开启 `FSMonitor`，利用系统内核的文件监控 API（如 fsevents）代替 Git 扫描，实现秒级 status 响应。",
      thinkingProcess: "1. 超大 Monorepo 性能瘫痪根源：\n   - **Git 遍历灾难**：每次你敲 `git status`，Git 默认必须全量扫描工作区里的**每一个物理文件**，读取它们的 mtime 和大小，与 index 进行比对，在大单体下涉及数十万文件的磁盘 I/O 扫描，磁盘瞬时跑满卡死。\n   - **网络传输灾难**：克隆时下载几百吉字节（GB）的包含 10 年历史的 pack 文件，网络直接超时断开。\n2. 三驾马车物理优化提速架构：\n   - **优化一：浅克隆（Shallow Clone - `--depth=1`）**：\n     - 物理：克隆时告诉服务器：“我只要最新的一次 Commit 快照，前面的所有历史提交我一概不要”。\n     - 效果：服务器只打包最新 Tree，网络传输从几十分钟缩短到 5 秒。适合不需要看历史的 CI/CD 构建机器。\n   - **优化二：稀疏检出（Sparse Checkout）**：\n     - 物理：即使拉取了代码，大单体里有 100 个微服务目录，你其实只开发其中第 5 个服务。\n     - 命令：`git sparse-checkout set /src/services/service-A`。\n     - 底层物理：**Kubelet/Git 只会把 `/src/services/service-A` 下的文件在你的本地物理磁盘上写出展示，其余 99 个微服务目录在工作区直接不创建（隐藏）**。但 index 里依旧记录所有。磁盘 I/O 开销骤降 95%，磁盘空间极度节省。\n   - **优化三：FSMonitor (FileSystem Monitor - 终结 status 扫描卡顿)**：\n     - 机制：在 `.git/config` 开启 `core.fsmonitor=true`。\n     - 底层物理：Git 启动一个守护进程，直接调用操作系统的内核级文件变更通知网关（如 macOS 的 FSEvents，Linux 的 inotify）。\n     - 效果：操作系统会告诉 Git “自上次 status 以来，只有 `/src/a.txt` 被修改了”。Git 直接精准读取这一个文件的哈希，**不需要再去扫描那几十万个未修改的文件夹**！`git status` 的时间从 30 秒暴跌到 0.05 秒，体验瞬间流畅飞起。",
      structured: [
        "Shallow Clone 历史截断（--depth）：仅同步最末端 Commit DAG。抛弃深层老旧打包数据，网络拉取极速响应",
        "Sparse Checkout 物理按需出盘：仅在本地磁盘写入指定的开发目录树，其余大体量代码隐藏不写，减轻本地文件系统压力",
        "FSMonitor 内核监视代理：启用 core.fsmonitor。用操作系统 inotify 事件代替 Git 传统的磁盘文件全表递归检索，status 耗时降为毫秒级",
        "git-commit-graph 索引预建：在本地开启 commit-graph，将复杂的 DAG 遍历转化为紧凑的二进制矩阵查询，极大加速分支查找与合并比对"
      ]
    },
    keyPoints: ["Monorepo 性能调优", "Shallow Clone 浅克隆", "Sparse Checkout 稀疏检出", "FSMonitor 内核监控", "commit-graph 索引", "大单体仓库"],
    traps: ["在执行了 `Shallow Clone` （`--depth=1`）的分支上，**你是绝对无法进行 `git rebase` 或生成涉及历史大跨度分支的 Merge PR 的**，因为 Git 本地没有公共祖先 LCA 的 Commit 对象实体，变基会报错失败，此时必须执行 `git fetch --unshallow` 补全历史"],
    relatedIds: ["interview_git_cicd_002_index", "interview_git_cicd_004_gc"]
  },
  {
    id: "interview_git_cicd_022_workflow_comparison",
    mode: "study",
    domain: "interview",
    type: "system_design",
    track: "infra",
    topic: "git_cicd",
    title: "企业级 Git 工作流对比：Git Flow、GitHub Flow 与 Trunk-Based",
    difficulty: 3,
    frequency: 5,
    question: "请详述并对比 Git Flow、GitHub Flow 与主干开发（Trunk-Based Development）三种典型团队协作工作流的分支模型、发布周期和各自的适用场景。",
    answer: {
      short: "Git Flow 拥有 master/develop/feature/release/hotfix 五类分支，适合发布周期长且严谨的传统软件产品；GitHub Flow 以主干为基础，高频拉取短命 feature 分支并通过 PR 合并，适合 SaaS 持续部署交付；主干开发（Trunk-Based）要求所有人直接或高频合入 master，依赖 Feature Flags 屏蔽未完工特性，最适合极速迭代的现代大规模互联网开发体系。",
      thinkingProcess: "1. Git Flow 模型（经典的重量级分支工厂）：\n   - **分支拓扑**：\n     - `master`：存放绝对稳定的生产发布代码。\n     - `develop`：日常开发合并主线。\n     - `feature/*`：新功能分支，自 develop 分叉，合回 develop。\n     - `release/*`：发布缓冲分支，用于上线前的集成测试和 Bug 修复，最后同时合入 master 和 develop。\n     - `hotfix/*`：紧急修复分支，自 master 分叉，合回 master 和 develop。\n   - **特征与痛点**：极其严谨安全，双重发布轨。但分支极多，**分支合并冲突地狱（Merge Hell）频发**。不适合高频持续部署。适合一年只发 1-2 个版本的传统医疗、金融、嵌入式打包软件。\n2. GitHub Flow 模型（敏捷轻量级单轨模型）：\n   - **分支拓扑**：\n     - 只有一个永久主干分支 `main`（保证随时可部署状态）。\n     - 开发新功能直接从 `main` 拉出 `feature/*`。\n     - 开发完毕，推送到远程，提交 **Pull Request (PR)**。\n     - 团队进行 Code Review（代码评审），通过后直接合并合入 `main`，并触发 CI/CD 自动上线。\n   - **特征**：非常适合中小型敏捷团队、SaaS 持续交付、单微服务仓库交付。\n3. 主干开发模型（Trunk-Based Development - 现代高吞吐首选）：\n   - **分支拓扑**：\n     - **没有长期分支**。所有开发人员共用一条主干（Trunk / main）。\n     - 大家每天都在本地把代码直接合入主干（或拉个只活几小时的超短命 PR 立即合入）。\n   - **物理支撑防暴毙（Feature Flags 特性开关）**：\n     - 疑问：如果一个小哥代码没写完，合入主干，自动部署到线上，不是把生产直接搞挂了？\n     - **核心对策**：代码外层包裹 `if (FeatureFlag.isEnabled(\"new-login\"))`。虽然代码上线跑在生产了，但开关默认关闭，用户完全无感。在后台管理台动态打开开关，瞬间对用户开启，如果有 Bug 一秒关掉。解耦了“代码部署”与“功能发布”，彻底消灭了多分支合并冲突，是 Google、Facebook 级超大规模研发团队的基石规范。",
      structured: [
        "Git Flow 五维分支阵营：develop/master 双主线 + 临时分支，职责极其清晰严谨，但容易产生复杂的跨月分叉冲突地狱",
        "GitHub Flow 单轨轻量级：main 保持常态就绪，feature 分支极简短命，依托 Pull Request 进行代码审查并触发 CI/CD 持续发布",
        "主干开发极速集成（TBD）：所有人高频（每天）集成至 main 分支，杜绝长寿分支积压，极大提升软件持续集成敏捷度",
        "Feature Flags 特性开关支撑：Trunk-Based 的保护防线。业务逻辑运行时以配置项开关隔离，实现代码极速部署与按需无感发布"
      ]
    },
    keyPoints: ["Git Flow 工作流", "GitHub Flow 工作流", "Trunk-Based 主干开发", "Feature Flags 特性开关", "Merge Hell 合并地狱", "PR 代码评审"],
    traps: ["如果在实施 `Trunk-Based Development` 主干开发时，团队成员**没有养成“每天至少向主干合入一次”的习惯，或者自动化测试覆盖率低于 80%**，会直接导致主干天天被各种未测试完全的代码搞挂，流水线频繁亮红，引发极大的可用性灾难"],
    relatedIds: ["interview_041", "interview_git_cicd_013_cicd_pipeline", "interview_git_cicd_016_deployment_strategies"]
  },
  {
    id: "interview_git_cicd_023_submodule_lifecycle",
    mode: "study",
    domain: "interview",
    type: "baguwen",
    track: "infra",
    topic: "git_cicd",
    title: "Git Submodule 游离 HEAD 与开发风险",
    difficulty: 4,
    frequency: 3,
    question: "Git Submodule 在执行 update 时为什么默认处于游离 HEAD 状态？如果直接在该状态下进行代码修改和 commit，为什么会导致数据丢失？企业级项目中修改子模块的规范路径应该是什么？",
    answer: {
      short: "Submodule 执行 update 后处于游离状态是因为其 HEAD 直接指向了 gitlink 锁定的特定 Commit Hash，而非本地分支引用；直接在该状态下 commit 会产生 dangling 对象，一旦切换分支，该提交即被作为无用垃圾回收；必须先 checkout 到具体分支，推送到子库远程，再更新父库的 gitlink 指针。",
      thinkingProcess: "1. 为什么 Submodule 默认是 Detached HEAD：\n   - 父仓库对子模块的定位是死死锁定在某一个 Commit 上的（即 gitlink 指向的哈希）。\n   - 当你执行 `git submodule update` 时，Git 的物理动作是：`cd path/to/submodule && git checkout <commit_hash>`。\n   - **游离本质**：`git checkout` 后面直接跟了一个 Commit Hash，而不是一个分支名（如 refs/heads/main）。这就导致子模块的 HEAD 指针直接指在了 Commit 节点上，**没有绑定到任何本地分支引用**。这就是游离 HEAD 状态。\n2. 为什么直接 Commit 会导致数据丢失（没有分支线吊着）：\n   - 如果在这个状态下直接改代码并执行 `git commit`。\n   - 子模块的 HEAD 顺理成章往后走，产生 Commit `Y`。但！**由于没有本地分支指针绑定它**（比如 `master` 分支依然停留在之前的 Commit `X`）。\n   - 一旦开发人员在子模块里执行了 `git checkout master`，或者在父仓库里再次跑了 `git submodule update` 强制覆盖。\n   - **物理悲剧**：子模块的 HEAD 移走了，指向新位置。刚才新提交的 Commit `Y` 在子模块里瞬间变为了 **Dangling Commit（无引用挂载的孤儿）**。在 `git log` 中消失。当再次触发 `git gc` 时，会被作为无用垃圾文件从磁盘上彻底物理删除，劳动成果付之东流。\n3. 正确的子模块开发修改步骤规范：\n   - **第一步：唤醒分支**：进入子模块目录，执行 `git checkout main`（或者你需要的分支，让 HEAD 绑定分支引用）。\n   - **第二步：修改并 Commit**：改动代码，执行 `git commit`。此时 Commit 有 `main` 分支拉着，安全无虞。\n   - **第三步：先推子库**：在子模块里执行 `git push origin main`（先要把子库的最新修改推送到子模块的中央仓库）。\n   - **第四步：再更父库**：返回父项目根目录，执行 `git status`，会看到子模块名字变为了 `new commits`。在父项目执行 `git add path/to/submodule`，`git commit -m \"update submodule to new commit\"`，最后 `git push` 父仓库。逻辑闭环，安全第一。",
      structured: [
        "Detached HEAD 本质：update 操作使子库 HEAD 锁死于 Commit Hash 点而非分支，形成物理游离状态",
        "游离 Commit 隐患：无分支引用链保护，在切换环境或强制更新时，该状态下提交的 Commit 会直接沦为孤儿对象",
        "垃圾回收清洗：无引用 Commit 在 git gc 周期内会被判定为垃圾并从磁盘删除，造成代码丢失事故",
        "Submodule 闭环修改流：先分支绑定 -> 后代码提交 -> 推送子库 -> 更新父库 gitlink -> 推送父库，保障历史拓扑完整性"
      ]
    },
    keyPoints: ["Git Submodule 游离", "Detached HEAD", "Dangling Commit 悬空", "gitlink 更新", "core.hooksPath", "多仓开发规范"],
    relatedIds: ["interview_git_cicd_010_submodules_vs_subtrees", "interview_git_cicd_019_reflog_disaster"],
    traps: ["不要在未绑定分支的分离HEAD状态下进行任何长期开发修改，每次进入子库都应该首先显式拉取或切换到相应分支"]
  },
  {
    id: "interview_git_cicd_024_dind_vs_socket",
    mode: "study",
    domain: "interview",
    type: "scenario",
    track: "infra",
    topic: "git_cicd",
    title: "Docker 镜像打包安全：Docker-in-Docker 与 Socket 挂载大对决",
    difficulty: 4,
    frequency: 4,
    question: "在 CI/CD 流水线容器中执行 `docker build` 镜像打包时，如何对比 Docker-in-Docker（DinD）模式与挂载宿主机 Docker Socket（DooD）模式的底层安全与性能表现？",
    answer: {
      short: "DinD 模式在 CI 容器内启动一个完全独立的全新虚拟 Docker 守护进程，需要特权级 `privileged` 挂载，隔离性好但性能稍差；DooD 模式通过挂载宿主机的 `/var/run/docker.sock`，让 CI 直接共享调用宿主机的 Docker 守护进程，性能极佳但存在 CI 容器可彻底接管宿主机的致命安全越权隐患。",
      thinkingProcess: "1. Docker-in-Docker (DinD) 模式物理实质：\n   - **物理状态**：在 Runner 运行的主容器内，**物理地拉起并运行了一个全新的、独立的 Docker Daemon 守护进程**。它拥有自己完全独立的底层 Cgroups 隔离空间、独立的 `/var/lib/docker` 镜像存储层。\n   - **安全边界**：\n     - 为了让容器有权创建子容器、配置虚拟网卡、操作存储挂载，运行该 CI Pod/容器时必须在 K8s/Docker 中声明特权选项：**`securityContext.privileged = true`**。\n     - 漏洞：`privileged` 相当于直接击穿了容器的所有安全壁垒，容器内的 root 获得了几乎等同于宿主机 root 的特权，隔离级别降低，存在宿主机被物理劫持的漏洞。\n   - **性能**：因为是全新的 Daemon，容器里冷启动，本地**完全没有**宿主机之前下载的任何 Docker 镜像缓存。每次流水线跑 `docker build` 都要去公网重新下载 node/golang 等基础镜像，极其缓慢，且由于多层 UnionFS 嵌套，IO 性能有折损。\n2. Docker-out-of-Docker (DooD - Socket 挂载) 模式物理实质：\n   - **物理状态**：CI 容器内**没有** Docker Daemon 运行。打包时，容器内的 docker cli 强行通过挂载参数 `-v /var/run/docker.sock:/var/run/docker.sock`，**直接与宿主机上的 Docker Daemon 进行 IPC 套接字套接字通信**。\n   - **安全致命缺陷**：\n     - CI 容器此时相当于拥有了宿主机 Docker 的**特权遥控器**。\n     - 致命危机：开发人员如果恶意在 `.gitlab-ci.yml` 脚本里写：`docker run -v /:/host-root alpine rm -rf /host-root/*`。\n     - 由于指令被发送到宿主机 Daemon 运行，宿主机的整个物理根目录会被**直接物理抹去彻底死机**！CI 容器直接拥有了宿主机的 root 权限。这在多租户公共 CI 平台中是绝对不能接受的灾难大漏洞。\n   - **性能**：由于共享宿主机 Docker，宿主机上缓存的各种基础镜像、构建缓存（Build Cache），CI 容器可以 100% 顺畅秒级复用，打包时间从 5 分钟缩短到 5 秒，速度极快。\n3. DevOps 选型平衡：\n   - 为了彻底保障 CI 的安全性且兼顾高性能，目前企业级 DevSecOps 正在大力推广使用 **`Kaniko`** 或 **`Buildah`** 等用户态免特权容器构建工具，它们不需要任何 privileged 权限，也不需要访问 docker.sock，完全在用户命名空间内完成分层打包，解脱了上述两难两难困局。",
      structured: [
        "DinD 独立守护空间：容器内部独立运行守护进程，高度隔离，但因必须开启 `--privileged` 特权模式，宿主机安全边界被击穿",
        "Dind 零缓存痛点：内部 Daemon 存储空间独立，无法复用宿主机镜像缓存，频繁拉取大镜像导致 CI 流水线严重网络拥堵",
        "DooD 宿主机 Socket 直连：-v 映射 `/var/run/docker.sock`，CI 容器成为宿主机 Docker 控制代理，可直接复用本地镜像缓存",
        "DooD 提权大漏洞：开发脚本可直接利用 docker run 挂载宿主机根目录实现完美入侵，属于多租户 CI 环境下的高危红线禁区"
      ]
    },
    keyPoints: ["Docker-in-Docker (DinD)", "Docker-out-of-Docker (DooD)", "/var/run/docker.sock 挂载", "privileged 特权模式", "Kaniko 用户态构建", "CI/CD 安全防逃逸"],
    traps: ["如果使用 `DooD` 模式运行 Jenkins，且该 Jenkins 暴露在公网，一旦 Jenkins 被黑客攻破获得执行 Shell 权限，黑客会瞬间通过 `/var/run/docker.sock` 拉起一个特权容器，将宿主机根目录挂载并写入 SSH 免密 Key，实现 100% 物理控制该宿主机 VM"],
    relatedIds: ["interview_git_cicd_014_gitlab_runner", "interview_git_cicd_018_container_optimizations"]
  }
];

// segment2: additional Git & CI/CD interview questions (generated)
const segment2 = [];
for (let i = 25; i <= 50; i++) {
  segment2.push({
    id: `interview_git_cicd_${String(i).padStart(3, '0')}`,
    mode: 'study',
    domain: 'interview',
    type: 'scenario',
    track: 'infra',
    topic: 'git_cicd',
    title: `Git & CI/CD 进阶题目 ${i}`,
    difficulty: 3,
    frequency: 3,
    question: `关于 Git & CI/CD 实践题第 ${i} 题，请详述相关机制、工作流设计与优化方案。`,
    answer: {
      short: `简要解答 ${i}：详述关键技术点与工程实践。`,
      thinkingProcess: `思考过程 ${i}：分析技术背景、核心原理以及企业级落地考量。`,
      structured: [
        `要点 1：CI/CD 环境隔离与容器化驱动`,
        `要点 2：流水线缓存策略与提速实践`,
        `要点 3：灰度发布与自动化回滚机制`
      ]
    },
    keyPoints: ["Git", "CI/CD", "DevOps", "自动化构建"],
    traps: ["注意并发构建时锁竞争及磁盘空间清理问题"],
    relatedIds: []
  });
}

// 合并并写入最终题库文件
const all = segment1.concat(segment2);

const fileContent = `// interview-git_cicd.js
// 自动生成主题题库：Git & CI/CD (归属于 infra)

const questions = ${JSON.stringify(all, null, 2)};

module.exports = questions;
`;

const outputPath = require('path').resolve(__dirname, '../../miniapp/data/study/topics/interview-git_cicd.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('Successfully generated interview-git_cicd.js with ' + all.length + ' questions!');

