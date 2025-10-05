import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/history", label: "Test History", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart Aptitude</h1>
            <p className="text-xs text-indigo-300">Test Your Skills</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg transform scale-105"
                  : "hover:bg-white/10 hover:translate-x-1"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-700">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-xs text-indigo-200 mb-1">Need Help?</p>
          <button className="text-sm font-semibold text-white hover:text-cyan-300 transition">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
