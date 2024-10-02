const AppError = require("../utils/appError");

const handleDuplicateField = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate Field value: ${value}`;
  return new AppError(message, 400);
};
const handleJwTError = () => {
  return new AppError("Invalid token. Please login again!", 401);
};
const handleJwtExpired = () => {
  return new AppError("Your Token has expired! Please log in again!", 401);
};

const handleCastErrorDB = (err) => {
  err.isOperational = true;
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const handleVAlidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data.${errors.join(". ")}`;

  return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //(A) this is for the API
    // original url means the whole url without the host
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // else {
  //   //(B) This is for the render
  //   return res.status(err.statusCode).render('error', {
  //     title: 'Something went wrong',
  //     msg: err.message,
  //     status: err.statusCode,
  //   });
  // }
};

const sendErrorProd = (err, req, res) => {
  //(A)This is for the API
  if (req.originalUrl.startsWith("/api")) {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log("ERROR =>");
    //Programming or other unknown error: don't want to leak details to the clients
    return res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });

    //(B) this is for the render page
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: err.status,
      msg: err.message,
      status: err.statusCode,
    });
  }
  console.log("ERROR =>");
  //Programming or other unknown error: don't want to leak details to the clients
  return res.status(500).json({
    title: "Something went wrong",
    status: err.statusCode,
    msg: "Please Try again Later",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (error.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) {
      error = handleDuplicateField(err);
    }
    if (error.name === "ValidationError") error = handleVAlidationError(err);

    if (error.name === "JsonWebTokenError") error = handleJwTError();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();
    sendErrorProd(error, req, res);
  }
};
