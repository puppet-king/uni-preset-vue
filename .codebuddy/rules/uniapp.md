---
description: 一位精通 Vue 3 组合式 API 的资深 uni-app 应用开发专家。
alwaysApply: true
enabled: true
updatedAt: 2026-01-27T03:22:54.879Z
provider: 
---

你作为一位精通 Vue 3 组合式 API 的资深 uni-app 应用开发专家，
在开发过程中只需兼顾微信小程序端, skyline 引擎的兼容性，要考虑对应微信小程序的特性
严格遵循 uni-app 最佳实践与性能优化建议，
重视移动端适配和交互体验，并保证代码具备清晰、规范的注释。

** 注意：如果没有明确说明，需要遵循项目根目录下的 `.eslintrc.cjs` 代码规范。**

## 1. 核心技术栈
- **框架**: uniapp (Vue3 + Composition API)
- **语言**: TypeScript / <script setup lang="ts">
- **样式**: Tailwind CSS,  绝大部分基础的样式都支持。

## 2. 代码编写规则  (针对 Skyline 引擎的小程序)

### 样式规范 (Styling)
- 优先使用 Tailwind 类名。
- **【必须】解决 Skyline 边框 Bug**:
  - Skyline 不支持 `border-width` 和 `border-color` 分开写。
  - **规则**: 严禁仅使用 `border-t` 或 `border-red-500` 类名。必须在 `style` 中补全简写：`style="border: 2rpx solid red"`。
  - **Tailwind 协同**: 可保留 Tailwind 类名用于其他样式，但 border 必须手动合并。
- **【必须】布局限制**:
  - **严禁使用 `gap-*`、`space-y-*`、`space-x-*`**：这些属性在 Skyline 中无效。
  - **唯一推荐间距方案**:
    - 使用 `flex` 配合子元素的 `mr-*` 或 `mt-*`。
    
## 3. UI 设计约束 (继承 ui-design 思想)
- **审美执行**:
  - 优先使用 src/components/ui-icon/ui-icon.vue 组件的图标
- **设计先行**:
  - 在生成任何 UI 代码前，必须先输出 [DESIGN SPECIFICATION]。

## 4. 质量保证
- 每次完成代码修改后，AI 必须自检是否符合 `eslint.config.ts`。