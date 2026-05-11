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

const ProtectedLayout = () => {
  const isAuth = localStorage.getItem('admin_token') !== null;

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    // Змінив фон на темний преміальний (#151521)
    <div className="flex w-full min-h-screen bg-[#151521] text-slate-200">
      
      {/* Ліва панель навігації */}
      <Sidebar />
          
      {/* Права частина екрану (відступ ml-64 потрібен, бо Sidebar має фіксовану ширину w-64) */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col relative">
        
        {/* ОСЬ ТУТ має бути Header, щоб він завжди був зверху кожної сторінки */}
        <div className="sticky top-0 z-40 w-full">
          <Header />
        </div>

        {/* Основний контент (сторінки, які перемикаються) */}
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
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;