const mongoose = require('mongoose');

/**
 * Vehicle Schema
 * Represents cars in the dealership inventory with full specs and stock tracking.
 */
const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: [true, 'Vehicle Identification Number (VIN) is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-HJ-NPR-Z0-9]{17}$/,
        'Please provide a valid 17-character VIN (excluding I, O, Q)',
      ],
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required (e.g., Toyota, BMW)'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required (e.g., Camry, X5)'],
      trim: true,
      index: true,
    },
    year: {
      type: Number,
      required: [true, 'Model year is required'],
      min: [1900, 'Year cannot be earlier than 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 1,
    },
    category: {
      type: String,
      required: [true, 'Vehicle category is required'],
      enum: {
        values: [
          'Sedan',
          'SUV',
          'Truck',
          'Coupe',
          'Convertible',
          'Hatchback',
          'Van',
          'Electric',
          'Hybrid',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: {
        values: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
        message: '{VALUE} is not a valid fuel type',
      },
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: {
        values: ['Automatic', 'Manual', 'CVT'],
        message: '{VALUE} is not a valid transmission type',
      },
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
    },
    color: {
      type: String,
      trim: true,
      default: 'Unspecified',
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Sold Out', 'Discontinued'],
      default: 'Available',
    },
    imageUrls: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      ],
    },
    features: {
      type: [String],
      default: [],
    },
    safetyRating: {
      type: Number,
      min: [1, 'Safety rating must be at least 1 star'],
      max: [5, 'Safety rating cannot exceed 5 stars'],
      default: 5,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Soft-delete flag hidden from routine queries
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Pre-save Middleware
 * Automatically syncs vehicle status based on stockQuantity before persisting.
 */
vehicleSchema.pre('save', function (next) {
  if (this.stockQuantity === 0) {
    this.status = 'Sold Out';
  } else if (this.stockQuantity <= 2) {
    this.status = 'Low Stock';
  } else if (this.status !== 'Discontinued') {
    this.status = 'Available';
  }
  next();
});

/**
 * Compound Database Indexes
 * Optimizes complex search queries across multiple filters (Make, Model, Category, Price).
 */
vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ category: 1, status: 1, price: 1 });
vehicleSchema.index({ make: 'text', model: 'text', category: 'text' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
