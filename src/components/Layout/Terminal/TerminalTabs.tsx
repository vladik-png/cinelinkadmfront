import * as React from 'react';
import { Plus, Server, X } from 'lucide-react';
import { TerminalSession } from '../../../types/terminal';

interface TerminalTabsProps {
    sessions: TerminalSession[];
    activeTabId: string;
    onTabSelect: (id: string) => void;
    onCloseSession: (id: string) => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({ sessions, activeTabId, onTabSelect, onCloseSession }) => {
    return (
        <>
            {/* Стилізуємо скролбар, щоб він не був вирвиоком від Windows */}
            <style>{`
                .custom-tabs-scrollbar::-webkit-scrollbar {
                    height: 6px; /* Робимо його тоненьким */
                }
                .custom-tabs-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02); /* Ледь помітний фон */
                    border-radius: 4px;
                }
                .custom-tabs-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1); /* Темний повзунок */
                    border-radius: 4px;
                }
                .custom-tabs-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(137, 80, 252, 0.5); /* Фіолетовий колір при наведенні (в тон твого UI) */
                }
            `}</style>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-3 custom-tabs-scrollbar w-full">
                <button
                    onClick={() => onTabSelect('new')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${activeTabId === 'new'
                            ? 'bg-[#8950fc]/10 text-[#8950fc] border-[#8950fc]/30'
                            : 'bg-[#1e1e2d] text-[#a2a5b9] border-white/[0.05] hover:border-white/[0.1]'
                        }`}
                >
                    <Plus size={14} /> New Connection
                </button>

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => onTabSelect(session.id)}
                        className={`group flex items-center gap-3 px-5 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer shrink-0 ${activeTabId === session.id
                                ? 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/30'
                                : 'bg-[#1e1e2d] text-[#a2a5b9] border-white/[0.05] hover:border-white/[0.1]'
                            }`}
                    >
                        <Server size={14} className={activeTabId === session.id ? 'text-[#1bc5bd]' : 'text-[#a2a5b9]'} />
                        {session.node.user}@{session.node.host}
                        <button
                            onClick={(e) => { e.stopPropagation(); onCloseSession(session.id); }}
                            className={`ml-2 p-1 rounded-md opacity-50 group-hover:opacity-100 transition-all ${activeTabId === session.id ? 'hover:bg-[#1bc5bd]/20 hover:text-white' : 'hover:bg-white/[0.1] hover:text-[#f64e60]'
                                }`}
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};