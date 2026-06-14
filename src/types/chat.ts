export interface ChatMember {
    member_index: number;
    user_id: number;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
    is_online?: boolean;
    last_seen: string;
}

export interface LastMessage {
    message_id?: number;
    message_type?: string;
    message?: any;
    timestamp?: string;
    user_id?: number;
}

export interface ChatMessage {
    message_id: number;
    chat_id: number;
    message_type: string;
    message: any;
    timestamp: string;
    user_id: number;
}

export interface Chat {
    chat_id: number;
    name: string;
    img_url?: string;
    creator_id?: number;
    chat_type?: string;
    peer_id?: number;
    participants_ids?: number[];
    last_message?: LastMessage;
}

export interface GroupChat {
    info: Chat;
    members?: ChatMember[];
}

export interface DirectChat {
    info: Chat;
    peer: ChatMember;
    last_message?: LastMessage;
}

export interface ChatUser {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    user: ChatUser;
    lastMessage: string;
    unreadCount: number;
    timestamp: string;
}