import * as React from 'react';
import { X, ShieldAlert, UserCircle, Calendar, MessageSquare } from 'lucide-react';
import { UserReport } from '../../../types/moderation';
import { formatDate } from '../../../utils/dateHelpers';

interface UserReportModalProps {
    report: UserReport;
    targetUser?: any;
    reporterUser?: any;
    onClose: () => void;
    onStatusChange: (reportId: number, status: string) => Promise<void>;
    onViewProfile: (userId: number) => void;
}

export const UserReportModal: React.FC<UserReportModalProps> = ({ report, targetUser, reporterUser, onClose, onStatusChange, onViewProfile }) => {
    const [loading, setLoading] = React.useState(false);
    const { date, time } = formatDate(report.created_at);

    const handleStatusUpdate = async (status: string) => {
        setLoading(true);
        await onStatusChange(report.report_id, status);
        setLoading(false);
        onClose();
    };

    const renderUser = (user: any, fallbackId: number, label: string) => (
        <div 
            className="bg-[#151521] p-4 rounded-xl border border-white/[0.05] flex items-center gap-4 cursor-pointer hover:bg-[#1e1e2d] transition-colors group"
            onClick={() => onViewProfile(user?.user_id || fallbackId)}
        >
            <div className="relative flex-shrink-0">
                {user && user.avatar_url ? (
                    <img src={user.avatar_url} className="w-12 h-12 rounded-lg object-cover border border-white/[0.1]" alt="avatar" />
                ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold border bg-white/[0.05] border-white/[0.1] text-white">
                        {user?.first_name?.[0] || <UserCircle size={20} />}
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-1 group-hover:text-white transition-colors">{label}</p>
                <h3 className="text-sm font-bold tracking-wide truncate text-white group-hover:text-[#3699ff] transition-colors">
                    {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : `User ${fallbackId}`}
                </h3>
                {user && <p className="text-xs text-[#3699ff] font-semibold mt-0.5 tracking-wider">@{user.username}</p>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] border border-white/[0.05] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                
                <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-[#151521]/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#f1416c]/10 p-2 rounded-lg text-[#f1416c]">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-wide">Report Details</h2>
                            <p className="text-xs text-[#a2a5b9] font-mono mt-1">ID: #{report.report_id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#a2a5b9] hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-full transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {renderUser(reporterUser, report.from_user_id, 'Reported By')}
                        {renderUser(targetUser, report.user_id, 'Target User')}
                    </div>

                    <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.05]">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={16} className="text-[#3699ff]" />
                            <h3 className="text-sm font-bold text-white tracking-wide">Topic / Reason</h3>
                        </div>
                        <p className="text-sm text-[#a2a5b9] leading-relaxed">{report.topic || 'No topic provided.'}</p>
                    </div>

                    <div className="flex items-center justify-between bg-[#151521] p-4 rounded-xl border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[#a2a5b9]" />
                            <div>
                                <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest">Date</p>
                                <p className="text-sm font-semibold text-white mt-0.5">{date} {time && <span className="text-[#a2a5b9] font-mono ml-2">{time}</span>}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-[#a2a5b9] uppercase font-bold tracking-widest mb-1">Current Status</p>
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                                report.status?.toLowerCase() === 'approved' ? 'bg-[#50cd89]/10 text-[#50cd89] border-[#50cd89]/20' :
                                report.status?.toLowerCase() === 'pending' ? 'bg-[#ffc700]/10 text-[#ffc700] border-[#ffc700]/20' :
                                'bg-[#f1416c]/10 text-[#f1416c] border-[#f1416c]/20'
                            }`}>
                                {report.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/[0.05] bg-[#151521]/30 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#a2a5b9]">Update Status:</p>
                    <div className="flex gap-2">
                        <button
                            disabled={loading || report.status?.toLowerCase() === 'rejected'}
                            onClick={() => handleStatusUpdate('Rejected')}
                            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors bg-[#f1416c]/10 text-[#f1416c] hover:bg-[#f1416c]/20 border border-[#f1416c]/20 disabled:opacity-50 cursor-pointer"
                        >
                            Reject
                        </button>
                        <button
                            disabled={loading || report.status?.toLowerCase() === 'approved'}
                            onClick={() => handleStatusUpdate('Approved')}
                            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors bg-[#50cd89]/10 text-[#50cd89] hover:bg-[#50cd89]/20 border border-[#50cd89]/20 disabled:opacity-50 cursor-pointer"
                        >
                            Approve
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
