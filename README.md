# file-utils 文件操作工具库

一个轻量级的文件操作工具库，提供常用的文件处理功能，支持多种文件格式，开箱即用，并针对现代前端开发进行了 Tree Shaking 优化。

支持以下特性：

- **文件读取**：支持读取文本、二进制数据、Data URL 等
- **文件下载**：支持从 URL、Blob、Base64 等多种方式下载文件
- **文件转换**：支持文件格式转换（如 Base64 转 Blob、File 转 Base64 等）
- **文件压缩**：支持图片压缩处理
- **文件生成**：支持生成 TXT、CSV、JSON 格式文件
- **文件验证**：提供完整的文件验证和类型判断功能
- **自动清理**：自动管理临时创建的 Blob URL，防止内存泄漏
- **TypeScript**：完善的类型定义支持

------

## 安装

你可以通过 npm 安装该库：

```bash
pnpm install @giszhc/file-utils
```

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
```

### 11. 获取文件扩展名和文件名

```ts
import { getFileExtension, getFileNameWithoutExtension } from '@giszhc/file-utils';

const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

// 获取扩展名
const ext = getFileExtension(file); // ".pdf"

// 获取文件名（不含扩展名）
const name = getFileNameWithoutExtension(file); // "document"
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

