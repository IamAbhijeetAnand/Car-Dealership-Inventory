const mongoose = require('mongoose');

const testDriveSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Test drive booking must belong to a user'],
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Test drive booking must reference a vehicle'],
      index: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date for test drive is required'],
    },
    preferredTimeSlot: {
      type: String,
      required: [true, 'Preferred time slot is required'],
      enum: [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM',
      ],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

testDriveSchema.index({ user: 1, preferredDate: -1 });

module.exports = mongoose.model('TestDrive', testDriveSchema);
