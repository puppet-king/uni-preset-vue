/**
 * 函数防抖 (只执行最后一次操作)
 * @param fn
 * @param t
 */
export const Debounce = (fn, t) => {
  const delay = t || 500
  let timer
  return function(...args) {
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
 * 函数防抖 (只执行最后一次操作)
 */
export const DebounceAsync = (fn, delay = 500) => {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer) // 清除上一次的定时器
    }

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        timer = null // 清空定时器引用
        try {
          const result = await fn(...args) // 执行原始函数
          resolve(result) // 成功时返回结果
        } catch (error) {
          reject(error) // 捕获并返回错误
        }
      }, delay)
    })
  }
}


/**
 * 函数节流
 * @param fn
 * @param t
 * @returns {Function}
 */
export const Throttle = (fn, t) => {
  const delay = t || 500
  let isFirstClick = true

  return function() {
    if (isFirstClick) {
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

  return function(...args) {
    const now = Date.now()

    // 如果距离上次执行的时间不足，设置定时器延迟执行
    if (now - lastTime < delay) {
      if (timer) {
        clearTimeout(timer) // 清除之前的定时器
      }

      return new Promise((resolve, reject) => {
        timer = setTimeout(() => {
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
        }, delay - (now - lastTime))
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

export const timeFormat = (time, fmt = "yyyy-MM-dd hh:mm:ss", targetTimezone = 8) => {
  try {
    if (!time) {
      return ""
    }
    if (typeof time === "string" && !isNaN(time)) time = Number(time)
    // 其他更多是格式化有如下:
    // yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
    let date
    if (typeof time === "number") {
      if (time.toString().length === 10) time *= 1000
      date = new Date(time)
    } else {
      date = time
    }

    const dif = date.getTimezoneOffset()
    const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000)
    const east8time = date.getTime() + timeDif

    date = new Date(east8time)
    const opt = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (const k in opt) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (opt[k]) : (("00" + opt[k]).substr(("" + opt[k]).length)))
      }
    }
    return fmt
  } catch (err) {
    // 若格式错误,则原值显示
    return time
  }
}
