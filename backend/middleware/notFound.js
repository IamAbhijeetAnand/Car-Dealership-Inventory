const ApiError = require('../utils/apiError');

/**
 * 404 Route Not Found Middleware
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

module.exports = notFound;
