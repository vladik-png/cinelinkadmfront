import * as React from 'react';
import { MoreVertical, ArrowLeft } from 'lucide-react';

interface ChatAreaHeaderProps {
    activeChatName: string;
    activeChatAvatar: string;
    isOnline: boolean;
    onBack?: () => void;
}

export const ChatAreaHeader: React.FC<ChatAreaHeaderProps> = ({
    activeChatName,
    activeChatAvatar,
    isOnline,
    onBack
}) => {
    return (
        <div className="h-20 px-4 md:px-8 border-b border-white/[0.05] bg-[#1e1e2d]/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3 md:gap-4">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 text-[#a2a5b9] hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <img src={activeChatAvatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                <div>
                    <h2 className="text-white font-bold text-sm leading-tight">{activeChatName}</h2>
                    <p className="text-xs text-[#1bc5bd] font-medium mt-0.5">
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-[#a2a5b9]">
                <MoreVertical size={20} />
            </button>
        </div>
    );
};
