import * as React from 'react';
import { UserData } from '../../../types/user';
import { formatDate } from '../../../utils/dateHelpers';
import { BookOpen, ShieldAlert, CheckCircle } from 'lucide-react';

interface UserProfileDetailsProps {
    user: UserData;
    onToggleStatus: (user: UserData) => void;
}

export const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({ user, onToggleStatus }) => {
    return (
        <>
            {user.bio && (
                <div className="mb-6 p-5 bg-[#151521] rounded-xl border border-white/[0.02]">
                    <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                        <BookOpen size={14} /> Biography
                    </p>
                    <p className="text-white text-sm leading-relaxed italic border-l-2 border-[#3699ff]/30 pl-3">"{user.bio}"</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                    <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2">Email Address</p>
                    <p className="text-white font-bold truncate text-sm">
                        {user.email || 'N/A'}
                    </p>
                </div>
                <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                    <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2">Registration Date</p>
                    <p className="text-white font-bold truncate text-sm">
                        {formatDate(user.created_at).date}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.05]">
                <button
                    onClick={() => onToggleStatus(user)}
                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer ${user.is_active
                        ? 'bg-[#f64e60] hover:bg-rose-600 text-white shadow-[0_4px_12px_rgba(246,78,96,0.2)]'
                        : 'bg-[#1bc5bd] hover:bg-emerald-500 text-white shadow-[0_4px_12px_rgba(27,197,189,0.2)]'
                        }`}
                >
                    {user.is_active ? <><ShieldAlert size={16} /> Ban User Account</> : <><CheckCircle size={16} /> Restore User Access</>}
                </button>
                <p className="text-center text-[10px] font-bold tracking-widest uppercase text-[#a2a5b9] mt-2">
                    Current Status: {user.is_active ? <span className="text-[#1bc5bd]">Active</span> : <span className="text-[#f64e60]">Restricted</span>}
                </p>
            </div>
        </>
    );
};
