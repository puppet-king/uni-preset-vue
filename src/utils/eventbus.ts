/*
  from github: https://github.com/littlebaozi/EventEmitter
  author: littlebaozi
  license: unknown
*/

interface EventCallback {
  cb: (...args: any[]) => void
  ctx?: any
}

interface EventStore {
  [event: string]: EventCallback[]
}

class EventBus {
  private _stores: EventStore | null | [] = null

  // 订阅
  on(event: string, fn: (...args: any[]) => void, context?: any): void {
    // 判断fn是否是函数
    if (typeof fn !== 'function') {
      console.error('fn must be a function')
      return
    }
    // 将event的fn存放在store中
    this._stores = this._stores || {}
    ;(this._stores[event] = this._stores[event] || []).push({ cb: fn, ctx: context })
  }

  // 发布
  emit(event: string, ...args: any[]): void {
    this._stores = this._stores || {}
    const store = this._stores[event]
    // 遍历执行事件
    if (store) {
      const storeCopy = store.slice(0)
      for (let i = 0, len = storeCopy.length; i < len; i++) {
        storeCopy[i].cb.apply(storeCopy[i].ctx, args)
      }
    }
  }

  // 注销
  off(event?: string, fn?: (...args: any[]) => void): void {
    this._stores = this._stores || {}

    // 删除所有
    if (!arguments.length) {
      this._stores = []
      return
    }

    const store = this._stores[event]
    if (!store) {
      return
    }

    // 删除指定event
    if (arguments.length === 1) {
      delete this._stores[event]
      return
    }

    // 删除指定fn
    for (let i = 0, len = store.length; i < len; i++) {
      if (fn === store[i].cb) {
        store.splice(i, 1)
      }
    }
  }
}

export default EventBus
