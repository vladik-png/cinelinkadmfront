import * as React from 'react';
import { Search, Download, Plus } from 'lucide-react';

interface EmployeesToolbarProps {
    total: number;
    showing: number;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onExport: () => void;
    onAddEmployee?: () => void;
}

export const EmployeesToolbar: React.FC<EmployeesToolbarProps> = ({
    total,
    showing,
    searchTerm,
    setSearchTerm,
    onExport,
    onAddEmployee
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Personnel</h1>
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
                        placeholder="Search by name, ID or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e1e2d] border border-white/[0.05] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
                    />
                </div>

                {onAddEmployee && (
                    <button
                        onClick={onAddEmployee}
                        className="flex items-center gap-2 bg-[#3699ff] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#3699ff]/90 transition-all active:scale-95"
                    >
                        <Plus size={14} /> Add Employee
                    </button>
                )}

                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-[#1e1e2d] border border-white/[0.05] hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all active:scale-95"
                >
                    <Download size={14} /> Export
                </button>
            </div>
        </div>
    );
};
