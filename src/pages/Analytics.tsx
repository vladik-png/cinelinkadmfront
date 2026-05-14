import * as React from 'react';
import { useAnalyticsLogic } from '../hooks/useAnalyticsLogic';
import { AnalyticsHeader } from '../components/Layout/Analytics/AnalyticsHeader';
import { NodeCard } from '../components/Layout/Analytics/NodeCard';

const Analytics: React.FC = () => {
  const {
    nodesHistory,
    viewMode,
    selectedNode,
    displayedNodes,
    handleResetView,
    toggleViewMode
  } = useAnalyticsLogic();

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
      <div className="p-8 w-full max-w-7xl mx-auto flex-1">

        <AnalyticsHeader
          selectedNode={selectedNode}
          viewMode={viewMode}
          onResetView={handleResetView}
        />

        <div className="grid grid-cols-1 gap-8">
          {displayedNodes.map(nodeId => (
            <NodeCard
              key={nodeId}
              nodeId={nodeId}
              history={nodesHistory[nodeId] || []}
              viewMode={viewMode}
              selectedNode={selectedNode}
              onToggleView={toggleViewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;