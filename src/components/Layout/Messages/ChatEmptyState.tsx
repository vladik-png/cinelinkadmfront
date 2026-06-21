import React from 'react';
import { MessageCircle } from 'lucide-react';

export const ChatEmptyState: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#151521]">
            <div className="w-20 h-20 rounded-full bg-[#1e1e2d] border border-white/[0.05] flex items-center justify-center mb-6">
                <MessageCircle size={32} className="text-[#3699ff] opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
            <p className="text-sm text-[#a2a5b9]">Select a conversation or start a new one.</p>
        </div>
    );
};
