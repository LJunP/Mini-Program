// miniapp/utils/crypto.js — 纯 JS 极轻量 RC4-Base64 数据解密工具
// 专为小程序环境设计，避免引入庞大的第三方 crypto 库以节省包体体积。

// 1. RC4 字节流加解密算法
function rc4Bytes(key, bytes) {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  let j = 0;
  const keyLen = key.length;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % keyLen)) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
  }
  let i = 0;
  j = 0;
  const resBytes = new Uint8Array(bytes.length);
  for (let y = 0; y < bytes.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
    resBytes[y] = bytes[y] ^ s[(s[i] + s[j]) % 256];
  }
  return resBytes;
}

// 2. UTF-8 字节数组转 JS 字符串（完美支持中文与 Emoji）
function bytesToString(bytes) {
  // 第一优先级：利用微信官方文件系统进行硬解码。
  // 通过 C++ 底层的高速文件读写器来进行 utf8 转换，无内存溢出，100% 支持所有字符集和表情！
  try {
    const fs = wx.getFileSystemManager();
    const tempPath = `${wx.env.USER_DATA_PATH}/temp_study_data.bin`;
    // 写入 ArrayBuffer
    fs.writeFileSync(tempPath, bytes.buffer);
    // 用 utf8 读出字符串
    const str = fs.readFileSync(tempPath, 'utf8');
    // 清理临时文件
    try { fs.unlinkSync(tempPath); } catch (e) {}
    return str;
  } catch (err) {
    // 忽略错误，降级走标准解码
  }

  // 第二优先级：标准的 TextDecoder 硬解
  if (typeof TextDecoder !== 'undefined') {
    try {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    } catch (e) {
      // 降级走纯 JS 循环解码
    }
  }

  // 第三优先级：自研的纯 JS 循环解码（支持 1-4 字节 Emoji 表情）
  let out = "";
  let i = 0;
  const len = bytes.length;
  while (i < len) {
    let c = bytes[i++];
    switch (c >> 4) { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        out += String.fromCharCode(((c & 0x1F) << 6) | (bytes[i++] & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((bytes[i++] & 0x3F) << 6) |
                       ((bytes[i++] & 0x3F) << 0));
        break;
      case 15:
        // 1111 0xxx  10xx xxxx  10xx xxxx  10xx xxxx (4字节，Emoji)
        const u = (((c & 0x07) << 18) |
                   ((bytes[i++] & 0x3F) << 12) |
                   ((bytes[i++] & 0x3F) << 6) |
                   (bytes[i++] & 0x3F)) - 0x10000;
        out += String.fromCharCode(0xD800 + (u >> 10), 0xDC00 + (u & 0x3FF));
        break;
    }
  }
  return out;
}

// 3. 对外导出的解密主方法
function decryptData(base64Data, secretKey) {
  if (!base64Data) return '';
  // 使用微信小程序原生的高性能 Base64 解码
  const arrayBuffer = wx.base64ToArrayBuffer(base64Data.trim());
  const encryptedBytes = new Uint8Array(arrayBuffer);
  const decryptedBytes = rc4Bytes(secretKey, encryptedBytes);
  return bytesToString(decryptedBytes);
}

module.exports = {
  decryptData
};
