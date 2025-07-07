import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;