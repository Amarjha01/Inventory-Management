import { validationResult } from "express-validator";

import ApiError from "../utils/ApiError.js";

import { MESSAGE } from "../constants/responseMessages.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,

        MESSAGE.VALIDATION_FAILED,

        errors.array(),
      ),
    );
  }

  next();
};

export default validate;
