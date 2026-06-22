import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { X, Hexagon } from 'lucide-react';
import { Avatar } from '../../UI/Avatar';
import { IconButton } from '../../UI/IconButton';

interface EmployeeProfileHeaderProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee, onClose }) => {
    return (
        <>
            <div
                className="h-32 bg-[#151521] relative bg-cover bg-center border-b border-white/[0.05] rounded-t-[2rem]"
                style={{ backgroundImage: employee.bg_img_url ? `url(${employee.bg_img_url})` : 'none' }}
            >
                {!employee.bg_img_url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Hexagon size={80} className="text-[#3699ff] fill-[#3699ff]" />
                    </div>
                )}
                <IconButton
                    onClick={onClose}
                    variant="ghost"
                    className="absolute top-4 right-4 !bg-[#151521]/50 border border-white/[0.05] !rounded-full backdrop-blur-md"
                >
                    <X size={18} />
                </IconButton>
            </div>

            <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-left px-4 sm:px-10">
                <Avatar 
                    src={employee.avatar_url || 'https://via.placeholder.com/150'}
                    fallbackInitials={employee.first_name?.[0]}
                    size="xl"
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
