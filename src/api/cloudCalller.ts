import { AGSendMessageRequest, InfoRes, RReq, WxAuthResponse } from '@/typings/cloud'
import { INTERVIEW_BOT_ID } from '@/configs/constant'

export const wxAuthApi = () => {
  return call<void, WxAuthResponse>('wx-auth')
}

export const rApi = (params: RReq) => {
  return call<RReq, WxAuthResponse>('refresh-token', params)
}

export const InfoApi = () => {
  return call<void, InfoRes>('info')
}

/**
 * 调用云函数
 * @param fnName
 * @param data
 */
export async function call<TReq, TRes>(fnName: string, data?: TReq): Promise<TRes> {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await wx.cloud.callFunction({
      name: fnName,
      data: data as any,
    })
    // 微信云函数返回的外层结构包含 errMsg 和 result
    return res.result as TRes
  } catch (err) {
    throw err
  }
}

/**
 * AG-UI 协议流式回调类型
 */
export interface AGStreamCallbacks {
  /** 文本流式回调 */
  onText?: (delta: string) => void
  /** 错误回调 */
  onError?: (message: string) => void
  /** 完成回调 */
  onFinish?: () => void
}

/**
 * AG-UI 协议完整请求参数（含流式回调）
 */
export interface AGSendMessageRequestWithCallbacks extends AGSendMessageRequest {
  /** 流式回调函数（仅在 stream: true 时生效） */
  callbacks?: AGStreamCallbacks
}

/**
 * 发送 Agent 消息（通过 stream 参数控制流式/非流式）
 * @param params - 消息参数，遵循 AG-UI 协议
 * @returns Promise<string> - 返回完整文本
 *
 * @example
 * // 非流式模式
 * const result = await sendAgentMessage({
 *   threadId: generateThreadId(),
 *   messages: [{ id: '1', role: 'user', content: '你好' }]
 * })
 * console.log(result) // 完整文本
 *
 * @example
 * // 流式模式（stream: true + callbacks）
 * await sendAgentMessage({
 *   threadId: generateThreadId(),
 *   messages: [{ id: '1', role: 'user', content: '你好' }],
 *   stream: true,
 *   callbacks: {
 *     onText: (delta) => console.log('收到:', delta),
 *     onError: (err) => console.error('错误:', err),
 *     onFinish: () => console.log('完成')
 *   }
 * })
 */
export const sendAgentMessage = async (params: AGSendMessageRequestWithCallbacks): Promise<string> => {
  const res = await wx.cloud.extend.AI.bot.sendMessage({
    botId: INTERVIEW_BOT_ID,
    data: {
      threadId: params.threadId,
      messages: params.messages,
      tools: [],
      context: [],
      state: {},
      forwardedProps: {},
    },
  })

  let fullText = ''
  const isStream = params.stream === true
  const callbacks = params.callbacks

  for await (const event of res.eventStream) {
    const data = JSON.parse(event.data)

    switch (data.type) {
      case 'TEXT_MESSAGE_CONTENT':
        console.log('TEXT_MESSAGE_CONTENT:', data)
        fullText += data.delta
        // 仅在流式模式下触发回调
        if (isStream) {
          callbacks?.onText?.(data.delta)
        }
        break

      case 'RUN_ERROR':
        console.error('运行出错:', data.message)
        if (isStream) {
          callbacks?.onError?.(data.message)
        }
        throw new Error(data.message || 'AI 运行出错')

      // 收到结束事件，终止循环
      case 'RUN_FINISHED':
        if (isStream) {
          callbacks?.onFinish?.()
        }
        break
    }
  }

  if (!fullText) throw new Error('AI 未返回有效内容')
  return fullText
}
