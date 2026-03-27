/**
 * 文件压缩相关方法
 */

import type { Zippable, ZipOptions } from 'fflate';
import { zip } from 'fflate';
import { blobToFile } from './convert';
import { downloadBlob } from './download';

/**
 * 文件列表转 ZIP 压缩包
 * 
 * @param fileList - 文件列表数组
 * @param filename - ZIP 文件名（不含扩展名）
 * @returns Promise<File> - 返回 ZIP 压缩包 File 对象
 * 
 * @example
 * const files = [file1, file2, file3];
 * const zipFile = await fileListToZip(files, 'my-files');
 * console.log(zipFile.name); // "my-files.zip"
 */
export const fileListToZip = function (fileList: File[], filename: string): Promise<File> {
    return new Promise((resolve, reject) => {
        // 构建 fflate 需要的文件对象结构
        const filesForZip: Zippable = {};
        
        // 并行读取所有文件
        const readPromises = fileList.map((file) => {
            return new Promise<void>((resolveFile, rejectFile) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        filesForZip[file.name] = new Uint8Array(reader.result as ArrayBuffer);
                        resolveFile();
                    } else {
                        rejectFile(new Error(`Failed to read file: ${file.name}`));
                    }
                };
                reader.onerror = () => rejectFile(new Error(`Error reading file: ${file.name}`));
                reader.readAsArrayBuffer(file);
            });
        });
        
        // 所有文件读取完成后进行压缩
        Promise.all(readPromises)
            .then(() => {
                const options: ZipOptions = { level: 6 };
                zip(filesForZip, options, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    // @ts-ignore
                    const blob = new Blob([data], { type: 'application/zip' });
                    const zipFile = blobToFile(blob, `${filename}.zip`);
                    resolve(zipFile);
                });
            })
            .catch(reject);
    });
};

/**
 * 下载文件列表的 ZIP 压缩包
 * 
 * @param fileList - 文件列表数组
 * @param filename - ZIP 文件名（不含扩展名）
 * @returns Promise<void>
 * 
 * @example
 * const files = [file1, file2, file3];
 * await downloadFileListAsZip(files, 'my-files');
 */
export const downloadFileListAsZip = async function (fileList: File[], filename: string): Promise<void> {
    const zipFile = await fileListToZip(fileList, filename);
    // 调用项目中的下载方法
    await downloadBlob(zipFile, zipFile.name);
};
