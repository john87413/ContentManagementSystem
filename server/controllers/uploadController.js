class UploadController {
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  uploadImages = async (req, res, next) => {
    try {
      const files = req.files;
      if (!files?.length) {
        return next({ status: 400, message: '未找到圖片檔案' });
      }

      const uploadResults = await this.uploadService.uploadImages(files);
      res.status(200).json(uploadResults);
    } catch (error) {
      next({ status: 500, message: error.message });
    }
  }

  deleteImage = async (req, res, next) => {
    try {
      const { fileName } = req.params;
      if (!fileName) {
        return next({ status: 400, message: '未提供圖片檔案名稱' });
      }

      const result = await this.uploadService.deleteImage(fileName);
      res.status(200).json({ message: result });
    } catch (error) {
      next({ status: 500, message: error.message });
    }
  }

  getImage = async (req, res, next) => {
    try {
      const { fileName } = req.params;
      if (!fileName) {
        return next({ status: 400, message: '未提供圖片檔案名稱' });
      }

      const stream = await this.uploadService.getImage(fileName);
      stream.pipe(res);
    } catch (error) {
      next({ status: 500, message: error.message });
    }
  }
}

const uploadService = require('../services/uploadService');
module.exports = new UploadController(uploadService);