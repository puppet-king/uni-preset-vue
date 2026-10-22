import aesjs from 'aes-js'
import { decode as base64ToArrayBuffer, encode as arrayBufferToBase64 } from 'base64-arraybuffer'
import cache from '@/utils/cache'

export interface UserKeyData {
  encryptKey: string
  iv: string
  version: number
  expireTime?: number
}

export interface EncryptedResult {
  encryptedData: string
  userKey: UserKeyData
}

const USER_CRYPTO_KEY_CACHE_TAG = 'WX_USER_CRYPTO_LATEST_KEY'

function base64ToBytes(base64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(base64))
}

function bytesToBase64(bytes: Uint8Array): string {
  return arrayBufferToBase64(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer)
}

/**
 * 加密 (AES-CBC + PKCS7 + Base64)
 */
export function AESEncryptMethod(AESKey: string, iv: string, data: string): string {
  // 1. 将 Base64 编码的 AESKey 解码为 16 字节密钥
  const keyBytes = base64ToBytes(AESKey)

  // 2. 将 16 字符的 IV 转为字节
  const ivBytes = aesjs.utils.utf8.toBytes(iv)

  // 3. 将明文字符串转为字节数组并执行 PKCS7 填充
  const textBytes = aesjs.utils.utf8.toBytes(data)
  const paddedBytes = aesjs.padding.pkcs7.pad(textBytes)

  // 4. 使用 AES-CBC 模式加密
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes)
  const encryptedBytes = aesCbc.encrypt(paddedBytes)

  // 5. 转为 Base64 字符串
  return bytesToBase64(encryptedBytes)
}

/**
 * 解密 (AES-CBC + PKCS7 + Base64)
 */
export function AESDecryptMethod<T = any>(AESKey: string, iv: string, data: string, needJson = true): T {
  // 1. 将 Base64 编码的 AESKey 解码为 16 字节密钥
  const keyBytes = base64ToBytes(AESKey)

  // 2. 将 16 字符的 IV 转为字节
  const ivBytes = aesjs.utils.utf8.toBytes(iv)

  // 3. 将后端返回的 Base64 密文解码为字节数组
  const encryptedBytes = base64ToBytes(data)

  // 4. 使用 AES-CBC 模式解密
  const aesCbcDecrypt = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes)
  const decryptedBytes = aesCbcDecrypt.decrypt(encryptedBytes)

  // 5. 去除 PKCS7 填充并转为 UTF-8 字符串
  const unpaddedBytes = aesjs.padding.pkcs7.strip(decryptedBytes)
  const decryptedText = aesjs.utils.utf8.fromBytes(unpaddedBytes)

  if (needJson) {
    return JSON.parse(decryptedText) as T
  }

  return decryptedText as unknown as T
}

/**
 * 获取微信最新用户加密密钥 (优先读取 cache 缓存，未命中或过期则调用 wx.getUserCryptoManager)
 */
export async function getLatestUserKey(force = false): Promise<UserKeyData> {
  if (!force) {
    const cached = await cache.getAsync<UserKeyData>(USER_CRYPTO_KEY_CACHE_TAG)
    if (cached && cached.encryptKey && cached.iv && typeof cached.version === 'number') {
      return cached
    }
  }

  const userCryptoManager = wx.getUserCryptoManager()

  return new Promise<UserKeyData>((resolve, reject) => {
    userCryptoManager.getLatestUserKey({
      async success(res) {
        try {
          const userKey: UserKeyData = {
            encryptKey: res.encryptKey,
            iv: res.iv,
            version: res.version,
            expireTime: res.expireTime,
          }

          // 计算相对过期秒数 (留 30 秒缓冲，避免临界过期)
          const nowSec = Math.floor(Date.now() / 1000)
          const expireSec =
            res.expireTime && res.expireTime > nowSec ? Math.max(60, res.expireTime - nowSec - 30) : 3600

          await cache.setAsync(USER_CRYPTO_KEY_CACHE_TAG, userKey, expireSec)
          resolve(userKey)
        } catch (e) {
          reject(e)
        }
      },
      fail(err) {
        console.error('[Crypto] getLatestUserKey fail:', err)
        reject(new Error(err?.errMsg || '获取用户加密密钥失败'))
      },
    })
  })
}

/**
 * 加密数据方法
 * @param data 待加密的数据 (支持对象或字符串)
 * @returns 密文字符串以及本次加密所用的 userKey 信息
 */
export async function encryptData(data: unknown): Promise<EncryptedResult> {
  const userKey = await getLatestUserKey()
  const rawStr = typeof data === 'string' ? data : JSON.stringify(data)
  const encryptedData = AESEncryptMethod(userKey.encryptKey, userKey.iv, rawStr)
  return {
    encryptedData,
    userKey,
  }
}

/**
 * 解密数据方法 (泛型支持)
 * @param userKey 用户加密密钥参数
 * @param ciphertext 密文字符串 (hex 格式)
 * @param isJson 是否将解密结果解析为 JSON 对象，默认为 true
 */
export async function decryptData<T = any>(userKey: UserKeyData, ciphertext: string, isJson?: true): Promise<T>

export async function decryptData(userKey: UserKeyData, ciphertext: string, isJson: false): Promise<string>

export async function decryptData<T = any>(
  userKey: UserKeyData,
  ciphertext: string,
  isJson: boolean = true,
): Promise<any> {
  if (!ciphertext) {
    throw new Error('解密失败：密文字符串为空')
  }
  if (!userKey?.encryptKey || !userKey?.iv) {
    throw new Error('解密失败：缺少密钥或初始向量')
  }

  try {
    return AESDecryptMethod<T>(userKey.encryptKey, userKey.iv, ciphertext, isJson)
  } catch (err) {
    console.error('[Crypto] decryptData error:', err)
    throw new Error('数据解密或解析失败')
  }
}
