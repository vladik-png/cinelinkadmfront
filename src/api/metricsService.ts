import api from './axios';
import axios from 'axios';

const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
const DIGITAL_OCEAN_API = import.meta.env.VITE_DIGITAL_OCEAN_API_URL;

export const getSystemMetrics = async () => {
  let combinedData: Record<string, any> = {};

  try {
    const INFRA_API = import.meta.env.VITE_INFRA_API_URL;
    if (INFRA_API) {
      const res = await api.get(`${INFRA_API}/system-metrics`);
      if (res.data && typeof res.data === 'object') {
        Object.entries(res.data).forEach(([key, value]) => {
            combinedData[`do-${key}`] = { ...value, id: `do-${key}` };
        });
      }
    }
  } catch (error) {
    console.warn("INFRA_API system-metrics failed");
  }

  try {
    const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
    if (WINDOWS_API) {
      const res = await api.get(`${WINDOWS_API}/system-metrics`);
      if (res.data && typeof res.data === 'object') {
        Object.entries(res.data).forEach(([key, value]) => {
            combinedData[`win-${key}`] = { ...value, id: `win-${key}` };
        });
      }
    }
  } catch (error) {
    console.warn("WINDOWS_API system-metrics failed");
  }

  try {
    const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
    if (KAMATERA_API) {
      const res = await api.get(`${KAMATERA_API}/system-metrics`);
      if (res.data && typeof res.data === 'object') {
        Object.entries(res.data).forEach(([key, value]) => {
            combinedData[`kam-${key}`] = { ...value, id: `kam-${key}` };
        });
      }
    }
  } catch (error) {
    console.warn("KAMATERA_API system-metrics failed");
  }

  return combinedData;
};

export const fetchNodeMetrics = async () => {
  return await getSystemMetrics();
};
