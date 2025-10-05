import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔄 Fetching admin data...");
      
      const [statsRes, usersRes, resultsRes] = await Promise.all([
        axios.get(`${API_ENDPOINTS.ADMIN}/stats`, {
          headers: { "x-auth-token": token },
        }),
        axios.get(`${API_ENDPOINTS.ADMIN}/users`, {
          headers: { "x-auth-token": token },
        }),
        axios.get(`${API_ENDPOINTS.ADMIN}/results`, {
          headers: { "x-auth-token": token },
        }),
      ]);

      console.log("📊 Stats received:", statsRes.data.stats);
      console.log("👥 Users received:", usersRes.data.users);
      console.log("📋 Results received:", resultsRes.data.results);

      setStats(statsRes.data.stats || {});
      setUsers(usersRes.data.users || []);
      setResults(resultsRes.data.results || []);
      setLoading(false);
      
      console.log("✅ State updated - Users count:", usersRes.data.users?.length);
    } catch (err) {
      console.error("❌ Error fetching admin data:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Access denied. Admin only.");
        navigate("/dashboard");
      }
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their results?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_ENDPOINTS.ADMIN}/users/${userId}`, {
        headers: { "x-auth-token": token },
      });
      alert("User deleted successfully!");
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.msg || "Failed to delete user");
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_ENDPOINTS.ADMIN}/users/${userId}/admin`,
        {},
        { headers: { "x-auth-token": token } }
      );
      alert(response.data.msg);
      fetchAdminData();
    } catch (err) {
      console.error("Error toggling admin:", err);
      alert("Failed to update admin status");
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_ENDPOINTS.ADMIN}/results/${resultId}`, {
        headers: { "x-auth-token": token },
      });
      alert("Result deleted successfully!");
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting result:", err);
      alert("Failed to delete result");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-indigo-100">Manage users, tests, and view analytics</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Users</span>
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers || 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Tests</span>
              <span className="text-3xl">📝</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalTests || 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Submissions</span>
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalSubmissions || 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Avg Score</span>
              <span className="text-3xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.avgScore || 0}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {["overview", "users", "results"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 font-semibold border-b-2 transition ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Platform Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Users:</span>
                        <span className="font-bold">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Submissions:</span>
                        <span className="font-bold">{stats.totalSubmissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Score:</span>
                        <span className="font-bold">{stats.avgScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Available Tests</h3>
                    <div className="space-y-2 text-sm">
                      <div>📝 All Topics (20 questions)</div>
                      <div>🧠 Logical Reasoning (5 questions)</div>
                      <div>🔢 Quantitative Aptitude (5 questions)</div>
                      <div>📖 Verbal Ability (5 questions)</div>
                      <div>📊 Data Interpretation (5 questions)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tests</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avg Score</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.testsTaken || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.avgScore || 0}%</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.isAdmin
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {!user.isAdmin && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold text-xs transition"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Test Results</h2>
                  
                  {/* User Filter Dropdown */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700">Filter by User:</label>
                    <select
                      value={selectedUserId || ""}
                      onChange={(e) => {
                        const userId = e.target.value;
                        setSelectedUserId(userId || null);
                        const user = users.find(u => u._id === userId);
                        setSelectedUserName(user?.name || "");
                      }}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none min-w-[250px]"
                    >
                      <option value="">All Users</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    
                    {selectedUserId && (
                      <span className="text-sm text-gray-600">
                        Showing {results.filter((r) => r.userId?._id === selectedUserId).length} results
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {results
                    .filter((result) => !selectedUserId || result.userId?._id === selectedUserId)
                    .map((result) => (
                    <div
                      key={result._id}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{result.testName}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                result.passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {result.passed ? "✓ Passed" : "✗ Failed"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Student: <span className="font-semibold">{result.userId?.name}</span> ({result.userId?.email})
                          </p>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-600">
                              Score: <span className="font-bold">{result.score}/{result.totalQuestions}</span>
                            </span>
                            <span className="text-gray-600">
                              Percentage: <span className="font-bold text-indigo-600">{result.percentage}%</span>
                            </span>
                            <span className="text-gray-600">
                              Date: {new Date(result.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteResult(result._id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedUserId && results.filter((r) => r.userId?._id === selectedUserId).length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600">No results found for this user</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
