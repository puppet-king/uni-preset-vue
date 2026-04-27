/**
 * OCR 服务封装
 */
import { paddleOCR, PaddleOCRRequest } from '@/api/ocr'
import { ApiEndpoint, FileType } from '@/typings/base'

// 内部方法：核心 OCR 接口调用（不导出，对外部不可见）
const _callPaddleOCRAPI = async (imageUrl: string): Promise<string> => {
  const request: PaddleOCRRequest = {
    imageUrl,
    fileType: FileType.IMAGE,
    endpoint: ApiEndpoint.OCR,
    options: {
      visualize: false,
      useDocOrientationClassify: true,
      useLayoutDetection: false,
    },
  }

  const res = await paddleOCR(request)
  if (res.code !== 200) {
    throw new Error(res.msg || 'OCR 接口识别失败')
  }
  return res.data.texts
}

/**
 * 封装后的 OCR 识别方法（唯一暴露的方法）
 * 调用方只需传入本地路径，无需关心内部上传和换链逻辑
 * @param localPath 微信选稿后的临时本地路径 (wx.chooseImage 返回的 path)
 */
export const recognizeText = async (localPath: string): Promise<string> => {
  try {
    // 1. 静默上传：构造唯一的云端路径防止覆盖
    const fileName = localPath.split('/').pop()
    const cloudPath = `ocr_temp/${Date.now()}-${fileName}`

    const uploadRes = await wx.cloud.uploadFile({
      cloudPath,
      filePath: localPath,
    })

    if (!uploadRes.fileID) throw new Error('静默上传失败')

    // 2. 静默换链：将 FileID 转换为 OCR 接口需要的 HTTP 链接
    const { fileList } = await wx.cloud.getTempFileURL({
      fileList: [uploadRes.fileID],
    })

    const fileInfo = fileList[0]
    if (!fileInfo || fileInfo.status !== 0 || !fileInfo.tempFileURL) {
      throw new Error('获取临时访问链接失败')
    }

    // 3. 执行识别并返回结果
    return await _callPaddleOCRAPI(fileInfo.tempFileURL)
  } catch (error: any) {
    // 统一错误处理
    console.error('[OCR Service Error]:', error)
    throw new Error(error.message || '图片识别服务异常')
  }
}
