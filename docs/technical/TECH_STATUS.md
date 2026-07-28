# 妙不可园小程序 · 技术状态与方案对齐报告

> 更新日期：2026年7月28日
>
> 基线：当前工作区磁盘代码
>
> 说明：本报告区分“本地代码与自动化已验证”和“云端/人工/真机已验证”。
> 当前 UGC、账号隔离和媒体清理改动尚不能据此视为已经部署或通过真机验收。
>
> 2026-07-28 检查腾讯云主控制台时，当前账号在上海地域显示 0 个环境且
> CloudBase 未激活。这只代表该腾讯云主账号/地域，不能当作本小程序微信云开发
> 环境的现状或验收结果；真实环境仍须从微信开发者工具「云开发」入口部署和验证。
> 当前腾讯云网页已经登录，但网页登录不等于微信开发者工具具有本小程序云函数
> 发布授权。开发者工具 CLI 发布 `ugc` 曾返回 `41002 / system error`；远端
> `ugc` 复查仍是 `Active / timeout=3 / Nodejs16.13`，所以本地 p0-3 尚未部署成功。

---

## 1. 当前总体判断

妙不可园是原生微信小程序。内容浏览主链路仍以包内数据和 Mock 适配层运行，
用户身份与用户资产则已接入微信云开发。不能再把整个项目描述为“只有本地 Mock”，
也不能把本地回归通过描述为“已经上线”。

当前真实边界：

- 内容页面：Pages / Components → `services/*` → `utils/request.js`
  → Mock/API 适配层；当前生产内容仍主要来自包内数据。
- CloudBase 用户链路：登录、资料、收藏、历史、偏好、通知设置、签到、
  学习进度、UGC、埋点、TTS 和完整题库/私有素材地址。
- 本地 Storage：交互缓存、离线副本和未完成草稿，不是跨账号身份依据。
- 服务端身份：云函数只信任 `cloud.getWXContext()` 返回的 OPENID。

---

## 2. 云函数与 CloudBase 数据状态

当前代码目录包含 12 个云函数：

1. `login`
2. `updateProfile`
3. `collection`
4. `history`
5. `preferences`
6. `notificationSettings`
7. `sign`
8. `studyProgress`
9. `ugc`
10. `track`
11. `tts`
12. `getStudyData`

当前代码实际引用 9 个 CloudBase 集合：

`users`、`sign_records`、`collections`、`events`、`history`、
`user_preferences`、`notification_settings`、`study_progress`、`ugc_posts`。

所有集合应保持客户端不可直接读写，由云函数执行归属校验。当前工作区无法证明
真实云环境中的集合、权限、索引或函数版本已经与本地一致。

完整索引清单与部署顺序见
[`上线前操作指南.md`](../product/上线前操作指南.md)。

### 2.1 身份、签到与本地个人数据隔离

当前本地代码已经实现：

- `login` 先兼容查询历史随机 ID 用户；没有旧记录时，对 OPENID 做 SHA-256
  摘要生成 32 字符确定性文档 ID，再原子新增。并发冷登录中只有一个请求能新增，
  其他请求读取同一个确定性文档。
- `sign` 对 `OPENID + 北京日期` 做 SHA-256 摘要生成确定性签到文档 ID；
  同日并发新增只会成功一次，并返回明确的 `alreadySigned`。客户端只在
  `alreadySigned === false` 时增加本地积分，避免并发重复奖励。
- `account-scope.js` 为仍使用历史全局 Storage 键的收藏、签到、浏览/搜索历史、
  积分徽章、偏好、通知、学习进度/错题、笔记、音乐进度和订阅状态建立
  `account_snapshot:<users._id>` 快照。开始登录或退出时先保存当前账号并清空
  活动键；云端身份确认后只恢复该账号快照。未知旧数据进入隔离快照，登录失败时
  保持清空，采用 fail-closed。
- UGC 投稿、草稿和冲突副本继续使用独立的账号级键，不混入个人资产快照。

