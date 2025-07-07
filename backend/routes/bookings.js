const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStatistics,
  getUserBookingHistory
} = require('../controllers/bookingController');

// @route   GET /api/bookings/statistics
// @desc    Get booking statistics (admin only)
// @access  Private (Admin)
router.get('/statistics', authenticateToken, requireAdmin, getBookingStatistics);

// @route   GET /api/bookings/history
// @desc    Get user's booking history
// @access  Private
router.get('/history', authenticateToken, getUserBookingHistory);

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user's bookings
// @access  Private
router.get('/', authenticateToken, getBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private (Own booking or Admin)
router.get('/:id', authenticateToken, getBookingById);

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', authenticateToken, validateBooking, createBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticateToken, requireAdmin, updateBookingStatus);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private (Own booking or Admin)
router.put('/:id/cancel', authenticateToken, cancelBooking);

module.exports = router;