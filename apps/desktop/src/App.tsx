import { useState, useEffect } from 'react';
import { Play, Sparkles, CheckSquare, Square, PanelLeftClose, PanelRightClose, Menu, X, HelpCircle, Settings } from 'lucide-react';
import { FileSelector } from './components/FileSelector';
import { RuleBuilder } from './components/RuleBuilder';
import { FileList } from './components/FileList';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { RenameConfirmationModal } from './components/RenameConfirmationModal';
import { FileInfo, Rule, applyRules } from '@renamer/core';
import { scanFiles, performRename } from './lib/file-system';
import { defaultRules } from './lib/defaultRules';

export default function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  
  // Responsive panel states
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings
  const [appSettings, setAppSettings] = useState({
    recursiveScan: false,
    showHiddenFiles: false,
    confirmBeforeApply: true // Default to true for safety
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    count: 0,
    files: [] as FileInfo[]
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setHelpOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFilesSelected = async (path: string | null) => {
      if (!path) return;
      setLoading(true);
      const scanned = await scanFiles(path, appSettings.recursiveScan);
      setFiles(scanned);
      setSelectedFiles(new Set());
      setLoading(false);
      // On mobile, close menu after selecting
      setMobileMenuOpen(false);
  };

  const toggleFileSelection = (filePath: string) => {
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(filePath)) {
          newSelected.delete(filePath);
      } else {
          newSelected.add(filePath);
      }
      setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
      setSelectedFiles(new Set(files.map(f => f.path)));
  };

  const deselectAllFiles = () => {
      setSelectedFiles(new Set());
  };
  
  const handleApply = async () => {
      const initialFilesToRename = selectionMode && selectedFiles.size > 0
          ? files.filter(f => selectedFiles.has(f.path))
          : files;

      if (initialFilesToRename.length === 0) return;

      // Filter to find files that ACTUALLY change
      const filesToActuallyRename = initialFilesToRename.filter((file, i) => {
          const result = applyRules(file, rules, { index: i, total: initialFilesToRename.length, files: initialFilesToRename });
          return result.newName !== file.originalName;
      });

      if (filesToActuallyRename.length === 0) {
          // No files need renaming
          return;
      }

      if (appSettings.confirmBeforeApply) {
          setConfirmModal({
              isOpen: true,
              count: filesToActuallyRename.length,
              files: filesToActuallyRename
          });
          return;
      }

      executeRename(filesToActuallyRename);
  };

  const executeRename = async (filesToRename: FileInfo[]) => {
      setLoading(true);
      const context = { index: 0, total: filesToRename.length, files: filesToRename };
      
      for (const file of filesToRename) {
          const result = applyRules(file, rules, context);
          if (result.newName !== file.originalName) {
              try {
                  console.log('[Apply] Renaming:', file.path, '->', result.newName);
                  await performRename(file.path, result.newName);
                  file.originalName = result.newName;
                  file.path = file.path.replace(file.originalName, result.newName);
              } catch (e) {
                  console.error("Rename failed", e);
              }
          }
          context.index++;
      }
      setLoading(false);
  };

  const toggleSelectionMode = () => {
      setSelectionMode(!selectionMode);
      if (!selectionMode) {
          setSelectedFiles(new Set(files.map(f => f.path)));
      }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden" style={{ background: '#0d0d12', color: '#e4e4e7' }}>
       
       {/* Mobile Header - only visible on small screens */}
       <div 
         className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-50 lg:hidden"
         style={{ background: 'rgba(20,20,25,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
       >
         <button 
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           className="p-2 rounded-lg"
           style={{ background: '#1e1e26' }}
         >
           {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
         <h1 className="font-bold text-sm flex items-center gap-2">
           <Sparkles size={16} style={{ color: '#8b5cf6' }} />
           <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Renamer</span>
         </h1>
         <button 
           onClick={() => setRightPanelOpen(!rightPanelOpen)}
           className="p-2 rounded-lg"
           style={{ background: '#1e1e26' }}
         >
           <PanelRightClose size={20} />
         </button>
       </div>

       {/* Mobile Menu Overlay */}
       {mobileMenuOpen && (
         <div 
           className="fixed inset-0 z-40 lg:hidden"
           style={{ background: 'rgba(0,0,0,0.5)' }}
           onClick={() => setMobileMenuOpen(false)}
         />
       )}

       {/* Left Pane: Files - Responsive */}
       <div 
         className={`
           fixed lg:relative z-40 lg:z-0
           h-full lg:h-auto
           transition-all duration-300 ease-in-out
           ${mobileMenuOpen ? 'left-0' : '-left-full lg:left-0'}
           ${leftPanelOpen ? 'lg:w-1/4 lg:min-w-[240px] lg:max-w-[320px]' : 'lg:w-0 lg:min-w-0 lg:overflow-hidden'}
         `}
         style={{ 
           background: '#141419', 
           borderRight: '1px solid rgba(255,255,255,0.06)',
           width: mobileMenuOpen ? '280px' : undefined,
           top: '56px',
           height: 'calc(100% - 56px)'
         }}
       >
          <div className="lg:hidden h-full flex flex-col" style={{ paddingTop: '0' }}>
            <div className="flex-1">
              <FileSelector onFilesSelected={handleFilesSelected} />
            </div>
            {/* Mobile Help/Settings Footer */}
            <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                onClick={() => setHelpOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium"
                style={{ background: '#1e1e26', color: '#a1a1aa' }}
              >
                <HelpCircle size={14} /> Help
              </button>
              <button 
                onClick={() => setSettingsOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium"
                style={{ background: '#1e1e26', color: '#a1a1aa' }}
              >
                <Settings size={14} /> Settings
              </button>
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-col lg:h-full">
            <div className="flex-1">
              <FileSelector onFilesSelected={handleFilesSelected} />
            </div>
            {/* Desktop Help/Settings Footer */}
            <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                onClick={() => setHelpOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{ background: '#1e1e26', color: '#a1a1aa' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#262630'}
                onMouseOut={(e) => e.currentTarget.style.background = '#1e1e26'}
              >
                <HelpCircle size={14} /> Help
              </button>
              <button 
                onClick={() => setSettingsOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{ background: '#1e1e26', color: '#a1a1aa' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#262630'}
                onMouseOut={(e) => e.currentTarget.style.background = '#1e1e26'}
              >
                <Settings size={14} /> Settings
              </button>
            </div>
          </div>
       </div>
       
       {/* Center Pane: Preview - Flexible */}
       <div 
         className="flex-1 flex flex-col relative min-w-0"
         style={{ 
           background: '#0d0d12',
           marginTop: '56px'  // Mobile header height
         }}
       >
          {/* Desktop header - hidden on mobile */}
          <header 
            className="h-12 lg:h-14 hidden lg:flex items-center px-3 lg:px-5 justify-between shrink-0"
            style={{ 
              background: 'rgba(20,20,25,0.9)', 
              borderBottom: '1px solid rgba(255,255,255,0.06)', 
              backdropFilter: 'blur(12px)',
              marginTop: '-56px'  // Offset for mobile header
            }}
          >
             <div className="flex items-center gap-2">
               {/* Toggle left panel */}
               <button 
                 onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                 className="p-1.5 rounded-lg transition-colors hidden lg:block"
                 style={{ color: '#71717a' }}
                 title={leftPanelOpen ? 'Hide files panel' : 'Show files panel'}
               >
                 <PanelLeftClose size={16} />
               </button>
               
               <h1 className="font-semibold text-sm flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                     <Sparkles size={14} className="text-white" />
                  </div>
                  <span className="font-bold hidden sm:inline" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Renamer</span>
               </h1>
             </div>
             
             <div className="flex items-center gap-2 lg:gap-3">
                 {/* Selection mode toggle */}
                 <button 
                    onClick={toggleSelectionMode}
                    className="flex items-center gap-1 lg:gap-1.5 text-xs font-medium px-2 lg:px-3 py-1.5 rounded-lg transition-all"
                    style={{ 
                        background: selectionMode ? 'rgba(139,92,246,0.2)' : '#1e1e26',
                        color: selectionMode ? '#a78bfa' : '#71717a',
                        border: selectionMode ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent'
                    }}
                 >
                    {selectionMode ? <CheckSquare size={12} /> : <Square size={12} />}
                    <span className="hidden sm:inline">Selection</span>
                 </button>

                 {/* File count badge */}
                 <div className="text-xs px-2 lg:px-3 py-1 rounded-full hidden sm:block" style={{ background: '#1e1e26', color: '#71717a' }}>
                    {selectionMode && selectedFiles.size > 0 
                        ? `${selectedFiles.size}/${files.length}`
                        : `${files.length} files`
                    }
                 </div>
                 
                 <button 
                    onClick={handleApply} 
                    disabled={loading || files.length === 0 || (selectionMode && selectedFiles.size === 0)} 
                    className="flex items-center gap-1 lg:gap-2 text-white text-xs font-medium px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
                 >
                    <Play size={12} /> <span className="hidden sm:inline">Apply</span>
                 </button>
                 
                 {/* Toggle right panel */}
                 <button 
                   onClick={() => setRightPanelOpen(!rightPanelOpen)}
                   className="p-1.5 rounded-lg transition-colors hidden lg:block"
                   style={{ color: '#71717a' }}
                   title={rightPanelOpen ? 'Hide rules panel' : 'Show rules panel'}
                 >
                   <PanelRightClose size={16} />
                 </button>
             </div>
          </header>
          
          {/* Mobile action bar */}
          <div 
            className="flex lg:hidden items-center justify-between px-3 py-2 shrink-0"
            style={{ background: 'rgba(20,20,25,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button 
              onClick={toggleSelectionMode}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ 
                background: selectionMode ? 'rgba(139,92,246,0.2)' : '#1e1e26',
                color: selectionMode ? '#a78bfa' : '#71717a'
              }}
            >
              {selectionMode ? <CheckSquare size={12} /> : <Square size={12} />}
              {selectionMode ? `${selectedFiles.size} selected` : 'Select'}
            </button>
            
            <button 
              onClick={handleApply} 
              disabled={loading || files.length === 0} 
              className="flex items-center gap-1.5 text-white text-xs font-medium px-4 py-2 rounded-lg disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
            >
              <Play size={12} /> Apply
            </button>
          </div>
          
          {/* Selection toolbar */}
          {selectionMode && files.length > 0 && (
              <div className="px-3 lg:px-5 py-2 flex items-center gap-3 shrink-0" style={{ background: 'rgba(139,92,246,0.05)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                  <span className="text-xs hidden sm:inline" style={{ color: '#71717a' }}>Quick:</span>
                  <button 
                      onClick={selectAllFiles}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: '#a78bfa' }}
                  >
                      All
                  </button>
                  <button 
                      onClick={deselectAllFiles}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: '#a78bfa' }}
                  >
                      None
                  </button>
              </div>
          )}
          
          <div className="flex-1 overflow-auto min-h-0">
             <FileList 
                files={files} 
                rules={rules} 
                selectionMode={selectionMode}
                selectedFiles={selectedFiles}
                onToggleSelection={toggleFileSelection}
             />
          </div>
       </div>
       
       {/* Right Pane: Rules - Responsive */}
       <div 
         className={`
           fixed lg:relative right-0 top-0 z-30 lg:z-0
           h-full
           transition-all duration-300 ease-in-out
           ${rightPanelOpen ? 'translate-x-0 lg:w-1/3 lg:min-w-[280px] lg:max-w-[380px]' : 'translate-x-full lg:translate-x-0 lg:w-0 lg:min-w-0 lg:overflow-hidden'}
         `}
         style={{ 
           background: '#141419', 
           borderLeft: '1px solid rgba(255,255,255,0.06)',
           width: rightPanelOpen ? '320px' : '0',
           maxWidth: '85vw'
         }}
       >
          {/* Close button for mobile */}
          <button 
            className="absolute top-4 left-4 p-2 rounded-lg lg:hidden z-10"
            style={{ background: '#1e1e26' }}
            onClick={() => setRightPanelOpen(false)}
          >
            <X size={16} />
          </button>
          <RuleBuilder rules={rules} onChange={setRules} />
       </div>
       
       {/* Overlay for mobile right panel */}
       {rightPanelOpen && (
         <div 
           className="fixed inset-0 z-20 lg:hidden"
           style={{ background: 'rgba(0,0,0,0.5)' }}
           onClick={() => setRightPanelOpen(false)}
         />
       )}
        {/* Modals */}
        <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
        <SettingsModal 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          settings={appSettings}
          onSettingsChange={setAppSettings}
        />
        <RenameConfirmationModal 
          isOpen={confirmModal.isOpen}
          count={confirmModal.count}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={() => executeRename(confirmModal.files)}
        />
    </div>
  );
}
