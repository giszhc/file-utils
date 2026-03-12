/**
 * 文件转换相关方法
 */

import { readFile } from './read';
import { changeDpiDataUrl, changeDpiBlob } from 'changedpi';

/**
 * 将 File 或 Blob 对象转换为 Base64 编码
 *
 * @param file - File 或 Blob 对象
 * @returns Promise<string> - Base64 编码的字符串（包含 data URL 前缀）
 *
 * @example
 * // 在文件上传前预览
 * const input = document.querySelector('input[type="file"]');
 * input.addEventListener('change', async (e) => {
 *   const file = e.target.files[0];
 *   const base64 = await fileToBase64(file);
 *   console.log(base64); // data:image/jpeg;base64,/9j/4AAQSkZJRg...
 * });
 */
export function fileToBase64(file: File | Blob): Promise<string> {
    return readFile(file, 'dataURL') as Promise<string>;
}

/**
 * 将 Base64 编码转换为 Blob 对象
 *
 * @param base64 - Base64 编码的字符串（可以包含或不包含 data URL 前缀）
 * @param mimeType - MIME 类型（可选），如果未指定且 base64 不包含前缀，默认为 'application/octet-stream'
 * @returns Blob - 转换后的 Blob 对象
 *
 * @example
 * // 转换带前缀的 Base64
 * const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
 * const blob = base64ToBlob(base64);
 *
 * @example
 * // 转换不带前缀的 Base64
 * const base64 = 'iVBORw0KGgoAAAANS...';
 * const blob = base64ToBlob(base64, 'image/png');
 */
export function base64ToBlob(base64: string, mimeType?: string): Blob {
    // 检查是否包含 data URL 前缀
    const hasPrefix = base64.startsWith('data:');

    if (hasPrefix) {
        // 从前缀中提取 MIME 类型
        mimeType = base64.split(',')[0].split(':')[1].split(';')[0];
        base64 = base64.split(',')[1]; // 移除前缀
    } else if (!mimeType) {
        // 没有前缀也没有指定 MIME 类型，使用默认值
        mimeType = 'application/octet-stream';
    }

    // 将 Base64 解码为字节数组
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

/**
 * 将 Blob 转换为指定文件名的 File 对象
 *
 * @param blob - Blob 对象
 * @param filename - 文件名
 * @returns File - 转换后的 File 对象
 *
 * @example
 * const blob = new Blob(['Hello'], { type: 'text/plain' });
 * const file = blobToFileName(blob, 'hello.txt');
 * console.log(file.name); // "hello.txt"
 */
export function blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type });
}

/**
 * 将 Base64 编码转换为 File 对象
 *
 * @param base64 - Base64 编码的字符串（可以包含或不包含 data URL 前缀）
 * @param filename - 文件名（可选），默认为 'file'
 * @param mimeType - MIME 类型（可选），如果未指定且 base64 不包含前缀，默认为 'application/octet-stream'
 * @returns File - 转换后的 File 对象
 *
 * @example
 * // 转换带前缀的 Base64
 * const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
 * const file = base64ToFile(base64, 'image.png');
 *
 * @example
 * // 转换不带前缀的 Base64
 * const base64 = 'iVBORw0KGgoAAAANS...';
 * const file = base64ToFile(base64, 'image.png', 'image/png');
 */
export function base64ToFile(base64: string, filename: string = 'file', mimeType?: string): File {
    const blob = base64ToBlob(base64, mimeType);
    return blobToFile(blob, filename);
}

/**
 * 将图片 URL 转换为 Base64 编码
 * 使用 Canvas 将图片绘制后转换为 Base64
 *
 * @param imageUrl - 图片 URL 地址
 * @param mimeType - 输出的 MIME 类型（可选），默认为 'image/png'
 * @param quality - 图片质量（可选），范围 0.0 - 1.0，默认为 1.0
 * @returns Promise<string> - Base64 编码的字符串（包含 data URL 前缀）
 *
 * @example
 * // 转换远程图片
 * const base64 = await imageUrlToBase64('https://example.com/image.jpg');
 * console.log(base64); // data:image/png;base64,iVBORw0KGgoAAAANS...
 *
 * @example
 * // 转换为 JPEG 格式，80% 质量
 * const base64 = await imageUrlToBase64('https://example.com/image.png', 'image/jpeg', 0.8);
 */
export function imageUrlToBase64(
    imageUrl: string,
    mimeType: string = 'image/png',
    quality: number = 1.0
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        // 处理跨域问题
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('无法获取 Canvas 上下文'));
                    return;
                }
                
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL(mimeType, quality);
                resolve(base64);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error(`图片加载失败：${imageUrl}`));
        };
        
        img.src = imageUrl;
    });
}

/**
 * fileChangedImageDPI 函数用于修改图片的分辨率 DPI
 *
 * @param source - 原图片，支持 Base64 字符串或 Blob 对象
 * @param dpi - 需要设置的分辨率值，默认为 96
 * @returns Promise<string | Blob> - 返回修改后的 DPI 图片（Base64 字符串或 Blob）
 *
 * @example
 * // 修改 Base64 图片的 DPI
 * const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
 * const newBase64 = fileChangedImageDPI(base64, 300);
 *
 * @example
 * // 修改 Blob 图片的 DPI
 * const blob = new Blob([imageData], { type: 'image/png' });
 * const newBlob = await fileChangedImageDPI(blob, 300);
 *
 * @example
 * // 使用默认 DPI (96)
 * const result = await fileChangedImageDPI(base64);
 */
export async function fileChangedImageDPI(source: string | Blob, dpi: number = 96): Promise<string | Blob> {
    if (typeof source === 'string') {
        // Base64 字符串，使用 changeDpiDataUrl（同步）
        return changeDpiDataUrl(source, dpi);
    } else {
        // Blob 对象，使用 changeDpiBlob（异步）
        return await changeDpiBlob(source, dpi);
    }
}
