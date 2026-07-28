# 妙不可园微信小程序｜当前开发交接与继续执行提示词

> 事实基准：2026-07-28 当前磁盘与本轮真实验证。
>
> 使用方式：把本文件完整交给下一位开发者或模型。当前 Git 代码和真实运行结果
> 高于任何旧交接文档；不得用本文档代替云端、真机、公众平台或审核证据。

## 提示词开始

你接管的是正在上线前收尾的原生微信小程序“妙不可园”。请以项目负责人、
微信小程序架构师和主程标准继续，不要重新从零设计，也不要只输出建议或报告。

### 1. 工作区与产品

- 仓库：`/Users/lijunpeng/Desktop/workbuddy_project`
- 小程序：`/Users/lijunpeng/Desktop/workbuddy_project/miniapp`
- 分支：`main`
- 当前 HEAD：`576641b`
- **当前工作区为未提交开发态**：本轮 P0 修改和新增文件均已落盘，但尚未形成新提交。
  接管者必须保留这些改动，禁止 reset、checkout 覆盖或从旧 HEAD 重新开发。
- 微信 AppID：`wx3ce1ffb49a3b24e4`
- 微信云开发环境：`cloud1-d6gh3spr3b2bd51d8`
- 项目：原生微信小程序，不是 Taro/uni-app
- 产品：休闲模式的香、音、茶、影、养、游六雅；学习模式的教程、知识、
  面试题库和复习

普通内容链路仍默认 `enableMock=true`，页面应保持
`Pages → services → utils/request.js` 边界。不要在没有真实 REST 服务时切成
`enableMock=false`。登录、用户资产、UGC、埋点、TTS、私有题库与私有素材已经有
CloudBase 云函数，不能再把项目说成“完全没有后端”。

### 2. 接管后立即执行

```bash
cd /Users/lijunpeng/Desktop/workbuddy_project
git status --short --branch
git log -10 --oneline --decorate
git rev-parse HEAD
node --check miniapp/cloudfunctions/login/index.js
node --check miniapp/cloudfunctions/sign/index.js
node --check miniapp/cloudfunctions/ugc/index.js
node --check miniapp/cloudfunctions/ugc/validation.js
node --check miniapp/utils/account-scope.js
node --check miniapp/utils/ugc.js
node --check miniapp/services/user.js
node --check miniapp/pages/profile/profile.js
node --check miniapp/pages/index/index.js
node --check scripts/testing/test-p0-regressions.js
node --check scripts/testing/test-cloud-identity-atomicity.js
node --check scripts/testing/test-account-scope-async.js
node --check scripts/testing/test-index-sign-scope.js
node --check scripts/testing/test-profile-session-integrity.js
node scripts/testing/test-p0-regressions.js
node scripts/testing/test-cloud-identity-atomicity.js
node scripts/testing/test-account-scope-async.js
node scripts/testing/test-index-sign-scope.js
node scripts/testing/test-profile-session-integrity.js
node scripts/testing/test-leisure.js
node scripts/testing/test-study-content.js
node scripts/testing/test-database-content-all.js
git diff --check
```

预期基线：

- P0 回归：`9 groups passed`
- 身份并发原子性：`2 groups passed`
- 跨账号异步回包隔离：`5 flows passed`
- 首页签到账号/积分隔离：`3 flows passed`
- 资料与会话完整性：`6 groups passed`
- 休闲内容：116 条主数据、19 条节气推荐通过
- 教程/知识：6 篇通过
- 本地面试题：18 专题、90 题通过

测试中的“媒体清理待重试”和“登录网络失败”日志是故障路径用例，最终退出码和
通过汇总才是结果。

### 3. 本轮已经完成的真实代码

以下均已落到当前工作区代码并通过本地回归：

1. 对仍使用历史全局 Storage 键的收藏、签到、浏览/搜索历史、积分徽章、偏好、
   通知、学习进度/错题、笔记、评论、播放进度、计时器、订阅状态和旧 REST token
   增加账号级快照 `account_snapshot:<users._id>`。
