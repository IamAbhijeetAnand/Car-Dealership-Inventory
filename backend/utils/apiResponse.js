/**
 * Standardized API Response Helper
 */
class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
    });
  }
}

module.exports = ApiResponse;
