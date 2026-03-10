/**
 * 剪贴板复制相关方法
 */

import type { CopyOptions } from './types';

/**
 * 一键复制文本到剪贴板
 *
 * @param text - 要复制的文本内容
 * @param options - 复制选项配置（可选）
 * @returns Promise<void>
 *
 * @example
 * // 基本使用
 * copyToClipboard('Hello World!');
 *
 * @example
 * // 带回调的使用
 * copyToClipboard('Hello World!', {
 *   onSuccess: () => console.log('复制成功！'),
 *   onError: (error) => console.error('复制失败:', error)
 * });
 *
 * @remarks
 * - 优先使用现代的 navigator.clipboard API
 * - 自动降级到传统的 execCommand 方式以兼容旧浏览器
 * - 需要用户授权才能访问剪贴板
 */
export async function copyToClipboard(
    text: string,
    options?: CopyOptions
): Promise<void> {
    try {
        // 尝试使用现代 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            
            if (options?.onSuccess) {
                options.onSuccess(text);
            }
           return;
        }
        
        // 降级到传统的 execCommand 方式
       const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 确保元素不可见但可以被选中
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0';
        
       document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
           const successful = document.execCommand('copy');
            
            if (successful) {
                if (options?.onSuccess) {
                    options.onSuccess(text);
                }
            } else {
                throw new Error('execCommand 复制失败');
            }
        } catch (err) {
            throw new Error('无法使用 execCommand 复制文本');
        } finally {
           document.body.removeChild(textArea);
        }
    } catch (error) {
       const err = error instanceof Error ? error : new Error('未知错误');
        
        if (options?.onError) {
            options.onError(err);
        } else {
           console.error('复制到剪贴板失败:', err);
        }
        
        throw err;
    }
}

/**
 * 从剪贴板读取文本
 *
 * @returns Promise<string> - 剪贴板中的文本内容
 *
 * @example
 * // 读取剪贴板内容
 * const text = await pasteFromClipboard();
 * console.log('剪贴板内容:', text);
 *
 * @remarks
 * - 需要用户授权才能访问剪贴板
 * - 在某些浏览器中可能需要 HTTPS 环境
 */
export async function pasteFromClipboard(): Promise<string> {
    try {
        // 尝试使用现代 Clipboard API
        if (navigator.clipboard && navigator.clipboard.readText) {
           return await navigator.clipboard.readText();
        }
        
        // 降级方案：尝试使用 document.execCommand('paste')
        // 注意：这种方式在现代浏览器中已经被废弃
        throw new Error('当前浏览器不支持读取剪贴板');
    } catch (error) {
       console.error('从剪贴板读取失败:', error);
        throw new Error('无法从剪贴板读取内容，请检查浏览器权限');
    }
}
