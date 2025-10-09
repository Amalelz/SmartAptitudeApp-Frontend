import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

// Components
import Sidebar from "../components/common/Sidebar";
import Navbar from '../components/common/Navbar';
import TestCard from "../components/TestCard";
import { PageHeader, StatCard, LoadingSpinner, Button } from "../components/UI";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user info
    axios
      .get(API_ENDPOINTS.DASHBOARD, {
        headers: { "x-auth-token": token },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
      });

    // Fetch available tests
    axios
      .get(API_ENDPOINTS.TESTS)
      .then((res) => setTests(res.data.tests || []))
      .catch((err) => {
        console.error("Error fetching tests:", err);
        setTests([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1 p-8">
          {/* Welcome Header */}
          <PageHeader 
            title={`Welcome back, ${user?.name || 'Student'}! 🎯`}
            subtitle="Ready to test your skills? Choose from our comprehensive aptitude tests below."
          >
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/history')}
              >
                📊 View History
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/profile')}
              >
                👤 Profile
              </Button>
            </div>
          </PageHeader>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Tests Available"
              value={tests.length}
              subtitle="Ready to take"
              icon="📚"
              color="primary"
            />
            <StatCard
              title="Your Progress"
              value="85%"
              subtitle="Overall performance"
              icon="📈"
              color="success"
            />
            <StatCard
              title="Skill Level"
              value="Advanced"
              subtitle="Current ranking"
              icon="🏆"
              color="purple"
            />
          </div>

          {/* Available Tests Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
                <p className="text-gray-600">Choose a test to begin your assessment</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Tests
              </Button>
            </div>

            {tests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Tests Available</h3>
                <p className="text-gray-600 mb-6">Tests will appear here when they become available.</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Check Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="secondary" 
                className="p-6 h-auto flex-col"
                onClick={() => navigate('/history')}
              >
                <span className="text-2xl mb-2">📊</span>
                <span className="font-semibold">Test History</span>
                <span className="text-sm text-gray-500">View past results</span>
              </Button>
              <Button 
                variant="secondary" 
                className="p-6 h-auto flex-col"
                onClick={() => navigate('/profile')}
              >
                <span className="text-2xl mb-2">⚙️</span>
                <span className="font-semibold">Settings</span>
                <span className="text-sm text-gray-500">Manage your profile</span>
              </Button>
              <Button 
                variant="secondary" 
                className="p-6 h-auto flex-col"
                onClick={() => navigate('/help')}
              >
                <span className="text-2xl mb-2">❓</span>
                <span className="font-semibold">Help & Support</span>
                <span className="text-sm text-gray-500">Get assistance</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
