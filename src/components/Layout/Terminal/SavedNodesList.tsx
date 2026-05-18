import * as React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { SavedNode } from '../../../types/terminal';

interface SavedNodesListProps {
    savedNodes: SavedNode[];
    onSelectNode: (node: SavedNode) => void;
    onRemoveNode: (host: string, e: React.MouseEvent) => void;
}

export const SavedNodesList: React.FC<SavedNodesListProps> = ({ savedNodes, onSelectNode, onRemoveNode }) => {
    if (savedNodes.length === 0) return null;

    return (
        <div className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/[0.05] shadow-lg w-full max-w-sm">
            <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
                <Bookmark size={20} className="text-[#1bc5bd]" /> Saved Nodes
            </h2>
            <div className="flex flex-col gap-3">
                {savedNodes.map((node, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSelectNode(node)}
                        className="group cursor-pointer bg-[#151521] border border-white/[0.05] hover:border-[#1bc5bd]/50 rounded-xl p-4 transition-all flex justify-between items-center"
                    >
                        <div>
                            <div className="text-white font-bold text-sm mb-1">{node.host}</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-[#a2a5b9]">{node.user}</div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveNode(node.host, e);
                            }}
                            className="text-[#f64e60]/50 hover:text-[#f64e60] hover:bg-[#f64e60]/10 p-2 rounded-lg transition-all bg-transparent border-none outline-none"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};