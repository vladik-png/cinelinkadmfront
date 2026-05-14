import { useState, useEffect, useMemo } from 'react';
import { ServerAlert, ServerLog } from '../types/moderation';
import { fetchModerationData, resolveAlertRequest, deleteLogRequest } from '../api/moderationService';

export const useModerationLogic = () => {
    const [alerts, setAlerts] = useState<ServerAlert[]>([]);
    const [logs, setLogs] = useState<ServerLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('admin_token');

    const fetchData = async () => {
        try {
            setLoading(true);
            const { mappedAlerts, mappedLogs } = await fetchModerationData(token);
            setAlerts(mappedAlerts.filter(a => !a.resolved));
            setLogs(mappedLogs);
        } catch (err) {
            console.error("Error loading moderation data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const resolveAlert = async (id: number) => {
        try {
            await resolveAlertRequest(id, token);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error("Error resolving alert", err);
            alert("Error resolving alert on server.");
        }
    };

    const deleteLog = async (id: number) => {
        try {
            await deleteLogRequest(id, token);
            setLogs(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error("Error deleting log", err);
            alert("Error deleting log on server. Please try again.");
        }
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(a =>
            a.server_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.message?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [alerts, searchTerm]);

    return {
        alerts,
        logs,
        loading,
        searchTerm,
        setSearchTerm,
        filteredAlerts,
        resolveAlert,
        deleteLog
    };
};