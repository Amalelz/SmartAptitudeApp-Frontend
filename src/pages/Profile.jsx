import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.DASHBOARD, {
        headers: { "x-auth-token": token },
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">0</div>
                <div className="text-sm text-gray-500">Tests Taken</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-500">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 text-sm">
              💡 <strong>Tip:</strong> Complete more tests to see your progress and statistics here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
