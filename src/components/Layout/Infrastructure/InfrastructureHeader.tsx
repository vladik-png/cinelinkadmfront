import * as React from 'react';
import { RefreshCcw } from 'lucide-react';

interface Props {
    loading: boolean;
    onRefresh: () => void;
}

export const InfrastructureHeader: React.FC<Props> = ({ loading, onRefresh }) => {
    return (
        <div className="flex justify-between items-end mb-8 border-b border-white/[0.05] pb-6">
            <div>
                <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none">System Nodes</h1>
            </div>
            <button
                onClick={onRefresh}
                className="p-3 bg-[#1e1e2d] text-[#a2a5b9] hover:text-white rounded-xl transition-all active:scale-95 border border-white/[0.05] hover:border-white/[0.1]"
            >
                <RefreshCcw size={20} className={loading ? 'animate-spin text-[#3699ff]' : ''} />
            </button>
        </div>
    );
};