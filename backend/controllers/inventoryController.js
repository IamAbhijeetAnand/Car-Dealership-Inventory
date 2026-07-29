const InventoryService = require('../services/inventoryService');
const ApiResponse = require('../utils/apiResponse');

class InventoryController {
  /**
   * Purchase Vehicle
   * POST /api/v1/inventory/purchase
   */
  static async purchaseVehicle(req, res, next) {
    try {
      const { vehicleId, quantity } = req.body;
      const purchase = await InventoryService.purchaseVehicle(
        req.user.id,
        vehicleId,
        quantity || 1
      );
      return ApiResponse.success(res, 'Vehicle purchase completed successfully', purchase, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restock Inventory (Admin only)
   * POST /api/v1/inventory/restock
   */
  static async restockVehicle(req, res, next) {
    try {
      const { vehicleId, quantity } = req.body;
      const vehicle = await InventoryService.restockVehicle(vehicleId, quantity);
      return ApiResponse.success(res, 'Inventory restocked successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Current Customer's Purchase History
   * GET /api/v1/inventory/history
   */
  static async getMyPurchaseHistory(req, res, next) {
    try {
      const history = await InventoryService.getUserPurchaseHistory(req.user.id);
      return ApiResponse.success(res, 'Purchase history fetched successfully', history);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get All Dealership Transactions (Admin only)
   * GET /api/v1/inventory/transactions
   */
  static async getAllTransactions(req, res, next) {
    try {
      const transactions = await InventoryService.getAllTransactions();
      return ApiResponse.success(res, 'All dealership transactions fetched successfully', transactions);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InventoryController;
