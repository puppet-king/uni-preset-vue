import service from '@/utils/request'
const baseDir = '/v1/user'

// 用户个人资料 DTO
export interface UserProfileResponseData {
  uuid: string
  avatar: string
  nickname: string
  birthday: string
  gender: number // 性别: 0-未知, 1-男, 2-女
  createdAt: string // 创建时间，格式 "YYYY-MM-DD HH:mm:ss"
}

// 获取当前登录用户资料
export function getUserProfile() {
  return service.request<UserProfileResponseData>({
    url: `${baseDir}/profile`,
    method: 'GET',
  })
}
