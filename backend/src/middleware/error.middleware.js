import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (error, req, res, next) => {
  // logger.error({
  //   method: req.method,

  //   url: req.originalUrl,

  //   message: error.message,

  //   stack: error.stack,
  // });

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,

      message: error.message,

      errors: error.errors,
    });
  }

  return res.status(500).json({
    success: false,

    message: "Internal Server Error",

    errors: [],
  });
};

export default errorMiddleware;
