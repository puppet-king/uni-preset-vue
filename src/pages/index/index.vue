<template>
  <view class="page">
    <nav-bar title="首页" />
    <view class="flex flex-1 flex-col justify-center items-center">
      <image class="h-24 w-24" src="/static/logo.png" />
      <view class="flex justify-center">
        <text class="text-xl ">{{ title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
const title = ref("Hello")


defineOptions({
  name: "UserIndex",
})

</script>

<style>
</style>
