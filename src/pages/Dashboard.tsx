import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getEmployee } from '../api/userService';
import { getSystemMetrics } from '../api/metricsService';
import { getLocalWeather } from '../api/weatherService';
import { 
  ThermometerSun, MapPin, Users as UsersIcon, 
  Activity, Server, Database, Clock, ArrowRight,
  HardDrive, UserPlus, UserCircle, ShieldCheck 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, activeNodes: 0 });
  const [lastUsers, setLastUsers] = useState<any[]>([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0, 
    ram: 0,
    disk: 0,
    ping: 0
  });

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
        const allUsers = usersData.results;
        setStats(prev => ({ ...prev, users: allUsers.length }));
        setLastUsers(allUsers.slice(-3).reverse());
      }

      const allNodesData = await getSystemMetrics();
      const nodeIds = Object.keys(allNodesData);
      
      if (nodeIds.length > 0) {
        let totalCpu = 0;
        let totalRam = 0;
        let totalDisk = 0;

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
    <div className="w-full min-h-screen flex flex-col bg-[#f8fafc] font-medium">
      
      {}
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} className="text-[#3b82f6]" />
           <h2 className="text-sm tracking-widest uppercase font-bold text-white leading-none pt-0.5">System Command Center</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 text-blue-400 text-[10px] px-4 py-2 rounded-xl border border-blue-600/30 uppercase tracking-widest font-black">
            Status: <span className="text-white ml-1">Hello admin</span>
          </div>
        </div>
      </div>

      <div className="p-10 flex flex-col gap-10">
        {}
        <div className="w-full flex justify-between items-start">
          <div>
            <h1 className="text-[52px] font-black text-slate-900 uppercase tracking-tighter leading-none">Command Center</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em] mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Real-time Analytics: {stats.activeNodes} Nodes Active
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  <MapPin size={8} className="inline mr-1" /> {employee?.location || "Locating..."}
                </p>
                <p className="text-lg font-black text-slate-900 leading-none">
                  {weather ? `${weather.temp}°C` : "--°C"}
                </p>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <ThermometerSun size={18} />
              </div>
            </div>

            <div className="bg-slate-900 text-blue-400 px-6 py-3 rounded-[1.8rem] font-mono text-sm shadow-xl flex items-center gap-3 border border-slate-800">
              <Clock size={16} /> {time}
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          <NavCard icon={<UsersIcon />} title="Total Users" value={stats.users} unit="DB" color="blue" onClick={() => navigate('/users')} />
          <NavCard icon={<Activity />} title="Avg CPU Load" value={systemMetrics.cpu} unit="%" color="indigo" onClick={() => navigate('/analytics')} />
          <NavCard icon={<Server />} title="Avg RAM Usage" value={systemMetrics.ram} unit="%" color="emerald" onClick={() => navigate('/analytics')} />
          <NavCard icon={<HardDrive />} title="Total Disk" value={systemMetrics.disk} unit="%" color="rose" onClick={() => navigate('/infrastructure')} />
        </div>

        {}
        <div className="w-full bg-white rounded-[2.2rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <UserPlus size={20} />
              </div>
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs">Recent Registrations</h3>
            </div>

            <button 
              onClick={() => navigate('/users')}
              className="flex items-center gap-3 bg-slate-900 text-blue-400 px-8 py-3 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg border border-slate-800"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">View All Users</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lastUsers.map((user: any) => (
              <div key={user.user_id} className="flex items-center gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 transition-all">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <UserCircle size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 uppercase truncate">{user.first_name} {user.last_name || ""}</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavCard = ({ icon, title, value, unit, color, onClick }: any) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50"
  };
  return (
    <div onClick={onClick} className="bg-white p-8 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-slate-300 uppercase">{unit}</p>
      </div>
      <ArrowRight className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-600 transition-colors" size={20} />
    </div>
  );
};

export default Dashboard;