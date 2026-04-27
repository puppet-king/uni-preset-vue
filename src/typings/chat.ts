// 基础内容接口
export interface ChatMessage {
  id: string // 唯一标识（避免重复渲染）
  role: ChatRole
  content: string
}

export enum InteractionStatus {
  IDLE = 'idle',
  THINKING = 'thinking',
  ANSWERING = 'answering',
}

export type ChatRole = 'user' | 'assistant' | 'system'

export interface ASRResponse {
  header: {
    namespace: string
    name: string
    status: number
    message_id: string
    task_id: string
    status_text: string
  }
  payload: {
    index: number
    time: number
    result: string
    confidence: number
    words?: Array<any>
    status: number
    fixed_result: string
    unfixed_result: string
  }
}

export interface VoiceItem {
  sex: number // 0: 女, 1: 男
  voice: string // 接口调用的 ID (如 'Cherry')
  voiceName: string // 中文名 (如 '芊悦')
  mark: string // 描述
  instructions: string // 指令
}
