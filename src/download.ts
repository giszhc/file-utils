/**
 * 文件下载相关方法
 */

import type { DownloadOptions } from './types';

/**
 * 从 URL 下载文件
 *
 * @param url - 文件的 URL 地址
 * @param filename - 保存的文件名（可选），如果不指定则尝试从 URL 中提取
 * @param options - 下载选项配置（可选）
 *
 * @returns Promise<void>
 *
 * @example
 * // 下载文件并指定文件名
 * await downloadFile('https://example.com/file.pdf', 'my-file.pdf');
 *
 * @example
 * // 使用默认文件名
 * await downloadFile('https://example.com/image.jpg');
 *
 * @example
 * // 设置授权请求头
 * await downloadFile('https://api.example.com/file/123', undefined, {
 *   fetchOptions: {
 *     headers: {
 *       'Authorization': 'Bearer token123'
 *     }
 *   }
 * });
 *
 * @example
 * // 使用 POST 请求下载
 * await downloadFile('https://api.example.com/download', 'file.pdf', {
 *   fetchOptions: {
 *     method: 'POST',
 *     body: JSON.stringify({ fileId: 123 })
 *   }
 * });
 *
 * @remarks
 * - 需要目标服务器支持 CORS（跨域资源共享）
 * - 会自动清理临时创建的 Blob URL
 * - 可以通过 fetchOptions 传入自定义的 fetch 配置
 */
export async function downloadFile(
    url: string,
    filename?: string,
    options?: DownloadOptions
): Promise<void> {
    try {
        // 发送请求获取文件，支持自定义 fetch 配置
        const response = await fetch(url, options?.fetchOptions);

        if (!response.ok) {
            throw new Error(`下载失败：${response.status} ${response.statusText}`);
        }

        // 获取 Blob 数据
        const blob = await response.blob();

        // 如果没有指定文件名，尝试从 URL 或响应头中提取
        let finalFilename = filename;
        if (!finalFilename) {
            // 尝试从 Content-Disposition 头获取文件名
            const disposition = response.headers.get('Content-Disposition');
            if (disposition) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches && matches[1]) {
                    finalFilename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
            }

            // 如果还是没有，从 URL 提取
            if (!finalFilename) {
                finalFilename = url.split('/').pop() || 'download';
            }
        }

        // 执行下载
        downloadBlob(blob, finalFilename, options);
    } catch (error) {
        console.error('文件下载失败:', error);
        throw error;
    }
}

/**
 * 下载 Blob 对象
 *
 * @param blob - Blob 对象
 * @param filename - 保存的文件名（包含扩展名）
 * @param options - 下载选项配置（可选）
 *
 * @example
 * // 下载文本文件
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * downloadBlob(blob, 'hello.txt');
 *
 * @example
 * // 下载图片
 * const blob = await fetch('https://example.com/image.jpg').then(r => r.blob());
 * downloadBlob(blob, 'image.jpg');
 */
export function downloadBlob(
    blob: Blob,
    filename: string,
    options?: DownloadOptions
): void {
    // 创建临时的 Blob URL
    const blobUrl = URL.createObjectURL(blob);

    // 创建隐藏的 <a> 标签
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;

    // 是否在新窗口打开
    if (options?.newWindow) {
        link.target = '_blank';
    }

    // 添加到 DOM 并触发点击
    document.body.appendChild(link);
    link.click();

    // 清理：移除元素并释放 Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}

/**
 * 下载 Base64 编码的文件
 *
 * @param base64 - Base64 编码的字符串（可以包含或不包含 data:image/png;base64, 前缀）
 * @param filename - 保存的文件名（包含扩展名）
 * @param mimeType - MIME 类型（可选），如果 base64 不包含前缀且未指定此参数，默认为 'application/octet-stream'
 *
 * @example
 * // 下载 PNG 图片
 * const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
 * downloadBase64(base64Data, 'image.png');
 *
 * @example
 * // 下载不带前缀的 Base64 数据
 * const base64Data = 'iVBORw0KGgoAAAANS...';
 * downloadBase64(base64Data, 'image.png', 'image/png');
 */
export function downloadBase64(
    base64: string,
    filename: string,
    mimeType?: string
): void {
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

    // 将 Base64 转换为 Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // 下载 Blob
    downloadBlob(blob, filename);
}

/**
 * 批量下载文件
 *
 * @param urls - URL 数组
 * @param delay - 下载间隔时间（毫秒），默认 500ms，避免浏览器拦截
 *
 * @example
 * const urls = [
 *   'https://example.com/image1.jpg',
 *   'https://example.com/image2.jpg'
 * ];
 * downloadMultiple(urls, 1000); // 每隔 1 秒下载一个
 */
export async function downloadMultiple(
    urls: string[],
    delay: number = 500
): Promise<void> {
    for (let i = 0; i < urls.length; i++) {
        try {
            await downloadFile(urls[i]);

            // 如果不是最后一个文件，等待指定时间
            if (i < urls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            console.error(`第 ${i + 1} 个文件下载失败:`, error);
        }
    }
}
