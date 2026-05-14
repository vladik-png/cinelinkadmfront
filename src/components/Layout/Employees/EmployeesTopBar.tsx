import * as React from 'react';
import { ShieldCheck, Search } from 'lucide-react';

interface EmployeesTopBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export const EmployeesTopBar: React.FC<EmployeesTopBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="bg-[#1e1e2d] py-4 px-8 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3699ff]/10 rounded-lg border border-[#3699ff]/20">
                    <ShieldCheck size={18} className="text-[#3699ff]" />
                </div>
                <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-white">Staff Management</h2>
            </div>
            <div className="relative w-96">
                <input
                    type="text"
                    placeholder="Search staff by name, ID or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#151521] border border-white/[0.05] text-white text-xs px-10 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all placeholder-[#a2a5b9]/50"
                />
                <Search size={14} className="absolute left-4 top-3 text-[#a2a5b9]" />
            </div>
        </div>
    );
};