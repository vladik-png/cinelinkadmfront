import axios from 'axios';


const AWS_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'http://localhost:8080';

export const getEmployeeProfile = async (id: string) => {
  try {
    const response = await axios.get(`${AWS_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Помилка завантаження профілю:", error);
    throw error;
  }
};

export const deactivateEmployee = async (id: number) => {
  try {
    const response = await axios.delete(`${AWS_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Помилка деактивації:", error);
    throw error;
  }
};