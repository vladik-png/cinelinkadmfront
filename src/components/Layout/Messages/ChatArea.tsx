import React, { RefObject } from 'react';
import { Send, Image as ImageIcon, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../../../types/chat';

interface ChatAreaProps {
    messages: ChatMessage[];
    messageInput: string;
    onMessageInputChange: (val: string) => void;
    onSendMessage: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    sending: boolean;
    myId: number;
    activeChatName: string;
    activeChatAvatar: string;
    isOnline: boolean;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    messageInput,
    onMessageInputChange,
    onSendMessage,
    onKeyDown,
    sending,
    myId,
    activeChatName,
    activeChatAvatar,
    isOnline,
    messagesEndRef
}) => {
    return (
        <div className="flex-1 flex flex-col bg-[#151521] relative">
            <div className="h-20 px-8 border-b border-white/[0.05] bg-[#1e1e2d]/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
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

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-[#a2a5b9]">
                        Say hi to start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === myId;
                        const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                        
                        return (
                            <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    <img src={activeChatAvatar} className="w-8 h-8 rounded-full mr-3 self-end mb-1" alt="avatar" />
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
                        onChange={(e) => onMessageInputChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Write a message..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#a2a5b9]/50 px-2"
                        disabled={sending}
                    />

                    <button
                        onClick={onSendMessage}
                        disabled={!messageInput.trim() || sending}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${messageInput.trim() ? 'bg-[#3699ff] text-white shadow-lg shadow-[#3699ff]/20' : 'bg-white/[0.05] text-[#a2a5b9] cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} className={messageInput.trim() ? 'ml-1' : ''} />
                    </button>
                </div>
            </div>
        </div>
    );
};
