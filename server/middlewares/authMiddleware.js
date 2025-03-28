const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');

const requirePermissions = (requiredPermissions = [], options = { requireAll: true }) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('請先登錄系統', 401, 'UNAUTHORIZED'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 檢查用戶是否擁有指定的權限
      let hasPermission;

      if (requiredPermissions.length === 0) {
        hasPermission = true;
      } else {
        if (options.requireAll) {
          // 要求擁有所有指定的權限
          hasPermission = requiredPermissions.every(permission =>
            decoded.permissions.includes(permission)
          );
        } else {
          // 只要擁有其中一個權限即可
          hasPermission = requiredPermissions.some(permission =>
            decoded.permissions.includes(permission)
          );
        }
      }

      if (!hasPermission) {
        return next(new AppError('權限不足', 403, 'FORBIDDEN'));
      }

      // 將用戶信息附加到 request 中
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('請先登錄系統', 401, 'TOKEN_EXPIRED'));
      }
      return next(new AppError('請先登錄系統', 401, 'INVALID_TOKEN'));
    }
  };
};

module.exports = {
  requirePermissions
};