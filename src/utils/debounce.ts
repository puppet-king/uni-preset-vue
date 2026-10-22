/**
 * 函数防抖 (单位时间内执行最后一次操作)
 * @param fn - 需要防抖的函数
 * @param t - 延迟时间(毫秒)
 */
export const Debounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  t?: number,
): ((...args: Parameters<T>) => void) => {
  const delay = t || 500
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 异步函数防抖 (单位时间内执行最后一次操作)
 * @param fn - 需要防抖的异步函数
 * @param delay - 延迟时间(毫秒)
 */
export const DebounceAsync = <T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  delay = 500,
): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    if (timer) {
      clearTimeout(timer) // 清除上一次的定时器
    }

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        timer = null // 清空定时器引用
        try {
          const result = (await fn(...args)) as Awaited<ReturnType<T>> // 执行原始函数
          resolve(result) // 成功时返回结果
        } catch (error) {
          reject(error) // 捕获并返回错误
        }
      }, delay)
    })
  }
}
