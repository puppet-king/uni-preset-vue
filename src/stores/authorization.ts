import { defineStore } from "pinia"
import { ScopeType, ValidScopeKeys } from "@/types/authorization"

export const useAuthorizationStore = defineStore("authorization", () => {
  const scope: ScopeType = {
    userLocation: false, // 精确地理位置
    userFuzzyLocation: false, // 模糊地理位置
    userLocationBackground: false, // 后台定位
    record: false, // 麦克风
    camera: false, // 摄像头
    bluetooth: false, // 蓝牙
    writePhotosAlbum: false, // 添加到相册
    addPhoneContact: false, // 添加到联系人
    addPhoneCalendar: false, // 添加到日历
    werun: false, // 微信运动步数
    address: false, // 通讯地址（已取消授权，可以直接调用对应接口）
    invoiceTitle: false, // 发票抬头（已取消授权，可以直接调用对应接口）
    invoice: false, // 获取发票（已取消授权，可以直接调用对应接口）
    userInfo: false, // 用户信息（小程序已回收，请使用头像昵称填写，小游戏可继续调用）
  }

  // 获取授权信息的方法
  function isAuthorized(key: ValidScopeKeys): boolean {
    return scope[key]
  }

  // 更新授权信息的方法
  function updateAuthorizationInfo(key: ValidScopeKeys, newStatus: boolean) {
    scope[key] = newStatus
  }

  return { isAuthorized, updateAuthorizationInfo }
})
