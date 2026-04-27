import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  // 全局忽略
  {
    ignores: [
      'node_modules',
      'dist',
      'unpackage',
      'src/uni_modules', // 插件市场组件通常不校检
      'fui*', // 匹配 FirstUI 等前缀目录
      'uniCloud-aliyun',
      'src/utils/*.js', // 忽略 utils 下的所有 js（如果你只想校检 ts）
      'src/cloudfunctions',
      '*.min.js',
      '**/*.min.js',
      'bin',
      'build',
      'src/env.d.ts',
      'src/components/**/fui-*',
    ],
  },

  // 基础配置
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettierRecommended,

  {
    // 语言选项与全局变量
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
        // Uni-app & 微信小程序全局变量
        uni: 'readonly',
        wx: 'readonly',
        getCurrentPages: 'readonly',
        WechatMiniprogram: 'readonly',
        UniNamespace: 'readonly',
        getCurrentInstance: 'readonly',
      },
      // 关键：针对 Vue 文件使用正确的解析器
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },

    // 4. 自定义规则 (从你原有的配置平移并优化)
    rules: {
      // 基础规则
      semi: ['error', 'never'],
      'no-unused-vars': 'off', // 关闭原生，使用 TS 版

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],

      // Prettier 规则 (需与上面的 semi 保持一致)
      'prettier/prettier': [
        'error',
        {
          semi: false,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],

      // Vue 规则扩展
      'vue/multi-word-component-names': 'off', // Uni-app 页面通常是单单词，建议关闭
    },
  },
)
