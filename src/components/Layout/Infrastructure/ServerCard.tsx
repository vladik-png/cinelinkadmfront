import * as React from 'react';
import { UnifiedServer } from '../../../types/infrastructure';
import { Globe } from 'lucide-react';
import { ServerCardHeader } from './ServerCardHeader';
import { ServerCardStats } from './ServerCardStats';

interface Props {
    server: UnifiedServer;
    onClick: () => void;
    onPowerAction: (action: 'start' | 'stop', id: string, type?: string) => void;
}

export const ServerCard: React.FC<Props> = ({ server, onClick, onPowerAction }) => {
    const isRunning = server.state === 'running';
    const isTransitioning = ['pending', 'stopping', 'starting', 'shutting-down'].includes(server.state);
    const isWindows = server.type === 'WINDOWS';
    const isKamatera = server.type === 'KAMATERA';
    const isDigitalOcean = server.type === 'DIGITAL_OCEAN';
    const isAws = server.type === 'AWS';
    const hasMetrics = isWindows || isKamatera || isDigitalOcean;
    const hasPowerControls = isAws || isDigitalOcean;

    let tempColor = 'text-white';
    if (server.temp && Number(server.temp) >= 80) tempColor = 'text-[#f64e60]';
    else if (server.temp && Number(server.temp) >= 65) tempColor = 'text-[#ffa800]';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer bg-[#1e1e2d] rounded-2xl border border-white/[0.05] shadow-lg p-6 hover:border-white/[0.1] transition-all border-t-2 h-full flex flex-col ${isWindows ? 'border-t-[#8950fc]/50' : isKamatera ? 'border-t-[#1bc5bd]/50' : isDigitalOcean ? 'border-t-[#0069ff]/50' : isAws ? 'border-t-[#ffa800]/50' : 'border-t-[#ffa800]/50'
                }`}
        >
            <ServerCardHeader 
                server={server}
                isRunning={isRunning}
                isWindows={isWindows}
                isKamatera={isKamatera}
                isDigitalOcean={isDigitalOcean}
                isAws={isAws}
            />

            {hasMetrics && (
                <ServerCardStats 
                    server={server} 
                    tempColor={tempColor} 
                    isKamatera={isKamatera} 
                    isDigitalOcean={isDigitalOcean} 
                />
            )}

            {!hasMetrics && (
                <div className="mb-6 bg-[#151521] p-3 rounded-xl border border-white/[0.02] flex items-center gap-2 text-[#a2a5b9]">
                    <Globe size={14} className="text-[#ffa800]" />
                    <span className="text-[10px] font-mono font-semibold">{server.ip || 'No IP'}</span>
                </div>
            )}

            {hasPowerControls && (
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPowerAction('start', server.id, server.type); }}
                        disabled={isRunning || isTransitioning}
                        className="flex-1 bg-[#1bc5bd]/10 text-[#1bc5bd] border border-[#1bc5bd]/20 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#1bc5bd]/20 disabled:opacity-30 transition-all font-bold"
                    >
                        Start
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPowerAction('stop', server.id, server.type); }}
                        disabled={!isRunning || isTransitioning}
                        className="flex-1 bg-[#f64e60]/10 text-[#f64e60] border border-[#f64e60]/20 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#f64e60]/20 transition-all disabled:opacity-30 font-bold"
                    >
                        Stop
                    </button>
                </div>
            )}
        </div>
    );
};