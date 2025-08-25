"use client";
import { useState } from "react";
import { User, Lock, Mail, UserPlus, ArrowRight } from 'lucide-react';

/**
 * A glassmorphism-style registration form component with animated labels.
 */
export function RegisterForm({ onSubmit, onSignIn, loading = false, error = null }: {
  onSubmit: (data: any) => void;
  onSignIn: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-96 max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white">Create Account</h2>
        <p className="text-sm text-gray-300">Join our admin team</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Username Input with Animated Label */}
          <div className="relative">
            <input
              type="text"
              id="floating_username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_username"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <User className="mr-2" size={16} />
              Username
            </label>
            {errors.username && <p className="mt-2 text-xs text-red-400">{errors.username}</p>}
          </div>

          {/* First Name Input with Animated Label */}
          <div className="relative">
            <input
              type="text"
              id="floating_firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_firstName"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <User className="mr-2" size={16} />
              First Name
            </label>
            {errors.firstName && <p className="mt-2 text-xs text-red-400">{errors.firstName}</p>}
          </div>

          {/* Last Name Input with Animated Label */}
          <div className="relative">
            <input
              type="text"
              id="floating_lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_lastName"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <User className="mr-2" size={16} />
              Last Name
            </label>
            {errors.lastName && <p className="mt-2 text-xs text-red-400">{errors.lastName}</p>}
          </div>

          {/* Email Input with Animated Label */}
          <div className="relative">
            <input
              type="email"
              id="floating_email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_email"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <Mail className="mr-2" size={16} />
              Email Address
            </label>
            {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password Input with Animated Label */}
          <div className="relative">
            <input
              type="password"
              id="floating_password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_password"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <Lock className="mr-2" size={16} />
              Password
            </label>
            {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Confirm Password Input with Animated Label */}
          <div className="relative">
            <input
              type="password"
              id="floating_confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_confirmPassword"
              className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center"
            >
              <Lock className="mr-2" size={16} />
              Confirm Password
            </label>
            {errors.confirmPassword && <p className="mt-2 text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center py-3 px-4 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

       <p className="text-center text-xs text-gray-400">
        Already have an account? <button onClick={onSignIn} className="font-semibold text-blue-400 hover:text-blue-300 transition">Sign In</button>
      </p>
    </div>
  );
}
