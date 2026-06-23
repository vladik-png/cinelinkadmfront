import api from './axios';
import axios from 'axios';

const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
const DIGITAL_OCEAN_API = import.meta.env.VITE_DIGITAL_OCEAN_API_URL;

export const getSystemMetrics = async () => {
  try {
    const INFRA_API = import.meta.env.VITE_INFRA_API_URL;
    const response = await api.get(`${INFRA_API}/system-metrics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching generic system metrics:", error);
    throw error;
  }
};

export const fetchNodeMetrics = async () => {
  let combinedData: Record<string, any> = {};

  try {
    const kamRes = await api.get(`${KAMATERA_API}/system-metrics`);
    if (kamRes.data && typeof kamRes.data === 'object') {
      combinedData = { ...combinedData, ...kamRes.data };
    }
  } catch (e) {
    // console.error("Error fetching Kamatera metrics:", e);
  }

  try {
    const winRes = await api.get(`${WINDOWS_API}/system-metrics`);
    if (winRes.data && typeof winRes.data === 'object') {
      combinedData = { ...combinedData, ...winRes.data };
    }
  } catch (e) {
    // console.error("Error fetching Windows metrics:", e);
  }

  return combinedData;
};
