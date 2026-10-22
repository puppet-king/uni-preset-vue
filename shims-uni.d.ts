/// <reference types='@dcloudio/types' />
import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $scope?: any
  }
}

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance

  interface ComponentCustomOptions extends Hooks {
    $scope?: any
  }
}
