# file-utils 文件操作工具库

一个轻量级的文件操作工具库，提供常用的文件处理功能，支持多种文件格式，开箱即用，并针对现代前端开发进行了 Tree Shaking 优化。

支持以下特性：

- **文件读取**：支持读取文本、二进制数据、Data URL 等
- **文件下载**：支持从 URL、Blob、Base64 等多种方式下载文件
- **文件转换**：支持文件格式转换（如 Base64 转 Blob、File 转 Base64 等）
- **文件压缩**：支持将多个文件打包为 ZIP 压缩包
- **文件压缩**：支持图片压缩处理
- **文件生成**：支持生成 TXT、CSV、JSON 格式文件，可选择返回 File 对象而不下载
- **文件验证**：提供完整的文件验证和类型判断功能
- **剪贴板操作**：支持一键复制文本到剪贴板，并支持成功/失败回调
- **辅助工具**：提供深拷贝、UUID 生成、URL 参数解析、对象转 FormData 等实用工具
- **正则验证**：提供邮箱、手机、URL、坐标等多种表单验证功能
- **自动清理**：自动管理临时创建的 Blob URL，防止内存泄漏
- **TypeScript**：完善的类型定义支持

------

## 在线示例

我们提供了一个功能完整的在线演示页面，您可以直接在浏览器中体验所有功能：

