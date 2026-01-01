
import { useState } from 'react';
import { Play, Sparkles, CheckSquare, Square } from 'lucide-react';
import { FileSelector } from './components/FileSelector';
import { RuleBuilder } from './components/RuleBuilder';
import { FileList } from './components/FileList';
import { FileInfo, Rule, applyRules } from '@renamer/core';
import { scanFiles, performRename } from './lib/file-system';
import { defaultRules } from './lib/defaultRules';

export default function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleFilesSelected = async (path: string | null) => {
      if (!path) return;
      setLoading(true);
      const scanned = await scanFiles(path, false);
      setFiles(scanned);
      setSelectedFiles(new Set()); // Clear selection when new files loaded
      setLoading(false);
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
      setLoading(true);
      // If selection mode is on, only rename selected files
      const filesToRename = selectionMode && selectedFiles.size > 0
          ? files.filter(f => selectedFiles.has(f.path))
          : files;
      
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
          // When enabling, start with all files selected
          setSelectedFiles(new Set(files.map(f => f.path)));
      }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden" style={{ background: '#0d0d12', color: '#e4e4e7' }}>
       {/* Left Pane: Files */}
       <div className="w-1/4 min-w-[280px] flex flex-col" style={{ background: '#141419', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <FileSelector onFilesSelected={handleFilesSelected} />
       </div>
       
       {/* Center Pane: Preview */}
       <div className="flex-1 flex flex-col relative" style={{ background: '#0d0d12' }}>
          <header className="h-14 flex items-center px-5 justify-between" style={{ background: 'rgba(20,20,25,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
             <h1 className="font-semibold text-sm flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                   <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Renamer</span>
             </h1>
             <div className="flex items-center gap-3">
                 {/* Selection mode toggle */}
                 <button 
                    onClick={toggleSelectionMode}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                    style={{ 
                        background: selectionMode ? 'rgba(139,92,246,0.2)' : '#1e1e26',
                        color: selectionMode ? '#a78bfa' : '#71717a',
                        border: selectionMode ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent'
                    }}
                 >
                    {selectionMode ? <CheckSquare size={12} /> : <Square size={12} />}
                    Selection
                 </button>

                 {/* File count badge */}
                 <div className="text-xs px-3 py-1 rounded-full" style={{ background: '#1e1e26', color: '#71717a' }}>
                    {selectionMode && selectedFiles.size > 0 
                        ? `${selectedFiles.size}/${files.length} selected`
                        : `${files.length} files`
                    }
                 </div>
                 
                 <button 
                    onClick={handleApply} 
                    disabled={loading || files.length === 0 || (selectionMode && selectedFiles.size === 0)} 
                    className="flex items-center gap-2 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
                 >
                    <Play size={12} /> Apply Changes
                 </button>
             </div>
          </header>
          
          {/* Selection toolbar - only show when selection mode is on */}
          {selectionMode && files.length > 0 && (
              <div className="px-5 py-2 flex items-center gap-3" style={{ background: 'rgba(139,92,246,0.05)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                  <span className="text-xs" style={{ color: '#71717a' }}>Quick actions:</span>
                  <button 
                      onClick={selectAllFiles}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: '#a78bfa' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                      Select All
                  </button>
                  <button 
                      onClick={deselectAllFiles}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: '#a78bfa' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                      Deselect All
                  </button>
              </div>
          )}
          
          <div className="flex-1 overflow-auto">
             <FileList 
                files={files} 
                rules={rules} 
                selectionMode={selectionMode}
                selectedFiles={selectedFiles}
                onToggleSelection={toggleFileSelection}
             />
          </div>
       </div>
       
       {/* Right Pane: Rules */}
       <div className="w-1/3 min-w-[340px] max-w-[420px] flex flex-col" style={{ background: '#141419', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <RuleBuilder rules={rules} onChange={setRules} />
       </div>
    </div>
  );
}
