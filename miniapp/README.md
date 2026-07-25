# 妙不可园微信小程序

原生微信小程序项目，当前包含休闲与学习两个模式。

---

## 1. 快速运行

1. 打开微信开发者工具。
2. 导入当前目录 `miniapp/`。
3. AppID 可使用测试号。
4. 当前默认使用 Mock 数据，无需启动后端。

---

## 2. 当前功能

### 2.1 休闲模式

- 首页六雅宫格。
- 每日推荐。
- 混合内容流。
- 茶库列表、分类、排序、搜索。
- 茶品详情、雷达图、冲泡参数、关联内容、点评、点赞、推荐。
- 茶品对比。
- 行旅列表与详情。
- 养生、香道、音乐、电影列表与详情。
- 全局搜索。
- 跨板块书签。
- 个人中心、画像、历史、偏好、通知、订阅。

### 2.2 学习模式

- 学习首页。
- 教程列表与详情。
- 知识列表与详情。
- 面试题库。
- 面试题详情。
- 复习队列。
- 本地学习进度。

---

## 3. 当前数据规模

| 数据域 | 数量 |
|---|---:|
| 茶品 | 60 |
| 行旅专题 | 6 |
| 养生内容 | 14 |
| 香道内容 | 12 |
| 音乐内容 | 12 |
| 电影内容 | 12 |
| 教程 | 3（本地精简版）/ 18（完整数据集） |
| 知识 | 3（本地精简版）/ 18（完整数据集） |
| 面试专题文件 | 18 |
| 面试题 | 90（本地精简版）/ 901（完整数据集） |

---

## 4. 目录结构

```text
miniapp/
├── app.js
├── app.json
├── app.wxss
├── assets/
│   ├── icons/
│   └── images/
├── components/
│   ├── audio-player/
│   ├── content-card/
│   ├── domain-tag/
│   ├── empty-state/
│   ├── radar-chart/
│   ├── review-modal/
│   └── tea-card/
├── data/
│   └── study/
│       ├── topics/
│       ├── index.js
│       ├── tutorials.js
│       ├── knowledge.js
│       ├── interview.js
│       └── taxonomy.js
├── pages/
├── services/
├── store/
├── subpackages/
└── utils/
```

---

## 5. 页面结构

### 主包页面

| 页面 | 路径 |
|---|---|
| 首页 | `pages/index/index` |
| 茶 | `pages/tea/tea` |
| 游 | `pages/travel/travel` |
| 养 | `pages/wellness/wellness` |
| 香 | `pages/incense/incense` |
| 音 | `pages/music/music` |
| 影 | `pages/film/film` |
| 学习首页 | `pages/study/index` |
| 教程 | `pages/study/tutorials` |
| 知识 | `pages/study/knowledge` |
| 面试 | `pages/study/interview` |
| 复习 | `pages/study/review` |
| 书签 | `pages/bookmark/bookmark` |
| 我的 | `pages/profile/profile` |
| 编辑资料 | `pages/edit-profile/edit-profile` |
| 偏好设置 | `pages/preferences/preferences` |
| 历史 | `pages/history/history` |
| 通知设置 | `pages/notification-settings/notification-settings` |
| 订阅 | `pages/subscribe/subscribe` |
| 隐私 | `pages/privacy/privacy` |
| 协议 | `pages/agreement/agreement` |

### 分包页面

| 页面 | 路径 |
|---|---|
| 茶详情 | `subpackages/detail/tea-detail/tea-detail` |
| 行旅详情 | `subpackages/detail/travel-detail/travel-detail` |
| 通用内容详情 | `subpackages/detail/content-detail/content-detail` |
| 学习详情 | `subpackages/detail/study-detail/study-detail` |
| 面试题详情 | `subpackages/detail/question-detail/question-detail` |
| 茶品对比 | `subpackages/detail/compare/compare` |
| 搜索 | `subpackages/search/pages/search/search` |

---

## 6. 服务层

页面应优先依赖 `services/`，不要直接读取 `utils/mock.js` 或 `utils/data-store.js`。

| 服务 | 职责 |
|---|---|
| `home.js` | 首页聚合 |
| `tea.js` | 茶列表、详情、搜索、点评、推荐 |
| `travel.js` | 行旅列表、详情、brief |
| `content.js` | 通用内容详情入口 |
| `wellness.js` | 养生列表/详情 |
| `incense.js` | 香道列表/详情 |
| `music.js` | 音乐列表/详情 |
| `film.js` | 电影列表/详情 |
| `search.js` | 全局搜索与联想 |
| `collection.js` | 书签、域元信息、实体解析 |
| `history.js` | 浏览历史 |
| `user.js` | 用户资料 |
| `preferences.js` | 偏好设置 |
| `notification-settings.js` | 通知设置 |

---

## 7. 数据流

```text
Page
  -> services/*
    -> utils/request.js
      -> mockHandler 或真实 HTTP
        -> utils/mock.js
          -> utils/data-store.js / data/study/*
```

`request.js` 已经支持 `enableMock` 开关。后端接入时，服务层函数签名尽量不变，只替换内部请求实现。

---

## 8. 图片资源

当前本地图片集中在：

```text
assets/images/
├── tea/       10 张
├── travel/     6 张
├── wellness/   5 张
├── incense/    4 张
├── music/      4 张
├── film/       4 张
└── 根目录封面、logo、avatar 等
```

当前目标是继续清理 placeholder、统一命名、压缩体积，保持图片与内容实体一一对应。

---

## 9. 待完成

| 事项 | 说明 |
|---|---|
| 真实登录 | 接入 `wx.login`、token、用户资料同步 |
| 云端书签 | 替换本地 Storage 收藏 |
| 云端学习进度 | 面试题复习状态跨设备同步 |
| 云端点评/点赞 | 茶详情互动数据同步 |
| CMS | 内容和题库后台管理 |
| 图片治理 | 替换 placeholder、压缩、统一授权来源 |
| 页面去 mock 化 | 继续清理少量页面对 mock 的直接依赖 |

---

## 10. 开发约束

1. 页面只处理交互和展示。
2. 数据获取统一进入 `services/`。
3. 本地数据只允许在 `mock`、服务 mockHandler 或数据文件中出现。
4. 收藏域元信息以 `services/collection.js` 为准。
5. 学习进度以 `utils/study-progress.js` 为本地实现，未来迁移 API。
6. 文档必须以当前代码事实为准，不保留过时 MVP 口径。