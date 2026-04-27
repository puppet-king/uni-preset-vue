import service from '@/utils/request'
import { ApiEndpoint, FileType, OCROptions } from '@/typings/base'

const baseDir = ''

/**
 * OCR 识别请求参数（URL 模式）
 */
export interface PaddleOCRRequest {
  imageUrl: string // 图片 URL
  fileType?: FileType // 文件类型：0=PDF, 1=图片（默认 1）
  options?: OCROptions // 可选配置：透传给 PaddleOCR 的高级参数
  endpoint?: ApiEndpoint // API 端点（默认 OCR）
}

export interface PaddleOCRResponseData {
  texts: string
}

/**
 * 发送消息给 Agent
 */
export function paddleOCR(data: PaddleOCRRequest) {
  return service.request<PaddleOCRResponseData>({
    url: `${baseDir}/ocr`,
    method: 'POST',
    timeout: 200000,
    data,
  })
}
