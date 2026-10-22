import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'
import Optimization from '@uni-ku/bundle-optimizer'
import { WeappTailwindcss } from 'weapp-tailwindcss/vite'
import { resolve } from 'path'

const postcssPlugins = []

// https://vitejs.dev/config/
export default defineConfig({
  // WeappTailwindcss 一定要放在 uni 后面
  plugins: [
    uni(),
    Optimization({
      enable: {
        optimization: true,
        'async-import': false,
        'async-component': false,
      },
      dts: {
        enable: true,
        base: './',
      },
      logger: false,
    }),
    WeappTailwindcss({
      cssEntries: [resolve(__dirname, 'src/main.css')],
      cssOptions: {
        rem2rpx: true,
        cssCalc: false,
        cssRemoveHoverPseudoClass: true,
        cssRemoveProperty: true,
        autoprefixer: {
          add: false, // 阻止自动生成 -webkit- 前缀
          remove: true, // 自动清除代码中已存在的厂商前缀
          overrideBrowserslist: ['ios >= 13', 'chrome >= 80'], // 提高目标版本，从源头干掉老旧前缀
        },
      },
      htmlMatcher: (file) => {
        if (file.indexOf('wxcomponents') === 0) {
          return false
        }

        return /.+\.(?:(?:wx|ax|jx|ks|tt|q|ty|xhs)ml|swan)$/.test(file)
      },
    }),
  ],
  build: {
    // minify: 'esbuild',
    sourcemap: false,
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    rollupOptions: {
      treeshake: false,
    },
  },
  esbuild: {
    // 生产环境：仅擦除调试日志，保留 console.error / console.warn 便于线上排障
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 内联 postcss
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
    // https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
