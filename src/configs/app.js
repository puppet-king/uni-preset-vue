const config = {
  HTTP_REQUEST_URL: process.env.NODE_ENV === "production"
    ? ""
    : "",
  // HTTP_REQUEST_URL: '',

  SYSTEM_VERSION: "0.1.0",
  HEADER: {
    "content-type": "application/json",
  },
  TOKENNAME: "Authorization",

  // 静态资源地址
  STATIC_RESOURCES_HOST: "",
  // 缓存时间 0 永久
  EXPIRE: 0,

  TabBarStyle:  [{
    iconPath: "/static/tab-bar/mall.png",
    selectedIconPath: "/static/tab-bar/mall_selected.png",
    pagePath: "pages/message/message",
  }]
}

export default config
