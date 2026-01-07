<template>
  <view class="w-full box-border z-50" :class="[themeStyle, splitLine ? 'line' : '']">
    <view v-if="statusBar" class="w-full box-border" :style="{ height: statusBarHeight+'px' }" />
    <view class="w-screen relative flex flex-row items-center  justify-center font-medium truncate" style="height: 44px" :style="{fontSize}">
      <view :class="'flex absolute w-[240rpx] left-2 items-center z-50'">
        <slot>
          <ui-icon
            v-if="showBack"
            icon="left"
            :size="iconSize"
            color="custom"
            :custom-color="iconColorClass"
            @tap="onGoBack"
          />

          <ui-icon
            v-if="showHome"
            icon="home"
            :size="iconSize"
            color="custom"
            :custom-color="iconColorClass"
            @click="onGoHome"
          />

          <ui-icon
            v-if="showClose"
            icon="close"
            :size="iconSize"
            color="custom"
            :custom-color="iconColorClass"
            @tap="onGoBack"
          />
        </slot>
      </view>
      {{ title }}
    </view>
  </view>
</template>

<script>
import config from "@/configs/app"
import UiIcon from "@/components/ui-icon/ui-icon.vue"

export default {
  name: "NavBar",
  components: { UiIcon },
  props: {
    title: {
      type: String,
      default: ""
    },
    //是否需要底部分割线
    splitLine: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: "34rpx"
    },
    iconColorClass: {
      type: String,
      default: "text-neutral-400 dark:text-white"
    },
    iconSize: {
      type: String,
      default: "46rpx"
    },
    leftClickFun: {
      type: Function,
      default: null
    },
    theme: {
      type: String,
      default: "default" // 主题有默认、gray
    },
    //是否包含状态栏
    statusBar: {
      type: Boolean,
      default: true
    }
  },
  emits: [],
  data() {
    return {
      statusBarHeight: wx.getWindowInfo().statusBarHeight,
      systemTheme: wx.getAppBaseInfo().theme,  // light、 dark
      showBack: false,
      showHome: false,
      showClose: false
    }
  },
  computed: {
    themeStyle() {
      switch (this.theme) {
        case "gray":
          return "bg-gray-100 text-black dark:text-white dark:bg-black "
        case "transparent":
          return ""
        default:
          return "bg-white dark:bg-black text-black dark:text-white"
      }
    }
  },
  created() {
    this.updateNavigationBar()
    this.setNavigationBarColor()
  },
  methods: {
    setNavigationBarColor() {
      if (this.theme === "transparent") {
        uni.setNavigationBarColor({frontColor: "#ffffff", backgroundColor: "#000000"})
      } else if(this.systemTheme === "light") {
        uni.setNavigationBarColor({frontColor: "#000000", backgroundColor: "#ffffff"})
      } else {
        uni.setNavigationBarColor({frontColor: "#ffffff", backgroundColor: "#000000"})
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

      const isTabBarPage = config.TabBarStyle.some(tab => tab.pagePath === currentPage.route)
      if (isTabBarPage) return

      if (stackLength === 1) {
        this.showHome = true
      } else {
        this.showBack = true
      }
    },
    onGoBack() {
      console.log("navigateBack")

      uni.navigateBack({
        success: () => {
          wx.disableAlertBeforeUnload()
        },
        fail: (error) => {
          console.error("navigateBack", error)
          uni.switchTab({
            url: "/pages/index/index"
          })
        }
      })
    },
    onGoHome() {
      // console.log('onGoHome')
      wx.vibrateShort({ type: "light" })
      uni.switchTab({
        url: "/pages/index/index"
      })
    }
  }
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
  border-bottom: 1px solid #EEEEEE !important;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
}


@media (prefers-color-scheme: dark){
  .line::after {
    border-bottom: 1px solid #333333 !important;
  }
}
</style>
