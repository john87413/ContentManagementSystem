
const { AppError } = require('../errors/AppError');

const handleError = (error, req, res, next) => {
    const operation = error.operation || '未知操作';

    // Mongoose unique 錯誤
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return res.status(400).json({
            status: 'error',
            errorCode: 'DUPLICATE_ERROR',
            message: `'${value}'已存在，不得重複`,
            operation
        });
    }
    // Mongoose 驗證錯誤
    else if (error.name === 'ValidationError') {
        // 處理驗證錯誤
        const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
        return res.status(400).json({
            status: 'error',
            errorCode: 'VALIDATION_ERROR',
            message: errorMessages,
            operation
        });
    }
    else if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            errorCode: error.errorCode,
            message: error.message,
            operation
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            errorCode: 'UNKNOWN_ERROR',
            message: `${operation}發生錯誤`
        });
    }
};

module.exports = handleError;