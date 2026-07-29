const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * PurchaseHistory Schema
 * Stores immutable financial and audit transactions when a customer purchases a vehicle.
 */
const purchaseHistorySchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Purchase must belong to a user'],
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Purchase must reference a vehicle'],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Purchase quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Completed', 'Pending', 'Failed', 'Refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Completed',
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for Query Optimization
 * Fast lookups for customer dashboard history and admin sales analytics.
 */
purchaseHistorySchema.index({ user: 1, purchasedAt: -1 });
purchaseHistorySchema.index({ vehicle: 1, purchasedAt: -1 });

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

module.exports = PurchaseHistory;
