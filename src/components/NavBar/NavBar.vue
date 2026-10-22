<template>
  <view :class="['w-full box-border z-50', absolute ? 'absolute top-0 left-0 right-0' : '']">
    <view v-if="statusBar" class="w-full box-border" :style="{ height: statusBarHeight + 'px' }" />
    <view
      class="w-full relative flex flex-row items-center justify-center font-medium truncate"
      style="height: 44px"
      :style="{ fontSize }"
    >
      <view class="flex absolute left-1 items-center z-50">
        <slot>
          <view
            v-if="showBack"
            class="w-11 h-11 flex items-center justify-center transition-opacity"
            style="margin-left: -4px"
            hover-class="!opacity-60"
            @tap="onGoBack"
          >
            <UiIcon icon="arrowLeft" :size="iconSize" color="black" />
          </view>
          <view
            v-if="showHome"
            class="w-11 h-11 flex items-center justify-center transition-opacity"
            hover-class="!opacity-60"
            style="margin-left: -4px"
            @click="onGoHome"
          >
            <UiIcon icon="arrowLeft" :size="iconSize" color="black" />
          </view>
        </slot>
      </view>
      <text max-lines="1" class="font-semibold"> {{ title }}</text>
      <view class="flex absolute items-center justify-end z-50" :style="{ right: rightMargin + 'px' }">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>
<script>
import UiIcon from '@/components/UIIcon/UIIcon.vue'
import { TAB_BAR_STYLE_LIST } from '@/configs/constant'

export default {
  name: 'NavBar',
  components: { UiIcon },
  options: {
    virtualHost: true,
  },
  props: {
    absolute: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    fontSize: {
      type: String,
      default: '34rpx',
    },
    iconColorClass: {
      type: String,
      default: 'text-neutral-400 dark:text-white',
    },
    iconSize: {
      type: String,
      default: '46rpx',
    },
    leftClickFun: {
      type: Function,
      default: null,
    },
    //是否包含状态栏
    statusBar: {
      type: Boolean,
      default: true,
    },
  },
  emits: [],
  data() {
    return {
      statusBarHeight: uni.getWindowInfo().statusBarHeight,
      showBack: false,
      showHome: false,
      showClose: false,
      rightMargin: 100,
    }
  },
  created() {
    const res = wx.getMenuButtonBoundingClientRect()
    const systemInfo = uni.getWindowInfo()
    this.rightMargin = systemInfo.screenWidth - res.left + 10

    this.updateNavigationBar()
    this.setNavigationBarColor()
  },
  methods: {
    updateNavigationBar() {
      // 获取当前的页面栈
      const pages = getCurrentPages()
      const stackLength = pages.length
      const currentPage = pages[stackLength - 1]

      // 不存在状态栏, 说明是 routeType: 'wx://cupertino-modal' 等方式进来
      if (!this.statusBar && stackLength > 1) {
        this.showClose = true
        return
      }

      const isTabBarPage = TAB_BAR_STYLE_LIST.some((tab) => tab.pagePath === currentPage.route)
      if (isTabBarPage) return

      if (stackLength === 1) {
        this.showHome = true
      } else {
        this.showBack = true
      }
    },
    onGoBack() {
      console.log('navigateBack')
      uni.navigateBack({
        success: () => {
          wx.disableAlertBeforeUnload()
        },
        fail: (error) => {
          console.error('navigateBack', error)
          uni.reLaunch({
            url: '/pages/index/index',
          })
        },
      })
    },
    onGoHome() {
      // console.log('onGoHome')
      void uni.vibrateShort()
      uni.reLaunch({
        url: '/pages/index/index',
      })
    },
  },
}
</script>
