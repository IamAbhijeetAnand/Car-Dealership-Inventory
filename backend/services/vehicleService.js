const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/apiError');

class VehicleService {
  /**
   * Create new vehicle entry (Admin only)
   */
  static async createVehicle(vehicleData) {
    const existingVehicle = await Vehicle.findOne({ vin: vehicleData.vin });
    if (existingVehicle) {
      throw new ApiError(400, 'A vehicle with this VIN already exists');
    }

    return await Vehicle.create(vehicleData);
  }

  /**
   * Search and filter vehicles with pagination
   */
  static async getVehicles(queryParams) {
    const {
      search,
      make,
      model,
      category,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
    } = queryParams;

    const query = { isDeleted: false };

    // Text or regex keyword search
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { vin: { $regex: search, $options: 'i' } },
      ];
    }

    if (make) query.make = { $regex: make, $options: 'i' };
    if (model) query.model = { $regex: model, $options: 'i' };
    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;

    // Numerical range queries
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Vehicle.countDocuments(query),
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get single vehicle by ID
   */
  static async getVehicleById(id) {
    const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false });
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }
    return vehicle;
  }

  /**
   * Update vehicle specs (Admin only)
   */
  static async updateVehicle(id, updateData) {
    const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false });
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    Object.assign(vehicle, updateData);
    await vehicle.save(); // Triggers status update pre-save hook
    return vehicle;
  }

  /**
   * Soft-delete vehicle (Admin only)
   */
  static async deleteVehicle(id) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    vehicle.isDeleted = true;
    await vehicle.save();
    return { message: 'Vehicle deleted successfully' };
  }
}

module.exports = VehicleService;
