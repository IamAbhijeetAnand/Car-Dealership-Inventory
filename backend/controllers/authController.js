const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  /**
   * Register User
   * POST /api/v1/auth/register
   */
  static async register(req, res, next) {
    try {
      const result = await AuthService.registerUser(req.body);
      return ApiResponse.created(res, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login User
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const result = await AuthService.loginUser(req.body);
      return ApiResponse.success(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Current User Profile
   * GET /api/v1/auth/me
   */
  static async getMe(req, res, next) {
    try {
      const profile = await AuthService.getUserProfile(req.user.id);
      return ApiResponse.success(res, 'User profile fetched successfully', profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
