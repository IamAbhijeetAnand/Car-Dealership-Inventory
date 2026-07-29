const express = require('express');
const router = express.Router();

const TestDriveController = require('../controllers/testDriveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  bookTestDriveValidator,
  updateTestDriveStatusValidator,
} = require('../validators/testDriveValidator');

// Protected Customer endpoints
router.post('/book', protect, bookTestDriveValidator, validate, TestDriveController.bookTestDrive);
router.get('/my-bookings', protect, TestDriveController.getMyBookings);

// Protected Admin endpoints
router.get('/all-bookings', protect, authorize('admin'), TestDriveController.getAllBookings);
router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  updateTestDriveStatusValidator,
  validate,
  TestDriveController.updateStatus
);

module.exports = router;
