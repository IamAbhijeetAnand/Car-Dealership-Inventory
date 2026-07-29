const TestDriveService = require('../services/testDriveService');
const ApiResponse = require('../utils/apiResponse');

class TestDriveController {
  /**
   * Book Test Drive
   * POST /api/v1/test-drive/book
   */
  static async bookTestDrive(req, res, next) {
    try {
      const booking = await TestDriveService.bookTestDrive(req.user.id, req.body);
      return ApiResponse.created(res, 'Test drive booked successfully!', booking);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Customer's Test Drive Bookings
   * GET /api/v1/test-drive/my-bookings
   */
  static async getMyBookings(req, res, next) {
    try {
      const bookings = await TestDriveService.getUserTestDrives(req.user.id);
      return ApiResponse.success(res, 'Test drive bookings retrieved', bookings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get All Dealership Test Drives
   * GET /api/v1/test-drive/all-bookings
   */
  static async getAllBookings(req, res, next) {
    try {
      const bookings = await TestDriveService.getAllTestDrives();
      return ApiResponse.success(res, 'All dealership test drive bookings retrieved', bookings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update Test Drive Status
   * PATCH /api/v1/test-drive/:id/status
   */
  static async updateStatus(req, res, next) {
    try {
      const booking = await TestDriveService.updateStatus(req.params.id, req.body.status);
      return ApiResponse.success(res, `Test drive booking status updated to ${req.body.status}`, booking);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TestDriveController;
