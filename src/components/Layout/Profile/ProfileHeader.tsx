import * as React from 'react';

export const ProfileHeader: React.FC = () => {
    return (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#3699ff] to-[#1bc5bd] bg-clip-text text-transparent">My Profile</h1>
          <p className="text-[#a2a5b9] text-sm">Manage your personal information and system preferences.</p>
        </div>
    );
};
