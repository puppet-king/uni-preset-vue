/**
 * 微信实时日志封装
 */
class Log {
  // 显式定义微信日志实例类型
  private readonly logManager: WechatMiniprogram.RealtimeLogManager | null

  constructor() {
    this.logManager = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  }

  /**
   * 内部通用调用方法，解决 apply 调用时的类型问题
   */
  private logCall(method: 'debug' | 'info' | 'warn' | 'error', ...args: unknown[]): void {
    if (!this.logManager) return

    // 微信实时日志不支持打印 Symbol 或 BigInt，建议传递可序列化对象
    this.logManager[method](...args)
  }

  debug(...args: unknown[]): void {
    this.logCall('debug', ...args)
  }

  info(...args: unknown[]): void {
    this.logCall('info', ...args)
  }

  warn(...args: unknown[]): void {
    this.logCall('warn', ...args)
  }

  error(...args: unknown[]): void {
    this.logCall('error', ...args)
  }

  /**
   * 设置过滤标签 (从基础库 2.7.3 开始支持)
   * @param msg 过滤关键字
   */
  setFilterMsg(msg: string): void {
    if (!this.logManager || typeof this.logManager.setFilterMsg !== 'function') return
    this.logManager.setFilterMsg(msg)
  }

  /**
   * 添加过滤标签 (从基础库 2.8.1 开始支持)
   * @param msg 过滤关键字
   */
  addFilterMsg(msg: string): void {
    if (!this.logManager || typeof this.logManager.addFilterMsg !== 'function') return
    this.logManager.addFilterMsg(msg)
  }
}

// 导出单例
export default new Log()
