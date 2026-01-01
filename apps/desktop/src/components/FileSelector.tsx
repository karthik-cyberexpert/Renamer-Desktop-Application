
import { useState, useCallback } from 'react';
import { FolderOpen, Upload } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';

interface FileSelectorProps {
    onFilesSelected: (path: string | null) => void;
}

export function FileSelector({ onFilesSelected }: FileSelectorProps) {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleOpen = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                recursive: true
            });
            
            if (selected) {
                setSelectedPath(selected as string);
                onFilesSelected(selected as string);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        const items = e.dataTransfer.items;
        if (items && items.length > 0) {
            const item = items[0];
            const file = item.getAsFile();
            if (file && (file as any).path) {
                const droppedPath = (file as any).path;
                setSelectedPath(droppedPath);
                onFilesSelected(droppedPath);
            }
        }
    }, [onFilesSelected]);
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                 <button 
                    onClick={handleOpen} 
                    className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
                    style={{ 
                        background: '#1e1e26', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#e4e4e7'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#262630'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#1e1e26'}
                 >
                    <FolderOpen size={16} style={{ color: '#8b5cf6' }} /> Open Folder
                 </button>
            </div>
            <div 
                className="flex-1 p-4 text-center text-sm flex flex-col justify-center items-center transition-all duration-200"
                style={{ color: '#a1a1aa' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                 {selectedPath ? (
                     <div className="p-3 rounded-lg" style={{ background: '#1e1e26', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-xs mb-1" style={{ color: '#71717a' }}>Selected folder:</p>
                        <p className="break-all font-medium" style={{ color: '#e4e4e7' }}>{selectedPath}</p>
                     </div>
                 ) : (
                     <div 
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all duration-200"
                        style={{ 
                            borderColor: isDragOver ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                            background: isDragOver ? 'rgba(139,92,246,0.1)' : 'transparent'
                        }}
                     >
                         <div className="p-3 rounded-full transition-colors" style={{ background: isDragOver ? 'rgba(139,92,246,0.2)' : '#1e1e26' }}>
                            <Upload size={24} style={{ color: isDragOver ? '#8b5cf6' : '#71717a' }} />
                         </div>
                         <div>
                            <p className="font-medium mb-1" style={{ color: '#e4e4e7' }}>Drop files here</p>
                            <p className="text-xs" style={{ color: '#71717a' }}>or click Open Folder above</p>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
}
