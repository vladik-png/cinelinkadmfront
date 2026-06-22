import api from './axios';

const INFRA_BASE_URL = import.meta.env.VITE_INFRA_API_URL;
const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
const DIGITAL_OCEAN_API = import.meta.env.VITE_DIGITAL_OCEAN_API_URL;

export const getInfrastructureData = async () => {
  try {
    const [instRes, infoRes] = await Promise.all([
      api.get(`${INFRA_BASE_URL}/`),
      api.get(`${INFRA_BASE_URL}/info`)
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
    const response = await api.get(`${INFRA_BASE_URL}/${action}`, {
      params: { id: id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error ${action}:`, error);
    throw error;
  }
};

export const getWindowsMetrics = async () => {
  return api.get(`${WINDOWS_API}/system-metrics`);
};

export const getKamateraMetrics = async () => {
  return api.get(`${KAMATERA_API}/system-metrics`);
};

export const getDigitalOceanMetrics = async () => {
  if (!DIGITAL_OCEAN_API) return { data: {} };
  
  const urls = DIGITAL_OCEAN_API.split(',').map((url: string) => url.trim()).filter(Boolean);
  
  if (urls.length === 0) return { data: {} };
  if (urls.length === 1) return api.get(`${urls[0]}/system-metrics`);

  const responses = await Promise.allSettled(
    urls.map((url: string) => api.get(`${url}/system-metrics`))
  );

  const combinedData: any = {};
  
  responses.forEach((res, index) => {
    if (res.status === 'fulfilled' && res.value.data) {
      // If it's an array or object, merge it in
      Object.assign(combinedData, res.value.data);
    } else {
      console.warn(`Failed to fetch DO metrics from ${urls[index]}`, res);
    }
  });

  return { data: combinedData };
};