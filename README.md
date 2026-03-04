# uni-preset-vue

基于 Vue 3 + TypeScript 的 uni-app 模板项目，支持多端编译（微信小程序、H5 等），集成了 TailwindCSS 样式框架。

## 前置要求

- **Node.js**: >= 16.14.0
- **包管理器**: pnpm（推荐）或 npm
- **微信开发者工具**: [下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **HBuilderX**（可选）: [下载地址](https://www.dcloud.io/hbuilderx.html)

## 快速开始

### 1. 创建项目（推荐）

使用 `npx degit` 快速创建项目（不需要克隆整个仓库）：

```bash
# 使用此模板创建新项目
npx degit puppet-king/uni-preset-vue#master my-vue3-project
cd my-vue3-project
```

### 2. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 3. 启动开发服务器

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发（测试环境）
pnpm dev:mp-weixin

# 微信小程序开发（本地环境）
pnpm dev:mp-weixin:local
```

微信小程序开发完成后，使用微信开发者工具打开 `dist/dev/mp-weixin` 目录

### 4. 构建生产版本

```bash
pnpm build:h5              # 构建 H5
pnpm build:mp-weixin       # 构建微信小程序（生产环境）
pnpm build:mp-weixin:test  # 构建微信小程序（测试环境）
```

## 如何使用此模板

### 快速创建项目（推荐）

使用 `npx degit` 命令创建新项目：

```bash
npx degit puppet-king/uni-preset-vue#master my-vue3-project
cd my-vue3-project
pnpm install
```

### 开始开发

```bash
pnpm dev:h5           # H5 开发
pnpm dev:mp-weixin    # 微信小程序开发
```

### 自定义项目信息

- 修改 `package.json` 中的项目名称、版本、描述等信息
- 修改 `src/pages.json` 配置页面路由
- 修改 `src/App.vue` 设置应用入口
- 根据需要配置 `.env`、`.env.test`、`.env.prod` 等环境变量文件

### 仓库信息

- **GitHub**: https://github.com/puppet-king/uni-preset-vue
- **Git Clone**: `git clone git@github.com:puppet-king/uni-preset-vue.git`

## 技术栈
git
- Vue 3
- TypeScript
- Pinia (状态管理)
- Vite (构建工具)
- TailwindCSS (样式框架)
- Sass (样式预处理器)
- uni-app (多端框架)

## 项目结构

```
src/
├── api/          # 接口请求模块
├── components/   # 通用组件
├── configs/      # 应用配置
├── pages/        # 页面组件
├── stores/       # Pinia 状态管理
├── style/        # 样式文件
├── typeings/     # 类型定义
└── utils/        # 工具类
```

## 开发命令

### H5 相关
```bash
pnpm dev:h5           # 启动 H5 开发服务器
pnpm dev:h5:ssr       # 启动 H5 SSR 开发服务器
pnpm build:h5         # 构建 H5
pnpm build:h5:ssr     # 构建 H5 SSR
```

### 微信小程序
```bash
pnpm dev:mp-weixin           # 启动微信小程序开发（测试环境）
pnpm dev:mp-weixin:local      # 启动微信小程序开发（本地环境）
pnpm build:mp-weixin         # 构建微信小程序（生产环境）
pnpm build:mp-weixin:test    # 构建微信小程序（测试环境）
```

### 其他小程序平台
```bash
pnpm dev:mp-alipay      # 支付宝小程序
pnpm dev:mp-baidu       # 百度小程序
pnpm dev:mp-qq          # QQ 小程序
pnpm dev:mp-toutiao     # 头条小程序
pnpm dev:mp-xhs         # 小红书小程序
# ... 更多平台请查看 package.json scripts
```

### 代码质量
```bash
pnpm type-check         # TypeScript 类型检查
```

## 环境配置说明

项目支持多环境配置：

- `.env` - 通用配置
- `.env.test` - 测试环境
- `.env.devlocal` - 本地开发环境
- `.env.prod` - 生产环境

在 vite.config.ts 中通过 `--mode` 参数切换环境，例如：
- `pnpm dev:mp-weixin` 使用 test 环境
- `pnpm dev:mp-weixin:local` 使用 devlocal 环境
- `pnpm build:mp-weixin` 使用 prod 环境

## 版本管理

建议使用 pnpm/npm version 命令来管理版本更新：

```bash
# 更新补丁版本号 (x.y.z -> x.y.(z+1))
pnpm version patch

# 更新小版本号 (x.y.z -> x.(y+1).0)
pnpm version minor

# 更新大版本号 (x.y.z -> (x+1).0.0)
pnpm version major
```

## 功能特性

- TypeScript 类型安全
- Pinia 状态管理
- TailwindCSS 样式系统（支持小程序）
- 多端适配（H5、微信、支付宝、百度等多个小程序平台）
- 统一的 API 请求封装
- 缓存工具类
- 类型定义完整
- ESBuild 构建优化
- 代码压缩与混淆

## 注意事项

1. **首次安装依赖后**
   - 需要运行 `pnpm install` 或 `npm install` 安装依赖
   - postinstall 钩子会自动执行 `weapp-tw patch`，确保 TailwindCSS 在小程序中正常工作

2. **微信小程序开发**
   - 确保 `src/manifest.json` 中配置了正确的 AppID
   - 开发时请使用测试环境的 AppID 或个人调试 AppID
   - 生产构建前请更新为正式 AppID

3. **TailwindCSS 使用**
   - H5 端直接使用 TailwindCSS 类名
   - 小程序端会自动转换为 rpx 单位（rem2rpx: true）
   - 某些 CSS 属性可能在小程序中不支持，注意查看兼容性

4. **类型检查**
   - 提交代码前建议运行 `pnpm type-check` 确保类型无误
   - 配置了 ESLint，开发时会进行代码检查

5. **构建优化**
   - 生产环境会自动移除 console 和 debugger
   - 已集成 `@uni-ku/bundle-optimizer` 进行代码优化
   - 可通过 vite.config.ts 调整优化配置

## 常见问题

### Q: pnpm install 报错？
A: 确保已安装 pnpm：`npm install -g pnpm`，然后清理缓存：`pnpm store prune`，再重新安装

### Q: 微信小程序样式不生效？
A: 检查是否执行了 `weapp-tw patch`，可手动运行：`npx weapp-tw patch`

### Q: 如何添加新页面？
A: 在 `src/pages` 目录创建页面组件，然后在 `src/pages.json` 中注册页面路由

### Q: 如何配置别名？
A: 已在 `vite.config.ts` 中配置了 `@` 指向 `src` 目录，可直接使用 `@` 引入文件

## License

MIT