import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getInfrastructureData, performPowerAction, getWindowsMetrics, getKamateraMetrics, getDigitalOceanMetrics } from '../api/infraService';
import { UnifiedServer } from '../types/infrastructure';
import { AwsApiResponse, AgentApiResponse } from '../types/api';
import axios from 'axios';
import { mapAwsInstancesToUnified, mapAgentDataToUnified, mapDigitalOceanDropletsToUnified } from '../utils/dataAdapters';

interface InfraStoreState {
    servers: UnifiedServer[];
    loading: boolean;
    isInitialized: boolean;
    fetchData: (force?: boolean) => Promise<void>;
    handlePowerAction: (action: 'start' | 'stop', id: string, type?: string) => Promise<void>;
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
                        const awsData = await getInfrastructureData() as AwsApiResponse;
                        awsServers = mapAwsInstancesToUnified(awsData);
                    } catch (err) {
                        console.error("AWS API Error:", err);
                    }

                    let winServers: UnifiedServer[] = [];
                    try {
                        const winRes = await getWindowsMetrics() as AgentApiResponse;
                        winServers = mapAgentDataToUnified(winRes, 'Windows Server', 'WINDOWS');
                    } catch (err) {
                        console.error("Windows Agent API Error:", err);
                    }

                    let kamServers: UnifiedServer[] = [];
                    try {
                        const kamRes = await getKamateraMetrics() as AgentApiResponse;
                        kamServers = mapAgentDataToUnified(kamRes, 'Kamatera Linux Server', 'KAMATERA');
                    } catch (err) {
                        console.error("Kamatera Agent API Error:", err);
                    }

                    let doServers: UnifiedServer[] = [];
                    try {
                        const doRes = await getDigitalOceanMetrics();
                        doServers = mapDigitalOceanDropletsToUnified(doRes.data);
                        
                        // Fetch real-time metrics directly from each DO droplet's IP
                        const doPromises = doServers.map(async (server) => {
                            if (server.ip && server.ip !== 'No IP') {
                                try {
                                    // Try to fetch from the agent running on the DO droplet
                                    const metricsRes = await axios.get(`http://${server.ip}:8081/system-metrics`, { timeout: 2000 });
                                    if (metricsRes.data) {
                                        server.cpu = metricsRes.data.cpu_usage ?? metricsRes.data.cpu ?? 0;
                                        server.temp = metricsRes.data.cpu_temp ?? 0;
                                        server.ping = metricsRes.data.ping ?? 0;
                                        server.packetLoss = typeof metricsRes.data.packet_loss === 'string' ? parseFloat(metricsRes.data.packet_loss) : (metricsRes.data.packet_loss || 0);
                                        server.ram = metricsRes.data.ram ?? 0;
                                    }
                                } catch (e) {
                                    // Agent might be offline or not installed, leave metrics at 0
                                }
                            }
                        });
                        await Promise.all(doPromises);

                    } catch (err) {
                        console.error("Digital Ocean API Error:", err);
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

            handlePowerAction: async (action: 'start' | 'stop', id: string, type?: string) => {
                try {
                    await performPowerAction(action, id, type);
                    setTimeout(() => get().fetchData(true), 1000);
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err);
                    alert(`Action failed: ${msg}`);
                }
            }
        }),
        {
            name: 'infra-storage',
            partialize: (state) => ({ servers: state.servers, isInitialized: state.isInitialized }),
        }
    )
);
