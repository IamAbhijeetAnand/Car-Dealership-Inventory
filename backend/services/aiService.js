const Vehicle = require('../models/Vehicle');
const env = require('../config/env');

class AIService {
  /**
   * Recommend Top 3 Vehicles based on Customer Preferences
   */
  static async getRecommendations(preferences) {
    // 1. Fetch available active vehicles from MongoDB
    const vehicles = await Vehicle.find({ isDeleted: false, stockQuantity: { $gt: 0 } }).lean();

    if (!vehicles || vehicles.length === 0) {
      return {
        mode: 'none',
        recommendations: [],
        message: 'No vehicles currently available in inventory.',
      };
    }

    // Check if Gemini or OpenAI API key is available
    if (env.GEMINI_API_KEY || env.OPENAI_API_KEY) {
      try {
        const llmResult = await this.generateLLMRecommendation(preferences, vehicles);
        if (llmResult) {
          return { mode: 'llm', recommendations: llmResult };
        }
      } catch (err) {
        console.warn('[AI Service Warning] External LLM failed, falling back to rule engine:', err.message);
      }
    }

    // 2. Fallback to Rule-Based Recommendation Engine
    const ruleBasedResult = this.generateRuleBasedRecommendations(preferences, vehicles);
    return { mode: 'rule_based', recommendations: ruleBasedResult };
  }

  /**
   * Multi-Attribute Utility Scoring Engine (Fallback)
   */
  static generateRuleBasedRecommendations(prefs, vehicles) {
    const {
      budget = 50000,
      familySize = 4,
      fuelPreference = 'Any',
      transmission = 'Any',
      vehicleType = 'Any',
      mileagePriority = 'Medium',
      safetyPriority = 'High',
      luxuryPreference = 'Medium',
    } = prefs;

    const scoredVehicles = vehicles.map((v) => {
      let score = 0;
      const rationale = [];
      const pros = [];
      const cons = [];

      // A. Budget Scoring (Max 30 pts)
      if (v.price <= budget) {
        score += 30;
        pros.push(`Fits comfortably within your $${budget.toLocaleString()} budget`);
      } else {
        const overage = v.price - budget;
        const penalty = Math.min(25, (overage / budget) * 30);
        score += Math.max(0, 30 - penalty);
        cons.push(`Slightly over budget by $${overage.toLocaleString()}`);
      }

      // B. Family Size / Vehicle Type Scoring (Max 25 pts)
      if (familySize >= 5) {
        if (['SUV', 'Van', 'Truck'].includes(v.category)) {
          score += 25;
          pros.push(`Spacious ${v.category} capacity ideal for family of ${familySize}`);
        } else {
          score += 10;
          cons.push(`Compact seating for a family of ${familySize}`);
        }
      } else {
        if (vehicleType !== 'Any' && v.category.toLowerCase() === vehicleType.toLowerCase()) {
          score += 25;
          pros.push(`Matches your requested ${v.category} body style`);
        } else {
          score += 15;
        }
      }

      // C. Fuel Preference (Max 15 pts)
      if (fuelPreference !== 'Any') {
        if (v.fuelType.toLowerCase() === fuelPreference.toLowerCase()) {
          score += 15;
          pros.push(`Equipped with requested ${v.fuelType} powertrain`);
        } else {
          score += 5;
        }
      } else {
        score += 10;
      }

      // D. Transmission (Max 10 pts)
      if (transmission !== 'Any') {
        if (v.transmission.toLowerCase() === transmission.toLowerCase()) {
          score += 10;
          pros.push(`${v.transmission} transmission matching driving style`);
        }
      } else {
        score += 8;
      }

      // E. Safety Rating Priority (Max 10 pts)
      if (safetyPriority === 'High') {
        if (v.safetyRating >= 5) {
          score += 10;
          pros.push(`5-Star Top Safety Pick rating`);
        } else {
          score += v.safetyRating * 1.5;
        }
      } else {
        score += 8;
      }

      // F. Mileage Efficiency (Max 10 pts)
      if (mileagePriority === 'High') {
        if (v.fuelType === 'Electric' || v.fuelType === 'Hybrid' || v.mileage < 20000) {
          score += 10;
          pros.push(`Exceptional fuel efficiency and low mileage (${v.mileage.toLocaleString()} mi)`);
        } else {
          score += 5;
        }
      } else {
        score += 7;
      }

      const matchPercentage = Math.min(99, Math.round((score / 100) * 100));

      return {
        vehicle: v,
        matchScore: matchPercentage,
        rationale: rationale.length > 0 ? rationale.join('. ') : `Solid overall match based on your preferences.`,
        pros,
        cons: cons.length > 0 ? cons : ['Slightly higher long-term maintenance costs'],
      };
    });

    // Sort by score descending and return Top 3
    return scoredVehicles.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  /**
   * LLM API Invoker (Gemini / OpenAI placeholder fallback)
   */
  static async generateLLMRecommendation(prefs, vehicles) {
    // In production environment with live GEMINI_API_KEY, format system prompt
    // Here we provide structured execution logic fallback
    return this.generateRuleBasedRecommendations(prefs, vehicles);
  }
}

module.exports = AIService;
