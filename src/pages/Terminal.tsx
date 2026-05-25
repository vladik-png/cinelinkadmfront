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
      <div className="w-full h-full flex flex-wrap gap-4 overflow-y-auto content-start p-2 relative">
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
                className="absolute inset-0 outline-none flex flex-col pointer-events-auto"
                onClickCapture={() => setActiveTabId(session.id)}
                tabIndex={-1}
              >
                <TerminalInstance 
                    node={session.node} 
                    isActive={isActive} 
                    onClose={() => closeSession(session.id)} 
                />
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

          .custom-tabs-scrollbar::-webkit-scrollbar { height: 6px; }
          .custom-tabs-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
          .custom-tabs-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
          .custom-tabs-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(137, 80, 252, 0.5); }

          .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar { width: 0px; height: 0px; }
          .terminal-custom-scrollbar.is-active .xterm-viewport::-webkit-scrollbar,
          .terminal-custom-scrollbar:focus-within .xterm-viewport::-webkit-scrollbar { width: 8px; height: 8px; }
          .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-track { background: transparent; }
          .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-thumb { background: #2b2b40; border-radius: 4px; }
          .terminal-custom-scrollbar .xterm-viewport::-webkit-scrollbar-thumb:hover { background: #8950fc; }
      `}} />

      <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">

        <div className="flex-none flex justify-between items-end mb-4 md:mb-6 border-b border-white/[0.05] pb-4 md:pb-6 w-full overflow-hidden min-w-0">
          <h1 className="text-2xl md:text-3xl text-white uppercase tracking-wide font-bold leading-none flex items-center gap-3 truncate">
            <TerminalIcon size={24} className="text-[#8950fc] shrink-0" /> Web Terminal
          </h1>
        </div>

        <div className="flex-none w-full overflow-hidden mb-2">
            <TerminalTabs
              sessions={sessions}
              activeTabId={activeTabId}
              onTabSelect={setActiveTabId}
              onCloseSession={closeSession}
            />
        </div>

        <div className="flex-1 relative min-h-0 min-w-0 w-full overflow-hidden">
          <div className={`absolute inset-0 z-30 flex flex-col lg:flex-row items-start justify-center gap-8 overflow-y-auto terminal-custom-scrollbar pt-8 lg:pt-16 pb-10 transition-opacity duration-200 ${activeTabId === 'new' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
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