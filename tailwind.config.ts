import type { Config } from 'tailwindcss'

export default <Config>{
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'ping-fang': ['"PingFang SC"', 'sans-serif'],
      },
      fontSize: {
        // 1. 最小辅助字号 (原本的 10px 对应 20rpx)
        tiny: ['20rpx', { lineHeight: '1.2' }],
        // 2. 次级说明文字 (原本的 12px 对应 24rpx)
        sub: ['24rpx', { lineHeight: '1.4' }],
        // 3. 基础正文
        base: ['28rpx', { lineHeight: '1.5' }],
        // 4. 对话/陈述专用的黄金字号
        chat: ['30rpx', { lineHeight: '1.6' }],
        // 5. 小标题
        title: ['32rpx', { lineHeight: '1.4', fontWeight: '600' }],
      },
      colors: {
        primary: '', // 品牌主色：如按钮、高亮状态
        secondary: '', // 辅助色：用于区分主色的次要元素
        accent: '', // 强调色：用于点缀、告警或吸引注意的元素
        dark: '', // 深色文本/背景：通常用于深色模式或高对比度文字
        light: '', // 浅色文本/背景：通常用于背景底色
        black: '', // 纯黑或接近黑的文字
      },
      boxShadow: {
        // 建议补充：'card': '0 2rpx 10rpx rgba(0,0,0,0.05)' 等卡片阴影
      },
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom)', // 安全下边距
      },
    },
  },
  // https://weapp-tw.icebreaker.top/docs/quick-start/uni-app-css-macro
  plugins: [
    // iconsPlugin({
    // 在这里可以选择你要使用的 icon, 更多详见:
    // https://icon-sets.iconify.design/
    // collections: getIconCollections(["svg-spinners", "mdi"]),
    // }),
  ],
  corePlugins: {
    preflight: false,
    container: false,
    textIndent: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
    objectFit: false, // 关闭 object-fit
  },
}
