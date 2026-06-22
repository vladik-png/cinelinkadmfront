import * as React from 'react';
import { Database } from 'lucide-react';
import { ServerLog } from '../../../types/moderation';
import { LogsTableRow } from './LogsTableRow';
import { LogsTableSkeleton } from './LogsTableSkeleton';

interface LogsTableProps {
    logs: ServerLog[];
    loading: boolean;
    onDeleteLog: (id: number) => void;
}

export const LogsTable: React.FC<LogsTableProps> = ({ logs, loading, onDeleteLog }) => {
    return (
        <section className="bg-[#1e1e2d] border border-white/[0.05] rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/[0.05] bg-[#151521]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Database size={20} className="text-[#3699ff]" />
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Global Event Registry</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
                        {loading && logs.length === 0 ? (
                            <LogsTableSkeleton />
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-[#a2a5b9] uppercase text-xs font-bold tracking-widest">
                                    No logs found in database
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <LogsTableRow key={log.id} log={log} onDeleteLog={onDeleteLog} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};