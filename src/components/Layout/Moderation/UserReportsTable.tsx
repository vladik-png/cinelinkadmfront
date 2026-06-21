import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface UserReportsTableProps {
  reports: UserReport[];
  loading: boolean;
  sort: string;
  onSortChange: (sort: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const UserReportsTable: React.FC<UserReportsTableProps> = ({
  reports,
  loading,
  sort,
  onSortChange,
  onLoadMore,
  hasMore
}) => {
  const getSortIcon = (columnName: string) => {
    if (sort === columnName) return <ChevronUp size={14} />;
    if (sort === `-${columnName}`) return <ChevronDown size={14} />;
    return <ChevronUp size={14} className="opacity-20" />;
  };

  const handleSortClick = (columnName: string) => {
    if (sort === columnName) {
      onSortChange(`-${columnName}`);
    } else if (sort === `-${columnName}`) {
      onSortChange(''); // Reset sort
    } else {
      onSortChange(columnName);
    }
  };

  const renderSortableHeader = (label: string, columnName: string) => (
    <th 
      className="text-left py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9] cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSortClick(columnName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {getSortIcon(columnName)}
      </div>
    </th>
  );

  return (
    <div className="bg-[#1e1e2d] rounded-xl border border-white/[0.05] overflow-hidden">
      <div className="p-5 border-b border-white/[0.05]">
        <h2 className="text-lg text-white font-bold tracking-wide">User Reports</h2>
        <p className="text-xs text-[#a2a5b9] mt-1">Manage and review user submitted reports</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white/80">
          <thead className="bg-black/20 border-b border-white/[0.05]">
            <tr>
              {renderSortableHeader('Report ID', 'id')}
              {renderSortableHeader('User ID', 'user_id')}
              {renderSortableHeader('From User ID', 'from_user_id')}
              <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9]">Topic</th>
              <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-[#a2a5b9]">Status</th>
              {renderSortableHeader('Created At', 'created_at')}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.report_id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-mono text-xs">{report.report_id}</td>
                <td className="py-3 px-4 font-mono text-xs text-[#0095e8]">{report.user_id}</td>
                <td className="py-3 px-4 font-mono text-xs">{report.from_user_id}</td>
                <td className="py-3 px-4 text-[#50cd89] font-medium">{report.topic}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    report.status?.toLowerCase() === 'approved' ? 'bg-[#50cd89]/10 text-[#50cd89]' :
                    report.status?.toLowerCase() === 'pending' ? 'bg-[#ffc700]/10 text-[#ffc700]' :
                    'bg-[#f1416c]/10 text-[#f1416c]'
                  }`}>
                    {report.status || 'Pending'}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#a2a5b9] text-xs">
                  {new Date(report.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {reports.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#a2a5b9]">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/[0.05] flex justify-center">
        <button
          onClick={onLoadMore}
          disabled={!hasMore || loading}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Reports'}
        </button>
      </div>
    </div>
  );
};
