import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const API = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token if available
API.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      const userInfo = JSON.parse(saved);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
  } catch (err) {
    console.error('Failed to parse userInfo from localStorage:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle expired/invalid JWT token gracefully (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid session state if token expired or failed
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('userInfo');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
