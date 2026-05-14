import { useState, useEffect } from 'react';
import { getInfrastructureData, performPowerAction, getWindowsMetrics, getKamateraMetrics } from '../api/infraService';
import { UnifiedServer } from '../types/infrastructure';

export const useInfrastructureLogic = () => {
    const [servers, setServers] = useState<UnifiedServer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            let awsServers: UnifiedServer[] = [];
            try {
                const awsData = await getInfrastructureData();
                awsServers = awsData.instances.map((inst: any) => {
                    const nameTag = inst.Tags?.find((t: any) => t.Key === 'Name');
                    return {
                        id: inst.InstanceId,
                        name: nameTag ? nameTag.Value : 'Unnamed AWS Node',
                        type: 'AWS',
                        state: inst.State?.Name || 'unknown',
                        ip: inst.PublicIpAddress || 'No Public IP',
                        rawAwsData: inst
                    };
                });
            } catch (err) {
                console.error("AWS API Error:", err);
            }

            let winServers: UnifiedServer[] = [];
            try {
                const winRes = await getWindowsMetrics();
                winServers = Object.values(winRes.data).map((s: any) => ({
                    id: s.instance_id,
                    name: s.device_name || 'Windows Server',
                    type: 'WINDOWS',
                    state: 'running',
                    ip: s.public_ip,
                    cpu: s.cpu_usage ?? s.cpu ?? 0,
                    temp: s.cpu_temp ?? 0,
                    ping: s.ping ?? 0,
                    packetLoss: parseFloat(s.packet_loss) || 0,
                    ram: s.ram ?? 0,
                    disk: s.disk,
                    location: s.location,
                    uptime: s.time
                }));
            } catch (err) {
                console.error("Windows Agent API Error:", err);
            }

            let kamServers: UnifiedServer[] = [];
            try {
                const kamRes = await getKamateraMetrics();
                kamServers = Object.values(kamRes.data).map((s: any) => ({
                    id: s.instance_id,
                    name: s.device_name || 'Kamatera Linux Server',
                    type: 'KAMATERA',
                    state: 'running',
                    ip: s.public_ip,
                    cpu: s.cpu_usage ?? s.cpu ?? 0,
                    temp: s.cpu_temp ?? 0,
                    ping: s.ping ?? 0,
                    packetLoss: parseFloat(s.packet_loss) || 0,
                    ram: s.ram ?? 0,
                    disk: s.disk,
                    location: s.location,
                    uptime: s.time
                }));
            } catch (err) {
                console.error("Kamatera Agent API Error:", err);
            }

            setServers([...awsServers, ...winServers, ...kamServers]);

        } catch (err) {
            console.error("Global Infrastructure Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePowerAction = async (action: 'start' | 'stop', id: string) => {
        try {
            await performPowerAction(action, id);
            setTimeout(fetchData, 1000);
        } catch (err: any) {
            alert(`Action failed: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return {
        servers,
        loading,
        fetchData,
        handlePowerAction
    };
};