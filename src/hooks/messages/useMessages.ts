import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEmployeeStore } from '../../store/employeeStore';
import { useChatList } from './useChatList';
import { useChatMessages } from './useChatMessages';
import { getChatName, getChatAvatar, getActiveChatName, getActiveChatAvatar } from './chatFormatting';
import { Chat } from '../../types/chat';
import { deleteChat, getEmployeeStatus } from '../../api/chatService';
import { liveWs } from '../../api/wsService';


export const useMessages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlChatId = searchParams.get('chatId');
    const urlPeerId = searchParams.get('peerId');

    const [activeChatId, setActiveChatId] = useState<number | null>(urlChatId ? parseInt(urlChatId, 10) : null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { employees, fetchEmployees } = useEmployeeStore();

    const currentEmployeeIdStr = localStorage.getItem('employee_id');
    const MY_ID = currentEmployeeIdStr ? parseInt(currentEmployeeIdStr, 10) : 1; 

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
        handleKeyDown,
        typingUsers
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

    const handleDeleteChat = async (id: number) => {
        try {
            await deleteChat(id);
            if (activeChatId === id) {
                setActiveChatId(null);
                setSearchParams({});
            }
            mutateChats();
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    const activeChatNameStr = getActiveChatName(activeChatInfo, activeChatId, urlPeerId, chats, employees, MY_ID);

    const getActivePeerId = (): number | null => {
        if (!activeChatInfo) return null;
        if (activeChatInfo?.info && 'participants_ids' in activeChatInfo.info) {
            const id = activeChatInfo.info.participants_ids?.find((id: number) => id !== MY_ID);
            return id || null;
        }
        if (activeChatInfo && 'participants_ids' in activeChatInfo) {
            const id = (activeChatInfo.participants_ids as number[]).find((id: number) => id !== MY_ID);
            return id || null;
        }
        return null;
    };

    const peerId = getActivePeerId();

    const [liveStatus, setLiveStatus] = useState<{ is_online: boolean; last_seen?: string } | null>(null);

    useEffect(() => {
        const handleUserStatus = (data: any) => {
            if (peerId && data.employee_id === peerId) {
                setLiveStatus({
                    is_online: data.is_online,
                    last_seen: data.last_seen
                });
            }
        };

        liveWs.on('user_status', handleUserStatus);

        return () => {
            liveWs.off('user_status', handleUserStatus);
        };
    }, [peerId]);

    const { data: initialStatus } = useSWR(
        peerId ? `employee-status-${peerId}` : null,
        () => getEmployeeStatus(peerId as number),
        { refreshInterval: 0, revalidateOnFocus: false }
    );

    const getActiveChatOnline = () => {
        if (liveStatus !== null) return liveStatus.is_online;
        if (initialStatus) return initialStatus.is_online;
        return false;
    };

    const getActiveChatLastSeen = () => {
        if (liveStatus !== null) return liveStatus.last_seen || null;
        if (initialStatus) return initialStatus.last_seen || null;
        return null;
    };

    const getActiveChatIsAdmin = () => {
        if (!peerId) return false;
        const emp = employees.find(e => e.employee_id === peerId);
        return emp ? (emp as any).role === 1 || emp.department === 'Administration' : false;    };

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
        handleDeleteChat,
        handleSendMessage,
        handleKeyDown,
        getChatName: (chat: Chat) => getChatName(chat, employees, MY_ID),
        getChatAvatar: (chat: Chat) => getChatAvatar(chat, employees, MY_ID),
        getActiveChatName: () => activeChatNameStr,
        getActiveChatAvatar: () => getActiveChatAvatar(activeChatInfo, activeChatId, urlPeerId, chats, employees, MY_ID, activeChatNameStr),
        getActiveChatOnline,
        getActiveChatLastSeen,
        getActiveChatIsAdmin,
        typingUsers
    };
};
