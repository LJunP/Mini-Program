# 妙不可园微信小程序｜交给 Codex 的完整开发接管提示词

> 使用方式：把本文件从"提示词开始"到"提示词结束"完整复制给 Codex。
> 事实基准日期：2026-07-28。外部云资源、账号权限和控制台状态可能变化，接管后必须重新验证。

---

## 提示词开始

你现在接管一个正在上线前收尾的原生微信小程序项目。请以高级项目负责人、微信小程序架构师和主程的标准继续开发，不要只给建议，也不要重新从零设计。

### 一、你的目标

1. 先确认当前代码与运行基线没有漂移。
2. 保留已完成成果，优先完成剩余 P0 上线事项。
3. 每项工作必须形成"真实代码或真实控制台操作 + 验证证据 + 文档同步"，不能用计划、报告、静态扫描代替真实进展。
4. 默认自主推进；只有涉及第二真实微信账号、公众平台提交、接受服务协议、付费、密钥录入或其他必须由账号所有者决定的外部操作时，才向用户请求最小必要协助。

### 二、工作区与版本基线

- 仓库绝对路径：`/Users/lijunpeng/Desktop/workbuddy_project`
- 小程序目录：`/Users/lijunpeng/Desktop/workbuddy_project/miniapp`
- 当前分支：`main`
- 最新提交：`0a83fab` — `fix: 补充社区Feed修复 - 云函数存储authorName、移除登录守卫、getPostById/deletePost兼容云端ID`
- 基线标签：`baseline/sanitized-2026-07-25`
- 产品名：妙不可园
- 项目类型：原生微信小程序，不是 uni-app/Taro
- 微信 AppID：`wx3ce1ffb49a3b24e4`
- CloudBase 环境：`cloud1-d6gh3spr3b2bd51d8`
- `project.config.json` 内部旧项目名仍为 `halfday-miniapp`，这是历史标识，不等于当前产品名。

接管后第一步必须执行：

```bash
cd /Users/lijunpeng/Desktop/workbuddy_project
git status --short --branch
git log -10 --oneline --decorate
git rev-parse HEAD
node scripts/testing/test-p0-regressions.js
node scripts/testing/test-leisure.js
node scripts/testing/test-study-content.js
node scripts/testing/test-database-content-all.js
```

如果 HEAD 是 `0a83fab` 或其后的提交，且工作区干净，这是正常的。不要重置、覆盖或删除用户已有改动。

### 三、事实权威顺序

发生冲突时按以下顺序判断：

1. 当前 Git 代码和实际运行结果；
2. 本交接文档（`HANDOFF-CODEX-2026-07-28.md`）；
3. `miniapp/PROJECT_PROGRESS.md`；
4. `docs/technical/TECH_STATUS.md`；
5. `docs/product/上线前操作指南.md`；
6. `docs/product/内容事实与合规审计-2026-07-25.md`；
7. `docs/product/音乐音频许可清单.md`；
8. 旧交接文档 `HANDOFF-GLM-2026-07-25.md`（已被本文档取代，仅作历史参考）；
9. 其他旧 README、产品方案和 `.agents/AGENTS.md`。

注意：部分旧文档仍写"没有真实后端"或旧文件数量。准确说法是：普通内容 REST API 尚未部署，开发/预发/生产的 `enableMock` 仍为 `true`；但是登录、用户资产、投稿、埋点、TTS、私有题库和私有素材已经有真实 CloudBase 云函数。不要因为旧文档而重复建设或把真实云函数删掉。

### 四、项目现在做什么

产品有两种模式：

- 休闲模式：香、音、茶、影、养、游六雅内容。
- 学习模式：教程、知识、面试题库、复习。

现有路由：

- 主包 21 页，含首页、六雅列表、收藏、个人中心、学习四模块、资料、偏好、历史、通知、订阅、隐私协议。
- 分包 7 页，含茶品详情、行旅详情、通用内容详情、学习详情、面试题详情、茶品对比、全局搜索。

架构边界：

```text
Pages / Components
        ↓
services/*
        ↓
utils/request.js
        ├─ enableMock=true → utils/mock.js → utils/data-store.js
        └─ enableMock=false → 未来 REST API

用户资产/云内容的真实链路：
页面或工具层 → wx.cloud.callFunction → 12 个 CloudBase 云函数 → 私有数据库/私有存储/Tencent TTS
```

