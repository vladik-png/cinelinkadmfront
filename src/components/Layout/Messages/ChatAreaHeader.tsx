import * as React from 'react';
import { MoreVertical, ArrowLeft } from 'lucide-react';
import { IconButton } from '../../UI/IconButton';
import { Avatar } from '../../UI/Avatar';

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
                    <h2 className="text-white font-bold text-sm leading-tight">{activeChatName}</h2>
                    <p className="text-xs text-[#1bc5bd] font-medium mt-0.5">
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            <IconButton size="md">
                <MoreVertical size={20} />
            </IconButton>
        </div>
    );
};
