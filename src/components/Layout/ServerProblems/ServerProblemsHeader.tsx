import * as React from 'react';

export const ServerProblemsHeader: React.FC = () => {
    return (
        <div className="flex justify-between items-end border-b border-white/[0.05] pb-6 mb-6">
            <div>
                <h1 className="text-3xl tracking-wide uppercase font-bold leading-none bg-gradient-to-r from-[#3699ff] to-[#8950fc] bg-clip-text text-transparent">Server Problems</h1>
                <p className="text-[10px] text-[#a2a5b9] tracking-widest uppercase font-semibold mt-2">Review active alerts and system logs</p>
            </div>
        </div>
    );
};
