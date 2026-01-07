module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        requireConfigFile: true,
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ['import'],
    extends: [
        'eslint:recommended',
        // 'plugin:vue/recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended' // TS 官方推荐规则（如禁止 any、校验类型定义等）
    ],
    globals: {
      uni: 'readonly',
      wx: 'readonly',
      getCurrentPages: 'readonly',
      WechatMiniprogram: 'readonly',
      UniNamespace: 'readonly',
    },
    rules: {
        'import/no-dynamic-require': 'error',
        semi: ['error', 'never'], // 要求在语句末尾不使用分号。
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        camelcase: ['error', { properties: 'never' }],
        eqeqeq: ['error', 'always'], // 要求使用 === 和 !==，避免类型转换错误
        'prefer-const': 'error',
        'no-var': 'error',
        quotes: ['error', 'single'], // 使用单引号
        'vue/max-attributes-per-line': ['error', { singleline: 5 }],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 'error',
        'vue/no-multiple-template-root': 'off',
        // Vue 模板（HTML 部分）中使用双引号
        'vue/no-undef-properties': 'off',
        'vue/html-quotes': ['error', 'double'],
        'vue/no-v-for-template-key': 'off',
        'no-unused-vars': ['warn']
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.d.ts'], // 只对 TypeScript 文件应用下面的配置
            parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
            plugins: ['@typescript-eslint'], // 添加 TypeScript 插件
            extends: [
                'plugin:@typescript-eslint/recommended', // 使用 TypeScript 规则
            ],
            rules: {
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
                semi: ['error', 'never'], // 要求在语句末尾不使用分号。
            },
        },
    ],
}
