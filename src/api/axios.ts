import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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