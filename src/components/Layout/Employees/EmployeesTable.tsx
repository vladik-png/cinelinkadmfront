import * as React from 'react';
import { EmployeeData, SortKey, SortDirection } from '../../../types/employee';
import { formatDate } from '../../../utils/dateHelpers';
import { Mail, UserCircle, MapPin, Building2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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
            return <ArrowUpDown size={14} className="text-white/[0.2] group-hover:text-white/[0.5] transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-[#3699ff]" />
            : <ArrowDown size={14} className="text-[#3699ff]" />;
    };

    return (
        <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-[#a2a5b9] select-none">
                            <th className="py-5 px-6 w-24 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('id')}>
                                <div className="flex items-center justify-center gap-2">ID <SortIcon columnKey="id" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('name')}>
                                <div className="flex items-center gap-2">Staff Profile <SortIcon columnKey="name" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group" onClick={() => onSort('location')}>
                                <div className="flex items-center gap-2">Location <SortIcon columnKey="location" /></div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-2">Contact Info</div>
                            </th>
                            <th className="py-5 px-6 cursor-pointer hover:text-white hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-2">Onboarding</div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee) => {
                            const { date, time } = employee.created_at ? formatDate(employee.created_at) : { date: 'N/A', time: '' };

                            return (
                                <tr
                                    key={employee.employee_id}
                                    onClick={() => onViewEmployee(employee)}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                >
                                    <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                                        #{employee.employee_id}
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                {employee.avatar_url ? (
                                                    <img src={employee.avatar_url} className="w-10 h-10 rounded-lg object-cover border border-white/[0.1]" alt="avatar" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold border bg-white/[0.05] border-white/[0.1] text-white">
                                                        {employee.first_name?.[0] || 'E'}
                                                    </div>
                                                )}
                                                <div className="absolute -top-1.5 -right-1.5 bg-[#1bc5bd] text-white p-0.5 rounded-full border-2 border-[#1e1e2d] w-3 h-3"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-bold uppercase tracking-wide truncate transition-colors text-white group-hover:text-[#3699ff]">
                                                    {employee.first_name} {employee.last_name}
                                                </h3>
                                                <p className="text-[10px] text-[#3699ff] font-semibold mt-0.5 tracking-wider">{employee.department || 'Administrator'}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-[#a2a5b9] group-hover:text-white transition-colors">
                                            <MapPin size={14} className="text-[#a2a5b9]" />
                                            <span className="text-xs font-medium truncate max-w-[200px]">{employee.location || 'Unknown'}</span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-[#a2a5b9] group-hover:text-white transition-colors">
                                            <Mail size={14} className="text-[#a2a5b9]" />
                                            <span className="text-xs font-medium truncate max-w-[200px]">{employee.email || 'N/A'}</span>
                                        </div>
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
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {employees.length === 0 && !loading && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-[#a2a5b9]">
                        <UserCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium uppercase tracking-widest">No staff found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
