import { useState, useEffect } from 'react';
import { SavedNode, TerminalSession } from '../types/terminal';
import { fetchSavedNodes, syncNodesToBackend } from '../api/terminalService';

export const useTerminalLogic = () => {
    const [credentials, setCredentials] = useState<SavedNode>({ host: '', user: 'root', pass: '', remoteDir: '/root/' });
    const [showPassword, setShowPassword] = useState(false);
    const [savedNodes, setSavedNodes] = useState<SavedNode[]>([]);

    const [sessions, setSessions] = useState<TerminalSession[]>(() => {
        const saved = sessionStorage.getItem('cinelink_active_sessions');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTabId, setActiveTabId] = useState<string>(() => {
        return sessionStorage.getItem('cinelink_active_tab_id') || 'new';
    });

    useEffect(() => {
        sessionStorage.setItem('cinelink_active_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        sessionStorage.setItem('cinelink_active_tab_id', activeTabId);
    }, [activeTabId]);

    useEffect(() => {
        const loadData = async () => {
            const nodes = await fetchSavedNodes();
            setSavedNodes(nodes);
        };
        loadData();
    }, []);

    const startConnection = async () => {
        if (!credentials.host || !credentials.pass) {
            alert("Enter IP and password!");
            return;
        }

        const newNodes = [
            credentials,
            ...savedNodes.filter(n => n.host !== credentials.host)
        ].slice(0, 5);

        setSavedNodes(newNodes);
        await syncNodesToBackend(newNodes);

        const sessionId = `term_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newSession: TerminalSession = { id: sessionId, node: credentials };

        setSessions([...sessions, newSession]);
        setActiveTabId(sessionId);
    };

    const removeSavedNode = async (hostToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newNodes = savedNodes.filter(n => n.host !== hostToRemove);
        setSavedNodes(newNodes);
        await syncNodesToBackend(newNodes);
    };

    const closeSession = (idToClose: string) => {
        const updatedSessions = sessions.filter(s => s.id !== idToClose);
        setSessions(updatedSessions);

        if (activeTabId === idToClose) {
            if (updatedSessions.length > 0) {
                setActiveTabId(updatedSessions[updatedSessions.length - 1].id);
            } else {
                setActiveTabId('new');
            }
        }
    };

    return {
        credentials,
        setCredentials,
        showPassword,
        setShowPassword,
        savedNodes,
        sessions,
        activeTabId,
        setActiveTabId,
        startConnection,
        removeSavedNode,
        closeSession
    };
};