import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfrastructureLogic } from '../hooks/useInfrastructureLogic';
import { InfrastructureHeader } from '../components/Layout/Infrastructure/InfrastructureHeader';
import { ServerCard } from '../components/Layout/Infrastructure/ServerCard';

const Infrastructure: React.FC = () => {
  const { servers, loading, fetchData, handlePowerAction } = useInfrastructureLogic();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
      <div className="p-8 w-full max-w-7xl mx-auto flex-1">

        <InfrastructureHeader loading={loading} onRefresh={fetchData} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onClick={() => navigate(`/analytics?node=${server.id}`)}
              onPowerAction={handlePowerAction}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Infrastructure;