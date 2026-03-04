/**
 * 格式化数字，不足两位补零
 */
const formatNumber = (n: number): string => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

/**
 * 格式化日期时间
 */
const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('_')}_${[hour, minute, second].map(formatNumber).join('_')}`
}

/**
 * 数字补零（两位）
 */
const padding2 = (t: number): string => {
  if (t < 10) {
    return `0${t}`
  }
  return `${t}`
}

/**
 * 获取 UTC 时间戳
 */
const utctimestamp = (): string => {
  const date = new Date()
  const YYYY = date.getUTCFullYear()
  const MM = padding2(date.getUTCMonth() + 1)
  const DD = padding2(date.getUTCDate())
  const HH = padding2(date.getUTCHours())
  const mm = padding2(date.getUTCMinutes())
  const ss = padding2(date.getUTCSeconds())
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`
}

/**
 * 延迟函数
 */
const sleep = (milSec: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, milSec)
  })
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // 1. 去除可能存在的 Data URL 前缀
  const base64Data = base64.replace(/^data:audio\/\w+;base64,/, '')

  // 2. 使用微信小程序环境支持的全局 buffer 转换 (如果支持)
  // 或者手动解码
  const binaryString = atob(base64Data) // 小程序基础库较新版本已支持 atob
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes.buffer
}

export { formatTime, utctimestamp, sleep, padding2, formatNumber, base64ToArrayBuffer }