2. 账号切换采用 fail-closed：快照读取、写入或清除任一步失败都中止切号；清除中途
   失败会从完整快照恢复并保留当前登录态。特殊字符账号 ID 不再因重复编码写入错误
   快照。
3. `account-scope` 增加 `epoch` 上下文；偏好、通知、学习进度、历史和收藏的 A 账号
   异步云回包在切到 B 后会被丢弃。对应真实内存回归为 `5 flows passed`。
4. UGC 投稿、草稿、冲突和重试副本按本次云登录确认的 `users._id` 隔离；
   `syncFromCloud/syncToCloud` 捕获账号作用域，旧回包不能写入 anonymous 或下一个账号。
5. 匿名草稿在当前账号已有草稿时进入该账号的
   `ugc_draft_conflicts:<user-id>`，不会遗留后再迁给 B；旧全局草稿冲突也会保留，
   不再静默丢弃。
6. 投稿云端确认失败时保留完整账号级 retry draft。公开/私密状态只回滚隐私字段，
   正文、图片等刚编辑内容不再整条恢复旧快照；编辑页重新进入时可恢复待重试内容。
7. `login` 对没有历史记录的账号以 OPENID 的 SHA-256 摘要生成确定性用户文档 ID，
   用显式 ID 的原子新增处理冷启动并发。
8. `sign` 以 `OPENID + 北京日期` 生成确定性签到 ID；同日并发只有一个新增成功。
   首页和个人页均捕获账号作用域，并且只有 `alreadySigned === false` 才增加本地积分。
9. 资料保存锁定既有 `users._id`：表单或云端异常不能覆盖身份锚；云端失败时返回
   `localSaved=true / cloudSynced=false`，本地资料保留但不会伪装云同步成功。
10. 登录、退出和切号时清理 persona 与 tracker 会话内存；旧账号画像、埋点队列及
    延迟签到回包不能进入新账号。资料与会话测试为 `6 groups passed`。
11. 私密、待审核、公开状态采用云端确认语义；公开投稿进入 `pending`，只有
    `isPublic=true && status=approved` 才能进入社区 Feed 或被非作者读取。
12. 作者名由云函数按服务端 OPENID 查询 `users.nickname`；服务端校验标题、正文、
    标签、评分、位置、关联内容、分页、图片和动作参数。
13. 图片只接受当前账号路径 `ugc/<users._id>/...` 的 CloudBase File ID，并须能在
    当前环境签发临时 URL；非作者只收到临时 URL。
14. 云端增加基于 `users` 文档的短期 UGC 资产锁，串行化同一账号的 save/delete；
    清理 claim 存在时拒绝图片复用，同一 File ID 不允许用于多篇新投稿。
15. 新投稿以 `OPENID + client_id` 映射确定性文档 ID，并改为显式 `_id` 的原子
    `collection.add`。并发重复的完整载荷一致才返回幂等成功，不同载荷返回冲突，
    不再以 `doc.set` 后写覆盖先写。
16. 编辑和删除使用 `updated_at` 乐观锁与事务条件更新；历史记录缺少版本时只允许
    严格幂等读取，修改/删除返回 `version_required + migration_required`。
17. dirty 冲突进入账号级 `ugc_conflicts:<user-id>`；云端记录不存在或已有删除墓碑时，
    离线脏副本不会自动复活。
18. 编辑移图和删除前分页扫描引用；扫描不完整时 fail-closed。云端 `getStats` 也改为
    稳定分页扫描，不再只统计默认首批记录。
19. `deleteFile.fileList[].status` 逐项确认；部分成功后只保留失败项重试。删除先进入
    `deleting` 并停止公开，完成后保留最小 `deleted` 墓碑。
20. 无 `cloudId` 但已经包含云图片的本地稿，确认删除图片成功后才移除本地记录；
    删除失败时保留稿件和清理状态，不再假删除。
21. 公开 Feed 有请求竞态保护；社区只展示已批准内容。
22. `ugc/config.json` 将本地目标超时设置为 10 秒；本地构建标识已经升级为
    `ugc-20260728-p0-4`。
