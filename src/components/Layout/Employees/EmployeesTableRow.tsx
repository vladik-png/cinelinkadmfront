import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { formatDate } from '../../../utils/dateHelpers';
import { MapPin, Mail } from 'lucide-react';

interface EmployeesTableRowProps {
    employee: EmployeeData;
    index: number;
    onViewEmployee: (employee: EmployeeData) => void;
}

export const EmployeesTableRow: React.FC<EmployeesTableRowProps> = ({ employee, index, onViewEmployee }) => {
    const { date, time } = employee.created_at ? formatDate(employee.created_at) : { date: 'Not specified', time: '' };
    const displayId = employee.employee_id || (employee as any).id || `N/A-${index}`;

    return (
        <tr
            onClick={() => onViewEmployee(employee)}
            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group"
        >
            <td className="py-4 px-6 text-center text-[#a2a5b9] font-mono text-xs">
                #{displayId}
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
                    <span className="text-xs font-medium truncate max-w-[200px]">{employee.email || employee.phone || 'Not specified'}</span>
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
    );
};
