import * as React from 'react';
import { UserData } from '../../../types/user';
import { formatDate } from '../../../utils/dateHelpers';
import { X, Users as UsersIcon, UserPlus, BookOpen, ShieldAlert, CheckCircle } from 'lucide-react';

interface UserProfileModalProps {
    user: UserData;
    onClose: () => void;
    onToggleStatus: (user: UserData) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onToggleStatus }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] w-full max-w-2xl rounded-[2rem] shadow-2xl border border-white/[0.05] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                <div
                    className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05]"
                    style={{ backgroundImage: user.bg_img_url ? `url(${user.bg_img_url})` : 'none' }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/40 rounded-lg backdrop-blur-sm transition-colors border border-white/[0.1]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-8 flex items-end gap-6">
                        <div className="relative">
                            <img src={user.avatar_url || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl border-4 border-[#1e1e2d] shadow-xl object-cover bg-[#151521]" alt="profile" />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#1e1e2d] ${user.is_active ? 'bg-[#1bc5bd]' : 'bg-[#f64e60]'}`}></div>
                        </div>
                        <div className="pb-1">
                            <h2 className="text-2xl font-black text-white tracking-wide uppercase">{user.first_name} {user.last_name}</h2>
                            <p className="text-[#3699ff] font-bold text-xs mt-1 uppercase tracking-widest">@{user.username}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                                <UsersIcon size={18} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-none mb-1">{user.followers ?? 0}</p>
                                <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Followers</p>
                            </div>
                        </div>
                        <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                                <UserPlus size={18} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg leading-none mb-1">{user.followings ?? 0}</p>
                                <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Following</p>
                            </div>
                        </div>
                    </div>

                    {user.bio && (
                        <div className="mb-6 p-5 bg-[#151521] rounded-xl border border-white/[0.02]">
                            <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                <BookOpen size={14} /> Biography
                            </p>
                            <p className="text-white text-sm leading-relaxed italic border-l-2 border-[#3699ff]/30 pl-3">"{user.bio}"</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-8">
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
                            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${user.is_active
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
                </div>
            </div>
        </div>
    );
};