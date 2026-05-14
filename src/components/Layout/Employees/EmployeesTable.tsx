import * as React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin, Eye, UserCircle } from 'lucide-react';
import { EmployeeData, SortKey, SortDirection } from '../../../types/employee';

interface EmployeesTableProps {
    employees: EmployeeData[];
    loading: boolean;
    sortConfig: { key: SortKey; direction: SortDirection };
    onSort: (key: SortKey) => void;
    onViewEmployee: (employee: EmployeeData) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
    employees,
    loading,
    sortConfig,
    onSort,
    onViewEmployee
}) => {
    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown size={12} className="text-[#a2a5b9] opacity-0 group-hover:opacity-100 transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="text-[#3699ff]" />
            : <ArrowDown size={12} className="text-[#3699ff]" />;
    };

    return (
        <div className="bg-[#1e1e2d] border border-white/[0.05] rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#151521]/50 border-b border-white/[0.05] text-[10px] uppercase tracking-widest text-[#a2a5b9] select-none">
                            <th
                                className="py-5 px-6 font-bold w-24 text-center cursor-pointer hover:bg-white/[0.02] transition-colors group"
                                onClick={() => onSort('id')}
                            >
                                <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                            </th>
                            <th
                                className="py-5 px-6 font-bold cursor-pointer hover:bg-white/[0.02] transition-colors group"
                                onClick={() => onSort('name')}
                            >
                                <div className="flex items-center gap-2">Staff Profile <SortIcon columnKey="name" /></div>
                            </th>
                            <th
                                className="py-5 px-6 font-bold cursor-pointer hover:bg-white/[0.02] transition-colors group"
                                onClick={() => onSort('location')}
                            >
                                <div className="flex items-center gap-2">Location <SortIcon columnKey="location" /></div>
                            </th>
                            <th className="py-5 px-6 font-bold text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {employees.map((emp) => (
                            <tr
                                key={emp.employee_id}
                                onClick={() => onViewEmployee(emp)}
                                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            >
                                <td className="py-4 px-6 text-center text-[#a2a5b9] text-xs font-semibold">
                                    #{emp.employee_id}
                                </td>

                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={emp.avatar_url || 'https://via.placeholder.com/150'}
                                            className="w-10 h-10 rounded-xl object-cover border border-white/[0.05] bg-[#151521]"
                                            alt="avatar"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate uppercase tracking-wide">
                                                {emp.first_name} {emp.last_name}
                                            </h3>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2 text-[#a2a5b9]">
                                        <MapPin size={14} className="text-[#3699ff]" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest">{emp.location || 'Unknown Location'}</span>
                                    </div>
                                </td>

                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewEmployee(emp); }}
                                            className="p-2 text-[#3699ff] bg-[#3699ff]/10 hover:bg-[#3699ff]/20 rounded-lg transition-colors border border-[#3699ff]/20"
                                            title="Inspect Staff Profile"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {loading && employees.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#3699ff]/30 border-t-[#3699ff] rounded-full animate-spin mb-4"></div>
                        <p className="text-[#a2a5b9] uppercase text-[10px] font-bold tracking-widest">Syncing Database...</p>
                    </div>
                )}

                {employees.length === 0 && !loading && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
                        <UserCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">No staff found matching criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};