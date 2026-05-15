import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { FloatingChatWidget } from './Chat/FloatingChatWidget';

export const ProtectedLayout: React.FC = () => {
    const isAuth = localStorage.getItem('admin_token') !== null;

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex w-full min-h-screen bg-[#151521] text-slate-200">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen flex flex-col relative">
                <div className="sticky top-0 z-40 w-full">
                    <Header />
                </div>

                <main className="flex-1 w-full flex flex-col">
                    <Outlet />
                </main>
            </div>
            <FloatingChatWidget />
        </div>
    );
};