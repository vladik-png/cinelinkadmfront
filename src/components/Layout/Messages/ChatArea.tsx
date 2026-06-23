import React, { RefObject } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../../../types/chat';
import { ChatAreaHeader } from './ChatAreaHeader';
import { ChatAreaInput } from './ChatAreaInput';
import { formatRelativeTime } from '../../../utils/timeFormat';

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
    lastSeen: string | null;
    isAdmin: boolean;
    typingUsers?: number[];
    messagesEndRef: RefObject<HTMLDivElement | null>;
    onBack?: () => void;
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
    lastSeen,
    isAdmin,
    typingUsers = [],
    messagesEndRef,
    onBack
}) => {
    return (
        <div className="flex-1 flex flex-col bg-[#151521] relative min-h-0">
            <ChatAreaHeader 
                activeChatName={activeChatName}
                activeChatAvatar={activeChatAvatar}
                isOnline={isOnline}
                lastSeen={lastSeen}
                isAdmin={isAdmin}
                onBack={onBack}
            />

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-[#a2a5b9]">
                        Say hi to start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === myId;
                        const timeStr = formatRelativeTime(msg.timestamp);
                        
                        return (
                            <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    <img src={activeChatAvatar} className="w-8 h-8 rounded-full mr-3 self-end mb-1" alt="avatar" />
                                )}
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`px-5 py-3 rounded-2xl max-w-md break-words ${isMe
                                            ? 'bg-gradient-to-r from-[#3699ff] to-[#8950fc] text-white rounded-br-sm shadow-[0_4px_15px_rgba(137,80,252,0.2)]'
                                            : 'bg-[#1e1e2d] text-[#a2a5b9] border border-white/[0.05] rounded-bl-sm'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                        {timeStr && <span className="text-[10px] font-medium text-[#a2a5b9]/70">{timeStr}</span>}
                                        {isMe && (
                                            msg.status === 'seen' ? <CheckCheck size={14} className="text-[#3699ff]" /> :
                                            msg.status === 'delivered' ? <CheckCheck size={14} className="text-[#a2a5b9]" /> :
                                            <Check size={14} className="text-[#a2a5b9]" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {typingUsers.length > 0 && (
                    <div className="flex justify-start items-end mb-4 animate-fade-in">
                        <img src={activeChatAvatar} className="w-8 h-8 rounded-full mr-3 mb-1" alt="avatar" />
                        <div className="bg-[#1e1e2d] px-4 py-3 border border-white/[0.05] rounded-2xl rounded-bl-sm">
                            <p className="text-sm text-[#a2a5b9] italic flex items-center gap-1">
                                Друкує<span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span><span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                            </p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatAreaInput 
                messageInput={messageInput}
                onMessageInputChange={onMessageInputChange}
                onSendMessage={onSendMessage}
                onKeyDown={onKeyDown}
                sending={sending}
            />
        </div>
    );
};
