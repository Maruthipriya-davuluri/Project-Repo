import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🚗 CarRental
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActiveLink('/')}`} onClick={closeMenu}>
            Home
          </Link>
          
          <Link to="/cars" className={`nav-link ${isActiveLink('/cars')}`} onClick={closeMenu}>
            Browse Cars
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/bookings" className={`nav-link ${isActiveLink('/bookings')}`} onClick={closeMenu}>
                My Bookings
              </Link>

              {isAdmin() && (
                <div className="nav-dropdown">
                  <span className="nav-link dropdown-toggle">Admin</span>
                  <div className="dropdown-menu">
                    <Link to="/admin/dashboard" className="dropdown-link" onClick={closeMenu}>
                      Dashboard
                    </Link>
                    <Link to="/admin/cars" className="dropdown-link" onClick={closeMenu}>
                      Manage Cars
                    </Link>
                    <Link to="/admin/bookings" className="dropdown-link" onClick={closeMenu}>
                      Manage Bookings
                    </Link>
                    <Link to="/admin/users" className="dropdown-link" onClick={closeMenu}>
                      Manage Users
                    </Link>
                  </div>
                </div>
              )}

              <div className="nav-dropdown">
                <span className="nav-link dropdown-toggle">👤 {user?.name}</span>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-link" onClick={closeMenu}>
                    Profile
                  </Link>
                  <Link to="/booking-history" className="dropdown-link" onClick={closeMenu}>
                    Booking History
                  </Link>
                  <button className="dropdown-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActiveLink('/login')}`} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className={`nav-link ${isActiveLink('/register')}`} onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;