import * as React from 'react';
import { SortKey, SortDirection } from '../../../types/user';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface UsersTableHeaderProps {
    sortConfig: { key: SortKey; direction: SortDirection };
    onSort: (key: SortKey) => void;
}

export const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({ sortConfig, onSort }) => {
    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown size={14} className="text-white/[0.2] group-hover:text-white/[0.5] transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-[#3699ff]" />
            : <ArrowDown size={14} className="text-[#3699ff]" />;
    };

    return (
        <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-[#a2a5b9] select-none">
                <th className="py-5 px-6 w-24 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('id')}>
                    <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('name')}>
                    <div className="flex items-center gap-2">User Profile <SortIcon columnKey="name" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('email')}>
                    <div className="flex items-center gap-2">Contact Info <SortIcon columnKey="email" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('date')}>
                    <div className="flex items-center gap-2">Registration <SortIcon columnKey="date" /></div>
                </th>
                <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group text-center" onClick={() => onSort('status')}>
                    <div className="flex items-center justify-center gap-2">Status <SortIcon columnKey="status" /></div>
                </th>
                <th className="py-5 px-6 text-right">Actions</th>
            </tr>
        </thead>
    );
};
