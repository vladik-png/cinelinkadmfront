import * as React from 'react';
import { Mail, Phone, Calendar, MapPin, Briefcase, ShieldCheck, LogIn, Trash2, Hexagon, Hash } from 'lucide-react';
import { EmployeeData } from '../../../types/profile';
import { formatProfileDate } from '../../../utils/profileDateHelper';
import { InfoTile } from './InfoTile';

interface ProfileCardProps {
    emp: EmployeeData;
    onDeactivate: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ emp, onDeactivate }) => {
    return (
        <div className="bg-[#1e1e2d] rounded-2xl border border-white/[0.05] overflow-hidden shadow-lg max-w-6xl">
            <div className="h-48 md:h-56 bg-[#151521] relative border-b border-white/[0.05] overflow-hidden"
                style={{
                    backgroundImage: emp.bg_img_url ? `url(${emp.bg_img_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                {!emp.bg_img_url && (
                    <div className="absolute inset-0 bg-[#151521] flex items-center justify-center">
                        <Hexagon size={48} className="text-[#3699ff] fill-[#3699ff]/20" />
                    </div>
                )}
            </div>

            <div className="px-6 md:px-8 pb-12">
                <div className="flex justify-between items-start mb-4">
                    <div className="relative -mt-16 sm:-mt-20 z-10">
                        <img
                            src={emp.avatar_url || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=151521&color=3699ff`}
                            alt="Avatar"
                            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-[6px] border-[#1e1e2d] bg-[#151521] object-cover shadow-xl"
                        />
                        <div className="absolute bottom-2 right-2 bg-[#1bc5bd] w-8 h-8 rounded-full border-4 border-[#1e1e2d] flex items-center justify-center z-20">
                            <ShieldCheck size={14} className="text-[#1e1e2d]" />
                        </div>
                    </div>
                </div>

                <div className="mb-10 border-b border-white/[0.05] pb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-none">
                        {emp.first_name} {emp.last_name}
                    </h2>
                    <p className="text-[#3699ff] text-sm font-semibold uppercase tracking-widest mt-1.5 mb-4">
                        {emp.role_name || 'Administrator'}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#a2a5b9]">
                        <span className="flex items-center gap-1.5">
                            <Hash size={16} className="text-[#a2a5b9]" />
                            ID: {emp.employee_id}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-[#a2a5b9]" />
                            {emp.location || 'Unknown Location'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-[#a2a5b9]" />
                            Joined {formatProfileDate(emp.hire_date) !== 'N/A' ? formatProfileDate(emp.hire_date) : 'Recently'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <InfoTile icon={<Mail />} label="Corporate Email" value={emp.email} />
                    <InfoTile icon={<Phone />} label="Contact Phone" value={emp.phone || 'Not specified'} />
                    <InfoTile icon={<Calendar />} label="Hire Date" value={formatProfileDate(emp.hire_date)} />
                    <InfoTile icon={<Briefcase />} label="Department Unit" value={`Department #${emp.department_id || '0'}`} />
                    <InfoTile icon={<LogIn />} label="Last Activity" value={formatProfileDate(emp.last_login_at)} />
                </div>

                <div className="pt-8 border-t border-white/[0.05]">
                    <h3 className="text-sm font-semibold text-white mb-4">Danger Zone</h3>
                    <button
                        onClick={onDeactivate}
                        className="flex items-center gap-2 px-6 py-3 bg-[#f64e60]/10 hover:bg-[#f64e60]/20 text-[#f64e60] border border-[#f64e60]/20 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest"
                    >
                        <Trash2 size={16} />
                        Deactivate Account
                    </button>
                    <p className="text-xs text-[#a2a5b9] mt-2">
                        Deactivating this account will immediately revoke all system access.
                    </p>
                </div>
            </div>
        </div>
    );
};