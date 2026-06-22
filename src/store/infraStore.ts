import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getInfrastructureData, performPowerAction, getWindowsMetrics, getKamateraMetrics, getDigitalOceanMetrics } from '../api/infraService';
import { UnifiedServer } from '../types/infrastructure';
import { AwsApiResponse, AgentApiResponse } from '../types/api';
import { mapAwsInstancesToUnified, mapAgentDataToUnified } from '../utils/dataAdapters';

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
                        const doRes = await getDigitalOceanMetrics() as AgentApiResponse;
                        doServers = mapAgentDataToUnified(doRes, 'Digital Ocean Droplet', 'DIGITAL_OCEAN');
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