新页面不要直接依赖 `utils/mock.js` 或 `utils/data-store.js`；优先经过 `services/`。不要在没有真实 REST 服务时把 `enableMock` 改成 `false`。

### 五、当前数据与云能力

本地六雅数据共 116 条：

- 茶 60；行旅 6；养生 14；香道 12；音乐 12；电影 12。

学习数据：

- 本地精简教程 3、知识 3；
- 本地 18 个面试专题，每专题 5 题，共 90 题；
- `data/study_data.json` 为完整数据：教程 18、知识 18、面试题 901。

云函数共 12 个：

`login`、`updateProfile`、`collection`、`history`、`preferences`、`notificationSettings`、`sign`、`studyProgress`、`ugc`、`track`、`tts`、`getStudyData`。

私有云资源约定：

- 完整题库：`study/study_data.json`
- 产品图片：`app-assets/images/`
- 音乐音频：`app-assets/audio/`
- 图片本地源文件仍保留在 `miniapp/assets/images/`，共 128 张有效图片；图片目录被 `project.config.json` 排除，不进入上传包。
- 私有图片和音频由 `getStudyData` 签发临时 URL，存储桶不可改为公开。

数据库集合按现有上线指南维护，包括：

`users`、`sign_records`、`collections`、`events`、`history`、`user_preferences`、`notification_settings`、`study_progress`、`ugc_posts`。

客户端不应直接获得集合读写权限；云函数使用服务端 `OPENID` 做身份边界。

### 六、此前已经完成的全部主要工作

以下均已落到代码或做过运行验收，不要重复开发：

#### 1. 建立可追踪的安全基线

- 建立 `baseline/sanitized-2026-07-25` 标签。
- 当前代码库不应录入腾讯云 SecretId/SecretKey、微信密钥或其他明文凭证。
- TTS 密钥此前已经配置在已部署云函数环境变量中；除非真实报错明确显示缺失、过期或泄漏，不要再要求用户重复录入或轮换。

#### 2. 上线前安全与稳定性加固

- 对云函数入参、ID、文本长度、动作类型等加入校验和边界限制。
- 云函数身份以 `cloud.getWXContext()` 的服务端 `OPENID` 为准，不信任客户端传入的身份字段。
- 收藏、历史、偏好、通知、签到、学习进度、资料、投稿等用户资产均已有对应云函数。
- 投稿保存按 `cloudId`、`client_id` 和兼容旧 ID 做去重/更新，降低重复投稿风险。
- 投稿默认私密：只有 `isPublic === true` 才视为公开；字段缺失或异常均按私密处理。
- 私密投稿详情只允许所有者读取；社区 Feed 只查询 `isPublic: true`；响应中不向客户端泄露 `_openid`。
- 投稿删除和编辑限制为当前所有者。
- 埋点上报加入字段白名单和校验，避免客户端伪造云端身份字段。
- TTS、私有题库和素材请求补充失败保护、超时与异常提示。
- 新增 `scripts/testing/test-p0-regressions.js`，覆盖关键 P0 回归。

#### 3. 私有题库与素材链路

- `getStudyData` 优先从 CloudBase 私有存储读取 `study/study_data.json`。
- 客户端按"索引 + 每批最多 3 个专题"同步，避免 3.56 MB 全量 JSON 触发响应体限制。
- 产品图迁移到 CloudBase 私有存储；本地图片仍作为维护源保存，但不进入小程序包。
- 私有资源路径设置白名单，不能任意为其他云文件签发临时地址。
- 临时图片 URL 客户端缓存改为 5 分钟刷新，修复旧签名长期复用导致的 HTTP 403。

#### 4. 面试题库性能治理

- 原来 901 道题及完整答案全部进入页面 `data`，产生约 1.8 MB `setData` 警告。
- 现在完整题目只保留在逻辑层，渲染层每页只接收 20 条轻量卡片字段。

#### 5. 腾讯云 TTS 真实链路

- 腾讯云基础/精品音色资源包已确认生效，当时基础模型显示 800 万字符可用额度。
- 面试题详情页已经完成真实云函数合成、播放、暂停/失败保护和离开页面自动停止。
- `tts` 云函数超时按 10 秒配置；`getStudyData` 按 15 秒配置。
- 外部额度会变化，若以后失败先看真实错误码和控制台当前额度，不要猜测"没配置密钥"。

#### 6. 首批真实授权音乐

