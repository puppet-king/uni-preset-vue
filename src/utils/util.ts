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

import SparkMD5 from 'spark-md5'

/**
 * 计算对象的 MD5 哈希值
 * @param data - 需要计算哈希的对象
 * @returns MD5 哈希字符串（32位16进制）
 */
const calculateHash = (data: unknown): string => {
  // 将对象转换为字符串
  const dataString = typeof data === 'string' ? data : JSON.stringify(data)
  // 使用 spark-md5 计算 MD5
  return SparkMD5.hash(dataString)
}

// 获取距离当天结束（次日0点）的秒数
const getSecondsUntilMidnight = () => {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

export {
  formatTime,
  utctimestamp,
  sleep,
  padding2,
  formatNumber,
  base64ToArrayBuffer,
  calculateHash,
  getSecondsUntilMidnight,
}
