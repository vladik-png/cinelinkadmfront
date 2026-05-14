import * as React from 'react';
import { Search, ShieldAlert, Download } from 'lucide-react';

interface UsersToolbarProps {
    total: number;
    showing: number;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    showBlockedOnly: boolean;
    setShowBlockedOnly: (value: boolean) => void;
    onExport: () => void;
}

export const UsersToolbar: React.FC<UsersToolbarProps> = ({
    total,
    showing,
    searchTerm,
    setSearchTerm,
    showBlockedOnly,
    setShowBlockedOnly,
    onExport
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Accounts</h1>
                <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase">
                    <span className="bg-[#3699ff]/10 text-[#3699ff] px-2.5 py-1 rounded border border-[#3699ff]/20">Total: {total}</span>
                    <span className="text-[#a2a5b9]">Showing: {showing}</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a5b9]" />
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e1e2d] border border-white/[0.05] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
                    />
                </div>

                <button
                    onClick={() => setShowBlockedOnly(!showBlockedOnly)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${showBlockedOnly
                            ? 'bg-[#f64e60]/10 border-[#f64e60]/20 text-[#f64e60]'
                            : 'bg-[#1e1e2d] border-white/[0.05] text-[#a2a5b9] hover:bg-white/[0.02] hover:text-white'
                        }`}
                >
                    <ShieldAlert size={14} className={showBlockedOnly ? 'text-[#f64e60]' : 'text-[#a2a5b9]'} />
                    Blocked Only
                </button>

                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-[#1e1e2d] border border-white/[0.05] hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                >
                    <Download size={14} /> Export
                </button>
            </div>
        </div>
    );
};