已经完成并上传 4/12 首，详情页支持用户点击播放，不会自动播放，并展示可复制的许可信息：

- `music_001`《流水》：Charlie Huang，CC BY 2.5，8:13；
- `music_003`《二泉映月》：张沛坚 / David290，CC BY-SA 4.0，4:28；
- `music_008`《平沙落雁》：Charlie Huang，CC BY 2.5，7:14；
- `music_009`《阳关三叠》：Charlie Huang，CC BY-SA 3.0，5:50。

来源页、许可页、云端逻辑路径、文件大小和 SHA-256 全部记录在 `docs/product/音乐音频许可清单.md`。

#### 7. 六雅内容事实与合规审计

- 递归扫描 116 条六雅内容、19 条节气推荐及嵌套字段。
- 全量重写 14 条养生、12 条香品、12 条音乐、12 条电影的高风险文案。
- 清理 60 条茶品中的伪科学、医疗暗示、绝对化营销和模板化功效话术。
- 清理行旅模板和地点错配，重写历史、路线、随笔及关联语境。
- 修复音乐/电影串题错误。
- 对养生和香品补充必要的健康/安全边界。
- 泉州 `travel_006` 不再错误使用大理图片，目前 `coverImage` 留空。
- 模拟茶评不再返回，模拟公共投稿不再进入社区 Feed，静态聚合评分只有 `ratingSource === 'verified'` 才显示。
- 审计详情在 `docs/product/内容事实与合规审计-2026-07-25.md`。

#### 8. 社区 Feed 跨账号可见性修复（2026-07-28 新完成）

**这是最近完成的修复，必须了解上下文。**

**原始 Bug**：客户端 `utils/ugc.js` 的 `getCommunityFeed()` 只读本地存储（`wx.getStorageSync`），从未调用云函数。账号 B 打开「风雅社区」时只能看到自己本地的公开投稿，永远看不到账号 A 同步到云端的公开投稿。

**修复内容（2 个提交：`e947de6` + `0a83fab`）**：

1. `utils/ugc.js` 新增 `getCloudCommunityFeed(domain)` 函数，调用云函数 `ugc` 的 `getCommunityFeed` action 拉取所有用户的 `isPublic: true` 投稿。
2. `pages/contribute/list.js` 社区 Tab 改为异步加载：先用本地公开投稿即时回显，再从云端拉取全量公开投稿替换。
3. `pages/contribute/list.wxml` 添加加载中提示；他人投稿不显示编辑/删除按钮，显示作者名。
4. `pages/contribute/list.wxss` 添加加载状态样式。
5. 云函数 `cloudfunctions/ugc/index.js` 的 `save` action 新增 `authorName` 字段存储（新建和更新均保存），供社区 Feed 展示真实昵称。
6. `utils/ugc.js` 的 `_syncPostToCloud` 附带 `_getAuthorName()` 从 `auth.getUserInfo()` 或 `store.getState()` 获取用户昵称。
7. `getCloudCommunityFeed` 移除 `_isLoggedIn()` 守卫——云函数通过 `cloud.getWXContext()` 获取 OPENID，不依赖客户端 token，避免 `silentLogin` 未完成时社区 Feed 为空。
8. `getPostById(id)` 和 `deletePost(id)` 兼容云端文档 ID（同时搜索 `p.id` 和 `p.cloudId`）。

**⚠️ 关键待办**：云函数 `ugc` 已被修改（添加了 `authorName` 存储），**用户必须在微信开发者工具中重新部署 `cloudfunctions/ugc` 云函数**（右键 → 上传并部署：云端安装依赖）。否则 `authorName` 不会写入数据库，社区 Feed 会显示"匿名用户"。

**验证状态**：
- FACT：代码修改已完成，四组自动化测试全部通过，lint 无错误。
- UNKNOWN：真实跨账号真机验证尚未完成（需要用户用两个真实微信账号操作）。

#### 9. 运行与包体积验收

- 2026-07-25 最终临时预览代码包为 1176 KB。
- 开发者工具自动过滤 34 个无依赖文件，主包小于 1.5 MiB。
- 这只是临时预览，不是正式上传、提审或发布。

#### 10. 最近提交顺序

用于追溯变更：

