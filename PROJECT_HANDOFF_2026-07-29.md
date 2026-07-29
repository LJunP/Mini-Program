# 妙不可园微信小程序 - 项目交接文档

> 状态：开发暂停，等待下次继续  
> 最后更新：2026-07-29  
> 交接人：AI Assistant (Codex)  
> 项目路径：`/Users/lijunpeng/Desktop/workbuddy_project`

---

## 1. 项目概述

**产品名称**：妙不可园（Halfday）  
**类型**：原生微信小程序（非 Taro/uni-app）  
**AppID**：`wx3ce1ffb49a3b24e4`  
**云环境**：`cloud1-d6gh3spr3b2bd51d8`  

**核心功能**：
- 休闲模式：香、音、茶、影、养、游六雅内容
- 学习模式：教程、知识、面试题库、复习功能
- UGC 社区：用户投稿、审核、社区 Feed

---

## 2. 当前开发状态

### 2.1 已完成（P0 前三项）

| 项 | 状态 | 说明 |
|---|---|---|
| P0 #1 _uploadImages 修复 | ✅ | Promise.all → Promise.allSettled，孤儿文件回滚，cleanup manifest |
| P0 #2 代码审查与提交 | ✅ | 全部测试通过，JS 语法检查通过，敏感信息扫描通过，git diff --check clean |
| P0 #3 云函数部署 | ✅ | login/sign/ugc 已部署，ugc timeout=10，server_build=p0-4 已验证 |

**关键提交**：
- `ceebbf6`：修复 _uploadImages 孤儿云文件 + P0 账号隔离与 UGC 安全全量改动
- `c381467`：更新部署状态 - login/sign/ugc 已部署

### 2.2 未完成（剩余 P0）

| 项 | 优先级 | 预估工作量 | 阻塞因素 |
|---|---|---|---|
| P0 #4 数据迁移+索引 | 🔴 高 | 1-2 天 | CloudBase 控制台操作 |
| P0 #5 审核负责人+演练 | 🔴 高 | 0.5-1 天 | 需指定人 + 走流程 |
| P0 #6 双账号验证 | 🟡 中 | 0.5-1 天 | 需 2 个真实微信号 |
| P0 #7 A→B→A 换号验证 | 🟡 中 | 0.5-1 天 | 依赖 #6 |
| P0 #8 真云存储验证 | 🟡 中 | 0.5 天 | CloudBase 环境 |
| P0 #9 隐私声明提交 | 🔴 高 | 1-2 天 | 需运营主体提供真实联系渠道 |
| P0 #10 音乐授权 | 🟢 低 | 可跳过 | 或直接下线 8 首 |
| P0 #11 提审发布 | 🔴 高 | 0.5 天 + 审核 | 最后一步 |

### 2.3 上线时间估算

**最快路径（如果今天继续）**：7-10 天  
**如果搁置后重新开始**：+1-2 天（重新熟悉代码）

---

## 3. 技术架构

### 3.1 目录结构

```
workbuddy_project/
├── miniapp/                    # 小程序主目录
│   ├── app.js                  # 应用入口
│   ├── app.json                # 全局配置
│   ├── project.config.json     # 项目配置
│   ├── cloudfunctions/         # 云函数（12个）
│   │   ├── login/              # 登录
│   │   ├── sign/               # 签到
│   │   ├── ugc/                # UGC 投稿（核心）
│   │   │   ├── index.js        # 主逻辑
│   │   │   ├── config.json     # timeout=10
│   │   │   ├── validation.js   # 参数校验
│   │   │   └── policy.js       # 权限策略
│   │   └── ...                 # 其他云函数
│   ├── pages/                  # 页面
│   │   ├── index/              # 首页
│   │   ├── profile/            # 个人中心
│   │   ├── contribute/         # UGC 投稿（核心）
│   │   └── ...                 # 其他页面
│   ├── utils/                  # 工具类
│   │   ├── ugc.js              # UGC 客户端逻辑（核心）
│   │   ├── account-scope.js    # 账号隔离
│   │   ├── auth.js             # 认证
│   │   └── ...                 # 其他工具
│   └── services/               # 服务层
├── scripts/testing/            # 测试脚本
│   ├── test-p0-regressions.js  # P0 回归测试
│   ├── test-upload-cleanup.js  # 孤儿上传测试
│   └── ...                     # 其他测试
├── docs/                       # 文档
│   ├── product/                # 产品文档
│   ├── technical/              # 技术文档
│   └── tools/                  # 工具文档
└── 小程序图片/                 # 图片资源
```

### 3.2 核心数据流

```
用户操作 → 页面 (Page) → 服务 (services) → 工具 (utils)
                                    ↓
                              云函数 (cloudfunctions)
                                    ↓
                              CloudBase (数据库/存储)
```

### 3.3 关键存储键（账号隔离）

| 键 | 说明 |
|---|---|
| `ugc_posts:<userId>` | 用户投稿数据 |
| `ugc_draft:<userId>` | 用户草稿 |
| `ugc_draft_conflicts:<userId>` | 草稿冲突隔离区 |
| `ugc_conflicts:<userId>` | 同步冲突隔离区 |
| `ugc_cleanup_manifests:<userId>` | 孤儿文件清理清单 |
| `account_snapshot:<userId>` | 账号级数据快照 |

---

## 4. 测试状态

