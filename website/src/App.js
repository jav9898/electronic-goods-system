import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlassmorphismAuthPage from './components/GlassmorphismAuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// Main Dashboard Component (protected)
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName || 'Admin'}!</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>User Management</h3>
            <p>Manage admin users and permissions</p>
          </div>
          <div className="dashboard-card">
            <h3>Product Management</h3>
            <p>Add, edit, and manage products</p>
          </div>
          <div className="dashboard-card">
            <h3>Category Management</h3>
            <p>Organize product categories</p>
          </div>
          <div className="dashboard-card">
            <h3>Reports</h3>
            <p>View analytics and reports</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="App-header">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated() ? (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ) : (
        <GlassmorphismAuthPage />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
