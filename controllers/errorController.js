const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new AppError(message, 400);
  return error;
};
const handleJWTError = () => {
  const message = "Invalid token. Please log in again!";
  const error = new AppError(message, 401);
  return error;
};
const handleJWTExpiredError = () => {
  const message = "Your token has expired! Please log in again.";
  const error = new AppError(message, 401);
  return error;
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  const error = new AppError(message, 400);
  return error;
}
const handleValidationErrorDB = (err)=> {
  const errors = Object.values(err.errors).map(el=>el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  const error = new AppError(message, 400);
  return error;
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000 ) error = handleDuplicateFieldsDB(error);
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
