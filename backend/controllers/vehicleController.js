const VehicleService = require('../services/vehicleService');
const ApiResponse = require('../utils/apiResponse');

class VehicleController {
  /**
   * Create Vehicle
   * POST /api/v1/vehicles
   */
  static async createVehicle(req, res, next) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      return ApiResponse.created(res, 'Vehicle added to inventory successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Vehicles with filtering, search & pagination
   * GET /api/v1/vehicles
   */
  static async getVehicles(req, res, next) {
    try {
      const result = await VehicleService.getVehicles(req.query);
      return ApiResponse.success(res, 'Vehicles retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Vehicle by ID
   * GET /api/v1/vehicles/:id
   */
  static async getVehicleById(req, res, next) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      return ApiResponse.success(res, 'Vehicle details retrieved successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Vehicle
   * PUT /api/v1/vehicles/:id
   */
  static async updateVehicle(req, res, next) {
    try {
      const vehicle = await VehicleService.updateVehicle(req.params.id, req.body);
      return ApiResponse.success(res, 'Vehicle updated successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Vehicle
   * DELETE /api/v1/vehicles/:id
   */
  static async deleteVehicle(req, res, next) {
    try {
      const result = await VehicleService.deleteVehicle(req.params.id);
      return ApiResponse.success(res, 'Vehicle deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;
