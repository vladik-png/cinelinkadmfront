import React, { useState } from 'react';

interface InstallWizardProps {
  onInstallSuccess: () => void;
}

const InstallWizard: React.FC<InstallWizardProps> = ({ onInstallSuccess }) => {
  const [dbSettings, setDbSettings] = useState({
    host: 'localhost',
    port: '5432',
    user: '',
    password: '',
    dbName: 'cinelink',
  });

  const [adminSettings, setAdminSettings] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          database: dbSettings,
          admin: adminSettings,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Помилка підключення до бази даних або невірні дані.';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (_) {
          // Fallback if not JSON
        }
        throw new Error(errorMessage);
      }

      // Success
      onInstallSuccess();
    } catch (err: any) {
      setError(err.message || 'Сталася невідома помилка під час інсталяції.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-white">
      <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-400">Встановлення CineLink</h1>
        <p className="mb-8 text-center text-slate-400">
          Будь ласка, налаштуйте підключення до бази даних та створіть акаунт адміністратора.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Налаштування бази даних */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">Налаштування бази даних</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Host</label>
                <input
                  type="text"
                  name="host"
                  value={dbSettings.host}
                  onChange={handleDbChange}
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={dbSettings.port}
                  onChange={handleDbChange}
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">User</label>
                <input
                  type="text"
                  name="user"
                  value={dbSettings.user}
                  onChange={handleDbChange}
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={dbSettings.password}
                  onChange={handleDbChange}
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">DB Name</label>
              <input
                type="text"
                name="dbName"
                value={dbSettings.dbName}
                onChange={handleDbChange}
                required
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Створення адміністратора */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">Створення адміністратора</h2>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={adminSettings.email}
                onChange={handleAdminChange}
                required
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                value={adminSettings.password}
                onChange={handleAdminChange}
                required
                minLength={6}
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:bg-blue-600/50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Встановлення...
              </span>
            ) : (
              'Встановити'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstallWizard;
