// 状态类型：'active' (开启), 'inactive' (关闭), 'disabled' (禁用)
export type FunctionState = 'active' | 'inactive' | 'disabled'

// 定义支持的模型提供商
export type ModelProvider = 'DeepSeek' | 'Gemini' | 'OpenAI'

export interface ShareOptions {
  title: string
  fromType: 'share' | ''
  imgUrl?: string
}

// 定义各提供商支持的模型（实际项目中可根据真实模型列表扩展）
export interface ProviderModels {
  DeepSeek: 'DeepSeek-6B' | 'DeepSeek-13B' | 'DeepSeek-MoE'
  Gemini: 'Gemini-Pro' | 'Gemini-Ultra' | 'Gemini-Nano'
  OpenAI: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o'
}

// 提示词模板案例类型
export interface PromptTemplateCase<T extends ModelProvider = ModelProvider> {
  question: string // 测试问题
  provider: T // 提供商（严格类型）
  model: ProviderModels[T] // 模型名称（与提供商关联）
  optimizedPrompt: string // 优化后的提示词
  testContent: string // 测试内容
  originalPromptResult: string // 原始提示词结果
  optimizedPromptResult: string // 优化后提示词结果
}

export type PromptModeKey = 'base' | 'content' | 'image' // 模式键的严格类型

// 提示词类型配置
export interface PromptTypeConfig {
  modeKey: PromptModeKey // 关联的模式键
  key: string // 类型标识
  value: string // 类型显示名称
  desc: string // 介绍
  templates: PromptTemplate[] // 该类型下的模板列表
}

// 内置 私有 公开
export type PromptTemplateSource = 'builtIn' | 'vip' | 'private' | 'public'

// 高级模板的内容结构
interface AdvancedTemplateContent {
  systemTemplate: string // 系统提示词模板
  userTemplate: string // 用户提示词模板
  systemPreview: string // 系统提示词预览
  userPreview: string // 用户提示词预览
}

// 提示词模式配置
interface PromptModeConfig {
  key: PromptModeKey // 模式标识
  value: string // 模式显示名称
  desc: string //
}

// 提示词类型配置
export interface Agent {
  type: PromptModeKey // 该智能体所属类型 (类型约束模板范围)
  key: string // 唯一 ID
  title: string // 智能体名称
  desc: string // 介绍
  templates: string[] // 可用的模板
}

// 提示词模板类型（联合类型区分基础/高级）
export type PromptTemplate =
  | {
      type: 'basic' // 基础模板标识
      publish: boolean //  是否发布
      key: string
      name: string
      desc: string
      content: string // 基础模板为字符串内容
      updatedTime: string
      source: PromptTemplateSource
      cases: PromptTemplateCase[]
    }
  | {
      type: 'advanced' // 高级模板标识
      publish: boolean //  是否发布
      key: string
      name: string
      desc: string
      content: AdvancedTemplateContent // 高级模板为对象结构
      updatedTime: string
      source: PromptTemplateSource
      cases: PromptTemplateCase[]
    }

// 提取后的模板信息类型（只包含需要的key、name、desc）
export interface TemplateInfo {
  key: string
  name: string
  desc: string
}

export interface UserConfigData {
  autoFocus: boolean
  mode: 'speaking' | 'writing'
  selectedPromptMode: PromptModeKey
}

// 1. 定义日期/周几的联合类型
export type WeekdayTag = '周日' | '周一' | '周二' | '周三' | '周四' | '周五' | '周六'

// 2. 定义猫咪 ID 的联合类型（可选，如果业务逻辑强依赖 key）
export type AgentKey =
  | 'gentle_blade'
  | 'sober_judge'
  | 'poison_sister'
  | 'grumpy_director'
  | 'zen_judge'
  | 'slacker_assassin'
  | 'tipsy_artist'

// 3. 核心接口定义
export interface AgentItem {
  id: string // 唯一索引，如 '0'
  key: AgentKey // 业务逻辑标识
  name: string // 猫咪名称，如 '布偶猫'
  sub: string // 副标题/封号
  desc: string // 角色格言/描述
  icon: string // 图标或图片路径
  color: string // Tailwind 背景与文字颜色类名组合
  border: string // Tailwind 边框颜色类名
  tag: WeekdayTag // 对应的排班日期
}

/**
 * OCR 文件类型枚举
 */
export enum FileType {
  PDF = 0,
  IMAGE = 1,
}

export interface OCROptions {
  useDocOrientationClassify?: boolean | null // 是否开启方向矫正
  useDocUnwarping?: boolean | null // 是否开启扭曲矫正
  useTextlineOrientation?: boolean | null // 是否开启文本行矫正
  textDetLimitSideLen?: number | null // 图像边长限制
  textDetLimitType?: 'min' | 'max' | null // 边长限制类型
  textDetThresh?: number | null // 检测像素阈值
  textDetBoxThresh?: number | null // 检测框阈值
  textDetUnclipRatio?: number | null // 扩张系数
  textRecScoreThresh?: number | null // 识别阈值
  visualize?: boolean | null // 是否返回可视化结果

  useLayoutDetection?: boolean //
  promptLabel?: 'ocr' | 'table' | 'chart' | '' // useLayoutDetection 为 false 才有效
}

/**
 * API 端点枚举（对应不同的 Paddle 产线）
 */
export enum ApiEndpoint {
  LayoutParsing = 'layout-parsing',
  OCR = 'ocr',
}

/**
 * OCR 识别请求参数（URL 模式）
 */
export interface PaddleOCRRequest {
  imageUrl: string // 图片 URL
  fileType?: FileType // 文件类型：0=PDF, 1=图片（默认 1）
  options?: OCROptions // 可选配置：透传给 PaddleOCR 的高级参数
  endpoint?: ApiEndpoint // API 端点（默认 OCR）
}
