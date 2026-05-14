import * as React from 'react';
import { Activity, CheckCircle, Zap, AlertTriangle } from 'lucide-react';
import { ServerAlert } from '../../../types/moderation';

interface AlertsSectionProps {
    alerts: ServerAlert[];
    filteredAlerts: ServerAlert[];
    onResolveAlert: (id: number) => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, filteredAlerts, onResolveAlert }) => {
    return (
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
                                    onClick={() => onResolveAlert(alert.id)}
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
    );
};