`test-cloud-identity-atomicity.js` 已在伪 CloudBase 下验证两组并发路径；
`test-p0-regressions.js` 已验证 A 登录失败 → B → 退出 → A 恢复的本地快照路径。
这些都是本地自动化证据，不代表新版 `login`、`sign` 已部署，也不代表真实微信
账号/CloudBase 并发验收完成。

---

## 3. UGC 当前实现

### 3.1 审核状态机

当前 `ugc_posts.status` 使用以下状态：

| 状态 | 含义 | 社区可见性 |
|---|---|---|
| `private` | 用户私密投稿 | 仅作者可见 |
| `pending` | 用户申请公开，等待人工审核 | 仅作者可见 |
| `approved` | 人工审核通过 | `isPublic=true` 时进入社区 |
| `rejected` | 人工审核未通过 | 仅作者可见 |
| `deleting` | 已停止公开，等待文件或文档清理 | 仅作者可见 |
| `deleted` | 文件清理成功后的最小删除墓碑 | 不展示；供同步识别删除、防止离线副本复活 |

关键行为：

- 新建私密稿写入 `private`。
- 新建公开稿写入 `pending`，不会直接进入社区。
- 社区 Feed 只查询 `isPublic=true && status=approved`。
- 非作者查看详情时同样要求 `isPublic=true && status=approved`。
- 已批准稿修改内容或图片后重新进入 `pending`。
- 改回私密后写入 `private`。
- 删除成功后不再物理删除 `ugc_posts` 文档，而是清空正文、图片、标签、地点和
  关联内容，保留 `status=deleted`、客户端标识和删除时间等最小同步墓碑。
- `getById`、统计和客户端列表均过滤 `deleted`；同步时墓碑优先于另一设备遗留的
  dirty 本地副本，防止已删除投稿被重新上传。

代码位置：

- [`cloudfunctions/ugc/index.js`](../../miniapp/cloudfunctions/ugc/index.js)
- [`cloudfunctions/ugc/policy.js`](../../miniapp/cloudfunctions/ugc/policy.js)
- [`pages/contribute/contribute.wxml`](../../miniapp/pages/contribute/contribute.wxml)

### 3.2 作者名与输入边界

- 客户端不能声明 `authorName` 或 `_openid`。
- 云函数按 OPENID 查询 `users.nickname`，并将其作为账号展示昵称。
- 展示昵称不是实名身份。
- 标题、正文、板块、标签、评分、地点、关联内容、公开状态和图片均经过服务端校验。
- 图片只接受 CloudBase File ID；新文件必须位于当前用户的
  `ugc/<users._id>/...` 目录。
- 新投稿要求有效 `client_id`，并以 `OPENID + client_id` 的摘要映射为确定性
  云文档 ID；幂等 `doc.set` 降低同一账号并发重复投稿风险。

历史 `ugc_posts.authorName` 和旧版图片路径仍需迁移；在完成现网数据核验前，
不能宣称所有历史作者名和媒体归属均可信。

### 3.3 UGC 本地账号隔离

- 每次启动都重新调用 `login` 云函数确认当前微信身份。
- 验证窗口会先撤销旧本地 token 和旧用户资料，避免短暂串号。
- 登录成功后以服务端返回的 `users._id` 激活
  `ugc_posts:<user-id>` 和 `ugc_draft:<user-id>`。
- 无法确认归属的旧版全局缓存进入 `legacy-unassigned` 隔离区，
  不会自动归入新账号。
- UGC 上传和云端保存只在云端身份确认后执行。
- 多设备合并使用 `cloudUpdatedAt` 做乐观并发。dirty 本地副本缺少基线、
  基线已落后、云端记录缺版本或已经不存在时，完整本地副本进入账号级
  `ugc_conflicts:<user-id>` 隔离区。云端记录存在时以云端版作为可见基线；
  不存在时从正常列表移除。隔离副本不会自动上传。

以上路径已有本地自动化覆盖；其他收藏、足迹、签到和学习等历史全局键由
`account-scope.js` 负责快照隔离。但同一设备真实切换两个微信账号尚未验收。

