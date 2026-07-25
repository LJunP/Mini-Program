# 妙不可园小程序当前进度与审计报告

更新时间：2026年7月25日（当前运行验收同步版）

---

## 1. 总体状态

当前小程序已在微信开发者工具中完全跑通。默认使用本地 Mock/内联数据运行，解耦了对后端的依赖。

核心状态与成果：
- **休闲模式**：已全面覆盖香、音、茶、影、养、游六雅板块，实现高水准的生活美学界面与数据关联。
- **学习模式**：已上线教程、知识、面试、复习四大模块。
- **数据解耦**：服务层已完成 mock/API 切换边界重构，页面不直接读 mock。
- **面试题库**：已扩展至 18 个技术栈专题文件。本地精简版 **90 道**（每专题5题），完整数据集 **901 道**（存放在 `data/study_data.json` 供云端部署）。

---

## 2. 真实代码规模 (实测值)

经过对项目文件的深度统计，项目整体代码与资源规模如下：

| 文件类型 | 文件数量 | 代码总行数 | 备注说明 |
|---|---:|---:|---|
| **JavaScript (.js)** | 89 | 44,668 | 含逻辑代码 9,807 行，以及 `data-store.js` 等内联数据 34,861 行 |
| **WXML (.wxml)** | 35 | 2,992 | 结构文件 |
| **WXSS (.wxss)** | 36 | 5,771 | 样式文件（含东方雅色全局主题） |
| **JSON (.json)** | 36 | ~500 | 页面与分包配置文件（不含 project*.json） |
| **图片资源 (.jpg/.png)** | 49 | - | 合计大小约为 **60 MB** |

- **项目总体积**：约 **63 MB** (主要为本地多媒体与背景图片资源)。

---

## 3. 架构设计与数据流向

### 3.1 休闲 & 学习双模式架构
系统采用“双模式”动态切换机制，通过全局 `store/index.js` 统一管理状态：
- **休闲模式 (Leisure)**：展示六雅宫格入口、每日风雅推荐、综合内容流，侧重美学生活。
- **学习模式 (Study)**：展示待掌握/已掌握统计、今日复习卡片、技术栈宫格，侧重知识积累。

### 3.2 数据流向分层设计
为方便未来快速接入真实服务端 API，项目在服务层与数据源间建立了严格的切换边界：
```text
[视图层 Pages]
      │
      ▼
[服务层 services/*] (例如 tea.js, travel.js)
      │
      ▼
[网络与请求层 utils/request.js]
      │
      ├── (当 enableMock == false) ──► [真实 API 接口]
      │
      └── (当 enableMock == true)  ──► [Mock 适配层 utils/mock.js] ──► [内联数据源 utils/data-store.js]
```

---

## 4. 页面完成度与路由表

### 4.1 主包页面 (21 个)
| 页面路径 | 完成状态 | 说明 |
|---|---|---|
| `pages/index/index` | ✅ 已完成 | 双模式动态首页、宫格导航、每日推荐 |
| `pages/tea/tea` | ✅ 已完成 | 茶库中心，支持分类、排序、搜索与筛选 |
| `pages/travel/travel` | ✅ 已完成 | 行旅专题列表 |
| `pages/wellness/wellness` | ✅ 已完成 | 养生内容列表 |
| `pages/incense/incense` | ✅ 已完成 | 香道内容列表 |
| `pages/music/music` | ✅ 已完成 | 音乐内容列表 |
| `pages/film/film` | ✅ 已完成 | 电影内容列表 |
| `pages/bookmark/bookmark` | ✅ 已完成 | 跨板块统一收藏中心（风雅书签） |
| `pages/profile/profile` | ✅ 已完成 | 个人中心、风雅画像展示、足迹 |
| `pages/study/index` | ✅ 已完成 | 学习首页与模块入口 |
| `pages/study/tutorials` | ✅ 已完成 | 学习教程列表 |
| `pages/study/knowledge` | ✅ 已完成 | 知识点列表 |
| `pages/study/interview` | ✅ 已完成 | 面试题库分类列表 |
| `pages/study/review` | ✅ 已完成 | 本地复习队列与卡片展示 |
| `pages/edit-profile/edit-profile` | ✅ 已完成 | 个人资料编辑 |
| `pages/preferences/preferences` | ✅ 已完成 | 用户风雅偏好配置 |
| `pages/history/history` | ✅ 已完成 | 本地浏览历史记录 |
| `pages/notification-settings/notification-settings` | ✅ 已完成 | 消息通知设置 |
| `pages/subscribe/subscribe` | ✅ 已完成 | 消息订阅管理页面 |
| `pages/privacy/privacy` | ✅ 已完成 | 静态隐私政策页 |
| `pages/agreement/agreement` | ✅ 已完成 | 静态用户协议页 |

