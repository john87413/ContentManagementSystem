const uploadService = require('../services/uploadService');
const { AppError, ValidationError } = require('../errors/AppError'); // 自訂錯誤類別

class UploadController {
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  // 上傳圖片
  uploadImages = async (req, res, next) => {
    try {
      const files = req.files;

      // 檢查是否有上傳檔案
      if (!files || files.length === 0) {
        throw new ValidationError('未提供圖片檔案');
      }

      // 使用 uploadService 上傳圖片
      const uploadResults = await this.uploadService.uploadImages(files);
      res.send(uploadResults);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('圖片上傳發生錯誤', 500);
      }
      next(error);
    }
  }

  // 刪除圖片
  deleteImage = async (req, res, next) => {
    try {
      const fileName = req.params.fileName;

      // 檢查是否有提供檔名
      if (!fileName) {
        throw new ValidationError('未提供圖片檔案名稱');
      }

      // 使用 uploadService 刪除圖片
      const result = await this.uploadService.deleteImage(fileName);
      res.send(result);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError(`圖片刪除失敗`, 500);
      }
      next(error);
    }
  }
}

module.exports = new UploadController(uploadService);