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

export const getChatDetails = async (chatId: number): Promise<DirectChat | GroupChat> => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data?.data || response.data;
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
    await api.post(`/chats/${chatId}/members/me`);
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
        const response = await api.get(`/chats/${chatId}/messages`);
        const data = response.data?.data || response.data;

        if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        }

        if (Array.isArray(data)) {
            return data;
        }

        if (data && typeof data === 'object' && typeof data.results === 'object' && data.results !== null) {
            const possibleArray = Object.values(data.results).find(val => Array.isArray(val));
            if (possibleArray) {
                 return possibleArray as ChatMessage[];
            }
        }

        console.warn("Повідомлення не знайдені або прийшов не масив:", data);
        return [];
    } catch (error) {
        console.error("Помилка під час отримання повідомлень:", error);
        return [];
    }
};

export const sendMessage = async (chatId: number, message: string, type: string = 'text'): Promise<ChatMessage> => {
    const response = await api.post(`/chats/${chatId}/messages`, { 
        message: message, 
        type: type 
    });
    
    const data = response.data?.data || response.data;
    if (data && typeof data === 'object' && 'results' in data) {
        return data.results;
    }
    return data;
};