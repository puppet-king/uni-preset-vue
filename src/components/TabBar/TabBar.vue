<template>
  <view class="h-18 bg-white flex flex-row rounded-full shadow-card absolute bottom-7 left-4.5 right-4.5 w-auto">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="flex flex-row justify-center items-center relative"
      :style="{ flex: current === index ? 1.3 : 1 }"
      :data-index="index"
      hover-class="!opacity-80"
      @tap="onChange"
    >
      <view v-if="current === index" class="absolute w-4/5 top-3 bottom-3 rounded-full bg-primary" />

      <image class="z-10 w-6 h-6" :src="item.iconPath" />

      <text class="z-10 text-base text-black px-1 font-medium">{{ current === index ? item.text : '' }}</text>
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
import { ref } from 'vue'
import { TAB_BAR_STYLE_LIST } from '@/configs/constant'

defineProps({
  current: { default: 0, type: Number },
})

const emits = defineEmits(['click'])

const list = ref(TAB_BAR_STYLE_LIST)

// 切换tab事件
const onChange = (event: any) => {
  const { index } = event.currentTarget.dataset

  emits('click', {
    index: index,
    ...list.value[index],
  })
}
</script>
<style></style>
