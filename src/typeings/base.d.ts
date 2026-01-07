// 外部响应结构
export interface ApiResponse<T> {
  code: number;           // 响应状态码
  msg: string;            // 响应消息
  data: T;                // 数据字段，泛型 T 即可适应不同的数据类型
}

export interface UserDataResponse {
  uuid: string;
  nick: string;
  avatar: string;
  // heart: number;
  // birth: number;
  // experience: number;
  // game_by_level?: { [key: string]: number };
  // created_at: string;
  // streak_days: number;
  // sex: number;
}

export type UserDataApiResponse = ApiResponse<UserDataResponse>;


export interface AuthData {
  token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}
