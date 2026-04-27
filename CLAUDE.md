# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 + uni-app scaffold targeting **WeChat Mini Program** (Skyline renderer), with multi-platform support (H5, Alipay, Baidu, QQ, etc.). Uses Pinia for state, TailwindCSS (via weapp-tailwindcss), SCSS, and TypeScript.

## Build, Dev & Test Commands

```bash
# WeChat dev (uses --mode test)
npm run dev:mp-weixin

# WeChat production build
npm run build:mp-weixin

# H5 dev
npm run dev:h5

# Type check
npm run type-check

# Postinstall hook — always runs after `npm install`
npm run postinstall  # weapp-tw patch
```

**Target-specific scripts follow the pattern:** `dev:<platform>` / `build:<platform>` (e.g., `dev:mp-alipay`, `build:mp-baidu`).

## Code Style & Linting

- **ESLint flat config** in `eslint.config.ts`
- **Prettier** integrated via `eslint-plugin-prettier`
- **No semicolons**, single quotes, trailing commas, 2-space indent
- `@typescript-eslint/no-unused-vars` — warns on unused vars (ignore `_` prefix)
- `@typescript-eslint/no-explicit-any` — off
- `prettier/prettier` — print width 120
- `vue/multi-word-component-names` — off (uni-app pages often single-word)
- Ignored: `src/uni_modules`, `fui*` (FirstUI), `src/cloudfunctions`, `*.min.js`

## TailwindCSS Weapp Rules

This project uses **weapp-tailwindcss**, which auto-converts standard utility classes to rpx for WeChat Mini Program:

- **Do not** write raw rpx in utility classes (e.g., avoid `text-[28rpx]`) — use built-in Tailwind classes like `text-xl` and let the plugin convert them
- For custom design tokens, add them in `tailwind.config.ts` (theme extend) or define `@layer components` classes in `App.vue`
- **Do not** use `<style lang="scss">` to write pixel values — prefer Tailwind utilities or `@apply` inside `@layer components`
- Skyline disables `preflight` and `container` core plugins by default
- `postinstall` runs `weapp-tw patch` — never skip this step after installing

## WeChat Skyline Scroll-View Best Practices

Use `type="list"` for performant list rendering:

```vue
<scroll-view class="h-screen" :scroll-y="true" type="list" cache-extent="500">
  <!-- Must have multiple direct children — single child degrades performance -->
  <view v-for="item in list" :key="item.id" class="p-4">...</view>
</scroll-view>
```

- `cache-extent` recommended 300-500
- `type="custom"` for complex layouts with sticky sections

## Deprecated WeChat APIs — Do Not Use

| Deprecated (forbidden)       | Alternative                     |
|-----------------------------|---------------------------------|
| `wx.base64ToArrayBuffer()`  | `import { decode } from 'base64-arraybuffer'` |
| `wx.arrayBufferToBase64()`  | `import { encode } from 'base64-arraybuffer'`  |

## Architecture

### App Entry
- `src/App.vue` — App lifecycle (`onLaunch`, `onShow`, `onHide`), version update check, global styles (`@layer components` for `.page` and `.container`)

### State Management (Pinia)
- `src/stores/user.ts` — Auth state, token management, user info, permission/quotas
- `src/stores/system.ts` — System settings (haptic feedback, screen-on), chat scene state
- `src/stores/authorization.ts` — WeChat permission scopes (location, camera, microphone, etc.)

### API Layer
- `src/utils/request.ts` — Unified HTTP request wrapper with auto-auth (login/refresh on 401/403), GET param serialization, 60s default timeout
- `src/services/cloudCalller.ts` — WeChat cloud function calls via `wx.cloud.callFunction`, AG-UI protocol for bot messaging (streaming support)
- `src/api/user.ts` — User endpoint (`/v1/user`)
- `src/api/ocr.ts` — PaddleOCR endpoint
- All API responses typed as `ApiResponse<T>` or `CloudApiResponse<T>` in `src/typings/`

### Utilities
- `src/utils/cache.ts` — Cache class with TTL/expiration, supports sync + async WeChat storage
- `src/utils/throttle.ts` — `Throttle` (sync) and `ThrottleAsync` (returns Promise)
- `src/utils/debounce.ts` — `Debounce` (sync) and `DebounceAsync` (returns Promise)
- `src/utils/userLogin.ts` — WeChat login flow (`wxLogin`, `refreshLogin`)
- `src/utils/log.ts` — WeChat realtime log manager wrapper
- `src/utils/uuid.ts` — UUID v4 generator (with optional 32-char format)
- `src/utils/util.ts` — format helpers, `base64ToArrayBuffer`, `calculateHash`, `sleep`

### Typings
- `src/typings/api.ts` — `ApiResponse<T>`, `UserDataResponse`
- `src/typings/cloud.d.ts` — `CloudApiResponse<T>`, `InfoRes`, `WxAuthResponse`, `Nlp*`, `AGMessage*`, `ResumeParser*`
- `src/typings/types.d.ts` — `UserData`, `UserQuota`, `Settings`
- `src/typings/user.d.ts` — `AuthData`, `RouterType`
- `src/typings/chat.ts` — `ChatMessage`, `InteractionStatus`, `ASRResponse`, `VoiceItem`
- `src/typings/base.ts` — `FunctionState`, `ModelProvider`, `AgentItem`, `FileType`, `OCROptions`, `ApiEndpoint`

## Versioning Workflow

Run `npm version patch|minor|major` to bump version. This triggers `scripts/version-sync.mjs` via `npm version` lifecycle:
1. Reads `process.env.npm_package_version`
2. Updates `export const VERSION = '...'` in `src/configs/constant.ts`
3. `git add` and pushes to `master`

## Uni-app Specifics

- **Pages**: Single page at `src/pages/index/index` (custom navigation style)
- **easycom**: Auto-resolves `ui-*` components from `@/components/ui/ui-$1/ui-$1.vue`
- **Vue 3 lifecycle**: Use `defineOptions({ name: 'ComponentName' })` for component naming
- **Component lifecycle** — use standard Vue 3 hooks (`onMounted`, `onUpdated`, etc.)
- **Page lifecycle** — use `@dcloudio/uni-app` composables (`onLoad`, `onShow`, `onReady`, `onHide`, `onUnload`)
- **Do not** use Vue 3 lifecycle hooks directly on pages — pages are not components in uni-app
- **renderer**: Skyline with `glass-easel` framework (see `manifest.json` → `mp-weixin`)
- **Skyline `scroll-view`**: Use `type="list"` for lists, ensure multiple direct children for performance
- **WeChat worklet**: Used for animations (`wx.worklet.shared`, `wx.worklet.timing`, `Easing`)

## TypeScript

- `strict: false` — lenient type checking
- `skipLibCheck: true` — skip node_modules type checking
- `paths: { "@/*": ["src/*"] }` — alias for source imports
- Global types: `miniprogram-api-typings`, `@dcloudio/types`, `node`
- `uni`, `wx`, `getCurrentPages`, `WechatMiniprogram`, `UniNamespace` — global readonly variables

## Commit Conventions

- Uses commitlint with simplified prompts (no body, no breaking changes, no footer)
- Available scope: `index` (for homepage-related changes)
- Scope-less commits are acceptable for general/refactor changes