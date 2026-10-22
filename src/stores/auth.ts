import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthData } from '@/typings/api'
import { AUTH_STORAGE_KEYS } from '@/configs/constant'

export const useAuthStore = defineStore('user', () => {
  // 认证信息
  const defaultAuthData: AuthData = {
    uuid: '',
    token: '',
    expiresIn: 0,
    refreshToken: '',
    refreshTokenExpiresIn: 0,
  }

  const auth = ref<AuthData>({ ...defaultAuthData })

  /** 检查 AccessToken 是否过期 */
  function checkTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    if (auth.value.expiresIn > currentTime) {
      return [auth.value.token, true]
    }
    return ['', false]
  }

  /** 检查 RefreshToken 是否过期 */
  function checkRefreshTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    if (auth.value.refreshTokenExpiresIn && auth.value.refreshTokenExpiresIn > currentTime) {
      if (auth.value.refreshToken) {
        return [auth.value.refreshToken, true]
      }
    }
    return ['', false]
  }

  /** 设置认证信息 (优先使用后端 wxAuth 返回的直接 uuid) */
  function setAuth(data: AuthData): void {
    if (data.refreshToken) {
      auth.value = data
    } else {
      auth.value.token = data.token
      auth.value.expiresIn = data.expiresIn
      if (data.uuid) {
        auth.value.uuid = data.uuid
      }
    }
  }

  /**
   * 清理所有登录与认证状态
   * 同步清空 Pinia 响应式内存数据 + 微信 Storage 缓存
   */
  function clearAuth(): void {
    auth.value = { ...defaultAuthData }

    // 清理微信本地持久化缓存
    try {
      wx.removeStorageSync(AUTH_STORAGE_KEYS.TOKEN)
      wx.removeStorageSync(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
      wx.removeStorageSync(AUTH_STORAGE_KEYS.EXPIRES_IN)
      wx.removeStorageSync(AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_IN)
    } catch (e) {
      console.error('清理本地 Auth Storage 异常:', e)
    }
  }

  return {
    // State
    auth,
    // Getters
    checkTokenExpiresIn,
    checkRefreshTokenExpiresIn,
    // Actions
    setAuth,
    clearAuth,
  }
})
