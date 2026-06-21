import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Chat, DirectChat, GroupChat, ChatMessage } from '../types/chat';
import { getUserChats, getChatDetails, getChatMessages, sendMessage } from '../api/chatService';
import { useEmployeeStore } from '../store/employeeStore';

export const useMessagesLogic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlChatId = searchParams.get('chatId');
    const urlPeerId = searchParams.get('peerId');

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatInfo, setActiveChatInfo] = useState<DirectChat | GroupChat | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(urlChatId ? parseInt(urlChatId, 10) : null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { employees, fetchEmployees } = useEmployeeStore();

    const currentUserIdStr = localStorage.getItem('employee_id');
    const MY_ID = currentUserIdStr ? parseInt(currentUserIdStr, 10) : 1; 

    useEffect(() => {
        fetchEmployees();
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
        } catch (error) {
            console.error('Error fetching chats', error);
        } finally {
            setLoading(false);
        }
    };

    const extractPeerId = (peer: any): number | null => {
        if (!peer) return null;
        if (typeof peer === 'number') return peer;
        if (typeof peer === 'object' && 'Int64' in peer && peer.Valid) return peer.Int64;
        return null;
    };

    const extractParticipants = (parts: any): number[] => {
        if (!parts) return [];
        if (Array.isArray(parts)) return parts;
        if (typeof parts === 'string') {
            try { return JSON.parse(atob(parts)); } catch (e) {
                try { return JSON.parse(parts); } catch (e) { return []; }
            }
        }
        return [];
    };

    const getEmployeeChats = () => {
        return chats.filter(chat => {
            let keep = false;
            const peerId = extractPeerId(chat.peer_id);
            const participants = extractParticipants(chat.participants_ids);
            
            if (chat.chat_id === activeChatId) {
                keep = true;
            } else if (!peerId && participants && participants.every(id => id == MY_ID)) {
                keep = true;
            } else if (peerId) {
                keep = employees.some(e => ((e as any).user_id || e.employee_id || (e as any).id) == peerId);
            } else if (participants && participants.length > 0) {
                keep = participants.some(id => id != MY_ID && employees.some(e => ((e as any).user_id || e.employee_id || (e as any).id) == id));
            }
            return keep;
        });
    };

    const filteredChats = getEmployeeChats();

    useEffect(() => {
        if (!urlChatId && filteredChats.length > 0 && !activeChatId && !loading) {
            const firstChatId = filteredChats[0].chat_id;
            setActiveChatId(firstChatId);
            fetchChatDetails(firstChatId);
            fetchMessages(firstChatId);
            setSearchParams({ chatId: firstChatId.toString() });
        }
    }, [filteredChats, urlChatId, activeChatId, loading]);

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
            if (data && data.length > 0) {
                const sortedMessages = [...data].sort((a, b) => {
                    const timeA = new Date(a.timestamp || 0).getTime();
                    const timeB = new Date(b.timestamp || 0).getTime();
                    return timeA - timeB;
                });
                setMessages(sortedMessages);
            } else {
                setMessages([]);
            }
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
        setMessageInput('');

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
            const savedMsg = await sendMessage(activeChatId, textToSend, 'text', MY_ID);
            if (savedMsg && savedMsg.message_id) {
                 setMessages((prev) => prev.map(m => m.message_id === tempMsg.message_id ? savedMsg : m));
            }
            
            setChats(prev => prev.map(c => 
                c.chat_id === activeChatId 
                    ? { ...c, last_message: { ...c.last_message, message: textToSend, timestamp: new Date().toISOString() } }
                    : c
            ));

            if (!filteredChats.some(c => c.chat_id === activeChatId)) {
                fetchChats();
            }
        } catch (error) {
            console.error('Failed to send message', error);
            setMessages((prev) => prev.filter((m) => m.message_id !== tempMsg.message_id));
            setMessageInput(textToSend);
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
        if (chat.peer_id) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == chat.peer_id);
            if (emp) return `${emp.first_name} ${emp.last_name}`;
        } else if (chat.participants_ids && chat.participants_ids.every(id => id == MY_ID)) {
            const me = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == MY_ID);
            if (me) return `${me.first_name} ${me.last_name} (You)`;
            return 'Saved Messages';
        }
        return chat.name || 'Unknown Chat';
    };

    const getChatAvatar = (chat: Chat) => {
        if (chat.peer_id) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == chat.peer_id);
            if (emp && emp.avatar_url) return emp.avatar_url;
        }
        return chat.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getChatName(chat))}&background=1e1e2d&color=fff`;
    };

    const getActiveChatName = () => {
        if (activeChatInfo && 'peer' in activeChatInfo && activeChatInfo.peer) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == activeChatInfo.peer.user_id);
            if (emp) return `${emp.first_name} ${emp.last_name}`;
        }
        if (activeChatInfo?.info?.participants_ids?.every(id => id == MY_ID)) {
            const me = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == MY_ID);
            if (me) return `${me.first_name} ${me.last_name} (You)`;
            return 'Saved Messages';
        }
        if (urlPeerId) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == urlPeerId);
            if (emp) return `${emp.first_name} ${emp.last_name}`;
        }
        const chatFromList = chats.find(c => c.chat_id === activeChatId);
        if (chatFromList && chatFromList.name) return getChatName(chatFromList);

        return activeChatInfo?.info?.name || 'Unknown Chat';
    };

    const getActiveChatAvatar = () => {
        if (activeChatInfo && 'peer' in activeChatInfo && activeChatInfo.peer) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == activeChatInfo.peer.user_id);
            if (emp && emp.avatar_url) return emp.avatar_url;
            return activeChatInfo.peer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getActiveChatName())}&background=1e1e2d&color=fff`;
        }
        if (urlPeerId) {
            const emp = employees.find(e => ((e as any).user_id || e.employee_id || (e as any).id) == urlPeerId);
            if (emp && emp.avatar_url) return emp.avatar_url;
        }
        const chatFromList = chats.find(c => c.chat_id === activeChatId);
        if (chatFromList && chatFromList.img_url) return getChatAvatar(chatFromList);

        return activeChatInfo?.info?.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getActiveChatName())}&background=1e1e2d&color=fff`;
    };

    const getActiveChatOnline = () => {
        if (!activeChatInfo) return false;
        if ('peer' in activeChatInfo && activeChatInfo.peer) {
            return activeChatInfo.peer.is_online || false;
        }
        return false;
    };

    return {
        chats: filteredChats,
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
    };
};
