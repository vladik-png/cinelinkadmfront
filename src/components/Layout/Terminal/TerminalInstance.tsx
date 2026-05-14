import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useDropzone } from 'react-dropzone';
import { Server, Wifi, WifiOff, UploadCloud, X } from 'lucide-react';
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
        fitAddon.fit();
        xtermRef.current = term;

        const ws = new WebSocket(`${getTerminalWsUrl()}/ssh`);
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'auth', host: node.host, user: node.user, pass: node.pass }));
            setIsConnected(true);
        };

        ws.onmessage = (event) => term.write(event.data);
        ws.onclose = () => {
            setIsConnected(false);
            term.writeln('\r\n\x1b[31m[Disconnected]\x1b[0m Connection terminated.\r\n');
        };

        term.onData(data => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });

        const handleResize = () => {
            if (isActive) fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ws.close();
            term.dispose();
        };
    }, []);

    useEffect(() => {
        if (isActive && fitAddonRef.current) {
            setTimeout(() => fitAddonRef.current?.fit(), 50);
        }
    }, [isActive]);

    return (
        <div className={`relative flex-1 bg-[#1e1e2d] rounded-2xl border border-white/[0.05] shadow-lg flex flex-col overflow-hidden border-t-2 border-t-[#8950fc]/50 ${isActive ? 'flex' : 'hidden'}`}>
            <div {...getRootProps()} className="flex-1 flex flex-col relative h-full">
                <input {...getInputProps()} />

                <div className="flex justify-between items-center px-6 py-3 bg-[#151521] border-b border-white/[0.05]">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-[#a2a5b9]">
                        <Server size={12} /> Host: <span className="text-white">{node.host}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest ${isConnected ? 'text-[#1bc5bd]' : 'text-[#f64e60]'}`}>
                            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/[0.1] rounded-lg text-[#a2a5b9] hover:text-[#f64e60] transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 relative overflow-hidden">
                    {isDragActive && (
                        <div className="absolute inset-0 bg-[#151521]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center border-4 border-dashed border-[#1bc5bd] m-4 rounded-xl">
                            <UploadCloud size={64} className="text-[#1bc5bd] mb-4" />
                            <span className="text-[#1bc5bd] text-xl font-bold uppercase tracking-widest">Drop files to upload via SFTP</span>
                        </div>
                    )}
                    {uploadStatus && (
                        <div className="absolute bottom-6 right-6 bg-[#1bc5bd]/10 border border-[#1bc5bd]/30 text-[#1bc5bd] px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 z-40">
                            {uploadStatus}
                        </div>
                    )}
                    <div ref={terminalRef} className="h-full w-full" />
                </div>
            </div>
        </div>
    );
};