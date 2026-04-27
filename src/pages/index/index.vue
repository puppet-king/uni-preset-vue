<template>
  <view class="h-screen w-screen flex flex-row bg-meow-gradient">
    <view class="absolute sidebarContainer h-screen z-50" style="box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15)">
      <Sidebar :need-loading-resource="shouldLoadSidebar" />
    </view>

    <horizontal-drag-gesture-handler on-gesture-event="handlePen">
      <view class="indexContainer flex flex-col h-screen w-screen text-base relative">
        <!-- 遮罩层  -->
        <view id="overlay"></view>
        <navBar>
          <view class="flex flex-row gap-1.5 h-5 items-center" title="主页" @tap="onClickMenu"> </view>
        </navBar>

        <!-- 内容主体 -->
        <ContentArea
          ref="contentAreaRef"
          :clipboard-value="clipboardValue"
          @show-disclaimer="showDisclaimerDialog = true"
        ></ContentArea>
      </view>
    </horizontal-drag-gesture-handler>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import Sidebar from '@/pages/index/components/Sidebar.vue'
import ContentArea from './components/ContentArea.vue'
import NavBar from '@/components/nav-bar/nav-bar.vue'
import { useAgentsStore } from '@/stores/agents'
import { Throttle } from '@/utils/throttle'
import { COS_URL } from '@/configs/constant'

// 声明 ContentArea 组件实例类型
type ContentAreaInstance = {
  handleSubmit: () => Promise<void>
}

const agentsStore = useAgentsStore()

defineOptions({
  name: 'ConflictAnalysis',
})

// ContentArea 组件引用
const contentAreaRef = ref<ContentAreaInstance | null>(null)

// 剪切板值
const clipboardValue = ref<string>('')

// UI 状态
const showDisclaimerDialog = ref(false)
const showPayDialog = ref(false)

// 剪切板内容
const conflictDescription = ref<string>('')
const lastConflictDescription = ref('') // 上一次剪切板内容 即实现 若用户不同意的的话 也存储到 剪切板 下次不会提醒

/**
 * 用户同意免责声明后，继续执行提交分析
 */
const handleAgreed = () => {
  contentAreaRef.value?.handleSubmit()
}

// 加载资源
const shouldLoadSidebar = ref(false)

const prepareSidebarResources = () => {
  console.log('prepareSidebarResources')
  if (!shouldLoadSidebar.value) {
    shouldLoadSidebar.value = true
  }
}

// 读取剪贴板内容（已节流，1s 内只执行第一次）
const readClipboard = Throttle(() => {
  console.log('readClipboard')
  wx.getClipboardData({
    success: (res) => {
      console.log('getClipboardData', res)
      const clipboardContent = res.data
      if (clipboardContent && clipboardContent.trim()) {
        // 如果输入框内容已经等于剪切板内容，不重复询问
        if (conflictDescription.value === clipboardContent || lastConflictDescription.value === clipboardContent) {
          return
        }

        lastConflictDescription.value = clipboardContent
        uni.showModal({
          title: '发现剪切板内容',
          content: '将内容粘贴到"事实陈述"中？',
          confirmText: '粘贴',
          confirmColor: '#ff99c8',
          cancelText: '取消',
          success: (modalRes) => {
            if (modalRes.confirm) {
              clipboardValue.value = clipboardContent
              wx.showToast({ title: '已粘贴', icon: 'success' })

              // 会弹出 toast 提示"内容已复制"，持续 1.5s 没有意义,  已经在临时变量记录了 多次 onShow 不会重复覆盖。
              // wx.setClipboardData({ data: '' })
            }
          },
        })
      }
    },
    fail: (err) => {
      console.error('读取剪切板失败:', err)
    },
  })
}, 2000)

onShow(() => {
  readClipboard()
})

onShareAppMessage(() => {
  return {
    title: '公平审理',
    path: `/pages/index/index?utm_source=ShareAppMessage`,
    promise: handleShareAppMessage('ShareAppMessage'),
  }
})

onShareTimeline(() => {
  return {
    title: '谁在“作”，猫知道。',
    path: `/pages/index/index?utm_source=ShareTimeline`,
    promise: handleShareAppMessage('ShareTimeline'),
  }
})

const handleShareAppMessage = async (utmSource: string) => {
  const { name, desc, icon } = agentsStore.activeJudge
  const url = `${COS_URL}${icon}`
  const shareTitle = `${desc}`

  return {
    title: shareTitle,
    path: `/pages/index/index?utm_source=${utmSource}`,
    imageUrl: url,
  }
}

const { shared, timing, Easing, runOnJS } = wx.worklet

const GestureState = {
  POSSIBLE: 0,
  BEGIN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
}

