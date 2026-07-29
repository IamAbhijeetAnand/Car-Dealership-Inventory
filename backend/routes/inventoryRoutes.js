const express = require('express');
const router = express.Router();

const InventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { purchaseValidator, restockValidator } = require('../validators/vehicleValidator');

// Protected Customer endpoints
router.post('/purchase', protect, purchaseValidator, validate, InventoryController.purchaseVehicle);
router.get('/my-history', protect, InventoryController.getMyPurchaseHistory);

// Protected Admin endpoints
router.post(
  '/restock',
  protect,
  authorize('admin'),
  restockValidator,
  validate,
  InventoryController.restockVehicle
);

router.get(
  '/all-transactions',
  protect,
  authorize('admin'),
  InventoryController.getAllTransactions
);

module.exports = router;
