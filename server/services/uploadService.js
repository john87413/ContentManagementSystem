const { v4: uuidv4 } = require('uuid');
const tinify = require("tinify");
const firebaseAdmin = require('../config/firebase');

tinify.key = process.env.TINYPNG_API_KEY;
const bucket = firebaseAdmin.storage().bucket();

module.exports = {

    // 壓縮圖片並上傳到 Firebase
    uploadImages: async (files) => {
        const uploadResults = [];

        for (const file of files) {
            const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
            const compressedImage = await tinify.fromBuffer(file.buffer).toBuffer();

            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream();

            await new Promise((resolve, reject) => {
                blobStream.on('finish', async () => {
                    try {
                        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_PROJECT_ID}.appspot.com/o/${fileName}?alt=media`
                        uploadResults.push({ fileName, imgUrl });
                        resolve();
                    } catch (err) {
                        console.error('取得圖片URL時發生錯誤:', err);
                        reject('取得圖片URL失敗');
                    }
                });

                blobStream.on('error', (err) => {
                    console.error('上傳圖片時發生錯誤:', err);
                    reject('上傳失敗');
                });

                blobStream.end(compressedImage);
            });
        }

        return uploadResults;
    },

    // 刪除圖片
    deleteImage: async (fileName) => {
        const blob = bucket.file(fileName);
        await blob.delete();
        return '刪除成功';
    },
};
