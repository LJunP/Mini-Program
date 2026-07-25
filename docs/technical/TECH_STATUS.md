# 妙不可园小程序 · 技术状态与方案对齐报告

本文件对照《风雅生活小程序产品方案-六雅升级版.md》、《API接口文档.md》与《数据库设计文档.md》（均位于 `docs/` 目录下），对当前小程序技术实现的对齐状态进行细化核实。

---

## 1. 产品方案 vs 实际代码对齐状态

| 产品方案章节 | 规划内容 | 代码实现状态 | 对齐详情与物理位置 |
|---|---|---|---|
| **一、产品定位与价值观** | 明确核心理念、目标用户群 | ✅ 100% | 在首页和个人资料等文案及功能深度对齐 |
| **二、六雅板块总览** | 香、音、茶、影、养、游六雅设计 | ✅ 100% | 全板块已接入，[PROJECT_PROGRESS.md](miniapp/PROJECT_PROGRESS.md) |
| **三、游板块串联机制** | 目的地专题、跨板块双向引用 | ✅ 100% | `travel-detail` 页面底部及 `tea-detail` 的跨板块引用逻辑 |
| **四、养板块设计** | 顺时养生、日常习惯、风雅养生 | ✅ 100% | `wellness` 页面与通用内容详情器对接 |
| **五、游板块设计** | 6 个专题随笔与数据模型对齐 | ✅ 100% | `travel` 服务层和内联 6 条精美目的地数据 |
| **六、统一内容模型** | `primaryDomain` 与 `linkedDomains` | ✅ 100% | [data-store.js](miniapp/utils/data-store.js) 与 [mock.js](miniapp/utils/mock.js) 中实体字段一致 |
| **七、用户风雅画像** | 六维偏好、风雅人格、足迹统计 | ✅ 100% | [persona.js](miniapp/utils/persona.js) 提供实时计算与雷达图渲染 |
| **八、MVP 范围调整** | MVP 阶段包含“茶+游+养” | ✅ 100% | 不仅完成了 MVP，还提前上线了香、音、影以及学习模式 |
| **九、分阶段上线计划** | 阶段一至阶段四商业变现 | ⚠️ 30% | 处于 **阶段一** MVP 本地跑通状态，尚未进入后端联调 |
| **十、内容生产策略** | 作者生态、内容调性要求 | ✅ 100% | 本地内联 116 条数据完全符合“反焦虑、可执行”调性 |
| **十一、视觉与调性升级**| 配色体系、tabBar 设计方案 B | ✅ 100% | [app.wxss](miniapp/app.wxss) 六雅色值、首页宫格导航完全吻合 |

---

## 2. API 接口对接状态 (对照《API 接口文档.md》)

目前由于没有真实后端，接口层采用 Mock 伪拦截。状态如下：

| API 模块 | 接口列表 | 对齐与模拟状态 | 下一步对接方向 |
|---|---|---|---|
| **鉴权模块 (§二)** | `/auth/login`, `/auth/refresh` | ⚠️ 仅本地生成 mock_token | 改为请求后端接口，拉起微信授权 |
| **内容模块 (§三)** | `/contents/list`, `/contents/:no` | ✅ Mock 提供全量内容与分类筛选 | 换为服务器数据库查询分页接口 |
| **茶品模块 (§四)** | `/teas/list`, `/teas/:no` | ✅ Mock 完美支持 60 款茶的加权检索 | 换为数据库实体表读取 |
| **目的地模块 (§五)** | `/travels/list`, `/travels/:no`| ✅ Mock 提供 6 款人文路线关联 | 换为目的地实体表读取 |
| **收藏模块 (§七)** | `/collections/add`, `/collections/remove` | ⚠️ 状态写入本地 Storage 模拟 | 对接后端 collection 表的 CRUD 接口 |
| **用户模块 (§八)** | `/user/profile`, `/user/update` | ⚠️ 资料保存在本地 Storage 缓存 | 改为向服务端写入用户表 |
| **埋点模块 (§九)** | `/events/report` | ⚠️ 攒够 10 条或 3 秒本地 console 输出 | 接入真实批量分析上报 API |
| **搜索模块 (§十)** | `/search/global` | ✅ 本地分词加权检索效果极佳 | 可保留本地算力，或改用 Elasticsearch |

