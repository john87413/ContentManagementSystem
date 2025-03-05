class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'UNKNOWN_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ResourceNotFoundError extends AppError {
    constructor(resource) {
        super(`找不到您請求的${resource}資料`, 404, 'RESOURCE_NOT_FOUND');
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

class FileOperationError extends AppError {
    constructor(message, operation) {
        super(message, 500, `FILE_${operation.toUpperCase()}_ERROR`);
    }
}

class ServiceError extends AppError {
    constructor(service, operation, details) {
        super(
            `${service} service ${operation} failed`, 
            500, 
            `${service.toUpperCase()}_${operation.toUpperCase()}_ERROR`
        );
        this.details = details;
    }
}

module.exports = {
    AppError,
    ResourceNotFoundError,
    ValidationError,
    FileOperationError,
    ServiceError
};