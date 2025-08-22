import { defineStore } from "pinia"
import { ref } from "vue"
import { getUserData } from "@/api/user"
import { AuthData } from "@/typeings/base"

export const useUserStore = defineStore("user", () => {
  const uuid = ref("")
  const nick = ref("")
  const isLoad = ref(false)

  const auth = ref<AuthData>({
    token: "",
    expires_in: 0,
    refresh_token: "",
    refresh_token_expires_in: 0
  })


  // 异步设置 AccessToken 和 RefreshToken
  function setAuth(data: AuthData): void {
    if (data.refresh_token) {
      auth.value = data
    } else {
      auth.value.token = data.token
      auth.value.expires_in = data.expires_in
    }

    console.log("setAuth Success ")
  }

  function checkTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    if (auth.value.expires_in > currentTime) {
      return [auth.value.token, true]
    }
    return ["", false]
  }

  function checkRefreshTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    console.log("checkRefreshTokenExpiresIn", auth.value.refresh_token_expires_in)
    if (auth.value.refresh_token_expires_in > currentTime) {
      return [auth.value.refresh_token, true]
    }
    return ["", false]
  }

  async function setUserData(force = false) {
    try {
      if (isLoad.value && !force) {
        return true
      }

      const res = await getUserData()
      const { code } = res
      if (code !== 200) {
        return false
      }

      uuid.value = res.data.uuid
      nick.value = res.data.nick

      isLoad.value = true

      // console.log('加载成功', uuid.value)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    uuid, nick, isLoad,
    setUserData, setAuth,
    checkTokenExpiresIn, checkRefreshTokenExpiresIn
  }
})
