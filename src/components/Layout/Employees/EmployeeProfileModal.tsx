import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';
import { EmployeeProfileDetails } from './EmployeeProfileDetails';

interface EmployeeProfileModalProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] border border-white/[0.05] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <EmployeeProfileHeader employee={employee} onClose={onClose} />
                <div className="px-4 sm:px-10 pb-4 sm:pb-10">
                    <EmployeeProfileDetails employee={employee} onClose={onClose} />
                </div>
            </div>
        </div>
    );
};