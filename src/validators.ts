/**
 * 文件验证相关方法
 */

import { getFileNameSuffix } from './utils';

/**
 * 检查文件类型是否匹配
 * 
 * @param file - File 对象
 * @param acceptTypes - 接受的类型数组，支持：
 *                     - MIME 类型：'image/jpeg', 'application/pdf'
 *                     - 通配符：'image/*', 'audio/*', 'video/*'
 *                     - 扩展名：'.jpg', '.png', '.pdf'
 * @returns boolean - 如果文件类型匹配返回 true
 *
 * @example
 * // 检查是否为 JPEG 图片
 * checkFileType(file, ['image/jpeg']);
 *
 * @example
 * // 检查是否为图片或 PDF
 * checkFileType(file, ['image/*', 'application/pdf']);
 *
 * @example
 * // 使用扩展名检查
 * checkFileType(file, ['.jpg', '.png', '.gif']);
 */
export function checkFileType(file: File, acceptTypes: string[]): boolean {
    if (!file || !acceptTypes || acceptTypes.length === 0) {
        return false;
    }
    
    const fileType = file.type.toLowerCase();
    const fileExtension = `.${getFileNameSuffix(file).toLowerCase()}`;
    
    return acceptTypes.some(type => {
        const normalizedType = type.toLowerCase();
        
        // 如果是通配符（如 image/*）
        if (normalizedType.endsWith('/*')) {
            const category = normalizedType.split('/')[0];
            return fileType.startsWith(`${category}/`);
        }
        
        // 如果是扩展名（以 . 开头）
        if (normalizedType.startsWith('.')) {
            return fileExtension === normalizedType;
        }
        
        // 精确匹配 MIME 类型
        return fileType === normalizedType;
    });
}

/**
 * 检查文件大小是否符合要求
 *
 * @param file - File 对象
 * @param maxSize - 最大文件大小（字节）
 * @returns boolean - 如果文件大小符合要求返回 true
 *
 * @example
 * // 限制不超过 2MB
 * checkFileSize(file, 2 * 1024 * 1024);
 *
 * @example
 * // 限制不超过 500KB
 * checkFileSize(file, 500 * 1024);
 */
export function checkFileSize(file: File, maxSize: number): boolean {
    if (!file) {
        return false;
    }
    
    return file.size <= maxSize;
}

/**
 * 快速判断文件是否为图片格式
 *
 * @param file - File 对象
 * @returns boolean - 如果是图片返回 true
 *
 * @example
 * if (isImage(file)) {
 *   console.log('这是一个图片文件');
 * }
 */
export function isImage(file: File): boolean {
    if (!file) {
        return false;
    }
    
    // 通过 MIME 类型判断
    if (file.type.startsWith('image/')) {
        return true;
    }
    
    // 通过扩展名判断（防止 MIME 类型不准确）
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'];
    const extension = `.${getFileNameSuffix(file)}`;
    
    return imageExtensions.includes(extension);
}

/**
 * 获取图片的原始尺寸（宽度和高度）
 *
 * @param file - File 对象（必须是图片文件）
 * @returns Promise<{ width: number, height: number }> - 图片的宽度和高度
 *
 * @example
 * const dimensions = await getImageDimensions(file);
 * console.log(`图片尺寸：${dimensions.width} x ${dimensions.height}`);
 *
 * @throws 如果文件不是图片格式，会抛出错误
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        if (!isImage(file)) {
            reject(new Error('文件不是有效的图片格式'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const img = new Image();
            
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            
            img.onerror = () => {
                reject(new Error('图片加载失败'));
            };
            
            img.src = event.target?.result as string;
        };
        
        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * 综合文件验证
 * 
 * @param file - File 对象
 * @param options - 验证选项配置
 * @returns Promise<IValidationResult> - 验证结果
 *
 * @example
 * // 验证文件：类型、大小、图片尺寸
 * const result = await validateFile(file, {
 *   acceptTypes: ['image/jpeg', 'image/png'],
 *   maxSize: 2 * 1024 * 1024, // 2MB
 *   mustBeImage: true,
 *   minWidth: 800,
 *   maxWidth: 4096,
 *   minHeight: 600,
 *   maxHeight: 4096
 * });
 * 
 * if (!result.valid) {
 *   console.log('验证失败:', result.errors);
 * }
 */
export async function validateFile(
    file: File,
    options: import('./types').IFileValidationOptions = {}
): Promise<import('./types').IValidationResult> {
    const errors: string[] = [];
    
    // 检查文件类型
    if (options.acceptTypes && options.acceptTypes.length > 0) {
        if (!checkFileType(file, options.acceptTypes)) {
            errors.push(`不支持的文件类型。接受：${options.acceptTypes.join(', ')}`);
        }
    }
    
    // 检查文件大小
    if (options.maxSize !== undefined) {
        if (!checkFileSize(file, options.maxSize)) {
            const sizeLimit = formatFileSize(options.maxSize);
            errors.push(`文件过大。最大允许：${sizeLimit}`);
        }
    }
    
    // 检查是否为图片
    if (options.mustBeImage && !isImage(file)) {
        errors.push('文件必须是图片格式');
    }
    
    // 检查图片尺寸
    if (isImage(file) && (
        options.minWidth !== undefined || 
        options.maxWidth !== undefined || 
        options.minHeight !== undefined || 
        options.maxHeight !== undefined
    )) {
        try {
            const dimensions = await getImageDimensions(file);
            
            if (options.minWidth !== undefined && dimensions.width < options.minWidth) {
                errors.push(`图片宽度过小。最小宽度：${options.minWidth}px`);
            }
            
            if (options.maxWidth !== undefined && dimensions.width > options.maxWidth) {
                errors.push(`图片宽度过大。最大宽度：${options.maxWidth}px`);
            }
            
            if (options.minHeight !== undefined && dimensions.height < options.minHeight) {
                errors.push(`图片高度过小。最小高度：${options.minHeight}px`);
            }
            
            if (options.maxHeight !== undefined && dimensions.height > options.maxHeight) {
                errors.push(`图片高度过大。最大高度：${options.maxHeight}px`);
            }
        } catch (error) {
            errors.push('无法获取图片尺寸');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 格式化文件大小
 *
 * @param bytes - 文件大小（字节）
 * @param decimal - 小数位数，默认 2
 * @returns string - 格式化后的大小字符串（如：1.5 MB）
 *
 * @example
 * formatFileSize(1024); // "1.00 KB"
 * formatFileSize(1048576); // "1.00 MB"
 * formatFileSize(1073741824); // "1.00 GB"
 */
export function formatFileSize(bytes: number, decimal: number = 2): string {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + units[i];
}
