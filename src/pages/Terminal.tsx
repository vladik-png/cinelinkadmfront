import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useDropzone } from 'react-dropzone';
import { Terminal as TerminalIcon, Wifi, WifiOff, UploadCloud, Server, Key, User, Eye, EyeOff, Bookmark, Trash2 } from 'lucide-react';
import 'xterm/css/xterm.css';

interface SavedNode {
    host: string;
    user: string;
    pass: string;
    remoteDir: string;
}

const Terminal: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [credentials, setCredentials] = useState<SavedNode>({ host: '', user: 'root', pass: '', remoteDir: '/root/' });
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [savedNodes, setSavedNodes] = useState<SavedNode[]>([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8085';

    useEffect(() => {
        const saved = localStorage.getItem('cinelink_terminal_nodes');
        if (saved) {
            setSavedNodes(JSON.parse(saved));
        }
    }, []);

    const startConnection = () => {
        if (!credentials.host || !credentials.pass) {
            alert("Enter IP and password!");
            return;
        }

        const newNodes = [
            credentials,
            ...savedNodes.filter(n => n.host !== credentials.host)
        ].slice(0, 5);

        setSavedNodes(newNodes);
        localStorage.setItem('cinelink_terminal_nodes', JSON.stringify(newNodes));
        setIsFormVisible(false);
    };

    const removeSavedNode = (hostToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newNodes = savedNodes.filter(n => n.host !== hostToRemove);
        setSavedNodes(newNodes);
        localStorage.setItem('cinelink_terminal_nodes', JSON.stringify(newNodes));
    };

    const disconnect = () => {
        socketRef.current?.close();
        setIsConnected(false);
        setIsFormVisible(true);
    };

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !isConnected) return;

        setUploadStatus(`Uploading: ${file.name}...`);
        xtermRef.current?.writeln(`\r\n\x1b[36m[SYSTEM]\x1b[0m Sending ${file.name} via SFTP...\r\n`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('host', credentials.host);
        formData.append('user', credentials.user);
        formData.append('pass', credentials.pass);
        formData.append('remoteDir', credentials.remoteDir);

        try {
            const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
            if (res.ok) {
                setUploadStatus('Upload successful');
                xtermRef.current?.writeln(`\x1b[32m[SUCCESS]\x1b[0m File saved to ${credentials.remoteDir}${file.name}\r\n`);
            } else {
                throw new Error();
            }
        } catch {
            setUploadStatus('Upload failed');
            xtermRef.current?.writeln(`\x1b[31m[ERROR]\x1b[0m Failed to upload file.\r\n`);
        }
        setTimeout(() => setUploadStatus(null), 3000);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

    useEffect(() => {
        if (isFormVisible || !terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            theme: { background: '#151521', foreground: '#a2a5b9', cursor: '#1bc5bd' }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
        xtermRef.current = term;

        const ws = new WebSocket(`${WS_URL}/ssh`);
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: 'auth',
                host: credentials.host,
                user: credentials.user,
                pass: credentials.pass
            }));
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

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ws.close();
            term.dispose();
        };
    }, [isFormVisible]);

    return (
        <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
            <div className="p-8 w-full max-w-7xl mx-auto flex-1 flex flex-col">

                <div className="flex justify-between items-end mb-8 border-b border-white/[0.05] pb-6">
                    <div>
                        <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none flex items-center gap-3">
                            <TerminalIcon size={28} className="text-[#8950fc]" /> Web Terminal
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isFormVisible && (
                            <button onClick={disconnect} className="px-4 py-2 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-[10px] uppercase font-bold tracking-widest transition-all">
                                Disconnect
                            </button>
                        )}
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest ${isConnected ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20' : 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20'
                            }`}>
                            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                </div>

                {isFormVisible ? (
                    <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8">
                        <div className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/[0.05] shadow-lg w-full max-w-md border-t-2 border-t-[#8950fc]/50">
                            <h2 className="text-xl text-white font-bold mb-6 text-center uppercase tracking-wide">Connecting to server</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Server size={12} /> IP Address</label>
                                    <input type="text" placeholder="185.227.108.14" value={credentials.host} onChange={e => setCredentials({ ...credentials, host: e.target.value })} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><User size={12} /> User</label>
                                    <input type="text" value={credentials.user} onChange={e => setCredentials({ ...credentials, user: e.target.value })} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors" />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Key size={12} /> Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={credentials.pass}
                                            onChange={e => setCredentials({ ...credentials, pass: e.target.value })}
                                            className="w-full bg-[#151521] border border-white/[0.1] rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#a2a5b9] hover:text-white !bg-transparent hover:!bg-transparent focus:!bg-transparent !border-none !shadow-none !outline-none"
                                            style={{ backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">Download Folder</label>
                                    <input type="text" value={credentials.remoteDir} onChange={e => setCredentials({ ...credentials, remoteDir: e.target.value })} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-[#a2a5b9] text-xs font-mono focus:outline-none focus:border-[#8950fc]" />
                                </div>

                                <button onClick={startConnection} className="w-full mt-4 bg-[#8950fc]/20 text-[#8950fc] border border-[#8950fc]/30 hover:bg-[#8950fc]/30 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all">
                                    Establish Connection
                                </button>
                            </div>
                        </div>

                        {savedNodes.length > 0 && (
                            <div className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/[0.05] shadow-lg w-full max-w-sm">
                                <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
                                    <Bookmark size={20} className="text-[#1bc5bd]" /> Saved Nodes
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {savedNodes.map((node, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCredentials(node)}
                                            className="group cursor-pointer bg-[#151521] border border-white/[0.05] hover:border-[#1bc5bd]/50 rounded-xl p-4 transition-all flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="text-white font-bold text-sm mb-1">{node.host}</div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-[#a2a5b9]">{node.user}</div>
                                            </div>

                                            <button
                                                onClick={(e) => removeSavedNode(node.host, e)}
                                                className="text-[#f64e60]/50 hover:text-[#f64e60] hover:bg-[#f64e60]/10 p-2 rounded-lg transition-all !bg-transparent"
                                                title="Delete node"
                                                style={{ backgroundColor: 'transparent' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div {...getRootProps()} className="relative flex-1 bg-[#1e1e2d] rounded-2xl border border-white/[0.05] shadow-lg flex flex-col overflow-hidden border-t-2 border-t-[#8950fc]/50">
                        <input {...getInputProps()} />

                        <div className="flex justify-between items-center px-6 py-3 bg-[#151521] border-b border-white/[0.05]">
                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-[#a2a5b9]">
                                <Server size={12} /> Host: <span className="text-white">{credentials.host}</span>
                            </div>
                        </div>

                        <div className="flex-1 p-6 relative">
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
                )}

            </div>
        </div>
    );
};

export default Terminal;