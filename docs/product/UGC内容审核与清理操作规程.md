# 妙不可园 UGC 内容审核与清理操作规程

> 版本：2026-07-28
>
> 适用范围：`ugc_posts`、投稿图片目录 `ugc/`、社区 Feed
>
> 当前模式：上线前临时人工审核与人工清理

## 1. 目的与边界

本规程用于在尚无审核后台、管理员审核 API 和自动清理 Worker 的情况下，
安全处理公开投稿审核、历史数据迁移、删除失败和媒体残留。

必须区分：

- **代码事实**：当前本地代码已实现 `pending/approved` 可见性门槛、
  账号作用域隔离、图片目录校验、共享图片引用保护、`deleting` 中间态和
  `deleted` 墓碑。
- **外部事实**：真实 CloudBase 是否部署最新代码、索引是否创建、历史数据是否迁移、
  第二账号和真实存储删除是否通过，均需单独验证。
- **临时方案**：直接在 CloudBase 控制台改审核状态只适用于上线前小规模运营，
  不等于正式审核系统。

2026-07-28 检查腾讯云主控制台时，当前登录账号在上海地域显示 0 个环境且
CloudBase 未激活。这只代表该腾讯云主账号/地域，不能用来判断本小程序微信云开发
环境是否存在，更不能作为部署或清理验收。所有真实操作必须从微信开发者工具绑定的
「云开发」环境进入。
腾讯云网页当前已经登录，但网页登录不等于微信开发者工具拥有发布授权。开发者工具
CLI 发布 `ugc` 曾返回 `41002 / system error`，远端复查仍是
`Active / timeout=3 / Nodejs16.13`；本地 p0-3 尚未确认部署成功。

任何人不得把自动化测试、文档完成或单账号演示描述为真实跨账号、人工审核或清理验收。

---

## 2. 权限与职责

至少指定两种责任：

1. **审核责任人**
   - 只处理内容判断和状态变更；
   - 不修改作者、正文、图片、`_openid`、`client_id` 或创建时间。
2. **清理责任人**
   - 处理 `deleting`、`media_cleanup_pending` 和 `media_cleanup_manual`；
   - 删除文件前必须核验归属和其他引用。

操作账号要求：

- 使用运营主体控制的 CloudBase 管理账号；
- 开启可用的登录保护和最小权限；
- 不共享个人密钥，不把 SecretId、SecretKey、OPENID 或完整用户数据写入聊天记录；
- 每次操作留存操作者、时间、投稿文档 ID、操作前后状态和结果。

在正式管理员 API 上线前，审核和清理记录应保存在运营方控制的受限记录表中。
当前代码没有内置审核日志集合，不能宣称已有完整审计链。

---

## 3. UGC 状态机

| 当前状态 | 触发方 | 允许的下一状态 | 社区可见性 |
|---|---|---|---|
| `private` | 用户 | `pending`、`deleting` | 不可见 |
| `pending` | 审核员/用户 | `approved`、`rejected`、`private`、`deleting` | 不可见 |
| `approved` | 用户 | 内容变化后 `pending`、主动改为 `private`、`deleting` | `isPublic=true` 时可见 |
| `rejected` | 用户 | 修改并重新提交后 `pending`、改为 `private`、`deleting` | 不可见 |
| `deleting` | 清理员/重试流程 | 清理完成后 `deleted` | 不可见 |
| `deleted` | 同步流程 | 保留最小墓碑 | 客户端过滤，作为防离线复活标记 |

硬性规则：

- 只有 `isPublic === true && status === "approved"` 才能进入社区 Feed 或被非作者读取。
- `pending` 不得提前展示。
- `deleting` 不得恢复为 `approved`，除非先完成事故调查和明确的恢复决定。
- `deleted` 不得恢复为任何活动状态，也不得在没有替代防复活机制时物理删除。
- 历史 `published`、缺少 `status` 或未知状态不得直接视为通过审核。

---

## 4. CloudBase 基线

当前代码使用 9 个集合：

`users`、`sign_records`、`collections`、`events`、`history`、
`user_preferences`、`notification_settings`、`study_progress`、`ugc_posts`。

所有集合保持客户端不可直接读写。

UGC 至少创建以下索引：

| 索引 | 字段 |
|---|---|
| `idx_openid_client` | `_openid ASC + client_id ASC` |
| `idx_openid_created` | `_openid ASC + created_at DESC` |
| `idx_openid_domain_created` | `_openid ASC + domain ASC + created_at DESC` |
| `idx_public_status_created` | `isPublic ASC + status ASC + created_at DESC` |
| `idx_public_status_domain_created` | `isPublic ASC + status ASC + domain ASC + created_at DESC` |
| `idx_status_created` | `status ASC + created_at ASC` |
| `idx_status_updated` | `status ASC + updated_at ASC` |

