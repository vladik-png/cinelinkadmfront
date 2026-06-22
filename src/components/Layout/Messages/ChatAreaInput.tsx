import * as React from 'react';
import { Send, Image as ImageIcon, Paperclip } from 'lucide-react';

import { IconButton } from '../../UI/IconButton';

interface ChatAreaInputProps {
    messageInput: string;
    onMessageInputChange: (val: string) => void;
    onSendMessage: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    sending: boolean;
}

export const ChatAreaInput: React.FC<ChatAreaInputProps> = ({
    messageInput,
    onMessageInputChange,
    onSendMessage,
    onKeyDown,
    sending
}) => {
    return (
        <div className="p-6 bg-[#1e1e2d] border-t border-white/[0.05]">
            <div className="flex items-center gap-4 bg-[#151521] border border-white/[0.05] p-2 rounded-2xl focus-within:border-[#3699ff]/50 transition-colors">
                <IconButton size="lg">
                    <Paperclip size={20} />
                </IconButton>
                <IconButton size="lg" className="hidden sm:block">
                    <ImageIcon size={20} />
                </IconButton>

                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => onMessageInputChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Write a message..."
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#a2a5b9]/50 px-2"
                    disabled={sending}
                />

                <button
                    onClick={onSendMessage}
                    disabled={!messageInput.trim() || sending}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${messageInput.trim() ? 'bg-[#3699ff] text-white shadow-lg shadow-[#3699ff]/20' : 'bg-white/[0.05] text-[#a2a5b9] cursor-not-allowed'
                        }`}
                >
                    <Send size={18} className={messageInput.trim() ? 'ml-1' : ''} />
                </button>
            </div>
        </div>
    );
};
