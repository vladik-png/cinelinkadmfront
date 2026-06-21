import api from './axios';
import { Chat, DirectChat, GroupChat, ChatMember, ChatMessage } from '../types/chat';

export const getUserChats = async (): Promise<Chat[]> => {
    try {
    const response = await api.get('/users/chats');
        const data = response.data?.data || response.data;
        
        if (Array.isArray(data)) {
            return data;
        }
        
        if (data && typeof data === 'object') {
            const possibleArray = Object.values(data).find(val => Array.isArray(val));
            if (possibleArray) return possibleArray as Chat[];
        }

        console.warn("getUserChats не отримав масив з бекенду. Відповідь:", data);
        return [];
        
    } catch (error) {
        console.error("Помилка під час отримання чатів:", error);
        return [];
    }
};

export const getChatDetails = async (chatId: number): Promise<DirectChat | GroupChat | null> => {
    const response = await api.get(`/chats/${chatId}`);
    const data = response.data?.data || response.data;
    if (data && typeof data === 'object' && 'results' in data) {
        return data.results;
    }
    return data;
};

export const getOrCreateChat = async (friendId: number | string): Promise<number> => {
    const response = await api.get(`/chats/get-or-create/${friendId}`);
    const data = response.data?.data || response.data;
    
    if (data && typeof data === 'object' && 'results' in data) {
        return data.results;
    }
    
    return data;
};
export const removeUserChat = async (userId: number, chatId: number): Promise<void> => {
    await api.delete(`/chats/${chatId}/members/${userId}`);
};

export const getChatMembers = async (chatId: number): Promise<ChatMember[]> => {
    const response = await api.get(`/chats/${chatId}/members`);
    return response.data?.data || response.data || [];
};

export const createChatMember = async (chatId: number, userId: number): Promise<void> => {
    await api.post(`/chats/${chatId}/members`, { user_id: userId });
};

export const getChatMessages = async (chatId: number): Promise<ChatMessage[]> => {
    try {
        const response = await api.get(`/chats/${chatId}/messages?cursor=1`);
        const data = response.data?.data || response.data;

        let messagesArray: any[] = [];
        if (Array.isArray(data)) {
            messagesArray = data;
        } else if (data && typeof data === 'object') {
            if (Array.isArray(data.results)) {
                messagesArray = data.results;
            } else if (data.results && Array.isArray(data.results.data)) {
                messagesArray = data.results.data;
            } else if (Array.isArray(data.data)) {
                messagesArray = data.data;
            } else if (data.results && typeof data.results === 'object') {
                const possibleArray = Object.values(data.results).find(val => Array.isArray(val));
                if (possibleArray) messagesArray = possibleArray as any[];
            }
        }

        // Map Content objects to ChatMessage interface if necessary
        return messagesArray.map((msg: any) => {
            if (msg && msg.type && msg.content) {
                return msg.content;
            }
            return msg;
        }) as ChatMessage[];
    } catch (error) {
        console.error("Помилка під час отримання повідомлень:", error);
        return [];
    }
};

export const sendMessage = async (chatId: number, message: string, type: string = 'text', userId: number): Promise<ChatMessage> => {
    const response = await api.post(`/chats/${chatId}/messages`, { 
        type: "new_message",
        content: {
            chat_id: chatId,
            user_id: userId,
            message: message, 
            message_type: type 
        }
    });
    
    const data = response.data?.data || response.data;
    let result = data;
    
    if (data && typeof data === 'object') {
        if (data.results) {
            result = data.results;
        }
    }
    
    if (result && result.content) {
        return result.content as ChatMessage;
    }
    
    return result as ChatMessage;
};