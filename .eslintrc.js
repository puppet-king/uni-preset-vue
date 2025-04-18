module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    requireConfigFile: false, // 禁用配置文件检查
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    node: true,
    es6: true,
  },
  plugins: ["import"],
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    uni: "writable",
    wx: "writable",
    getCurrentPages: "readonly",
    WechatMiniprogram: "readonly",
  },
  rules: {
    "import/no-dynamic-require": "error", // 禁止动态 require，可选项：['off', 'warn', 'error']
    "no-duplicate-code": "off", // 不检查重复代码，自定义规则（注意：标准 ESLint 没有此规则）
    semi: ["error", "never"], // 禁止在代码末尾使用分号，可选项：['always', 'never']
    "brace-style": ["error", "1tbs", { allowSingleLine: true }], // 大括号风格，1tbs风格，可选项：['1tbs', 'stroustrup', 'allman']
    camelcase: ["error", { properties: "never" }], // 强制驼峰命名，属性名除外，可选项：['always', 'never']
    "no-unused-vars": ["warn"], // 发现未使用变量时提示警告，可选项：['off', 'warn', 'error']
    eqeqeq: ["error", "always"], // 强制使用严格等于（===）或严格不等于（!==），可选项：['always', 'smart', 'allow-null']
    "prefer-const": "error", // 优先使用 const 声明不可变变量，可选项：['off', 'warn', 'error']
    "no-var": "error", // 禁止使用 var 声明变量，必须使用 let 或 const
    quotes: ["error", "double"], // 强制使用双引号，可选项：['single', 'double', 'backtick']
    "vue/max-attributes-per-line": ["error", { singleline: 5 }], // 每行允许的属性数量限制，可自定义数字
    "vue/singleline-html-element-content-newline": "off", // 关闭单行元素内容换行检查，可选项：['off', 'warn', 'error']
    "vue/multi-word-component-names": "error", // 强制组件名必须为多个单词，避免与原生 HTML 冲突
    "vue/no-undef-properties": "off", // 不检查未定义的属性访问
    "vue/html-quotes": ["error", "double"], // 模板内强制使用双引号，可选项：['single', 'double']
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"], // 只对 TypeScript 文件应用下面的配置
      parser: "@typescript-eslint/parser", // 使用 TypeScript 解析器
      plugins: ["@typescript-eslint"], // 添加 TypeScript 插件
      extends: [
        "plugin:@typescript-eslint/recommended", // 使用推荐的 TypeScript 规则
      ],
      rules: {
        // 你可以在这里自定义 TypeScript 特有的规则
        "@typescript-eslint/no-unused-vars": ["warn"],
        "@typescript-eslint/no-explicit-any": "warn",
        semi: ["error", "never"], // 要求在语句末尾不使用分号。
      }
    },
  ],
}
