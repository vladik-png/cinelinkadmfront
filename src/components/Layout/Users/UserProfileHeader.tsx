import * as React from 'react';
import { UserData } from '../../../types/user';
import { X } from 'lucide-react';

interface UserProfileHeaderProps {
    user: UserData;
    onClose: () => void;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, onClose }) => {
    return (
        <>
            <div
                className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05]"
                style={{ backgroundImage: user.bg_img_url ? `url(${user.bg_img_url})` : 'none' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/40 rounded-lg backdrop-blur-sm transition-colors border border-white/[0.1] cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
                <div className="relative">
                    <img src={user.avatar_url || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl border-4 border-[#1e1e2d] shadow-xl object-cover bg-[#151521]" alt="profile" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#1e1e2d] ${user.is_active ? 'bg-[#1bc5bd]' : 'bg-[#f64e60]'}`}></div>
                </div>
                <div className="pb-1">
                    <h2 className="text-2xl font-black text-white tracking-wide uppercase">{user.first_name} {user.last_name}</h2>
                    <p className="text-[#3699ff] font-bold text-xs mt-1 uppercase tracking-widest">@{user.username}</p>
                </div>
            </div>
        </>
    );
};
