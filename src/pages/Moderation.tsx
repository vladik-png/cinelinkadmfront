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
      <div className="p-6 lg:p-8 w-full flex-1 flex flex-col space-y-10">
        
        <div className="flex justify-between items-end border-b border-white/[0.05] pb-6 -mb-2">
            <div>
                <h1 className="text-3xl text-white tracking-wide uppercase font-bold leading-none">Moderation Center</h1>
                <p className="text-[10px] text-[#a2a5b9] tracking-widest uppercase font-semibold mt-2">Review alerts and system logs</p>
            </div>
        </div>

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