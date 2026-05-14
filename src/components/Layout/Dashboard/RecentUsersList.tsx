import * as React from 'react';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import { RecentUser } from '../../../types/dashboard';

interface RecentUsersListProps {
    users: RecentUser[];
    onViewAll: () => void;
    onUserClick: (userId: number) => void;
}

export const RecentUsersList: React.FC<RecentUsersListProps> = ({ users, onViewAll, onUserClick }) => {
    return (
        <div className="bg-[#1e1e2d] rounded-xl border border-white/[0.05] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.05] flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <UserPlus size={18} className="text-[#3699ff]" />
                    Recent Registrations
                </h3>
                <button
                    onClick={onViewAll}
                    className="text-xs font-semibold px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-md transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="p-0">
                {users.map((user, index) => (
                    <div
                        key={user.user_id}
                        onClick={() => onUserClick(user.user_id)}
                        className={`px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors group ${index !== users.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.08] border border-white/[0.05] flex items-center justify-center flex-shrink-0">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <span className="text-white font-bold text-sm">
                                        {user.first_name?.charAt(0) || "U"}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-[#3699ff] transition-colors">
                                    {user.first_name} {user.last_name || ""}
                                </p>
                                <p className="text-xs text-[#a2a5b9] mt-0.5">
                                    @{user.username}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline-flex px-2.5 py-1 bg-[#1bc5bd]/10 text-[#1bc5bd] text-[10px] font-bold uppercase rounded">
                                Active
                            </span>
                            <div className="w-8 h-8 rounded-md bg-white/[0.1] group-hover:bg-[#3699ff] flex items-center justify-center text-white transition-colors">
                                <MoreHorizontal size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};