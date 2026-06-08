import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getInfrastructureData, performPowerAction, getWindowsMetrics, getKamateraMetrics, getDigitalOceanMetrics } from '../api/infraService';
import { UnifiedServer } from '../types/infrastructure';

interface InfraStoreState {
    servers: UnifiedServer[];
    loading: boolean;
    isInitialized: boolean;
    fetchData: (force?: boolean) => Promise<void>;
    handlePowerAction: (action: 'start' | 'stop', id: string) => Promise<void>;
}

export const useInfraStore = create<InfraStoreState>()(
    persist(
        (set, get) => ({
            servers: [],
            loading: false,
            isInitialized: false,

            fetchData: async (force = false) => {
                const { isInitialized } = get();

                const fetchAllMetrics = async () => {
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

                    let doServers: UnifiedServer[] = [];
                    try {
                        const doRes = await getDigitalOceanMetrics();
                        doServers = Object.values(doRes.data).map((s: any) => ({
                            id: s.instance_id,
                            name: s.device_name || 'Digital Ocean Droplet',
                            type: 'DIGITAL_OCEAN',
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
                        console.error("Digital Ocean Agent API Error:", err);
                    }

                    return [...awsServers, ...winServers, ...kamServers, ...doServers];
                };

                if (isInitialized && !force) {
                    fetchAllMetrics()
                        .then(newServers => set({ servers: newServers }))
                        .catch(err => console.error("Global Infrastructure Background Refetch Error:", err));
                    return;
                }

                set({ loading: true });
                try {
                    const newServers = await fetchAllMetrics();
                    set({ servers: newServers, isInitialized: true });
                } catch (err) {
                    console.error("Global Infrastructure Error:", err);
                } finally {
                    set({ loading: false });
                }
            },

            handlePowerAction: async (action: 'start' | 'stop', id: string) => {
                try {
                    await performPowerAction(action, id);
                    setTimeout(() => get().fetchData(true), 1000);
                } catch (err: any) {
                    alert(`Action failed: ${err.message}`);
                }
            }
        }),
        {
            name: 'infra-storage',
            partialize: (state) => ({ servers: state.servers, isInitialized: state.isInitialized }),
        }
    )
);
