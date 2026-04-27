export interface AuthData {
  token: string
  expires_in: number
  refresh_token?: string
  refresh_token_expires_in?: number
}

// 无 半屏弹窗 向上进入 放大进入
export type RouterType =
  | 'none'
  | 'bottom-sheet'
  | 'upwards'
  | 'zoom'
  | 'cupertino-modal-inside'
  | 'modal-navigation'
  | 'modal'
