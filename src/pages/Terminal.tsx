import * as React from 'react';
import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, GripVertical, Columns, Rows, LayoutGrid } from 'lucide-react';
import { Panel, Group, Separator } from 'react-resizable-panels'; 
import { useTerminalLogic } from '../hooks/useTerminalLogic';
import { TerminalTabs } from '../components/Layout/Terminal/TerminalTabs';
import { TerminalConnectionForm } from '../components/Layout/Terminal/TerminalConnectionForm';
import { SavedNodesList } from '../components/Layout/Terminal/SavedNodesList';
import { TerminalInstance } from '../components/Layout/Terminal/TerminalInstance';

const ResizeHandle = ({ orientation }: { orientation: 'horizontal' | 'vertical' }) => {
    const isHorizontal = orientation === 'horizontal';
    return (
        <Separator className={`flex items-center justify-center relative group z-50 transition-all ${isHorizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'}`}>
            <div className={`absolute rounded-full bg-white/[0.05] group-hover:bg-[#1bc5bd] transition-colors flex items-center justify-center ${isHorizontal ? 'h-8 w-1' : 'w-8 h-1'}`} />
        </Separator>
    );
};

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

  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');

  useEffect(() => {
      if (sessions.length >= 3 && layoutMode !== 'grid') {
          setLayoutMode('grid');
      } else if (sessions.length < 3 && layoutMode === 'grid') {
          setLayoutMode('horizontal');
      }
  }, [sessions.length]);

  const renderSessions = () => {
    if (sessions.length === 0) return null;

    if (layoutMode === 'grid' && sessions.length > 2) {
      const mid = Math.ceil(sessions.length / 2);
      const topSessions = sessions.slice(0, mid);
      const bottomSessions = sessions.slice(mid);

      return (
        <Group orientation="vertical" className="w-full h-full overflow-hidden">
          <Panel minSize={10} className="relative min-w-0 min-h-0">
            <div className="absolute inset-0">
                <Group orientation="horizontal" className="w-full h-full overflow-hidden">
                  {topSessions.map((session, index) => (
                    <React.Fragment key={session.id}>
                      {/* СУПЕР-ФІКС: Більше ніяких w-full на панелях! Тільки абсолютне заповнення. */}
                      <Panel minSize={10} className="relative min-w-0 min-h-0">
                        <div className="absolute inset-1">
                          <TerminalInstance node={session.node} isActive={activeTabId !== 'new'} onClose={() => closeSession(session.id)} />
                        </div>
                      </Panel>
                      {index < topSessions.length - 1 && <ResizeHandle orientation="horizontal" />}
                    </React.Fragment>
                  ))}
                </Group>
            </div>
          </Panel>
          
          <ResizeHandle orientation="vertical" />
          
          <Panel minSize={10} className="relative min-w-0 min-h-0">
             <div className="absolute inset-0">
                <Group orientation="horizontal" className="w-full h-full overflow-hidden">
                  {bottomSessions.map((session, index) => (
                    <React.Fragment key={session.id}>
                      <Panel minSize={10} className="relative min-w-0 min-h-0">
                        <div className="absolute inset-1">
                          <TerminalInstance node={session.node} isActive={activeTabId !== 'new'} onClose={() => closeSession(session.id)} />
                        </div>
                      </Panel>
                      {index < bottomSessions.length - 1 && <ResizeHandle orientation="horizontal" />}
                    </React.Fragment>
                  ))}
                </Group>
            </div>
          </Panel>
        </Group>
      );
    }

    const currentOrientation = layoutMode === 'vertical' ? 'vertical' : 'horizontal';
    
    return (
      <Group orientation={currentOrientation} className="w-full h-full overflow-hidden">
        {sessions.map((session, index) => (
          <React.Fragment key={session.id}>
            <Panel minSize={10} className="relative min-w-0 min-h-0">
              <div className="absolute inset-1">
                <TerminalInstance node={session.node} isActive={activeTabId !== 'new'} onClose={() => closeSession(session.id)} />
              </div>
            </Panel>
            {index < sessions.length - 1 && <ResizeHandle orientation={currentOrientation} />}
          </React.Fragment>
        ))}
      </Group>
    );
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[#151521] font-sans text-[#a2a5b9] overflow-hidden min-w-0 min-h-0">
      
      <style dangerouslySetInnerHTML={{__html: `
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

            {sessions.length > 1 && (
                <div className="flex items-center gap-1 bg-[#1e1e2d] p-1.5 rounded-xl border border-white/[0.05] shadow-sm ml-4 shrink-0">
                   <button onClick={() => setLayoutMode('horizontal')} className={`p-1.5 md:p-2 rounded-lg transition-colors ${layoutMode === 'horizontal' ? 'bg-[#8950fc]/20 text-[#8950fc]' : 'text-[#a2a5b9] hover:text-white hover:bg-white/[0.05]'}`}>
                      <Columns size={16} />
                   </button>
                   <button onClick={() => setLayoutMode('vertical')} className={`p-1.5 md:p-2 rounded-lg transition-colors ${layoutMode === 'vertical' ? 'bg-[#8950fc]/20 text-[#8950fc]' : 'text-[#a2a5b9] hover:text-white hover:bg-white/[0.05]'}`}>
                      <Rows size={16} />
                   </button>
                   <button onClick={() => setLayoutMode('grid')} className={`p-1.5 md:p-2 rounded-lg transition-colors ${layoutMode === 'grid' ? 'bg-[#8950fc]/20 text-[#8950fc]' : 'text-[#a2a5b9] hover:text-white hover:bg-white/[0.05]'}`}>
                      <LayoutGrid size={16} />
                   </button>
                </div>
            )}
        </div>

        {/* Робоча зона, яка ніколи не виросте більше дозволеного */}
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