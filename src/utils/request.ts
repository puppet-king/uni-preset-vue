import userLogin from '@/utils/userLogin'
import { API_BASE_URL } from '@/configs/constant'
import { ApiResponse } from '@/typings/api'
import { useAuthStore } from '@/stores/auth'

/** 请求参数类型 */
interface RequestOptions<TData = unknown, TParams = unknown> {
  url: string
  method: UniApp.RequestOptions['method']
  data?: TData
  params?: TParams
  timeout?: number
  header?: Record<string, string>
}

/** 扩展参数 */
interface RequestExpand {
  noAuth?: boolean
  retry?: boolean
}

/* ================= 登录处理 ================= */
async function handleLogin(): Promise<string | null> {
  const auth = useAuthStore()

  // 0. 如果当前正在进行微信主登录 (比如 App.vue 启动中)，直接复用等待登录完成
  if (userLogin.isWxLoggingIn()) {
    await userLogin.wxLogin()
    return getToken()
  }

  // 1. 如果本地有 refreshToken，先尝试静默刷新 Token (内部会先检查微信 session)
  if (auth.auth.refreshToken) {
    const refreshed = await userLogin.refreshLogin()
    if (refreshed) {
      const token = getToken()
      if (token) return token
    }
  }

  // 2. 无 refreshToken 或刷新失败/session过期，静默进行微信主登录 (wxAuth)
  try {
    await userLogin.wxLogin()
    return getToken()
  } catch {
    uni.showToast({ title: '登录失败，请稍后重试', icon: 'none', duration: 1500 })
    throw new Error('登录失败')
  }
}

function getToken(): string | null {
  const auth = useAuthStore()
  const [token, ok] = auth.checkTokenExpiresIn()
  return ok ? token : null
}

/* ================= 请求主体 ================= */
async function request<TData = any, TParams = any>(
  options: RequestOptions<any, TParams>,
  expand: RequestExpand = { noAuth: false, retry: true },
): Promise<ApiResponse<TData>> {
  let token = ''

  if (!expand.noAuth) {
    token = getToken() || ''
    if (!token) {
      token = (await handleLogin()) || ''
    }
  }

  // 拼接 URL
  options.url = options.url.startsWith('http') ? options.url : API_BASE_URL + options.url

  // GET 参数构建
  if (options.params && Object.keys(options.params).length) {
    const query = Object.entries(options.params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as any)}`)
      .join('&')
    options.url += `?${query}`
  }

  return new Promise<ApiResponse<TData>>((resolve, reject) => {
    if (!options.method) {
      return reject({ status_code: 400, msg: 'HTTP method is missing' })
    }

    uni.request({
      url: options.url,
      method: options.method,
      data: options.data,
      timeout: options.timeout ?? 10000,
      enableHttp2: true,
      header: {
        Authorization: token,
        'Content-Type': 'application/json;charset=UTF-8',
        ...options.header,
      },

      success: async (res) => {
        const { statusCode } = res
        const data = res.data

        try {
          if (statusCode === 200) {
            resolve(data as ApiResponse<TData>)
            return
          }

          if (statusCode === 404) {
            reject({ status_code: 404, msg: '页面不存在' })
            return
          }

          if (expand.retry && (statusCode === 401 || statusCode === 403)) {
            const retryAction = statusCode === 401 ? userLogin.wxLogin : userLogin.refreshLogin
            const isOk = await retryAction()

            if (isOk !== false) {
              return request<TData, TParams>(options, { ...expand, retry: false })
                .then(resolve)
                .catch(reject)
            }
          }

          reject({ ...(data as object), status_code: statusCode })
        } catch (err) {
          reject(err)
        }
      },

      fail: (err) => {
        reject({
          status_code: 500,
          msg: 'Request failed',
          error: err,
        })
      },
    })
  })
}

export default {
  request,
}
