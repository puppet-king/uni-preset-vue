import { defineStore } from "pinia"

export const useSystemStore = defineStore("system", {
  state: () => {
    return {
      theme: "light",
      benchmarkLevel: 0, // 设备性能等级 理论不能超过 50
      isLoader: false,
      platform: ""
    }
  },
  actions: {
    async load(force = false) {
      if (this.isLoader && !force) {
        return true
      }

      const base = wx.getAppBaseInfo()
      this.theme = base?.theme || ""

      // TODO 后续展示不支持 PC
      // const deviceInfo = wx.getDeviceInfo()
      // this.benchmarkLevel = deviceInfo.benchmarkLevel
      // console.log('deviceInfo.platform', deviceInfo.platform)

      // 性能等级 因为 getDeviceInfo 无法获得 IOS
      wx.getDeviceBenchmarkInfo({
        success (res) {
          console.log("benchmarkLevel", res.benchmarkLevel)
          this.benchmarkLevel = res.benchmarkLevel
        }
      })
    }
  }
})
