class UploadController {
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  uploadImages = async (req, res, next) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return next({ status: 400, message: '未找到圖片檔案' });
      }

      const uploadResults = await this.uploadService.uploadImages(files);
      res.send(uploadResults);
    } catch (err) {
      console.log(err);
      next({ status: 500, message: '圖片上傳發生錯誤' });
    }
  }

  deleteImage = async (req, res, next) => {
    try {
      const fileName = req.params.fileName;
      if (!fileName) {
        return next({ status: 400, message: '未提供圖片檔案名稱' });
      }

      const result = await this.uploadService.deleteImage(fileName);
      res.send(result);
    } catch (err) {
      next({ status: 500, message: '刪除失敗' });
    }
  }
}

const uploadService = require('../services/uploadService');
module.exports = new UploadController(uploadService);