`idx_openid_client` 必须是唯一复合索引。先备份，再回填缺失 `client_id`
（可沿用文档 `_id`，但必须留痕），按 `_openid + client_id` 统计并逐条处置
空值和重复对；确认无冲突后创建唯一索引，并用重复写入测试确认约束生效。

当前 `ugc/config.json` 将函数超时设为 10 秒。当前本地构建标识为
`ugc-20260728-p0-3`，云函数 `getMyPosts` 响应应返回同值 `server_build`。
字段缺失或不一致时，停止审核和清理操作，先确认是否部署到了错误环境或仍在运行旧版本。
本轮最低云函数部署集是 `login`、`sign`、`ugc`；只部署 UGC 不能验收账号快照
依赖的新登录身份和签到并发保护。

---

## 5. 上线前历史数据迁移

### 5.1 迁移前

1. 导出 `ugc_posts` 全量备份。
2. 记录：
   - 总文档数；
   - `isPublic=true` 数量；
   - 缺少 `status` 数量；
   - 缺少 `client_id` 数量，以及按 `_openid + client_id` 统计的重复对；
   - 缺少 `authorName` 数量；
   - 非 `deleted/deleting` 活动记录缺失、空值或非法 `updated_at` 的数量；
   - 带图片投稿数量。
3. 另外统计 `status=deleting` 和 `status=deleted` 的记录。
4. 禁止在无备份情况下批量更新或删除。

### 5.2 状态迁移

- `status="deleted"`：原样保留，不回填业务内容、不改回活动状态。
- `status="deleting"`：进入清理异常清单，先完成或重试清理，不执行普通迁移。
- 其余活动记录 `isPublic !== true`：设置 `status="private"`。
- 活动记录 `isPublic === true` 且 `status` 缺失、为 `published` 或为其他未知值：
  设置 `status="pending"`。
- 已有 `approved` 但找不到真实人工审核记录：降回 `pending`。
- 禁止为了快速恢复社区内容而批量批准历史稿。
- 活动记录缺少有效 `updated_at`：备份后使用可信旧修改时间；没有可信时间时使用
  可审计的迁移基线时间，并记录原值、新值、执行人和执行时间。补齐前禁止开放写入。

### 5.3 作者展示名迁移

1. 跳过 `status="deleted"` 的墓碑。
2. 按活动 `ugc_posts._openid` 查询 `users._openid`。
3. 用对应 `users.nickname` 回填 `ugc_posts.authorName`。
4. 找不到用户记录时使用统一占位名“微信用户”，并进入异常清单。
5. `authorName` 只是账号展示昵称，不得标记为实名。

### 5.4 图片迁移

新版安全路径为：

```text
ugc/<users._id>/<文件名>
```

处理规则：

- 符合当前记录所属用户目录：保留。
- 不符合用户目录、属于旧版 `ugc/` 根目录或无法判断环境：标记为历史人工核验。
- 任何历史图片都不得只因“存在于某条投稿”就直接删除；必须先检查是否被其他投稿引用。

### 5.5 迁移完成标准

- 迁移前后文档数一致，除非有逐条记录的明确删除决定。
- 每条记录都有已知状态。
- 历史公开稿全部处于 `pending` 或有可核验的人工审核记录。
- 原有 `deleted` 墓碑全部保留且业务内容未被重新填充。
- 异常作者、重复 `client_id`、旧图片路径都有清单和负责人。
- 每条活动记录都有有效 `updated_at`。
- `idx_openid_client` 已设为唯一复合索引，重复写入测试被拒绝。

---

## 6. 临时人工审核流程

### 6.1 领取待审核稿

在 CloudBase 控制台查询：

```text
isPublic = true
status = pending
```

按 `created_at` 从旧到新处理。领取时记录：

- 文档 `_id`；
- `updated_at`；
- 作者展示名；
- 审核开始时间；
- 审核人。

### 6.2 审核内容

逐项检查：

- 标题、正文、标签、手动地点和关联内容；
- 每张图片是否与正文相关、是否可能侵犯版权或肖像权；
- 是否包含手机号、住址、学校、证件、账号等不应公开的个人信息；
- 是否包含违法违规、色情低俗、仇恨、骚扰、诈骗、引流、广告垃圾内容；
- 是否包含未经证实的医疗、健康、历史、投资或绝对化承诺；
- 是否涉及未成年人敏感信息；
- 作者展示名是否存在冒充官方、他人身份或违规词风险。

当前没有自动文本/图片内容安全接口，人工审核不得因“代码已有 pending 状态”而省略。

### 6.3 防止审核竞态

作出决定前重新打开文档，确认 `updated_at` 与领取时完全一致。

