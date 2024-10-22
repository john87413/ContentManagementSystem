const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

class UploadService {
  constructor() {
    mongoose.connection.once('open', () => {
      this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
      });
    });
  }

  async uploadImages(files) {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      try {
        // Create upload stream
        const uploadStream = this.bucket.openUploadStream(fileName, {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadDate: new Date()
          }
        });

        // Upload file
        await new Promise((resolve, reject) => {
          uploadStream.on('error', reject);
          uploadStream.on('finish', resolve);
          uploadStream.end(file.buffer);
        });

        // Generate URL (you'll need to adjust this based on your API setup)
        const imgUrl = `/upload/images/${fileName}`;
        return { fileName, imgUrl };
      } catch (error) {
        throw new Error(`上傳圖片失敗: ${error.message}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  async deleteImage(fileName) {
    try {
      const file = await this.bucket.find({ filename: fileName }).toArray();
      if (!file.length) {
        throw new Error('找不到圖片');
      }

      await this.bucket.delete(file[0]._id);
      return '刪除成功';
    } catch (error) {
      throw new Error(`刪除圖片失敗: ${error.message}`);
    }
  }

  // New method to stream image
  async getImage(fileName) {
    try {
      // 先檢查文件是否存在
      const files = await this.bucket.find({ filename: fileName }).toArray();
      if (!files.length) {
        throw new Error('找不到圖片');
      }

      // 返回圖片stream
      const downloadStream = this.bucket.openDownloadStreamByName(fileName);
      return downloadStream;
    } catch (error) {
      throw new Error(`取得圖片失敗: ${error.message}`);
    }
  }
}

module.exports = new UploadService();