const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const PurchaseHistory = require('../models/PurchaseHistory');
const ApiError = require('../utils/apiError');

class InventoryService {
  /**
   * Execute atomic customer purchase transaction
   */
  static async purchaseVehicle(userId, vehicleId, quantity = 1) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch vehicle with session lock
      const vehicle = await Vehicle.findOne({ _id: vehicleId, isDeleted: false }).session(session);
      if (!vehicle) {
        throw new ApiError(404, 'Vehicle not found or unavailable');
      }

      // 2. Check stock quantity
      if (vehicle.stockQuantity < quantity) {
        throw new ApiError(
          400,
          `Insufficient stock. Available: ${vehicle.stockQuantity}, Requested: ${quantity}`
        );
      }

      // 3. Atomically decrement stock
      vehicle.stockQuantity -= quantity;
      await vehicle.save({ session }); // Automatically syncs status (Sold Out / Low Stock)

      // 4. Calculate pricing
      const unitPrice = vehicle.price;
      const totalPrice = unitPrice * quantity;

      // 5. Create immutable purchase record
      const [purchaseRecord] = await PurchaseHistory.create(
        [
          {
            user: userId,
            vehicle: vehicleId,
            quantity,
            unitPrice,
            totalPrice,
            paymentStatus: 'Completed',
          },
        ],
        { session }
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Return populated purchase payload
      return await PurchaseHistory.findById(purchaseRecord._id)
        .populate('vehicle', 'make model year price category imageUrls')
        .populate('user', 'name email');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Restock vehicle inventory quantity (Admin only)
   */
  static async restockVehicle(vehicleId, quantity) {
    const vehicle = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    vehicle.stockQuantity += Number(quantity);
    await vehicle.save(); // Triggers status hook (Low Stock -> Available)

    return vehicle;
  }

  /**
   * Get user's purchase history
   */
  static async getUserPurchaseHistory(userId) {
    return await PurchaseHistory.find({ user: userId })
      .populate('vehicle', 'make model year price category imageUrls vin')
      .sort({ purchasedAt: -1 })
      .lean();
  }

  /**
   * Get all dealership transactions (Admin only)
   */
  static async getAllTransactions() {
    return await PurchaseHistory.find()
      .populate('vehicle', 'make model year price vin category')
      .populate('user', 'name email role')
      .sort({ purchasedAt: -1 })
      .lean();
  }
}

module.exports = InventoryService;