**🌐 立即体验：** [点击访问在线演示](https://giszhc.github.io/file-utils/)

------

## 安装

你可以通过 npm 安装该库：

```bash
pnpm install @giszhc/file-utils
```

------
## 方法列表

### 文件读取
- `readFile` - 读取文件内容为文本、ArrayBuffer 或 DataURL
- `readTxtFile` - 读取 TXT 文件内容
- `readCsvFile` - 读取 CSV 文件并解析为对象数组
- `readJsonFile` - 读取 JSON 文件并解析为 JavaScript 对象

### 文件下载
- `downloadFile` - 从 URL 下载文件
- `downloadBlob` - 下载 Blob 对象
- `downloadBase64` - 下载 Base64 编码的文件
- `downloadMultiple` - 批量下载多个文件

### 文件转换
- `fileToBase64` - 将 File/Blob 转换为 Base64
- `base64ToBlob` - 将 Base64 转换为 Blob
- `blobToFile` - 将 Blob 转换为指定文件名的 File
- `base64ToFile` - 将 Base64 转换为 File
- `imageUrlToBase64` - 将图片 URL 转换为 Base64
- `fileChangedImageDPI` - 修改图片的 DPI 分辨率
- `compressImage` - 压缩图片

### 文件压缩
- `fileListToZip` - 将文件列表打包为 ZIP
- `downloadFileListAsZip` - 下载文件列表的 ZIP 压缩包

### 文件生成
- `generateTxtFile` - 生成 TXT 文件
- `generateCsvFile` - 生成 CSV 文件
- `generateJsonFile` - 生成 JSON 文件

### 文件验证
- `checkFileType` - 检查文件类型
- `checkFileSize` - 检查文件大小
- `isImage` - 判断是否为图片
- `getImageDimensions` - 获取图片尺寸
- `validateFile` - 综合文件验证
- `formatFileSize` - 格式化文件大小显示
- `getFileNameSuffix` - 获取文件扩展名（不含点号）
- `getFileNamePrefix` - 获取文件名（不含扩展名）
- `getFileInfo` - 获取文件完整信息

### 剪贴板操作
- `copyToClipboard` - 复制文本到剪贴板
- `pasteFromClipboard` - 从剪贴板读取文本

### 辅助工具
- `deepClone` - 深拷贝对象和数组
- `numberFixed` - 数字保留指定小数位
- `parseUrlParams` - 解析 URL 参数为对象
- `objectToFormData` - 对象转换为 FormData
- `omitKeys` - 从对象中移除指定的键
- `generateUUID` - 生成 UUID（支持移除横杠）
- `arraySum` - 数字数组求和
- `formatAmount` - 格式化金额（千分位）
- `maskString` - 字符串中间部分替换为星号
- `formatPhone` - 格式化手机号码（隐藏中间 4 位）
- `arrayStringFormatNumber` - 字符串数组转数值数组
- `arrayCustomSort` - 自定义排序（按指定 id 顺序）
- `jsonConvertTreeList` - 扁平数据转树形结构
- `jsonConvertGeneralList` - 树形结构转扁平数据

### 正则验证 (VerifyUtils)
- `VerifyUtils.isEmail` - 邮箱验证
- `VerifyUtils.isNumber` - 数字验证
- `VerifyUtils.isPhone` - 手机号验证
- `VerifyUtils.isUrl` - URL 链接验证
- `VerifyUtils.isIP` - IP 地址验证
- `VerifyUtils.isNoSpace` - 无空格验证
- `VerifyUtils.isChinese` - 中文验证
- `VerifyUtils.isPassword` - 密码强度验证
- `VerifyUtils.isLongitude` - 经度验证
- `VerifyUtils.isLatitude` - 纬度验证
- `VerifyUtils.isInputCoordinates` - 坐标串验证
- `VerifyUtils.isEmpty` - 空值检查
- `VerifyUtils.getRule` - 生成表单验证规则
- `VerifyUtils.validate` - 带错误消息的验证

------

## 使用场景

### 1. 授权下载 - 需要 Token 的 API 接口

```ts
import { downloadFile } from '@giszhc/file-utils';

// 从需要授权的 API 下载文件
const token = localStorage.getItem('access_token');
await downloadFile('https://api.example.com/file/123', undefined, {
  fetchOptions: {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
});
```

### 2. POST 请求下载 - 提交参数后获取文件

```ts
import { downloadFile } from '@giszhc/file-utils';

// 通过 POST 请求提交参数后下载文件
await downloadFile('https://api.example.com/export', 'report.xlsx', {
  fetchOptions: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      format: 'xlsx'
    })
  }
});
```

### 3. 自定义请求头 - 添加追踪或认证信息

```ts
import { downloadFile } from '@giszhc/file-utils';

// 添加自定义请求头
await downloadFile('https://cdn.example.com/resource/file.zip', undefined, {
  fetchOptions: {
    headers: {
      'X-API-Key': 'your-api-key-here',
      'X-Request-ID': 'unique-request-id',
      'X-User-Agent': 'MyApp/1.0.0'
    }
  }
});
```

### 4. 文件上传前预览和压缩

```ts
import { fileToBase64, compressImage } from '@giszhc/file-utils';

const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    // 压缩图片
    const compressed = await compressImage(file, {
      quality: 0.8,
      maxWidth: 1920
    });
    
    // 转换为 Base64 用于预览
    const previewUrl = await fileToBase64(compressed);
    
    // 显示预览
    const img = document.querySelector('#preview');
    img.src = previewUrl;
  }
};
```

### 5. 批量下载文件

```ts
import { downloadMultiple } from '@giszhc/file-utils';

// 批量下载多个文件，间隔 1 秒
const imageUrls = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
];

await downloadMultiple(imageUrls, 1000);
```

### 6. 文件大小格式化显示

```ts
import { getFileInfo, formatFileSize } from '@giszhc/file-utils';

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const info = getFileInfo(file);
    console.log(`文件名：${info.name}`);
    console.log(`类型：${info.type}`);
    console.log(`大小：${formatFileSize(info.size)}`); // 如："2.5 MB"
    console.log(`修改时间：${new Date(info.lastModified).toLocaleString()}`);
  }
};
```

### 7. Base64 与 Blob 互转

```ts
import { base64ToBlob, fileToBase64, downloadBase64 } from '@giszhc/file-utils';

// File/Blob 转 Base64
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files?.[0];
const base64 = await fileToBase64(file);

// Base64 转 Blob 并下载
const blob = base64ToBlob(base64);
downloadBase64(base64, 'downloaded-file.png');
```

### 8. 生成 TXT 文件

```ts
import { generateTxtFile } from '@giszhc/file-utils';

// 生成简单的文本文件
generateTxtFile('Hello World!', 'hello.txt');

// 生成多行文本
const lines = ['第一行', '第二行', '第三行'].join('\n');
generateTxtFile(lines, 'multiline.txt');

// 生成文件但不下载，返回 File 对象
const file = generateTxtFile('Hello World!', 'hello.txt', { download: false });
console.log(file.name); // "hello.txt"
console.log(file.type); // "text/plain;charset=utf-8"
console.log(file.size); // 文件大小（字节）
```

### 9. 生成 CSV 文件

```ts
import { generateCsvFile } from '@giszhc/file-utils';

// 使用对象数组生成 CSV
const users = [
  { name: '张三', age: 25, city: '北京' },
  { name: '李四', age: 30, city: '上海' },
  { name: '王五', age: 28, city: '广州' }
];
generateCsvFile(users, 'users.csv');

// 使用二维数组生成 CSV
const data = [
  ['姓名', '年龄', '城市'],
  ['张三', 25, '北京'],
  ['李四', 30, '上海']
];
generateCsvFile(data, 'data.csv');

// 自定义分隔符（制表符 TSV）
generateCsvFile(data, 'data.tsv', { separator: '\t' });

// 生成文件但不下载，返回 File 对象
const csvFile = generateCsvFile(users, 'users.csv', { download: false });
console.log(csvFile.name); // "users.csv"
console.log(csvFile.type); // "text/csv;charset=utf-8"
console.log(csvFile.size); // 文件大小（字节）
```

### 10. 生成 JSON 文件

```ts
import { generateJsonFile } from '@giszhc/file-utils';

// 生成简单的 JSON 文件
const data = { name: '张三', age: 25 };
generateJsonFile(data, 'user.json');

// 生成格式化的 JSON 数组
const users = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 }
];
generateJsonFile(users, 'users.json');

// 压缩输出（不格式化）
generateJsonFile(data, 'data.min.json', { pretty: false });

// 自定义缩进
generateJsonFile(data, 'data.json', { spaces: 4 });

// 生成文件但不下载，返回 File 对象
const file = generateJsonFile(data, 'user.json', { download: false });
console.log(file.name); // "user.json"
console.log(file.type); // "application/json;charset=utf-8"
console.log(file.size); // 文件大小（字节）
```

### 11. 获取文件扩展名和文件名

```ts
import { getFileNameSuffix, getFileNamePrefix } from '@giszhc/file-utils';

const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

// 获取扩展名（不含点号）
const ext = getFileNameSuffix(file); // "pdf"

// 获取文件名（不含扩展名）
const name = getFileNamePrefix(file); // "document"
```

### 12. 文件类型验证

```ts
import { checkFileType, isImage } from '@giszhc/file-utils';

// 检查是否为 JPEG 图片
const isJpeg = checkFileType(file, ['image/jpeg']);

// 检查是否为图片或 PDF
const isValid = checkFileType(file, ['image/*', 'application/pdf']);

// 使用扩展名检查
const isAllowed = checkFileType(file, ['.jpg', '.png', '.gif']);

// 快速判断是否为图片
if (isImage(file)) {
  console.log('这是一个图片文件');
}
```

### 13. 文件大小验证

```ts
import { checkFileSize } from '@giszhc/file-utils';

// 限制不超过 2MB
const isValidSize = checkFileSize(file, 2 * 1024 * 1024);

if (!isValidSize) {
  console.log('文件过大，不能超过 2MB');
}
```

### 14. 获取图片尺寸

```ts
import { getImageDimensions } from '@giszhc/file-utils';

// 异步获取图片原始尺寸
const dimensions = await getImageDimensions(file);
console.log(`图片尺寸：${dimensions.width} x ${dimensions.height}`);
```

### 15. 综合文件验证

```ts
import { validateFile } from '@giszhc/file-utils';

// 在上传前进行全面验证
const result = await validateFile(file, {
  acceptTypes: ['image/jpeg', 'image/png'],
  maxSize: 2 * 1024 * 1024, // 2MB
  mustBeImage: true,
  minWidth: 800,
  maxWidth: 4096,
  minHeight: 600,
  maxHeight: 4096
});

if (!result.valid) {
  // 显示所有错误信息
  result.errors.forEach(error => console.error(error));
} else {
  // 验证通过，可以上传
  console.log('文件验证通过');
}
```

### 16. 读取 TXT 文件

```ts
import { readTxtFile } from '@giszhc/file-utils';

// 读取文本文件
const content = await readTxtFile(file);
console.log(content);
```

### 17. 读取 CSV 文件

```ts
import { readCsvFile } from '@giszhc/file-utils';

// 读取 CSV 文件（自动解析为对象数组）
const data = await readCsvFile(file);
console.log(data); // [{name: '张三', age: '25'}, ...]

// 自定义分隔符
const tsvData = await readCsvFile(file, { separator: '\t' });

// 不包含表头
const arrayData = await readCsvFile(file, { hasHeader: false });
```

### 18. 读取 JSON 文件

```ts
import { readJsonFile } from '@giszhc/file-utils';

// 读取 JSON 文件
const data = await readJsonFile<{ name: string; age: number }>(file);
console.log(data.name);
console.log(data.age);
```

### 19. 一键复制文本到剪贴板

```ts
import { copyToClipboard } from '@giszhc/file-utils';

// 基本使用
await copyToClipboard('Hello World!');

// 带回调的使用
await copyToClipboard('这是一段文本', {
  onSuccess: () => console.log('复制成功！'),
  onError: (error) => console.error('复制失败:', error)
});
```

### 20. 从剪贴板读取文本

```ts
import { pasteFromClipboard } from '@giszhc/file-utils';

// 读取剪贴板内容
const text = await pasteFromClipboard();
console.log('剪贴板内容:', text);
```

### 21. 深拷贝对象

```ts
import { deepClone } from '@giszhc/file-utils';

// 深拷贝对象
const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
const copy = deepClone(obj);
copy.b.c = 3;
console.log(obj.b.c); // 2 (原对象不受影响)

// 支持 Date、RegExp 等特殊类型
const data = {
  date: new Date(),
  regex: /test/g,
  nested: { array: [1, 2, 3] }
};
const cloned = deepClone(data);
```

### 22. 数字保留小数位

```ts
import { numberFixed } from '@giszhc/file-utils';

// 保留 2 位小数（默认）
const num1 = numberFixed(3.14159); // 3.14

// 自定义小数位数
const num2 = numberFixed(10, 3); // 10
const num3 = numberFixed(2.5678, 1); // 2.6
```

### 23. 解析 URL 参数

```ts
import { parseUrlParams } from '@giszhc/file-utils';

// 解析当前页面 URL 参数
const params = parseUrlParams();
console.log(params.id); // 从当前 URL 获取 id 参数

// 解析指定 URL 参数
const url = 'https://example.com?name=John&age=30';
const urlParams = parseUrlParams(url);
// { name: 'John', age: '30' }
```

### 24. 对象转 FormData

```ts
import { objectToFormData } from '@giszhc/file-utils';

// 简单对象转换
const obj = { name: 'John', age: 30 };
const formData = objectToFormData(obj);

// 嵌套对象
const user = {
  name: 'John',
  profile: {
    email: 'john@example.com',
    phone: '123456'
  }
};
const fd = objectToFormData(user);

// 包含文件
const fileInput = document.querySelector('input[type="file"]');
const data = {
  avatar: fileInput.files[0],
  description: 'User avatar'
};
const fdWithFile = objectToFormData(data);
```

### 25. 移除对象的特定键

```ts
import { omitKeys } from '@giszhc/file-utils';

// 移除指定的键
const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = omitKeys(obj, ['b', 'd']);
// { a: 1, c: 3 }

// 反向操作：只保留指定的键
const filtered = omitKeys(obj, ['a', 'c'], true);
// { a: 1, c: 3 }
```

### 26. 生成 UUID

```ts
import { generateUUID } from '@giszhc/file-utils';

// 生成带横杠的 UUID（默认）
const uuid1 = generateUUID();
// "550e8400-e29b-41d4-a716-446655440000"

// 生成不带横杠的 UUID
const uuid2 = generateUUID(true);
// "550e8400e29b41d4a716446655440000"

// 使用场景：生成唯一 ID
const userId = generateUUID();
const requestId = generateUUID(true); // 无横杠版本用于数据库存储
```

### 27. 正则验证工具类

```ts
import { VerifyUtils } from '@giszhc/file-utils';

// 基础验证
VerifyUtils.isEmail('test@example.com'); // true
VerifyUtils.isPhone('13800138000'); // true
VerifyUtils.isUrl('https://example.com'); // true
VerifyUtils.isNumber('123.45'); // true
VerifyUtils.isNoSpace('hello'); // true
VerifyUtils.isChinese('你好'); // true
VerifyUtils.isPassword('Abc@1234'); // true

// 经纬度验证
VerifyUtils.isLongitude(116.4); // true
VerifyUtils.isLatitude(39.9); // true

// 坐标串验证（支持多级分隔符）
VerifyUtils.isInputCoordinates('116.4,39.9'); // true
VerifyUtils.isInputCoordinates('116.4,39.9;117.4,40.9'); // true
VerifyUtils.isInputCoordinates('116.4,39.9|117.4,40.9'); // true

// 空值检查
VerifyUtils.isEmpty(''); // true
VerifyUtils.isEmpty(null); // true
VerifyUtils.isEmpty([]); // true
VerifyUtils.isEmpty({}); // true

// 生成 Element UI 表单验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    VerifyUtils.getRule('email', 'blur')
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    VerifyUtils.getRule('phone', 'blur')
  ],
  url: [VerifyUtils.getRule('url')]
};

// 获取错误提示语
console.log(VerifyUtils.messages.email); // "请输入正确的邮箱地址"
```

------

## 使用方法

### readFile(file: File | Blob, type?: string): Promise<string | ArrayBuffer>

读取文件内容。支持读取文本、ArrayBuffer、Data URL 等多种格式。

```ts
import { readFile } from '@giszhc/file-utils';

// 读取文本文件
const handleTextFile = async (file: File) => {
    const content = await readFile(file, 'text');
    console.log(content);
};

// 读取为 ArrayBuffer
const handleBinaryFile = async (file: File) => {
    const buffer = await readFile(file, 'arrayBuffer');
    console.log(buffer);
};

// 读取为 Data URL (Base64)
const handleDataUrl = async (file: File) => {
    const dataUrl = await readFile(file, 'dataURL');
    console.log(dataUrl);
};
```

### readTxtFile(file: File | Blob, encoding?: string): Promise<string>

读取 TXT 文件，返回纯文本内容。

```ts
import { readTxtFile } from '@giszhc/file-utils';

const content = await readTxtFile(file);
console.log(content);
```

### readCsvFile(file: File | Blob, options?: CsvOptions): Promise<any[]>

读取 CSV 文件，自动解析为对象数组或二维数组。

```ts
import { readCsvFile } from '@giszhc/file-utils';

// 读取为对象数组（假设有表头）
const data = await readCsvFile(file);
data.forEach(row => {
    console.log(row.name, row.age);
});

// 自定义分隔符（TSV）
const tsvData = await readCsvFile(file, { separator: '\t' });

// 不包含表头，返回二维数组
const arrayData = await readCsvFile(file, { hasHeader: false });
```

### readJsonFile<T>(file: File | Blob): Promise<T>

读取 JSON 文件，返回解析后的 JavaScript 对象，支持泛型类型定义。

```ts
import { readJsonFile } from '@giszhc/file-utils';

// 读取 JSON 配置
const config = await readJsonFile<{ apiEndpoint: string; version: string }>(file);
console.log(config.apiEndpoint);

// 读取用户数据
const user = await readJsonFile<{ name: string; email: string }>(file);
console.log(user.name);
```

### downloadFile(url: string, filename?: string): Promise<void>

从 URL 下载文件。支持跨域下载（需服务器支持 CORS）。

```ts
import { downloadFile } from '@giszhc/file-utils';

// 下载文件并指定文件名
await downloadFile('https://example.com/file.pdf', 'my-file.pdf');

// 使用默认文件名
await downloadFile('https://example.com/image.jpg');
```

### downloadBlob(blob: Blob, filename: string): void

下载 Blob 对象。

```ts
import { downloadBlob } from '@giszhc/file-utils';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
downloadBlob(blob, 'hello.txt');
```

### downloadBase64(base64: string, filename: string, mimeType?: string): void

下载 Base64 编码的文件。

```ts
import { downloadBase64 } from '@giszhc/file-utils';

const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
downloadBase64(base64Data, 'image.png');
```

### fileToBase64(file: File | Blob): Promise<string>

将 File 或 Blob 对象转换为 Base64 编码。

```ts
import { fileToBase64 } from '@giszhc/file-utils';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const base64 = await fileToBase64(file);
    console.log(base64);
});
```

### base64ToBlob(base64: string, mimeType?: string): Blob

将 Base64 编码转换为 Blob 对象。

```ts
import { base64ToBlob } from '@giszhc/file-utils';

const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
const blob = base64ToBlob(base64);
```

### base64ToFile(base64: string, filename?: string, mimeType?: string): File

将 Base64 编码转换为 File 对象。

```ts
import { base64ToFile } from '@giszhc/file-utils';

// 转换带前缀的 Base64
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
const file = base64ToFile(base64, 'image.png');
console.log(file.name); // "image.png"

// 转换不带前缀的 Base64
const pureBase64 = 'iVBORw0KGgoAAAANS...';
const file2 = base64ToFile(pureBase64, 'image.png', 'image/png');
```

### imageUrlToBase64(imageUrl: string, mimeType?: string, quality?: number): Promise<string>

将图片 URL 转换为 Base64 编码。使用 Canvas 将图片绘制后转换为 Base64。

```ts
import { imageUrlToBase64 } from '@giszhc/file-utils';

// 转换远程图片
const base64 = await imageUrlToBase64('https://example.com/image.jpg');
console.log(base64); // data:image/png;base64,...

// 转换为 JPEG 格式，80% 质量
const jpegBase64 = await imageUrlToBase64(
    'https://example.com/image.png',
    'image/jpeg',
    0.8
);
```

### fileChangedImageDPI(source: string | Blob, dpi?: number): Promise<string | Blob>

修改图片的分辨率 DPI（每英寸点数）。支持 Base64 字符串和 Blob 对象。返回 Promise。

```ts
import { fileChangedImageDPI } from '@giszhc/file-utils';

// 修改 Base64 图片的 DPI 为 300（适合打印）
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
const highDpiBase64 = await fileChangedImageDPI(base64, 300);
console.log('高分辨率图片:', highDpiBase64);

// 修改 Blob 图片的 DPI
const blob = new Blob([imageData], { type: 'image/png' });
const newBlob = await fileChangedImageDPI(blob, 300);
// newBlob 是修改后的 Blob 对象

// 使用默认 DPI (96，屏幕显示标准)
const defaultDpiResult = await fileChangedImageDPI(base64);

// 设置为 72 DPI（网页优化）
const webOptimized = await fileChangedImageDPI(base64, 72);

// 结合其他方法使用
import { fileToBase64, base64ToBlob, fileChangedImageDPI } from '@giszhc/file-utils';

const handleImageUpload = async (file: File) => {
    // 方式 1: 使用 Base64
    const base64 = await fileToBase64(file);
    const highResBase64 = await fileChangedImageDPI(base64, 300);
    
    // 方式 2: 直接使用 Blob
    const highResBlob = await fileChangedImageDPI(file, 300);
    const highResFile = base64ToFile(highResBase64, 'high-res.png');
};
```

**应用场景：**
- 🖼️ **打印前提升 DPI**：将网络图片的 DPI 从 72 提升到 300，获得更好的打印质量
- 🌐 **网页优化**：降低 DPI 到 72，减少文件体积，加快网页加载速度
- 📱 **设备适配**：根据不同设备的显示需求调整 DPI
- 📄 **出版印刷**：满足专业印刷的 300 DPI 或更高要求

**注意事项：**
- 该方法仅修改图片元数据中的 DPI 值，不会改变图片的像素尺寸
- DPI 值越高，打印时的物理尺寸越小，但细节越清晰
- 标准屏幕显示通常使用 96 DPI，印刷品通常需要 300 DPI
- 输入类型为 Base64 时返回 Base64，输入类型为 Blob 时返回 Blob
- **该方法是异步函数，需要使用 await 调用**

### compressImage(file: File, quality?: number, maxWidth?: number, maxHeight?: number): Promise<Blob>

压缩图片文件。支持调整质量和最大尺寸。

```ts
import { compressImage } from '@giszhc/file-utils';

const handleImageUpload = async (file: File) => {
    // 压缩到 80% 质量，最大宽度 1920px
    const compressed = await compressImage(file, 0.8, 1920);
    
    // 使用压缩后的文件上传
    const formData = new FormData();
    formData.append('image', compressed, file.name);
};
```

### generateTxtFile(content: string, filename: string, encoding?: string): void

生成并下载 TXT 文件。

```ts
import { generateTxtFile } from '@giszhc/file-utils';

// 生成简单的文本文件
generateTxtFile('Hello World!', 'hello.txt');

// 生成多行文本
const lines = ['第一行', '第二行', '第三行'].join('\n');
generateTxtFile(lines, 'multiline.txt');
```

### generateCsvFile(data: Record<string, any>[] | any[][], filename: string, options?: CsvOptions): void

生成并下载 CSV 文件。支持对象数组和二维数组，自动处理表头和字段转义。

```ts
import { generateCsvFile } from '@giszhc/file-utils';

// 使用对象数组
const users = [
    { name: '张三', age: 25, city: '北京' },
    { name: '李四', age: 30, city: '上海' }
];
generateCsvFile(users, 'users.csv');

// 使用二维数组
const data = [
    ['姓名', '年龄', '城市'],
    ['张三', 25, '北京'],
    ['李四', 30, '上海']
];
generateCsvFile(data, 'data.csv');

// 自定义配置（制表符分隔、不包含表头）
generateCsvFile(data, 'data.tsv', {
    separator: '\t',
    includeHeader: false
});
```

### generateJsonFile(data: any, filename: string, options?: JsonOptions): void

生成并下载 JSON 文件。支持格式化和压缩输出。

```ts
import { generateJsonFile } from '@giszhc/file-utils';

// 生成简单的 JSON 文件
const data = { name: '张三', age: 25 };
generateJsonFile(data, 'user.json');

// 格式化输出（默认）
const users = [
    { name: '张三', age: 25 },
    { name: '李四', age: 30 }
];
generateJsonFile(users, 'users.json');

// 压缩输出
generateJsonFile(data, 'data.min.json', { pretty: false });

// 自定义缩进
generateJsonFile(data, 'data.json', { spaces: 4 });
```

### getFileExtension(file: File | string): string

获取文件扩展名（后缀），包含点号。

```ts
import { getFileExtension } from '@giszhc/file-utils';

const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
const ext = getFileExtension(file); // ".pdf"

// 也可以传入文件名
const ext2 = getFileExtension('image.png'); // ".png"
```

### getFileNameWithoutExtension(file: File | string): string

获取文件名（不含扩展名）。

```ts
import { getFileNameWithoutExtension } from '@giszhc/file-utils';

const file = new File(['content'], 'archive.tar.gz', { type: 'application/gzip' });
const name = getFileNameWithoutExtension(file); // "archive.tar"
```

### checkFileType(file: File, acceptTypes: string[]): boolean

检查文件类型是否匹配。支持 MIME 类型、通配符和扩展名。

```ts
import { checkFileType } from '@giszhc/file-utils';

// 精确匹配 MIME 类型
checkFileType(file, ['image/jpeg']);

// 使用通配符
checkFileType(file, ['image/*', 'application/pdf']);

// 使用扩展名
checkFileType(file, ['.jpg', '.png', '.gif']);
```

### checkFileSize(file: File, maxSize: number): boolean

检查文件大小是否符合要求（字节）。

```ts
import { checkFileSize } from '@giszhc/file-utils';

// 限制不超过 2MB
const isValid = checkFileSize(file, 2 * 1024 * 1024);
if (!isValid) {
    console.log('文件过大');
}
```

### isImage(file: File): boolean

快速判断文件是否为图片格式。

```ts
import { isImage } from '@giszhc/file-utils';

if (isImage(file)) {
    console.log('这是一个图片文件');
}
```

### getImageDimensions(file: File): Promise<{ width: number, height: number }>

异步获取图片的原始宽高。

```ts
import { getImageDimensions } from '@giszhc/file-utils';

const dimensions = await getImageDimensions(file);
console.log(`图片尺寸：${dimensions.width} x ${dimensions.height}`);
```

### validateFile(file: File, options?: IFileValidationOptions): Promise<IValidationResult>

综合文件验证，在上传前进行合法性检查。

```ts
import { validateFile } from '@giszhc/file-utils';

const result = await validateFile(file, {
    acceptTypes: ['image/jpeg', 'image/png'],
    maxSize: 2 * 1024 * 1024, // 2MB
    mustBeImage: true,
    minWidth: 800,
    maxWidth: 4096,
    minHeight: 600,
    maxHeight: 4096
});

if (!result.valid) {
    // 显示所有错误
    result.errors.forEach(err => console.error(err));
} else {
    console.log('验证通过');
}
```

### arrayStringFormatNumber(arrayList: string[]): number[]

将字符串数组转换为数值数组。

```ts
import { arrayStringFormatNumber } from '@giszhc/file-utils';

// 将字符串数字数组转换为数值数组
const strArr = ["0", "1", "2", "3", "4"];
const numArr = arrayStringFormatNumber(strArr);
console.log(numArr); // [0, 1, 2, 3, 4]

// 处理带小数点的字符串
const decimalStrs = ["1.5", "2.7", "3.14"];
const decimalNums = arrayStringFormatNumber(decimalStrs);
console.log(decimalNums); // [1.5, 2.7, 3.14]
```

### arrayCustomSort(ids: string[], dataList: any[], cbA: Function, cbB: Function): void

根据给定的 id 顺序对数据列表进行排序。

```ts
import { arrayCustomSort } from '@giszhc/file-utils';

// 基本使用
const ids = ['id1', 'id2', 'id3'];
const dataList = [
    { id: 'id3', name: 'Layer 3' },
    { id: 'id1', name: 'Layer 1' },
    { id: 'id2', name: 'Layer 2' }
];

arrayCustomSort(ids, dataList, item => item.id, item => item.id);
// 排序后：[
//   { id: 'id1', name: 'Layer 1' },
//   { id: 'id2', name: 'Layer 2' },
//   { id: 'id3', name: 'Layer 3' }
// ]

// 使用不同的回调函数处理不同类型的数据
const orderIds = ['admin', 'user', 'guest'];
const roles = [
    { roleId: 'guest', roleName: '访客' },
    { roleId: 'admin', roleName: '管理员' },
    { roleId: 'user', roleName: '普通用户' }
];

arrayCustomSort(orderIds, roles, role => role.roleId, role => role.roleId);
// 按指定顺序排序：管理员、普通用户、访客
```

### jsonConvertTreeList(dataList: any[]): any[]

将扁平数据数组转换为树形结构。

```ts
import { jsonConvertTreeList } from '@giszhc/file-utils';

// 扁平数据
const flatData = [
    { id: 1, pid: null, name: '根节点' },
    { id: 2, pid: 1, name: '子节点 1' },
    { id: 3, pid: 1, name: '子节点 2' },
    { id: 4, pid: 2, name: '孙节点 1' }
];

const tree = jsonConvertTreeList(flatData);
/*
返回树形结构：
[
  {
    id: 1,
    pid: null,
    name: '根节点',
    children: [
      {
        id: 2,
        pid: 1,
        name: '子节点 1',
        children: [
          { id: 4, pid: 2, name: '孙节点 1' }
        ]
      },
      {
        id: 3,
        pid: 1,
        name: '子节点 2',
        children: []
      }
    ]
  }
]
*/

// 应用场景：菜单生成、组织架构展示
const menuData = [
    { id: 1, pid: null, title: '系统管理' },
    { id: 2, pid: 1, title: '用户管理' },
    { id: 3, pid: 1, title: '角色管理' },
    { id: 4, pid: 2, title: '用户列表' },
    { id: 5, pid: 2, title: '用户新增' }
];

const menuTree = jsonConvertTreeList(menuData);
```

### jsonConvertGeneralList(treeList: any[], delChildrenField?: boolean): any[]

将树形结构转换回扁平数据数组。

```ts
import { jsonConvertGeneralList } from '@giszhc/file-utils';

// 树形结构
const tree = [
    {
        id: 1,
        pid: null,
        name: '根节点',
        children: [
            {
                id: 2,
                pid: 1,
                name: '子节点 1',
                children: [
                    { id: 4, pid: 2, name: '孙节点 1' }
                ]
            },
            {
                id: 3,
                pid: 1,
                name: '子节点 2',
                children: []
            }
        ]
    }
];

// 保留 children 字段
const flatWithChildren = jsonConvertGeneralList(tree);
console.log(flatWithChildren.length); // 4

// 删除 children 字段
const flatWithoutChildren = jsonConvertGeneralList(tree, true);
console.log(flatWithoutChildren[0]); 
// { id: 1, pid: null, name: '根节点' } (不含 children)

// 应用场景：将树形菜单保存为扁平数据存储到数据库
const menuTree = [...]; // 树形菜单
const flatMenuData = jsonConvertGeneralList(menuTree, true);
// 可以发送到后端保存到数据库
```

------

## 类型定义

```ts
// 文件读取类型
export type ReadFileType = 'text' | 'arrayBuffer' | 'dataURL' | 'binaryString';

// 压缩选项
export interface CompressOptions {
    quality?: number;      // 压缩质量 (0-1)，默认 0.8
    maxWidth?: number;     // 最大宽度，默认无限制
    maxHeight?: number;    // 最大高度，默认无限制
    mimeType?: string;     // 输出 MIME 类型，默认 'image/jpeg'
}

// 文件验证结果
export interface IValidationResult {
    valid: boolean;        // 是否通过验证
    errors: string[];      // 错误信息列表
}

// 文件验证选项
export interface IFileValidationOptions {
    acceptTypes?: string[];   // 接受的文件类型
    maxSize?: number;         // 最大文件大小（字节）
    mustBeImage?: boolean;    // 是否必须为图片
    minWidth?: number;        // 最小宽度（图片）
    maxWidth?: number;        // 最大宽度（图片）
    minHeight?: number;       // 最小高度（图片）
    maxHeight?: number;       // 最大高度（图片）
}
```

------

## 注意事项

1. **内存管理**：使用 `downloadFile` 或 `downloadBlob` 等方法时，库会自动清理临时创建的 Blob URL，无需手动释放
2. **CORS 限制**：从 URL 下载文件时，需要目标服务器支持 CORS
3. **浏览器兼容性**：部分 API 可能需要较新的浏览器支持（如 ES2020+）
4. **文件大小限制**：读取大文件时注意浏览器内存限制