- `a99e19b`：完成六雅内容事实和合规清理；
- `f6056ba`：记录 8 首缺失音乐的穷尽搜索结果；
- `fa5d825`：根据代码审查更新隐私指南数据流细节；
- `e947de6`：修复社区 Feed 跨账号不可见（客户端改调云函数）；
- `0a83fab`：补充社区 Feed 修复（云函数存 authorName、移除登录守卫、兼容云端 ID）。

### 七、尚未完成的内容

#### P0：上线前必须完成

**1. 重新部署 `ugc` 云函数 ⚠️ 紧急**
- 云函数 `cloudfunctions/ugc/index.js` 已修改（新增 `authorName` 字段存储），但尚未重新部署到云端。
- 用户需要在微信开发者工具中右键 `cloudfunctions/ugc` → 「上传并部署：云端安装依赖」。
- 部署后，用户需要创建一条新的公开投稿来验证 `authorName` 是否正确写入数据库（旧投稿的 `authorName` 为空，更新后会补上）。

**2. 跨账号社区 Feed 真机验证 ⚠️ 紧急**
- 代码修复已完成，但真实跨账号验证尚未完成。
- 验证步骤：
  1. 账号 A 在微信开发者工具中预览小程序 → 创建投稿 → 编辑改为「🌐 公开」→ 更新。
  2. 账号 A 重新生成预览二维码。
  3. 账号 B（第二个真实微信账号）扫码进入小程序 → 底部 Tab「风雅社区」→ 应该能看到 A 的公开投稿。
  4. 账号 B 点击 A 的投稿 → 应该能查看内容但不能编辑/删除。
  5. 账号 A 将投稿改回私密 → 账号 B 刷新社区 → 不应再看到该投稿。

**3. 第二真实账号隐私验收**
- 代码策略和自动化回归已完成，但不能用单账号或静态测试代替跨账号真机验收。
- 必须验证私密投稿在第二真实账号的社区 Feed 和详情页均不可见。
- 还应顺带验证同一账号重新登录后的用户资产同步、投稿更新不重复、失败重试。
- 验收矩阵详见 `HANDOFF-GLM-2026-07-25.md` 第七节或 `docs/product/上线前操作指南.md` 第 9 步第 14 项。

**4. 微信公众平台用户隐私保护指引**
- 路径与建议填法已写在 `docs/product/上线前操作指南.md` 第 5 步。
- 需要按实际上线数据流填写昵称头像、选择照片、写入相册、设备信息、公开投稿与私密投稿说明、接收方/处理方和联系邮箱。
- 你不能替用户同意法律协议、虚构接收方或提交不确定内容。

**5. 真实音乐仍缺 8/12**
- 缺少：
  `music_002`《渔舟唱晚》、`music_004`《春江花月夜》、`music_005`《十面埋伏》、
  `music_006`《梅花三弄》、`music_007`《百鸟朝凤》、`music_010`《高山》、
  `music_011`《琵琶行》、`music_012`《渔樵问答》。
- 已在 Wikimedia Commons 和 Internet Archive 做过穷尽搜索，未找到合格录音。搜索过程和结论记录在 `docs/product/音乐音频许可清单.md`。
- 作品古老不等于具体录音可自由使用。必须同时验证曲目匹配、具体录音权利、许可允许小程序使用。
- 未找到合格录音时保持 `audioSrc` 为空，不得用相似曲目、来源不明 MP3 或 AI 猜测的授权信息冒充。
- 可以尝试新的来源：MusOpen、Free Music Archive、CC Mixter、各音乐学院开放资源等。

**6. 正式上传、真机预览、提审和发布**
- 当前只有开发者工具临时预览事实。
- 在前述 P0 和全流程回归完成前不要宣称"已上线"。

#### P1：中优先级

- 补充页面级自动化和真实云函数集成测试。
- 使用微信开发者工具 CLI 建立静态检查、上传和可控的提交流水线；自动提审要保留人工确认。
- 用 `services/home.js` 和 `utils/persona.js` 做个性化推荐。
- 补首页切换、雷达图、行旅路线等微交互动效。
- 核验订阅消息是否真的配置模板 ID 并能实际投递；现有页面/设置不等于消息服务已上线，目前应视为 `UNKNOWN`。
- 评估并处理 5 个未使用主包 JS 文件，但删除前必须确认没有动态引用。

#### P2：长期建设

- 内容管理后台 CMS。
- 无障碍和色盲模式。
- 如果未来决定建设普通 REST 后端，再接入内容、搜索等服务并关闭生产 Mock；这不是当前 P0，不能贸然切换。

