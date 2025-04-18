<template>
  <span :class="computedClass" :style="{fontSize: size}" @tap="onClick" />
</template>



<script setup>
defineOptions({
  name: "UiIcon"
})

import { computed } from "vue"
const emit = defineEmits(["click"])

// icon 缺省值
const iconVariants = (variant, color) => {
  const baseClass = "iconfont "

  const variantClasses = {
    kidStar:  "icon-kid-star", // 星星
    crown:  "icon-solar--crown-bold", // 皇冠
    left:  "icon-left", // 左边
    home:  "icon-hourse", // 主页
    check:  "icon-mdi--check-bold", // 对号 正确
    rubber:  "icon-jam--rubber", // 橡皮
    close:  "icon-close", // 关闭 || 错误
    closeSquareBold	:  "icon-close-square-bold", // 关闭
    closeSquare:  "icon-close-square", // 关闭
    undo: "icon-a-material-symbols--undo-rounded1", // 撤销
    ranking: "icon-ranking", // 排名
    leftBtnBold	: "icon-left-btn-bold", // 左边 粗体
    right	: "icon-right", // 右边
    refreshBold: "icon-refresh-bold", // 刷新 粗体
    circle: "icon-circle", // 圆圈
    gameBold: "icon-game-bold", // 游戏 可用于提示
    settingBold: "icon-setting-bold", // 设置
    infoBold: "icon-info-bold", // 信息 提示
    backSpaceBold: "icon-backspace-bold", // 返回
    activityBold: "icon-activity-bold",  // 活动
    filterBold: "icon-filter-bold" // 过滤
  }

  const colorClasses = {
    default: "text-neutral-400",
    neutral: "text-neutral-400",
    white: "text-white",
    black: "text-black",
    green: "text-green-400",
    blue: "text-blue-500",
    red: "text-red-500",
    custom: props.customColor
  }

  const darkColorClasses = {
    default: "dark:text-white",
    neutral: "text-neutral-400",
    white: "dark:text-back",
    black: "dark:text-white",
    blue: "text-blue-500",
    green: "text-green-400",
    red: "text-red-500"
  }

  const darkClass = props.isDarkMode ? (darkColorClasses[color] || darkColorClasses.default) : ""
  return `${baseClass} ${variantClasses[variant]} ${colorClasses[color] || colorClasses.default} ${darkClass}`
}

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: String, default: "80rpx" },
  color: { type:String, default: "default"},
  isDarkMode: { type: Boolean, default: true},
  customColor: { type: String, default: "" },
})

const computedClass = computed(() => iconVariants(props.icon, props.color))


const onClick = () => {
  emit("click")
}
</script>
