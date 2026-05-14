import { useEffect, useState } from 'react';
import { getUsers, getEmployee } from '../api/userService';
import { getSystemMetrics } from '../api/metricsService';
import { getLocalWeather } from '../api/weatherService';
import { DashboardStats, SystemMetricsSummary, WeatherInfo, RecentUser } from '../types/dashboard';

export const useDashboardLogic = () => {
    const [employee, setEmployee] = useState<any>(null);
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [stats, setStats] = useState<DashboardStats>({ users: 0, activeNodes: 0 });
    const [lastUsers, setLastUsers] = useState<RecentUser[]>([]);
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    const [systemMetrics, setSystemMetrics] = useState<SystemMetricsSummary>({
        cpu: 0, ram: 0, disk: 0, ping: 0
    });

    const fetchWeather = async (location: string) => {
        if (!location) return;
        try {
            const data = await getLocalWeather(location);
            if (data.current_condition) {
                setWeather({
                    temp: data.current_condition[0].temp_C,
                    resolvedPlace: data.nearest_area?.[0]?.areaName?.[0]?.value
                });
            }
        } catch (e) {
        }
    };

    const fetchData = async () => {
        const empId = localStorage.getItem('employee_id');
        if (!empId) return;

        try {
            const usersData = await getUsers();
            if (usersData?.results) {
                setStats(prev => ({ ...prev, users: usersData.results.length }));
                setLastUsers(usersData.results.slice(-4).reverse());
            }

            const allNodesData = await getSystemMetrics();
            const nodeIds = Object.keys(allNodesData);

            if (nodeIds.length > 0) {
                let totalCpu = 0, totalRam = 0, totalDisk = 0;
                nodeIds.forEach(id => {
                    totalCpu += allNodesData[id].cpu || 0;
                    totalRam += allNodesData[id].ram || 0;
                    totalDisk += parseFloat(allNodesData[id].disk) || 0;
                });

                const count = nodeIds.length;
                setStats(prev => ({ ...prev, activeNodes: count }));
                setSystemMetrics({
                    cpu: Math.round(totalCpu / count),
                    ram: Math.round(totalRam / count),
                    disk: Math.round(totalDisk / count),
                    ping: allNodesData[nodeIds[0]].ping || 0
                });
            }

            const empData = await getEmployee(empId);
            if (empData?.results) {
                setEmployee(empData.results);
                fetchWeather(empData.results.location);
            }
        } catch (err: any) {
            console.error("Error loading dashboard data:", err);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        const metricsInterval = setInterval(fetchData, 5000);
        return () => { clearInterval(timer); clearInterval(metricsInterval); };
    }, []);

    return {
        employee,
        weather,
        stats,
        lastUsers,
        time,
        systemMetrics
    };
};