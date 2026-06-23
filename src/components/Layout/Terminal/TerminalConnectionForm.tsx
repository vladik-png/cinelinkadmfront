import * as React from 'react';
import { Server, User, Key, EyeOff, Eye } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';
import { Input } from '../../UI/Input';

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
                <Input
                    label="IP Address"
                    icon={<Server size={12} />}
                    type="text"
                    placeholder="185.227.108.14"
                    value={credentials.host}
                    onChange={e => setCredentials({ ...credentials, host: e.target.value })}
                />
                <Input
                    label="User"
                    icon={<User size={12} />}
                    type="text"
                    value={credentials.user}
                    onChange={e => setCredentials({ ...credentials, user: e.target.value })}
                />
                <Input
                    label="Password"
                    icon={<Key size={12} />}
                    type={showPassword ? "text" : "password"}
                    value={credentials.pass}
                    onChange={e => setCredentials({ ...credentials, pass: e.target.value })}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1.5 text-[#a2a5b9] hover:text-white transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    }
                />
                <Input
                    label="Remote Upload Path"
                    type="text"
                    value={credentials.remoteDir}
                    onChange={e => setCredentials({ ...credentials, remoteDir: e.target.value })}
                    className="font-mono text-[#a2a5b9] text-xs"
                />

                <button
                    onClick={onConnect}
                    className="w-full mt-4 bg-gradient-to-r from-[#3699ff] to-[#8950fc] text-white hover:opacity-90 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all cursor-pointer shadow-[0_4px_12px_rgba(137,80,252,0.25)]"
                >
                    Establish Connection
                </button>
            </div>
        </div>
    );
};