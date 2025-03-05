// 上傳相關路由
const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// 設定上傳限制: 5MB、僅限圖片
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('只允許上傳圖片檔案'));
        }
        cb(null, true);
    },
});

router.post('/images', upload.array('files', 5), uploadController.uploadImages);    // 上傳圖片
router.delete('/images/:fileName', uploadController.deleteImage);                   // 刪除圖片

module.exports = router;
