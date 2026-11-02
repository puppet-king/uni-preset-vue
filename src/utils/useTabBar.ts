import { ref } from 'vue'
import { ItemClickPayload, FuiTabBar } from '@/typings/base'

export function useTabBar(selectedIndex: number = 0) {
  const current = ref(selectedIndex)
  const tabbbar = ref<FuiTabBar | null>(null)
  const tabBarHeight = ref(0)

  function switchTab(res: ItemClickPayload) {
    if (res.index === current.value) {
      return
    }

    wx.switchTab({ url: '/' + res.pagePath }).catch((err) => {
      console.log(err)
    })
  }

  // 获取 tabBar 的高度但是需要确保在 ready 以后进行使用
  async function setTabbBarHeight() {
    try {
      if (tabbbar.value) {
        tabBarHeight.value = await tabbbar.value.getTabBarHeight()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    current,
    tabbbar,
    tabBarHeight,
    switchTab,
    setTabbBarHeight,
  }
}
