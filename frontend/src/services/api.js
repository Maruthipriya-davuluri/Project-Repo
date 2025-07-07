import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Token management functions
const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  }
};

const removeToken = () => {
  localStorage.removeItem('token');
  delete API.defaults.headers.common['Authorization'];
};

// Set up axios interceptors
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
};

// Cars API
export const carsAPI = {
  getAllCars: (params) => API.get('/cars', { params }),
  getCarById: (id) => API.get(`/cars/${id}`),
  getCarTypes: () => API.get('/cars/types'),
  checkAvailability: (id, params) => API.get(`/cars/${id}/availability`, { params }),
  createCar: (carData) => API.post('/cars', carData),
  updateCar: (id, carData) => API.put(`/cars/${id}`, carData),
  deleteCar: (id) => API.delete(`/cars/${id}`),
  getCarStatistics: () => API.get('/cars/statistics'),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params) => API.get('/bookings', { params }),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  createBooking: (bookingData) => API.post('/bookings', bookingData),
  updateBookingStatus: (id, statusData) => API.put(`/bookings/${id}/status`, statusData),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
  getBookingHistory: (params) => API.get('/bookings/history', { params }),
  getBookingStatistics: () => API.get('/bookings/statistics'),
};

// Users API
export const usersAPI = {
  getAllUsers: (params) => API.get('/users', { params }),
  getUserById: (id) => API.get(`/users/${id}`),
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/users/${id}`),
  createAdmin: (userData) => API.post('/users/admin', userData),
  getUserStatistics: () => API.get('/users/statistics'),
};

// Utility functions
export const apiUtils = {
  setToken,
  getToken,
  removeToken,
  handleError: (error) => {
    if (error.response) {
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return 'An unexpected error occurred';
    }
  },
};

export default API;