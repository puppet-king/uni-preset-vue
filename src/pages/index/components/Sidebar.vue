<template>
  <view class="h-screen flex flex-col w-full font-sans">
    <view :style="{ height: navHeight + 'px' }"></view>

    <view class="px-6 pt-4 flex items-center gap-2">
      <view class="w-1 h-6 bg-primary rounded-full"></view>
      <text class="text-2xl font-semibold text-secondary tracking-tight opacity-90"></text>
    </view>

    <scroll-view class="flex-1 px-4 py-4" :scroll-y="true" type="list" :show-scrollbar="false" enhanced> </scroll-view>
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
import { useSystemStore } from '@/stores/system'

defineOptions({
  name: 'ClientSidebar',
})

const props = defineProps<{
  needLoadingResource: boolean
}>()

const navHeight = ref(wx.getWindowInfo().statusBarHeight)
</script>

<style scoped></style>
