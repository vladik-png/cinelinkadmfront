import * as React from 'react';
import { useModerationLogic } from '../hooks/useModerationLogic';
import { AlertsSection } from '../components/Layout/Moderation/AlertsSection';
import { LogsTable } from '../components/Layout/Moderation/LogsTable';

const Moderation: React.FC = () => {
  const {
    alerts,
    logs,
    loading,
    filteredAlerts,
    resolveAlert,
    deleteLog
  } = useModerationLogic();

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9] relative">
      <div className="bg-[#1e1e2d] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-white/[0.05]">
      </div>

      <div className="p-8 space-y-10 max-w-7xl mx-auto w-full">
        <AlertsSection 
          alerts={alerts} 
          filteredAlerts={filteredAlerts} 
          onResolveAlert={resolveAlert} 
        />
        
        <LogsTable 
          logs={logs} 
          loading={loading} 
          onDeleteLog={deleteLog} 
        />
      </div>
    </div>
  );
};

export default Moderation;