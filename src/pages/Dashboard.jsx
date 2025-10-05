import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

// Components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TestCard from "../components/TestCard";

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
