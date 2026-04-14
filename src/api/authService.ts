import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL;

export const loginEmployee = async (login: string, password: string) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, {
    login: login,
    password: password
  });
  
  return response; 
};