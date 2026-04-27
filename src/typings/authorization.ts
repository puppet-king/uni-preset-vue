export type ScopeType = {
  userLocation: boolean | null // 精确地理位置
  userFuzzyLocation: boolean | null // 模糊地理位置
  userLocationBackground: boolean | null // 后台定位
  record: boolean | null // 麦克风
  camera: boolean | null // 摄像头
  bluetooth: boolean | null // 蓝牙
  writePhotosAlbum: boolean | null // 添加到相册
  addPhoneContact: boolean | null // 添加到联系人
  addPhoneCalendar: boolean | null // 添加到日历
  werun: boolean | null // 微信运动步数
  address: boolean | null // 通讯地址（已取消授权，可以直接调用对应接口）
  invoiceTitle: boolean | null // 发票抬头（已取消授权，可以直接调用对应接口）
  invoice: boolean | null // 获取发票（已取消授权，可以直接调用对应接口）
  userInfo: boolean | null // 用户信息（小程序已回收，请使用头像昵称填写，小游戏可继续调用）
}

type ValidScopeKeys = keyof ScopeType
