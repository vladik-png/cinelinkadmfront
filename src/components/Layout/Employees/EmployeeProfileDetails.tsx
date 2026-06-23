import * as React from 'react';
import { EmployeeData } from '../../../types/employee';
import { Building2, Hash, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrCreateChat } from '../../../api/chatService';

interface EmployeeProfileDetailsProps {
    employee: EmployeeData;
    onClose: () => void;
}

export const EmployeeProfileDetails: React.FC<EmployeeProfileDetailsProps> = ({ employee, onClose }) => {
    const navigate = useNavigate();
    const [loadingChat, setLoadingChat] = React.useState(false);

    const handleMessageClick = async () => {
        const targetId = employee.employee_id;
        if (!targetId) {
            console.warn('Employee has no user_id, cannot open chat. employee:', employee);
            return;
        }
        
        try {
            setLoadingChat(true);
            const chatId = await getOrCreateChat(targetId as number);
            onClose();
            navigate(`/messages?chatId=${chatId}`);
        } catch (error) {
            console.error('Failed to create/get chat', error);
            onClose();
            navigate('/messages');
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
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

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleMessageClick}
                    disabled={loadingChat}
                    className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3699ff] to-[#8950fc] hover:opacity-90 text-white cursor-pointer disabled:opacity-50"
                >
                    <MessageCircle size={16} />
                    {loadingChat ? 'Connecting...' : 'Send Message'}
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 flex items-center justify-center gap-2 bg-[#3699ff]/10 hover:bg-[#3699ff]/20 text-[#3699ff] border border-[#3699ff]/20 cursor-pointer"
                >
                    Close Inspection
                </button>
            </div>
        </>
    );
};