23. 隐私页、上线指南、技术状态、项目进度和 UGC 人工审核/清理规程已更新，但在提交
    前仍须按本交接再次核对 `p0-4`、新增测试和未完成项。
24. `_uploadImages` 已从 `Promise.all` 改为 `Promise.allSettled`。部分上传失败时仅
    回滚本次新上传的成功项（不删除原投稿已有图片），逐 File ID 确认 `deleteFile`
    状态，回滚不完整则保存账号级 cleanup manifest（`ugc_cleanup_manifests:<userId>`）。
    `ugc.js` 新增 `saveCleanupManifest`、`getCleanupManifests`、`clearCleanupManifest`、
    `retryCleanupManifests` 和 `deleteCloudFilesConfirmed` 导出。`test-upload-cleanup.js`
    覆盖 7 组故障路径场景；P0 回归也增加了源码断言。

关键文件：

- `miniapp/cloudfunctions/ugc/index.js`
- `miniapp/cloudfunctions/login/index.js`
- `miniapp/cloudfunctions/sign/index.js`
- `miniapp/cloudfunctions/ugc/validation.js`
- `miniapp/cloudfunctions/ugc/policy.js`
- `miniapp/utils/account-scope.js`
- `miniapp/utils/ugc.js`
- `miniapp/utils/auth.js`
- `miniapp/services/user.js`
- `miniapp/services/preferences.js`
- `miniapp/services/notification-settings.js`
- `miniapp/services/history.js`
- `miniapp/services/collection.js`
- `miniapp/utils/study-progress.js`
- `miniapp/utils/persona.js`
- `miniapp/utils/tracker.js`
- `miniapp/pages/edit-profile/edit-profile.js`
- `miniapp/pages/index/index.js`
- `miniapp/pages/profile/profile.js`
- `miniapp/pages/contribute/`
- `scripts/testing/test-p0-regressions.js`
- `scripts/testing/test-cloud-identity-atomicity.js`
- `scripts/testing/test-account-scope-async.js`
- `scripts/testing/test-index-sign-scope.js`
- `scripts/testing/test-profile-session-integrity.js`
- `scripts/testing/test-upload-cleanup.js`
- `docs/product/上线前操作指南.md`
- `docs/product/UGC内容审核与清理操作规程.md`
- `docs/technical/TECH_STATUS.md`
- `miniapp/PROJECT_PROGRESS.md`

### 4. 云端部署的真实状态

FACT：

- 微信开发者工具官方 CLI 已在端口 `27126` 启动。
- **最新 `islogin` 返回 `login=false`**，云函数查询明确报“需要重新登录”。
- 在登录失效前，CLI 曾列出当前环境 12 个云函数；最后一次成功读取的远端
  `login/sign/ugc` 均为 `Active / timeout=3 / Nodejs16.13`。
- 2026-07-28 重启开发者工具后仅尝试了一次单函数部署，仍失败：
  `getCloudAPISignedHeader`，返回 `41002 / system error`。
- 随后触发过开发者工具重新登录二维码，但二维码超时未扫码。
- 因此本地 `p0-4` 和 timeout=10 **均没有确认部署成功**；当前远端版本属于
  `UNKNOWN`，不能根据本地文件推断。
- 腾讯云主控制台当前已经登录，但该账号在上海地域显示 0 个 CloudBase 环境；
  “腾讯云网页已登录”不等于“微信开发者工具拥有该小程序的云函数发布授权”。
  该页面不是本小程序微信云环境的有效管理入口，也没有接受新服务协议或新建环境。

下一步最小账号操作：

1. 账号所有者在“微信开发者工具”内刷新登录，必要时退出后重新扫码登录。
2. 不要重复配置 TTS 密钥，不要把任何 Secret、票据或 Cookie 发到聊天。
3. 登录刷新后部署本轮最低集合 `login sign ugc`：

