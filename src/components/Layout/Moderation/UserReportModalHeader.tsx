import * as React from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface UserReportModalHeaderProps {
    reportId: number;
    onClose: () => void;
}

export const UserReportModalHeader: React.FC<UserReportModalHeaderProps> = ({ reportId, onClose }) => {
    return (
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-[#151521]/50">
            <div className="flex items-center gap-3">
                <div className="bg-[#f1416c]/10 p-2 rounded-lg text-[#f1416c]">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">Report Details</h2>
                    <p className="text-xs text-[#a2a5b9] font-mono mt-1">ID: #{reportId}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-[#a2a5b9] hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-full transition-colors cursor-pointer"
            >
                <X size={18} />
            </button>
        </div>
    );
};
