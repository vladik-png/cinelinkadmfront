import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCcw, Activity, Server, Cpu, HardDrive, MapPin, Globe, Thermometer, Wifi, AlertTriangle } from 'lucide-react';

interface UnifiedServer {
  id: string;
  name: string;
  provider: 'AWS' | 'Local';
  platform: string;
  state: string;
  ip?: string;
  cpu?: number;
  temp?: number;
  ram?: number;
  disk?: string;
  location?: string;
  uptime?: string;
  ping?: number;
  packetLoss?: string;
}

const Infrastructure: React.FC = () => {
  const [servers, setServers] = useState<UnifiedServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const MASTER_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const baseRes = await axios.get(`${MASTER_URL}/`);
      
      const metricsRes = await axios.get(`${MASTER_URL}/system-metrics`);
      const activeMetrics = metricsRes.data;

      const combinedServers = baseRes.data.map((srv: any) => {
        const id = srv.InstanceId;
        const metrics = activeMetrics[id];
        
        return {
          id: id,
          name: id, 
          provider: srv.Provider,
          platform: srv.Platform,
          state: metrics ? 'running' : (srv.State || 'unknown'),
          ip: metrics?.public_ip || 'No IP',
          cpu: metrics?.cpu_usage,
          temp: metrics?.cpu_temp,
          ram: metrics?.ram,
          disk: metrics?.disk,
          location: metrics?.location || 'Unknown Location',
          uptime: metrics?.time,
          ping: metrics?.ping,
          packetLoss: metrics?.packet_loss,
        };
      });

      setServers(combinedServers);
    } catch (err) {
      console.error("Помилка отримання даних з Master Server:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePowerAction = async (action: 'start' | 'stop', id: string) => {
    try {
      await axios.get(`${MASTER_URL}/${action}?id=${id}`);
      setTimeout(fetchData, 1500);
    } catch (err: any) {
      alert(`Помилка: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white">
        <h2 className="text-sm tracking-widest uppercase font-bold flex items-center gap-2">
          <Globe size={18} className="text-blue-400" />
          Go Master Control
        </h2>
        <div className="flex gap-4">
           <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-all tracking-widest">View Logs</button>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">System Nodes</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">Hybrid Infrastructure via Golang</p>
          </div>
          <button 
            onClick={fetchData}
            style={{ backgroundColor: themeColor }}
            className="p-5 text-white rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 border border-slate-700/50"
          >
            <RefreshCcw size={28} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {servers.map((server) => {
            const isRunning = server.state === 'running';
            const isLocal = server.provider === 'Local';

            let tempColor = 'text-slate-700';
            if (server.temp && server.temp >= 80) tempColor = 'text-rose-500';
            else if (server.temp && server.temp >= 65) tempColor = 'text-amber-500';

            return (
              <div key={server.id} className={`bg-white rounded-[1.5rem] border shadow-sm p-8 hover:shadow-md transition-all border-t-2 ${isLocal ? 'border-t-blue-500/50' : 'border-t-orange-500/50'}`}>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-xl transition-all shadow-lg ${
                    isRunning 
                    ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200/20' 
                    : 'bg-rose-100 text-rose-600 shadow-rose-200/20'
                  }`}>
                    {isLocal ? <Server size={24} /> : <Activity size={24} />}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border font-bold ${
                      isLocal ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {server.provider}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-widest border ${
                      isRunning ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {server.state}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-slate-800 font-black mb-2 truncate tracking-tight">{server.name}</h3>
                  <div className="flex items-center gap-2">
                     <code className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded tracking-tight">{server.platform}</code>
                     {server.uptime && <span className="text-[10px] font-mono text-slate-400">{server.uptime}</span>}
                  </div>
                </div>

                {isRunning && server.cpu !== undefined && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-1">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Cpu size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">CPU</span>
                        </div>
                        <p className="font-bold text-slate-700 text-sm">{server.cpu}%</p>
                     </div>
                     
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-1">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Thermometer size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">Temp</span>
                        </div>
                        <p className={`font-bold text-sm ${tempColor}`}>{server.temp}°C</p>
                     </div>

                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-1">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Activity size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">RAM</span>
                        </div>
                        <p className="font-bold text-slate-700 text-sm">{server.ram}%</p>
                     </div>

                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin size={12} className="text-blue-500" />
                          <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-[100px]">{server.location}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{server.ip}</span>
                     </div>

                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-1">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Wifi size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">Ping</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="font-bold text-slate-700 text-sm">{server.ping}</p>
                          <span className="text-[8px] text-slate-400 font-bold">ms</span>
                        </div>
                     </div>
                     
                     {server.packetLoss !== "0" && server.packetLoss !== undefined && (
                        <div className="col-span-3 bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center gap-2">
                           <AlertTriangle size={12} className="text-rose-500" />
                           <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">Packet Loss: {server.packetLoss}%</span>
                        </div>
                     )}
                  </div>
                )}

                {(!isRunning || server.cpu === undefined) && (
                  <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-500">
                    <Globe size={14} className={isLocal ? "text-blue-400" : "text-orange-400"}/>
                    <span className="text-[10px] font-mono font-bold">{server.ip || 'Awaiting connection...'}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => handlePowerAction('start', server.id)}
                    disabled={isRunning}
                    style={{ backgroundColor: themeColor }}
                    className="flex-1 text-white py-3 rounded-xl text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-20 transition-all shadow-sm font-bold"
                  >
                    {isLocal ? 'Wake (WoL)' : 'Start'}
                  </button>
                  <button 
                    onClick={() => handlePowerAction('stop', server.id)}
                    disabled={!isRunning}
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