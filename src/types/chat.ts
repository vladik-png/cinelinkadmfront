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

export const MOCK_USERS: Record<string, ChatUser> = {
    '1': { id: '1', name: 'Vladislav', username: 'vladik_codm', avatar: 'https://ui-avatars.com/api/?name=V+S&background=3699ff&color=fff', isOnline: true },
    '2': { id: '2', name: 'Andriy', username: 'andriy_dev', avatar: 'https://ui-avatars.com/api/?name=A+D&background=1e1e2d&color=a2a5b9', isOnline: false },
    '3': { id: '3', name: 'Maria', username: 'yuliikk_', avatar: 'https://ui-avatars.com/api/?name=M+R&background=f64e60&color=fff', isOnline: true },
};

export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 'c1', user: MOCK_USERS['2'], lastMessage: 'Скинув лог помилки на AWS.', unreadCount: 2, timestamp: '10:42' },
    { id: 'c2', user: MOCK_USERS['3'], lastMessage: 'Дякую, все працює!', unreadCount: 0, timestamp: 'Вчора' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', text: 'Привіт. Глянь що там по серверах.', senderId: '2', timestamp: '10:40' },
    { id: 'm2', text: 'Зараз перевірю, хвилинку.', senderId: '1', timestamp: '10:41' },
    { id: 'm3', text: 'Скинув лог помилки на AWS.', senderId: '2', timestamp: '10:42' },
];