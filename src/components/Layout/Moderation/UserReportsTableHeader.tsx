import * as React from 'react';
import { UserReport } from '../../../types/moderation';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface UserReportsTableHeaderProps {
  sort: { key: keyof UserReport | ''; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof UserReport) => void;
}

export const UserReportsTableHeader: React.FC<UserReportsTableHeaderProps> = ({ sort, onSortChange }) => {
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
  );
};
