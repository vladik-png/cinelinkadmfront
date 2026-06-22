import * as React from 'react';
import { UserCircle, MessageSquare, Calendar } from 'lucide-react';
import { UserReport } from '../../../types/moderation';

interface UserReportModalDetailsProps {
    report: UserReport;
    targetUser?: any;
    reporterUser?: any;
    date: string;
    time?: string;
    onViewProfile: (userId: number) => void;
}

export const UserReportModalDetails: React.FC<UserReportModalDetailsProps> = ({
    report,
    targetUser,
    reporterUser,
    date,
    time,
    onViewProfile
}) => {
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
        <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <p className="text-sm font-semibold text-white mt-0.5">
                            {date} {time && <span className="text-[#a2a5b9] font-mono ml-2">{time}</span>}
                        </p>
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
    );
};
