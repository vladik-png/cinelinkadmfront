import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Server, Activity, HardDrive, Cpu, LayoutGrid, Maximize2, Zap, Clock, Thermometer, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const KAMATERA_API = 'http://185.227.108.14:8081';
const WINDOWS_API = 'http://e7dd0f5572ff.sn.mynetname.net:8080';

const Analytics: React.FC = () => {
  const [nodesHistory, setNodesHistory] = useState<Record<string, any[]>>({});
  const [activeCount, setActiveCount] = useState(0);
  const [viewMode, setViewMode] = useState<'combined' | 'split'>('combined');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNode = searchParams.get('node');

  const fetchAllMetrics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };

      let combinedData: Record<string, any> = {};

      try {
        const kamRes = await axios.get(`${KAMATERA_API}/system-metrics`, { headers });
        if (kamRes.data && typeof kamRes.data === 'object') {
          combinedData = { ...combinedData, ...kamRes.data };
        }
      } catch (e) {
      }

      try {
        const winRes = await axios.get(`${WINDOWS_API}/system-metrics`, { headers });
        if (winRes.data && typeof winRes.data === 'object') {
          combinedData = { ...combinedData, ...winRes.data };
        }
      } catch (e) {
      }

      setNodesHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        Object.keys(combinedData).forEach(nodeId => {
          const newNodeData = combinedData[nodeId];
          const currentData = newHistory[nodeId] || [];

          const updatedNodeHistory = [
            ...currentData,
            { 
              time: newNodeData.time || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
              cpu: newNodeData.cpu_usage ?? newNodeData.cpu ?? 0, 
              temp: newNodeData.cpu_temp ?? 0,
              ram: newNodeData.ram ?? 0,
              disk: parseFloat(newNodeData.disk) || 0, 
              ping: newNodeData.ping ?? 0,
              packet_loss: parseFloat(newNodeData.packet_loss) || 0,
            }
          ];
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

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
      <div className="bg-[#1e1e2d] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3699ff]/10 rounded-lg border border-[#3699ff]/20">
            <Activity size={18} className="text-[#3699ff]" />
          </div>
          <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-white">Cloud Infrastructure Analytics</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#3699ff]/10 text-[#3699ff] text-[10px] px-4 py-1.5 rounded-lg border border-[#3699ff]/20 uppercase tracking-widest font-bold">
            Active Agents: <span className="text-white ml-1 font-black">{activeCount} Nodes</span>
          </div>
        </div>
      </div>

      <div className="p-8 w-full max-w-7xl mx-auto flex-1">
        <div className="mb-8 border-b border-white/[0.05] pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none">Real-time Telemetry</h1>
            <p className="text-[#a2a5b9] mt-2 uppercase text-[10px] tracking-widest font-semibold">
              {selectedNode ? `Focused Node: ${selectedNode}` : (viewMode === 'combined' ? 'Combined Metrics Pipeline' : 'Individual Metrics Grid')}
            </p>
          </div>
          
          {selectedNode && (
            <button 
              onClick={() => {
                searchParams.delete('node');
                setSearchParams(searchParams);
                setViewMode('combined');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#1e1e2d] text-[#a2a5b9] hover:text-white rounded-xl hover:bg-white/[0.02] transition-all border border-white/[0.05] active:scale-95"
            >
              <ArrowLeft size={16} className="text-[#3699ff]" />
              <span className="text-[10px] uppercase tracking-widest font-bold">View All Nodes</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {displayedNodes.map(nodeId => {
            const history = nodesHistory[nodeId];
            const latest = history[history.length - 1];

            return (
              <div 
                key={nodeId} 
                onClick={() => setViewMode(viewMode === 'combined' ? 'split' : 'combined')}
                className={`bg-[#1e1e2d] rounded-2xl border ${selectedNode ? 'border-[#3699ff]/50 shadow-[0_0_15px_rgba(54,153,255,0.1)]' : 'border-white/[0.05] shadow-lg'} overflow-hidden cursor-pointer hover:border-white/[0.1] transition-all group`}
              >
                <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#151521]/50">
                  <div>
                    <span className="text-[10px] text-[#3699ff] uppercase tracking-widest font-bold">Node Identifier</span>
                    <h3 className="text-xl text-white tracking-wide uppercase flex items-center gap-2 font-bold mt-1">
                      <Server size={18} className="text-[#a2a5b9]" />
                      {nodeId}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {viewMode === 'combined' && (
                      <div className="hidden lg:flex gap-6 text-[10px] uppercase font-bold tracking-widest">
                          <div className="text-[#3699ff]">CPU: {latest?.cpu}%</div>
                          <div className="text-[#f64e60]">TEMP: {latest?.temp}°C</div>
                          <div className="text-[#8950fc]">RAM: {latest?.ram}%</div>
                          <div className="text-[#1bc5bd]">PING: {latest?.ping}MS</div>
                          <div className={latest?.packet_loss > 0 ? "text-[#f64e60] animate-pulse" : "text-[#a2a5b9]"}>
                            LOSS: {latest?.packet_loss}%
                          </div>
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-[#151521] border border-white/[0.05] flex items-center justify-center text-[#a2a5b9] group-hover:text-[#3699ff] group-hover:border-[#3699ff]/30 transition-all">
                      {viewMode === 'combined' ? <Maximize2 size={16} /> : <LayoutGrid size={16} />}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {viewMode === 'combined' ? (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ left: -10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3699ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#3699ff" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f64e60" stopOpacity={0.15}/><stop offset="95%" stopColor="#f64e60" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#a2a5b9', fontSize: 10}} dy={10} />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#a2a5b9', fontSize: 10}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#a2a5b9' }} 
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a2a5b9' }} />
                          
                          <Area name="CPU (%)" type="monotone" dataKey="cpu" stroke="#3699ff" strokeWidth={3} fill="url(#colorCpu)" />
                          <Area name="Temp (°C)" type="monotone" dataKey="temp" stroke="#f64e60" strokeWidth={3} fill="url(#colorTemp)" />
                          <Area name="RAM (%)" type="monotone" dataKey="ram" stroke="#8950fc" strokeWidth={3} fill="transparent" />
                          <Area name="Disk (%)" type="monotone" dataKey="disk" stroke="#ffa800" strokeWidth={3} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MiniChart title="CPU Usage" value={`${latest?.cpu}%`} data={history} dataKey="cpu" color="#3699ff" icon={<Cpu size={14}/>} />
                      <MiniChart title="Temperature" value={`${latest?.temp}°C`} data={history} dataKey="temp" color="#f64e60" icon={<Thermometer size={14}/>} />
                      <MiniChart title="RAM Usage" value={`${latest?.ram}%`} data={history} dataKey="ram" color="#8950fc" icon={<Activity size={14}/>} />
                      <MiniChart title="Network Ping" value={`${latest?.ping}MS`} data={history} dataKey="ping" color="#1bc5bd" icon={<Clock size={14}/>} yDomain={['auto', 'auto']} />
                      <MiniChart title="Disk Load" value={`${latest?.disk}%`} data={history} dataKey="disk" color="#ffa800" icon={<HardDrive size={14}/>} />
                      <MiniChart title="Packet Loss" value={`${latest?.packet_loss}%`} data={history} dataKey="packet_loss" color="#f64e60" icon={<Zap size={14}/>} isStep />
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

const MiniChart = ({ title, value, data, dataKey, color, icon, isStep, yDomain = [0, 100] }: any) => (
  <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02] cursor-default" onClick={(e) => e.stopPropagation()}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div style={{ color }}>{icon}</div>
        <span className="text-[10px] uppercase tracking-widest text-[#a2a5b9] font-bold">{title}</span>
      </div>
      <span className="text-lg font-bold text-white tracking-wide">{value}</span>
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#a2a5b9', fontSize: 10}} dy={10} />
          <YAxis domain={yDomain} axisLine={false} tickLine={false} tick={{fill: '#a2a5b9', fontSize: 10}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '10px', color: '#a2a5b9' }} 
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Area type={isStep ? "stepAfter" : "monotone"} dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#color-${dataKey})`} animationDuration={300} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;