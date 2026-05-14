import * as React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import { useHeaderLogic } from '../../hooks/useHeaderLogic';

const Header: React.FC = () => {
  const { employee, handleLogout } = useHeaderLogic();

  return (
    <header className="h-20 bg-[#1e1e2d] border-b border-white/[0.05] flex items-center justify-between px-8 w-full shadow-sm relative z-10">

      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a5b9]" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#151521] text-sm text-white rounded-lg pl-10 pr-4 py-2 outline-none border border-white/[0.05] focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">

        <button className="relative text-[#a2a5b9] hover:text-[#3699ff] transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f64e60] rounded-full border-2 border-[#1e1e2d]"></span>
        </button>

        <div className="w-px h-6 bg-white/[0.05]"></div>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-right hidden sm:block group mr-2">
            <p className="text-sm font-bold text-white group-hover:text-[#3699ff] transition-colors">
              {employee ? `${employee.first_name} ${employee.last_name}` : 'Loading...'}
            </p>
            <p className="text-[11px] text-[#a2a5b9] uppercase tracking-wider font-semibold mt-0.5">
              {employee?.role_name || 'Administrator'}
            </p>
          </Link>

          <Link to="/profile" className="w-10 h-10 rounded-lg overflow-hidden bg-[#151521] border border-white/[0.05] flex items-center justify-center hover:border-[#3699ff]/50 transition-colors">
            {employee?.avatar_url ? (
              <img src={employee.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#3699ff] font-bold">
                {employee?.first_name?.[0] || 'A'}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f64e60]/10 hover:bg-[#f64e60]/20 text-[#f64e60] border border-[#f64e60]/20 transition-all duration-200 font-semibold text-sm shadow-sm"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;