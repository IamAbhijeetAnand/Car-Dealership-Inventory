const TestDrive = require('../models/TestDrive');
const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/apiError');

class TestDriveService {
  /**
   * Customer books a test drive for a vehicle on a preferred date
   */
  static async bookTestDrive(userId, { vehicleId, preferredDate, preferredTimeSlot, contactPhone, notes }) {
    const vehicle = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found or unavailable for test drive');
    }

    // Check if user already booked a pending test drive for this exact vehicle & date
    const existing = await TestDrive.findOne({
      user: userId,
      vehicle: vehicleId,
      preferredDate,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existing) {
      throw new ApiError(400, 'You already have an active test drive booking for this vehicle on this date.');
    }

    const testDrive = await TestDrive.create({
      user: userId,
      vehicle: vehicleId,
      preferredDate,
      preferredTimeSlot,
      contactPhone,
      notes: notes || '',
    });

    return await TestDrive.findById(testDrive._id)
      .populate('vehicle', 'make model year category price imageUrls vin')
      .populate('user', 'name email');
  }

  /**
   * Get current customer's test drive bookings
   */
  static async getUserTestDrives(userId) {
    return await TestDrive.find({ user: userId })
      .populate('vehicle', 'make model year category price imageUrls vin status')
      .sort({ preferredDate: -1 })
      .lean();
  }

  /**
   * Admin: Get all dealership test drive requests
   */
  static async getAllTestDrives() {
    return await TestDrive.find()
      .populate('vehicle', 'make model year category price vin')
      .populate('user', 'name email')
      .sort({ preferredDate: -1 })
      .lean();
  }

  /**
   * Admin: Update status of a test drive booking
   */
  static async updateStatus(id, status) {
    const booking = await TestDrive.findById(id);
    if (!booking) {
      throw new ApiError(404, 'Test drive booking not found');
    }

    booking.status = status;
    await booking.save();

    return await TestDrive.findById(id)
      .populate('vehicle', 'make model year')
      .populate('user', 'name email');
  }
}

module.exports = TestDriveService;
