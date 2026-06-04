import api from './axios';

const AWS_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'https://api.cinelink.lol';
export const getEmployee = async (id: string | number) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData: any, token: string | null) => {
  try {
    const response = await api.post(`${AWS_BASE_URL}/employee`, employeeData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    console.log("Employee created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating employee:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      console.error("Error message:", error.response.data?.error || error.response.data?.message);
    }
    throw error;
  }
};

export const getEmployeesList = async (limit: number = 1000) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/employee?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees list:", error);
    throw error;
  }
};