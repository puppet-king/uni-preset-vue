// 实时日志 开发者可从We分析“性能质量->实时日志->小程序日志”进入小程序端日志查询页面
class Log {
  constructor() {
    this.log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  }
  debug() {
    if (!this.log) return
    this.log.debug.apply(this.log, arguments)
  }
  info() {
    if (!this.log) return
    this.log.info.apply(this.log, arguments)
  }
  warn() {
    if (!this.log) return
    this.log.warn.apply(this.log, arguments)
  }
  error() {
    if (!this.log) return
    this.log.error.apply(this.log, arguments)
  }
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!this.log || !this.log.setFilterMsg) return
    if (typeof msg !== 'string') return
    this.log.setFilterMsg(msg)
  }
  addFilterMsg(msg) { // 从基础库2.8.1开始支持
    if (!this.log || !this.log.addFilterMsg) return
    if (typeof msg !== 'string') return
    this.log.addFilterMsg(msg)
  }
}

export default new Log()
