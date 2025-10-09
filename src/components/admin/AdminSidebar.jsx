import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ activeTab, setActiveTab, stats }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "results", label: "Results", icon: "📈" },
    { id: "questions", label: "Questions", icon: "📝" },
  ];

  return (
    <div className="w-64 min-h-screen h-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white flex flex-col shadow-2xl sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">⚙️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-indigo-300">Smart Aptitude</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg transform scale-105"
                  : "hover:bg-white/10 hover:translate-x-1"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 backdrop-blur-sm transition text-sm font-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
