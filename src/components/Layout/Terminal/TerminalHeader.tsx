import * as React from 'react';
import { Server, Wifi, WifiOff, X, Maximize, Minimize } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';

interface TerminalHeaderProps {
    node: SavedNode;
    isActive: boolean;
    isConnected: boolean;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    onClose: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
    node,
    isActive,
    isConnected,
    isFullscreen,
    onToggleFullscreen,
    onClose
}) => {
    return (
        <div className={`flex-none flex justify-between items-center px-4 py-3 bg-transparent border-b border-white/[0.05] w-full min-w-0 overflow-hidden ${isActive ? 'bg-white/[0.02]' : ''}`}>
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <Server size={12} className="shrink-0 text-[#a2a5b9]" /> 
                <span className="text-[10px] uppercase tracking-widest font-bold text-white truncate w-full">
                    Host: {node.host}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <div className={`hidden lg:flex items-center gap-1 font-bold text-[9px] uppercase tracking-widest ${isConnected ? 'text-[#1bc5bd]' : 'text-[#f64e60]'}`}>
                    {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                    <span className="hidden xl:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center border-l border-white/[0.1] pl-2 ml-1">
                    <button onClick={(e) => { e.stopPropagation(); onToggleFullscreen(); }} className="p-1 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-white transition-colors">
                        {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-[#f64e60] transition-colors ml-1">
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
