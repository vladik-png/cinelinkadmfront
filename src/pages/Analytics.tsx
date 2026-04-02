import * as React from 'react';
import { useEffect, useState } from 'react';
import { getSystemMetrics } from '../api/metricsService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Server, Activity, Globe, HardDrive, Cpu, LayoutGrid, Maximize2, Zap, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const [nodesHistory, setNodesHistory] = useState<Record<string, any[]>>({});
  const [activeCount, setActiveCount] = useState(0);
  const [viewMode, setViewMode] = useState<'combined' | 'split'>('combined');

  const fetchAllMetrics = async () => {
    try {
      const allNodesData = await getSystemMetrics();

      setNodesHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        Object.keys(allNodesData).forEach(nodeId => {
          const newNodeData = allNodesData[nodeId];
          const currentData = newHistory[nodeId] || [];

          const updatedNodeHistory = [
            ...currentData,
            { 
              time: newNodeData.time, 
              cpu: newNodeData.cpu, 
              ram: newNodeData.ram,
              disk: parseFloat(newNodeData.disk), 
              ping: newNodeData.ping,
              packet_loss: parseFloat(newNodeData.packet_loss) || 0,
            }
          ];
          newHistory[nodeId] = updatedNodeHistory.slice(-20);
        });
        return newHistory;
      });
      setActiveCount(Object.keys(allNodesData).length);
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  useEffect(() => {
    fetchAllMetrics();
    const interval = setInterval(fetchAllMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      {/* Header - дизайн твій, кнопки перемикання видалено [cite: 2025-12-27] */}
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h2 className="text-sm text-white tracking-widest uppercase flex items-center gap-2 font-bold">
          <Activity size={16} className="text-blue-400" />
          Cloud Infrastructure Analytics
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 text-blue-400 text-[10px] px-4 py-1.5 rounded-lg border border-blue-600/30 uppercase tracking-widest font-bold">
            Active Agents: <span className="text-white ml-1 font-black">{activeCount} Nodes</span>
          </div>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">Real-time Telemetry</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em] font-bold">
            {viewMode === 'combined' ? 'Combined Metrics Pipeline' : 'Individual Metrics Grid'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {Object.keys(nodesHistory).map(nodeId => {
            const history = nodesHistory[nodeId];
            const latest = history[history.length - 1];

            return (
              <div 
                key={nodeId} 
                onClick={() => setViewMode(viewMode === 'combined' ? 'split' : 'combined')} // Клік міняє дизайн [cite: 2025-12-27]
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:border-blue-300 transition-all group"
              >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">Node Identifier</span>
                    <h3 className="text-xl text-slate-800 tracking-tight uppercase flex items-center gap-2 font-black">
                      <Server size={20} className="text-slate-400" />
                      {nodeId}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {viewMode === 'combined' && (
                      <div className="hidden lg:flex gap-10 text-[11px] uppercase font-black tracking-widest">
                          <div className="text-blue-500">CPU: {latest?.cpu}%</div>
                          <div className="text-purple-500">RAM: {latest?.ram}%</div>
                          <div className="text-emerald-500">PING: {latest?.ping}MS</div>
                          <div className={latest?.packet_loss > 0 ? "text-red-500 animate-pulse" : "text-slate-400"}>
                            LOSS: {latest?.packet_loss}%
                          </div>
                      </div>
                    )}
                    {/* Маленька біла іконка-маркер [cite: 2025-12-27] */}
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-300 transition-all shadow-sm">
                      {viewMode === 'combined' ? <Maximize2 size={16} /> : <LayoutGrid size={16} />}
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  {viewMode === 'combined' ? (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ left: -10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                          <YAxis domain={[0, 360]} ticks={[0, 90, 180, 270, 360]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Area name="CPU (%)" type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCpu)" />
                          <Area name="RAM (%)" type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={3} fill="url(#colorRam)" />
                          <Area name="Disk (%)" type="monotone" dataKey="disk" stroke="#f97316" strokeWidth={3} fill="url(#colorDisk)" />
                          <Area name="Ping (ms)" type="monotone" dataKey="ping" stroke="#10b981" strokeWidth={3} fill="url(#colorPing)" />
                          <Area name="Loss (%)" type="stepAfter" dataKey="packet_loss" stroke="#ef4444" strokeWidth={3} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MiniChart title="CPU Usage" value={`${latest?.cpu}%`} data={history} dataKey="cpu" color="#3b82f6" icon={<Cpu size={14}/>} />
                      <MiniChart title="RAM Usage" value={`${latest?.ram}%`} data={history} dataKey="ram" color="#a855f7" icon={<Activity size={14}/>} />
                      <MiniChart title="Network Ping" value={`${latest?.ping}MS`} data={history} dataKey="ping" color="#10b981" icon={<Clock size={14}/>} />
                      <MiniChart title="Disk Load" value={`${latest?.disk}%`} data={history} dataKey="disk" color="#f97316" icon={<HardDrive size={14}/>} />
                      <MiniChart title="Packet Loss" value={`${latest?.packet_loss}%`} data={history} dataKey="packet_loss" color="#ef4444" icon={<Zap size={14}/>} isStep />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Твій оригінальний MiniChart без змін [cite: 2025-12-27]
const MiniChart = ({ title, value, data, dataKey, color, icon, isStep }: any) => (
  <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div style={{ color }}>{icon}</div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{title}</span>
      </div>
      <span className="text-lg font-black text-slate-800 tracking-tight">{value}</span>
    </div>
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
          <YAxis domain={[0, 360]} ticks={[0, 90, 180, 270, 360]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }} />
          <Area type={isStep ? "stepAfter" : "monotone"} dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#color-${dataKey})`} animationDuration={300} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;