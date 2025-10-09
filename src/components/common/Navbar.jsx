import React, { useState } from "react";

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="w-full bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.name || "User"}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">Ready to ace your next test?</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-100 rounded-xl p-2 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2">
                <span>👤</span>
                <span className="text-sm">My Profile</span>
              </button>
              
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2">
                <span>⚙️</span>
                <span className="text-sm">Settings</span>
              </button>
              
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2">
                <span>📊</span>
                <span className="text-sm">My Progress</span>
              </button>
              
              {user?.isAdmin && (
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 transition flex items-center gap-2 font-semibold"
                >
                  <span>⚙️</span>
                  <span className="text-sm">Admin Dashboard</span>
                </button>
              )}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition flex items-center gap-2 font-semibold"
                >
                  <span>🚪</span>
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
