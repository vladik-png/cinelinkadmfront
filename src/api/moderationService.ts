import api from './axios';
import { ServerAlert, ServerLog } from '../types/moderation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8086';

export const fetchModerationData = async (token: string | null) => {
  const headers = { Authorization: `Bearer ${token}` };
  
  const [alertsRes, logsRes] = await Promise.all([
    api.get(`${API_BASE_URL}/alerts`, { headers }),
    api.get(`${API_BASE_URL}/logs`, { headers })
  ]);

  const rawAlerts = alertsRes.data.results || alertsRes.data || [];
  const rawLogs = logsRes.data.results || logsRes.data || [];

  const mappedAlerts: ServerAlert[] = rawAlerts.map((a: any) => ({
    id: a.ID || a.id,
    created_at: a.CreatedAt || a.created_at,
    server_id: a.ServerID || a.server_id,
    type: a.Type || a.type,
    message: a.Message || a.message,
    resolved: a.Resolved || a.resolved || false,
  }));

  const mappedLogs: ServerLog[] = rawLogs.map((l: any) => ({
    id: l.ID || l.id,
    created_at: l.CreatedAt || l.created_at,
    server_id: l.ServerID || l.server_id,
    component: l.Component || l.component,
    action: l.Action || l.action,
    status: l.Status || l.status,
    details: l.Details || l.details,
  }));

  return { mappedAlerts, mappedLogs };
};

export const resolveAlertRequest = async (id: number, token: string | null) => {
  const headers = { Authorization: `Bearer ${token}` };
  return api.delete(`${API_BASE_URL}/alerts/${id}`, { headers });
};

export const deleteLogRequest = async (id: number, token: string | null) => {
  const headers = { Authorization: `Bearer ${token}` };
  return api.delete(`${API_BASE_URL}/logs/${id}`, { headers });
};

export const fetchUserReportsRequest = async (token: string | null, cursor: number = 0, sort: string = '') => {
  const headers = { Authorization: `Bearer ${token}` };
  let url = `${API_BASE_URL}/user_reports?cursor=${cursor}`;
  if (sort) {
    url += `&sort=${encodeURIComponent(sort)}`;
  }
  const response = await api.get(url, { headers });
  return response.data.results || response.data || [];
};