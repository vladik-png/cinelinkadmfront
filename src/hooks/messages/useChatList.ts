import useSWR from 'swr';
import { Chat } from '../../types/chat';
import { EmployeeData } from '../../types/employee';
import { getUserChats } from '../../api/chatService';
import { extractPeerId, extractParticipants } from './chatFormatting';

export const useChatList = (employees: EmployeeData[], MY_ID: number, activeChatId: number | null) => {
    const { data: rawChats, mutate: mutateChats, isLoading: chatsLoading } = useSWR('user-chats', getUserChats);
    const chats = rawChats || [];

    const getEmployeeChats = () => {
        return chats.filter((chat: any) => {
            const peerId = extractPeerId(chat.peer_id);
            const participants = extractParticipants(chat.participants_ids);
            
            if (peerId == MY_ID) return false;
            
            if (!peerId && participants && participants.length > 0 && participants.every(id => id == MY_ID)) {
                return false;
            }

            let keep = false;
            if (chat.chat_id === activeChatId) {
                keep = true;
            } else if (peerId) {
                keep = employees.some(e => e.user_id == peerId);
            } else if (participants && participants.length > 0) {
                keep = participants.some(id => id != MY_ID && employees.some(e => e.user_id == id));
            }
            
            return keep;
        });
    };

    const filteredChats = getEmployeeChats();

    return {
        chats,
        filteredChats,
        chatsLoading,
        mutateChats
    };
};
