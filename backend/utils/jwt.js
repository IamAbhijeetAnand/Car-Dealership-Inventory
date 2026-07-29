const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Sign JWT Token with User Payload
 * @param {Object} payload - User ID and Role
 * @returns {string} Signed JWT Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT Token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
