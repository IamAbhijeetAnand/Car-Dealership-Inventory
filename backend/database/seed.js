const mongoose = require('mongoose');
const dotenv = require('dotenv');
const env = require('../config/env');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const PurchaseHistory = require('../models/PurchaseHistory');

dotenv.config();

const sampleVehicles = [
  {
    vin: '1HGCR2F83HA123456',
    make: 'Honda',
    model: 'Accord Hybrid',
    year: 2024,
    price: 3890000, // ₹38,90,000
    stockQuantity: 4,
    category: 'Sedan',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    mileage: 1500,
    color: 'Platinum White',
    safetyRating: 5,
    features: ['Leather Seats', 'Head-Up Display', 'Wireless Apple CarPlay', 'Adaptive Cruise Control'],
    imageUrls: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    vin: '4T1B11HK5RU789101',
    make: 'Toyota',
    model: 'Fortuner Legender',
    year: 2024,
    price: 4520000, // ₹45,20,000
    stockQuantity: 3,
    category: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    mileage: 450,
    color: 'Supersonic White',
    safetyRating: 5,
    features: ['4x4 AWD', 'JBL Audio System', 'Power Tailgate', 'Ventilated Seats'],
    imageUrls: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    vin: '5YJ3E1EA7KF234567',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2024,
    price: 4799000, // ₹47,99,000
    stockQuantity: 5,
    category: 'Electric',
    fuelType: 'Electric',
    transmission: 'Automatic',
    mileage: 120,
    color: 'Stealth Grey',
    safetyRating: 5,
    features: ['Autopilot', 'All-Glass Roof', 'Heated Seats', '15-inch Touchscreen'],
    imageUrls: [
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    vin: 'WBA53AY00RFP34567',
    make: 'BMW',
    model: 'X5 xDrive40i',
    year: 2024,
    price: 9850000, // ₹98,50,000
    stockQuantity: 2,
    category: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 3200,
    color: 'Phytonic Blue',
    safetyRating: 5,
    features: ['M Sport Package', 'Harman Kardon Sound', 'Vernasca Leather', 'Gesture Control'],
    imageUrls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    vin: 'MAH777XUV888AX700',
    make: 'Mahindra',
    model: 'XUV700 AX7 Luxury',
    year: 2024,
    price: 2699000, // ₹26,99,000
    stockQuantity: 6,
    category: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    mileage: 800,
    color: 'Midnight Black',
    safetyRating: 5,
    features: ['ADAS Level 2', 'Sony 3D Audio', 'Panoramic Skyroof', 'Dual 10.25 Displays'],
    imageUrls: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000',
    ],
  },
];

const seedDB = async () => {
  try {
    const connectDB = require('../config/db');
    await connectDB();
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Vehicle.deleteMany();
    await PurchaseHistory.deleteMany();
    console.log('[Seed] Cleared existing data...');

    // Create Admin and Customer Users
    await User.create({
      name: 'Dealership Admin',
      email: 'admin@dealership.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true,
    });

    await User.create({
      name: 'John Customer',
      email: 'customer@gmail.com',
      password: 'CustomerPassword123!',
      role: 'customer',
      isVerified: true,
    });

    console.log('[Seed] Created Demo Accounts:');
    console.log('  Admin: admin@dealership.com / AdminPassword123!');
    console.log('  Customer: customer@gmail.com / CustomerPassword123!');

    // Create Sample Inventory
    const createdVehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`[Seed] Inserted ${createdVehicles.length} Indian market vehicles into inventory.`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed:', error);
    process.exit(1);
  }
};

seedDB();
