import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEmployeeStore } from '../../store/employeeStore';
import { useChatList } from './useChatList';
import { useChatMessages } from './useChatMessages';
import { getChatName, getChatAvatar, getActiveChatName, getActiveChatAvatar } from './chatFormatting';
import { Chat } from '../../types/chat';

export const useMessages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlChatId = searchParams.get('chatId');
    const urlPeerId = searchParams.get('peerId');

    const [activeChatId, setActiveChatId] = useState<number | null>(urlChatId ? parseInt(urlChatId, 10) : null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { employees, fetchEmployees } = useEmployeeStore();

    const currentEmployeeIdStr = localStorage.getItem('employee_id');
    const currentUserIdStr = localStorage.getItem('user_id') || currentEmployeeIdStr;
    const MY_ID = currentUserIdStr ? parseInt(currentUserIdStr, 10) : 1; 

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        if (urlChatId) {
            const parsed = parseInt(urlChatId, 10);
            if (!isNaN(parsed)) {
                setActiveChatId(parsed);
            }
        }
    }, [urlChatId]);

    const { chats, filteredChats, chatsLoading, mutateChats } = useChatList(employees, MY_ID, activeChatId);
    
    const { 
        activeChatInfo, 
        messages, 
        messageInput, 
        setMessageInput, 
        sending, 
        handleSendMessage, 
        handleKeyDown 
    } = useChatMessages(activeChatId, MY_ID, mutateChats);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!urlChatId && filteredChats.length > 0 && !activeChatId && !chatsLoading) {
            const firstChatId = filteredChats[0].chat_id;
            setActiveChatId(firstChatId);
            setSearchParams({ chatId: firstChatId.toString() });
        }
    }, [filteredChats.length, urlChatId, activeChatId, chatsLoading, setSearchParams]);

    const handleChatClick = (id: number) => {
        if (id === 0) {
            setActiveChatId(null);
            setSearchParams({});
            return;
        }
        setActiveChatId(id);
        setSearchParams({ chatId: id.toString() });
    };

    const getActiveChatOnline = () => {
        if (!activeChatInfo) return false;
        if ('peer' in activeChatInfo && activeChatInfo.peer) {
            return activeChatInfo.peer.is_online || false;
        }
        return false;
    };
    
    const activeChatNameStr = getActiveChatName(activeChatInfo, activeChatId, urlPeerId, chats, employees, MY_ID);

    return {
        chats: filteredChats,
        activeChatId,
        messages,
        messageInput,
        setMessageInput,
        loading: chatsLoading,
        sending,
        messagesEndRef,
        MY_ID,
        handleChatClick,
        handleSendMessage,
        handleKeyDown,
        getChatName: (chat: Chat) => getChatName(chat, employees, MY_ID),
        getChatAvatar: (chat: Chat) => getChatAvatar(chat, employees, MY_ID),
        getActiveChatName: () => activeChatNameStr,
        getActiveChatAvatar: () => getActiveChatAvatar(activeChatInfo, activeChatId, urlPeerId, chats, employees, MY_ID, activeChatNameStr),
        getActiveChatOnline
    };
};
