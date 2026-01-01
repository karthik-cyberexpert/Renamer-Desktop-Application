
import { FolderSearch, X, Zap, ArrowRight, SkipForward } from 'lucide-react';

interface LargeFolderModalProps {
    isOpen: boolean;
    folderName: string;
    onClose: () => void;
    onContinue: (recursive: boolean) => void;
}

export function LargeFolderModal({ isOpen, folderName, onClose, onContinue }: LargeFolderModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-[60]"
                style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-0 overflow-hidden"
                style={{ 
                    background: '#141419',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header/Banner */}
                <div className="p-6 pb-0 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <FolderSearch size={32} className="text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">Large Folder Detected</h2>
                    <p className="text-sm text-gray-400 px-4">
                        <span className="text-blue-400 font-medium">"{folderName}"</span> contains a large number of items. Scanning everything might take some time.
                    </p>
                </div>

                {/* Options List */}
                <div className="p-6 space-y-3">
                    <button 
                        onClick={() => {
                            onContinue(true);
                            onClose();
                        }}
                        className="w-full group p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                        style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white flex items-center gap-2">
                                <Zap size={16} className="text-blue-500" /> Full Recursive Scan
                            </span>
                            <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-gray-400 italic">Recommended if you need to rename files in subfolders. Progress bar will be shown.</p>
                    </button>

                    <button 
                        onClick={() => {
                            onContinue(false);
                            onClose();
                        }}
                        className="w-full group p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                        style={{ background: '#1e1e26', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white flex items-center gap-2">
                                <SkipForward size={16} className="text-gray-400" /> Continue without subfolders
                            </span>
                            <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-gray-500 italic">Only scan files in the main directory. Skips all subfolders for speed.</p>
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Cancel Scanning
                    </button>
                </div>
            </div>
        </>
    );
}
