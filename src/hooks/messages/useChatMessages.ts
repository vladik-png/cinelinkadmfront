import { useState } from 'react';
import useSWR from 'swr';
import { ChatMessage } from '../../types/chat';
import { getChatDetails, getChatMessages, sendMessage } from '../../api/chatService';

export const useChatMessages = (activeChatId: number | null, MY_ID: number, mutateChats: () => void) => {
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);

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
        setMessageInput,
        sending,
        handleSendMessage,
        handleKeyDown
    };
};
