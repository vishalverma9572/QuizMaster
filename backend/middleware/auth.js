const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

module.exports = catchAsync(async (req, res, next) => {
  const token = req.header("x-auth-token");

  console.log(token);
  if (!token) return next(new AppError("No token, authorization denied", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.user;
  console.log("success..", req.user);
  next();
});
