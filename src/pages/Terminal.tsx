import * as React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
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

  return (
    <div className="w-full flex flex-col bg-[#151521] min-h-screen font-sans text-[#a2a5b9]">
      <div className="p-8 w-full max-w-7xl mx-auto flex-1 flex flex-col">
        
        <div className="flex justify-between items-end mb-6 border-b border-white/[0.05] pb-6">
          <div>
            <h1 className="text-3xl text-white uppercase tracking-wide font-bold leading-none flex items-center gap-3">
              <TerminalIcon size={28} className="text-[#8950fc]" /> Web Terminal
            </h1>
          </div>
        </div>

        <TerminalTabs 
          sessions={sessions} 
          activeTabId={activeTabId} 
          onTabSelect={setActiveTabId} 
          onCloseSession={closeSession} 
        />

        {activeTabId === 'new' ? (
          <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8">
            <TerminalConnectionForm 
              credentials={credentials}
              setCredentials={setCredentials}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onConnect={startConnection}
            />

            <SavedNodesList 
              savedNodes={savedNodes}
              onSelectNode={setCredentials}
              onRemoveNode={removeSavedNode}
            />
          </div>
        ) : null}

        {sessions.map((session) => (
          <TerminalInstance 
            key={session.id} 
            node={session.node} 
            isActive={activeTabId === session.id} 
            onClose={() => closeSession(session.id)} 
          />
        ))}

      </div>
    </div>
  );
};

export default Terminal;