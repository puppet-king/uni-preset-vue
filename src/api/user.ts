import service from "@/utils/request"
import {UserDataApiResponse} from "@/types/base"

const baseDir = "/v1/user"

export function wxAuth(data) {
  return service.request({
    url: `${baseDir}/wx-auth`,
    method: "post",
    data
  }, {
    noAuth: true,
    retry: false
  })
}


export function r(data) {
  return service.request({
    url: `${baseDir}/r`,
    method: "post",
    data
  }, {
    noAuth: true,
    retry: false
  })
}


export function update(data: { nick?: string, birth?: number}) {
  return service.request({
    url: `${baseDir}`,
    method: "post",
    data
  })
}

export function getUserData(): Promise<UserDataApiResponse> {
  return service.request({
    url: `${baseDir}`,
    method: "get",
  }) as Promise<UserDataApiResponse>
}