### 4.2 分包页面 (7 个)
分包根路径：`subpackages/`
| 页面路径 | 完成状态 | 说明 |
|---|---|---|
| `detail/tea-detail/tea-detail` | ✅ 已完成 | 茶品口感雷达图(Canvas)、冲泡指南、关联行旅/养生 |
| `detail/travel-detail/travel-detail` | ✅ 已完成 | 行旅人文随笔、路线步骤、关联五雅实体 |
| `detail/content-detail/content-detail` | ✅ 已完成 | 养生/香/音/影的通用精美内容阅读器 |
| `detail/study-detail/study-detail` | ✅ 已完成 | 教程与知识科普阅读器 |
| `detail/question-detail/question-detail` | ✅ 已完成 | 面试题答题、解析展示、熟练度标记 |
| `detail/compare/compare` | ✅ 已完成 | 茶品两款并列对比，高亮差异 |
| `search/pages/search/search` | ✅ 已完成 | 全局搜索（拼音、模糊、加权评分及历史） |

---

## 5. 数据源完成度

目前本地内联数据源包含 **116 条** 风雅数据以及本地精简版 **90 条** 面试题数据（完整 901 道面试题保存在 `data/study_data.json` 中供云端部署）：

| 板块/数据域 | 本地数量 | 完整数据集数量 | 数据格式 / 路径 |
|---|---:|---:|---|
| **茶品 (tea)** | 60 款 | 60 款 | `utils/data-store.js` 中的 `teasData` |
| **行旅 (travel)** | 6 专线 | 6 专线 | `utils/data-store.js` 中的 `travelsData` |
| **养生 (wellness)** | 14 篇 | 14 篇 | `utils/data-store.js` 中的 `wellnessData` |
| **香道 (incense)** | 12 篇 | 12 篇 | `utils/data-store.js` 中的 `incenseData` |
| **音乐 (music)** | 12 篇 | 12 篇 | `utils/data-store.js` 中的 `musicData` |
| **电影 (film)** | 12 篇 | 12 篇 | `utils/data-store.js` 中的 `filmData` |
| **教程 (tutorials)** | 3 篇 | 18 篇 | `data/study/tutorials.js`（精简版）/ `data/study_data.json`（完整版） |
| **知识 (knowledge)** | 3 篇 | 18 篇 | `data/study/knowledge.js`（精简版）/ `data/study_data.json`（完整版） |
| **面试专题 (topics)** | 18 类 | 18 类 | `data/study/topics/` (共 18 个 JS 文件) |
| **面试题 (questions)** | 90 道 | 901 道 | 精简版每专题5题 / 完整版每专题50题+ |

### 5.1 面试题库细化分布

