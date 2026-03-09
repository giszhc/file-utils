/**
 * 工具函数相关方法
 */

import type { IFileInfo } from './types';

/**
 * 获取文件扩展名（后缀）
 *
 * @param file - File 对象或文件名
 * @returns string - 文件扩展名（包含点号，如 '.jpg'）
 *
 * @example
 * const file = new File(['content'], 'test.txt', { type: 'text/plain' });
 * const ext = getFileExtension(file); // ".txt"
 *
 * @example
 * const ext = getFileExtension('image.png'); // ".png"
 */
export function getFileExtension(file: File | string): string {
    const filename = typeof file === 'string' ? file : file.name;
    const lastDotIndex = filename.lastIndexOf('.');
    
    if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
        return '';
    }
    
    return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * 获取文件名（不含扩展名）
 *
 * @param file - File 对象或文件名
 * @returns string - 不含扩展名的文件名
 *
 * @example
 * const file = new File(['content'], 'test.txt', { type: 'text/plain' });
 * const name = getFileNameWithoutExtension(file); // "test"
 *
 * @example
 * const name = getFileNameWithoutExtension('archive.tar.gz'); // "archive.tar"
 */
export function getFileNameWithoutExtension(file: File | string): string {
    const filename = typeof file === 'string' ? file : file.name;
    const lastDotIndex = filename.lastIndexOf('.');
    
    if (lastDotIndex === -1) {
        return filename;
    }
    
    return filename.slice(0, lastDotIndex);
}

/**
 * 获取文件信息
 *
 * @param file - File 对象
 * @returns IFileInfo - 包含文件基本信息的对象
 *
 * @example
 * const fileInfo = getFileInfo(file);
 * console.log(`文件名：${fileInfo.name}, 大小：${(fileInfo.size / 1024).toFixed(2)} KB`);
 */
export function getFileInfo(file: File): IFileInfo {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    };
}
