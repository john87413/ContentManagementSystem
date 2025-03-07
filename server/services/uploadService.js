const { v4: uuidv4 } = require('uuid'); // UUID 生成器，產生唯一的檔案名稱
const firebaseAdmin = require('../config/firebase'); // Firebase Admin SDK
const { FileOperationError } = require('../errors/AppError'); // 自訂錯誤類別

// 取得 Firebase Storage bucket 實例
const bucket = firebaseAdmin.storage().bucket();

class UploadService {
  constructor() {
    this.bucket = bucket;
  }

  // 上傳多個圖片到 Firebase Storage
  uploadImages = async (files) => {
    
    // 將每個檔案轉換為上傳 Promise
    const uploadPromises = files.map(async (file) => {
      // 使用 UUID 生成唯一檔名，並保留原始副檔名
      const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

      // 在 bucket 中建立檔案參考
      const blob = this.bucket.file(fileName);
      // 建立寫入串流，設定檔案的 metadata
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,  // 設定檔案的 MIME 類型
          cacheControl: 'public, max-age=86400',  // 設定快取時間為 24 小時
        },
      });

      try {
        // 等待串流完成寫入
        await new Promise((resolve, reject) => {
          blobStream.on('finish', resolve);  // 寫入完成時解析 Promise
          blobStream.on('error', reject);    // 發生錯誤時拒絕 Promise
          blobStream.end(file.buffer);       // 寫入檔案內容
        });

        // 組合圖片的公開 URL
        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_PROJECT_ID}.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
        return { fileName, imgUrl };
      } catch (error) {
        throw error;
      }
    });

    // 等待所有圖片上傳完成
    return Promise.all(uploadPromises);
  }

  // Firebase Storage 刪除指定圖片
  deleteImage = async (fileName) => {
    try {
      // 取得檔案參考並刪除
      const blob = this.bucket.file(fileName);

      const [exists] = await blob.exists();
      if (!exists) {
        return '刪除成功';
        // throw new FileOperationError('圖片不存在', 'delete');
      }

      await blob.delete();
      return '刪除成功';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UploadService();