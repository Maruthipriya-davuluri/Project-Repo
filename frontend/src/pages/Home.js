import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to CarRental
          </h1>
          <p className="hero-subtitle">
            Find the perfect car for your next adventure
          </p>
          {isAuthenticated ? (
            <div className="hero-actions">
              <h2>Hello, {user?.name}! 👋</h2>
              <div className="action-buttons">
                <Link to="/cars" className="cta-button primary">
                  Browse Cars
                </Link>
                <Link to="/bookings" className="cta-button secondary">
                  My Bookings
                </Link>
              </div>
            </div>
          ) : (
            <div className="hero-actions">
              <div className="action-buttons">
                <Link to="/register" className="cta-button primary">
                  Get Started
                </Link>
                <Link to="/cars" className="cta-button secondary">
                  Browse Cars
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose CarRental?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Wide Selection</h3>
              <p>Choose from economy to luxury vehicles that suit your needs and budget.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive rates with no hidden fees. What you see is what you pay.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Booking</h3>
              <p>Book your car in minutes with our simple and intuitive booking system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Fully Insured</h3>
              <p>All our vehicles come with comprehensive insurance for your peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Hit the Road?</h2>
          <p>Start your journey with us today</p>
          <Link to="/cars" className="cta-button primary large">
            Browse Available Cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;