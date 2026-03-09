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
    IFileInfo,
    IValidationResult,
    IFileValidationOptions
} from './types';

// 文件读取
export {
    readFile,
    readTxtFile,
    readCsvFile,
    readJsonFile
} from './read';

// 文件下载
export {
    downloadFile,
    downloadBlob,
    downloadBase64,
    downloadMultiple
} from './download';

// 文件转换
export {
    fileToBase64,
    base64ToBlob
} from './convert';

// 文件生成
export {
    generateTxtFile,
    generateCsvFile,
    generateJsonFile
} from './generate';

// 文件验证
export {
    checkFileType,
    checkFileSize,
    isImage,
    getImageDimensions,
    validateFile,
    formatFileSize
} from './validators';

// 工具函数
export {
    getFileExtension,
    getFileNameWithoutExtension,
    getFileInfo
} from './utils';

// 默认导出所有方法
import {
    readFile,
    readTxtFile,
    readCsvFile,
    readJsonFile,
} from './read';

import {
    downloadFile,
    downloadBlob,
    downloadBase64,
    downloadMultiple,
} from './download';

import {
    fileToBase64,
    base64ToBlob,
} from './convert';

import {
    generateTxtFile,
    generateCsvFile,
    generateJsonFile,
} from './generate';

import {
    checkFileType,
    checkFileSize,
    isImage,
    getImageDimensions,
    validateFile,
    formatFileSize,
} from './validators';

import {
    getFileExtension,
    getFileNameWithoutExtension,
    getFileInfo,
} from './utils';

export default {
    // 读取
    readFile,
    readTxtFile,
    readCsvFile,
    readJsonFile,
    
    // 下载
    downloadFile,
    downloadBlob,
    downloadBase64,
    downloadMultiple,
    
    // 转换
    fileToBase64,
    base64ToBlob,
    
    // 生成
    generateTxtFile,
    generateCsvFile,
    generateJsonFile,
    
    // 验证
    checkFileType,
    checkFileSize,
    isImage,
    getImageDimensions,
    validateFile,
    formatFileSize,
    
    // 工具
    getFileExtension,
    getFileNameWithoutExtension,
    getFileInfo,
};
