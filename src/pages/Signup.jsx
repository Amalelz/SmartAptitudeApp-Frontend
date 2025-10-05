import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Signup = () => {
  const [input, changeInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: ""
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    changeInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmpassword, phone } = input;

    if (password !== confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newUser = { name, email, password, phone };

      const response = await axios.post(API_ENDPOINTS.SIGNUP, newUser);

      console.log(response.data.msg);
      navigate('/login');

      changeInput({ name: "", email: "", password: "", confirmpassword: "", phone: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "An error occurred");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4 animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">SA</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Join Smart Aptitude
            </h2>
            <p className="text-gray-500">Create your account to get started</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={input.name}
                onChange={inputHandler}
                placeholder="John Doe"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={inputHandler}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={inputHandler}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                value={input.confirmpassword}
                onChange={inputHandler}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
              <input
                type="text"
                name="phone"
                value={input.phone}
                onChange={inputHandler}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-scale-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
