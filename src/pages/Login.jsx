import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = input;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data && response.data.status) {
        localStorage.setItem("token", response.data.token);
        
        // Redirect to admin page if user is admin
        if (response.data.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        
        setInput({ email: "", password: "" });
      } else {
        setError(response.data.msg || "Login failed");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "Invalid credentials");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-success p-4 animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">SA</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500">Sign in to continue your journey</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={inputHandler}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={inputHandler}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all"
                required
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
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Smart Aptitude?</span>
              </div>
            </div>
          </div>

          <p className="text-center mt-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link to="/" className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
