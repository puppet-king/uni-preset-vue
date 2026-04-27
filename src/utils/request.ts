import userLogin from '@/utils/userLogin'
import { useUserStore } from '@/stores/user'
import { AGENT_REQUEST_URL } from '@/configs/constant'
import { ApiResponse } from '@/typings/api'

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
  try {
    await userLogin.refreshLogin()
    return getToken()
  } catch {
    try {
      await userLogin.wxLogin()
      return getToken()
    } catch {
      throw new Error('登录失败')
    }
  }
}

function getToken(): string | null {
  const user = useUserStore()
  const [token, ok] = user.checkTokenExpiresIn()
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
  options.url = options.url.startsWith('http') ? options.url : AGENT_REQUEST_URL + options.url

  // GET 参数
  if (options.params && Object.keys(options.params).length) {
    const query = Object.entries(options.params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
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
      timeout: options.timeout ?? 60000,
      enableHttp2: true,
      header: {
        Authorization: token,
        'Content-Type': 'application/json;charset=UTF-8',
        ...options.header,
      },

      success: async (res) => {
        const { statusCode, data } = res

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

            await retryAction()

            return request<TData, TParams>(options, { ...expand, retry: false })
              .then(resolve)
              .catch(reject)
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
