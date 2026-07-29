const Vehicle = require('../models/Vehicle');
const PurchaseHistory = require('../models/PurchaseHistory');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

class AnalyticsController {
  /**
   * Get Admin Executive Dashboard Analytics
   * GET /api/v1/analytics/dashboard
   */
  static async getDashboardMetrics(req, res, next) {
    try {
      const [
        totalVehicles,
        totalStock,
        totalCustomers,
        totalPurchases,
        lowStockVehicles,
        valuationResult,
        revenueResult,
      ] = await Promise.all([
        Vehicle.countDocuments({ isDeleted: false }),
        Vehicle.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: null, total: { $sum: '$stockQuantity' } } },
        ]),
        User.countDocuments({ role: 'customer' }),
        PurchaseHistory.countDocuments(),
        Vehicle.find({ isDeleted: false, stockQuantity: { $lte: 2 } }).select('make model stockQuantity price'),
        Vehicle.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: null, totalValuation: { $sum: { $multiply: ['$price', '$stockQuantity'] } } } },
        ]),
        PurchaseHistory.aggregate([
          { $match: { paymentStatus: 'Completed' } },
          { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]),
      ]);

      const analytics = {
        totalVehicleModels: totalVehicles,
        totalInventoryUnits: totalStock[0]?.total || 0,
        totalCustomers,
        totalSalesCount: totalPurchases,
        totalInventoryValuation: valuationResult[0]?.totalValuation || 0,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        lowStockAlerts: lowStockVehicles,
      };

      return ApiResponse.success(res, 'Analytics dashboard metrics retrieved', analytics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;
