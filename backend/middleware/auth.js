const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return next(new AppError('No token, authorization denied', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return next(new AppError('Token is invalid, login again', 401));
  }
};