### 八、你现在应当怎么继续

按以下顺序执行，不要把 P1/P2 抢到 P0 前：

#### 第 1 阶段：恢复基线

1. 执行前述 Git 和四组测试命令。
2. 阅读以下关键代码文件：
   - `miniapp/cloudfunctions/ugc/index.js`（注意 2026-07-28 新增的 `authorName` 存储）
   - `miniapp/cloudfunctions/ugc/policy.js`
   - `miniapp/utils/ugc.js`（注意 `getCloudCommunityFeed`、`getPostById`、`deletePost` 的最新改动）
   - `miniapp/pages/contribute/contribute.js`
   - `miniapp/pages/contribute/list.js`（注意 `_loadCloudCommunityFeed` 异步加载逻辑）
   - `miniapp/pages/contribute/list.wxml`
   - `miniapp/cloudfunctions/getStudyData/index.js`
   - `miniapp/utils/asset-url.js`
   - `miniapp/utils/config.js`
   - `miniapp/app.js`
3. 用 `FACT / INFERENCE / UNKNOWN` 汇报当前状态。

#### 第 2 阶段：确认社区 Feed 修复已部署

1. 确认 `cloudfunctions/ugc/index.js` 的 `save` action 中有 `authorName` 字段。
2. 提醒用户在微信开发者工具中重新部署 `ugc` 云函数。
3. 提醒用户进行跨账号真机验证（步骤见上文 P0 第 2 项）。
4. 如果用户反馈验证失败，优先检查：
   - 云函数是否已重新部署（检查 `authorName` 字段是否存在于云端数据库 `ugc_posts` 集合中）。
   - `getCloudCommunityFeed` 是否被正确调用（Console 应有 `[ugc] getCloudCommunityFeed` 相关日志或无 `failed` 警告）。
   - 投稿的 `isPublic` 字段是否为 `true`（在云开发控制台数据库中直接查看 `ugc_posts` 集合）。
   - 社区 Tab 切换时是否触发了 `_loadCloudCommunityFeed()`（在 `list.js` 的 `onTabTap` 中确认）。

#### 第 3 阶段：第二账号隐私验收

推荐验收矩阵：

1. 账号 A 新建投稿，不主动开启"公开"，确认保存结果为私密。
2. 账号 A 能在"我的投稿"读取、编辑；重新登录后仍只有一条最新版记录。
3. 账号 B 登录后，社区 Feed 不出现该投稿。
4. 账号 B 通过该投稿真实云端 ID 请求详情，必须返回"投稿不存在或无权访问"，正文和图片均不能泄露。
5. 账号 A 改为公开，账号 B 才能在 Feed 和详情中读取。
6. 账号 A 再改为私密，账号 B 必须再次不可见，避免旧缓存泄露。
7. 检查客户端响应和日志不包含 `_openid`、SecretId、SecretKey。
8. 把账号标记、时间、步骤、预期、实测、错误码和结论写入新的验收记录；不要在文档中记录真实 openid 或密钥。

如果你无法获得第二真实账号或无法操作已登录微信环境，明确告诉用户："代码和自动化已通过，现在只缺第二账号人工切换"，给出最短操作指令，然后转去推进不依赖该账号的工作。不要伪造跨账号通过。

#### 第 4 阶段：完成公众平台隐私指引

1. 以当前代码实际调用的权限、上传、公开/私密逻辑为准复核指南。
2. 在微信公众平台打开提交页面，逐项比对。
3. 对第三方接收方、联系邮箱或法律确认不确定时停在提交按钮前，请用户确认。
4. 用户完成后保留无敏感信息的验收截图/记录，并同步进度文档。

#### 第 5 阶段：继续补齐授权音乐

每首音频必须走同一闭环：

1. 找到具体录音的原始来源页，确认标题/曲牌确实匹配。
2. 确认表演者、录制者、权利人和许可条款；优先原始馆藏、Wikimedia Commons 或明确开放许可的权威来源。
3. 下载/转码时记录是否修改，不删减必要署名。
4. 计算 SHA-256 和实际时长。
5. 上传 CloudBase 私有目录 `app-assets/audio/`。
6. 在 `miniapp/utils/data-store.js` 更新对应 `audioSrc`、`audioLicense`、时长等实际字段。
7. 必要时更新 `getStudyData` 音频白名单并重新部署云函数。
8. 更新 `docs/product/音乐音频许可清单.md`。
9. 开发者工具和真机验证：进入详情不自动播、点击可播/暂停/恢复、离页停止、许可可复制、无 403/权限错误。
10. 运行四组回归测试后提交。

