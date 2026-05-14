import axios from 'axios';

const INFRA_BASE_URL = import.meta.env.VITE_INFRA_API_URL;
const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;

export const getInfrastructureData = async () => {
  try {
    const [instRes, infoRes] = await Promise.all([
      axios.get(`${INFRA_BASE_URL}/`),
      axios.get(`${INFRA_BASE_URL}/info`)
    ]);

    return {
      instances: instRes.data.flatMap((r: any) => r.Instances || []),
      region: infoRes.data.region?.toUpperCase() || 'NOT FOUND'
    };
  } catch (error) {
    console.error("Error connecting to infrastructure service:", error);
    throw error;
  }
};

export const performPowerAction = async (action: 'start' | 'stop', id: string) => {
  try {
    const response = await axios.get(`${INFRA_BASE_URL}/${action}`, {
      params: { id: id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error ${action}:`, error);
    throw error;
  }
};

export const getWindowsMetrics = async () => {
  return axios.get(`${WINDOWS_API}/system-metrics`);
};

export const getKamateraMetrics = async () => {
  return axios.get(`${KAMATERA_API}/system-metrics`);
};