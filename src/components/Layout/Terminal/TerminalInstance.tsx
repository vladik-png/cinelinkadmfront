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
            
            setTimeout(() => {
                if (fitAddonRef.current) {
                    fitAddonRef.current.fit();
                }
            }, 100);
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

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setTimeout(() => {
            fitAddonRef.current?.fit();
            xtermRef.current?.focus();
        }, 100);
    };

    return (
        <div 
            className={`bg-[#1e1e2d] flex flex-col transition-all duration-200 
            ${isFullscreen 
                ? 'fixed inset-0 z-[100] rounded-none border-0' 
                : 'absolute inset-0 rounded-2xl border border-white/[0.05] border-t-2 border-t-[#8950fc]/50 shadow-lg' 
            }
            ${isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
        >
            <div {...getRootProps()} className="flex-1 flex flex-col relative min-h-0 w-full">
                <input {...getInputProps()} />

                <div className="flex-none flex justify-between items-center px-6 py-3 bg-[#151521] border-b border-white/[0.05]">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-[#a2a5b9]">
                        <Server size={12} /> Host: <span className="text-white">{node.host}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest ${isConnected ? 'text-[#1bc5bd]' : 'text-[#f64e60]'}`}>
                            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                        
                        <div className="flex items-center gap-1 border-l border-white/[0.1] pl-4 ml-2">
                            <button 
                                onClick={toggleFullscreen} 
                                className="p-1.5 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-white transition-colors"
                            >
                                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                            </button>
                            <button 
                                onClick={onClose} 
                                className="p-1.5 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-[#f64e60] transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-auto relative min-h-0 bg-[#151521] overflow-hidden">
                    <div ref={terminalRef} className="absolute inset-2 md:inset-4 h-auto w-auto" />
                </div>
            </div>
        </div>
    );
};