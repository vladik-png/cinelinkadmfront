import api from './axios';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error("Помилка отримання користувачів:", error);
    throw error;
  }
};

export const getEmployee = async (id: string) => {
  try {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання співробітника:", error);
    throw error;
  }
};

export const getEmployeesList = async () => {
  try {
    const response = await api.get('/employee');
    return response.data;
  } catch (error) {
    console.error("Помилка отримання списку працівників:", error);
    throw error;
  }
};