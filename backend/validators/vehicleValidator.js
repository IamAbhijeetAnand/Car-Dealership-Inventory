const { body, param, query } = require('express-validator');

const createVehicleValidator = [
  body('vin')
    .trim()
    .notEmpty()
    .withMessage('VIN is required')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('Must be a valid 17-character VIN'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('category')
    .isIn([
      'Sedan',
      'SUV',
      'Truck',
      'Coupe',
      'Convertible',
      'Hatchback',
      'Van',
      'Electric',
      'Hybrid',
    ])
    .withMessage('Invalid category'),
  body('fuelType')
    .isIn(['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .isIn(['Automatic', 'Manual', 'CVT'])
    .withMessage('Invalid transmission type'),
  body('mileage').isFloat({ min: 0 }).withMessage('Mileage cannot be negative'),
];

const updateVehicleValidator = [
  param('id').isMongoId().withMessage('Invalid Vehicle ID format'),
  body('vin')
    .optional()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('Must be a valid 17-character VIN'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
];

const purchaseValidator = [
  body('vehicleId').isMongoId().withMessage('Invalid Vehicle ID format'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
];

const restockValidator = [
  body('vehicleId').isMongoId().withMessage('Invalid Vehicle ID format'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Restock quantity must be at least 1'),
];

module.exports = {
  createVehicleValidator,
  updateVehicleValidator,
  purchaseValidator,
  restockValidator,
};
