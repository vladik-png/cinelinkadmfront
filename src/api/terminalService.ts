import axios from 'axios';

const TERMINAL_URL = import.meta.env.VITE_TERMINAL_URL || 'http://localhost:8085';

export interface SavedNode {
    host: string;
    user: string;
    pass: string;
    remoteDir: string;
}

export const fetchSavedNodes = async (): Promise<SavedNode[]> => {
    try {
        const response = await axios.get(`${TERMINAL_URL}/servers`);
        if (!response.data || response.data === "") return [];
        return response.data;
    } catch (error) {
        console.error('Failed to fetch terminal nodes:', error);
        return [];
    }
};

export const syncNodesToBackend = async (nodes: SavedNode[]) => {
    try {
        await axios.post(`${TERMINAL_URL}/servers`, nodes);
    } catch (error) {
        console.error('Failed to sync terminal nodes:', error);
        throw error;
    }
};

export const uploadFileViaTerminal = async (file: File, creds: SavedNode) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('host', creds.host);
    formData.append('user', creds.user);
    formData.append('pass', creds.pass);
    formData.append('remoteDir', creds.remoteDir);

    try {
        const response = await axios.post(`${TERMINAL_URL}/upload`, formData);
        return response.data;
    } catch (error) {
        console.error('Failed to upload file:', error);
        throw error;
    }
};

export const getTerminalWsUrl = () => {
    return import.meta.env.VITE_WS_URL || 'ws://localhost:8085';
};