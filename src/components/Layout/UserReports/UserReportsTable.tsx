import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { ShieldAlert } from 'lucide-react';
import { UserReportsTableHeader } from './UserReportsTableHeader';
import { UserReportsTableSkeleton } from './UserReportsTableSkeleton';
import { UserReportsTableRow } from './UserReportsTableRow';

interface UserReportsTableProps {
  reports: UserReport[];
  usersMap?: Record<number, any>;
  loading: boolean;
  sort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof UserReport) => void;
  onReportClick: (report: UserReport) => void;
}

export const UserReportsTable: React.FC<UserReportsTableProps> = ({
  reports,
  usersMap = {},
  loading,
  sort,
  onSortChange,
  onReportClick
}) => {
  return (
    <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <UserReportsTableHeader sort={sort} onSortChange={onSortChange} />
          
          <tbody>
            {loading && reports.length === 0 ? (
                <UserReportsTableSkeleton />
            ) : (
                reports.map((report) => (
                    <UserReportsTableRow 
                        key={report.report_id} 
                        report={report} 
                        usersMap={usersMap} 
                        onReportClick={onReportClick} 
                    />
                ))
            )}
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
