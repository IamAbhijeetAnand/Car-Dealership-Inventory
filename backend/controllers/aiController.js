const AIService = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');

class AIController {
  /**
   * Get AI Vehicle Recommendations
   * POST /api/v1/ai/recommend
   */
  static async getRecommendations(req, res, next) {
    try {
      const recommendations = await AIService.getRecommendations(req.body);
      return ApiResponse.success(res, 'AI recommendations generated successfully', recommendations);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController;