const sharedX = shared(0)
const sharedSidebarX = shared(0)
const windowWidth = wx.getWindowInfo().screenWidth
const shareSidebarWidth = shared(0)
const sharedOpacity = shared(0)
// const sharedOpacity = shared(1)
// const sharedBgColor = shared('#16181D60')

function onClickMenu() {
  console.log('handleShowSidebar')
  console.log('Sidebar opened via runOnJS')
  if (sharedOpacity.value === 0) {
    // @ts-expect-error: WorkletEasing 官方类型未声明 out
    sharedX.value = timing(shareSidebarWidth.value, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
      'worklet'
    })
    sharedOpacity.value = 1
    // @ts-expect-error: WorkletEasing 官方类型未声明 out
    sharedSidebarX.value = timing(0, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
      'worklet'
    })

    // 加载资源
    prepareSidebarResources()
  }
}

const instance = getCurrentInstance()
const $this = instance?.proxy?.$scope

if ($this) {
  shareSidebarWidth.value = windowWidth * 0.7
  sharedSidebarX.value = 0 - shareSidebarWidth.value
  // console.log('sharedSidebarX', sharedSidebarX.value)
  $this.applyAnimatedStyle('.indexContainer', () => {
    'worklet'
    return {
      transform: `translateX(${sharedX.value}px)`,
    }
  })

  $this.applyAnimatedStyle('#overlay', () => {
    'worklet'

    // 基础透明度系数
    const opacity = sharedOpacity.value * 0.4

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      // 动态设置 rgba 的透明度
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      // 优化：当完全透明时，不仅要 zIndex 靠后，最好设为不可见
      zIndex: sharedOpacity.value > 0 ? 10 : -1,
      pointerEvents: sharedOpacity.value > 0 ? 'auto' : 'none',
    }
  })

  //
  $this.applyAnimatedStyle('.sidebarContainer', () => {
    'worklet'
    return { transform: `translateX(${sharedSidebarX.value}px)`, width: shareSidebarWidth.value + 'px' }
    // return { transform: 'translateX(0px)', width: shareSidebarWidth.value + 'px'}
  })

  // 将 handlePen 方法注册到 $scope 上，使其可以被 on-gesture-event 访问
  $this.handlePen = (evt) => {
    'worklet'
    // console.log('handlePen',  evt.deltaX, sharedX.value, shareSidebarWidth.value)
    switch (evt.state) {
      case GestureState.ACTIVE:
        if (sharedX.value <= 0) {
          if (evt.deltaX > 0) {
            sharedX.value += evt.deltaX
            sharedSidebarX.value += evt.deltaX
            sharedOpacity.value = 1
          }
        } else if (sharedX.value <= shareSidebarWidth.value) {
          // 不能超过本身最大宽度
          sharedX.value += evt.deltaX
          sharedSidebarX.value += evt.deltaX
          if (sharedX.value < 0) {
            sharedX.value = 0
            sharedSidebarX.value = 0 - shareSidebarWidth.value
          }
        }
        break

      case GestureState.END:
        // x 速度够
        if (evt.velocityX >= 1500 || sharedX.value >= shareSidebarWidth.value / 2) {
          // @ts-expect-error: WorkletEasing 官方类型未声明
          sharedX.value = timing(shareSidebarWidth.value, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
            'worklet'
          })
          sharedOpacity.value = 1
          // @ts-expect-error: WorkletEasing 官方类型未声明
          sharedSidebarX.value = timing(0, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
            'worklet'
          })

          console.log('runOnJS')
          runOnJS(prepareSidebarResources)()
        } else {
          // @ts-expect-error: WorkletEasing 官方类型未声明
          sharedX.value = timing(0, { duration: 100, easing: Easing.out(Easing.ease) }, () => {})
          sharedOpacity.value = 0
          sharedSidebarX.value = timing(
            -shareSidebarWidth.value,
            // @ts-expect-error: WorkletEasing 官方类型未声明
            { duration: 100, easing: Easing.out(Easing.ease) },
            () => {
              'worklet'
            },
          )
        }
        break

      case GestureState.CANCELLED:
        if (sharedX.value !== 0) {
          // @ts-expect-error: WorkletEasing 官方类型未声明
          sharedX.value = timing(0, { duration: 300, easing: Easing.out(Easing.ease) }, () => {
            'worklet'
          })
          sharedOpacity.value = 0
          sharedSidebarX.value = timing(
            -shareSidebarWidth.value,
            // @ts-expect-error: WorkletEasing 官方类型未声明
            { duration: 300, easing: Easing.out(Easing.ease) },
            () => {
              'worklet'
            },
          )
        }

        break
    }
  }

  $this.handleShowSidebar = () => {
    console.log('handleShowSidebar')
  }
}
</script>

<style lang="scss"></style>
