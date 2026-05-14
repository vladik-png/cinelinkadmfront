import * as React from 'react';
import { Server, User, Key, EyeOff, Eye } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';

interface TerminalConnectionFormProps {
    credentials: SavedNode;
    setCredentials: (creds: SavedNode) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    onConnect: () => void;
}

export const TerminalConnectionForm: React.FC<TerminalConnectionFormProps> = ({
    credentials,
    setCredentials,
    showPassword,
    setShowPassword,
    onConnect
}) => {
    return (
        <div className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/[0.05] shadow-lg w-full max-w-md border-t-2 border-t-[#8950fc]/50">
            <h2 className="text-xl text-white font-bold mb-6 text-center uppercase tracking-wide">Connecting to server</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                        <Server size={12} /> IP Address
                    </label>
                    <input
                        type="text"
                        placeholder="185.227.108.14"
                        value={credentials.host}
                        onChange={e => setCredentials({ ...credentials, host: e.target.value })}
                        className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors"
                    />
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                        <User size={12} /> User
                    </label>
                    <input
                        type="text"
                        value={credentials.user}
                        onChange={e => setCredentials({ ...credentials, user: e.target.value })}
                        className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8950fc] transition-colors"
                    />
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                        <Key size={12} /> Password
                    </label>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#a2a5b9] hover:text-white !bg-transparent !border-none !shadow-none !outline-none"
                            style={{ backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                        Download Folder
                    </label>
                    <input
                        type="text"
                        value={credentials.remoteDir}
                        onChange={e => setCredentials({ ...credentials, remoteDir: e.target.value })}
                        className="w-full bg-[#151521] border border-white/[0.1] rounded-xl px-4 py-3 text-[#a2a5b9] text-xs font-mono focus:outline-none focus:border-[#8950fc]"
                    />
                </div>

                <button
                    onClick={onConnect}
                    className="w-full mt-4 bg-[#8950fc]/20 text-[#8950fc] border border-[#8950fc]/30 hover:bg-[#8950fc]/30 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
                >
                    Establish Connection
                </button>
            </div>
        </div>
    );
};