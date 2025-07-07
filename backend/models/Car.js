const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Car year is required'],
    min: [1990, 'Year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  type: {
    type: String,
    required: [true, 'Car type is required'],
    enum: ['Economy', 'Compact', 'Mid-size', 'Full-size', 'SUV', 'Luxury', 'Sports']
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['Manual', 'Automatic']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [2, 'Car must have at least 2 seats'],
    max: [8, 'Car cannot have more than 8 seats']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    enum: ['Air Conditioning', 'GPS', 'Bluetooth', 'USB Charging', 'Backup Camera', 'Sunroof', 'Heated Seats', 'WiFi']
  }],
  images: [{
    type: String,
    required: true
  }],
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    uppercase: true
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Car location is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Index for searching
carSchema.index({ make: 1, model: 1, type: 1, pricePerDay: 1 });

module.exports = mongoose.model('Car', carSchema);