# 妙不可园 API 接口文档

本文档描述未来后端 API 的目标协议。当前小程序默认使用 `utils/request.js` 的 `mockHandler`，服务层已经按照这些接口边界组织。

---

## 1. 通用协议

### 1.1 基础约定

| 项 | 约定 |
|---|---|
| Base URL | `/v1` |
| Content-Type | `application/json; charset=utf-8` |
| 鉴权 | `Authorization: Bearer <access_token>` |
| 时间 | ISO 8601 |
| 分页 | `page` 从 1 开始，`pageSize` 默认 20 |

### 1.2 统一响应

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "requestId": "req_xxx"
}
```

### 1.3 分页响应

```json
{
  "list": [],
  "total": 0,
  "page": 1,
  "pageSize": 20,
  "hasMore": false
}
```

---

## 2. Domain 枚举

| domain | 名称 | 当前前端状态 |
|---|---|---|
| `tea` | 茶 | 已实现 |
| `travel` | 游 | 已实现 |
| `wellness` | 养 | 已实现 |
| `incense` | 香 | 已实现 |
| `music` | 音 | 已实现 |
| `film` | 影 | 已实现 |
| `tutorial` | 教程 | 已实现 |
| `knowledge` | 知识 | 已实现 |
| `interview` | 面试 | 已实现 |

---

## 3. 鉴权接口

### 3.1 微信登录

```http
POST /v1/auth/login
```

请求：

```json
{
  "code": "wx_login_code",
  "nickname": "林深",
  "avatarUrl": "https://...",
  "inviteCode": "FY001"
}
```

响应：

```json
{
  "accessToken": "access_token",
  "refreshToken": "refresh_token",
  "expiresIn": 7200,
  "user": {
    "id": "user_001",
    "openid": "openid",
    "nickname": "林深",
    "avatarUrl": "https://..."
  }
}
```

### 3.2 刷新 Token

```http
POST /v1/auth/refresh
```

---

## 4. 首页接口

当前前端服务：`services/home.js`

### 4.1 首页聚合

```http
GET /v1/home?mode=leisure
```

响应：

```json
{
  "daily": {
    "tea": {},
    "travel": {},
    "incense": {},
    "music": {},
    "film": {}
  },
  "feed": [
    {
      "type": "tea",
      "domain": "tea",
      "data": {}
    }
  ],
  "studyHome": null
}
```

学习模式：

```http
GET /v1/home?mode=study
```

---

## 5. 茶接口

当前前端服务：`services/tea.js`

### 5.1 茶品列表

```http
GET /v1/teas?category=green&sort=hot&page=1&pageSize=20
```

响应：分页结构。

### 5.2 茶品详情

```http
GET /v1/teas/{teaId}
```

响应字段应包含：

```json
{
  "id": "tea_001",
  "name": "西湖龙井",
  "category": "green",
  "origin": "浙江杭州西湖",
  "tasteProfile": {},
  "brewing": {},
  "scenes": [],
  "styleTags": [],
  "coverImage": "/assets/images/tea/longjing.jpg",
  "relatedTravel": [],
  "relatedWellness": []
}
```

### 5.3 茶品分类

```http
GET /v1/teas/categories
```

### 5.4 茶品搜索

```http
GET /v1/teas/search?keyword=龙井&limit=10
```

### 5.5 茶品点评

```http
GET /v1/teas/{teaId}/reviews?limit=3
POST /v1/teas/{teaId}/reviews
```

### 5.6 茶品推荐

```http
GET /v1/teas/{teaId}/recommendations?category=green&limit=3
```

---

## 6. 行旅接口

当前前端服务：`services/travel.js`

```http
GET /v1/destinations
GET /v1/destinations/{travelId}
GET /v1/destinations/{travelId}/brief
```

详情响应应包含：

```json
{
  "id": "travel_001",
  "title": "武夷山行",
  "destination": {},
  "essay": "...",
  "routes": [],
  "linkedItems": [
    {
      "domain": "tea",
      "refId": "tea_021",
      "name": "武夷岩茶",
      "coverImage": "...",
      "context": "..."
    }
  ]
}
```

---

## 7. 通用内容接口

当前前端服务：`services/content.js` 聚合以下服务：

- `services/wellness.js`
- `services/incense.js`
- `services/music.js`
- `services/film.js`

### 7.1 内容详情

```http
GET /v1/contents/{domain}/{id}
```

建议后端直接提供统一接口，替代当前多个板块服务。

响应：

```json
{
  "id": "wellness_001",
  "domain": "wellness",
  "title": "春季养肝",
  "body": "...",
  "tips": [],
  "linkedTeas": [],
  "relatedTravel": []
}
```

---

## 8. 搜索接口

当前前端服务：`services/search.js`

### 8.1 全局搜索

```http
GET /v1/search?keyword=龙井&sortBy=relevance&difficulty=0&teaCategory=all&priceRange=all
```

响应：

```json
{
  "tea": [],
  "travel": [],
  "wellness": [],
  "incense": [],
  "music": [],
  "film": []
}
```

### 8.2 搜索建议

```http
GET /v1/search/suggestions?keyword=龙
```

---

## 9. 收藏接口

当前前端服务：`services/collection.js`

```http
GET /v1/collections?domain=all
POST /v1/collections
DELETE /v1/collections/{domain}/{refId}
GET /v1/collections/check?domain=tea&refId=tea_001
```

收藏对象采用多态引用：

```json
{
  "targetDomain": "tea",
  "targetRefId": "tea_001",
  "note": "西湖龙井"
}
```

---

## 10. 学习接口

当前数据目录：`miniapp/data/study/`

### 10.1 学习首页

```http
GET /v1/study/home
```

### 10.2 教程

```http
GET /v1/study/tutorials
GET /v1/study/tutorials/{id}
```

### 10.3 知识

```http
GET /v1/study/knowledge
GET /v1/study/knowledge/{id}
```

### 10.4 面试题

```http
GET /v1/study/interviews?track=backend&topic=database&type=baguwen&difficulty=2
GET /v1/study/interviews/{id}
```

### 10.5 学习进度

```http
GET /v1/study/progress
PUT /v1/study/progress/{itemId}
GET /v1/study/review
```

---

## 11. 用户资产接口

```http
GET /v1/users/me
PUT /v1/users/me
GET /v1/history
DELETE /v1/history
GET /v1/preferences
PUT /v1/preferences
GET /v1/notification-settings
PUT /v1/notification-settings
```

---

## 12. 埋点接口

当前前端服务：`utils/tracker.js`

```http
POST /v1/events/batch
```

请求：

```json
{
  "events": [
    {
      "eventName": "page_view",
      "pagePath": "pages/index/index",
      "targetDomain": "tea",
      "targetRefId": "tea_001",
      "eventParams": {},
      "clientTime": "2026-07-03T10:00:00.000Z"
    }
  ]
}
```

---

## 13. 错误码

| code | 含义 |
|---:|---|
| 0 | 成功 |
| 1001 | token 过期 |
| 1002 | 未登录 |
| 1003 | 无权限 |
| 2001 | 参数错误 |
| 3001 | 内容不存在 |
| 4001 | 请求过于频繁 |
| 5000 | 服务端错误 |