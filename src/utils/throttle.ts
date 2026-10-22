/**
 * 函数节流
 * @param fn
 * @param t
 * @returns {Function}
 */
export const Throttle = (fn, t) => {
  const delay = t || 500
  let isFirstClick = true

  return function () {
    if (isFirstClick) {
      // eslint-disable-next-line prefer-rest-params
      fn.apply(this, arguments) // 如果是第一次点击，则执行函数

      isFirstClick = false // 标记已经点击过

      // 设置定时器，在指定的时间后重置 isFirstClick
      setTimeout(() => {
        isFirstClick = true
      }, delay)
    }

    // 如果不是第一次点击，什么也不做
  }
}

/**
 * 函数节流
 * @param fn
 * @param delay
 * @returns {(function(...[*]): (Promise<unknown>))|*}
 * @constructor
 */
export const ThrottleAsync = (fn, delay = 500) => {
  let lastTime = 0 // 上一次执行的时间
  let timer

  return function (...args) {
    const now = Date.now()

    // 如果距离上次执行的时间不足，设置定时器延迟执行
    if (now - lastTime < delay) {
      if (timer) {
        clearTimeout(timer) // 清除之前的定时器
      }

      return new Promise((resolve, reject) => {
        timer = setTimeout(
          () => {
            lastTime = Date.now()
            try {
              const result = fn(...args)
              if (result instanceof Promise) {
                result.then(resolve).catch(reject)
              } else {
                resolve(result)
              }
            } catch (error) {
              reject(error)
            }
          },
          delay - (now - lastTime),
        )
      })
    }

    // 否则立即执行
    lastTime = now

    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result // 异步函数直接返回
      }
      return Promise.resolve(result) // 同步函数包装为 Promise
    } catch (error) {
      return Promise.reject(error) // 同步函数错误包装为 Promise.reject
    }
  }
}