---

## 3. 数据库设计对齐状态 (对照《数据库设计文档.md》)

| 表名 | 设计用途 | 小程序本地模拟映射 (data-store.js / Storage) | 对齐详情 |
|---|---|---|---|
| `users` | 注册用户 | 本地缓存 `user_info` 条目 | 结构与 DB 一致 |
| `authors` | 内容创作者 | 本地硬编码于各 content.author 字段 | 结构与 DB 一致 |
| `contents` | 统一内容表 | 本地 `dataStore.wellnessData` 等 56 条记录 | 包含 `primary_domain`, `linked_domains` |
| `content_links`| 跨域关联表 | 通过 JS 在加载时进行 `linkedDomains` 动态链表解析 | 本地动态还原关联，性能优异 |
| `tea_items` | 茶品实体 | `teasData` 60 款，含 tasteProfile 五维属性 | 物理映射一致 |
| `destinations` | 行旅目的地 | `travelsData` 6 款，含 route 数组 | 物理映射一致 |
| `reviews` | 用户点评 | `reviews` 数组，存放在本地缓存中 | 支持添加和查询 |
| `collections` | 收藏关联 | 缓存中 group 按域存放 | 支持跨板块单键收藏 |
| `user_events` | 行为埋点 | `fengya_events_buffer` 缓存块 | 与埋点 Schema 设计一致 |
| `user_profiles`| 用户画像 | 动态调用 `persona.js` 现场计算 | 无需 DB 存储，实时性更佳 |

---

## 4. 面试题库数据状态

完整题库共计 **901 道**（18 个专题，每专题 50 道题以上），存储在 `data/study_data.json` 中供云端部署。当前小程序本地精简版每专题仅保留 5 题（共 **90 道**）以控制包体积。具体审计结果如下：

* **数据完整性**：所有 901 道题均包含 `id`、`mode: 'study'`、`domain: 'interview'`、`topic`、`track`、`title`、`question`、`answer` (含有 short, thinkingProcess, structured 属性)、`keyPoints` 属性。
* **唯一性**：已无重复 `id`，校验通过。
* **空数据清理**：无任何 placeholder、"TODO" 等无效占位内容，均含有真实的测试或演示问答。
* **本地精简版**：`miniapp/data/study/topics/` 中每个专题仅保留 5 道题（共 90 道），完整 901 道题保存在 `data/study_data.json` 和 `data/cdn_backup/study/topics_original/` 中。

---

## 5. 当前已知技术债与性能瓶颈

1. **多媒体包体积过大 (包大小 63MB)**
   * *问题*：小程序限制本地主包/分包大小不得超过 2MB/20MB。当前的 60MB 静态资源会导致无法真机上传和提审。
   * *解决办法*：需将 `miniapp/assets/images/` 与 `audio/` 整体托管至腾讯云/七牛云等外部 CDN，小程序代码只保留小体积的图标。提审时使用 `scripts/ops/prepare-release.js` 脚本移出大图至 `data/cdn_backup/`。
2. **UGC 与本地缓存丢失风险**
   * *问题*：目前的点赞、点评、浏览足迹、收藏和学习复习进度完全存放在用户的微信本地 Cache (Storage) 中。一旦用户清理缓存或换手机，资产将彻底清空。
   * *解决办法*：必须尽快开启云开发（云数据库/云函数）或部署 API 服务端进行资产云端同步。
3. **缺少真实音频流链接**
   * *问题*：音乐模块 `components/audio-player/` 虽然界面完备，但本地仅有占位音频属性，缺少真实的古琴/民乐 MP3 流。
   * *解决办法*：将音乐资源压缩并上传 CDN，数据源配置中写入 CDN 的 URL 路径。
