import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export const ProtectedLayout: React.FC = () => {
    const isAuth = localStorage.getItem('admin_token') !== null;
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex w-full min-h-screen bg-[#151521] text-slate-200">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                isMobileMenuOpen={isMobileMenuOpen}
                closeMobileMenu={() => setIsMobileMenuOpen(false)}
            />
            
            <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-64'} ml-0 min-h-screen flex flex-col relative min-w-0`}>
                <div className="sticky top-0 z-30 w-full min-w-0">
                    <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                </div>

                <main className="flex-1 w-full flex flex-col min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};