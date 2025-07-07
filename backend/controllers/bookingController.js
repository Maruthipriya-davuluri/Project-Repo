const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { car, startDate, endDate, pickupLocation, dropoffLocation, specialRequests } = req.body;
    const userId = req.user._id;

    // Check if car exists and is available
    const carDetails = await Car.findById(car);
    if (!carDetails || !carDetails.isActive || !carDetails.isAvailable) {
      return res.status(400).json({ message: 'Car is not available for booking' });
    }

    // Check for date conflicts
    const conflictingBookings = await Booking.find({
      car,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ message: 'Car is already booked for these dates' });
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      car,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pricePerDay: carDetails.pricePerDay,
      pickupLocation,
      dropoffLocation,
      specialRequests
    });

    await booking.save();

    // Update car availability
    await Car.findByIdAndUpdate(car, { isAvailable: false });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('car', 'make model year type images licensePlate')
      .populate('user', 'name email phone');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all bookings (Admin) or user's bookings
const getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    
    // If not admin, only show user's own bookings
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      filter.startDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const bookings = await Booking.find(filter)
      .populate('car', 'make model year type images licensePlate location')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let filter = { _id: id };
    
    // If not admin, only allow access to own bookings
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const booking = await Booking.findOne(filter)
      .populate('car', 'make model year type images licensePlate location features')
      .populate('user', 'name email phone address licenseNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(id).populate('car');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const oldStatus = booking.status;

    // Update booking
    booking.status = status;
    if (notes) {
      booking.notes = notes;
    }
    await booking.save();

    // Update car availability based on status change
    if (status === 'cancelled' || status === 'completed') {
      // Make car available if booking is cancelled or completed
      await Car.findByIdAndUpdate(booking.car._id, { isAvailable: true });
    } else if (status === 'confirmed' && oldStatus === 'pending') {
      // Keep car unavailable when confirming
      await Car.findByIdAndUpdate(booking.car._id, { isAvailable: false });
    }

    const updatedBooking = await Booking.findById(id)
      .populate('car', 'make model year type images licensePlate')
      .populate('user', 'name email phone');

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel booking (User can cancel their own booking)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    let filter = { _id: id };
    
    // Users can only cancel their own bookings
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const booking = await Booking.findOne(filter).populate('car');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    // Check if booking start date is more than 24 hours away
    const now = new Date();
    const timeDiff = booking.startDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24 && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 24 hours before start date' 
      });
    }

    // Cancel booking
    booking.status = 'cancelled';
    await booking.save();

    // Make car available
    await Car.findByIdAndUpdate(booking.car._id, { isAvailable: true });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get booking statistics (Admin only)
const getBookingStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        } 
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const popularCars = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'active', 'completed'] } } },
      { $group: { _id: '$car', bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      { $unwind: '$carDetails' },
      {
        $project: {
          bookings: 1,
          make: '$carDetails.make',
          model: '$carDetails.model',
          year: '$carDetails.year'
        }
      }
    ]);

    res.json({
      totalBookings,
      statusBreakdown: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        active: activeBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
      popularCars
    });
  } catch (error) {
    console.error('Get booking statistics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's booking history
const getUserBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ user: userId })
      .populate('car', 'make model year type images licensePlate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalBookings / limit);

    // Group bookings by status for summary
    const bookingSummary = await Booking.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      summary: bookingSummary
    });
  } catch (error) {
    console.error('Get user booking history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStatistics,
  getUserBookingHistory
};