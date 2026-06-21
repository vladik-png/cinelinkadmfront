import React from 'react';
import { useMessagesLogic } from '../hooks/useMessagesLogic';
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
        handleSendMessage,
        handleKeyDown,
        getChatName,
        getChatAvatar,
        getActiveChatName,
        getActiveChatAvatar,
        getActiveChatOnline
    } = useMessagesLogic();

    return (
        <div className="w-full flex bg-[#151521] text-[#a2a5b9] font-sans h-[calc(100vh-80px)] overflow-hidden">
            <ChatSidebar 
                chats={chats}
                activeChatId={activeChatId}
                loading={loading}
                onChatClick={handleChatClick}
                getChatName={getChatName}
                getChatAvatar={getChatAvatar}
            />

            {activeChatId ? (
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
                />
            ) : (
                <ChatEmptyState />
            )}
        </div>
    );
};

export default Messages;