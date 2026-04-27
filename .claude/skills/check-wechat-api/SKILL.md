---
name: check-wechat-api
description: Validates WeChat Mini Program code against deprecated/banned APIs and suggests approved alternatives.
---

# Check WeChat API

Review the user's code (or any code you're about to write) for deprecated or banned WeChat Mini Program APIs.

## Banned APIs (must flag and replace)

| Forbidden                                      | Approved Alternative                                      |
|------------------------------------------------|-----------------------------------------------------------|
| `wx.base64ToArrayBuffer(base64Str)`            | `import { decode } from 'base64-arraybuffer'` → `decode(base64Str)` |
| `wx.arrayBufferToBase64(buffer)`               | `import { encode } from 'base64-arraybuffer'` → `encode(buffer)` |

## How to use

1. Search the codebase or code snippets for the banned API calls listed above
2. If found, flag them as **errors** with an explanation of why they are deprecated
3. Provide the corrected replacement code
4. Ensure the import statement for the replacement package is included
5. Check that the replacement is added to dependencies if not already present (this project already has `base64-arraybuffer`)

## Additional checks

- Verify that **pages** use uni-app lifecycle hooks from `@dcloudio/uni-app` (e.g., `onLoad`, `onShow`, `onReady`) rather than Vue 3 hooks like `onMounted`
- Verify `scroll-view` components targeting Skyline use `type="list"` for list rendering and have multiple direct children
- Verify TailwindCSS utility classes are used instead of raw rpx values (e.g., prefer `text-xl` over `text-[28rpx]`)