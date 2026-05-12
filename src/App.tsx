import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Moderation from './pages/Moderation';
import TerminalPage from './pages/Terminal';

const ProtectedLayout = () => {
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
    </div>
  );
};

const App: React.FC = () => {
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
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;