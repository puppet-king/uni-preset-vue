// tabbar 的 emit
export interface ItemClickPayload {
  index: number
  name: string
  value: string
  iconPath: string
  selectedIconPath: string
  pagePath: string
}


type FuiTabBar = {
  getTabBarHeight: () => Promise<number>;
};
