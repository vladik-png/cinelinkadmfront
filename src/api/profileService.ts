import api from './axios';

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://admin.cinelink.lol';

export const getEmployeeProfile = async (id: string) => {
  try {
    const response = await api.get(`${ADMIN_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error loading profile:", error);
    throw error;
  }
};

export const deactivateEmployee = async (id: number) => {
  try {
    const response = await api.delete(`${ADMIN_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating employee:", error);
    throw error;
  }
};