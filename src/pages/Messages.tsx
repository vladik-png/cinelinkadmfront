import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, CheckCheck, MessageCircle } from 'lucide-react';
import { Chat, DirectChat, GroupChat, ChatMessage } from '../types/chat';
import { getUserChats, getChatDetails, getChatMessages, sendMessage } from '../api/chatService';

const Messages: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlChatId = searchParams.get('chatId');

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatInfo, setActiveChatInfo] = useState<DirectChat | GroupChat | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(urlChatId ? parseInt(urlChatId, 10) : null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUserIdStr = localStorage.getItem('employee_id');
    const MY_ID = currentUserIdStr ? parseInt(currentUserIdStr, 10) : 1; 

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (urlChatId) {
            const parsed = parseInt(urlChatId, 10);
            if (!isNaN(parsed)) {
                setActiveChatId(parsed);
                fetchChatDetails(parsed);
                fetchMessages(parsed);
            } else {
                console.warn('Invalid chatId in URL:', urlChatId);
            }
        }
    }, [urlChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChats = async () => {
        try {
            const data = await getUserChats();
            setChats(data || []);
            if (!urlChatId && data?.length > 0) {
                const firstChatId = data[0].chat_id;
                setActiveChatId(firstChatId);
                fetchChatDetails(firstChatId);
                fetchMessages(firstChatId);
                setSearchParams({ chatId: firstChatId.toString() });
            }
        } catch (error) {
            console.error('Error fetching chats', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatDetails = async (id: number) => {
        try {
            const data = await getChatDetails(id);
            setActiveChatInfo(data);
        } catch (error) {
            console.error('Error fetching chat details', error);
        }
    };

    const fetchMessages = async (id: number) => {
        try {
            const data = await getChatMessages(id);
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages', error);
            setMessages([]);
        }
    };

    const handleChatClick = (id: number) => {
        setActiveChatId(id);
        setSearchParams({ chatId: id.toString() });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChatId || sending) return;

        const textToSend = messageInput.trim();
        setMessageInput(''); // Optimistic clear

        const tempMsg: ChatMessage = {
            message_id: Date.now(),
            chat_id: activeChatId,
            message_type: 'text',
            message: textToSend,
            timestamp: new Date().toISOString(),
            user_id: MY_ID,
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            setSending(true);
            const savedMsg = await sendMessage(activeChatId, textToSend, 'text');
            if (savedMsg && savedMsg.message_id) {
                 setMessages((prev) => prev.map(m => m.message_id === tempMsg.message_id ? savedMsg : m));
            }
            
            setChats(prev => prev.map(c => 
                c.chat_id === activeChatId 
                    ? { ...c, last_message: { ...c.last_message, message: textToSend, timestamp: new Date().toISOString() } }
                    : c
            ));
        } catch (error) {
            console.error('Failed to send message', error);
            setMessages((prev) => prev.filter((m) => m.message_id !== tempMsg.message_id));
            setMessageInput(textToSend); // Restore input
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getChatName = (chat: Chat) => {
        return chat.name || 'Unknown Chat';
    };

    const getChatAvatar = (chat: Chat) => {
        return chat.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getChatName(chat))}&background=1e1e2d&color=fff`;
    };

    const getActiveChatName = () => {
        if (!activeChatInfo) return 'Loading...';
        return activeChatInfo.info?.name || 'Unknown Chat';
    };

    const getActiveChatAvatar = () => {
        if (!activeChatInfo) return 'https://ui-avatars.com/api/?name=Chat&background=1e1e2d&color=fff';
        if ('peer' in activeChatInfo && activeChatInfo.peer) {
            return activeChatInfo.peer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getActiveChatName())}&background=1e1e2d&color=fff`;
        }
        return activeChatInfo.info?.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getActiveChatName())}&background=1e1e2d&color=fff`;
    };

    const getActiveChatOnline = () => {
        if (!activeChatInfo) return false;
        if ('peer' in activeChatInfo && activeChatInfo.peer) {
            return activeChatInfo.peer.is_online || false;
        }
        return false; // Group chats
    };

    return (
        <div className="w-full flex bg-[#151521] text-[#a2a5b9] font-sans h-[calc(100vh-80px)] overflow-hidden">
            <div className="w-full max-w-sm border-r border-white/[0.05] flex flex-col bg-[#1e1e2d]">
                <div className="p-6 border-b border-white/[0.05]">
                    <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
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
                    {loading ? (
                        <div className="p-4 text-center text-sm">Loading chats...</div>
                    ) : chats.length === 0 ? (
                        <div className="p-4 text-center text-sm">No chats found.</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.chat_id}
                                onClick={() => handleChatClick(chat.chat_id)}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${activeChatId === chat.chat_id ? 'bg-white/[0.05] border border-white/[0.05]' : 'hover:bg-white/[0.02] border border-transparent'}`}
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
                                    <div className="flex justify-between items-center">
                                        <p className={`text-xs truncate max-w-[180px] text-[#a2a5b9]`}>
                                            {chat.last_message?.message?.toString() || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {activeChatId ? (
                <div className="flex-1 flex flex-col bg-[#151521] relative">
                    <div className="h-20 px-8 border-b border-white/[0.05] bg-[#1e1e2d]/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <img src={getActiveChatAvatar()} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                            <div>
                                <h2 className="text-white font-bold text-sm leading-tight">{getActiveChatName()}</h2>
                                <p className="text-xs text-[#1bc5bd] font-medium mt-0.5">
                                    {getActiveChatOnline() ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-[#a2a5b9]">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-[#a2a5b9]">
                                Say hi to start the conversation!
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.user_id === MY_ID;
                                const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                                
                                return (
                                    <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        {!isMe && (
                                            <img src={getActiveChatAvatar()} className="w-8 h-8 rounded-full mr-3 self-end mb-1" alt="avatar" />
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`px-5 py-3 rounded-2xl max-w-md break-words ${isMe
                                                    ? 'bg-[#3699ff] text-white rounded-br-sm shadow-[0_4px_15px_rgba(54,153,255,0.2)]'
                                                    : 'bg-[#1e1e2d] text-[#a2a5b9] border border-white/[0.05] rounded-bl-sm'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                                {timeStr && <span className="text-[10px] font-medium text-[#a2a5b9]/70">{timeStr}</span>}
                                                {isMe && <CheckCheck size={14} className="text-[#3699ff]" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-6 bg-[#1e1e2d] border-t border-white/[0.05]">
                        <div className="flex items-center gap-4 bg-[#151521] border border-white/[0.05] p-2 rounded-2xl focus-within:border-[#3699ff]/50 transition-colors">
                            <button className="p-2.5 text-[#a2a5b9] hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <button className="p-2.5 text-[#a2a5b9] hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors hidden sm:block">
                                <ImageIcon size={20} />
                            </button>

                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#a2a5b9]/50 px-2"
                                disabled={sending}
                            />

                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || sending}
                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${messageInput.trim() ? 'bg-[#3699ff] text-white shadow-lg shadow-[#3699ff]/20' : 'bg-white/[0.05] text-[#a2a5b9] cursor-not-allowed'
                                    }`}
                            >
                                <Send size={18} className={messageInput.trim() ? 'ml-1' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-[#151521]">
                    <div className="w-20 h-20 rounded-full bg-[#1e1e2d] border border-white/[0.05] flex items-center justify-center mb-6">
                        <MessageCircle size={32} className="text-[#3699ff] opacity-50" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
                    <p className="text-sm text-[#a2a5b9]">Select a conversation or start a new one.</p>
                </div>
            )}
        </div>
    );
};

export default Messages;