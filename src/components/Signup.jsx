import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [input, changeInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: ""
  });

  const [error, setError] = useState('');
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
      setError('');
      const newUser = { name, email, password, phone };

      const response = await axios.post("http://localhost:4000/api/users/signup", newUser);

      console.log(response.data.msg); // e.g., "User created successfully"
      alert("Registration successful!");
      navigate('/login');

      // Clear form
      changeInput({ name: "", email: "", password: "", confirmpassword: "", phone: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "An error occurred");
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={inputHandler}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={inputHandler}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={inputHandler}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              value={input.confirmpassword}
              onChange={inputHandler}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={inputHandler}
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Sign Up
          </button>

          {error && <small className="text-red-600">{error}</small>}
        </form>
<p className="text-center mt-3 text-gray-600">
  Already have an account?{' '}
  <Link to="/login" className="text-indigo-600 hover:underline">
    Login
  </Link>
</p>


      </div>
    </div>
  );
};

export default Signup;
