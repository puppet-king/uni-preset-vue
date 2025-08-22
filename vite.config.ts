import uni from "@dcloudio/vite-plugin-uni"
import { defineConfig } from "vite"
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from "weapp-tailwindcss/vite"
import { WeappTailwindcssDisabled } from "./platform"
import postcssPlugins from "./postcss.config"
import Optimization from '@uni-ku/bundle-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  // uvtw 一定要放在 uni 后面
  plugins: [
    uni(),
    Optimization({
      enable: {
        'optimization': true,
        'async-import': false,
        'async-component': false,
      },
      dts: {
        enable: true,
        base: './',
      },
      logger: true,
    }),
    uvtw({
      rem2rpx: true,
      disabled: WeappTailwindcssDisabled,
      // 使用新的 ast-grep 来处理 js 资源，速度是 babel 的2倍左右
      // 需要先安装 `@ast-grep/napi`, 安装完成后再启用下方配置
      // jsAstTool: 'ast-grep',
      htmlMatcher: (file) => {
        if (file.indexOf('wxcomponents') === 0) {
          return false
        }
        return /.+\.(?:(?:wx|ax|jx|ks|tt|q|ty|xhs)ml|swan)$/.test(file)
      }
    }),
  ],
  // 内联 postcss 注册 tailwindcss
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
    // https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
})