```bash
'/Applications/wechatwebdevtools.app/Contents/MacOS/cli' cloud functions deploy \
  --port 27126 \
  --env 'cloud1-d6gh3spr3b2bd51d8' \
  --names login sign ugc \
  --remote-npm-install \
  --project '/Users/lijunpeng/Desktop/workbuddy_project/miniapp' \
  --lang zh
```

4. 立即复查：

```bash
'/Applications/wechatwebdevtools.app/Contents/MacOS/cli' cloud functions info \
  --port 27126 \
  --env 'cloud1-d6gh3spr3b2bd51d8' \
  --names login sign ugc \
  --project '/Users/lijunpeng/Desktop/workbuddy_project/miniapp' \
  --lang zh
```

只有同时满足以下条件才可写“部署完成”：

- CLI 部署表中 `login/sign/ugc` 均为 `success=true`；
- 远端 timeout 为 10；
- 真实调用 `getMyPosts` 返回
  `server_build=ugc-20260728-p0-4`。

若仍为 41002，停止重复尝试，保留错误码并检查微信开发者工具账号/项目授权，不要转去
腾讯云主控制台新建另一个环境。

在真实云环境并发调用后分别确认：
同一新微信账号只产生一个 `users` 文档、同一账号同一天只产生一个
`sign_records` 文档、同一 `client_id` 的相同 UGC 请求幂等且不同载荷冲突、
重复签到不重复加积分。还要验证 UGC 资产锁可以获取和释放，`users` 集合中没有长期
残留的过期锁。正式发布前仍应核对全部 12 个云函数的部署时间、配置与真实调用结果。

### 5. 云端开放写入前必须完成的数据治理

1. 导出 `ugc_posts` 全量备份并记录总数。
2. 保留已有 `deleted` 最小墓碑；`deleting` 进入异常清理清单。
3. 活动历史记录补齐可信 `status`、服务端昵称和有效 `updated_at`。
   缺失时间没有可信旧值时使用可审计的迁移基线时间，记录原值、新值、执行人和时间。
4. 缺失 `client_id` 的记录制定可追踪回填值，可沿用文档 `_id`。
5. 按 `_openid + client_id` 查空值和重复对，逐条处置，禁止脚本盲合并或删除。
6. 无冲突后创建唯一复合索引 `idx_openid_client`，并实测重复写入被拒绝。
7. 创建上线指南列出的社区、作者列表、审核与清理索引。
8. 不符合 `ugc/<users._id>/...` 的历史图片进入人工核验，不能盲删。

### 6. 仍未完成的 P0

以下不能被本地测试、文档或单账号演示替代：

1. ✅ **已完成**：`pages/contribute/contribute.js#_uploadImages` 已从 `Promise.all`
   改为 `Promise.allSettled`。部分上传失败时仅回滚本次新上传的成功项（不删除原投稿
   已有图片），逐 File ID 确认 `deleteFile` 状态，回滚不完整则保存账号级 cleanup
   manifest（`ugc_cleanup_manifests:<userId>`）。`ugc.js` 新增 `saveCleanupManifest`、
   `getCleanupManifests`、`clearCleanupManifest`、`retryCleanupManifests` 和
   `deleteCloudFilesConfirmed` 导出。自动化故障路径测试 `test-upload-cleanup.js` 覆盖
   7 组场景（全部成功、部分失败全回滚、部分失败部分回滚失败、全部失败、原投稿图片
   保护、manifest 账号隔离、retry 重试成功）。P0 回归也增加了源码断言。
2. ✅ **已完成**：全部未提交 diff 已审查，第 2 节所有测试、全量 JS `node --check`、
   敏感信息扫描与 `git diff --check` 均通过，文档已同步，已形成真实提交。
3. 微信开发者工具重新扫码登录后部署 `login`、`sign`、`ugc`；核对 UGC timeout
   和 `server_build`，并在真实云端复验 login/sign/UGC 并发原子性。最后一次可读取的
   远端 timeout 为 3，当前因 `login=false` 无法重新确认。
