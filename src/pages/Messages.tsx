import React from 'react';
import { useMessages } from '../hooks/messages/useMessages';
import { ChatSidebar } from '../components/Layout/Messages/ChatSidebar';
import { ChatArea } from '../components/Layout/Messages/ChatArea';
import { ChatEmptyState } from '../components/Layout/Messages/ChatEmptyState';

const Messages: React.FC = () => {
    const {
        chats,
        activeChatId,
        messages,
        messageInput,
        setMessageInput,
        loading,
        sending,
        messagesEndRef,
        MY_ID,
        handleChatClick,
        handleDeleteChat,
        handleSendMessage,
        handleKeyDown,
        getChatName,
        getChatAvatar,
        getActiveChatName,
        getActiveChatAvatar,
        getActiveChatOnline
    } = useMessages();

    return (
        <div className="w-full flex bg-[#151521] text-[#a2a5b9] font-sans h-[calc(100vh-80px)] overflow-hidden">
            <div className={`w-full md:max-w-sm border-r border-white/[0.05] bg-[#1e1e2d] ${activeChatId ? 'hidden md:flex flex-col' : 'flex flex-col'}`}>
                <ChatSidebar 
                    chats={chats}
                    activeChatId={activeChatId}
                    loading={loading}
                    onChatClick={handleChatClick}
                    onDeleteChat={handleDeleteChat}
                    getChatName={getChatName}
                    getChatAvatar={getChatAvatar}
                />
            </div>

            {activeChatId ? (
                <div className="flex-1 flex flex-col bg-[#151521] min-w-0">
                    <ChatArea 
                        messages={messages}
                        messageInput={messageInput}
                        onMessageInputChange={setMessageInput}
                        onSendMessage={handleSendMessage}
                        onKeyDown={handleKeyDown}
                        sending={sending}
                        myId={MY_ID}
                        activeChatName={getActiveChatName()}
                        activeChatAvatar={getActiveChatAvatar()}
                        isOnline={getActiveChatOnline()}
                        messagesEndRef={messagesEndRef}
                        onBack={() => handleChatClick(0)} // Pass 0 or null to clear active chat
                    />
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col bg-[#151521]">
                    <ChatEmptyState />
                </div>
            )}
        </div>
    );
};

export default Messages;