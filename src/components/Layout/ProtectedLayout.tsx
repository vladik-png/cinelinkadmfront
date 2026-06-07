import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { FloatingChatWidget } from './Chat/FloatingChatWidget';

export const ProtectedLayout: React.FC = () => {
    const isAuth = localStorage.getItem('admin_token') !== null;
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex w-full min-h-screen bg-[#151521] text-slate-200">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-64'} min-h-screen flex flex-col relative min-w-0`}>
                <div className="sticky top-0 z-40 w-full min-w-0">
                    <Header />
                </div>

                <main className="flex-1 w-full flex flex-col min-w-0">
                    <Outlet />
                </main>
            </div>
            <FloatingChatWidget />
        </div>
    );
};