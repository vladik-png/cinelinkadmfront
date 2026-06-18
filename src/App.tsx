import * as React from 'react';
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
          <Route path="/messages" element={<Messages />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;