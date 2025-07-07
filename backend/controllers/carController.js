const { validationResult } = require('express-validator');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Get all cars with filtering and pagination
const getAllCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.pricePerDay = {};
      if (req.query.minPrice) {
        filter.pricePerDay.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.pricePerDay.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    if (req.query.transmission) {
      filter.transmission = req.query.transmission;
    }
    
    if (req.query.fuelType) {
      filter.fuelType = req.query.fuelType;
    }
    
    if (req.query.seats) {
      filter.seats = parseInt(req.query.seats);
    }
    
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    
    if (req.query.available !== undefined) {
      filter.isAvailable = req.query.available === 'true';
    }

    // Search by make or model
    if (req.query.search) {
      filter.$or = [
        { make: { $regex: req.query.search, $options: 'i' } },
        { model: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOption[sortField] = sortOrder;
    } else {
      sortOption = { createdAt: -1 }; // Default sort by newest
    }

    const cars = await Car.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalCars = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalCars / limit);

    res.json({
      cars,
      pagination: {
        currentPage: page,
        totalPages,
        totalCars,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car || !car.isActive) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ car });
  } catch (error) {
    console.error('Get car error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid car ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check car availability for specific dates
const checkCarAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const car = await Car.findById(id);
    if (!car || !car.isActive) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: id,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    const isAvailable = conflictingBookings.length === 0 && car.isAvailable;

    res.json({ 
      available: isAvailable,
      conflictingBookings: conflictingBookings.length,
      car: {
        id: car._id,
        make: car.make,
        model: car.model,
        pricePerDay: car.pricePerDay
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new car (Admin only)
const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if car with same license plate already exists
    const existingCar = await Car.findOne({ licensePlate: req.body.licensePlate.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this license plate already exists' });
    }

    const car = new Car({
      ...req.body,
      licensePlate: req.body.licensePlate.toUpperCase()
    });

    await car.save();

    res.status(201).json({
      message: 'Car created successfully',
      car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update car (Admin only)
const updateCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    
    // Check if license plate is being changed and if it conflicts
    if (req.body.licensePlate) {
      const existingCar = await Car.findOne({ 
        licensePlate: req.body.licensePlate.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCar) {
        return res.status(400).json({ message: 'Car with this license plate already exists' });
      }
      req.body.licensePlate = req.body.licensePlate.toUpperCase();
    }

    const car = await Car.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({
      message: 'Car updated successfully',
      car
    });
  } catch (error) {
    console.error('Update car error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid car ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete car (Admin only) - Soft delete
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if car has active bookings
    const activeBookings = await Booking.find({
      car: id,
      status: { $in: ['confirmed', 'active'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete car with active bookings. Please complete or cancel all bookings first.' 
      });
    }

    const car = await Car.findByIdAndUpdate(
      id,
      { isActive: false, isAvailable: false },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid car ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get car types for filters
const getCarTypes = async (req, res) => {
  try {
    const types = await Car.distinct('type', { isActive: true });
    res.json({ types });
  } catch (error) {
    console.error('Get car types error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get car statistics (Admin only)
const getCarStatistics = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments({ isActive: true });
    const availableCars = await Car.countDocuments({ isActive: true, isAvailable: true });
    const rentedCars = await Car.countDocuments({ isActive: true, isAvailable: false });
    
    const carsByType = await Car.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const averagePrice = await Car.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgPrice: { $avg: '$pricePerDay' } } }
    ]);

    res.json({
      totalCars,
      availableCars,
      rentedCars,
      carsByType,
      averagePrice: averagePrice[0]?.avgPrice || 0
    });
  } catch (error) {
    console.error('Get car statistics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  checkCarAvailability,
  createCar,
  updateCar,
  deleteCar,
  getCarTypes,
  getCarStatistics
};