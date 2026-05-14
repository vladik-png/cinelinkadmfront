import axios from 'axios';
import api from './axios';

const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;

export const getSystemMetrics = async () => {
  try {
    const response = await api.get('/system-metrics');
    return response.data;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

export const fetchNodeMetrics = async (token: string | null) => {
  const headers = { Authorization: `Bearer ${token}` };
  let combinedData: Record<string, any> = {};

  try {
    const kamRes = await axios.get(`${KAMATERA_API}/system-metrics`, { headers });
    if (kamRes.data && typeof kamRes.data === 'object') {
      combinedData = { ...combinedData, ...kamRes.data };
    }
  } catch (e) {
  }

  try {
    const winRes = await axios.get(`${WINDOWS_API}/system-metrics`, { headers });
    if (winRes.data && typeof winRes.data === 'object') {
      combinedData = { ...combinedData, ...winRes.data };
    }
  } catch (e) {
  }

  return combinedData;
};