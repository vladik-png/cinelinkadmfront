import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Server, LayoutGrid, Maximize2, Cpu, Thermometer, Activity, Clock, HardDrive, Zap } from 'lucide-react';
import { SystemMetricData, ViewMode } from '../../../types/metrics';
import { MiniChart } from './MiniChart';

interface NodeCardProps {
    nodeId: string;
    history: SystemMetricData[];
    viewMode: ViewMode;
    selectedNode: string | null;
    onToggleView: () => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({ nodeId, history, viewMode, selectedNode, onToggleView }) => {
    const latest = history[history.length - 1];

    return (
        <div
            onClick={onToggleView}
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
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3699ff" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3699ff" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f64e60" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#f64e60" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a2a5b9', fontSize: 10 }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#a2a5b9', fontSize: 10 }} />
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
                        <MiniChart title="CPU Usage" value={`${latest?.cpu}%`} data={history} dataKey="cpu" color="#3699ff" icon={<Cpu size={14} />} />
                        <MiniChart title="Temperature" value={`${latest?.temp}°C`} data={history} dataKey="temp" color="#f64e60" icon={<Thermometer size={14} />} />
                        <MiniChart title="RAM Usage" value={`${latest?.ram}%`} data={history} dataKey="ram" color="#8950fc" icon={<Activity size={14} />} />
                        <MiniChart title="Network Ping" value={`${latest?.ping}MS`} data={history} dataKey="ping" color="#1bc5bd" icon={<Clock size={14} />} yDomain={['auto', 'auto']} />
                        <MiniChart title="Disk Load" value={`${latest?.disk}%`} data={history} dataKey="disk" color="#ffa800" icon={<HardDrive size={14} />} />
                        <MiniChart title="Packet Loss" value={`${latest?.packet_loss}%`} data={history} dataKey="packet_loss" color="#f64e60" icon={<Zap size={14} />} isStep />
                    </div>
                )}
            </div>
        </div>
    );
};