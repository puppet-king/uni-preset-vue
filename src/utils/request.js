import config from "@/config/app"
import userLogin from "@/utils/userLogin"
import { useUserStore } from "@/stores/user"

// 添加 handleLogin 方法
async function handleLogin() {
  try {
    await userLogin.refreshLogin()
    console.log("###### noAuth refreshLogin success ######")
    return getToken()
  } catch (err) {
    console.error("refreshLogin 过期:", err)

    try {
      await userLogin.wxLogin()
      console.log("###### noAuth wxLogin success ######")
      return getToken()
    } catch (err) {
      console.error("wxLogin 异常:", err)
      throw new Error("登录失败")
    }
  }
}


function getToken() {
  const user = useUserStore()
  const [token, ok] =  user.checkTokenExpiresIn()

  if (ok) {
    return token
  }

  return null
}

export default {
  async request(options = {}, expand = { noAuth: false, retry: true }) {
    let token = ""
    if (!expand.noAuth) {
      token = getToken()
      if (!token) {
        // 使用方式
        try {
          token = await handleLogin()
        } catch (err) {
          console.error("登录流程失败:", err)
        }
      }
    }

    options.url = options.url && options.url.startsWith("http") ? options.url : config.HTTP_REQUEST_URL + options.url
    // 如果是 Get 请求需要拼接参数
    if (options.params && Object.keys(options.params).length > 0) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&")

      options.url += `?${queryString}`
    }

    return new Promise((resolve, reject) => {
      if (!options.method) {
        return reject({
          status_code: 400,
          msg: "HTTP method is missing"
        })
      }

      uni.request({
        url: options.url,
        method: options.method,
        enableHttp2: true,
        data: options.data,
        timeout: 5000,
        header: {
          Authorization: token,
          ...options.header,
          "Content-Type": "application/json;charset=UTF-8"
        },
        success: async (response) => {
          const { statusCode, data } = response

          try {
            if (statusCode === 200) {
              resolve(data) // 请求成功直接返回数据
              return
            }

            if (statusCode === 404) {
              reject({
                status_code: 404,
                msg: "页面不存在",
              })
              return
            }

            if (expand.retry && (statusCode === 401 || statusCode === 403)) {
              // 根据状态码选择不同的处理逻辑
              const retryAction = statusCode === 401 ? userLogin.wxLogin : userLogin.refreshLogin
              await retryAction() // 执行对应的重试操作

              // 重试请求
              this.request(options, { ...expand, retry: false })
                .then(resolve)
                .catch(reject)

              return
            }

            // 未处理的状态码
            data.status_code = statusCode
            reject(data)
          } catch (err) {
            // 捕获异常并拒绝 Promise
            console.error("处理请求失败:", err)
            reject(data)
          }
        },
        fail: (error) => {
          reject({
            status_code: 500,
            msg: "Request failed",
            error: error
          })
        }
      })
    })
  }

}




