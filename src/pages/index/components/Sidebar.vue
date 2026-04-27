<template>
  <view class="h-screen flex flex-col w-full font-sans">
    <view :style="{ height: navHeight + 'px' }"></view>

    <view class="px-6 pt-4 flex items-center gap-2">
      <view class="w-1 h-6 bg-primary rounded-full"></view>
      <text class="text-2xl font-semibold text-secondary tracking-tight opacity-90"></text>
    </view>

    <scroll-view class="flex-1 px-4 py-4" :scroll-y="true" type="list" :show-scrollbar="false" enhanced> </scroll-view>

    <view class="p-4 pb-8 flex flex-row justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <view class="flex-1 flex flex-row gap-2.5 items-center" @tap="onTap">
        <image src="/static/index/cat-food.png" class="w-8 h-8 rounded-full box-border border-white shadow-sm"></image>
        <text class="text-sm font-black text-secondary tracking-tight">{{ userStore.userInfo.name ?? '喵星人' }}</text>
      </view>
      <view class="flex items-center gap-4 flex-row">
        <UiIcon icon="paper" color="black" size="44rpx" @tap="onJumpHistory"></UiIcon>
        <UiIcon icon="setting" color="black" size="44rpx" @tap="onTap"></UiIcon>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UiIcon from '@/components/ui-icon/ui-icon.vue'
import { useAgentsStore } from '@/stores/agents'
import { storeToRefs } from 'pinia'
import { COS_URL } from '@/configs/constant'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'

defineOptions({
  name: 'ClientSidebar',
})

const props = defineProps<{
  needLoadingResource: boolean
}>()

const isInit = ref(false)
const navHeight = ref(wx.getWindowInfo().statusBarHeight)
const agentsStore = useAgentsStore()
const system = useSystemStore()
const userStore = useUserStore()
const { orderedJudges, selectedJudgeKey } = storeToRefs(agentsStore)

watch(
  () => props.needLoadingResource,
  (val) => {
    if (val && !isInit.value) {
      isInit.value = true
    }
  },
  { immediate: true },
)

const handleChangeView = (key?: string) => {
  if (key) {
    system.vibrateShort()
    wx.showToast({ title: '暂不支持切换法官', icon: 'none' })
    // agentsStore.setJudge(key)
    console.log(`切换到法官: ${key}`)
  }
}

const onJumpHistory = () => {
  system.vibrateShort()
  wx.navigateTo({
    url: '/pages/history/index',
  })
}

const onTap = () => {
  system.vibrateShort()

  wx.showToast({
    title: '施工中',
    icon: 'none',
  })
}
</script>

<style scoped></style>
