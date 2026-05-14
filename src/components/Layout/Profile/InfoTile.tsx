import * as React from 'react';

interface InfoTileProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export const InfoTile: React.FC<InfoTileProps> = ({ icon, label, value }) => {
    return (
        <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02] flex items-start gap-4 group hover:border-white/[0.08] transition-colors">
            <div className="p-3 bg-[#3699ff]/10 text-[#3699ff] rounded-lg border border-[#3699ff]/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 18 })}
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold text-[#a2a5b9] tracking-widest mb-1">{label}</p>
                <p className="font-semibold text-white text-sm truncate">
                    {value}
                </p>
            </div>
        </div>
    );
};