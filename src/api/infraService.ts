import axios from 'axios';

const INFRA_BASE_URL = import.meta.env.VITE_INFRA_API_URL;
const WINDOWS_API = 'http://e7dd0f5572ff.sn.mynetname.net:8080';
const KAMATERA_API = 'http://185.227.108.14:8081';

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