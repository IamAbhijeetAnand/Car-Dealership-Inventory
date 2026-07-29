const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

class AuthService {
  /**
   * Register a new customer user (Admin registration disabled)
   */
  static async registerUser({ name, email, password, role }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'An account with this email address already exists');
    }

    // Security Guard: Prevent public admin registration
    if (role === 'admin') {
      throw new ApiError(403, 'Admin registration is forbidden. Admin accounts are managed directly by database administrator.');
    }

    // Force role to 'customer'
    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
    });

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Authenticate user & issue JWT (Allows both Admin and Customer logins)
   */
  static async loginUser({ email, password }) {
    // Find user with password selected explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get user profile details
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

module.exports = AuthService;
