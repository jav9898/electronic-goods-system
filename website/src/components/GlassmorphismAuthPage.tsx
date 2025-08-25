import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SmokeyBackground, LoginForm } from './ui/login-form';
import { RegisterForm } from './ui/register-form';

const GlassmorphismAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleLogin = async (formData: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await register(formData);
      setIsLogin(true); // Switch to login after successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleToSignUp = () => {
    setIsLogin(false);
    setError(null);
  };

  const toggleToLogin = () => {
    setIsLogin(true);
    setError(null);
  };

  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <SmokeyBackground className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        {isLogin ? (
          <LoginForm 
            onSubmit={handleLogin}
            onSignUp={toggleToSignUp}
            loading={loading}
            error={error}
          />
        ) : (
          <RegisterForm 
            onSubmit={handleRegister}
            onSignIn={toggleToLogin}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </main>
  );
};

export default GlassmorphismAuthPage;
