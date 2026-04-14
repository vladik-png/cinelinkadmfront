import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getEmployee } from '../../api/userService'; 
import { LayoutDashboard, Users, ShieldAlert, Server, BarChart3, LogOut, Contact2 } from 'lucide-react';

interface Employee {
  first_name: string;
  last_name: string;
  avatar_url: string;
  location: string;
  employee_id: number;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const empId = localStorage.getItem('employee_id');
      if (!empId) return;

      try {
        const data = await getEmployee(empId);
        if (data && data.results) {
          setEmployee(data.results);
        }
      } catch (err) {
        console.error("Не вдалося завантажити дані працівника:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    console.log("Clear data...");
    localStorage.removeItem('admin_token');
    localStorage.removeItem('employee_id');
    
    window.location.href = '/';
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18}/> },
    { name: 'Users', path: '/users', icon: <Users size={18}/> },
    { name: 'Employees', path: '/employees', icon: <Contact2 size={18}/> },
    { name: 'Moderation', path: '/moderation', icon: <ShieldAlert size={18}/> },
    { name: 'AWS Server', path: '/infrastructure', icon: <Server size={18}/> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18}/> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-400 flex flex-col min-h-screen fixed left-0 top-0 shadow-xl border-r border-slate-800/50 font-medium">
      <div className="p-8 text-white text-xl tracking-tight">
        Cinelink <span className="text-blue-400">Admin Panel</span>
      </div>
      
      <nav className="flex-1 mt-4 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
              location.pathname === item.path 
              ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[13px] uppercase tracking-wider">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <Link 
          to="/profile" 
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${
            location.pathname === '/profile' 
            ? 'bg-blue-600/20 border-blue-600/30' 
            : 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center text-[10px] text-blue-400 border border-blue-600/30 uppercase font-bold overflow-hidden transition-transform group-hover:scale-110">
            {employee?.avatar_url ? (
              <img src={employee.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              employee?.first_name[0] || '?'
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[11px] text-slate-200 truncate uppercase font-bold">
              {employee ? `${employee.first_name} ${employee.last_name}` : 'Завантаження...'}
            </p>
            <p className="text-[9px] text-slate-500 uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
              Мій профіль
            </p>
          </div>
        </Link>

        {/* ОСЬ ТУТ ДОДАНО КЛАСИ relative z-10 cursor-pointer */}
        <button 
          onClick={handleLogout}
          className="relative z-10 cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all text-[10px] uppercase tracking-widest"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;