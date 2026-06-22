import { useEffect, useState } from 'react';
import { getUsers } from '../../api/userService';
import { getEmployee } from '../../api/employeeService';
import { getSystemMetrics } from '../../api/metricsService';
import { getLocalWeather } from '../../api/weatherService';
import { DashboardStats, SystemMetricsSummary, WeatherInfo, RecentUser } from '../../types/dashboard';
import { UserData } from '../../types/user';
import { EmployeeData } from '../../types/employee';
import { parseUserResponse } from '../../utils/dataAdapters';

export const useDashboardLogic = () => {
    const [employee, setEmployee] = useState<EmployeeData | null>(null);
    
    // Cached initial states
    const [weather, setWeather] = useState<WeatherInfo | null>(() => {
        try {
            const cached = localStorage.getItem('dashboard-weather');
            return cached ? JSON.parse(cached) : null;
        } catch { return null; }
    });
    
    const [stats, setStats] = useState<DashboardStats>(() => {
        try {
            const cached = localStorage.getItem('dashboard-stats');
            return cached ? JSON.parse(cached) : { users: 0, activeNodes: 0 };
        } catch { return { users: 0, activeNodes: 0 }; }
    });
    
    const [lastUsers, setLastUsers] = useState<RecentUser[]>(() => {
        try {
            const cached = localStorage.getItem('dashboard-last-users');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });

    const [systemMetrics, setSystemMetrics] = useState<SystemMetricsSummary>(() => {
        try {
            const cached = localStorage.getItem('dashboard-metrics');
            return cached ? JSON.parse(cached) : { cpu: 0, ram: 0, disk: 0, ping: 0 };
        } catch { return { cpu: 0, ram: 0, disk: 0, ping: 0 }; }
    });

    const [time, setTime] = useState(new Date().toLocaleTimeString());

    // Sync state changes to localStorage
    useEffect(() => {
        if (weather) localStorage.setItem('dashboard-weather', JSON.stringify(weather));
        localStorage.setItem('dashboard-stats', JSON.stringify(stats));
        localStorage.setItem('dashboard-last-users', JSON.stringify(lastUsers));
        localStorage.setItem('dashboard-metrics', JSON.stringify(systemMetrics));
    }, [weather, stats, lastUsers, systemMetrics]);

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

        getUsers().then((usersData: unknown) => {
            const extractedUsers = parseUserResponse(usersData);
            if (extractedUsers.length > 0) {
                setStats(prev => ({ ...prev, users: extractedUsers.length }));
                setLastUsers(extractedUsers.slice(-4).reverse().map((u: UserData) => ({
                    user_id: u.user_id!,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    email: u.email,
                    username: u.username || 'user',
                    avatar_url: u.avatar_url || `https://i.pravatar.cc/150?u=${u.user_id}`
                })));
            }
        }).catch((err: Error) => console.error("Error loading users:", err));

        getSystemMetrics().then((allNodesData: Record<string, any>) => {
            if (!allNodesData) return;
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
        }).catch((err: Error) => console.error("Error loading system metrics:", err));

        getEmployee(empId).then((empData: any) => {
            if (empData?.results) {
                setEmployee(empData.results);
                fetchWeather(empData.results.location);
            }
        }).catch((err: Error) => console.error("Error loading employee data:", err));
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