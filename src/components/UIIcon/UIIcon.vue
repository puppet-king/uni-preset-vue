<template>
  <view :class="computedClass" :style="computedStyle" @tap="onClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'UIIcon',
})

// 仅保留 4 种固定主色：主题色(primary)、灰色(gray)、黑色(black)、白色(white) + 自定义(custom)
export type ColorVariant = 'primary' | 'gray' | 'black' | 'white' | 'custom'

const props = defineProps({
  icon: {
    type: String as () => IconVariant,
    required: true,
  },
  size: { type: String, default: '24px' },
  color: { type: String as () => ColorVariant, default: 'black' },
  isDarkMode: { type: Boolean, default: false },
  customColor: { type: String, default: '' },
})

const emit = defineEmits(['click'])

// 严格 1:1 映射 @src/style/icon.scss 中定义的全部 96 个 iconfont 图标
const variantClasses = {
  // 1. 系统与基础控制
  loading: 'icon-loading',
  setting: 'icon-Setting',
  bell: 'icon-bell',
  logout: 'icon-Logout',
  logOut: 'icon-log-out',
  type: 'icon-type',
  layoutGrid: 'icon-layout-grid',
  shield: 'icon-shield',
  menu: 'icon-menu',
  x: 'icon-x',

  // 2. 箭头方向
  arrowDown2: 'icon-a-Arrow-Down2',
  arrowUp2: 'icon-a-Arrow-Up2',
  arrowLeftSquare: 'icon-a-Arrow-LeftSquare',
  arrowLeft: 'icon-a-Arrow-Left',
  arrowLeft2: 'icon-a-Arrow-Left2',
  arrowRight3: 'icon-a-Arrow-Right3',
  arrowRight2: 'icon-a-Arrow-Right2',
  arrowUp3: 'icon-a-Arrow-Up3',
  arrowDownSquare: 'icon-a-Arrow-DownSquare',
  arrowRight: 'icon-a-Arrow-Right',
  arrowRightSquare: 'icon-a-Arrow-RightSquare',
  arrowUp: 'icon-a-Arrow-Up',
  arrowUpSquare: 'icon-a-Arrow-UpSquare',

  // 3. 用户与人员
  addUser: 'icon-a-AddUser',
  twoUser: 'icon-a-2User',
  threeUser: 'icon-a-3User',
  profile: 'icon-Profile',

  // 4. 安全与危险提示
  dangerTriangle: 'icon-a-DangerTriangle',
  dangerCircle: 'icon-a-DangerCircle',
  closeSquare: 'icon-a-CloseSquare',
  shieldDone: 'icon-a-ShieldDone',
  shieldFail: 'icon-a-ShieldFail',
  lock: 'icon-Lock',
  unlock: 'icon-Unlock',
  password: 'icon-Password',

  // 5. 通讯与消息
  calling: 'icon-Calling',
  chat: 'icon-Chat',
  camera: 'icon-Camera',
  callMissed: 'icon-a-CallMissed',
  call: 'icon-Call',
  callSilent: 'icon-a-CallSilent',
  message: 'icon-Message',
  send: 'icon-Send',
  notification: 'icon-Notification',
  heart: 'icon-Heart',

  // 6. 音视频与多媒体
  voice: 'icon-Voice',
  voice3: 'icon-a-Voice3',
  volumeDown: 'icon-a-VolumeDown',
  volumeUp: 'icon-a-VolumeUp',
  volumeOff: 'icon-a-VolumeOff',
  play: 'icon-Play',
  video: 'icon-Video',
  image: 'icon-Image',

  // 7. 文档、文件与通用功能
  category: 'icon-Category',
  bookmark: 'icon-Bookmark',
  download: 'icon-Download',
  chart: 'icon-Chart',
  graph: 'icon-Graph',
  filter: 'icon-Filter',
  filter3: 'icon-a-Filter3',
  folder: 'icon-Folder',
  home: 'icon-Home',
  editSquare: 'icon-a-EditSquare',
  location: 'icon-Location',
  hide: 'icon-Hide',
  show: 'icon-Show',
  login: 'icon-Login',
  moreCircle: 'icon-a-MoreCircle',
  moreSquare: 'icon-a-MoreSquare',
  paperNegative: 'icon-a-PaperNegative',
  bag3: 'icon-a-Bag3',
  bag: 'icon-Bag',
  paper: 'icon-Paper',
  paperFail: 'icon-a-PaperFail',
  paperUpload: 'icon-a-PaperUpload',
  paperDownload: 'icon-a-PaperDownload',
  paperPlus: 'icon-a-PaperPlus',
  document: 'icon-Document',
  tickSquare: 'icon-a-TickSquare',
  swap: 'icon-Swap',
  timeSquare: 'icon-a-TimeSquare',
  timeCircle: 'icon-a-TimeCircle',
  ticket: 'icon-Ticket',
  ticketStar: 'icon-a-TicketStar',
  upload: 'icon-Upload',
  infoSquare: 'icon-a-InfoSquare',
  wallet: 'icon-Wallet',
  scan: 'icon-Scan',
  work: 'icon-Work',
  calendar: 'icon-Calendar',
  edit: 'icon-Edit',
  delete: 'icon-Delete',
  star: 'icon-Star',
  plus: 'icon-Plus',
  discount: 'icon-Discount',
  buy: 'icon-Buy',
}

export type IconVariant = keyof typeof variantClasses

// 固定的 4 种基础色彩方案
const colorClasses: Record<string, string> = {
  primary: 'text-primary', // 主题色 (#1D4ED8)
  gray: 'text-slate-500', // 灰色
  black: 'text-slate-900', // 黑色
  white: 'text-white', // 白色
}

const darkColorClasses: Record<string, string> = {
  primary: 'text-primary',
  gray: 'text-slate-400',
  black: 'dark:text-white',
  white: 'dark:text-slate-900',
}

const iconVariants = (variant: IconVariant, color: ColorVariant | string) => {
  const baseClass = 'iconfont'
  const targetClass = variantClasses[variant] || 'icon-loading'

  let colorClass = colorClasses[color]
  if (!colorClass) {
    // 兼容历史传参归一化
    if (color.includes('gray') || color.includes('slate') || color.includes('stone')) {
      colorClass = colorClasses.gray
    } else if (color.includes('blue') || color.includes('indigo')) {
      colorClass = colorClasses.primary
    } else {
      colorClass = colorClasses.black
    }
  }

  const darkClass = props.isDarkMode ? darkColorClasses[color] || '' : ''
  return `${baseClass} ${targetClass} ${colorClass} ${darkClass}`
}

const computedClass = computed(() => iconVariants(props.icon, props.color))

const computedStyle = computed(() => {
  const styles: Record<string, string> = { fontSize: props.size }
  if (
    props.color === 'custom' &&
    props.customColor &&
    (props.customColor.startsWith('#') || props.customColor.startsWith('rgb') || props.customColor.startsWith('var('))
  ) {
    styles.color = props.customColor
  }
  return styles
})

const onClick = () => {
  emit('click')
}
</script>
