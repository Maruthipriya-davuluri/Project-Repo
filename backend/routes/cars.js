const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateCar } = require('../middleware/validation');
const {
  getAllCars,
  getCarById,
  checkCarAvailability,
  createCar,
  updateCar,
  deleteCar,
  getCarTypes,
  getCarStatistics
} = require('../controllers/carController');

// @route   GET /api/cars
// @desc    Get all cars with filtering and pagination
// @access  Public
router.get('/', getAllCars);

// @route   GET /api/cars/types
// @desc    Get all car types for filtering
// @access  Public
router.get('/types', getCarTypes);

// @route   GET /api/cars/statistics
// @desc    Get car statistics (admin only)
// @access  Private (Admin)
router.get('/statistics', authenticateToken, requireAdmin, getCarStatistics);

// @route   GET /api/cars/:id
// @desc    Get single car by ID
// @access  Public
router.get('/:id', getCarById);

// @route   GET /api/cars/:id/availability
// @desc    Check car availability for specific dates
// @access  Public
router.get('/:id/availability', checkCarAvailability);

// @route   POST /api/cars
// @desc    Create new car (admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, validateCar, createCar);

// @route   PUT /api/cars/:id
// @desc    Update car (admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, validateCar, updateCar);

// @route   DELETE /api/cars/:id
// @desc    Delete car (admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteCar);

module.exports = router;