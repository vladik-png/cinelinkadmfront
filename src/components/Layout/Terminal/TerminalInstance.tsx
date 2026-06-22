import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';
import { uploadFileViaTerminal } from '../../../api/terminalService';
import { useTerminalSession } from '../../../hooks/terminal/useTerminalSession';
import { TerminalHeader } from './TerminalHeader';
import 'xterm/css/xterm.css';

interface TerminalInstanceProps {
    node: SavedNode;
    isActive: boolean;
    onClose: () => void;
}

export const TerminalInstance: React.FC<TerminalInstanceProps> = ({ node, isActive, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const { isConnected, xtermRef, refit } = useTerminalSession(terminalRef, node, isActive);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !isConnected) return;
        xtermRef.current?.writeln(`\r\n\x1b[36m[SYSTEM]\x1b[0m Sending ${file.name} via SFTP...\r\n`);
        try {
            await uploadFileViaTerminal(file, node);
            xtermRef.current?.writeln(`\x1b[32m[SUCCESS]\x1b[0m File saved to ${node.remoteDir}${file.name}\r\n`);
        } catch {
            xtermRef.current?.writeln(`\x1b[31m[ERROR]\x1b[0m Failed to upload file.\r\n`);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

    useEffect(() => {
        const onFullscreenChange = () => {
            const isFS = document.fullscreenElement === containerRef.current;
            setIsFullscreen(isFS);
            refit();
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, [refit]);

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
            className={`terminal-custom-scrollbar ${isActive ? 'is-active' : ''} flex flex-col transition-all duration-200 overflow-hidden w-full h-full bg-[#1e1e2d]`}
        >
            <div {...getRootProps()} className="flex-1 flex flex-col relative min-h-0 min-w-0 w-full h-full overflow-hidden">
                <input {...getInputProps()} />

                <TerminalHeader 
                    node={node}
                    isActive={isActive}
                    isConnected={isConnected}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    onClose={onClose}
                />

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