import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/Layout/ProtectedLayout';

import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Moderation from './pages/Moderation';
import TerminalPage from './pages/Terminal';
import Messages from './pages/Messages';
import InstallWizard from './pages/InstallWizard';

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setIsInstalled(data.installed);
      } catch (error) {
        console.error("Failed to check installation status", error);
        // Fallback: assume installed or show error. Let's assume installed to avoid blocking on network error,
        // or let's strictly follow requirement: if not able to verify, maybe show an error or default to false.
        // For safety, defaulting to false if the endpoint is missing or we can't reach it might force install.
        setIsInstalled(false); 
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, []);

  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-300 font-medium">Завантаження системи...</p>
        </div>
      </div>
    );
  }

  if (isInstalled === false) {
    return <InstallWizard onInstallSuccess={() => setIsInstalled(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/users" element={<Users />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/messages" element={<Messages />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
