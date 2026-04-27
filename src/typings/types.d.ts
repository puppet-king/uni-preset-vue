import { LoginResData } from '@/typings/cloud'

export type UserData = Omit<LoginResData, 'quota'> & {
  quota: UserQuota
}

export interface UserQuota {
  resumeUpload: number
  aiChat: number
  reportGen: number
}

export interface Settings {
  isHapticFeedbackEnabled: boolean // 振动反馈的开关
  isKeepScreenOn: boolean // 保持屏幕常亮
}
