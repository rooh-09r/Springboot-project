import axios from 'axios';

const BASE_URL = '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Do not attach token for authentication endpoints
    if (token && config.url && !config.url.includes('/api/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/api/auth/');
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
