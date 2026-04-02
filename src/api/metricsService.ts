import api from './axios';

export const getSystemMetrics = async () => {
  try {
    const response = await api.get('/system-metrics');
    return response.data;
  } catch (error) {
    console.error("Помилка отримання метрик:", error);
    throw error;
  }
};