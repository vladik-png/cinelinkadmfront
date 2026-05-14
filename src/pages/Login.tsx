import * as React from 'react';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { LoginForm } from '../components/Layout/Login/LoginForm';

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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3699ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1bc5bd]/5 rounded-full blur-[100px] pointer-events-none"></div>

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