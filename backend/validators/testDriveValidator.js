const { body, param } = require('express-validator');

const bookTestDriveValidator = [
  body('vehicleId').isMongoId().withMessage('Invalid Vehicle ID format'),
  body('preferredDate')
    .notEmpty()
    .withMessage('Preferred date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('preferredTimeSlot')
    .isIn([
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM',
    ])
    .withMessage('Invalid time slot selected'),
  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required'),
];

const updateTestDriveStatusValidator = [
  param('id').isMongoId().withMessage('Invalid Test Drive Booking ID'),
  body('status')
    .isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Invalid test drive status'),
];

module.exports = {
  bookTestDriveValidator,
  updateTestDriveStatusValidator,
};