无法验证权利的录音宁可不上线。研究结果、下载文件或上传动作不是完成，只有应用内真实播放与许可展示验收通过才算完成。

#### 第 6 阶段：全量上线回归

按 `docs/product/上线前操作指南.md` 第 9 步至少完成：

- 启动、六雅素材、详情排版、茶品雷达图；
- 登录、收藏、签到、资料、历史、偏好、通知、学习进度；
- 投稿同步、跨账号私密权限；
- TTS 合成/播放/离页停止；
- 埋点落库；
- 完整题库显示 901 题；
- 包体积、Console Errors、云资源 403；
- 四组自动化测试。

只有这些真实通过，且公众平台配置完成，才能进入正式上传与提审。

### 九、社区 Feed 修复的技术细节（供 Codex 快速理解）

**修改的文件列表**：

| 文件 | 修改内容 |
|---|---|
| `miniapp/utils/ugc.js` | 新增 `getCloudCommunityFeed()`、`getCommunityFeedLocal()`、`_getAuthorName()`；修改 `_syncPostToCloud()` 附带 authorName；修改 `getPostById()` 和 `deletePost()` 兼容 cloudId；移除 `getCloudCommunityFeed` 的 `_isLoggedIn()` 守卫 |
| `miniapp/pages/contribute/list.js` | 新增 `communityLoading` 状态和 `_loadCloudCommunityFeed()` 异步加载方法；修改 `onPostTap()` 处理云端他人投稿；修改 `_formatPost()` 添加 `isCloud` 字段 |
| `miniapp/pages/contribute/list.wxml` | 社区加载中提示；他人投稿显示作者名不显示编辑/删除按钮；空状态添加 `!communityLoading` 条件 |
| `miniapp/pages/contribute/list.wxss` | 新增 `.community-loading` 样式 |
| `miniapp/cloudfunctions/ugc/index.js` | `save` action 新建和更新时存储 `authorName` 字段 |

**数据流（修复后）**：

```
账号 A 创建/编辑投稿 (isPublic: true)
  → savePost() 本地存储
  → _syncPostToCloud() 附带 authorName = 用户昵称
  → 云函数 save → ugc_posts 集合 (isPublic: true, authorName: "用户昵称")
                                                      ↓
账号 B 打开「风雅社区」Tab
  → _loadCloudCommunityFeed()
  → getCloudCommunityFeed('all')  ← 无需 _isLoggedIn() 守卫
  → 云函数 getCommunityFeed → where({ isPublic: true }) → 返回列表
  → 列表展示：authorName 正确显示，isMine=false 隐藏编辑/删除按钮
```

### 十、开发与安全红线

- 不把 SecretId、SecretKey、微信密钥、openid 写进代码、文档、日志或聊天。
- 不重复要求用户录入已经存在的 TTS 密钥；先看真实错误。
- 不擅自接受腾讯云/微信服务协议，不擅自付费，不替用户做法律声明。
- 不把私有 CloudBase 存储桶改为公开。
- 不使用来源不明或曲目不匹配的音频。
- 不用错误或生成不准确的地标图冒充泉州实景。
- 不恢复模拟公共投稿、模拟茶评、伪造用户评价或未验证评分。
- 不把 Mock 测试通过、文档完成、代码扫描通过称作真实上线验收。
- 不破坏 Pages → services → request → 数据源的边界。
- 不覆盖不属于你的未提交改动；禁止 destructive reset。
- 每个独立任务小步提交，提交信息说明真实改动；提交前跑相关测试。

### 十一、每次汇报格式

先给结论，再给证据：

```text
当前阶段：

FACT（已验证）：
- ...

INFERENCE（合理推断）：
- ...

UNKNOWN / BLOCKED（仍需验证或外部协助）：
- ...

本轮真实完成：
- 代码/控制台操作：
- 验证命令与结果：
- 提交：

下一步最高价值行动：
- ...
```

不要仅告诉用户"下一步建议"。只要不涉及新增授权、法律确认、付费或不可逆外部操作，就直接继续完成代码、验证和文档。

现在从"恢复基线"开始接管；确认社区 Feed 修复的部署状态和真机验证结果，然后按优先级推进剩余 P0 事项。

## 提示词结束
