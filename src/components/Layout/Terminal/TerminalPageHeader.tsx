import * as React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export const TerminalPageHeader: React.FC = () => {
    return (
        <div className="flex-none flex justify-between items-end mb-4 md:mb-6 border-b border-white/[0.05] pb-4 md:pb-6 w-full overflow-hidden min-w-0">
          <h1 className="text-2xl md:text-3xl uppercase tracking-wide font-bold leading-none flex items-center gap-3 truncate bg-gradient-to-r from-[#3699ff] to-[#8950fc] bg-clip-text text-transparent">
            <TerminalIcon size={24} className="text-[#8950fc] shrink-0" /> Web Terminal
          </h1>
        </div>
    );
};
