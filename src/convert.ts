/**
 * 文件转换相关方法
 */

import { readFile } from './read';

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
