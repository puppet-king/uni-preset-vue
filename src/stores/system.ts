import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cache from '@/utils/cache'
import { Settings } from '@/typings/types'

export const useSystemStore = defineStore('system', () => {
  const isHapticFeedbackEnabled = ref(true)
  const isKeepScreenOn = ref(true)
  const scene = ref<null | number>(null)
  const forwardMaterials = ref<null | WechatMiniprogram.ForwardMaterials>(null)

  async function load() {
    try {
      const data = await Cache.getAsync<Settings>('system')
      if (data && typeof data !== 'string') {
        isHapticFeedbackEnabled.value = data.isHapticFeedbackEnabled ?? true
        isKeepScreenOn.value = data.isKeepScreenOn ?? true
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 还原
  async function save() {
    await Cache.setAsync('system', {
      isHapticFeedbackEnabled: isHapticFeedbackEnabled.value,
      isKeepScreenOn: isKeepScreenOn.value,
    })
  }

  const vibrateShort = async () => {
    if (isHapticFeedbackEnabled.value) {
      try {
        void uni.vibrateShort({
          type: 'medium',
          fail: (e) => {
            console.error('震动反馈异常 fail', e)
          },
        })
      } catch (e) {
        console.error('震动反馈异常', e)
      }
    }
  }

  // 只是处理 聊天素材
  const handleChatScene = (sceneValue: number, forwardMaterialsValue: WechatMiniprogram.ForwardMaterials) => {
    scene.value = sceneValue
    forwardMaterials.value = forwardMaterialsValue
  }

  const clearChatScene = () => {
    scene.value = null
    forwardMaterials.value = null
  }

  return {
    isHapticFeedbackEnabled,
    isKeepScreenOn,
    scene,
    forwardMaterials,
    load,
    save,
    vibrateShort,
    handleChatScene,
    clearChatScene,
  }
})
