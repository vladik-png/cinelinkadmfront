import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    const employeeId = localStorage.getItem('employee_id');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (employeeId && !config.url?.startsWith('http')) {
      config.headers['X-Employee-ID'] = employeeId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequestUrl = error.config?.url || '';
    if (error.response?.status === 401) {

      if (originalRequestUrl.includes('/login')) {
        return Promise.reject(error);
      }
      console.warn("Session is invalid. Logging out...");
      localStorage.removeItem('admin_token');
      localStorage.removeItem('employee_id');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;