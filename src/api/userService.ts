import axios from 'axios';

const AWS_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'http://localhost:8080';

export const getUsers = async (limit: number = 1000) => {
  try {
    const response = await axios.get(`${AWS_BASE_URL}/users?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
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

    if (!response.ok) throw new Error("Error changing account status");
    return response;
  } catch (error) {
    console.error("Error changing account status:", error);
    throw error;
  }
};

export const getUserDetailedProfile = async (userId: number, token: string | null) => {
  try {
    const response = await fetch(`${AWS_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Error loading detailed profile");
    return await response.json();
  } catch (error) {
    console.error("Error loading detailed profile:", error);
    throw error;
  }
};