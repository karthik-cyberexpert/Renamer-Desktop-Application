
import { X, Settings, ToggleLeft, ToggleRight, FolderTree, Palette, Info } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: {
        recursiveScan: boolean;
        showHiddenFiles: boolean;
        confirmBeforeApply: boolean;
    };
    onSettingsChange: (settings: SettingsModalProps['settings']) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
    if (!isOpen) return null;

    const toggleSetting = (key: keyof typeof settings) => {
        onSettingsChange({ ...settings, [key]: !settings[key] });
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6"
                style={{ 
                    background: '#141419',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                            <Settings size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold" style={{ color: '#e4e4e7' }}>Settings</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#71717a' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#1e1e26'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Settings List */}
                <div className="space-y-4">
                    
                    {/* Recursive Scan */}
                    <div 
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors"
                        style={{ background: '#1e1e26' }}
                        onClick={() => toggleSetting('recursiveScan')}
                    >
                        <div className="flex items-center gap-3">
                            <FolderTree size={18} style={{ color: '#8b5cf6' }} />
                            <div>
                                <p className="font-medium text-sm" style={{ color: '#e4e4e7' }}>Recursive Scan</p>
                                <p className="text-xs" style={{ color: '#71717a' }}>Include files from subfolders</p>
                            </div>
                        </div>
                        {settings.recursiveScan ? (
                            <ToggleRight size={28} style={{ color: '#8b5cf6' }} />
                        ) : (
                            <ToggleLeft size={28} style={{ color: '#52525b' }} />
                        )}
                    </div>

                    {/* Show Hidden Files */}
                    <div 
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors"
                        style={{ background: '#1e1e26' }}
                        onClick={() => toggleSetting('showHiddenFiles')}
                    >
                        <div className="flex items-center gap-3">
                            <Palette size={18} style={{ color: '#8b5cf6' }} />
                            <div>
                                <p className="font-medium text-sm" style={{ color: '#e4e4e7' }}>Show Hidden Files</p>
                                <p className="text-xs" style={{ color: '#71717a' }}>Display files starting with dot</p>
                            </div>
                        </div>
                        {settings.showHiddenFiles ? (
                            <ToggleRight size={28} style={{ color: '#8b5cf6' }} />
                        ) : (
                            <ToggleLeft size={28} style={{ color: '#52525b' }} />
                        )}
                    </div>

                    {/* Confirm Before Apply */}
                    <div 
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors"
                        style={{ background: '#1e1e26' }}
                        onClick={() => toggleSetting('confirmBeforeApply')}
                    >
                        <div className="flex items-center gap-3">
                            <Info size={18} style={{ color: '#8b5cf6' }} />
                            <div>
                                <p className="font-medium text-sm" style={{ color: '#e4e4e7' }}>Confirm Before Apply</p>
                                <p className="text-xs" style={{ color: '#71717a' }}>Show confirmation dialog</p>
                            </div>
                        </div>
                        {settings.confirmBeforeApply ? (
                            <ToggleRight size={28} style={{ color: '#8b5cf6' }} />
                        ) : (
                            <ToggleLeft size={28} style={{ color: '#52525b' }} />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-center text-xs" style={{ color: '#52525b' }}>
                        Renamer v1.0.0 • Made with ❤️
                    </div>
                </div>
            </div>
        </>
    );
}
