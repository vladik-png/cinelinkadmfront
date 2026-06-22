import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldAlert, UserCircle } from 'lucide-react';
import { formatDate } from '../../../utils/dateHelpers';

interface UserReportsTableProps {
  reports: UserReport[];
  usersMap?: Record<number, any>;
  loading: boolean;
  sort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof UserReport) => void;
  onViewProfile: (userId: number) => void;
  onReportClick: (report: UserReport) => void;
}

export const UserReportsTable: React.FC<UserReportsTableProps> = ({
  reports,
  usersMap = {},
  loading,
  sort,
  onSortChange,
  onViewProfile,
  onReportClick
}) => {
  const SortIcon = ({ columnKey }: { columnKey: keyof UserReport }) => {
    if (sort.key !== columnKey) {
        return <ArrowUpDown size={14} className="text-white/[0.2] group-hover:text-white/[0.5] transition-opacity" />;
    }
    return sort.direction === 'asc'
        ? <ArrowUp size={14} className="text-[#3699ff]" />
        : <ArrowDown size={14} className="text-[#3699ff]" />;
  };

  const renderSortableHeader = (label: string, columnName: keyof UserReport, align: 'left' | 'center' | 'right' = 'left') => (
    <th 
      className={`py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group text-${align}`}
      onClick={() => onSortChange(columnName)}
    >
      <div className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
        {label} <SortIcon columnKey={columnName} />
      </div>
    </th>
  );

  const renderUserCell = (userId: number) => {
    const user = usersMap[userId];
    return (
      <div 
        className="flex items-center gap-4 cursor-pointer group/user"
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile(userId);
        }}
      >
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
            <h3 className={`text-sm font-bold tracking-wide truncate transition-colors text-white group-hover/user:text-[#3699ff]`}>
                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : `User ${userId}`}
            </h3>
            {user && <p className="text-[10px] text-[#3699ff] font-semibold mt-0.5 tracking-wider">@{user.username}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-[#a2a5b9] select-none">
              {renderSortableHeader('ID', 'report_id', 'center')}
              {renderSortableHeader('Target User', 'user_id')}
              {renderSortableHeader('Reported By', 'from_user_id')}
              {renderSortableHeader('Topic', 'topic')}
              {renderSortableHeader('Date', 'created_at')}
              {renderSortableHeader('Status', 'status', 'center')}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const { date, time } = formatDate(report.created_at);
              return (
                <tr 
                  key={report.report_id} 
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => onReportClick(report)}
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
                    <span className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      report.status?.toLowerCase() === 'approved' ? 'bg-[#50cd89]/10 text-[#50cd89] border-[#50cd89]/20' :
                      report.status?.toLowerCase() === 'pending' ? 'bg-[#ffc700]/10 text-[#ffc700] border-[#ffc700]/20' :
                      'bg-[#f1416c]/10 text-[#f1416c] border-[#f1416c]/20'
                    }`}>
                      {report.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {reports.length === 0 && !loading && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
            <ShieldAlert size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium uppercase tracking-widest">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};
