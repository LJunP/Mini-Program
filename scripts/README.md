# 项目工具脚本

本目录存放项目开发过程中使用的各类一次性/运维脚本。这些脚本已完成其历史使命，保留作为参考和可复用工具。

---

## 目录结构

```text
scripts/
├── README.md                          # 本文件
├── data-generation/                   # 数据生成与打磨脚本
│   ├── build-algorithms.js            # 生成算法专题面试题
│   ├── build-cache.js                 # 生成缓存专题面试题
│   ├── build-cpp.js                   # 生成 C++ 专题面试题
│   ├── build-database.js              # 生成数据库专题面试题
│   ├── build-docker_k8s.js            # 生成 Docker/K8s 专题面试题
│   ├── build-git_cicd.js              # 生成 Git/CI/CD 专题面试题
│   ├── build-golang.js                # 生成 Go 语言专题面试题
│   ├── build-html-css.js              # 生成 HTML/CSS 专题面试题
│   ├── build-java.js                  # 生成 Java 专题面试题
│   ├── build-js.js                    # 生成 JavaScript 专题面试题
│   ├── build-network.js               # 生成网络专题面试题
│   ├── build-os.js                    # 生成操作系统专题面试题
│   ├── build-performance.js           # 生成性能优化专题面试题
│   ├── build-python.js                # 生成 Python 专题面试题
│   ├── build-react.js                 # 生成 React 专题面试题
│   ├── build-security.js              # 生成安全专题面试题
│   ├── build-system_design.js         # 生成系统设计专题面试题
│   ├── build-vue.js                   # 生成 Vue 专题面试题
│   ├── fix-database-structured.js     # 修复数据库题库结构化字段
│   ├── generate-study-data.js         # 生成教程与科普长文（18×18 黄金矩阵）
│   ├── polish-interview-db.js         # 面试题金牌干货化打磨引擎
│   └── polish-leisure-db.js           # 休闲内容数据库打磨
├── ops/                               # 运维与发布脚本
│   ├── apply-missing-images.js        # 批量补充缺失图片到 assets
│   ├── compress-images.js             # macOS sips 引擎批量压缩大图
│   ├── encrypt-study-db.js            # 题库数据 RC4 加密
│   ├── prepare-release.js             # 上线前瘦身：移出大图和完整题库
│   └── restore-dev.js                 # 开发环境还原：恢复大图和完整题库
└── testing/                           # 测试与质检脚本
    ├── scan-progress.js               # 扫描项目代码规模与进度
    ├── test-database-content-all.js   # 全量面试题自动化质检
    ├── test-leisure.js                # 休闲内容数据质检
    └── test-study-content.js          # 学习内容数据质检
```

---

## 使用说明

### 数据生成脚本 (`data-generation/`)
- `build-*.js` 系列：18 个脚本分别生成各技术专题的面试题数据，输出到 `miniapp/data/study/topics/` 目录。
- `generate-study-data.js`：生成教程和知识科普文章。
- `polish-*.js`：对已生成的数据进行内容质量提升和结构化字段补全。
- `fix-database-structured.js`：修复面试题答案的结构化字段格式。

**运行方式**：
```bash
cd /Users/lijunpeng/Desktop/open_source_project/Mini-Program
node scripts/data-generation/build-algorithms.js
```

### 运维脚本 (`ops/`)
- `prepare-release.js`：提审前执行，将大体积图片和完整题库移至 `data/cdn_backup/`，精简小程序包体积。
- `restore-dev.js`：开发时执行，从 `data/cdn_backup/` 恢复完整资源到 miniapp 目录。
- `compress-images.js`：使用 macOS `sips` 命令批量压缩图片，并更新 data-store 中的图片路径。
- `apply-missing-images.js`：从源图片文件夹批量补充缺失的图片资源。
- `encrypt-study-db.js`：将 `data/study_data.json` 加密为 `data/study_data.enc`。

### 测试脚本 (`testing/`)
- `scan-progress.js`：扫描整个项目，统计文件数量、代码行数和资源体积。
- `test-database-content-all.js`：全量检查面试题的 ID 唯一性、字段完整性和答案结构。
- `test-leisure.js` / `test-study-content.js`：分别检查休闲内容和学习内容的数据质量。

---

## 注意事项

1. 脚本以自身位置定位项目根目录，重命名或移动整个项目后无需修改脚本路径。
2. `prepare-release.js` 和 `restore-dev.js` 是一对互逆操作，分别用于提审瘦身和开发还原。
3. 数据生成脚本是一次性使用的，生成的数据已持久化到 `miniapp/data/study/` 和 `data/study_data.json` 中。
