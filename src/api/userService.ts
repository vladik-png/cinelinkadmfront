import api from './axios';

const AWS_BASE_URL = import.meta.env.VITE_AWS_API_URL || 'http://localhost:8080';

export const getUsers = async (limit: number = 1000) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/users?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleUserAccountStatus = async (userId: number, currentActive: boolean) => {
  try {
    const url = `${AWS_BASE_URL}/users/${userId}`;
    const response = currentActive 
      ? await api.delete(url)
      : await api.post(url);
    
    return response.data;
  } catch (error) {
    console.error("Error changing account status:", error);
    throw error;
  }
};

export const getUserDetailedProfile = async (userId: number) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error loading detailed profile:", error);
    throw error;
  }
};

export const getUserFollowers = async (userId: number) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error("Error loading user followers:", error);
    throw error;
  }
};

export const getUserFollowing = async (userId: number) => {
  try {
    const response = await api.get(`${AWS_BASE_URL}/users/${userId}/followings`);
    return response.data;
  } catch (error) {
    console.error("Error loading user following:", error);
    throw error;
  }
};