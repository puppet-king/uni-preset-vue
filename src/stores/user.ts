import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserProfile, UserProfileResponseData } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 用户数据是否已加载
  const isLoad = ref(false)

  // 用户信息
  const defaultUserInfo: UserProfileResponseData = {
    uuid: '',
    avatar: '',
    nickname: '访客用户',
    birthday: '',
    gender: 0,
    createdAt: '',
  }

  const userInfo = ref<UserProfileResponseData>({ ...defaultUserInfo })

  // ==================== Actions ====================
  /** 获取并设置用户数据 (真实请求 GET /v1/user/profile 接口) */
  async function setUserData(force = false): Promise<boolean> {
    // 已加载且非强制刷新，直接返回
    if (isLoad.value && !force) {
      return true
    }

    try {
      const res = await getUserProfile()
      if (res.code === 200 && res.data) {
        userInfo.value = res.data
        isLoad.value = true
        return true
      }
      return false
    } catch (err) {
      console.error('获取用户资料失败:', err)
      return false
    }
  }

  return {
    // State
    isLoad,
    userInfo,

    // Actions
    setUserData,
  }
})
