/**
 * 文件读取相关方法
 */

import type { ReadFileType } from './types';

/**
 * 读取文件内容
 *
 * @param file - File 或 Blob 对象
 * @param type - 读取类型，可选值：'text' | 'arrayBuffer' | 'dataURL' | 'binaryString'
 *              默认值：'text'
 * @returns Promise<string | ArrayBuffer> - 返回读取后的内容
 *
 * @example
 * // 读取文本文件
 * const content = await readFile(file, 'text');
 *
 * @example
 * // 读取为 ArrayBuffer（二进制数据）
 * const buffer = await readFile(file, 'arrayBuffer');
 *
 * @example
 * // 读取为 Data URL（Base64 编码）
 * const dataUrl = await readFile(file, 'dataURL');
 */
export function readFile(
    file: File | Blob,
    type: ReadFileType = 'text'
): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // 根据类型选择对应的读取方法
        switch (type) {
            case 'text':
                reader.readAsText(file);
                break;
            case 'arrayBuffer':
                reader.readAsArrayBuffer(file);
                break;
            case 'dataURL':
                reader.readAsDataURL(file);
                break;
            case 'binaryString':
                reader.readAsBinaryString(file);
                break;
            default:
                reader.readAsText(file);
        }

        // 读取成功时的回调
        reader.onload = (event) => {
            const result = event.target?.result;
            if (result !== undefined) {
                resolve(result as string);
            } else {
                reject(new Error('文件读取失败'));
            }
        };

        // 读取失败时的回调
        reader.onerror = () => {
            reject(new Error('文件读取错误'));
        };

        // 读取中止时的回调
        reader.onabort = () => {
            reject(new Error('文件读取被中止'));
        };
    });
}

/**
 * 读取 TXT 文件
 *
 * @param file - File 或 Blob 对象
 * @param encoding - 字符编码，默认 'utf-8'
 * @returns Promise<string> - 返回文本内容
 *
 * @example
 * const content = await readTxtFile(file);
 * 
 * @example
 * // 指定编码
 * const content = await readTxtFile(file, 'gbk');
 */
export async function readTxtFile(file: File | Blob, encoding: string = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        // 使用指定的编码读取文件
        reader.readAsText(file, encoding);
        
        reader.onload = (event) => {
            const result = event.target?.result;
            if (result !== undefined) {
                resolve(result as string);
            } else {
                reject(new Error('文件读取失败'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('文件读取错误'));
        };
        
        reader.onabort = () => {
            reject(new Error('文件读取被中止'));
        };
    });
}

/**
 * 读取 CSV 文件
 *
 * @param file - File 或 Blob 对象
 * @param options - CSV 解析选项
 *                - separator: 字段分隔符，默认 ','
 *                - hasHeader: 是否包含表头，默认 true
 * @returns Promise<any[]> - 解析后的数据数组
 *
 * @example
 * // 读取 CSV 文件
 * const data = await readCsvFile(file);
 * console.log(data); // [{name: '张三', age: '25'}, ...]
 */
export async function readCsvFile(
    file: File | Blob,
    options: { separator?: string; hasHeader?: boolean } = {}
): Promise<any[]> {
    const { separator = ',', hasHeader = true } = options;
    const content = await readFile(file, 'text') as string;

    if (!content.trim()) {
        return [];
    }

    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length === 0) {
        return [];
    }

    // 解析表头
    let headers: string[] = [];
    let startIndex = 0;

    if (hasHeader) {
        headers = parseCsvLine(lines[0], separator);
        startIndex = 1;
    }

    const result: any[] = [];

    // 解析数据行
    for (let i = startIndex; i < lines.length; i++) {
        const values = parseCsvLine(lines[i], separator);

        if (hasHeader && headers.length > 0) {
            // 使用表头创建对象
            const row: Record<string, any> = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            result.push(row);
        } else {
            // 直接存储数组
            result.push(values);
        }
    }

    return result;
}

/**
 * 解析 CSV 行
 */
function parseCsvLine(line: string, separator: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // 转义的双引号
                current += '"';
                i++; // 跳过下一个引号
            } else {
                // 切换引号状态
                inQuotes = !inQuotes;
            }
        } else if (char === separator && !inQuotes) {
            // 分隔符且不在引号内
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // 添加最后一个字段
    result.push(current.trim());

    return result;
}

/**
 * 读取 JSON 文件
 *
 * @param file - File 或 Blob 对象
 * @returns Promise<T> - 解析后的 JSON 数据
 *
 * @example
 * // 读取 JSON 文件
 * const data = await readJsonFile<{ name: string; age: number }>(file);
 * console.log(data.name);
 */
export async function readJsonFile<T = any>(file: File | Blob): Promise<T> {
    const content = await readFile(file, 'text') as string;

    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`JSON 解析失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
}
