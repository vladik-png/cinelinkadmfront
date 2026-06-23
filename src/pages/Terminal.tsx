import * as React from 'react';
import { useTerminalLogic } from '../hooks/terminal/useTerminalLogic';
import { TerminalTabs } from '../components/Layout/Terminal/TerminalTabs';
import { TerminalPageHeader } from '../components/Layout/Terminal/TerminalPageHeader';
import { TerminalConnectionForm } from '../components/Layout/Terminal/TerminalConnectionForm';
import { SavedNodesList } from '../components/Layout/Terminal/SavedNodesList';
import { TerminalInstance } from '../components/Layout/Terminal/TerminalInstance';

const Terminal: React.FC = () => {
  const {
    credentials,
    setCredentials,
    showPassword,
    setShowPassword,
    savedNodes,
    sessions,
    activeTabId,
    setActiveTabId,
    startConnection,
    removeSavedNode,
    closeSession
  } = useTerminalLogic();

  const renderSessions = () => {
    if (sessions.length === 0) return null;

    return (
      <div className="w-full h-full relative bg-[#1e1e2d] rounded-2xl overflow-hidden border border-white/[0.05] shadow-lg">
        {sessions.map((session) => {
          const isActive = activeTabId === session.id;

          return (
            <div
              key={session.id}
              className={`absolute inset-0 transition-opacity duration-200 ${isActive ? 'z-10 opacity-100 pointer-events-auto' : 'z-0 opacity-0 pointer-events-none'}`}
            >
              <TerminalInstance
                node={session.node}
                isActive={isActive}
                onClose={() => closeSession(session.id)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex-1 flex flex-col bg-[#151521] font-sans text-[#a2a5b9] overflow-hidden min-w-0 min-h-0">

      <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">

        <TerminalPageHeader />

        <div className="flex-none w-full overflow-hidden mb-2">
          <TerminalTabs
            sessions={sessions}
            activeTabId={activeTabId}
            onTabSelect={setActiveTabId}
            onCloseSession={closeSession}
          />
        </div>

        <div className="flex-1 relative min-h-0 min-w-0 w-full overflow-hidden flex flex-col">
          {activeTabId === 'new' ? (
            <div className="flex-1 overflow-y-auto w-full h-full flex flex-col items-center justify-center p-4">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full max-w-[1000px]">
                <TerminalConnectionForm credentials={credentials} setCredentials={setCredentials} showPassword={showPassword} setShowPassword={setShowPassword} onConnect={startConnection} />
                <SavedNodesList savedNodes={savedNodes} onSelectNode={setCredentials} onRemoveNode={removeSavedNode} />
              </div>
            </div>
          ) : (
            <div className="flex-1 relative min-h-0 min-w-0 w-full">
              {renderSessions()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;