- 一致：可以作出决定。
- 不一致：停止当前审核，按最新内容重新审核。

CloudBase 控制台直改不是原子审核事务，不能靠旧截图批准已经变化的内容。

### 6.4 审核通过

只修改：

```text
status = approved
```

并确认：

```text
isPublic = true
```

不得修改内容、图片、作者字段或归属字段。记录批准时间、审核人、审核依据和审核时的
`updated_at`。

### 6.5 审核拒绝

修改：

```text
status = rejected
```

通常保留 `isPublic=true`，表示用户仍有公开意图但当前版本未获批准。拒绝原因写入
运营审核记录。当前客户端只显示“未通过”，尚未展示拒绝原因；不得宣称用户已收到详细原因。

### 6.6 批准后的变化

- 用户修改正文、标题、标签、图片、评分、地点或关联内容后，代码会重新设置为 `pending`。
- 用户改为私密后设置为 `private`。
- 审核员不得绕过重新审核，将修改后的投稿直接恢复为 `approved`。

---

## 7. 媒体清理流程

### 7.1 每日巡检范围

查询：

- `status="deleting"`；
- `media_cleanup_pending` 非空；
- `media_cleanup_manual` 非空。

记录每条文档的 `_id`、`_openid`、`images`、两个清理数组和 `updated_at`。

### 7.2 自动路径文件

1. 用投稿 `_openid` 查询对应 `users._id`。
2. 只把包含当前环境且路径符合
   `ugc/<users._id>/...` 的文件视为可按归属清理。
3. 在当前账号全部非 `deleted` 投稿中分页扫描候选 File ID 的其他引用。
   仍被其他投稿引用的文件不得删除；分页、计数或扫描完整性无法确认时停止清理并重试。
4. 调用 `cloud.deleteFile` 后逐项读取返回的 `fileList[].status`：
   只有 `status=0` 视为该 File ID 删除成功，缺失或非 0 均视为失败。
5. 只将失败 File ID 留在 `media_cleanup_pending`，并从 `deleting` 记录移除
   已明确成功的 File ID；不得因批量调用整体未抛异常
   就清空全部队列。
6. 再次检查成功项确实不存在。
7. 普通编辑清理成功：清空 `media_cleanup_pending`。
8. `deleting` 投稿全部可删除文件成功删除：将其转换为最小 `status="deleted"` 墓碑，
   不物理删除文档。

最终墓碑会清空标题、正文、标签、图片、评分、地点、关联内容和清理 token，
保留删除同步所需的文档/客户端标识、`status`、`deleted_at` 等最小字段。
客户端和详情接口过滤墓碑；同步时墓碑压过其他设备遗留的 dirty 副本。

关键状态更新使用 `db.runTransaction` 条件更新，并同时核对 `_openid`、
`updated_at`、当前状态和本次操作 token。条件不满足时按并发冲突或待重试处理，
不得改用无条件覆盖来“完成”清理。

### 7.3 历史或异常路径

`media_cleanup_manual` 中的文件不得批量盲删。

逐个执行：

1. 确认 File ID 属于当前 CloudBase 环境。
2. 在全部 `ugc_posts.images`、`media_cleanup_pending` 和
   `media_cleanup_manual` 中搜索该 File ID。
3. 若仍被其他有效投稿引用，不删除。
4. 若无法确定创建者或唯一归属，不删除并升级人工核验。
5. 只有确认无其他引用且与本投稿有明确历史关联时才删除。
6. 文件确认删除后，从人工清理清单移除并清空活动图片引用。
7. 让正常删除重试流程把 `deleting` 转为 `deleted`；如果只能由管理员直接处理，
   必须按代码相同的最小墓碑字段执行并留下完整操作记录。

误留一个孤儿文件的风险低于误删另一用户仍在使用的图片。

### 7.4 删除失败重试

- 保持 `status=deleting` 和 `isPublic=false`。
- 只移除 `deleteFile` 明确返回 `status=0` 的 File ID；
  不修改或清空仍失败的清理项。
- 记录错误码、时间和重试次数，不记录完整 OPENID 或用户正文。
- 网络或平台暂时错误可重试；连续失败转人工处理。
- 完成前不得向用户或项目状态文档宣称“已彻底删除”。

### 7.5 `deleted` 墓碑维护

- `deleted` 不进入社区、详情、统计或客户端投稿列表。
- 客户端同步读取墓碑 ID 后，删除相同 `id/client_id` 的离线 dirty 副本。
- 当前没有墓碑自动到期策略。未建立可靠的设备同步水位、删除事件日志或其他
  防复活机制前，不得批量物理删除墓碑。
- 运营巡检可以统计墓碑数量和 `deleted_at`，但不把正常墓碑计为清理积压。

