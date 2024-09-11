const uploadService = require('../services/uploadService');

async function uploadImages(req, res) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('未找到檔案');
        }

        const uploadResults = await uploadService.uploadImages(files);
        res.send(uploadResults);
    } catch (err) {
        console.error('圖片上傳過程中發生錯誤:', err);
        res.status(500).send('圖片上傳發生錯誤');
    }
}

async function deleteImage(req, res) {
    try {
        const fileName = req.params.fileName;
        if (!fileName) {
            return res.status(400).send('未提供檔案名稱');
        }

        const result = await uploadService.deleteImage(fileName);
        res.send(result);
    } catch (err) {
        console.error('刪除圖片時發生錯誤:', err);
        res.status(500).send('刪除失敗');
    }
}

module.exports = {
    uploadImages,
    deleteImage,
};
