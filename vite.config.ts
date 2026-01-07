import uni from '@dcloudio/vite-plugin-uni'
import Optimization from '@uni-ku/bundle-optimizer'
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite'
import postcssPlugins from './postcss.config'
import {defineConfig, loadEnv} from 'vite'


// https://vitejs.dev/config/
export default ({ mode }) => {
  // const {  VITE_API_BASE_URL } = loadEnv(mode, process.cwd())
  // console.log('mode', mode,  VITE_API_BASE_URL, process.env.NODE_ENV )
  const isProd =  process.env.NODE_ENV  === 'production'


  return defineConfig({
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
        logger: false,
      }),
      uvtw({
        rem2rpx: true,
        mangle: false,
        // injectAdditionalCssVarScope: true,
        cssPreflight: {
          'border-color': false
        },
        // 需要先安装 `@ast-grep/napi`, 安装完成后再启用下方配置
        jsAstTool: 'ast-grep',
        htmlMatcher: (file) => {
          if (file.indexOf('wxcomponents') === 0) {
            return false
          }
          return /.+\.(?:(?:wx|ax|jx|ks|tt|q|ty|xhs)ml|swan)$/.test(file)
        }
        // mangle: true, // 压缩混淆
      })
    ],
    build:{
      minify: 'terser',
      sourcemap: false,
      terserOptions: isProd
        ? {
          compress: {
            pure_funcs: ['console.log', 'console.group', 'console.groupEnd', 'console.debug'],
            drop_debugger: true,         // 删除 debugger
          },
          format: {
            comments: false,
          },
          mangle: true,                  // 混淆变量
        }
        : {
          compress: {
            // 测试环境不删除任何 console
            drop_debugger: false,
          },
        }
    },
    // 内联 postcss 注册 tailwindcss
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
}
