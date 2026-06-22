import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SystemMetricData } from '../../../types/metrics';

interface NodeCardCombinedChartProps {
    history: SystemMetricData[];
}

export const NodeCardCombinedChart: React.FC<NodeCardCombinedChartProps> = ({ history }) => {
    return (
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
    );
};
