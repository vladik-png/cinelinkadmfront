import * as React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AnalyticsHeaderProps {
    selectedNode: string | null;
    viewMode: string;
    onResetView: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ selectedNode, viewMode, onResetView }) => {
    return (
        <div className="mb-8 border-b border-white/[0.05] pb-6 flex justify-between items-end">
            <div>
                <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none">Real-time Telemetry</h1>
                <p className="text-[#a2a5b9] mt-2 uppercase text-[10px] tracking-widest font-semibold">
                    {selectedNode ? `Focused Node: ${selectedNode}` : (viewMode === 'combined' ? 'Combined Metrics Pipeline' : 'Individual Metrics Grid')}
                </p>
            </div>

            {selectedNode && (
                <button
                    onClick={onResetView}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1e1e2d] text-[#a2a5b9] hover:text-white rounded-xl hover:bg-white/[0.02] transition-all border border-white/[0.05] active:scale-95"
                >
                    <ArrowLeft size={16} className="text-[#3699ff]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">View All Nodes</span>
                </button>
            )}
        </div>
    );
};