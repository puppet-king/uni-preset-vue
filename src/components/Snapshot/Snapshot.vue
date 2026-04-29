<template>
  <snapshot :id="snapshotId" :width="width" :height="height">
    <slot />
  </snapshot>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'

withDefaults(
  defineProps<{
    width?: number
    height?: number
  }>(),
  {
    width: 750,
    height: 1200,
  },
)

const snapshotId = ref('')
const cachedPath = ref('')

onMounted(() => {
  snapshotId.value = `snapshot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
})

const instance = getCurrentInstance()

const capture = (): Promise<string> => {
  if (cachedPath.value) return Promise.resolve(cachedPath.value)
  return new Promise((resolve, reject) => {
    const scope = instance?.proxy?.$scope
    if (!scope) return reject(new Error('no_scope'))
    scope
      .createSelectorQuery()
      .select(`#${snapshotId.value}`)
      .node()
      .exec((res: any) => {
        const node = res?.[0]?.node
        if (!node) return reject(new Error('no_node'))
        node.takeSnapshot({
          type: 'arraybuffer',
          format: 'png',
          success: (r: any) => {
            cachedPath.value = r.tempFilePath
            resolve(r.tempFilePath)
          },
          fail: reject,
        })
      })
  })
}

defineExpose({ capture })
</script>
