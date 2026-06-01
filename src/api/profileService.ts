import api from './axios';

export const getEmployeeProfile = async (id: string) => {
  try {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error loading profile:", error);
    throw error;
  }
};

export const deactivateEmployee = async (id: number) => {
  try {
    const response = await api.delete(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating employee:", error);
    throw error;
  }
};