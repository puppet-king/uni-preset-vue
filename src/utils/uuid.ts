/**
 * 生成 UUID (兼容阿里云 32 位要求)
 * @param {boolean} format 是否去除连字符 "-"
 * @returns {string}
 */
export const uuid = (format: boolean = false): string => {
  const s = []
  const hexDigits = '0123456789abcdef'

  // 1. 生成 36 位基础随机序列
  for (let i = 0; i < 36; i++) {
    // 直接用下标获取单个字符，最安全且等价于 substr(x, 1)
    s[i] = hexDigits[Math.floor(Math.random() * 0x10)]
  }

  // 2. 按照 UUID v4 规范修改特定位
  s[14] = '4'

  // 3. 修改第 19 位 (这里直接用下标取值，避免 slice 逻辑混乱)
  const pos19 = (parseInt(s[19], 16) & 0x3) | 0x8
  s[19] = hexDigits[pos19]

  // 4. 添加连字符
  s[8] = s[13] = s[18] = s[23] = '-'

  const res = s.join('')

  // 5. 如果 format 为 true，返回 32 位不带连字符的 ID
  if (format) {
    return res.replace(/-/g, '')
  }
  return res
}
