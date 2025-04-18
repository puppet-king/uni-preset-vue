<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
onLaunch(() => {
  console.log("App Launch")
  // 检查版本更新
  checkForUpdate()

  // 检查登录状态
  checkLoginStatus()
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})


// 检查更新状态
const checkForUpdate = () => {
  console.log("############checkForUpdate###############")

  const startParamObj = uni.getEnterOptionsSync()
  // scene === 1154 即分享到朋友圈, 此时用户会打开单页面需要单独适配
  if (uni.canIUse("getUpdateManager") && startParamObj.scene !== 1154) {
    // 处理小程序更新业务
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateFailed(function() {
          return uni.showToast({
            title: "新版本下载失败",
            icon: "error"
          })
        })
        updateManager.onUpdateReady(function() {
          uni.showModal({
            title: "更新提示",
            content: "新版本已经下载好，是否重启当前应用？",
            confirmColor: "#3CC51F",
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function() {
          uni.showModal({
            title: "发现新版本",
            content: "请删除当前小程序，重启搜索打开..."
          })
        })
      }
    })
  }
}

// 检查登录状态
const checkLoginStatus = () => {
}

</script>
<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/utilities";
@import "tailwindcss/components";

@import '@/style/index.scss';

/*  #ifdef  H5  */
svg {
  display: initial;
}
/*  #endif  */


@layer components {
  .page {
    @apply flex flex-col h-screen w-screen bg-gray-100 dark:bg-black dark:text-white text-black
  }
}
</style>
