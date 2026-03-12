/**
 * 正则验证工具类 (增强版)
 * 提供常用的表单验证功能，包括邮箱、手机、URL、坐标等
 * 
 * @author 烟火里的尘埃 / AI 优化版
 */

/**
 * 验证结果接口
 */
export interface IVerifyResult {
    /** 是否通过验证 */
    valid: boolean;
    /** 错误消息 */
    message?: string;
}

/**
 * 提示语映射
 */
export interface IVerifyMessages {
    email: string;
    number: string;
    phone: string;
    url: string;
    ip: string;
    longitude: string;
    latitude: string;
    noSpace: string;
    password: string;
    empty: string;
    chinese: string;
    inputCoordinates: string;
}

/**
 * 正则验证工具类 (增强版)
 * 提供常用的表单验证功能，包括邮箱、手机、URL、坐标等
 */
export class VerifyUtils {
    // 提示语映射
    static messages: IVerifyMessages = {
        email: "请输入正确的邮箱地址",
        number: "请输入合法的数字",
        phone: "请输入正确的 11 位手机号码",
        url: "请输入以 http/https/ftp/mapbox 开头的合法链接",
        ip: "请输入正确的 IP 地址 (0-255.0-255.0-255.0-255)",
        longitude: "经度应在 -180 到 180 之间",
        latitude: "纬度应在 -90 到 90 之间",
        noSpace: "内容不能包含空格",
        password: "密码需 8-18 位，含大小写字母、数字及特殊符号 (.|@|_)",
        empty: "内容不能为空",
        chinese: "内容必须包含中文",
        inputCoordinates: "坐标格式不正确或数值超出经纬度范围"
    };

    // --- 基础验证方法 ---
    static isEmail = (val: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    static isNumber = (val: string): boolean => /^-?\d+(\.\d+)?$/.test(val);
    static isPhone = (val: string): boolean => /^1[3-9]\d{9}$/.test(val);
    static isUrl = (val: string): boolean => /^(https?|ftp|mapbox):\/\/[^\s/$.?#].[^\s]*$/i.test(val);
    static isIP = (val: string): boolean => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val);
    static isNoSpace = (val: string): boolean => typeof val === 'string' && !/\s/.test(val);
    static isChinese = (val: string): boolean => /[\u4e00-\u9fa5]/.test(val);
    static isPassword = (val: string): boolean => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.@_])[\da-zA-Z.@_]{8,18}$/.test(val);
    
    /**
     * 验证经度
     * @param lng - 经度值
     * @returns boolean - 是否在 -180 到 180 之间
     */
    static isLongitude(lng: number | string): boolean {
        const n = Number(lng);
        return !isNaN(n) && n >= -180 && n <= 180;
    }

    /**
     * 验证纬度
     * @param lat - 纬度值
     * @returns boolean - 是否在 -90 到 90 之间
     */
    static isLatitude(lat: number | string): boolean {
        const n = Number(lat);
        return !isNaN(n) && n >= -90 && n <= 90;
    }

    /**
     * 检查是否为空
     * @param value - 需要检查的值
     * @returns boolean - 是否为空
     */
    static isEmpty(value: any): boolean {
        if (value === null || value === undefined || value === "null" || value === "undefined") return true;
        if (typeof value === "string") return value.trim() === "";
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "object") return Object.keys(value).length === 0;
        return false;
    }

    /**
     * 验证输入坐标串 (递归平铺校验)
     * 支持格式："lng,lat" 或 "lng,lat;lng,lat" 或 "lng,lat;lng,lat|lng,lat"
     * @param latLngS - 坐标字符串
     * @returns boolean - 坐标格式是否正确
     */
    static isInputCoordinates(latLngS: string): boolean {
        if (this.isEmpty(latLngS)) return false;
        try {
            // 提取字符串中所有的数字对
            const coords = this.generateCoordinates(latLngS);
            if (!coords || coords.length === 0) return false;

            // 将嵌套数组拍平到最底层 [lng, lat] 的级别进行校验
            const flatCheck = (arr: any): boolean => {
                if (typeof arr[0] === 'number') {
                    return this.isLongitude(arr[0]) && this.isLatitude(arr[1]);
                }
                return arr.every((item: any) => flatCheck(item));
            };
            return flatCheck(coords);
        } catch (e) {
            return false;
        }
    }

    /**
     * 生成坐标数组 (支持多级分隔符)
     * @param latLngS - 坐标字符串
     * @returns any[] | null - 解析后的坐标数组
     */
    static generateCoordinates(latLngS: string): any[] | null {
        if (typeof latLngS !== 'string') return null;
        
        if (latLngS.includes("|")) {
            return latLngS.split("|").map(item => this.generateCoordinates(item));
        } else if (latLngS.includes(";")) {
            return latLngS.split(";").map(item => this.generateCoordinates(item));
        } else if (latLngS.includes(",")) {
            const pair = latLngS.split(",").map(item => Number(item.trim()));
            return pair.length >= 2 ? pair : null;
        }
        return null;
    }

    /**
     * 快速生成 Form 表单校验规则
     * @param type - 对应 messages 的 key
     * @param trigger - 触发方式 'blur' | 'change'
     * @returns any - Element UI 表单验证规则对象
     */
    static getRule(type: string, trigger: string = 'blur'): any {
        return {
            validator: (_: any, value: any, callback: Function) => {
                // 如果为空且不是必填项，跳过校验（必填由 {required:true} 处理）
                if (this.isEmpty(value)) return callback();

                // 动态获取对应的校验方法
                const methodName = `is${type.charAt(0).toUpperCase() + type.slice(1)}`;
                const checkFn = (this as any)[methodName];

                if (checkFn && !checkFn.call(this, value)) {
                    return callback(new Error(this.messages[type as keyof typeof this.messages] || "输入格式有误"));
                }
                callback();
            },
            trigger
        };
    }

    /**
     * 带错误消息的验证
     * @param type - 验证类型
     * @param value - 验证值
     * @returns IVerifyResult - 验证结果
     */
    static validate(type: keyof typeof this.messages, value: any): IVerifyResult {
        const methodName = `is${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const checkFn = (this as any)[methodName];
        
        if (checkFn) {
            const isValid = checkFn.call(this, value);
            return {
                valid: isValid,
                message: isValid ? undefined : this.messages[type]
            };
        }
        
        return {
            valid: false,
            message: "未知的验证类型"
        };
    }
}

export default VerifyUtils;
