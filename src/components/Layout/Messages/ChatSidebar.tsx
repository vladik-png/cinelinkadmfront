import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Chat } from '../../../types/chat';

interface ChatSidebarProps {
    chats: Chat[];
    activeChatId: number | null;
    loading: boolean;
    onChatClick: (id: number) => void;
    getChatName: (chat: Chat) => string;
    getChatAvatar: (chat: Chat) => string;
    onDeleteChat?: (id: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    activeChatId,
    loading,
    onChatClick,
    getChatName,
    getChatAvatar,
    onDeleteChat
}) => {
    return (
        <div className="w-full max-w-sm border-r border-white/[0.05] flex flex-col bg-[#1e1e2d] h-full min-h-0">
            <div className="p-6 border-b border-white/[0.05]">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3699ff] to-[#8950fc] bg-clip-text text-transparent mb-4">Messages</h1>
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a5b9]" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full bg-[#151521] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 custom-scrollbar">
                {loading && chats.length === 0 ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="flex items-center gap-4 p-3 rounded-xl border border-transparent">
                            <div className="w-12 h-12 rounded-full bg-white/[0.05] animate-pulse flex-shrink-0"></div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-white/[0.05] animate-pulse rounded"></div>
                                    <div className="h-3 w-10 bg-white/[0.05] animate-pulse rounded"></div>
                                </div>
                                <div className="h-3 w-3/4 bg-white/[0.05] animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))
                ) : chats.length === 0 ? (
                    <div className="p-4 text-center text-sm">No chats found.</div>
                ) : (
                    chats.map(chat => (
                        <div
                            key={chat.chat_id}
                            onClick={() => onChatClick(chat.chat_id)}
                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors group ${activeChatId === chat.chat_id ? 'bg-white/[0.05] border border-white/[0.05]' : 'hover:bg-white/[0.02] border border-transparent'}`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={getChatAvatar(chat)} className="w-12 h-12 rounded-full object-cover bg-[#151521]" alt="avatar" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm truncate font-semibold text-white`}>
                                        {getChatName(chat)}
                                    </h3>
                                    {chat.last_message?.timestamp && (
                                        <span className="text-[10px] font-medium text-[#a2a5b9]">
                                            {new Date(chat.last_message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center group/item">
                                    <p className={`text-xs truncate max-w-[150px] text-[#a2a5b9]`}>
                                        {chat.last_message?.message?.toString() || 'No messages yet'}
                                    </p>
                                    {onDeleteChat && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteChat(chat.chat_id);
                                            }}
                                            className="text-[#f64e60] opacity-0 group-hover:opacity-100 hover:bg-[#f64e60]/20 p-1.5 rounded-md transition-all"
                                            title="Delete Chat"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
