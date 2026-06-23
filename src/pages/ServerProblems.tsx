import * as React from 'react';
import { useServerProblemsLogic } from '../hooks/infrastructure/useServerProblemsLogic';
import { AlertsSection } from '../components/Layout/ServerProblems/AlertsSection';
import { LogsTable } from '../components/Layout/ServerProblems/LogsTable';
import { ServerProblemsHeader } from '../components/Layout/ServerProblems/ServerProblemsHeader';

const ServerProblems: React.FC = () => {
  const {
    alerts,
    logs,
    loading,
    filteredAlerts,
    resolveAlert,
    deleteLog
  } = useServerProblemsLogic();

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8">
        
        <ServerProblemsHeader />

        <div className="mb-6">
          <AlertsSection 
            alerts={alerts} 
            filteredAlerts={filteredAlerts} 
            onResolveAlert={resolveAlert} 
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <LogsTable 
            logs={logs} 
            loading={loading} 
            onDeleteLog={deleteLog} 
          />
        </div>
    </div>
  );
};

export default ServerProblems;