**本地精简版**（每专题5题，共90道），**完整数据集**（每专题50题+，共901道，保存在 `data/study_data.json`）：
- **前端方向**：JavaScript (50题) / React (50题) / Vue (50题) / HTML与CSS (50题) / 性能优化 (50题)
- **后端方向**：Go语言 (50题) / Java (50题) / Python (51题) / C++ (50题) / 数据库 (50题) / 缓存 (50题)
- **计算机基础**：计算机网络 (50题) / 操作系统 (50题) / 数据结构与算法 (50题)
- **基础设施**：工程化与CI/CD (50题) / 云原生与容器化 (50题)
- **通用方向**：系统设计 (50题) / 安全与加密 (50题)

---

## 6. 服务层与工具库状态

| 模块 | 实现状态 | 职责与能力 |
|---|---|---|
| `services/home.js` | ✅ 已完成 | 首页每日推荐、内容流及学习首页聚合服务 |
| `services/tea.js` | ✅ 已完成 | 提供茶库列表、口感雷达元数据、点评提交及推荐逻辑 |
| `services/travel.js` | ✅ 已完成 | 提供行旅专题与五雅实体跨域引用的解析机制 |
| `services/content.js` | ✅ 已完成 | 通用内容卡片数据分发服务 |
| `services/search.js` | ✅ 已完成 | 调用搜索引擎提供跨板块联合查询 |
| `services/collection.js` | ✅ 已完成 | 全局收藏状态维护、域元信息（颜色/板块别名）注册表 |
| `services/history.js` | ✅ 已完成 | 本地浏览足迹记录与数据读取 |
| `utils/search-engine.js` | ✅ 已完成 | 支持**模糊匹配、首字母拼音、多字段加权排序**的高级搜索引擎 |
| `utils/tracker.js` | ✅ 已完成 | 埋点 SDK（3 秒批量上报、10 秒脏队列落盘、云端身份字段白名单） |
| `utils/persona.js` | ✅ 已完成 | 根据用户浏览与收藏数据实时计算**六维偏好与人格**的算法模块 |
| `utils/poster.js` | ✅ 已完成 | 用于生成茶品精美分享海报的 Canvas 模块 |

---

## 7. 待完善功能清单与优先级 (待对接/待实现)

### ✅ 2026-07-25 已完成的上线验收

- **TTS 真实链路**：腾讯云基础/精品音色资源包已生效；微信开发者工具中已完成真实合成、播放和离页自动停止验证。
- **题库列表性能**：901 道完整题目不再进入渲染层 `data`，首屏只传 20 条轻量卡片数据；原约 1.8 MB `setData` 警告已消失。
- **云图片长期运行**：临时地址缓存改为 5 分钟主动刷新，避免旧签名被永久复用并产生 403。

### 🔴 核心必选功能 (P0 - 上线前必须完成)
1. **跨账号隐私验收**：投稿已改为默认私密，云函数也只允许本人读取私密内容；仍需用第二个真实账号验证私密详情不可见。
2. **公众平台隐私声明**：按实际上线数据流完成微信公众平台的用户隐私保护指引，提交前逐项核对。
3. **真实音乐流**：产品图片已全部迁移至 CloudBase 私有存储，最终临时预览包 1176 KB；音乐模块仍缺承诺的真实可播放音频。

### 🟡 体验与质量增强 (P1 - 中优先级)
5. **扩大自动化覆盖**：现有内容校验与 7 组 P0 回归已通过，继续补充页面级与云函数集成测试。
6. **CI/CD 流水线构建**：结合微信开发者工具 CLI，实现代码上传、静态语法检测及自动提审流。
7. **个性化推荐引擎**：由 `services/home.js` 基于 `persona.js` 的计算结果，向用户推送高度匹配其风雅人格的内容。
8. **微交互动效补充**：在首页切换、雷达图渲染、行旅路线切换上补全微动画，提升东方美学的灵动感。

### 🟢 长期维护 (P2 - 低优先级)
9. **内容管理后台 (CMS)**：提供编辑和运营人员可视化的内容录入系统，避免数据硬编码于前端。
10. **无障碍设计 (Accessibility)**：优化页面阅读体验，支持屏幕阅读器和色盲模式色彩适配。
