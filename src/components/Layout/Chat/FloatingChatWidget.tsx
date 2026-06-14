import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { getUserChats } from '../../../api/chatService';
import { Chat } from '../../../types/chat';

export const FloatingChatWidget: React.FC = () => {
    const navigate = useNavigate();
    const [chats, setChats] = React.useState<Chat[]>([]);

    React.useEffect(() => {
        getUserChats().then(data => {
            setChats(data || []);
        }).catch(err => {
            console.error('Failed to load chats for widget', err);
        });
    }, []);

    const totalUnread = 0;

    if (chats.length === 0) return null;

    return (
        <div
            onClick={() => navigate('/messages')}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#1e1e2d] border border-white/[0.05] p-2 pr-4 rounded-full shadow-2xl cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 group hover:-translate-y-1"
        >
            <div className="relative p-2 bg-[#151521] rounded-full group-hover:text-[#3699ff] text-[#a2a5b9] transition-colors">
                <MessageCircle size={20} />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f64e60] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#1e1e2d]">
                        {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                )}
            </div>

            <span className="text-sm font-semibold text-white hidden sm:block">Повідомлення</span>
        </div>
    );
};