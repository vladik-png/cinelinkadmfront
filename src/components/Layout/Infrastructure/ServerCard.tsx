import * as React from 'react';
import { UnifiedServer } from '../../../types/infrastructure';
import { Activity, Server as ServerIcon, Cpu, MapPin, Globe, Thermometer, Wifi, AlertTriangle } from 'lucide-react';

interface Props {
    server: UnifiedServer;
    onClick: () => void;
    onPowerAction: (action: 'start' | 'stop', id: string) => void;
}

export const ServerCard: React.FC<Props> = ({ server, onClick, onPowerAction }) => {
    const isRunning = server.state === 'running';
    const isTransitioning = ['pending', 'stopping', 'starting', 'shutting-down'].includes(server.state);
    const isWindows = server.type === 'WINDOWS';
    const isKamatera = server.type === 'KAMATERA';
    const hasMetrics = isWindows || isKamatera;

    let tempColor = 'text-white';
    if (server.temp && Number(server.temp) >= 80) tempColor = 'text-[#f64e60]';
    else if (server.temp && Number(server.temp) >= 65) tempColor = 'text-[#ffa800]';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer bg-[#1e1e2d] rounded-2xl border border-white/[0.05] shadow-lg p-6 hover:border-white/[0.1] transition-all border-t-2 ${isWindows ? 'border-t-[#8950fc]/50' : isKamatera ? 'border-t-[#1bc5bd]/50' : 'border-t-[#ffa800]/50'
                }`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl border ${isRunning
                    ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20'
                    : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                    }`}>
                    {isWindows || isKamatera ? <ServerIcon size={20} /> : <Activity size={20} />}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest border font-bold ${isWindows ? 'bg-[#8950fc]/10 text-[#8950fc] border-[#8950fc]/20' :
                        isKamatera ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' :
                            'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20'
                        }`}>
                        {isKamatera ? 'LINUX NODE' : `${server.type} NODE`}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest border font-bold ${isRunning ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                        }`}>
                        {server.state}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg text-white font-bold mb-1.5 truncate tracking-wide uppercase">
                    {isKamatera ? 'Kamatera Linux Server' : server.name}
                </h3>
                <code className="text-[10px] text-[#a2a5b9] bg-[#151521] border border-white/[0.05] px-2 py-1 rounded tracking-widest font-semibold">
                    {server.id}
                </code>
            </div>

            {hasMetrics && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#151521] p-3 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center gap-1.5 text-[#a2a5b9] mb-1">
                            <Cpu size={12} />
                            <span className="text-[9px] uppercase tracking-widest font-bold">CPU</span>
                        </div>
                        <p className="font-bold text-white text-sm">{server.cpu}%</p>
                    </div>
                    <div className="bg-[#151521] p-3 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center gap-1.5 text-[#a2a5b9] mb-1">
                            <Thermometer size={12} />
                            <span className="text-[9px] uppercase tracking-widest font-bold">TEMP</span>
                        </div>
                        <p className={`font-bold text-sm ${tempColor}`}>{server.temp}°C</p>
                    </div>
                    <div className="bg-[#151521] p-3 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center gap-1.5 text-[#a2a5b9] mb-1">
                            <Activity size={12} />
                            <span className="text-[9px] uppercase tracking-widest font-bold">RAM</span>
                        </div>
                        <p className="font-bold text-white text-sm">{server.ram} GB</p>
                    </div>
                    <div className="bg-[#151521] p-3 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center gap-1.5 text-[#a2a5b9] mb-1">
                            <Wifi size={12} />
                            <span className="text-[9px] uppercase tracking-widest font-bold">PING</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="font-bold text-white text-sm">{server.ping}</p>
                            <span className="text-[9px] text-[#a2a5b9] font-bold">ms</span>
                        </div>
                    </div>

                    {server.packetLoss !== undefined && server.packetLoss > 0 && (
                        <div className="col-span-2 bg-[#f64e60]/10 p-3 rounded-xl border border-[#f64e60]/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={14} className="text-[#f64e60]" />
                                <span className="text-[9px] uppercase tracking-widest font-bold text-[#f64e60]">Packet Loss</span>
                            </div>
                            <span className="text-xs font-bold text-[#f64e60]">{server.packetLoss}%</span>
                        </div>
                    )}

                    <div className="col-span-2 bg-[#151521] p-3 rounded-xl border border-white/[0.02] flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1.5 text-[#a2a5b9]">
                            <MapPin size={12} className={isKamatera ? "text-[#1bc5bd]" : "text-[#8950fc]"} />
                            <span className="text-[9px] uppercase tracking-widest font-bold truncate max-w-[120px]">{server.location}</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-[#a2a5b9]">{server.ip}</span>
                    </div>
                </div>
            )}

            {!hasMetrics && (
                <div className="mb-6 bg-[#151521] p-3 rounded-xl border border-white/[0.02] flex items-center gap-2 text-[#a2a5b9]">
                    <Globe size={14} className="text-[#ffa800]" />
                    <span className="text-[10px] font-mono font-semibold">{server.ip || 'No IP'}</span>
                </div>
            )}

            {!hasMetrics && (
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPowerAction('start', server.id); }}
                        disabled={isRunning || isTransitioning}
                        className="flex-1 bg-[#1bc5bd]/10 text-[#1bc5bd] border border-[#1bc5bd]/20 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#1bc5bd]/20 disabled:opacity-30 transition-all font-bold"
                    >
                        Start
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPowerAction('stop', server.id); }}
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