4. 在真实 CloudBase 备份、迁移 `ugc_posts`，创建并验证索引；同时检查 `users`
   中新增的 `ugc_asset_lock_token/ugc_asset_lock_until` 没有异常长期残留。
5. 指定有权限的人工审核/清理负责人，完成
   `pending → approved/rejected` 和 `deleting → deleted` 演练并留痕。
6. 使用两个真实微信账号验证私密、待审核、批准、批准后编辑、改回私密、删除、
   非作者无编辑权限和图片可见性。
7. 同一设备执行 A → B → A 换号，确认投稿、草稿、retry draft、冲突隔离区以及
   收藏、历史、签到、
   积分、偏好、学习记录、笔记和订阅等账号快照均不串号且 A 可正确恢复。
8. 真云存储验证资产锁、图片占用拒绝、逐 File ID 删除、部分失败只重试失败项、
   历史共享图片保护、孤儿上传回滚、历史图片人工清理和删除不存在对象的重试行为。
9. 在微信公众平台按真实数据流填写并提交用户隐私保护指引；先由运营主体提供并核验
   可处理数据权利请求的真实联系渠道，不能用未验证邮箱或虚构客服替代。
10. 12 首音乐目前只有 4 首有明确录音许可；剩余 8 首必须取得具体录音授权或明确不提供
   播放，不能以古曲公版推断录音公版。
11. 完成真机全流程、开发版本上传、提审和发布。在此之前不得称为“已上线”。

### 7. 仍未完成的 P1

- 管理员审核 API、最小审核后台、审核日志和拒绝原因。
- UGC 冲突隔离区的用户可见恢复界面。
- 孤儿上传登记、清理重试 Worker 和墓碑长期归档策略。
- 社区 Feed 下一页加载；当前客户端只取首 50 条。
- “我的投稿”超过 5000 条时的游标分页；当前会安全停止回推。
- 文本/图片内容安全服务与人工复核闭环。
- 登录、签到和 UGC 并发行为的持续集成/压力测试；当前只有本地伪 CloudBase 并发回归。
- 页面级、云函数真实集成和微信开发者工具自动化测试。

### 8. GLM 必须采用的继续执行顺序

1. ✅ 已读取当前 dirty diff 和关键文件；未从 `576641b` 重做。
2. ✅ 已修复 `_uploadImages` 部分成功时的孤儿文件问题，增加 7 组自动化测试。
3. ✅ 已审查本轮所有账号隔离、资料、签到和 UGC 改动；未发现新 P0。
4. ✅ 已重跑全部本地验证，已更新文档与状态文档，已确认无敏感信息，已提交当前工作树。
5. 到部署动作时，只请求用户在微信开发者工具扫码登录；不要索要密钥。部署并核验
   `login/sign/ugc`，不能用本地测试代替远端结果。
6. 在执行数据库迁移、创建索引、人工审核、公众平台提交、正式上传或发布前，先做
   只读检查；涉及法律确认、第二真实账号、不可逆删除或正式发布时向用户请求最小协助。
7. 完成两个真实账号和真机矩阵后，才进入提审。

每轮汇报必须使用：

```text
当前阶段：

FACT（已验证）：
- 代码/控制台真实动作：
- 验证命令与结果：
- 提交或远端版本：

INFERENCE（合理推断）：
- ...

UNKNOWN / BLOCKED：
- ...

下一步最高价值行动：
- ...
```

静态扫描、计划、文档、构建号、测试桩和单账号演示都不能冒充真实云端部署或真机验收。

### 9. 真实性与安全边界

- 不把测试、文档、构建号或控制台截图当成真机/云端部署。
- 不索要或保留 SecretId、SecretKey、微信密钥、登录票据或 Cookie。
- 不接受服务协议、不付款、不提交公众平台、不发布，除非账号所有者明确授权。
- 不公开存储桶；私有产品图片、音频和题库继续用临时 URL。
- 不物理删除历史数据或墓碑，除非已备份、验证、验收并获得新的明确授权。
- 工作区存在用户改动时保留它们；禁止 `git reset --hard` 或覆盖式恢复。

## 提示词结束
