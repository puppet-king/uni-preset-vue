export interface CloudApiResponse<T> {
  code: number // 响应状态码 0 代表成功
  message: string // 响应消息
  data: T // 数据字段，泛型 T 即可适应不同的数据类型
  fromCache?: boolean
  error?: string
}

export interface UserQuota {
  resumeUpload: number // 剩余简历上传次数
  aiChat: number // 剩余 AI 对话次数
  reportGen: number // 剩余报告生成次数
}

/** 登录接口返回的核心数据结构 */
export interface InfoResData {
  /** 用户唯一标识 (对应云函数返回的 OPENID) */
  uuid: string
  /** VIP 等级: 0(普通), 1-6(V1~V6) */
  vipLevel: number
  /** 是否为有效 VIP 状态 */
  isVip: boolean
  /** VIP 到期时间，Date 对象或 null */
  vipExpireTime: Date | null
  /** 账户剩余配额 */
  quota: UserQuota
  /** 账户状态: 1(正常), 0(禁用) */
  status: number
  /** 软删除标记 */
  isDeleted: boolean
}

export type InfoRes = CloudApiResponse<InfoResData>

export interface TokenResData {
  token: string
  expiresIn: number
  expireTime: number
  type: 'aliyun'
}

export type TokenRes = CloudApiResponse<TokenResData>

export interface DashscopeTokenResData {
  token: string
  expires_at: number
}

export interface DashscopeTokenReq {
  expire_in_seconds?: number // 有效时间 默认值 60s
}

export type DashscopeTokenRes = CloudApiResponse<DashscopeTokenResData>

export interface WxAuthData {
  token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
}

export type WxAuthResponse = CloudApiResponse<WxAuthData>
export interface RReq {
  refresh_token: string
}

// NLP 相关类型定义
export type NlpTagClass =
  | '姓名'
  | '性别'
  | '民族'
  | '出生日期'
  | '籍贯'
  | '现居住地'
  | '政治面貌'
  | '手机号'
  | '电子邮箱'
  | '最高学历'
  | '最高学位'
  | '通讯地址'
  | '家庭地址'
  | '期望工作地点'
  | '期望从事岗位'
  | '目前年薪'
  | '期望年薪'
  | '毕业院校'
  | '入学时间'
  | '毕业时间'
  | '学历'
  | '学位'
  | '工作单位'
  | '工作开始时间'
  | '工作结束时间'
  | '岗位名称'
  | '工作内容'
  | '身高'
  | '体重'
  | '个人评价'
  | '爱好'
  | '英语考试种类'
  | '英语考试成绩'

export type NlpTagSource = 'rule' | 'model'

export interface NlpTag {
  class: NlpTagClass
  source: NlpTagSource
  span: string
  conf?: number
  start?: number
  end?: number
}

export interface NlpResultItem {
  id: number
  tags: NlpTag[]
  sentence: string
  sent_offsets: number
}

export interface NlpPredictResponse {
  ret_code: number
  result: NlpResultItem[]
  message: string
  time: number
}

export interface NlpResData {
  ret_code: number
  result: NlpResultItem[]
  message: string
  time: number
  // 其他 resume 表中的字段
  openid?: string
  unionid?: string
  originalContent?: string
  parseTime?: Date
  createTime?: Date
  updateTime?: Date
  _id?: string
}

export type NlpRes = CloudApiResponse<NlpResData & { fromCache?: boolean }>

export interface NlpRequest {
  resumeContent?: string
  fileId?: string
}

// ResumeCache 相关类型定义
export interface ResumeCacheRequest {
  fileId: string
}

export type ResumeCacheRes = CloudApiResponse<NlpResData>

// DeductQuota 相关类型定义
export type DeductQuotaAction = 'resumeUpload' | 'aiChat' | 'reportGen'

export interface DeductQuotaRequest {
  action: DeductQuotaAction
}

export interface QuotaData {
  resumeUpload: number
  aiChat: number
  reportGen: number
}

export interface DeductQuotaResData {
  action: DeductQuotaAction
  quota: QuotaData
}

export type DeductQuotaRes = CloudApiResponse<DeductQuotaResData>

// ResumeParser 相关类型定义
export interface ResumeParserRequest {
  fileUrl: string
  fdID: string
}

export interface IntendedPosition {
  category?: string | null // 匹配到的岗位大类，如：后端开发
  subCategory?: string | null // 匹配到的具体职位，如：Java
}

export interface ResumeParseData {
  // --- 基础信息 ---
  name?: string | null // 姓名
  gender?: string | null // 性别
  age?: number | null // 年龄
  phone?: string | null // 联系电话
  email?: string | null // 电子邮箱
  education?: string | null // 最高学历
  school?: string | null // 毕业院校
  major?: string | null // 专业名称
  workYears?: number | null // 工作年限数字

  // --- 意向信息 ---
  intendedPosition?: IntendedPosition // 意向职位分类
  jobLevel?: string | null // 岗位职级：初级、中级、高级、资深或专家
  expectedSalary?: string | null // 期望薪资，如：15k-25k
  expectedLocation?: string | null // 期望工作地点

  // --- 详细履历 ---
  workExperience?: WorkExperience[] // 工作经历列表
  skills?: string[] // 核心技能关键词数组

  /** 面试建议 (新增) */
  interviewAdvise?: InterviewAdvise

  /** 项目经验 (结构深化) */
  projects?: Project[]
}

/** 意向职位 */
export interface IntendedPosition {
  category?: string | null // 职位大类
  subCategory?: string | null // 职位子类
}

/** 工作经历 */
export interface WorkExperience {
  company?: string | null // 公司名称
  position?: string | null // 担任职位
  time?: string | null // 任职时间 (如: 2020.01 - 2023.05)
}

/** 面试建议 (对应 interviewAdvise) */
export interface InterviewAdvise {
  highlights: string[] // 候选人亮点
  weakness: string[] // 候选人薄弱环节
}

/** 项目经验 (对应 Schema 中的深度解析字段) */
export interface Project {
  projectName?: string | null // 项目名称
  projectContent?: string | null // 项目内容/背景
  projectPractice?: string | null // 个人实践/职责
  technicalChallenges: string[] // 技术难点/挑战
  keyDecisions: string[] // 关键技术决策
  metricsAndScale?: string | null // 规模、指标与落地效果
  potentialDeepDives: string[] // 建议深度追问点
  conflictScenario: string // 潜在冲突或压力点描述
  factAnchors: string[] // 真实性验证锚点
}

export interface ResumeParserData {
  _id?: string
  openid: string
  fdID: string
  fileId: string
  parseResult: string // JSON string
  createTime: Date
  updateTime: Date
}

export type ResumeParserRes = CloudApiResponse<ResumeParserData>

/** AG-UI 协议的消息内容 */
export interface AGMessage {
  id: string
  role: AGMessageRole
  content: string
}

/** AG-UI 协议的消息请求参数 */
export interface AGSendMessageRequest {
  threadId: string // 会话 ID（必须传入）
  messages: AGMessage[]
  /** 是否启用流式响应，默认为 false */
  stream?: boolean
}

// AG-UI 协议相关类型定义
/** AG-UI 协议的消息角色 */
export type AGMessageRole = 'user' | 'assistant' | 'system'

/** AG-UI 协议的消息内容 */
export interface AGMessage {
  id: string
  role: AGMessageRole
  content: string
}

/** AG-UI 协议的消息请求参数 */
export interface AGSendMessageRequest {
  threadId: string // 会话 ID（必须传入）
  messages: AGMessage[]
}
