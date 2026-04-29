<template>
  <view class="w-full box-border z-50">
    <view v-if="statusBar" class="w-full box-border" :style="{ height: statusBarHeight + 'px' }" />
    <view
      class="w-full relative flex flex-row items-center justify-center font-medium truncate"
      style="height: 44px"
      :style="{ fontSize }"
    >
      <view class="flex absolute w-28 left-2 items-center z-50">
        <slot>
          <UiIcon
            v-if="showBack"
            icon="arrowLeft"
            :size="iconSize"
            color="custom"
            :custom-color="iconColorClass"
            @tap="onGoBack"
          />

          <UiIcon
            v-if="showHome"
            icon="home"
            :size="iconSize"
            color="custom"
            :custom-color="iconColorClass"
            @click="onGoHome"
          />
        </slot>
      </view>
      <text max-lines="1"> {{ title }}</text>
      <view class="flex absolute items-center justify-end z-50" :style="{ right: rightMargin + 'px' }">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>
<script>
import UiIcon from '@/components/UiIcon/UiIcon.vue'
import { TabBarStyle } from '@/configs/constant'

export default {
  name: 'NavBar',
  components: { UiIcon },
  props: {
    title: {
      type: String,
      default: '',
    },
    //是否需要底部分割线
    splitLine: {
      type: Boolean,
      default: false,
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
    theme: {
      type: String,
      default: 'default', // 主题有默认、gray
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
      systemTheme: uni.getAppBaseInfo().theme, // light、 dark
      showBack: false,
      showHome: false,
      showClose: false,
      rightMargin: 100,
    }
  },
  computed: {
    themeStyle() {
      switch (this.theme) {
        case 'gray':
          return 'bg-gray-100 text-black dark:text-white dark:bg-black '
        case 'transparent':
          return ''
        default:
          return 'bg-white dark:bg-black text-black dark:text-white'
      }
    },
  },
  created() {
    const res = wx.getMenuButtonBoundingClientRect()
    const systemInfo = uni.getWindowInfo()
    this.rightMargin = systemInfo.screenWidth - res.left + 10

    this.updateNavigationBar()
    this.setNavigationBarColor()
  },
  methods: {
    setNavigationBarColor() {
      if (this.theme === 'transparent') {
        uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#000000' })
      } else if (this.systemTheme === 'light') {
        uni.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' })
      } else {
        uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#000000' })
      }
    },
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

      const isTabBarPage = TabBarStyle.some((tab) => tab.pagePath === currentPage.route)
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

<style scoped>
.line {
  position: relative;
  border-bottom: 0;
}

.line::after {
  content: '';
  position: absolute;
  border-bottom: 1px solid #eeeeee !important;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
}

@media (prefers-color-scheme: dark) {
  .line::after {
    border-bottom: 1px solid #333333 !important;
  }
}
</style>
