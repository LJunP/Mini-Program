// tutorials.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云数据库动态下发）

const items = [
  {
    "id": "tutorial_001",
    "mode": "study",
    "domain": "tutorial",
    "title": "Docker 镜像体积极致瘦身黄金法则",
    "category": "tooling",
    "difficulty": 2,
    "duration": 15,
    "tags": [
      "Docker",
      "容器化",
      "性能调优"
    ],
    "summary": "解决生产环境镜像臃肿问题，从 Multi-stage 多阶段构建、Alpine 基础镜像以及镜像层数合并，实现从 1GB 到 30MB 的极致瘦身。",
    "sections": [
      {
        "type": "heading",
        "text": "一、为什么 Docker 镜像会如此臃肿？"
      },
      {
        "type": "paragraph",
        "text": "在没有经过优化的开发流程中，我们往往直接使用 `node:latest` 或 `ubuntu` 等完整版系统作为基础镜像。这些镜像中包含了大量与我们线上运行无关的工具包（如 Python、GCC 编译链、各类诊断工具等）。加上构建过程中的编译缓存（npm cache, yarn cache）以及非最小化声明，会导致镜像层体积几何式暴增，拖慢 CI/CD 部署流水线并浪费大量云端带宽与存储。"
      },
      {
        "type": "heading",
        "text": "二、三条核心瘦身黄金法则"
      },
      {
        "type": "list",
        "items": [
          "使用 Alpine / distroless 作为最小化生产基础镜像，舍弃多余 Linux 指令集。",
          "采用 Multi-stage (多阶段构建)，在编译阶段拉取开发依赖进行构建，在运行阶段仅拷贝编译后的二进制/静态文件。",
          "合并 RUN 指令，使用 && 连接符，且在单层命令结束前执行清理缓存操作，保证无垃圾文件残留。"
        ]
      },
      {
        "type": "heading",
        "text": "三、多阶段构建（Multi-stage Build）Dockerfile 示范"
      },
      {
        "type": "code",
        "language": "dockerfile",
        "text": "# 阶段一：构建编译环境\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production && npm cache clean --force\nCOPY . .\nRUN npm run build\n\n# 阶段二：生产运行环境\nFROM node:18-alpine\nWORKDIR /app\n# 仅从上一阶段复制产物，不携带任何源文件与构建缓存\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nENV NODE_ENV=production\nEXPOSE 3000\nCMD [\"node\", \"dist/main.js\"]"
      }
    ]
  },
  {
    "id": "tutorial_002",
    "mode": "study",
    "domain": "tutorial",
    "title": "Git 核心原理：理解暂存区、HEAD 指针与高级冲突解决",
    "category": "tooling",
    "difficulty": 2,
    "duration": 12,
    "tags": [
      "Git",
      "版本控制",
      "开发工具"
    ],
    "summary": "揭秘 Git 的底层三路合并算法，打通暂存区、工作区与版本库物理屏障，并彻底理清 git rebase 与 git merge 在团队协作中的技术取舍。",
    "sections": [
      {
        "type": "heading",
        "text": "一、Git 底层是如何存储文件状态的？"
      },
      {
        "type": "paragraph",
        "text": "不同于 SVN 记录文件差异，Git 的底层是一个内容寻址的键值数据库。每当我们执行 `git add` 时，Git 会计算文件的 SHA-1 哈希值，将文件内容压缩并写入 `.git/objects` 目录，这就是 blob 对象。而暂存区（Index）实际上是一个包含文件名和 blob 哈希映射表的二进制文件。HEAD 指针则是指向当前所在分支（.git/refs/heads/）的引用，其本质是一次 Commit 提交对象的哈希。"
      },
      {
        "type": "heading",
        "text": "二、高级冲突解决核心流程"
      },
      {
        "type": "list",
        "items": [
          "使用 git diff --cached 查看已暂存内容与版本库的差异，防止带误修改提交。",
          "在遭遇多分支合并冲突时，Git 使用三路合并（3-Way Merge）算法，寻找两条分支的公共祖先节点（Base），并比对祖先、我的（Mine）和他们的（Theirs）三者的差异。",
          "多人公共分支禁用 git push -f 强推，应采用 git pull --rebase 保证提交历史为一条清晰的单向线性轨迹。"
        ]
      },
      {
        "type": "heading",
        "text": "三、三路合并算法冲突标识与解决实操"
      },
      {
        "type": "code",
        "language": "text",
        "text": "<<<<<<< HEAD\nconst domain = \"https://api.fengyalife.com\"; // 您的当前修改 (HEAD)\n=======\nconst domain = \"https://cdn.fengyalife.com\"; // 远程分支修改 (Theirs)\n>>>>>>> origin/main\n\n# 冲突解决策略：\n# 1. 沟通确认修改逻辑。\n# 2. 手动清理冲突标记符 <<<<<<<, =======, >>>>>>>。\n# 3. 运行 git add 将标记解决后的冲突加入暂存区。"
      }
    ]
  },
  {
    "id": "tutorial_003",
    "mode": "study",
    "domain": "tutorial",
    "title": "Webpack 5 性能调优：大型单页应用持久化缓存与 Tree Shaking",
    "category": "tooling",
    "difficulty": 3,
    "duration": 18,
    "tags": [
      "Webpack",
      "前端工程化",
      "性能治理"
    ],
    "summary": "针对大型前端项目构建过慢、打包体积庞大等痛点，落地 Webpack 5 物理持久化文件缓存（Persistent Cache）与基于 ESM 静态分析的 Tree Shaking。",
    "sections": [
      {
        "type": "heading",
        "text": "一、持久化缓存（Persistent Cache）的颠覆"
      },
      {
        "type": "paragraph",
        "text": "传统的 Webpack 构建在二次编译时由于缺乏可靠的物理存储，大多依赖内存缓存（Memory Cache），在重新冷启动时速度极慢。Webpack 5 引入了物理文件系统缓存，支持将编译后的中间模块、依赖 AST 信息序列化存储到磁盘中。再次构建时直接检查文件指纹并从本地加载，能将中大型项目的二次构建时间从 60 秒缩短至 2 秒以内。"
      },
      {
        "type": "heading",
        "text": "二、深度 Tree Shaking 的核心前提"
      },
      {
        "type": "list",
        "items": [
          "必须使用 ES6 Modules (import / export) 进行模块引入，CommonJS (require) 的动态加载机制无法在编译期静态分析。",
          "在 package.json 中配置 \"sideEffects\": false，明确告知 Webpack 模块无副作用，可安全裁切。",
          "合理使用 webpack-bundle-analyzer 插件监控打包，剔除 Lodash 等重型依赖，改用 lodash-es实现精准摇树。"
        ]
      },
      {
        "type": "heading",
        "text": "三、Webpack 5 高级优化配置示例"
      },
      {
        "type": "code",
        "language": "javascript",
        "text": "module.exports = {\n  cache: {\n    type: 'filesystem',\n    buildDependencies: {\n      config: [__filename]\n    }\n  },\n  optimization: {\n    usedExports: true,\n    minimize: true,\n    splitChunks: {\n      chunks: 'all',\n      cacheGroups: {\n        vendor: {\n          test: /node_modules/,\n          name: 'vendors',\n          priority: 10\n        }\n      }\n    }\n  }\n};"
      }
    ]
  }
];

module.exports = items;
