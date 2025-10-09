import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AdminSidebar = ({ activeTab, setActiveTab, stats }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 shadow-xl h-screen fixed left-0 top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center">
          <div className="bg-white rounded-lg p-2 mr-3">
            <span className="text-indigo-600 text-xl font-bold">SA</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Aptitude</h2>
            <p className="text-indigo-200 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`w-full text-left px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
            activeTab === "overview"
              ? "bg-white text-indigo-700 shadow-lg transform scale-105"
              : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
          }`}
        >
          <span className="text-lg mr-3">📊</span>
          <span>Dashboard Overview</span>
        </button>
        
        <button
          onClick={() => setActiveTab("users")}
          className={`w-full text-left px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
            activeTab === "users"
              ? "bg-white text-indigo-700 shadow-lg transform scale-105"
              : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
          }`}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">👥</span>
            <span>Users</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === "users" ? "bg-indigo-100 text-indigo-700" : "bg-indigo-600 text-white"
          }`}>
            {stats.totalUsers || 0}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab("results")}
          className={`w-full text-left px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
            activeTab === "results"
              ? "bg-white text-indigo-700 shadow-lg transform scale-105"
              : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
          }`}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">📋</span>
            <span>Test Results</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === "results" ? "bg-indigo-100 text-indigo-700" : "bg-indigo-600 text-white"
          }`}>
            {stats.totalResults || 0}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab("questions")}
          className={`w-full text-left px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
            activeTab === "questions"
              ? "bg-white text-indigo-700 shadow-lg transform scale-105"
              : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
          }`}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">📚</span>
            <span>Questions</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === "questions" ? "bg-indigo-100 text-indigo-700" : "bg-indigo-600 text-white"
          }`}>
            {stats.totalQuestions || 0}
          </span>
        </button>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <div className="text-indigo-200 text-xs text-center">
          <p>Smart Aptitude v2.0</p>
          <p>© 2024 Admin Panel</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [newQuestion, setNewQuestion] = useState({
    topic: "logical",
    difficulty: "easy",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [questionLoading, setQuestionLoading] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("all");

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === "questions") {
      fetchQuestions();
    }
  }, [activeTab, selectedTopic, selectedDifficulty]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const [statsRes, usersRes, resultsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN_STATS, {
          headers: { "x-auth-token": token },
        }),
        axios.get(API_ENDPOINTS.ADMIN_USERS, {
          headers: { "x-auth-token": token },
        }),
        axios.get(API_ENDPOINTS.ADMIN_RESULTS, {
          headers: { "x-auth-token": token },
        }),
      ]);

      setStats(statsRes.data.stats || {});
      setUsers(usersRes.data.users || []);
      setResults(resultsRes.data.results || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Access denied. Admin only.");
        navigate("/dashboard");
      }
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestionLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${API_ENDPOINTS.ADMIN_QUESTIONS}?topic=${selectedTopic}&difficulty=${selectedDifficulty}`,
        { headers: { "x-auth-token": token } }
      );
      
      if (response.data.status) {
        setQuestions(response.data.questions);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      setAddingQuestion(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(API_ENDPOINTS.ADMIN_QUESTIONS, newQuestion, {
        headers: { "x-auth-token": token },
      });
      
      if (response.data.status) {
        alert("Question added successfully!");
        setNewQuestion({
          topic: "logical",
          difficulty: "easy", 
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        });
        setShowAddQuestionModal(false);
        fetchQuestions();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add question");
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    const confirmMessage = `⚠️ DELETE USER CONFIRMATION ⚠️\n\nUser: ${user?.name}\nEmail: ${user?.email}\nTests Taken: ${user?.testsTaken || 0}\n\nThis will permanently delete:\n• User account\n• All test results\n• All user data\n\nThis action CANNOT be undone!\n\nAre you sure you want to proceed?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`, {
        headers: { "x-auth-token": token },
      });

      if (response.data.status) {
        // Remove user from local state
        setUsers(users.filter(user => user._id !== userId));
        alert(`✅ User "${user?.name}" has been successfully deleted along with all their test results.`);
        
        // Refresh admin data to update stats
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.msg || "Failed to delete user");
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this test result? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_ENDPOINTS.ADMIN_RESULTS}/${resultId}`, {
        headers: { "x-auth-token": token },
      });

      if (response.data.status) {
        // Remove result from local state
        setResults(results.filter(result => result._id !== resultId));
        alert("✅ Test result deleted successfully!");
        
        // Refresh admin data to update stats
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error deleting result:", err);
      alert(err.response?.data?.msg || "Failed to delete result");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const question = questions.find(q => q._id === questionId);
    const confirmMessage = `⚠️ DELETE QUESTION CONFIRMATION ⚠️\n\nTopic: ${question?.topic}\nDifficulty: ${question?.difficulty}\nQuestion: ${question?.question?.substring(0, 100)}${question?.question?.length > 100 ? '...' : ''}\n\nThis will permanently remove this question from:\n• Question bank\n• Future tests\n• Admin management\n\nThis action CANNOT be undone!\n\nAre you sure you want to proceed?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(API_ENDPOINTS.ADMIN_QUESTION_BY_ID(questionId), {
        headers: { "x-auth-token": token },
      });

      if (response.data.status) {
        // Remove question from local state
        setQuestions(questions.filter(q => q._id !== questionId));
        alert(`✅ Question "${question?.question?.substring(0, 50)}${question?.question?.length > 50 ? '...' : ''}" has been successfully deleted from the question bank.`);
        
        // Refresh admin data to update stats
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      alert(err.response?.data?.msg || "Failed to delete question");
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "overview" && "📊 Dashboard Overview"}
              {activeTab === "users" && "👥 User Management"}
              {activeTab === "results" && "📋 Test Results"}
              {activeTab === "questions" && "📚 Question Management"}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Smart Aptitude Admin! 🎉</h2>
                    <p className="text-indigo-100">Manage your platform with ease. Here's your current overview.</p>
                  </div>
                  <div className="text-6xl opacity-20">📊</div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
                      <p className="text-xs text-green-600 mt-1">↗ Active users</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Test Results</p>
                      <p className="text-3xl font-bold text-green-600">{stats.totalResults || 0}</p>
                      <p className="text-xs text-green-600 mt-1">↗ Submissions</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Questions</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.totalQuestions || 0}</p>
                      <p className="text-xs text-green-600 mt-1">↗ In database</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-2xl">📚</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("questions")}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-left transition-colors flex items-center"
                  >
                    <span className="mr-3 text-xl">➕</span>
                    <div>
                      <div className="font-medium">Add New Question</div>
                      <div className="text-sm opacity-75">Expand question bank</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-left transition-colors flex items-center"
                  >
                    <span className="mr-3 text-xl">👥</span>
                    <div>
                      <div className="font-medium">Manage Users</div>
                      <div className="text-sm opacity-75">View user accounts</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("results")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg text-left transition-colors flex items-center"
                  >
                    <span className="mr-3 text-xl">📊</span>
                    <div>
                      <div className="font-medium">View Results</div>
                      <div className="text-sm opacity-75">Analyze performance</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Question Management</h3>
                  <button
                    onClick={() => setShowAddQuestionModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    ➕ Add Question
                  </button>
                </div>
                
                <div className="flex space-x-4 mb-6">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Topics</option>
                    <option value="logical">Logical</option>
                    <option value="quantitative">Quantitative</option>
                    <option value="verbal">Verbal</option>
                    <option value="data">Data</option>
                  </select>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {questionLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading questions...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  question.topic === 'logical' ? 'bg-blue-100 text-blue-800' :
                                  question.topic === 'quantitative' ? 'bg-green-100 text-green-800' :
                                  question.topic === 'verbal' ? 'bg-purple-100 text-purple-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {question.topic}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteQuestion(question._id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                title="Delete Question"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className={`${
                                  option === question.correctAnswer ? 'font-medium text-green-600' : ''
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Users ({users.length})</h3>
                <div className="text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    👤 {users.filter(u => !u.isAdmin).length} Regular Users
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2">
                    👨‍💼 {users.filter(u => u.isAdmin).length} Admin Users
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.testsTaken || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!user.isAdmin ? (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                              title="Delete User"
                            >
                              🗑️ Delete
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">Admin User</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Results Tab - User Selection */}
          {activeTab === "results" && (
            <div>
              {/* Results Header with User Selection */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Test Results Management</h3>
                  <div className="flex space-x-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      📊 Total Results: {results.length}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      👥 Active Users: {new Set(results.map(r => r.userId?._id).filter(id => id)).size}
                    </span>
                  </div>
                </div>
                
                {/* User Selection Filter */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Select User:</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">🔍 All Users</option>
                    {(() => {
                      // Create a Map to deduplicate users by ID
                      const uniqueUsers = new Map();
                      results.forEach(result => {
                        const userId = result.userId?._id;
                        const userName = result.userId?.name;
                        const userEmail = result.userId?.email;
                        
                        if (userId && !uniqueUsers.has(userId)) {
                          uniqueUsers.set(userId, {
                            id: userId,
                            name: userName,
                            email: userEmail
                          });
                        }
                      });
                      
                      // Convert Map to array and sort
                      return Array.from(uniqueUsers.values())
                        .sort((a, b) => a.name?.localeCompare(b.name))
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            👤 {user.name} ({user.email})
                          </option>
                        ));
                    })()}
                  </select>
                  {selectedUserId !== "all" && (
                    <button
                      onClick={() => setSelectedUserId("all")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                    >
                      ✕ Clear Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Results Display */}
              <div>
                {(() => {
                  // Filter results by selected user
                  const filteredResults = selectedUserId === "all" 
                    ? results 
                    : results.filter(result => result.userId?._id === selectedUserId);

                  if (filteredResults.length === 0) {
                    return (
                      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {selectedUserId === "all" ? "No test results yet" : "No results for selected user"}
                        </h3>
                        <p className="text-gray-600">
                          {selectedUserId === "all" 
                            ? "Test results will appear here once users start taking tests."
                            : "This user hasn't taken any tests yet."
                          }
                        </p>
                      </div>
                    );
                  }

                  if (selectedUserId === "all") {
                    // Show all users grouped
                    const userResults = {};
                    filteredResults.forEach(result => {
                      const userId = result.userId?._id || 'unknown';
                      const userName = result.userId?.name || 'Unknown User';
                      const userEmail = result.userId?.email || 'No email';
                      
                      if (!userResults[userId]) {
                        userResults[userId] = {
                          name: userName,
                          email: userEmail,
                          results: [],
                          totalTests: 0,
                          avgScore: 0
                        };
                      }
                      userResults[userId].results.push(result);
                    });

                    // Calculate statistics for each user
                    Object.keys(userResults).forEach(userId => {
                      const user = userResults[userId];
                      user.totalTests = user.results.length;
                      user.avgScore = user.results.length > 0 
                        ? (user.results.reduce((sum, r) => sum + r.percentage, 0) / user.results.length).toFixed(1)
                        : 0;
                      
                      // Sort results by date (newest first)
                      user.results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    });

                    return (
                      <div className="space-y-6">
                        {Object.entries(userResults).map(([userId, user]) => (
                          <div key={userId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* User Header */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                  <div className="text-center">
                                    <div className="font-bold text-indigo-600">{user.totalTests}</div>
                                    <div className="text-gray-500">Tests</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* User Results Table - Same as before */}
                            <div className="p-6">
                              <div className="overflow-x-auto">
                                <table className="min-w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {user.results.map((result) => (
                                      <tr key={result._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.testName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{result.score}/{result.totalQuestions}</td>
                                        <td className="px-4 py-3 text-sm">
                                          <span className={`font-medium ${
                                            result.percentage >= 70 ? 'text-green-600' : 
                                            result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                          }`}>
                                            {result.percentage}%
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            result.percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                          }`}>
                                            {result.percentage >= 70 ? '✅ Passed' : '❌ Failed'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                          {new Date(result.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                          <button
                                            onClick={() => handleDeleteResult(result._id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                                          >
                                            🗑️ Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    // Show single user's results
                    const selectedUser = results.find(r => r.userId?._id === selectedUserId)?.userId;
                    const userResults = filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const avgScore = userResults.length > 0 
                      ? (userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length).toFixed(1)
                      : 0;

                    return (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Selected User Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {selectedUser?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{selectedUser?.name}</h4>
                                <p className="text-gray-600">{selectedUser?.email}</p>
                                <p className="text-sm text-gray-500 mt-1">📊 Showing {userResults.length} test results</p>
                              </div>
                            </div>
                            <div className="flex space-x-6 text-center">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{userResults.length}</div>
                                <div className="text-sm text-gray-500">Total Tests</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">
                                  {userResults.filter(r => r.percentage >= 70).length}
                                </div>
                                <div className="text-sm text-gray-500">Tests Passed</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Selected User Results Table */}
                        <div className="p-6">
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {userResults.map((result, index) => (
                                  <tr key={result._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                      <div className="flex items-center">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-2">
                                          #{index + 1}
                                        </span>
                                        {result.testName}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                      <span className="font-medium">{result.score}</span>
                                      <span className="text-gray-500">/{result.totalQuestions}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                      <div className="flex items-center">
                                        <div className={`w-12 h-2 rounded-full mr-2 ${
                                          result.percentage >= 70 ? 'bg-green-200' : 
                                          result.percentage >= 50 ? 'bg-yellow-200' : 'bg-red-200'
                                        }`}>
                                          <div 
                                            className={`h-2 rounded-full ${
                                              result.percentage >= 70 ? 'bg-green-500' : 
                                              result.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${result.percentage}%` }}
                                          ></div>
                                        </div>
                                        <span className={`font-bold ${
                                          result.percentage >= 70 ? 'text-green-600' : 
                                          result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                          {result.percentage}%
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        result.percentage >= 70 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {result.percentage >= 70 ? '✅ Passed' : '❌ Failed'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                      {new Date(result.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                      <button
                                        onClick={() => handleDeleteResult(result._id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs transition-colors"
                                        title="Delete Result"
                                      >
                                        🗑️ Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add New Question</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <select
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="logical">Logical Reasoning</option>
                  <option value="quantitative">Quantitative Aptitude</option>
                  <option value="verbal">Verbal Ability</option>
                  <option value="data">Data Interpretation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>

              {newQuestion.options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">Option {index + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOptions});
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select correct answer</option>
                  {newQuestion.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                disabled={addingQuestion}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {addingQuestion ? "Adding..." : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 
