import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getEmployee } from '../api/userService';
import { getSystemMetrics } from '../api/metricsService';
import { getLocalWeather } from '../api/weatherService';
import { 
  ThermometerSun, MapPin, Users as UsersIcon, 
  Activity, Server, HardDrive, Clock,
  UserPlus, MoreHorizontal, ShieldCheck
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, activeNodes: 0 });
  const [lastUsers, setLastUsers] = useState<any[]>([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0, ram: 0, disk: 0, ping: 0
  });

  // ПОВЕРНУТО СТАРУ, РОБОЧУ ЛОГІКУ ПОГОДИ
  const fetchWeather = async (location: string) => {
    if (!location) return;
    try {
      const data = await getLocalWeather(location);
      if (data.current_condition) {
        setWeather({
          temp: data.current_condition[0].temp_C,
          resolvedPlace: data.nearest_area?.[0]?.areaName?.[0]?.value
        });
      }
    } catch (e) { 
    }
  };

  const fetchData = async () => {
    const empId = localStorage.getItem('employee_id');
    if (!empId) return;

    try {
      const usersData = await getUsers();
      if (usersData?.results) {
        setStats(prev => ({ ...prev, users: usersData.results.length }));
        setLastUsers(usersData.results.slice(-4).reverse());
      }

      const allNodesData = await getSystemMetrics();
      const nodeIds = Object.keys(allNodesData);
      
      if (nodeIds.length > 0) {
        let totalCpu = 0, totalRam = 0, totalDisk = 0;
        nodeIds.forEach(id => {
          totalCpu += allNodesData[id].cpu || 0;
          totalRam += allNodesData[id].ram || 0;
          totalDisk += parseFloat(allNodesData[id].disk) || 0;
        });

        const count = nodeIds.length;
        setStats(prev => ({ ...prev, activeNodes: count }));
        setSystemMetrics({
          cpu: Math.round(totalCpu / count),
          ram: Math.round(totalRam / count),
          disk: Math.round(totalDisk / count),
          ping: allNodesData[nodeIds[0]].ping || 0
        });
      }

      const empData = await getEmployee(empId);
      if (empData?.results) {
        setEmployee(empData.results);
        fetchWeather(empData.results.location);
      }
    } catch (err: any) { 
      console.error("Помилка завантаження дашборду:", err); 
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    const metricsInterval = setInterval(fetchData, 5000); 
    return () => { clearInterval(timer); clearInterval(metricsInterval); };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8">
      
      {/* --- TOP BANNER ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Welcome Banner */}
        <div className="lg:col-span-8 bg-[#1e1e2d] rounded-xl flex items-center relative overflow-hidden border border-white/[0.05]">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#3699ff]/10 to-transparent pointer-events-none"></div>
          
          <div className="p-8 z-10 w-full flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-[#3699ff]" />
                <span className="text-sm font-semibold text-[#3699ff] tracking-wide">SYSTEM COMMAND</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, Admin!</h2>
              <p className="text-[#a2a5b9] text-sm">You have <span className="text-[#1bc5bd] font-medium">{stats.activeNodes} active nodes</span> currently running at optimal capacity.</p>
            </div>
          </div>
        </div>

        {/* Time & Weather Card */}
        <div className="lg:col-span-4 bg-[#1e1e2d] rounded-xl p-8 border border-white/[0.05] flex flex-col justify-center">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-semibold text-[#a2a5b9] mb-1">Local Time</p>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Clock size={20} className="text-[#ffa800]" />
                {time}
              </div>
            </div>
          </div>
          
          <div className="pt-5 border-t border-white/[0.05] flex justify-between items-center">
             <div>
                <p className="text-[10px] font-bold text-[#f64e60] uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MapPin size={12} className="text-[#f64e60]" /> 
                  {employee?.location || "Locating..."}
                </p>
                <p className="text-xl font-bold text-white">
                  {weather ? `${weather.temp}°C` : "--°C"}
                </p>
             </div>
             <div className="w-12 h-12 rounded-lg bg-white/[0.03] flex items-center justify-center text-[#1bc5bd]">
                <ThermometerSun size={24} />
             </div>
          </div>
        </div>
      </div>

      {/* --- STATS CARDS ROW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Users" value={stats.users} icon={<UsersIcon size={24} />} 
          colorClass="text-[#3699ff]" bgClass="bg-[#3699ff]/10" onClick={() => navigate('/users')}
        />
        <StatCard 
          title="Avg CPU Load" value={`${systemMetrics.cpu}%`} icon={<Activity size={24} />} 
          colorClass="text-[#1bc5bd]" bgClass="bg-[#1bc5bd]/10" onClick={() => navigate('/analytics')}
        />
        <StatCard 
          title="Avg RAM Usage" value={`${systemMetrics.ram}%`} icon={<Server size={24} />} 
          colorClass="text-[#ffa800]" bgClass="bg-[#ffa800]/10" onClick={() => navigate('/analytics')}
        />
        <StatCard 
          title="Total Disk" value={`${systemMetrics.disk}%`} icon={<HardDrive size={24} />} 
          colorClass="text-[#f64e60]" bgClass="bg-[#f64e60]/10" onClick={() => navigate('/infrastructure')}
        />
      </div>

      {/* --- RECENT USERS ROW --- */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#1e1e2d] rounded-xl border border-white/[0.05] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.05] flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
               <UserPlus size={18} className="text-[#3699ff]" />
               Recent Registrations
            </h3>
            <button 
              onClick={() => navigate('/users')}
              className="text-xs font-semibold px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-md transition-colors"
            >
              View All
            </button>
          </div>

          <div className="p-0">
            {lastUsers.map((user: any, index: number) => (
              <div 
                key={user.user_id} 
                onClick={() => navigate('/users')} // ВЕСЬ РЯДОК ТЕПЕР КЛІКАБЕЛЬНИЙ
                className={`px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors group ${index !== lastUsers.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
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
                  {/* ІКОНКА ТЕПЕР СВІТЛІША І КРАЩЕ ВИДНА */}
                  <div className="w-8 h-8 rounded-md bg-white/[0.1] group-hover:bg-[#3699ff] flex items-center justify-center text-white transition-colors">
                    <MoreHorizontal size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, colorClass, bgClass, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[#1e1e2d] rounded-xl p-6 border border-white/[0.05] flex items-center justify-between cursor-pointer hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group"
    >
      <div>
        <p className="text-sm font-medium text-[#a2a5b9] mb-1 group-hover:text-white transition-colors">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  );
};

export default Dashboard;