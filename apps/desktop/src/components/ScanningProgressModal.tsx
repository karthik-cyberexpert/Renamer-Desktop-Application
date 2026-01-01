
import { Loader2, FolderOpen, FileCheck } from 'lucide-react';

interface ScanningProgressModalProps {
    isOpen: boolean;
    folderName: string;
    fileCount: number;
}

export function ScanningProgressModal({ isOpen, folderName, fileCount }: ScanningProgressModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-[80]"
                style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-[2rem] p-8 text-center"
                style={{ 
                    background: 'linear-gradient(145deg, #141419 0%, #0d0d12 100%)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 0 60px rgba(139,92,246,0.15)'
                }}
            >
                {/* Animation Container */}
                <div className="relative mb-8 inline-block">
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20 animate-spin-slow" />
                    <div className="absolute inset-[-8px] rounded-full border border-blue-500/10 animate-reverse-spin" />
                    
                    <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10" style={{ background: 'rgba(139,92,246,0.1)' }}>
                        <Loader2 size={48} className="text-purple-500 animate-spin" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Scanning Files...</h2>
                    
                    <div className="flex flex-col gap-2 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-3 text-left">
                            <FolderOpen size={18} className="text-blue-400" />
                            <span className="text-sm font-medium text-gray-300 truncate flex-1">{folderName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                            <FileCheck size={18} className="text-green-400" />
                            <span className="text-sm font-medium text-gray-300">
                                <span className="text-white text-lg font-bold tabular-nums">{fileCount.toLocaleString()}</span> files found
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 animate-pulse uppercase tracking-widest font-semibold pt-2">
                        Processing Deep Folders
                    </p>
                </div>
            </div>
        </>
    );
}
