const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStatistics,
  createAdmin
} = require('../controllers/userController');

// @route   GET /api/users/statistics
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get('/statistics', authenticateToken, requireAdmin, getUserStatistics);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID (admin only)
// @access  Private (Admin)
router.get('/:id', authenticateToken, requireAdmin, getUserById);

// @route   POST /api/users/admin
// @desc    Create admin user (admin only)
// @access  Private (Admin)
router.post('/admin', authenticateToken, requireAdmin, validateRegistration, createAdmin);

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;