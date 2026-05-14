import * as React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WelcomeBannerProps {
    activeNodes: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ activeNodes }) => {
    return (
        <div className="lg:col-span-8 bg-[#1e1e2d] rounded-xl flex items-center relative overflow-hidden border border-white/[0.05]">
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#3699ff]/10 to-transparent pointer-events-none"></div>

            <div className="p-8 z-10 w-full flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={18} className="text-[#3699ff]" />
                        <span className="text-sm font-semibold text-[#3699ff] tracking-wide">SYSTEM COMMAND</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, Admin!</h2>
                    <p className="text-[#a2a5b9] text-sm">
                        You have <span className="text-[#1bc5bd] font-medium">{activeNodes} active nodes</span> currently running at optimal capacity.
                    </p>
                </div>
            </div>
        </div>
    );
};