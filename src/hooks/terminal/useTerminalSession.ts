import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SavedNode } from '../../types/terminal';
import { getTerminalWsUrl } from '../../api/terminalService';

export const useTerminalSession = (
    terminalRef: MutableRefObject<HTMLDivElement | null>,
    node: SavedNode,
    isActive: boolean
) => {
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!terminalRef.current) return;
        if (terminalRef.current.children.length > 0) terminalRef.current.innerHTML = '';

        const term = new XTerm({
            cursorBlink: true,
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            theme: { background: '#151521', foreground: '#a2a5b9', cursor: '#1bc5bd' }
        });

        const fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        
        const ws = new WebSocket(`${getTerminalWsUrl()}/ssh`);
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'auth', host: node.host, user: node.user, pass: node.pass }));
            setIsConnected(true);
            setTimeout(() => fitAddonRef.current?.fit(), 100);
        };

        ws.onmessage = (event) => term.write(event.data);
        ws.onclose = () => {
            setIsConnected(false);
            term.writeln('\r\n\x1b[31m[Disconnected]\x1b[0m Connection terminated.\r\n');
        };

        term.onData(data => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });

        term.onResize(({ cols, rows }) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'resize', cols, rows }));
            }
        });

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                if (fitAddonRef.current && terminalRef.current?.clientHeight) {
                    try { fitAddonRef.current.fit(); } catch (e) {}
                }
            });
        });
        
        resizeObserver.observe(terminalRef.current);
        xtermRef.current = term;

        return () => {
            resizeObserver.disconnect();
            ws.close();
            term.dispose();
        };
    }, [node, terminalRef]);

    useEffect(() => {
        if (isActive) {
            setTimeout(() => {
                fitAddonRef.current?.fit();
                xtermRef.current?.focus();
            }, 50);
        }
    }, [isActive]);

    const refit = () => {
        setTimeout(() => fitAddonRef.current?.fit(), 100);
    };

    return {
        isConnected,
        xtermRef,
        refit
    };
};
