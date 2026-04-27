import { wxAuthApi, rApi } from '@/services/cloudCalller'
import { useUserStore } from '@/stores/user'

let wxLoginPromise: any
let refreshLoginPromise: any

const userLogin = {
  // wx 登录
  wxLogin: function () {
    console.log('wxLogin')
    if (wxLoginPromise) {
      return wxLoginPromise
    }

    wxLoginPromise = new Promise((resolve, reject) => {
      // const now = Date.now()
      // const unionKey = 'get_openid_last_time'
      // if (!canCallOperation(now, unionKey)) {
      //   reject(false, '短时间无法多次点击')
      //   return
      // }

      wxAuthApi()
        .then((res) => {
          if (res.code === 0) {
            const data = res.data
            if (data['token']) {
              const delayTimestampByToken = Math.floor(Date.now() / 1000) + data.expires_in - 5
              const delayTimestampByRefreshToken = Math.floor(Date.now() / 1000) + data.refresh_token_expires_in - 5

              const user = useUserStore()
              user.setAuth({
                token: 'Bearer ' + data['token'],
                expires_in: delayTimestampByToken,
                refresh_token: data['refresh_token'],
                refresh_token_expires_in: delayTimestampByRefreshToken,
              })

              wx.batchSetStorage({
                kvList: [
                  { key: 'uToken', value: `Bearer ${data.token}` },
                  { key: 'uExpires_in', value: String(delayTimestampByToken) },
                  { key: 'uRefresh_token', value: data.refresh_token },
                  { key: 'uRefresh_token_expires_in', value: String(delayTimestampByRefreshToken) },
                ],
                success() {
                  console.log('用户登录 成功')
                },
                fail(e) {
                  console.log('用户登录 失败', e)
                },
              })

              // Cache.set('token', 'Bearer ' + data['token'], data['expires_in'] - 5)
              // Cache.set('refresh_token', data['refresh_token'], data['refresh_token_expires_in'] - 5)
            }

            resolve(true)
          } else {
            console.error('wxAuth 接口报错', res)
            reject(false)
          }
        })
        .catch((err) => {
          console.error('wxAuth 接口报错', err)
          reject(false)
        })
    })

    wxLoginPromise.finally(() => {
      wxLoginPromise = null
    })

    return wxLoginPromise
  },

  refreshLogin: function () {
    console.log('refreshLogin')
    if (refreshLoginPromise) {
      return refreshLoginPromise
    }

    refreshLoginPromise = new Promise((resolve, reject) => {
      // const refreshToken = Cache.get('refresh_token', false)
      const user = useUserStore()
      const [refreshToken, ok] = user.checkRefreshTokenExpiresIn()
      if (!ok) {
        reject('token 不存在')
        return
      }

      // 获取 openId 和 unionId, 如果存在 token, 则可以直接赋值
      rApi({ refresh_token: refreshToken })
        .then((res) => {
          if (res.code === 0) {
            const data = res.data
            if (data['token']) {
              const delayTimestampByToken = Math.floor(Date.now() / 1000) + data.expires_in - 5
              const user = useUserStore()
              user.setAuth({
                token: 'Bearer ' + data['token'],
                expires_in: delayTimestampByToken,
              })

              wx.batchSetStorage({
                kvList: [
                  { key: 'uToken', value: `Bearer ${data.token}` },
                  { key: 'uExpires_in', value: String(delayTimestampByToken) },
                ],
                success() {
                  console.log('refreshToken 授权成功')
                },
                fail(e) {
                  console.log('用户 refreshToken 授权 失败', e)
                },
              })
            }

            resolve(true)
          } else {
            reject('API 错误')
          }
        })
        .catch(() => {
          reject('API 错误')
        })
    })

    refreshLoginPromise.finally(() => {
      refreshLoginPromise = null
    })

    return refreshLoginPromise
  },
}

export default userLogin
