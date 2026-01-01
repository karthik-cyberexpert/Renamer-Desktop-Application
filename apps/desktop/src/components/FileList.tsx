
import { Rule, FileInfo, applyRules } from '@renamer/core';
import { FileText, ArrowRight, Check } from 'lucide-react';

interface FileListProps {
    files: FileInfo[];
    rules: Rule[];
    selectionMode?: boolean;
    selectedFiles?: Set<string>;
    onToggleSelection?: (filePath: string) => void;
}

export function FileList({ files, rules, selectionMode, selectedFiles, onToggleSelection }: FileListProps) {
    return (
        <div className="h-full">
            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4" style={{ color: '#71717a' }}>
                    <FileText size={48} className="mb-4 opacity-30" />
                    <p className="text-sm text-center">No files selected</p>
                    <p className="text-xs mt-1 text-center">Open a folder to get started</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[400px]">
                        <thead style={{ 
                            background: 'rgba(30,30,38,0.9)', 
                            backdropFilter: 'blur(8px)',
                            position: 'sticky',
                            top: 0
                        }}>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {selectionMode && (
                                    <th className="px-2 lg:px-3 py-3 w-8 lg:w-10"></th>
                                )}
                                <th className="px-3 lg:px-5 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#71717a' }}>Original</th>
                                <th className="px-1 lg:px-2 py-3 w-6 lg:w-8"></th>
                                <th className="px-3 lg:px-5 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#71717a' }}>New Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file, i) => {
                                const result = applyRules(file, rules, { index: i, total: files.length, files });
                                const changed = result.newName !== file.originalName;
                                const isSelected = selectedFiles?.has(file.path) ?? false;
                                
                                return (
                                    <tr 
                                        key={i} 
                                        className="transition-colors cursor-pointer active:bg-white/5"
                                        style={{ 
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            background: selectionMode && isSelected ? 'rgba(139,92,246,0.08)' : 'transparent'
                                        }}
                                        onClick={() => selectionMode && onToggleSelection?.(file.path)}
                                        onMouseOver={(e) => e.currentTarget.style.background = selectionMode && isSelected ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = selectionMode && isSelected ? 'rgba(139,92,246,0.08)' : 'transparent'}
                                    >
                                        {selectionMode && (
                                            <td className="px-2 lg:px-3 py-2 lg:py-3">
                                                <div 
                                                    className="w-4 h-4 lg:w-5 lg:h-5 rounded flex items-center justify-center transition-colors"
                                                    style={{ 
                                                        background: isSelected ? '#8b5cf6' : 'transparent',
                                                        border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.2)'
                                                    }}
                                                >
                                                    {isSelected && <Check size={10} className="text-white" />}
                                                </div>
                                            </td>
                                        )}
                                        <td 
                                            className="px-3 lg:px-5 py-2 lg:py-3 font-mono text-xs max-w-[120px] lg:max-w-[200px] truncate" 
                                            style={{ 
                                                color: selectionMode && !isSelected ? '#52525b' : '#a1a1aa',
                                                textDecoration: selectionMode && !isSelected ? 'line-through' : 'none'
                                            }} 
                                            title={file.originalName}
                                        >
                                            {file.originalName}
                                        </td>
                                        <td className="px-1 lg:px-2 py-2 lg:py-3">
                                            {changed && (!selectionMode || isSelected) && (
                                                <ArrowRight size={12} style={{ color: '#8b5cf6' }} />
                                            )}
                                        </td>
                                        <td 
                                            className="px-3 lg:px-5 py-2 lg:py-3 font-mono text-xs max-w-[120px] lg:max-w-[200px] truncate" 
                                            style={{ 
                                                color: selectionMode && !isSelected 
                                                    ? '#52525b' 
                                                    : (changed ? '#06b6d4' : '#71717a'), 
                                                fontWeight: changed && (!selectionMode || isSelected) ? 500 : 400,
                                                textDecoration: selectionMode && !isSelected ? 'line-through' : 'none'
                                            }} 
                                            title={result.newName}
                                        >
                                            {result.newName}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
