const { v4: uuidv4 } = require('uuid');
// const tinify = require("tinify");
const firebaseAdmin = require('../config/firebase');

// tinify.key = process.env.TINYPNG_API_KEY;
const bucket = firebaseAdmin.storage().bucket();

class UploadService {
  constructor() {
    this.bucket = bucket;
    // this.tinify = tinify;
  }

  // 壓縮圖片並上傳到 Firebase
  uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
      // const compressedImage = await this.tinify.fromBuffer(file.buffer).toBuffer();
      
      const blob = this.bucket.file(fileName);
      const blobStream = blob.createWriteStream();
      
      try {
        await new Promise((resolve, reject) => {
          blobStream.on('finish', resolve);
          blobStream.on('error', reject);
          blobStream.end(file.buffer);
        });

        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_PROJECT_ID}.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
        return { fileName, imgUrl };
      } catch (error) {
        throw new Error('上傳或取得圖片URL失敗');
      }
    });

    return Promise.all(uploadPromises);
  }

  // 刪除圖片
  deleteImage = async (fileName) => {
    try {
      const blob = this.bucket.file(fileName);
      await blob.delete();
      return '刪除成功';
    } catch (error) {
      throw new Error('刪除圖片失敗');
    }
  }
}

module.exports = new UploadService();
