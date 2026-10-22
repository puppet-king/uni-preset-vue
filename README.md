# uni-preset-vue

基于 Vue 3 + TypeScript 的 uni-app 模板项目，支持多端编译（微信小程序、H5等），集成了 TailwindCSS 样式框架。

## 技术栈

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
├── typings/      # 类型定义
└── utils/        # 工具类
```

## 安装依赖

```bash
pnpm install
```

## 开发命令

```bash
# 启动微信小程序开发服务器
pnpm run dev:mp-weixin

# 构建微信小程序
npm run build:mp-weixin
```

## 版本管理

建议使用 pnpm version 命令来管理版本更新：

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
- TailwindCSS 样式系统
- 多端适配
- 统一的 API 请求封装
- 缓存工具类
- 类型定义完整