import * as React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { Resizable } from 're-resizable';
import { useTerminalLogic } from '../hooks/useTerminalLogic';
import { TerminalTabs } from '../components/Layout/Terminal/TerminalTabs';
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
      <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-wrap content-start gap-4 p-2 relative">
        {sessions.map((session) => {
          const isActive = activeTabId === session.id;
          return (
            <Resizable
              key={session.id}
              defaultSize={{ width: 500, height: 400 }}
              minWidth={300}
              minHeight={200}
              maxWidth="100%"
              className={`relative flex-shrink-0 ${isActive ? 'z-10' : 'z-0'}`}
            >
              <div
                className="absolute inset-0"
                onClickCapture={() => setActiveTabId(session.id)}
              >
                <TerminalInstance node={session.node} isActive={isActive} onClose={() => closeSession(session.id)} />
              </div>
            </Resizable>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[#151521] font-sans text-[#a2a5b9] overflow-hidden min-w-0 min-h-0">

      <style dangerouslySetInnerHTML={{
        __html: `
          .no-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
          .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}} />

      <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">

        <div className="flex-none flex justify-between items-end mb-4 md:mb-6 border-b border-white/[0.05] pb-4 md:pb-6 w-full overflow-hidden min-w-0">
          <h1 className="text-2xl md:text-3xl text-white uppercase tracking-wide font-bold leading-none flex items-center gap-3 truncate">
            <TerminalIcon size={24} className="text-[#8950fc] shrink-0" /> Web Terminal
          </h1>
        </div>

        <div className="flex-none flex justify-between items-center mb-2 min-w-0 w-full overflow-hidden">
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <TerminalTabs
              sessions={sessions}
              activeTabId={activeTabId}
              onTabSelect={setActiveTabId}
              onCloseSession={closeSession}
            />
          </div>
        </div>

        <div className="flex-1 relative min-h-0 min-w-0 w-full overflow-hidden">
          <div className={`absolute inset-0 z-20 flex flex-col lg:flex-row items-start justify-center gap-8 overflow-y-auto no-scrollbar pb-10 transition-opacity duration-200 ${activeTabId === 'new' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <TerminalConnectionForm credentials={credentials} setCredentials={setCredentials} showPassword={showPassword} setShowPassword={setShowPassword} onConnect={startConnection} />
            <SavedNodesList savedNodes={savedNodes} onSelectNode={setCredentials} onRemoveNode={removeSavedNode} />
          </div>

          <div className={`absolute inset-0 z-10 transition-opacity duration-200 ${activeTabId !== 'new' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {renderSessions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;