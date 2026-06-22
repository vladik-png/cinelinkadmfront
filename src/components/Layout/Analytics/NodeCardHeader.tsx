import * as React from 'react';
import { Server, LayoutGrid, Maximize2 } from 'lucide-react';
import { SystemMetricData, ViewMode } from '../../../types/metrics';

interface NodeCardHeaderProps {
    nodeId: string;
    latest?: SystemMetricData;
    viewMode: ViewMode;
}

export const NodeCardHeader: React.FC<NodeCardHeaderProps> = ({ nodeId, latest, viewMode }) => {
    return (
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
                        <div className="text-[#3699ff]">CPU: {latest?.cpu ?? 0}%</div>
                        <div className="text-[#f64e60]">TEMP: {latest?.temp ?? 0}°C</div>
                        <div className="text-[#8950fc]">RAM: {latest?.ram ?? 0}%</div>
                        <div className="text-[#1bc5bd]">PING: {latest?.ping ?? 0}MS</div>
                        <div className={(latest?.packet_loss ?? 0) > 0 ? "text-[#f64e60] animate-pulse" : "text-[#a2a5b9]"}>
                            LOSS: {latest?.packet_loss ?? 0}%
                        </div>
                    </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-[#151521] border border-white/[0.05] flex items-center justify-center text-[#a2a5b9] group-hover:text-[#3699ff] group-hover:border-[#3699ff]/30 transition-all">
                    {viewMode === 'combined' ? <Maximize2 size={16} /> : <LayoutGrid size={16} />}
                </div>
            </div>
        </div>
    );
};