### 4.1 自动化测试

```bash
# 运行全部测试
cd /Users/lijunpeng/Desktop/workbuddy_project

# P0 回归测试
node scripts/testing/test-p0-regressions.js
# 预期：9 groups passed

# 身份并发原子性
node scripts/testing/test-cloud-identity-atomicity.js
# 预期：2 groups passed

# 账号异步隔离
node scripts/testing/test-account-scope-async.js
# 预期：5 flows passed

# 首页签到隔离
node scripts/testing/test-index-sign-scope.js
# 预期：3 flows passed

# 会话完整性
node scripts/testing/test-profile-session-integrity.js
# 预期：6 groups passed

# 孤儿上传回滚
node scripts/testing/test-upload-cleanup.js
# 预期：7 groups passed

# 内容数据校验
node scripts/testing/test-leisure.js
node scripts/testing/test-study-content.js
node scripts/testing/test-database-content-all.js
```

### 4.2 手动测试清单（下次继续时需要）

- [ ] 双账号 UGC 全流程（投稿、编辑、删除）
- [ ] A→B→A 换号数据隔离
- [ ] 真机图片上传部分失败回滚
- [ ] 云端资产锁验证
- [ ] 人工审核流程演练

---

## 5. 已知问题与限制

### 5.1 技术债务

| 问题 | 影响 | 解决方案 |
|---|---|---|
| CLI 部署 41002 错误 | 无法自动化部署 | 手动右键部署可正常工作 |
| 无后台清理 Worker | 孤儿文件需手动重试 | 已有 `retryCleanupManifests` API |
| 无审核后台 | 需人工操作数据库 | P1 规划 |

### 5.2 阻塞上线的硬性条件

1. **数据迁移未完成** → 无法保证历史数据一致性
2. **索引未创建** → 无法保证并发幂等
3. **隐私声明未提交** → 微信审核必拒
4. **音乐授权未解决** → 版权风险

---

## 6. 下次继续开发的步骤

### 6.1 环境检查

```bash
# 1. 检查微信开发者工具登录
'/Applications/wechatwebdevtools.app/Contents/MacOS/cli' islogin --port 27126

# 2. 检查云函数状态
'/Applications/wechatwebdevtools.app/Contents/MacOS/cli' cloud functions info \
  --port 27126 --env 'cloud1-d6gh3spr3b2bd51d8' \
  --names login sign ugc --project '/Users/lijunpeng/Desktop/workbuddy_project/miniapp'

# 3. 验证 server_build
# 在云函数测试面板调用 ugc/getMyPosts，检查返回的 server_build
```

### 6.2 建议继续顺序

1. **P0 #4 数据迁移**（1-2 天）
   - 备份 `ugc_posts`
   - 迁移状态/作者名/图片路径
   - 创建复合索引

2. **P0 #9 隐私声明**（并行）
   - 确认运营主体联系渠道
   - 提交公众平台

3. **P0 #5 审核演练**（0.5-1 天）
   - 指定负责人
   - 完成 `pending → approved` 演练

4. **P0 #6/#7 双账号验证**（1-2 天）
   - 准备 2 个微信号
   - 真机测试

5. **P0 #11 提审发布**（最后）

---

## 7. 关键文件清单

### 7.1 必须阅读

- `HANDOFF-CODEX-2026-07-28.md` - 最新详细交接
- `docs/product/上线前操作指南.md` - 上线步骤
- `docs/product/UGC内容审核与清理操作规程.md` - 审核流程
- `docs/technical/TECH_STATUS.md` - 技术状态
- `miniapp/PROJECT_PROGRESS.md` - 项目进度

### 7.2 核心代码

- `miniapp/pages/contribute/contribute.js` - UGC 投稿页
- `miniapp/utils/ugc.js` - UGC 客户端逻辑
- `miniapp/cloudfunctions/ugc/index.js` - UGC 云函数
- `miniapp/utils/account-scope.js` - 账号隔离

### 7.3 测试

- `scripts/testing/test-p0-regressions.js` - 主回归测试
- `scripts/testing/test-upload-cleanup.js` - 孤儿上传测试

---

## 8. 联系方式与资源

### 8.1 账号信息

- **小程序 AppID**：`wx3ce1ffb49a3b24e4`
- **云环境 ID**：`cloud1-d6gh3spr3b2bd51d8`
- **微信开发者工具端口**：`27126`

### 8.2 相关文档链接

- [微信公众平台](https://mp.weixin.qq.com)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

---

## 9. 搁置前最后状态

- **Git 分支**：`main`
- **工作树状态**：clean（无未提交改动）
- **最后提交**：`c381467` - 更新部署状态
- **云端状态**：login/sign/ugc 已部署，server_build=p0-4
- **测试状态**：全部通过

---

## 10. 快速恢复检查清单

下次继续时，按此清单检查：

```markdown
- [ ] 微信开发者工具已启动，端口 27126
- [ ] islogin 返回 true
- [ ] 云函数 info 显示 Active
- [ ] getMyPosts 返回 server_build=p0-4
- [ ] 运行 test-p0-regressions.js 通过
- [ ] 确认运营主体隐私联系渠道
- [ ] 准备 2 个真实微信号
```

---

**文档结束**

如有疑问，先阅读 `HANDOFF-CODEX-2026-07-28.md`，那是目前最详细的交接文档。
