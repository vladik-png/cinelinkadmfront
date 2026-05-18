import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useDropzone } from 'react-dropzone';
import { Server, Wifi, WifiOff, UploadCloud, X, Maximize, Minimize } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';
import { uploadFileViaTerminal, getTerminalWsUrl } from '../../../api/terminalService';
import 'xterm/css/xterm.css';

interface TerminalInstanceProps {
    node: SavedNode;
    isActive: boolean;
    onClose: () => void;
}

export const TerminalInstance: React.FC<TerminalInstanceProps> = ({ node, isActive, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !isConnected) return;
        setUploadStatus(`Uploading: ${file.name}...`);
        xtermRef.current?.writeln(`\r\n\x1b[36m[SYSTEM]\x1b[0m Sending ${file.name} via SFTP...\r\n`);
        try {
            await uploadFileViaTerminal(file, node);
            setUploadStatus('Upload successful');
            xtermRef.current?.writeln(`\x1b[32m[SUCCESS]\x1b[0m File saved to ${node.remoteDir}${file.name}\r\n`);
        } catch {
            setUploadStatus('Upload failed');
            xtermRef.current?.writeln(`\x1b[31m[ERROR]\x1b[0m Failed to upload file.\r\n`);
        }
        setTimeout(() => setUploadStatus(null), 3000);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

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
    }, []);

    useEffect(() => {
        if (isActive) {
            setTimeout(() => {
                fitAddonRef.current?.fit();
                xtermRef.current?.focus();
            }, 50);
        }
    }, [isActive]);

    useEffect(() => {
        const onFullscreenChange = () => {
            const isFS = document.fullscreenElement === containerRef.current;
            setIsFullscreen(isFS);
            setTimeout(() => fitAddonRef.current?.fit(), 100);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div 
            ref={containerRef}
            className={`terminal-custom-scrollbar bg-[#1e1e2d] flex flex-col transition-all duration-200 overflow-hidden w-full h-full
            ${isFullscreen ? 'rounded-none border-0' : 'rounded-2xl border border-white/[0.05] border-t-2 border-t-[#8950fc]/50 shadow-lg'}`}
        >
            <style dangerouslySetInnerHTML={{__html: `
                .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar { width: 8px; height: 8px; }
                .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-track { background: transparent; }
                .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-thumb { background: #2b2b40; border-radius: 4px; }
                .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-thumb:hover { background: #8950fc; }
            `}} />

            <div {...getRootProps()} className="flex-1 flex flex-col relative min-h-0 min-w-0 w-full h-full overflow-hidden">
                <input {...getInputProps()} />

                {/* ХЕДЕР: min-w-0 + flex-1 для тексту гарантує, що він зіжметься і обріжеться (...), а не розірве блок */}
                <div className="flex-none flex justify-between items-center px-3 py-2 bg-[#151521] border-b border-white/[0.05] w-full min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        <Server size={12} className="shrink-0 text-[#a2a5b9]" /> 
                        <span className="text-[10px] uppercase tracking-widest font-bold text-white truncate w-full">
                            Host: {node.host}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className={`hidden lg:flex items-center gap-1 font-bold text-[9px] uppercase tracking-widest ${isConnected ? 'text-[#1bc5bd]' : 'text-[#f64e60]'}`}>
                            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                            <span className="hidden xl:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                        <div className="flex items-center border-l border-white/[0.1] pl-2 ml-1">
                            <button onClick={toggleFullscreen} className="p-1 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-white transition-colors">
                                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                            </button>
                            <button onClick={onClose} className="p-1 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-[#f64e60] transition-colors ml-1">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* РОБОЧА ЗОНА: absolute inset-2 фізично відриває xterm від потоку */}
                <div className="flex-1 relative min-h-0 min-w-0 w-full bg-[#151521] overflow-hidden">
                    {isDragActive && (
                        <div className="absolute inset-0 bg-[#151521]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center border-4 border-dashed border-[#1bc5bd] m-4 rounded-xl">
                            <UploadCloud size={48} className="text-[#1bc5bd] mb-4" />
                        </div>
                    )}
                    <div ref={terminalRef} className="absolute inset-2 outline-none overflow-hidden" />
                </div>
            </div>
        </div>
    );
};