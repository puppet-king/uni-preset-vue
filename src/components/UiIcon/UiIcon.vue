<template>
  <span :class="computedClass" :style="{ fontSize: size }" @tap="onClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'UiIcon',
})

type ColorVariant =
  | 'default'
  | 'inactive'
  | 'active'
  | 'disabled'
  | 'neutral'
  | 'white'
  | 'black'
  | 'green'
  | 'blue'
  | 'red'
  | 'gray'
  | 'gray600'
  | 'slate600'
  | 'slate700'
  | 'slate800' // 新增：用于超深色图标，比纯黑更有质感
  | 'indigo600' // 新增：建议作为你的“切换模式”主色
  | 'rose500' // 新增：建议作为“生成报告/结束”的颜色，比纯红更高级
  | 'custom'

const props = defineProps({
  icon: {
    type: String as () => IconVariant, // 绑定联合类型，输入时自动提示所有 key
    required: true,
  },
  size: { type: String, default: '48rpx' },
  color: { type: String as () => ColorVariant, default: 'black' },
  isDarkMode: { type: Boolean, default: false },
  customColor: { type: String, default: '' },
})

const emit = defineEmits(['click'])

const variantClasses = {
  // 箭头类图标
  arrowDownSquare: 'icon-a-Arrow-DownSquare', // 向下箭头（方形）
  arrowDown2: 'icon-a-Arrow-Down2', // 向下箭头（细版）
  arrowLeftCircle: 'icon-a-Arrow-LeftCircle', // 向左箭头（圆形）
  arrowUp2: 'icon-a-Arrow-Up2', // 向上箭头（细版）
  arrowRightCircle: 'icon-a-Arrow-RightCircle', // 向右箭头（圆形）
  arrowLeftSquare: 'icon-a-Arrow-LeftSquare', // 向左箭头（方形）
  arrowRight2: 'icon-a-Arrow-Right2', // 向右箭头（细版）
  arrowUp: 'icon-a-Arrow-Up', // 向上箭头（粗版）
  arrowDown3: 'icon-a-Arrow-Down3', // 向下箭头（粗版）
  arrowDown: 'icon-a-Arrow-Down', // 向下箭头（默认版）
  arrowUpSquare: 'icon-a-Arrow-UpSquare', // 向上箭头（方形）
  arrowLeft2: 'icon-a-Arrow-Left2', // 向左箭头（细版）
  arrowRightSquare: 'icon-a-Arrow-RightSquare', // 向右箭头（方形）
  arrowLeft: 'icon-a-Arrow-Left', // 向左箭头（默认版）
  arrowRight3: 'icon-a-Arrow-Right3', // 向右箭头（粗版）
  arrowRight: 'icon-a-Arrow-Right', // 向右箭头（默认版）
  arrowUpCircle: 'icon-a-Arrow-UpCircle', // 向上箭头（圆形）
  arrowDownCircle: 'icon-a-Arrow-DownCircle', // 向下箭头（圆形）

  // 用户/社交类图标
  twoUser: 'icon-a-2User', // 2人用户
  threeUser: 'icon-a-3User', // 3人用户
  addUser: 'icon-a-AddUser', // 添加用户

  // 功能类图标
  activity: 'icon-Activity', // 活动
  bag3: 'icon-a-Bag3', // 购物袋（样式3）
  layoutGrid: 'icon-Category', // 分类
  buy: 'icon-Buy', // 购买
  download: 'icon-Download', // 下载
  callMissed: 'icon-a-CallMissed', // 未接来电
  dangerCircle: 'icon-a-DangerCircle', // 危险提示（圆形）
  bookmark: 'icon-Bookmark', // 书签
  discovery: 'icon-Discovery', // 发现
  dangerTriangle: 'icon-a-DangerTriangle', // 危险提示（三角形）
  calling: 'icon-Calling', // 正在通话
  chart: 'icon-Chart', // 图表（统计/排名）
  callSilent: 'icon-a-CallSilent', // 静音通话
  call: 'icon-Call', // 通话
  chat: 'icon-Chat', // 聊天
  home: 'icon-Home', // 主页
  filter: 'icon-Filter', // 过滤
  editSquare: 'icon-a-EditSquare', // 编辑（方形）
  moreCircle: 'icon-a-MoreCircle', // 更多（圆形）
  infoSquare: 'icon-a-InfoSquare', // 信息（方形）
  delete: 'icon-Delete', // 删除
  hide: 'icon-Hide', // 隐藏
  paperFail: 'icon-a-PaperFail', // 文档失败
  logout: 'icon-Logout', // 退出登录
  play: 'icon-play', // 播放
  pause: 'icon-pause', // 暂停
  notification: 'icon-Notification', // 通知
  profile: 'icon-Profile', // 个人资料
  login: 'icon-Login', // 登录
  bag: 'icon-Bag', // 购物袋（默认版）
  show: 'icon-Show', // 显示
  paperUpload: 'icon-a-PaperUpload', // 文档上传
  voice: 'icon-Voice', // 语音（默认版）
  voice3: 'icon-a-Voice3', // 语音（样式3）
  voiceBold: 'icon-voice-bold', // 语音 加粗
  video: 'icon-Video', // 视频
  setting: 'icon-Setting', // 设置
  timeSquare: 'icon-a-TimeSquare', // 时间（方形）
  shieldDone: 'icon-a-ShieldDone', // 盾牌完成（安全通过）

  game: 'icon-Game', // 游戏
  calendar: 'icon-Calendar', // 日历
  star: 'icon-Star', // 星星
  image: 'icon-Image', // 图片
  search: 'icon-Search', // 搜索
  lock: 'icon-Lock', // 锁定
  paperNegative: 'icon-a-PaperNegative', // 文档否定（无效）
  send: 'icon-Send', // 发送
  upload: 'icon-Upload', // 上传
  paperPlus: 'icon-a-PaperPlus', // 文档添加（新增）
  ticket: 'icon-Ticket', // 票据/优惠券
  work: 'icon-Work', // 工作
  message: 'icon-Message', // 消息
  camera: 'icon-Camera', // 相机
  heart: 'icon-Heart', // 爱心
  graph: 'icon-Graph', // 图形/图表
  ticketStar: 'icon-a-TicketStar', // 星级票据
  wallet: 'icon-Wallet', // 钱包
  edit: 'icon-Edit', // 编辑（默认版）
  timeCircle: 'icon-a-TimeCircle', // 时间（圆形）
  tickSquare: 'icon-a-TickSquare', // 对勾（方形）
  password: 'icon-Password', // 密码
  closeSquare: 'icon-a-CloseSquare', // 关闭（方形）
  discount: 'icon-Discount', // 折扣
  folder: 'icon-Folder', // 文件夹
  document: 'icon-Document', // 文档
  image3: 'icon-a-Image3', // 图片（样式3）
  location: 'icon-Location', // 位置
  moreSquare: 'icon-a-MoreSquare', // 更多（方形）
  paperDownload: 'icon-a-PaperDownload', // 文档下载
  scan: 'icon-Scan', // 扫描
  paper: 'icon-Paper', // 纸张/文档（基础版）
  shieldFail: 'icon-a-ShieldFail', // 盾牌失败（安全警告）
  swap: 'icon-Swap', // 交换/切换
  unlock: 'icon-Unlock', // 解锁

  volumeOff: 'icon-a-VolumeOff', // 静音
  volumeDown: 'icon-a-VolumeDown', // 音量减小
  volumeUp: 'icon-a-VolumeUp', // 音量增大
  volumeUpBold: 'icon-volume_up-bold', // 音量增大
  filter3: 'icon-a-Filter3', // 过滤（样式3）
  plus: 'icon-plus', // 加号
}

