import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ShieldAlert, Activity, Database, Server, Clock,
  Trash2, Zap, CheckCircle, RefreshCcw, Search, AlertTriangle, Settings, FileText
} from 'lucide-react';

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

      setAlerts(mappedAlerts.filter(a => !a.resolved));
      setLogs(mappedLogs);

    } catch (err) {
      console.error("Error loading moderation data:", err);
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
      await axios.delete(`${API_BASE_URL}/alerts/${id}`, { headers });
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error resolving alert", err);
      alert("Error resolving alert on server.");
    }
  };

  const deleteLog = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/logs/${id}`, { headers });
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Error deleting log", err);
      alert("Error deleting log on server. Please try again.");
    }
  };

  const filteredAlerts = alerts.filter(a =>
    a.server_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('err') || s.includes('fail') || s.includes('crit') || s.includes('offline')) return 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20';
    if (s.includes('warn')) return 'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20';
    if (s.includes('succ') || s.includes('ok') || s.includes('online')) return 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20';
    return 'bg-[#3699ff]/10 text-[#3699ff] border-[#3699ff]/20';
  };

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9] relative">
      <div className="bg-[#1e1e2d] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-white/[0.05]">
        {/* <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f64e60]/10 rounded-lg border border-[#f64e60]/20">
            <ShieldAlert size={18} className="text-[#f64e60]" />
          </div>
          <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-white">System Moderation</h2>
        </div>
        
        <div className="relative w-96">
          <input 
            type="text" 
            placeholder="Search by server or message..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151521] border border-white/[0.05] text-white text-xs px-10 py-2.5 rounded-xl outline-none focus:border-[#3699ff]/50 focus:bg-[#151521]/80 transition-all placeholder-[#a2a5b9]/50"
          />
          <Search size={14} className="absolute left-4 top-3 text-[#a2a5b9]" />
        </div>

        <button onClick={fetchData} className="p-2.5 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05] rounded-xl transition-all text-[#a2a5b9] hover:text-white">
          <RefreshCcw size={16} className={loading ? 'animate-spin text-[#3699ff]' : ''} />
        </button> */}
      </div>

      <div className="p-8 space-y-10 max-w-7xl mx-auto w-full">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-[#f64e60]" />
            <h1 className="text-3xl font-bold text-white uppercase tracking-wide leading-none">Critical Alerts</h1>
            <span className="bg-[#f64e60]/10 border border-[#f64e60]/20 text-[#f64e60] px-3 py-1 rounded text-[10px] font-bold mt-1">
              {alerts.length}
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="bg-[#1bc5bd]/10 border border-[#1bc5bd]/20 rounded-2xl p-10 flex items-center gap-5 text-[#1bc5bd] shadow-sm">
              <CheckCircle size={36} />
              <div>
                <h3 className="font-bold text-lg uppercase tracking-wide">Everything is stable</h3>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mt-1">No active server failures detected.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlerts.map(alert => {
                const isCritical = alert.type?.toUpperCase() === 'OFFLINE' || alert.type?.toUpperCase() === 'CRITICAL';
                return (
                  <div key={alert.id} className={`bg-[#1e1e2d] rounded-2xl border shadow-sm p-6 relative overflow-hidden group transition-all ${isCritical ? 'border-[#f64e60]/30 hover:border-[#f64e60]/50' : 'border-[#ffa800]/30 hover:border-[#ffa800]/50'}`}>
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border ${isCritical ? 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20' : 'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20'}`}>
                          {isCritical ? <Zap size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a2a5b9] block mb-1">
                            {alert.server_id}
                          </span>
                          <p className={`text-sm font-bold uppercase tracking-wide ${isCritical ? 'text-[#f64e60]' : 'text-[#ffa800]'}`}>{alert.type}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-[#a2a5b9] bg-[#151521] px-2.5 py-1 rounded border border-white/[0.05]">
                        {alert.created_at ? new Date(alert.created_at).toLocaleTimeString('uk-UA') : '--:--'}
                      </span>
                    </div>

                    <p className="text-[#a2a5b9] text-xs font-medium leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2">
                      {alert.message}
                    </p>

                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className={`w-full py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 border ${isCritical ? 'bg-[#f64e60]/10 hover:bg-[#f64e60]/20 text-[#f64e60] border-[#f64e60]/20' : 'bg-[#ffa800]/10 hover:bg-[#ffa800]/20 text-[#ffa800] border-[#ffa800]/20'}`}
                    >
                      Acknowledge & Clear
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="bg-[#1e1e2d] border border-white/[0.05] rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/[0.05] bg-[#151521]/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-[#3699ff]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Global Event Registry</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151521]/50 border-b border-white/[0.05] text-[10px] uppercase tracking-widest text-[#a2a5b9]">
                  <th className="py-5 px-6 font-bold w-40">Timestamp</th>
                  <th className="py-5 px-6 font-bold w-32">Server ID</th>
                  <th className="py-5 px-6 font-bold w-48">Component / Action</th>
                  <th className="py-5 px-6 font-bold w-32">Status</th>
                  <th className="py-5 px-6 font-bold">Details</th>
                  <th className="py-5 px-6 font-bold text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-[#a2a5b9] uppercase text-xs font-bold tracking-widest">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
                          <span>Syncing Logs...</span>
                        </div>
                      ) : 'No logs found in database'}
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-xs">{log.created_at ? new Date(log.created_at).toLocaleDateString('uk-UA') : '--.--.----'}</span>
                          <span className="text-[#a2a5b9] text-[10px] font-medium mt-1">{log.created_at ? new Date(log.created_at).toLocaleTimeString('uk-UA') : '--:--:--'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold text-[#a2a5b9] bg-[#151521] border border-white/[0.05] px-2.5 py-1 rounded uppercase tracking-wider">
                          {log.server_id || 'UNKNOWN'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">
                            <Settings size={12} className="text-[#3699ff]" /> {log.component || 'System'}
                          </div>
                          <span className="text-white font-semibold text-xs">
                            {log.action || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${getStatusStyle(log.status)}`}>
                          {log.status || 'INFO'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2 text-[#a2a5b9] font-medium max-w-md lg:max-w-xl xl:max-w-2xl text-xs">
                          <FileText size={14} className="text-[#a2a5b9] opacity-50 flex-shrink-0 mt-0.5" />
                          <span className="truncate" title={log.details}>{log.details || '-'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="p-2 text-[#a2a5b9] hover:text-[#f64e60] hover:bg-[#f64e60]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-[#f64e60]/20"
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