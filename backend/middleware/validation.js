const { body } = require('express-validator');

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please enter a valid date of birth')
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }
      return true;
    }),
  
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ min: 5, max: 20 })
    .withMessage('License number must be between 5 and 20 characters')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters')
];

// Car validation
const validateCar = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Car make is required'),
  
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Car model is required'),
  
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1990 and next year'),
  
  body('type')
    .isIn(['Economy', 'Compact', 'Mid-size', 'Full-size', 'SUV', 'Luxury', 'Sports'])
    .withMessage('Please select a valid car type'),
  
  body('transmission')
    .isIn(['Manual', 'Automatic'])
    .withMessage('Please select a valid transmission type'),
  
  body('fuelType')
    .isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid'])
    .withMessage('Please select a valid fuel type'),
  
  body('seats')
    .isInt({ min: 2, max: 8 })
    .withMessage('Number of seats must be between 2 and 8'),
  
  body('pricePerDay')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  
  body('licensePlate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required'),
  
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Car location is required')
];

// Booking validation
const validateBooking = [
  body('car')
    .isMongoId()
    .withMessage('Please select a valid car'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please enter a valid start date')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error('Start date must be today or in the future');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please enter a valid end date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required'),
  
  body('dropoffLocation')
    .trim()
    .notEmpty()
    .withMessage('Dropoff location is required')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateCar,
  validateBooking
};