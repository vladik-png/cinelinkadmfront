import * as React from 'react';
import { UserData } from '../../../types/user';
import { formatDate } from '../../../utils/dateHelpers';
import { Mail, ShieldAlert, CheckCircle } from 'lucide-react';

interface UsersTableRowProps {
    user: UserData;
    onViewProfile: (user: UserData) => void;
    onToggleStatus: (user: UserData, e?: React.MouseEvent) => void;
}

export const UsersTableRow: React.FC<UsersTableRowProps> = ({ user, onViewProfile, onToggleStatus }) => {
    const { date, time } = formatDate(user.created_at);

    return (
        <tr
            onClick={() => onViewProfile(user)}
            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group"
        >
            <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                #{user.user_id}
            </td>

            <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} className={`w-10 h-10 rounded-lg object-cover border ${user.is_active ? 'border-white/[0.1]' : 'border-[#f64e60]/50 opacity-70'}`} alt="avatar" />
                        ) : (
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border ${user.is_active ? 'bg-white/[0.05] border-white/[0.1] text-white' : 'bg-[#f64e60]/10 border-[#f64e60]/30 text-[#f64e60]'}`}>
                                {user.first_name?.[0] || 'U'}
                            </div>
                        )}
                        {!user.is_active && <div className="absolute -top-1.5 -right-1.5 bg-[#f64e60] text-white p-0.5 rounded-full border-2 border-[#1e1e2d]"><ShieldAlert size={10} /></div>}
                    </div>
                    <div className="min-w-0">
                        <h3 className={`text-sm font-bold uppercase tracking-wide truncate transition-colors ${user.is_active ? 'text-white group-hover:text-[#3699ff]' : 'text-[#a2a5b9] line-through decoration-[#f64e60]/50'}`}>
                            {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-[10px] text-[#3699ff] font-semibold mt-0.5 tracking-wider">@{user.username}</p>
                    </div>
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="flex items-center gap-2 text-[#a2a5b9] group-hover:text-white transition-colors">
                    <Mail size={14} className="text-[#a2a5b9]" />
                    <span className="text-xs font-medium truncate max-w-[200px]">{user.email || 'Not specified'}</span>
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{date}</span>
                    {time && (
                        <span className="text-[10px] font-semibold text-[#a2a5b9] mt-0.5 tracking-wider">
                            {time}
                        </span>
                    )}
                </div>
            </td>

            <td className="py-4 px-6 text-center">
                <span className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border ${user.is_active
                    ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20'
                    : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                    }`}>
                    {user.is_active ? 'Active' : 'Banned'}
                </span>
            </td>

            <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(user, e);
                        }}
                        className={`p-2 rounded-md transition-colors cursor-pointer ${user.is_active
                            ? 'text-[#f64e60] bg-[#f64e60]/10 hover:bg-[#f64e60]/20'
                            : 'text-[#1bc5bd] bg-[#1bc5bd]/10 hover:bg-[#1bc5bd]/20'
                            }`}
                        title={user.is_active ? "Ban User" : "Restore User"}
                    >
                        {user.is_active ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
                    </button>
                </div>
            </td>
        </tr>
    );
};
