const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * Harvester middleware for express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new ApiError(400, 'Validation Error', extractedErrors);
  }
  next();
};

module.exports = validate;
