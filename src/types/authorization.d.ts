export type ScopeType = {
  userLocation: boolean; // 精确地理位置
  userFuzzyLocation: boolean; // 模糊地理位置
  userLocationBackground: boolean; // 后台定位
  record: boolean; // 麦克风
  camera: boolean; // 摄像头
  bluetooth: boolean; // 蓝牙
  writePhotosAlbum: boolean; // 添加到相册
  addPhoneContact: boolean; // 添加到联系人
  addPhoneCalendar: boolean; // 添加到日历
  werun: boolean; // 微信运动步数
  address: boolean; // 通讯地址（已取消授权，可以直接调用对应接口）
  invoiceTitle: boolean; // 发票抬头（已取消授权，可以直接调用对应接口）
  invoice: boolean; // 获取发票（已取消授权，可以直接调用对应接口）
  userInfo: boolean; // 用户信息（小程序已回收，请使用头像昵称填写，小游戏可继续调用）
};

type ValidScopeKeys = keyof ScopeType;
