import * as React from 'react';
import { Download } from 'lucide-react';

interface EmployeesHeaderProps {
    total: number;
    showing: number;
    onExport: () => void;
}

export const EmployeesHeader: React.FC<EmployeesHeaderProps> = ({ total, showing, onExport }) => {
    return (
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl text-white uppercase font-bold leading-none tracking-wide">Personnel</h1>
                <div className="flex items-center gap-3 mt-3">
                    <span className="bg-[#3699ff]/10 text-[#3699ff] border border-[#3699ff]/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                        Total: {total}
                    </span>
                    <span className="text-[#a2a5b9] uppercase text-[10px] tracking-widest font-semibold">
                        Showing: {showing} results
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-[#1e1e2d] text-[#3699ff] text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/[0.02] border border-white/[0.05] transition-all active:scale-95"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>
        </div>
    );
};