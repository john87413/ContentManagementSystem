import imageCompression from 'browser-image-compression';

export const compressImage = async (file, options = {}) => {
    const originalSize = file.size / 1024 / 1024; // 轉換為 MB

    // 預設選項
    const defaultOptions = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 960,
        useWebWorker: true,
        compressionThreshold: 1, // MB
        lightCompressionThreshold: 0.4, // MB
        quality: 0.75  // 新增質量參數，如果庫支持的話
    };

    // 合併選項
    const finalOptions = { ...defaultOptions, ...options };

    try {
        let compressedFile = file;

        if (originalSize > finalOptions.compressionThreshold) {
            // 如果原始圖片大於閾值，進行壓縮
            const compressionOptions = {
                maxSizeMB: Math.min(finalOptions.maxSizeMB, originalSize * 0.9),
                maxWidthOrHeight: finalOptions.maxWidthOrHeight,
                useWebWorker: finalOptions.useWebWorker,
            };
            compressedFile = await imageCompression(file, compressionOptions);
        } else if (originalSize > finalOptions.lightCompressionThreshold) {
            // 如果原始圖片在輕度壓縮閾值和壓縮閾值之間，輕度壓縮
            const compressionOptions = {
                maxSizeMB: originalSize * 0.9,
                maxWidthOrHeight: finalOptions.maxWidthOrHeight,
                useWebWorker: finalOptions.useWebWorker,
            };
            compressedFile = await imageCompression(file, compressionOptions);
        }
        // 如果圖片小於輕度壓縮閾值，不進行壓縮

        console.log(`原始大小: ${originalSize.toFixed(2)}MB, 壓縮後: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

        // 確保返回的是 File 對象，並保持原始文件名和類型
        if (compressedFile instanceof Blob) {
            compressedFile = new File([compressedFile], file.name, {
                type: file.type,
                lastModified: new Date().getTime()
            });
        }

        return compressedFile;
    } catch (error) {
        console.error("圖片壓縮失敗:", error);
        throw error;
    }
};