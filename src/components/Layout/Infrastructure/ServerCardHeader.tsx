import * as React from 'react';
import { UnifiedServer } from '../../../types/infrastructure';
import { Activity, Server as ServerIcon } from 'lucide-react';

interface ServerCardHeaderProps {
    server: UnifiedServer;
    isRunning: boolean;
    isWindows: boolean;
    isKamatera: boolean;
    isDigitalOcean: boolean;
    isAws: boolean;
}

export const ServerCardHeader: React.FC<ServerCardHeaderProps> = ({
    server,
    isRunning,
    isWindows,
    isKamatera,
    isDigitalOcean,
    isAws
}) => {
    return (
        <>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl border ${isRunning
                    ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20'
                    : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                    }`}>
                    {isWindows || isKamatera || isDigitalOcean ? <ServerIcon size={20} /> : <Activity size={20} />}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest border font-bold ${isWindows ? 'bg-[#8950fc]/10 text-[#8950fc] border-[#8950fc]/20' :
                        isKamatera ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' :
                            isDigitalOcean ? 'bg-[#0069ff]/10 text-[#0069ff] border-[#0069ff]/20' :
                                isAws ? 'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20' :
                                    'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20'
                        }`}>
                        {isKamatera ? 'LINUX NODE' : isDigitalOcean ? 'DIGITAL OCEAN NODE' : `${server.type} NODE`}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest border font-bold ${isRunning ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                        }`}>
                        {server.state}
                    </span>
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <h3 className="text-lg text-white font-bold mb-1.5 truncate tracking-wide uppercase">
                    {isKamatera ? 'Kamatera Linux Server' : isDigitalOcean ? 'Digital Ocean Droplet' : server.name}
                </h3>
                <code className="text-[10px] text-[#a2a5b9] bg-[#151521] border border-white/[0.05] px-2 py-1 rounded tracking-widest font-semibold inline-block">
                    {server.id}
                </code>
            </div>
        </>
    );
};
