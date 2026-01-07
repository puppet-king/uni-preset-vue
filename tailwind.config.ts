import type { Config } from 'tailwindcss'
import { isMp } from './platform'

export default <Config>{
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // primary: 'var(--color-background)', // 主要颜色 适用于背景
      },
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  corePlugins: {
    // 小程序去使用 h5 的 preflight 和响应式 container 没有意义
    preflight: !isMp,
    container: !isMp,
  },
}
