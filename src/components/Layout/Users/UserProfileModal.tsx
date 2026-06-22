import * as React from 'react';
import { UserData } from '../../../types/user';
import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileDetails } from './UserProfileDetails';

interface UserProfileModalProps {
    user: UserData;
    onClose: () => void;
    onToggleStatus: (user: UserData) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onToggleStatus }) => {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-white/[0.05] relative" onClick={(e) => e.stopPropagation()}>
                <UserProfileHeader user={user} onClose={onClose} />

                <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                    <UserProfileStats user={user} />
                    <UserProfileDetails user={user} onToggleStatus={onToggleStatus} />
                </div>
            </div>
        </div>
    );
};