### 7.6 孤儿上传文件

当前没有服务端上传登记和自动孤儿回收。人工巡检时：

1. 导出所有有效投稿引用的 File ID 集合。
2. 列出 `ugc/` 下未被任何投稿引用的文件。
3. 设置明确宽限期，建议不少于 72 小时。
4. 排除仍在本地失败重试或运营调查中的文件。
5. 只删除超过宽限期且确认无引用的对象。

正式运营应增加上传登记、到期时间和定时清理 Worker。

---

## 8. 操作记录最小字段

每次审核、迁移或清理至少记录：

| 字段 | 说明 |
|---|---|
| `operation_id` | 唯一操作编号 |
| `operator` | 内部操作人标识 |
| `post_id` | `ugc_posts._id` |
| `operation` | migrate / approve / reject / cleanup / delete |
| `before_status` | 操作前状态 |
| `after_status` | 操作后状态 |
| `source_updated_at` | 决策依据的投稿版本 |
| `server_build` | 真实云函数返回的构建标识 |
| `operation_token` | 删除/清理操作 token，仅限内部记录 |
| `file_ids` | 涉及文件，限制访问 |
| `file_statuses` | 每个 File ID 的删除状态 |
| `reason` | 审核或异常原因 |
| `result` | success / pending / failed |
| `created_at` | 操作时间 |

记录中避免复制完整用户正文、OPENID、密钥或无关个人信息。

---

## 9. 上线前人工验收

使用账号 A、账号 B 和真实 CloudBase 环境完成：

1. A 新建私密稿；B 的 Feed 与详情均不可见。
2. A 提交公开稿；状态为 `pending`，B 不可见。
3. 人工审核通过；状态为 `approved`，B 可见。
4. A 修改已批准稿；状态回到 `pending`，B 不可见。
5. 再次批准后 A 改为私密；B 不可见。
6. 同一设备执行 A → B → A；B 看不到 A 的本地稿、草稿及其他个人数据快照，
   切回 A 后 A 的数据正确恢复。
7. 调用 `getMyPosts`，确认 `server_build=ugc-20260728-p0-3` 且 `ugc` 超时为 10 秒。
8. 删除新版路径图片投稿；所有 File ID 返回 `status=0` 后保留最小 `deleted` 墓碑。
9. 模拟某个 File ID 删除失败；投稿立即停止公开，只保留失败项，可重试至 `deleted`。
10. 用旧 `updated_at` 编辑或删除；事务条件失败并返回冲突，不覆盖新版本。
11. 在另一设备保留删除前的 dirty 副本；同步后该副本被 `deleted` 墓碑压制，不复活。
12. 删除历史路径图片投稿；进入人工清理，不误删其他投稿文件，完成后转为 `deleted`。
13. 检查 `pending`、`deleting` 和清理数组，无未知积压；正常 `deleted` 墓碑按设计保留。
14. A、B 同时编辑同一稿，A 先保存后让 B 同步旧 dirty 副本；A 的云端内容不被覆盖，
    B 的完整本地副本进入 `ugc_conflicts:<user-id>` 隔离区且不自动回推。
15. 同一账号两条活动投稿引用同一 File ID，删除其中一条；共享文件不被删除。

每项保留操作时间、账号角色、预期、实际结果和必要截图。未实际执行的项目标记
`UNKNOWN/未验证`，不得补写为通过。

---

## 10. 当前不能宣称完成的事项

截至本规程创建时，当前工作区不能证明：

- 最新 `login`、`sign`、`ugc` 等云函数已部署；
- 微信开发者工具真实环境返回的 `server_build` 与本地构建一致；
- `ugc` 真实云函数超时已配置为 10 秒；
- 真实 CloudBase 已创建正确复合索引；
- 历史 UGC 已迁移；
- 已有正式审核员、清理员、审核时限和受保护的审核日志；
- 第二真实账号和同设备换号已通过；
- 真实云存储的删除成功、失败重试和异常路径已演练；
- 共享 File ID 引用保护已在真实云存储验证；
- 事务条件更新和 `deleted` 墓碑防离线复活已在真实多设备链路验证；
- 多设备 dirty 冲突的隔离与恢复体验已完成真实验收；
- 孤儿文件有自动回收能力；
- 文本和图片内容安全服务已接入；
- 微信公众平台隐私指引已按当前 UGC 流程提交；
- 运营主体用于数据权利请求的真实联系渠道已核验并公开；
- 小程序已上传、提审或发布。

腾讯云主控制台当前账号“上海 0 个环境、CloudBase 未激活”不能把上述任何项目
改写为已完成或已失败；它不是本项目微信云开发环境的有效证据。

只有这些事项获得真实证据后，才能逐项更新为已完成。
