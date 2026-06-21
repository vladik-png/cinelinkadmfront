import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldAlert, UserCircle } from 'lucide-react';
import { formatDate } from '../../../utils/dateHelpers';

interface UserReportsTableProps {
  reports: UserReport[];
  loading: boolean;
  sort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof UserReport) => void;
  onViewProfile: (userId: number) => void;
}

export const UserReportsTable: React.FC<UserReportsTableProps> = ({
  reports,
  loading,
  sort,
  onSortChange,
  onViewProfile
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
                <tr key={report.report_id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                    #{report.report_id}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div 
                      className="flex items-center gap-2 cursor-pointer group/user"
                      onClick={() => onViewProfile(report.user_id)}
                    >
                      <UserCircle size={16} className="text-[#a2a5b9] group-hover/user:text-[#3699ff] transition-colors" />
                      <span className="text-sm font-bold text-white group-hover/user:text-[#3699ff] transition-colors">User {report.user_id}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div 
                      className="flex items-center gap-2 cursor-pointer group/user"
                      onClick={() => onViewProfile(report.from_user_id)}
                    >
                      <UserCircle size={16} className="text-[#a2a5b9] group-hover/user:text-[#3699ff] transition-colors" />
                      <span className="text-sm font-bold text-white group-hover/user:text-[#3699ff] transition-colors">User {report.from_user_id}</span>
                    </div>
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
