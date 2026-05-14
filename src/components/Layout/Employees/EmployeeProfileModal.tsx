import * as React from 'react';
import { X, Hexagon, Building2, Hash } from 'lucide-react';
import { EmployeeData } from '../../../types/employee';

interface EmployeeProfileModalProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#151521]/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1e1e2d] border border-white/[0.05] w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
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
                        className="absolute top-4 right-4 p-2 text-[#a2a5b9] hover:text-white bg-[#151521]/50 border border-white/[0.05] rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-10 pb-10">
                    <div className="relative -mt-12 mb-8 flex items-end gap-5">
                        <img
                            src={employee.avatar_url || 'https://via.placeholder.com/150'}
                            className="w-28 h-28 rounded-full border-[6px] border-[#1e1e2d] shadow-xl object-cover bg-[#151521]"
                            alt="profile"
                        />
                        <div className="pb-1">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                                {employee.first_name} {employee.last_name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#1bc5bd] shadow-[0_0_8px_rgba(27,197,189,0.5)]"></span>
                                <p className="text-[#1bc5bd] font-bold uppercase text-[10px] tracking-widest">Active Member</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mb-8">
                        <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                            <p className="text-[10px] text-[#a2a5b9] uppercase font-bold mb-1 tracking-widest flex items-center gap-2 leading-none">
                                <Building2 size={12} className="text-[#3699ff]" /> Base Location
                            </p>
                            <p className="text-white font-semibold truncate text-sm mt-2">{employee.location || 'Unknown'}</p>
                        </div>
                        <div className="bg-[#151521] p-5 rounded-xl border border-white/[0.02]">
                            <p className="text-[10px] text-[#a2a5b9] uppercase font-bold mb-1 tracking-widest flex items-center gap-2 leading-none">
                                <Hash size={12} className="text-[#3699ff]" /> Staff ID Number
                            </p>
                            <p className="text-white font-semibold truncate text-sm mt-2">#{employee.employee_id}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-[#3699ff]/10 hover:bg-[#3699ff]/20 text-[#3699ff] border border-[#3699ff]/20"
                        >
                            Close Inspection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};