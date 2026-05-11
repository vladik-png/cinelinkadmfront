import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Server, BarChart3, Contact2, Hexagon } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18}/> },
    { name: 'Users', path: '/users', icon: <Users size={18}/> },
    { name: 'Employees', path: '/employees', icon: <Contact2 size={18}/> },
    { name: 'Moderation', path: '/moderation', icon: <ShieldAlert size={18}/> },
    { name: 'AWS Server', path: '/infrastructure', icon: <Server size={18}/> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18}/> },
  ];

  return (
    <div className="w-64 bg-[#1e1e2d] text-[#a2a5b9] flex flex-col min-h-screen fixed left-0 top-0 border-r border-white/[0.05] font-sans z-50 shadow-xl">
      
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-white/[0.05]">
        <div className="bg-[#3699ff] p-1.5 rounded-lg flex items-center justify-center">
          <Hexagon size={24} className="text-white fill-white/20" />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-lg font-bold tracking-wide leading-tight">Cinelink</span>
          <span className="text-[10px] font-semibold text-[#a2a5b9] uppercase tracking-widest leading-none mt-0.5">Admin Panel</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <p className="text-xs font-bold text-white/[0.3] mb-4 px-2 uppercase tracking-wider">Main Menu</p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                  ? 'bg-[#3699ff]/10 text-[#3699ff]' 
                  : 'hover:bg-white/[0.03] hover:text-white text-[#a2a5b9]'
                }`}
              >
                <div className={`transition-colors duration-200 ${isActive ? 'text-[#3699ff]' : 'text-[#a2a5b9] group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Text (Optional) */}
      <div className="p-6 text-[10px] text-center text-white/[0.2] font-semibold uppercase tracking-widest border-t border-white/[0.05]">
        cinelink © 2026
      </div>
    </div>
  );
};

export default Sidebar;