/**
 * 通用辅助工具方法
 */

/**
 * 深拷贝方法
 * 支持对象、数组、Date、RegExp 等类型的深拷贝
 * 
 * @param target - 需要拷贝的目标对象
 * @returns T - 拷贝后的新对象
 * 
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * const copy = deepClone(obj);
 * copy.b.c = 3;
 * console.log(obj.b.c); // 2 (原对象不受影响)
 */
export function deepClone<T>(target: T): T {
    if (target === null || typeof target !== 'object') {
        return target;
    }
    
    if (target instanceof Date) {
        return new Date(target.getTime()) as any;
    }
    
    if (target instanceof RegExp) {
        return new RegExp(target.source, target.flags) as any;
    }
    
    if (Array.isArray(target)) {
        return target.map(item => deepClone(item)) as any;
    }
    
    const cloned: any = {};
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            cloned[key] = deepClone(target[key]);
        }
    }
    
    return cloned;
}

/**
 * 数字保留指定小数位数
 * 
 * @param number - 需要处理的数字
 * @param fractionDigits - 保留的小数位数，默认为 2
 * @returns number - 处理后的数字
 * 
 * @example
 * numberFixed(3.14159, 2) // 3.14
 * numberFixed(10, 3) // 10
 */
export const numberFixed = function (number: number, fractionDigits: number = 2): number {
    return Number(number.toFixed(fractionDigits));
};

/**
 * 解析 URL 参数为对象
 * 
 * @param url - URL 字符串，默认为 location.href
 * @returns Record<string, string> - 包含 URL 参数的对象
 * 
 * @example
 * parseUrlParams('https://example.com?name=John&age=30') 
 * // { name: 'John', age: '30' }
 * 
 * @example
 * parseUrlParams() // 解析当前页面 URL 参数
 */
export function parseUrlParams(url: string = location.href): Record<string, string> {
    const params: Record<string, string> = {};
    const urlObj = new URL(url);
    
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    
    return params;
}

/**
 * 将对象转换为 FormData
 * 
 * @param obj - 需要转换的对象
 * @param formData - 可选的 FormData 实例，用于追加数据
 * @returns FormData - 转换后的 FormData 对象
 * 
 * @example
 * const obj = { name: 'John', age: 30 };
 * const formData = objectToFormData(obj);
 * 
 * @example
 * // 嵌套对象
 * const obj = { user: { name: 'John', email: 'john@example.com' } };
 * const formData = objectToFormData(obj);
 */
export function objectToFormData(obj: Record<string, any>, formData?: FormData): FormData {
    const fd = formData || new FormData();
    
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        
        if (value instanceof File) {
            fd.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    objectToFormData({ [`${key}[${index}]`]: item }, fd);
                } else {
                    fd.append(`${key}[${index}]`, item);
                }
            });
        } else if (typeof value === 'object' && value !== null && !(value instanceof Blob)) {
            objectToFormData(value, fd);
        } else {
            fd.append(key, value);
        }
    });
    
    return fd;
}

/**
 * 从给定对象中移除特定的键，返回新对象
 * 
 * @param obj - 原始对象
 * @param keys - 需要移除的键名数组
 * @param reverse - 是否反向操作（即只保留指定的键），默认为 false
 * @returns T - 移除指定键后的新对象
 * 
 * @example
 * omitKeys({ a: 1, b: 2, c: 3 }, ['b', c]) // { a: 1 }
 * 
 * @example
 * omitKeys({ a: 1, b: 2, c: 3 }, ['a'], true) // { a: 1 } (反向操作，只保留 a)
 */
export function omitKeys<T extends Record<string, any>>(
    obj: T, 
    keys: (keyof T | string)[], 
    reverse: boolean = false
): Partial<T> {
    const result: Partial<T> = {};
    const keysSet = new Set(keys);
    
    if (reverse) {
        // 反向操作：只保留指定的键
        for (const key of keys) {
            if (key in obj) {
                result[key as keyof T] = obj[key as keyof T];
            }
        }
    } else {
        // 正常操作：移除指定的键
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && !keysSet.has(key)) {
                result[key as keyof T] = obj[key];
            }
        }
    }
    
    return result;
}

/**
 * 生成 UUID
 * 
 * @param removeHyphens - 是否移除横杠，默认为 false（保留横杠）
 * @returns string - 生成的 UUID 字符串
 * 
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 * 
 * @example
 * generateUUID(true) // "550e8400e29b41d4a716446655440000" (无横杠)
 */
export function generateUUID(removeHyphens: boolean = false): string {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    return removeHyphens ? uuid.replace(/-/g, '') : uuid;
}

/**
 * 数组求和
 * 
 * @param arr - 数字数组
 * @returns number - 数组元素的总和
 * 
 * @example
 * arraySum([1, 2, 3, 4, 5]) // 15
 * arraySum([10, 20, 30]) // 60
 */
export function arraySum(arr: number[]): number {
    return arr.reduce((sum, num) => sum + num, 0);
}

/**
 * 格式化数字金额，使用逗号分隔（千分位）
 * 
 * @param amount - 需要格式化的数字金额
 * @param decimals - 小数位数，默认为 2
 * @returns string - 格式化后的字符串（如：1,234,567.89）
 * 
 * @example
 * formatAmount(1234567.89) // "1,234,567.89"
 * formatAmount(1000000, 0) // "1,000,000"
 * formatAmount(999) // "999.00"
 */
export function formatAmount(amount: number, decimals: number = 2): string {
    if (isNaN(amount)) return '0';
    
    const fixed = amount.toFixed(decimals);
    const parts = fixed.split('.');
    
    // 整数部分添加千分位分隔符
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
}

/**
 * 将字符串中间部分替换为星号（*）
 * 常用于隐藏电话号码、身份证号等敏感信息
 * 
 * @param str - 需要处理的字符串
 * @param start - 开始保留的字符数（从左侧计数）
 * @param end - 结束保留的字符数（从右侧计数）
 * @param maskChar - 用于替换的字符，默认为 '*'
 * @returns string - 处理后的字符串
 * 
 * @example
 * maskString('13800138000', 3, 4) // "138****8000"
 * maskString('1234567890', 2, 2) // "12******90"
 * maskString('abc', 1, 1) // "a*b"
 */
export function maskString(str: string, start: number = 3, end: number = 4, maskChar: string = '*'): string {
    if (!str || typeof str !== 'string') return '';
    
    const len = str.length;
    
    // 如果字符串长度小于等于 start + end，全部用 maskChar 替换
    if (len <= start + end) {
        return maskChar.repeat(len);
    }
    
    const startStr = str.substring(0, start);
    const endStr = str.substring(len - end);
    const middleLen = len - start - end;
    
    return startStr + maskChar.repeat(middleLen) + endStr;
}

/**
 * 格式化手机号码，隐藏中间 4 位
 * 
 * @param phone - 手机号码
 * @param maskChar - 用于替换的字符，默认为 '*'
 * @returns string - 格式化后的手机号码（如：138****8000）
 * 
 * @example
 * formatPhone('13800138000') // "138****8000"
 * formatPhone('13900139000', '#') // "139####9000"
 */
export function formatPhone(phone: string, maskChar: string = '*'): string {
    if (!phone || phone.length < 7) return phone;
    return maskString(phone, 3, 4, maskChar);
}
