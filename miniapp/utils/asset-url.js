// 云端产品素材地址。
// 本地源文件保留在 assets/images 便于维护，但通过 project.config.json
// 排除出上传包；运行时批量换取临时 HTTPS 地址，避免开放整个存储桶。
const CLOUD_IMAGE_FILE_ROOT =
  'cloud://cloud1-d6gh3spr3b2bd51d8.636c-cloud1-d6gh3spr3b2bd51d8-1449934595/app-assets/images';

const LOCAL_IMAGE_PREFIX = '/assets/images/';
const TEMP_URL_BATCH_SIZE = 50;
const tempUrlCache = new Map();

function toCloudFileId(path) {
  if (typeof path !== 'string' || !path.startsWith(LOCAL_IMAGE_PREFIX)) {
    return path;
  }

  return `${CLOUD_IMAGE_FILE_ROOT}/${path.slice(LOCAL_IMAGE_PREFIX.length)}`;
}

function getTempFileUrls(fileIds) {
  const missing = Array.from(new Set(fileIds)).filter(fileId => !tempUrlCache.has(fileId));
  if (!missing.length) {
    return Promise.resolve(tempUrlCache);
  }

  if (typeof wx === 'undefined' || !wx.cloud || !wx.cloud.callFunction) {
    return Promise.resolve(tempUrlCache);
  }

  const batches = [];
  for (let i = 0; i < missing.length; i += TEMP_URL_BATCH_SIZE) {
    batches.push(missing.slice(i, i + TEMP_URL_BATCH_SIZE));
  }

  return Promise.all(batches.map(batch => new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'getStudyData',
      data: {
        action: 'getAssetUrls',
        fileList: batch,
      },
      success: (res) => {
        const result = (res && res.result) || {};
        const failed = [];
        if (result.code !== 0) {
          console.warn('[assets] 云端图片地址批量获取失败');
          resolve();
          return;
        }
        (result.fileList || []).forEach(file => {
          if (file.status === 0 && file.tempFileURL) {
            tempUrlCache.set(file.fileID, file.tempFileURL);
          } else {
            failed.push({
              status: file.status,
              errMsg: file.errMsg || 'unknown',
            });
          }
        });
        if (failed.length) {
          const first = failed[0];
          console.warn(
            '[assets] 云端图片地址获取失败',
            failed.length,
            '项，首项状态：',
            first.status,
            first.errMsg
          );
        }
        resolve();
      },
      fail: () => {
        console.warn('[assets] 云端图片地址批量获取失败');
        resolve();
      },
    });
  }))).then(() => tempUrlCache);
}

function collectImagePaths(value, output) {
  if (Array.isArray(value)) {
    value.forEach(item => collectImagePaths(item, output));
    return;
  }

  if (!value || typeof value !== 'object') return;

  Object.keys(value).forEach(key => {
    const child = value[key];
    if ((key === 'coverImage' || key === 'refCover') &&
        typeof child === 'string' &&
        child.startsWith(LOCAL_IMAGE_PREFIX)) {
      output.push(child);
      return;
    }
    collectImagePaths(child, output);
  });
}

function replaceImagePaths(value, cache) {
  if (Array.isArray(value)) {
    return value.map(item => replaceImagePaths(item, cache));
  }

  if (!value || typeof value !== 'object') return value;

  const result = {};
  Object.keys(value).forEach(key => {
    const child = value[key];
    if ((key === 'coverImage' || key === 'refCover') &&
        typeof child === 'string' &&
        child.startsWith(LOCAL_IMAGE_PREFIX)) {
      result[key] = cache.get(toCloudFileId(child)) || '';
      return;
    }
    result[key] = replaceImagePaths(child, cache);
  });
  return result;
}

function resolveAssetTree(value) {
  const imagePaths = [];
  collectImagePaths(value, imagePaths);
  if (!imagePaths.length) return Promise.resolve(value);

  const fileIds = imagePaths.map(toCloudFileId);
  return getTempFileUrls(fileIds).then(cache => replaceImagePaths(value, cache));
}

module.exports = {
  CLOUD_IMAGE_FILE_ROOT,
  toCloudFileId,
  getTempFileUrls,
  resolveAssetTree,
};
