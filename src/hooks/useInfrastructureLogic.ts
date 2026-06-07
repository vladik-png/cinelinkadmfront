import { useEffect } from 'react';
import { useInfraStore } from '../store/infraStore';

export const useInfrastructureLogic = () => {
    const { servers, loading, fetchData, handlePowerAction } = useInfraStore();

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), 5000); // 5s polling but uses background fetch
        return () => clearInterval(interval);
    }, [fetchData]);

    return {
        servers,
        loading,
        fetchData,
        handlePowerAction
    };
};