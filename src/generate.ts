/**
 * 文件生成相关方法
 */

import { downloadBlob } from './download';

/**
 * 生成并下载 TXT 文件
 *
 * @param content - 文本内容
 * @param filename - 文件名（包含 .txt 扩展名）
 * @param encoding - 字符编码，默认 'utf-8'
 *
 * @example
 * // 生成简单的文本文件
 * generateTxtFile('Hello World!', 'hello.txt');
 *
 * @example
 * // 生成多行文本
 * const lines = ['第一行', '第二行', '第三行'].join('\n');
 * generateTxtFile(lines, 'multiline.txt');
 */
export function generateTxtFile(
    content: string,
    filename: string,
    encoding: string = 'utf-8'
): void {
    const blob = new Blob([content], { type: `text/plain;charset=${encoding}` });
    downloadBlob(blob, filename);
}

/**
 * 转义 CSV 字段值
 */
function escapeCsvValue(value: any, separator: string): string {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = String(value);

    // 如果值包含分隔符、双引号或换行符，需要用双引号包裹
    if (stringValue.includes(separator) || 
        stringValue.includes('"') || 
        stringValue.includes('\n') || 
        stringValue.includes('\r')) {
        // 将双引号转义为两个双引号
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/**
 * 生成并下载 CSV 文件
 *
 * @param data - 数据数组（对象数组或二维数组）
 * @param filename - 文件名（包含 .csv 扩展名）
 * @param options - CSV 选项配置（可选）
 *                - separator: 字段分隔符，默认 ','
 *                - includeHeader: 是否包含表头，默认 true
 *                - encoding: 字符编码，默认 'utf-8'
 *
 * @example
 * // 使用对象数组生成 CSV
 * const users = [
 *   { name: '张三', age: 25, city: '北京' },
 *   { name: '李四', age: 30, city: '上海' },
 *   { name: '王五', age: 28, city: '广州' }
 * ];
 * generateCsvFile(users, 'users.csv');
 *
 * @example
 * // 使用二维数组生成 CSV
 * const data = [
 *   ['姓名', '年龄', '城市'],
 *   ['张三', 25, '北京'],
 *   ['李四', 30, '上海']
 * ];
 * generateCsvFile(data, 'data.csv');
 *
 * @example
 * // 自定义分隔符（制表符）
 * generateCsvFile(data, 'data.tsv', { separator: '\t' });
 */
export function generateCsvFile(
    data: Record<string, any>[] | any[][],
    filename: string,
    options: {
        separator?: string;
        includeHeader?: boolean;
        encoding?: string;
    } = {}
): void {
    const {
        separator = ',',
        includeHeader = true,
        encoding = 'utf-8'
    } = options;

    if (data.length === 0) {
        throw new Error('数据不能为空');
    }

    let csvContent = '';

    // 判断数据类型
    const isObjectArray = typeof data[0] === 'object' && !Array.isArray(data[0]);

    if (isObjectArray) {
        // 对象数组处理
        const objectData = data as Record<string, any>[];
        
        // 获取所有键名（合并所有对象的键）
        const headers = Array.from(
            new Set(objectData.flatMap(obj => Object.keys(obj)))
        );

        // 添加表头
        if (includeHeader) {
            csvContent += headers.join(separator) + '\n';
        }

        // 添加数据行
        objectData.forEach(obj => {
            const row = headers.map(header => {
                const value = obj[header];
                return escapeCsvValue(value, separator);
            });
            csvContent += row.join(separator) + '\n';
        });
    } else {
        // 二维数组处理
        const arrayData = data as any[][];

        // 添加表头（如果是第一行且 includeHeader 为 true）
        if (includeHeader && arrayData.length > 0) {
            const headerRow = arrayData[0].map((value: any) => 
                escapeCsvValue(value, separator)
            );
            csvContent += headerRow.join(separator) + '\n';
            
            // 添加剩余的数据行
            for (let i = 1; i < arrayData.length; i++) {
                const row = arrayData[i].map((value: any) => 
                    escapeCsvValue(value, separator)
                );
                csvContent += row.join(separator) + '\n';
            }
        } else if (!includeHeader) {
            // 不包含表头，直接添加所有行
            arrayData.forEach(row => {
                const escapedRow = row.map((value: any) => 
                    escapeCsvValue(value, separator)
                );
                csvContent += escapedRow.join(separator) + '\n';
            });
        }
    }

    // 移除最后一行的多余换行符
    csvContent = csvContent.trimEnd();

    // 创建 BOM 头（用于 Excel 正确识别 UTF-8 编码）
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { 
        type: `text/csv;charset=${encoding}` 
    });
    
    downloadBlob(blob, filename);
}

/**
 * 生成并下载 JSON 文件
 *
 * @param data - JavaScript 对象或数组
 * @param filename - 文件名（包含 .json 扩展名）
 * @param options - JSON 选项配置（可选）
 *                - pretty: 是否格式化输出，默认 true
 *                - spaces: 缩进空格数，默认 2
 *                - encoding: 字符编码，默认 'utf-8'
 *
 * @example
 * // 生成简单的 JSON 文件
 * const data = { name: '张三', age: 25 };
 * generateJsonFile(data, 'user.json');
 *
 * @example
 * // 生成格式化的 JSON 数组
 * const users = [
 *   { name: '张三', age: 25 },
 *   { name: '李四', age: 30 }
 * ];
 * generateJsonFile(users, 'users.json');
 *
 * @example
 * // 压缩输出（不格式化）
 * generateJsonFile(data, 'data.min.json', { pretty: false });
 *
 * @example
 * // 自定义缩进
 * generateJsonFile(data, 'data.json', { spaces: 4 });
 */
export function generateJsonFile(
    data: any,
    filename: string,
    options: {
        pretty?: boolean;
        spaces?: number;
        encoding?: string;
    } = {}
): void {
    const {
        pretty = true,
        spaces = 2,
        encoding = 'utf-8'
    } = options;

    try {
        // 序列化为 JSON 字符串
        const jsonString = pretty 
            ? JSON.stringify(data, null, spaces)
            : JSON.stringify(data);

        // 创建 Blob
        const blob = new Blob([jsonString], { 
            type: `application/json;charset=${encoding}` 
        });
        
        downloadBlob(blob, filename);
    } catch (error) {
        console.error('JSON 序列化失败:', error);
        throw new Error('数据无法序列化为 JSON');
    }
}
