import axios from 'axios';
import api from './axios';

const KAMATERA_API = 'http://185.227.108.14:8081';
const WINDOWS_API = 'http://e7dd0f5572ff.sn.mynetname.net:8080';

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