import * as React from 'react';
import { useEffect, useState } from 'react';
import { getInfrastructureData, performPowerAction } from '../api/infraService';
import { RefreshCcw, Activity } from 'lucide-react';

const Infrastructure: React.FC = () => {
  const [instances, setInstances] = useState<any[]>([]);
  const [region, setRegion] = useState<string>('FETCHING...');
  const [loading, setLoading] = useState<boolean>(true);

const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getInfrastructureData();
      
      setInstances(data.instances);
      setRegion(data.region);
    } catch (err) {
      console.error("Connection error to Infra API:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePowerAction = async (action: 'start' | 'stop', id: string) => {
    console.log(`Запит на ${action} для вузла: ${id}`);
    try {
      const result = await performPowerAction(action, id);
      console.log(`Сервер відповів:`, result);

      setTimeout(fetchData, 1000); 
    } catch (err: any) {
      console.error(`Помилка дії ${action}:`, err.message);
      alert(`Не вдалося виконати дію: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getInstanceName = (inst: any) => {
    const nameTag = inst.Tags?.find((t: any) => t.Key === 'Name');
    return nameTag ? nameTag.Value : 'Unnamed Node';
  };

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white">
        <h2 className="text-sm tracking-widest uppercase font-bold">AWS EC2 Monitoring Center</h2>
        <div className="bg-[#1e293b] text-blue-400 text-[10px] px-4 py-1.5 rounded-lg border border-blue-600/20 uppercase tracking-widest">
          Region: <span className="text-white ml-1">{region}</span>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">System Nodes</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Infrastructure Control Pipeline</p>
          </div>
          <button 
            onClick={fetchData}
            style={{ backgroundColor: themeColor }}
            className="p-5 text-white rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 border border-slate-700/50"
          >
            <RefreshCcw size={28} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {instances.map((inst: any) => {
            const isRunning = inst.State?.Name === 'running';
            const isTransitioning = ['pending', 'stopping', 'starting', 'shutting-down'].includes(inst.State?.Name);

            return (
              <div key={inst.InstanceId} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-8 hover:shadow-md transition-all border-t-2 border-t-blue-500/50">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-xl transition-all shadow-lg ${
                    isRunning 
                    ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200/20 animate-pulse' 
                    : 'bg-rose-100 text-rose-600 shadow-rose-200/20'
                  }`}>
                    <Activity size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border ${
                    isRunning ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {inst.State?.Name || 'Unknown'}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Instance Name</p>
                  <h3 className="text-xl text-slate-800 font-bold mb-4 truncate tracking-tight">{getInstanceName(inst)}</h3>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Identifier</p>
                  <code className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded tracking-tight">{inst.InstanceId}</code>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handlePowerAction('start', inst.InstanceId)}
                    disabled={isRunning || isTransitioning}
                    style={{ backgroundColor: themeColor }}
                    className="flex-1 text-white py-3 rounded-xl text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-20 transition-all shadow-sm font-bold"
                  >
                    Start
                  </button>
                  <button 
                    onClick={() => handlePowerAction('stop', inst.InstanceId)}
                    disabled={!isRunning || isTransitioning}
                    className="flex-1 border border-slate-200 text-slate-400 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all disabled:opacity-20 font-bold"
                  >
                    Stop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;