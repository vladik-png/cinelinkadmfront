import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { formatDate } from '../../../utils/dateHelpers';
import { UserCircle } from 'lucide-react';

interface UserReportsTableRowProps {
    report: UserReport;
    usersMap: Record<number, any>;
    onReportClick: (report: UserReport) => void;
}

export const UserReportsTableRow: React.FC<UserReportsTableRowProps> = ({ report, usersMap, onReportClick }) => {
    const { date, time } = formatDate(report.created_at);

    const renderUserCell = (userId: number) => {
        const user = usersMap[userId];
        return (
            <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    {user && user.avatar_url ? (
                        <img src={user.avatar_url} className={`w-10 h-10 rounded-lg object-cover border border-white/[0.1]`} alt="avatar" />
                    ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border bg-white/[0.05] border-white/[0.1] text-white`}>
                            {user?.first_name?.[0] || <UserCircle size={16} />}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className={`text-sm font-bold tracking-wide truncate transition-colors text-white`}>
                        {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : `User ${userId}`}
                    </h3>
                    {user && <p className="text-[10px] text-[#3699ff] font-semibold mt-0.5 tracking-wider">@{user.username}</p>}
                </div>
            </div>
        );
    };

    return (
        <tr
            onClick={() => onReportClick(report)}
            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
        >
            <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                #{report.report_id}
            </td>

            <td className="py-4 px-6">
                {renderUserCell(report.user_id)}
            </td>

            <td className="py-4 px-6">
                {renderUserCell(report.from_user_id)}
            </td>

            <td className="py-4 px-6">
                <span className="text-sm font-medium text-white">{report.topic}</span>
            </td>

            <td className="py-4 px-6">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{date}</span>
                    {time && (
                        <span className="text-[10px] font-semibold text-[#a2a5b9] mt-0.5 tracking-wider">
                            {time}
                        </span>
                    )}
                </div>
            </td>

            <td className="py-4 px-6 text-center">
                <span className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border ${report.status?.toLowerCase() === 'approved' ? 'bg-[#50cd89]/10 text-[#50cd89] border-[#50cd89]/20' :
                        report.status?.toLowerCase() === 'pending' ? 'bg-[#ffc700]/10 text-[#ffc700] border-[#ffc700]/20' :
                            'bg-[#f1416c]/10 text-[#f1416c] border-[#f1416c]/20'
                    }`}>
                    {report.status || 'Pending'}
                </span>
            </td>
        </tr>
    );
};
