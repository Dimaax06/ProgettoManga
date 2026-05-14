import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dimangax_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Network error (backend down, etc.)
    if (!err.response) {
      err.message = err.code === 'ECONNABORTED'
        ? 'Server timeout — please try again.'
        : 'Cannot connect to the server. Make sure the backend is running.';
      return Promise.reject(err);
    }
    // Auto-logout on token errors
    if (err.response.status === 401 && err.config?.url !== '/auth/login') {
      const errMsg = err.response.data?.error || '';
      if (errMsg.includes('expired') || errMsg.includes('Invalid')) {
        localStorage.removeItem('dimangax_token');
        localStorage.removeItem('dimangax_user');
        if (!['/login', '/register'].includes(window.location.pathname)) {
          setTimeout(() => { window.location.href = '/login'; }, 500);
        }
      }
    }
    return Promise.reject(err);
  }
);

// Helper to extract clean error messages
export const errMsg = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.error || err?.message || fallback;

export default api;
