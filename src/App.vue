<script setup lang="ts">
import { onLaunch, onHide, onLoad } from '@dcloudio/uni-app'
import { AUTH_STORAGE_KEYS } from '@/configs/constant'
import { useUserStore } from '@/stores/user'
import userLogin from '@/utils/userLogin'
import { useAuthStore } from '@/stores/auth'

onLaunch(() => {
  console.log('App Launch')
  // 检查版本更新
  checkForUpdate()
  // 检查登录状态
  checkLoginStatus()
})

onLoad((res: any) => {
  console.log('App Show', res.scene)
})

onHide(() => {
  console.log('App Hide')
})

// 检查更新状态
const checkForUpdate = () => {
  console.log('############checkForUpdate###############')

  const startParamObj = uni.getEnterOptionsSync()
  // scene === 1154 即分享到朋友圈, 此时用户会打开单页面需要单独适配
  if (uni.canIUse('getUpdateManager') && startParamObj.scene !== 1154) {
    // 处理小程序更新业务
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateFailed(function () {
          return uni.showToast({
            title: '新版本下载失败',
            icon: 'error',
          })
        })
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经下载好，是否重启当前应用？',
            confirmColor: '#3CC51F',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            },
          })
        })
        updateManager.onUpdateFailed(function () {
          uni.showModal({
            title: '发现新版本',
            content: '请删除当前小程序，重启搜索打开...',
          })
        })
      }
    })
  }
}

// 检查登录状态
const checkLoginStatus = async () => {
  // #ifdef MP-WEIXIN
  const auth = useAuthStore()
  const user = useUserStore()

  try {
    const valueList = wx.batchGetStorageSync([
      AUTH_STORAGE_KEYS.TOKEN,
      AUTH_STORAGE_KEYS.EXPIRES_IN,
      AUTH_STORAGE_KEYS.REFRESH_TOKEN,
      AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_IN,
      AUTH_STORAGE_KEYS.UUID,
    ])

    if (valueList && valueList[3]) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (parseInt(valueList[3]) < currentTime) {
        console.log('[Auth] checkLoginStatus 用户状态 过期, 重新登陆')
        await userLogin.wxLogin()

        void user.setUserData(true)
      } else {
        console.log('[Auth] checkLoginStatus 用户状态 正常')
        auth.setAuth({
          uuid: valueList[4] || '',
          token: valueList[0],
          expiresIn: parseInt(valueList[1]),
          refreshToken: valueList[2],
          refreshTokenExpiresIn: parseInt(valueList[3]),
        })

        void user.setUserData(true)
      }
    } else {
      console.log('[Auth] checkLoginStatus 用户状态 新用户登陆')
      await userLogin.wxLogin()
      void user.setUserData(true)
    }
  } catch (e) {
    console.error('checkLoginStatus 异常', e)
  }
  // #endif
}
</script>
<style lang="scss">
@use '@/style/index.scss';

/*  #ifdef  H5  */
svg {
  display: initial;
}
/*  #endif  */
</style>