// icon 缺省值
const iconVariants = (variant: IconVariant, color: ColorVariant) => {
  const baseClass = 'iconfont '

  const colorClasses = {
    default: 'text-neutral-400',
    neutral: 'text-neutral-400',
    white: 'text-white',
    black: 'text-black',
    green: 'text-green-400',
    blue: 'text-blue-500', // 保留兼容
    indigo600: 'text-indigo-600', // 【推荐使用】替代原来的 blue，更有大厂感
    red: 'text-red-500',
    rose500: 'text-rose-500', // 【推荐使用】替代红/绿，用于终止操作
    gray: 'text-gray-400',
    gray600: 'text-gray-600',
    slate600: 'text-slate-600',
    slate700: 'text-slate-700',
    slate800: 'text-slate-800',
    active: 'text-black',
    disabled: 'text-black/90',
    custom: props.customColor, // 确保这个变量能正确映射
  }

  const darkColorClasses = {
    default: 'dark:text-white',
    neutral: 'text-neutral-400',
    white: 'dark:text-back',
    black: 'dark:text-white',
    blue: 'text-blue-500',
    green: 'text-green-400',
    red: 'text-red-500',
  }

  const darkClass = props.isDarkMode ? darkColorClasses[color] || darkColorClasses.default : ''
  return `${baseClass} ${variantClasses[variant]} ${colorClasses[color] || colorClasses.default} ${darkClass}`
}

type IconVariant = keyof typeof variantClasses

const computedClass = computed(() => iconVariants(props.icon, props.color))

const onClick = () => {
  emit('click')
}
</script>
