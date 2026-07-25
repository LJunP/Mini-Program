# data/ 数据备份与云端资源目录

本目录存放小程序的备份数据、云端部署资源和 CDN 备份资源。

---

## 目录结构

```text
data/
├── README.md                          # 本文件
├── study_data.json                    # 完整学习数据集（JSON 格式，供云端部署）
├── study_data.enc                     # 完整学习数据集（RC4 加密版）
└── cdn_backup/                        # CDN 备份区（提审瘦身时移出的资源）
    ├── assets/
    │   └── images/                    # 大体积图片备份（封面、内容图等）
    │       ├── tea/                   # 茶品图片
    │       ├── travel/                # 行旅图片
    │       ├── wellness/              # 养生图片
    │       ├── incense/               # 香道图片
    │       ├── music/                 # 音乐图片
    │       ├── film/                  # 电影图片
    │       ├── cover-*.jpg            # 各板块封面图
    │       ├── logo.jpg               # 品牌 Logo
    │       └── default-avatar.jpg     # 默认头像
    ├── data-store_original.js         # data-store.js 的原始完整版本
    └── study/                         # 学习数据备份
        ├── tutorials.js               # 精简版教程备份（3 篇）
        ├── knowledge.js               # 精简版知识备份（3 篇）
        ├── topics/                    # 精简版面试题备份（每专题5题，共90题）
        └── topics_original/           # 完整版面试题备份（每专题50题，共901题）
```

---

## 文件说明

### study_data.json
完整的云端就绪数据集，包含：
- 18 篇教程
- 18 篇知识科普
- 901 道面试题（18 个专题）

该文件由 `scripts/ops/build-cloud-json.js` 脚本生成，体积约 3.9MB，适合通过云开发数据库批量导入。

### study_data.enc
`study_data.json` 的 RC4 加密版本，由 `scripts/ops/encrypt-study-db.js` 生成。用于小程序端本地解密加载完整题库（无需网络请求时的离线方案）。

### cdn_backup/
提审瘦身时由 `scripts/ops/prepare-release.js` 脚本将大体积资源从 `miniapp/` 移至此处备份。开发时可通过 `scripts/ops/restore-dev.js` 恢复。

---

## 与 miniapp 本地数据的关系

| 数据 | miniapp 本地（精简版） | data/ 完整版 | 说明 |
|---|---:|---:|---|
| 教程 | 3 篇 | 18 篇 | 本地仅保留提审精简版 |
| 知识 | 3 篇 | 18 篇 | 本地仅保留提审精简版 |
| 面试题 | 90 道 | 901 道 | 本地每专题仅保留5题 |
| 茶品 | 60 款 | — | 无差异，均在 miniapp 本地 |
| 图片 | 精简集 | 18MB 备份 | 大图已移至 cdn_backup |
