// 外部响应结构
export interface ApiResponse<T> {
  code: number // 响应状态码
  msg: string // 响应消息
  data: T // 数据字段，泛型 T 即可适应不同的数据类型
}

export interface AuthData {
  uuid?: string
  token: string
  expiresIn: number
  refreshToken?: string
  refreshTokenExpiresIn?: number
}
