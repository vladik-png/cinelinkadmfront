import * as React from 'react';
import { Server } from 'lucide-react';
import { TopNode } from '../../../types/dashboard';

interface TopNodesListProps {
  nodes: TopNode[];
  onViewAll?: () => void;
}

export const TopNodesList: React.FC<TopNodesListProps> = ({ nodes, onViewAll }) => {
  return (
    <div className="bg-[#1e1e2d] rounded-xl border border-[#2b2b40] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white tracking-wide">Top 5 Loaded Servers</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-[#3699ff] hover:text-[#2d80d2] transition-colors bg-[#3699ff]/10 hover:bg-[#3699ff]/20 px-3 py-1.5 rounded-lg font-medium"
          >
            View All
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4">
        {nodes.length > 0 ? (
          nodes.map((node, i) => (
            <div 
              key={node.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2b2b40]/50 transition-all border border-transparent hover:border-[#2b2b40] group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f64e60]/10 flex items-center justify-center text-[#f64e60] group-hover:scale-110 transition-transform">
                  <Server size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {node.name}
                  </div>
                  <div className="text-xs text-[#a2a5b9] mt-0.5 font-mono">
                    ID: {node.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#a2a5b9] mb-1">CPU</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{node.cpu}%</span>
                    <div className="w-16 h-1.5 bg-[#2b2b40] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#f64e60] rounded-full" 
                        style={{ width: `${Math.min(node.cpu, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#a2a5b9] mb-1">RAM</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{node.ram}%</span>
                    <div className="w-16 h-1.5 bg-[#2b2b40] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#ffa800] rounded-full" 
                        style={{ width: `${Math.min(node.ram, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#a2a5b9] gap-3">
            <Server size={32} className="opacity-20" />
            <p className="text-sm">No active servers found</p>
          </div>
        )}
      </div>
    </div>
  );
};
