import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Server, BarChart3, Contact2, Hexagon, SquareTerminal, ChevronLeft, ChevronRight, Activity, MessageCircle } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen?: boolean;
  closeMobileMenu?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Contact2 size={20} /> },
    { name: 'Moderation', path: '/moderation', icon: <ShieldAlert size={20} /> },
    { name: 'Server Problems', path: '/server-problems', icon: <Activity size={20} /> },
    { name: 'Instances', path: '/infrastructure', icon: <Server size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Terminal', path: '/terminal', icon: <SquareTerminal size={20} /> },
    // { name: 'Messages', path: '/messages', icon: <MessageCircle size={20} /> },
  ];

  return (
    <div className={`bg-[#1e1e2d] text-[#a2a5b9] flex flex-col min-h-screen fixed left-0 top-0 border-r border-white/[0.05] font-sans z-50 shadow-xl transition-transform duration-300 ${isCollapsed ? 'md:w-[80px]' : 'md:w-64'} w-64 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

      <button
        onClick={toggleSidebar}
        className="hidden md:block absolute -right-3 top-6 bg-[#3699ff] text-white rounded-full p-1 z-50 shadow-lg hover:bg-blue-500 transition-colors cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} gap-3 border-b border-white/[0.05]`}>
        <div className="bg-[#3699ff] p-1.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer">
          <Hexagon size={24} className="text-white fill-white/20" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 cursor-default">
            <span className="text-white text-lg font-bold tracking-wide leading-tight">Cinelink</span>
            <span className="text-[10px] font-semibold text-[#a2a5b9] uppercase tracking-widest leading-none mt-0.5">Admin Panel</span>
          </div>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed ? (
          <p className="text-xs font-bold text-white/[0.3] mb-4 px-2 uppercase tracking-wider whitespace-nowrap">Main Menu</p>
        ) : (
          <div className="mb-4"></div>
        )}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (closeMobileMenu) closeMobileMenu(); }}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${isCollapsed ? 'md:justify-center px-4 md:px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-all duration-200 group cursor-pointer ${isActive
                  ? 'bg-[#3699ff]/10 text-[#3699ff]'
                  : 'hover:bg-white/[0.03] hover:text-white text-[#a2a5b9]'
                  }`}
              >
                <div className={`transition-colors duration-200 flex shrink-0 cursor-pointer ${isActive ? 'text-[#3699ff]' : 'text-[#a2a5b9] group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap overflow-hidden cursor-pointer ${isCollapsed ? 'block md:hidden ml-3' : 'block'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {!isCollapsed && (
        <div className="p-6 text-[10px] text-center text-white/[0.2] font-semibold uppercase tracking-widest border-t border-white/[0.05] whitespace-nowrap">
          cinelink © 2026
        </div>
      )}
    </div>
  );
};

export default Sidebar;