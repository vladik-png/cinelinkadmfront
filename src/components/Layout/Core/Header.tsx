import * as React from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useHeaderLogic } from '../../../hooks/core/useHeaderLogic';
import { GlobalSearch } from './GlobalSearch';
import { IconButton } from '../../UI/IconButton';
import { Button } from '../../UI/Button';
import { Avatar } from '../../UI/Avatar';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { employee, handleLogout } = useHeaderLogic();

  return (
    <header className="h-20 bg-[#1e1e2d] border-b border-white/[0.05] flex items-center justify-between px-4 md:px-8 w-full shadow-sm relative z-10 gap-4">

      <div className="flex items-center gap-4 flex-1">
        <IconButton 
          onClick={onMenuToggle}
          className="md:hidden"
        >
          <Menu size={24} />
        </IconButton>
        <div className="flex items-center w-full max-w-[500px]">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-5">

        <div className="relative hidden sm:block">
          <IconButton variant="primary" className="!text-[#a2a5b9]">
            <Bell size={20} />
          </IconButton>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f64e60] rounded-full border-2 border-[#1e1e2d]"></span>
        </div>

        <div className="hidden sm:block w-px h-6 bg-white/[0.05]"></div>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-right hidden sm:block group mr-2 cursor-pointer">
            <p className="text-sm font-bold text-white group-hover:text-[#3699ff] transition-colors">
              {employee ? `${employee.first_name} ${employee.last_name}` : 'Loading...'}
            </p>
            <p className="text-[11px] text-[#a2a5b9] uppercase tracking-wider font-semibold mt-0.5">
              {employee?.role_name || 'Administrator'}
            </p>
          </Link>

          <Link to="/profile" className="border border-white/[0.05] hover:border-[#3699ff]/50 transition-colors cursor-pointer rounded-lg overflow-hidden shrink-0">
            <Avatar 
                src={employee?.avatar_url} 
                fallbackInitials={employee?.first_name?.[0]} 
                size="md" 
                shape="square"
            />
          </Link>

          <Button
            onClick={handleLogout}
            variant="danger-outline"
            className="ml-2 flex items-center gap-2 px-4 py-2.5"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;