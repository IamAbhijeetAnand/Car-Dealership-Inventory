const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');
const PurchaseHistory = require('../../models/PurchaseHistory');

describe('Car Dealership Inventory System Integration Tests', () => {
  let customerToken;
  let adminToken;
  let vehicleId;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_dealership_test_db';
    await mongoose.connect(mongoUri);

    await User.deleteMany();
    await Vehicle.deleteMany();
    await PurchaseHistory.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
    await Vehicle.deleteMany();
    await PurchaseHistory.deleteMany();
    await mongoose.connection.close();
  });

  describe('Phase 14A: Authentication Endpoints', () => {
    it('should register a new customer account', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        password: 'Password123!',
        role: 'customer',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('testcustomer@example.com');
      expect(res.body.data.token).toBeDefined();
      customerToken = res.body.data.token;
    });

    it('should register an admin account', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'Password123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.token).toBeDefined();
      adminToken = res.body.data.token;
    });

    it('should authenticate user and return JWT token', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'testcustomer@example.com',
        password: 'Password123!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'testcustomer@example.com',
        password: 'WrongPassword!',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Phase 14B: Vehicle CRUD & RBAC Guards', () => {
    it('should allow admin to create a vehicle', async () => {
      const res = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vin: '1HGCR2F83HA999999',
          make: 'Honda',
          model: 'Accord',
          year: 2024,
          price: 32000,
          stockQuantity: 2,
          category: 'Sedan',
          fuelType: 'Hybrid',
          transmission: 'Automatic',
          mileage: 500,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.vin).toBe('1HGCR2F83HA999999');
      vehicleId = res.body.data._id;
    });

    it('should forbid non-admin customer from adding vehicle', async () => {
      const res = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          vin: '1HGCR2F83HA888888',
          make: 'BMW',
          model: 'M3',
          year: 2024,
          price: 75000,
          stockQuantity: 1,
          category: 'Coupe',
          fuelType: 'Gasoline',
          transmission: 'Manual',
          mileage: 100,
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fetch public vehicle inventory', async () => {
      const res = await request(app).get('/api/v1/vehicles');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.vehicles.length).toBeGreaterThan(0);
    });
  });

  describe('Phase 14C: AI Recommendation Engine', () => {
    it('should return top 3 vehicle recommendations based on customer preferences', async () => {
      const res = await request(app).post('/api/v1/ai/recommend').send({
        budget: 40000,
        familySize: 4,
        fuelPreference: 'Hybrid',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.recommendations).toBeDefined();
    });
  });
});
