import api from './axios';
import { Chat, DirectChat, GroupChat, ChatMember, ChatMessage } from '../types/chat';

export const getUserChats = async (): Promise<Chat[]> => {
    try {
        const response = await api.get('/employee/chat');
        const data = response.data?.data || response.data;
        let chatsArray: any[] = [];
        if (Array.isArray(data)) {
            chatsArray = data;
        } else if (data && typeof data === 'object') {
            const possibleArray = Object.values(data).find(val => Array.isArray(val));
            if (possibleArray) chatsArray = possibleArray as any[];
        }

        return chatsArray.map(chat => ({
            ...chat,
            chat_id: chat.id || chat.chat_id,
            img_url: chat.avatar || chat.img_url,
        })) as Chat[];

    } catch (error) {
        console.error("Error fetching user chats:", error);
        return [];
    }
};

export const getChatDetails = async (chatId: number): Promise<DirectChat | GroupChat | null> => {
    const response = await api.get(`/chats/${chatId}`);
    const data = response.data?.data || response.data;
    let result = data;
    if (data && typeof data === 'object' && 'results' in data) {
        result = data.results;
    }

    if (result && !result.info) {
        const mappedChat = {
            ...result,
            chat_id: result.id || result.chat_id,
            img_url: result.avatar || result.img_url
        };
        return {
            info: mappedChat,
            peer: null
        } as any;
    }

    return result;
};

export const getOrCreateChat = async (friendId: number | string): Promise<number> => {
    const response = await api.get(`/chats/get-or-create/${friendId}`);
    const data = response.data?.data || response.data;

    if (data && typeof data === 'object' && 'results' in data) {
        return data.results;
    }

    return data;
};

export const deleteChat = async (chatId: number): Promise<void> => {
    await api.delete(`/chats/${chatId}`);
};

export const getEmployeeStatus = async (employeeId: number): Promise<{ is_online: boolean; last_seen: string }> => {
    const response = await api.get(`/employee-status/${employeeId}`);
    return response.data?.data || response.data || { is_online: false, last_seen: '' };
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

        return messagesArray.map((msg: any) => {
            if (msg && msg.type && msg.content) {
                return msg.content;
            }
            return msg;
        }) as ChatMessage[];
    } catch (error) {
        console.error("Error fetching chat messages:", error);
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