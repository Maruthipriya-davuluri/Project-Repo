# Car Rental Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) car rental booking system with JWT authentication, role-based access control, and a modern UI.

## 🚗 Features

### Core Features
- **User Authentication**: Secure registration, login, and logout using JWT tokens
- **Role-based Access Control**: Admin and user roles with different permissions
- **Car Listings**: Browse available cars with search and filtering capabilities
- **Booking System**: Users can select dates, see price estimates, and confirm bookings
- **Admin Dashboard**: Comprehensive management of cars, bookings, and users
- **Booking History**: Users can view their past and upcoming bookings
- **Responsive Design**: Mobile-friendly interface

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all forms
- **Error Handling**: Comprehensive error handling and user feedback
- **RESTful API**: Well-structured API endpoints
- **MongoDB Integration**: Efficient data storage with Mongoose ODM

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Modern CSS** - Styling with gradients and animations

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd car-rental-system
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:
```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_rental_db
JWT_SECRET=your_super_secure_jwt_secret_change_in_production
NODE_ENV=development
```

### 4. Database Setup

**Option A: Local MongoDB**
- Make sure MongoDB is running on your local machine
- The application will automatically create the database and collections

**Option B: MongoDB Atlas**
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string and update `MONGODB_URI` in `.env`

### 5. Create Admin User

You can create an admin user in two ways:

**Option A: Register normally and manually update the database**
1. Register a new user through the application
2. Use MongoDB shell or a GUI tool to update the user's role to 'admin'

**Option B: Use the admin creation endpoint**
After starting the server, make a POST request to `/api/users/admin` with admin credentials.

### 6. Start the Application

**Development Mode (Recommended):**
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000) concurrently.

**Or start them separately:**

Start the backend:
```bash
npm run server
```

Start the frontend (in a new terminal):
```bash
npm run client
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: Check the `/api` endpoints

## 📁 Project Structure

```
car-rental-system/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server setup
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main App component
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔐 Authentication

### User Registration
- Users must provide: name, email, password, phone, address, date of birth, license number
- Password requirements: minimum 6 characters, at least one uppercase, lowercase, and number
- Age restriction: Users must be 18+ years old

### User Roles
- **User**: Can browse cars, make bookings, view booking history
- **Admin**: Full access to manage cars, bookings, and users

### JWT Token Management
- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Secure logout with token removal

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Cars
- `GET /api/cars` - Get all cars (with filtering)
- `GET /api/cars/:id` - Get car by ID
- `GET /api/cars/:id/availability` - Check car availability
- `POST /api/cars` - Create car (Admin only)
- `PUT /api/cars/:id` - Update car (Admin only)
- `DELETE /api/cars/:id` - Delete car (Admin only)

### Bookings
- `GET /api/bookings` - Get bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Frontend Features

### Navigation
- Responsive navbar with mobile menu
- Role-based menu items
- User dropdown with profile and logout options

### Authentication Pages
- Modern login and registration forms
- Real-time validation
- Error handling and user feedback

### Home Page
- Hero section with call-to-action buttons
- Feature showcase
- Responsive design with animations

### Car Browsing
- Search and filter functionality
- Car type, price range, and feature filters
- Pagination support

### Booking System
- Date selection with availability checking
- Price calculation
- Booking confirmation process

### Admin Dashboard
- Statistics and analytics
- Car inventory management
- Booking management
- User management

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build frontend for production
npm run build
```

### Database Models

**User Model:**
- Authentication fields (email, password)
- Personal information (name, phone, address, DOB)
- License information
- Role-based access

**Car Model:**
- Vehicle details (make, model, year, type)
- Rental information (price, features, location)
- Availability status
- Images and descriptions

**Booking Model:**
- User and car references
- Date range and pricing
- Status tracking
- Location details

## 🚧 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Car image upload functionality
- [ ] Advanced search and filtering
- [ ] Reviews and ratings system
- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced admin analytics

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for MongoDB Atlas

**JWT Token Issues:**
- Clear browser localStorage
- Check JWT_SECRET in environment variables
- Verify token expiration settings

**CORS Errors:**
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

**Frontend Build Issues:**
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors (if any)
- Verify API endpoint URLs

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🚗💨**