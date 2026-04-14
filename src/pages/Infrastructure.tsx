import * as React from 'react';
import { useEffect, useState } from 'react';
import { getInfrastructureData, performPowerAction } from '../api/infraService';
import axios from 'axios';
import { RefreshCcw, Activity, Server, Cpu, HardDrive, MapPin, Globe, Thermometer, Wifi, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Вказуємо адреси твоїх двох Мастерів
const WINDOWS_API = 'http://e7dd0f5572ff.sn.mynetname.net:8080';
const KAMATERA_API = 'http://185.227.108.14:8081';

interface UnifiedServer {
  id: string;
  name: string;
  type: 'AWS' | 'WINDOWS' | 'KAMATERA';
  state: string;
  ip?: string;
  cpu?: number | string;
  temp?: number | string;
  ram?: number | string;
  ping?: number | string;
  packetLoss?: number;
  disk?: string;
  location?: string;
  uptime?: string;
  rawAwsData?: any; 
}

const Infrastructure: React.FC = () => {
  const [servers, setServers] = useState<UnifiedServer[]>([]);
  const [region, setRegion] = useState<string>('FETCHING...');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Отримуємо дані AWS
      let awsServers: UnifiedServer[] = [];
      let awsRegion = 'UNKNOWN';
      try {
        const awsData = await getInfrastructureData();
        awsRegion = awsData.region;
        
        awsServers = awsData.instances.map((inst: any) => {
          const nameTag = inst.Tags?.find((t: any) => t.Key === 'Name');
          return {
            id: inst.InstanceId,
            name: nameTag ? nameTag.Value : 'Unnamed AWS Node',
            type: 'AWS',
            state: inst.State?.Name || 'unknown',
            ip: inst.PublicIpAddress || 'No Public IP',
            rawAwsData: inst 
          };
        });
      } catch (err) {
        console.error("Помилка AWS API:", err);
      }

      // 2. Отримуємо дані Windows (порт 8080)
      let winServers: UnifiedServer[] = [];
      try {
        const winRes = await axios.get(`${WINDOWS_API}/system-metrics`);
        winServers = Object.values(winRes.data).map((s: any) => ({
          id: s.instance_id,
          name: s.device_name || 'Windows Server',
          type: 'WINDOWS',
          state: 'running', 
          ip: s.public_ip,
          cpu: s.cpu_usage ?? s.cpu ?? 0,
          temp: s.cpu_temp ?? 0,
          ping: s.ping ?? 0,
          packetLoss: parseFloat(s.packet_loss) || 0,
          ram: s.ram ?? 0,
          disk: s.disk,
          location: s.location,
          uptime: s.time
        }));
      } catch (err) {
        console.error("Помилка Windows Agent API:", err);
      }

      // 3. Отримуємо дані Kamatera Linux (порт 8081)
      let kamServers: UnifiedServer[] = [];
      try {
        const kamRes = await axios.get(`${KAMATERA_API}/system-metrics`);
        kamServers = Object.values(kamRes.data).map((s: any) => ({
          id: s.instance_id,
          name: s.device_name || 'Kamatera Linux Server',
          type: 'KAMATERA',
          state: 'running', 
          ip: s.public_ip,
          cpu: s.cpu_usage ?? s.cpu ?? 0,
          temp: s.cpu_temp ?? 0,
          ping: s.ping ?? 0,
          packetLoss: parseFloat(s.packet_loss) || 0,
          ram: s.ram ?? 0,
          disk: s.disk,
          location: s.location,
          uptime: s.time
        }));
      } catch (err) {
        console.error("Помилка Kamatera Agent API:", err);
      }

      // 4. Об'єднуємо всі сервери в один список
      setServers([...awsServers, ...winServers, ...kamServers]);
      setRegion(awsRegion);

    } catch (err) {
      console.error("Global Infrastructure Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePowerAction = async (action: 'start' | 'stop', id: string) => {
    console.log(`Запит на ${action} для вузла: ${id}`);
    try {
      const result = await performPowerAction(action, id);
      console.log(`Сервер відповів:`, result);
      setTimeout(fetchData, 1000); 
    } catch (err: any) {
      console.error(`Помилка дії ${action}:`, err.message);
      alert(`Не вдалося виконати дію: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const themeColor = '#0f172a';

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] min-h-screen font-medium">
      <div style={{ backgroundColor: themeColor }} className="py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md text-white">
        <h2 className="text-sm tracking-widest uppercase font-bold flex items-center gap-2">
          <Globe size={18} className="text-blue-400" />
          Hybrid Infrastructure Center
        </h2>
        <div className="bg-[#1e293b] text-blue-400 text-[10px] px-4 py-1.5 rounded-lg border border-blue-600/20 uppercase tracking-widest">
          AWS Region: <span className="text-white ml-1">{region}</span>
        </div>
      </div>

      <div className="p-10 w-full">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl text-slate-800 uppercase tracking-tighter font-black">System Nodes</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em]">AWS, Linux & Windows Control Pipeline</p>
          </div>
          <button 
            onClick={fetchData}
            style={{ backgroundColor: themeColor }}
            className="p-5 text-white rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 border border-slate-700/50"
          >
            <RefreshCcw size={28} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {servers.map((server) => {
            const isRunning = server.state === 'running';
            const isTransitioning = ['pending', 'stopping', 'starting', 'shutting-down'].includes(server.state);
            const isWindows = server.type === 'WINDOWS';
            const isKamatera = server.type === 'KAMATERA';
            const hasMetrics = isWindows || isKamatera; // Метрики є у обох агентів

            let tempColor = 'text-slate-700';
            if (server.temp && Number(server.temp) >= 80) tempColor = 'text-rose-500';
            else if (server.temp && Number(server.temp) >= 65) tempColor = 'text-amber-500';

            return (
              <div 
                key={server.id} 
                onClick={() => navigate(`/analytics?node=${server.id}`)}
                className={`cursor-pointer bg-white rounded-[1.5rem] border shadow-sm p-8 hover:shadow-md transition-all border-t-2 ${
                  isWindows ? 'border-t-indigo-500/50' : isKamatera ? 'border-t-cyan-500/50' : 'border-t-orange-500/50'
                }`}
              >
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-xl transition-all shadow-lg ${
                    isRunning 
                    ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200/20' 
                    : 'bg-rose-100 text-rose-600 shadow-rose-200/20'
                  }`}>
                    {isWindows || isKamatera ? <Server size={24} /> : <Activity size={24} />}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border font-bold ${
                      isWindows ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                      isKamatera ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {isKamatera ? 'LINUX NODE' : `${server.type} NODE`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-widest border ${
                      isRunning ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {server.state}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-slate-800 font-black mb-2 truncate tracking-tight">
                    {isKamatera ? 'Kamatera Linux Server' : server.name}
                  </h3>
                  <code className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded tracking-tight">{server.id}</code>
                </div>

                {/* Плитки метрик відображаються для Windows І для Linux */}
                {hasMetrics && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Cpu size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">CPU</span>
                        </div>
                        <p className="font-bold text-slate-700 text-sm">{server.cpu}%</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Thermometer size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">TEMP</span>
                        </div>
                        <p className={`font-bold text-sm ${tempColor}`}>{server.temp}°C</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Activity size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">RAM</span>
                        </div>
                        <p className="font-bold text-slate-700 text-sm">{server.ram} GB</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Wifi size={12} />
                          <span className="text-[8px] uppercase tracking-widest font-black">PING</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="font-bold text-slate-700 text-sm">{server.ping}</p>
                          <span className="text-[8px] text-slate-400 font-bold">ms</span>
                        </div>
                     </div>

                     {server.packetLoss !== undefined && server.packetLoss > 0 && (
                        <div className="col-span-2 bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-rose-500" />
                            <span className="text-[9px] uppercase tracking-widest font-black text-rose-600">Packet Loss</span>
                          </div>
                          <span className="text-xs font-bold text-rose-600">{server.packetLoss}%</span>
                        </div>
                     )}

                     <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin size={12} className={isKamatera ? "text-cyan-500" : "text-blue-500"} />
                          <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-[120px]">{server.location}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{server.ip}</span>
                     </div>
                  </div>
                )}

                {/* Якщо це AWS (не має метрик), показуємо спрощену плашку */}
                {!hasMetrics && (
                  <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-500">
                    <Globe size={14} className="text-orange-400"/>
                    <span className="text-[10px] font-mono font-bold">{server.ip || 'No IP'}</span>
                  </div>
                )}

                {/* Кнопки Start/Stop для AWS (без метрик) */}
                {!hasMetrics && (
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePowerAction('start', server.id); }}
                      disabled={isRunning || isTransitioning}
                      style={{ backgroundColor: themeColor }}
                      className="flex-1 text-white py-3 rounded-xl text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-20 transition-all shadow-sm font-bold"
                    >
                      Start
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePowerAction('stop', server.id); }}
                      disabled={!isRunning || isTransitioning}
                      className="flex-1 border border-slate-200 text-slate-400 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all disabled:opacity-20 font-bold"
                    >
                      Stop
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;