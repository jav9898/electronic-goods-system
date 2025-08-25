import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return fallback || (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You must be logged in as an admin to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
