// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/api/users/signup`,
  LOGIN: `${API_BASE_URL}/api/users/login`,
  
  // User endpoints
  DASHBOARD: `${API_BASE_URL}/api/users/dashboard`,
  
  // Test endpoints
  TESTS: `${API_BASE_URL}/api/tests`,
  TEST_BY_ID: (id) => `${API_BASE_URL}/api/tests/${id}`,
  
  // Results endpoints
  RESULTS: `${API_BASE_URL}/api/results`,
  RESULT_BY_ID: (id) => `${API_BASE_URL}/api/results/${id}`,
  
  // Admin endpoints
  ADMIN: `${API_BASE_URL}/api/admin`,
};

export default API_BASE_URL;
