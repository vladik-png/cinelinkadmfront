import * as React from 'react';
import { useLoginLogic } from '../hooks/auth/useLoginLogic';
import { LoginForm } from '../components/Layout/Login/LoginForm';
import { LoginBackground } from '../components/Layout/Login/LoginBackground';

const Login: React.FC = () => {
  const {
    employeeCode,
    setEmployeeCode,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin
  } = useLoginLogic();

  return (
    <div className="min-h-screen bg-[#151521] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <LoginBackground />

      <LoginForm
        employeeCode={employeeCode}
        setEmployeeCode={setEmployeeCode}
        password={password}
        setPassword={setPassword}
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default Login;