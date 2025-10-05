import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const TestHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchResults();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.DASHBOARD, {
        headers: { "x-auth-token": token },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      navigate("/login");
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.RESULTS, {
        headers: { "x-auth-token": token },
      });
      setResults(response.data.results || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching results:", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Test History</h1>
            <p className="text-gray-600">View all your completed tests and results</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No test history yet</h3>
              <p className="text-gray-600 mb-6">Take your first test to see results here!</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Take a Test
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{result.testName}</h3>
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
                      <p className="text-gray-500 text-sm mb-3">
                        {formatDate(result.completedAt)}
                      </p>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Score:</span>
                          <span className="font-bold text-gray-800">
                            {result.score}/{result.totalQuestions}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Percentage:</span>
                          <span className="font-bold text-indigo-600">
                            {result.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-bold text-gray-800">
                            {formatTime(result.timeTaken)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Score Circle */}
                      <div className="relative w-20 h-20">
                        <svg className="transform -rotate-90 w-20 h-20">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke={result.passed ? "#10b981" : "#f59e0b"}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(result.percentage / 100) * 226} 226`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-800">
                            {result.percentage}%
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/review/${result._id}`)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                      >
                        Review Answers
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestHistory;
