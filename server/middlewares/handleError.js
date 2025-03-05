const handleError = (error, req, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // 處理 unique 錯誤
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        const errorMessages = `'${value}'已存在，不得重複`;
        res.status(400).json({ message: errorMessages });
    } else if (error.name === 'ValidationError') {
        // 處理驗證錯誤
        const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
        res.status(400).json({ message: errorMessages });
    } else {
        res.status(500).json({ message: error.message || "An unexpected error occurred" });
    }
};

module.exports = handleError;