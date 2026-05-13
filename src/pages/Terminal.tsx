import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useDropzone } from 'react-dropzone';
import { Terminal as TerminalIcon, Wifi, WifiOff, UploadCloud, Server, Key, User, Eye, EyeOff, Bookmark, Trash2, Plus, X } from 'lucide-react';
import { fetchSavedNodes, syncNodesToBackend, uploadFileViaTerminal, getTerminalWsUrl, SavedNode } from '../api/terminalService';
import 'xterm/css/xterm.css';

interface TerminalSession {
  id: string;
  node: SavedNode;
}

const TerminalInstance: React.FC<{ node: SavedNode; isActive: boolean; onClose: () => void }> = ({ node, isActive, onClose }) => {
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

const Terminal: React.FC = () => {
  const [credentials, setCredentials] = useState<SavedNode>({ host: '', user: 'root', pass: '', remoteDir: '/root/' });
  const [showPassword, setShowPassword] = useState(false);
  const [savedNodes, setSavedNodes] = useState<SavedNode[]>([]);
  
  // Читаємо збережені вкладки при завантаженні
  const [sessions, setSessions] = useState<TerminalSession[]>(() => {
    const saved = sessionStorage.getItem('cinelink_active_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Читаємо активну вкладку при завантаженні
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return sessionStorage.getItem('cinelink_active_tab_id') || 'new';
  });

  // Автоматично зберігаємо вкладки при будь-якій зміні
  useEffect(() => {
    sessionStorage.setItem('cinelink_active_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Автоматично зберігаємо активну вкладку при зміні
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

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
      <div className="p-8 w-full max-w-7xl mx-auto flex-1 flex flex-col">
        
        <div className="flex justify-between items-end mb-6 border-b border-white/[0.05] pb-6">
          <div>
            <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none flex items-center gap-3">
              <TerminalIcon size={28} className="text-[#8950fc]" /> Web Terminal
            </h1>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/[0.1] scrollbar-track-transparent">
          <button 
            onClick={() => setActiveTabId('new')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTabId === 'new' 
                ? 'bg-[#8950fc]/10 text-[#8950fc] border-[#8950fc]/30' 
                : 'bg-[#1e1e2d] text-[#a2a5b9] border-white/[0.05] hover:border-white/[0.1]'
            }`}
          >
            <Plus size={14} /> New Connection
          </button>
          
          {sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => setActiveTabId(session.id)}
              className={`group flex items-center gap-3 px-5 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                activeTabId === session.id 
                  ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/30' 
                  : 'bg-[#1e1e2d] text-[#a2a5b9] border-white/[0.05] hover:border-white/[0.1]'
              }`}
            >
              <Server size={14} className={activeTabId === session.id ? 'text-[#1bc5bd]' : 'text-[#a2a5b9]'} />
              {session.node.user}@{session.node.host}
              <button 
                onClick={(e) => { e.stopPropagation(); closeSession(session.id); }}
                className={`ml-2 p-1 rounded-md opacity-50 group-hover:opacity-100 transition-all ${
                  activeTabId === session.id ? 'hover:bg-[#1bc5bd]/20 hover:text-white' : 'hover:bg-white/[0.1] hover:text-[#f64e60]'
                }`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {activeTabId === 'new' ? (
          <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8">
            <div className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/[0.05] shadow-lg w-full max-w-md border-t-2 border-t-[#8950fc]/50">
              <h2 className="text-xl text-white font-bold mb-6 text-center uppercase tracking-wide">Connecting to server</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Server size={12}/> IP Address</label>
                  <input type="text" placeholder="185.227.108.14" value={credentials.host} onChange={e => setCredentials({...credentials, host: e.target.value})} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><User size={12}/> User</label>
                  <input type="text" value={credentials.user} onChange={e => setCredentials({...credentials, user: e.target.value})} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Key size={12}/> Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={credentials.pass} onChange={e => setCredentials({...credentials, pass: e.target.value})} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#a2a5b9] hover:text-white !bg-transparent !border-none !shadow-none !outline-none" style={{ backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">Download Folder</label>
                  <input type="text" value={credentials.remoteDir} onChange={e => setCredentials({...credentials, remoteDir: e.target.value})} className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-[#a2a5b9] text-xs font-mono focus:outline-none focus:border-[#8950fc]" />
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
                    <div key={idx} onClick={() => setCredentials(node)} className="group cursor-pointer bg-[#151521] border border-white/[0.05] hover:border-[#1bc5bd]/50 rounded-xl p-4 transition-all flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold text-sm mb-1">{node.host}</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-[#a2a5b9]">{node.user}</div>
                      </div>
                      <button onClick={(e) => removeSavedNode(node.host, e)} className="text-[#f64e60]/50 hover:text-[#f64e60] hover:bg-[#f64e60]/10 p-2 rounded-lg transition-all !bg-transparent" style={{ backgroundColor: 'transparent' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {sessions.map((session) => (
          <TerminalInstance 
            key={session.id} 
            node={session.node} 
            isActive={activeTabId === session.id} 
            onClose={() => closeSession(session.id)} 
          />
        ))}

      </div>
    </div>
  );
};

export default Terminal;