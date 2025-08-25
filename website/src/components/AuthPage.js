import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect or show success
  if (isAuthenticated()) {
    return (
      <div className="auth-success">
        <h2>Welcome, Admin!</h2>
        <p>You are successfully logged in.</p>
      </div>
    );
  }

  const handleLoginSuccess = (data) => {
    console.log('Login successful:', data);
    if (onAuthSuccess) {
      onAuthSuccess(data);
    }
  };

  const handleRegisterSuccess = (data) => {
    console.log('Registration successful:', data);
    // Switch to login after successful registration
    setIsLogin(true);
    alert('Registration successful! Please log in with your credentials.');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
