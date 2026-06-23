import * as React from 'react';
import { useProfileLogic } from '../hooks/profile/useProfileLogic';
import { ProfileCard } from '../components/Layout/Profile/ProfileCard';
import { ProfileHeader } from '../components/Layout/Profile/ProfileHeader';
import { ProfileLoading } from '../components/Layout/Profile/ProfileLoading';
import { ProfileError } from '../components/Layout/Profile/ProfileError';

const Profile: React.FC = () => {
  const { emp, loading, handleDeactivate } = useProfileLogic();

  if (loading) {
    return <ProfileLoading />;
  }

  if (!emp) {
    return <ProfileError />;
  }

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      <div className="max-w-6xl mx-auto w-full">
        <ProfileHeader />

        <ProfileCard emp={emp} onDeactivate={handleDeactivate} />
      </div>
    </div>
  );
};

export default Profile;