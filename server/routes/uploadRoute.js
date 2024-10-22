const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('只允許上傳圖片檔案'));
        }
        cb(null, true);
    },
});

router.post('/images', upload.array('files', 5), uploadController.uploadImages);
router.delete('/images/:fileName', uploadController.deleteImage);
router.get('/images/:fileName', uploadController.getImage);

module.exports = router;
