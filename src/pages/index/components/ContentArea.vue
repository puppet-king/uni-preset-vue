<template>
  <scroll-view class="flex-1 flex flex-col px-4 pb-4 box-border" :scroll-y="true" :show-scrollbar="false">
  </scroll-view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script setup lang="ts">
defineOptions({
  name: 'ContentArea',
})
</script>
