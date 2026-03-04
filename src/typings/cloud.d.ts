export interface CloudApiResponse<T> {
  code: number // 响应状态码 0 代表成功
  message: string // 响应消息
  data: T // 数据字段，泛型 T 即可适应不同的数据类型
  fromCache?: boolean
  error?: string
}

export interface UserQuota {
  resumeUpload: number // 剩余简历上传次数
  aiChat: number // 剩余 AI 对话次数
  reportGen: number // 剩余报告生成次数
}

/** 登录接口返回的核心数据结构 */
export interface InfoResData {
  /** 用户唯一标识 (对应云函数返回的 OPENID) */
  uuid: string
  /** VIP 等级: 0(普通), 1-6(V1~V6) */
  vipLevel: number
  /** 是否为有效 VIP 状态 */
  isVip: boolean
  /** VIP 到期时间，Date 对象或 null */
  vipExpireTime: Date | null
  /** 账户剩余配额 */
  quota: UserQuota
  /** 账户状态: 1(正常), 0(禁用) */
  status: number
  /** 软删除标记 */
  isDeleted: boolean
}

export type InfoRes = CloudApiResponse<InfoResData>

export interface WxAuthData {
  token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
}

export type WxAuthResponse = CloudApiResponse<WxAuthData>
export interface RReq {
  refresh_token: string
}

/** AG-UI 协议的消息内容 */
export interface AGMessage {
  id: string
  role: AGMessageRole
  content: string
}

/** AG-UI 协议的消息请求参数 */
export interface AGSendMessageRequest {
  threadId: string // 会话 ID（必须传入）
  messages: AGMessage[]
  /** 是否启用流式响应，默认为 false */
  stream?: boolean
}

// AG-UI 协议相关类型定义
/** AG-UI 协议的消息角色 */
export type AGMessageRole = 'user' | 'assistant' | 'system'

/** AG-UI 协议的消息内容 */
export interface AGMessage {
  id: string
  role: AGMessageRole
  content: string
}

/** AG-UI 协议的消息请求参数 */
export interface AGSendMessageRequest {
  threadId: string // 会话 ID（必须传入）
  messages: AGMessage[]
}
