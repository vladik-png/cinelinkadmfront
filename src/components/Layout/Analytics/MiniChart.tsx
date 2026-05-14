import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SystemMetricData } from '../../../types/metrics';

interface MiniChartProps {
    title: string;
    value: string | number;
    data: SystemMetricData[];
    dataKey: string;
    color: string;
    icon: React.ReactNode;
    isStep?: boolean;
    yDomain?: any[];
}

export const MiniChart: React.FC<MiniChartProps> = ({ title, value, data, dataKey, color, icon, isStep, yDomain = [0, 100] }) => (
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
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a2a5b9', fontSize: 10 }} dy={10} />
                    <YAxis domain={yDomain} axisLine={false} tickLine={false} tick={{ fill: '#a2a5b9', fontSize: 10 }} />
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