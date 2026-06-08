import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchNodeMetrics } from '../api/metricsService';
import { SystemMetricData, ViewMode } from '../types/metrics';

export const useAnalyticsLogic = () => {
    // Initialize from localStorage if available
    const [nodesHistory, setNodesHistory] = useState<Record<string, SystemMetricData[]>>(() => {
        try {
            const cached = localStorage.getItem('analytics-nodes-history');
            return cached ? JSON.parse(cached) : {};
        } catch {
            return {};
        }
    });
    const [activeCount, setActiveCount] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('combined');

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedNode = searchParams.get('node');

    // Sync nodesHistory to localStorage whenever it updates
    useEffect(() => {
        localStorage.setItem('analytics-nodes-history', JSON.stringify(nodesHistory));
    }, [nodesHistory]);

    const fetchAllMetrics = async () => {
        try {
            const combinedData = await fetchNodeMetrics();

            setNodesHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                Object.keys(combinedData).forEach(nodeId => {
                    const newNodeData = combinedData[nodeId];
                    const currentData = newHistory[nodeId] || [];

                    const updatedNodeHistory = [
                        ...currentData,
                        {
                            time: newNodeData.time || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            cpu: newNodeData.cpu_usage ?? newNodeData.cpu ?? 0,
                            temp: newNodeData.cpu_temp ?? 0,
                            ram: newNodeData.ram ?? 0,
                            disk: parseFloat(newNodeData.disk) || 0,
                            ping: newNodeData.ping ?? 0,
                            packet_loss: parseFloat(newNodeData.packet_loss) || 0,
                        }
                    ];
                    // Keep the last 20 data points
                    newHistory[nodeId] = updatedNodeHistory.slice(-20);
                });
                return newHistory;
            });

            setActiveCount(Object.keys(combinedData).length);
        } catch (err) {
        }
    };

    useEffect(() => {
        fetchAllMetrics();
        const interval = setInterval(fetchAllMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedNode) {
            setViewMode('split');
        }
    }, [selectedNode]);

    const displayedNodes = Object.keys(nodesHistory).filter(nodeId =>
        selectedNode ? nodeId === selectedNode : true
    );

    const handleResetView = () => {
        searchParams.delete('node');
        setSearchParams(searchParams);
        setViewMode('combined');
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'combined' ? 'split' : 'combined');
    };

    return {
        nodesHistory,
        activeCount,
        viewMode,
        selectedNode,
        displayedNodes,
        handleResetView,
        toggleViewMode
    };
};