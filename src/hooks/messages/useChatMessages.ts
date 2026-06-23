import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { ChatMessage } from '../../types/chat';
import { getChatDetails, getChatMessages, sendMessage } from '../../api/chatService';
import { liveWs } from '../../api/wsService';

export const useChatMessages = (activeChatId: number | null, MY_ID: number, mutateChats: () => void) => {
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState<number[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data: activeChatInfo } = useSWR(
        activeChatId ? `chat-details-${activeChatId}` : null,
        () => getChatDetails(activeChatId as number)
    );

    const { data: messages = [], mutate: mutateMessages } = useSWR(
        activeChatId ? `chat-messages-${activeChatId}` : null,
        () => getChatMessages(activeChatId as number).then((data: any) => {
            if (!data || data.length === 0) return [];
            return [...data].sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
        }),
        { refreshInterval: 3000 }
    );

    useEffect(() => {
        liveWs.connect();

        const handleTyping = (data: any) => {
            if (data.chat_id === activeChatId && data.is_typing) {
                setTypingUsers(prev => prev.includes(data.employee_id) ? prev : [...prev, data.employee_id]);
                setTimeout(() => {
                    setTypingUsers(prev => prev.filter(id => id !== data.employee_id));
                }, 3000);
            } else if (data.chat_id === activeChatId && !data.is_typing) {
                setTypingUsers(prev => prev.filter(id => id !== data.employee_id));
            }
        };

        const handleSeenUpdate = (data: any) => {
            if (data.chat_id === activeChatId) {
                mutateMessages();
                mutateChats();
            }
        };

        liveWs.on('typing', handleTyping);
        liveWs.on('seen_update', handleSeenUpdate);

        return () => {
            liveWs.off('typing', handleTyping);
            liveWs.off('seen_update', handleSeenUpdate);
        };
    }, [activeChatId, mutateMessages, mutateChats]);

    useEffect(() => {
        if (messages.length > 0 && activeChatId) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.user_id !== MY_ID) {
                liveWs.send('seen', { chat_id: activeChatId, message_id: lastMsg.message_id });
            }
        }
    }, [messages, activeChatId, MY_ID]);

    const handleMessageInputChange = (val: string) => {
        setMessageInput(val);
        if (activeChatId) {
            liveWs.send('typing', { chat_id: activeChatId, is_typing: true });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                liveWs.send('typing', { chat_id: activeChatId, is_typing: false });
            }, 2000);
        }
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
        
        mutateMessages((prev: any) => [...(prev || []), tempMsg], false);

        try {
            setSending(true);
            await sendMessage(activeChatId, textToSend, 'text', MY_ID);
            
            mutateMessages();
            mutateChats();
        } catch (error) {
            console.error('Failed to send message', error);
            mutateMessages((prev: any) => (prev || []).filter((m: any) => m.message_id !== tempMsg.message_id), false);
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

    return {
        activeChatInfo,
        messages,
        messageInput,
        setMessageInput: handleMessageInputChange,
        sending,
        handleSendMessage,
        handleKeyDown,
        typingUsers
    };
};
