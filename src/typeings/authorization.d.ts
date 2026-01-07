export interface ApiResponse<T> {
  code: number;           // 响应状态码
  msg: string;            // 响应消息
  data: T;                // 数据字段，泛型 T 即可适应不同的数据类型
}

export interface DemoResponseData {
  userId: number;
  userName: string;
}


export type DemoResponse = ApiResponse<DemoResponseData>;
