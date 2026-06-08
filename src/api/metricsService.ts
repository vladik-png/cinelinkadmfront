import api from './axios';

const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
const DIGITAL_OCEAN_API = import.meta.env.VITE_DIGITAL_OCEAN_API_URL;

export const getSystemMetrics = async () => {
  try {
    const response = await api.get('/system-metrics');
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

  try {
    const doRes = await api.get(`${DIGITAL_OCEAN_API}/system-metrics`);
    if (doRes.data && typeof doRes.data === 'object') {
      combinedData = { ...combinedData, ...doRes.data };
    }
  } catch (e) {
    // console.error("Error fetching DO metrics:", e);
  }

  return combinedData;
};
