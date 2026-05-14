import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { useProfileLogic } from '../hooks/useProfileLogic';
import { ProfileCard } from '../components/Layout/Profile/ProfileCard';

const Profile: React.FC = () => {
  const { emp, loading, handleDeactivate } = useProfileLogic();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151521] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
        <p className="uppercase tracking-widest text-[10px] text-[#a2a5b9] font-bold">Loading Profile...</p>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen bg-[#151521] flex items-center justify-center">
        <div className="bg-[#1e1e2d] p-10 rounded-2xl border border-white/[0.05] text-center">
          <Trash2 size={40} className="text-[#f64e60] mx-auto mb-4 opacity-50" />
          <p className="text-[#f64e60] font-bold uppercase tracking-widest text-sm">Employee Not Found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8 flex flex-col relative z-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-[#a2a5b9] text-sm">Manage your personal information and system preferences.</p>
      </div>

      <ProfileCard emp={emp} onDeactivate={handleDeactivate} />
    </div>
  );
};

export default Profile;