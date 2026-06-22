import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { X, Hexagon } from 'lucide-react';

interface EmployeeProfileHeaderProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee, onClose }) => {
    return (
        <>
            <div
                className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05]"
                style={{ backgroundImage: employee.bg_img_url ? `url(${employee.bg_img_url})` : 'none' }}
            >
                {!employee.bg_img_url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Hexagon size={80} className="text-[#3699ff] fill-[#3699ff]" />
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[#a2a5b9] hover:text-white bg-[#151521]/50 border border-white/[0.05] rounded-full backdrop-blur-md transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-left">
                <img
                    src={employee.avatar_url || 'https://via.placeholder.com/150'}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-[#1e1e2d] shadow-xl object-cover bg-[#151521]"
                    alt="profile"
                />
                <div className="pb-1">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                        {employee.first_name} {employee.last_name}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1bc5bd] shadow-[0_0_8px_rgba(27,197,189,0.5)]"></span>
                        <p className="text-[#1bc5bd] font-bold uppercase text-[10px] tracking-widest">Active Member</p>
                    </div>
                </div>
            </div>
        </>
    );
};
