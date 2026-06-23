import * as React from 'react';
import { UnifiedServer } from '../../../types/infrastructure';
import { Activity, Cpu, MapPin, Thermometer, Wifi, AlertTriangle } from 'lucide-react';

interface ServerCardStatsProps {
    server: UnifiedServer;
    tempColor: string;
    isKamatera: boolean;
    isDigitalOcean: boolean;
}

export const ServerCardStats: React.FC<ServerCardStatsProps> = ({
    server,
    tempColor,
    isKamatera,
    isDigitalOcean
}) => {
    return (
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
                    <MapPin size={12} className={isKamatera ? "text-[#1bc5bd]" : isDigitalOcean ? "text-[#0069ff]" : "text-[#8950fc]"} />
                    <span className="text-[9px] uppercase tracking-widest font-bold truncate max-w-[120px]">{server.location}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#a2a5b9]">{server.ip}</span>
            </div>
        </div>
    );
};
//