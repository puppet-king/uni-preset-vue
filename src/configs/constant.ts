export const VERSION = '0.0.0'

/** 后端接口基础请求地址 (由环境变量注入) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/** 全局缓存默认过期时间 (单位: 秒，默认 24 小时) */
export const EXPIRE = 86400

/** 静态音频/媒体资源 CDN 根域名 */
export const STATIC_BASE_URL = ''

// 用户登录凭证 Storage Key 常量定义 (统一下划线命名与语义规范)
export const AUTH_STORAGE_KEYS = {
  UUID: 'user_uuid',
  TOKEN: 'user_token',
  EXPIRES_IN: 'user_expires_in',
  REFRESH_TOKEN: 'user_refresh_token',
  REFRESH_TOKEN_EXPIRES_IN: 'user_refresh_token_expires_in',
} as const

/**
 * 底部导航栏 (TabBar) 配置列表
 * @description 存储底部导航各项的基础数据及高亮样式状态
 */
export const TAB_BAR_STYLE_LIST = []
