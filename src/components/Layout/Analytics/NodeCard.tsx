import * as React from 'react';
import { Cpu, Thermometer, Activity, Clock, HardDrive, Zap } from 'lucide-react';
import { SystemMetricData, ViewMode } from '../../../types/metrics';
import { MiniChart } from './MiniChart';
import { NodeCardHeader } from './NodeCardHeader';
import { NodeCardCombinedChart } from './NodeCardCombinedChart';

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
            <NodeCardHeader 
                nodeId={nodeId} 
                latest={latest} 
                viewMode={viewMode} 
            />

            <div className="p-8">
                {viewMode === 'combined' ? (
                    <NodeCardCombinedChart history={history} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MiniChart title="CPU Usage" value={`${latest?.cpu ?? 0}%`} data={history} dataKey="cpu" color="#3699ff" icon={<Cpu size={14} />} />
                        <MiniChart title="Temperature" value={`${latest?.temp ?? 0}°C`} data={history} dataKey="temp" color="#f64e60" icon={<Thermometer size={14} />} />
                        <MiniChart title="RAM Usage" value={`${latest?.ram ?? 0}%`} data={history} dataKey="ram" color="#8950fc" icon={<Activity size={14} />} />
                        <MiniChart title="Network Ping" value={`${latest?.ping ?? 0}MS`} data={history} dataKey="ping" color="#1bc5bd" icon={<Clock size={14} />} yDomain={['auto', 'auto']} />
                        <MiniChart title="Disk Load" value={`${latest?.disk ?? 0}%`} data={history} dataKey="disk" color="#ffa800" icon={<HardDrive size={14} />} />
                        <MiniChart title="Packet Loss" value={`${latest?.packet_loss ?? 0}%`} data={history} dataKey="packet_loss" color="#f64e60" icon={<Zap size={14} />} isStep />
                    </div>
                )}
            </div>
        </div>
    );
};