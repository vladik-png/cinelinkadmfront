import * as React from 'react';
import { MoreVertical, ArrowLeft } from 'lucide-react';
import { IconButton } from '../../UI/IconButton';
import { Avatar } from '../../UI/Avatar';

interface ChatAreaHeaderProps {
    activeChatName: string;
    activeChatAvatar: string;
    isOnline: boolean;
    lastSeen?: string | null;
    isAdmin?: boolean;
    onBack?: () => void;
}

export const ChatAreaHeader: React.FC<ChatAreaHeaderProps> = ({
    activeChatName,
    activeChatAvatar,
    isOnline,
    lastSeen,
    isAdmin,
    onBack
}) => {
    const formattedLastSeen = lastSeen ? new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    return (
        <div className="h-20 px-4 md:px-8 border-b border-white/[0.05] bg-[#1e1e2d]/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3 md:gap-4">
                {onBack && (
                    <IconButton 
                        onClick={onBack}
                        className="md:hidden -ml-2"
                        size="md"
                    >
                        <ArrowLeft size={20} />
                    </IconButton>
                )}
                <Avatar 
                    src={activeChatAvatar} 
                    fallbackInitials={activeChatName?.[0]}
                    size="md"
                />
                <div>
                    <h2 className="text-white font-bold text-sm leading-tight flex items-center gap-2">
                        {activeChatName}
                        {isAdmin && (
                            <span className="bg-[#f64e60]/20 text-[#f64e60] text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        )}
                    </h2>
                    <p className={`text-xs font-medium mt-0.5 flex items-center gap-1.5 ${isOnline ? 'text-[#1bc5bd]' : 'text-[#a2a5b9]'}`}>
                        {isOnline && <span className="w-2 h-2 rounded-full bg-[#1bc5bd]"></span>}
                        {isOnline ? 'Online' : formattedLastSeen ? `Останній раз був: ${formattedLastSeen}` : 'Offline'}
                    </p>
                </div>
            </div>
            <IconButton size="md">
                <MoreVertical size={20} />
            </IconButton>
        </div>
    );
};
