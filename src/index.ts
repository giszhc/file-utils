/**
 * file-utils 文件操作工具库
 *
 * 提供常用的文件处理功能：读取、下载、转换、生成、验证等
 * 支持 Tree Shaking，按需引入
 */

// 类型导出
export type {
   ReadFileType,
   CompressOptions,
   DownloadOptions,
   CopyOptions,
    IFileInfo,
    IValidationResult,
    IFileValidationOptions
} from './types';

// 文件读取
export * from './read';

// 文件下载
export * from './download';

// 文件转换
export * from './convert';

// 文件压缩
export * from './compress';

// 剪贴板操作
export * from './copy';

// 文件生成
export * from './generate';

// 文件验证
export * from './validators';

// 工具函数
export * from './utils';

// 辅助工具
export * from './helpers';

// 验证工具
export * from './verify';