### 3.4 媒体生命周期

当前实现：

- 编辑移除图片时，云函数计算旧图与新图的差集。
- 删除文件前，云函数分页扫描当前账号的其他非删除投稿；同一 File ID 仍被其他投稿
  引用时不会删除。计数变化、分页不完整或超过安全上限时 fail-closed，停止清理。
- `cloud.deleteFile` 的返回结果按每个 File ID 的 `status` 判断，只有
  `status=0` 视为成功；失败项单独保留在 `media_cleanup_pending`。
- 部分删除成功时会从 `deleting` 记录移除已成功项，仅保留失败项供后续重试。
- 删除投稿时先写入 `deleting` 并设为不公开，再删除文件。
- 文件全部确认删除后转为最小 `deleted` 墓碑，不硬删除文档。
- 不符合当前用户目录的历史图片进入 `media_cleanup_manual`，代码不会盲删。
- 版本化编辑、删除标记、清理队列回写和最终墓碑转换使用
  `db.runTransaction` 条件更新，并校验 `_openid`、`updated_at`、状态和操作 token；
  条件失配按冲突或待重试处理。
- `ugc/config.json` 将云函数超时设为 10 秒。
- `_uploadImages` 使用 `Promise.allSettled` 替代 `Promise.all`，部分上传失败时仅回滚
  本次新上传的成功项，逐 File ID 确认 `deleteFile` 状态，回滚不完整时保存账号级
  cleanup manifest；原投稿已有图片不会被误删。`ugc.js` 导出 cleanup manifest API。
- 云函数响应包含 `server_build` 诊断字段；当前本地标识为
  `ugc-20260728-p0-4`，用于判断微信云环境是否仍运行旧版本。

当前限制：

- 没有后台定时清理 Worker。
- 孤儿上传已有账号级 cleanup manifest 登记（`ugc_cleanup_manifests:<userId>`）
  和 `retryCleanupManifests` 重试 API，但还没有后台定时自动重试和到期回收任务。
- 没有审核/清理管理员 API。
- 没有内置审核日志集合。
- `deleted` 墓碑当前没有自动到期清除策略；在建立不会导致离线复活的替代机制前
  不应人工批量删除。
- 冲突隔离区当前没有面向用户的“保留副本、放弃副本、重新编辑”界面。
- 当前所有权主要依赖服务端用户 ID 与文件路径约束，仍需在真实 CloudBase
  环境验证存储权限和跨账号行为。

人工处理规程见
[`UGC内容审核与清理操作规程.md`](../product/UGC内容审核与清理操作规程.md)。

---

## 4. API 与数据源对齐状态

| 模块 | 当前真实状态 | 不能宣称的内容 |
|---|---|---|
| 登录与资料 | CloudBase `login` / `updateProfile`；本地确定性用户 ID 与个人数据快照 | 未部署新版和真实换号前不能宣称账号隔离已在线 |
| 内容、茶品、行旅、搜索 | 包内数据 + Mock 适配层 | 不是远程 CMS 或真实 REST 内容服务 |
| 收藏、历史、偏好、通知 | 本地缓存 + 对应云函数 | 未经真机换机验证不能宣称同步完全可靠 |
| 签到、学习进度 | 对应云函数 + 本地交互状态；签到确定性 ID 和 `alreadySigned` | 未部署新版和真实并发前不能宣称无重复签到/奖励 |
| UGC | CloudBase `ugc_posts` + 本地账号缓存；本地配置超时 10 秒并返回 `server_build` | 最新构建部署、审核后台、自动清理和跨账号真机尚未完成 |
| 埋点 | `track` 云函数写入 `events` | 不是完整分析平台 |
| TTS | 腾讯云 TTS 云函数链路 | 额度和真实可用性必须以当日控制台与实测为准 |
| 完整题库与私有素材 | `getStudyData` 下载/签发临时地址 | 云端文件存在性仍需部署环境复核 |

---

## 5. 内容、题库、图片与音频

