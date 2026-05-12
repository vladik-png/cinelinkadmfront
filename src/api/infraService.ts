import axios from 'axios';

const INFRA_BASE_URL = import.meta.env.VITE_INFRA_API_URL;

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