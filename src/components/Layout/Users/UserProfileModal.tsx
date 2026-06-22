import * as React from 'react';
import { UserData } from '../../../types/user';
import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileDetails } from './UserProfileDetails';

import { Modal } from '../../UI/Modal';

interface UserProfileModalProps {
    user: UserData;
    onClose: () => void;
    onToggleStatus: (user: UserData) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onToggleStatus }) => {
    return (
        <Modal onClose={onClose} maxWidth="2xl">
            <UserProfileHeader user={user} onClose={onClose} />

            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                <UserProfileStats user={user} />
                <UserProfileDetails user={user} onToggleStatus={onToggleStatus} />
            </div>
        </Modal>
    );
};