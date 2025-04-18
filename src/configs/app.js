const config = {
  HTTP_REQUEST_URL: process.env.NODE_ENV === "production"
    ? "https://brain-service.juqingsong.cn:9999"
    : "http://localhost:9090",
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
    iconPath: "/static/tab-bar/home.png",
    selectedIconPath: "/static/tab-bar/home_selected.png",
    pagePath: "pages/index/index",
  }, {
    iconPath: "/static/tab-bar/target.png",
    selectedIconPath: "/static/tab-bar/target_selected.png",
    pagePath: "pages/training/training",
  }, {
    iconPath: "/static/tab-bar/reward.png",
    selectedIconPath: "/static/tab-bar/reward_selected.png",
    pagePath: "pages/reward/reward",
  }, {
    iconPath: "/static/tab-bar/person.png",
    selectedIconPath: "/static/tab-bar/person_selected.png",
    pagePath: "pages/user/user",
  }, {
    iconPath: "/static/tab-bar/mall.png",
    selectedIconPath: "/static/tab-bar/mall_selected.png",
    pagePath: "pages/message/message",
  }]
}

export default config
