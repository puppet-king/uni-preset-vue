import { wxAuth, refreshToken } from '@/api/auth'
import { AUTH_STORAGE_KEYS } from '@/configs/constant'
import { useAuthStore } from '@/stores/auth'

let wxLoginPromise: any
let refreshLoginPromise: any

const userLogin = {
  // 微信端常规静默登录
  wxLogin: function () {
    console.log('wxLogin [HTTP 模式]')
    if (wxLoginPromise) {
      return wxLoginPromise
    }

    wxLoginPromise = new Promise((resolve, reject) => {
      // 1. 调用微信小程序原生登录，获取临时 code
      wx.login({
        success: (loginRes) => {
          if (!loginRes.code) {
            console.error('微信原生登录失败: 未返回 code')
            reject(false)
            return
          }

          console.log('微信原生登录成功，code:', loginRes.code)

          // 2. 将 code 送往 Go 后端进行注册/登录
          wxAuth({ code: loginRes.code })
            .then((res) => {
              if (res.code === 200) {
                const data = res.data
                if (data.token) {
                  const delayTimestampByToken = Math.floor(Date.now() / 1000) + data.expiresIn - 5
                  const delayTimestampByRefreshToken = Math.floor(Date.now() / 1000) + data.refreshTokenExpiresIn - 5

                  const auth = useAuthStore()
                  auth.setAuth({
                    uuid: data.uuid,
                    token: 'Bearer ' + data.token,
                    expiresIn: delayTimestampByToken,
                    refreshToken: data.refreshToken,
                    refreshTokenExpiresIn: delayTimestampByRefreshToken,
                  })

                  // 3. 将登录凭证持久化在微信 Storage 中，方便 App 启动恢复
                  wx.batchSetStorage({
                    kvList: [
                      { key: AUTH_STORAGE_KEYS.UUID, value: data.uuid || '' },
                      { key: AUTH_STORAGE_KEYS.TOKEN, value: `Bearer ${data.token}` },
                      { key: AUTH_STORAGE_KEYS.EXPIRES_IN, value: delayTimestampByToken },
                      { key: AUTH_STORAGE_KEYS.REFRESH_TOKEN, value: data.refreshToken },
                      { key: AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_IN, value: delayTimestampByRefreshToken },
                    ],
                    success() {
                      console.log('用户登录数据缓存成功')
                    },
                    fail(e) {
                      console.error('用户登录数据缓存失败', e)
                    },
                  })
                }
                resolve(true)
              } else {
                console.error('wxAuth 接口返回错误', res)
                reject(false)
              }
            })
            .catch((err) => {
              console.error('wxAuth 请求异常', err)
              reject(false)
            })
        },
        fail: (err) => {
          console.error('微信原生 wx.login 接口调用失败', err)
          reject(false)
        },
      })
    })

    wxLoginPromise.finally(() => {
      wxLoginPromise = null
    })

    return wxLoginPromise
  },

  // 检查是否正在进行微信主登录
  isWxLoggingIn(): boolean {
    return !!wxLoginPromise
  },

  /**
   * 刷新登录令牌 (Token 续期)
   * 1. 强依赖微信 session_key 有效性校验
   * 2. Promise 并发单例锁防止重复发起刷新请求
   */
  async refreshLogin(): Promise<boolean> {
    console.log('refreshLogin [开始刷新流程]')

    // 1. 如果已有正在进行的刷新请求，直接复用 Promise
    if (refreshLoginPromise) {
      return refreshLoginPromise
    }

    // 2. 核心刷新任务
    const doRefresh = async (): Promise<boolean> => {
      const auth = useAuthStore()

      // 2.1 校验微信底层 session 是否依然有效 (使用传统回调规避微信底层 console 抛出 MiniProgramError)
      const sessionValid = await new Promise<boolean>((resolve) => {
        wx.checkSession({
          success: () => resolve(true),
          fail: () => resolve(false),
        })
      })

      if (!sessionValid) {
        console.log('[Auth] 微信 session 已失效，返回 false 准备触发重新登录')
        return false
      }

      // 2.2 检查本地是否有 refreshToken
      const rToken = auth.auth.refreshToken
      if (!rToken) {
        console.log('[Auth] 本地无 refreshToken，无法静默刷新')
        return false
      }

      try {
        // 2.3 发起后端 Token 刷新请求
        const res = await refreshToken({ refreshToken: rToken })

        if (res.code === 200 && res.data?.token) {
          const data = res.data
          // 提前 10 秒算作过期，预留网络传输时间
          const delayTimestampByToken = Math.floor(Date.now() / 1000) + (data.expiresIn || 7200) - 10
          const bearerToken = `Bearer ${data.token}`

          // 2.4 更新 Pinia 内存
          auth.setAuth({
            token: bearerToken,
            expiresIn: delayTimestampByToken,
            ...(data.refreshToken ? { refreshToken: data.refreshToken } : {}),
          })

          // 2.5 同步写入 Storage（保证后续并发重发请求立即可读）
          try {
            wx.setStorageSync(AUTH_STORAGE_KEYS.TOKEN, bearerToken)
            wx.setStorageSync(AUTH_STORAGE_KEYS.EXPIRES_IN, delayTimestampByToken)
            if (data.refreshToken) {
              wx.setStorageSync(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
            }
          } catch (e) {
            console.error('Token 本地持久化写入失败:', e)
          }

          console.log('Token 刷新成功')
          return true
        } else {
          console.warn('服务端拒绝刷新 Token (可能已拉黑或过期):', res.msg)
          auth.clearAuth() // 凭证无效，清理残留状态
          return false
        }
      } catch (err) {
        console.error('刷新 Token 网络或接口异常:', err)
        return false
      }
    }

    // 3. 赋值并发锁并执行
    refreshLoginPromise = doRefresh()

    try {
      return await refreshLoginPromise
    } finally {
      // 4. 无论成功还是异常，重置并发锁
      refreshLoginPromise = null
    }
  },
}

export default userLogin
