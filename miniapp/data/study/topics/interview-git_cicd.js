// interview-git_cicd.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
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
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Git Rebase 与 Merge 的区别及工作流选择】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 【合并差异直观联想】：看 Git 提交树图（git log --graph），merge 会有弯弯曲曲的交织线和“Merge branch...”的自动提交；rebase 则是一条直直的直线，非常干净。\n2. 【底层机制比对分析】：Merge：找到两个分支的最近公共祖先节点（Base），将两个分支的最新状态进行三方合并，如果产生冲突则在当前解决并生成一个带两个父节点的 Merge Commit。Rebase：把当前分支上自公共祖先以来的所有 commit 临时打包保存为补丁（patch），然后将当前分支指向目标分支的最前沿（变基），再将保存的补丁依次重放（apply），遇到冲突需要逐个提交进行 fix，最后线性连在后面。\n3. 【工作流优缺点考量】：Merge：优点是保留真实的历史开发轨迹，缺点是项目人多时历史线会乱成麻花。Rebase：优点是提供绝对干净的线性提交链，便于代码审计 and 回滚；缺点是修改了历史 Commit 的 Hash 值，如果在公共分支上 Rebase 会导致其他协作人拉取代码时发生灾难性的分叉冲突。",
      "deepDive": "金科玉律：**绝对不要在公共共享分支上执行 Rebase！**。因为 Rebase 改变了历史 Commit ID。如果别人的本地分支基于旧 Commit，当你强制推送变基后的公共分支，别人的代码在 Pull 时就会在本地重复合并，产生无数重复且冲突的历史垃圾。正确的团队协作规范是：在自己的本地 feature 分支开发完毕后，先 rebase 目标主分支（如 main/dev）清冲突，最后以 merge 或 squash merge 的形式合入主分支。\n\n【底层机制/工程流水线】：在现代 CI/CD 声明式流水线中，核心是“构建环境一致性与环境回滚”。我们采用基于 Docker 镜像的容器化构建环境。Git 的核心是通过 DAG 有向无环图组织提交记录，多分支冲突是由于在分叉节点后，多人在同一行代码上进行了不同的 Commit 提交。",
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
      "In Rebase 冲突解决时使用 git add 标识冲突解决，然后执行 git rebase --continue，千万不要习惯性地执行 git commit，否则会破坏变基补丁重放流程",
      "如果发布流水线在中途发生服务器断电导致打包中断，如何保证数据安全及环境回滚？防撕思路：1. 采用蓝绿发布或金丝雀灰度发布，决不在运行的机器上直接覆盖打包。2. 只有新容器完全运行通过健康检查后，才通过网关切换流量权重，一旦构建中断，旧的容器群依然完美运行。"
    ],
    "relatedIds": [
      "interview_004"
    ]
  },
  {
    "id": "interview_git_cicd_001_objects",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "git_cicd",
    "title": "Git 底层对象模型：Blob、Tree 与 Commit",
    "difficulty": 4,
    "frequency": 5,
    "question": "Git 的底层是如何存储文件与版本历史的？请详细阐述 Blob、Tree、Commit 三种核心对象的具体物理结构、寻址方式以及它们之间的引用依赖拓扑树图。",
    "answer": {
      "short": "Git 是一个基于键值寻址的内容寻址文件系统：`Blob` 存放纯文件内容；`Tree` 代表目录，记录文件名和子目录指向的 SHA-1 哈希；`Commit` 代表提交节点，存储作者、时间戳并指向根 Tree 对象及父 Commit 哈希；它们全部以经过 zlib 压缩的物理文件形式存放在 `.git/objects/` 中。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Git 底层对象模型：Blob、Tree 与 Commit】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. Git 底层存储三大原件剖析：\n   - **Blob 对象**：\n     - 存储的只是纯粹的文件二进制内容，**不包含文件名、文件路径、文件权限等元数据**。\n     - 寻址：对文件内容计算 SHA-1 值（如 `da39a3ee5e6b4b0d3255bfef95601890afd80709`），取前两位（da）作为子目录名，后38位作为文件名物理存储。\n   - **Tree 对象**：\n     - 代表目录（Directory）。\n     - 内部是一张表，记录了当前目录下的所有内容。每行包含：文件权限（Mode）、对象类型（blob 或 tree）、对应的 SHA-1 哈希值，以及**真实的文件名/目录名**。实现了文件名与内容的解耦。\n   - **Commit 对象**：\n     - 代表一次提交快照。\n     - 包含：根 Tree 对象的哈希指针（指向本次提交的根目录视图）、父 Commit 对象的哈希指针（0个或多个，多继承）、作者（Author）和提交者（Committer）的姓名邮箱时间戳，以及提交信息（Message）。\n2. 拓扑依赖树构建逻辑（三层逻辑链）：\n   - 每次提交时：\n     `Commit` -> 指向 -> 顶级 `Tree` -> 指向 -> 子 `Tree` (子目录) / `Blob` (文件内容)。\n   - 所有的物理寻址只依赖 SHA-1，内容决定哈希。如果两个文件内容完全一样，哪怕文件名不同，在 objects 目录下也**只有一份 Blob 物理文件**，极致压缩空间，设计非常优雅。",
      "structured": [
        "Blob 内容存储器：纯粹数据容器。仅存放文件物理二进制数据，文件名被剥离，内容相同则全局共享同一 Blob",
        "Tree 目录实体结构：记录当前目录拓扑。关联模式权限码、对象类型、SHA-1 映射及人类可读的文件命名",
        "Commit 快照节点：串联项目历史。绑定根 Tree 寻址图，并以 parent 字段自底向上勾勒出有向无环图 DAG 提交线",
        "zlib 物理压缩：所有对象使用 zlib Deflate 压缩落盘。以 SHA-1 首二字符分桶散列在 `.git/objects/` 目录下"
      ],
      "deepDive": "\n\n【底层机制/工程流水线】：在现代 CI/CD 声明式流水线中，核心是“构建环境一致性与环境回滚”。我们采用基于 Docker 镜像的容器化构建环境。Git 的核心是通过 DAG 有向无环图组织提交记录，多分支冲突是由于在分叉节点后，多人在同一行代码上进行了不同的 Commit 提交。"
    },
    "keyPoints": [
      "Git Blob 对象",
      "Git Tree 对象",
      "Git Commit 对象",
      "SHA-1 内容寻址",
      "zlib 物理压缩",
      "有向无环图 DAG"
    ],
    "traps": [
      "由于 Blob 只存内容不存路径，所以**Git 是绝对无法直接跟踪并提交一个空文件夹的**；要强行追踪空目录，开发人员必须在该目录下放置一个类似于 `.gitkeep` 的占位文件，促使其生成 Blob 并顺着生成 Tree 写入索引",
      "如果发布流水线在中途发生服务器断电导致打包中断，如何保证数据安全及环境回滚？防撕思路：1. 采用蓝绿发布或金丝雀灰度发布，决不在运行的机器上直接覆盖打包。2. 只有新容器完全运行通过健康检查后，才通过网关切换流量权重，一旦构建中断，旧的容器群依然完美运行。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_git_cicd_002_index",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "git_cicd",
    "title": "Git Staging Area 暂存区底层 `index` 文件机制",
    "difficulty": 4,
    "frequency": 4,
    "question": "Git 的“暂存区（Staging Area）”在物理层面上究竟是什么？它与工作区、版本库是如何进行状态比对的？请详述 `.git/index` 二进制文件的内部结构与工作原理。",
    "answer": {
      "short": "暂存区在物理上是 `.git/index` 这个高效的二进制索引文件；它保存了工作区所有文件的相对路径、时间戳、文件大小及对应的 Blob SHA-1 哈希值；当执行 `git add` 时，内容被写入 objects，且文件的元数据被写入 index；执行 `git commit` 时，Git 直接扫描该二进制索引文件生成 Tree 对象完成提交。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Git Staging Area 暂存区底层 `index` 文件机制】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 暂存区物理真相（.git/index）：\n   - 暂存区并不是一个存放副本文件内容的物理目录，而是一个**虚拟的二进制索引文件**。\n   - 它的核心目的：**充当工作区物理文件与版本库物理对象树（Git Directory）之间的缓冲区和决策层**。\n2. index 文件物理结构拆解（二进制精细化）：\n   - **Header（12字节）**：\n     - 包含：签名 `DIRC`（Directory Cache，4字节）、版本号（4字节）、索引条目数量（4字节）。\n   - **Index Entries（核心条目集合）**：\n     - 每个条目包含文件的元数据快照，用于高频快速比对工作区是否发生修改：\n       - ctime/mtime（创建/修改时间，精确到纳秒）。\n       - Dev / Inode（物理磁盘设备标识与节点编号）。\n       - Mode（文件权限类型，如 100644）。\n       - UID / GID（所属用户与组）。\n       - File Size（物理字节数）。\n       - **SHA-1 哈希值**：指向 objects 里的 blob 实体。\n       - **Flags（16位）**：包含 stage 状态（用于合并冲突冲突标记）。\n       - File Path（文件相对路径字符串）。\n   - **Extension Blocks**：如缓存的 Tree 节点，加速后续 commit 操作。\n   - **Checksum**：最后 20 字节存放 SHA-1 校验和。\n3. 三方比对与极其高效的状态核对：\n   - 当你运行 `git status` 时，Git **不需要遍历 objects 数据库**，而是极速读取 `index` 二进制文件：\n     - 1. **对比工作区与 index**：读取工作区文件属性（mtime、大小），与 `index` 条目里的元数据秒级比对。如果一致，说明文件未变；如果不一致，说明发生 Modification，列为 `Changes not staged for commit`。\n     - 2. **对比 index 与 HEAD commit**：对比 `index` 条目里的 SHA-1 与当前 HEAD 指向的 Commit Tree 里的 SHA-1。如果不一致，列为 `Changes to be committed`（已 add 未 commit）。\n   - `git add` 时：计算文件 SHA-1，写入 objects 库，更新 `index` 条元数据，标记进入 stage。\n   - `git commit` 时：直接读取 `index` 这个扁平的二进制文件，按照目录关系打包成一个个 Tree 对象写入 objects 库，生成 Commit，耗时极短，设计极为精密。",
      "structured": [
        "DIRC 缓存头：二进制文件以 DIRC 签名起步，规范版本号，并以 32 位整型记录被追踪条目物理数量",
        "元数据高速比对项：记录工作区文件的 Inode、文件大小及 mtime 精准纳秒时间戳，免去全量文件内容对比开销",
        "add 驱动落地：git add 执行内容读入 objects 并改写 index 校验 SHA-1，瞬间标记为 Stages 态",
        "commit 零拷贝重构：git commit 直接读取扁平的 index 索引构建 Tree 关系树，完成快照归档，避免了漫长的工作区二次扫描"
      ],
      "deepDive": "\n\n【底层机制/工程流水线】：在现代 CI/CD 声明式流水线中，核心是“构建环境一致性与环境回滚”。我们采用基于 Docker 镜像的容器化构建环境。Git 的核心是通过 DAG 有向无环图组织提交记录，多分支冲突是由于在分叉节点后，多人在同一行代码上进行了不同的 Commit 提交。"
    },
    "keyPoints": [
      "Git index 暂存区",
      "DIRC 签名",
      "元数据比对",
      "git add 暂存",
      "Inode / mtime",
      "对象构建优化"
    ],
    "traps": [
      "如果频繁在本地通过脚本大量删除/重建大量文件，会导致工作区 Inode 和 mtime 发生变化，使 `git status` 变得极慢，因为 Git 必须重新扫描每个文件的二进制内容计算哈希，可以通过 `git update-index --really-refresh` 重写同步缓存属性",
      "如果发布流水线在中途发生服务器断电导致打包中断，如何保证数据安全及环境回滚？防撕思路：1. 采用蓝绿发布或金丝雀灰度发布，决不在运行的机器上直接覆盖打包。2. 只有新容器完全运行通过健康检查后，才通过网关切换流量权重，一旦构建中断，旧的容器群依然完美运行。"
    ],
    "relatedIds": [
      "interview_git_cicd_001_objects"
    ]
  },
  {
    "id": "interview_git_cicd_003_threeway_merge",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "git_cicd",
    "title": "Git 三方合并算法与冲突标记底层机理",
    "difficulty": 4,
    "frequency": 4,
    "question": "在 Git 合并冲突中，什么是“三方合并（Three-way Merge）”？它是如何寻找最近共同祖先（LCA）的？当检测到冲突时，Git 是如何在文件底层打上 `<<<<<<< HEAD` 冲突标记并写入暂存区的？",
    "answer": {
      "short": "三方合并比对三个版本：合并目标分支、当前分支和它们在分支图中的最近公共祖先（LCA）；如果当前与目标相对于祖先都发生了变化且不一致，则判定为冲突；此时 Git 会在暂存区写入 Stage 1（公共祖先）、Stage 2（当前分支）、Stage 3（目标分支）三个物理条目，并在工作区文件打上冲突标记。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Git 三方合并算法与冲突标记底层机理】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 三方合并（Three-way Merge）物理含义：\n   - 如果只有两个版本（分支 A，分支 B），Git 无法分清“这行代码是分支 A 加上的，还是分支 B 删掉的”。\n   - **三方参与者**：分支 A (Ours)、分支 B (Theirs)，以及它们的**最近公共祖先 C (Base)**。\n   - 合并逻辑：\n     - 如果 A 相对于 C 没变，B 变了，则合并结果采用 B（自动合并）。\n     - 如果 B 相对于 C 没变，A 变了，则合并结果采用 A（自动合并）。\n     - 如果 A 和 B 都变了，且内容不同，说明发生了 **物理撞车冲突**，需要人工裁决。\n2. LCA（最近公共祖先）寻找过程：\n   - 调度器遍历分支有向无环图（DAG），利用图的拓扑排序和广度优先搜索寻找两个 Commit 节点的公共交点节点。\n   - 复杂场景下（如交叉合并，有两个 LCA），Git 默认会使用 `recursive` 合并策略：计算这两个 LCA 节点的一个“虚拟公共祖先（Virtual Common Ancestor）”作为 Base 进行三方合并，巧妙地防止了大量虚假冲突的产生。\n3. 冲突在暂存区（Index）中的物理呈现（Stage 1-2-3）：\n   - 当发生冲突，在 `.git/index` 文件中，同一条路径会同时写入 **3 个不同的 Stage 索引**：\n     - **Stage 1 (Base)**：最近公共祖先 C 对应该文件的 Blob SHA-1。\n     - **Stage 2 (Ours)**：分支 A 对应文件的 Blob SHA-1。\n     - **Stage 3 (Theirs)**：分支 B 对应文件的 Blob SHA-1。\n   - 只有这 3 个索引在 index 中被全部清空（通过 git add 解决冲突并写入 Stage 0 正常索引），合并状态才算完成。\n4. 冲突文件标记打入过程：\n   - Git 在工作区写入 `<<<<<<< HEAD` (Ours内容) `=======` (Theirs内容) `>>>>>>> branchName`，方便开发人员直接手动改写。",
      "structured": [
        "三方比对阵营：LCA公共祖先作为参照物，与 Ours、Theirs 两个派生分支进行三象限变更校对",
        "recursive 虚拟祖先：遇到多 LCA 交叉环状分支时，合并引擎自动重组两个 LCA 生成虚拟祖先节点，阻断误判",
        "index 三级插槽（Stage 1-2-3）：冲突文件在 index 里保留三份哈希条目，只有三者被覆盖为普通 Stage 0 时冲突才告解除",
        "标记注入：工作区直接追加 `<<<<<<<`、`=======`、`>>>>>>>` 分区特征标记，强制暴露物理碰撞位置"
      ],
      "deepDive": "\n\n【底层机制/工程流水线】：在现代 CI/CD 声明式流水线中，核心是“构建环境一致性与环境回滚”。我们采用基于 Docker 镜像的容器化构建环境。Git 的核心是通过 DAG 有向无环图组织提交记录，多分支冲突是由于在分叉节点后，多人在同一行代码上进行了不同的 Commit 提交。"
    },
    "keyPoints": [
      "三方合并 Three-way",
      "最近公共祖先 LCA",
      "recursive 策略",
      "Stage 1-2-3 索引",
      "冲突标识符",
      "有向无环图 DAG"
    ],
    "traps": [
      "如果发生了冲突，千万不要直接用 `git commit -a` 提交，这会跳过对 Stage 1-2-3 状态的安全检查，强行将带冲突标志的物理文件直接打包成 Blob 存入版本库，破坏代码结构，必须先 `git add` 清退暂存槽",
      "如果发布流水线在中途发生服务器断电导致打包中断，如何保证数据安全及环境回滚？防撕思路：1. 采用蓝绿发布或金丝雀灰度发布，决不在运行的机器上直接覆盖打包。2. 只有新容器完全运行通过健康检查后，才通过网关切换流量权重，一旦构建中断，旧的容器群依然完美运行。"
    ],
    "relatedIds": [
      "interview_041",
      "interview_git_cicd_002_index"
    ]
  },
  {
    "id": "interview_git_cicd_004_gc",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "infra",
    "topic": "git_cicd",
    "title": "Git 垃圾回收与 `.git/objects/pack` 文件紧凑化",
    "difficulty": 4,
    "frequency": 3,
    "question": "Git 长期开发后 objects 目录会极度臃肿。请详述 `git gc` 的工作原理。什么是松散对象（Loose Objects）与打包对象（Packed Objects）？Delta 压缩算法在此过程中起到了什么作用？",
    "answer": {
      "short": "`git gc` 会遍历整个 DAG 对象图，将零散的单个小对象文件（松散对象）打包并合并写入一个紧凑的 `.pack` 文件中，并通过 `.idx` 文件提供索引；Delta 压缩算法会对同名文件的不同历史版本进行差额压缩只存 Base 和修改 Diff，大幅榨干磁盘存储开销，同时清理并删除 Reflog 之外的孤儿无用 Commit 物理文件。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【Git 垃圾回收与 `.git/objects/pack` 文件紧凑化】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 松散对象与打包对象物理实质：\n   - **松散对象（Loose Objects）**：\n     - 当我们频繁修改文件并 `git add` 时，每次操作都会为当前文件内容生成一个专属的 zlib 压缩 Blob 对象，独立存在 `.git/objects/XX/XXXX...` 路径下。\n     - 痛点：文件极小但数量繁多，严重浪费操作系统的文件系统 Inode 和读写性能。\n   - **打包对象（Packed Objects）**：\n     - 运行 `git gc` 后，Git 会将这些松散文件合并存入单个巨大的 `.git/objects/pack/pack-XXXX.pack` 二进制打包文件中，并生成一个同名的 `.idx` 索引文件支持极速随机读取。\n2. Delta 压缩算法的魔法表现（只存差额）：\n   - 假设一个 10MB 的源代码文件，我们在版本历史中修改了 100 次，每次只改了 1 行。\n   - 物理浪费：松散状态下会占用 $100 \\times 10MB = 1GB$ 的磁盘空间。\n   - **Delta 压缩处理**：Git 打包时，会把这些同名或相似名文件的历史版本全部堆在一起进行相似度匹配。\n     - 它会保留**最新/最完整**的那个版本（为了读取速度），而将其历史版本压缩为相对于最新版的**差额数据（Delta / Diff）**。\n     - 100 次的历史差额可能只有 200KB 字节。整体磁盘占用瞬间从 1GB 收缩到 10.2MB。空间压缩比极高。\n3. 孤儿对象的物理清理与安全退场：\n   - 那些被 `git reset --hard` 丢弃、已经没有任何 branch/tag 或 reflog 能触达到的 Commitment 以及关联 Blob，被称为 **Dangling Objects（孤儿悬空对象）**。\n   - `git gc` 会清算这些孤儿，默认会将超过 2 周（由 `gc.pruneExpire` 决定）的孤儿对象彻底物理删除，释放磁盘物理盘空间空间。",
      "structured": [
        "Loose 松散大军：每次 add 产生的散落小文件，大量空耗 Inode 和 OS 文件寻道效率，急需收拢",
        "Pack 打包收纳（pack/idx）：将成千上万松散对象重组注入单一大 Pack 文件，配以 `.idx` 精准偏移量索引提供秒级随机读写",
        "Delta 差额降维：对同名文件的各个历史快照采用差额编码。最新版存原样，老版存 Diff 增量，降低版本库物理体积",
        "Prune 孤儿清算：彻底切断无 Branch/Tag/Reflog 挂接的死悬空 Commit 链条，回收过期的冗余物理数据"
      ],
      "deepDive": "\n\n【底层机制/工程流水线】：在现代 CI/CD 声明式流水线中，核心是“构建环境一致性与环境回滚”。我们采用基于 Docker 镜像的容器化构建环境。Git 的核心是通过 DAG 有向无环图组织提交记录，多分支冲突是由于在分叉节点后，多人在同一行代码上进行了不同的 Commit 提交。"
    },
    "keyPoints": [
      "git gc",
      "Loose Objects 松散对象",
      "Packed Objects 打包对象",
      "Delta 差额压缩",
      "Dangling Objects 悬空",
      "Inode 回收"
    ],
    "traps": [
      "由于 `git gc` 需要在内存中计算大量文件的 Delta 差额相似度，在大仓库（如带有几十万 Commit 和大体积资产的库）上执行时，会瞬间把 CPU 和内存占满到 100% 甚至触发 OOM 崩溃，需要配置 `pack.windowMemory` 限制内存配额",
      "如果发布流水线在中途发生服务器断电导致打包中断，如何保证数据安全及环境回滚？防撕思路：1. 采用蓝绿发布或金丝雀灰度发布，决不在运行的机器上直接覆盖打包。2. 只有新容器完全运行通过健康检查后，才通过网关切换流量权重，一旦构建中断，旧的容器群依然完美运行。"
    ],
    "relatedIds": [
      "interview_git_cicd_001_objects",
      "interview_git_cicd_002_index"
    ]
  }
];

module.exports = questions;
