import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("1. Форма сабмітнута, preventDefault спрацював");
  
  setError(null);
  setIsLoading(true);

  try {
    console.log("2. Відправляємо запит на сервер з даними:", { login: employeeCode, password: password });
    
    // Спробуй використати просто шлях, якщо api вже налаштований
    // Або залиш як було, якщо api.ts порожній.
    const response = await api.post('http://localhost:8080/login', {
      login: employeeCode, 
      password: password
    });

    console.log("3. Відповідь від сервера отримана:", response);

    if (response.status === 200) {
      const employeeData = response.data.results;

      // ТЕПЕР МИ ТОЧНО ЗНАЄМО ПРАВИЛЬНУ НАЗВУ ПОЛЯ!
      const realId = employeeData.user_id;

      if (realId) {
        console.log("4. Успіх! Отримано ID:", realId);
        localStorage.setItem('admin_token', 'true'); 
        localStorage.setItem('employee_id', realId.toString()); 
        navigate('/dashboard');
      } else {
        console.warn("4. ID відсутній. Ось що прийшло:", employeeData);
        setError("Помилка обробки даних: ID відсутній");
      }
    }
  } catch (err: any) {
    console.error("3. СПІЙМАНО ПОМИЛКУ:", err);
    
    if (err.response) {
      const status = err.response.status;
      console.log("Помилка зі статусом:", status);
      if (status === 401) {
        setError('Користувача не знайдено');
      } else if (status === 403) {
        setError('Невірний пароль');
      } else {
        setError(`Помилка сервера: ${status}`);
      }
    } else {
      console.log("Помилка без response (можливо CORS або сервер лежить)");
      setError('Не вдалося з’єднатися з сервером');
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-800/10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Terminal Access</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] mt-2">Authentication Required</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase text-slate-400 font-bold ml-1 mb-2 block">Employee Code</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-slate-800"
              placeholder="XXXX"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-slate-400 font-bold ml-1 mb-2 block">Security Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-wider">
                {error}
              </p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl uppercase text-[11px] tracking-widest transition-all shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Authenticating...' : 'Authorize Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;