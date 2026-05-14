import * as React from 'react';
import { UserData, SortKey, SortDirection } from '../../../types/user';
import { formatDate } from '../../../utils/dateHelpers';
import { Mail, UserCircle, ShieldAlert, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface UsersTableProps {
    users: UserData[];
    loading: boolean;
    sortConfig: { key: SortKey; direction: SortDirection };
    onSort: (key: SortKey) => void;
    onViewProfile: (user: UserData) => void;
    onToggleStatus: (user: UserData, e?: React.MouseEvent) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
    users,
    loading,
    sortConfig,
    onSort,
    onViewProfile,
    onToggleStatus
}) => {
    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown size={14} className="text-white/[0.2] group-hover:text-white/[0.5] transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-[#3699ff]" />
            : <ArrowDown size={14} className="text-[#3699ff]" />;
    };

    return (
        <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-[#a2a5b9] select-none">
                            <th className="py-5 px-6 w-24 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('id')}>
                                <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('name')}>
                                <div className="flex items-center gap-2">User Profile <SortIcon columnKey="name" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('email')}>
                                <div className="flex items-center gap-2">Contact Info <SortIcon columnKey="email" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('date')}>
                                <div className="flex items-center gap-2">Registration <SortIcon columnKey="date" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group text-center" onClick={() => onSort('status')}>
                                <div className="flex items-center justify-center gap-2">Status <SortIcon columnKey="status" /></div>
                            </th>
                            <th className="py-5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => {
                            const { date, time } = formatDate(user.created_at);

                            return (
                                <tr
                                    key={user.user_id}
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
                                            <span className="text-xs font-medium truncate max-w-[200px]">{user.email || 'N/A'}</span>
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
                                                onClick={(e) => onToggleStatus(user, e)}
                                                className={`p-2 rounded-md transition-colors ${user.is_active
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
                            )
                        })}
                    </tbody>
                </table>

                {users.length === 0 && !loading && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
                        <UserCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium uppercase tracking-widest">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};