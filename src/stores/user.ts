import { defineStore } from 'pinia'
import { ref } from 'vue'
import { InfoApi } from '@/services/cloudCalller'
import { UserData } from '@/typings/types'
import { UserQuota } from '@/typings/cloud'
import { AuthData } from '@/typings/user'
import cache from '@/utils/cache'

export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  // 认证信息
  const auth = ref<AuthData>({
    token: '',
    expires_in: 0,
    refresh_token: '',
    refresh_token_expires_in: 0,
  })

  // 用户 ID
  const uuid = ref('')

  // 用户数据是否已加载
  const isLoad = ref(false)

  // 免责声明同意状态（null 表示未从缓存加载）
  const hasAgreedDisclaimer = ref<boolean | null>(null)

  // 用户信息
  const userInfo = ref<UserData>({
    uuid: '',
    vipLevel: 0,
    name: '',
    isVip: false,
    vipExpireTime: null,
    status: 1,
    isDeleted: false,
    quota: {
      resumeUpload: 0,
      aiChat: 0,
      reportGen: 0,
    },
  })

  // ==================== Getters ====================
  /** 检查 AccessToken 是否过期 */
  function checkTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    if (auth.value.expires_in > currentTime) {
      return [auth.value.token, true]
    }
    return ['', false]
  }

  /** 检查 RefreshToken 是否过期 */
  function checkRefreshTokenExpiresIn(): [string, boolean] {
    const currentTime = Math.floor(Date.now() / 1000)
    if (auth.value.refresh_token_expires_in && auth.value.refresh_token_expires_in > currentTime) {
      if (auth.value.refresh_token) {
        return [auth.value.refresh_token, true]
      }
    }
    return ['', false]
  }

  // ==================== Actions ====================
  /** 获取并设置用户数据 */
  async function setUserData(force = false): Promise<boolean> {
    // 已加载且非强制刷新，直接返回
    if (isLoad.value && !force) {
      return true
    }

    try {
      const res = await InfoApi()
      console.log('setUserData', res)

      if (res.code === 0 && res.data) {
        userInfo.value = res.data
        uuid.value = res.data.uuid
        isLoad.value = true
        return true
      }

      void wx.showToast({ title: res.message, icon: 'error' })
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  /**
   * 检查权限与配额
   * @param action - 业务动作 (resumeUpload | aiChat | reportGen | general)
   * @returns 是否允许继续操作
   */
  async function checkPermission(action: keyof UserQuota | 'general'): Promise<boolean> {
    // 后续判断 非会员 1天 3次 会员 不限制
    return true
  }

  /**
   * 获取免责声明同意状态
   * 首次调用从缓存读取，后续直接返回内存值
   */
  async function getAgreedDisclaimerStatus(): Promise<boolean> {
    if (hasAgreedDisclaimer.value !== null) {
      return hasAgreedDisclaimer.value
    }
    const agreed = cache.getSync('hasAgreedDisclaimer') as boolean
    hasAgreedDisclaimer.value = !!agreed
    return hasAgreedDisclaimer.value
  }

  /**
   * 设置免责声明同意状态
   * 同步更新内存，异步写入缓存
   */
  async function setAgreedDisclaimer(value: boolean): Promise<void> {
    hasAgreedDisclaimer.value = value
    await cache.setAsync('hasAgreedDisclaimer', value)
  }

  /** 设置认证信息 */
  function setAuth(data: AuthData): void {
    if (data.refresh_token) {
      auth.value = data
    } else {
      auth.value.token = data.token
      auth.value.expires_in = data.expires_in
    }
  }

  return {
    // State
    auth,
    uuid,
    isLoad,
    hasAgreedDisclaimer,
    userInfo,
    // Getters
    checkTokenExpiresIn,
    checkRefreshTokenExpiresIn,
    // Actions
    setUserData,
    checkPermission,
    getAgreedDisclaimerStatus,
    setAgreedDisclaimer,
    setAuth,
  }
})
