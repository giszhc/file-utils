/**
 * 文件读取类型定义
 * - text: 读取为文本内容
 * - arrayBuffer: 读取为 ArrayBuffer（二进制数据）
 * - dataURL: 读取为 Data URL（Base64 编码）
 * - binaryString: 读取为二进制字符串
 */
export type ReadFileType = 'text' | 'arrayBuffer' | 'dataURL' | 'binaryString';

/**
 * 图片压缩选项配置
 */
export interface CompressOptions {
  /**
   * 压缩质量
   * 范围：0.1 - 1.0
   * 默认值：0.8（80% 质量）
   * @example 0.5 表示 50% 质量
   */
  quality?: number;
  
  /**
   * 最大宽度（像素）
   * 如果原图宽度超过此值，将等比例缩放
   * 默认值：无限制
   */
  maxWidth?: number;
  
  /**
   * 最大高度（像素）
   * 如果原图高度超过此值，将等比例缩放
   * 默认值：无限制
   */
  maxHeight?: number;
  
  /**
   * 输出图片的 MIME 类型
   * 默认值：'image/jpeg'
   * 支持的值：'image/jpeg', 'image/png', 'image/webp' 等
   */
  mimeType?: string;
}

/**
 * 下载选项配置
 */
export interface DownloadOptions {
  /**
   * 目标文件名（包含扩展名）
   * 如果不指定，将尝试从 URL 或 Content-Disposition 头中提取
   */
  filename?: string;
  
  /**
   * 是否在新窗口打开
   * 默认值：false（直接下载）
   */
  newWindow?: boolean;
  
  /**
   * Fetch API 的 RequestInit 配置
   * 可用于设置请求头、授权信息、请求方法等
   * @example
   * // 设置授权请求头
   * fetchOptions: {
   *  headers: {
   *     'Authorization': 'Bearer token123'
   *   }
   * }
   * 
   * @example
   * // 设置 POST 请求和请求体
   * fetchOptions: {
   *  method: 'POST',
   *   body: JSON.stringify({ id: 123 })
   * }
   */
  fetchOptions?: RequestInit;
}

/**
 * 文件生成选项配置
 * 用于控制文件生成后的行为
 */
export interface GenerateOptions {
  /**
   * 是否直接下载生成的文件
   * 默认值：true（直接下载）
   * 如果设置为 false，将返回 File 对象而不触发下载
   */
  download?: boolean;
  
  /**
   * 字符编码
   * 默认值：'utf-8'
   */
  encoding?: string;
}

/**
 * 文件信息接口
 * 用于描述文件的基本属性
 */
export interface IFileInfo {
  /** 文件名 */
  name: string;
  /** 文件大小（字节） */
  size: number;
  /** MIME 类型 */
  type: string;
  /** 最后修改时间戳 */
  lastModified: number;
}

/**
 * 文件验证结果接口
 * 用于返回文件验证的结果
 */
export interface IValidationResult {
  /** 是否通过验证 */
  valid: boolean;
  /** 错误信息列表 */
  errors: string[];
}

/**
 * 文件验证选项配置
 * 用于指定文件验证的规则
 */
export interface IFileValidationOptions {
  /**
   * 接受的文件类型数组
   * 支持：MIME 类型（'image/jpeg'）、通配符（'image/*'）、扩展名（'.jpg'）
   */
  acceptTypes?: string[];
  
  /**
   * 最大文件大小（字节）
   * @example 2 * 1024 * 1024 表示 2MB
   */
  maxSize?: number;
  
  /**
   * 是否必须为图片
   * 默认值：false
   */
  mustBeImage?: boolean;
  
  /**
   * 最小宽度（像素，仅对图片有效）
   */
  minWidth?: number;
  
  /**
   * 最大宽度（像素，仅对图片有效）
   */
  maxWidth?: number;
  
  /**
   * 最小高度（像素，仅对图片有效）
   */
  minHeight?: number;
  
  /**
   * 最大高度（像素，仅对图片有效）
   */
  maxHeight?: number;
}

/**
 * 复制选项配置
 */
export interface CopyOptions {
  /**
  * 复制成功时的回调函数
  * @param text - 被复制的文本
  */
  onSuccess?: (text: string) => void;
  
  /**
  * 复制失败时的回调函数
  * @param error - 错误信息
  */
  onError?: (error: Error) => void;
}
