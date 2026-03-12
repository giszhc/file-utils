/**
 * 文件压缩相关方法
 */

import JSZip from 'jszip';
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
        const zip = new JSZip();
        
        fileList.forEach((file) => {
            zip.file(file.name, file);
        });
        
        zip.generateAsync({ type: "blob" }).then((blob) => {
            const zipFile = blobToFile(blob, `${filename}.zip`);
            resolve(zipFile);
        }, reject);
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
