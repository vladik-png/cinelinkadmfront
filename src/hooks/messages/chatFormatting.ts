import { Chat } from '../../types/chat';
import { EmployeeData } from '../../types/employee';

export const extractPeerId = (peer: any): number | null => {
    if (!peer) return null;
    if (typeof peer === 'number') return peer;
    if (typeof peer === 'object' && 'Int64' in peer && peer.Valid) return peer.Int64;
    return null;
};

export const extractParticipants = (parts: any): number[] => {
    if (!parts) return [];
    if (Array.isArray(parts)) return parts;
    if (typeof parts === 'string') {
        try { return JSON.parse(atob(parts)); } catch (e) {
            try { return JSON.parse(parts); } catch (e) { return []; }
        }
    }
    return [];
};

export const getChatName = (chat: Chat, employees: EmployeeData[], MY_ID: number) => {
    const peerId = extractPeerId(chat.peer_id);
    if (peerId) {
        const emp = employees.find(e => e.employee_id == peerId);
        if (emp) {
            return peerId == MY_ID ? `${emp.first_name} ${emp.last_name} (Збережені)` : `${emp.first_name} ${emp.last_name}`;
        }
    } else if (chat.participants_ids) {
        const participants = extractParticipants(chat.participants_ids);
        if (participants && participants.every(id => id == MY_ID)) {
            const me = employees.find(e => e.employee_id == MY_ID);
            if (me) return `${me.first_name} ${me.last_name} (You)`;
            return 'Saved Messages';
        }
        
        const otherId = participants.find(id => id != MY_ID);
        if (otherId) {
            const emp = employees.find(e => e.employee_id == otherId);
            if (emp) return `${emp.first_name} ${emp.last_name}`;
        }
    }
    return chat.name || 'Unknown Chat';
};

export const getChatAvatar = (chat: Chat, employees: EmployeeData[], MY_ID: number) => {
    const peerId = extractPeerId(chat.peer_id);
    if (peerId) {
        const emp = employees.find(e => e.employee_id == peerId);
        if (emp && emp.avatar_url) return emp.avatar_url;
    } else if (chat.participants_ids) {
        const participants = extractParticipants(chat.participants_ids);
        const otherId = participants.find(id => id != MY_ID);
        if (otherId) {
            const emp = employees.find(e => e.employee_id == otherId);
            if (emp && emp.avatar_url) return emp.avatar_url;
        }
    }
    return chat.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getChatName(chat, employees, MY_ID))}&background=1e1e2d&color=fff`;
};

export const getActiveChatName = (
    activeChatInfo: any, 
    activeChatId: number | null, 
    urlPeerId: string | null, 
    chats: Chat[], 
    employees: EmployeeData[], 
    MY_ID: number
) => {
    if (activeChatInfo && 'peer' in activeChatInfo && activeChatInfo.peer) {
        const emp = employees.find(e => e.employee_id == activeChatInfo.peer.user_id);
        if (emp) return `${emp.first_name} ${emp.last_name}`;
    }
    if (activeChatInfo?.info?.participants_ids?.every((id: number) => id == MY_ID)) {
        const me = employees.find(e => e.employee_id == MY_ID);
        if (me) return `${me.first_name} ${me.last_name} (You)`;
        return 'Saved Messages';
    }
    
    if (activeChatInfo?.info?.participants_ids) {
        const participants = extractParticipants(activeChatInfo.info.participants_ids);
        const otherId = participants.find(id => id != MY_ID);
        if (otherId) {
            const emp = employees.find(e => e.employee_id == otherId);
            if (emp) return `${emp.first_name} ${emp.last_name}`;
        }
    }

    if (urlPeerId) {
        const emp = employees.find(e => e.employee_id == Number(urlPeerId));
        if (emp) return `${emp.first_name} ${emp.last_name}`;
    }
    const chatFromList = chats.find(c => c.chat_id === activeChatId);
    if (chatFromList && chatFromList.name) return getChatName(chatFromList, employees, MY_ID);

    return activeChatInfo?.info?.name || 'Unknown Chat';
};

export const getActiveChatAvatar = (
    activeChatInfo: any, 
    activeChatId: number | null, 
    urlPeerId: string | null, 
    chats: Chat[], 
    employees: EmployeeData[], 
    MY_ID: number,
    activeChatName: string
) => {
    if (activeChatInfo && 'peer' in activeChatInfo && activeChatInfo.peer) {
        const emp = employees.find(e => e.employee_id == activeChatInfo.peer.user_id);
        if (emp && emp.avatar_url) return emp.avatar_url;
        return activeChatInfo.peer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChatName)}&background=1e1e2d&color=fff`;
    }
    
    if (activeChatInfo?.info?.participants_ids) {
        const participants = extractParticipants(activeChatInfo.info.participants_ids);
        const otherId = participants.find(id => id != MY_ID);
        if (otherId) {
            const emp = employees.find(e => e.employee_id == otherId);
            if (emp && emp.avatar_url) return emp.avatar_url;
        }
    }

    if (urlPeerId) {
        const emp = employees.find(e => e.employee_id == Number(urlPeerId));
        if (emp && emp.avatar_url) return emp.avatar_url;
    }
    const chatFromList = chats.find(c => c.chat_id === activeChatId);
    if (chatFromList && chatFromList.img_url) return getChatAvatar(chatFromList, employees, MY_ID);

    return activeChatInfo?.info?.img_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChatName)}&background=1e1e2d&color=fff`;
};
