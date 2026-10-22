<template>
  <view class="container">
    <NavBar title="首页" />
    <view class="flex flex-1 flex-col justify-center items-center">
      <view class="flex justify-center">
        <text class="text-xl">{{ title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/NavBar/NavBar.vue'
const title = ref('Hello World.')

defineOptions({
  name: 'UserIndex',
})
</script>
