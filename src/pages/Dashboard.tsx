import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Activity, Server, HardDrive } from 'lucide-react';
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { WelcomeBanner } from '../components/Layout/Dashboard/WelcomeBanner';
import { TimeWeatherCard } from '../components/Layout/Dashboard/TimeWeatherCard';
import { StatCard } from '../components/Layout/Dashboard/StatCard';
import { RecentUsersList } from '../components/Layout/Dashboard/RecentUsersList';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { employee, weather, stats, lastUsers, time, systemMetrics } = useDashboardLogic();

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <WelcomeBanner activeNodes={stats.activeNodes} />
        <TimeWeatherCard time={time} location={employee?.location} weather={weather} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<UsersIcon size={24} />}
          colorClass="text-[#3699ff]"
          bgClass="bg-[#3699ff]/10"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Avg CPU Load"
          value={`${systemMetrics.cpu}%`}
          icon={<Activity size={24} />}
          colorClass="text-[#1bc5bd]"
          bgClass="bg-[#1bc5bd]/10"
          onClick={() => navigate('/analytics')}
        />
        <StatCard
          title="Avg RAM Usage"
          value={`${systemMetrics.ram}%`}
          icon={<Server size={24} />}
          colorClass="text-[#ffa800]"
          bgClass="bg-[#ffa800]/10"
          onClick={() => navigate('/analytics')}
        />
        <StatCard
          title="Total Disk"
          value={`${systemMetrics.disk}%`}
          icon={<HardDrive size={24} />}
          colorClass="text-[#f64e60]"
          bgClass="bg-[#f64e60]/10"
          onClick={() => navigate('/infrastructure')}
        />
      </div>

      {/* --- RECENT USERS ROW --- */}
      <div className="grid grid-cols-1 gap-6">
        <RecentUsersList
          users={lastUsers}
          onViewAll={() => navigate('/users')}
          onUserClick={() => navigate('/users')}
        />
      </div>

    </div>
  );
};

export default Dashboard;