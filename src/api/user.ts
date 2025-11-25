import service from "@/utils/request"
import {UserDataApiResponse} from "@/typings/base"
import {DemoResponse} from "@/typings/authorization";

const baseDir = "/v1/user"

export function fetchDemo() :Promise<DemoResponse> {
  return service.request({
    url: `${baseDir}`,
    method: 'get',
  }) as Promise<DemoResponse>
}

