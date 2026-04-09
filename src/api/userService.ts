import axios from 'axios';

const AWS_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'http://localhost:8080';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${AWS_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання користувачів:", error);
    throw error;
  }
};

export const getEmployee = async (id: string | number) => {
  try {
    const response = await axios.get(`${AWS_BASE_URL}/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання співробітника:", error);
    throw error;
  }
};

export const getEmployeesList = async () => {
  try {
    const response = await axios.get(`${AWS_BASE_URL}/employee`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання списку працівників:", error);
    throw error;
  }
};

export const toggleUserAccountStatus = async (userId: number, currentActive: boolean, token: string | null) => {
  const method = currentActive ? "DELETE" : "POST";
  try {
    const response = await fetch(`${AWS_BASE_URL}/users/${userId}`, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    });
    
    if (!response.ok) throw new Error("Не вдалося змінити статус");
    return response;
  } catch (error) {
    console.error("Помилка запиту зміни статусу:", error);
    throw error;
  }
};

export const getUserDetailedProfile = async (userId: number, token: string | null) => {
  try {
    const response = await fetch(`${AWS_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error("Не вдалося отримати деталі");
    return await response.json();
  } catch (error) {
    console.error("Error loading detailed profile:", error);
    throw error;
  }
};