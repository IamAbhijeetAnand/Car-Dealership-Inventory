const express = require('express');
const router = express.Router();

const VehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createVehicleValidator,
  updateVehicleValidator,
} = require('../validators/vehicleValidator');

// Public endpoints
router.get('/', VehicleController.getVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Protected Admin-only endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  createVehicleValidator,
  validate,
  VehicleController.createVehicle
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateVehicleValidator,
  validate,
  VehicleController.updateVehicle
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  VehicleController.deleteVehicle
);

module.exports = router;
