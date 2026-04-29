<template>
  <view class="h-screen w-screen flex flex-row bg-meow-gradient">
    <view class="absolute sidebarContainer h-screen z-50" style="box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15)">
      <Sidebar :need-loading-resource="shouldLoadSidebar" />
    </view>

    <horizontal-drag-gesture-handler on-gesture-event="handlePen">
      <view class="indexContainer flex flex-col h-screen w-screen text-base relative">
        <!-- 遮罩层  -->
        <view id="overlay"></view>
        <navBar title="主页">
          <view class="flex flex-row gap-1.5 h-5 items-center" @tap="onClickMenu"> </view>
        </navBar>

        <!-- 内容主体 -->
        <ContentArea ref="contentAreaRef"></ContentArea>
      </view>
    </horizontal-drag-gesture-handler>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import Sidebar from '@/pages/index/components/Sidebar.vue'
import ContentArea from './components/ContentArea.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
defineOptions({
  name: 'CustomIndex',
})

// 加载资源
const shouldLoadSidebar = ref(false)

const prepareSidebarResources = () => {
  console.log('prepareSidebarResources')
  if (!shouldLoadSidebar.value) {
    shouldLoadSidebar.value = true
  }
}

onShow(() => {})

onShareAppMessage(() => {
  return {
    title: '',
    path: ``,
    promise: handleShareAppMessage('ShareAppMessage'),
  }
})

onShareTimeline(() => {
  return {
    title: '',
    path: `/pages/index/index?utm_source=ShareTimeline`,
    promise: handleShareAppMessage('ShareTimeline'),
  }
})

const handleShareAppMessage = async (utmSource: string) => {
  return {
    title: '',
    path: `/pages/index/index?utm_source=${utmSource}`,
    imageUrl: '',
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
