import axios from 'axios';
import api from './axios';

const INFRA_BASE_URL = import.meta.env.VITE_INFRA_API_URL;
const WINDOWS_API = import.meta.env.VITE_WINDOWS_API_URL;
const KAMATERA_API = import.meta.env.VITE_KAMATERA_API_URL;
const DIGITAL_OCEAN_API = import.meta.env.VITE_DIGITAL_OCEAN_API_URL;

export const getInfrastructureData = async () => {
  try {
    const instRes = await api.get(`${INFRA_BASE_URL}/`);
    let region = 'NOT FOUND';
    try {
      const infoRes = await api.get(`${INFRA_BASE_URL}/info`);
      region = infoRes.data.region?.toUpperCase() || 'NOT FOUND';
    } catch (e) {
      // /info might not exist on the new backend
    }

    return {
      instances: Array.isArray(instRes.data) ? instRes.data : (instRes.data.flatMap ? instRes.data.flatMap((r: any) => r.Instances || []) : []),
      region
    };
  } catch (error) {
    console.error("Error connecting to infrastructure service:", error);
    throw error;
  }
};

export const performPowerAction = async (action: 'start' | 'stop', id: string, type?: string) => {
  if (type === 'DIGITAL_OCEAN') {
    if (!DIGITAL_OCEAN_TOKEN) throw new Error("DigitalOcean token not configured");
    const doAction = action === 'start' ? 'power_on' : 'power_off';
    const res = await axios.post(`${DIGITAL_OCEAN_API}/droplets/${id}/actions`, 
      { type: doAction },
      { headers: { Authorization: `Bearer ${DIGITAL_OCEAN_TOKEN}` } }
    );
    return res.data;
  }

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

const DIGITAL_OCEAN_TOKEN = import.meta.env.VITE_DIGITAL_OCEAN_TOKEN;

export const getDigitalOceanMetrics = async () => {
  if (!DIGITAL_OCEAN_TOKEN) return { data: [] };
  
  try {
    const res = await axios.get(`${DIGITAL_OCEAN_API}/droplets`, {
      headers: {
        Authorization: `Bearer ${DIGITAL_OCEAN_TOKEN}`
      }
    });
    return { data: res.data.droplets || [] };
  } catch (error) {
    console.error("Failed to fetch DigitalOcean droplets", error);
    return { data: [] };
  }
};