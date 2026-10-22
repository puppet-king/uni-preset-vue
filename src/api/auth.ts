import service from '@/utils/request'
const baseDir = '/v1/auth'

// 微信常规登录，用 code 换取 JWT Token
export function wxAuth(data: { code: string }) {
  return service.request<any>(
    {
      url: `${baseDir}/wxAuth`,
      method: 'POST',
      data,
    },
    { noAuth: true },
  ) // 登录请求跳过拦截器携带 Token 的检测
}

// 刷新 Token
export function refreshToken(data: { refreshToken: string }) {
  return service.request<any>(
    {
      url: `${baseDir}/refreshToken`,
      method: 'POST',
      data,
    },
    { noAuth: true },
  )
}
