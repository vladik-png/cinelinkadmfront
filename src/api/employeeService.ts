import api from './axios';
import { EmployeeData } from '../types/employee';

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://admin.cinelink.lol';

export const getEmployee = async (id: string | number) => {
  try {
    const response = await api.get(`${ADMIN_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

export const createEmployee = async (employeeData: Partial<EmployeeData>) => {
  try {
    const response = await api.post(`${ADMIN_BASE_URL}/employee`, employeeData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating employee:", error?.response?.data?.error || error.message);
    throw error;
  }
};

export const getEmployeesList = async (limit: number = 1000) => {
  try {
    const response = await api.get(`${ADMIN_BASE_URL}/employee?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees list:", error);
    throw error;
  }
};
