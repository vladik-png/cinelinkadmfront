import * as React from 'react';
import { EmployeeData, SortKey, SortDirection } from '../../../types/employee';
import { UserCircle } from 'lucide-react';
import { EmployeesTableHeader } from './EmployeesTableHeader';
import { EmployeesTableRow } from './EmployeesTableRow';
import { EmployeesTableSkeleton } from './EmployeesTableSkeleton';

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
    return (
        <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] flex-1 overflow-hidden flex flex-col shadow-lg">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <EmployeesTableHeader sortConfig={sortConfig} onSort={onSort} />
                    
                    <tbody>
                        {loading && employees.length === 0 ? (
                            <EmployeesTableSkeleton />
                        ) : (
                            employees.map((employee, index) => (
                                <EmployeesTableRow 
                                    key={employee._react_key} 
                                    employee={employee} 
                                    index={index} 
                                    onViewEmployee={onViewEmployee} 
                                />
                            ))
                        )}
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
