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
    model: 'Accord Touring',
    year: 2024,
    price: 38900,
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
    model: 'RAV4 Prime XSE',
    year: 2024,
    price: 45200,
    stockQuantity: 3,
    category: 'SUV',
    fuelType: 'Plug-in Hybrid',
    transmission: 'Automatic',
    mileage: 450,
    color: 'Supersonic Red',
    safetyRating: 5,
    features: ['AWD', 'Panoramic Moonroof', 'JBL Audio System', 'Power Liftgate'],
    imageUrls: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    vin: '5YJ3E1EA7KF234567',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2024,
    price: 47990,
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
    price: 68500,
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
    vin: '1FTFW1ED4MFC45678',
    make: 'Ford',
    model: 'F-150 Lightning Flash',
    year: 2024,
    price: 73495,
    stockQuantity: 1,
    category: 'Truck',
    fuelType: 'Electric',
    transmission: 'Automatic',
    mileage: 800,
    color: 'Antimatter Blue',
    safetyRating: 4,
    features: ['Pro Power Onboard', 'Tow Technology Package', 'BlueCruise 1.2', 'Extended Range Battery'],
    imageUrls: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000',
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Vehicle.deleteMany();
    await PurchaseHistory.deleteMany();
    console.log('[Seed] Cleared existing data...');

    // Create Admin and Customer Users
    const admin = await User.create({
      name: 'Dealership Admin',
      email: 'admin@dealership.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true,
    });

    const customer = await User.create({
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
    console.log(`[Seed] Inserted ${createdVehicles.length} vehicles into inventory.`);

    process.exit();
  } catch (error) {
    console.error('[Seed Error] Failed:', error);
    process.exit(1);
  }
};

seedDB();
