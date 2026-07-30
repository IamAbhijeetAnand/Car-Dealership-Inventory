const Vehicle = require('../models/Vehicle');
const env = require('../config/env');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    // Check if Gemini API key is available
    if (env.GEMINI_API_KEY) {
      try {
        const llmResult = await this.generateLLMRecommendation(preferences, vehicles);
        if (llmResult) {
          return { mode: 'gemini_ai', recommendations: llmResult };
        }
      } catch (err) {
        console.warn('[AI Service Warning] Gemini LLM failed, falling back to rule engine:', err.message);
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
        pros.push(`Fits comfortably within your ₹${budget.toLocaleString('en-IN')} budget`);
      } else {
        const overage = v.price - budget;
        const penalty = Math.min(25, (overage / budget) * 30);
        score += Math.max(0, 30 - penalty);
        cons.push(`Slightly over budget by ₹${overage.toLocaleString('en-IN')}`);
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
          pros.push(`Exceptional fuel efficiency and low mileage (${v.mileage.toLocaleString()} km)`);
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
   * Gemini AI-powered Vehicle Recommendation Engine
   */
  static async generateLLMRecommendation(prefs, vehicles) {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build a compact vehicle catalog for the prompt
    const vehicleCatalog = vehicles.map((v, i) => ({
      index: i,
      id: v._id,
      name: `${v.year} ${v.make} ${v.model}`,
      price: v.price,
      category: v.category,
      fuelType: v.fuelType,
      transmission: v.transmission,
      mileage: v.mileage,
      color: v.color,
      safetyRating: v.safetyRating,
      stockQuantity: v.stockQuantity,
      features: v.features,
    }));

    const systemPrompt = `You are an expert Indian car dealership AI matchmaker. Your job is to analyze the customer's preferences and recommend the TOP 3 best-matching vehicles from the available inventory.

AVAILABLE INVENTORY (JSON):
${JSON.stringify(vehicleCatalog, null, 2)}

CUSTOMER PREFERENCES:
- Budget: ₹${(prefs.budget || 4500000).toLocaleString('en-IN')}
- Family Size: ${prefs.familySize || 4} passengers
- Fuel Preference: ${prefs.fuelPreference || 'Any'}
- Transmission: ${prefs.transmission || 'Any'}
- Vehicle Type Preference: ${prefs.vehicleType || 'Any'}
- Mileage/Efficiency Priority: ${prefs.mileagePriority || 'Medium'}
- Safety Priority: ${prefs.safetyPriority || 'High'}

INSTRUCTIONS:
1. Analyze each vehicle against the customer preferences
2. Score each vehicle on a 0-99 scale (matchScore)
3. Select the top 3 matches
4. For each match provide: pros (array of 2-4 strengths), cons (array of 1-2 trade-offs), and a rationale (1-2 sentence explanation)
5. Use Indian Rupee (₹) formatting for prices
6. Be specific about why each vehicle matches or doesn't match

You MUST respond with ONLY valid JSON in this exact format, no markdown, no code blocks, just raw JSON:
[
  {
    "vehicleIndex": 0,
    "matchScore": 92,
    "rationale": "A brief 1-2 sentence explanation of why this is a great match.",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1"]
  }
]

Return exactly 3 items sorted by matchScore descending. Use vehicleIndex to reference the vehicle from the catalog above.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Parse the JSON response - strip markdown code blocks if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid LLM response format');
    }

    // Map the LLM output back to full vehicle objects
    const recommendations = parsed.slice(0, 3).map((item) => {
      const vehicleData = vehicles[item.vehicleIndex];
      if (!vehicleData) {
        throw new Error(`Invalid vehicleIndex ${item.vehicleIndex} from LLM`);
      }
      return {
        vehicle: vehicleData,
        matchScore: Math.min(99, Math.max(0, item.matchScore)),
        rationale: item.rationale || 'Strong match based on your preferences.',
        pros: item.pros || ['Great overall value'],
        cons: item.cons || ['No significant drawbacks'],
      };
    });

    return recommendations;
  }
}

module.exports = AIService;