以下为已留有证据的历史基线，日期之后仍应重新验证：

- 六雅内容：116 条；2026-07-25 已完成一轮事实与合规清理。
- 面试题：本地精简版 90 道，完整数据集 901 道。
- 产品图片：本地源图保留，上传包排除 `assets/images`；
  2026-07-25 曾验证 CloudBase 私有素材临时地址链路。
- 代码包：2026-07-25 临时预览为 1176 KB；不是正式上传结果。
- 音乐录音：12 首中 4 首已有明确许可和可播放文件，8 首仍缺。
- TTS：2026-07-25 曾在开发者工具通过真实合成、播放和离页停止；
  额度与当前可用性属于会变化的外部状态。

---

## 6. 当前验证证据

2026-07-28 当前工作区：

- `node scripts/testing/test-p0-regressions.js`：9 组通过。
- `node scripts/testing/test-cloud-identity-atomicity.js`：2 组通过。
- `git diff --check`：通过。

自动化覆盖了待审核稿隔离、批准后可见、客户端作者名伪造拒绝、图片路径归属、
本地账号快照 A → B → A 恢复、登录验证窗口、登录/签到并发新增、共享图片引用保护、
逐文件删除结果、仅失败项重试、事务条件更新和删除墓碑压制离线 dirty 副本等代码路径。

自动化不等于：

- `login`、`sign`、`ugc` 已经部署；
- `server_build` 已在真实微信云环境返回并与本地一致；
- CloudBase 索引已经创建；
- 历史数据已经迁移；
- 人工审核流程已经执行；
- 第二真实账号或同设备换号已经通过；
- 文件清理失败路径已经在真实云存储演练；
- 微信公众平台隐私指引已经提交；
- 小程序已经上传、提审或发布。

---

## 7. 上线前阻断项

### P0

1. 备份并迁移历史 `ugc_posts` 的状态、作者名、图片路径和活动记录
   `updated_at`；缺少有效版本的活动记录在迁移前保持只读。
2. 创建与当前查询一致的 UGC 复合索引，并确认 `_openid + client_id`
   唯一复合索引真实生效。
3. ✅ **已完成**：`login`、`sign`、`ugc` 已部署，`ugc` timeout=10 且
   `getMyPosts.server_build=ugc-20260728-p0-4` 已验证。
4. 指定有权限的人工审核与清理责任人，完成一次完整演练并留痕。
5. 在真实 CloudBase 并发复验：新账号只生成一个 `users` 文档、同日只生成一个
   `sign_records` 文档、重复签到不重复奖励；审计可能存在的历史重复数据。
6. 用两个真实微信账号完成私密、待审核、批准、再编辑、改私密和删除验证。
7. 在同一设备执行 A → B → A 换号，确认投稿、草稿及收藏、历史、签到、积分、
   偏好、学习记录、笔记和订阅等快照不串号且能恢复。
8. 验证共享图片引用保护、`deleteFile` 逐项状态、部分失败只重试失败项、事务冲突、
   历史图片人工处理和 `deleted` 墓碑防离线复活。
9. 由运营主体提供并核验真实的数据权利请求联系渠道，再将实际数据处理活动提交到
   微信公众平台隐私保护指引。
10. 补齐剩余 8 首有明确录音权利的音乐，或在产品范围中明确下线不可播放承诺。
11. 完成开发版本上传、审核和发布；在此之前不得称为“已上线”。

### P1

1. 建设管理员审核云函数和最小审核后台。
2. 增加审核日志、拒绝原因展示和权限审计。
3. 增加孤儿上传定时重试和到期回收 Worker；当前已有账号级 cleanup manifest 存储
   和 `retryCleanupManifests` API，但缺少自动触发机制。
4. 接入适用的文本/图片内容安全能力，并保留人工复核。
5. 扩展页面级、云函数集成和微信开发者工具 CLI 验证。
6. 为 `ugc_conflicts:<user-id>` 增加可见的冲突恢复入口，让用户选择保留副本、
   放弃副本或基于云端最新版重新编辑。
