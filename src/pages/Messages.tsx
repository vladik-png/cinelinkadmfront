import * as React from 'react';
import { useState } from 'react';
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, CheckCheck, MessageCircle} from 'lucide-react';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USERS, Conversation } from '../types/chat';


const Messages: React.FC = () => {
    const [activeChat, setActiveChat] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
    const [messageInput, setMessageInput] = useState('');

    const MY_ID = '1';

    return (
        <div className="w-full flex bg-[#151521] text-[#a2a5b9] font-sans h-[calc(100vh-80px)] overflow-hidden">

            <div className="w-full max-w-sm border-r border-white/[0.05] flex flex-col bg-[#1e1e2d]">
                <div className="p-6 border-b border-white/[0.05]">
                    <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a5b9]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-[#151521] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3699ff]/50 transition-colors placeholder:text-[#a2a5b9]/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 custom-scrollbar">
                    {MOCK_CONVERSATIONS.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveChat(conv)}
                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${activeChat?.id === conv.id ? 'bg-white/[0.05] border border-white/[0.05]' : 'hover:bg-white/[0.02] border border-transparent'
                                }`}
                        >
                            <div className="relative">
                                <img src={conv.user.avatar} className="w-12 h-12 rounded-full object-cover bg-[#151521]" alt={conv.user.name} />
                                {conv.user.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#1bc5bd] border-2 border-[#1e1e2d] rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-white' : 'font-semibold text-[#a2a5b9]'}`}>
                                        {conv.user.name}
                                    </h3>
                                    <span className="text-[10px] font-medium text-[#a2a5b9]">{conv.timestamp}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs truncate max-w-[180px] ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-[#a2a5b9]'}`}>
                                        {conv.lastMessage}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                        <span className="w-5 h-5 bg-[#3699ff] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeChat ? (
                <div className="flex-1 flex flex-col bg-[#151521] relative">

                    <div className="h-20 px-8 border-b border-white/[0.05] bg-[#1e1e2d]/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <img src={activeChat.user.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                            <div>
                                <h2 className="text-white font-bold text-sm leading-tight">{activeChat.user.name}</h2>
                                <p className="text-xs text-[#1bc5bd] font-medium mt-0.5">
                                    {activeChat.user.isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-[#a2a5b9]">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {MOCK_MESSAGES.map((msg) => {
                            const isMe = msg.senderId === MY_ID;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!isMe && (
                                        <img src={activeChat.user.avatar} className="w-8 h-8 rounded-full mr-3 self-end mb-1" alt="avatar" />
                                    )}
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`px-5 py-3 rounded-2xl max-w-md ${isMe
                                                    ? 'bg-[#3699ff] text-white rounded-br-sm shadow-[0_4px_15px_rgba(54,153,255,0.2)]'
                                                    : 'bg-[#1e1e2d] text-[#a2a5b9] border border-white/[0.05] rounded-bl-sm'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                            <span className="text-[10px] font-medium text-[#a2a5b9]/70">{msg.timestamp}</span>
                                            {isMe && <CheckCheck size={14} className="text-[#3699ff]" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#a2a5b9]/50 px-2"
                            />

                            <button
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