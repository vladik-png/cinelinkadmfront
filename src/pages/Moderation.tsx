import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Activity, Database, Server, Clock, 
  Trash2, Zap, CheckCircle, RefreshCcw, Search, AlertTriangle, Settings, FileText
} from 'lucide-react';

// Твоя реальна адреса бекенду
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://e7dd0f5572ff.sn.mynetname.net:8080';

interface ServerAlert {
  id: number;
  created_at: string;
  server_id: string;
  type: string; 
  message: string;
  resolved: boolean;
}

interface ServerLog {
  id: number;
  created_at: string;
  server_id: string;
  component: string;
  action: string;
  status: string;
  details: string;
}

const Moderation: React.FC = () => {
  const [alerts, setAlerts] = useState<ServerAlert[]>([]);
  const [logs, setLogs] = useState<ServerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/alerts`, { headers }),
        axios.get(`${API_BASE_URL}/logs`, { headers })
      ]);

      const rawAlerts = alertsRes.data.results || alertsRes.data || [];
      const rawLogs = logsRes.data.results || logsRes.data || [];

      // НОРМАЛІЗАЦІЯ ДАНИХ (щоб React розумів Go-формат з великої літери)
      const mappedAlerts: ServerAlert[] = rawAlerts.map((a: any) => ({
        id: a.ID || a.id,
        created_at: a.CreatedAt || a.created_at,
        server_id: a.ServerID || a.server_id,
        type: a.Type || a.type,
        message: a.Message || a.message,
        resolved: a.Resolved || a.resolved || false,
      }));

      const mappedLogs: ServerLog[] = rawLogs.map((l: any) => ({
        id: l.ID || l.id,
        created_at: l.CreatedAt || l.created_at,
        server_id: l.ServerID || l.server_id,
        component: l.Component || l.component,
        action: l.Action || l.action,
        status: l.Status || l.status,
        details: l.Details || l.details,
      }));

      // Відфільтровуємо закриті алерти
      setAlerts(mappedAlerts.filter(a => !a.resolved));
      setLogs(mappedLogs);
      
    } catch (err) {
      console.error("Помилка завантаження даних модерації:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (id: number) => {
    try {
      // Спочатку пробуємо видалити (оскільки у тебе швидше за все RESTful DELETE)
      await axios.delete(`${API_BASE_URL}/alerts/${id}`, { headers });
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Не вдалося закрити алерт", err);
      alert("Не вдалося закрити алерт на сервері.");
    }
  };

  const deleteLog = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/logs/${id}`, { headers });
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Не вдалося видалити лог", err);
      alert("Не вдалося видалити лог");
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.server_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('err') || s.includes('fail') || s.includes('crit') || s.includes('offline')) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (s.includes('warn')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s.includes('succ') || s.includes('ok') || s.includes('online')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      {/* Header */}
      <div className="bg-[#0f172a] py-4 px-10 flex justify-between items-center sticky top-0 z-50 text-white shadow-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldAlert size={18} className="text-rose-500" />
          <h2 className="text-sm tracking-widest uppercase font-bold">System Moderation</h2>
        </div>
        
        <div className="relative w-80">
          <input 
            type="text" 
            placeholder="Search by server or message..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white text-[11px] px-10 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
        </div>

        <button onClick={fetchData} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
          <RefreshCcw size={18} className={loading ? 'animate-spin text-blue-400' : ''} />
        </button>
      </div>

      <div className="p-10 space-y-10">
        {/* Alerts Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-rose-500" />
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Critical Alerts</h1>
            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-xs font-black">{alerts.length}</span>
          </div>

          {alerts.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-10 flex items-center gap-4 text-emerald-600 shadow-sm">
              <CheckCircle size={32} />
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Everything is stable</h3>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">No active server failures detected.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlerts.map(alert => {
                const isCritical = alert.type?.toUpperCase() === 'OFFLINE' || alert.type?.toUpperCase() === 'CRITICAL';
                return (
                  <div key={alert.id} className={`bg-white rounded-[2rem] border-2 shadow-sm p-6 relative overflow-hidden group transition-all ${isCritical ? 'border-rose-100 hover:border-rose-300' : 'border-amber-100 hover:border-amber-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                          {isCritical ? <Zap size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">
                            {alert.server_id}
                          </span>
                          <p className={`text-sm font-black uppercase ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>{alert.type}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {alert.created_at ? new Date(alert.created_at).toLocaleTimeString('uk-UA') : '--:--'}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-6">
                      {alert.message}
                    </p>
                    
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className={`w-full py-3 text-white rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg transition-all active:scale-95 ${isCritical ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'}`}
                    >
                      Acknowledge & Clear
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Global Logs Table */}
        <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-blue-500" />
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Global Event Registry</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="py-5 px-6 font-black w-40">Timestamp</th>
                  <th className="py-5 px-6 font-black w-32">Server ID</th>
                  <th className="py-5 px-6 font-black w-40">Component / Action</th>
                  <th className="py-5 px-6 font-black w-24">Status</th>
                  <th className="py-5 px-6 font-black">Details</th>
                  <th className="py-5 px-6 font-black text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400 uppercase text-xs font-black tracking-widest">
                      {loading ? 'Loading logs...' : 'No logs found in database'}
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-bold text-[11px]">{log.created_at ? new Date(log.created_at).toLocaleDateString('uk-UA') : '--.--.----'}</span>
                          <span className="text-slate-400 text-[9px] font-bold mt-0.5">{log.created_at ? new Date(log.created_at).toLocaleTimeString('uk-UA') : '--:--:--'}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">
                          {log.server_id || 'UNKNOWN'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <Settings size={10} /> {log.component || 'System'}
                          </div>
                          <span className="text-slate-800 font-bold text-xs">
                            {log.action || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(log.status)}`}>
                          {log.status || 'INFO'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2 text-slate-600 font-medium max-w-md lg:max-w-xl xl:max-w-2xl">
                          <FileText size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="truncate" title={log.details}>{log.details || '-'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => deleteLog(log.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Moderation;