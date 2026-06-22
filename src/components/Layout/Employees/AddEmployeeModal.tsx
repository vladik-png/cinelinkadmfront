import * as React from 'react';
import { X, UserPlus } from 'lucide-react';
import { EmployeeData } from '../../../types/employee';
import { AddEmployeeForm } from './AddEmployeeForm';

interface AddEmployeeModalProps {
    onClose: () => void;
    onAdd: (employee: Partial<EmployeeData>) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onAdd }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e2d] w-full max-w-md rounded-2xl border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-[#151521]/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3699ff]/10 rounded-lg text-[#3699ff]">
                            <UserPlus size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Employee</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#a2a5b9] hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>

                <AddEmployeeForm onClose={onClose} onAdd={onAdd} />
            </div>
        </div>
    );
};