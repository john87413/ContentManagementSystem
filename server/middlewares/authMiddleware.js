const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');

const requirePermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('未提供認證令牌', 401, 'UNAUTHORIZED'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 檢查是否有所需權限
      const hasPermission = requiredPermissions.every(permission =>
        decoded.permissions.includes(permission)
      );

      if (!hasPermission) {
        return next(new AppError('權限不足', 403, 'FORBIDDEN'));
      }

      // 將用戶信息附加到 request 中
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('認證令牌已過期', 401, 'TOKEN_EXPIRED'));
      }
      return next(new AppError('無效的認證令牌', 401, 'INVALID_TOKEN'));
    }
  };
};

module.exports = {
  requirePermissions
};