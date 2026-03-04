import service from '@/utils/request'
import type { UserDataResponse } from '@/typings/api'

const baseDir = '/v1/user'

export function getUserData() {
  return service.request<UserDataResponse>({
    url: `${baseDir}`,
    method: 'GET',
  })
}
