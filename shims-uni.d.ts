import 'vue'
import '@vue/runtime-core'

declare module 'vue' {
  interface ComponentCustomProperties {
    $scope?: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $scope?: any
  }
}


export {}
