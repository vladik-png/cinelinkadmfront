import * as React from 'react';
import { Settings, FileText, Trash2 } from 'lucide-react';
import { ServerLog } from '../../../types/moderation';
import { getStatusStyle } from '../../../utils/moderationStyles';

interface LogsTableRowProps {
    log: ServerLog;
    onDeleteLog: (id: number) => void;
}

export const LogsTableRow: React.FC<LogsTableRowProps> = ({ log, onDeleteLog }) => {
    return (
        <tr className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
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
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2 text-[#a2a5b9] hover:text-[#f64e60] hover:bg-[#f64e60]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-[#f64e60]/20"
                    title="Delete Log"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};
